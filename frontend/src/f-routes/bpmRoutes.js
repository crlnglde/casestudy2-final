import React from 'react';
import { Route, Routes } from 'react-router-dom'; // Import Route and Routes from react-router-dom
import BpmList from '../pages/bpmList'; 
import BpmHistory from '../components/bpmHistory'

const labaduhRoutes = () => {
  return (
    <Routes>
      
      <Route path="/pulse" element={<BpmList/>} />
      
      <Route path="/pulse/history" element={<BpmHistory/>} /> 
      
    </Routes>
  );
};

export default labaduhRoutes;
