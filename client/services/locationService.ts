export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp: number;
  accuracy?: number;
  isDefault?: boolean; // Indicates if this is a fallback/default location
}

export interface LocationPermissionState {
  status: "unknown" | "granted" | "denied" | "prompt";
  isTracking: boolean;
  lastKnownLocation: LocationData | null;
  clockedIn: boolean;
}

class LocationService {
  private state: LocationPermissionState = {
    status: "unknown",
    isTracking: false,
    lastKnownLocation: null,
    clockedIn: false,
  };

  private watchId: number | null = null;
  private listeners: Set<(state: LocationPermissionState) => void> = new Set();

  constructor() {
    this.initializeFromStorage();
    this.checkInitialPermission();
  }

  private initializeFromStorage() {
    try {
      const clockedIn = localStorage.getItem("isClockedIn") === "true";
      const lastLocation = localStorage.getItem("lastKnownLocation");

      this.state.clockedIn = clockedIn;

      if (lastLocation) {
        this.state.lastKnownLocation = JSON.parse(lastLocation);
      }

      // If user is clocked in, automatically start tracking
      if (clockedIn) {
        this.startTracking();
      }
    } catch (error) {
      console.error("Error initializing location service from storage:", error);
    }
  }

  private async checkInitialPermission() {
    try {
      if (
        "permissions" in navigator &&
        "geolocation" in navigator.permissions
      ) {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });
        this.state.status = permission.state;

        permission.onchange = () => {
          this.state.status = permission.state;
          this.notifyListeners();

          // If permission is denied while tracking, stop tracking
          if (permission.state === "denied" && this.state.isTracking) {
            this.stopTracking();
          }
        };
      }
    } catch (error) {
      console.error("Error checking location permission:", error);
      this.state.status = "unknown";
    }

    this.notifyListeners();
  }

  async requestLocationPermission(): Promise<boolean> {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported");
      return false;
    }

    try {
      // Use the improved geolocationUtils with progressive timeout strategy
      const { geolocationUtils } = await import("@/utils/geolocationUtils");
      const result = await geolocationUtils.getCurrentPosition();

      this.state.status = "granted";
      this.updateLocation({
        latitude: result.latitude,
        longitude: result.longitude,
        timestamp: Date.now(),
        accuracy: result.accuracy,
        address:
          result.address ||
          `${result.latitude.toFixed(6)}, ${result.longitude.toFixed(6)}`,
      });
      this.notifyListeners();
      return true;
    } catch (error: any) {
      console.error("Location permission error:", {
        code: error.code || "unknown",
        message: error.message || "Unknown error",
        userMessage: error.userMessage || "Location access failed",
        timestamp: new Date().toISOString(),
      });

      this.state.status = error.code === 1 ? "denied" : "unknown";
      this.notifyListeners();
      return false;
    }
  }

  // Try to get location access silently without blocking the user
  async tryLocationSilently(): Promise<boolean> {
    if (!navigator.geolocation) {
      console.error("Geolocation not supported on this device");
      return false;
    }

    // Try multiple times with different strategies for work phones
    const attempts = [
      { timeout: 5000, highAccuracy: true },
      { timeout: 10000, highAccuracy: true },
      { timeout: 15000, highAccuracy: false },
      { timeout: 20000, highAccuracy: false }
    ];

    for (let i = 0; i < attempts.length; i++) {
      const attempt = attempts[i];
      console.log(`Location access attempt ${i + 1}/${attempts.length}`);

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            {
              enableHighAccuracy: attempt.highAccuracy,
              timeout: attempt.timeout,
              maximumAge: 30000
            }
          );
        });

        this.state.status = "granted";
        this.updateLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now(),
          accuracy: position.coords.accuracy,
          address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
        });
        this.notifyListeners();
        console.log(`Location acquired on attempt ${i + 1}`);
        return true;
      } catch (error: any) {
        console.warn(`Location attempt ${i + 1} failed:`, error.message);

        if (error.code === 1) { // PERMISSION_DENIED
          console.log('Location permission denied - app will continue without GPS');
          // Don't show any blocking dialogs - just continue
        }

        if (i < attempts.length - 1) {
          // Wait before next attempt
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    // Don't mark as denied - just log and continue
    console.log('Location access not available - app continues normally');
    this.logLocationIssue();
    return false;
  }

  private logLocationIssue(): void {
    // Silently log location access issues without blocking the user
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: 'LOCATION_ACCESS_DENIED',
      userAgent: navigator.userAgent,
      note: 'App continuing without GPS - check browser location settings'
    };

    try {
      const logs = JSON.parse(localStorage.getItem('locationLogs') || '[]');
      logs.push(logEntry);
      localStorage.setItem('locationLogs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to log location event:', error);
    }
  }

  async handleClockIn(): Promise<{success: boolean, hasLocation: boolean}> {
    this.state.clockedIn = true;

    // Try to get location silently - don't block if denied
    const permissionGranted = await this.tryLocationSilently();

    if (permissionGranted) {
      // Start continuous tracking
      this.startTracking();
      return { success: true, hasLocation: true };
    }

    // Always allow clock-in to succeed - location is optional
    console.log('Clock-in successful without location - GPS will retry in background');
    this.logLocationIssue();
    return { success: true, hasLocation: false };
  }

  handleClockOut() {
    this.state.clockedIn = false;
    this.stopTracking();
    this.notifyListeners();
  }

  private startTracking() {
    if (!navigator.geolocation || this.state.isTracking) {
      return;
    }

    this.state.isTracking = true;

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.updateLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          timestamp: Date.now(),
          accuracy: position.coords.accuracy,
          address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
        });
      },
      (error) => {
        console.error("Location tracking error:", {
          code: error.code,
          message: error.message,
          timestamp: new Date().toISOString(),
        });
        // Don't stop tracking on errors, just log them
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000, // Accept location up to 30 seconds old
      },
    );

    this.notifyListeners();
  }

  private stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    this.state.isTracking = false;
    this.notifyListeners();
  }

  private updateLocation(location: LocationData) {
    this.state.lastKnownLocation = location;

    // Persist to localStorage
    try {
      localStorage.setItem("lastKnownLocation", JSON.stringify(location));

      // Also save clock-in status to ensure continuity
      localStorage.setItem("isClockedIn", this.state.clockedIn.toString());
    } catch (error) {
      console.error("Error saving location to storage:", error);
    }

    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => {
      try {
        listener({ ...this.state });
      } catch (error) {
        console.error("Error notifying location listener:", error);
      }
    });
  }

  subscribe(listener: (state: LocationPermissionState) => void): () => void {
    this.listeners.add(listener);

    // Immediately notify with current state
    listener({ ...this.state });

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  getCurrentLocation(): LocationData | null {
    return this.state.lastKnownLocation;
  }

  getPermissionStatus(): LocationPermissionState["status"] {
    return this.state.status;
  }

  isTracking(): boolean {
    return this.state.isTracking;
  }

  isClockedIn(): boolean {
    return this.state.clockedIn;
  }

  // Manual location update for cases where GPS might not be available
  async updateLocationManually(): Promise<boolean> {
    if (!navigator.geolocation) {
      console.log('Geolocation not available, using fallback location');
      this.setFallbackLocation();
      return true;
    }

    try {
      // Use the improved geolocationUtils with progressive timeout strategy
      const { geolocationUtils } = await import("@/utils/geolocationUtils");
      const result = await geolocationUtils.getCurrentPosition();

      this.updateLocation({
        latitude: result.latitude,
        longitude: result.longitude,
        timestamp: Date.now(),
        accuracy: result.accuracy,
        address:
          result.address ||
          `${result.latitude.toFixed(6)}, ${result.longitude.toFixed(6)}`,
      });
      return true;
    } catch (error: any) {
      console.error("Manual location update error:", {
        code: error.code || "unknown",
        message: error.message || "Unknown error",
        userMessage: error.userMessage || "Location update failed",
        timestamp: new Date().toISOString(),
      });

      // If manual update fails, use fallback
      console.log('Manual location update failed, using fallback location');
      this.setFallbackLocation();
      return true;
    }
  }

  // Retry location access for work phones
  async retryLocationAccess(): Promise<boolean> {
    console.log('Retrying location access for work phone...');
    return await this.forceLocationAccess();
  }

  // For emergency use only - work phones should always have location
  emergencyClockInWithoutLocation(): {success: boolean, message: string} {
    console.warn('Emergency clock-in attempted - this should not be needed for work phones');

    // Log this event for IT review
    this.logEmergencyClockIn();

    return {
      success: false,
      message: 'Location required for work phone. Contact IT support if GPS is not working.'
    };
  }

  private logEmergencyClockIn(): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event: 'EMERGENCY_CLOCK_IN_ATTEMPTED',
      userAgent: navigator.userAgent,
      reason: 'Location access failed on work phone'
    };

    // Store for IT review
    try {
      const logs = JSON.parse(localStorage.getItem('emergencyLogs') || '[]');
      logs.push(logEntry);
      localStorage.setItem('emergencyLogs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to log emergency event:', error);
    }
  }
}

// Create singleton instance
export const locationService = new LocationService();
