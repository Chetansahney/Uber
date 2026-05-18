import React, { useRef, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import CaptainRouteMap from '../components/CaptainRouteMap'
import { CaptainDataContext } from '../context/CaptainContext'
import socket from '../socket'

const CaptainHome = () => {
    const [ridePopUp, setRidePopUp] = useState(false)
    const [confirmRidePopUp, setconfirmRidePopUp] = useState(false)
    const [ride, setRide] = useState(null)
    const RidePopUpPannelref = useRef(null)
    const ConfirmRidePopUpPannelref = useRef(null)
    const { captain } = useContext(CaptainDataContext);

    // Join socket + send location every 10s
    useEffect(() => {
        if (!captain?._id) return;

        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        });

        const locationInterval = setInterval(() => {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    let rideId = ride?._id;
                    if (!rideId) {
                        const storedRide = localStorage.getItem('activeRide');
                        if (storedRide) {
                            try {
                                rideId = JSON.parse(storedRide)?._id;
                            } catch (error) {
                                rideId = null;
                            }
                        }
                    }
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        rideId: rideId || undefined,
                        location: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        }
                    });
                    console.log('Location sent:', position.coords.latitude, position.coords.longitude);
                },
                (error) => console.error('Geolocation error:', error)
            );
        }, 1000);

        return () => clearInterval(locationInterval);
    }, [captain]);

    // ✅ Listen for new ride — inside useEffect
    useEffect(() => {
        console.log('Setting up new-ride listener');
        socket.on('new-ride', (data) => {
            console.log('New ride received:', data); // ✅ will print now
            setRide(data);
            setRidePopUp(true);
        });

        return () => socket.off('new-ride'); // ✅ cleanup
    }, []);

    async function confirmride() {
        if (!ride?._id) {
            return;
        }

        const token = localStorage.getItem('captainToken');
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
                { rideId: ride._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response?.data?.ride) {
                setRide(response.data.ride);
                localStorage.setItem('activeRide', JSON.stringify(response.data.ride));
            }
        } catch (error) {
            console.error('Error confirming ride:', error.response?.data || error.message);
        }
    }


    return (
        <div className='h-screen w-full relative overflow-hidden bg-white'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-full z-10'>
                <img className='w-16' src="/Uber_logo_2018.png" alt="Uber Logo" />
                <Link to='/captain-login' className='h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>

            <div className='h-[60vh] w-full'>
                <CaptainRouteMap ride={ride} mode="to-pickup" />
            </div>

            <div className='h-[40vh] p-6 pb-10 flex flex-col justify-between bg-white rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.15)]'>
                <CaptainDetails />
            </div>

            <div ref={RidePopUpPannelref}
                className={`fixed w-full z-30 bottom-0 bg-white px-3 py-5 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out ${ridePopUp ? 'translate-y-0' : 'translate-y-full'}`}>
                <RidePopUp
                    ride={ride}
                    setRidePopUp={setRidePopUp}
                    setconfirmRidePopUp={setconfirmRidePopUp}
                    confirmride={confirmride}
                    pickup={ride?.origin}        // ✅ fixed from incomingRide
                    destination={ride?.destination}
                    fare={ride?.fare}
                    user={ride?.user}
                    distance={ride?.distance}
                    distanceTime={ride?.distanceTime}
                />
            </div>

            <div ref={ConfirmRidePopUpPannelref}
                className={`fixed w-full z-30 bottom-0 bg-white px-3 py-5 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out ${confirmRidePopUp ? 'translate-y-0' : 'translate-y-full'}`}>
                <ConfirmRidePopUp
                    setconfirmRidePopUp={setconfirmRidePopUp}
                    setRidePopUp={setRidePopUp}
                    ride={ride}
                />
            </div>
        </div>
    )
}

export default CaptainHome