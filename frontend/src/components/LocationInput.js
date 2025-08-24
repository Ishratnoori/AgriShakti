import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaSearch, FaCrosshairs, FaCheck, FaTimes } from 'react-icons/fa';
import './LocationInput.css';

const LocationInput = ({ onLocationSelect, initialLocation = null }) => {
  const [location, setLocation] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 18.5204, lng: 73.8567 }); // Default to Pune
  const mapRef = useRef(null);
  const searchBoxRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (initialLocation) {
      setLocation(initialLocation);
      // Geocode the initial location
      geocodeAddress(initialLocation);
    }
  }, [initialLocation]);

  useEffect(() => {
    if (showMap) {
      initializeMap();
    }
  }, [showMap]);

  const initializeMap = () => {
    // Check if Google Maps is loaded
    if (!window.google || !window.google.maps) {
      setError('Google Maps is not loaded. Please check your internet connection.');
      return;
    }

    try {
      // Create map instance
      const map = new window.google.maps.Map(mapRef.current, {
        center: mapCenter,
        zoom: 12,
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Create search box
      const input = searchBoxRef.current;
      const searchBox = new window.google.maps.places.SearchBox(input);

      // Bias search results to current map viewport
      map.addListener('bounds_changed', () => {
        searchBox.setBounds(map.getBounds());
      });

      // Handle search box selection
      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places.length === 0) return;

        const place = places[0];
        if (!place.geometry || !place.geometry.location) {
          setError('No location found for the entered address.');
          return;
        }

        // Update map and marker
        map.setCenter(place.geometry.location);
        map.setZoom(15);

        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        markerRef.current = new window.google.maps.Marker({
          map: map,
          position: place.geometry.location,
          title: place.name,
          draggable: true
        });

        // Update coordinates and location
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setCoordinates({ lat, lng });
        setLocation(place.formatted_address);
        setMapCenter({ lat, lng });

        // Handle marker drag
        markerRef.current.addListener('dragend', () => {
          const position = markerRef.current.getPosition();
          const newLat = position.lat();
          const newLng = position.lng();
          setCoordinates({ lat: newLat, lng: newLng });
          reverseGeocode({ lat: newLat, lng: newLng });
        });

        // Handle map click
        map.addListener('click', (event) => {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          
          if (markerRef.current) {
            markerRef.current.setMap(null);
          }

          markerRef.current = new window.google.maps.Marker({
            map: map,
            position: event.latLng,
            draggable: true
          });

          setCoordinates({ lat, lng });
          reverseGeocode({ lat, lng });
        });

        setError('');
      });

    } catch (err) {
      setError('Failed to initialize map. Please try again.');
      console.error('Map initialization error:', err);
    }
  };

  const geocodeAddress = async (address) => {
    if (!window.google || !window.google.maps) {
      setError('Google Maps is not available.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        setIsLoading(false);
        
        if (status === 'OK' && results[0]) {
          const lat = results[0].geometry.location.lat();
          const lng = results[0].geometry.location.lng();
          setCoordinates({ lat, lng });
          setMapCenter({ lat, lng });
          setError('');
        } else {
          setError('Could not find coordinates for this address.');
        }
      });
    } catch (err) {
      setIsLoading(false);
      setError('Failed to geocode address.');
    }
  };

  const reverseGeocode = async (coords) => {
    if (!window.google || !window.google.maps) return;

    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: coords }, (results, status) => {
        if (status === 'OK' && results[0]) {
          setLocation(results[0].formatted_address);
        }
      });
    } catch (err) {
      console.error('Reverse geocoding error:', err);
    }
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
        setCoordinates({ lat, lng });
        setMapCenter({ lat, lng });
        reverseGeocode({ lat, lng });
        setIsLoading(false);
        
        if (showMap && mapRef.current) {
          const map = new window.google.maps.Map(mapRef.current, {
            center: { lat, lng },
            zoom: 15
          });
          
          if (markerRef.current) {
            markerRef.current.setMap(null);
          }
          
          markerRef.current = new window.google.maps.Marker({
            map: map,
            position: { lat, lng },
            draggable: true
          });
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

  const handleLocationSubmit = () => {
    if (!coordinates) {
      setError('Please select a location on the map or enter a valid address.');
      return;
    }

    const locationData = {
      address: location,
      coordinates: coordinates,
      latitude: coordinates.lat,
      longitude: coordinates.lng
    };

    onLocationSelect(locationData);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim()) {
      geocodeAddress(location);
    }
  };

  return (
    <motion.div
      className="location-input-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="location-header">
        <FaMapMarkerAlt className="location-icon" />
        <h3>Enter Your Farm Location</h3>
        <p>Select your farm location to get personalized recommendations</p>
      </div>

      <div className="location-input-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <FaSearch className="search-icon" />
            <input
              ref={searchBoxRef}
              type="text"
              placeholder="Enter your farm address or location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="location-input"
            />
            <button
              type="button"
              onClick={getCurrentLocation}
              className="current-location-btn"
              disabled={isLoading}
              title="Use current location"
            >
              <FaCrosshairs />
            </button>
          </div>
          <button type="submit" className="search-btn" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

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

        {coordinates && (
          <motion.div
            className="coordinates-display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="coordinate-item">
              <span className="coordinate-label">Latitude:</span>
              <span className="coordinate-value">{coordinates.lat.toFixed(6)}</span>
            </div>
            <div className="coordinate-item">
              <span className="coordinate-label">Longitude:</span>
              <span className="coordinate-value">{coordinates.lng.toFixed(6)}</span>
            </div>
          </motion.div>
        )}
      </div>

      <div className="map-section">
        <button
          onClick={() => setShowMap(!showMap)}
          className="toggle-map-btn"
        >
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>

        {showMap && (
          <motion.div
            className="map-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 400 }}
            transition={{ duration: 0.3 }}
          >
            <div ref={mapRef} className="google-map" />
            <div className="map-instructions">
              <p>💡 Click on the map to select your farm location</p>
              <p>💡 Drag the marker to adjust the position</p>
            </div>
          </motion.div>
        )}
      </div>

      <div className="location-actions">
        <button
          onClick={handleLocationSubmit}
          className="confirm-location-btn"
          disabled={!coordinates}
        >
          <FaCheck className="confirm-icon" />
          Confirm Location
        </button>
      </div>

      {coordinates && (
        <div className="location-summary">
          <h4>Selected Location:</h4>
          <p className="selected-address">{location}</p>
          <p className="selected-coordinates">
            GPS: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default LocationInput;
