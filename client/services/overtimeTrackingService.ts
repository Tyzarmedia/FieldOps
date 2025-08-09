interface OvertimeSession {
  id: string;
  technicianId: string;
  startTime: string;
  endTime?: string;
  totalHours: number;
  isAutoDetected: boolean;
  workOrderNumbers: string[];
  reason: string;
  status: 'pending' | 'approved' | 'declined';
  approvedHours?: number;
  comments?: string;
  rate: number;
  totalAmount: number;
}

interface WorkingHours {
  normalStart: string; // e.g., "08:00"
  normalEnd: string;   // e.g., "17:00"
  normalHoursPerDay: number; // 8
  maxNormalHoursPerWeek: number; // 40
}

interface OvertimeRules {
  afterHours: WorkingHours;
  weekendMultiplier: number; // 1.5x for weekends
  publicHolidayMultiplier: number; // 2x for public holidays
  nightShiftMultiplier: number; // 1.3x for night shift (after 22:00)
  doubleTimeThreshold: number; // 12 hours in a day triggers double time
}

class OvertimeTrackingService {
  private static instance: OvertimeTrackingService;
  private isTracking = false;
  private currentSession: OvertimeSession | null = null;
  private checkInterval: NodeJS.Timeout | null = null;
  private workingHours: WorkingHours = {
    normalStart: "08:00",
    normalEnd: "17:00",
    normalHoursPerDay: 8,
    maxNormalHoursPerWeek: 40,
  };
  private overtimeRules: OvertimeRules = {
    afterHours: this.workingHours,
    weekendMultiplier: 1.5,
    publicHolidayMultiplier: 2.0,
    nightShiftMultiplier: 1.3,
    doubleTimeThreshold: 12,
  };
  private activeWorkOrders: string[] = [];

  static getInstance(): OvertimeTrackingService {
    if (!OvertimeTrackingService.instance) {
      OvertimeTrackingService.instance = new OvertimeTrackingService();
    }
    return OvertimeTrackingService.instance;
  }

  // Start overtime tracking
  startTracking(technicianId: string): void {
    if (this.isTracking) {
      console.log('Overtime tracking already active');
      return;
    }

    this.isTracking = true;
    console.log('Overtime tracking started for technician:', technicianId);

    // Check for overtime conditions every minute
    this.checkInterval = setInterval(() => {
      this.checkOvertimeConditions(technicianId);
    }, 60000); // Check every minute

    // Initial check
    this.checkOvertimeConditions(technicianId);
  }

  // Stop overtime tracking
  stopTracking(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }

    // End current session if active
    if (this.currentSession && !this.currentSession.endTime) {
      this.endOvertimeSession();
    }

