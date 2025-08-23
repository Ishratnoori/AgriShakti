import React from 'react';
import { motion } from 'framer-motion';
import { FaFlask, FaTint, FaThermometerHalf } from 'react-icons/fa';
import './DashboardCard.css';

const SoilTestingCard = () => {
  // Simulate soil testing data
  const soilData = {
    npk: {
      nitrogen: 45, // kg/ha
      phosphorus: 28, // kg/ha
      potassium: 35 // kg/ha
    },
    ph: 6.8,
    moisture: 32, // %
    temperature: 24, // °C
    recommendations: [
      'Low Nitrogen detected → add 20 kg urea per acre',
      'Phosphorus levels are optimal',
      'Potassium levels are adequate',
      'pH is in ideal range for most crops'
    ]
  };

  const getNutrientStatus = (value, type) => {
    let status = 'optimal';
    let color = 'var(--primary-green)';
    
    if (type === 'nitrogen') {
      if (value < 50) {
        status = 'low';
        color = 'var(--accent-red)';
      } else if (value > 80) {
        status = 'high';
        color = 'var(--accent-yellow)';
      }
    } else if (type === 'phosphorus') {
      if (value < 25) {
        status = 'low';
        color = 'var(--accent-red)';
      } else if (value > 40) {
        status = 'high';
        color = 'var(--accent-yellow)';
      }
    } else if (type === 'potassium') {
      if (value < 30) {
        status = 'low';
        color = 'var(--accent-red)';
      } else if (value > 50) {
        status = 'high';
        color = 'var(--accent-yellow)';
      }
    }
    
    return { status, color };
  };

  const getPhStatus = (ph) => {
    if (ph < 6.0) return { status: 'Acidic', color: 'var(--accent-orange)' };
    if (ph > 7.5) return { status: 'Alkaline', color: 'var(--accent-blue)' };
    return { status: 'Neutral', color: 'var(--primary-green)' };
  };

  return (
    <motion.div
      className="dashboard-card soil-testing-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-header">
        <div className="card-title">
          <FaFlask className="card-icon" />
          <h3>Soil Testing Results</h3>
        </div>
      </div>

      <div className="card-content">
        {/* NPK Values */}
        <div className="npk-section">
          <h4>Nutrient Levels (kg/ha)</h4>
          <div className="npk-grid">
            {Object.entries(soilData.npk).map(([nutrient, value]) => {
              const { status, color } = getNutrientStatus(value, nutrient);
              return (
                <div key={nutrient} className="nutrient-item">
                  <div className="nutrient-label">{nutrient.charAt(0).toUpperCase() + nutrient.slice(1)}</div>
                  <div className="nutrient-value" style={{ color }}>{value}</div>
                  <div className="nutrient-status" style={{ color }}>{status}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* pH and Moisture */}
        <div className="soil-properties">
          <div className="property-item">
            <div className="property-icon">
              <FaThermometerHalf />
            </div>
            <div className="property-info">
              <div className="property-label">pH Level</div>
              <div className="property-value">{soilData.ph}</div>
              <div className="property-status" style={{ color: getPhStatus(soilData.ph).color }}>
                {getPhStatus(soilData.ph).status}
              </div>
            </div>
          </div>

          <div className="property-item">
            <div className="property-icon">
              <FaTint />
            </div>
            <div className="property-info">
              <div className="property-label">Moisture</div>
              <div className="property-value">{soilData.moisture}%</div>
              <div className="property-status">
                {soilData.moisture > 30 ? 'Adequate' : 'Low'}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="soil-recommendations">
          <h4>Soil Recommendations:</h4>
          <ul>
            {soilData.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default SoilTestingCard;
