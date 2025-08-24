# AgriShakti Soil Analysis API

This is a FastAPI service that provides soil health analysis using Google Earth Engine data. It's designed to integrate with the AgriShakti frontend to provide real-time soil health information.

## Features

- **Real-time soil analysis** using Google Earth Engine
- **NDVI calculation** from Sentinel-2 satellite data
- **Soil moisture analysis** from SMAP data
- **Soil property analysis** (pH, organic carbon, water holding capacity)
- **Health status assessment** with recommendations
- **RESTful API endpoints** for easy integration

## Prerequisites

1. **Python 3.8+** installed
2. **Google Earth Engine account** and authentication
3. **Required Python packages** (see requirements.txt)

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Google Earth Engine Authentication

Before running the API, you need to authenticate with Google Earth Engine:

```bash
# Install Earth Engine CLI
pip install earthengine-api

# Authenticate (this will open a browser window)
earthengine authenticate
```

### 3. Run the API

```bash
# Option 1: Using the startup script
python start_soil_api.py

# Option 2: Direct uvicorn
uvicorn soil_analysis_api:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### 1. Health Check
```
GET /health
```
Returns API status and timestamp.

### 2. Simple Soil Analysis
```
GET /api/soil-analysis/{latitude}/{longitude}
```
Get soil analysis for a specific location using default parameters (last 3 months).

**Example:**
```
GET /api/soil-analysis/17.9246/73.7120
```

### 3. Detailed Soil Analysis
```
POST /api/soil-analysis
```
Get detailed soil analysis with custom parameters.

**Request Body:**
```json
{
  "latitude": 17.9246031,
  "longitude": 73.7120122,
  "buffer_meters": 50,
  "start_date": "2025-01-10",
  "end_date": "2025-05-20"
}
```

## Response Format

All endpoints return data in this format:

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "ndvi": 0.461,
    "healthPercentage": 90,
    "stressAreas": 10,
    "soilData": {
      "ph": 5.6,
      "organicCarbon": 3.7,
      "waterHoldingCapacity": 41.7,
      "surfaceMoisture": 0.25,
      "rootzoneMoisture": 0.28
    },
    "recommendations": [
      "Consider adding lime to raise soil pH",
      "Add organic matter to improve soil fertility"
    ],
    "message": "Your soil analysis shows healthy conditions..."
  },
  "message": "Soil analysis completed successfully",
  "timestamp": "2025-01-15T10:30:00"
}
```

## Integration with Frontend

The CropHealthCard component automatically:
1. **Gets user location** (or uses default)
2. **Fetches soil analysis** from this API
3. **Displays real-time data** instead of simulated values
4. **Shows loading states** and error handling
5. **Provides refresh functionality**

## Data Sources

- **NDVI**: Sentinel-2 satellite imagery (10m resolution)
- **Soil Moisture**: NASA SMAP L4 data (3-hourly, averaged)
- **Soil Properties**: OpenLandMap global soil database
- **pH**: USDA soil classification system
- **Organic Carbon**: USDA organic carbon content
- **Water Holding Capacity**: Field capacity at 33 kPa

## Error Handling

The API includes comprehensive error handling:
- **Invalid coordinates** → 400 Bad Request
- **Date validation** → 400 Bad Request  
- **Earth Engine errors** → 500 Internal Server Error
- **Fallback data** → Frontend shows simulated data if API fails

## Performance Notes

- **First request** may take 10-15 seconds (Earth Engine initialization)
- **Subsequent requests** are typically 3-5 seconds
- **Data caching** is handled by Earth Engine
- **Concurrent requests** are supported

## Troubleshooting

### Common Issues

1. **"Earth Engine not initialized"**
   - Run `earthengine authenticate` first
   - Check your Google account permissions

2. **"Analysis failed"**
   - Verify coordinates are valid
   - Check date format (YYYY-MM-DD)
   - Ensure internet connection for satellite data

3. **Slow performance**
   - First request is always slower
   - Check Earth Engine service status
   - Reduce buffer size for faster processing

### Debug Mode

Enable debug logging by setting environment variable:
```bash
export LOG_LEVEL=debug
```

## Development

### Adding New Soil Parameters

1. Add new Earth Engine data source in `analyze_soil_health()`
2. Update response model in `SoilAnalysisResponse`
3. Add validation logic for new parameters
4. Update frontend to display new data

### Testing

Test the API endpoints:
```bash
# Health check
curl http://localhost:8000/health

# Simple analysis
curl http://localhost:8000/api/soil-analysis/17.9246/73.7120

# Interactive docs
open http://localhost:8000/docs
```

## License

This API is part of the AgriShakti project and follows the same license terms.
