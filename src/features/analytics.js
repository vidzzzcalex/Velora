/* ============================================================
   VELORA — Analytics Dashboard
   ============================================================ */

import { createElement } from '../utils.js';
import { renderSidebar, renderMobileNav } from '../components/nav.js';
import { generateAnalyticsData } from '../services/mock-data.js';

export async function renderAnalyticsPage() {
  const user = { name: 'User', avatar: 'U' };
  const page = document.createElement('div');
  page.className = 'page--dashboard';

  const sidebar = renderSidebar('analytics', user);
  page.appendChild(sidebar);

  const main = document.createElement('main');
  main.className = 'main-content--dashboard';

  main.innerHTML = `
    <div class="dashboard-header">
      <h1>Analytics</h1>
      <p>City-wide mobility intelligence and insights</p>
    </div>
  `;

  const data = generateAnalyticsData();

  const kpiData = [
    { label: 'Avg Commute', value: `${data.averageCommute} min`, sub: 'City average' },
    { label: 'Wait Time Saved', value: `${data.waitingTimeSaved} min`, sub: 'Per commuter' },
    { label: 'Carbon Reduction', value: `${data.carbonReduction} kg`, sub: 'CO₂ saved today' },
    { label: 'Fuel Saved', value: `${data.fuelSaved} L`, sub: 'Reduction today' },
  ];

  const kpiGrid = document.createElement('div');
  kpiGrid.className = 'metrics-header';
  kpiData.forEach(k => {
    const card = document.createElement('div');
    card.className = 'metrics-header__card';
    card.innerHTML = `
      <div class="metrics-header__label">${k.label}</div>
      <div class="metrics-header__value" style="color:#E8A020;">${k.value}</div>
      <div style="font-size:12px;color:#5A5A5A;">${k.sub}</div>
    `;
    kpiGrid.appendChild(card);
  });
  main.appendChild(kpiGrid);

  // Route Performance
  const perfCard = document.createElement('div');
  perfCard.className = 'card--dark';
  perfCard.innerHTML = `
    <div class="card__title" style="font-size:16px;margin-bottom:16px;">Route Performance</div>
    <table class="admin-table">
      <thead>
        <tr><th>Route</th><th>On-Time</th><th>Ridership</th><th>Status</th></tr>
      </thead>
      <tbody>
        ${data.routePerformance.map(r => `
          <tr>
            <td style="font-weight:500;color:#fff;">${r.route}</td>
            <td>${r.onTime}%</td>
            <td>${r.ridership.toLocaleString()}</td>
            <td><span class="badge badge--${r.onTime > 90 ? 'optimal' : r.onTime > 80 ? 'warning' : 'critical'}">${r.onTime > 90 ? 'Excellent' : r.onTime > 80 ? 'Good' : 'Needs Attention'}</span></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  main.appendChild(perfCard);

  // Hourly demand (bar chart using divs)
  const demandCard = document.createElement('div');
  demandCard.className = 'card--dark';
  demandCard.style.marginTop = '16px';
  demandCard.innerHTML = `
    <div class="card__title" style="font-size:16px;margin-bottom:16px;">Hourly Demand Forecast</div>
    <div style="display:flex;align-items:flex-end;gap:4px;height:120px;padding-top:8px;">
      ${data.hourlyDemand.filter((_, i) => i % 2 === 0).map(h => `
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;">
          <div style="width:100%;height:${(h.demand / 1200) * 100}%;background:${h.demand > 800 ? '#EF4444' : h.demand > 400 ? '#E8A020' : 'rgba(255,255,255,0.15)'};border-radius:3px 3px 0 0;min-height:4px;transition:height 0.5s;"></div>
          <span style="font-size:8px;color:#5A5A5A;margin-top:4px;">${h.hour}:00</span>
        </div>
      `).join('')}
    </div>
    <div style="display:flex;gap:16px;margin-top:12px;font-size:11px;color:#5A5A5A;">
      <span>Peak demand: 08:00 - 10:00</span>
      <span>Secondary peak: 17:00 - 19:00</span>
    </div>
  `;
  main.appendChild(demandCard);

  // Incident trend and satisfaction
  const bottomGrid = document.createElement('div');
  bottomGrid.className = 'grid grid-2';
  bottomGrid.style.cssText = 'margin-top:16px;';

  const trendCard = document.createElement('div');
  trendCard.className = 'card--dark';
  trendCard.innerHTML = `
    <div class="card__title" style="font-size:16px;margin-bottom:16px;">Incident Trend (6 months)</div>
    <div style="display:flex;align-items:flex-end;gap:8px;height:100px;">
      ${data.incidentTrend.map(m => `
        <div style="flex:1;display:flex;flex-direction:column;align-items:center;">
          <div style="width:100%;height:${(m.count / 55) * 100}%;background:#E8A020;border-radius:3px 3px 0 0;min-height:8px;"></div>
          <span style="font-size:9px;color:#5A5A5A;margin-top:4px;">${m.month}</span>
        </div>
      `).join('')}
    </div>
  `;
  bottomGrid.appendChild(trendCard);

  const satCard = document.createElement('div');
  satCard.className = 'card--dark';
  satCard.innerHTML = `
    <div class="card__title" style="font-size:16px;margin-bottom:16px;">Citizen Satisfaction</div>
    <div style="text-align:center;padding:16px;">
      <div style="font-family:JetBrains Mono,monospace;font-size:56px;font-weight:700;color:#22C55E;">${data.citizenSatisfaction}%</div>
      <div style="font-size:13px;color:#5A5A5A;">Overall satisfaction score</div>
      <div style="margin-top:16px;font-size:12px;color:#5A5A5A;">
        Public transit usage: <span style="color:#E8A020;font-weight:600;">${data.publicTransitUsage}%</span>
      </div>
    </div>
  `;
  bottomGrid.appendChild(satCard);

  main.appendChild(bottomGrid);

  page.appendChild(main);

  const mobileNav = renderMobileNav('analytics');
  page.appendChild(mobileNav);

  return page;
}
