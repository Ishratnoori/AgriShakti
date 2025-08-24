from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import ee
import json
from datetime import datetime, timedelta

# Initialize FastAPI app
app = FastAPI(title="AgriShakti Soil Analysis API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Google Earth Engine
try:
    ee.Initialize()
except Exception as e:
    print(f"Warning: Earth Engine not initialized: {e}")

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

def analyze_soil_health(lat: float, lon: float, buffer_m: int, start: str, end: str) -> Dict[str, Any]:
    """
    Analyze soil health using Google Earth Engine data
    """
    try:
        # Create area of interest
        aoi = ee.Geometry.Point([lon, lat]).buffer(buffer_m).bounds()
        
        # Sentinel-2 NDVI calculation
        def s2_cloudmask(img):
            scl = img.select('SCL')
            keep = scl.remap([3, 8, 9, 10], [0, 0, 0, 0], 1)
            return img.updateMask(keep)
        
        s2 = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
              .filterBounds(aoi).filterDate(start, end).map(s2_cloudmask))
        
        ndvi = s2.median().normalizedDifference(['B8', 'B4']).rename('NDVI')
        
        # SMAP soil moisture
        smap = (ee.ImageCollection('NASA/SMAP/SPL4SMGP/007')
                .filterDate(start, end).select(['sm_surface', 'sm_rootzone']))
        sm_surface = smap.select('sm_surface').mean().rename('SM_surface')
        sm_rootzone = smap.select('sm_rootzone').mean().rename('SM_rootzone')
        
        # Static soil properties
        ph_img = ee.Image('OpenLandMap/SOL/SOL_PH-H2O_USDA-4C1A2A_M/v02').select(['b0','b10','b30']).multiply(0.1)
        ph_top30 = ph_img.reduce(ee.Reducer.mean()).rename('pH_top30cm')
        
        soc_img = ee.Image('OpenLandMap/SOL/SOL_ORGANIC-CARBON_USDA-6A1C_M/v02').select(['b0','b10','b30']).multiply(5.0)
        soc_gkg_top30 = soc_img.reduce(ee.Reducer.mean()).rename('SOC_gkg_top30cm')
        soc_pct_top30 = soc_gkg_top30.divide(10.0).rename('SOC_pct_top30cm')
        
        wc33_img = ee.Image('OpenLandMap/SOL/SOL_WATERCONTENT-33KPA_USDA-4B1C_M/v01').select(['b0','b10','b30'])
        wc33_top30 = wc33_img.reduce(ee.Reducer.mean()).rename('WC33_vpct_top30cm')
        
        # Calculate zonal statistics
        def mean_over(img, scale):
            return img.reduceRegion(
                reducer=ee.Reducer.mean(), geometry=aoi, scale=scale, maxPixels=1e9)
        
        # Get all values
        ndvi_val = mean_over(ndvi, 10).getInfo().get('NDVI', 0)
        sm_surface_val = mean_over(sm_surface, 10000).getInfo().get('SM_surface', 0)
        sm_rootzone_val = mean_over(sm_rootzone, 10000).getInfo().get('SM_rootzone', 0)
        ph_val = mean_over(ph_top30, 250).getInfo().get('pH_top30cm', 0)
        soc_gkg_val = mean_over(soc_gkg_top30, 250).getInfo().get('SOC_gkg_top30cm', 0)
        soc_pct_val = mean_over(soc_pct_top30, 250).getInfo().get('SOC_pct_top30cm', 0)
        wc33_val = mean_over(wc33_top30, 250).getInfo().get('WC33_vpct_top30cm', 0)
        
        # Determine soil health status
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
    return {"message": "AgriShakti Soil Analysis API"}

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
        analysis_result = analyze_soil_health(
            request.latitude,
            request.longitude,
            request.buffer_meters,
            request.start_date,
            request.end_date
        )
        
        return SoilAnalysisResponse(
            success=True,
            data=analysis_result,
            message="Soil analysis completed successfully",
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
        
        analysis_result = analyze_soil_health(
            lat, lon, 50,
            start_date.strftime("%Y-%m-%d"),
            end_date.strftime("%Y-%m-%d")
        )
        
        return SoilAnalysisResponse(
            success=True,
            data=analysis_result,
            message="Soil analysis completed successfully",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
