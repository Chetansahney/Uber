import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home'; // Check if file is home.jsx or Home.jsx
import Userlogin from './pages/Userlogin';
import Usersignup from './pages/Usersignup';
import Captainlogin from './pages/Captainlogin';
import Captainsignup from './pages/Captainsignup';
import Start from './pages/Start1';
import UserProtectWrapper from './pages/UserProtectWrapper';
import Userlogout from './pages/Userlogout';
import CaptainHome from './pages/CaptainHome';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} /> 
        <Route path="/home" element={
          <UserProtectWrapper>
            <Home />
          </UserProtectWrapper>
        } />
        <Route path="/Userlogin" element={<Userlogin />} />
        <Route path="/usersignup" element={<Usersignup />} />
        <Route path="/captainlogin" element={<Captainlogin />} />
        <Route path="/captainsignup" element={<Captainsignup />} />
        <Route path="/user/logout" element={
          <UserProtectWrapper>
            <Userlogout />
          </UserProtectWrapper>
        }> </Route>
        <Route path="/captainhome" element={<CaptainHome />} />
      </Routes>
    </div>
  );
}

export default App;