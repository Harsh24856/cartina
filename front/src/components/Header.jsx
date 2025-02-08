import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Cartina
        </Link>
        
        <nav className="nav-links">
          <Link to="/about">About</Link>
          <Link to="/exam">Create Roadmap</Link>
          
          {currentUser ? (
            <div className="user-section">
              <div 
                className="profile-preview" 
                onClick={() => navigate('/profile')}
                title="View Profile"
              >
                <img 
                  src={currentUser.avatar || '/default-avatar.png'} 
                  alt="Profile" 
                  className="header-avatar"
                />
                <span>{currentUser.name || currentUser.email}</span>
              </div>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">Login</Link>
              <Link to="/signup" className="signup-btn">Sign Up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header; 