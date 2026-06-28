/* ============================================================
   VELORA — Notifications Center Feature
   ============================================================ */

import store from '../store.js';
import { renderSidebar, renderMobileNav } from '../components/nav.js';
import { generateNotifications } from '../services/mock-data.js';

export async function renderNotificationsPage() {
  const user = { name: 'User', avatar: 'U' };
  const page = document.createElement('div');
  page.className = 'page--dashboard';

  const sidebar = renderSidebar('notifications', user);
  page.appendChild(sidebar);

  const main = document.createElement('main');
  main.className = 'main-content--dashboard';

  main.innerHTML = `
    <div class="dashboard-header">
      <h1>Notifications</h1>
      <p>Stay informed about your city and journeys</p>
    </div>
  `;

  const notifications = generateNotifications();

  const card = document.createElement('div');
  card.className = 'card--dark';
  card.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <div class="card__title" style="font-size:16px;">All Notifications</div>
      <button class="btn btn--ghost-dark btn--sm">Mark all read</button>
    </div>
    <div style="display:flex;flex-direction:column;">
      ${notifications.map(n => `
        <div class="notif-item${n.read ? '' : ' notif-item--unread'}" style="display:flex;gap:12px;padding:14px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
          ${n.read ? '' : '<div class="notif-item__dot" style="width:8px;height:8px;border-radius:50%;background:#E8A020;margin-top:6px;flex-shrink:0;"></div>'}
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:500;color:#fff;margin-bottom:2px;">${n.title}</div>
            <div style="font-size:13px;color:#ABABAB;line-height:1.4;">${n.message}</div>
            <div style="font-size:11px;color:#5A5A5A;margin-top:4px;">${new Date(n.time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
          </div>
          <span class="badge badge--${n.type}">${n.type}</span>
        </div>
      `).join('')}
    </div>
  `;

  main.appendChild(card);

  // Empty state if no notifications
  if (notifications.length === 0) {
    card.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </div>
        <div class="empty-state__title">All caught up</div>
        <div class="empty-state__message">You have no new notifications. We'll alert you when there are important updates about your journeys.</div>
      </div>
    `;
  }

  page.appendChild(main);

  const mobileNav = renderMobileNav('notifications');
  page.appendChild(mobileNav);

  // Clear badge
  store.set('unreadCount', 0);

  return page;
}
