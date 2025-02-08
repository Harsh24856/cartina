import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Get users from local storage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === formData.email && u.password === formData.password);
    
    if (user) {
      // Store current user in local storage
      localStorage.setItem('currentUser', JSON.stringify(user));
      login(user);
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if user already exists
    if (users.some(user => user.email === formData.email)) {
      alert('Email already registered');
      return;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      email: formData.email,
      password: formData.password,
      name: '',
      bio: '',
      joinDate: new Date().toISOString(),
      avatar: null
    };
    
    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Log in the new user
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    login(newUser);
    navigate('/');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className='container4'>
      <div className="auth-container2">
        <h2>Login to Cartina</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login; 