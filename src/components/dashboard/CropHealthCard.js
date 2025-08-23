import React from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';
import './DashboardCard.css';

const CropHealthCard = ({ crop }) => {
  // Simulate crop health data
  const cropHealth = {
    status: 'healthy', // healthy, warning, danger
    ndvi: 0.75,
    healthPercentage: 90,
    stressAreas: 10,
    message: `Your ${crop} crop is healthy. Mild nutrient stress in ${10}% area.`,
    recommendations: [
      'Continue current irrigation schedule',
      'Monitor for pest activity',
      'Prepare for upcoming harvest'
    ]
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
      </div>
    </motion.div>
  );
};

export default CropHealthCard;
