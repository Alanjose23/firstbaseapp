import React, { Component } from 'react';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import Nav from "./components/Nav"
import Home from './pages/UserandDate';
import Login from './pages/Login';
import Signup from './pages/Signup';
import './App.css';
  
function App () {
  
    return (
      <Router>
      <div>
        <Nav/>
        <Routes>
              <Route 
                path="/" 
                element={<Home />} 
              />
              <Route 
                path="/login" 
                element={<Login />} 
              />
              <Route 
                path="/signup" 
                element={<Signup />} 
              />
            </Routes>

      </div>
      </Router>
    )
  
}
  
export default App;
