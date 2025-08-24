import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaSeedling, FaThermometerHalf, FaTint, FaLeaf, FaCalculator, FaFlask, FaChartLine, FaPlus } from 'react-icons/fa';
import './DashboardCard.css';

const CropPlannerCard = () => {
  const [activeCard, setActiveCard] = useState('yield');

  // Yield Prediction State
  const [yieldData, setYieldData] = useState({
    state: '',
    district: '',
    season: '',
    crop: '',
    area: ''
  });

  // Fertilizer Recommendation State
  const [fertilizerData, setFertilizerData] = useState({
    nitrogen: '',
    phosphorous: '',
    potassium: '',
    temperature: '',
    humidity: '',
    moisture: '',
    soilType: '',
    cropType: ''
  });

  // Crop Recommendation State
  const [cropData, setCropData] = useState({
    nitrogen: '',
    phosphorous: '',
    potassium: '',
    temperature: '',
    humidity: '',
    ph: '',
    rainfall: ''
  });

  const handleYieldChange = (e) => {
    setYieldData({
      ...yieldData,
      [e.target.name]: e.target.value
    });
  };

  const handleFertilizerChange = (e) => {
    setFertilizerData({
      ...fertilizerData,
      [e.target.name]: e.target.value
    });
  };

  const handleCropChange = (e) => {
    setCropData({
      ...cropData,
      [e.target.name]: e.target.value
    });
  };

  const calculateYield = () => {
    // Simulate yield calculation
    const baseYield = 2.5; // tons per hectare
    const area = parseFloat(yieldData.area) || 0;
    const seasonMultiplier = yieldData.season === 'Kharif' ? 1.2 : 1.0;
    const cropMultiplier = yieldData.crop === 'Wheat' ? 1.1 : 1.0;
    
    return (baseYield * area * seasonMultiplier * cropMultiplier).toFixed(2);
  };

  const getFertilizerRecommendation = () => {
    // Simulate fertilizer recommendation
    const n = parseFloat(fertilizerData.nitrogen) || 0;
    const p = parseFloat(fertilizerData.phosphorous) || 0;
    const k = parseFloat(fertilizerData.potassium) || 0;
    
    if (n < 50 && p < 30 && k < 20) return 'NPK 20:20:20';
    if (n < 50) return 'Urea (46-0-0)';
    if (p < 30) return 'DAP (18-46-0)';
    if (k < 20) return 'MOP (0-0-60)';
    return 'Balanced NPK 15:15:15';
  };

  const getCropRecommendation = () => {
    // Simulate crop recommendation
    const ph = parseFloat(cropData.ph) || 7;
    const temp = parseFloat(cropData.temperature) || 25;
    const rainfall = parseFloat(cropData.rainfall) || 50;
    
    if (ph < 6.5 && temp > 20 && rainfall > 60) return 'Rice, Maize';
    if (ph > 6.5 && ph < 7.5 && temp > 15 && rainfall > 40) return 'Wheat, Chickpea';
    if (ph > 7.0 && temp > 25 && rainfall < 50) return 'Cotton, Groundnut';
    return 'Wheat, Rice, Maize';
  };

  const internalCards = [
    {
      id: 'yield',
      title: 'Yield Prediction',
      icon: <FaCalculator />,
      color: 'var(--primary-green)'
    },
    {
      id: 'fertilizer',
      title: 'Fertilizer Recommendation',
      icon: <FaFlask />,
      color: 'var(--accent-blue)'
    },
    {
      id: 'crop',
      title: 'Crop Recommendation',
      icon: <FaChartLine />,
      color: 'var(--accent-yellow)'
    },
    {
      id: 'future',
      title: 'Future Expansion',
      icon: <FaPlus />,
      color: 'var(--accent-purple)'
    }
  ];

  const renderYieldCard = () => (
    <div className="internal-card-content">
      <div className="form-section">
        <h4>Input Parameters</h4>
        <div className="form-grid">
          <div className="form-group">
            <label>State</label>
            <select name="state" value={yieldData.state} onChange={handleYieldChange}>
              <option value="">Select State</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Punjab">Punjab</option>
              <option value="Haryana">Haryana</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
            </select>
          </div>
          <div className="form-group">
            <label>District</label>
            <select name="district" value={yieldData.district} onChange={handleYieldChange}>
              <option value="">Select District</option>
              <option value="Pune">Pune</option>
              <option value="Nashik">Nashik</option>
              <option value="Aurangabad">Aurangabad</option>
            </select>
          </div>
          <div className="form-group">
            <label>Season</label>
            <select name="season" value={yieldData.season} onChange={handleYieldChange}>
              <option value="">Select Season</option>
              <option value="Kharif">Kharif</option>
              <option value="Rabi">Rabi</option>
              <option value="Zaid">Zaid</option>
            </select>
          </div>
          <div className="form-group">
            <label>Crop</label>
            <select name="crop" value={yieldData.crop} onChange={handleYieldChange}>
              <option value="">Select Crop</option>
              <option value="Wheat">Wheat</option>
              <option value="Rice">Rice</option>
              <option value="Maize">Maize</option>
              <option value="Cotton">Cotton</option>
            </select>
          </div>
          <div className="form-group">
            <label>Area (Hectares)</label>
            <input
              type="number"
              name="area"
              value={yieldData.area}
              onChange={handleYieldChange}
              placeholder="Enter area"
            />
          </div>
        </div>
      </div>

      <div className="result-section">
        <h4>Production Prediction</h4>
        <div className="result-display">
          <div className="result-value">{calculateYield()}</div>
          <div className="result-unit">Tons</div>
        </div>
      </div>
    </div>
  );

  const renderFertilizerCard = () => (
    <div className="internal-card-content">
      <div className="form-section">
        <h4>Soil & Environmental Parameters</h4>
        <div className="form-grid">
          <div className="form-group">
            <label>Nitrogen (N)</label>
            <input
              type="number"
              name="nitrogen"
              value={fertilizerData.nitrogen}
              onChange={handleFertilizerChange}
              placeholder="kg/ha"
            />
          </div>
          <div className="form-group">
            <label>Phosphorous (P)</label>
            <input
              type="number"
              name="phosphorous"
              value={fertilizerData.phosphorous}
              onChange={handleFertilizerChange}
              placeholder="kg/ha"
            />
          </div>
          <div className="form-group">
            <label>Potassium (K)</label>
            <input
              type="number"
              name="potassium"
              value={fertilizerData.potassium}
              onChange={handleFertilizerChange}
              placeholder="kg/ha"
            />
          </div>
          <div className="form-group">
            <label>Temperature (°C)</label>
            <input
              type="number"
              name="temperature"
              value={fertilizerData.temperature}
              onChange={handleFertilizerChange}
              placeholder="°C"
            />
          </div>
          <div className="form-group">
            <label>Humidity (%)</label>
            <input
              type="number"
              name="humidity"
              value={fertilizerData.humidity}
              onChange={handleFertilizerChange}
              placeholder="%"
            />
          </div>
          <div className="form-group">
            <label>Moisture (%)</label>
            <input
              type="number"
              name="moisture"
              value={fertilizerData.moisture}
              onChange={handleFertilizerChange}
              placeholder="%"
            />
          </div>
          <div className="form-group">
            <label>Soil Type</label>
            <select name="soilType" value={fertilizerData.soilType} onChange={handleFertilizerChange}>
              <option value="">Select Soil Type</option>
              <option value="Loamy">Loamy</option>
              <option value="Clay">Clay</option>
              <option value="Sandy">Sandy</option>
              <option value="Red">Red</option>
            </select>
          </div>
          <div className="form-group">
            <label>Crop Type</label>
            <select name="cropType" value={fertilizerData.cropType} onChange={handleFertilizerChange}>
              <option value="">Select Crop</option>
              <option value="Cereal">Cereal</option>
              <option value="Pulse">Pulse</option>
              <option value="Oilseed">Oilseed</option>
              <option value="Vegetable">Vegetable</option>
            </select>
          </div>
        </div>
      </div>

      <div className="result-section">
        <h4>Recommended Fertilizer</h4>
        <div className="result-display">
          <div className="result-value">{getFertilizerRecommendation()}</div>
          <div className="result-unit">Fertilizer</div>
        </div>
      </div>
    </div>
  );

  const renderCropCard = () => (
    <div className="internal-card-content">
      <div className="form-section">
        <h4>Environmental Parameters</h4>
        <div className="form-grid">
          <div className="form-group">
            <label>Nitrogen (N)</label>
            <input
              type="number"
              name="nitrogen"
              value={cropData.nitrogen}
              onChange={handleCropChange}
              placeholder="kg/ha"
            />
          </div>
          <div className="form-group">
            <label>Phosphorous (P)</label>
            <input
              type="number"
              name="phosphorous"
              value={cropData.phosphorous}
              onChange={handleCropChange}
              placeholder="kg/ha"
            />
          </div>
          <div className="form-group">
            <label>Potassium (K)</label>
            <input
              type="number"
              name="potassium"
              value={cropData.potassium}
              onChange={handleCropChange}
              placeholder="kg/ha"
            />
          </div>
          <div className="form-group">
            <label>Temperature (°C)</label>
            <input
              type="number"
              name="temperature"
              value={cropData.temperature}
              onChange={handleCropChange}
              placeholder="°C"
            />
          </div>
          <div className="form-group">
            <label>Humidity (%)</label>
            <input
              type="number"
              name="humidity"
              value={cropData.humidity}
              onChange={handleCropChange}
              placeholder="%"
            />
          </div>
          <div className="form-group">
            <label>pH Level</label>
            <input
              type="number"
              name="ph"
              value={cropData.ph}
              onChange={handleCropChange}
              placeholder="pH"
              step="0.1"
            />
          </div>
          <div className="form-group">
            <label>Rainfall (%)</label>
            <input
              type="number"
              name="rainfall"
              value={cropData.rainfall}
              onChange={handleCropChange}
              placeholder="%"
            />
          </div>
        </div>
      </div>

      <div className="result-section">
        <h4>Recommended Crops</h4>
        <div className="result-display">
          <div className="result-value">{getCropRecommendation()}</div>
          <div className="result-unit">Crops</div>
        </div>
      </div>
    </div>
  );

  const renderFutureCard = () => (
    <div className="internal-card-content">
      <div className="future-placeholder">
        <FaPlus className="placeholder-icon" />
        <h4>Future Expansion</h4>
        <p>Additional crop planning features will be added here</p>
        <div className="placeholder-features">
          <div className="feature-item">• Pest Management</div>
          <div className="feature-item">• Irrigation Planning</div>
          <div className="feature-item">• Market Analysis</div>
          <div className="feature-item">• Cost Optimization</div>
        </div>
      </div>
    </div>
  );

  const renderActiveCard = () => {
    switch (activeCard) {
      case 'yield':
        return renderYieldCard();
      case 'fertilizer':
        return renderFertilizerCard();
      case 'crop':
        return renderCropCard();
      case 'future':
        return renderFutureCard();
      default:
        return renderYieldCard();
    }
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
          <h3>Crop Planner</h3>
        </div>
      </div>

      <div className="card-content">
        {/* Internal Cards Navigation */}
        <div className="internal-cards-nav">
          {internalCards.map((card) => (
            <motion.button
              key={card.id}
              className={`internal-card-nav ${activeCard === card.id ? 'active' : ''}`}
              onClick={() => setActiveCard(card.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ '--card-color': card.color }}
            >
              <div className="nav-icon">{card.icon}</div>
              <span>{card.title}</span>
            </motion.button>
          ))}
        </div>

        {/* Active Card Content */}
        <div className="internal-card-container">
          {renderActiveCard()}
        </div>
      </div>
    </motion.div>
  );
};

export default CropPlannerCard;
