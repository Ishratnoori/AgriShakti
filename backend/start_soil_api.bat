@echo off
echo Starting AgriShakti Soil Analysis API...
echo.
echo This will start the soil analysis API on port 8000
echo Make sure you have Python and the required packages installed
echo.
echo Press any key to continue...
pause >nul

echo.
echo Starting API...
python start_soil_api.py

echo.
echo API stopped. Press any key to exit...
pause >nul
