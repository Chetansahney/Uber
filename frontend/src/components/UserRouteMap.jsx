import { LoadScript, GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api';
import { useEffect, useMemo, useState } from 'react';

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const UserRouteMap = ({ destination }) => {
    const [directions, setDirections] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [isMapReady, setIsMapReady] = useState(false);

    const defaultCenter = useMemo(
        () => ({ lat: 22.5726, lng: 88.3639 }),
        []
    );

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

    useEffect(() => {
        if (!isMapReady || !destination || !userLocation || !window.google) {
            return;
        }

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin: userLocation,
                destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                }
            }
        );
    }, [isMapReady, destination, userLocation]);

    const center = userLocation || defaultCenter;

    return (
        <div className="relative w-full h-full">
            <LoadScript
                googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}
                onLoad={() => setIsMapReady(true)}
            >
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={14}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                >
                    {userLocation ? (
                        <Marker position={userLocation} />
                    ) : null}
                    {directions ? (
                        <DirectionsRenderer
                            directions={directions}
                            options={{
                                suppressMarkers: false,
                                polylineOptions: {
                                    strokeColor: '#2563eb',
                                    strokeOpacity: 0.9,
                                    strokeWeight: 5,
                                },
                            }}
                        />
                    ) : null}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default UserRouteMap;
