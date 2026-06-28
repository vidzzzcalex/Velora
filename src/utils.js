/* ============================================================
   VELORA — Utility Functions
   ============================================================ */

export function $(selector, context = document) {
  return context.querySelector(selector);
}

export function $$(selector, context = document) {
  return [...context.querySelectorAll(selector)];
}

export function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className') el.className = value;
    else if (key === 'style' && typeof value === 'object') {
      Object.assign(el.style, value);
    } else if (key.startsWith('on')) {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key === 'dataset') {
      Object.assign(el.dataset, value);
    } else {
      el.setAttribute(key, value);
    }
  }
  for (const child of children) {
    if (child == null) continue;
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      el.appendChild(child);
    }
  }
  return el;
}

export function html(strings, ...values) {
  const temp = document.createElement('div');
  temp.innerHTML = strings.reduce((acc, str, i) => {
    const val = values[i] != null ? values[i] : '';
    return acc + str + (typeof val === 'object' ? JSON.stringify(val) : val);
  }, '');
  return temp.firstElementChild || temp;
}

export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function throttle(fn, limit = 100) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}

export function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

export function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num) {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function clsx(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

export function pluralize(count, singular, plural) {
  return count === 1 ? singular : (plural || `${singular}s`);
}

export function truncate(str, length = 50) {
  return str.length > length ? str.substring(0, length) + '...' : str;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start, end, t) {
  return start + (end - start) * t;
}

export function getErrorMessage(error) {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'An unexpected error occurred. Please try again.';
}

export function isOnline() {
  return navigator.onLine;
}

export function addEvent(el, event, handler, options = {}) {
  el.addEventListener(event, handler, options);
  return () => el.removeEventListener(event, handler, options);
}

export function animateNumber(el, target, duration = 1000) {
  const start = parseInt(el.textContent) || 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (target - start) * eased);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
  }
  
  requestAnimationFrame(update);
}

export function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(`velora_${key}`, JSON.stringify(value));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

export function loadFromLocalStorage(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(`velora_${key}`);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
    return defaultValue;
  }
}

export function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(`velora_${key}`);
  } catch (e) {
    console.warn('Failed to remove from localStorage:', e);
  }
}
