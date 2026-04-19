import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';
import { useState } from 'react';

const CaptainProtectWrapper = ({ children }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { captain,setCaptain} = React.useContext(CaptainDataContext);
  const[isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!token) {
      navigate('/Userlogin');
    }
  }, [token, navigate]); 
  
axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
}).then((response) => {
    if (response.status === 200) {
        setCaptain(response.data.captain);
        setIsLoading(false);
    }
}).catch((error) => {
    console.log(error);
    localStorage.removeItem('token');
    navigate('/Captainlogin');
});


  if(isLoading){
    return <div>Loading...</div>
  }
  if (!token) {
    return null;
  }

  return <>{children}</>;
};

export default CaptainProtectWrapper;