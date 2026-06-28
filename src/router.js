/* ============================================================
   VELORA — SPA Router
   ============================================================ */

import store from './store.js';

class Router {
  constructor() {
    this.routes = new Map();
    this._cleanup = null;
    this._currentContent = null;
    this._routeCleanup = null;

    window.addEventListener('popstate', () => this._handleRoute());

    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-nav]');
      if (link) {
        e.preventDefault();
        this.navigate(link.dataset.nav);
      }
    });
  }

  register(path, handler) {
    this.routes.set(path, handler);
    return this;
  }

  navigate(path) {
    if (path === store.get('currentPage')) return;
    history.pushState(null, '', `#${path}`);
    this._handleRoute();
  }

  start() {
    this._handleRoute();
  }

  async _handleRoute() {
    const path = location.hash.slice(1) || 'landing';
    const prev = store.get('currentPage');
    store.set('currentPage', path);

    // Toggle dark/light mode class on body
    if (path === 'landing') {
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    }

    const app = document.getElementById('app');
    if (!app) return;

    // Exit animation
    if (this._currentContent) {
      this._currentContent.classList.add('page-exit');
    }

    // Loading state
    app.innerHTML = this._renderLoader(path);
    store.set('isLoading', true);

    // Find handler
    const handler = this.routes.get(path);
    if (!handler) {
      this._show404(app);
      return;
    }

    try {
      // Run cleanup from previous route
      if (typeof this._routeCleanup === 'function') {
        try { this._routeCleanup(); } catch (e) { console.warn('Route cleanup error:', e); }
        this._routeCleanup = null;
      }

      const result = handler(path, prev);
      // Support both sync and async handlers
      const content = result instanceof Promise ? await result : result;
      app.innerHTML = '';
      this._currentContent = content;
      app.appendChild(content);

      // Allow features to register a cleanup function
      this._routeCleanup = content._cleanup || null;

      // Trigger enter animation
      requestAnimationFrame(() => {
        content.classList.add('page-enter');
      });

      // Update scroll position
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (error) {
      console.error('Route error:', error);
      this._showError(app, error);
    } finally {
      store.set('isLoading', false);
    }

    // Update mobile nav active state
    document.querySelectorAll('.mobile-nav__item').forEach(item => {
      item.classList.toggle('mobile-nav__item--active', item.dataset.nav === path);
    });
  }

  _renderLoader(path) {
    const isDark = path !== 'landing';
    return `
      <div class="fullscreen" style="display:flex;align-items:center;justify-content:center;background:${isDark ? '#000' : '#fff'}">
        <div class="loader" style="text-align:center;">
          <div style="font-family:'Inter',sans-serif;font-size:20px;font-weight:700;letter-spacing:0.15em;color:${isDark ? '#E8A020' : '#0A0A0A'};margin-bottom:16px;">VELORA</div>
          <div class="progress-bar" style="width:120px;margin:0 auto;">
            <div class="progress-bar__fill" style="width:30%;animation:progress-fill 1.5s ease-in-out infinite;"></div>
          </div>
        </div>
      </div>
    `;
  }

  _show404(app) {
    app.innerHTML = `
      <div class="fullscreen" style="display:flex;align-items:center;justify-content:center;background:#000;color:#fff;">
        <div style="text-align:center;max-width:400px;">
          <div style="font-family:'JetBrains Mono',monospace;font-size:96px;font-weight:700;color:#E8A020;line-height:1;">404</div>
          <h1 style="font-family:'Playfair Display',serif;font-size:32px;margin:16px 0 8px;color:#fff;">Route Not Found</h1>
          <p style="color:#ABABAB;margin-bottom:24px;">This journey doesn't exist yet. Let us take you back to safety.</p>
          <button onclick="location.hash='dashboard'" class="btn btn--primary-dark btn--lg">Return Home</button>
        </div>
      </div>
    `;
  }

  _showError(app, error) {
    app.innerHTML = `
      <div class="fullscreen" style="display:flex;align-items:center;justify-content:center;background:#000;color:#fff;">
        <div style="text-align:center;max-width:420px;">
          <div style="font-size:48px;margin-bottom:16px;">⚠</div>
          <h2 style="font-size:24px;font-weight:600;margin-bottom:8px;">Something went wrong</h2>
          <p style="color:#ABABAB;margin-bottom:24px;">${error.message || 'The system encountered an unexpected error.'}</p>
          <button onclick="location.hash='dashboard'" class="btn btn--primary-dark">Go to Dashboard</button>
          <button onclick="location.reload()" class="btn btn--ghost-dark" style="margin-left:8px;">Reload</button>
        </div>
      </div>
    `;
  }

  get currentPath() {
    return location.hash.slice(1) || 'landing';
  }
}

export const router = new Router();
export default router;
