/**
 * Test utility to demonstrate the fix for location tracking error logging
 */

import { geolocationUtils } from "@/utils/geolocationUtils";
import { logError, stringifyError } from "@/utils/errorUtils";

// Mock GeolocationPositionError for testing
class MockGeolocationPositionError implements GeolocationPositionError {
  readonly PERMISSION_DENIED: number = 1;
  readonly POSITION_UNAVAILABLE: number = 2;
  readonly TIMEOUT: number = 3;

  constructor(
    public code: number,
    public message: string,
  ) {}
}

/**
 * Test the improved error logging
 */
export function testLocationErrorLogging() {
  console.log("🧪 Testing Location Error Logging Fix...\n");

  // Create mock errors to test different scenarios
  const mockErrors = [
    new MockGeolocationPositionError(
      1,
      "User denied the request for Geolocation",
    ),
    new MockGeolocationPositionError(2, "Location information is unavailable"),
    new MockGeolocationPositionError(
      3,
      "The request to get user location timed out",
    ),
    { message: "Generic error object", details: "Some details" },
    "Simple string error",
    null,
    undefined,
  ];

  mockErrors.forEach((error, index) => {
    console.log(
      `\n--- Test Case ${index + 1}: ${error?.constructor?.name || typeof error} ---`,
    );

    // Show the old problematic way
    console.log("❌ OLD (problematic) way - would show [object Object]:");
    console.log("Location tracking error:", error);

    // Show the new improved way
    console.log("\n✅ NEW (fixed) way - shows detailed information:");

    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      typeof error.code === "number"
    ) {
      // GeolocationPositionError - use specialized logging
      geolocationUtils.logGeolocationError(
        error as GeolocationPositionError,
        "LocationTest",
      );
    } else {
      // Other errors - use general error logging
      logError(error, "LocationTest");
    }

    console.log("\n📊 Stringified version:");
    console.log(stringifyError(error));
  });

  console.log("\n✅ Location error logging test completed!");
  console.log(
    "The fix ensures that error objects are properly serialized and logged,",
  );
  console.log('preventing the "[object Object]" display issue.');
}

/**
 * Simulate the specific scenario that was causing problems
 */
export function simulateLocationTrackingError() {
  console.log(
    '🔍 Simulating the specific "Location tracking error: [object Object]" scenario...\n',
  );

  const mockLocationError = new MockGeolocationPositionError(
    2,
    "Network location provider at 'https://www.googleapis.com/' : Returned error code 403.",
  );

  console.log("❌ BEFORE FIX - This would show:");
  console.log("Location tracking error: [object GeolocationPositionError]");

  console.log("\n✅ AFTER FIX - This now shows:");
  geolocationUtils.logGeolocationError(mockLocationError, "useLocationRequest");

  console.log("\n🎯 The error now provides:");
  console.log("• Error type identification");
  console.log("• Specific error code and meaning");
  console.log("• Timestamp for debugging");
  console.log("• User-friendly message");
  console.log("• Context information");
}

// Export for console testing in browser
if (typeof window !== "undefined") {
  (window as any).testLocationErrorLogging = testLocationErrorLogging;
  (window as any).simulateLocationTrackingError = simulateLocationTrackingError;
}
