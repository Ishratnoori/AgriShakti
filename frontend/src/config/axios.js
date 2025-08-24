import axios from 'axios';
import { API_BASE_URL, NGROK_URL } from './api';

// Create axios instance for local API
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Create axios instance for ngrok API
export const ngrokClient = axios.create({
  baseURL: NGROK_URL,
  timeout: 15000, // Longer timeout for ngrok
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

ngrokClient.interceptors.request.use(
  (config) => {
    console.log('Ngrok Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Ngrok Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

ngrokClient.interceptors.response.use(
  (response) => {
    console.log('Ngrok Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Ngrok Response Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

// Helper function to make API calls with fallback
export const makeApiCall = async (endpoint, options = {}, useNgrok = false) => {
  const client = useNgrok ? ngrokClient : apiClient;
  
  try {
    const response = await client.get(endpoint, options);
    return response.data;
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    
    // If local API fails and we're not already using ngrok, try ngrok
    if (!useNgrok && error.code === 'ECONNREFUSED') {
      console.log('Local API failed, trying ngrok...');
      return makeApiCall(endpoint, options, true);
    }
    
    throw error;
  }
};

// Helper function for POST requests
export const makePostCall = async (endpoint, data = {}, options = {}, useNgrok = false) => {
  const client = useNgrok ? ngrokClient : apiClient;
  
  try {
    const response = await client.post(endpoint, data, options);
    return response.data;
  } catch (error) {
    console.error(`POST call failed for ${endpoint}:`, error);
    
    // If local API fails and we're not already using ngrok, try ngrok
    if (!useNgrok && error.code === 'ECONNREFUSED') {
      console.log('Local API failed, trying ngrok...');
      return makePostCall(endpoint, data, options, true);
    }
    
    throw error;
  }
};

export default {
  apiClient,
  ngrokClient,
  makeApiCall,
  makePostCall,
};
