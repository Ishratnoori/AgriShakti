// Google Maps API Configuration
// Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual Google Maps API key

export const GOOGLE_MAPS_CONFIG = {
  // Your Google Maps API key - get one from https://console.cloud.google.com/
  API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY',
  
  // Default center coordinates (Pune, India)
  DEFAULT_CENTER: {
    lat: 18.5204,
    lng: 73.8567
  },
  
  // Default zoom level
  DEFAULT_ZOOM: 12,
  
  // Map styles for a cleaner look
  MAP_STYLES: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ]
};

// Instructions for getting a Google Maps API key:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select an existing one
// 3. Enable the following APIs:
//    - Maps JavaScript API
//    - Places API
//    - Geocoding API
// 4. Create credentials (API key)
// 5. Restrict the API key to your domain for security
// 6. Replace 'YOUR_GOOGLE_MAPS_API_KEY' in index.html and this file

export default GOOGLE_MAPS_CONFIG;
