import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { currentUser, login } = useAuth();
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    bio: '',
    joinDate: '',
    avatar: null
  });

  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [password, setPassword] = useState('');
  const [newAvatar, setNewAvatar] = useState(null);
  const [error, setError] = useState('');
  const [roadmapProgress, setRoadmapProgress] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setUserProfile(currentUser);
      const allRoadmaps = JSON.parse(localStorage.getItem('roadmaps') || '[]');
      const userRoadmaps = allRoadmaps.filter(roadmap => roadmap.userId === currentUser.id);
      setRoadmaps(userRoadmaps);
      
      // Load saved progress
      const savedProgress = JSON.parse(localStorage.getItem(`progress_${currentUser.id}`) || '{}');
      setRoadmapProgress(savedProgress);
    }
  }, [currentUser]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpdate = () => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === currentUser.id);

    if (!user || user.password !== password) {
      setError('Invalid password');
      return;
    }

    // Update avatar in users array
    const updatedUsers = users.map(u => 
      u.id === currentUser.id ? { ...u, avatar: newAvatar } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Update current user
    const updatedUser = { ...currentUser, avatar: newAvatar };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    login(updatedUser); // Update auth context

    // Reset state
    setShowAvatarModal(false);
    setPassword('');
    setNewAvatar(null);
    setError('');
  };

  const handleViewRoadmap = (roadmap) => {
    setSelectedRoadmap(roadmap);
    setShowRoadmapModal(true);
  };

  const handleCheckboxChange = (roadmapId, lineIndex) => {
    setRoadmapProgress(prev => ({
      ...prev,
      [roadmapId]: {
        ...prev[roadmapId],
        [lineIndex]: !prev[roadmapId]?.[lineIndex]
      }
    }));
  };

  const saveProgress = async () => {
    setIsSaving(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    localStorage.setItem(`progress_${currentUser.id}`, JSON.stringify(roadmapProgress));
    
    setIsSaving(false);
    setShowSaveMessage(true);
    
    // Hide the message after 3 seconds
    setTimeout(() => {
      setShowSaveMessage(false);
    }, 3000);
  };

  const calculateProgress = (roadmapId) => {
    if (!roadmapProgress[roadmapId]) return 0;

    let totalItems = 0;
    let completedItems = 0;

    // Get all sections from the recommendations
    const sections = selectedRoadmap.recommendations.split('\n\n');

    sections.forEach(section => {
      const lines = section.split('\n').filter(line => line.trim());
      
      // Count only checkbox items
      lines.forEach((line, lineIndex) => {
        if (line.includes('- [')) {
          totalItems++;
          if (roadmapProgress[roadmapId]?.[lineIndex]) {
            completedItems++;
          }
        }
      });
    });

    return totalItems ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  const getRoadmapProgress = (roadmap) => {
    if (!roadmapProgress[roadmap.id]) return 0;

    let totalItems = 0;
    let completedItems = 0;

    const sections = roadmap.recommendations.split('\n\n');

    sections.forEach(section => {
      const lines = section.split('\n').filter(line => line.trim());
      
      lines.forEach((line, lineIndex) => {
        if (line.includes('- [')) {
          totalItems++;
          if (roadmapProgress[roadmap.id]?.[lineIndex]) {
            completedItems++;
          }
        }
      });
    });

    return totalItems ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar-container">
          <img 
            src={userProfile.avatar || '/default-avatar.png'} 
            alt="Profile" 
            className="profile-avatar"
          />
          <button 
            className="change-avatar-btn"
            onClick={() => setShowAvatarModal(true)}
          >
            Change Photo
          </button>
        </div>
        <h1>{userProfile.name || 'Anonymous'}</h1>
      </div>
      
      <div className="profile-info">
        <div className="info-section">
          <h2>About Me</h2>
          <p>{userProfile.bio || 'No bio yet'}</p>
        </div>
        
        <div className="info-section">
          <h2>Contact Information</h2>
          <p>Email: {userProfile.email}</p>
        </div>
        
        <div className="info-section">
          <h2>Account Details</h2>
          <p>Member since: {new Date(userProfile.joinDate).toLocaleDateString()}</p>
        </div>

        <div className="info-section">
          <h2>My Roadmaps</h2>
          {roadmaps.map(roadmap => (
            <div key={roadmap.id} className="roadmap-item">
              <div className="roadmap-header">
                <h3>{roadmap.title}</h3>
                <div className="roadmap-progress">
                  <div className="progress-bar mini">
                    <div 
                      className="progress-fill"
                      style={{ width: `${getRoadmapProgress(roadmap)}%` }}
                    />
                    <span className="progress-text">
                      {getRoadmapProgress(roadmap)}%
                    </span>
                  </div>
                </div>
              </div>
              <p>Exam: {roadmap.exam_name}</p>
              <p>Created: {new Date(roadmap.created_at).toLocaleDateString()}</p>
              <button onClick={() => handleViewRoadmap(roadmap)}>View Details</button>
            </div>
          ))}
        </div>
      </div>

      {/* Avatar Change Modal */}
      {showAvatarModal && (
        <div className="modal-overlay">
          <div className="modal-content avatar-modal">
            <h2>Change Profile Picture</h2>
            {error && <div className="error-message">{error}</div>}
            
            <div className="avatar-preview-container">
              <img 
                src={newAvatar || userProfile.avatar || '/default-avatar.png'} 
                alt="Preview" 
                className="avatar-preview"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="avatar-input"
                className="avatar-input"
              />
              <label htmlFor="avatar-input" className="avatar-input-label">
                Choose New Photo
              </label>
            </div>

            <div className="password-confirm">
              <input
                type="password"
                placeholder="Confirm your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
              />
            </div>

            <div className="modal-buttons">
              <button 
                onClick={handleAvatarUpdate}
                className="save-btn"
                disabled={!newAvatar || !password}
              >
                Save Changes
              </button>
              <button 
                onClick={() => {
                  setShowAvatarModal(false);
                  setPassword('');
                  setNewAvatar(null);
                  setError('');
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Roadmap Modal */}
      {showRoadmapModal && selectedRoadmap && (
        <div className="modal-overlay">
          <div className="modal-content roadmap-modal">
            <h2>{selectedRoadmap.title}</h2>
            <div className="roadmap-details">
              <div className="detail-group">
                <h3>Exam Details</h3>
                <p><strong>Exam:</strong> {selectedRoadmap.exam_name}</p>
                <p><strong>Date:</strong> {selectedRoadmap.exam_date}</p>
                <p><strong>Study Hours:</strong> {selectedRoadmap.study_hours}</p>
                <p><strong>Class Level:</strong> {selectedRoadmap.class_level}</p>
              </div>
              
              <div className="detail-group">
                <h3>Study Plan Progress</h3>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${calculateProgress(selectedRoadmap.id)}%` }}
                  />
                  <span className="progress-text">
                    {calculateProgress(selectedRoadmap.id)}% Complete
                  </span>
                </div>

                <div className="study-plan">
                  {selectedRoadmap.recommendations.split('\n\n').map((section, sectionIndex) => {
                    if (!section.trim()) return null;
                    const lines = section.split('\n').filter(line => line.trim());
                    
                    // Check if this section is a subject list (contains ":")
                    const isSectionWithCheckboxes = lines.some(line => 
                      line.includes(':') || lines[0].includes('Checklist')
                    );
                    
                    if (isSectionWithCheckboxes) {
                      return (
                        <div key={sectionIndex} className="subjects-section">
                          {lines.map((line, lineIndex) => {
                            if (line.includes(':') || line.includes('Checklist')) {
                              // This is a section header
                              return <h4 key={lineIndex}>{line.replace(':', '')}</h4>;
                            } else if (line.includes('- [')) {
                              // This is a checkbox item
                              const itemText = line.replace(/- \[[x\s]?\]/i, '').trim();
                              return (
                                <div key={lineIndex} className="task-item">
                                  <label className="checkbox-label">
                                    <input
                                      type="checkbox"
                                      checked={roadmapProgress[selectedRoadmap.id]?.[lineIndex] || false}
                                      onChange={() => handleCheckboxChange(selectedRoadmap.id, lineIndex)}
                                    />
                                    <span className="checkbox-custom"></span>
                                    <span className="task-text">{itemText}</span>
                                  </label>
                                </div>
                              );
                            }
                            return <p key={lineIndex} className="day-description">{line}</p>;
                          })}
                        </div>
                      );
                    } else {
                      // For other sections, display as regular text
                      return (
                        <div key={sectionIndex} className="text-section">
                          {lines.map((line, i) => (
                            <p key={i} className="day-description">{line}</p>
                          ))}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                onClick={saveProgress} 
                className={`save-progress-btn ${isSaving ? 'loading' : ''}`}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="loading-spinner"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  'Save Progress'
                )}
              </button>
              <button onClick={() => setShowRoadmapModal(false)} className="close-modal">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Feedback Message */}
      <div className={`save-feedback ${showSaveMessage ? 'show' : ''}`}>
        ✓ Progress saved successfully!
      </div>
    </div>
  );
};

export default Profile; 