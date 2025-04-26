import config from '../config';
import candidatesData from '../data/candidates.json';
import getMemberRecommendationPrompt from '../prompt/getMemberRecommendationPrompt';

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

    // Get system prompt from our prompt file
    const systemPrompt = getMemberRecommendationPrompt();
    
    // Get user prompt with project details and candidates data
    const userPrompt = generatePrompt(projectData, currentMembers, candidatesData);

    const requestBody = {
      model: config.openai.model,
      temperature: config.openai.temperature,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
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
 * Generate the prompt for OpenAI based on project data, current team, and all available candidates
 * @param {Object} projectData - The project details
 * @param {Array} currentMembers - Current team members
 * @param {Array} availableCandidates - All available candidates from candidates.json
 * @returns {String} - The formatted prompt
 */
const generatePrompt = (projectData, currentMembers, availableCandidates) => {
  // Create current team members description
  const memberDetails = currentMembers.length > 0 
    ? `\nCurrent team members:\n${currentMembers.map((m, i) => 
        `Member ${i+1}: ${m.name}\n${m.recruitingStrategy ? `Background: ${m.recruitingStrategy}` : ''}`
      ).join('\n\n')}` 
    : '\nCurrent team members: None';

  // Format available candidates for the prompt
  const availableCandidatesList = availableCandidates
    .filter(candidate => !currentMembers.some(member => member.name === candidate.name))
    .map((candidate, index) => 
      `Candidate ${index+1}: ${candidate.name}
Background: ${candidate.recruitingStrategy}`
    ).join('\n\n');

  return `I need help recruiting team members for the following project:
  
PROJECT DETAILS
==============
Project Name: ${projectData.project_name || projectData.teamName}
${projectData.idea_name ? `Idea: ${projectData.idea_name}` : ''}
Description: ${projectData.description || projectData.projectDescription}
${projectData.goal ? `Goal: ${projectData.goal}` : ''}
${projectData.product_type ? `Product Type: ${projectData.product_type}` : ''}
${projectData.required_roles?.length > 0 ? `Required Roles: ${projectData.required_roles.join(', ')}` : ''}
${projectData.hard_skills_experience?.length > 0 ? `Hard Skills & Experience: ${projectData.hard_skills_experience.join(', ')}` : ''}
${projectData.soft_skills?.length > 0 ? `Soft Skills: ${projectData.soft_skills.join(', ')}` : ''}

TEAM COMPOSITION
==============
${memberDetails}

AVAILABLE CANDIDATES
==============
${availableCandidatesList}

INSTRUCTIONS
==============
Based on the project details, current team composition, and available candidates, recommend 3 candidates from the "AVAILABLE CANDIDATES" section that would be the best fit for this project.

For each recommended candidate, provide:
1. Their full name (exactly as listed in AVAILABLE CANDIDATES)
2. A detailed recruiting strategy explaining why they'd be perfect for this project (including how their skills match project requirements and complement the current team)

Format your response as a JSON array with the following structure:
[
  {
    "name": "Candidate Name",
    "recruiting_strategy": "Detailed recruiting strategy for this candidate..."
  },
  ...
]

The recruiting strategy should be 3-4 sentences and should focus on why they are specifically a good fit for THIS project and team.`;
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