import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import LiveTracking from '../components/livetracking';
import { UserDataContext } from '../context/UserContext';
import socket from '../socket';

const Home = () => {
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [panelOpen, setPanelOpen] = useState(false);
    const panelRef = useRef(null);
    const [vehiclePanel, setVehiclePanel] = useState(false);
    const vehiclePanelRef = useRef(null);
    const confirmPanelRef = useRef(null);
    const [activeInput, setActiveInput] = useState(null);
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [lookingForDriverPanel, setLookingForDriverPanel] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)
    const [fare, setFare] = useState(null);
    const [distanceTime, setDistanceTime] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState('car');
    const [createdRide, setCreatedRide] = useState(null);
    const [confirmedRide, setConfirmedRide] = useState(null);
    const [rideOtp, setRideOtp] = useState(null);
    const { user, setUser } = React.useContext(UserDataContext);
    const [ride, setRide] = useState(null);
    const navigate = useNavigate();
    const sumbitHandler = (e) => {
        e.preventDefault();
    }

    const fetchRideDetails = async (rideId) => {
        const token = localStorage.getItem('userToken');
        if (!token || !rideId) {
            return;
        }
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/${rideId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response?.data?._id) {
                setConfirmedRide(response.data);
                setRide(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch ride details:', error.response?.data || error.message);
        }
    };


    useEffect(() => {
        const handleRideConfirmed = (ride) => {
            console.log('Ride confirmed:', ride);
            if (!ride) {
                console.warn('ride-confirmed payload is empty');
                return;
            }
            setConfirmedRide(ride);
            setRide(ride);
            localStorage.setItem('activeRide', JSON.stringify(ride));
            console.log('setRide called with:', ride);
            setLookingForDriverPanel(false);
            setWaitingForDriver(true);

            if (!ride.captain || !ride.captain.vehicle) {
                fetchRideDetails(ride._id);
            }
        };

        socket.on('ride-confirmed', handleRideConfirmed);
        return () => socket.off('ride-confirmed', handleRideConfirmed);
    }, []);

    useEffect(() => {
        const handleRideStarted = (ride) => {
            console.log('Ride started:', ride);
            if (ride) {
                setRide(ride);
                localStorage.setItem('activeRide', JSON.stringify(ride));
            }
            navigate('/start-ride');
        };

        socket.on('ride-started', handleRideStarted);
        return () => socket.off('ride-started', handleRideStarted);
    }, [navigate]);

    useEffect(() => {
        const loadProfile = async () => {
            if (user?._id) {
                return;
            }
            const token = localStorage.getItem('userToken');
            if (!token) {
                return;
            }
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response?.data?._id) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error('Failed to load user profile:', error.response?.data || error.message);
            }
        };

        loadProfile();
    }, [user, setUser]);

    useEffect(() => {
    console.log('user:', user);
    console.log('socket:', socket); // is socket defined?
    
    if (!user?._id) return;
    
    console.log('emitting join...'); // does this print?
    socket.emit('join', {
        userId: user._id,
        userType: 'user'
    });
}, [user]);

    useEffect(() => {
        if (!waitingForDriver || !ride?._id) {
            return;
        }
        if (ride.captain && ride.captain.vehicle) {
            return;
        }
        fetchRideDetails(ride._id);
    }, [waitingForDriver, ride]);
    useEffect(() => {
        if (!pickup.trim() || !destination.trim()) {
            setFare(null);
            setDistanceTime(null);
            return;
        }

        const controller = new AbortController();
        const token = localStorage.getItem('userToken');

        const fetchFareAndTime = async () => {
            try {
                const [fareResponse, distanceResponse] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_BASE_URL}/rides/calculate-fare`, {
                        params: { origin: pickup, destination },
                        headers: { Authorization: `Bearer ${token}` },
                        signal: controller.signal,
                    }),
                    axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-distance-time`, {
                        params: { origin: pickup, destination },
                        headers: { Authorization: `Bearer ${token}` },
                        signal: controller.signal,
                    }),
                ]);

                setFare(fareResponse.data);
                setDistanceTime(distanceResponse.data);
            } catch (error) {
                if (error.code === 'ERR_CANCELED') {
                    return;
                }
                console.error('Error fetching fare or distance:', error);
                setFare(null);
                setDistanceTime(null);
            }
        };

        const timer = setTimeout(fetchFareAndTime, 300);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [pickup, destination]);


    async function createRide(vehicleType) {
        console.log('Creating ride with:', { pickup, destination, vehicleType });

        const token = localStorage.getItem('userToken');
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
                origin: pickup,
                destination,
                vehicleType,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log(response.data);
            console.log('OTP', response.data.otp)
            console.log('Ride ID', response.data.rideId)
            setCreatedRide(response.data.ride || null);
            setRideOtp(response.data.otp || null);
            setRide(response.data.ride || null);
            localStorage.setItem('activeRide', JSON.stringify(response.data.ride || null));
            localStorage.setItem('selectedVehicle', vehicleType);
            return response.data.ride;
        } catch (error) {
            console.log('Error details:', error.response?.data);
            return null;
        }


    }
    return (
        <div className='h-screen relative overflow-hidden bg-white'>
            <img className='w-16 absolute left-5 top-5 z-10' src="/Uber_logo_2018.png" alt="Uber Logo" />

            <div className='h-screen w-full absolute top-0 right-0 z-0'>
                <LiveTracking />
            </div>

            <div className='flex flex-col justify-end h-screen absolute top-0 w-full z-20 pointer-events-none'>
                <div className='h-[30%] p-6 bg-white relative pointer-events-auto'>
                    <h5
                        onClick={() => setPanelOpen(false)}
                        className={`absolute right-6 top-6 text-2xl transition-opacity ${panelOpen ? 'opacity-100' : 'opacity-0'}`}>
                        <i className="ri-arrow-down-s-line"></i>
                    </h5>
                    <h4 className='text-2xl font-bold'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={sumbitHandler}>
                        <div className="line absolute h-10 w-1 top-[35%] left-2 bg-black rounded-full"></div>
                        <div className='flex items-center gap-5 mb-3'>
                            <div className='h-3 w-3 rounded-full bg-red-600 ml-1'></div>
                            <input
                                value={pickup}
                                onClick={() => {
                                    setActiveInput('pickup')
                                    setPanelOpen(true)
                                }}
                                onChange={(e) => {
                                    setActiveInput('pickup')
                                    setPickup(e.target.value)
                                }}
                                className='bg-[#eee] px-10 py-3 text-base rounded-lg w-full'
                                type="text"
                                placeholder="Add a pickup location"
                            />
                        </div>
                        <div className='flex items-center gap-5'>
                            <div className='h-3 w-3 bg-green-600 ml-1'></div>
                            <input
                                value={destination}
                                onClick={() => {
                                    setActiveInput('destination')
                                    setPanelOpen(true)
                                }}
                                onChange={(e) => {
                                    setActiveInput('destination')
                                    setDestination(e.target.value)
                                }}
                                className='bg-[#eee] px-10 py-3 text-base rounded-lg w-full'
                                type="text"
                                placeholder="Enter your destination"
                            />
                        </div>
                    </form>
                </div>

                <div ref={panelRef} className={`bg-white transition-all duration-500 pointer-events-auto ${panelOpen ? 'h-[70%]' : 'h-0'}`}>
                    <LocationSearchPanel
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeInput={activeInput}
                        inputValue={activeInput === 'pickup' ? pickup : destination}
                    />
                </div>
            </div>

            <div ref={vehiclePanelRef}
                className={`fixed w-full z-30 bottom-0 bg-white px-3 py-5 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out ${vehiclePanel ? 'translate-y-0' : 'translate-y-full'}`}
            >
                <VehiclePanel
                    setVehiclePanel={setVehiclePanel}
                    setConfirmRidePanel={setConfirmRidePanel}
                    fare={fare}
                    distanceTime={distanceTime}
                    selectedVehicle={selectedVehicle}
                    setSelectedVehicle={setSelectedVehicle}
                />
            </div>

            <div
                ref={confirmPanelRef}
                className={`fixed w-full z-30 bottom-0 bg-white px-3 py-5 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out ${confirmRidePanel ? 'translate-y-0' : 'translate-y-full'}`}
            >
                <ConfirmRide
                    setConfirmRidePanel={setConfirmRidePanel}
                    setVehiclePanel={setVehiclePanel}
                    setLookingForDriverPanel={setLookingForDriverPanel}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    distanceTime={distanceTime}
                    selectedVehicle={selectedVehicle}
                    createRide={createRide}
                />
            </div>

            <div className={`fixed w-full z-30 bottom-0 bg-white px-3 py-5 rounded-t-3xl transition-transform duration-500 ${lookingForDriverPanel ? 'translate-y-0' : 'translate-y-full'}`}>
                <LookingForDriver
                    setLookingForDriverPanel={setLookingForDriverPanel}
                    setWaitingForDriver={setWaitingForDriver}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    distanceTime={distanceTime}
                    selectedVehicle={selectedVehicle}
                />
            </div>

            <div className={`fixed w-full z-30 bottom-0 bg-white px-3 py-6 pt-12 rounded-t-3xl transition-transform duration-500 ${waitingForDriver ? 'translate-y-0' : 'translate-y-full'}`}>
                <WaitingForDriver
                    ride={ride || confirmedRide || createdRide}
                    otp={rideOtp}
                    setWaitingForDriver={setWaitingForDriver}
                />
            </div>

        </div>
    );
};

export default Home;