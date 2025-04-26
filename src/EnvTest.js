import React, { useEffect } from 'react';

const EnvTest = () => {
  useEffect(() => {
    console.log('===== Environment Variable Test =====');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('All REACT_APP_ environment variables:');
    
    // Log all environment variables that start with REACT_APP_
    Object.keys(process.env)
      .filter(key => key.startsWith('REACT_APP_'))
      .forEach(key => {
        console.log(`${key}: ${process.env[key] ? 'exists (value hidden)' : 'undefined'}`);
      });
    
    console.log('REACT_APP_OPENAI_API_KEY exists:', !!process.env.REACT_APP_OPENAI_API_KEY);
    console.log('======================================');
  }, []);

  return (
    <div>
      <h2>Environment Variable Test</h2>
      <p>Check the console for environment variable information.</p>
    </div>
  );
};

export default EnvTest; 