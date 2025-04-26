import React, { useState } from 'react';

const TeamCreationPage = ({ onCreateTeam }) => {
  const [teamName, setTeamName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!teamName || !projectDescription) {
      setError('Please fill out all fields.');
      return;
    }
    
    onCreateTeam(teamName, projectDescription);
  };

  return (
    <div className="team-creation-page">
      <h1>Create Your Dream Team</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="teamName">Team Name</label>
          <input
            type="text"
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter your team name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="projectDescription">Project Description</label>
          <textarea
            id="projectDescription"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Describe your project and goals"
          />
        </div>
        
        <button type="submit">Recommend 1st member</button>
      </form>
    </div>
  );
};

export default TeamCreationPage; 