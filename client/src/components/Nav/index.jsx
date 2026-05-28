import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../utils/auth';
import './style.css';

const Navbar = () => {
  const loggedIn = Auth.loggedIn();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">First Base</Link>
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        {loggedIn ? (
          <>
            <li><Link to="/user">My Network</Link></li>
            <li>
              <button className="nav-logout" onClick={() => Auth.logout()}>
                Sign Out
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
