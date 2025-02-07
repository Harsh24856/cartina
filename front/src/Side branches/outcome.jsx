import React from 'react'
import './outcome.css'
import { useLocation } from 'react-router-dom'

const Outcome = () => {
  const location = useLocation();
  const { formData, recommendations } = location.state || {};

  return (
    <div className='outcome-container'>
      <div className="outcome-header">
        <h1>Your Personalized Study Plan</h1>
      </div>
      
      <div className="outcome-details">
        <div className="exam-info">
          <h2>Exam Details</h2>
          <div className="flow-node">
            <strong>Exam</strong>
            <p>{formData?.input || 'Not specified'}</p>
          </div>
          <div className="flow-node">
            <strong>Exam Date</strong>
            <p>{formData?.date || 'Not specified'}</p>
          </div>
          <div className="flow-node">
            <strong>Study Hours per Day</strong>
            <p>{formData?.hours || 'Not specified'}</p>
          </div>
          <div className="flow-node">
            <strong>Class</strong>
            <p>{formData?.class || 'Not specified'}</p>
          </div>
        </div>
        
        <div className="recommendations">
          <h2>Your Roadmap to Success</h2>
          <div className="recommendation-content">
            {recommendations ? (
              <pre style={{ 
                whiteSpace: 'pre-wrap', 
                fontFamily: 'inherit', 
                lineHeight: '1.6', 
                color: '#333' 
              }}>
                {recommendations}
              </pre>
            ) : (
              <p className="no-recommendations">
                No recommendations available. Please try again.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Outcome