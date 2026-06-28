/* ============================================================
   VELORA — Enterprise Database Schema
   ============================================================
   Designed for PostgreSQL 16+
   Supports: Cities, Transport Operators, Scale to 10M+ users
   ============================================================ */

-- ═══════════════════════════════════════════════════════════
-- EXTENSIONS
-- ═══════════════════════════════════════════════════════════
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ═══════════════════════════════════════════════════════════
-- ENUMS
-- ═══════════════════════════════════════════════════════════
CREATE TYPE user_role AS ENUM ('passenger', 'operator', 'admin', 'government', 'emergency', 'system');
CREATE TYPE transport_mode AS ENUM ('metro', 'bus', 'rickshaw', 'cab', 'walking', 'cycling', 'ev');
CREATE TYPE vehicle_status AS ENUM ('active', 'in-service', 'maintenance', 'offline', 'emergency');
CREATE TYPE incident_severity AS ENUM ('critical', 'major', 'moderate', 'minor', 'info');
CREATE TYPE incident_status AS ENUM ('reported', 'verified', 'responding', 'resolved', 'closed');
CREATE TYPE journey_status AS ENUM ('planned', 'in-progress', 'completed', 'cancelled', 'delayed');
CREATE TYPE notification_channel AS ENUM ('push', 'email', 'sms', 'in-app', 'whatsapp');
CREATE TYPE report_type AS ENUM ('overcrowding', 'road-damage', 'broken-stop', 'unsafe-area', 'accident', 'delay', 'other');

-- ═══════════════════════════════════════════════════════════
-- USERS & AUTHENTICATION
-- ═══════════════════════════════════════════════════════════

CREATE TABLE cities (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) NOT NULL,
    code            VARCHAR(10) UNIQUE NOT NULL,
    country         VARCHAR(100) NOT NULL,
    timezone        VARCHAR(50) NOT NULL DEFAULT 'UTC',
    lat             DOUBLE PRECISION NOT NULL,
    lng             DOUBLE PRECISION NOT NULL,
    zoom_level      INTEGER DEFAULT 12,
    is_active       BOOLEAN DEFAULT true,
    settings        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    version         INTEGER DEFAULT 1
);

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           CITEXT UNIQUE,
    phone           VARCHAR(20) UNIQUE,
    password_hash   VARCHAR(255),
    name            VARCHAR(100) NOT NULL,
    avatar_url      VARCHAR(500),
    role            user_role NOT NULL DEFAULT 'passenger',
    city_id         UUID REFERENCES cities(id),
    is_verified     BOOLEAN DEFAULT false,
    is_active       BOOLEAN DEFAULT true,
    preferences     JSONB DEFAULT '{
        "language": "en",
        "transport_mode": "transit",
        "accessibility": false,
        "avoid_crowds": false,
        "notifications": true,
        "share_live_location": false,
        "theme": "dark"
    }',
    metadata        JSONB DEFAULT '{}',
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    version         INTEGER DEFAULT 1
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_phone ON users(phone) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_city ON users(city_id);
CREATE INDEX idx_users_role ON users(role);

CREATE TABLE user_sessions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token   VARCHAR(500) NOT NULL,
    device_name     VARCHAR(100),
    device_type     VARCHAR(50),
    ip_address      INET,
    user_agent      TEXT,
    is_active       BOOLEAN DEFAULT true,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activity   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON user_sessions(user_id, is_active);
CREATE INDEX idx_sessions_expiry ON user_sessions(expires_at);
CREATE INDEX idx_sessions_token ON user_sessions(refresh_token);

CREATE TABLE login_attempts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    identifier      VARCHAR(255) NOT NULL,
    ip_address      INET NOT NULL,
    success         BOOLEAN NOT NULL,
    failure_reason  VARCHAR(100),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_login_attempts ON login_attempts(identifier, created_at DESC);

CREATE TABLE trusted_contacts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    contact_name    VARCHAR(100) NOT NULL,
    contact_phone   VARCHAR(20),
    relationship    VARCHAR(50),
    is_emergency    BOOLEAN DEFAULT false,
    can_track       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trusted_contacts_user ON trusted_contacts(user_id);

-- ═══════════════════════════════════════════════════════════
-- TRANSPORT INFRASTRUCTURE
-- ═══════════════════════════════════════════════════════════

