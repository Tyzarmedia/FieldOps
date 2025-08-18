export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  timestamp: number;
  accuracy?: number;
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

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.state.status = "granted";
          this.updateLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now(),
            accuracy: position.coords.accuracy,
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
          });
          this.notifyListeners();
          resolve(true);
        },
        (error) => {
          console.error("Location permission error:", error);
          this.state.status = error.code === 1 ? "denied" : "unknown";
          this.notifyListeners();
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000,
        },
      );
    });
  }

  async handleClockIn(): Promise<boolean> {
    this.state.clockedIn = true;

    // Request location permission during clock-in
    const permissionGranted = await this.requestLocationPermission();

    if (permissionGranted) {
      // Start continuous tracking
      this.startTracking();
      return true;
    }

    // Even if permission denied, allow clock-in but without tracking
    this.notifyListeners();
    return false; // Returns false to indicate location permission was denied
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
        console.error("Location tracking error:", error);
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
      return false;
    }

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.updateLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            timestamp: Date.now(),
            accuracy: position.coords.accuracy,
            address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
          });
          resolve(true);
        },
        (error) => {
          console.error("Manual location update error:", error);
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 1000,
        },
      );
    });
  }
}

// Create singleton instance
export const locationService = new LocationService();
