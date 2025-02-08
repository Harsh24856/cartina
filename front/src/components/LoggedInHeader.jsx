import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const LoggedInHeader = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('currentUser');
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
          <div className="user-section">
            <div 
              className="profile-preview" 
              onClick={() => navigate('/profile')}
              title="View Profile"
            >
              <img 
                src={currentUser?.avatar || '/default-avatar.png'} 
                alt="Profile" 
                className="header-avatar"
              />
              <span>{currentUser?.name || currentUser?.email}</span>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default LoggedInHeader; 