CREATE TABLE stops (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id         UUID NOT NULL REFERENCES cities(id),
    name            VARCHAR(200) NOT NULL,
    code            VARCHAR(20),
    lat             DOUBLE PRECISION NOT NULL,
    lng             DOUBLE PRECISION NOT NULL,
    location        GEOGRAPHY(POINT, 4326),
    stop_type       VARCHAR(50) DEFAULT 'bus',
    is_active       BOOLEAN DEFAULT true,
    accessibility   BOOLEAN DEFAULT false,
    facilities      JSONB DEFAULT '[]',
    capacity        INTEGER,
    shelter         BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    version         INTEGER DEFAULT 1
);

CREATE INDEX idx_stops_location ON stops USING GIST(location);
CREATE INDEX idx_stops_city ON stops(city_id);
CREATE INDEX idx_stops_active ON stops(city_id, is_active);

CREATE TABLE routes (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id         UUID NOT NULL REFERENCES cities(id),
    name            VARCHAR(200) NOT NULL,
    code            VARCHAR(20) UNIQUE NOT NULL,
    mode            transport_mode NOT NULL,
    color           VARCHAR(7) DEFAULT '#E8A020',
    description     TEXT,
    total_distance  DOUBLE PRECISION,
    estimated_time  INTEGER, -- minutes
    is_active       BOOLEAN DEFAULT true,
    schedule        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    version         INTEGER DEFAULT 1
);

CREATE INDEX idx_routes_city ON routes(city_id, is_active);

CREATE TABLE route_stops (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id        UUID NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
    stop_id         UUID NOT NULL REFERENCES stops(id) ON DELETE CASCADE,
    stop_order      INTEGER NOT NULL,
    distance_from_prev DOUBLE PRECISION,
    time_from_prev  INTEGER, -- seconds
    is_terminus     BOOLEAN DEFAULT false,
    UNIQUE(route_id, stop_order)
);

CREATE INDEX idx_route_stops_route ON route_stops(route_id, stop_order);

CREATE TABLE vehicles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id         UUID NOT NULL REFERENCES cities(id),
    route_id        UUID REFERENCES routes(id),
    name            VARCHAR(100) NOT NULL,
    registration    VARCHAR(50) UNIQUE NOT NULL,
    mode            transport_mode NOT NULL,
    capacity        INTEGER NOT NULL,
    status          vehicle_status NOT NULL DEFAULT 'active',
    driver_name     VARCHAR(100),
    driver_contact  VARCHAR(20),
    lat             DOUBLE PRECISION,
    lng             DOUBLE PRECISION,
    location        GEOGRAPHY(POINT, 4326),
    heading         DOUBLE PRECISION,
    speed           DOUBLE PRECISION,
    occupancy       INTEGER DEFAULT 0,
    last_updated    TIMESTAMPTZ,
    health_score    INTEGER CHECK (health_score >= 0 AND health_score <= 100),
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    version         INTEGER DEFAULT 1
);

