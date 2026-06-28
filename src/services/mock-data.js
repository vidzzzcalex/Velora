/* ============================================================
   VELORA — Mock Data Service
   Note: In production, this would be replaced by real API calls
   ============================================================ */

import { generateId, formatTime } from '../utils.js';

const CITIES = {
  delhi: { name: 'New Delhi', lat: 28.6139, lng: 77.2090, zoom: 12 },
  mumbai: { name: 'Mumbai', lat: 19.0760, lng: 72.8777, zoom: 12 },
  bangalore: { name: 'Bangalore', lat: 12.9716, lng: 77.5946, zoom: 12 },
};

const VEHICLE_NAMES = ['Metro Line 1', 'Metro Line 2', 'Bus 42', 'Bus 17', 'Bus 101', 'E-Rickshaw 23', 'Cable Car A'];
const BUS_STOPS = [
  { name: 'Central Station', lat: 28.6160, lng: 77.2080 },
  { name: 'India Gate', lat: 28.6145, lng: 77.2295 },
  { name: 'Connaught Place', lat: 28.6318, lng: 77.2180 },
  { name: 'Lajpat Nagar', lat: 28.5650, lng: 77.2440 },
  { name: 'Nehru Place', lat: 28.5485, lng: 77.2510 },
  { name: 'Karol Bagh', lat: 28.6480, lng: 77.1900 },
  { name: 'Saket', lat: 28.5280, lng: 77.2180 },
  { name: 'Dwarka', lat: 28.5920, lng: 77.0460 },
  { name: 'Rohini', lat: 28.7330, lng: 77.1220 },
  { name: 'Noida', lat: 28.5800, lng: 77.3200 },
  { name: 'Gurgaon', lat: 28.4595, lng: 77.0266 },
];

const LANDMARKS = [
  { name: 'India Gate', lat: 28.6145, lng: 77.2295, type: 'landmark' },
  { name: 'Red Fort', lat: 28.6562, lng: 77.2410, type: 'landmark' },
  { name: 'Qutub Minar', lat: 28.5244, lng: 77.1855, type: 'landmark' },
  { name: 'Lotus Temple', lat: 28.5535, lng: 77.2588, type: 'landmark' },
  { name: 'AIIMS Hospital', lat: 28.5650, lng: 77.2100, type: 'hospital' },
  { name: 'Police HQ', lat: 28.6200, lng: 77.2150, type: 'police' },
  { name: 'Shelter Home', lat: 28.5900, lng: 77.1900, type: 'shelter' },
  { name: 'EV Station 1', lat: 28.6300, lng: 77.2200, type: 'ev' },
  { name: 'EV Station 2', lat: 28.5600, lng: 77.2400, type: 'ev' },
  { name: 'Parking Plaza', lat: 28.6250, lng: 77.2050, type: 'parking' },
];

const DESTINATIONS = [
  'Central Station', 'India Gate', 'Connaught Place', 'Lajpat Nagar',
  'Nehru Place', 'Karol Bagh', 'Saket', 'Dwarka', 'Rohini', 'Noida', 'Gurgaon',
  'Delhi Airport (T3)', 'ISBT Kashmere Gate', 'Sarojini Nagar', 'Hauz Khas',
  'Chandni Chowk', 'Rajiv Chowk', 'AIIMS', 'IGI Stadium', 'Delhi University',
];

const POPULAR_DESTINATIONS = [
  'India Gate', 'Connaught Place', 'Delhi Airport (T3)', 'Central Station',
  'Lajpat Nagar', 'Saket', 'Noida', 'Gurgaon',
];

// ─── Mock Data Generators ───

export function getCurrentUser() {
  return {
    id: 'user_001',
    name: 'Alex Rivera',
    email: 'alex@velora.city',
    role: 'passenger',
    avatar: 'AR',
    preferences: {
      transportMode: 'transit',
      accessibility: false,
      avoidCrowds: false,
      language: 'en',
    },
  };
}

