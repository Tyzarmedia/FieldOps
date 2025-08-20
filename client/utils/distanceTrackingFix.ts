import { locationTrackingService } from "@/services/locationTrackingService";
import { geolocationUtils } from "@/utils/geolocationUtils";

interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy?: number;
}

class DistanceTrackingFix {
  private static instance: DistanceTrackingFix;
  private locationHistory: LocationPoint[] = [];
  private totalDistance: number = 0;
  private lastPosition: LocationPoint | null = null;
  private trackingInterval: number | null = null;
  private isTracking: boolean = false;

  static getInstance(): DistanceTrackingFix {
    if (!DistanceTrackingFix.instance) {
      DistanceTrackingFix.instance = new DistanceTrackingFix();
    }
    return DistanceTrackingFix.instance;
  }

  constructor() {
    this.loadStoredData();
  }

  private loadStoredData(): void {
    try {
      const storedHistory = localStorage.getItem('distanceTrackingHistory');
      const storedDistance = localStorage.getItem('totalDistanceTraveled');
      
      if (storedHistory) {
        this.locationHistory = JSON.parse(storedHistory);
      }
      
      if (storedDistance) {
        this.totalDistance = parseFloat(storedDistance);
      }

      // Get last position
      if (this.locationHistory.length > 0) {
        this.lastPosition = this.locationHistory[this.locationHistory.length - 1];
      }

      console.log('Distance tracking data loaded:', {
        historyPoints: this.locationHistory.length,
        totalDistance: this.totalDistance,
        lastPosition: this.lastPosition
      });
    } catch (error) {
      console.error('Error loading distance tracking data:', error);
    }
  }

  private saveData(): void {
    try {
      localStorage.setItem('distanceTrackingHistory', JSON.stringify(this.locationHistory));
      localStorage.setItem('totalDistanceTraveled', this.totalDistance.toString());
      localStorage.setItem('distanceTraveled', this.totalDistance.toFixed(1));
    } catch (error) {
      console.error('Error saving distance tracking data:', error);
    }
  }

  async startTracking(employeeId: string): Promise<boolean> {
    if (this.isTracking) {
      console.log('Distance tracking already active');
      return true;
    }

    try {
      console.log('Starting enhanced distance tracking...');

      // Check if geolocation is available
      if (!geolocationUtils.isGeolocationSupported()) {
        console.error('Geolocation not supported');
        return false;
      }

      // Request permission
      const hasPermission = await geolocationUtils.requestPermission();
      if (!hasPermission) {
        console.warn('Location permission denied - will use fallback tracking');
        // Don't return false - allow fallback tracking
      }

      // Start location tracking with enhanced error handling
      this.isTracking = true;
      this.startLocationTracking();

      // Also start the original location tracking service
      await locationTrackingService.startTracking(employeeId);

      console.log('Enhanced distance tracking started successfully');
      return true;
    } catch (error) {
      console.error('Error starting distance tracking:', error);
      return false;
    }
  }

  private startLocationTracking(): void {
    // Clear any existing interval
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
    }

    // Track location every 30 seconds
    this.trackingInterval = setInterval(async () => {
      await this.updateLocation();
    }, 30000);

    // Get initial location
    this.updateLocation();
  }

  private async updateLocation(): Promise<void> {
    try {
      const position = await geolocationUtils.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 30000
      });

      const newPoint: LocationPoint = {
        latitude: position.latitude,
        longitude: position.longitude,
        timestamp: new Date().toISOString(),
        accuracy: position.accuracy
      };

      this.addLocationPoint(newPoint);
    } catch (error: any) {
      console.warn('Location update failed:', error.message);
      
      // Try with lower accuracy
      try {
        const position = await geolocationUtils.getCurrentPosition({
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 60000
        });

        const newPoint: LocationPoint = {
          latitude: position.latitude,
          longitude: position.longitude,
          timestamp: new Date().toISOString(),
          accuracy: position.accuracy
        };

        this.addLocationPoint(newPoint);
      } catch (fallbackError: any) {
        console.error('Fallback location update also failed:', fallbackError.message);
      }
    }
  }

  private addLocationPoint(newPoint: LocationPoint): void {
    // Calculate distance from last position
    if (this.lastPosition) {
      const distance = geolocationUtils.calculateDistance(
        this.lastPosition.latitude,
        this.lastPosition.longitude,
        newPoint.latitude,
        newPoint.longitude
      );

      // Only add distance if it's reasonable (between 0.001km and 1km per update)
      // This filters out GPS noise and unrealistic jumps
      if (distance >= 0.001 && distance <= 1.0) {
        this.totalDistance += distance;
        console.log(`Distance added: ${distance.toFixed(3)}km, Total: ${this.totalDistance.toFixed(3)}km`);
      } else if (distance > 1.0) {
        console.warn(`Unrealistic distance jump detected: ${distance.toFixed(3)}km - ignoring`);
      }
    }

    // Add to history
    this.locationHistory.push(newPoint);
    this.lastPosition = newPoint;

    // Keep only last 100 points
    if (this.locationHistory.length > 100) {
      this.locationHistory = this.locationHistory.slice(-100);
    }

    // Save data
    this.saveData();

    console.log('Location updated:', {
      position: `${newPoint.latitude.toFixed(6)}, ${newPoint.longitude.toFixed(6)}`,
      accuracy: newPoint.accuracy,
      totalDistance: this.totalDistance.toFixed(3)
    });
  }

  stopTracking(): void {
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
    }

    this.isTracking = false;
    locationTrackingService.stopTracking();
    
    console.log('Distance tracking stopped');
  }

  getTotalDistance(): number {
    return this.totalDistance;
  }

  getLocationHistory(): LocationPoint[] {
    return [...this.locationHistory];
  }

  isActivelyTracking(): boolean {
    return this.isTracking;
  }

  // Reset all tracking data (useful for new day or testing)
  resetTracking(): void {
    this.locationHistory = [];
    this.totalDistance = 0;
    this.lastPosition = null;
    
    localStorage.removeItem('distanceTrackingHistory');
    localStorage.removeItem('totalDistanceTraveled');
    localStorage.setItem('distanceTraveled', '0.0');
    
    console.log('Distance tracking data reset');
  }

  // Get tracking statistics
  getTrackingStats(): {
    totalDistance: number;
    locationPoints: number;
    isTracking: boolean;
    lastUpdate: string | null;
    averageAccuracy: number;
  } {
    const averageAccuracy = this.locationHistory.length > 0
      ? this.locationHistory
          .filter(p => p.accuracy !== undefined)
          .reduce((sum, p) => sum + (p.accuracy || 0), 0) / this.locationHistory.length
      : 0;

    return {
      totalDistance: this.totalDistance,
      locationPoints: this.locationHistory.length,
      isTracking: this.isTracking,
      lastUpdate: this.lastPosition?.timestamp || null,
      averageAccuracy
    };
  }
}

// Export singleton instance
export const distanceTrackingFix = DistanceTrackingFix.getInstance();
export type { LocationPoint };
