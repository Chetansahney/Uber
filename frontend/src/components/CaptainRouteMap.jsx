import { LoadScript, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import { useMemo, useState, useEffect } from 'react';

const mapContainerStyle = {
    width: '100%',
    height: '100%',
};

const CaptainRouteMap = ({ ride, mode }) => {
    const [directions, setDirections] = useState(null);
    const [isMapReady, setIsMapReady] = useState(false);

    const origin = ride?.origin || '';
    const destination = ride?.destination || '';

    const routeTarget = mode === 'to-destination' ? destination : origin;

    const defaultCenter = useMemo(
        () => ({ lat: 22.5726, lng: 88.3639 }),
        []
    );

    useEffect(() => {
        if (!isMapReady || !routeTarget) {
            return;
        }

        if (!window.google) {
            return;
        }

        const directionsService = new window.google.maps.DirectionsService();
        const request = {
            origin: 'My Location',
            destination: routeTarget,
            travelMode: window.google.maps.TravelMode.DRIVING,
        };

        directionsService.route(request, (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
                setDirections(result);
            }
        });
    }, [isMapReady, routeTarget]);

    return (
        <div className="relative w-full h-full">
            <LoadScript
                googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}
                onLoad={() => setIsMapReady(true)}
            >
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={defaultCenter}
                    zoom={13}
                    options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false,
                    }}
                >
                    {directions ? (
                        <DirectionsRenderer
                            directions={directions}
                            options={{
                                suppressMarkers: false,
                                polylineOptions: {
                                    strokeColor: '#111827',
                                    strokeOpacity: 0.9,
                                    strokeWeight: 5,
                                },
                            }}
                        />
                    ) : null}
                </GoogleMap>
            </LoadScript>

            <div className="absolute left-4 right-4 top-4 bg-white/95 backdrop-blur rounded-2xl shadow-lg p-4 flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Captain Route</p>
                    <h3 className="text-lg font-bold text-gray-900">
                        {mode === 'to-destination' ? 'Heading to destination' : 'Heading to pickup'}
                    </h3>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                    <div className="h-9 w-9 rounded-full bg-red-100 flex items-center justify-center">
                        <i className="ri-road-map-line text-lg"></i>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaptainRouteMap;