export function generateFleetData() {
  const statuses = ['on-time', 'delayed', 'arriving', 'departed', 'maintenance'];
  return VEHICLE_NAMES.map((name, i) => ({
    id: `vehicle_${i}`,
    name,
    route: `Route ${Math.floor(Math.random() * 20) + 1}`,
    status: statuses[Math.floor(Math.random() * (statuses.length - 1))],
    eta: `${Math.floor(Math.random() * 15) + 2} min`,
    capacity: Math.floor(Math.random() * 100),
    occupancy: Math.floor(Math.random() * 100),
    driver: `Driver ${i + 1}`,
    lat: 28.6139 + (Math.random() - 0.5) * 0.1,
    lng: 77.2090 + (Math.random() - 0.5) * 0.1,
    lastUpdated: new Date().toISOString(),
  }));
}

export function generateIncidents() {
  const types = ['accident', 'construction', 'closure', 'crowding', 'breakdown'];
  const severities = ['critical', 'warning', 'info'];
  const locations = ['Connaught Place', 'India Gate', 'Lajpat Nagar', 'Karol Bagh', 'Saket', 'Dwarka'];

  return Array.from({ length: 4 }, (_, i) => ({
    id: `incident_${i}`,
    type: types[i % types.length],
    severity: severities[i % severities.length],
    title: [
      'Road accident near intersection',
      'Construction work on main avenue',
      'Road closure due to event',
      'Metro breakdown reported',
    ][i],
    location: locations[i % locations.length],
    description: `${locations[i % locations.length]} area affected. Authorities are responding.`,
    time: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    lat: 28.6139 + (Math.random() - 0.5) * 0.08,
    lng: 77.2090 + (Math.random() - 0.5) * 0.08,
    status: 'active',
  }));
}

export function generateWeather() {
  const conditions = ['clear', 'cloudy', 'rainy', 'foggy'];
  return {
    condition: conditions[Math.floor(Math.random() * conditions.length)],
    temperature: Math.floor(Math.random() * 15) + 22,
    humidity: Math.floor(Math.random() * 30) + 50,
    windSpeed: Math.floor(Math.random() * 20) + 5,
    visibility: Math.floor(Math.random() * 5) + 3,
    feelsLike: Math.floor(Math.random() * 10) + 25,
    icon: 'cloud-sun',
  };
}

