import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import TeamCreationPage from './components/TeamCreationPage';
import CandidateRecommendationPage from './components/CandidateRecommendationPage';
import MemberAddedPage from './components/MemberAddedPage';
import TeamCompletePage from './components/TeamCompletePage';
import getRecommendedMembers from './services/aiService';

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
  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Get AI-recommended candidates
  const getCandidateRecommendations = async () => {
    setIsLoading(true);
    try {
      const recommendations = await getRecommendedMembers(teamData, teamData.members);
      setCandidates(recommendations);
      return recommendations;
    } catch (error) {
      console.error("Error getting recommendations:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch candidates when the recommendation page loads
  useEffect(() => {
    if (currentPage === 'candidateRecommendation') {
      getCandidateRecommendations();
    }
  }, [currentPage, teamData]);

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
            candidates={candidates}
            onHire={handleHireCandidate}
            isLoading={isLoading}
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
