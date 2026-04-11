import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Captainlogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captainData, setCaptainData] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setCaptainData({ email, password });
    setEmail('');
    setPassword('');
  }

  return (
    <div className='p-7 h-screen flex flex-col justify-between'>
      <div>
        
        <img className='w-16 mb-10' src="/Uber_logo_2018.png" alt="Uber Driver Logo" />

        <form onSubmit={(e) => handleSubmit(e)}>
          <h3 className='text-lg font-medium mb-2'>What's our Captain's email?</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            type="email"
            placeholder="email@example.com"
          />

          <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
          <input
            className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required type="password"
            placeholder='password'
          />

          <button className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg'>
            Login
          </button>
        </form >

        <p className='text-center'>Want to join a fleet? <Link to='/Captainsignup' className='text-blue-600'>Register as a Captain</Link></p>
      </div>

      <div>
        <Link
          to='/Userlogin'
          className='bg-[#d5622d] flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-2 w-full text-lg'
        >
          Sign in as User
        </Link>
      </div>
    </div>
  );
};

export default Captainlogin;