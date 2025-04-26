import React, { useState } from 'react';

// Helper component to display arrays like skills and roles
const ListDisplay = ({ items, title }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <div className="list-display">
      <strong>{title}: </strong>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const TeamCompletePage = ({ teamData }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="team-complete-page">
      <h1>Congratulations! You have a dream team!</h1>
      
      <div className="team-info">
        <h2>{teamData.project_name || teamData.teamName}</h2>
        {teamData.idea_name && teamData.idea_name !== teamData.project_name && (
          <h3>Idea: {teamData.idea_name}</h3>
        )}
        
        <p>{teamData.description || teamData.projectDescription}</p>
        
        <button 
          onClick={() => setShowDetails(!showDetails)} 
          className="detail-toggle"
        >
          {showDetails ? 'Hide Project Details' : 'Show Project Details'}
        </button>
        
        {showDetails && (
          <div className="project-details">
            {teamData.goal && (
              <p><strong>Goal:</strong> {teamData.goal}</p>
            )}
            
            {teamData.product_type && (
              <p><strong>Product Type:</strong> {teamData.product_type}</p>
            )}
            
            <ListDisplay 
              items={teamData.required_roles} 
              title="Required Roles" 
            />
            
            <ListDisplay 
              items={teamData.hard_skills_experience} 
              title="Hard Skills & Experience" 
            />
            
            <ListDisplay 
              items={teamData.soft_skills} 
              title="Soft Skills" 
            />
          </div>
        )}
      </div>
      
      <div className="final-team">
        <h3>Your Dream Team:</h3>
        {teamData.members.map((member, index) => (
          <div key={index} className="card member-card">
            <h3>Member {index + 1}: {member.name}</h3>
            <p>{member.recruitingStrategy}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamCompletePage; 