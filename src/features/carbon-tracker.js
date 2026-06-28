/* ============================================================
   VELORA — Carbon Tracker Feature
   ============================================================ */

import { createElement } from '../utils.js';
import { renderSidebar, renderMobileNav } from '../components/nav.js';

export async function renderCarbonTrackerPage() {
  const user = { name: 'User', avatar: 'U' };
  const page = document.createElement('div');
  page.className = 'page--dashboard';

  const sidebar = renderSidebar('carbon-tracker', user);
  page.appendChild(sidebar);

  const main = document.createElement('main');
  main.className = 'main-content--dashboard';

  main.innerHTML = `
    <div class="dashboard-header">
      <h1>Carbon Tracker</h1>
      <p>Your environmental impact at a glance</p>
    </div>
  `;

  const metricsGrid = document.createElement('div');
  metricsGrid.className = 'metrics-header';

  const metrics = [
    { label: 'CO₂ Saved', value: '284 kg', sub: 'This month' },
    { label: 'Fuel Saved', value: '125 L', sub: 'Equivalent' },
    { label: 'Green Journeys', value: '47', sub: 'This month' },
    { label: 'Trees Equivalent', value: '12', sub: 'CO₂ offset in trees' },
  ];

  metrics.forEach(m => {
    const card = document.createElement('div');
    card.className = 'metrics-header__card';
    card.innerHTML = `
      <div class="metrics-header__label">${m.label}</div>
      <div class="metrics-header__value" style="color:#22C55E;">${m.value}</div>
      <div style="font-size:12px;color:#5A5A5A;">${m.sub}</div>
    `;
    metricsGrid.appendChild(card);
  });
  main.appendChild(metricsGrid);

  const columns = document.createElement('div');
  columns.className = 'grid grid-2';
  columns.style.cssText = 'margin-top:16px;';

  // Carbon ring
  const ringCard = document.createElement('div');
  ringCard.className = 'card--dark';
  ringCard.style.cssText = 'display:flex;flex-direction:column;align-items:center;';
  ringCard.innerHTML = `
    <div class="card__title" style="font-size:16px;margin-bottom:20px;">Your Impact</div>
    <div class="carbon-ring">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="8"/>
        <circle cx="80" cy="80" r="70" fill="none" stroke="#22C55E" stroke-width="8" stroke-dasharray="${(284/500)*440} 440" stroke-linecap="round" transform="rotate(-90 80 80)"/>
      </svg>
      <div class="carbon-ring__value">
        <div class="carbon-ring__number">284</div>
        <div class="carbon-ring__label">kg CO₂ saved</div>
      </div>
    </div>
    <div style="margin-top:16px;font-size:12px;color:#5A5A5A;text-align:center;">
      Goal: 500 kg this month · <span style="color:#22C55E;">57% complete</span>
    </div>
  `;
  columns.appendChild(ringCard);

  // Tips
  const tipsCard = document.createElement('div');
  tipsCard.className = 'card--dark';
  tipsCard.innerHTML = `
    <div class="card__title" style="font-size:16px;margin-bottom:16px;">Eco Tips</div>
    <div style="display:flex;flex-direction:column;gap:12px;">
      ${[
        'Walking produces zero emissions — great for short trips under 2km.',
        'Metro reduces CO₂ by 80% compared to private cars per passenger.',
        'Off-peak travel reduces congestion, saving fuel for everyone.',
        'E-rickshaws produce 60% less emissions than auto-rickshaws.',
        'Carpooling with 3+ people cuts per-person emissions by 75%.',
      ].map((tip, i) => `
        <div style="display:flex;gap:12px;padding:8px 0;border-bottom:${i < 4 ? '1px solid rgba(255,255,255,0.04)' : 'none'};">
          <div style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;background:rgba(34,197,94,0.1);border-radius:6px;flex-shrink:0;font-size:12px;">🌱</div>
          <div style="font-size:13px;color:#ABABAB;line-height:1.5;">${tip}</div>
        </div>
      `).join('')}
    </div>
  `;
  columns.appendChild(tipsCard);

  main.appendChild(columns);

  page.appendChild(main);

  const mobileNav = renderMobileNav('carbon-tracker');
  page.appendChild(mobileNav);

  return page;
}
