import React from "react";

const CaptainDetails = () => {
    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <div className='h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-sm'>
                        <img
                            className='h-full w-full object-cover'
                            src="hrishi.jpeg"
                            alt="Captain"
                        />
                    </div>
                    <div>
                        <h2 className='text-lg font-bold text-gray-900 leading-tight'>Hrishi Kumar</h2>

                    </div>
                </div>
                <div className='text-right'>
                    <h4 className='text-xl font-semibold text-gray-900'>₹2,450.20</h4>
                    <p className='text-[10px] font-bold text-gray-800 uppercase tracking-wider'>Today's Earnings</p>
                </div>
            </div>

            {/* 2. Stats Grid - Elevated and centered since the button is gone */}
            <div className='flex items-center justify-around bg-amber-300 py-6 rounded-2xl shadow-sm border border-amber-500/10 mt-6'>
                <div className='flex flex-col items-center gap-1'>
                    <i className="text-2xl ri-timer-2-line text-gray-800"></i>
                    <h5 className='text-lg font-bold text-gray-900'>10.2</h5>
                    <p className='text-[10px] font-bold text-gray-700 uppercase'>Hours Online</p>
                </div>

                <div className='flex flex-col items-center gap-1'>
                    <i className="text-2xl ri-speed-up-line text-gray-800"></i>
                    <h5 className='text-lg font-bold text-gray-900'>18</h5>
                    <p className='text-[10px] font-bold text-gray-700 uppercase'>Total Rides</p>
                </div>

                <div className='flex flex-col items-center gap-1'>
                    <i className="text-2xl ri-booklet-line text-gray-800"></i>
                    <h5 className='text-lg font-bold text-gray-900'>4.9</h5>
                    <p className='text-[10px] font-bold text-gray-700 uppercase'>Rating</p>
                </div>
            </div>

            {/* Added a small subtle footer indicator instead of a button */}
            <div className='w-full flex justify-center mt-2'>
                <div className='w-12 h-1 bg-amber-500/30 rounded-full'></div>
            </div>
        </div>
    );
}

export default CaptainDetails;