CREATE INDEX idx_vehicles_location ON vehicles USING GIST(location);
CREATE INDEX idx_vehicles_route ON vehicles(route_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_city ON vehicles(city_id, status);

CREATE TABLE vehicle_maintenance (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id      UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    type            VARCHAR(100) NOT NULL,
    description     TEXT,
    scheduled_date  DATE NOT NULL,
    completed_date  DATE,
    cost            DECIMAL(12,2),
    status          VARCHAR(20) DEFAULT 'scheduled',
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_maintenance_vehicle ON vehicle_maintenance(vehicle_id, status);
CREATE INDEX idx_maintenance_schedule ON vehicle_maintenance(scheduled_date);

-- ═══════════════════════════════════════════════════════════
-- JOURNEYS & BOOKINGS
-- ═══════════════════════════════════════════════════════════

CREATE TABLE journeys (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    from_stop_id    UUID REFERENCES stops(id),
    to_stop_id      UUID REFERENCES stops(id),
    from_name       VARCHAR(200) NOT NULL,
    to_name         VARCHAR(200) NOT NULL,
    status          journey_status NOT NULL DEFAULT 'planned',
    planned_departure TIMESTAMPTZ,
    planned_arrival   TIMESTAMPTZ,
    actual_departure  TIMESTAMPTZ,
    actual_arrival    TIMESTAMPTZ,
    duration_minutes  INTEGER,
    distance_meters   DOUBLE PRECISION,
    fare            DECIMAL(10,2),
    carbon_g        DOUBLE PRECISION,
    route_data      JSONB, -- full route details
    preferences     JSONB DEFAULT '{}',
    is_favorite     BOOLEAN DEFAULT false,
    is_recurring    BOOLEAN DEFAULT false,
    rating          INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback        TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    version         INTEGER DEFAULT 1
);

CREATE INDEX idx_journeys_user ON journeys(user_id, created_at DESC);
CREATE INDEX idx_journeys_status ON journeys(status);
CREATE INDEX idx_journeys_date ON journeys(planned_departure);

CREATE TABLE journey_legs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id      UUID NOT NULL REFERENCES journeys(id) ON DELETE CASCADE,
    leg_order       INTEGER NOT NULL,
    mode            transport_mode NOT NULL,
    from_stop_id    UUID REFERENCES stops(id),
    to_stop_id      UUID REFERENCES stops(id),
    from_name       VARCHAR(200),
    to_name         VARCHAR(200),
    vehicle_id      UUID REFERENCES vehicles(id),
    route_id        UUID REFERENCES routes(id),
    distance_meters DOUBLE PRECISION,
    duration_minutes INTEGER,
    fare            DECIMAL(10,2),
    carbon_g        DOUBLE PRECISION,
    UNIQUE(journey_id, leg_order)
);

CREATE INDEX idx_journey_legs ON journey_legs(journey_id);

CREATE TABLE saved_places (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    address         VARCHAR(500),
    lat             DOUBLE PRECISION NOT NULL,
    lng             DOUBLE PRECISION NOT NULL,
    place_type      VARCHAR(50) DEFAULT 'custom',
    is_home         BOOLEAN DEFAULT false,
    is_work         BOOLEAN DEFAULT false,
    icon            VARCHAR(50),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_saved_places_user ON saved_places(user_id);

CREATE TABLE recent_searches (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    query           VARCHAR(500) NOT NULL,
    result_type     VARCHAR(50),
    result_id       UUID,
    searched_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recent_searches_user ON recent_searches(user_id, searched_at DESC);

-- ═══════════════════════════════════════════════════════════
-- REAL-TIME & INTELLIGENCE
-- ═══════════════════════════════════════════════════════════

CREATE TABLE traffic_data (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id         UUID NOT NULL REFERENCES cities(id),
    segment_id      VARCHAR(100),
    lat             DOUBLE PRECISION NOT NULL,
    lng             DOUBLE PRECISION NOT NULL,
    congestion      INTEGER CHECK (congestion >= 0 AND congestion <= 100),
    avg_speed       DOUBLE PRECISION,
    vehicle_count   INTEGER,
    recorded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_traffic_time ON traffic_data(city_id, recorded_at DESC);
CREATE INDEX idx_traffic_location ON traffic_data USING GIST(ST_SetSRID(ST_MakePoint(lng, lat), 4326));

CREATE TABLE weather_data (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id         UUID NOT NULL REFERENCES cities(id),
    condition       VARCHAR(50) NOT NULL,
    temperature     DOUBLE PRECISION,
    feels_like      DOUBLE PRECISION,
    humidity        INTEGER,
    wind_speed      DOUBLE PRECISION,
    visibility      DOUBLE PRECISION,
    icon            VARCHAR(20),
    forecast        JSONB,
    recorded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_weather_city ON weather_data(city_id, recorded_at DESC);

CREATE TABLE incidents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id         UUID NOT NULL REFERENCES cities(id),
    type            VARCHAR(50) NOT NULL,
    severity        incident_severity NOT NULL DEFAULT 'moderate',
    title           VARCHAR(300) NOT NULL,
    description     TEXT,
    location_name   VARCHAR(200),
    lat             DOUBLE PRECISION,
    lng             DOUBLE PRECISION,
    status          incident_status NOT NULL DEFAULT 'reported',
    reported_by     UUID REFERENCES users(id),
    assigned_to     UUID REFERENCES users(id),
    resolved_at     TIMESTAMPTZ,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_incidents_status ON incidents(city_id, status, severity);
CREATE INDEX idx_incidents_location ON incidents USING GIST(ST_SetSRID(ST_MakePoint(lng, lat), 4326));
CREATE INDEX idx_incidents_active ON incidents(status) WHERE status NOT IN ('resolved', 'closed');

CREATE TABLE crowd_data (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stop_id         UUID REFERENCES stops(id),
    vehicle_id      UUID REFERENCES vehicles(id),
    location_name   VARCHAR(200),
    lat             DOUBLE PRECISION NOT NULL,
    lng             DOUBLE PRECISION NOT NULL,
    density         INTEGER CHECK (density >= 0 AND density <= 100),
    capacity_used   INTEGER,
    recorded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_crowd_location ON crowd_data USING GIST(ST_SetSRID(ST_MakePoint(lng, lat), 4326));
CREATE INDEX idx_crowd_time ON crowd_data(recorded_at DESC);

-- ═══════════════════════════════════════════════════════════
-- AI & PREDICTIONS
-- ═══════════════════════════════════════════════════════════

CREATE TABLE ai_predictions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id         UUID NOT NULL REFERENCES cities(id),
    prediction_type VARCHAR(50) NOT NULL, -- demand, traffic, crowd, fleet
    data            JSONB NOT NULL,
    confidence      DOUBLE PRECISION CHECK (confidence >= 0 AND confidence <= 1),
    model_version   VARCHAR(50),
    valid_from      TIMESTAMPTZ NOT NULL,
    valid_until     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_predictions_type ON ai_predictions(city_id, prediction_type, valid_from DESC);

CREATE TABLE ai_conversations (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    context         JSONB DEFAULT '{}',
    message_count   INTEGER DEFAULT 0,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id, created_at DESC);

CREATE TABLE ai_messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role            VARCHAR(10) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content         TEXT NOT NULL,
    confidence      DOUBLE PRECISION,
    suggestions     JSONB DEFAULT '[]',
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ai_messages_conv ON ai_messages(conversation_id, created_at);

-- ═══════════════════════════════════════════════════════════
-- NOTIFICATIONS
-- ═══════════════════════════════════════════════════════════

CREATE TABLE notifications (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    message         TEXT NOT NULL,
    type            VARCHAR(50) DEFAULT 'info',
    channel         notification_channel DEFAULT 'in-app',
    reference_type  VARCHAR(50),
    reference_id    UUID,
    is_read         BOOLEAN DEFAULT false,
    is_urgent       BOOLEAN DEFAULT false,
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_urgent ON notifications(user_id, is_urgent, is_read) WHERE NOT is_read;

CREATE TABLE notification_preferences (
    user_id         UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    push_enabled    BOOLEAN DEFAULT true,
    email_enabled   BOOLEAN DEFAULT false,
    sms_enabled     BOOLEAN DEFAULT false,
    route_changes   BOOLEAN DEFAULT true,
    weather_alerts  BOOLEAN DEFAULT true,
    safety_alerts   BOOLEAN DEFAULT true,
    promotions      BOOLEAN DEFAULT false,
    journey_reminders BOOLEAN DEFAULT true,
    quiet_hours_start TIME,
    quiet_hours_end   TIME,
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- COMMUNITY & REPORTS
-- ═══════════════════════════════════════════════════════════

CREATE TABLE community_reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    city_id         UUID NOT NULL REFERENCES cities(id),
    report_type     report_type NOT NULL,
    title           VARCHAR(300) NOT NULL,
    description     TEXT,
    location_name   VARCHAR(200),
    lat             DOUBLE PRECISION,
    lng             DOUBLE PRECISION,
    media_urls      JSONB DEFAULT '[]',
    status          VARCHAR(20) DEFAULT 'pending',
    votes           INTEGER DEFAULT 0,
    moderated_by    UUID REFERENCES users(id),
    moderated_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    version         INTEGER DEFAULT 1
);

CREATE INDEX idx_reports_status ON community_reports(city_id, status, created_at DESC);
CREATE INDEX idx_reports_user ON community_reports(user_id);
CREATE INDEX idx_reports_type ON community_reports(report_type);

CREATE TABLE report_votes (
    report_id       UUID NOT NULL REFERENCES community_reports(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id),
    vote            SMALLINT NOT NULL CHECK (vote IN (-1, 1)),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (report_id, user_id)
);

-- ═══════════════════════════════════════════════════════════
-- SAFETY & EMERGENCY
-- ═══════════════════════════════════════════════════════════

CREATE TABLE emergency_alerts (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    alert_type      VARCHAR(50) NOT NULL,
    status          VARCHAR(20) DEFAULT 'active',
    lat             DOUBLE PRECISION NOT NULL,
    lng             DOUBLE PRECISION NOT NULL,
    location_name   VARCHAR(200),
    description     TEXT,
    contacted_authorities BOOLEAN DEFAULT false,
    contacted_contacts     BOOLEAN DEFAULT false,
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_emergency_active ON emergency_alerts(status) WHERE status = 'active';
CREATE INDEX idx_emergency_user ON emergency_alerts(user_id, created_at DESC);

CREATE TABLE live_shares (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    contact_id      UUID REFERENCES trusted_contacts(id),
    journey_id      UUID REFERENCES journeys(id),
    share_token     VARCHAR(100) UNIQUE NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_live_shares_token ON live_shares(share_token);
CREATE INDEX idx_live_shares_user ON live_shares(user_id, is_active);

-- ═══════════════════════════════════════════════════════════
-- CARBON & REWARDS
-- ═══════════════════════════════════════════════════════════

CREATE TABLE carbon_records (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    journey_id      UUID REFERENCES journeys(id),
    carbon_saved_g  DOUBLE PRECISION NOT NULL,
    mode            transport_mode,
    distance_m      DOUBLE PRECISION,
    recorded_date   DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_carbon_user ON carbon_records(user_id, recorded_date DESC);
CREATE INDEX idx_carbon_date ON carbon_records(recorded_date);

CREATE TABLE reward_points (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id),
    points          INTEGER NOT NULL,
    reason          VARCHAR(200) NOT NULL,
    reference_type  VARCHAR(50),
    reference_id    UUID,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rewards_user ON reward_points(user_id, created_at DESC);

-- ═══════════════════════════════════════════════════════════
-- GOVERNMENT & ANALYTICS
-- ═══════════════════════════════════════════════════════════

CREATE TABLE fleet_analytics (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id         UUID NOT NULL REFERENCES cities(id),
    recorded_date   DATE NOT NULL DEFAULT CURRENT_DATE,
    active_vehicles INTEGER,
    on_time_rate    DOUBLE PRECISION,
    avg_occupancy   DOUBLE PRECISION,
    revenue         DECIMAL(14,2),
    complaints      INTEGER,
    incidents       INTEGER,
    passenger_satisfaction DOUBLE PRECISION,
    data            JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(city_id, recorded_date)
);

CREATE INDEX idx_fleet_analytics_city ON fleet_analytics(city_id, recorded_date DESC);

-- ═══════════════════════════════════════════════════════════
-- AUDIT & LOGGING
-- ═══════════════════════════════════════════════════════════

CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID REFERENCES users(id),
    action          VARCHAR(100) NOT NULL,
    entity_type     VARCHAR(50),
    entity_id       UUID,
    old_values      JSONB,
    new_values      JSONB,
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_action ON audit_logs(action, created_at DESC);
CREATE INDEX idx_audit_time ON audit_logs(created_at);

CREATE TABLE error_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service         VARCHAR(100) NOT NULL,
    error_type      VARCHAR(100),
    error_message   TEXT,
    stack_trace     TEXT,
    request_path    VARCHAR(500),
    request_method  VARCHAR(10),
    request_id      VARCHAR(100),
    user_id         UUID REFERENCES users(id),
    metadata        JSONB DEFAULT '{}',
    severity        VARCHAR(20) DEFAULT 'error',
    is_resolved     BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_error_logs_service ON error_logs(service, created_at DESC);
CREATE INDEX idx_error_logs_severity ON error_logs(severity, created_at DESC);

-- ═══════════════════════════════════════════════════════════
-- CONFIGURATION & FEATURE FLAGS
-- ═══════════════════════════════════════════════════════════

CREATE TABLE system_config (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city_id         UUID REFERENCES cities(id),
    key             VARCHAR(100) NOT NULL,
    value           JSONB NOT NULL,
    description     TEXT,
    is_encrypted    BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(city_id, key)
);

CREATE TABLE feature_flags (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name            VARCHAR(100) UNIQUE NOT NULL,
    description     TEXT,
    enabled         BOOLEAN DEFAULT false,
    rollout_percent INTEGER DEFAULT 100,
    city_ids        UUID[],
    user_ids        UUID[],
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════════
-- TRIGGERS: Auto-update updated_at
-- ═══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    NEW.version = OLD.version + 1;
    IF NEW.version > 1 AND OLD.version IS DISTINCT FROM (NEW.version - 1) THEN
        RAISE EXCEPTION 'Optimistic lock conflict: row version % does not match expected version %', OLD.version, NEW.version - 1
        USING HINT = 'Reload the data and retry the operation';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_journeys_updated_at BEFORE UPDATE ON journeys
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_stops_updated_at BEFORE UPDATE ON stops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_routes_updated_at BEFORE UPDATE ON routes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_incidents_updated_at BEFORE UPDATE ON incidents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════
-- FUNCTIONS: Auto-cleanup expired sessions
-- ═══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM user_sessions WHERE expires_at < NOW() - INTERVAL '1 day';
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Schedule: Run every hour (via application-level scheduler or pg_cron)
-- SELECT cron.schedule('cleanup-sessions', '0 * * * *', $$SELECT cleanup_expired_sessions()$$);
-- Note: Requires pg_cron extension. Uncomment when extension is installed.
