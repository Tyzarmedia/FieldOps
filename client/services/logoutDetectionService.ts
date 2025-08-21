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
    if (!this.technicianId || !navigator.onLine) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch("/api/session/heartbeat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicianId: this.technicianId,
          timestamp: new Date().toISOString(),
          isActive: !document.hidden,
          lastActivity: new Date(this.lastActivity).toISOString(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Endpoint doesn't exist or server error - this is non-critical
        console.log("Heartbeat endpoint not available (non-critical)");
      }
    } catch (error) {
      // Handle network errors gracefully - heartbeat is non-critical
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.log("Heartbeat request timed out (non-critical)");
        } else if (error.message.includes("Failed to fetch")) {
          console.log("Heartbeat network error (non-critical)");
        }
      }
    }
  }

  // Handle logout event
  private async handleLogout(reason: LogoutEvent["reason"]): Promise<void> {
    if (!this.technicianId) return;

    // Wrap the entire logout process in a timeout to prevent hanging
    const logoutPromise = this.performLogoutSequence(reason);
    const timeoutPromise = new Promise<void>((_, reject) => {
      setTimeout(() => reject(new Error("Logout process timed out")), 10000);
    });

    try {
      await Promise.race([logoutPromise, timeoutPromise]);
    } catch (error) {
      console.warn("Logout process failed or timed out:", error);
      // Ensure local storage is always updated
      try {
        localStorage.setItem("isClockedIn", "false");
        localStorage.removeItem("clockInTime");
        console.log("Emergency logout completed via fallback");
      } catch (fallbackError) {
        console.error(
          "Critical: Could not complete emergency logout:",
          fallbackError,
        );
      }
    }
  }

  // Separate method for the actual logout sequence
  private async performLogoutSequence(
    reason: LogoutEvent["reason"],
  ): Promise<void> {
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

      // Perform clock out (with individual error handling)
      try {
        await this.performClockOut(logoutEvent);
      } catch (clockOutError) {
        console.warn(
          "Clock-out API call failed (non-critical):",
          clockOutError,
        );
        // Continue with local storage updates even if API fails
      }

      // Update local storage (always do this regardless of API success)
      try {
        localStorage.setItem("isClockedIn", "false");
        localStorage.removeItem("clockInTime");
        console.log("Local storage updated: clocked out");
      } catch (storageError) {
        console.warn("Failed to update local storage:", storageError);
      }

      // Send logout event to server (with individual error handling)
      try {
        await this.sendLogoutEvent(logoutEvent);
      } catch (eventError) {
        console.warn("Failed to send logout event (non-critical):", eventError);
      }

      console.log("Auto clock-out completed:", {
        technicianId: logoutEvent.technicianId,
        reason: logoutEvent.reason,
        workingHours: logoutEvent.workingHours,
      });
    } catch (error) {
      console.error("Critical error in logout handling:", error);

      // Ensure local storage is updated even on critical errors
      try {
        localStorage.setItem("isClockedIn", "false");
        localStorage.removeItem("clockInTime");
        console.log("Emergency local storage update completed");
      } catch (emergencyError) {
        console.error("Failed emergency local storage update:", emergencyError);
      }
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
          let errorText = "Unknown error";
          try {
            errorText = await response.text();
          } catch (textError) {
            console.warn("Could not read error response text:", textError);
          }
          console.warn(
            `Failed to record auto clock-out in database (${response.status}): ${errorText}`,
          );
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);

        // Enhanced error logging to help debug the issue
        console.warn("Clock-out API call failed (non-critical):", {
          error: fetchError,
          message:
            fetchError instanceof Error
              ? fetchError.message
              : String(fetchError),
          name: fetchError instanceof Error ? fetchError.name : "Unknown",
          stack: fetchError instanceof Error ? fetchError.stack : undefined,
        });

        // Log specific error types but don't re-throw
        if (fetchError instanceof Error) {
          if (fetchError.name === "AbortError") {
            console.warn(
              "⏰ Clock-out API request timed out after 5 seconds (non-critical)",
            );
          } else if (fetchError.message.includes("Failed to fetch")) {
            console.warn(
              "🌐 Network error during clock-out API call (non-critical - server may be unreachable)",
            );
          } else if (fetchError.message.includes("TypeError")) {
            console.warn(
              "🔧 Type error during clock-out API call (non-critical)",
            );
          } else {
            console.warn(
              "⚠️ Other error during clock-out:",
              fetchError.message,
            );
          }
        }

        // Ensure we don't propagate the error - this is non-critical functionality
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
    // Check if we're online before attempting API calls
    if (!navigator.onLine) {
      console.log("Device is offline, skipping logout event API calls");
      return;
    }

    // Try to send notification using existing notifications endpoint (if available)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

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
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (notificationResponse.ok) {
        console.log("Auto clock-out notification sent successfully");
      } else {
        console.log("Notification endpoint not available (non-critical)");
      }
    } catch (error) {
      // Handle specific fetch errors gracefully - this is non-critical
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.log("Logout notification request timed out (non-critical)");
        } else if (error.message.includes("Failed to fetch")) {
          console.log("Logout notification network error (non-critical)");
        }
      }
    }
  }

  // Register session start
  private async registerSessionStart(): Promise<void> {
    if (!this.technicianId || !navigator.onLine) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      await fetch("/api/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicianId: this.technicianId,
          sessionStart: new Date().toISOString(),
          userAgent: navigator.userAgent,
          sessionId: this.generateSessionId(),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("Session start registered successfully");
    } catch (error) {
      // Handle errors gracefully - session registration is non-critical
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.log("Session start request timed out (non-critical)");
        } else if (error.message.includes("Failed to fetch")) {
          console.log("Session start endpoint not available (non-critical)");
        }
      }
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
          console.warn("Could not get location:", {
            code: error.code,
            message: error.message,
            timestamp: new Date().toISOString(),
          });
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
