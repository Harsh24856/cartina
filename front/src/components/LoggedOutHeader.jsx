import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const LoggedOutHeader = () => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Cartina
        </Link>
        
        <nav className="nav-links">
          <Link to="/about">About</Link>
          <Link to="/exam">Create Roadmap</Link>
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/signup" className="signup-btn">Sign Up</Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default LoggedOutHeader; 