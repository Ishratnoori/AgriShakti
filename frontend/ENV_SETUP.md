# Frontend Environment Setup

## Create .env file

Create a file named `.env` in the frontend directory with the following content:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_NGROK_URL=https://YOUR-NGROK-URL-WILL-GO-HERE

# Environment
NODE_ENV=development
```

## Steps to Create .env file:

1. **In the frontend directory**, create a new file named `.env`
2. **Copy the content above** into the file
3. **Replace** `https://YOUR-NGROK-URL-WILL-GO-HERE` with your actual ngrok URL later
4. **Save the file**

## Current Configuration:

- ✅ Backend server running on port 8000
- ✅ Frontend will use `http://localhost:8000` for local development
- ⏳ Ngrok URL will be added later when you get it

## Test Your Setup:

1. **Start the frontend:**
   ```bash
   npm start
   ```

2. **Test the CropHealthCard component** - it should work with your local backend!

3. **When you get your ngrok URL**, update the `.env` file and restart the frontend.