export function generateJourneyOptions(source, destination, preferences = {}) {
  const baseDuration = Math.floor(Math.random() * 40) + 15;
  const routes = [
    {
      id: generateId(),
      type: 'fastest',
      label: 'Fastest Route',
      duration: baseDuration,
      fare: Math.floor(Math.random() * 50) + 20,
      walkingDistance: Math.floor(Math.random() * 500) + 100,
      congestion: Math.floor(Math.random() * 30) + 10,
      confidence: Math.floor(Math.random() * 15) + 80,
      carbon: Math.floor(Math.random() * 500) + 200,
      transfers: Math.floor(Math.random() * 2),
      description: 'Via metro — minimal waiting time',
      transport: ['Metro Line 2', 'Bus 42'],
      color: '#00C4B4',
    },
    {
      id: generateId(),
      type: 'cheapest',
      label: 'Cheapest Route',
      duration: baseDuration + Math.floor(Math.random() * 20) + 10,
      fare: Math.floor(Math.random() * 15) + 5,
      walkingDistance: Math.floor(Math.random() * 800) + 300,
      congestion: Math.floor(Math.random() * 40) + 30,
      confidence: Math.floor(Math.random() * 10) + 75,
      carbon: Math.floor(Math.random() * 300) + 150,
      transfers: Math.floor(Math.random() * 3) + 1,
      description: 'Via bus — most economical',
      transport: ['Bus 17', 'Bus 101'],
      color: '#22C55E',
    },
    {
      id: generateId(),
      type: 'least-crowded',
      label: 'Least Crowded',
      duration: baseDuration + Math.floor(Math.random() * 15) + 5,
      fare: Math.floor(Math.random() * 40) + 30,
      walkingDistance: Math.floor(Math.random() * 600) + 200,
      congestion: Math.floor(Math.random() * 10) + 5,
      confidence: Math.floor(Math.random() * 12) + 82,
      carbon: Math.floor(Math.random() * 400) + 250,
      transfers: Math.floor(Math.random() * 1),
      description: 'Optimal timing — low occupancy',
      transport: ['Bus 42'],
      color: '#E8A020',
    },
    {
      id: generateId(),
      type: 'safest',
      label: 'Safest Route',
      duration: baseDuration + Math.floor(Math.random() * 10) + 8,
      fare: Math.floor(Math.random() * 30) + 25,
      walkingDistance: Math.floor(Math.random() * 400) + 100,
      congestion: Math.floor(Math.random() * 25) + 15,
      confidence: Math.floor(Math.random() * 10) + 85,
      carbon: Math.floor(Math.random() * 350) + 200,
      transfers: Math.floor(Math.random() * 2),
      description: 'Well-lit, high surveillance area',
      transport: ['Metro Line 1'],
      color: '#3B82F6',
    },
    {
      id: generateId(),
      type: 'eco-friendly',
      label: 'Eco-Friendly',
      duration: baseDuration + Math.floor(Math.random() * 25) + 15,
      fare: Math.floor(Math.random() * 20) + 10,
      walkingDistance: Math.floor(Math.random() * 1000) + 500,
      congestion: Math.floor(Math.random() * 20) + 10,
      confidence: Math.floor(Math.random() * 15) + 78,
      carbon: Math.floor(Math.random() * 100) + 50,
      transfers: Math.floor(Math.random() * 2),
      description: 'Electric transport — zero emissions',
      transport: ['E-Rickshaw 23', 'E-Bus 5'],
      color: '#22C55E',
    },
    {
      id: generateId(),
      type: 'accessible',
      label: 'Wheelchair Accessible',
      duration: baseDuration + Math.floor(Math.random() * 15) + 10,
      fare: Math.floor(Math.random() * 25) + 20,
      walkingDistance: Math.floor(Math.random() * 200) + 50,
      congestion: Math.floor(Math.random() * 20) + 10,
      confidence: Math.floor(Math.random() * 10) + 88,
      carbon: Math.floor(Math.random() * 300) + 180,
      transfers: Math.floor(Math.random() * 1),
      description: 'Full wheelchair accessibility',
      transport: ['Metro Line 2'],
      color: '#8B5CF6',
    },
  ];

  // Filter based on preferences
  if (preferences.accessibility) {
    return [routes.find(r => r.type === 'accessible') || routes[0]];
  }
  if (preferences.avoidCrowds) {
    return [routes.find(r => r.type === 'least-crowded') || routes[0]];
  }
  if (preferences.budget && preferences.budget < 20) {
    return [routes.find(r => r.type === 'cheapest') || routes[0]];
  }
  if (preferences.safety) {
    return [routes.find(r => r.type === 'safest') || routes[0]];
  }

  return routes;
}

