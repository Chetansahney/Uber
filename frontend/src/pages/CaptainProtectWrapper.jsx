import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';
import axios from 'axios';

const CaptainProtectWrapper = ({ children }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { setCaptain } = useContext(CaptainDataContext);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/captain-login');
            return;
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (response.status === 200) {
                setCaptain(response.data.captain);
                setIsLoading(false);
            }
        })
        .catch((error) => {
            console.error("Profile Fetch Error:", error);
            localStorage.removeItem('token');
            navigate('/captain-login');
        });
    }, [token, navigate, setCaptain]); // Logic stays safely inside here

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <div className="text-xl font-bold animate-pulse">Loading Captain Profile...</div>
            </div>
        );
    }

    return <>{children}</>;
};

export default CaptainProtectWrapper;