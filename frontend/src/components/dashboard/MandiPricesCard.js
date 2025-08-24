import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaStore, FaMapMarkerAlt, FaRupeeSign, FaArrowUp, FaArrowDown, FaSearch, FaLocationArrow, FaTimes, FaFilter, FaDownload, FaCloud, FaNewspaper } from 'react-icons/fa';
import './DashboardCard.css';

const MandiPricesCard = ({ crop }) => {
  // State management
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedCrop, setSelectedCrop] = useState(crop || "");
  const [userLocation, setUserLocation] = useState("");
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [initialMessage, setInitialMessage] = useState("Location access denied. Please select your state manually.");
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [locationInput, setLocationInput] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [cropSuggestions, setCropSuggestions] = useState([]);
  const [showCropSuggestions, setShowCropSuggestions] = useState(false);
  const [smartSearchResults, setSmartSearchResults] = useState("");
  const [showSmartResults, setShowSmartResults] = useState(false);
  const [smartLoading, setSmartLoading] = useState(false);
  const [locationDetecting, setLocationDetecting] = useState(false);

  // Refs
  const locationInputRef = useRef(null);
  const cropInputRef = useRef(null);

  // API Configuration
  const apiKey = "579b464db66ec23bdd000001e1583739ef0340446508923a979788ea";
  const apiUrl = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";
  const LOCATIONIQ_API_KEY = "pk.31743a3955e57a3b56c78a9740833590";

  // States list
  const states = [
    "All States",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  // Crop list
  const cropList = [
    "Apple", "Banana", "Orange", "Mango", "Grapes", "Pomegranate", "Papaya", "Guava", "Pineapple", "Watermelon",
    "Muskmelon", "Sweet Orange", "Mosambi", "Lemon", "Lime", "Coconut", "Dates", "Fig", "Custard Apple", "Dragon Fruit",
    "Rice", "Wheat", "Maize", "Barley", "Bajra", "Jowar", "Ragi", "Oats", "Quinoa", "Millets",
    "Onion", "Potato", "Tomato", "Brinjal", "Okra", "Cabbage", "Cauliflower", "Carrot", "Radish", "Beetroot",
    "Spinach", "Fenugreek", "Coriander", "Mint", "Curry Leaves", "Green Chilli", "Red Chilli", "Capsicum", "Cucumber",
    "Bottle Gourd", "Ridge Gourd", "Bitter Gourd", "Snake Gourd", "Pumpkin", "Sweet Potato", "Yam", "Ginger", "Garlic",
    "Turmeric", "Drumstick", "Cotton", "Sugarcane", "Groundnut", "Sunflower", "Mustard", "Sesame", "Castor", "Soybean",
    "Arhar", "Moong", "Urad", "Chana", "Masoor", "Rajma", "Black Gram", "Green Gram", "Field Pea", "Cowpea",
    "Horse Gram", "Lentil"
  ];

  // City coordinates for distance calculation
  const cityCoordinates = {
    mumbai: { lat: 19.076, lon: 72.8777 },
    pune: { lat: 18.5204, lon: 73.8567 },
    nagpur: { lat: 21.1458, lon: 79.0882 },
    nashik: { lat: 19.9975, lon: 73.7898 },
    aurangabad: { lat: 19.8762, lon: 75.3433 },
    solapur: { lat: 17.6599, lon: 75.9064 },
    amravati: { lat: 20.9374, lon: 77.7796 },
    kolhapur: { lat: 16.705, lon: 74.2433 },
    delhi: { lat: 28.7041, lon: 77.1025 },
    bangalore: { lat: 12.9716, lon: 77.5946 },
    hyderabad: { lat: 17.385, lon: 78.4867 },
    chennai: { lat: 13.0827, lon: 80.2707 },
    kolkata: { lat: 22.5726, lon: 88.3639 },
    ahmedabad: { lat: 23.0225, lon: 72.5714 },
    jaipur: { lat: 26.9124, lon: 75.7873 },
    lucknow: { lat: 26.8467, lon: 80.9462 },
    kanpur: { lat: 26.4499, lon: 80.3319 },
    indore: { lat: 22.7196, lon: 75.8577 },
    bhopal: { lat: 23.2599, lon: 77.4126 },
    patna: { lat: 25.5941, lon: 85.1376 },
    gurgaon: { lat: 28.4595, lon: 77.0266 },
    guwahati: { lat: 26.1445, lon: 91.7362 },
    visakhapatnam: { lat: 17.6868, lon: 83.2185 },
  };

  // Auto-detect location on component mount
  useEffect(() => {
    autoDetectLocation();
  }, []);

  // Auto-detect user location
  const autoDetectLocation = () => {
    if (!navigator.geolocation) {
      setInitialMessage("Geolocation is not supported by your browser. Please select your state manually.");
      return;
    }

    const geoOptions = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoordinates({ lat: latitude, lon: longitude });

        const stateData = getStateFromCoordinates(latitude, longitude);
        if (stateData && stateData.state) {
          setSelectedState(stateData.state);
          setUserLocation(`${stateData.state} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          setInitialMessage(`Location detected: ${stateData.state}. Click Search to view local prices.`);
        } else {
          setUserLocation(`Location detected (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
          setInitialMessage("Location detected but couldn't identify your state automatically. Please select your state from the dropdown below.");
        }
      },
      (error) => {
        let errorText = "Location access denied. Please select your state manually.";
        if (error.code === error.TIMEOUT) {
          errorText = "Location request timed out. Please select your state manually.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorText = "Location information is unavailable. Please select your state manually.";
        }
        setInitialMessage(errorText);
      },
      geoOptions,
    );
  };

  // Get state from coordinates
  const getStateFromCoordinates = (lat, lon) => {
    const stateRanges = [
      { state: "Rajasthan", latMin: 23.0, latMax: 30.2, lonMin: 69.5, lonMax: 78.2 },
      { state: "Maharashtra", latMin: 15.6, latMax: 22.0, lonMin: 72.6, lonMax: 80.9 },
      { state: "Uttar Pradesh", latMin: 23.8, latMax: 30.4, lonMin: 77.1, lonMax: 84.6 },
      { state: "Gujarat", latMin: 20.1, latMax: 24.7, lonMin: 68.2, lonMax: 74.5 },
      { state: "Karnataka", latMin: 11.5, latMax: 18.5, lonMin: 74.1, lonMax: 78.6 },
      { state: "Andhra Pradesh", latMin: 12.6, latMax: 19.9, lonMin: 77.0, lonMax: 84.8 },
      { state: "Tamil Nadu", latMin: 8.1, latMax: 13.6, lonMin: 76.2, lonMax: 80.3 },
      { state: "Madhya Pradesh", latMin: 21.1, latMax: 26.9, lonMin: 74.0, lonMax: 82.8 },
      { state: "West Bengal", latMin: 21.5, latMax: 27.2, lonMin: 85.8, lonMax: 89.9 },
      { state: "Bihar", latMin: 24.3, latMax: 27.5, lonMin: 83.3, lonMax: 88.1 },
      { state: "Punjab", latMin: 29.5, latMax: 32.5, lonMin: 73.9, lonMax: 76.9 },
      { state: "Haryana", latMin: 27.4, latMax: 30.9, lonMin: 74.5, lonMax: 77.6 },
      { state: "Kerala", latMin: 8.2, latMax: 12.8, lonMin: 74.9, lonMax: 77.4 },
      { state: "Odisha", latMin: 17.8, latMax: 22.6, lonMin: 81.4, lonMax: 87.5 },
      { state: "Telangana", latMin: 15.8, latMax: 19.9, lonMin: 77.3, lonMax: 81.8 },
      { state: "Assam", latMin: 24.2, latMax: 28.2, lonMin: 89.7, lonMax: 96.0 },
      { state: "Jharkhand", latMin: 21.9, latMax: 25.3, lonMin: 83.3, lonMax: 87.6 },
      { state: "Chhattisgarh", latMin: 17.8, latMax: 24.1, lonMin: 80.2, lonMax: 84.4 },
      { state: "Himachal Pradesh", latMin: 30.2, latMax: 33.2, lonMin: 75.5, lonMax: 79.0 },
      { state: "Uttarakhand", latMin: 28.4, latMax: 31.4, lonMin: 77.6, lonMax: 81.0 },
    ];

    for (const range of stateRanges) {
      if (lat >= range.latMin && lat <= range.latMax && lon >= range.lonMin && lon <= range.lonMax) {
        return { state: range.state, display_name: `${range.state} (detected from coordinates)` };
      }
    }
    return null;
  };

  // Fetch all data from API
  const fetchAllData = async (filters) => {
    let allRecords = [];
    let offset = 0;
    const limit = 1000;

    while (true) {
      const queryParams = new URLSearchParams({
        "api-key": apiKey,
        format: "json",
        offset: offset.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const response = await fetch(`${apiUrl}?${queryParams}`);
      if (!response.ok) throw new Error(`API request failed: ${response.status}`);

      const data = await response.json();

      if (data.records && data.records.length > 0) {
        allRecords = allRecords.concat(data.records);
        offset += limit;
      } else {
        break;
      }
    }

    return allRecords;
  };

  // Validate and filter data
  const validateAndFilterData = (records) => {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    return records
      .filter((record) => {
        if (!record.commodity || !record.market || !record.state) {
          return false;
        }

        const minPrice = Number.parseFloat(record.min_price) || 0;
        const maxPrice = Number.parseFloat(record.max_price) || 0;
        const modalPrice = Number.parseFloat(record.modal_price) || 0;

        if (minPrice > 50000 || maxPrice > 50000 || modalPrice > 50000) {
          return false;
        }

        if (minPrice <= 0 && maxPrice <= 0 && modalPrice <= 0) {
          return false;
        }

        if (record.arrival_date) {
          try {
            const arrivalDate = new Date(record.arrival_date);
            if (arrivalDate < thirtyDaysAgo) {
              return false;
            }
          } catch (e) {
            // Invalid date format, keep the record
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (a.arrival_date && b.arrival_date) {
          return new Date(b.arrival_date).getTime() - new Date(a.arrival_date).getTime();
        }
        return 0;
      });
  };

  // Fetch data from API
  const fetchData = async (state = selectedState, crop = selectedCrop) => {
    setLoading(true);
    setError("");

    try {
      const filters = {};

      if (state !== "All States") {
        filters["filters[state]"] = state;
      }

      if (crop.trim()) {
        filters["filters[commodity]"] = crop;
      }

      const records = await fetchAllData(filters);
      const validatedRecords = validateAndFilterData(records);

      // Add distance calculations if user coordinates are available
      const recordsWithDistance = validatedRecords.map(record => {
        let distance = "N/A";
        let distanceValue = 0;

        if (userCoordinates) {
          const mandiCoords = getMandiCoordinates(record.market, record.state);
          if (mandiCoords) {
            distanceValue = calculateDistance(
              userCoordinates.lat,
              userCoordinates.lon,
              mandiCoords.lat,
              mandiCoords.lon
            );
            distance = `${distanceValue.toFixed(1)} km`;
          }
        }

        return {
          ...record,
          distance,
          distanceValue
        };
      });

      setPriceData(recordsWithDistance);

      if (validatedRecords.length === 0) {
        setInitialMessage(
          `No records found for ${crop || "selected criteria"} ${state !== "All States" ? `in ${state}` : ""}`
        );
      } else {
        const stateText = state !== "All States" ? ` in ${state}` : "";
        const cropText = crop.trim() ? ` for ${crop}` : "";
        setInitialMessage(`Found ${validatedRecords.length} records${cropText}${stateText}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get mandi coordinates
  const getMandiCoordinates = (market, state) => {
    const searchKey = market
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim();

    if (cityCoordinates[searchKey]) {
      return cityCoordinates[searchKey];
    }

    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (searchKey.includes(city) || city.includes(searchKey)) {
        return coords;
      }
    }

    return null;
  };

  // Generate location suggestions
  const generateLocationSuggestions = async (input) => {
    if (!input || input.length < 2) return [];

    try {
      const url = `https://api.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(input)}&limit=8&format=json&countrycodes=in&addressdetails=1`;
      const response = await fetch(url);

      if (!response.ok) return [];

      const data = await response.json();

      return data.map((item) => {
        const displayParts = [];
        if (item.address?.city || item.address?.town || item.address?.village) {
          displayParts.push(item.address.city || item.address.town || item.address.village);
        }
        if (item.address?.state_district && !displayParts.includes(item.address.state_district)) {
          displayParts.push(item.address.state_district);
        }
        if (item.address?.state && !displayParts.includes(item.address.state)) {
          displayParts.push(item.address.state);
        }

        return {
          name: item.display_name.split(",")[0],
          displayName: displayParts.join(", "),
          fullAddress: item.display_name,
          lat: Number.parseFloat(item.lat),
          lon: Number.parseFloat(item.lon),
        };
      });
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      return [];
    }
  };

  // Generate crop suggestions
  const generateCropSuggestions = (input) => {
    if (!input || input.length < 1) return [];

    const normalizedInput = input.toLowerCase().trim();
    return cropList
      .filter((crop) => crop.toLowerCase().includes(normalizedInput))
      .sort((a, b) => {
        const aIndex = a.toLowerCase().indexOf(normalizedInput);
        const bIndex = b.toLowerCase().indexOf(normalizedInput);
        if (aIndex !== bIndex) return aIndex - bIndex;
        return a.length - b.length;
      })
      .slice(0, 8);
  };

  // Handle location input change
  const handleLocationInputChange = async (value) => {
    setLocationInput(value);

    if (value.length >= 2) {
      setShowLocationSuggestions(true);
      const suggestions = await generateLocationSuggestions(value);
      setLocationSuggestions(suggestions);
      setShowLocationSuggestions(suggestions.length > 0);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  // Handle crop input change
  const handleCropInputChange = (value) => {
    setSelectedCrop(value);
    const suggestions = generateCropSuggestions(value);
    setCropSuggestions(suggestions);
    setShowCropSuggestions(suggestions.length > 0);
  };

  // Handle location suggestion select
  const handleLocationSuggestionSelect = (suggestion) => {
    setLocationInput(suggestion.displayName);
    setUserLocation(suggestion.displayName);
    setUserCoordinates({ lat: suggestion.lat, lon: suggestion.lon });
    setShowLocationSuggestions(false);
  };

  // Handle crop suggestion select
  const handleCropSuggestionSelect = (crop) => {
    setSelectedCrop(crop);
    setShowCropSuggestions(false);
  };

  // Smart search functionality
  const handleSmartSearch = async () => {
    if (!locationInput.trim() || !selectedCrop.trim()) {
      setError("Please enter both location and crop");
      return;
    }

    setSmartLoading(true);
    setShowSmartResults(false);
    setError("");

    try {
      // Find mandis with the selected crop
      const allRecords = await fetchAllData({});
      const cropRecords = allRecords.filter((r) => 
        r.commodity.toLowerCase().trim() === selectedCrop.toLowerCase().trim()
      );

      if (cropRecords.length === 0) {
        throw new Error(`No mandi data found for crop: ${selectedCrop}`);
      }

      // Calculate distances and filter by proximity
      const validMandis = [];
      const MAX_RADIUS_KM = 200;

      for (const record of cropRecords) {
        const mandiCoords = getMandiCoordinates(record.market, record.state);
        if (mandiCoords && userCoordinates) {
          const distance = calculateDistance(
            userCoordinates.lat,
            userCoordinates.lon,
            mandiCoords.lat,
            mandiCoords.lon
          );
          if (distance <= MAX_RADIUS_KM) {
            validMandis.push({
              ...record,
              distance: Math.round(distance * 10) / 10,
              coordinates: mandiCoords,
            });
          }
        }
      }

      if (validMandis.length === 0) {
        setSmartSearchResults(`
          <div class="text-center py-6">
            <p class="text-orange-600 font-semibold mb-2">No mandis found within 200km radius</p>
            <p class="text-gray-600 text-sm">Try searching for a different location or crop, or check back later for updated data.</p>
            <p class="text-xs text-gray-500 mt-2">Searched ${cropRecords.length} records for "${selectedCrop}" within 200km of your location</p>
          </div>
        `);
        setShowSmartResults(true);
        setSmartLoading(false);
        return;
      }

      // Sort by price and display results
      validMandis.sort((a, b) => {
        const priceA = Number.parseFloat(a.modal_price) || 0;
        const priceB = Number.parseFloat(b.modal_price) || 0;
        return priceB - priceA;
      });

      const resultsHtml = `
        <div class="space-y-4">
          <div class="flex items-center gap-3 mb-6">
            <span class="text-3xl">💰</span>
            <h3 class="text-2xl font-semibold text-gray-700">Highest Prices Within 200km:</h3>
          </div>
          
          ${validMandis.slice(0, 10).map((mandi, index) => `
            <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start mb-2">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-lg font-bold text-gray-800">#${index + 1}</span>
                    <h4 class="font-semibold text-gray-900">${mandi.market}, ${mandi.state}</h4>
                  </div>
                  <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <span class="inline-flex items-center gap-1">
                      <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                      ${mandi.commodity}
                    </span>
                    <span class="inline-flex items-center gap-1">
                      <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                      ${mandi.distance} km away
                    </span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-green-600">₹${Number(mandi.modal_price).toLocaleString()}</div>
                  <div class="text-xs text-gray-500">per Quintal</div>
                </div>
              </div>
            </div>
          `).join("")}
          
          <p class="text-center text-sm text-gray-500 mt-4">
            Showing top ${Math.min(validMandis.length, 10)} mandis with highest prices within 200km radius
          </p>
        </div>
      `;

      setSmartSearchResults(resultsHtml);
      setShowSmartResults(true);
    } catch (error) {
      console.error("Smart search error:", error);
      setError(error.message);
      setSmartSearchResults(`<p class="text-red-600">Error: ${error.message}</p>`);
    } finally {
      setSmartLoading(false);
      setShowSmartResults(true);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedState("All States");
    setSelectedCrop("");
    setPriceData([]);
    setError("");
    setInitialMessage("Location access denied. Please select your state manually.");
    setSmartSearchResults("");
    setShowSmartResults(false);
  };

  // Get trend icon
  const getTrendIcon = (trend) => {
    if (trend === 'up') {
      return <FaArrowUp className="trend-icon up" />;
    } else {
      return <FaArrowDown className="trend-icon down" />;
    }
  };

  // Get trend color
  const getTrendColor = (trend) => {
    return trend === 'up' ? 'var(--primary-green)' : 'var(--accent-red)';
  };

  // Get distance color
  const getDistanceColor = (distanceValue) => {
    if (distanceValue < 50) return "text-green-600";
    if (distanceValue < 200) return "text-blue-600";
    return "text-orange-600";
  };

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-green-700">Farmer's Portal</h1>
            </div>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium">
                  Mandi Prices
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:bg-green-100 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Weather
                </a>
                <a
                  href="#"
                  className="text-gray-500 hover:bg-green-100 hover:text-green-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  News
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Smart Search Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🔍</span>
            <h2 className="text-2xl font-semibold text-gray-700">Smart Search: Find the Best Price Nearby</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Location Input */}
            <div className="relative">
              <label htmlFor="location-input" className="block text-sm font-medium text-gray-700 mb-2">
                Your Location:
              </label>
              <div className="relative">
                <input
                  ref={locationInputRef}
                  type="text"
                  id="location-input"
                  placeholder="Enter city, district, or state"
                  value={locationInput}
                  onChange={(e) => handleLocationInputChange(e.target.value)}
                  onFocus={() => {
                    if (locationSuggestions.length > 0) {
                      setShowLocationSuggestions(true)
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowLocationSuggestions(false), 200)
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-red-500" />
                </div>
              </div>

              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {locationSuggestions.map((suggestion, index) => (
                    <button
                      key={`${suggestion.name}-${index}`}
                      onClick={() => handleLocationSuggestionSelect(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          📍
                        </span>
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">{suggestion.displayName}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Crop Input */}
            <div className="relative">
              <label htmlFor="crop-input" className="block text-sm font-medium text-gray-700 mb-2">
                Crop:
              </label>
              <div className="relative">
                <input
                  ref={cropInputRef}
                  type="text"
                  id="crop-input"
                  placeholder="e.g., Apple, Wheat, Rice"
                  value={selectedCrop}
                  onChange={(e) => handleCropInputChange(e.target.value)}
                  onFocus={() => {
                    if (cropSuggestions.length > 0) {
                      setShowCropSuggestions(true)
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowCropSuggestions(false), 200)
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaStore className="text-green-500" />
                </div>
              </div>

              {showCropSuggestions && cropSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {cropSuggestions.map((crop, index) => (
                    <button
                      key={`${crop}-${index}`}
                      onClick={() => handleCropSuggestionSelect(crop)}
                      className="w-full text-left px-4 py-3 hover:bg-green-50 focus:bg-green-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">🌾</span>
                        <span className="font-medium text-gray-900">{crop}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={handleSmartSearch}
              disabled={smartLoading}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 min-w-[200px] justify-center"
            >
              {smartLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <FaSearch className="h-4 w-4" />
                  <span>Find Best Price</span>
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <FaTimes className="text-red-500" />
                <p className="text-red-700 font-medium">Error:</p>
              </div>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          )}

          {showSmartResults && smartSearchResults && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div dangerouslySetInnerHTML={{ __html: smartSearchResults }} />
            </div>
          )}
        </div>

        {/* Traditional Search Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Live Mandi Crop Prices</h2>

          <div className="flex flex-wrap items-end gap-4 mb-6">
            <div>
              <label htmlFor="state-filter" className="block text-sm font-medium text-gray-700">
                State:
              </label>
              <select
                id="state-filter"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              >
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="crop-filter" className="block text-sm font-medium text-gray-700">
                Crop:
              </label>
              <input
                type="text"
                id="crop-filter"
                placeholder="e.g., Wheat"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              />
            </div>

            <button onClick={() => fetchData()} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Search
            </button>

            <button onClick={clearFilters} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
              Clear
            </button>
          </div>

          <div className="overflow-x-auto">
            {loading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
              </div>
            )}

            {error && <div className="text-red-500 text-center p-4 bg-red-100 rounded-md mb-4">{error}</div>}

            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mandi Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Price (₹/Quintal)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Max Price (₹/Quintal)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modal Price (₹/Quintal)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Directions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {priceData.length > 0 ? (
                  priceData.map((record, index) => {
                    let distance = "N/A"
                    let distanceValue = 0

                    if (userCoordinates) {
                      const mandiCoords = getMandiCoordinates(record.market, record.state)
                      if (mandiCoords) {
                        distanceValue = calculateDistance(
                          userCoordinates.lat,
                          userCoordinates.lon,
                          mandiCoords.lat,
                          mandiCoords.lon,
                        )
                        distance = `${distanceValue.toFixed(1)} km`
                      }
                    }

                    const distanceColor =
                      distanceValue < 50 ? "text-green-600" : distanceValue < 200 ? "text-blue-600" : "text-orange-600"

                    return (
                      <tr key={`${record.market}-${record.commodity}-${index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.market}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{record.commodity}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ₹{Number.parseFloat(record.min_price || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ₹{Number.parseFloat(record.max_price || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-700">
                          ₹{Number.parseFloat(record.modal_price || 0).toLocaleString()}
                        </td>
                        <td className={`px-6 py-4 text-sm font-medium ${distanceColor}`}>{distance}</td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => {
                              const destination = encodeURIComponent(`${record.market}, ${record.state}, India`)
                              window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, "_blank")
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full transition-colors"
                          >
                            🗺️ Directions
                          </button>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center p-4 text-gray-500">
                      {initialMessage}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MandiPricesCard;
