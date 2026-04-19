import React from 'react'

const LookingForDriver = ({ setLookingForDriverPanel, setWaitingForDriver, pickup, destination }) => {
    return (
        <div onClick={() => {
            setLookingForDriverPanel(false)
            setWaitingForDriver(true)
        }}>
            
            <div className="w-full flex justify-center mb-2" onClick={(e) => {
                e.stopPropagation(); // Prevents clicking the handle from finding a driver
                setLookingForDriverPanel(false);
            }}>
                <div className="w-10 h-1 bg-gray-300 rounded-full cursor-pointer"></div>
            </div>

            <h3 className='text-2xl font-bold mb-5 text-center'>Looking for a driver</h3>

            
            <div className='w-full bg-gray-200 h-1 mb-5 overflow-hidden rounded-full'>
                <div className='bg-black h-full w-1/3 animate-ride-load'></div>
            </div>

            <div className='flex flex-col justify-between items-center gap-4'>
               
                <div className='relative flex items-center justify-center'>
                    <div className='h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200 z-10'>
                        <i className="ri-user-6-fill text-3xl text-gray-400"></i>
                    </div>
                    <img className='h-24 -ml-4 object-contain' src="/cab.png" alt="Vehicle" />
                </div>

                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2 border-gray-100'>
                        <i className="text-lg ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-bold leading-tight'>Pickup</h3>
                            <p className='text-sm text-gray-600 truncate max-w-[200px]'>{pickup}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-5 p-3 border-b-2 border-gray-100'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-bold leading-tight'>Destination</h3>
                            <p className='text-sm text-gray-600 truncate max-w-[200px]'>{destination}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-5 p-3'>
                        <i className="text-lg ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-bold leading-tight'>₹193.20</h3>
                            <p className='text-sm text-gray-600'>Payment: Cash</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LookingForDriver