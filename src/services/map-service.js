/* ============================================================
   VELORA — Map Service (Leaflet Integration)
   ============================================================ */

let L = null;
let leafletPromise = null;

class MapService {
  constructor() {
    this.map = null;
    this.layers = new Map();
    this.markers = new Map();
    this._ready = false;
  }

  async init(mapElement, options = {}) {
    if (this._ready) return;

    // Load Leaflet dynamically
    if (!leafletPromise) {
      leafletPromise = new Promise((resolve) => {
        if (window.L) {
          L = window.L;
          resolve(L);
          return;
        }
        const check = () => {
          if (window.L) {
            L = window.L;
            resolve(L);
            return;
          }
          setTimeout(check, 100);
        };
        check();
      });
    }

    L = await leafletPromise;
    if (!L) return;

    const defaultOptions = {
      center: [28.6139, 77.2090],
      zoom: 12,
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: true,
    };

    const config = { ...defaultOptions, ...options };

    this.map = L.map(mapElement, {
      center: config.center,
      zoom: config.zoom,
      zoomControl: false,
      attributionControl: true,
      scrollWheelZoom: config.scrollWheelZoom,
    });

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(this.map);

    // Zoom controls
    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    this._ready = true;
    return this.map;
  }

  isReady() {
    return this._ready && this.map !== null;
  }

  setView(center, zoom) {
    if (!this.isReady()) return;
    this.map.setView(center, zoom, { animate: true, duration: 0.5 });
  }

  addMarker(lat, lng, options = {}) {
    if (!this.isReady()) return null;
    const {
      icon = null,
      popup = null,
      draggable = false,
      id = null,
      color = '#E8A020',
      size = [12, 12],
    } = options;

    let markerIcon = icon;
    if (!icon) {
      markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="width:${size[0]}px;height:${size[1]}px;background:${color};border:2px solid #fff;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: size,
        iconAnchor: [size[0] / 2, size[1] / 2],
        popupAnchor: [0, -size[1] / 2],
      });
    }

    const marker = L.marker([lat, lng], {
      icon: markerIcon,
      draggable,
    }).addTo(this.map);

    if (popup) {
      marker.bindPopup(popup, {
        className: 'velora-popup',
        closeButton: true,
      });
    }

    const key = id || `marker_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    this.markers.set(key, marker);
    return marker;
  }

  addCircleMarker(lat, lng, options = {}) {
    if (!this.isReady()) return null;
    const {
      radius = 8,
      color = '#E8A020',
      fillColor = '#E8A020',
      fillOpacity = 0.3,
      popup = null,
      id = null,
    } = options;

    const circle = L.circleMarker([lat, lng], {
      radius,
      color,
      fillColor,
      fillOpacity,
      weight: 2,
    }).addTo(this.map);

    if (popup) {
      circle.bindPopup(popup, {
        className: 'velora-popup',
        closeButton: true,
      });
    }

    const key = id || `circle_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    this.markers.set(key, circle);
    return circle;
  }

  addPolyline(points, options = {}) {
    if (!this.isReady()) return null;
    const {
      color = '#00C4B4',
      weight = 3,
      opacity = 0.8,
      dashArray = null,
      id = null,
    } = options;

    const polyline = L.polyline(points, {
      color,
      weight,
      opacity,
      dashArray,
      smoothFactor: 1,
    }).addTo(this.map);

    const key = id || `polyline_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    this.markers.set(key, polyline);
    return polyline;
  }

  // Heatmap requires Leaflet.heat plugin — disabled until plugin is loaded
  // addHeatmap(points, options = {}) { ... }

  removeLayer(id) {
    const layer = this.markers.get(id);
    if (layer && this.map) {
      this.map.removeLayer(layer);
      this.markers.delete(id);
    }
  }

  clearAllMarkers() {
    if (!this.map) return;
    this.markers.forEach((marker) => {
      this.map.removeLayer(marker);
    });
    this.markers.clear();
  }

  addLiveVehicle(lat, lng, options = {}) {
    return this.addCircleMarker(lat, lng, {
      radius: 6,
      color: '#00C4B4',
      fillColor: '#00C4B4',
      fillOpacity: 0.8,
      ...options,
    });
  }

  fitBounds(points) {
    if (!this.isReady() || points.length === 0) return;
    const bounds = L.latLngBounds(points);
    this.map.fitBounds(bounds, { padding: [50, 50] });
  }

  destroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    this.layers.clear();
    this.markers.clear();
    this._ready = false;
  }
}

export const mapService = new MapService();
export default mapService;
