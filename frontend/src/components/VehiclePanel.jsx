import React from 'react'
import ConfirmRide from './ConfirmRide'

const VehiclePanel = ({ setVehiclePanel, setConfirmRidePanel }) => {
    return (
        <div>
            
            <div className="w-full flex justify-center mb-2" onClick={() => setVehiclePanel(false)}>
                <div className="w-10 h-1 bg-gray-300 rounded-full cursor-pointer"></div>
            </div>

            <div className="flex flex-col">
                
                <div className="flex items-center justify-between w-full px-2 py-1 border-[3px] border-transparent active:border-black rounded-xl mb-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                        
                        <div className="w-20  flex justify-center">
                            <img src="/cab.png" alt="UberGo" className="h-14 object-contain" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h4 className="text-lg font-bold flex items-center gap-1 leading-none">
                                UberGo <span className="text-sm font-semibold"><i className="ri-user-3-fill"></i>4</span>
                            </h4>
                            <p className="text-sm font-medium mt-1">2 mins away • 15:24</p>
                            <p className="text-xs text-gray-500 leading-tight">Affordable, compact rides</p>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold">₹193.20</h2>
                </div>

                
                <div className="flex items-center justify-between w-full px-2 py-1 border-[3px] border-transparent active:border-black rounded-xl mb-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="w-20 flex justify-center">
                            <img src="/bike.png" alt="Moto" className="h-12 object-contain" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h4 className="text-lg font-bold flex items-center gap-1 leading-none">
                                Moto <span className="text-sm font-semibold"><i className="ri-user-3-fill"></i>1</span>
                            </h4>
                            <p className="text-sm font-medium mt-1">3 mins away • 15:24</p>
                            <p className="text-xs text-gray-500 leading-tight">Affordable motorcycle rides</p>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold">₹65.17</h2>
                </div>

                <div className="flex items-center justify-between w-full px-2 py-1 border-[3px] border-transparent active:border-black rounded-xl mb-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="w-20 flex justify-center">
                            <img src="/auto.png" alt="Auto" className="h-12 object-contain" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h4 className="text-lg font-bold flex items-center gap-1 leading-none">
                                Auto <span className="text-sm font-semibold"><i className="ri-user-3-fill"></i>3</span>
                            </h4>
                            <p className="text-sm font-medium mt-1">4 mins away • 15:25</p>
                            <p className="text-xs text-gray-500 leading-tight">Comfortable, top-rated drivers</p>
                        </div>
                    </div>
                    <h2 className="text-xl font-bold">₹147</h2>
                </div>
            </div>

            <button
                className="w-full bg-black text-white text-lg font-semibold py-3 rounded-xl mt-4 active:scale-95 transition-transform"
                onClick={() => {
                    setVehiclePanel(false);
                    setConfirmRidePanel(true);
                }}
            >
                Confirm UberGo
            </button>
        </div>
    )
}

export default VehiclePanel