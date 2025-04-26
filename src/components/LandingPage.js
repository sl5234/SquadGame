import React from 'react';

const LandingPage = ({ onStart }) => {
  return (
    <div className="landing-page">
      <h1>Dream Team Builder</h1>
      <p>Create your perfect project team with our AI-powered recommendation system.</p>
      <button onClick={onStart}>Start my dream team</button>
    </div>
  );
};

export default LandingPage; 