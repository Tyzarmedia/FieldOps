/**
 * Test utility to verify geolocation error handling is working properly
 * This can be used in the browser console for debugging
 */

import { geolocationUtils } from './geolocationUtils';
import { logError, stringifyError, getUserFriendlyErrorMessage } from './errorUtils';

// Mock GeolocationPositionError for testing
class MockGeolocationPositionError implements GeolocationPositionError {
  readonly PERMISSION_DENIED = 1;
  readonly POSITION_UNAVAILABLE = 2;  
  readonly TIMEOUT = 3;

  constructor(
    public code: number,
    public message: string
  ) {}
}

export function testGeolocationErrorHandling() {
  console.log('🧪 Testing Geolocation Error Handling...\n');

  // Test different error types
  const errors = [
    new MockGeolocationPositionError(1, 'User denied the request for Geolocation'),
    new MockGeolocationPositionError(2, 'Location information is unavailable'),
    new MockGeolocationPositionError(3, 'The request to get user location timed out'),
    new MockGeolocationPositionError(0, 'Unknown geolocation error')
  ];

  errors.forEach((error, index) => {
    console.log(`\n--- Test ${index + 1}: Error Code ${error.code} ---`);
    
    // Test stringifyError
    console.log('Stringified:', stringifyError(error));
    
    // Test getUserFriendlyErrorMessage
    console.log('User message:', getUserFriendlyErrorMessage(error));
    
    // Test geolocationUtils.logGeolocationError
    console.log('Logging via geolocationUtils:');
    geolocationUtils.logGeolocationError(error, `Test ${index + 1}`);
  });

  console.log('\n✅ Geolocation error handling test completed!');
  console.log('Check the console output above - you should see properly formatted error objects instead of "[object Object]"');
}

// Export for use in browser console
(window as any).testGeolocationErrorHandling = testGeolocationErrorHandling;
