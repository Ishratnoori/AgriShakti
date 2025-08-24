// Maps Configuration
export const MAPS_CONFIG = {
  // Primary Google Maps API key
  googleMapsApiKey: 'AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg',
  
  // Alternative API keys (you can add your own valid keys here)
  alternativeKeys: [
    // Add your valid Google Maps API key here
    // 'YOUR_VALID_API_KEY_HERE'
  ],
  
  // Fallback mapping services
  fallbackServices: {
    openStreetMap: true,
    leaflet: true,
    staticMaps: true
  },
  
  // Map settings
  defaultZoom: 15,
  defaultMapType: 'satellite',
  
  // API endpoints
  endpoints: {
    googleMaps: 'https://maps.googleapis.com/maps/api/js',
    openStreetMap: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    staticMaps: 'https://maps.googleapis.com/maps/api/staticmap'
  }
};

// Helper function to get a working API key
export const getWorkingApiKey = () => {
  // For now, return the primary key
  // In production, you should implement key rotation and validation
  return MAPS_CONFIG.googleMapsApiKey;
};

// Helper function to check if Google Maps is available
export const isGoogleMapsAvailable = () => {
  return window.google && window.google.maps;
};

// Helper function to get fallback map URL
export const getFallbackMapUrl = (lat, lng, zoom = 15) => {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=${zoom}`;
};

// Helper function to get static map URL
export const getStaticMapUrl = (lat, lng, zoom = 15, size = '400x300') => {
  const key = getWorkingApiKey();
  return `${MAPS_CONFIG.endpoints.staticMaps}?center=${lat},${lng}&zoom=${zoom}&size=${size}&key=${key}`;
};

export default MAPS_CONFIG;
