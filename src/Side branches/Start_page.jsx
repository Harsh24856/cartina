import React, { useState, useRef, useEffect } from 'react'
import './Start_page.css'
import axios from 'axios'

const Start_page = () => {
  
  const [formData, setFormData] = useState({
    input: '',
    date: ''
  })

  

  const handleSubmit = async (e) => {
    e.preventDefault() 
    try {
      
      const response = await axios.post('http://localhost:5000/api/submit-exam', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log(response.data)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <div className="start-page">
      <video autoPlay loop muted playsInline className='video-background'>
        <source src="/video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className='ball'></div>
      
      <form className='form' >
        <div className="form-group">
          <label htmlFor="input">Exam Name:</label>
          <input
            type="text"
            id="input"
            name="input"
            value={formData.input}
            onChange={(e) => setFormData({...formData, input: e.target.value.trim()})}
            placeholder="JEE(main), NEET, etc."
          />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date Of Exam:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={(e) => setFormData({...formData, date: e.target.value})}
          />
        </div>

        <button type="submit" onClick={handleSubmit}>Submit</button>
      </form>
    </div>
  )
}

export default Start_page;
