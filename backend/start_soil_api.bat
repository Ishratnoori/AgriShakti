@echo off
echo Starting AgriShakti Soil Analysis API...
echo.
echo Make sure you have:
echo 1. Python installed and in PATH
echo 2. Dependencies installed (pip install -r requirements.txt)
echo 3. Google Earth Engine authenticated (earthengine authenticate)
echo.
echo API will be available at: http://localhost:8000
echo Documentation: http://localhost:8000/docs
echo Health check: http://localhost:8000/health
echo.
echo Press Ctrl+C to stop the server
echo.

python start_soil_api.py

pause
