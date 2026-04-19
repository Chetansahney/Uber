import React from 'react'

const LocationSearchPanel = ({ setPanelOpen, setVehiclePanel,setDestination,setPickup,activeInput }) => {

    
    const locations = [
        {
            title: "Kempegowda International Airport...",
            subtitle: "KIAL Rd, Devanahalli, Bengaluru, Karnataka",
            icon: "ri-plane-fill"
        },
        {
            title: "Phoenix Marketcity",
            subtitle: "Whitefield Rd, Devasandra Industrial Estate, Mahadevapura, Bengaluru, Karnataka",
            icon: "ri-map-pin-fill"
        },
        {
            title: "Salarpuria Aura Block B",
            subtitle: "BLOCK-B, TOUCHSTONE, Chandana, Kadabeesanahalli, Bengaluru, Karnataka",
            icon: "ri-map-pin-fill"
        },
        {
            title: "Sheraton Grand Bengaluru Whitefield...",
            subtitle: "Prestige Shantiniketan Hoodi, Whitefield, Thigalarapalya, Krishnarajapura, Bengaluru,...",
            icon: "ri-hotel-bed-fill"
        },
        {
            title: "KSR Bengaluru City Junction (Bangalore)",
            subtitle: "M.G. Railway Colony, Majestic, Bengaluru, Karnataka",
            icon: "ri-map-pin-fill"
        },
        {
            title: "Set location on map",
            subtitle: "",
            icon: "ri-map-pin-2-fill"
        }
    ]

    const handleSuggestionClick = (title) => {
        if (activeInput === 'pickup') {
            setPickup(title);
            // Keep panel open to let them type destination
        } else if (activeInput === 'destination') {
            setDestination(title);
            setVehiclePanel(true); // TRIGGER: Destination selected, show rides
            setPanelOpen(false);   // Close search panel
        }
        
    }

    return (
        <div className='p-4 bg-white'>
            {
                locations.map((elem, idx) => (
                    <div 
                        key={idx} 
                        onClick={() => handleSuggestionClick(elem.title)}
                        className='flex gap-4 items-center my-2 active:bg-gray-100 p-2 rounded-xl transition-colors cursor-pointer'
                    >
                        
                        <div className='bg-[#eee] h-10 w-12 flex items-center justify-center rounded-full shrink-0'>
                            <i className={`${elem.icon} text-lg text-black`}></i>
                        </div>
                        
                        {/* Text Content */}
                        <div className='flex flex-col overflow-hidden'>
                            <h4 className='font-semibold text-sm truncate'>{elem.title}</h4>
                            {elem.subtitle && (
                                <p className='text-xs text-gray-500 truncate leading-tight'>
                                    {elem.subtitle}
                                </p>
                            )}
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default LocationSearchPanel