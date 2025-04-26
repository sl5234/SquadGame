import config from '../config';
import candidatesData from '../data/candidates.json';

/**
 * Gets recommended team members based on project details and current team composition
 * @param {Object} projectData - The project data including skills, roles, etc.
 * @param {Array} currentMembers - Array of current team members (if any)
 * @returns {Promise<Array>} - Promise resolving to an array of recommended candidates
 */
export const getRecommendedMembers = async (projectData, currentMembers = []) => {
  try {
    // Show an alert when getting recommendations
    alert("AI is analyzing your project to find the perfect team members!");
    
    // If running in development mode and no API key is set, return mock data
    if (process.env.NODE_ENV === 'development' && config.openai.apiKey === 'your-openai-api-key') {
      console.log('Using mock data for OpenAI (API key not set)');
      return getMockRecommendations(projectData, currentMembers);
    }

    const requestBody = {
      model: config.openai.model,
      temperature: config.openai.temperature,
      messages: [
        {
          role: "system",
          content: "You are a specialized HR AI that helps recruit the perfect team members for a project. Generate creative, detailed, and realistic candidates with specific recruiting strategies based on the project requirements."
        },
        {
          role: "user",
          content: generatePrompt(projectData, currentMembers)
        }
      ]
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openai.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const candidatesData = JSON.parse(data.choices[0].message.content);
    
    return candidatesData.map(candidate => ({
      name: candidate.name,
      recruitingStrategy: candidate.recruiting_strategy
    }));
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    // Fallback to mock data if API call fails
    return getMockRecommendations(projectData, currentMembers);
  }
};

/**
 * Generate the prompt for OpenAI based on project data and current team
 */
const generatePrompt = (projectData, currentMembers) => {
  const memberDetails = currentMembers.length > 0 
    ? `\nCurrent team members: ${currentMembers.map(m => m.name).join(', ')}` 
    : '';

  return `Generate 3 creative candidate profiles for a project team based on the following project details:
  
Project Name: ${projectData.project_name || projectData.teamName}
${projectData.idea_name ? `Idea: ${projectData.idea_name}` : ''}
Description: ${projectData.description || projectData.projectDescription}
${projectData.goal ? `Goal: ${projectData.goal}` : ''}
${projectData.product_type ? `Product Type: ${projectData.product_type}` : ''}
${projectData.required_roles?.length > 0 ? `Required Roles: ${projectData.required_roles.join(', ')}` : ''}
${projectData.hard_skills_experience?.length > 0 ? `Hard Skills & Experience: ${projectData.hard_skills_experience.join(', ')}` : ''}
${projectData.soft_skills?.length > 0 ? `Soft Skills: ${projectData.soft_skills.join(', ')}` : ''}
${memberDetails}

For each candidate, provide:
1. A realistic full name
2. A detailed recruiting strategy explaining why they'd be perfect for this project (including skills, experience, background)

Format your response as a JSON array with the following structure:
[
  {
    "name": "Candidate Name",
    "recruiting_strategy": "Detailed recruiting strategy for this candidate..."
  },
  ...
]

Make each candidate unique with different backgrounds, skills, and attributes. The recruiting strategy should be 3-4 sentences.`;
};

/**
 * Provides mock recommendations when OpenAI is not available
 */
const getMockRecommendations = (projectData, currentMembers) => {
  // Filter out current members from the pool
  const currentMemberNames = currentMembers.map(member => member.name);
  const availableCandidates = candidatesData.filter(candidate => 
    !currentMemberNames.includes(candidate.name)
  );
  
  // Shuffle and take 3 random candidates
  const shuffled = [...availableCandidates].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

export default getRecommendedMembers; 