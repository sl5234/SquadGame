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
    
    // Log the OpenAI request details
    console.log('📤 Making OpenAI API request with hardcoded key');
    console.log('Model:', config.openai.model);
    
    // Log the full prompts
    console.log('\n📝 === SYSTEM PROMPT ===\n', systemPrompt);
    console.log('\n📝 === USER PROMPT ===\n', userPrompt);
    
    // Log candidate data details
    console.log('\n👥 === CANDIDATE DATA STATS ===');
    console.log('Total candidates in dataset:', candidatesData.length);
    console.log('Current team members:', currentMembers.map(m => m.name));
    
    const availableCandidateCount = candidatesData.filter(candidate => {
      if (candidate.id && currentMembers.some(member => member.id && member.id === candidate.id)) {
        return false;
      }
      return !currentMembers.some(member => member.name === candidate.name);
    }).length;
    
    console.log('Available candidates (not in team):', availableCandidateCount);
    
    // Standard logs - we'll keep these for compatibility
    console.log('System prompt length:', systemPrompt.length);
    console.log('User prompt length:', userPrompt.length);
    
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
      console.error('❌ OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Log the successful response
    console.log('📥 Received OpenAI API response:');
    console.log('Response status:', response.status);
    console.log('Model used:', data.model);
    console.log('Completion tokens:', data.usage?.completion_tokens);
    console.log('Prompt tokens:', data.usage?.prompt_tokens);
    console.log('Total tokens:', data.usage?.total_tokens);
    
    // Check if we have the expected data structure
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('❌ Unexpected API response structure:', data);
      console.log('🔄 Falling back to mock recommendations');
      return getMockRecommendations(projectData, currentMembers);
    }
    
    console.log('📄 Response content (full):', data.choices[0].message.content);
    
    try {
      // First try a direct parse
      console.log('🧠 Raw response content:', data.choices[0].message.content);
      
      // Use our safe extract function to handle different response formats
      const recommendedCandidates = safeExtractCandidates(data.choices[0].message.content);
      console.log('✅ Extracted candidates:', recommendedCandidates);
      
      return recommendedCandidates.map(candidate => ({
        name: candidate.name,
        recruitingStrategy: candidate.recruiting_strategy
      }));
    } catch (processError) {
      console.error('❌ Error processing candidates:', processError);
      console.log('🔄 Falling back to mock recommendations');
      return getMockRecommendations(projectData, currentMembers);
    }
  } catch (error) {
    console.error('❌ Error getting AI recommendations:', error);
    // Fallback to mock data if API call fails
    console.log('🔄 Falling back to mock recommendations');
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

  // Filter available candidates (those not already on the team)
  const filteredCandidates = availableCandidates.filter(candidate => {
    // If candidates have IDs, filter by ID
    if (candidate.id && currentMembers.some(member => member.id && member.id === candidate.id)) {
      return false;
    }
    // Otherwise filter by name
    return !currentMembers.some(member => member.name === candidate.name);
  });
  
  // Log detailed candidate information
  console.log('\n🧮 === CANDIDATES INCLUDED IN PROMPT ===');
  console.log('Available for selection:', filteredCandidates.length, 'candidates');
  filteredCandidates.forEach((candidate, index) => {
    console.log(`${index + 1}. ${candidate.name} (${candidate.id || 'No ID'})`);
  });
  
  // Format available candidates for the prompt
  const availableCandidatesList = filteredCandidates
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

VERY IMPORTANT: Your response must be ONLY a valid JSON array with the following structure. Do not include any text before or after the JSON:
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
  console.log('🔧 Using mock recommendations instead of OpenAI');
  
  // Filter out current members from the pool using IDs when available, fallback to names
  const availableCandidates = candidatesData.filter(candidate => {
    // If candidate has ID and there's a team member with matching ID, exclude
    if (candidate.id && currentMembers.some(member => member.id && member.id === candidate.id)) {
      return false;
    }
    // If no ID or no ID match, check by name
    return !currentMembers.some(member => member.name === candidate.name);
  });
  
  console.log('👥 Current team members:', currentMembers.map(m => m.name));
  console.log('🧩 Available candidates pool size:', availableCandidates.length);
  
  // Shuffle and take 3 random candidates
  const shuffled = [...availableCandidates].sort(() => 0.5 - Math.random());
  const recommendations = shuffled.slice(0, 3);
  
  console.log('👥 Selected mock candidates:', recommendations.map(c => c.name));
  
  return recommendations;
};

// Helper function to safely extract candidate data
const safeExtractCandidates = (responseData) => {
  // If we have a string response (from API)
  if (typeof responseData === 'string') {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(responseData);
      if (Array.isArray(parsed)) {
        // Ensure all candidates have IDs
        return parsed.map((candidate, index) => ({
          ...candidate,
          id: candidate.id || `ai-candidate-${Date.now()}-${index}`
        }));
      } else if (parsed && parsed.candidates && Array.isArray(parsed.candidates)) {
        // Ensure all candidates have IDs
        return parsed.candidates.map((candidate, index) => ({
          ...candidate,
          id: candidate.id || `ai-candidate-${Date.now()}-${index}`
        }));
      }
    } catch (e) {
      // If parsing fails, try to extract JSON array from text
      const jsonMatch = responseData.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const extracted = JSON.parse(jsonMatch[0]);
          if (Array.isArray(extracted)) {
            // Ensure all candidates have IDs
            return extracted.map((candidate, index) => ({
              ...candidate,
              id: candidate.id || `ai-candidate-${Date.now()}-${index}`
            }));
          }
        } catch (innerE) {
          // Extraction failed
        }
      }
    }
  } 
  // If we already have an array
  else if (Array.isArray(responseData)) {
    // Ensure all candidates have IDs
    return responseData.map((candidate, index) => ({
      ...candidate,
      id: candidate.id || `ai-candidate-${Date.now()}-${index}`
    }));
  }
  // If we have an object with a candidates array
  else if (responseData && responseData.candidates && Array.isArray(responseData.candidates)) {
    // Ensure all candidates have IDs
    return responseData.candidates.map((candidate, index) => ({
      ...candidate,
      id: candidate.id || `ai-candidate-${Date.now()}-${index}`
    }));
  }
  
  // If all extraction attempts fail, create mock data
  console.warn('⚠️ Could not extract valid candidates, creating fallback data');
  return [
    { 
      id: "fallback-1",
      name: "Alex Johnson",
      recruiting_strategy: "This candidate would be an excellent fit based on their project requirements."
    },
    {
      id: "fallback-2",
      name: "Jordan Lee",
      recruiting_strategy: "Their background in full-stack development aligns with the project goals."
    },
    {
      id: "fallback-3",
      name: "Taylor Williams",
      recruiting_strategy: "Their UX/UI skills would complement the existing team well."
    }
  ];
};

export default getRecommendedMembers; 