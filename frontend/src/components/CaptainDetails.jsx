import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { CaptainDataContext } from "../context/CaptainContext";

const CaptainDetails = () => {
    const { captain, setCaptain } = useContext(CaptainDataContext);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (captain) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        const controller = new AbortController();
        setIsLoading(true);
        setError(null);

        axios
            .get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
                headers: { Authorization: `Bearer ${token}` },
                signal: controller.signal,
            })
            .then((response) => {
                if (response.status === 200) {
                    setCaptain(response.data.captain);
                }
            })
            .catch((fetchError) => {
                if (fetchError.code === "ERR_CANCELED") return;
                console.error("Captain profile fetch failed:", fetchError);
                setError("Unable to load captain details.");
            })
            .finally(() => setIsLoading(false));

        return () => controller.abort();
    }, [captain, setCaptain]);

    const firstName = captain?.name?.firstname || "";
    const lastName = captain?.name?.lastname || "";
    const displayName = [firstName, lastName].filter(Boolean).join(" ") || "Captain";
    const vehicle = captain?.vehicle || {};
    const hoursOnline = captain?.stats?.hoursOnline ?? "--";
    const totalRides = captain?.stats?.totalRides ?? "--";
    const rating = captain?.stats?.rating ?? "--";

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
                        <h2 className='text-lg font-bold text-gray-900 leading-tight'>
                            {displayName}
                        </h2>
                    </div>
                </div>
                <div className='text-right'>
                    <h4 className='text-xl font-semibold text-gray-900'>₹2,450.20</h4>
                    <p className='text-[10px] font-bold text-gray-800 uppercase tracking-wider'>Today's Earnings</p>
                </div>
            </div>

            <div className='text-right mt-2'>
                <h4 className='text-xl font-semibold text-gray-900'>
                    {vehicle.vehicleType || '--'}  {/* ✅ fixed from {vehicleType} */}
                </h4>
                <p className='text-[10px] font-bold text-gray-800 uppercase tracking-wider'>Vehicle Type</p>
            </div>

            {error && <p className='text-xs text-red-500 mt-2'>{error}</p>}

            <div className='flex items-center justify-around bg-amber-300 py-6 rounded-2xl shadow-sm border border-amber-500/10 mt-6'>
                <div className='flex flex-col items-center gap-1'>
                    <i className="text-2xl ri-timer-2-line text-gray-800"></i>
                    <h5 className='text-lg font-bold text-gray-900'>{hoursOnline}</h5>
                    <p className='text-[10px] font-bold text-gray-700 uppercase'>Hours Online</p>
                </div>

                <div className='flex flex-col items-center gap-1'>
                    <i className="text-2xl ri-speed-up-line text-gray-800"></i>
                    <h5 className='text-lg font-bold text-gray-900'>{totalRides}</h5>
                    <p className='text-[10px] font-bold text-gray-700 uppercase'>Total Rides</p>
                </div>

                <div className='flex flex-col items-center gap-1'>
                    <i className="text-2xl ri-booklet-line text-gray-800"></i>
                    <h5 className='text-lg font-bold text-gray-900'>{rating}</h5>
                    <p className='text-[10px] font-bold text-gray-700 uppercase'>Rating</p>
                </div>
            </div>

            {isLoading && (
                <p className='text-sm text-gray-500 mt-3'>Loading captain details...</p>
            )}

            <div className='w-full flex justify-center mt-2'>
                <div className='w-12 h-1 bg-amber-500/30 rounded-full'></div>
            </div>
        </div>
    );
}

export default CaptainDetails;