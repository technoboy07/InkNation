/**
 * Environment configuration
 * Access environment variables using process.env.REACT_APP_*
 * Note: In Create React App, only variables prefixed with REACT_APP_ are exposed
 */

export const config = {
  apiUrl: process.env.REACT_APP_API_URL || '',
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  enableErrorTracking: process.env.REACT_APP_ENABLE_ERROR_TRACKING === 'true',
  appName: process.env.REACT_APP_NAME || '3D Tattoo Web',
  appVersion: process.env.REACT_APP_VERSION || '1.0.0',
};

export default config;

