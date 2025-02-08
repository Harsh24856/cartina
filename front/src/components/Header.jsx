import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Only render header if we're on the home page
  if (location.pathname !== '/') {
    return null;
  }

  return (
    <header>
      <div className="header-content">
        <div><h1>Cartina</h1></div>
        <div className='nav_bar'>
          <ul>
            <li><a href="#home" className='home_btn' onClick={() => scrollToSection('home')}>Home</a></li>
            <li><a href="#exam" className='exam_btn' onClick={() => scrollToSection('exam')}>Courses</a></li>
            <li><a href="#about-section" className='about_btn' onClick={() => scrollToSection('about')}>About</a></li> 
            <li><a href="#contact" className='contact_btn' onClick={() => scrollToSection('contact')}>Contact</a></li>
          </ul>
        </div>
        
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
      </div>
    </header>
  );
};

export default Header; 