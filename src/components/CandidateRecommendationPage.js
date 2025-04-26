import React, { useState } from 'react';

const CandidateCard = ({ candidate, onHire }) => {
  return (
    <div className="card candidate-card">
      <h3>{candidate.name}</h3>
      <p><strong>Recruiting Strategy:</strong></p>
      <p>{candidate.recruitingStrategy}</p>
      <button onClick={() => onHire(candidate)}>Hire!</button>
    </div>
  );
};

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

const CandidateRecommendationPage = ({ teamData, candidates, onHire }) => {
  const nextMemberNumber = teamData.members.length + 1;
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <div className="candidate-recommendation-page">
      <h1>Recommended Candidates</h1>
      
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
          {showDetails ? 'Hide Details' : 'Show More Details'}
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
      
      {teamData.members.length > 0 && (
        <div className="current-team">
          <h3>Current Team Members:</h3>
          {teamData.members.map((member, index) => (
            <div key={index} className="member-summary">
              <p><strong>Member {index + 1}:</strong> {member.name}</p>
            </div>
          ))}
        </div>
      )}
      
      <h3>Recommended for Member {nextMemberNumber}</h3>
      
      <div className="candidates-container">
        {candidates.map((candidate, index) => (
          <CandidateCard 
            key={index}
            candidate={candidate}
            onHire={onHire}
          />
        ))}
      </div>
    </div>
  );
};

export default CandidateRecommendationPage; 