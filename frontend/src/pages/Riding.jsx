import React from 'react'
import { Link } from 'react-router-dom'

const Riding = () => {
    return (
        <div className='h-screen w-full bg-white relative overflow-hidden'>
            
            
            <Link to='/home' className='fixed right-4 top-4 h-10 w-10 bg-white flex items-center justify-center rounded-full z-10 shadow-lg border border-gray-100'>
                <i className="text-xl font-bold ri-home-5-line"></i>
            </Link>

            
            <div className='h-[45vh] w-full'>
                <img 
                    className='h-full w-full object-cover grayscale-[0.2]' 
                    src="map.png" 
                    alt="Map" 
                />
            </div>

            <div className='h-[50vh] p-5 flex flex-col justify-between bg-white relative z-10 rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.1)]'>
                
                
                <div className='flex items-center justify-between'>
                    <img className='h-14 object-contain drop-shadow-md' src="/cab.png" alt="car" />
                    <div className='text-right'>
                        <h2 className='text-sm font-bold text-gray-400 uppercase tracking-widest'>Sarthak</h2>
                        <h4 className='text-2xl font-black text-gray-900 leading-none'>MP04 AB 1234</h4>
                        <p className='text-sm font-medium text-gray-500 mt-1'>Maruti Suzuki Alto</p>
                    </div>
                </div>

               
                <div className='w-full mt-2'>
                    
                    
                    <div className='flex items-center gap-4 py-3 border-b border-gray-100'>
                         <div className='relative flex items-center justify-center'>
                             <div className='h-3 w-3 bg-blue-600 rounded-full animate-ping absolute'></div>
                             <div className='h-3 w-3 bg-blue-600 rounded-full relative z-10'></div>
                         </div>
                         <div className="px-1">
                             <h3 className='text-base font-bold text-blue-600'>Arriving in 4 mins</h3>
                             <p className='text-xs text-gray-500'>The driver is on the correct route</p>
                         </div>
                    </div>

                    
                    <div className='flex items-center gap-4 py-3 border-b border-gray-100'>
                        <i className="text-lg ri-map-pin-2-fill text-gray-700"></i>
                        <div>
                            <h3 className='text-base font-bold leading-tight'>562/11-A</h3>
                            <p className='text-sm text-gray-500'>Kankariya Talab, Bhopal</p>
                        </div>
                    </div>

                    
                    <div className='flex items-center gap-4 py-3'>
                        <i className="text-lg ri-bank-card-2-fill text-gray-700"></i>
                        <div>
                            <h3 className='text-base font-bold leading-tight'>₹193.20</h3>
                            <p className='text-sm text-gray-500'>Mode of Payment: Cash</p>
                        </div>
                    </div>
                </div>

                
                <button className='w-full bg-green-600 text-white font-bold py-3.5 rounded-xl shadow-lg active:scale-[0.98] transition-all hover:bg-green-700'>
                    Make a Payment
                    <i className="ri-currency-line text-lg ml-2"></i>
                </button>
            </div>
        </div>
    )
}

export default Riding