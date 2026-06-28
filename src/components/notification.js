/* ============================================================
   VELORA — Notification Toast System
   ============================================================ */

import { createElement, generateId } from '../utils.js';

class NotificationSystem {
  constructor() {
    this.container = null;
    this._ensureContainer();
    this.notifications = new Map();
  }

  _ensureContainer() {
    this.container = document.getElementById('notification-root');
    if (this.container) {
      this.container.style.cssText = `
        position: fixed;
        top: 80px;
        right: 24px;
        z-index: 500;
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-width: 400px;
        pointer-events: none;
      `;
    }
  }

  show({ title = '', message = '', type = 'info', duration = 5000 }) {
    if (!this.container) return;
    const id = generateId();

    const colors = {
      info: { dot: '#3B82F6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)' },
      success: { dot: '#22C55E', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)' },
      warning: { dot: '#F59E0B', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
      error: { dot: '#EF4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
    };

    const c = colors[type] || colors.info;

    const notif = createElement('div', {
      className: 'notification',
      style: {
        pointerEvents: 'auto',
        borderLeft: `3px solid ${c.dot}`,
      },
      onclick: () => this.dismiss(id),
    });

    notif.innerHTML = `
      <div style="width:8px;height:8px;border-radius:50%;background:${c.dot};flex-shrink:0;margin-top:6px;"></div>
      <div style="flex:1;">
        <div style="font-size:14px;font-weight:600;color:#fff;margin-bottom:2px;">${title}</div>
        <div style="font-size:13px;color:#ABABAB;">${message}</div>
      </div>
      <button style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;color:#5A5A5A;flex-shrink:0;background:none;border:none;cursor:pointer;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    `;

    this.container.appendChild(notif);
    this.notifications.set(id, notif);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }

    return id;
  }

  dismiss(id) {
    const notif = this.notifications.get(id);
    if (!notif || !notif.parentNode) return;
    notif.style.opacity = '0';
    notif.style.transform = 'translateX(100%)';
    notif.style.transition = 'all 200ms ease-in';
    setTimeout(() => {
      if (notif.parentNode) notif.parentNode.removeChild(notif);
      this.notifications.delete(id);
    }, 200);
  }
}

export const notifier = new NotificationSystem();
export default notifier;
