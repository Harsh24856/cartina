import React from 'react'
import './outcome.css'
import { useLocation } from 'react-router-dom'

const Outcome = () => {
  const location = useLocation();
  const { formData, recommendations } = location.state || {};

  return (
    <div className='outcome'>
      <h1>Your Study Plan</h1>
      <div className="exam-details">
        <p><strong>Exam:</strong> {formData?.input.toUpperCase()}</p>
        <p><strong>Date:</strong> {formData?.date}</p>
        <p><strong>Study Hours per Day:</strong> {formData?.hours}</p>
        <p><strong>Class:</strong> {formData?.class}</p>
      </div>
      <div className="recommendations">
        <h2>Your Roadmap to Success</h2>
        <div className="recommendation-content">
          {recommendations ? (
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
              {recommendations}
            </pre>
          ) : (
            <p>No recommendations available. Please try again.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Outcome