import React from 'react';
import { motion } from 'framer-motion';
import { FaRobot, FaMicrophone, FaPaperPlane, FaLeaf, FaTint, FaThermometerHalf, FaSeedling } from 'react-icons/fa';
import './DashboardCard.css';

const ChatbotCard = ({ chatMessage, setChatMessage, chatResponse, onSubmit }) => {
  const quickQuestions = [
    'When should I irrigate?',
    'How much fertilizer to apply?',
    'Is my crop healthy?',
    'When to harvest?',
    'Best time for pesticide?'
  ];

  const handleQuickQuestion = (question) => {
    setChatMessage(question);
  };

  return (
    <motion.div
      className="dashboard-card chatbot-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-header">
        <div className="card-title">
          <FaRobot className="card-icon" />
          <h3>AI Farming Assistant</h3>
        </div>
        <div className="chatbot-status">
          <span className="status-dot online"></span>
          <span className="status-text">Online</span>
        </div>
      </div>

      <div className="card-content">
        {/* Chatbot Introduction */}
        <div className="chatbot-intro">
          <div className="bot-avatar">
            <FaRobot className="bot-icon" />
          </div>
          <div className="intro-text">
            <h4>Namaste! 🙏</h4>
            <p>I'm your AI farming assistant. Ask me anything about your crops, soil, weather, or farming practices.</p>
          </div>
        </div>

        {/* Quick Questions */}
        <div className="quick-questions">
          <h5>Quick Questions:</h5>
          <div className="questions-grid">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                className="quick-question-btn"
                onClick={() => handleQuickQuestion(question)}
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="chat-interface">
          <form onSubmit={onSubmit} className="chat-form">
            <div className="chat-input-container">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask me about farming... (e.g., When should I irrigate?)"
                className="chat-input"
                required
              />
              <div className="chat-actions">
                <button type="button" className="voice-btn" title="Voice Input">
                  <FaMicrophone />
                </button>
                <button type="submit" className="send-btn" title="Send Message">
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Chat Response */}
        {chatResponse && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="chat-response"
          >
            <div className="response-header">
              <FaRobot className="response-icon" />
              <span className="response-label">AI Assistant Response:</span>
            </div>
            <div className="response-content">
              <p>{chatResponse}</p>
            </div>
          </motion.div>
        )}

        {/* Farming Tips */}
        <div className="farming-tips">
          <h5>💡 Today's Farming Tips:</h5>
          <div className="tips-list">
            <div className="tip-item">
              <FaLeaf className="tip-icon" />
              <span>Monitor soil moisture daily during flowering stage</span>
            </div>
            <div className="tip-item">
              <FaTint className="tip-icon" />
              <span>Irrigate early morning to reduce water loss</span>
            </div>
            <div className="tip-item">
              <FaThermometerHalf className="tip-icon" />
              <span>Check weather forecast before applying pesticides</span>
            </div>
            <div className="tip-item">
              <FaSeedling className="tip-icon" />
              <span>Prepare land for next season's crop rotation</span>
            </div>
          </div>
        </div>

        {/* Language Support */}
        <div className="language-support">
          <div className="language-info">
            <span className="language-label">Supported Languages:</span>
            <div className="languages">
              <span className="language">English</span>
              <span className="language">हिंदी</span>
              <span className="language">मराठी</span>
              <span className="language">ગુજરાતી</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatbotCard;
