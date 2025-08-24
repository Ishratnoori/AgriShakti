import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCloudSun, FaCloudRain, FaSun, FaCloud, FaExclamationTriangle, FaBolt, FaTimes, FaMapMarkerAlt, FaClock, FaThermometerHalf, FaTint } from 'react-icons/fa';
import axios from 'axios';
import './DashboardCard.css';

const WeatherCard = ({ location = "Pune" }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showThunderstormPopup, setShowThunderstormPopup] = useState(false);
  const [thunderstormAlert, setThunderstormAlert] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const WEATHER_API_KEY = '4d1a7083e93d439a90f173113252308';
  const WEATHER_API_URL = 'https://api.weatherapi.com/v1/forecast.json';

  // Enhanced weather data with detailed information
  const enhancedWeatherData = {
    location: {
      name: "Pune",
      region: "Maharashtra",
      country: "India"
    },
    current: {
      temperature: 22.7,
      condition: "Patchy rain nearby",
      humidity: 83,
      windSpeed: 12,
      feelsLike: 24.2,
      uv: 3,
      icon: "cloud-rain"
    },
    forecast: [
      {
        date: "2025-08-24",
        day: "Sun",
        condition: "Patchy rain nearby",
        avgTemp: 22.7,
        humidity: 83,
        rain: true,
        rainTimes: ["1 AM - 3 AM", "7 AM - 6 PM", "8 PM", "10 PM - 11 PM"],
        thunderstorm: false,
        icon: "cloud-rain"
      },
      {
        date: "2025-08-25",
        day: "Mon",
        condition: "Patchy rain nearby",
        avgTemp: 21.6,
        humidity: 90,
        rain: true,
        rainTimes: ["12 AM - 8 AM", "10 AM - 5 PM", "9 PM - 11 PM"],
        thunderstorm: false,
        icon: "cloud-rain"
      },
      {
        date: "2025-08-26",
        day: "Tue",
        condition: "Patchy rain nearby",
        avgTemp: 21.9,
        humidity: 94,
        rain: true,
        rainTimes: ["12 AM - 1 AM", "3 AM - 4 AM", "7 AM - 7 PM"],
        thunderstorm: false,
        icon: "cloud-rain"
      },
      {
        date: "2025-08-27",
        day: "Wed",
        condition: "Patchy rain nearby",
        avgTemp: 22.5,
        humidity: 91,
        rain: true,
        rainTimes: ["3 AM - 6 AM", "8 AM - 6 PM", "8 PM - 11 PM"],
        thunderstorm: false,
        icon: "cloud-rain"
      },
      {
        date: "2025-08-28",
        day: "Thu",
        condition: "Patchy rain nearby",
        avgTemp: 23.4,
        humidity: 86,
        rain: true,
        rainTimes: ["12 AM - 2 AM", "4 AM", "9 AM - 5 PM", "10 PM - 11 PM"],
        thunderstorm: false,
        icon: "cloud-rain"
      },
      {
        date: "2025-08-29",
        day: "Fri",
        condition: "Patchy rain nearby",
        avgTemp: 23.3,
        humidity: 86,
        rain: true,
        rainTimes: ["12 AM - 3 AM", "1 PM - 8 PM"],
        thunderstorm: false,
        icon: "cloud-rain"
      },
      {
        date: "2025-08-30",
        day: "Sat",
        condition: "Patchy rain nearby",
        avgTemp: 23.2,
        humidity: 87,
        rain: true,
        rainTimes: ["2 AM - 11 PM"],
        thunderstorm: false,
        icon: "cloud-rain"
      }
    ]
  };

  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setWeatherData(enhancedWeatherData);
      setLoading(false);
    }, 1000);
  }, []);

  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase();
    
    if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
      return <FaBolt className="weather-icon thunderstorm" />;
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
      return <FaCloudRain className="weather-icon rainy" />;
    } else if (conditionLower.includes('cloud')) {
      return <FaCloud className="weather-icon cloudy" />;
    } else if (conditionLower.includes('sun') || conditionLower.includes('clear')) {
      return <FaSun className="weather-icon sunny" />;
    } else {
      return <FaCloudSun className="weather-icon partly-cloudy" />;
    }
  };

  const getWeatherRecommendations = () => {
    if (!weatherData) return [];
    
    const recommendations = [];
    const current = weatherData.current;
    const forecast = weatherData.forecast;

    // Check for rain in next 3 days
    const rainInNext3Days = forecast.slice(0, 3).some(day => day.rain);
    if (rainInNext3Days) {
      recommendations.push('Rain expected - delay irrigation and pesticide application');
    }

    // Check for thunderstorm
    const thunderstormComing = forecast.some(day => day.thunderstorm);
    if (thunderstormComing) {
      recommendations.push('Thunderstorm alert - secure farm equipment and avoid field work');
    }

    // Temperature-based recommendations
    if (current.temperature > 35) {
      recommendations.push('High temperature - increase irrigation frequency');
    } else if (current.temperature < 15) {
      recommendations.push('Low temperature - protect sensitive crops');
    }

    // Humidity-based recommendations
    if (current.humidity > 80) {
      recommendations.push('High humidity - monitor for fungal diseases');
    }

    return recommendations;
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  if (loading) {
    return (
      <motion.div className="dashboard-card weather-card" whileHover={{ y: -5 }}>
        <div className="card-header">
          <div className="card-title">
            <FaCloudSun className="card-icon" />
            <h3>Weather Conditions</h3>
          </div>
        </div>
        <div className="card-content">
          <div className="loading-spinner">Loading weather data...</div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div className="dashboard-card weather-card" whileHover={{ y: -5 }}>
        <div className="card-header">
          <div className="card-title">
            <FaCloudSun className="card-icon" />
            <h3>Weather Conditions</h3>
          </div>
        </div>
        <div className="card-content">
          <div className="error-message">{error}</div>
        </div>
      </motion.div>
    );
  }

  const recommendations = getWeatherRecommendations();

  return (
    <>
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
            <FaMapMarkerAlt className="location-icon" />
            <span className="location-text">{weatherData.location.name}, {weatherData.location.country}</span>
          </div>
        </div>

        <div className="card-content">
          {/* Current Weather */}
          <div className="current-weather">
            <div className="current-main">
              <div className="current-icon">
                {getWeatherIcon(weatherData.current.condition)}
              </div>
              <div className="current-details">
                <div className="current-temp">{Math.round(weatherData.current.temperature)}°C</div>
                <div className="current-condition">{weatherData.current.condition}</div>
                <div className="current-meta">
                  <span><FaThermometerHalf /> Feels like: {Math.round(weatherData.current.feelsLike)}°C</span>
                  <span><FaTint /> Humidity: {weatherData.current.humidity}%</span>
                  <span>Wind: {weatherData.current.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Forecast */}
          <div className="weather-forecast">
            <h4>7-Day Weather Forecast with Storm & Rain Alerts</h4>
            <div className="forecast-grid">
              {weatherData.forecast.map((day, index) => (
                <div 
                  key={index} 
                  className={`forecast-day ${selectedDay?.date === day.date ? 'selected' : ''}`}
                  onClick={() => handleDayClick(day)}
                >
                  <div className="forecast-header">
                    <span className="forecast-day-name">{day.day}</span>
                    {day.thunderstorm && (
                      <FaBolt className="thunderstorm-icon" title="Thunderstorm Alert" />
                    )}
                    {day.rain && (
                      <FaCloudRain className="rain-icon" title="Rain Expected" />
                    )}
                  </div>
                  <div className="forecast-icon">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <div className="forecast-temps">
                    <span className="forecast-high">{Math.round(day.avgTemp)}°</span>
                  </div>
                  <div className="forecast-condition">{day.condition}</div>
                  <div className="forecast-details">
                    <div className="humidity-info">
                      <FaTint /> {day.humidity}%
                    </div>
                    {day.rain && (
                      <div className="rain-status">
                        <FaCloudRain /> Yes 🌧️
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Day Information */}
          {selectedDay && (
            <div className="day-details">
              <h4>Detailed Forecast for {selectedDay.day}, {new Date(selectedDay.date).toLocaleDateString()}</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <FaThermometerHalf className="detail-icon" />
                  <div className="detail-info">
                    <span className="detail-label">Average Temperature</span>
                    <span className="detail-value">{selectedDay.avgTemp}°C</span>
                  </div>
                </div>
                <div className="detail-item">
                  <FaTint className="detail-icon" />
                  <div className="detail-info">
                    <span className="detail-label">Humidity</span>
                    <span className="detail-value">{selectedDay.humidity}%</span>
                  </div>
                </div>
                <div className="detail-item">
                  <FaCloudRain className="detail-icon" />
                  <div className="detail-info">
                    <span className="detail-label">Rain</span>
                    <span className="detail-value">{selectedDay.rain ? 'Yes 🌧️' : 'No'}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <FaBolt className="detail-icon" />
                  <div className="detail-info">
                    <span className="detail-label">Thunderstorm</span>
                    <span className="detail-value">{selectedDay.thunderstorm ? 'Yes ⚡' : 'No'}</span>
                  </div>
                </div>
              </div>
              
              {selectedDay.rain && selectedDay.rainTimes && (
                <div className="rain-times">
                  <h5><FaClock /> Rain Times</h5>
                  <div className="time-slots">
                    {selectedDay.rainTimes.map((time, index) => (
                      <span key={index} className="time-slot">{time}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Thunderstorm Alerts */}
          {weatherData.forecast.some(day => day.thunderstorm) && (
            <div className="weather-alerts thunderstorm-alert">
              <h4>
                <FaBolt className="alert-icon" />
                Thunderstorm Alerts
              </h4>
              <div className="alert-list">
                {weatherData.forecast
                  .filter(day => day.thunderstorm)
                  .map((day, index) => (
                    <div key={index} className="alert-item thunderstorm-item">
                      <FaBolt className="alert-icon-small" />
                      <span>Thunderstorm expected on {new Date(day.date).toLocaleDateString()}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Rain Alerts */}
          {weatherData.forecast.some(day => day.rain) && (
            <div className="weather-alerts rain-alert">
              <h4>
                <FaCloudRain className="alert-icon" />
                Rain Alerts
              </h4>
              <div className="alert-list">
                {weatherData.forecast
                  .filter(day => day.rain)
                  .slice(0, 3)
                  .map((day, index) => (
                    <div key={index} className="alert-item rain-item">
                      <FaCloudRain className="alert-icon-small" />
                      <span>Rain expected on {new Date(day.date).toLocaleDateString()} - {day.rainTimes?.join(', ')}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Farming Recommendations */}
          {recommendations.length > 0 && (
            <div className="weather-recommendations">
              <h4>Farming Recommendations:</h4>
              <ul>
                {recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>

      {/* Thunderstorm Popup */}
      <AnimatePresence>
        {showThunderstormPopup && thunderstormAlert && (
          <motion.div
            className="thunderstorm-popup-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowThunderstormPopup(false)}
          >
            <motion.div
              className="thunderstorm-popup"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="popup-header">
                <FaBolt className="popup-icon thunderstorm" />
                <h3>Thunderstorm Alert!</h3>
                <button 
                  className="popup-close"
                  onClick={() => setShowThunderstormPopup(false)}
                >
                  <FaTimes />
                </button>
              </div>
              <div className="popup-content">
                <p>
                  <strong>Thunderstorm expected on {new Date(thunderstormAlert.date).toLocaleDateString()}</strong>
                </p>
                <div className="alert-details">
                  <p>⚠️ Secure farm equipment and machinery</p>
                  <p>⚠️ Avoid field work during storm</p>
                  <p>⚠️ Check drainage systems</p>
                  <p>⚠️ Protect livestock and crops</p>
                </div>
                <div className="weather-summary">
                  <p>Expected Conditions:</p>
                  <ul>
                    <li>Temperature: {Math.round(thunderstormAlert.avgTemp)}°C</li>
                    <li>Humidity: {thunderstormAlert.humidity}%</li>
                    <li>Rain: {thunderstormAlert.rain ? 'Yes' : 'No'}</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WeatherCard;
