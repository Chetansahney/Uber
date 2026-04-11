import React from 'react';
import{Route, Routes} from 'react-router-dom';
import Home from './pages/home';
import Userlogin from './pages/Userlogin';
import Usersignup from './pages/Usersignup';
import Captainlogin from './pages/Captainlogin';
import Captainsignup from './pages/Captainsignup';


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} ></Route>
        <Route path="/Userlogin" element={<Userlogin />} ></Route>
        <Route path="/Usersignup" element={<Usersignup />} ></Route>
        <Route path="/Captainlogin" element={<Captainlogin />} ></Route>
        <Route path="/Captainsignup" element={<Captainsignup />} ></Route>

      </Routes>
    </div>
  );
}
export default App;