import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocationRequest } from "@/hooks/useLocationRequest";
import { LocationTimeoutProgress } from "@/components/LocationTimeoutProgress";
import {
  MapPin,
  AlertCircle,
  CheckCircle,
  Settings,
  RefreshCw,
  Navigation,
  Info,
} from "lucide-react";

interface LocationPermissionHandlerProps {
  onLocationReceived: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  onError?: (error: string) => void;
  required?: boolean;
  className?: string;
}

export function LocationPermissionHandler({
  onLocationReceived,
  onError,
  required = false,
  className = "",
}: LocationPermissionHandlerProps) {
  const [permissionStatus, setPermissionStatus] = useState<
    "unknown" | "granted" | "denied" | "prompt"
  >("unknown");

  const {
    isLoading,
    location,
    error,
    strategy,
    progress,
    canCancel,
    requestLocation,
    cancelRequest,
    useDefaultLocation: useDefaultLocationFromHook,
  } = useLocationRequest({
    enableProgress: true,
    maxTimeout: 30000,
    fallbackToDefault: !required,
  });

  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    checkPermissionStatus();
  }, []);

  const checkPermissionStatus = async () => {
    try {
      if (
        "permissions" in navigator &&
        "geolocation" in navigator.permissions
      ) {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });
        setPermissionStatus(permission.state);

        // Listen for permission changes
        permission.onchange = () => {
          setPermissionStatus(permission.state);
        };
      } else {
        setPermissionStatus("unknown");
      }
    } catch (error) {
      console.error("Error checking permission status:", error);
      setPermissionStatus("unknown");
    }
  };

  const handleLocationRequest = async () => {
    if (!navigator.geolocation) {
      const error =
        "Geolocation is not supported by this browser. Please enter location manually.";
      setErrorMessage(error);
      onError?.(error);
      return;
    }

    setErrorMessage("");
    const result = await requestLocation();

    if (result) {
      const locationData = {
        latitude: result.latitude,
        longitude: result.longitude,
        address: result.address || `${result.latitude.toFixed(6)}, ${result.longitude.toFixed(6)}`,
      };
      onLocationReceived(locationData);
      setPermissionStatus("granted");
    }
  };

  // Handle location changes from the hook
  useEffect(() => {
    if (location) {
      const locationData = {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address || `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`,
      };
      onLocationReceived(locationData);
      setPermissionStatus("granted");
    }
  }, [location, onLocationReceived]);

  // Handle errors from the hook
  useEffect(() => {
    if (error) {
      let errorMsg = error.userMessage || "Unable to get location. Please try again.";

      if (error.code === 1) {
        setPermissionStatus("denied");
        errorMsg = "Location access denied. Please enable location permissions.";
      }

      // Only show error if location is required
      if (required) {
        setErrorMessage(errorMsg);
        onError?.(errorMsg);
      } else {
        // For optional location, just log and continue
        console.log("Location access optional:", errorMsg);
      }
    }
  }, [error, required, onError]);

  const handleUseDefaultLocation = () => {
    const result = useDefaultLocationFromHook();
    if (result) {
      setErrorMessage("");
    }
  };

  const openLocationSettings = () => {
    // Open browser settings (this varies by browser)
    if (navigator.userAgent.includes("Chrome")) {
      window.open("chrome://settings/content/location", "_blank");
    } else if (navigator.userAgent.includes("Firefox")) {
      window.open("about:preferences#privacy", "_blank");
    } else {
      alert(
        'Please enable location access in your browser settings:\n\n1. Click the location icon in your address bar\n2. Select "Allow" for location access\n3. Refresh the page and try again',
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "granted":
        return "bg-green-100 text-green-800";
      case "denied":
        return "bg-red-100 text-red-800";
      case "prompt":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "granted":
        return "Location access granted";
      case "denied":
        return "Location access denied";
      case "prompt":
        return "Location permission required";
      default:
        return "Checking location permissions";
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Location Access
            {required && <span className="text-red-500 ml-1">*</span>}
          </h3>
          <Badge className={getStatusColor(permissionStatus)}>
            {getStatusText(permissionStatus)}
          </Badge>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm text-red-800">{errorMessage}</span>
            </div>
          </div>
        )}

        {location && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">
                Location confirmed
              </span>
            </div>
            <div className="text-sm text-green-700">
              {location.address}
            </div>
          </div>
        )}

        {isLoading && (
          <LocationTimeoutProgress
            isActive={isLoading}
            strategy={strategy}
            onCancel={canCancel ? cancelRequest : undefined}
            maxTimeout={30000}
          />
        )}

        <div className="space-y-2">
          {permissionStatus === "denied" ? (
            <div className="space-y-2">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">
                      Location access is blocked
                    </p>
                    <p>To enable location access:</p>
                    <ol className="list-decimal list-inside mt-1 space-y-1">
                      <li>
                        Click the location icon in your browser's address bar
                      </li>
                      <li>Select "Allow" for location access</li>
                      <li>Refresh the page and try again</li>
                    </ol>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={openLocationSettings}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Open Settings
                </Button>
                <Button
                  onClick={checkPermissionStatus}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleLocationRequest}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  {strategy || "Getting location..."}
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Current Location
                </>
              )}
            </Button>
          )}

          {!required && (
            <Button
              onClick={handleUseDefaultLocation}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              Use Default Location
            </Button>
          )}
        </div>

        {required && !currentLocation && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">
                Location is required for this feature to work properly.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
