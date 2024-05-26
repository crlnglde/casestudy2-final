import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/bpmList.js';
import Landing from './pages/login.js'; 
import BpmList from './f-routes/bpmRoutes.js'
 
import Auth from './f-routes/auth.js'; 

import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
      
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />

          
          <Route path="/auth/*" element={<Auth />} />
          
          <Route path="/bpm/*" element={<BpmList/>} />
          
        </Routes>
        
      </div>
    </Router>
  );
};

export default App;
