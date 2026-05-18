import React, { useState, useEffect } from 'react'
import axios from 'axios'

const LocationSearchPanel = ({ setPanelOpen, setVehiclePanel, setDestination, setPickup, activeInput, inputValue }) => {

    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!inputValue || inputValue.trim().length < 2) {
                setSuggestions([]);
                return;
            }
            setLoading(true);
            try {
                const token = localStorage.getItem('userToken');
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
                    {
                        params: { input: inputValue },
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );
                setSuggestions(response.data);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
            } finally {
                setLoading(false);
            }
        };

        
        const timer = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timer);

    }, [inputValue]); 

    const handleSuggestionClick = (description) => {
        if (activeInput === 'pickup') {
            setPickup(description);
        } else if (activeInput === 'destination') {
            setDestination(description);
            setVehiclePanel(true);
            setPanelOpen(false);
        }
    }

    return (
        <div className='p-4 bg-white'>

            {loading && (
                <p className='text-center text-sm text-gray-400 py-4'>Loading suggestions...</p>
            )}

            {!loading && suggestions.length === 0 && inputValue?.length >= 2 && (
                <p className='text-center text-sm text-gray-400 py-4'>No results found</p>
            )}

            {suggestions.map((suggestion, idx) => (
                <div
                    key={idx}
                    onClick={() => handleSuggestionClick(suggestion.description || suggestion)}
                    className='flex gap-4 items-center my-2 active:bg-gray-100 p-2 rounded-xl transition-colors cursor-pointer'
                >
                    <div className='bg-[#eee] h-10 w-12 flex items-center justify-center rounded-full shrink-0'>
                        <i className='ri-map-pin-fill text-lg text-black'></i>
                    </div>

                    <div className='flex flex-col overflow-hidden'>
                        <h4 className='font-semibold text-sm truncate'>
                            {suggestion.description || suggestion}
                        </h4>
                        {suggestion.structured_formatting?.secondary_text && (
                            <p className='text-xs text-gray-500 truncate leading-tight'>
                                {suggestion.structured_formatting.secondary_text}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default LocationSearchPanel