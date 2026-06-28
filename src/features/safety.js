/* ============================================================
   VELORA — Safety & Emergency Feature
   ============================================================ */

import { renderSidebar, renderMobileNav } from '../components/nav.js';
import notifier from '../components/notification.js';

export async function renderSafetyPage() {
  const user = { name: 'User', avatar: 'U' };
  const page = document.createElement('div');
  page.className = 'page--dashboard';

  const sidebar = renderSidebar('safety', user);
  page.appendChild(sidebar);

  const main = document.createElement('main');
  main.className = 'main-content--dashboard';

  main.innerHTML = `
    <div class="dashboard-header">
      <h1>Safety & Security</h1>
      <p>Your safety is our highest priority</p>
    </div>
  `;

  // SOS Button
  const sosCard = document.createElement('div');
  sosCard.className = 'card--dark';
  sosCard.style.cssText = 'border-color:rgba(239,68,68,0.3);margin-bottom:16px;';
  sosCard.innerHTML = `
    <div style="display:flex;align-items:center;gap:24px;">
      <div style="width:80px;height:80px;border-radius:50%;background:rgba(239,68,68,0.15);border:2px solid #EF4444;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;transition:all 0.2s;" id="sos-button">
        <span style="font-family:Inter,sans-serif;font-size:14px;font-weight:700;color:#EF4444;letter-spacing:0.1em;">SOS</span>
      </div>
      <div style="flex:1;">
        <div style="font-size:18px;font-weight:600;color:#fff;margin-bottom:4px;">Emergency SOS</div>
        <div style="font-size:13px;color:#ABABAB;">Press for immediate assistance. Your location will be shared with emergency services and your trusted contacts.</div>
        <div style="margin-top:8px;font-size:11px;color:#5A5A5A;">
          <span class="status-dot status-dot--optimal"></span> Emergency services available
        </div>
      </div>
    </div>
  `;
  main.appendChild(sosCard);

  // Safety features grid
  const features = [
    {
      icon: 'share',
      title: 'Share Live Journey',
      desc: 'Share your real-time location with trusted contacts',
      action: 'Share Now',
    },
    {
      icon: 'users',
      title: 'Trusted Contacts',
      desc: 'Manage your emergency contacts list',
      action: 'Manage',
    },
    {
      icon: 'shield',
      title: 'Women Safety Mode',
      desc: 'Enhanced safety features with live monitoring',
      action: 'Activate',
    },
    {
      icon: 'alert-triangle',
      title: 'Unsafe Area Alerts',
      desc: 'Get notified when approaching high-risk zones',
      action: 'Configure',
    },
    {
      icon: 'heart',
      title: 'Medical Assistance',
      desc: 'Find nearest hospitals and medical help',
      action: 'Find Help',
    },
    {
      icon: 'search',
      title: 'Lost & Found',
      desc: 'Report or search for lost items on transit',
      action: 'Search',
    },
  ];

  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:16px;';

  features.forEach(f => {
    const card = document.createElement('div');
    card.className = 'card--dark';
    card.innerHTML = `
      <div style="width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:rgba(232,160,32,0.1);border-radius:8px;margin-bottom:12px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8A020" stroke-width="2">${getIcon(f.icon)}</svg>
      </div>
      <div style="font-size:14px;font-weight:600;color:#fff;margin-bottom:4px;">${f.title}</div>
      <div style="font-size:12px;color:#ABABAB;margin-bottom:12px;line-height:1.4;">${f.desc}</div>
      <button class="btn btn--secondary-dark btn--sm" style="width:100%;">${f.action}</button>
    `;
    grid.appendChild(card);
  });
  main.appendChild(grid);

  // Report unsafe driver
  const reportCard = document.createElement('div');
  reportCard.className = 'card--dark';
  reportCard.innerHTML = `
    <div style="display:flex;align-items:center;gap:16px;">
      <div style="width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:rgba(239,68,68,0.1);border-radius:8px;flex-shrink:0;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
      <div style="flex:1;">
        <div style="font-size:14px;font-weight:600;color:#fff;">Report Unsafe Driver</div>
        <div style="font-size:12px;color:#ABABAB;">Anonymous reporting — your identity is protected</div>
      </div>
      <button class="btn btn--destructive btn--sm">Report</button>
    </div>
  `;
  main.appendChild(reportCard);

  page.appendChild(main);

  const mobileNav = renderMobileNav('safety');
  page.appendChild(mobileNav);

  // ─── SOS Handler ───
  setTimeout(() => {
    const sosBtn = document.getElementById('sos-button');
    if (sosBtn) {
      sosBtn.addEventListener('click', () => {
        notifier.show({
          title: '🚨 SOS Alert Sent',
          message: 'Your location has been shared with emergency services and your trusted contacts. Help is on the way.',
          type: 'error',
          duration: 8000,
        });
        sosBtn.style.background = 'rgba(239,68,68,0.3)';
        sosBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
          sosBtn.style.background = 'rgba(239,68,68,0.15)';
          sosBtn.style.transform = 'scale(1)';
        }, 1000);
      });
    }
  }, 100);

  return page;
}

function getIcon(name) {
  const icons = {
    'share': '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
    'users': '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
    'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    'alert-triangle': '<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
    'heart': '<path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>',
    'search': '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  };
  return icons[name] || '<circle cx="12" cy="12" r="10"/>';
}
