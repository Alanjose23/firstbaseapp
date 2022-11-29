import React from 'react';
import {  Link } from "react-router-dom";
const navbar= () =>{
  return (
  <div>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/favorites">Favorites</Link>
    </li>
    <li>
      <Link to="/events">Fun</Link>
    </li>
    <li>
      <Link to="/restaurants">Dining</Link>
    </li>
    <li>
        <Link to="/login">Login</Link>
    </li>
  </div>
  );
}
export default navbar;