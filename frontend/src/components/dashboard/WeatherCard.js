import React from 'react';
import { motion } from 'framer-motion';
import { FaCloudSun, FaCloudRain, FaSun, FaCloud, FaExclamationTriangle } from 'react-icons/fa';
import './DashboardCard.css';

const WeatherCard = ({ location }) => {
  // Simulate weather data
  const weatherData = {
    current: {
      temperature: 28,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12
    },
    forecast: [
      {
        day: 'Today',
        high: 32,
        low: 24,
        condition: 'Partly Cloudy',
        icon: 'cloud-sun',
        alert: null
      },
      {
        day: 'Tomorrow',
        high: 29,
        low: 22,
        condition: 'Heavy Rain',
        icon: 'cloud-rain',
        alert: 'Heavy rain expected tomorrow'
      },
      {
        day: 'Day 3',
        high: 31,
        low: 25,
        condition: 'Sunny',
        icon: 'sun',
        alert: null
      },
      {
        day: 'Day 4',
        high: 30,
        low: 23,
        condition: 'Cloudy',
        icon: 'cloud',
        alert: null
      }
    ],
    recommendations: [
      'No irrigation needed today due to adequate soil moisture',
      'Prepare for heavy rainfall tomorrow - check drainage',
      'Good conditions for pesticide application in 2 days'
    ]
  };

  const getWeatherIcon = (iconType) => {
    switch (iconType) {
      case 'sun':
        return <FaSun className="weather-icon sunny" />;
      case 'cloud-sun':
        return <FaCloudSun className="weather-icon partly-cloudy" />;
      case 'cloud':
        return <FaCloud className="weather-icon cloudy" />;
      case 'cloud-rain':
        return <FaCloudRain className="weather-icon rainy" />;
      default:
        return <FaSun className="weather-icon sunny" />;
    }
  };

  return (
    <motion.div
      className="dashboard-card weather-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-header">
        <div className="card-title">
          <FaCloudSun className="card-icon" />
          <h3>Weather Conditions</h3>
        </div>
        <div className="location-info">
          <span className="location-text">{location}</span>
        </div>
      </div>

      <div className="card-content">
        {/* Current Weather */}
        <div className="current-weather">
          <div className="current-main">
            <div className="current-icon">
              {getWeatherIcon('cloud-sun')}
            </div>
            <div className="current-details">
              <div className="current-temp">{weatherData.current.temperature}°C</div>
              <div className="current-condition">{weatherData.current.condition}</div>
              <div className="current-meta">
                <span>Humidity: {weatherData.current.humidity}%</span>
                <span>Wind: {weatherData.current.windSpeed} km/h</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Day Forecast */}
        <div className="weather-forecast">
          <h4>4-Day Forecast</h4>
          <div className="forecast-grid">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="forecast-day">
                <div className="forecast-header">
                  <span className="forecast-day-name">{day.day}</span>
                  {day.alert && (
                    <FaExclamationTriangle className="alert-icon" title={day.alert} />
                  )}
                </div>
                <div className="forecast-icon">
                  {getWeatherIcon(day.icon)}
                </div>
                <div className="forecast-temps">
                  <span className="forecast-high">{day.high}°</span>
                  <span className="forecast-low">{day.low}°</span>
                </div>
                <div className="forecast-condition">{day.condition}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Alerts */}
        {weatherData.forecast.some(day => day.alert) && (
          <div className="weather-alerts">
            <h4>Weather Alerts</h4>
            <div className="alert-list">
              {weatherData.forecast
                .filter(day => day.alert)
                .map((day, index) => (
                  <div key={index} className="alert-item">
                    <FaExclamationTriangle className="alert-icon-small" />
                    <span>{day.alert}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Farming Recommendations */}
        <div className="weather-recommendations">
          <h4>Farming Recommendations:</h4>
          <ul>
            {weatherData.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default WeatherCard;
