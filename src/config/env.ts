import Config from 'react-native-config';
// Environment configuration
// In a production app, you would use react-native-config or similar for secure env variables

export const ENV_CONFIG = {
  // Replace with your actual OpenAI API key
  // For production, use react-native-config or secure storage
  OPENAI_API_KEY: Config.OPENAI_API_KEY,
  


  
  // You can also set this via environment variables if using react-native-config
  // OPENAI_API_KEY: Config.OPENAI_API_KEY || 'your-openai-api-key-here',
};

// Helper to check if environment is properly configured
export const isOpenAIConfigured = (): boolean => {
  return ENV_CONFIG.OPENAI_API_KEY !== Config.OPENAI_API_KEY
};