import React, { useState } from 'react'
import './outcome.css'
import { useLocation, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'

const Outcome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formData, recommendations, userProfile } = location.state || {};
  const [showModal, setShowModal] = useState(false);
  const [roadmapName, setRoadmapName] = useState('');
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

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  const handleSaveClick = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      localStorage.setItem('pendingRoadmap', JSON.stringify({
        formData,
        recommendations
      }));
      navigate('/login');
      return;
    }
    setShowModal(true);
    setTimeout(() => {
      scrollToSection('modal');
    }, 100);
  };

  const saveRoadmap = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!roadmapName.trim()) {
      alert('Please enter a name for your roadmap');
      return;
    }

    const newRoadmap = {
      id: Date.now().toString(),
      userId: currentUser.id,
      title: roadmapName,
      exam_name: formData?.input,
      exam_date: formData?.date,
      study_hours: formData?.hours,
      class_level: formData?.class,
      recommendations: recommendations,
      created_at: new Date().toISOString()
    };

    // Get existing roadmaps and add new one
    const roadmaps = JSON.parse(localStorage.getItem('roadmaps') || '[]');
    roadmaps.push(newRoadmap);
    localStorage.setItem('roadmaps', JSON.stringify(roadmaps));

    setShowModal(false);
    setRoadmapName('');
    alert('Roadmap saved successfully!');
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
        <div className="action-buttons">
          <div className="profile-image-container" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
            <img 
              src={userProfile?.avatar || '/default-avatar.png'} 
              alt="Profile" 
              className="profile-image"
              title="Go to Profile"
            />
          </div>
          <button className="save-roadmap-btn" onClick={handleSaveClick}>
            Save Roadmap
          </button>
        </div>

        {/* Save Roadmap Modal */}
        {showModal && (
          <div className="modal-overlay" id='modal'>
            <div className="modal-content">
              <h2>Save Roadmap</h2>
              <input
                type="text"
                placeholder="Enter roadmap name"
                value={roadmapName}
                onChange={(e) => setRoadmapName(e.target.value)}
                className="roadmap-name-input"
              />
              <div className="modal-buttons">
                <button onClick={saveRoadmap}>Save</button>
                <button onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Outcome