// Configuration for different environments
// This helps ensure proper API URL handling in both development and production

const getApiBaseUrl = (): string => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // For Cloud Run or any other environment where frontend and backend are deployed together,
    // we can use the same origin for API requests - this is the ideal production setup
    
    // For specific known development environments, we may need special handling
    
    // If running on a Replit static deployment, we need to point to the backend URL
    if (window.location.hostname.includes('.replit.app') && 
        window.location.hostname.includes('static')) {
      console.log('Detected Replit static deployment, using explicit backend URL');
      
      // This can be replaced with an environment variable in a production build
      // or automatically detected from deployment configuration
      const BACKEND_URL = window.location.hostname.includes('static') 
        ? 'https://15a864c7-45f9-48b6-8e27-ed032131bf3c-00-1u23l4zta3l4u.picard.replit.dev' // Replit development URL
        : window.location.origin; // In Cloud Run, this would be the same origin
      
      return BACKEND_URL;
    }
    
    // For all other environments (including GCP Cloud Run), use the current origin
    // This works because in Cloud Run, the frontend and backend are served from the same origin
    console.log('Using current origin for API URL:', window.location.origin);
    return window.location.origin;
  }
  
  // Fallback for non-browser environments
  return '';
};

export const config = {
  apiBaseUrl: getApiBaseUrl(),
};

// Helper function to build an absolute API URL
export const buildApiUrl = (path: string): string => {
  // If the path already starts with http(s), return it as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Make sure the path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  
  // Combine the base URL with the path
  return `${config.apiBaseUrl}${normalizedPath}`;
};