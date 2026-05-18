import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const FinishRide = (props) => {
    const [swipeValue, setSwipeValue] = useState(0);
    const [isEnding, setIsEnding] = useState(false);
    const navigate = useNavigate();
    const ride = props.ride;
    const captain = ride?.captain;
    const captainFirstName = captain?.name?.firstname || '';
    const captainLastName = captain?.name?.lastname || '';
    const captainName = [captainFirstName, captainLastName].filter(Boolean).join(' ') || 'Captain';
    const vehicle = captain?.vehicle || {};
    const plate = vehicle.plate || '---';
    const vehicleLabel = [vehicle.model, vehicle.color].filter(Boolean).join(' • ') || 'Vehicle details';
    const fare = ride?.fare ?? '--';
    const destination = ride?.destination || 'Destination';

    const handleSwipe = (e) => {
        const value = parseInt(e.target.value);
        setSwipeValue(value);

        if (value >= 98 && !isEnding) {
            setIsEnding(true);
            const token = localStorage.getItem('captainToken');
            if (!token || !ride?._id) {
                setSwipeValue(0);
                setIsEnding(false);
                return;
            }
            axios
                .post(
                    `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
                    { rideId: ride._id },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
                .then(() => {
                    localStorage.removeItem('activeRide');
                    navigate('/captainhome');
                })
                .catch((error) => {
                    console.error('Failed to end ride:', error.response?.data || error.message);
                    setSwipeValue(0);
                })
                .finally(() => {
                    setIsEnding(false);
                });
        }
    };

    return (
       
        <div className=' w-full z-20 bottom-0 bg-white px-2 transition-transform shadow-top rounded-t-3xl max-h-[80vh] overflow-y-auto'>
            
            
            <div className='absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-200 rounded-full'></div>

            <h3 className='text-xl font-bold mb-5 text-center '>Finish this Ride</h3>

            {/* Customer & Price Card */}
            <div className='flex items-center justify-between p-3 bg-yellow-50 rounded-2xl mb-4 border border-yellow-100'>
                <div className='flex items-center gap-3'>
                    <img className='h-10 w-10 rounded-full object-cover' src="https://plus.unsplash.com/premium_photo-1689530776021-6f1f6a1500d1?q=80&w=1000&auto=format&fit=crop" alt="User" />
                    <div>
                        <h2 className='text-base font-bold'>{captainName}</h2>
                        <p className='text-[10px] text-gray-500'>{plate} • {vehicleLabel}</p>
                    </div>
                </div>
                <h5 className='text-lg font-black'>₹{fare}</h5>
            </div>

            {/* Destination Detail */}
            <div className='flex flex-col gap-4 mb-6 border-t pt-4'>
                <div className='flex items-center gap-4 px-1'>
                    <MapPin size={20} className='text-gray-600' />
                    <div>
                        <h3 className='text-base font-bold tracking-tight'>{destination}</h3>
                        <p className='text-xs text-gray-500'>Drop off</p>
                    </div>
                </div>
            </div>

            {/* SLEEK SLIDING BUTTON */}
            <div className='relative w-full h-16 bg-gray-100 rounded-2xl flex items-center p-1 overflow-hidden'>
                <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                    <span className='text-gray-400 font-bold uppercase tracking-widest text-[10px]'>
                        {swipeValue > 50 ? "" : "Swipe to Finish"}
                    </span>
                </div>

                <div 
                    style={{ width: `${swipeValue}%` }} 
                    className='h-full bg-green-500 rounded-xl transition-all duration-75 flex items-center justify-end px-4'
                >
                </div>

                <input
                    type="range"
                    min="0"
                    max="100"
                    value={swipeValue}
                    onChange={handleSwipe}
                    onMouseUp={() => swipeValue < 98 && setSwipeValue(0)}
                    onTouchEnd={() => swipeValue < 98 && setSwipeValue(0)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none z-10"
                />

                <div 
                    style={{ 
                        left: `calc(${swipeValue}% - ${swipeValue > 15 ? '58px' : '0px'})`,
                        transition: 'left 0.05s linear'
                    }}
                    className='absolute h-14 w-14 bg-white rounded-xl shadow-md flex items-center justify-center pointer-events-none'
                >
                    <div className='flex gap-0.5'>
                        <div className='w-0.5 h-4 bg-gray-200 rounded-full'></div>
                        <div className='w-0.5 h-4 bg-gray-300 rounded-full'></div>
                        <div className='w-0.5 h-4 bg-gray-200 rounded-full'></div>
                    </div>
                </div>
            </div>
            
            {/* Added mb-4 to ensure spacing from screen edge */}
            <p className='text-center text-[10px] text-gray-400 mt-5 mb-2'>
                Confirm that you have reached the destination and collected the payment.
            </p>
        </div>
    );
};

export default FinishRide;