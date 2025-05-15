// Configuration for different environments
// This helps ensure proper API URL handling in both development and production

const getApiBaseUrl = (): string => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // In Replit static deployments, we need to use a separate URL for the backend API
    // This URL should point to your development Repl's URL (with the backend server)
    
    // TODO: Replace this with your actual Replit development URL where the Express server is running
    // You can find this in the Replit workspace by looking at the URL in the Webview tab
    const REPLIT_BACKEND_URL = 'https://15a864c7-45f9-48b6-8e27-ed032131bf3c-00-1u23l4zta3l4u.picard.replit.dev';
    
    // If window.location.hostname includes '.replit.app', we're on a deployed static site
    if (window.location.hostname.includes('.replit.app')) {
      console.log('Detected static deployment environment, using explicit backend URL');
      // For static deployments, use the explicit backend URL
      return REPLIT_BACKEND_URL;
    }
    
    // For local development or other environments, use the current origin
    console.log('Using local development API URL:', window.location.origin);
    return window.location.origin;
  }
  
  // Fallback for non-browser environments (should not typically happen in this app)
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