import React from 'react';
import { motion } from 'framer-motion';
import { FaHandshake, FaMapMarkerAlt, FaRupeeSign, FaPhone, FaEnvelope, FaStar } from 'react-icons/fa';
import './DashboardCard.css';

const MarketOffersCard = ({ crop }) => {
  // Simulate market offers data
  const marketOffersData = {
    crop: crop,
    lastUpdated: '1 hour ago',
    offers: [
      {
        id: 1,
        buyer: 'AgriTech Solutions Ltd.',
        location: 'Hyderabad, Telangana',
        price: 75,
        unit: 'per kg',
        quantity: '5000 kg',
        quality: 'Grade A',
        delivery: 'Ex-farm',
        rating: 4.8,
        verified: true,
        contact: {
          phone: '+91 98765 43210',
          email: 'procurement@agritech.com'
        },
        offerValid: '7 days',
        specialTerms: 'Direct payment within 48 hours',
        highlights: [
          'Premium price for organic produce',
          'Long-term contract available',
          'Transportation assistance provided'
        ]
      },
      {
        id: 2,
        buyer: 'Fresh Harvest Co.',
        location: 'Mumbai, Maharashtra',
        price: 72,
        unit: 'per kg',
        quantity: '3000 kg',
        quality: 'Grade A/B',
        delivery: 'Ex-farm',
        rating: 4.6,
        verified: true,
        contact: {
          phone: '+91 87654 32109',
          email: 'buy@freshharvest.co.in'
        },
        offerValid: '5 days',
        specialTerms: 'Weekly payment cycle',
        highlights: [
          'Regular buyer with good payment history',
          'Quality testing at farm gate',
          'Flexible quantity requirements'
        ]
      },
      {
        id: 3,
        buyer: 'Organic Valley Foods',
        location: 'Pune, Maharashtra',
        price: 78,
        unit: 'per kg',
        quantity: '2000 kg',
        quality: 'Organic Certified Only',
        delivery: 'Ex-farm',
        rating: 4.9,
        verified: true,
        contact: {
          phone: '+91 76543 21098',
          email: 'organic@valleyfoods.com'
        },
        offerValid: '10 days',
        specialTerms: 'Organic certification required',
        highlights: [
          'Highest price for organic produce',
          'International export opportunities',
          'Technical support for organic farming'
        ]
      }
    ],
    marketInsights: [
      'Current market demand is high for quality produce',
      'Organic products fetching 15-20% premium',
      'Direct buyer offers typically 8-12% higher than mandi prices',
      'Consider long-term contracts for price stability'
    ]
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="star half-filled" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="star empty" />);
    }
    
    return stars;
  };

  return (
    <motion.div
      className="dashboard-card market-offers-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <div className="card-header">
        <div className="card-title">
          <FaHandshake className="card-icon" />
          <h3>Market Price / Buyer Offers</h3>
        </div>
        <div className="last-updated">
          <span>Updated: {marketOffersData.lastUpdated}</span>
        </div>
      </div>

      <div className="card-content">
        {/* Market Overview */}
        <div className="market-overview">
          <h4>Direct Buyer Offers for {marketOffersData.crop.charAt(0).toUpperCase() + marketOffersData.crop.slice(1)}</h4>
          <p className="market-subtitle">Premium prices from verified buyers</p>
        </div>

        {/* Offers List */}
        <div className="offers-list">
          {marketOffersData.offers.map((offer, index) => (
            <div key={offer.id} className="offer-item">
              <div className="offer-header">
                <div className="buyer-info">
                  <div className="buyer-name">
                    {offer.buyer}
                    {offer.verified && <span className="verified-badge">✓ Verified</span>}
                  </div>
                  <div className="buyer-location">
                    <FaMapMarkerAlt className="location-icon" />
                    {offer.location}
                  </div>
                </div>
                <div className="offer-rating">
                  <div className="stars">{getRatingStars(offer.rating)}</div>
                  <div className="rating-value">{offer.rating}</div>
                </div>
              </div>

              <div className="offer-details">
                <div className="offer-price-section">
                  <div className="offer-price">
                    <FaRupeeSign className="rupee-icon" />
                    <span className="price-number">{offer.price}</span>
                    <span className="price-unit">/{offer.unit}</span>
                  </div>
                  <div className="offer-quantity">
                    Quantity: <strong>{offer.quantity}</strong>
                  </div>
                </div>

                <div className="offer-specs">
                  <div className="spec-item">
                    <span className="spec-label">Quality:</span>
                    <span className="spec-value">{offer.quality}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Delivery:</span>
                    <span className="spec-value">{offer.delivery}</span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">Valid for:</span>
                    <span className="spec-value">{offer.offerValid}</span>
                  </div>
                </div>

                <div className="offer-highlights">
                  <h5>Highlights:</h5>
                  <ul>
                    {offer.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                </div>

                <div className="offer-terms">
                  <div className="special-terms">
                    <strong>Special Terms:</strong> {offer.specialTerms}
                  </div>
                </div>

                <div className="offer-contact">
                  <div className="contact-info">
                    <div className="contact-item">
                      <FaPhone className="contact-icon" />
                      <span>{offer.contact.phone}</span>
                    </div>
                    <div className="contact-item">
                      <FaEnvelope className="contact-icon" />
                      <span>{offer.contact.email}</span>
                    </div>
                  </div>
                  <button className="contact-buyer-btn">Contact Buyer</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Market Insights */}
        <div className="market-insights">
          <h4>Market Insights & Recommendations:</h4>
          <ul>
            {marketOffersData.marketInsights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketOffersCard;
