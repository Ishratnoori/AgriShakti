# Google Maps Integration Setup Guide

This guide will help you set up Google Maps integration for the AgriShakti farmer dashboard location feature.

## Prerequisites

1. A Google Cloud Platform account
2. Basic knowledge of Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Make sure billing is enabled for your project

## Step 2: Enable Required APIs

Enable the following APIs in your Google Cloud Console:

1. **Maps JavaScript API**
   - Go to "APIs & Services" > "Library"
   - Search for "Maps JavaScript API"
   - Click on it and press "Enable"

2. **Places API**
   - Search for "Places API"
   - Click on it and press "Enable"

3. **Geocoding API**
   - Search for "Geocoding API"
   - Click on it and press "Enable"

## Step 3: Create API Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key

## Step 4: Configure API Key Restrictions (Recommended)

For security, restrict your API key:

1. Click on the API key you just created
2. Under "Application restrictions", select "HTTP referrers (web sites)"
3. Add your domain(s):
   - `localhost:3000/*` (for development)
   - `yourdomain.com/*` (for production)
4. Under "API restrictions", select "Restrict key"
5. Select the three APIs you enabled:
   - Maps JavaScript API
   - Places API
   - Geocoding API

## Step 5: Update Your Application

### Option 1: Update index.html (Recommended for development)

1. Open `frontend/public/index.html`
2. Find this line:
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places"></script>
   ```
3. Replace `YOUR_GOOGLE_MAPS_API_KEY` with your actual API key

### Option 2: Environment Variables (Recommended for production)

1. Create a `.env` file in the `frontend` directory:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

2. Update `frontend/public/index.html`:
   ```html
   <script src="https://maps.googleapis.com/maps/api/js?key=%REACT_APP_GOOGLE_MAPS_API_KEY%&libraries=places"></script>
   ```

3. Update `frontend/src/config/maps.js`:
   ```javascript
   API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY',
   ```

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   cd frontend
   npm start
   ```

2. Navigate to the farmer dashboard
3. Click the "Update Location" button in the header
4. Try searching for a location or using the map
5. Verify that the map loads and location selection works

## Features Included

The Google Maps integration includes:

- **Address Search**: Farmers can search for their farm location by address
- **Interactive Map**: Click on the map to select exact coordinates
- **Current Location**: Use GPS to get current location
- **Draggable Marker**: Adjust the selected location by dragging the marker
- **Reverse Geocoding**: Get address from coordinates
- **GPS Coordinates**: Display latitude and longitude
- **Location Storage**: Save selected location to localStorage

## Troubleshooting

### Map Not Loading
- Check if the API key is correct
- Verify that all required APIs are enabled
- Check browser console for error messages
- Ensure billing is enabled on your Google Cloud project

### Search Not Working
- Make sure Places API is enabled
- Check if the API key has the correct restrictions
- Verify that the `libraries=places` parameter is included in the script URL

### Geocoding Issues
- Ensure Geocoding API is enabled
- Check API quotas and limits
- Verify the API key has access to Geocoding API

## Security Best Practices

1. **Restrict API Key**: Always restrict your API key to specific domains
2. **Monitor Usage**: Set up billing alerts and monitor API usage
3. **Environment Variables**: Use environment variables for production deployments
4. **HTTPS**: Always use HTTPS in production for security

## Cost Considerations

Google Maps APIs have usage-based pricing:
- Maps JavaScript API: Free tier includes 28,500 map loads per month
- Places API: Free tier includes 1,000 requests per day
- Geocoding API: Free tier includes 2,500 requests per day

Monitor your usage in the Google Cloud Console to avoid unexpected charges.

## Support

If you encounter issues:
1. Check the [Google Maps JavaScript API documentation](https://developers.google.com/maps/documentation/javascript)
2. Review the [Google Cloud Console](https://console.cloud.google.com/) for API status
3. Check the browser console for detailed error messages
