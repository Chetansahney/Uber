# SwiftRide Frontend

React + Vite frontend for SwiftRide with socket-driven ride lifecycle and Google Maps tracking.

## Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create `frontend/.env`:

```
VITE_BASE_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API=your_google_maps_api_key
```

## Routes

- `/` Start screen
- `/home` User home + ride creation
- `/riding` User ride page
- `/start-ride` User ride page after OTP
- `/userlogin`, `/usersignup`
- `/captainhome` Captain home
- `/captain-riding` Captain ride page
- `/captainlogin`, `/captainsignup`

## Core UI Flow

1. User selects pickup + destination
2. Fare and ETA are computed via backend
3. User confirms ride -> captain receives new ride via socket
4. Captain accepts ride -> user sees driver details
5. Captain enters OTP -> ride starts -> user navigates to `/start-ride`
6. Captain ends ride -> user can complete payment

## Live Tracking

- `LiveTracking` shows real-time captain + user positions
- `CaptainRouteMap` shows shortest route to pickup and destination
- `UserRouteMap` shows shortest route to destination

## Socket Events

- `ride-confirmed` (user)
- `ride-started` (user)
- `ride-ended` (user)
- `payment-completed` (captain)
- `captain-location` (user)

## Components

- `ConfirmRide`, `LookingForDriver`, `WaitingForDriver`
- `ConfirmRidePopUp`, `RidePopUp`
- `LiveTracking`, `CaptainRouteMap`, `UserRouteMap`
- `FinishRide`
