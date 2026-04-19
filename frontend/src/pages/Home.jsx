import React, { useState, useRef } from 'react';
import 'remixicon/fonts/remixicon.css';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';

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
    const sumbitHandler = (e) => {
        e.preventDefault();
    }


    return (
        <div className='h-screen relative overflow-hidden bg-white'>
            <img className='w-16 absolute left-5 top-5 z-10' src="/Uber_logo_2018.png" alt="Uber Logo" />

            
            <div className='h-screen w-full absolute top-0 right-0 z-0'>
                <img className='h-full w-full object-cover' src="map.png" alt="Map" />
            </div>

            
            <div className='flex flex-col justify-end h-screen absolute top-0 w-full z-20 pointer-events-none'>
                <div className='h-[30%] p-6 bg-white relative pointer-events-auto'>
                    <h5
                        onClick={() => setPanelOpen(false)}
                        className={`absolute right-6 top-6 text-2xl transition-opacity ${panelOpen ? 'opacity-100' : 'opacity-0'}`}>
                        <i className="ri-arrow-down-s-line"></i>
                    </h5>
                    <h4 className='text-2xl font-bold'>Find a trip</h4>
                    <form className='relative py-3' onClick={() => setPanelOpen(true)}>
                        <div className="line absolute h-10 w-1 top-[35%] left-2 bg-black rounded-full"></div>
                        <div className='flex items-center gap-5 mb-3'>
                            <div className='h-3 w-3 rounded-full bg-red-600 ml-1'></div>
                            <input
                                value={pickup}
                                onClick={() => {
                                    setActiveInput('pickup')
                                    setPanelOpen(true)

                                }}
                                onChange={(e) => setPickup(e.target.value)}
                                className='bg-[#eee] px-10 py-3 text-base rounded-lg w-full' type="text" placeholder="Add a pickup location" />
                        </div>
                        <div className='flex items-center gap-5'>
                            <div className='h-3 w-3 bg-green-600 ml-1'></div>
                            <input
                                value={destination}
                                onClick={() => {
                                    setActiveInput('destination')
                                    setPanelOpen(true)
                                }
                                }
                                onChange={(e) => setDestination(e.target.value)} className='bg-[#eee] px-10 py-3 text-base rounded-lg w-full' type="text" placeholder="Enter your destination" />
                        </div>
                    </form>
                </div>

                <div ref={panelRef} className={`bg-white transition-all duration-500 pointer-events-auto ${panelOpen ? 'h-[70%]' : 'h-0'}`}>
                    <LocationSearchPanel setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeInput={activeInput} />
                </div>
            </div>

            
            <div ref={vehiclePanelRef}
                className={`fixed w-full z-30 bottom-0 bg-white px-3 py-5 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out ${vehiclePanel ? 'translate-y-0' : 'translate-y-full'}`}
            >
                <VehiclePanel setVehiclePanel={setVehiclePanel} setConfirmRidePanel={setConfirmRidePanel} />
            </div>

            
            <div
                ref={confirmPanelRef}
                className={`fixed w-full z-30 bottom-0 bg-white px-3 py-5 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out ${confirmRidePanel ? 'translate-y-0' : 'translate-y-full'}`}
            >
                <ConfirmRide setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} setLookingForDriverPanel={setLookingForDriverPanel} pickup={pickup} destination={destination} />
            </div>

            <div className={`fixed w-full z-30 bottom-0 bg-white px-3 py-5 rounded-t-3xl transition-transform duration-500 ${lookingForDriverPanel ? 'translate-y-0' : 'translate-y-full'}`}>
                <LookingForDriver
                    setLookingForDriverPanel={setLookingForDriverPanel}
                    setWaitingForDriver={setWaitingForDriver}
                    pickup={pickup}
                    destination={destination}
                />
            </div>
            <div className={`fixed w-full z-30 bottom-0 bg-white px-3 py-5 rounded-t-3xl transition-transform duration-500 ${waitingForDriver ? 'translate-y-0' : 'translate-y-full'}`}>
                <WaitingForDriver setWaitingForDriver={setWaitingForDriver} />
            </div>

        </div>
    );
};

export default Home;