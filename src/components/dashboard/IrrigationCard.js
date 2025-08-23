import React from 'react';
import { motion } from 'framer-motion';
import { FaTint, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import './DashboardCard.css';

const IrrigationCard = () => {
  // Simulate irrigation data
  const irrigationData = {
    currentMoisture: 32, // %
    optimalMoisture: {
      min: 25,
      max: 40
    },
    lastIrrigation: '2 days ago',
    nextIrrigation: '2 days',
    soilType: 'Loamy',
    cropStage: 'Flowering',
    recommendations: [
      'No irrigation needed today - soil moisture is adequate',
      'Schedule irrigation in 2 days when moisture drops below 30%',
      'Apply 25mm water per irrigation cycle',
      'Best irrigation time: Early morning (6-8 AM)'
    ],
    schedule: [
      {
        day: 'Today',
        status: 'Not needed',
        moisture: 32,
        icon: 'check'
      },
      {
        day: 'Tomorrow',
        status: 'Monitor',
        moisture: 28,
        icon: 'warning'
      },
      {
        day: 'Day 3',
        status: 'Irrigate',
        moisture: 24,
        icon: 'irrigate'
      }
    ]
  };

  const getMoistureStatus = (moisture) => {
    if (moisture >= irrigationData.optimalMoisture.min && moisture <= irrigationData.optimalMoisture.max) {
      return { status: 'Optimal', color: 'var(--primary-green)', icon: 'check' };
    } else if (moisture < irrigationData.optimalMoisture.min) {
      return { status: 'Low', color: 'var(--accent-red)', icon: 'warning' };
    } else {
      return { status: 'High', color: 'var(--accent-yellow)', icon: 'warning' };
    }
  };

  const getScheduleIcon = (iconType) => {
    switch (iconType) {
      case 'check':
        return <FaCheckCircle className="schedule-icon check" />;
      case 'warning':
        return <FaExclamationTriangle className="schedule-icon warning" />;
      case 'irrigate':
        return <FaTint className="schedule-icon irrigate" />;
      default:
        return <FaClock className="schedule-icon" />;
    }
  };

  return (
    <motion.div
      className="dashboard-card irrigation-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-header">
        <div className="card-title">
          <FaTint className="card-icon" />
          <h3>Smart Irrigation</h3>
        </div>
        <div className="irrigation-status">
          <span className="status-text">
            {irrigationData.currentMoisture >= irrigationData.optimalMoisture.min ? 'No Irrigation Needed' : 'Irrigation Required'}
          </span>
        </div>
      </div>

      <div className="card-content">
        {/* Current Status */}
        <div className="irrigation-status-main">
          <div className="moisture-indicator">
            <div className="moisture-circle">
              <div className="moisture-value">
                <span className="moisture-number">{irrigationData.currentMoisture}%</span>
                <span className="moisture-label">Soil Moisture</span>
              </div>
            </div>
            <div className="moisture-info">
              <div className="moisture-range">
                <span>Optimal: {irrigationData.optimalMoisture.min}-{irrigationData.optimalMoisture.max}%</span>
              </div>
              <div className="moisture-status-text" style={{ color: getMoistureStatus(irrigationData.currentMoisture).color }}>
                {getMoistureStatus(irrigationData.currentMoisture).status}
              </div>
            </div>
          </div>
        </div>

        {/* Irrigation Schedule */}
        <div className="irrigation-schedule">
          <h4>3-Day Irrigation Schedule</h4>
          <div className="schedule-grid">
            {irrigationData.schedule.map((day, index) => (
              <div key={index} className="schedule-day">
                <div className="schedule-header">
                  <span className="schedule-day-name">{day.day}</span>
                  {getScheduleIcon(day.icon)}
                </div>
                <div className="schedule-moisture">{day.moisture}%</div>
                <div className="schedule-status">{day.status}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Information */}
        <div className="irrigation-info">
          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Last Irrigation</div>
              <div className="info-value">{irrigationData.lastIrrigation}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Next Irrigation</div>
              <div className="info-value">{irrigationData.nextIrrigation}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Soil Type</div>
              <div className="info-value">{irrigationData.soilType}</div>
            </div>
            <div className="info-item">
              <div className="info-label">Crop Stage</div>
              <div className="info-value">{irrigationData.cropStage}</div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="irrigation-recommendations">
          <h4>Irrigation Recommendations:</h4>
          <ul>
            {irrigationData.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default IrrigationCard;
