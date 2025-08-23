# AgriShakti - Agriculture Technology Platform

A comprehensive agriculture technology platform with a modern React frontend and Node.js/Express backend.

## Project Structure

```
AgriShakti/
├── frontend/                 # React frontend application
│   ├── public/              # Static files
│   ├── src/                 # React source code
│   │   ├── components/      # React components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   ├── FarmerDashboard.js
│   │   │   └── LoginForm.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── backend/                  # Node.js/Express backend
│   ├── routes/              # API routes
│   ├── controllers/         # Route controllers
│   ├── models/              # Database models
│   ├── middleware/          # Custom middleware
│   ├── config/              # Configuration files
│   ├── server.js            # Main server file
│   ├── package.json
│   └── README.md
├── package.json              # Root package.json
└── README.md                 # This file
```


## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd AgriShakti
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   cd backend
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start individually:
   npm run dev:frontend    # Frontend on http://localhost:3000
   npm run dev:backend     # Backend on http://localhost:5000
   ```

## Development

### Frontend Development
- Located in `frontend/` directory
- Built with React 18
- Uses modern CSS and responsive design
- Component-based architecture

### Backend Development
- Located in `backend/` directory
- Express.js server with middleware
- RESTful API design
- Ready for database integration

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build frontend for production
- `npm run install:all` - Install dependencies for all projects

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
