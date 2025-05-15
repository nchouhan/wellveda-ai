// Configuration for different environments
// This helps ensure proper API URL handling in both development and production

const getApiBaseUrl = (): string => {
  // Check if we're in a browser environment
  if (typeof window !== 'undefined') {
    // For deployed static sites, we need to handle the case where the frontend
    // is on a different domain than the API (likely a .replit.app domain)
    
    // If window.location.hostname includes '.replit.app', we're on a deployed static site
    if (window.location.hostname.includes('.replit.app')) {
      // For static deployments, we need to ensure we use HTTPS
      return `https://${window.location.hostname}`;
    }
    
    // For local development or other environments, use the current origin
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