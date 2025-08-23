# AgriShakti Backend

This is the backend API server for the AgriShakti application.

## Features

- Express.js server with security middleware
- CORS enabled for frontend communication
- Environment variable configuration
- Health check endpoints
- Ready for database integration

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `env.example`:
   ```bash
   cp env.example .env
   ```

3. Update the `.env` file with your configuration values.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. For production:
   ```bash
   npm start
   ```

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check

## Environment Variables

- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `CORS_ORIGIN` - Allowed CORS origin

## Development

The server runs on `http://localhost:5000` by default.
