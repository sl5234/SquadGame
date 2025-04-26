// Configuration file for API keys and other sensitive data
// Replace the placeholders with your actual keys

const config = {
  // OpenAI API configuration
  openai: {
    apiKey: process.env.REACT_APP_OPENAI_API_KEY || "your-openai-api-key", 
    model: "gpt-4o", // or any other model you want to use
    temperature: 0.7
  }
};

export default config; 