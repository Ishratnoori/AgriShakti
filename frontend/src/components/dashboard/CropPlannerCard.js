import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaSeedling, FaThermometerHalf, FaTint, FaLeaf } from 'react-icons/fa';
import './DashboardCard.css';

const CropPlannerCard = () => {
  // Simulate crop planning data
  const cropPlanningData = {
    currentSeason: 'Kharif',
    nextSeason: 'Rabi',
    soilConditions: {
      type: 'Loamy',
      ph: 6.8,
      moisture: 32,
      temperature: 24
    },
    weatherForecast: {
      rainfall: 'Normal',
      temperature: 'Moderate',
      humidity: 'High'
    },
    recommendedCrops: [
      {
        name: 'Chickpea',
        scientificName: 'Cicer arietinum',
        suitability: 95,
        reason: 'Excellent for loamy soil, moderate water requirement',
        sowingTime: 'October-November',
        harvestTime: 'March-April',
        expectedYield: '12-15 quintals/acre',
        marketDemand: 'High',
        icon: 'chickpea'
      },
      {
        name: 'Mustard',
        scientificName: 'Brassica juncea',
        suitability: 88,
        reason: 'Good drought tolerance, suitable for current soil pH',
        sowingTime: 'October',
        harvestTime: 'February-March',
        expectedYield: '8-10 quintals/acre',
        marketDemand: 'Medium',
        icon: 'mustard'
      },
      {
        name: 'Wheat',
        scientificName: 'Triticum aestivum',
        suitability: 82,
        reason: 'Well-suited for loamy soil, good market demand',
        sowingTime: 'November-December',
        harvestTime: 'March-April',
        expectedYield: '18-22 quintals/acre',
        marketDemand: 'Very High',
        icon: 'wheat'
      }
    ],
    seasonalTips: [
      'Start land preparation 2-3 weeks before sowing',
      'Ensure proper seed treatment for disease prevention',
      'Monitor soil moisture for optimal germination',
      'Plan crop rotation to maintain soil health'
    ]
  };

  const getSuitabilityColor = (suitability) => {
    if (suitability >= 90) return 'var(--primary-green)';
    if (suitability >= 80) return 'var(--accent-yellow)';
    return 'var(--accent-orange)';
  };

  const getSuitabilityLabel = (suitability) => {
    if (suitability >= 90) return 'Excellent';
    if (suitability >= 80) return 'Good';
    if (suitability >= 70) return 'Fair';
    return 'Poor';
  };

  return (
    <motion.div
      className="dashboard-card crop-planner-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-header">
        <div className="card-title">
          <FaCalendarAlt className="card-icon" />
          <h3>Crop Planner (Next Season)</h3>
        </div>
        <div className="season-info">
          <span className="current-season">{cropPlanningData.currentSeason}</span>
          <span className="season-arrow">→</span>
          <span className="next-season">{cropPlanningData.nextSeason}</span>
        </div>
      </div>

      <div className="card-content">
        {/* Current Conditions Summary */}
        <div className="conditions-summary">
          <h4>Current Conditions Analysis</h4>
          <div className="conditions-grid">
            <div className="condition-item">
              <FaLeaf className="condition-icon" />
              <div className="condition-info">
                <div className="condition-label">Soil Type</div>
                <div className="condition-value">{cropPlanningData.soilConditions.type}</div>
              </div>
            </div>
            <div className="condition-item">
              <FaThermometerHalf className="condition-icon" />
              <div className="condition-info">
                <div className="condition-label">pH Level</div>
                <div className="condition-value">{cropPlanningData.soilConditions.ph}</div>
              </div>
            </div>
            <div className="condition-item">
              <FaTint className="condition-icon" />
              <div className="condition-info">
                <div className="condition-label">Moisture</div>
                <div className="condition-value">{cropPlanningData.soilConditions.moisture}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Crops */}
        <div className="recommended-crops">
          <h4>Recommended Crops for {cropPlanningData.nextSeason}</h4>
          <div className="crops-list">
            {cropPlanningData.recommendedCrops.map((crop, index) => (
              <div key={index} className="crop-item">
                <div className="crop-header">
                  <div className="crop-name-section">
                    <FaSeedling className="crop-icon" />
                    <div className="crop-names">
                      <div className="crop-name">{crop.name}</div>
                      <div className="crop-scientific">{crop.scientificName}</div>
                    </div>
                  </div>
                  <div className="crop-suitability">
                    <div 
                      className="suitability-score"
                      style={{ color: getSuitabilityColor(crop.suitability) }}
                    >
                      {crop.suitability}%
                    </div>
                    <div className="suitability-label">{getSuitabilityLabel(crop.suitability)}</div>
                  </div>
                </div>

                <div className="crop-details">
                  <div className="crop-reason">{crop.reason}</div>
                  
                  <div className="crop-timeline">
                    <div className="timeline-item">
                      <span className="timeline-label">Sowing:</span>
                      <span className="timeline-value">{crop.sowingTime}</span>
                    </div>
                    <div className="timeline-item">
                      <span className="timeline-label">Harvest:</span>
                      <span className="timeline-value">{crop.harvestTime}</span>
                    </div>
                  </div>

                  <div className="crop-metrics">
                    <div className="metric-item">
                      <span className="metric-label">Expected Yield:</span>
                      <span className="metric-value">{crop.expectedYield}</span>
                    </div>
                    <div className="metric-item">
                      <span className="metric-label">Market Demand:</span>
                      <span className="metric-value">{crop.marketDemand}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Tips */}
        <div className="seasonal-tips">
          <h4>Seasonal Planning Tips</h4>
          <ul>
            {cropPlanningData.seasonalTips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default CropPlannerCard;
