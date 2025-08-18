interface LogoutEvent {
  technicianId: string;
  logoutTime: string;
  clockOutTime: string;
  reason:
    | "manual_logout"
    | "session_timeout"
    | "tab_close"
    | "browser_close"
    | "network_disconnect";
  workingHours: number;
  distanceTraveled: number;
  overtimeHours?: number;
  activeJob?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

class LogoutDetectionService {
  private static instance: LogoutDetectionService;
  private isActive = false;
  private technicianId: string | null = null;
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private lastActivity = Date.now();
  private readonly INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly HEARTBEAT_INTERVAL = 60 * 1000; // 1 minute
  private beforeUnloadListener: ((event: BeforeUnloadEvent) => void) | null =
    null;
  private visibilityChangeListener: (() => void) | null = null;

  static getInstance(): LogoutDetectionService {
    if (!LogoutDetectionService.instance) {
      LogoutDetectionService.instance = new LogoutDetectionService();
    }
    return LogoutDetectionService.instance;
  }

  // Start logout detection
  startDetection(technicianId: string): void {
    if (this.isActive) {
      console.log("Logout detection already active");
      return;
    }

    this.technicianId = technicianId;
    this.isActive = true;
    this.lastActivity = Date.now();

    console.log("Logout detection started for technician:", technicianId);

    // Set up various detection mechanisms
    this.setupBeforeUnloadListener();
    this.setupVisibilityChangeListener();
    this.setupActivityTracking();
    this.setupSessionChecking();
    this.setupHeartbeat();

    // Register session start
    this.registerSessionStart();
  }

  // Stop logout detection
  stopDetection(): void {
    if (!this.isActive) return;

    this.cleanup();
    this.isActive = false;
    this.technicianId = null;

    console.log("Logout detection stopped");
  }

  // Setup before unload listener (browser close/tab close)
  private setupBeforeUnloadListener(): void {
    this.beforeUnloadListener = (event: BeforeUnloadEvent) => {
      // Only trigger if technician is clocked in
      const isClockedIn = localStorage.getItem("isClockedIn") === "true";
      if (isClockedIn && this.technicianId) {
        // Trigger immediate clock out
        this.handleLogout("browser_close");

        // Show confirmation dialog
        const message =
          "You are currently clocked in. Closing this tab will automatically clock you out. Are you sure?";
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", this.beforeUnloadListener);
  }

  // Setup visibility change listener (tab switch/minimize)
  private setupVisibilityChangeListener(): void {
    this.visibilityChangeListener = () => {
      if (document.hidden) {
        // Tab hidden - start monitoring for extended absence
        this.startExtendedAbsenceCheck();
      } else {
        // Tab visible again - reset activity
        this.updateActivity();
      }
    };

    document.addEventListener(
      "visibilitychange",
      this.visibilityChangeListener,
    );
  }

  // Setup activity tracking (mouse, keyboard, touch)
  private setupActivityTracking(): void {
    const updateActivity = () => this.updateActivity();

    // Track various user activities
    document.addEventListener("mousedown", updateActivity);
    document.addEventListener("mousemove", updateActivity);
    document.addEventListener("keypress", updateActivity);
    document.addEventListener("scroll", updateActivity);
    document.addEventListener("touchstart", updateActivity);
  }

  // Setup session checking
  private setupSessionChecking(): void {
    this.sessionCheckInterval = setInterval(() => {
      this.checkSessionValidity();
    }, 60000); // Check every minute
  }

  // Setup heartbeat to server
  private setupHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat();
    }, this.HEARTBEAT_INTERVAL);
  }

  // Start extended absence check when tab is hidden
  private startExtendedAbsenceCheck(): void {
    setTimeout(() => {
      // If tab is still hidden after timeout and user is clocked in
      if (document.hidden && localStorage.getItem("isClockedIn") === "true") {
        console.log("Extended absence detected, auto-clocking out...");
        this.handleLogout("session_timeout");
      }
    }, this.INACTIVITY_TIMEOUT);
  }

  // Update last activity timestamp
  private updateActivity(): void {
    this.lastActivity = Date.now();
  }

  // Check session validity
  private checkSessionValidity(): void {
    const now = Date.now();
    const timeSinceActivity = now - this.lastActivity;

    // Check for inactivity timeout
    if (timeSinceActivity > this.INACTIVITY_TIMEOUT) {
      const isClockedIn = localStorage.getItem("isClockedIn") === "true";
      if (isClockedIn) {
        console.log("Inactivity timeout detected, auto-clocking out...");
        this.handleLogout("session_timeout");
      }
    }
  }

  // Send heartbeat to server
  private async sendHeartbeat(): Promise<void> {
    if (!this.technicianId) return;

    try {
      const response = await fetch("/api/session/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicianId: this.technicianId,
          timestamp: new Date().toISOString(),
          isActive: !document.hidden,
          lastActivity: new Date(this.lastActivity).toISOString(),
        }),
      });

      if (!response.ok) {
        console.warn("Heartbeat failed, session may be invalid");
        // Could trigger logout if server indicates session is invalid
      }
    } catch (error) {
      console.error("Heartbeat error:", error);
    }
  }

  // Handle logout event
  private async handleLogout(reason: LogoutEvent["reason"]): Promise<void> {
    if (!this.technicianId) return;

    try {
      // Get current session data
      const clockInTime = localStorage.getItem("clockInTime");
      const isClockedIn = localStorage.getItem("isClockedIn") === "true";

      if (!isClockedIn || !clockInTime) {
        console.log("User not clocked in, skipping auto clock-out");
        return;
      }

      const now = new Date();
      const clockIn = new Date(clockInTime);
      const workingHours =
        (now.getTime() - clockIn.getTime()) / (1000 * 60 * 60);

      // Get current location if available
      let currentLocation;
      try {
        if (navigator.geolocation) {
          currentLocation = await this.getCurrentLocation();
        }
      } catch (error) {
        console.warn("Could not get location for logout event:", error);
      }

      // Create logout event
      const logoutEvent: LogoutEvent = {
        technicianId: this.technicianId,
        logoutTime: now.toISOString(),
        clockOutTime: now.toISOString(),
        reason,
        workingHours,
        distanceTraveled: this.getDistanceTraveled(),
        location: currentLocation,
      };

      // Get active job if any
      const activeJob = this.getActiveJob();
      if (activeJob) {
        logoutEvent.activeJob = activeJob;
      }

      // Check for overtime
      if (workingHours > 8) {
        logoutEvent.overtimeHours = workingHours - 8;
      }

      // Perform clock out
      await this.performClockOut(logoutEvent);

      // Update local storage
      localStorage.setItem("isClockedIn", "false");
      localStorage.removeItem("clockInTime");

      // Send logout event to server
      await this.sendLogoutEvent(logoutEvent);

      console.log("Auto clock-out completed:", logoutEvent);
    } catch (error) {
      console.error("Error handling logout:", error);
    }
  }

  // Perform clock out operations
  private async performClockOut(logoutEvent: LogoutEvent): Promise<void> {
    // Check if we're online before attempting API calls
    if (!navigator.onLine) {
      console.warn("Device is offline, skipping clock-out API call");
      return;
    }

    try {
      // Try to use the database clock records endpoint
      const clockRecord = {
        technicianId: logoutEvent.technicianId,
        date: new Date().toISOString().split("T")[0],
        clockOutTime: logoutEvent.clockOutTime,
        totalWorkingHours: logoutEvent.workingHours,
        totalDistance: logoutEvent.distanceTraveled || 0,
        reason: logoutEvent.reason,
        autoClockOut: true,
        location: logoutEvent.location,
      };

      // Set a timeout for the fetch request to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      try {
        const response = await fetch("/api/db/clock-records", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(clockRecord),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          console.log("Auto clock-out recorded successfully in database");
        } else {
          const errorText = await response.text().catch(() => "Unknown error");
          console.warn(
            `Failed to record auto clock-out in database (${response.status}): ${errorText}`,
          );
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);

        if (fetchError instanceof Error) {
          if (fetchError.name === 'AbortError') {
            console.warn("Clock-out API request timed out after 5 seconds");
          } else if (fetchError.message.includes('Failed to fetch')) {
            console.warn("Network error during clock-out API call - server may be unreachable");
          } else {
            console.warn("Fetch error during clock-out:", fetchError.message);
          }
        } else {
          console.warn("Unknown fetch error during clock-out:", fetchError);
        }
        // Don't re-throw - allow the logout process to continue
      }
    } catch (error) {
      console.warn(
        "Error performing clock out API call, proceeding with local storage update:",
        error,
      );
      // Don't throw error - allow the logout process to continue even if API fails
    }
  }

  // Send logout event for tracking and notifications
  private async sendLogoutEvent(logoutEvent: LogoutEvent): Promise<void> {
    try {
      // Try to send logout event
      const eventResponse = await fetch("/api/events/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logoutEvent),
      });

      if (eventResponse.ok) {
        console.log("Logout event sent successfully");
      } else {
        console.warn("Failed to send logout event, but continuing");
      }

      // Try to send notification using existing notifications endpoint
      const notificationResponse = await fetch("/api/notifications/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicianId: logoutEvent.technicianId,
          type: "auto_clockout",
          title: "Auto Clock-Out Detected",
          message: `Technician automatically clocked out. Reason: ${logoutEvent.reason}. Hours worked: ${logoutEvent.workingHours.toFixed(1)}h`,
          priority: "medium",
          timestamp: logoutEvent.logoutTime,
        }),
      });

      if (notificationResponse.ok) {
        console.log("Auto clock-out notification sent successfully");
      } else {
        console.warn(
          "Failed to send auto clock-out notification, but continuing",
        );
      }
    } catch (error) {
      // Handle specific fetch errors
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        console.warn("Network error sending logout event - server may be unreachable (non-critical)");
      } else {
        console.warn("Error sending logout event (non-critical):", error);
      }
      // Don't throw error - this is not critical for the logout process
    }
  }

  // Register session start
  private async registerSessionStart(): Promise<void> {
    if (!this.technicianId) return;

    try {
      await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicianId: this.technicianId,
          sessionStart: new Date().toISOString(),
          userAgent: navigator.userAgent,
          sessionId: this.generateSessionId(),
        }),
      });
    } catch (error) {
      console.error("Error registering session start:", error);
    }
  }

  // Get current location
  private getCurrentLocation(): Promise<
    { latitude: number; longitude: number } | undefined
  > {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(undefined);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Could not get location:", error);
          resolve(undefined);
        },
        {
          timeout: 10000,
          maximumAge: 60000,
        },
      );
    });
  }

  // Get distance traveled (placeholder - would integrate with location tracking service)
  private getDistanceTraveled(): number {
    // This would integrate with the location tracking service
    // For now, return a placeholder value
    return parseFloat(localStorage.getItem("distanceTraveled") || "0");
  }

  // Get active job (placeholder - would integrate with job management)
  private getActiveJob(): string | undefined {
    // This would check for currently active jobs
    // For now, return placeholder
    return undefined;
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Cleanup all listeners and intervals
  private cleanup(): void {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    if (this.beforeUnloadListener) {
      window.removeEventListener("beforeunload", this.beforeUnloadListener);
      this.beforeUnloadListener = null;
    }

    if (this.visibilityChangeListener) {
      document.removeEventListener(
        "visibilitychange",
        this.visibilityChangeListener,
      );
      this.visibilityChangeListener = null;
    }

    // Remove activity listeners
    const updateActivity = () => this.updateActivity();
    document.removeEventListener("mousedown", updateActivity);
    document.removeEventListener("mousemove", updateActivity);
    document.removeEventListener("keypress", updateActivity);
    document.removeEventListener("scroll", updateActivity);
    document.removeEventListener("touchstart", updateActivity);
  }

  // Public methods
  isDetectionActive(): boolean {
    return this.isActive;
  }

  forceLogout(): void {
    if (this.isActive && this.technicianId) {
      this.handleLogout("manual_logout");
    }
  }

  getLastActivity(): Date {
    return new Date(this.lastActivity);
  }

  getTimeSinceActivity(): number {
    return Date.now() - this.lastActivity;
  }
}

// Export singleton instance
export const logoutDetectionService = LogoutDetectionService.getInstance();
export type { LogoutEvent };
