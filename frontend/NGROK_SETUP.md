# Ngrok Setup Guide

This guide explains how to configure ngrok URL for the AgriShakti frontend application.

## What is Ngrok?

Ngrok is a tool that creates secure tunnels to localhost, allowing you to expose your local development server to the internet. This is useful for:
- Testing your API from external devices
- Sharing your development work with others
- Testing webhooks and integrations

## Setup Instructions

### 1. Install Ngrok

Download and install ngrok from [https://ngrok.com/](https://ngrok.com/)

### 2. Start Your Backend Server

Make sure your backend server is running on the specified port (default: 8000)

```bash
cd backend
npm start
# or
python main.py
```

### 3. Start Ngrok Tunnel

Open a new terminal and run:

```bash
ngrok http 8000
```

This will create a tunnel to your local server and display a URL like:
```
Forwarding    https://abc123.ngrok.io -> http://localhost:8000
```

### 4. Configure Frontend

Create a `.env` file in the frontend directory:

```bash
cd frontend
touch .env
```

Add the following content to the `.env` file:

```env
# API Configuration
REACT_APP_API_URL=http://localhost:8000
REACT_APP_NGROK_URL=https://your-actual-ngrok-url.ngrok.io

# Environment
NODE_ENV=development
```

**Important:** Replace `https://your-actual-ngrok-url.ngrok.io` with the actual ngrok URL from step 3.

### 5. Restart Frontend Development Server

After creating the `.env` file, restart your frontend development server:

```bash
npm start
```

## How It Works

The application is configured to:

1. **First try local API**: Attempt to connect to `http://localhost:8000`
2. **Fallback to ngrok**: If local API fails, automatically try the ngrok URL
3. **Automatic switching**: The axios configuration handles this automatically

## API Configuration

The application uses two axios instances:

- **apiClient**: For local development (`http://localhost:8000`)
- **ngrokClient**: For ngrok tunnel (`https://your-ngrok-url.ngrok.io`)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Local API URL | `http://localhost:8000` |
| `REACT_APP_NGROK_URL` | Ngrok tunnel URL | `https://your-ngrok-url.ngrok.io` |
| `NODE_ENV` | Environment | `development` |

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend allows requests from the ngrok domain
2. **Connection Refused**: Ensure your backend server is running
3. **Invalid URL**: Double-check the ngrok URL in your `.env` file

### Backend CORS Configuration

Update your backend CORS settings to allow ngrok domains:

```javascript
// In your backend CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://*.ngrok.io',
    'https://*.ngrok-free.app'
  ]
}));
```

### Testing

To test if ngrok is working:

1. Start your backend server
2. Start ngrok tunnel
3. Update the `.env` file with the ngrok URL
4. Restart your frontend server
5. Try making a request from the CropHealthCard component

The console will show which URL is being used for each request.

## Security Notes

- Ngrok URLs are public and accessible to anyone with the URL
- Don't use ngrok for production deployments
- Consider using ngrok's authentication features for additional security
- The free ngrok plan has limitations on connections and bandwidth
