/* ============================================================
   VELORA — Application Orchestrator
   ============================================================ */

import router from './router.js';
import store from './store.js';
import { renderLandingPage } from './features/landing.js';
import { renderDashboardPage } from './features/dashboard.js';
import { renderJourneyPlannerPage } from './features/journey-planner.js';
import { renderLiveMapPage } from './features/live-map.js';
import { renderAIAssistantPage } from './features/ai-assistant.js';
import { renderDigitalTwinPage } from './features/digital-twin.js';
import { renderAdminPage } from './features/admin.js';
import { renderAnalyticsPage } from './features/analytics.js';
import { renderCommunityPage } from './features/community.js';
import { renderSafetyPage } from './features/safety.js';
import { renderSettingsPage } from './features/settings.js';
import { renderAuthPage } from './features/auth.js';
import { renderCarbonTrackerPage } from './features/carbon-tracker.js';
import { renderNotificationsPage } from './features/notifications.js';
import { renderEmergencyPage } from './features/emergency.js';

class App {
  constructor() {
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    // Register all routes
    router.register('landing', () => renderLandingPage());
    router.register('dashboard', () => renderDashboardPage());
    router.register('auth', () => renderAuthPage());
    router.register('journey-planner', () => renderJourneyPlannerPage());
    router.register('live-map', () => renderLiveMapPage());
    router.register('ai-assistant', () => renderAIAssistantPage());
    router.register('digital-twin', () => renderDigitalTwinPage());
    router.register('admin', () => renderAdminPage());
    router.register('analytics', () => renderAnalyticsPage());
    router.register('community', () => renderCommunityPage());
    router.register('safety', () => renderSafetyPage());
    router.register('settings', () => renderSettingsPage());
    router.register('carbon-tracker', () => renderCarbonTrackerPage());
    router.register('notifications', () => renderNotificationsPage());
    router.register('emergency', () => renderEmergencyPage());

    // Online/offline detection
    window.addEventListener('online', () => {
      store.set('offline', false);
    });
    window.addEventListener('offline', () => {
      store.set('offline', true);
    });

    // Start router
    router.start();

    // Redirect to dashboard if authenticated
    const hash = location.hash.slice(1);
    if (!hash || hash === '') {
      const isAuth = store.get('isAuthenticated');
      location.hash = isAuth ? 'dashboard' : 'landing';
    }

    console.log('VELORA initialized successfully.');
  }
}

export const app = new App();
export default app;
