@echo off
echo Starting AgriShakti Simple Soil Analysis API...
echo.
echo This version works WITHOUT Google Earth Engine for testing
echo.
echo Make sure you have:
echo 1. Python installed and in PATH
echo 2. Minimal dependencies installed (pip install -r requirements_minimal.txt)
echo.
echo API will be available at: http://localhost:8000
echo Documentation: http://localhost:8000/docs
echo Health check: http://localhost:8000/health
echo.
echo Press Ctrl+C to stop the server
echo.

python start_simple_api.py

pause