    this.isTracking = false;
    console.log('Overtime tracking stopped');
  }

  // Check overtime conditions
  private async checkOvertimeConditions(technicianId: string): Promise<void> {
    try {
      const now = new Date();
      const clockInTime = localStorage.getItem("clockInTime");
      const isClockedIn = localStorage.getItem("isClockedIn") === "true";

      if (!isClockedIn || !clockInTime) {
        // Not clocked in, end any active overtime session
        if (this.currentSession && !this.currentSession.endTime) {
          await this.endOvertimeSession();
        }
        return;
      }

      const clockIn = new Date(clockInTime);
      const hoursWorked = (now.getTime() - clockIn.getTime()) / (1000 * 60 * 60);

      // Check if overtime conditions are met
      const isOvertime = this.isOvertimeCondition(now, clockIn, hoursWorked);

      if (isOvertime && !this.currentSession) {
        // Start new overtime session
        await this.startOvertimeSession(technicianId, clockIn, now);
      } else if (isOvertime && this.currentSession) {
        // Update existing session
        await this.updateOvertimeSession(now);
      } else if (!isOvertime && this.currentSession && !this.currentSession.endTime) {
        // End overtime session
        await this.endOvertimeSession();
      }

    } catch (error) {
      console.error('Error checking overtime conditions:', error);
    }
  }

  // Determine if current conditions qualify as overtime
  private isOvertimeCondition(now: Date, clockIn: Date, hoursWorked: number): boolean {
    // Check if worked more than normal hours per day
    if (hoursWorked > this.workingHours.normalHoursPerDay) {
      return true;
    }

    // Check if working outside normal hours
    const currentTime = this.formatTime(now);
    const isAfterHours = currentTime < this.workingHours.normalStart || currentTime > this.workingHours.normalEnd;
    
    if (isAfterHours) {
      return true;
    }

    // Check if weekend
    const dayOfWeek = now.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
      return true;
    }

    // Check if public holiday (simplified - would need proper holiday calendar)
    if (this.isPublicHoliday(now)) {
      return true;
    }

    return false;
  }

  // Start new overtime session
  private async startOvertimeSession(technicianId: string, clockIn: Date, now: Date): Promise<void> {
    try {
      // Calculate overtime start time
      const normalEndTime = new Date(clockIn);
      normalEndTime.setHours(parseInt(this.workingHours.normalEnd.split(':')[0]));
      normalEndTime.setMinutes(parseInt(this.workingHours.normalEnd.split(':')[1]));

      const overtimeStart = now > normalEndTime ? normalEndTime : clockIn;

      // Get active work orders
      await this.loadActiveWorkOrders(technicianId);

      const session: OvertimeSession = {
        id: `OT-${Date.now()}`,
        technicianId,
        startTime: overtimeStart.toISOString(),
        totalHours: 0,
        isAutoDetected: true,
        workOrderNumbers: [...this.activeWorkOrders],
        reason: this.generateOvertimeReason(now, clockIn),
        status: 'pending',
        rate: await this.getOvertimeRate(technicianId, now),
        totalAmount: 0,
      };

      this.currentSession = session;

      // Save to database
      await this.saveOvertimeSession(session);

      // Send notification
      await this.sendOvertimeNotification(session, 'started');

      console.log('Overtime session started:', session.id);

    } catch (error) {
      console.error('Error starting overtime session:', error);
    }
  }

  // Update existing overtime session
  private async updateOvertimeSession(now: Date): Promise<void> {
    if (!this.currentSession) return;

    try {
      const startTime = new Date(this.currentSession.startTime);
      const hoursWorked = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);

      // Update session
      this.currentSession.totalHours = hoursWorked;
      this.currentSession.totalAmount = hoursWorked * this.currentSession.rate;

      // Update work orders if changed
      await this.loadActiveWorkOrders(this.currentSession.technicianId);
      const newWorkOrders = this.activeWorkOrders.filter(
        wo => !this.currentSession!.workOrderNumbers.includes(wo)
      );
      
      if (newWorkOrders.length > 0) {
        this.currentSession.workOrderNumbers.push(...newWorkOrders);
      }

      // Save updates
      await this.saveOvertimeSession(this.currentSession);

    } catch (error) {
      console.error('Error updating overtime session:', error);
    }
  }

  // End overtime session
  private async endOvertimeSession(): Promise<void> {
    if (!this.currentSession) return;

    try {
      const now = new Date();
      this.currentSession.endTime = now.toISOString();

      const startTime = new Date(this.currentSession.startTime);
      this.currentSession.totalHours = (now.getTime() - startTime.getTime()) / (1000 * 60 * 60);
      this.currentSession.totalAmount = this.currentSession.totalHours * this.currentSession.rate;

      // Save final session
      await this.saveOvertimeSession(this.currentSession);

      // Send notification
      await this.sendOvertimeNotification(this.currentSession, 'ended');

      console.log('Overtime session ended:', this.currentSession.id, `${this.currentSession.totalHours.toFixed(2)} hours`);

      this.currentSession = null;

    } catch (error) {
      console.error('Error ending overtime session:', error);
    }
  }

  // Generate overtime reason
  private generateOvertimeReason(now: Date, clockIn: Date): string {
    const currentTime = this.formatTime(now);
    const dayOfWeek = now.getDay();
    const hoursWorked = (now.getTime() - clockIn.getTime()) / (1000 * 60 * 60);

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return `Weekend work on ${now.toLocaleDateString()}`;
    }

    if (this.isPublicHoliday(now)) {
      return `Public holiday work on ${now.toLocaleDateString()}`;
    }

    if (hoursWorked > this.workingHours.normalHoursPerDay) {
      return `Extended hours - worked beyond ${this.workingHours.normalHoursPerDay} hours`;
    }

    if (currentTime < this.workingHours.normalStart) {
      return `Early start before ${this.workingHours.normalStart}`;
    }

    if (currentTime > this.workingHours.normalEnd) {
      return `Late work after ${this.workingHours.normalEnd}`;
    }

    return 'Overtime work detected automatically';
  }

  // Get overtime rate
  private async getOvertimeRate(technicianId: string, date: Date): Promise<number> {
    try {
      const response = await fetch(`/api/payroll/overtime-rate/${technicianId}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          let baseRate = result.data.hourlyRate || 150; // Default R150/hour

          // Apply multipliers
          const dayOfWeek = date.getDay();
          const hour = date.getHours();

          if (this.isPublicHoliday(date)) {
            baseRate *= this.overtimeRules.publicHolidayMultiplier;
          } else if (dayOfWeek === 0 || dayOfWeek === 6) {
            baseRate *= this.overtimeRules.weekendMultiplier;
          } else if (hour >= 22 || hour < 6) {
            baseRate *= this.overtimeRules.nightShiftMultiplier;
          }

          return baseRate;
        }
      }
    } catch (error) {
      console.error('Error getting overtime rate:', error);
    }

    return 200; // Default rate if API fails
  }

  // Load active work orders
  private async loadActiveWorkOrders(technicianId: string): Promise<void> {
    try {
      const response = await fetch(`/api/job-mgmt/jobs/technician/${technicianId}/active`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          this.activeWorkOrders = result.data
            .filter((job: any) => job.status === 'in-progress' || job.status === 'accepted')
            .map((job: any) => job.workOrderNumber || `WO-${job.id}`);
        }
      }
    } catch (error) {
      console.error('Error loading active work orders:', error);
      this.activeWorkOrders = [];
    }
  }

  // Save overtime session
  private async saveOvertimeSession(session: OvertimeSession): Promise<void> {
    try {
      const response = await fetch('/api/overtime/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      });

      if (!response.ok) {
        throw new Error('Failed to save overtime session');
      }
    } catch (error) {
      console.error('Error saving overtime session:', error);
    }
  }

  // Send overtime notification
  private async sendOvertimeNotification(session: OvertimeSession, action: 'started' | 'ended'): Promise<void> {
    try {
      await fetch('/api/notifications/overtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.id,
          technicianId: session.technicianId,
          action,
          totalHours: session.totalHours,
          workOrderNumbers: session.workOrderNumbers,
          reason: session.reason,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Error sending overtime notification:', error);
    }
  }

  // Utility functions
  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5); // HH:MM format
  }

  private isPublicHoliday(date: Date): boolean {
    // Simplified public holiday check
    // In production, this would check against a proper holiday calendar
    const holidays = [
      '01-01', // New Year's Day
      '03-21', // Human Rights Day
      '04-07', // Good Friday (varies)
      '04-27', // Freedom Day
      '05-01', // Workers' Day
      '06-16', // Youth Day
      '08-09', // National Women's Day
      '09-24', // Heritage Day
      '12-16', // Day of Reconciliation
      '12-25', // Christmas Day
      '12-26', // Day of Goodwill
    ];

    const dateStr = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return holidays.includes(dateStr);
  }

  // Public methods
  getCurrentSession(): OvertimeSession | null {
    return this.currentSession;
  }

  isCurrentlyTracking(): boolean {
    return this.isTracking;
  }

  async getOvertimeHistory(technicianId: string): Promise<OvertimeSession[]> {
    try {
      const response = await fetch(`/api/overtime/sessions/${technicianId}/history`);
      if (response.ok) {
        const result = await response.json();
        return result.success ? result.data : [];
      }
    } catch (error) {
      console.error('Error getting overtime history:', error);
    }
    return [];
  }

  updateWorkingHours(hours: WorkingHours): void {
    this.workingHours = hours;
  }

  updateOvertimeRules(rules: Partial<OvertimeRules>): void {
    this.overtimeRules = { ...this.overtimeRules, ...rules };
  }
}

// Export singleton instance
export const overtimeTrackingService = OvertimeTrackingService.getInstance();
export type { OvertimeSession, WorkingHours, OvertimeRules };
