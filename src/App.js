import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import TeamCreationPage from './components/TeamCreationPage';
import CandidateRecommendationPage from './components/CandidateRecommendationPage';
import MemberAddedPage from './components/MemberAddedPage';
import TeamCompletePage from './components/TeamCompletePage';
import candidatesData from './data/candidates.json';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [teamData, setTeamData] = useState({
    teamName: '',
    projectDescription: '',
    project_name: '',
    idea_name: '',
    description: '',
    goal: '',
    product_type: '',
    required_roles: [],
    hard_skills_experience: [],
    soft_skills: [],
    members: []
  });
  
  // Get a random selection of candidates from the JSON data
  const getCandidateRecommendations = () => {
    // Shuffle the candidates array and take the first 3
    const shuffled = [...candidatesData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const handleStartTeam = () => {
    setCurrentPage('teamCreation');
  };

  const handleCreateTeam = (projectData) => {
    setTeamData({
      ...teamData,
      teamName: projectData.project_name, // For backward compatibility
      projectDescription: projectData.description, // For backward compatibility
      ...projectData,
      members: []
    });
    setCurrentPage('candidateRecommendation');
  };

  const handleHireCandidate = (candidate) => {
    const updatedMembers = [...teamData.members, candidate];
    setTeamData({
      ...teamData,
      members: updatedMembers
    });
    
    if (updatedMembers.length >= 3) {
      setCurrentPage('teamComplete');
    } else {
      setCurrentPage('memberAdded');
    }
  };

  const handleRecommendNext = () => {
    setCurrentPage('candidateRecommendation');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onStart={handleStartTeam} />;
      case 'teamCreation':
        return <TeamCreationPage onCreateTeam={handleCreateTeam} />;
      case 'candidateRecommendation':
        return (
          <CandidateRecommendationPage 
            teamData={teamData}
            candidates={getCandidateRecommendations()}
            onHire={handleHireCandidate}
          />
        );
      case 'memberAdded':
        return (
          <MemberAddedPage 
            teamData={teamData}
            onRecommendNext={handleRecommendNext}
          />
        );
      case 'teamComplete':
        return <TeamCompletePage teamData={teamData} />;
      default:
        return <LandingPage onStart={handleStartTeam} />;
    }
  };

  return (
    <div className="container">
      {renderPage()}
    </div>
  );
}

export default App;
