import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: null
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageError, setImageError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError('');

    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.match('image.*')) {
        setImageError('Please select an image file');
        return;
      }

      const reader = new FileReader();
      
      reader.onloadend = () => {
        // Create an image element to check dimensions
        const img = new Image();
        img.onload = () => {
          // Resize image if it's too large
          const maxWidth = 800;
          const maxHeight = 800;
          
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Calculate new dimensions
            if (width > height) {
              height = Math.round(height * maxWidth / width);
              width = maxWidth;
            } else {
              width = Math.round(width * maxHeight / height);
              height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;

            // Draw resized image
            ctx.drawImage(img, 0, 0, width, height);

            // Convert to base64
            const resizedImage = canvas.toDataURL(file.type);
            setPreviewUrl(resizedImage);
            setFormData(prev => ({ ...prev, avatar: resizedImage }));
          } else {
            setPreviewUrl(reader.result);
            setFormData(prev => ({ ...prev, avatar: reader.result }));
          }
        };
        img.src = reader.result;
      };

      reader.onerror = () => {
        setImageError('Error reading file');
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Get existing users
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.some(user => user.email === formData.email)) {
      setError('Email already registered');
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      avatar: formData.avatar,
      bio: '',
      joinDate: new Date().toISOString()
    };

    // Add to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Log in the new user
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    login(newUser);
    navigate('/');
  };

  return (
    <div className='container4'>
      <div className="auth-container2">
        <h2>Create Account</h2>
        {error && <div className="error-message">{error}</div>}
        <form className='form' onSubmit={handleSubmit}>
          <div className="avatar-upload">
            <div className="avatar-preview-container">
              <img 
                src={previewUrl || '/default-avatar.png'} 
                alt="Profile Preview" 
                className="avatar-preview"
              />
              {imageError && <div className="error-message">{imageError}</div>}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="avatar-input"
              className="avatar-input"
            />
            <label htmlFor="avatar-input" className="avatar-label">
              Choose Profile Picture
            </label>
            <div className="image-requirements">
              Recommended: Square image, max 5MB
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
            />
          </div>

          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup; 