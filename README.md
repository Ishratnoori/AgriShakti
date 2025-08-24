# AgriShakti - Agriculture Technology Platform

A comprehensive agriculture technology platform to help farmers all over the world.

## 🚀 New Feature: Real-Time Soil Analysis

The platform now includes **real-time soil health analysis** powered by Google Earth Engine:

- **Satellite-based NDVI** calculation for crop health monitoring
- **Soil moisture analysis** from NASA SMAP data
- **Soil property assessment** (pH, organic carbon, water holding capacity)
- **AI-powered recommendations** based on soil health status
- **Real-time data integration** with the Crop Health Card

### Quick Start for Soil Analysis

1. **Install Python dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Authenticate with Google Earth Engine:**
   ```bash
   earthengine authenticate
   ```

3. **Start the soil analysis API:**
   ```bash
   # Windows
   start_soil_api.bat
   
   # Linux/Mac
   python start_soil_api.py
   ```

4. **Access the API:**
   - API: http://localhost:8000
   - Documentation: http://localhost:8000/docs
   - Health Check: http://localhost:8000/health

See `backend/README_SOIL_API.md` for detailed documentation.

## Project Structure

```
AgriShakti/
├── frontend/                 # React frontend application
│   ├── public/              # Static files
│   ├── src/                 # React source code
│   │   ├── components/      # React components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   ├── FarmerDashboard.js
│   │   │   └── LoginForm.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── backend/                  # Node.js/Express backend + Python FastAPI
│   ├── routes/              # API routes
│   ├── controllers/         # Route controllers
│   ├── models/              # Database models
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   ├── server.js            # Main Express server file
│   ├── soil_analysis_api.py # Python FastAPI for soil analysis
│   ├── requirements.txt     # Python dependencies
│   ├── start_soil_api.py   # Python API startup script
│   ├── start_soil_api.bat  # Windows startup script
│   ├── package.json
│   ├── README_SOIL_API.md  # Soil API documentation
│   └── README.md
├── package.json              # Root package.json
└── README.md                 # This file
```


