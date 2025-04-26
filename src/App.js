import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import TeamCreationPage from './components/TeamCreationPage';
import CandidateRecommendationPage from './components/CandidateRecommendationPage';
import MemberAddedPage from './components/MemberAddedPage';
import TeamCompletePage from './components/TeamCompletePage';
import getRecommendedMembers from './services/aiService';
import EnvTest from './EnvTest'; // Import the test component

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
  
  // Log environment variables on app start
  useEffect(() => {
    console.log('App started - Environment Variable Check:');
    console.log('REACT_APP_OPENAI_API_KEY exists:', !!process.env.REACT_APP_OPENAI_API_KEY);
    
    // If using webpack 5, this might explain why it's not working
    if (process.env.NODE_ENV === 'development') {
      console.log('Running in development mode. If using webpack 5, ensure dotenv is properly configured.');
    }
  }, []);

  // Get AI-recommended candidates
  const getCandidateRecommendations = async () => {
    console.log('🔍 Getting candidate recommendations for:', teamData.project_name || 'project');
    setIsLoading(true);
    try {
      console.log('⏳ Starting recommendation request...');
      const recommendations = await getRecommendedMembers(teamData, teamData.members);
      console.log('✅ Received recommendations:', recommendations.length);
      
      // Log recommended candidates in detail
      console.log('🔍 === RECOMMENDED CANDIDATES ===');
      recommendations.forEach((candidate, index) => {
        console.log(`Candidate ${index + 1}: ${candidate.name}`);
        console.log(`  - ID: ${candidate.id || 'No ID'}`);
        console.log(`  - Strategy: ${candidate.recruitingStrategy.substring(0, 50)}...`);
      });
      
      setCandidates(recommendations);
      return recommendations;
    } catch (error) {
      console.error("❌ Error getting recommendations:", error);
      return [];
    } finally {
      setIsLoading(false);
      console.log('🏁 Recommendation process completed');
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
    console.log('👍 Hiring candidate:', candidate.name, candidate.id || 'No ID');
    
    const updatedMembers = [...teamData.members, candidate];
    setTeamData({
      ...teamData,
      members: updatedMembers
    });
    
    console.log('👥 Updated team:', updatedMembers.map(m => m.name));
    
    if (updatedMembers.length >= 3) {
      console.log('🎉 Team complete with', updatedMembers.length, 'members!');
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
      {/* Environment Variable Test - Remove after debugging */}
      <EnvTest />
      {renderPage()}
    </div>
  );
}

export default App;