export function generateAIResponse(message, context = []) {
  const lower = message.toLowerCase();
  let response = '';

  if (lower.includes('college') || lower.includes('university') || lower.includes('school')) {
    response = "I'll find you the best route to your campus. Based on current traffic, the Metro Line 2 from Central Station is your fastest option. Estimated travel time: 28 minutes. Departure recommendation: within the next 10 minutes to avoid the 9 AM rush.";
  } else if (lower.includes('crowd') || lower.includes('crowded') || lower.includes('busy')) {
    response = "I understand you'd prefer a less crowded journey. The Metro Line 1 at this hour has 40% occupancy — significantly lower than buses. Route via Saket has the lowest crowd density today. Would you like me to plan that route?";
  } else if (lower.includes('safe') || lower.includes('safety') || lower.includes('night')) {
    response = "Your safety is our priority. For tonight, I recommend the Well-Lit Route via Connaught Place — it has 24/7 surveillance and police patrolling. The Metro is also available until 11 PM. I can share your live location with trusted contacts if you'd like.";
  } else if (lower.includes('wheelchair') || lower.includes('grandmother') || lower.includes('accessible') || lower.includes('access')) {
    response = "Absolutely — I've found wheelchair-accessible routes for you. Metro Line 2 has full accessibility features including ramps and elevators. Bus 17 also has low-floor entry. Both stops near your location are wheelchair-friendly.";
  } else if (lower.includes('rain') || lower.includes('weather') || lower.includes('umbrella')) {
    response = "Looking at the weather forecast, there's a 70% chance of rain in the next 2 hours. I recommend covered routes — Metro Line 1 has protected entry/exit at all stations. Bus stops on Route 42 also have shelters. Would you like an indoor walking route?";
  } else if (lower.includes('empty') || lower.includes('seat') || lower.includes('space')) {
    response = "Checking real-time occupancy... Bus 42 currently has 12 seats available (28% occupancy). Metro Line 2 has moderate occupancy at 45%. The most comfortable option right now would be Bus 42 — it departs in 6 minutes from Central Station.";
  } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    response = "Welcome to VELORA. I'm your mobility assistant. I can help you plan journeys, check real-time transit, find safe routes, or optimize for your preferences. Where would you like to go today?";
  } else if (lower.includes('help') || lower.includes('what can you')) {
    response = "I can help you with: planning journeys across all transit modes, finding the fastest/cheapest/safest routes, checking real-time vehicle occupancy, getting weather-aware recommendations, and providing accessibility information. Just tell me where you'd like to go!";
  } else if (lower.includes('emergency') || lower.includes('help me') || lower.includes('sos')) {
    response = "🚨 Emergency assistance is available. I can: (1) Share your live location with emergency contacts, (2) Find the nearest hospital or police station, (3) Alert nearby security services. Please confirm what kind of assistance you need. Your safety is our top priority.";
  } else {
    const responses = [
      "I've analyzed current traffic patterns. The optimal route from your location uses Metro Line 2 with an estimated 22-minute travel time. Congestion is moderate (35%). Would you like me to book this route?",
      "Based on your preferences and real-time data, I recommend taking Bus 42 from Central Station. It's the most efficient option with only 8 minutes waiting time and comfortable occupancy levels.",
      "I can find you the best route. Currently, the Metro network is operating at 94% efficiency. Bus services are running on schedule. Would you prefer the fastest route or the most economical option?",
      "Looking at your frequent destinations, you might want to head to Central Station or India Gate area. Traffic is light on your usual route today. Estimated travel time: 18 minutes via the usual metro connection.",
    ];
    response = responses[Math.floor(Math.random() * responses.length)];
  }

  return {
    id: generateId(),
    text: response,
    suggestions: generateSuggestions(message),
    timestamp: new Date().toISOString(),
  };
}

function generateSuggestions(message) {
  const lower = message.toLowerCase();
  const allSuggestions = [
    'Show me the fastest route',
    'What is the cheapest option?',
    'Is it safe to travel now?',
    'Check weather for my route',
    'Find wheelchair-accessible routes',
    'Show nearby bus stops',
    'How crowded is the metro?',
    'Plan journey for tomorrow',
    'Save this as favorite route',
    'Share my live location',
  ];

  return allSuggestions.sort(() => Math.random() - 0.5).slice(0, 3);
}

