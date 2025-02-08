import React from 'react'
import './outcome.css'
import { useLocation } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

const Outcome = () => {
  const location = useLocation();
  const { formData, recommendations } = location.state || {};
  const remainingDays = Math.ceil((new Date(formData?.date) - new Date()) / (1000 * 60 * 60 * 24));
  console.log(recommendations)

  // Custom checkbox component
  const CustomCheckbox = ({ checked }) => (
    <span className="custom-checkbox">
      {checked ? '[x]' : '[ ]'}
    </span>
  );

  // New component to render markdown with custom checkboxes
  const CustomMarkdownComponents = {
    input: ({ node, ...props }) => {
      if (node.properties.type === 'checkbox') {
        return <CustomCheckbox checked={props.checked} />;
      }
      return <input {...props} />;
    }
  };

  return (
    <div className='outcome-page-wrapper'>
      <div className='outcome-container'>
        <div className="outcome-header">
          <h1>Your Personalized Study Plan</h1>
        </div>
        
        <div className="outcome-details">
          <div className="exam-info">
            <h2>Exam Details</h2>
            <div className="flow-node">
              <strong>Exam</strong>
              <p>{formData?.input.toUpperCase()|| 'Not specified'}</p>
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
            <div className="flow-node">
              <strong>Remaining days</strong>
              <p>{remainingDays || 'Not specified'}</p>
            </div>
          </div>
          
          <div className="recommendations">
            <h2>Your Roadmap to Success</h2>
            <div className="recommendation-content">
              {recommendations ? (
                <ReactMarkdown 
                  className="markdown-content"
                  components={CustomMarkdownComponents}
                >
                  {recommendations}
                </ReactMarkdown>
              ) : (
                <p className="no-recommendations">
                  No recommendations available. Please try again.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Outcome