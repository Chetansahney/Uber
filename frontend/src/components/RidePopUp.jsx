import React from "react";

const RidePopUp = (props) => {
    return (
        <div >
    
    <div className="flex items-center justify-center gap-3 mb-6">
        <h3 className="text-2xl font-extrabold tracking-tight text-gray-800">New Ride Request</h3>
        <div className="flex items-center">
            <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
            </span>
        </div>
    </div>

    
    <div className='flex items-center justify-between mb-6 bg-gray-50 p-4 rounded-2xl'>
        <div className='flex items-center gap-3'>
            <div className='h-14 w-14 rounded-full overflow-hidden border-2 border-white shadow-md'>
                <img
                    className='h-full w-full object-cover'
                    src="user.webp"
                    alt="Rider"
                />
            </div>
            <div>
                <h2 className='text-lg font-bold text-gray-900 leading-tight'>Alex Sahney</h2>
                <p className='text-xs text-gray-500 font-medium'>⭐ 4.9 • 5 min away</p>
            </div>
        </div>
        <div className='text-right'>
            <h4 className='text-2xl font-black text-gray-900'>₹193.20</h4>
            <p className='text-[10px] font-bold text-gray-400 tracking-widest uppercase'>1.4 km</p>
        </div>
    </div>

    
    <div className='w-full relative px-2'>
        
        <div className="absolute left-[29px] top-10 bottom-10 w-[2px] bg-gray-100"></div>

        <div className='flex items-center gap-5 p-4 relative bg-white'>
            <i className="text-xl ri-map-pin-user-fill text-gray-400"></i>
            <div>
                <h3 className='text-base font-bold text-gray-800'>562/11-A</h3>
                <p className='text-sm text-gray-500'>Kankariya Talab, Ahmedabad</p>
            </div>
        </div>

        <div className='flex items-center gap-5 p-4 relative bg-white'>
            <i className="text-xl ri-map-pin-2-fill text-gray-900"></i>
            <div>
                <h3 className='text-base font-bold text-gray-800'>102/B</h3>
                <p className='text-sm text-gray-500'>Phoenix Marketcity, Bengaluru</p>
            </div>
        </div>
    </div>

    
    <div className="flex flex-row gap-4 mt-8 w-full">
        <button onClick={() => {
                        props.setRidePopUp(false);
                    }}
            className="flex-1 bg-gray-100 text-gray-600 text-lg font-bold py-4 rounded-2xl active:scale-95 transition-all"
        >
            Ignore
        </button>
        <button onClick={() => {
                        props.setRidePopUp(false);
                        props.setconfirmRidePopUp(true);
                    }}
            className="flex-1 bg-yellow-500 text-black text-lg font-bold py-4 rounded-2xl shadow-lg shadow-yellow-200 active:scale-95 transition-all"
        >
            Accept
        </button>
    </div>
</div>
    );
}

export default RidePopUp;