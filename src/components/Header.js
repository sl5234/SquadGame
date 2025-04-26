import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import '../styles/Header.css';

const Header = () => {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="app-header">
      <div className="spacer"></div>
      
      <div className="theme-toggle-container">
        <label className="switch">
          <input 
            type="checkbox" 
            checked={darkMode}
            onChange={toggleTheme}
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          />
          <span className="slider"></span>
        </label>
      </div>
    </header>
  );
};

export default Header; 