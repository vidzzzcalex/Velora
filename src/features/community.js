/* ============================================================
   VELORA — Community Reports Feature
   ============================================================ */

import { createElement } from '../utils.js';
import { renderSidebar, renderMobileNav } from '../components/nav.js';
import { generateCommunityReports } from '../services/mock-data.js';
import notifier from '../components/notification.js';

export async function renderCommunityPage() {
  const user = { name: 'User', avatar: 'U' };
  const page = document.createElement('div');
  page.className = 'page--dashboard';

  const sidebar = renderSidebar('community', user);
  page.appendChild(sidebar);

  const main = document.createElement('main');
  main.className = 'main-content--dashboard';

  main.innerHTML = `
    <div class="dashboard-header">
      <h1>Community Reports</h1>
      <p>Help improve city mobility — report issues, share feedback</p>
    </div>
  `;

  // Report types
  const types = [
    { type: 'overcrowding', label: 'Overcrowding', icon: 'users' },
    { type: 'road-damage', label: 'Road Damage', icon: 'alert-triangle' },
    { type: 'broken-stop', label: 'Broken Stop', icon: 'map-pin' },
    { type: 'unsafe-area', label: 'Unsafe Area', icon: 'shield' },
    { type: 'accident', label: 'Accident', icon: 'alert-circle' },
    { type: 'delay', label: 'Service Delay', icon: 'clock' },
  ];

  const typeGrid = document.createElement('div');
  typeGrid.style.cssText = 'display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:8px;margin-bottom:24px;';

  types.forEach(t => {
    const btn = document.createElement('button');
    btn.className = 'btn btn--secondary-dark btn--sm';
    btn.style.cssText = 'justify-content:flex-start;gap:8px;padding:12px;min-height:48px;';
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${getIconPath(t.icon)}</svg>
      ${t.label}
    `;
    btn.addEventListener('click', () => {
      notifier.show({
        title: 'Report Submitted',
        message: `Your "${t.label}" report has been logged. Thank you for helping improve the city.`,
        type: 'success',
      });
    });
    typeGrid.appendChild(btn);
  });
  main.appendChild(typeGrid);

  // Recent reports
  const reports = generateCommunityReports();
  const reportsCard = document.createElement('div');
  reportsCard.className = 'card--dark';
  reportsCard.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <div class="card__title" style="font-size:16px;">Recent Reports</div>
      <span class="badge badge--info">${reports.length} REPORTS</span>
    </div>
    <div style="display:flex;flex-direction:column;">
      ${reports.map(r => `
        <div style="display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
          <div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:${r.status === 'verified' ? 'rgba(34,197,94,0.1)' : r.status === 'pending' ? 'rgba(245,158,11,0.1)' : 'rgba(107,114,128,0.1)'};border-radius:8px;flex-shrink:0;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${r.status === 'verified' ? '#22C55E' : r.status === 'pending' ? '#F59E0B' : '#6B7280'}" stroke-width="2">${getIconPath(r.type === 'overcrowding' ? 'users' : r.type === 'road-damage' ? 'alert-triangle' : r.type === 'unsafe-area' ? 'shield' : 'clock')}</svg>
          </div>
          <div style="flex:1;">
            <div style="font-size:13px;font-weight:500;color:#fff;">${r.title}</div>
            <div style="font-size:11px;color:#5A5A5A;margin-top:2px;">${r.location}</div>
            <div style="display:flex;gap:8px;margin-top:4px;">
              <span class="badge badge--${r.status === 'verified' ? 'optimal' : r.status === 'pending' ? 'warning' : 'inactive'}">${r.status}</span>
              <span style="font-size:10px;color:#5A5A5A;">${r.votes} votes</span>
            </div>
          </div>
          <div style="font-size:10px;color:#5A5A5A;">${new Date(r.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      `).join('')}
    </div>
  `;
  main.appendChild(reportsCard);

  page.appendChild(main);

  const mobileNav = renderMobileNav('community');
  page.appendChild(mobileNav);

  return page;
}

function getIconPath(name) {
  const icons = {
    'users': '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
    'alert-triangle': '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    'map-pin': '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>',
    'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    'alert-circle': '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>',
    'clock': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  };
  return icons[name] || '<circle cx="12" cy="12" r="10"/>';
}
