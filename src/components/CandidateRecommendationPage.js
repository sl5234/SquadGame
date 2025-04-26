import React from 'react';

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

const CandidateRecommendationPage = ({ teamData, candidates, onHire }) => {
  const nextMemberNumber = teamData.members.length + 1;
  
  return (
    <div className="candidate-recommendation-page">
      <h1>Recommended Candidates</h1>
      
      <div className="team-info">
        <h2>{teamData.teamName}</h2>
        <p>{teamData.projectDescription}</p>
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