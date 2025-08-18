/**
 * Error handling utilities for better debugging and user feedback
 */

/**
 * Safely stringify an error object for logging
 */
export function stringifyError(error: any): string {
  if (!error) return 'Unknown error';

  // Handle GeolocationPositionError specifically
  if (error.code !== undefined && error.message !== undefined && typeof error.code === 'number') {
    const geolocationErrorNames = {
      1: 'PERMISSION_DENIED',
      2: 'POSITION_UNAVAILABLE',
      3: 'TIMEOUT'
    };

    return JSON.stringify({
      type: 'GeolocationPositionError',
      code: error.code,
      codeName: geolocationErrorNames[error.code] || 'UNKNOWN_ERROR',
      message: error.message,
      timestamp: new Date().toISOString()
    }, null, 2);
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return JSON.stringify({
      type: 'Error',
      name: error.name,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }, null, 2);
  }

  // Handle plain objects
  if (typeof error === 'object' && error !== null) {
    try {
      return JSON.stringify({
        type: 'Object',
        content: error,
        timestamp: new Date().toISOString()
      }, null, 2);
    } catch (stringifyError) {
      // Fallback if JSON.stringify fails (circular references, etc.)
      return `Error object (stringify failed): ${Object.prototype.toString.call(error)}`;
    }
  }

  // Handle primitives
  return `Error: ${String(error)} (${typeof error})`;
}

/**
 * Log error with proper formatting
 */
export function logError(error: any, context?: string): void {
  const contextStr = context ? ` [${context}]` : '';
  console.error(`Error${contextStr}:`, stringifyError(error));
  
  // Also log the original error object for browser dev tools
  if (error) {
    console.error('Original error object:', error);
  }
}

/**
 * Create user-friendly error message from any error
 */
export function getUserFriendlyErrorMessage(error: any): string {
  if (!error) return 'An unknown error occurred';
  
  // Handle GeolocationPositionError
  if (error.code !== undefined) {
    switch (error.code) {
      case 1:
        return 'Location access denied. Please enable location permissions in your browser settings.';
      case 2:
        return 'Location unavailable. Please check your GPS signal or network connection.';
      case 3:
        return 'Location request timed out. Please check your connection and try again.';
      default:
        return 'Unable to get your location. Please try again or enter your location manually.';
    }
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message || 'An unexpected error occurred';
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }
  
  return 'An unexpected error occurred. Please try again.';
}
