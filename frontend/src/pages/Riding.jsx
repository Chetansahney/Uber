import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import UserRouteMap from '../components/UserRouteMap'

const Riding = () => {
    const [ride, setRide] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState('car');
    const [isPaying, setIsPaying] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const rideData = localStorage.getItem('activeRide');
        if (rideData) {
            try {
                setRide(JSON.parse(rideData));
            } catch (error) {
                console.error('Failed to parse activeRide:', error);
            }
        }

        const storedVehicle = localStorage.getItem('selectedVehicle');
        if (storedVehicle) {
            setSelectedVehicle(storedVehicle);
        }
    }, []);

    const captain = ride?.captain;
    const captainFirstName = captain?.name?.firstname || '';
    const captainLastName = captain?.name?.lastname || '';
    const captainName = [captainFirstName, captainLastName].filter(Boolean).join(' ') || 'Driver';
    const vehicle = captain?.vehicle || {};
    const plate = vehicle.plate || '---';
    const vehicleLabel = [vehicle.model, vehicle.color].filter(Boolean).join(' • ') || 'Vehicle details';
    const pickup = ride?.origin || 'Pickup location';
    const destination = ride?.destination || 'Destination';
    const fare = ride?.fare ?? '--';

    const vehicleImages = {
        car: '/cab.png',
        moto: '/bike.png',
        auto: '/auto.png',
        bike: '/bike.png',
    };
    const vehicleImage = vehicleImages[selectedVehicle] || vehicleImages.car;
    return (
        <div className='h-screen w-full bg-white relative overflow-hidden'>
            
            
            <Link to='/home' className='fixed right-4 top-4 h-10 w-10 bg-white flex items-center justify-center rounded-full z-10 shadow-lg border border-gray-100'>
                <i className="text-xl font-bold ri-home-5-line"></i>
            </Link>

            
            <div className='h-[45vh] w-full'>
                <UserRouteMap destination={destination} />
            </div>

            <div className='h-[50vh] p-5 flex flex-col justify-between bg-white relative z-10 rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.1)]'>
                
                
                <div className='flex items-center justify-between'>
                    <img className='h-14 object-contain drop-shadow-md' src={vehicleImage} alt="vehicle" />
                    <div className='text-right'>
                        <h2 className='text-sm font-bold text-gray-400 uppercase tracking-widest'>{captainName}</h2>
                        <h4 className='text-2xl font-black text-gray-900 leading-none'>{plate}</h4>
                        <p className='text-sm font-medium text-gray-500 mt-1'>{vehicleLabel}</p>
                    </div>
                </div>

               
                <div className='w-full mt-2'>
                    
                    
                    <div className='flex items-center gap-4 py-3 border-b border-gray-100'>
                         <div className='relative flex items-center justify-center'>
                             <div className='h-3 w-3 bg-blue-600 rounded-full animate-ping absolute'></div>
                             <div className='h-3 w-3 bg-blue-600 rounded-full relative z-10'></div>
                         </div>
                         <div className="px-1">
                             <h3 className='text-base font-bold text-blue-600'>Ride Started</h3>
                             <p className='text-xs text-gray-500'>The driver is on the correct route</p>
                         </div>
                    </div>

                    
                    <div className='flex items-center gap-4 py-3 border-b border-gray-100'>
                        <i className="text-lg ri-map-pin-2-fill text-gray-700"></i>
                        <div>
                            <h3 className='text-base font-bold leading-tight'>{pickup}</h3>
                            <p className='text-sm text-gray-500'>{destination}</p>
                        </div>
                    </div>

                    
                    <div className='flex items-center gap-4 py-3'>
                        <i className="text-lg ri-bank-card-2-fill text-gray-700"></i>
                        <div>
                            <h3 className='text-base font-bold leading-tight'>₹{fare}</h3>
                            <p className='text-sm text-gray-500'>Mode of Payment: Cash</p>
                        </div>
                    </div>
                </div>

                
                <button
                    onClick={async () => {
                        if (!ride?._id || isPaying) {
                            return;
                        }
                        const token = localStorage.getItem('userToken');
                        if (!token) {
                            return;
                        }
                        setIsPaying(true);
                        try {
                            await axios.post(
                                `${import.meta.env.VITE_BASE_URL}/rides/complete-payment`,
                                { rideId: ride._id },
                                { headers: { Authorization: `Bearer ${token}` } }
                            );
                            localStorage.removeItem('activeRide');
                            navigate('/home');
                        } catch (error) {
                            console.error('Payment failed:', error.response?.data || error.message);
                        } finally {
                            setIsPaying(false);
                        }
                    }}
                    disabled={isPaying}
                    className='w-full bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-[0.98] transition-all hover:bg-green-700 disabled:opacity-60'
                >
                    {isPaying ? 'Processing...' : 'Make a Payment'}
                    <i className="ri-currency-line text-lg ml-2"></i>
                </button>
            </div>
        </div>
    )
}

export default Riding