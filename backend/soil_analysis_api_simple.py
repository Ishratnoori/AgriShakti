from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import json
from datetime import datetime, timedelta
import random

# Initialize FastAPI app
app = FastAPI(title="AgriShakti Soil Analysis API (Simple)", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class SoilAnalysisRequest(BaseModel):
    latitude: float
    longitude: float
    buffer_meters: int = 50
    start_date: str
    end_date: str

# Response model
class SoilAnalysisResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: str
    timestamp: str

def analyze_soil_health_simple(lat: float, lon: float, buffer_m: int, start: str, end: str) -> Dict[str, Any]:
    """
    Simplified soil health analysis using simulated data
    This version works without Google Earth Engine for testing
    """
    try:
        # Simulate realistic soil data based on location
        # In a real implementation, this would come from Earth Engine
        
        # Generate consistent but realistic values based on coordinates
        random.seed(int(lat * 1000 + lon * 1000))
        
        # Simulate NDVI (0.1 to 0.9, higher is better)
        ndvi_val = 0.3 + (random.random() * 0.6)
        
        # Simulate soil properties based on location
        # These ranges are typical for agricultural soils
        ph_val = 5.5 + (random.random() * 3.0)  # 5.5 to 8.5
        soc_pct_val = 1.0 + (random.random() * 4.0)  # 1.0% to 5.0%
        wc33_val = 25.0 + (random.random() * 25.0)  # 25% to 50%
        
        # Simulate soil moisture (0.1 to 0.4 cm3/cm3)
        sm_surface_val = 0.1 + (random.random() * 0.3)
        sm_rootzone_val = 0.15 + (random.random() * 0.25)
        
        # Determine soil health status based on simulated values
        health_status = "healthy"
        health_percentage = 90
        stress_areas = 10
        
        # Analyze pH (optimal range: 6.0-7.5)
        if ph_val < 5.5 or ph_val > 8.0:
            health_status = "warning"
            health_percentage = 70
            stress_areas = 25
        elif ph_val < 6.0 or ph_val > 7.5:
            health_status = "warning"
            health_percentage = 80
            stress_areas = 20
        
        # Analyze organic carbon (optimal: >2%)
        if soc_pct_val < 1.0:
            health_status = "warning"
            health_percentage = min(health_percentage, 75)
            stress_areas = max(stress_areas, 30)
        
        # Analyze water holding capacity
        if wc33_val < 30:
            health_status = "warning"
            health_percentage = min(health_percentage, 80)
            stress_areas = max(stress_areas, 25)
        
        # Generate recommendations based on analysis
        recommendations = []
        if ph_val < 6.0:
            recommendations.append("Consider adding lime to raise soil pH")
        elif ph_val > 7.5:
            recommendations.append("Consider adding sulfur to lower soil pH")
        
        if soc_pct_val < 2.0:
            recommendations.append("Add organic matter to improve soil fertility")
        
        if wc33_val < 30:
            recommendations.append("Improve soil structure to enhance water retention")
        
        if not recommendations:
            recommendations.append("Continue current soil management practices")
            recommendations.append("Monitor soil health regularly")
        
        return {
            "status": health_status,
            "ndvi": ndvi_val,
            "healthPercentage": health_percentage,
            "stressAreas": stress_areas,
            "soilData": {
                "ph": ph_val,
                "organicCarbon": soc_pct_val,
                "waterHoldingCapacity": wc33_val,
                "surfaceMoisture": sm_surface_val,
                "rootzoneMoisture": sm_rootzone_val
            },
            "recommendations": recommendations,
            "message": f"Your soil analysis shows {health_status} conditions. pH: {ph_val:.1f}, Organic Carbon: {soc_pct_val:.1f}%, Water Holding Capacity: {wc33_val:.1f}%"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Soil analysis failed: {str(e)}")

@app.get("/")
async def root():
    return {"message": "AgriShakti Soil Analysis API (Simple Version)"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/soil-analysis", response_model=SoilAnalysisResponse)
async def get_soil_analysis(request: SoilAnalysisRequest):
    """
    Get soil health analysis for a specific location
    """
    try:
        # Validate dates
        start_date = datetime.strptime(request.start_date, "%Y-%m-%d")
        end_date = datetime.strptime(request.end_date, "%Y-%m-%d")
        
        if end_date <= start_date:
            raise HTTPException(status_code=400, detail="End date must be after start date")
        
        # Perform soil analysis
        analysis_result = analyze_soil_health_simple(
            request.latitude,
            request.longitude,
            request.buffer_meters,
            request.start_date,
            request.end_date
        )
        
        return SoilAnalysisResponse(
            success=True,
            data=analysis_result,
            message="Soil analysis completed successfully (simulated data)",
            timestamp=datetime.now().isoformat()
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/api/soil-analysis/{lat}/{lon}")
async def get_soil_analysis_simple(lat: float, lon: float):
    """
    Get soil health analysis with default parameters
    """
    try:
        # Use default dates (last 3 months)
        end_date = datetime.now()
        start_date = end_date - timedelta(days=90)
        
        analysis_result = analyze_soil_health_simple(
            lat, lon, 50,
            start_date.strftime("%Y-%m-%d"),
            end_date.strftime("%Y-%m-%d")
        )
        
        return SoilAnalysisResponse(
            success=True,
            data=analysis_result,
            message="Soil analysis completed successfully (simulated data)",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
