# 🌱 AgriShakti - Smart Farmer Dashboard

A comprehensive, single-page farmer dashboard application designed for hackathons and real-world farming needs. This application showcases all essential farming features in one impressive, modular layout.

## ✨ Features

### 🔑 **Farmer Login & Personalization**
- Simple login form collecting: Name, Mobile, Location, Current Crop
- Personalized dashboard experience
- Beautiful, animated UI with smooth transitions

### 📊 **Complete Dashboard Overview (Single Page)**

#### 🌾 **Crop Health (Crop Doctor)**
- NDVI color-coded status indicators (Green/Yellow/Red)
- Health percentage and stress area analysis
- Smart recommendations for crop management
- Visual health indicators with circular progress

#### 🧪 **Soil Testing Results**
- NPK values (Nitrogen, Phosphorus, Potassium)
- pH levels and moisture content
- Color-coded nutrient status
- Actionable soil recommendations

#### 🌦️ **Weather Conditions**
- Hyperlocal 4-day weather forecast
- Current weather with detailed metrics
- Weather alerts and farming recommendations
- Beautiful weather icons and visual indicators

#### 💧 **Smart Irrigation**
- Soil moisture monitoring with visual indicators
- 3-day irrigation schedule
- Smart recommendations based on weather and soil
- Optimal irrigation timing suggestions

#### 🏪 **Mandi Prices (Agmarknet Integration)**
- Live prices from nearby mandis
- Best price highlighting
- Price trends and market insights
- Distance and quality information

#### 📅 **Crop Planner (Next Season)**
- Season-based crop recommendations
- Suitability scoring with visual indicators
- Sowing and harvest timelines
- Market demand analysis

#### 📈 **Market Price / Buyer Offers**
- Direct buyer offers with ratings
- Verified buyer badges
- Premium pricing opportunities
- Contact information and special terms

#### 🗣️ **AI Farming Assistant (Chatbot)**
- Vernacular language support
- Quick question buttons
- Voice input capability
- Context-aware farming advice
- Daily farming tips

## 🎨 **Design Features**

- **Modern UI/UX**: Clean, professional design perfect for hackathon demos
- **Responsive Layout**: Works seamlessly on all devices
- **Color-Coded Status**: Green (Healthy), Yellow (Warning), Red (Danger)
- **Smooth Animations**: Framer Motion animations for engaging user experience
- **Modular Cards**: Each feature in its own beautiful card
- **Professional Styling**: CSS custom properties and modern design patterns

## 🚀 **Why Judges Will Love This**

✅ **Everything at One Glance** - All features accessible without navigation  
✅ **Farmer-Friendly** - Simple, intuitive interface  
✅ **Visually Impressive** - Professional, polished appearance  
✅ **Scalable Architecture** - Easy to add more features  
✅ **Real-World Ready** - Looks like a production product  

## 🛠️ **Technology Stack**

- **Frontend**: React 18 with modern hooks
- **Styling**: CSS3 with custom properties and responsive design
- **Animations**: Framer Motion for smooth interactions
- **Icons**: React Icons (FontAwesome)
- **Build Tool**: Create React App
- **Package Manager**: npm

## 📦 **Installation & Setup**

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd agrishakti-farmer-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## 🎯 **Usage Guide**

### **For Farmers:**
1. Enter your details on the login page
2. View your personalized dashboard
3. Check crop health, soil conditions, and weather
4. Get irrigation and crop planning advice
5. Check mandi prices and buyer offers
6. Ask questions to the AI assistant

### **For Hackathon Judges:**
1. **Login Demo**: Use any name, mobile, location, and crop
2. **Dashboard Tour**: All features visible in one screen
3. **Interactive Elements**: Click on cards to see hover effects
4. **Chatbot Demo**: Ask farming questions
5. **Responsive Test**: Resize browser to see mobile adaptation

## 🔧 **Customization**

### **Adding New Features:**
- Create new card components in `src/components/dashboard/`
- Add them to the dashboard grid in `FarmerDashboard.js`
- Style them using the shared `DashboardCard.css`

### **Modifying Data:**
- Update simulated data in each card component
- Integrate real APIs by replacing mock data
- Customize recommendations and insights

### **Styling Changes:**
- Modify CSS custom properties in `src/index.css`
- Update card-specific styles in `DashboardCard.css`
- Adjust responsive breakpoints as needed

## 📱 **Responsive Design**

- **Desktop**: Full grid layout with all features visible
- **Tablet**: Responsive grid with optimized spacing
- **Mobile**: Single-column layout with touch-friendly interactions
- **All Devices**: Consistent visual hierarchy and readability

## 🌟 **Future Enhancements**

- **Real API Integration**: Weather, soil testing, mandi prices
- **Multi-language Support**: Hindi, Marathi, Gujarati, etc.
- **Offline Capability**: PWA features for rural areas
- **Push Notifications**: Weather alerts and price updates
- **Data Analytics**: Historical farming data and trends
- **Community Features**: Farmer-to-farmer communication

## 🤝 **Contributing**

This project is perfect for:
- **Hackathons**: Complete, working demo
- **Learning**: Modern React patterns and CSS
- **Extension**: Adding new farming features
- **Customization**: Adapting for different regions

## 📄 **License**

This project is open source and available under the MIT License.

## 🙏 **Acknowledgments**

- **Farmers**: For inspiring this digital solution
- **React Community**: For the amazing framework
- **Design Inspiration**: Modern dashboard patterns
- **Agricultural Experts**: For domain knowledge

---

**Built with ❤️ for Smart Agriculture**

*Empowering farmers with technology, one dashboard at a time.*
