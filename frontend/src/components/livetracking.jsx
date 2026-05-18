import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';
import { useMemo, useState, useEffect } from 'react';
import socket from '../socket';

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const makeDotIcon = (color) => {
    if (!window.google?.maps?.SymbolPath) {
        return undefined;
    }
    return {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 0,
    };
};

const LiveTracking = () => {
    const [captainLocation, setCaptainLocation] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [isMapReady, setIsMapReady] = useState(false);

    const defaultCenter = useMemo(
        () => ({ lat: 22.5726, lng: 88.3639 }),
        []
    );

    useEffect(() => {
        const storedRide = localStorage.getItem('activeRide');
        const rideId = storedRide ? JSON.parse(storedRide)?._id : null;

        const handleCaptainLocation = (payload) => {
            if (!payload?.location) {
                return;
            }
            if (rideId && payload.rideId && payload.rideId !== rideId) {
                return;
            }
            setCaptainLocation(payload.location);
        };

        socket.on('captain-location', handleCaptainLocation);
        return () => socket.off('captain-location', handleCaptainLocation);
    }, []);

    useEffect(() => {
        if (!navigator.geolocation) {
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            () => {},
            { enableHighAccuracy: true, maximumAge: 1000, timeout: 1000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    const center = captainLocation || userLocation || defaultCenter;

    return (
        <div className="relative w-full h-full">
            <LoadScript
                googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}
                onLoad={() => setIsMapReady(true)}
            >
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={15}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                >
                    {userLocation ? (
                        <Marker
                            position={userLocation}
                            icon={isMapReady ? makeDotIcon('#2563eb') : undefined}
                        />
                    ) : null}
                    {captainLocation ? (
                        <Marker
                            position={captainLocation}
                            icon={isMapReady ? makeDotIcon('#dc2626') : undefined}
                        />
                    ) : null}
                </GoogleMap>
            </LoadScript>

            <div className="absolute left-4 right-4 top-14 bg-white/95 backdrop-blur rounded-2xl shadow-lg p-4 flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Live Tracking</p>
                    <h3 className="text-lg font-bold text-gray-900">Captain en route</h3>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                    <div className="h-9 w-9 rounded-full bg-yellow-100 flex items-center justify-center">
                        <i className="ri-navigation-fill text-lg"></i>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                        <i className="ri-map-pin-user-fill text-lg"></i>
                    </div>
                </div>
            </div>

            {!isMapReady ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                    <div className="flex items-center gap-3 text-gray-600">
                        <i className="ri-loader-4-line animate-spin text-xl"></i>
                        <span className="text-sm font-semibold">Loading map...</span>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default LiveTracking;