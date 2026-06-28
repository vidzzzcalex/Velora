/* ============================================================
   VELORA — Authentication Feature
   ============================================================ */

import store from '../store.js';
import { createElement } from '../utils.js';
import notifier from '../components/notification.js';
import { getCurrentUser } from '../services/mock-data.js';

export async function renderAuthPage() {
  const page = document.createElement('div');
  page.className = 'page page--dark';
  page.style.cssText = 'display:flex;align-items:center;justify-content:center;min-height:100vh;';

  const container = createElement('div', {
    style: {
      width: '100%',
      maxWidth: '420px',
      padding: '24px',
    },
  });

  container.innerHTML = `
    <div style="text-align:center;margin-bottom:40px;">
      <div style="font-family:Inter,sans-serif;font-size:24px;font-weight:700;letter-spacing:0.15em;color:#E8A020;margin-bottom:8px;">VELORA</div>
      <h1 style="font-size:28px;font-weight:600;color:#fff;margin-bottom:4px;">Welcome back</h1>
      <p style="color:#ABABAB;font-size:14px;">Sign in to continue your journey</p>
    </div>
  `;

  // Login form
  const form = createElement('form', {
    className: 'journey-form',
    onsubmit: (e) => {
      e.preventDefault();
      handleLogin();
    },
  });

  form.innerHTML = `
    <div class="journey-input-group">
      <label>Email</label>
      <div class="journey-input">
        <svg class="journey-input__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
        <input class="journey-input__field" type="email" id="login-email" placeholder="you@example.com" value="alex@velora.city" required>
      </div>
    </div>
    <div class="journey-input-group">
      <label>Password</label>
      <div class="journey-input">
        <svg class="journey-input__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
        <input class="journey-input__field" type="password" id="login-password" placeholder="Enter your password" value="velora123" required>
      </div>
    </div>
    <button type="submit" class="btn btn--primary-dark btn--lg" style="width:100%;margin-top:8px;">
      Sign In
    </button>
    <div style="text-align:center;margin-top:16px;">
      <span style="color:#5A5A5A;font-size:13px;">Don't have an account? </span>
      <button type="button" style="color:#E8A020;font-size:13px;font-weight:500;background:none;border:none;cursor:pointer;" id="show-signup">Create one</button>
    </div>
  `;

  container.appendChild(form);
  page.appendChild(container);

  // Quick login hint
  const hint = createElement('div', {
    style: {
      marginTop: '24px',
      padding: '12px 16px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '8px',
      fontSize: '12px',
      color: '#5A5A5A',
      textAlign: 'center',
    },
  });
  hint.innerHTML = 'Demo: Auto-filled credentials — just click Sign In';
  container.appendChild(hint);

  return page;
}

function handleLogin() {
  const user = getCurrentUser();
  store.set('user', user);
  store.set('isAuthenticated', true);
  notifier.show({ title: 'Welcome back, Alex', message: 'Your dashboard is ready.', type: 'success' });
  setTimeout(() => {
    window.location.hash = 'dashboard';
  }, 300);
}
