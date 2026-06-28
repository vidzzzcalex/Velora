/* ============================================================
   VELORA — Live Smart Map Feature
   ============================================================ */

import store from '../store.js';
import { createElement } from '../utils.js';
import { renderSidebar, renderMobileNav } from '../components/nav.js';
import mapService from '../services/map-service.js';
import { generateFleetData, generateIncidents, generateWeather, getBusStops, LANDMARKS } from '../services/mock-data.js';

export async function renderLiveMapPage() {
  const user = { name: 'User', avatar: 'U' };
  const page = document.createElement('div');
  page.className = 'page--dashboard';

  const sidebar = renderSidebar('live-map', user);
  page.appendChild(sidebar);

  const main = document.createElement('main');
  main.className = 'main-content--dashboard';
  main.style.cssText = 'padding:0;display:flex;flex-direction:column;';

  // Map header
  const header = document.createElement('div');
  header.style.cssText = 'padding:20px 24px 12px;display:flex;justify-content:space-between;align-items:center;';
  header.innerHTML = `
    <div>
      <h1 style="font-size:20px;font-weight:600;color:#fff;margin:0;">Live Map</h1>
      <p style="font-size:13px;color:#5A5A5A;margin:2px 0 0;">Real-time city transit intelligence</p>
    </div>
    <div class="live-indicator"><span class="live-indicator__dot"></span>LIVE</div>
  `;
  main.appendChild(header);

  // Map container
  const mapContainer = document.createElement('div');
  mapContainer.className = 'map-container map-container--full';
  mapContainer.id = 'smart-map';
  mapContainer.style.cssText = 'flex:1;min-height:500px;border-radius:0;border-left:0;border-right:0;';
  main.appendChild(mapContainer);

  page.appendChild(main);

  // Mobile nav
  const mobileNav = renderMobileNav('live-map');
  page.appendChild(mobileNav);

  // ─── Initialize Map ───
  let mapInitialized = false;
  
  const initMap = async () => {
    if (mapInitialized || !mapContainer.isConnected) return;
    mapInitialized = true;
    
    // Destroy any previous map instance
    if (mapService.isReady()) {
      mapService.destroy();
    }
    
    await mapService.init(mapContainer, {
      center: [28.6139, 77.2090],
      zoom: 13,
    });

    // Add fleet vehicles
    const fleet = generateFleetData();
    fleet.forEach(v => {
      if (v.lat && v.lng) {
        mapService.addLiveVehicle(v.lat, v.lng, {
          popup: `<b>${v.name}</b><br>Route: ${v.route}<br>Status: ${v.status}<br>ETA: ${v.eta}<br>Occupancy: ${v.occupancy}%`,
        });
      }
    });

    // Add incidents
    const incidents = generateIncidents();
    incidents.forEach(inc => {
      const color = inc.severity === 'critical' ? '#EF4444' : inc.severity === 'warning' ? '#F59E0B' : '#3B82F6';
      mapService.addCircleMarker(inc.lat, inc.lng, {
        radius: 10,
        color,
        fillColor: color,
        fillOpacity: 0.4,
        popup: `<b>${inc.title}</b><br>${inc.location}`,
      });
    });

    // Add bus stops
    const stops = getBusStops();
    stops.forEach(stop => {
      mapService.addMarker(stop.lat, stop.lng, {
        color: '#6B7280',
        size: [8, 8],
        popup: `<b>${stop.name}</b>`,
      });
    });      // Add landmarks
      LANDMARKS.forEach(lm => {
      const colors = {
        landmark: '#E8A020',
        hospital: '#EF4444',
        police: '#3B82F6',
        shelter: '#22C55E',
        ev: '#00C4B4',
        parking: '#8B5CF6',
      };
      mapService.addMarker(lm.lat, lm.lng, {
        color: colors[lm.type] || '#6B7280',
        size: [10, 10],
        popup: `<b>${lm.name}</b><br><span style="text-transform:capitalize;color:#888;">${lm.type}</span>`,
      });
    });
  };
  
  setTimeout(initMap, 300);
  
  // Register cleanup for router lifecycle
  page._cleanup = () => {
    if (mapService.isReady()) {
      mapService.destroy();
    }
    mapInitialized = false;
  };

  return page;
}
