import { geolocationUtils, LocationResult } from "@/utils/geolocationUtils";

interface JobLocation {
  id: string;
  jobId: string;
  latitude: number;
  longitude: number;
  address: string;
  radius: number; // in meters
}

interface LocationUpdate {
  latitude: number;
  longitude: number;
  timestamp: string;
  accuracy: number;
  technicianId: string;
  isNearJob?: boolean;
  nearJobId?: string;
  distance?: number;
}

interface AutoStartConfig {
  proximityRadius: number; // meters
  proximityDuration: number; // seconds
  enabled: boolean;
}

class LocationTrackingService {
  private static instance: LocationTrackingService;
  private watchId: number | null = null;
  private isTracking = false;
  private currentLocation: LocationResult | null = null;
  private nearbyJobs: JobLocation[] = [];
  private autoStartConfig: AutoStartConfig = {
    proximityRadius: 100, // 100 meters
    proximityDuration: 120, // 2 minutes
    enabled: true,
  };
  private proximityTimers: Map<string, number> = new Map();
  private locationHistory: LocationUpdate[] = [];
  private trackingCallbacks: ((location: LocationResult) => void)[] = [];

  static getInstance(): LocationTrackingService {
    if (!LocationTrackingService.instance) {
      LocationTrackingService.instance = new LocationTrackingService();
    }
    return LocationTrackingService.instance;
  }

