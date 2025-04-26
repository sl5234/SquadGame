import React, { useState } from 'react';

const TeamCreationPage = ({ onCreateTeam }) => {
  const [teamName, setTeamName] = useState('');
  const [ideaName, setIdeaName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [productType, setProductType] = useState('');
  const [requiredRoles, setRequiredRoles] = useState('');
  const [hardSkills, setHardSkills] = useState('');
  const [softSkills, setSoftSkills] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!teamName || !projectDescription) {
      setError('Please fill out at least Team Name and Project Description.');
      return;
    }
    
    // Parse comma-separated values into arrays
    const requiredRolesArray = requiredRoles.split(',').map(role => role.trim()).filter(Boolean);
    const hardSkillsArray = hardSkills.split(',').map(skill => skill.trim()).filter(Boolean);
    const softSkillsArray = softSkills.split(',').map(skill => skill.trim()).filter(Boolean);
    
    // Create the project data object
    const projectData = {
      project_name: teamName,
      idea_name: ideaName || teamName, // Use team name as fallback
      description: projectDescription,
      goal: goal,
      product_type: productType,
      required_roles: requiredRolesArray,
      hard_skills_experience: hardSkillsArray,
      soft_skills: softSkillsArray
    };
    
    onCreateTeam(projectData);
  };

  return (
    <div className="team-creation-page">
      <h1>Create your squad</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="teamName">Squad Name*</label>
          <input
            type="text"
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter your team or project name"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="projectDescription">Project Description*</label>
          <textarea
            id="projectDescription"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            placeholder="Describe your project in detail"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="goal">Project Goal</label>
          <input
            type="text"
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="What is your project goal? (e.g., 1st place in the hackathon)"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="productType">Product Type</label>
          <input
            type="text"
            id="productType"
            value={productType}
            onChange={(e) => setProductType(e.target.value)}
            placeholder="What type of product are you building? (e.g., Web application, Mobile app)"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="requiredRoles">Required Roles</label>
          <input
            type="text"
            id="requiredRoles"
            value={requiredRoles}
            onChange={(e) => setRequiredRoles(e.target.value)}
            placeholder="Enter roles separated by commas (e.g., PM, SWE, Data scientist)"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="hardSkills">Hard Skills & Experience</label>
          <textarea
            id="hardSkills"
            value={hardSkills}
            onChange={(e) => setHardSkills(e.target.value)}
            placeholder="Enter required hard skills separated by commas (e.g., JavaScript, Python, Data engineering)"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="softSkills">Soft Skills</label>
          <textarea
            id="softSkills"
            value={softSkills}
            onChange={(e) => setSoftSkills(e.target.value)}
            placeholder="Enter desired soft skills separated by commas (e.g., Communication, Team play)"
          />
        </div>
        
        <button type="submit">Recommend 1st member</button>
      </form>
    </div>
  );
};

export default TeamCreationPage; 