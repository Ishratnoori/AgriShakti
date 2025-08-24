#!/usr/bin/env python3
"""
Startup script for AgriShakti Soil Analysis API
"""
import uvicorn
from soil_analysis_api import app

if __name__ == "__main__":
    print("Starting AgriShakti Soil Analysis API...")
    print("API will be available at: http://localhost:8000")
    print("Documentation: http://localhost:8000/docs")
    print("Health check: http://localhost:8000/health")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
