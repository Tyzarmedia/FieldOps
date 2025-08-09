/**
 * Network utilities for health checks and connectivity testing
 */

/**
 * Test basic server connectivity
 */
export async function testServerHealth(): Promise<boolean> {
  try {
    const response = await fetch('/api/ping', { 
      method: 'GET',
      timeout: 5000 
    });
    return response.ok;
  } catch (error) {
    console.warn('Server health check failed:', error);
    return false;
  }
}

/**
 * Check if we're online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Enhanced fetch with timeout and retry logic
 */
export async function fetchWithRetry(
  url: string, 
  options: RequestInit = {}, 
  retries = 2,
  timeout = 5000
): Promise<Response> {
  const fetchWithTimeout = (url: string, options: RequestInit, timeout: number): Promise<Response> => {
    return Promise.race([
      fetch(url, options),
      new Promise<Response>((_, reject) => 
        setTimeout(() => reject(new Error('Network timeout')), timeout)
      )
    ]);
  };

  let lastError: Error = new Error('Unknown error');
  
  for (let i = 0; i <= retries; i++) {
    try {
      const response = await fetchWithTimeout(url, options, timeout);
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Network error');
      console.warn(`Fetch attempt ${i + 1}/${retries + 1} failed:`, error);
      
      // Wait before retry (exponential backoff)
      if (i < retries) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  throw lastError;
}

/**
 * Get network status string for UI display
 */
export function getNetworkStatusText(errorCount: number): string {
  if (errorCount === 0) return 'Online';
  if (errorCount < 3) return 'Connection Issues';
  return 'Offline';
}

/**
 * Get appropriate retry interval based on error count
 */
export function getRetryInterval(errorCount: number): number {
  // Base interval of 1 minute, exponential backoff up to 10 minutes
  return Math.min(60000 * Math.pow(2, errorCount), 600000);
}
