/* ============================================================
   VELORA — Modal Component
   ============================================================ */

import { createElement } from '../utils.js';

export function showModal({
  title = '',
  content = '',
  footer = null,
  onClose = null,
  size = 'default',
}) {
  const root = document.getElementById('modal-root');
  if (!root) return null;

  const overlay = createElement('div', { className: 'modal-overlay' });
  const modal = createElement('div', {
    className: `modal${size === 'large' ? ' modal--large' : ''}`,
  });

  // Header
  const header = createElement('div', { className: 'modal__header' });
  const titleEl = createElement('h2', { className: 'modal__title' }, [title]);
  const closeBtn = createElement('button', {
    className: 'modal__close',
    'aria-label': 'Close modal',
    onclick: () => close(),
  }, [
    createElement('svg', {
      width: '20', height: '20', viewBox: '0 0 24 24',
      fill: 'none', stroke: 'currentColor', 'stroke-width': '2',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }, [
      createElement('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
      createElement('line', { x1: '6', y1: '6', x2: '18', y2: '18' }),
    ]),
  ]);
  header.appendChild(titleEl);
  header.appendChild(closeBtn);
  modal.appendChild(header);

  // Body
  const body = createElement('div', { className: 'modal__body' });
  if (typeof content === 'string') {
    body.innerHTML = content;
  } else if (content instanceof Node) {
    body.appendChild(content);
  }
  modal.appendChild(body);

  // Footer
  if (footer) {
    const footerEl = createElement('div', { className: 'modal__footer' });
    if (typeof footer === 'string') {
      footerEl.innerHTML = footer;
    } else if (footer instanceof Node) {
      footerEl.appendChild(footer);
    }
    modal.appendChild(footerEl);
  }

  overlay.appendChild(modal);
  root.appendChild(overlay);

  // Close handlers
  const close = () => {
    overlay.style.opacity = '0';
    setTimeout(() => {
      root.removeChild(overlay);
      onClose?.();
    }, 200);
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', handler);
    }
  });

  // Focus trap
  const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusable.length) focusable[0].focus();

  return { close, element: modal };
}
