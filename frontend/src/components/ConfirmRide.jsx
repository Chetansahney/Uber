import React from 'react'

const ConfirmRide = ({
    setConfirmRidePanel,
    setVehiclePanel,
    setLookingForDriverPanel,
    pickup,
    destination,
    fare,
    distanceTime,
    selectedVehicle,
    createRide,
}) => {
    const vehicleImages = {
        car: '/cab.png',
        moto: '/bike.png',
        auto: '/auto.png',
    };

    const vehicleImage = vehicleImages[selectedVehicle] || vehicleImages.car;
    const rideFare = fare?.[selectedVehicle];
    const getShortName = (location) => {
        if (!location) return '';
        return location.split(',')[0].trim();
    };

    const handleConfirm = async () => {
        const ride = await createRide(selectedVehicle);
        if (!ride) {
            return;
        }
        setLookingForDriverPanel(true);
        setConfirmRidePanel(false);
        setVehiclePanel(false);
    };
    return (
        <div>
            
            <div className="w-full flex justify-center mb-2" onClick={() => {
                setConfirmRidePanel(false)
            }}>
                <div className="w-10 h-1 bg-gray-300 rounded-full cursor-pointer"></div>
            </div>

            <h3 className='text-2xl font-bold mb-5 text-center'>Confirm your Ride</h3>

            <div className='flex flex-col justify-between items-center gap-4'>
                
                <img className='h-24 object-contain' src={vehicleImage} alt="Selected Vehicle" />

                
                <div className='w-full mt-5'>
                    
                    
                    <div className='flex items-center gap-5 p-3 border-b-2 border-gray-100'>
                        <i className="text-lg ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-sm font-bold leading-tight'>{getShortName(pickup)}</h3>
                            <p className='text-xs text-gray-600'>{pickup || "Kankariya Talab, Ahmedabad"}</p>
                        </div>
                    </div>

                    
                    <div className='flex items-center gap-5 p-3 border-b-2 border-gray-100'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-sm font-bold leading-tight'>{getShortName(destination)}</h3>
                            <p className='text-xs text-gray-600'>{destination || "Phoenix Marketcity, Bengaluru"}</p>
                        </div>
                    </div>

                    
                    <div className='flex items-center gap-5 p-3'>
                        <i className="text-lg ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-bold leading-tight'>
                                {rideFare || rideFare === 0 ? `₹${rideFare}` : '₹--'}
                            </h3>
                            <p className='text-sm text-gray-600'>
                                {distanceTime?.duration
                                    ? `${distanceTime.duration}${distanceTime.distance ? ` • ${distanceTime.distance}` : ''}`
                                    : 'Cash'}
                            </p>
                        </div>
                    </div>
                </div>

                
                <button 
                    onClick={handleConfirm}
                    className="w-full bg-green-600 text-white text-lg font-semibold py-3 rounded-xl mt-5 active:scale-95 transition-all"
                >
                    Confirm
                </button>
            </div>
        </div>
    )
}

export default ConfirmRide