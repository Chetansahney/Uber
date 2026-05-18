import React from 'react'
import { useNavigate } from 'react-router-dom';

const WaitingForDriver = (props) => {
    const navigate = useNavigate();
    const captain = props.ride?.captain;
    const captainFirstName = captain?.name?.firstname || '';
    const captainLastName = captain?.name?.lastname || '';
    const captainName = [captainFirstName, captainLastName].filter(Boolean).join(' ') || 'Driver';
    const vehicle = captain?.vehicle || {};
    const vehicleType = vehicle.vehicleType || 'car';
    const vehicleImages = {
        car: '/cab.png',
        bike: '/bike.png',
        moto: '/bike.png',
        auto: '/auto.png',
    };
    const vehicleImage = vehicleImages[vehicleType] || vehicleImages.car;
    const plate = vehicle.plate || '---';
    const modelLabel = [vehicle.model, vehicle.color].filter(Boolean).join(' • ') || 'Vehicle details';
    const pickup = props.ride?.origin || 'Pickup location';
    const destination = props.ride?.destination || 'Destination';
    const otpLabel = props.otp || '----';
    const formatPlate = (plate) => {
    if (!plate) return '---';
    const p = plate.toUpperCase().replace(/\s+/g, '');
    // Format: MH 01 CW 7890
    const match = p.match(/^([A-Z]{2})(\d{2})([A-Z]{1,3})(\d{1,4})$/);
    if (match) return `${match[1]} ${match[2]} ${match[3]} ${match[4]}`;
    return p; // fallback: just uppercase it
};

    return (
        <div className="flex flex-col h-full overflow-y-auto bg-white">

            <div className="w-full flex justify-center mb-4" onClick={() => props.setWaitingForDriver(false)}>
                <div className="w-12 h-1.5 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition-colors"></div>
            </div>

            <div className='flex items-center justify-between px-2 mb-6'>
                <h3 className='text-2xl font-bold tracking-tight text-gray-900'>Meet at the pickup</h3>
                <div className='bg-black text-white px-4 py-2 flex flex-col items-center justify-center rounded-xl shadow-lg'>
                    <h4 className='text-xl font-bold leading-none'>2</h4>
                    <p className='text-[10px] font-semibold uppercase tracking-wider mt-1'>min</p>
                </div>
            </div>

            <div className='flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-6 relative overflow-hidden'>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-100 rounded-full -mr-16 -mt-16 z-0"></div>

                <div className='relative z-10 flex items-center group absolute -top-8 left-5 flex items-end gap-2'>
                    <div className='h-20 w-20 bg-white rounded-full p-[2px] shadow-lg border border-gray-100 overflow-hidden -top-6'>
                        <img
                            className='h-full w-full rounded-full object-cover -top-6'
                            src="/user.webp"
                            alt="driver"
                        />
                    </div>
                    <img className='h-16 -ml-8 drop-shadow-2xl transform group-hover:scale-105 transition-transform' src={vehicleImage} alt="vehicle" />
                </div>

                <div className='text-right relative z-10'>
                    <h2 className='text-xs font-bold text-gray-400 uppercase tracking-widest'>{captainName}</h2>
                    <h4 className='text-xl font-black text-gray-900 leading-tight mb-1'>{formatPlate(plate)}</h4>
                    <p className='text-sm font-medium text-gray-600 whitespace-nowrap'>{modelLabel}</p>
                    <p className='text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1'>{vehicleType}</p>
                    <div className='mt-3 inline-flex items-center justify-end gap-2 rounded-full bg-black text-white px-3 py-1'>
                        <span className='text-[10px] font-bold uppercase tracking-widest'>OTP</span>
                        <span className='text-sm font-black tracking-widest'>{otpLabel}</span>
                    </div>
                </div>
            </div>

            <div className='w-full mt-2 mb-6'>
                <div className='flex items-center gap-5 p-3 border-b-2 border-gray-100'>
                    <i className="text-lg ri-map-pin-user-fill"></i>
                    <div>
                        <h3 className='text-sm font-bold leading-tight'>Pickup</h3>
                        <p className='text-xs text-gray-600'>{pickup}</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3 border-b-2 border-gray-100'>
                    <i className="text-lg ri-map-pin-2-fill"></i>
                    <div>
                        <h3 className='text-sm font-bold leading-tight'>Destination</h3>
                        <p className='text-xs text-gray-600'>{destination}</p>
                    </div>
                </div>
                <div className='flex items-center gap-5 p-3'>
                    <i className="ri-currency-line text-lg"></i>
                    <div>
                        <h3 className='text-sm font-bold leading-tight'>₹{props.ride?.fare}</h3>
                        <p className='text-xs text-gray-600'>Cash</p>
                    </div>
                </div>
            </div>


            <div className='flex items-center justify-between px-2 pb-2'>
                <div className='flex flex-col items-center gap-3 group cursor-pointer'>
                    <div className='h-14 w-14 bg-gray-100 group-active:bg-gray-200 rounded-full flex items-center justify-center shadow-sm transition-all'>
                        <i className="ri-shield-check-fill text-blue-600 text-2xl"></i>
                    </div>
                    <p className='text-xs font-bold text-gray-700'>Safety</p>
                </div>
                <div className='flex flex-col items-center gap-3 group cursor-pointer'>
                    <div className='h-14 w-14 bg-gray-100 group-active:bg-gray-200 rounded-full flex items-center justify-center shadow-sm transition-all'>
                        <i className="ri-share-forward-box-fill text-blue-600 text-2xl"></i>
                    </div>
                    <p className='text-xs font-bold text-gray-700'>Share trip</p>
                </div>
                <div className='flex flex-col items-center gap-3 group cursor-pointer'>
                    <div className='h-14 w-14 bg-gray-100 group-active:bg-gray-200 rounded-full flex items-center justify-center shadow-sm transition-all'>
                        <i className="ri-phone-fill text-blue-600 text-2xl"></i>
                    </div>
                    <p className='text-xs font-bold text-gray-700'>Call driver</p>
                </div>
            </div>

        </div>
    )
}

export default WaitingForDriver