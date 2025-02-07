import React, { useState } from 'react'
import './Start_page.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Start_page = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    input: '',
    date: '',
    hours: 2
  })

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.input.trim()) {
      newErrors.input = 'Exam name is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      if (selectedDate < today) {
        newErrors.date = 'Please select a future date';
      }
    }
    if (!formData.hours) {
      newErrors.hours = 'Study hours are required';
    } else if (formData.hours < 2) {
      newErrors.hours = 'Minimum 2 hours required';
    } else if (formData.hours > 18) {
      newErrors.hours = 'Maximum 18 hours allowed';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleHoursChange = (e) => {
    const value = parseInt(e.target.value);
    if (isNaN(value)) {
      setFormData(prev => ({ ...prev, hours: 2 }));
    } else {
      setFormData(prev => ({ ...prev, hours: Math.min(Math.max(value, 2), 18) }));
    }
    // Clear error when user changes hours
    if (errors.hours) {
      setErrors(prev => ({
        ...prev,
        hours: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/submit-exam', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response.data);
      navigate('/outcome', { state: { formData } });
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Failed to submit form. Please try again.'
      }));
    }
  }

  return (
    <div className="start-page">
      <video autoPlay loop muted playsInline className='video-background'>
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className='ball'></div>
      
      <form className='form' onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="input">Exam Name:</label>
          <input
            type="text"
            id="input"
            name="input"
            value={formData.input}
            onChange={handleInputChange}
            placeholder="JEE(main), NEET, etc."
          />
          {errors.input && <span className="error-message">{errors.input}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date Of Exam:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="hours">Study Hours/Day:</label>
          <input
            type="number"
            id="hours"
            name="hours"
            value={formData.hours}
            onChange={handleHoursChange}
            min="2"
            max="18"
            placeholder='2-18 hours'
          />
          {errors.hours && <span className="error-message">{errors.hours}</span>}
        </div>

        <button type="submit">Submit</button>
        {errors.submit && <span className="error-message submit-error">{errors.submit}</span>}
      </form>
    </div>
  )
}

export default Start_page;
