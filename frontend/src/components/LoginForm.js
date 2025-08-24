import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaUser, FaPhone, FaMapMarkerAlt, FaSeedling } from 'react-icons/fa';
import './LoginForm.css';

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    location: '',
    crop: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.mobile && formData.location && formData.crop) {
      onLogin(formData);
    }
  };

  return (
    <div className="login-container">
      <div className="floating-wheat">🌾</div>
      <div className="floating-seedling">🌱</div>
      <div className="floating-farmer">👨‍🌾</div>
      <div className="floating-sun">☀️</div>
      <div className="floating-cloud">☁️</div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="login-card"
      >
        <div className="login-header">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="logo-container"
          >
            <FaLeaf className="logo-icon" />
          </motion.div>
          <h1 className="login-title">AgriShakti</h1>
          <p className="login-subtitle">Your Smart Farming Companion</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="form-group"
          >
            <label htmlFor="name" className="form-label">
              <FaUser className="input-icon" />
              Farmer Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your full name"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="form-group"
          >
            <label htmlFor="mobile" className="form-label">
              <FaPhone className="input-icon" />
              Mobile Number
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your mobile number"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="form-group"
          >
            <label htmlFor="location" className="form-label">
              <FaMapMarkerAlt className="input-icon" />
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your village/city"
              required
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="form-group"
          >
            <label htmlFor="crop" className="form-label">
              <FaSeedling className="input-icon" />
              Current Crop
            </label>
            <select
              id="crop"
              name="crop"
              value={formData.crop}
              onChange={handleChange}
              className="form-input"
              required
            >
              <option value="">Select your crop</option>
              <option value="wheat">Wheat</option>
              <option value="rice">Rice</option>
              <option value="maize">Maize</option>
              <option value="cotton">Cotton</option>
              <option value="sugarcane">Sugarcane</option>
              <option value="pulses">Pulses</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
            </select>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            type="submit"
            className="login-button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FaLeaf className="button-icon" />
            Enter Dashboard
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="login-footer"
        >
          <p>Empowering farmers with smart technology</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
