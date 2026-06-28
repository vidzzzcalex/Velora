/* ============================================================
   VELORA — Passenger Dashboard Feature
   ============================================================ */

import store from '../store.js';
import { createElement } from '../utils.js';
import { renderSidebar, renderMobileNav } from '../components/nav.js';
import {
  generateFleetData, generateIncidents, generateWeather,
  generateSavedJourneys, generateRecentTrips, generateNotifications,
} from '../services/mock-data.js';

export async function renderDashboardPage() {
  const user = store.get('user') || { name: 'User', avatar: 'U' };
  const page = document.createElement('div');
  page.className = 'page--dashboard';

  // Sidebar
  const sidebar = renderSidebar('dashboard', user);
  page.appendChild(sidebar);

  // Main content
  const main = document.createElement('main');
  main.className = 'main-content--dashboard';

  // Header
  const header = document.createElement('div');
  header.className = 'dashboard-header';
  header.innerHTML = `
    <h1>Welcome, ${user.name.split(' ')[0]}</h1>
    <p>Your city is operating at optimal efficiency today.</p>
  `;
  main.appendChild(header);

  // Metrics row
  const metrics = document.createElement('div');
  metrics.className = 'metrics-header';

  const metricCards = [
    { label: 'Time Saved', value: '12h', change: '+2h', positive: true, icon: 'clock' },
    { label: 'Carbon Saved', value: '2.8t', change: '+0.4t', positive: true, icon: 'leaf' },
    { label: 'Money Saved', value: '₹1,240', change: '+₹180', positive: true, icon: 'wallet' },
    { label: 'Reward Points', value: '2,450', change: '+320', positive: true, icon: 'star' },
  ];

  metricCards.forEach(m => {
    const card = document.createElement('div');
    card.className = 'metrics-header__card';
    card.innerHTML = `
      <div class="metrics-header__label">${m.label}</div>
      <div class="metrics-header__value">${m.value}</div>
      <div class="metrics-header__change metrics-header__change--${m.positive ? 'up' : 'down'}">${m.change} this week</div>
    `;
    metrics.appendChild(card);
  });
  main.appendChild(metrics);

  // Two column layout
  const columns = document.createElement('div');
  columns.className = 'grid grid-2';
  columns.style.cssText = 'grid-template-columns: 1.2fr 0.8fr;';

  // Left column - Quick Actions + Upcoming Journey
  const leftCol = document.createElement('div');
  leftCol.style.cssText = 'display:flex;flex-direction:column;gap:24px;';

  // Quick Actions
  const quickActions = document.createElement('div');
  quickActions.style.cssText = 'display:grid;grid-template-columns:repeat(2,1fr);gap:12px;';

  const actions = [
    { icon: 'route', title: 'Plan Journey', subtitle: 'AI-powered route planning', path: 'journey-planner' },
    { icon: 'map', title: 'Live Map', subtitle: 'Real-time city transit', path: 'live-map' },
    { icon: 'bot', title: 'AI Assistant', subtitle: 'Ask anything about your trip', path: 'ai-assistant' },
    { icon: 'shield', title: 'Safety', subtitle: 'Emergency & assistance', path: 'safety' },
  ];

  actions.forEach(a => {
    const el = document.createElement('div');
    el.className = 'quick-action';
    el.dataset.nav = a.path;
    el.innerHTML = `
      <div class="quick-action__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${getQuickIcon(a.icon)}
        </svg>
      </div>
      <div class="quick-action__content">
        <div class="quick-action__title">${a.title}</div>
        <div class="quick-action__subtitle">${a.subtitle}</div>
      </div>
    `;
    quickActions.appendChild(el);
  });
  leftCol.appendChild(quickActions);

  // Upcoming Journey Card
  const savedJourneys = generateSavedJourneys();
  if (savedJourneys.length > 0) {
    const journey = savedJourneys[0];
    const journeyCard = document.createElement('div');
    journeyCard.className = 'card--dark';
    journeyCard.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <div class="card__title" style="font-size:16px;">Upcoming Journey</div>
        <span class="badge badge--info">TODAY</span>
      </div>
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:16px;">
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
          <div style="width:10px;height:10px;border-radius:50%;background:#22C55E;"></div>
          <div style="width:2px;height:32px;background:rgba(255,255,255,0.12);"></div>
          <div style="width:10px;height:10px;border-radius:50%;background:#E8A020;"></div>
        </div>
        <div style="flex:1;">
          <div style="font-size:16px;font-weight:600;color:#fff;">${journey.from}</div>
          <div style="font-size:13px;color:#5A5A5A;margin:8px 0;">to</div>
          <div style="font-size:16px;font-weight:600;color:#fff;">${journey.to}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:JetBrains Mono,monospace;font-size:24px;font-weight:700;color:#E8A020;">${journey.duration}</div>
          <div style="font-size:11px;color:#5A5A5A;text-transform:uppercase;letter-spacing:0.04em;">Minutes</div>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn--primary-dark btn--sm" style="flex:1;" data-nav="journey-planner">View Details</button>
        <button class="btn btn--secondary-dark btn--sm" style="flex:1;">Start Journey</button>
      </div>
    `;
    leftCol.appendChild(journeyCard);
  }

  // Recent Trips
  const recentTrips = generateRecentTrips();
  const recentCard = document.createElement('div');
  recentCard.className = 'card--dark';
  recentCard.innerHTML = `
    <div class="card__title" style="font-size:16px;margin-bottom:16px;">Recent Trips</div>
    <div style="display:flex;flex-direction:column;">
      ${recentTrips.slice(0, 4).map(trip => `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
          <div style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:rgba(232,160,32,0.1);border-radius:6px;flex-shrink:0;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8A020" stroke-width="2">
              <circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M6 9v9a3 3 0 003 3h6a3 3 0 003-3V9"/>
            </svg>
          </div>
          <div style="flex:1;">
            <div style="font-size:13px;font-weight:500;color:#fff;">${trip.from} → ${trip.to}</div>
            <div style="font-size:11px;color:#5A5A5A;">${trip.duration} min · ₹${trip.fare}</div>
          </div>
          <div style="font-size:11px;color:#5A5A5A;">${new Date(trip.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
        </div>
      `).join('')}
    </div>
  `;
  leftCol.appendChild(recentCard);

  columns.appendChild(leftCol);

  // Right column - Weather, Alerts, AI Recommendations
  const rightCol = document.createElement('div');
  rightCol.style.cssText = 'display:flex;flex-direction:column;gap:24px;';

  // Weather Card
  const weather = generateWeather();
  const weatherCard = document.createElement('div');
  weatherCard.className = 'card--dark';
  weatherCard.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
      <div class="card__title" style="font-size:16px;">Weather</div>
      <div class="live-indicator"><span class="live-indicator__dot"></span>LIVE</div>
    </div>
    <div style="display:flex;align-items:center;gap:16px;">
      <div style="font-size:40px;font-weight:700;font-family:JetBrains Mono,monospace;color:#E8A020;">${weather.temperature}°</div>
      <div>
        <div style="font-size:14px;font-weight:600;color:#fff;text-transform:capitalize;">${weather.condition}</div>
        <div style="font-size:12px;color:#5A5A5A;">Feels like ${weather.feelsLike}°</div>
        <div style="font-size:12px;color:#5A5A5A;">Wind: ${weather.windSpeed} km/h</div>
      </div>
    </div>
  `;
  rightCol.appendChild(weatherCard);

  // Live Alerts
  const incidents = generateIncidents().slice(0, 3);
  const alertsCard = document.createElement('div');
  alertsCard.className = 'card--dark';
  alertsCard.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <div class="card__title" style="font-size:16px;">Live Alerts</div>
      <span class="badge badge--critical">${incidents.length} ACTIVE</span>
    </div>
    <div style="display:flex;flex-direction:column;">
      ${incidents.map(inc => `
        <div class="incident-item incident-item--${inc.severity}">
          <div class="incident-item__time">${new Date(inc.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
          <div class="incident-item__content">
            <div class="incident-item__title">${inc.title}</div>
            <div class="incident-item__location">${inc.location}</div>
          </div>
        </div>
      `).join('')}
    </div>
    <button class="btn btn--ghost-dark btn--sm" style="margin-top:12px;width:100%;" data-nav="live-map">View on Map</button>
  `;
  rightCol.appendChild(alertsCard);

  // AI Recommendation
  const aiCard = document.createElement('div');
  aiCard.className = 'card--dark';
  aiCard.innerHTML = `
    <div class="card__title" style="font-size:16px;margin-bottom:12px;">AI Recommendation</div>
    <div style="padding:12px;background:rgba(232,160,32,0.06);border-radius:8px;border:1px solid rgba(232,160,32,0.15);margin-bottom:12px;">
      <div style="font-size:13px;color:#ABABAB;line-height:1.5;">
        Based on your routine, you might want to leave 10 minutes earlier today — 
        there's predicted congestion on your usual route due to road maintenance near Connaught Place.
      </div>
    </div>
    <button class="btn btn--primary-dark btn--sm" style="width:100%;" data-nav="journey-planner">Plan Alternative Route</button>
  `;
  rightCol.appendChild(aiCard);

  columns.appendChild(rightCol);
  main.appendChild(columns);

  page.appendChild(main);

  // Mobile nav
  const mobileNav = renderMobileNav('dashboard');
  page.appendChild(mobileNav);

  return page;
}

function getQuickIcon(name) {
  const icons = {
    route: '<circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M6 9v9a3 3 0 003 3h6a3 3 0 003-3V9"/>',
    map: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
    bot: '<path d="M12 8V4M8 4h8M4 12a8 8 0 0116 0v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    leaf: '<path d="M11 20A7 7 0 019.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    wallet: '<path d="M21 12V7H5a2 2 0 010-4h14v4"/><path d="M3 5v14a2 2 0 002 2h16v-5"/><path d="M18 12a2 2 0 000 4h4v-4h-4z"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  };
  return icons[name] || '<circle cx="12" cy="12" r="10"/>';
}
