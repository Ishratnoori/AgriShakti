import React from 'react';
import { motion } from 'framer-motion';
import { FaStore, FaMapMarkerAlt, FaRupeeSign, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './DashboardCard.css';

const MandiPricesCard = ({ crop }) => {
  // Simulate mandi price data (Agmarknet API integration)
  const mandiData = {
    crop: crop,
    lastUpdated: '2 hours ago',
    mandis: [
      {
        name: 'APMC Mandi, Mumbai',
        distance: '45 km',
        price: 2450,
        unit: 'per quintal',
        change: '+125',
        changePercent: '+5.4%',
        trend: 'up',
        quality: 'Grade A',
        arrival: '1500 bags'
      },
      {
        name: 'Krishna Mandi, Pune',
        distance: '120 km',
        price: 2380,
        unit: 'per quintal',
        change: '+85',
        changePercent: '+3.7%',
        trend: 'up',
        quality: 'Grade A',
        arrival: '800 bags'
      },
      {
        name: 'Maharashtra Mandi, Nagpur',
        distance: '180 km',
        price: 2320,
        unit: 'per quintal',
        change: '-45',
        changePercent: '-1.9%',
        trend: 'down',
        quality: 'Grade B',
        arrival: '1200 bags'
      }
    ],
    recommendations: [
      'Best price available at APMC Mandi, Mumbai',
      'Consider transportation costs when choosing mandi',
      'Prices expected to remain stable this week',
      'Grade A quality fetches 5-8% premium'
    ]
  };

  const getBestPrice = () => {
    return mandiData.mandis.reduce((best, current) => 
      current.price > best.price ? current : best
    );
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') {
      return <FaArrowUp className="trend-icon up" />;
    } else {
      return <FaArrowDown className="trend-icon down" />;
    }
  };

  const getTrendColor = (trend) => {
    return trend === 'up' ? 'var(--primary-green)' : 'var(--accent-red)';
  };

  return (
    <motion.div
      className="dashboard-card mandi-prices-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-header">
        <div className="card-title">
          <FaStore className="card-icon" />
          <h3>Mandi Prices (Agmarknet)</h3>
        </div>
        <div className="last-updated">
          <span>Updated: {mandiData.lastUpdated}</span>
        </div>
      </div>

      <div className="card-content">
        {/* Crop Info */}
        <div className="crop-info">
          <h4>{mandiData.crop.charAt(0).toUpperCase() + mandiData.crop.slice(1)} Prices</h4>
          <p className="crop-subtitle">Live prices from nearby mandis</p>
        </div>

        {/* Best Price Highlight */}
        <div className="best-price-section">
          <div className="best-price-label">Best Price Available</div>
          <div className="best-price-card">
            <div className="best-price-main">
              <div className="best-price-amount">
                <FaRupeeSign className="rupee-icon" />
                <span className="price-number">{getBestPrice().price}</span>
                <span className="price-unit">/{getBestPrice().unit}</span>
              </div>
              <div className="best-price-location">
                <FaMapMarkerAlt className="location-icon" />
                <span>{getBestPrice().name}</span>
              </div>
            </div>
            <div className="best-price-details">
              <div className="best-price-quality">Quality: {getBestPrice().quality}</div>
              <div className="best-price-distance">Distance: {getBestPrice().distance}</div>
            </div>
          </div>
        </div>

        {/* All Mandi Prices */}
        <div className="mandi-prices-list">
          <h4>Nearby Mandi Prices</h4>
          <div className="mandi-grid">
            {mandiData.mandis.map((mandi, index) => (
              <div key={index} className="mandi-item">
                <div className="mandi-header">
                  <div className="mandi-name">{mandi.name}</div>
                  <div className="mandi-distance">
                    <FaMapMarkerAlt className="distance-icon" />
                    {mandi.distance}
                  </div>
                </div>
                
                <div className="mandi-price-section">
                  <div className="mandi-price">
                    <FaRupeeSign className="price-icon" />
                    <span className="price-amount">{mandi.price}</span>
                    <span className="price-unit">/{mandi.unit}</span>
                  </div>
                  
                  <div className="mandi-change" style={{ color: getTrendColor(mandi.trend) }}>
                    {getTrendIcon(mandi.trend)}
                    <span className="change-amount">{mandi.change}</span>
                    <span className="change-percent">({mandi.changePercent})</span>
                  </div>
                </div>

                <div className="mandi-details">
                  <div className="mandi-quality">Quality: {mandi.quality}</div>
                  <div className="mandi-arrival">Arrival: {mandi.arrival}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Insights */}
        <div className="market-insights">
          <h4>Market Insights & Recommendations:</h4>
          <ul>
            {mandiData.recommendations.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default MandiPricesCard;
