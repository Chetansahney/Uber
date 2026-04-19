import React from 'react'

const ConfirmRide = ({ setConfirmRidePanel, setVehiclePanel,setLookingForDriverPanel, pickup, destination }) => {
    return (
        <div>
            
            <div className="w-full flex justify-center mb-2" onClick={() => {
                setConfirmRidePanel(false)
            }}>
                <div className="w-10 h-1 bg-gray-300 rounded-full cursor-pointer"></div>
            </div>

            <h3 className='text-2xl font-bold mb-5 text-center'>Confirm your Ride</h3>

            <div className='flex flex-col justify-between items-center gap-4'>
                
                <img className='h-32 object-contain' src="/cab.png" alt="Selected Vehicle" />

                
                <div className='w-full mt-5'>
                    
                    
                    <div className='flex items-center gap-5 p-3 border-b-2 border-gray-100'>
                        <i className="text-lg ri-map-pin-user-fill"></i>
                        <div>
                            <h3 className='text-lg font-bold leading-tight'>562/11-A</h3>
                            <p className='text-sm text-gray-600'>{pickup || "Kankariya Talab, Ahmedabad"}</p>
                        </div>
                    </div>

                    
                    <div className='flex items-center gap-5 p-3 border-b-2 border-gray-100'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <h3 className='text-lg font-bold leading-tight'>102/B</h3>
                            <p className='text-sm text-gray-600'>{destination || "Phoenix Marketcity, Bengaluru"}</p>
                        </div>
                    </div>

                    
                    <div className='flex items-center gap-5 p-3'>
                        <i className="text-lg ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-bold leading-tight'>₹193.20</h3>
                            <p className='text-sm text-gray-600'>Cash, Cash</p>
                        </div>
                    </div>
                </div>

                
                <button 
                    onClick={() => {
                        setLookingForDriverPanel(true)
                        setConfirmRidePanel(false)
                        setVehiclePanel(false)
                    }}
                    className="w-full bg-green-600 text-white text-lg font-semibold py-3 rounded-xl mt-5 active:scale-95 transition-all"
                >
                    Confirm
                </button>
            </div>
        </div>
    )
}

export default ConfirmRide