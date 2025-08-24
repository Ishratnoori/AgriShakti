import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaChevronDown, FaTimes, FaCheck, FaCrosshairs } from 'react-icons/fa';
import MapComponent from './dashboard/MapComponent';
import './LocationDropdown.css';

const LocationDropdown = ({ onLocationSelect, currentLocation = null, isOpen = false, onToggle }) => {
  const [selectedLocation, setSelectedLocation] = useState(currentLocation);
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 18.5204, lng: 73.8567 }); // Default to Pune
  const [coordinates, setCoordinates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  // Map refs are no longer needed with MapComponent

  // Predefined list of popular farming locations in India
  const availableLocations = [
    { id: 1, name: 'Pune, Maharashtra', coordinates: { lat: 18.5204, lng: 73.8567 }, state: 'Maharashtra' },
    { id: 2, name: 'Nashik, Maharashtra', coordinates: { lat: 19.9975, lng: 73.7898 }, state: 'Maharashtra' },
    { id: 3, name: 'Aurangabad, Maharashtra', coordinates: { lat: 19.8762, lng: 75.3433 }, state: 'Maharashtra' },
    { id: 4, name: 'Solapur, Maharashtra', coordinates: { lat: 17.6599, lng: 75.9064 }, state: 'Maharashtra' },
    { id: 5, name: 'Amravati, Maharashtra', coordinates: { lat: 20.9374, lng: 77.7796 }, state: 'Maharashtra' },
    { id: 6, name: 'Kolhapur, Maharashtra', coordinates: { lat: 16.705, lng: 74.2433 }, state: 'Maharashtra' },
    { id: 7, name: 'Nagpur, Maharashtra', coordinates: { lat: 21.1458, lng: 79.0882 }, state: 'Maharashtra' },
    { id: 8, name: 'Mumbai, Maharashtra', coordinates: { lat: 19.076, lng: 72.8777 }, state: 'Maharashtra' },
    { id: 9, name: 'Delhi, Delhi', coordinates: { lat: 28.7041, lng: 77.1025 }, state: 'Delhi' },
    { id: 10, name: 'Bangalore, Karnataka', coordinates: { lat: 12.9716, lng: 77.5946 }, state: 'Karnataka' },
    { id: 11, name: 'Hyderabad, Telangana', coordinates: { lat: 17.385, lng: 78.4867 }, state: 'Telangana' },
    { id: 12, name: 'Chennai, Tamil Nadu', coordinates: { lat: 13.0827, lng: 80.2707 }, state: 'Tamil Nadu' },
    { id: 13, name: 'Kolkata, West Bengal', coordinates: { lat: 22.5726, lng: 88.3639 }, state: 'West Bengal' },
    { id: 14, name: 'Ahmedabad, Gujarat', coordinates: { lat: 23.0225, lng: 72.5714 }, state: 'Gujarat' },
    { id: 15, name: 'Jaipur, Rajasthan', coordinates: { lat: 26.9124, lng: 75.7873 }, state: 'Rajasthan' },
    { id: 16, name: 'Lucknow, Uttar Pradesh', coordinates: { lat: 26.8467, lng: 80.9462 }, state: 'Uttar Pradesh' },
    { id: 17, name: 'Kanpur, Uttar Pradesh', coordinates: { lat: 26.4499, lng: 80.3319 }, state: 'Uttar Pradesh' },
    { id: 18, name: 'Indore, Madhya Pradesh', coordinates: { lat: 22.7196, lng: 75.8577 }, state: 'Madhya Pradesh' },
    { id: 19, name: 'Bhopal, Madhya Pradesh', coordinates: { lat: 23.2599, lng: 77.4126 }, state: 'Madhya Pradesh' },
    { id: 20, name: 'Patna, Bihar', coordinates: { lat: 25.5941, lng: 85.1376 }, state: 'Bihar' },
    { id: 21, name: 'Gurgaon, Haryana', coordinates: { lat: 28.4595, lng: 77.0266 }, state: 'Haryana' },
    { id: 22, name: 'Guwahati, Assam', coordinates: { lat: 26.1445, lng: 91.7362 }, state: 'Assam' },
    { id: 23, name: 'Visakhapatnam, Andhra Pradesh', coordinates: { lat: 17.6868, lng: 83.2185 }, state: 'Andhra Pradesh' },
    { id: 24, name: 'Coimbatore, Tamil Nadu', coordinates: { lat: 11.0168, lng: 76.9558 }, state: 'Tamil Nadu' },
    { id: 25, name: 'Vadodara, Gujarat', coordinates: { lat: 22.3072, lng: 73.1812 }, state: 'Gujarat' },
    { id: 26, name: 'Bhubaneswar, Odisha', coordinates: { lat: 20.2961, lng: 85.8245 }, state: 'Odisha' },
    { id: 27, name: 'Chandigarh, Chandigarh', coordinates: { lat: 30.7333, lng: 76.7794 }, state: 'Chandigarh' },
    { id: 28, name: 'Dehradun, Uttarakhand', coordinates: { lat: 30.3165, lng: 78.0322 }, state: 'Uttarakhand' },
    { id: 29, name: 'Shimla, Himachal Pradesh', coordinates: { lat: 31.1048, lng: 77.1734 }, state: 'Himachal Pradesh' },
    { id: 30, name: 'Srinagar, Jammu & Kashmir', coordinates: { lat: 34.0837, lng: 74.7973 }, state: 'Jammu & Kashmir' }
  ];

  // Map will be handled by MapComponent

  useEffect(() => {
    if (currentLocation) {
      setSelectedLocation(currentLocation);
      if (currentLocation.coordinates) {
        setCoordinates(currentLocation.coordinates);
        setMapCenter(currentLocation.coordinates);
      }
    }
  }, [currentLocation]);

  // Map initialization is now handled by MapComponent

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setCoordinates(location.coordinates);
    setMapCenter(location.coordinates);
    setShowMap(true);
    setError('');
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const coords = { lat, lng };
        
        setCoordinates(coords);
        setMapCenter(coords);
        setShowMap(true);
        setIsLoading(false);
        
        // Find the closest predefined location
        const closestLocation = findClosestLocation(coords);
        if (closestLocation) {
          setSelectedLocation(closestLocation);
        }
        
        if (mapRef.current && window.google) {
          initializeMap();
        }
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError('Location access denied. Please enable location services.');
            break;
          case error.POSITION_UNAVAILABLE:
            setError('Location information unavailable.');
            break;
          case error.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An unknown error occurred.');
            break;
        }
      }
    );
  };

  const findClosestLocation = (userCoords) => {
    let closest = null;
    let minDistance = Infinity;

    availableLocations.forEach(location => {
      const distance = calculateDistance(
        userCoords.lat, userCoords.lng,
        location.coordinates.lat, location.coordinates.lng
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closest = location;
      }
    });

    return closest;
  };

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

  const handleConfirmLocation = () => {
    if (!selectedLocation || !coordinates) {
      setError('Please select a location from the list or use current location.');
      return;
    }

    const locationData = {
      id: selectedLocation.id,
      name: selectedLocation.name,
      address: selectedLocation.name,
      coordinates: coordinates,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      state: selectedLocation.state
    };

    onLocationSelect(locationData);
    onToggle(false);
  };

  const handleCustomLocation = () => {
    if (coordinates) {
      const customLocation = {
        id: 'custom',
        name: `Custom Location (${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)})`,
        address: `Custom Location (${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)})`,
        coordinates: coordinates,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        state: 'Custom'
      };
      
      onLocationSelect(customLocation);
      onToggle(false);
    }
  };

  return (
    <div className="location-dropdown-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="location-dropdown-overlay"
            onClick={() => onToggle(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="location-dropdown-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="location-dropdown-header">
                <h3 className="location-dropdown-title">
                  <FaMapMarkerAlt className="location-icon" />
                  Update Farm Location
                </h3>
                <button 
                  className="location-dropdown-close"
                  onClick={() => onToggle(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="location-dropdown-content">
                <div className="location-section">
                  <div className="location-section-header">
                    <h4>Select from Popular Locations</h4>
                    <button
                      onClick={getCurrentLocation}
                      className="current-location-btn"
                      disabled={isLoading}
                    >
                      <FaCrosshairs />
                      {isLoading ? 'Detecting...' : 'Use Current Location'}
                    </button>
                  </div>

                  <div className="location-list">
                    {availableLocations.map((location) => (
                      <motion.button
                        key={location.id}
                        className={`location-item ${selectedLocation?.id === location.id ? 'selected' : ''}`}
                        onClick={() => handleLocationSelect(location)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <FaMapMarkerAlt className="location-item-icon" />
                        <div className="location-item-details">
                          <span className="location-item-name">{location.name}</span>
                          <span className="location-item-state">{location.state}</span>
                        </div>
                        {selectedLocation?.id === location.id && (
                          <FaCheck className="location-item-check" />
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="map-section">
                  <div className="map-section-header">
                    <h4>Location Preview</h4>
                    <button
                      onClick={() => setShowMap(!showMap)}
                      className="toggle-map-btn"
                    >
                      {showMap ? 'Hide Map' : 'Show Map'}
                    </button>
                  </div>

                  {showMap && (
                    <motion.div
                      className="map-container"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <MapComponent
                        latitude={coordinates?.lat || mapCenter.lat}
                        longitude={coordinates?.lng || mapCenter.lng}
                        title="Farm Location"
                        showRadius={false}
                        height="350px"
                        onLocationChange={(newLat, newLng) => {
                          console.log('Location changed to:', newLat, newLng);
                          setCoordinates({ lat: newLat, lng: newLng });
                          setMapCenter({ lat: newLat, lng: newLng });
                        }}
                      />
                      {/* Debug info */}
                      <div style={{ fontSize: '12px', color: '#666', padding: '8px', background: '#f0f0f0', marginTop: '8px', borderRadius: '4px' }}>
                        Debug: Lat: {coordinates?.lat || mapCenter.lat}, Lng: {coordinates?.lng || mapCenter.lng}
                      </div>
                      <div className="map-instructions">
                        <p><strong>💡 Tip:</strong> Click on the map to set a custom farm location</p>
                        <p><strong>📍 Use:</strong> Popular locations above or click on map for custom coordinates</p>
                      </div>
                    </motion.div>
                  )}

                  {coordinates && (
                    <div className="coordinates-display">
                      <div className="coordinate-item">
                        <span className="coordinate-label">Latitude:</span>
                        <span className="coordinate-value">{coordinates.lat.toFixed(6)}</span>
                      </div>
                      <div className="coordinate-item">
                        <span className="coordinate-label">Longitude:</span>
                        <span className="coordinate-value">{coordinates.lng.toFixed(6)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <motion.div
                    className="error-message"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <FaTimes className="error-icon" />
                    {error}
                  </motion.div>
                )}

                <div className="location-actions">
                  {selectedLocation && (
                    <button
                      onClick={handleConfirmLocation}
                      className="confirm-location-btn"
                    >
                      <FaCheck />
                      Confirm Selected Location
                    </button>
                  )}
                  
                  {coordinates && !selectedLocation && (
                    <button
                      onClick={handleCustomLocation}
                      className="custom-location-btn"
                    >
                      <FaMapMarkerAlt />
                      Use Custom Location
                    </button>
                  )}
                </div>

                {selectedLocation && (
                  <div className="location-summary">
                    <h4>Selected Location:</h4>
                    <p className="selected-location-name">{selectedLocation.name}</p>
                    <p className="selected-location-state">{selectedLocation.state}</p>
                    {coordinates && (
                      <p className="selected-coordinates">
                        GPS: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationDropdown;
