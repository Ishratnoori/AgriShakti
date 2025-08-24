#!/usr/bin/env python3
"""
Startup script for AgriShakti Simple Soil Analysis API
This version works without Google Earth Engine for testing
"""
import uvicorn
from soil_analysis_api_simple import app

if __name__ == "__main__":
    print("Starting AgriShakti Simple Soil Analysis API...")
    print("API will be available at: http://localhost:8000")
    print("Documentation: http://localhost:8000/docs")
    print("Health check: http://localhost:8000/health")
    print("Note: This version uses simulated data for testing")
    print("For real Earth Engine data, use soil_analysis_api.py")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
