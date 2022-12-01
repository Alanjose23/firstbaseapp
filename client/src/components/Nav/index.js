import React from 'react';
import { Link } from "react-router-dom";
const navbar= () =>{
  return (
  <div>
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
      <Link to="/restaurants">userpage</Link>
    </li>
  </div>
  );
}
export default navbar;