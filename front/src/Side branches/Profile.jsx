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
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [roadmapToDelete, setRoadmapToDelete] = useState(null);

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
      if (file.size > 5000000) { // 5MB limit
        setError('File size too large. Please choose an image under 5MB.');
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, or GIF).');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result);
        setError(''); // Clear any previous errors
      };
      reader.onerror = () => {
        setError('Error reading file. Please try again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpdate = async () => {
    try {
      setError('');
      if (!newAvatar) {
        setError('Please select an image first');
        return;
      }

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Update avatar in users array
      const updatedUsers = users.map(u => 
        u.id === currentUser.id ? { ...u, avatar: newAvatar } : u
      );
      localStorage.setItem('users', JSON.stringify(updatedUsers));

      // Update current user
      const updatedUser = { ...currentUser, avatar: newAvatar };
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      login(updatedUser); // Update auth context

      // Update userProfile state
      setUserProfile(updatedUser);

      // Reset state and close modal
      setShowAvatarModal(false);
      setNewAvatar(null);
      setError('');

      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = 'Profile picture updated successfully!';
      document.body.appendChild(successMessage);
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);

    } catch (error) {
      setError('An error occurred while updating the profile picture');
    }
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

  const handleDeleteClick = (roadmap) => {
    setRoadmapToDelete(roadmap);
    setShowDeleteConfirmation(true);
  };

  const handleDeleteConfirm = () => {
    try {
      // Get all roadmaps from localStorage
      const allRoadmaps = JSON.parse(localStorage.getItem('roadmaps') || '[]');
      
      // Filter out the roadmap to delete
      const updatedRoadmaps = allRoadmaps.filter(r => r.id !== roadmapToDelete.id);
      
      // Update localStorage
      localStorage.setItem('roadmaps', JSON.stringify(updatedRoadmaps));
      
      // Update state
      setRoadmaps(updatedRoadmaps.filter(roadmap => roadmap.userId === currentUser.id));
      
      // Remove progress data for this roadmap
      const progress = JSON.parse(localStorage.getItem(`progress_${currentUser.id}`) || '{}');
      delete progress[roadmapToDelete.id];
      localStorage.setItem(`progress_${currentUser.id}`, JSON.stringify(progress));
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.textContent = 'Roadmap deleted successfully!';
      document.body.appendChild(successMessage);
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
      
    } catch (error) {
      setError('An error occurred while deleting the roadmap');
    } finally {
      setShowDeleteConfirmation(false);
      setRoadmapToDelete(null);
    }
  };

  const renderRoadmapContent = (content) => {
    if (!content) return null;

    return (
      <div className="roadmap-content">
        {content.split('\n').map((line, index) => {
          // Skip empty lines
          if (!line.trim()) return null;

          // Clean the line from all prefixes and special characters
          let cleanedLine = line
            .replace(/^[-*]\s*/, '')         // Remove dash or asterisk prefix
            .replace(/^Day\s*\d+:?\s*/i, '') // Remove "Day X:" prefix
            .replace(/^\{.*?\}\s*/, '')      // Remove curly braces and their content
            .replace(/\[[\sx]\]\s*/, '')     // Remove checkbox brackets
            .replace(/^\s*-\s*/, '')         // Remove any remaining dashes
            .trim();

          // If line is empty after cleaning, skip it
          if (!cleanedLine) return null;

          // Skip section headers (ends with ':') and bold lines (starts with '*' or '**')
          if (cleanedLine.endsWith(':') || cleanedLine.startsWith('*')) {
            return (
              <h4 key={index} className="section-header">
                {cleanedLine}
              </h4>
            );
          }

          // For all other lines (including numerical ones), render with checkbox
          return (
            <div key={index} className="topic-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={roadmapProgress[selectedRoadmap?.id]?.[index] || false}
                  onChange={() => handleCheckboxChange(selectedRoadmap?.id, index)}
                />
                <span className="checkbox-custom"></span>
                <span className="topic-text">{cleanedLine}</span>
              </label>
            </div>
          );
        })}
      </div>
    );
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
              <div className="roadmap-actions">
                <button 
                  className="view-btn"
                  onClick={() => handleViewRoadmap(roadmap)}
                >
                  View Details
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteClick(roadmap)}
                >
                  Delete
                </button>
              </div>
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
            </div>

            <div className="avatar-selection-container">
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

            <div className="modal-buttons">
              <button 
                onClick={handleAvatarUpdate}
                className="save-btn"
                disabled={!newAvatar}
              >
                Save Changes
              </button>
              <button 
                onClick={() => {
                  setShowAvatarModal(false);
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
                          {renderRoadmapContent(section)}
                        </div>
                      );
                    } else {
                      // For other sections, display as regular text
                      return (
                        <div key={sectionIndex} className="text-section">
                          {renderRoadmapContent(section)}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <h2>Delete Roadmap</h2>
            <p>Are you sure you want to delete "{roadmapToDelete?.title}"? This action cannot be undone.</p>
            
            <div className="modal-buttons">
              <button 
                onClick={handleDeleteConfirm}
                className="delete-btn"
              >
                Delete
              </button>
              <button 
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setRoadmapToDelete(null);
                }}
                className="cancel-btn"
              >
                Cancel
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