export function generateCommunityReports() {
  const reports = [
    {
      id: generateId(),
      type: 'overcrowding',
      title: 'Bus 42 overcrowded during peak hours',
      location: 'Central Station',
      status: 'verified',
      time: new Date(Date.now() - 1800000).toISOString(),
      votes: 24,
    },
    {
      id: generateId(),
      type: 'road-damage',
      title: 'Pothole on MG Road causing delays',
      location: 'MG Road, near Lajpat Nagar',
      status: 'verified',
      time: new Date(Date.now() - 3600000).toISOString(),
      votes: 18,
    },
    {
      id: generateId(),
      type: 'broken-stop',
      title: 'Bus stop shelter damaged at Saket',
      location: 'Saket Bus Stop',
      status: 'pending',
      time: new Date(Date.now() - 7200000).toISOString(),
      votes: 7,
    },
    {
      id: generateId(),
      type: 'unsafe-area',
      title: 'Poor lighting near Dwarka walkway',
      location: 'Dwarka Sector 12',
      status: 'verified',
      time: new Date(Date.now() - 14400000).toISOString(),
      votes: 31,
    },
    {
      id: generateId(),
      type: 'delay',
      title: 'Metro Line 1 delayed by 12 minutes',
      location: 'Metro Line 1, all stations',
      status: 'resolved',
      time: new Date(Date.now() - 28800000).toISOString(),
      votes: 56,
    },
  ];
  return reports;
}

export function generateAnalyticsData() {
  return {
    averageCommute: 34,
    waitingTimeSaved: 12,
    carbonReduction: 2840,
    fuelSaved: 1250,
    publicTransitUsage: 72,
    citizenSatisfaction: 87,
    routePerformance: [
      { route: 'Metro Line 1', onTime: 94, ridership: 45200 },
      { route: 'Route 42', onTime: 88, ridership: 12800 },
      { route: 'Route 17', onTime: 82, ridership: 9600 },
      { route: 'Metro Line 2', onTime: 96, ridership: 38100 },
      { route: 'E-Rickshaw 23', onTime: 76, ridership: 3200 },
    ],
    hourlyDemand: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      demand: Math.floor(Math.random() * 800) + (i >= 7 && i <= 10 ? 400 : i >= 17 && i <= 20 ? 300 : 100),
    })),
    dailyRidership: Array.from({ length: 7 }, (_, i) => ({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      riders: Math.floor(Math.random() * 50000) + 30000,
    })),
    incidentTrend: [
      { month: 'Jan', count: 45 },
      { month: 'Feb', count: 38 },
      { month: 'Mar', count: 52 },
      { month: 'Apr', count: 41 },
      { month: 'May', count: 33 },
      { month: 'Jun', count: 28 },
    ],
  };
}

export function generateDigitalTwinState() {
  return {
    vehicles: Array.from({ length: 30 }, (_, i) => ({
      id: `twin_vehicle_${i}`,
      type: i < 10 ? 'metro' : i < 20 ? 'bus' : 'rickshaw',
      lat: 28.6139 + (Math.random() - 0.5) * 0.15,
      lng: 77.2090 + (Math.random() - 0.5) * 0.15,
      direction: Math.random() * 360,
      speed: Math.random() * 40 + 10,
      occupancy: Math.floor(Math.random() * 100),
      route: `Route ${Math.floor(Math.random() * 10) + 1}`,
    })),
    trafficNodes: Array.from({ length: 15 }, (_, i) => ({
      id: `traffic_${i}`,
      lat: 28.6139 + (Math.random() - 0.5) * 0.12,
      lng: 77.2090 + (Math.random() - 0.5) * 0.12,
      congestion: Math.floor(Math.random() * 100),
    })),
    crowdHotspots: Array.from({ length: 8 }, (_, i) => ({
      id: `crowd_${i}`,
      lat: 28.6139 + (Math.random() - 0.5) * 0.1,
      lng: 77.2090 + (Math.random() - 0.5) * 0.1,
      density: Math.floor(Math.random() * 100),
      location: BUS_STOPS[i]?.name || `Area ${i}`,
    })),
    demandHotspots: [
      { location: 'Connaught Place', demand: 87 },
      { location: 'Central Station', demand: 92 },
      { location: 'India Gate', demand: 76 },
      { location: 'Lajpat Nagar', demand: 68 },
      { location: 'Saket', demand: 71 },
    ],
  };
}

