# VELORA API Specification v1.0.0

**Base URL:** `https://api.velora.city/v1`  
**Content-Type:** `application/json`  
**Authentication:** Bearer JWT  

---

## Standard Response Format

### Success
```json
{
  "status": "success",
  "data": { ... },
  "meta": {
    "request_id": "req_abc123",
    "timestamp": "2026-06-29T10:30:00Z",
    "version": "1.0.0"
  }
}
```

### Error
```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable description",
    "details": [ ... ],
    "request_id": "req_abc123"
  }
}
```

### Pagination
```json
{
  "status": "success",
  "data": [ ... ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 142,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## Authentication

### POST /auth/login
Authenticate user with email/password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "secure_password",
  "device_name": "Chrome on Windows",
  "device_type": "web"
}
```

**Response:**
```json
{
  "access_token": "eyJhbG...",
  "refresh_token": "eyJhbG...",
  "expires_in": 3600,
  "user": { ... }
}
```

### POST /auth/refresh
Refresh access token.

**Request:**
```json
{
  "refresh_token": "eyJhbG..."
}
```

### POST /auth/logout
Invalidate session.

### POST /auth/register
Create new user account.

### POST /auth/password-reset
Request password reset email.

### POST /auth/password-reset/confirm
Confirm password reset with token.

**Error Codes:**
- `INVALID_CREDENTIALS` (401)
- `ACCOUNT_LOCKED` (423)
- `TOO_MANY_ATTEMPTS` (429)
- `TOKEN_EXPIRED` (401)
- `SESSION_EXPIRED` (401)

---

## Users

### GET /users/me
Get current user profile.

### PATCH /users/me
Update user profile.

### GET /users/me/preferences
Get user preferences.

### PATCH /users/me/preferences
Update user preferences.

---

## Journeys

### POST /journeys/plan
Plan a journey with AI optimization.

**Query Parameters:**
| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `from` | string | yes | Origin location |
| `to` | string | yes | Destination |
| `departure_time` | ISO8601 | no | Default: now |
| `arrival_time` | ISO8601 | no | Alternative to departure |
| `mode` | enum | no | Transport preference |
| `preferences` | object | no | Accessibility, safety, budget |

**Response:**
```json
{
  "routes": [
    {
      "id": "route_001",
      "type": "fastest",
      "total_duration_minutes": 24,
      "total_fare": 20,
      "total_distance_m": 5200,
      "carbon_g": 180,
      "confidence": 0.94,
      "legs": [
        {
          "mode": "metro",
          "from": "Lajpat Nagar",
          "to": "Central Station",
          "duration_minutes": 12,
          "fare": 15
        }
      ]
    }
  ]
}
```

**Error Codes:**
- `NO_ROUTES_FOUND` (404)
- `INVALID_LOCATION` (400)
- `AI_TIMEOUT` (503)

### GET /journeys
Get user's journey history.

### GET /journeys/{id}
Get journey details.

### POST /journeys/{id}/start
Start a journey.

### POST /journeys/{id}/complete
Complete a journey.

### POST /journeys/{id}/cancel
Cancel a journey.

---

## Live Tracking

### WebSocket /ws/tracking
Real-time vehicle and journey tracking.

**Subscribe:**
```json
{
  "type": "subscribe",
  "channels": ["fleet:all", "traffic:city_001", "incidents:city_001"]
}
```

**Event:**
```json
{
  "type": "vehicle_update",
  "data": {
    "vehicle_id": "veh_001",
    "lat": 28.6139,
    "lng": 77.2090,
    "heading": 45.0,
    "speed": 35.2,
    "occupancy": 67
  },
  "timestamp": "2026-06-29T10:30:00Z"
}
```

### GET /vehicles
Get all active vehicles.

### GET /vehicles/{id}
Get vehicle details.

### GET /stops
Get all stops.

### GET /stops/{id}
Get stop details with upcoming vehicles.

---

## Traffic & Intelligence

### GET /traffic/current
Get current traffic conditions.

### GET /traffic/predict?lat=...&lng=...
Get AI traffic prediction.

### GET /weather/current
Get current weather.

### GET /weather/forecast
Get weather forecast.

---

## Incidents & Safety

### GET /incidents
Get active incidents.

### POST /incidents
Report an incident.

### POST /emergency/sos
Trigger emergency SOS.

**Request:**
```json
{
  "lat": 28.6139,
  "lng": 77.2090,
  "alert_type": "medical",
  "description": "Passenger needs medical assistance"
}
```

---

## Community

### GET /reports
Get community reports.

### POST /reports
Submit a community report.

### POST /reports/{id}/vote
Upvote/downvote a report.

---

## Notifications

### GET /notifications
Get user notifications.

### PATCH /notifications/{id}/read
Mark notification as read.

### PATCH /notifications/read-all
Mark all as read.

---

## Analytics

### GET /analytics/dashboard
Get city-wide analytics.

### GET /analytics/carbon
Get carbon savings analytics.

### GET /analytics/fleet
Get fleet performance metrics.

---

## Rate Limiting

| Tier | Limit | Window |
|------|-------|--------|
| Public | 100 req/min | 1 minute |
| Authenticated | 1000 req/min | 1 minute |
| AI endpoints | 30 req/min | 1 minute |
| Emergency SOS | 5 req/min | 1 minute |

**Headers:**
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1624964400
```

---

## Error Codes (Standard)

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |
| `AI_UNAVAILABLE` | 503 | AI service not responding |

---

## WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `vehicle.update` | server | Vehicle location/status change |
| `traffic.update` | server | Traffic condition change |
| `incident.new` | server | New incident reported |
| `incident.update` | server | Incident status change |
| `journey.update` | server | User's journey status change |
| `notification.new` | server | New notification for user |
| `weather.update` | server | Weather condition change |
| `prediction.update` | server | AI prediction updated |
