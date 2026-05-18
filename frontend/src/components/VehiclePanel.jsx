import React from 'react'

const VehiclePanel = ({
    setVehiclePanel,
    setConfirmRidePanel,
    fare,
    distanceTime,
    selectedVehicle,
    setSelectedVehicle,
}) => {
    const vehicles = [
        {
            key: 'car',
            label: 'UberGo',
            seats: 4,
            image: '/cab.png',
            description: 'Affordable, compact rides',
        },
        {
            key: 'moto',
            label: 'Moto',
            seats: 1,
            image: '/bike.png',
            description: 'Affordable motorcycle rides',
        },
        {
            key: 'auto',
            label: 'Auto',
            seats: 3,
            image: '/auto.png',
            description: 'Comfortable, top-rated drivers',
        },
    ];

    const formatFare = (value) => (value || value === 0 ? `₹${value}` : '--');
    const timeLine = distanceTime?.duration
        ? `${distanceTime.duration}${distanceTime.distance ? ` • ${distanceTime.distance}` : ''}`
        : 'Enter pickup and destination';

    const selectedLabel = vehicles.find((vehicle) => vehicle.key === selectedVehicle)?.label || 'UberGo';

    return (
        <div>

            <div className="w-full flex justify-center mb-2" onClick={() => setVehiclePanel(false)}>
                <div className="w-10 h-1 bg-gray-300 rounded-full cursor-pointer"></div>
            </div>

            <div className="flex flex-col">
                {vehicles.map((vehicle) => (
                    <div
                        key={vehicle.key}
                        onClick={() => {
                            setSelectedVehicle(vehicle.key);
                        }}
                        className={`flex items-center justify-between w-full px-2 py-1 border-[3px] rounded-xl mb-1 cursor-pointer transition-colors ${selectedVehicle === vehicle.key ? 'border-black' : 'border-transparent'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-20 flex justify-center">
                                <img src={vehicle.image} alt={vehicle.label} className="h-14 object-contain" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <h4 className="text-lg font-bold flex items-center gap-1 leading-none">
                                    {vehicle.label}{' '}
                                    <span className="text-sm font-semibold">
                                        <i className="ri-user-3-fill"></i>
                                        {vehicle.seats}
                                    </span>
                                </h4>
                                <p className="text-sm font-medium mt-1">{timeLine}</p>
                                <p className="text-xs text-gray-500 leading-tight">{vehicle.description}</p>
                            </div>
                        </div>
                        <h2 className="text-xl font-bold">{formatFare(fare?.[vehicle.key])}</h2>
                    </div>
                ))}
            </div>

            <button
                className="w-full bg-black text-white text-lg font-semibold py-3 rounded-xl mt-4 active:scale-95 transition-transform"
                onClick={() => {
                    setVehiclePanel(false);
                    setConfirmRidePanel(true);
                }}
            >
                Confirm {selectedLabel}
            </button>
        </div>
    )
}

export default VehiclePanel