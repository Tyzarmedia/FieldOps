/**
 * Comprehensive test utility to verify location error handling fixes
 * This can be used in the browser console for debugging and verification
 */

import { geolocationUtils } from "./geolocationUtils";
import {
  logError,
  stringifyError,
  getUserFriendlyErrorMessage,
} from "./errorUtils";

// Mock GeolocationPositionError for testing
class MockGeolocationPositionError implements GeolocationPositionError {
  readonly PERMISSION_DENIED = 1;
  readonly POSITION_UNAVAILABLE = 2;
  readonly TIMEOUT = 3;

  constructor(
    public code: number,
    public message: string,
  ) {}
}

/**
 * Test location error logging and formatting to ensure no [object Object] displays
 */
export function testLocationErrorHandling() {
  console.log("🔧 Testing Location Error Handling Fixes...\n");

  // Test different error scenarios
  const testErrors = [
    {
      name: "Permission Denied",
      error: new MockGeolocationPositionError(
        1,
        "User denied the request for Geolocation",
      ),
    },
    {
      name: "Position Unavailable",
      error: new MockGeolocationPositionError(
        2,
        "Location information is unavailable",
      ),
    },
    {
      name: "Timeout",
      error: new MockGeolocationPositionError(
        3,
        "The request to get user location timed out",
      ),
    },
    {
      name: "Unknown Error",
      error: new MockGeolocationPositionError(0, "Unknown geolocation error"),
    },
    {
      name: "Generic Error Object",
      error: new Error("Generic error message"),
    },
    {
      name: "Plain Object Error",
      error: { code: 999, message: "Custom error object", customField: "test" },
    },
    {
      name: "String Error",
      error: "Simple string error",
    },
    {
      name: "Null Error",
      error: null,
    },
  ];

  testErrors.forEach((test, index) => {
    console.log(`\n--- Test ${index + 1}: ${test.name} ---`);

    // Test stringifyError - should never show [object Object]
    const stringified = stringifyError(test.error);
    console.log("✅ Stringified Error:");
    console.log(stringified);

    // Verify no [object Object] in output
    if (stringified.includes("[object") && stringified.includes("Object]")) {
      console.error("❌ FAILED: Found [object Object] in stringified output!");
    } else {
      console.log("✅ PASSED: No [object Object] found");
    }

    // Test getUserFriendlyErrorMessage
    const userMessage = getUserFriendlyErrorMessage(test.error);
    console.log("📝 User-friendly message:", userMessage);

    // Test geolocationUtils logging for GeolocationPositionError
    if (test.error && typeof test.error.code === "number") {
      console.log("🗂️ Testing geolocationUtils.logGeolocationError:");
      geolocationUtils.logGeolocationError(
        test.error as GeolocationPositionError,
        `Test ${index + 1}`,
      );
    }
  });

  console.log("\n🎯 Testing Scenarios Complete!");
  console.log("\nKey improvements made:");
  console.log(
    "1. GeolocationPositionError objects are properly serialized with code names",
  );
  console.log("2. Error objects show type information for better debugging");
  console.log("3. No more [object Object] displays in logs");
  console.log("4. User-friendly messages for all error types");
  console.log("5. Consistent error logging across all location services");
}

/**
 * Test real geolocation error in a controlled way
 */
export function testRealGeolocationError() {
  console.log("🌍 Testing real geolocation error handling...");

  if (!navigator.geolocation) {
    console.log("❌ Geolocation not supported in this browser");
    return;
  }

  // Test with very restrictive settings to force a timeout
  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log("✅ Unexpected success:", position);
    },
    (error) => {
      console.log("📍 Real geolocation error caught:");
      console.log("Raw error object:", error);
      console.log("Stringified:", stringifyError(error));
      console.log("User message:", getUserFriendlyErrorMessage(error));

      // Test our utility function
      geolocationUtils.logGeolocationError(error, "Real Test");
    },
    {
      enableHighAccuracy: true,
      timeout: 1, // Force timeout in 1ms
      maximumAge: 0,
    },
  );
}

/**
 * Simulate the exact error scenario from the original issue
 */
export function simulateOriginalError() {
  console.log(
    '🔍 Simulating original "Location tracking error: [object GeolocationPositionError]" issue...\n',
  );

  const mockError = new MockGeolocationPositionError(
    2,
    "Location information is unavailable",
  );

  // Show what the old logging would have produced
  console.log("❌ OLD (problematic) logging:");
  console.log("Location tracking error:", mockError); // This would show [object GeolocationPositionError]

  // Show what the new logging produces
  console.log("\n✅ NEW (fixed) logging:");
  geolocationUtils.logGeolocationError(mockError, "Location Tracking Service");

  console.log("\n📊 Comparison:");
  console.log(
    'Before: "Location tracking error: [object GeolocationPositionError]"',
  );
  console.log(
    "After: Detailed error object with code, message, and user-friendly details",
  );
}

// Export for browser console testing
if (typeof window !== "undefined") {
  (window as any).testLocationErrorHandling = testLocationErrorHandling;
  (window as any).testRealGeolocationError = testRealGeolocationError;
  (window as any).simulateOriginalError = simulateOriginalError;

  console.log("🛠️ Location error testing utilities loaded!");
  console.log("Available functions:");
  console.log("- testLocationErrorHandling() - Test all error scenarios");
  console.log("- testRealGeolocationError() - Test with real geolocation");
  console.log("- simulateOriginalError() - Show before/after comparison");
}
