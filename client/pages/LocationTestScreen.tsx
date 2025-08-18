import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LocationPermissionHandler } from "@/components/LocationPermissionHandler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, CheckCircle, AlertCircle } from "lucide-react";

export default function LocationTestScreen() {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [showPermissionHandler, setShowPermissionHandler] = useState(false);

  const handleLocationReceived = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setCurrentLocation(location);
    setLocationError("");
    setShowPermissionHandler(false);
  };

  const handleLocationError = (error: string) => {
    setLocationError(error);
    setCurrentLocation(null);
    setShowPermissionHandler(false);
  };

  const requestLocation = () => {
    setShowPermissionHandler(true);
  };

  const testDirectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
        });
        setLocationError("");
      },
      (error) => {
        let errorMsg = "";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "Location access denied by user.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Location unavailable.";
            break;
          case error.TIMEOUT:
            errorMsg = "Location request timed out.";
            break;
          default:
            errorMsg = "Unknown location error.";
        }
        setLocationError(errorMsg);
        setCurrentLocation(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold">Location Permission Test</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentLocation ? (
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Location Available</p>
                  <p className="text-sm text-green-700">
                    Latitude: {currentLocation.latitude.toFixed(6)}
                  </p>
                  <p className="text-sm text-green-700">
                    Longitude: {currentLocation.longitude.toFixed(6)}
                  </p>
                  <p className="text-sm text-green-700">
                    Address: {currentLocation.address}
                  </p>
                </div>
              </div>
            ) : locationError ? (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Location Error</p>
                  <p className="text-sm text-red-700">{locationError}</p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-600">No location data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Test Location Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button
                onClick={requestLocation}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              >
                Request Location (With Permission Handler)
              </Button>
              <p className="text-sm text-gray-600">
                Uses the LocationPermissionHandler component to properly request location access.
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={testDirectLocation}
                variant="outline"
                className="w-full"
              >
                Direct Location Request (Old Method)
              </Button>
              <p className="text-sm text-gray-600">
                Directly calls navigator.geolocation.getCurrentPosition() without proper permission handling.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Browser Info */}
        <Card>
          <CardHeader>
            <CardTitle>Browser Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>User Agent:</strong> {navigator.userAgent}</p>
              <p><strong>Geolocation Supported:</strong> {navigator.geolocation ? "Yes" : "No"}</p>
              <p><strong>HTTPS:</strong> {location.protocol === "https:" ? "Yes" : "No"}</p>
              <p><strong>Permissions API:</strong> {"permissions" in navigator ? "Available" : "Not Available"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Location Permission Handler Modal */}
      {showPermissionHandler && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Location Access Test
              </h3>
              <LocationPermissionHandler
                onLocationReceived={handleLocationReceived}
                onError={handleLocationError}
                required={false}
                className="mb-4"
              />
              <Button
                onClick={() => setShowPermissionHandler(false)}
                variant="outline"
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
