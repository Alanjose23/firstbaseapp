import React, { Component } from 'react';
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import Nav from "./components/Nav"
import FindUser from './pages/UserandDate';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from "./pages/Home"
import Contact from "./components/Contact"
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
              <Route 
                path="/user" 
                element={<FindUser />} 
              />
            </Routes>
        <Contact/>
      </div>
      </Router>
      
    )
  
}
  
export default App;
