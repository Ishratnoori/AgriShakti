import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaSignOutAlt, FaUser, FaMapMarkerAlt, FaSeedling, FaTimes, FaArrowLeft } from 'react-icons/fa';
import CropHealthCard from './dashboard/CropHealthCard';
import SoilTestingCard from './dashboard/SoilTestingCard';
import WeatherCard from './dashboard/WeatherCard';
import IrrigationCard from './dashboard/IrrigationCard';
import MandiPricesCard from './dashboard/MandiPricesCard';
import CropPlannerCard from './dashboard/CropPlannerCard';
import MarketOffersCard from './dashboard/MarketOffersCard';
import ChatbotCard from './dashboard/ChatbotCard';
import './FarmerDashboard.css';

const FarmerDashboard = ({ farmerData, onLogout }) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (chatMessage.trim()) {
      // Simulate chatbot response based on the message
      const response = generateChatResponse(chatMessage);
      setChatResponse(response);
      setChatMessage('');
    }
  };

  const generateChatResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('irrigat') || lowerMessage.includes('water')) {
      return "Based on current soil moisture and weather forecast, no irrigation is needed today. Schedule irrigation in 2 days when soil moisture drops below 30%.";
    } else if (lowerMessage.includes('fertiliz') || lowerMessage.includes('nutrient')) {
      return "Your soil test shows low Nitrogen levels. Apply 20 kg urea per acre within the next week for optimal crop growth.";
    } else if (lowerMessage.includes('pest') || lowerMessage.includes('disease')) {
      return "Your wheat crop shows no signs of pests or diseases. Continue monitoring and maintain current preventive measures.";
    } else if (lowerMessage.includes('harvest') || lowerMessage.includes('when')) {
      return "Based on current growth stage, your wheat crop will be ready for harvest in approximately 3-4 weeks.";
    } else {
      return "I'm here to help with your farming questions! Ask me about irrigation, fertilizers, pests, harvest timing, or any other farming concerns.";
    }
  };

  const dashboardCards = [
    {
      id: 'crop-health',
      title: 'Crop Health',
      icon: '🌾',
      component: <CropHealthCard crop={farmerData.crop} />
    },
    {
      id: 'soil-testing',
      title: 'Soil Testing',
      icon: '🧪',
      component: <SoilTestingCard />
    },
    {
      id: 'weather',
      title: 'Weather',
      icon: '🌦️',
      component: <WeatherCard location={farmerData.location} />
    },
    {
      id: 'irrigation',
      title: 'Smart Irrigation',
      icon: '💧',
      component: <IrrigationCard />
    },
    {
      id: 'mandi-prices',
      title: 'Mandi Prices',
      icon: '🏪',
      component: <MandiPricesCard crop={farmerData.crop} />
    },
    {
      id: 'crop-planner',
      title: 'Crop Planner',
      icon: '📅',
      component: <CropPlannerCard />
    },
    {
      id: 'market-offers',
      title: 'Market Offers',
      icon: '🤝',
      component: <MarketOffersCard crop={farmerData.crop} />
    },
    {
      id: 'chatbot',
      title: 'AI Assistant',
      icon: '🤖',
      component: (
        <ChatbotCard 
          chatMessage={chatMessage}
          setChatMessage={setChatMessage}
          chatResponse={chatResponse}
          onSubmit={handleChatSubmit}
        />
      )
    }
  ];

  const handleCardClick = (cardId) => {
    setSelectedCard(cardId);
  };

  const closeCard = () => {
    setSelectedCard(null);
  };

  // If a card is selected and it's not the chatbot, show full screen
  if (selectedCard && selectedCard !== 'chatbot') {
    const selectedCardData = dashboardCards.find(card => card.id === selectedCard);
    return (
      <div className="fullscreen-view">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fullscreen-header"
        >
          <div className="container">
            <div className="fullscreen-header-content">
              <button onClick={closeCard} className="back-btn">
                <FaArrowLeft />
                Back to Dashboard
              </button>
              <div className="fullscreen-title">
                <span className="fullscreen-icon">{selectedCardData.icon}</span>
                <h1>{selectedCardData.title}</h1>
              </div>
              <div className="farmer-info-mini">
                <span>{farmerData.name}</span>
                <span>•</span>
                <span>{farmerData.crop}</span>
              </div>
            </div>
          </div>
        </motion.header>

        <main className="fullscreen-main">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="fullscreen-content"
            >
              {selectedCardData.component}
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="dashboard-header"
      >
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <FaLeaf className="header-logo" />
              <h1 className="header-title">AgriShakti</h1>
            </div>
            <div className="header-right">
              <div className="farmer-info">
                <FaUser className="farmer-icon" />
                <span className="farmer-name">{farmerData.name}</span>
                <FaMapMarkerAlt className="location-icon" />
                <span className="farmer-location">{farmerData.location}</span>
                <FaSeedling className="crop-icon" />
                <span className="farmer-crop">{farmerData.crop}</span>
              </div>
              <button onClick={onLogout} className="logout-btn">
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="welcome-section"
          >
            <h2 className="welcome-title">
              Welcome back, {farmerData.name}! 👋
            </h2>
            <p className="welcome-subtitle">
              Click on any card below to see detailed information
            </p>
          </motion.div>

          {/* Simple Card Grid */}
          <div className="simple-cards-grid">
            {dashboardCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                className="simple-card"
                style={{ '--card-color': card.color }}
                onClick={() => handleCardClick(card.id)}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="card-icon-large">{card.icon}</div>
                <h3 className="card-title">{card.title}</h3>
                <div className="card-hint">Click to view details</div>
              </motion.div>
            ))}
          </div>

          {/* AI Assistant Modal Only */}
          <AnimatePresence>
            {selectedCard === 'chatbot' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="card-modal-overlay"
                onClick={closeCard}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="card-modal"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="modal-header">
                    <h2 className="modal-title">AI Assistant</h2>
                    <button className="close-btn" onClick={closeCard}>
                      <FaTimes />
                    </button>
                  </div>
                  <div className="modal-content">
                    {dashboardCards.find(card => card.id === 'chatbot')?.component}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;