export function generateSavedJourneys() {
  return [
    {
      id: generateId(),
      name: 'Work Route',
      from: 'Lajpat Nagar',
      to: 'Connaught Place',
      duration: 24,
      favorite: true,
      frequency: 'daily',
    },
    {
      id: generateId(),
      name: 'Gym Route',
      from: 'Lajpat Nagar',
      to: 'Saket',
      duration: 15,
      favorite: true,
      frequency: 'weekdays',
    },
    {
      id: generateId(),
      name: 'Weekend Market',
      from: 'Lajpat Nagar',
      to: 'Karol Bagh',
      duration: 35,
      favorite: false,
      frequency: 'weekly',
    },
  ];
}

export function generateRecentTrips() {
  const trips = [
    { from: 'Lajpat Nagar', to: 'Connaught Place', date: new Date(Date.now() - 86400000).toISOString(), duration: 26, fare: 20, mode: 'metro' },
    { from: 'Connaught Place', to: 'Saket', date: new Date(Date.now() - 172800000).toISOString(), duration: 18, fare: 15, mode: 'bus' },
    { from: 'Saket', to: 'Lajpat Nagar', date: new Date(Date.now() - 259200000).toISOString(), duration: 12, fare: 10, mode: 'rickshaw' },
    { from: 'Lajpat Nagar', to: 'Delhi Airport', date: new Date(Date.now() - 432000000).toISOString(), duration: 45, fare: 80, mode: 'metro' },
    { from: 'Delhi Airport', to: 'Karol Bagh', date: new Date(Date.now() - 604800000).toISOString(), duration: 38, fare: 60, mode: 'cab' },
  ];
  return trips;
}

export function generateNotifications() {
  return [
    {
      id: generateId(),
      title: 'Route Update',
      message: 'Bus 42 is running 5 minutes late due to traffic',
      type: 'warning',
      read: false,
      time: new Date(Date.now() - 600000).toISOString(),
    },
    {
      id: generateId(),
      title: 'Weather Alert',
      message: 'Light rain expected in your area in 30 minutes',
      type: 'info',
      read: false,
      time: new Date(Date.now() - 1200000).toISOString(),
    },
    {
      id: generateId(),
      title: 'Reward Earned',
      message: 'You saved 2.4kg CO2 this week — 50 points earned!',
      type: 'success',
      read: false,
      time: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: generateId(),
      title: 'Service Restored',
      message: 'Metro Line 1 is now operating normally after maintenance',
      type: 'success',
      read: true,
      time: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: generateId(),
      title: 'Safety Alert',
      message: 'Incident reported near Connaught Place. Avoid the area if possible.',
      type: 'critical',
      read: true,
      time: new Date(Date.now() - 14400000).toISOString(),
    },
  ];
}

export function generateAdminMetrics() {
  return {
    activeFleet: 64,
    vehiclesInService: 58,
    vehiclesMaintenance: 6,
    driversOnline: 48,
    totalRevenue: 284500,
    dailyRevenue: 12480,
    openComplaints: 23,
    resolvedToday: 8,
    averageResponseTime: 4.2,
    fleetHealth: 91,
    onTimePerformance: 89,
    passengerSatisfaction: 87,
  };
}

export function searchDestinations(query) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return DESTINATIONS.filter(d => d.toLowerCase().includes(q));
}

export function getPopularDestinations() {
  return POPULAR_DESTINATIONS;
}

export function getBusStops() {
  return BUS_STOPS;
}

export function getLandmarks() {
  return LANDMARKS;
}

export { BUS_STOPS, DESTINATIONS, POPULAR_DESTINATIONS, LANDMARKS, VEHICLE_NAMES };
