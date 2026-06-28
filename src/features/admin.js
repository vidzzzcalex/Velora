/* ============================================================
   VELORA — Admin Control Center
   ============================================================ */

import { renderSidebar, renderMobileNav } from '../components/nav.js';
import { generateAdminMetrics, generateFleetData, generateIncidents } from '../services/mock-data.js';

export async function renderAdminPage() {
  const user = { name: 'Admin', avatar: 'A' };
  const page = document.createElement('div');
  page.className = 'page--dashboard';

  const sidebar = renderSidebar('admin', user);
  page.appendChild(sidebar);

  const main = document.createElement('main');
  main.className = 'main-content--dashboard';

  main.innerHTML = `
    <div class="dashboard-header">
      <h1>Admin Control Center</h1>
      <p>Fleet management · Operations · Intelligence</p>
    </div>
  `;

  const metrics = generateAdminMetrics();
  const kpiData = [
    { label: 'Fleet Health', value: `${metrics.fleetHealth}%`, sub: `${metrics.activeFleet} active vehicles` },
    { label: 'On-Time Perf.', value: `${metrics.onTimePerformance}%`, sub: 'Average across all routes' },
    { label: 'Revenue Today', value: `₹${metrics.dailyRevenue.toLocaleString()}`, sub: '+12% vs yesterday' },
    { label: 'Passenger Sat.', value: `${metrics.passengerSatisfaction}%`, sub: `${metrics.resolvedToday} issues resolved today` },
  ];

  const kpiGrid = document.createElement('div');
  kpiGrid.className = 'metrics-header';
  kpiData.forEach(k => {
    const card = document.createElement('div');
    card.className = 'metrics-header__card';
    card.innerHTML = `
      <div class="metrics-header__label">${k.label}</div>
      <div class="metrics-header__value">${k.value}</div>
      <div style="font-size:12px;color:#5A5A5A;">${k.sub}</div>
    `;
    kpiGrid.appendChild(card);
  });
  main.appendChild(kpiGrid);

  // Fleet Status
  const fleetCard = document.createElement('div');
  fleetCard.className = 'card--dark';
  fleetCard.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <div class="card__title" style="font-size:16px;">Fleet Status</div>
      <span class="badge badge--optimal">${metrics.vehiclesInService} IN SERVICE</span>
    </div>
  `;

  const fleetTable = document.createElement('table');
  fleetTable.className = 'admin-table';
  fleetTable.innerHTML = `
    <thead>
      <tr>
        <th>Vehicle</th>
        <th>Route</th>
        <th>Status</th>
        <th>ETA</th>
        <th>Occupancy</th>
        <th>Driver</th>
      </tr>
    </thead>
    <tbody>
      ${generateFleetData().map(v => `
        <tr>
          <td style="font-weight:500;color:#fff;">${v.name}</td>
          <td>${v.route}</td>
          <td><span class="badge badge--${v.status === 'on-time' ? 'optimal' : v.status === 'delayed' ? 'warning' : 'inactive'}">${v.status}</span></td>
          <td>${v.eta}</td>
          <td>
            <div style="display:flex;align-items:center;gap:8px;">
              <div style="width:60px;height:4px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden;">
                <div style="height:100%;width:${v.occupancy}%;background:${v.occupancy > 80 ? '#EF4444' : v.occupancy > 60 ? '#F59E0B' : '#22C55E'};border-radius:2px;"></div>
              </div>
              <span style="font-size:11px;">${v.occupancy}%</span>
            </div>
          </td>
          <td>${v.driver}</td>
        </tr>
      `).join('')}
    </tbody>
  `;
  fleetCard.appendChild(fleetTable);
  main.appendChild(fleetCard);

  // Incidents + Complaints
  const bottomGrid = document.createElement('div');
  bottomGrid.className = 'grid grid-2';
  bottomGrid.style.cssText = 'margin-top:16px;';

  const incidents = generateIncidents();
  const incidentCard = document.createElement('div');
  incidentCard.className = 'card--dark';
  incidentCard.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <div class="card__title" style="font-size:16px;">Active Incidents</div>
      <span class="badge badge--critical">${incidents.length} ACTIVE</span>
    </div>
    ${incidents.map(inc => `
      <div class="incident-item incident-item--${inc.severity}">
        <div class="incident-item__time">${new Date(inc.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
        <div class="incident-item__content">
          <div class="incident-item__title">${inc.title}</div>
          <div class="incident-item__location">${inc.location}</div>
        </div>
        <span class="badge badge--${inc.severity}">${inc.severity}</span>
      </div>
    `).join('')}
  `;
  bottomGrid.appendChild(incidentCard);

  const complaintsCard = document.createElement('div');
  complaintsCard.className = 'card--dark';
  complaintsCard.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <div class="card__title" style="font-size:16px;">Open Complaints</div>
      <span class="badge badge--warning">${metrics.openComplaints} OPEN</span>
    </div>
    <div style="text-align:center;padding:32px 16px;">
      <div style="font-family:JetBrains Mono,monospace;font-size:48px;font-weight:700;color:#F59E0B;">${metrics.openComplaints}</div>
      <div style="font-size:13px;color:#5A5A5A;">Open complaints requiring attention</div>
      <div style="font-size:12px;color:#5A5A5A;margin-top:8px;">Avg response time: ${metrics.averageResponseTime} min</div>
      <button class="btn btn--primary-dark btn--sm" style="margin-top:16px;">View All Complaints</button>
    </div>
  `;
  bottomGrid.appendChild(complaintsCard);

  main.appendChild(bottomGrid);

  page.appendChild(main);

  const mobileNav = renderMobileNav('admin');
  page.appendChild(mobileNav);

  return page;
}
