// API Configuration
const API_CONFIG = {
  // Development environment
  development: {
    baseURL: 'http://localhost:8000',
    ngrokURL: process.env.REACT_APP_NGROK_URL || 'https://your-ngrok-url.ngrok.io'
  },
  // Production environment
  production: {
    baseURL: process.env.REACT_APP_API_URL || 'https://your-production-api.com',
    ngrokURL: process.env.REACT_APP_NGROK_URL || 'https://your-ngrok-url.ngrok.io'
  }
};

// Get current environment
const environment = process.env.NODE_ENV || 'development';

// Export the appropriate configuration
export const API_BASE_URL = API_CONFIG[environment].baseURL;
export const NGROK_URL = API_CONFIG[environment].ngrokURL;

// API endpoints
export const API_ENDPOINTS = {
  // Soil Analysis endpoints
  soilAnalysis: (lat, lon) => `/api/soil-analysis/${lat}/${lon}`,
  soilAnalysisPost: '/api/soil-analysis',
  cropHealth: (lat, lon, radius, date, time) => `/api/crop-health/${lat}/${lon}?radius=${radius}&date=${date}&time=${time}`,
  
  // Weather endpoints
  weather: (lat, lon) => `/api/weather/${lat}/${lon}`,
  weatherForecast: (lat, lon) => `/api/weather/forecast/${lat}/${lon}`,
  
  // Mandi prices endpoints
  mandiPrices: (crop) => `/api/mandi-prices/${crop}`,
  
  // Irrigation endpoints
  irrigation: (lat, lon) => `/api/irrigation/${lat}/${lon}`,
  
  // Crop planning endpoints
  cropPlanning: (lat, lon) => `/api/crop-planning/${lat}/${lon}`,
  
  // Market offers endpoints
  marketOffers: (crop) => `/api/market-offers/${crop}`,
  
  // Chatbot endpoints
  chatbot: '/api/chatbot',
};

// Helper function to get full URL
export const getApiUrl = (endpoint, useNgrok = false) => {
  const baseURL = useNgrok ? NGROK_URL : API_BASE_URL;
  return `${baseURL}${endpoint}`;
};

export default API_CONFIG;
