import React from 'react';
import { Link } from "react-router-dom";
import "./style.css"
const navbar= () =>{
  return (
  <div>
    <ul>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <Link to="/login">Login</Link>
    </li>
    <li>
      <Link to="/signup">SignUp</Link>
    </li>
    <li>
      <Link to="/user">userpage</Link>
    </li>
    </ul>
  </div>
  );
}
export default navbar;