import React, { useState } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
const ConfirmRidePopUp = (props) => {
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const riderFirstName = props.ride?.user?.name?.firstname || "";
    const riderLastName = props.ride?.user?.name?.lastname || "";
    const riderName = [riderFirstName, riderLastName].filter(Boolean).join(" ") || "Rider";
    const fareLabel = props.ride?.fare || props.ride?.fare === 0 ? `₹${props.ride?.fare}` : "₹--";
    const pickup = props.ride?.origin || "Pickup location";
    const destination = props.ride?.destination || "Destination";

    return (
        <div className="h-fit w-full bg-white flex flex-col pb-6">
            {/* Drag Handle */}
            <div className='w-full flex items-center justify-center py-2'>
                <div className='w-10 h-1 bg-gray-200 rounded-full'></div>
            </div>

            {/* Header */}
            <div className='w-full flex items-center justify-between px-6 py-2'>
                <h3 className="text-lg font-bold text-gray-800">Trip Details</h3>
                <i onClick={() => props.setconfirmRidePopUp(false)} className="ri-close-line text-2xl text-gray-400"></i>
            </div>

            <div className="flex-1 p-5 space-y-5">

                {/* 1. Compact Passenger Info */}
                <div className='flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-100'>
                    <div className='flex items-center gap-3'>
                        <img className='h-12 w-12 rounded-full object-cover' src="user.webp" alt="Rider" />
                        <div>
                            <h2 className='text-sm font-bold text-gray-900'>{riderName}</h2>
                            <p className='text-[10px] text-gray-500'>Cash</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black text-gray-900">{fareLabel}</p>
                    </div>
                </div>

                <div className='w-full bg-gray-50 p-4 rounded-xl border border-gray-100'>
                    <p className='text-xs font-bold text-gray-400 uppercase tracking-widest mb-2'>Enter OTP</p>
                    <div className='flex items-center gap-3'>
                        <input
                            value={otp}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                                setOtp(value);
                                setOtpError('');
                            }}
                            className='flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-base font-semibold tracking-widest text-gray-900 outline-none focus:ring-2 focus:ring-yellow-200'
                            inputMode="numeric"
                            maxLength={4}
                            placeholder="----"
                        />
                        <button
                            onClick={async () => {
                                const otpValue = String(otp || '').trim();
                                if (!props.ride?._id || otpValue.length !== 4) {
                                    setOtpError('Enter a valid 4 digit OTP.');
                                    return;
                                }
                                setIsVerifying(true);
                                setOtpError('');
                                try {
                                    const token = localStorage.getItem('captainToken');
                                    console.log('start-ride payload:', { rideId: props.ride._id, otp: otpValue });
                                    await axios.post(
                                        `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
                                        { rideId: props.ride._id, otp: otpValue },
                                        { headers: { Authorization: `Bearer ${token}` } }
                                    );
                                } catch (error) {
                                    setOtpError(error.response?.data?.error || 'OTP verification failed.');
                                } finally {
                                    setIsVerifying(false);
                                }
                            }}
                            disabled={isVerifying}
                            className='bg-black text-white text-xs font-bold px-4 py-3 rounded-xl active:scale-95 transition-all disabled:opacity-60'
                            type="button"
                        >
                            {isVerifying ? 'Verifying...' : 'Verify'}
                        </button>
                    </div>
                    {otpError ? (
                        <p className='text-xs text-red-500 mt-2'>{otpError}</p>
                    ) : null}
                </div>

                {/* 2. Sleek Route Timeline (Smaller Fonts) */}
                <div className='relative px-2 py-1'>
                    {/* Vertical Connector */}
                    <div className="absolute left-[12px] top-6 bottom-6 w-[1.5px] bg-gray-100"></div>

                    {/* Pickup */}
                    <div className='flex items-start gap-4 mb-6 relative'>
                        <div className="mt-1 w-2.5 h-2.5 rounded-full border-2 border-yellow-500 bg-white z-10"></div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Pick Up</p>
                            <h3 className='text-sm font-semibold text-gray-800'>{pickup}</h3>
                        </div>
                    </div>

                    {/* Destination */}
                    <div className='flex items-start gap-4 relative'>
                        <div className="mt-1 w-2.5 h-2.5 bg-gray-900 rounded-sm z-10"></div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Drop Off</p>
                            <h3 className='text-sm font-semibold text-gray-800'>{destination}</h3>
                        </div>
                    </div>
                </div>

                {/* 3. Action Row (Smaller icons/text) */}
                <div className="flex flex-row gap-3">
                    <button className="flex-1 py-3 bg-green-50 text-green-600 text-xs font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2">
                        <i className="ri-phone-fill text-sm"></i> Call
                    </button>
                    <button className="flex-1 py-3 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2">
                        <i className="ri-message-3-fill text-sm"></i> Message
                    </button>
                    <button
                        onClick={() => {
                            // Logic to navigate to pickup
                            props.setconfirmRidePopUp(false);
                            props.setRidePopUp(false);
                        }}
                        className="flex-1 py-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2">
                        <i className="ri-close-circle-fill text-sm"></i> Cancel
                    </button>
                </div>
            </div>
            {/* 4. Primary Sticky Button */}
            <div className="px-5">
                <Link
                    to="/captain-riding"
                    onClick={() => {
                        // Logic to navigate to pickup
                        props.setconfirmRidePopUp(false);
                        props.setRidePopUp(false);
                    }}
                    className="flex items-center justify-center w-full bg-yellow-500 text-black text-sm font-bold py-4 rounded-2xl shadow-lg shadow-yellow-100 active:scale-95 transition-all uppercase tracking-wider"
                >
                    Go to Pick Up
                </Link>
            </div>
        </div>
    );
};

export default ConfirmRidePopUp;