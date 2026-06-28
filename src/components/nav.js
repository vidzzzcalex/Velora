/* ============================================================
   VELORA — Navigation Components
   ============================================================ */

import store from '../store.js';
import router from '../router.js';

export function renderSidebar(currentPath, user) {
  const navItems = [
    { section: 'Main' },
    { icon: 'layout-dashboard', label: 'Dashboard', path: 'dashboard' },
    { icon: 'route', label: 'Journey Planner', path: 'journey-planner' },
    { icon: 'map', label: 'Live Map', path: 'live-map' },
    { icon: 'bot', label: 'AI Assistant', path: 'ai-assistant' },
    { section: 'Intelligence' },
    { icon: 'city', label: 'Digital Twin', path: 'digital-twin' },
    { icon: 'chart-bar', label: 'Analytics', path: 'analytics' },
    { icon: 'building', label: 'Admin Center', path: 'admin' },
    { section: 'Community' },
    { icon: 'users', label: 'Community', path: 'community' },
    { icon: 'shield', label: 'Safety', path: 'safety' },
    { icon: 'leaf', label: 'Carbon Tracker', path: 'carbon-tracker' },
    { section: 'Account' },
    { icon: 'bell', label: 'Notifications', path: 'notifications' },
    { icon: 'settings', label: 'Settings', path: 'settings' },
  ];

  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar';

  // Header
  const header = document.createElement('div');
  header.className = 'sidebar__header';
  header.innerHTML = `<div class="sidebar__logo">VELORA</div>`;
  sidebar.appendChild(header);

  // Nav items
  const nav = document.createElement('nav');
  nav.className = 'sidebar__nav';
  let currentSection = null;

  navItems.forEach(item => {
    if (item.section) {
      if (currentSection) {
        // Add extra spacing before new section
      }
      currentSection = item.section;
      const section = document.createElement('div');
      section.className = 'sidebar__section';
      section.textContent = item.section;
      nav.appendChild(section);
    } else {
      const navItem = document.createElement('a');
      navItem.className = 'sidebar__item';
      if (currentPath === item.path) {
        navItem.classList.add('sidebar__item--active');
      }
      navItem.dataset.nav = item.path;
      navItem.href = `#${item.path}`;

      navItem.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${getIconPath(item.icon)}
        </svg>
        <span>${item.label}</span>
      `;

      // Special badge for notifications
      if (item.path === 'notifications') {
        const unread = store.get('unreadCount');
        if (unread > 0) {
          const badge = document.createElement('span');
          badge.className = 'sidebar__badge';
          badge.textContent = unread;
          navItem.appendChild(badge);
        }
      }

      nav.appendChild(navItem);
    }
  });

  sidebar.appendChild(nav);

  // User footer
  const footer = document.createElement('div');
  footer.className = 'sidebar__footer';
  footer.innerHTML = `
    <div class="sidebar__user">
      <div class="sidebar__user-avatar">${user?.avatar || 'U'}</div>
      <div class="sidebar__user-info">
        <div class="sidebar__user-name">${user?.name || 'User'}</div>
        <div class="sidebar__user-role">Passenger</div>
      </div>
    </div>
  `;
  sidebar.appendChild(footer);

  return sidebar;
}

export function renderMobileNav(currentPath) {
  const items = [
    { icon: 'layout-dashboard', label: 'Home', path: 'dashboard' },
    { icon: 'route', label: 'Plan', path: 'journey-planner' },
    { icon: 'map', label: 'Map', path: 'live-map' },
    { icon: 'bot', label: 'AI', path: 'ai-assistant' },
    { icon: 'users', label: 'Community', path: 'community' },
  ];

  const nav = document.createElement('nav');
  nav.className = 'mobile-nav';

  items.forEach(item => {
    const el = document.createElement('a');
    el.className = 'mobile-nav__item';
    if (currentPath === item.path) {
      el.classList.add('mobile-nav__item--active');
    }
    el.dataset.nav = item.path;
    el.href = `#${item.path}`;
    el.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:22px;height:22px;">
        ${getIconPath(item.icon)}
      </svg>
      <span>${item.label}</span>
    `;
    nav.appendChild(el);
  });

  return nav;
}

export function renderTopNav(isLight = false, currentPath = 'landing') {
  const nav = document.createElement('nav');
  nav.className = isLight ? 'nav' : 'nav nav--dark';

  nav.innerHTML = `
    <div class="nav__inner">
      <div class="${isLight ? 'nav__logo' : 'nav__logo nav__logo--light'}">VELORA</div>
      <div class="nav__links">
        <a class="${isLight ? 'nav__link' : 'nav__link nav__link--light'} ${currentPath === 'landing' ? 'nav__link--active' : ''}" data-nav="landing">Home</a>
        <a class="${isLight ? 'nav__link' : 'nav__link nav__link--light'}" data-nav="dashboard">Dashboard</a>
        <a class="${isLight ? 'nav__link' : 'nav__link nav__link--light'}" data-nav="journey-planner">Plan Journey</a>
        <a class="${isLight ? 'nav__link' : 'nav__link nav__link--light'}" data-nav="live-map">Live Map</a>
        <button class="nav__cta btn ${isLight ? 'btn--primary' : 'btn--primary-dark'} btn--sm" data-nav="dashboard">Get Started</button>
      </div>
    </div>
  `;

  // Scroll effect
  if (isLight) {
    const onScroll = () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Store cleanup
    nav._scrollCleanup = () => window.removeEventListener('scroll', onScroll);
  }

  return nav;
}

function getIconPath(name) {
  const icons = {
    'layout-dashboard': '<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>',
    'route': '<circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M6 9v9a3 3 0 003 3h6a3 3 0 003-3V9"/>',
    'map': '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>',
    'bot': '<path d="M12 8V4M8 4h8M4 12a8 8 0 0116 0v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z"/><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/>',
    'city': '<rect x="4" y="10" width="6" height="12"/><rect x="14" y="4" width="6" height="18"/><path d="M4 10L7 7l3 3"/><path d="M14 4l3-3 3 3"/>',
    'chart-bar': '<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>',
    'building': '<rect x="4" y="2" width="16" height="20"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/>',
    'users': '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>',
    'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    'leaf': '<path d="M11 20A7 7 0 019.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>',
    'bell': '<path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>',
    'settings': '<circle cx="12" cy="12" r="3"/><path d="M12 1v2m0 18v2m-8.49-2.51l1.41-1.41m14.14-14.14l1.41-1.41M1 12h2m18 0h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41"/>',
  };
  return icons[name] || '<circle cx="12" cy="12" r="10"/>';
}
