import { useState, useCallback } from "react";
import { geolocationUtils, LocationResult, GeolocationError } from "@/utils/geolocationUtils";

interface LocationRequestState {
  isLoading: boolean;
  location: LocationResult | null;
  error: GeolocationError | null;
  strategy: string;
  progress: number;
  canCancel: boolean;
}

interface UseLocationRequestOptions {
  enableProgress?: boolean;
  maxTimeout?: number;
  fallbackToDefault?: boolean;
  defaultLocation?: LocationResult;
}

export function useLocationRequest(options: UseLocationRequestOptions = {}) {
  const {
    enableProgress = true,
    maxTimeout = 30000,
    fallbackToDefault = true,
    defaultLocation = {
      latitude: -33.0197,
      longitude: 27.9117,
      address: "Default Location (East London)",
    }
  } = options;

  const [state, setState] = useState<LocationRequestState>({
    isLoading: false,
    location: null,
    error: null,
    strategy: "",
    progress: 0,
    canCancel: false,
  });

  const requestLocation = useCallback(async (): Promise<LocationResult | null> => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      strategy: "Initializing location request...",
      progress: 0,
      canCancel: true,
    }));

    let progressInterval: NodeJS.Timeout | null = null;
    let cancelled = false;

    // Set up progress tracking if enabled
    if (enableProgress) {
      const startTime = Date.now();
      progressInterval = setInterval(() => {
        if (cancelled) return;
        
        const elapsed = Date.now() - startTime;
        const progressPercent = Math.min((elapsed / maxTimeout) * 100, 100);
        
        let strategy = "Getting location...";
        if (elapsed < 8000) {
          strategy = "Connecting to GPS satellites...";
        } else if (elapsed < 16000) {
          strategy = "Acquiring high accuracy position...";
        } else if (elapsed < 24000) {
          strategy = "Trying alternative location methods...";
        } else {
          strategy = "Finalizing location acquisition...";
        }

        setState(prev => ({
          ...prev,
          progress: progressPercent,
          strategy,
        }));
      }, 500);
    }

    try {
      const result = await geolocationUtils.getCurrentPosition({
        timeout: maxTimeout,
      });

      if (cancelled) return null;

      setState(prev => ({
        ...prev,
        isLoading: false,
        location: result,
        progress: 100,
        strategy: "Location acquired successfully!",
        canCancel: false,
      }));

      return result;
    } catch (error) {
      if (cancelled) return null;

      const geoError = error as GeolocationError;
      console.error("Location request failed:", geoError);

      // If fallback is enabled and it's a timeout/unavailable error, use default
      if (fallbackToDefault && 
          defaultLocation && 
          (geoError.code === 3 || geoError.code === 2)) {
        
        console.log("Using fallback default location");
        setState(prev => ({
          ...prev,
          isLoading: false,
          location: defaultLocation,
          error: null,
          progress: 100,
          strategy: "Using default location",
          canCancel: false,
        }));

        return defaultLocation;
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: geoError,
        progress: 0,
        strategy: "Location request failed",
        canCancel: false,
      }));

      return null;
    } finally {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
    }
  }, [enableProgress, maxTimeout, fallbackToDefault, defaultLocation]);

  const cancelRequest = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      progress: 0,
      strategy: "Request cancelled",
      canCancel: false,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      location: null,
      error: null,
      strategy: "",
      progress: 0,
      canCancel: false,
    });
  }, []);

  const useDefaultLocation = useCallback(() => {
    if (defaultLocation) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        location: defaultLocation,
        error: null,
        progress: 100,
        strategy: "Using default location",
        canCancel: false,
      }));
      return defaultLocation;
    }
    return null;
  }, [defaultLocation]);

  return {
    ...state,
    requestLocation,
    cancelRequest,
    reset,
    useDefaultLocation,
  };
}
