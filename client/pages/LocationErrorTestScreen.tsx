import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Info, Play } from "lucide-react";
import {
  testLocationErrorLogging,
  simulateLocationTrackingError,
} from "@/utils/testLocationErrorLoggingFix";

const LocationErrorTestScreen: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runErrorLoggingTest = async () => {
    setIsRunning(true);
    setTestResults([]);

    // Capture console output
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const capturedLogs: string[] = [];

    console.log = (...args: any[]) => {
      capturedLogs.push(`LOG: ${args.join(" ")}`);
      originalConsoleLog(...args);
    };

    console.error = (...args: any[]) => {
      capturedLogs.push(`ERROR: ${args.join(" ")}`);
      originalConsoleError(...args);
    };

    try {
      // Run the test
      testLocationErrorLogging();

      await new Promise((resolve) => setTimeout(resolve, 100)); // Brief delay for async operations

      setTestResults(capturedLogs);
    } catch (error) {
      setTestResults([...capturedLogs, `TEST ERROR: ${error}`]);
    } finally {
      // Restore console
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
      setIsRunning(false);
    }
  };

  const runLocationTrackingSimulation = () => {
    console.log("Running Location Tracking Error Simulation...");
    simulateLocationTrackingError();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Location Error Logging Fix Test
          </h1>
          <p className="text-gray-600 mb-6">
            This page demonstrates the fix for the "Location tracking error:
            [object Object]" issue. The fix ensures that error objects are
            properly serialized and logged with detailed information.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-500" />
                  Before Fix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="destructive">Problematic</Badge>
                  <p className="text-sm text-gray-600">
                    Errors showed as cryptic "[object Object]" or "[object
                    GeolocationPositionError]"
                  </p>
                  <div className="bg-red-50 p-3 rounded border">
                    <code className="text-sm text-red-700">
                      Location tracking error: [object Object]
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  After Fix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Badge variant="default">Fixed</Badge>
                  <p className="text-sm text-gray-600">
                    Errors now show detailed, actionable information with
                    context
                  </p>
                  <div className="bg-green-50 p-3 rounded border">
                    <code className="text-sm text-green-700">
                      Detailed error object with code, message, and
                      user-friendly details
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4">
              <Button
                onClick={runErrorLoggingTest}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                {isRunning ? "Running Test..." : "Run Error Logging Test"}
              </Button>

              <Button
                onClick={runLocationTrackingSimulation}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Info className="h-4 w-4" />
                Simulate Location Error
              </Button>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Check your browser's console (F12) to see the improved error
                logging in action. The test will show both the old problematic
                way and the new improved way side by side.
              </AlertDescription>
            </Alert>

            {testResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Test Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded max-h-96 overflow-y-auto">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {testResults.join("\n")}
                    </pre>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {testResults.length} log entries captured. Check browser
                    console for full output.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            What was Fixed
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-gray-900">Root Cause</h3>
              <p className="text-sm text-gray-600">
                Error objects were being logged directly with{" "}
                <code>console.error("Location tracking error:", error)</code>,
                which displays them as "[object Object]" instead of showing
                useful information.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium text-gray-900">Solution</h3>
              <p className="text-sm text-gray-600">
                Updated <code>useLocationRequest.ts</code> to use proper error
                handling utilities:
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>
                  • <code>geolocationUtils.logGeolocationError()</code> for
                  GeolocationPositionError objects
                </li>
                <li>
                  • <code>logError()</code> from errorUtils for other error
                  types
                </li>
                <li>
                  • Proper error type detection to choose the right logging
                  method
                </li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium text-gray-900">Benefits</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Clear, actionable error messages for developers</li>
                <li>
                  • Proper error code identification (PERMISSION_DENIED,
                  TIMEOUT, etc.)
                </li>
                <li>• Timestamp information for debugging</li>
                <li>• Context information to identify where errors occur</li>
                <li>• User-friendly error messages for end users</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationErrorTestScreen;