  // Start comprehensive location tracking
  async startTracking(technicianId: string): Promise<boolean> {
    try {
      if (this.isTracking) {
        console.log("Location tracking already active");
        return true;
      }

      // Check and request permissions
      const hasPermission = await geolocationUtils.requestPermission();
      if (!hasPermission) {
        console.error("Location permission denied");
        return false;
      }

      // Load job locations for proximity detection
      await this.loadJobLocations(technicianId);

      // Start continuous tracking
      this.watchId = geolocationUtils.watchPosition(
        (location) => this.handleLocationUpdate(location, technicianId),
        (error) => this.handleLocationError(error),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5000,
        },
      );

      if (this.watchId !== null) {
        this.isTracking = true;
        console.log("Location tracking started successfully");
        return true;
      } else {
        console.error("Failed to start location tracking");
        return false;
      }
    } catch (error) {
      console.error("Error starting location tracking:", error);
      return false;
    }
  }

  // Stop location tracking
  stopTracking(): void {
    if (this.watchId !== null) {
      geolocationUtils.clearWatch();
      this.watchId = null;
    }
    this.isTracking = false;
    this.clearAllProximityTimers();
    console.log("Location tracking stopped");
  }

  // Add callback for location updates
  addLocationCallback(callback: (location: LocationResult) => void): void {
    this.trackingCallbacks.push(callback);
  }

  // Remove callback
  removeLocationCallback(callback: (location: LocationResult) => void): void {
    const index = this.trackingCallbacks.indexOf(callback);
    if (index > -1) {
      this.trackingCallbacks.splice(index, 1);
    }
  }

  // Get current location
  getCurrentLocation(): LocationResult | null {
    return this.currentLocation;
  }

  // Check if near any job location
  isNearAnyJob(): { isNear: boolean; jobId?: string; distance?: number } {
    if (!this.currentLocation) {
      return { isNear: false };
    }

    for (const job of this.nearbyJobs) {
      const distance =
        geolocationUtils.calculateDistance(
          this.currentLocation.latitude,
          this.currentLocation.longitude,
          job.latitude,
          job.longitude,
        ) * 1000; // Convert to meters

      if (distance <= job.radius) {
        return { isNear: true, jobId: job.jobId, distance };
      }
    }

    return { isNear: false };
  }

  // Get distance to specific job
  getDistanceToJob(jobId: string): number | null {
    if (!this.currentLocation) return null;

    const job = this.nearbyJobs.find((j) => j.jobId === jobId);
    if (!job) return null;

    return (
      geolocationUtils.calculateDistance(
        this.currentLocation.latitude,
        this.currentLocation.longitude,
        job.latitude,
        job.longitude,
      ) * 1000
    ); // Convert to meters
  }

  // Get location history
  getLocationHistory(): LocationUpdate[] {
    return this.locationHistory.slice(-100); // Return last 100 locations
  }

  // Calculate total distance traveled
  getTotalDistanceTraveled(): number {
    if (this.locationHistory.length < 2) return 0;

    let totalDistance = 0;
    for (let i = 1; i < this.locationHistory.length; i++) {
      const prev = this.locationHistory[i - 1];
      const curr = this.locationHistory[i];

      const distance = geolocationUtils.calculateDistance(
        prev.latitude,
        prev.longitude,
        curr.latitude,
        curr.longitude,
      );

      totalDistance += distance;
    }

    return totalDistance;
  }

  // Update auto-start configuration
  updateAutoStartConfig(config: Partial<AutoStartConfig>): void {
    this.autoStartConfig = { ...this.autoStartConfig, ...config };
  }

  // Load job locations from server
  private async loadJobLocations(technicianId: string): Promise<void> {
    try {
      const response = await fetch(
        `/api/job-mgmt/jobs/technician/${technicianId}/locations`,
      );
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          this.nearbyJobs = result.data.map((job: any) => ({
            id: job.id,
            jobId: job.jobId,
            latitude: job.latitude || job.coordinates?.latitude || -33.0197,
            longitude: job.longitude || job.coordinates?.longitude || 27.9117,
            address: job.address || "Unknown location",
            radius: job.proximityRadius || this.autoStartConfig.proximityRadius,
          }));
          console.log(
            `Loaded ${this.nearbyJobs.length} job locations for proximity detection`,
          );
        }
      }
    } catch (error) {
      console.error("Error loading job locations:", error);
    }
  }

  // Handle location updates
  private async handleLocationUpdate(
    location: LocationResult,
    technicianId: string,
  ): Promise<void> {
    this.currentLocation = location;

    // Create location update record
    const locationUpdate: LocationUpdate = {
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: new Date().toISOString(),
      accuracy: location.accuracy || 0,
      technicianId,
    };

    // Check proximity to jobs
    const proximityCheck = this.isNearAnyJob();
    if (proximityCheck.isNear && proximityCheck.jobId) {
      locationUpdate.isNearJob = true;
      locationUpdate.nearJobId = proximityCheck.jobId;
      locationUpdate.distance = proximityCheck.distance;

      // Handle proximity timer for auto-start
      if (this.autoStartConfig.enabled) {
        this.handleJobProximity(proximityCheck.jobId, technicianId);
      }
    } else {
      // Clear proximity timers if moved away
      this.clearAllProximityTimers();
    }

    // Add to history
    this.locationHistory.push(locationUpdate);

    // Keep only last 100 locations
    if (this.locationHistory.length > 100) {
      this.locationHistory = this.locationHistory.slice(-100);
    }

    // Send location update to server
    await this.sendLocationUpdate(locationUpdate);

    // Notify callbacks
    this.trackingCallbacks.forEach((callback) => {
      try {
        callback(location);
      } catch (error) {
        console.error("Error in location callback:", error);
      }
    });
  }

  // Handle proximity to job location
  private handleJobProximity(jobId: string, technicianId: string): void {
    if (!this.proximityTimers.has(jobId)) {
      // Start proximity timer
      let secondsNear = 0;
      const timerId = setInterval(async () => {
        secondsNear++;

        // Check if still near the job
        const proximityCheck = this.isNearAnyJob();
        if (!proximityCheck.isNear || proximityCheck.jobId !== jobId) {
          // Moved away from job
          clearInterval(timerId);
          this.proximityTimers.delete(jobId);
          return;
        }

        console.log(`Near job ${jobId} for ${secondsNear} seconds`);

        // Auto-start after configured duration
        if (secondsNear >= this.autoStartConfig.proximityDuration) {
          clearInterval(timerId);
          this.proximityTimers.delete(jobId);
          await this.autoStartJob(jobId, technicianId, secondsNear);
        }
      }, 1000);

      this.proximityTimers.set(jobId, timerId);
    }
  }

  // Auto-start job when conditions are met
  private async autoStartJob(
    jobId: string,
    technicianId: string,
    proximitySeconds: number,
  ): Promise<void> {
    try {
      // Check job status first
      const jobResponse = await fetch(`/api/job-mgmt/jobs/${jobId}/status`);
      if (!jobResponse.ok) return;

      const jobResult = await jobResponse.json();
      if (!jobResult.success || jobResult.data.status !== "accepted") {
        console.log(`Job ${jobId} not in accepted status, skipping auto-start`);
        return;
      }

      // Auto-start the job
      const response = await fetch(`/api/job-mgmt/jobs/${jobId}/auto-start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicianId,
          startTime: new Date().toISOString(),
          location: this.currentLocation,
          proximityDuration: proximitySeconds,
          autoStarted: true,
          autoStartReason: `Automatically started after being within ${this.autoStartConfig.proximityRadius}m for ${this.autoStartConfig.proximityDuration} seconds`,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log(`Job ${jobId} auto-started successfully`);

          // Send notification
          await this.sendAutoStartNotification(
            jobId,
            technicianId,
            proximitySeconds,
          );
        }
      }
    } catch (error) {
      console.error("Error auto-starting job:", error);
    }
  }

  // Send auto-start notification
  private async sendAutoStartNotification(
    jobId: string,
    technicianId: string,
    proximitySeconds: number,
  ): Promise<void> {
    try {
      await fetch("/api/notifications/job-auto-started", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          technicianId,
          proximityDuration: proximitySeconds,
          location: this.currentLocation,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Error sending auto-start notification:", error);
    }
  }

  // Send location update to server
  private async sendLocationUpdate(
    locationUpdate: LocationUpdate,
  ): Promise<void> {
    try {
      await fetch("/api/location/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(locationUpdate),
      });
    } catch (error) {
      console.error("Error sending location update:", error);
    }
  }

  // Handle location errors
  private handleLocationError(error: any): void {
    // Log error but continue tracking
    geolocationUtils.logGeolocationError(error, "LocationTrackingService");
  }

  // Clear all proximity timers
  private clearAllProximityTimers(): void {
    this.proximityTimers.forEach((timerId) => {
      clearInterval(timerId);
    });
    this.proximityTimers.clear();
  }

  // Get tracking status
  isLocationTracking(): boolean {
    return this.isTracking;
  }

  // Force refresh job locations
  async refreshJobLocations(technicianId: string): Promise<void> {
    await this.loadJobLocations(technicianId);
  }
}

// Export singleton instance
export const locationTrackingService = LocationTrackingService.getInstance();
export type { LocationUpdate, JobLocation, AutoStartConfig };
