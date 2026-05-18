# SwiftRide

SwiftRide is a full-stack ride-hailing app with real-time sockets, OTP ride verification, live tracking, and Google Maps routing.

## Monorepo Structure

- Backend: `Backend/`
- Frontend: `frontend/`

## Quick Start

### Backend

```bash
cd Backend
npm install
node server.js
```

Or with nodemon:

```bash
npx nodemon server.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

### Backend (`Backend/.env`)

```
PORT=3000
DB_CONNECT=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API=your_google_maps_api_key
```

### Frontend (`frontend/.env`)

```
VITE_BASE_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API=your_google_maps_api_key
```

## Core Features

- User and captain authentication with JWT and blacklist logout
- Ride creation, matching, OTP verification, live tracking
- Captain route to pickup and to destination
- User route to destination after OTP verification
- Real-time socket events for ride lifecycle
- End ride and payment completion

## Maps + Directions

The app uses the Google Maps JavaScript API for map rendering and Directions API for shortest-route rendering. Enable these APIs in Google Cloud:

- Maps JavaScript API
- Directions API
- Distance Matrix API
- Geocoding API
- Places API (autocomplete suggestions)

Billing must be enabled, and referrers must allow your dev URL.

## Entry Points

- Backend server: `Backend/server.js`
- Frontend app: `frontend/src/main.jsx`

For detailed backend and frontend docs, see:
- Backend: `Backend/README.md`
- Frontend: `frontend/README.md`
