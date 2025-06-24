// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://localhost:7064/api',
  ENDPOINTS: {
    UPLOAD: '/Transcription/upload',
  },
};

// Environment-based configuration
export const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export const getDefaultHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

export const getUploadHeaders = () => {
  return {
    'accept': 'text/plain',
  };
}; 