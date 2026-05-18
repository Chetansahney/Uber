import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Userlogout = () => {
    const token = localStorage.getItem('userToken');
    const navigate = useNavigate();
    axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.status === 200) {
            localStorage.removeItem('userToken');
            navigate('/Userlogin');
        }
    });
}
export default Userlogout;