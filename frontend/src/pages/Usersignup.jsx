import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios'   ;
import {UserDataContext} from '../context/UserContext';


const Usersignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userData, setUserData] = useState({});

const navigate=useNavigate();
const {user, setUser} = React.useContext(UserDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // The keys here must match your Mongoose Schema exactly
    const newUser = {
      name: {
        firstname: firstName, // lowercase 'n' in firstname
        lastname: lastName    // lowercase 'n' in lastname
      },
      email: email,
      password: password
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);

      if (response.status === 201) {
          const data = response.data;
          setUser(data.user);
          // Don't forget to save the token!
          localStorage.setItem('token', data.token); 
          navigate('/home');
      }
    } catch (error) {
      // This will help you see if it's the 3-character limit or email validation
      console.log("Detailed Error:", error.response?.data);
    }

    // Resetting fields
    setEmail('');
    setFirstName('');
    setLastName('');
    setPassword('');
};
  return (
    <div>
      <div className='p-7 h-screen flex flex-col justify-between'>
        <div>
          <img className='w-16 mb-10' src="/Uber_logo_2018.png" alt="Uber Logo" />

          <form onSubmit={(e) => handleSubmit(e)}>
            <h3 className='text-lg font-medium mb-2'>What's your name?</h3>
            <div className='flex gap-4 mb-6'>
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                type="text"
                placeholder='First name'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                required
                className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
                type="text"
                placeholder='Last name'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <h3 className='text-lg font-medium mb-2'>What's your email?</h3>
            <input
              required
              className='bg-[#eeeeee] mb-6 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              type="email"
              placeholder='email@example.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
            <input
              required
              className='bg-[#eeeeee] mb-6 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'
              type="password"
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg'>
              Create account
            </button>
          </form>

          <p className='text-center'>Already have a account? <Link to='/Userlogin' className='text-blue-600'>Login here</Link></p>
        </div>

        <div>
          <p className='text-[10px] leading-tight text-gray-500'>
            By proceeding, you consent to get calls, WhatsApp or SMS messages, including by automated means, from Uber and its affiliates to the number provided.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Usersignup;