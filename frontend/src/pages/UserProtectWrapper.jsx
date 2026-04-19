import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext'; // Assuming this is your context

const UserProtectWrapper = ({ children }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { setUser } = useContext(UserDataContext); // Get setUser from context
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/Userlogin');
      return;
    }

    axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        setUser(response.data.user);
        setIsLoading(false);
      }
    })
    .catch((error) => {
      console.log(error);
      localStorage.removeItem('token');
      navigate('/Userlogin');
    });
  }, [token, navigate, setUser]);

  if (isLoading) {
    return <div>Loading...</div>; // Prevent children from rendering until user is verified
  }

  return <>{children}</>;
};

export default UserProtectWrapper;