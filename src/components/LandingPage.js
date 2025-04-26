import React from 'react';
import logo from '../data/web_logo.png';

const LandingPage = ({ onStart }) => {
  return (
    <div className="landing-page">
      <div className="landing-logo-container">
        <img src={logo} alt="squadgame Logo" className="landing-logo" />
      </div>
      <button onClick={onStart}>Build my squad</button>
    </div>
  );
};

export default LandingPage;