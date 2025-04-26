import React from 'react';

const MemberAddedPage = ({ teamData, onRecommendNext }) => {
  const lastAddedMember = teamData.members[teamData.members.length - 1];
  const nextMemberNumber = teamData.members.length + 1;
  
  return (
    <div className="member-added-page">
      <h1>{lastAddedMember.name} is now on your team!</h1>
      
      <div className="team-info">
        <h2>{teamData.teamName}</h2>
        <p>{teamData.projectDescription}</p>
      </div>
      
      <div className="current-team">
        <h3>Current Team Members:</h3>
        {teamData.members.map((member, index) => (
          <div key={index} className="card member-card">
            <h3>Member {index + 1}: {member.name}</h3>
            <p>{member.recruitingStrategy}</p>
          </div>
        ))}
      </div>
      
      <button onClick={onRecommendNext}>
        Recommend {nextMemberNumber}{nextMemberNumber === 2 ? 'nd' : 'rd'} member
      </button>
    </div>
  );
};

export default MemberAddedPage; 