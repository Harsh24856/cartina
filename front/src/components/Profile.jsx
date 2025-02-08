import React, { useState, useEffect } from 'react';
import './Profile.css';

function Profile() {
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [modifyTopics, setModifyTopics] = useState("");
  const [selectedProfileForModify, setSelectedProfileForModify] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch saved profiles when component mounts
  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await fetch('http://localhost:5000/get-profiles');
      const data = await response.json();
      if (data.success) {
        setSavedProfiles(data.profiles);
      } else {
        console.error('Failed to fetch profiles:', data.error);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleModifyRoadmap = async (profile) => {
    if (!modifyTopics.trim()) {
      alert("Please enter topics to modify the roadmap");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/modify-roadmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalRoadmap: profile.roadmap,
          newTopics: modifyTopics,
          technology: profile.technology
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update the roadmap in the profiles array
        const updatedProfiles = savedProfiles.map(p => 
          p.id === profile.id ? {...p, roadmap: data.modifiedRoadmap} : p
        );
        setSavedProfiles(updatedProfiles);
        setModifyTopics("");
        setSelectedProfileForModify(null);
        alert('Roadmap successfully modified!');
      } else {
        alert('Failed to modify roadmap: ' + data.error);
      }
    } catch (error) {
      console.error('Error modifying roadmap:', error);
      alert('Failed to modify roadmap. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>Your Saved Profiles</h2>
      <div className="saved-profiles">
        {savedProfiles.map((profile) => (
          <div key={profile.id} className="profile-card">
            <h3>{profile.technology}</h3>
            <div className="roadmap-content">
              {profile.roadmap}
            </div>
            
            {/* Modify Roadmap Button */}
            <button 
              className="modify-btn"
              onClick={() => setSelectedProfileForModify(profile)}
              disabled={isLoading}
            >
              {isLoading && selectedProfileForModify?.id === profile.id 
                ? 'Modifying...' 
                : 'Modify Roadmap'
              }
            </button>

            {/* Modification Form */}
            {selectedProfileForModify?.id === profile.id && (
              <div className="modify-form">
                <textarea
                  value={modifyTopics}
                  onChange={(e) => setModifyTopics(e.target.value)}
                  placeholder="Enter topics you missed or need to focus on more..."
                  rows={4}
                  disabled={isLoading}
                />
                <div className="button-group">
                  <button 
                    onClick={() => handleModifyRoadmap(profile)}
                    className="submit-modify-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Submitting...' : 'Submit Modification'}
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedProfileForModify(null);
                      setModifyTopics("");
                    }}
                    className="cancel-btn"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile; 