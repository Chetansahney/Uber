import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronUp, Navigation } from 'lucide-react';
import FinishRide from '../components/FinishRIde';
import { useRef } from 'react';


const CaptainRiding = (props) => {
    const [finishRidePanel, setFinishRidePanel] = useState(false);
    const finishRidePanelRef = React.useRef(null);
    const[captainRiding, setCaptainRiding] = useState(true);
    const submitHandler=(e)=>{
        e.preventDefault();
        setFinishRidePanel(true);
        setCaptainRiding(false);
    };
    const[otp, setOtp] = useState("");

    return (
        <div className='h-screen relative flex flex-col justify-end'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen z-10'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                <Link to='/captainhome' className='h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md'>
                    <Navigation size={20} />
                </Link>
            </div>

            <div className='h-4/5 w-screen fixed top-0 left-0 -z-10'>
                <img className='w-full h-full object-cover' src="map.png" alt="" />
            </div>

            <div className='h-1/5 p-6 bg-yellow-400 flex items-center justify-between relative shadow-2xl rounded-t-3xl'>
                <div className='absolute top-3 left-1/2 -translate-x-1/2' onClick={() => setFinishRidePanel(true)}>
                    <ChevronUp />
                </div>
                <div>
                    <h4 className='text-lg font-bold'>4.2 km away</h4>
                    <p className='text-sm font-medium'>Pickup: Kankariya Talab</p>
                </div>
                <button onClick={() => setFinishRidePanel(true)} className='bg-black text-white px-10 py-3 rounded-xl font-bold'>
                    Enter OTP
                </button>
            </div>

            
                <div className='fixed w-full z-20 bottom-0 bg-white px-5 py-10 pt-12 rounded-t-3xl shadow-2xl'>
                    <div className='absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-gray-200 rounded-full'></div>
                    <h3 className='text-2xl font-bold mb-7 text-center'>Enter OTP to Start</h3>
                    <form onSubmit={submitHandler}>
                        <input
                            type="text"
                            placeholder="0000"
                            className="w-full bg-gray-100 px-6 py-5 text-2xl font-mono tracking-[20px] text-center rounded-2xl mb-6"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button className='w-full bg-green-600 text-white font-bold p-4 rounded-2xl text-lg' 
                            onClick={() => {
                                setFinishRidePanel(true);
                                setCaptainRiding(false);
                            }}>
                            Confirm & Start Ride
                        </button>
                    </form>
                </div>
            
            <div ref={finishRidePanelRef} className={`fixed w-full z-20 bottom-0 bg-white px-5 py-10 pt-12 rounded-t-3xl shadow-2xl transition-transform duration-500 ease-in-out ${finishRidePanel ? 'translate-y-0' : 'translate-y-full'}`}>
                <FinishRide />
            </div>
        </div>
    );
};

export default CaptainRiding;