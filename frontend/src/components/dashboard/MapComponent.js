import React, { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaExpand, FaCompress } from 'react-icons/fa';
import { isGoogleMapsAvailable, getFallbackMapUrl, getStaticMapUrl } from '../../config/maps';
import './MapComponent.css';

const MapComponent = ({ 
  latitude, 
  longitude, 
  radius = 100, 
  title = "Field Location",
  showRadius = true,
  height = "300px",
  onLocationChange = null 
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const circleRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!latitude || !longitude) {
      setMapError(true);
      return;
    }

    // Check if Google Maps API is available with timeout
    const checkGoogleMaps = () => {
      if (window.google && window.google.maps) {
        return true;
      }
      return false;
    };

    // Wait for Google Maps to load with timeout
    let attempts = 0;
    const maxAttempts = 10;
    
    const waitForGoogleMaps = () => {
      if (checkGoogleMaps()) {
        return true;
      }
      
      attempts++;
      if (attempts >= maxAttempts) {
        console.log('Google Maps API failed to load after multiple attempts, using fallback map');
        setMapError(true);
        return false;
      }
      
      setTimeout(waitForGoogleMaps, 500);
      return false;
    };

    if (!waitForGoogleMaps()) {
      return;
    }

    try {
      // Initialize map
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
        zoom: 15,
        mapTypeId: 'satellite',
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      mapInstanceRef.current = map;

      // Add marker for field center
      const marker = new window.google.maps.Marker({
        position: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
        map: map,
        title: title,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#0ea5e9" stroke="#ffffff" stroke-width="3"/>
              <circle cx="16" cy="16" r="4" fill="#ffffff"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        }
      });

      markerRef.current = marker;

      // Add circle for analysis radius
      if (showRadius && radius > 0) {
        const circle = new window.google.maps.Circle({
          strokeColor: '#0ea5e9',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#0ea5e9',
          fillOpacity: 0.1,
          map: map,
          center: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
          radius: parseFloat(radius)
        });

        circleRef.current = circle;

        // Fit map to show the entire circle
        const bounds = circle.getBounds();
        map.fitBounds(bounds);
      }

      // Add click listener for location selection
      if (onLocationChange) {
        map.addListener('click', (event) => {
          const newLat = event.latLng.lat();
          const newLng = event.latLng.lng();
          onLocationChange(newLat, newLng);
        });

        // Add instruction text
        const infoWindow = new window.google.maps.InfoWindow({
          content: '<div style="text-align: center; padding: 10px;"><strong>Click on map to change field location</strong></div>',
          position: { lat: parseFloat(latitude), lng: parseFloat(longitude) }
        });

        setTimeout(() => {
          infoWindow.open(map, marker);
          setTimeout(() => infoWindow.close(), 3000);
        }, 1000);
      }

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError(true);
    }
  }, [latitude, longitude, radius, title, showRadius, onLocationChange]);

  useEffect(() => {
    // Update marker and circle when coordinates change
    if (mapInstanceRef.current && markerRef.current) {
      const newPosition = { lat: parseFloat(latitude), lng: parseFloat(longitude) };
      markerRef.current.setPosition(newPosition);
      mapInstanceRef.current.setCenter(newPosition);

      if (circleRef.current && showRadius) {
        circleRef.current.setCenter(newPosition);
        circleRef.current.setRadius(parseFloat(radius));
      }
    }
  }, [latitude, longitude, radius, showRadius]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (mapError) {
    return (
      <div className="map-fallback">
        <div className="fallback-header">
          <FaMapMarkerAlt className="fallback-icon" />
          <h5>{title}</h5>
        </div>
        
        <div className="fallback-map">
          <div className="fallback-map-content">
            <div className="fallback-marker">
              <FaMapMarkerAlt />
            </div>
            <div className="fallback-coordinates">
              <div className="coord-item">
                <span className="coord-label">Latitude:</span>
                <span className="coord-value">{parseFloat(latitude).toFixed(6)}</span>
              </div>
              <div className="coord-item">
                <span className="coord-label">Longitude:</span>
                <span className="coord-value">{parseFloat(longitude).toFixed(6)}</span>
              </div>
              {showRadius && (
                <div className="coord-item">
                  <span className="coord-label">Radius:</span>
                  <span className="coord-value">{radius}m</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="fallback-actions">
          <button 
            className="fallback-location-btn"
            onClick={() => {
              if (onLocationChange) {
                // Simulate location change for demo
                const newLat = parseFloat(latitude) + (Math.random() - 0.5) * 0.001;
                const newLng = parseFloat(longitude) + (Math.random() - 0.5) * 0.001;
                onLocationChange(newLat, newLng);
              }
            }}
          >
            📍 Change Location
          </button>
          <a 
            href={`https://www.google.com/maps?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fallback-external-btn"
          >
            🗺️ Open in Google Maps
          </a>
          <a 
            href={getFallbackMapUrl(latitude, longitude)}
            target="_blank"
            rel="noopener noreferrer"
            className="fallback-external-btn"
          >
            🌍 Open in OpenStreetMap
          </a>
        </div>
        
        <div className="fallback-info">
          <p><strong>💡 Tip:</strong> Use the coordinates above or click "Change Location" to update field position</p>
          <p><strong>🌐 External:</strong> Click "Open in Google Maps" to view in full Google Maps</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`map-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="map-header">
        <h5>{title}</h5>
        <button 
          className="map-toggle-btn"
          onClick={toggleExpanded}
          title={isExpanded ? 'Compress Map' : 'Expand Map'}
        >
          {isExpanded ? <FaCompress /> : <FaExpand />}
        </button>
      </div>
      
      <div 
        ref={mapRef} 
        className="google-map"
        style={{ height: isExpanded ? '500px' : height }}
      />
      
      <div className="map-info">
        <div className="map-coordinates">
          <FaMapMarkerAlt />
          <span>Lat: {parseFloat(latitude).toFixed(6)}</span>
          <span>Lng: {parseFloat(longitude).toFixed(6)}</span>
        </div>
        {showRadius && (
          <div className="map-radius">
            <span>Radius: {radius}m</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;
