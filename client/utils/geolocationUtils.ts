import { logError, getUserFriendlyErrorMessage } from "./errorUtils";

interface LocationResult {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}

interface GeolocationError {
  code: number;
  message: string;
  userMessage: string;
}

class GeolocationUtils {
  private static instance: GeolocationUtils;
  private watchId: number | null = null;

  static getInstance(): GeolocationUtils {
    if (!GeolocationUtils.instance) {
      GeolocationUtils.instance = new GeolocationUtils();
    }
    return GeolocationUtils.instance;
  }

  /**
   * Check if geolocation is supported
   */
  isGeolocationSupported(): boolean {
    return "geolocation" in navigator;
  }

  /**
   * Check geolocation permission status
   */
  async checkPermission(): Promise<
    "granted" | "denied" | "prompt" | "unknown"
  > {
    try {
      if ("permissions" in navigator) {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });
        return permission.state;
      }
      return "unknown";
    } catch (error) {
      console.warn("Permission API not supported");
      return "unknown";
    }
  }

  /**
   * Request geolocation permission
   */
  async requestPermission(): Promise<boolean> {
    try {
      const permissionStatus = await this.checkPermission();

      if (permissionStatus === "denied") {
        console.error("Geolocation permission denied");
        return false;
      }

      return true;
    } catch (error) {
      console.warn(
        "Could not check permission, proceeding with geolocation request",
      );
      return true;
    }
  }

  /**
   * Get current position with progressive timeout strategy
   */
  async getCurrentPosition(options?: PositionOptions): Promise<LocationResult> {
    return new Promise((resolve, reject) => {
      if (!this.isGeolocationSupported()) {
        reject(
          this.createError(
            0,
            "Geolocation not supported",
            "Your browser does not support location services",
          ),
        );
        return;
      }

      // Progressive timeout strategy - try multiple approaches
      const strategies = [
        {
          name: "Quick high accuracy",
          options: {
            enableHighAccuracy: true,
            timeout: 8000,
            maximumAge: 30000,
          }
        },
        {
          name: "Extended high accuracy",
          options: {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 60000,
          }
        },
        {
          name: "Fast low accuracy",
          options: {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 120000,
          }
        },
        {
          name: "Extended low accuracy",
          options: {
            enableHighAccuracy: false,
            timeout: 30000,
            maximumAge: 300000, // 5 minutes
          }
        }
      ];

      // Apply any custom options to all strategies
      if (options) {
        strategies.forEach(strategy => {
          strategy.options = { ...strategy.options, ...options };
        });
      }

      let currentStrategy = 0;

      const handleSuccess = (position: GeolocationPosition) => {
        const result: LocationResult = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        console.log(`✅ Location acquired using strategy: ${strategies[currentStrategy]?.name || 'unknown'}`);
        resolve(result);
      };

      const tryNextStrategy = () => {
        if (currentStrategy >= strategies.length) {
          // All strategies failed
          reject(this.createError(
            3,
            "All location strategies failed",
            "Unable to get your location after multiple attempts. Please check your GPS signal, move to an area with better reception, or enter your location manually."
          ));
          return;
        }

        const strategy = strategies[currentStrategy];
        console.log(`🔄 Trying location strategy ${currentStrategy + 1}/${strategies.length}: ${strategy.name}`);

        const handleError = (error: GeolocationPositionError) => {
          console.log(`❌ Strategy "${strategy.name}" failed:`, {
            code: error.code,
            message: error.message,
            strategy: strategy.name
          });

          // If it's a timeout and we have more strategies, try the next one
          if (error.code === error.TIMEOUT && currentStrategy < strategies.length - 1) {
            currentStrategy++;
            setTimeout(tryNextStrategy, 1000); // Brief delay before next attempt
          } else if (error.code === error.PERMISSION_DENIED) {
            // Permission denied - don't try other strategies
            reject(this.parseGeolocationError(error));
          } else if (currentStrategy < strategies.length - 1) {
            // Other errors - try next strategy
            currentStrategy++;
            setTimeout(tryNextStrategy, 1000);
          } else {
            // Final strategy failed
            reject(this.parseGeolocationError(error));
          }
        };

        navigator.geolocation.getCurrentPosition(
          handleSuccess,
          handleError,
          strategy.options
        );
      };

      // Start with the first strategy
      tryNextStrategy();
    });
  }

  /**
   * Watch position with error handling
   */
  watchPosition(
    onSuccess: (location: LocationResult) => void,
    onError: (error: GeolocationError) => void,
    options?: PositionOptions,
  ): number | null {
    if (!this.isGeolocationSupported()) {
      onError(
        this.createError(
          0,
          "Geolocation not supported",
          "Your browser does not support location services",
        ),
      );
      return null;
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5000,
      ...options,
    };

    const handleSuccess = (position: GeolocationPosition) => {
      const result: LocationResult = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };
      onSuccess(result);
    };

    const handleError = (error: GeolocationPositionError) => {
      onError(this.parseGeolocationError(error));
    };

    this.watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      defaultOptions,
    );

    return this.watchId;
  }

  /**
   * Clear position watch
   */
  clearWatch(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Calculate distance between two points using Haversine formula
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.degToRad(lat2 - lat1);
    const dLon = this.degToRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degToRad(lat1)) *
        Math.cos(this.degToRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  /**
   * Check if user is within radius of target location
   */
  isWithinRadius(
    userLat: number,
    userLon: number,
    targetLat: number,
    targetLon: number,
    radiusKm: number,
  ): boolean {
    const distance = this.calculateDistance(
      userLat,
      userLon,
      targetLat,
      targetLon,
    );
    return distance <= radiusKm;
  }

  /**
   * Get default location (fallback)
   */
  getDefaultLocation(): LocationResult {
    return {
      latitude: -33.0197, // East London, South Africa
      longitude: 27.9117,
      address: "Default Location (East London)",
    };
  }

  /**
   * Parse geolocation error into user-friendly format
   */
  private parseGeolocationError(
    error: GeolocationPositionError,
  ): GeolocationError {
    let userMessage = "";
    let message = "";

    switch (error.code) {
      case error.PERMISSION_DENIED:
        message = "User denied the request for Geolocation";
        userMessage =
          "Location access denied. Please enable location permissions in your browser settings.";
        break;
      case error.POSITION_UNAVAILABLE:
        message = "Location information is unavailable";
        userMessage =
          "Location unavailable. Please check your GPS signal or network connection.";
        break;
      case error.TIMEOUT:
        message = "The request to get user location timed out";
        userMessage =
          "Location request timed out. Please check your connection and try again.";
        break;
      default:
        message = "An unknown error occurred while retrieving location";
        userMessage =
          "Unable to get your location. Please try again or enter your location manually.";
        break;
    }

    return {
      code: error.code,
      message,
      userMessage,
    };
  }

  /**
   * Create custom error
   */
  private createError(
    code: number,
    message: string,
    userMessage: string,
  ): GeolocationError {
    return { code, message, userMessage };
  }

  /**
   * Convert degrees to radians
   */
  private degToRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Format coordinates for display
   */
  formatCoordinates(lat: number, lon: number, precision: number = 6): string {
    return `${lat.toFixed(precision)}, ${lon.toFixed(precision)}`;
  }

  /**
   * Log geolocation error with proper formatting for debugging
   */
  logGeolocationError(error: GeolocationPositionError, context?: string): void {
    const contextStr = context ? ` - ${context}` : "";

    // Create properly formatted error info for logging
    const errorInfo = {
      code: error.code,
      codeName: this.getErrorCodeName(error.code),
      message: error.message,
      userMessage: this.parseGeolocationError(error).userMessage,
      timestamp: new Date().toISOString(),
      context: contextStr,
    };

    console.error(`Geolocation Error${contextStr}:`, errorInfo);

    // Also log to standard error util for consistency
    logError(errorInfo, `Geolocation${contextStr}`);
  }

  /**
   * Get human-readable error code name
   */
  private getErrorCodeName(code: number): string {
    switch (code) {
      case 1:
        return "PERMISSION_DENIED";
      case 2:
        return "POSITION_UNAVAILABLE";
      case 3:
        return "TIMEOUT";
      default:
        return "UNKNOWN_ERROR";
    }
  }

  /**
   * Mock reverse geocoding (replace with real service in production)
   */
  async reverseGeocode(lat: number, lon: number): Promise<string> {
    try {
      // Mock implementation - replace with real geocoding service
      return `Location: ${this.formatCoordinates(lat, lon, 4)}`;

      /* Real implementation example:
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lon}&key=YOUR_API_KEY`
      );
      const data = await response.json();
      
      if (data.results && data.results[0]) {
        return data.results[0].formatted;
      }
      
      return this.formatCoordinates(lat, lon, 4);
      */
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return this.formatCoordinates(lat, lon, 4);
    }
  }

  /**
   * Mock forward geocoding (replace with real service in production)
   */
  async geocodeAddress(address: string): Promise<LocationResult | null> {
    try {
      if (!address.trim()) {
        throw new Error("Address is required");
      }

      // Mock implementation - replace with real geocoding service
      const mockLocation: LocationResult = {
        latitude: -33.0197 + (Math.random() - 0.5) * 0.01,
        longitude: 27.9117 + (Math.random() - 0.5) * 0.01,
        address: address.trim(),
      };

      return mockLocation;

      /* Real implementation example:
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=YOUR_API_KEY`
      );
      const data = await response.json();

      if (data.results && data.results[0]) {
        const result = data.results[0];
        return {
          latitude: result.geometry.lat,
          longitude: result.geometry.lng,
          address: result.formatted,
        };
      }

      return null;
      */
    } catch (error) {
      console.error("Geocoding failed:", error);
      return null;
    }
  }
}

// Export singleton instance
export const geolocationUtils = GeolocationUtils.getInstance();
export type { LocationResult, GeolocationError };
