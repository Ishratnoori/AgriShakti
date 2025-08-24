import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaSpinner, FaMapMarkerAlt } from 'react-icons/fa';
import './DashboardCard.css';

const CropHealthCard = ({ crop }) => {
  const [cropHealth, setCropHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ lat: 17.9246031, lon: 73.7120122 }); // Default location

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied, using default location');
        }
      );
    }
  }, []);

  // Fetch soil analysis data when location changes
  useEffect(() => {
    if (location.lat && location.lon) {
      fetchSoilAnalysis();
    }
  }, [location]);

  const fetchSoilAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching from:', `http://localhost:8000/api/soil-analysis/${location.lat}/${location.lon}`);
      
      // Try the simple GET endpoint first
      const response = await fetch(`http://localhost:8000/api/soil-analysis/${location.lat}/${location.lon}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('API Response Status:', response.status);
      console.log('API Response OK:', response.ok);
      console.log('API Response Headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setCropHealth(result.data);
      } else {
        throw new Error(result.message || 'Failed to get soil analysis');
      }
    } catch (err) {
      console.error('Error fetching soil analysis:', err);
      setError(err.message);
      // Fallback to simulated data if API fails
      setCropHealth({
        status: 'healthy',
        ndvi: 0.75,
        healthPercentage: 90,
        stressAreas: 10,
        message: `Your ${crop} crop is healthy.`,
        recommendations: [
          'Continue current irrigation schedule',
          'Monitor for pest activity',
          'Prepare for upcoming harvest'
        ],
        soilData: {
          ph: 6.5,
          organicCarbon: 2.5,
          waterHoldingCapacity: 35
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <FaCheckCircle className="status-icon status-healthy" />;
      case 'warning':
        return <FaExclamationTriangle className="status-icon status-warning" />;
      case 'danger':
        return <FaTimesCircle className="status-icon status-danger" />;
      default:
        return <FaCheckCircle className="status-icon status-healthy" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'var(--primary-green)';
      case 'warning':
        return 'var(--accent-yellow)';
      case 'danger':
        return 'var(--accent-red)';
      default:
        return 'var(--primary-green)';
    }
  };

  if (loading) {
    return (
      <motion.div
        className="dashboard-card crop-health-card"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <div className="card-header">
          <div className="card-title">
            <FaLeaf className="card-icon" />
            <h3>Crop Health (Crop Doctor)</h3>
          </div>
        </div>
        <div className="card-content">
          <div className="loading-container">
            <FaSpinner className="loading-spinner" />
            <p>Analyzing soil health...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (!cropHealth) {
    return (
      <motion.div
        className="dashboard-card crop-health-card"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <div className="card-header">
          <div className="card-title">
            <FaLeaf className="card-icon" />
            <h3>Crop Health (Crop Doctor)</h3>
          </div>
        </div>
        <div className="card-content">
          <div className="error-container">
            <p>Failed to load soil analysis data</p>
            <button onClick={fetchSoilAnalysis} className="retry-button">
              Retry
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="dashboard-card crop-health-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-header">
        <div className="card-title">
          <FaLeaf className="card-icon" />
          <h3>Crop Health (Crop Doctor)</h3>
        </div>
        {getStatusIcon(cropHealth.status)}
      </div>

      <div className="card-content">
        {/* Location Info */}
        <div className="location-info">
          <FaMapMarkerAlt className="location-icon" />
          <span>Location: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}</span>
        </div>

        {/* NDVI Status */}
        <div className="ndvi-section">
          <div className="ndvi-indicator">
            <div 
              className="ndvi-circle"
              style={{ 
                background: `conic-gradient(${getStatusColor(cropHealth.status)} ${cropHealth.ndvi * 360}deg, #e5e7eb 0deg)` 
              }}
            >
              <div className="ndvi-value">
                <span className="ndvi-number">{(cropHealth.ndvi * 100).toFixed(0)}</span>
                <span className="ndvi-label">NDVI</span>
              </div>
            </div>
          </div>
          <div className="ndvi-info">
            <div className="health-percentage">
              <span className="percentage-number">{cropHealth.healthPercentage}%</span>
              <span className="percentage-label">Healthy</span>
            </div>
            <div className="stress-areas">
              <span className="stress-number">{cropHealth.stressAreas}%</span>
              <span className="stress-label">Stress Areas</span>
            </div>
          </div>
        </div>

        {/* Soil Data Display */}
        {cropHealth.soilData && (
          <div className="soil-data">
            <h4>Soil Analysis Results:</h4>
            <div className="soil-metrics">
              <div className="soil-metric">
                <span className="metric-label">pH:</span>
                <span className="metric-value">{cropHealth.soilData.ph?.toFixed(1) || 'N/A'}</span>
              </div>
              <div className="soil-metric">
                <span className="metric-label">Organic Carbon:</span>
                <span className="metric-value">{cropHealth.soilData.organicCarbon?.toFixed(1) || 'N/A'}%</span>
              </div>
              <div className="soil-metric">
                <span className="metric-label">Water Holding:</span>
                <span className="metric-value">{cropHealth.soilData.waterHoldingCapacity?.toFixed(1) || 'N/A'}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Health Message */}
        <div className="health-message">
          <p>{cropHealth.message}</p>
        </div>

        {/* Recommendations */}
        <div className="recommendations">
          <h4>Recommendations:</h4>
          <ul>
            {cropHealth.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>

        {/* Refresh Button */}
        <div className="refresh-section">
          <button onClick={fetchSoilAnalysis} className="refresh-button">
            Refresh Analysis
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default CropHealthCard;
