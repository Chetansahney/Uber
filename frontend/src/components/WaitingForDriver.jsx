import React from 'react'

const WaitingForDriver = ({ setWaitingForDriver }) => {
    return (
        <div className="flex flex-col h-full bg-white">

            <div className="w-full flex justify-center mb-4" onClick={() => setWaitingForDriver(false)}>
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
                            src="/hrishi.jpeg"
                            alt="driver"
                        />
                    </div>

                    <img className='h-16 -ml-8 drop-shadow-2xl transform group-hover:scale-105 transition-transform' src="/auto.png" alt="car" />
                </div>

                <div className='text-right relative z-10'>
                    <h2 className='text-xs font-bold text-gray-400 uppercase tracking-widest'>HRISHI KUMAR</h2>
                    <h5 className='text-md font-semibold text-gray-900 leading-tight mb-1'>UP78-CW-</h5 ><h4 className='text-xl font-black text-gray-900 leading-tight mb-1'>4421</h4>
                    <p className='text-sm font-medium text-gray-600 whitespace-nowrap'>

                        Bajaj Auto - yellow, 2018 Model
                    </p>
                    <div className='flex items-center justify-end gap-1 mt-1'>
                        <i className="ri-star-s-fill text-black"></i>
                        <span className='text-sm font-bold'>4.9</span>
                    </div>
                </div>
            </div>


            <div className='flex items-center gap-3 px-1 mb-8'>
                <div className='flex-1 flex items-center bg-gray-100 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-gray-200 transition-all'>
                    <input
                        className='bg-transparent text-base font-medium w-full outline-none placeholder:text-gray-400'
                        type="text"
                        placeholder="Send a message..."
                    />
                    <i className="ri-send-plane-2-line text-xl text-gray-500 hover:text-black cursor-pointer"></i>
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