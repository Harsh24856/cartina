import React, { useState } from 'react'
import './Start_page.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { GoogleGenerativeAI } from "@google/generative-ai";

const Start_page = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    input: '',
    date: new Date().toISOString().split('T')[0],
    hours: 9,
    class: ''
  })

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_GOOGLE_GENERATIVE_AI_API_KEY;
  
  // Add debugging
  console.log('API Key exists:', !!API_KEY);
  console.log('API Key length:', API_KEY ? API_KEY.length : 0);

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
    if (!formData.class) {
      newErrors.class = 'Class selection is required';
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

  const generateStudyRecommendations = async (examDetails) => {
    try {
      // Initialize the Google Generative AI
      const genAI = new GoogleGenerativeAI("AIzaSyAISL4uWO6fKjZcS1-Y8LVFj6oDPd0dNcc");
      
      // For text-only input, use the gemini-pro model
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const remainingDays = Math.ceil((new Date(examDetails.date) - new Date()) / (1000 * 60 * 60 * 24));

      const prompt = `Act as an expert academic advisor. Create a structured study plan for a student in ${examDetails.class} preparing for ${examDetails.input} exam in ${remainingDays} days with ${examDetails.hours} hours available per day.

Provide a detailed study plan with the following format:
0. [Introduction]
    - syllabus
1. [Main Focus Topics]
   - Subtopic 1
   - Subtopic 2
2.  [Advanced Topics]
   - Subtopic 1
   - Subtopic 2
3.  [Practice and Revision]
   - Mock Tests with  only clickable links
   - Weak Area Improvement
4. Final Week: [Exam Preparation Strategy]
   - Last-minute revision tips
   - Mental preparation techniques

6.divide it into section of days(like day1-17 and so on)
7.give a detailed plan for each day like monday to saturday
Ensure the plan is:
- Tailored to the specific exam
- Realistic given the study hours
- Includes a mix of learning, practice, and revision
- Provides clear, actionable daily/weekly goals in a detailed and log format also provide redirectable links (only add clickable links) always add links
do not provide table format
tranlste all the text into ${formData.language}
also give check list with checkboxes for the topics`;

      // Generate content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate study recommendations. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Generate study recommendations
      const recommendations = await generateStudyRecommendations(formData);
      
      // Log the data being sent to backend
      console.log('Sending data to backend:', formData);
      
      const response = await axios.post('http://localhost:3000/api/submit-exam', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Backend response:', response.data);
      navigate('/outcome', { 
        state: { 
          formData,
          recommendations 
        } 
      });
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.error || error.message || 'Failed to submit form. Please try again.'
      }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="start-page">
      <video autoPlay loop muted playsInline className='video-background'>
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      
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
          <div className='hours-display'>{formData.hours} hours</div>
          <input
            type="range"
            id="hours"
            name="hours"
            className='hours-range'
            value={formData.hours}
            onChange={(e)=>{
              setFormData({...formData, hours: e.target.value})
            }}
            min="2"
            max="18"
            step="1"
            style={{ width: '100%' }}
          />
          {errors.hours && <span className="error-message">{errors.hours}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="class">Class:</label>
          <select
            id="class"
            name="class"
            className='class-select'
            value={formData.class}
            onChange={handleInputChange}
          >
            <option value="">Select your class</option>
            <option value="11">11th Standard</option>
            <option value="12">12th Standard</option>
            <option value="Drop">Drop</option>
            <option value="University">University</option>
          </select>
          {errors.class && <span className="error-message">{errors.class}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="language">Language:</label>
          <select
            id="language"
            name="language"
            className='class-select'
            value={formData.language}
            onChange={handleInputChange}
          >
            <option value="">Select your language</option>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
            <option value="Marathi">Marathi</option>
            <option value="Gujrati">Gujrati</option>
            <option value="Kannada">Kannada</option>
            <option value="Telugu">Telugu</option>
            <option value="Tamil">Tamil</option>
            <option value="Kannada">Kannada</option>
            <option value="Punjabi">Punjabi</option>
            <option value="Urdu">Urdu</option>
            <option value="Bengali">Bengali</option>
            <option value="Odia">Odia</option>
            <option value="Assamese">Assamese</option>
            <option value="Nepali">Nepali</option>
            <option value="Other">Other</option>
            
            
          </select>
          {errors.class && <span className="error-message">{errors.class}</span>}
        </div>
        
       
        

        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
        {errors.submit && <span className="error-message submit-error">{errors.submit}</span>}
      </form>
    </div>
  )
}

export default Start_page;
