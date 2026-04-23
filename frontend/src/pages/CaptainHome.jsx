import React from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useRef } from 'react'
import ConfirmRide from '../components/ConfirmRide'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'

const CaptainHome = () => {
    const [ridePopUp, setRidePopUp] = React.useState(true)
    const RidePopUpPannelref = useRef(null)
    const [confirmRidePopUp, setconfirmRidePopUp] = React.useState(false)
    const ConfirmRidePopUpPannelref = useRef(null)

    return (

        <div className='h-screen w-full relative overflow-hidden bg-white'>

            
            <div className='fixed p-6 top-0 flex items-center justify-between w-full z-10'>
                <img className='w-16' src="/Uber_logo_2018.png" alt="Uber Logo" />
                <Link to='/captain-login' className='h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>

            {/* Map Section (Upper Half) */}
            <div className='h-[60vh] w-full'>
                <img
                    className='h-full w-full object-cover grayscale-[0.5]'
                    src="map.png"
                    alt="Map"
                />
            </div>

            {/* Captain Details Section (Lower Half) */}
            <div className='h-[40vh] p-6 pb-10 flex flex-col justify-between bg-white rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.15)]'>
                <CaptainDetails />
            </div>

            <div ref={RidePopUpPannelref} className={`fixed w-full z-30 bottom-0 bg-white px-3 py-5 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out ${ridePopUp ? 'translate-y-0' : 'translate-y-full'}`}>
                <RidePopUp setRidePopUp={setRidePopUp} setconfirmRidePopUp={setconfirmRidePopUp} />

            </div>
            <div ref={ConfirmRidePopUpPannelref} className={`fixed w-full z-30 bottom-0 bg-white px-3 py-5 rounded-t-3xl shadow-[0_-10px_20px_rgba(0,0,0,0.1)] transition-transform duration-500 ease-in-out ${confirmRidePopUp ? 'translate-y-0' : 'translate-y-full'}`}>
                <ConfirmRidePopUp setconfirmRidePopUp={setconfirmRidePopUp} setRidePopUp={setRidePopUp} />

            </div>
        </div>
    )
}

export default CaptainHome