/* ============================================================
   VELORA — Digital Twin City Simulation
   ============================================================ */

import { createElement } from '../utils.js';
import { renderSidebar, renderMobileNav } from '../components/nav.js';
import { generateDigitalTwinState } from '../services/mock-data.js';
import notifier from '../components/notification.js';

export async function renderDigitalTwinPage() {
  const user = { name: 'User', avatar: 'U' };
  const page = document.createElement('div');
  page.className = 'page--dashboard';

  const sidebar = renderSidebar('digital-twin', user);
  page.appendChild(sidebar);

  const main = document.createElement('main');
  main.className = 'main-content--dashboard';

  main.innerHTML = `
    <div class="dashboard-header">
      <h1>Digital Twin City</h1>
      <p>Real-time city simulation powered by AI</p>
    </div>
  `;

  // Simulation controls
  const controls = document.createElement('div');
  controls.style.cssText = 'display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;';

  const scenarios = [
    { label: 'Normal', icon: 'normal' },
    { label: 'Heavy Rain', icon: 'rain' },
    { label: 'Festival', icon: 'festival' },
    { label: 'Road Closure', icon: 'closure' },
    { label: 'Accident', icon: 'accident' },
    { label: 'Metro Breakdown', icon: 'breakdown' },
  ];

  scenarios.forEach(s => {
    const btn = document.createElement('button');
    btn.className = `twin-btn${s.label === 'Normal' ? ' twin-btn--active' : ''}`;
    btn.textContent = s.label;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.twin-btn').forEach(b => b.classList.remove('twin-btn--active'));
      btn.classList.add('twin-btn--active');
      notifier.show({
        title: `Simulation: ${s.label}`,
        message: `City model updated to simulate "${s.label}" scenario`,
        type: 'info',
      });
    });
    controls.appendChild(btn);
  });

  main.appendChild(controls);

  // Twin container with Canvas
  const twinContainer = document.createElement('div');
  twinContainer.className = 'twin-container';

  const canvas = document.createElement('canvas');
  canvas.className = 'twin-canvas';
  canvas.id = 'twin-canvas';
  twinContainer.appendChild(canvas);
  main.appendChild(twinContainer);

  // Stats grid
  const state = generateDigitalTwinState();
  const statsGrid = document.createElement('div');
  statsGrid.className = 'grid grid-4';
  statsGrid.style.cssText = 'margin-top:16px;';

  const stats = [
    { label: 'Active Vehicles', value: state.vehicles.length, sub: `${state.vehicles.filter(v => v.type === 'metro').length} metro` },
    { label: 'Traffic Nodes', value: state.trafficNodes.length, sub: `${state.trafficNodes.filter(n => n.congestion > 70).length} congested` },
    { label: 'Crowd Hotspots', value: state.crowdHotspots.length, sub: `${state.crowdHotspots.filter(h => h.density > 70).length} high density` },
    { label: 'Demand Hotspots', value: state.demandHotspots.length, sub: 'Active monitoring' },
  ];

  stats.forEach(s => {
    const card = document.createElement('div');
    card.className = 'kpi-card';
    card.innerHTML = `
      <div class="kpi-card__header">
        <span class="kpi-card__label">${s.label}</span>
      </div>
      <div class="kpi-card__value">${s.value}</div>
      <div class="kpi-card__subtitle">${s.sub}</div>
    `;
    statsGrid.appendChild(card);
  });

  main.appendChild(statsGrid);

  // Demand hotspots
  const demandCard = document.createElement('div');
  demandCard.className = 'card--dark';
  demandCard.style.marginTop = '16px';
  demandCard.innerHTML = `
    <div class="card__title" style="font-size:16px;margin-bottom:16px;">Demand Hotspots</div>
    ${state.demandHotspots.map(h => `
      <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
        <div style="flex:1;font-size:14px;color:#fff;">${h.location}</div>
        <div style="width:120px;height:6px;background:rgba(255,255,255,0.08);border-radius:3px;overflow:hidden;">
          <div style="height:100%;width:${h.demand}%;background:${h.demand > 80 ? '#EF4444' : h.demand > 60 ? '#F59E0B' : '#22C55E'};border-radius:3px;"></div>
        </div>
        <div style="font-family:JetBrains Mono,monospace;font-size:13px;color:#E8A020;min-width:40px;text-align:right;">${h.demand}%</div>
      </div>
    `).join('')}
  `;
  main.appendChild(demandCard);

  page.appendChild(main);

  const mobileNav = renderMobileNav('digital-twin');
  page.appendChild(mobileNav);

  // ─── Canvas Simulation ───
  let simCleanup = null;
  setTimeout(() => { simCleanup = startCanvasSimulation(canvas); }, 500);

  // Register cleanup for router lifecycle
  page._cleanup = () => {
    if (typeof simCleanup === 'function') simCleanup();
  };

  return page;
}

function startCanvasSimulation(canvas) {
  const ctx = canvas.getContext('2d');
  let animFrame;
  let particles = [];

  const resize = () => {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  // Create vehicles
  const vehicleTypes = ['metro', 'bus', 'car', 'rickshaw'];
  for (let i = 0; i < 40; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
      size: Math.random() * 4 + 2,
      color: Math.random() > 0.7 ? '#E8A020' : '#00C4B4',
    });
  }

  // Create traffic nodes (static dots)
  const trafficNodes = [];
  for (let i = 0; i < 20; i++) {
    trafficNodes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      intensity: Math.random(),
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.03)';
    ctx.lineWidth = 1;
    const gridSize = 40;
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw traffic nodes
    trafficNodes.forEach(node => {
      const radius = 3 + node.intensity * 8;
      const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius);
      gradient.addColorStop(0, `rgba(245,158,11,${0.1 + node.intensity * 0.3})`);
      gradient.addColorStop(1, 'rgba(245,158,11,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw roads (connecting lines between traffic nodes)
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let i = 0; i < trafficNodes.length; i += 3) {
      if (i + 1 < trafficNodes.length) {
        ctx.beginPath();
        ctx.moveTo(trafficNodes[i].x, trafficNodes[i].y);
        ctx.lineTo(trafficNodes[i + 1].x, trafficNodes[i + 1].y);
        ctx.stroke();
      }
    }

    // Draw vehicles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off walls
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      // Draw vehicle
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Trail
      ctx.fillStyle = p.color + '20';
      ctx.beginPath();
      ctx.arc(p.x - p.vx * 3, p.y - p.vy * 3, p.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Demand hotspots label
    ctx.fillStyle = 'rgba(232,160,32,0.15)';
    ctx.font = '10px Inter';
    ctx.fillStyle = 'rgba(232,160,32,0.6)';
    const hotspots = [['CP', 0.2, 0.3], ['Central', 0.5, 0.4], ['Saket', 0.7, 0.7], ['Dwarka', 0.3, 0.8]];
    hotspots.forEach(([name, xPct, yPct]) => {
      const x = canvas.width * xPct;
      const y = canvas.height * yPct;
      ctx.fillStyle = 'rgba(232,160,32,0.1)';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(232,160,32,0.5)';
      ctx.textAlign = 'center';
      ctx.fillText(name, x, y + 4);
    });

    animFrame = requestAnimationFrame(animate);
  }

  animate();

  // Cleanup
  return () => {
    cancelAnimationFrame(animFrame);
    window.removeEventListener('resize', resize);
  };
}
