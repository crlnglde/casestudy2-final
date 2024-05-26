import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Import Route and Routes from react-router-dom
import Login from '../pages/login.js'; 
import Signup from '../pages/signup.js'; 


const auth = () => {
  return (
    <Routes>
      
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
    </Routes>
  );
};

export default auth;
