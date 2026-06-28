/* ============================================================
   VELORA — Settings & Preferences Feature
   ============================================================ */

import store from '../store.js';
import { renderSidebar, renderMobileNav } from '../components/nav.js';
import notifier from '../components/notification.js';
import { storageService } from '../services/storage-service.js';

export async function renderSettingsPage() {
  const user = store.get('user') || { name: 'User', avatar: 'U' };
  const page = document.createElement('div');
  page.className = 'page--dashboard';

  const sidebar = renderSidebar('settings', user);
  page.appendChild(sidebar);

  const main = document.createElement('main');
  main.className = 'main-content--dashboard';

  main.innerHTML = `
    <div class="dashboard-header">
      <h1>Settings</h1>
      <p>Manage your preferences and account</p>
    </div>
  `;

  const settings = [
    {
      title: 'Notifications',
      desc: 'Control what alerts you receive',
      items: [
        { label: 'Push Notifications', enabled: true },
        { label: 'Route Changes', enabled: true },
        { label: 'Weather Alerts', enabled: true },
        { label: 'Safety Alerts', enabled: true },
        { label: 'Promotional Updates', enabled: false },
      ],
    },
    {
      title: 'Accessibility',
      desc: 'Make VELORA work for you',
      items: [
        { label: 'Large Text', enabled: false },
        { label: 'High Contrast Mode', enabled: false },
        { label: 'Reduced Motion', enabled: false },
        { label: 'Screen Reader Support', enabled: true },
        { label: 'Voice Navigation', enabled: false },
      ],
    },
    {
      title: 'Privacy & Safety',
      desc: 'Manage your data and safety preferences',
      items: [
        { label: 'Share Live Journey', enabled: false },
        { label: 'Save Search History', enabled: true },
        { label: 'Anonymous Usage Data', enabled: true },
        { label: 'Emergency Contacts Access', enabled: true },
      ],
    },
  ];

  settings.forEach(group => {
    const groupEl = document.createElement('div');
    groupEl.className = 'settings-group';
    groupEl.innerHTML = `
      <div class="settings-group__title">${group.title}</div>
      <div class="settings-group__description">${group.desc}</div>
      ${group.items.map(item => `
        <div class="settings-row">
          <div>
            <div class="settings-row__label">${item.label}</div>
          </div>
          <div class="toggle${item.enabled ? ' toggle--active' : ''}" data-setting="${item.label.toLowerCase().replace(/\s+/g, '-')}">
            <div class="toggle__track"></div>
            <div class="toggle__thumb"></div>
          </div>
        </div>
      `).join('')}
    `;
    main.appendChild(groupEl);
  });

  // Profile section
  const profileSection = document.createElement('div');
  profileSection.className = 'settings-group';
  profileSection.innerHTML = `
    <div class="settings-group__title">Profile</div>
    <div class="settings-group__description">Manage your account information</div>
    <div style="display:flex;align-items:center;gap:16px;padding:16px 0;">
      <div class="sidebar__user-avatar" style="width:48px;height:48px;font-size:18px;">${user.avatar || 'U'}</div>
      <div style="flex:1;">
        <div style="font-size:16px;font-weight:600;color:#fff;">${user.name}</div>
        <div style="font-size:13px;color:#5A5A5A;">${user.email || 'alex@velora.city'}</div>
      </div>
      <button class="btn btn--secondary-dark btn--sm">Edit</button>
    </div>
    <button class="btn btn--ghost-dark btn--sm" style="color:#EF4444;" id="logout-btn">Sign Out</button>
  `;
  main.appendChild(profileSection);

  page.appendChild(main);

  const mobileNav = renderMobileNav('settings');
  page.appendChild(mobileNav);

  // ─── Event Handlers ───
  setTimeout(() => {
    document.querySelectorAll('.toggle').forEach(toggle => {
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('toggle--active');
        const setting = toggle.dataset.setting;
        const enabled = toggle.classList.contains('toggle--active');
        notifier.show({
          title: `${setting.replace(/-/g, ' ')} ${enabled ? 'enabled' : 'disabled'}`,
          message: 'Your preference has been saved.',
          type: 'success',
          duration: 2000,
        });
      });
    });

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        store.set('user', null);
        store.set('isAuthenticated', false);
        notifier.show({ title: 'Signed out', message: 'You have been signed out successfully.', type: 'info' });
        setTimeout(() => { window.location.hash = 'landing'; }, 500);
      });
    }
  }, 100);

  return page;
}
