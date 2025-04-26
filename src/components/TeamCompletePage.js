import React from 'react';

const TeamCompletePage = ({ teamData }) => {
  return (
    <div className="team-complete-page">
      <h1>Congratulations! You have a dream team!</h1>
      
      <div className="team-info">
        <h2>{teamData.teamName}</h2>
        <p>{teamData.projectDescription}</p>
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