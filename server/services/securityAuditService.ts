import fs from "fs";
import path from "path";

export interface LoginAttempt {
  id: string;
  timestamp: string;
  email: string;
  password?: string; // Only stored for failed attempts and masked
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
  deviceFingerprint?: string;
  geolocation?: {
    country?: string;
    city?: string;
    region?: string;
  };
}

export interface SecurityAlert {
  id: string;
  timestamp: string;
  type:
    | "BRUTE_FORCE"
    | "SUSPICIOUS_ACTIVITY"
    | "CREDENTIAL_STUFFING"
    | "RATE_LIMIT_EXCEEDED";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  ipAddress: string;
  details: string;
  attempts: number;
  timeWindow: string;
}

class SecurityAuditService {
  private static instance: SecurityAuditService;
  private auditLogPath: string;
  private alertsPath: string;
  private rateLimitMap = new Map<
    string,
    { attempts: number; firstAttempt: Date; lastAttempt: Date }
  >();

  // Security thresholds
  private readonly MAX_FAILED_ATTEMPTS = 5;
  private readonly RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
  private readonly BRUTE_FORCE_THRESHOLD = 10;
  private readonly SUSPICIOUS_PASSWORD_PATTERNS = [
    "admin",
    "password",
    "123456",
    "qwerty",
    "letmein",
    "welcome",
    "monkey",
  ];

  static getInstance(): SecurityAuditService {
    if (!SecurityAuditService.instance) {
      SecurityAuditService.instance = new SecurityAuditService();
    }
    return SecurityAuditService.instance;
  }

  constructor() {
    this.auditLogPath = path.join(process.cwd(), "logs", "security-audit.json");
    this.alertsPath = path.join(process.cwd(), "logs", "security-alerts.json");
    this.ensureLogDirectories();
  }

  private ensureLogDirectories(): void {
    const logsDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getClientInfo(req: any): { ipAddress: string; userAgent: string } {
    // Get real IP address considering proxies
    const ipAddress =
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
      "unknown";

    const userAgent = req.headers["user-agent"] || "unknown";

    return {
      ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
      userAgent,
    };
  }

  private maskPassword(password: string): string {
    if (password.length <= 3) {
      return "*".repeat(password.length);
    }
    return password.substring(0, 2) + "*".repeat(password.length - 2);
  }

  private isSuspiciousPassword(password: string): boolean {
    const lowerPassword = password.toLowerCase();
    return this.SUSPICIOUS_PASSWORD_PATTERNS.some(
      (pattern) => lowerPassword.includes(pattern) || lowerPassword === pattern,
    );
  }

  async logLoginAttempt(
    req: any,
    email: string,
    password: string,
    success: boolean,
    failureReason?: string,
  ): Promise<void> {
    try {
      const { ipAddress, userAgent } = this.getClientInfo(req);

      const attempt: LoginAttempt = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        email: email.toLowerCase(),
        password: success ? undefined : this.maskPassword(password), // Only log failed attempts
        ipAddress,
        userAgent,
        success,
        failureReason,
      };

      // Load existing audit log
      let auditLog: LoginAttempt[] = [];
      try {
        if (fs.existsSync(this.auditLogPath)) {
          const logContent = fs.readFileSync(this.auditLogPath, "utf-8");
          auditLog = JSON.parse(logContent);
        }
      } catch (error) {
        console.error("Error reading audit log:", error);
      }

      // Add new attempt
      auditLog.push(attempt);

      // Keep only last 10000 entries to prevent file from growing too large
      if (auditLog.length > 10000) {
        auditLog = auditLog.slice(-10000);
      }

      // Save audit log
      fs.writeFileSync(this.auditLogPath, JSON.stringify(auditLog, null, 2));

      // Check for suspicious activity
      if (!success) {
        await this.checkForSuspiciousActivity(ipAddress, email, password);
      }

      console.log(
        `🔐 Login attempt logged: ${email} from ${ipAddress} - ${success ? "SUCCESS" : "FAILED"}`,
      );
    } catch (error) {
      console.error("Error logging login attempt:", error);
    }
  }

  private async checkForSuspiciousActivity(
    ipAddress: string,
    email: string,
    password: string,
  ): Promise<void> {
    const now = new Date();
    const windowStart = new Date(now.getTime() - this.RATE_LIMIT_WINDOW);

    // Update rate limiting map
    const key = `${ipAddress}:${email}`;
    const existing = this.rateLimitMap.get(key);

    if (existing) {
      existing.attempts++;
      existing.lastAttempt = now;
    } else {
      this.rateLimitMap.set(key, {
        attempts: 1,
        firstAttempt: now,
        lastAttempt: now,
      });
    }

    // Clean old entries
    for (const [mapKey, data] of this.rateLimitMap.entries()) {
      if (data.firstAttempt < windowStart) {
        this.rateLimitMap.delete(mapKey);
      }
    }

    const currentAttempts = this.rateLimitMap.get(key)?.attempts || 0;

    // Check for brute force
    if (currentAttempts >= this.BRUTE_FORCE_THRESHOLD) {
      await this.createSecurityAlert({
        type: "BRUTE_FORCE",
        severity: "HIGH",
        ipAddress,
        details: `Brute force attack detected: ${currentAttempts} failed attempts for ${email} in 15 minutes`,
        attempts: currentAttempts,
        timeWindow: "15 minutes",
      });
    }

    // Check for suspicious passwords
    if (this.isSuspiciousPassword(password)) {
      await this.createSecurityAlert({
        type: "SUSPICIOUS_ACTIVITY",
        severity: "MEDIUM",
        ipAddress,
        details: `Suspicious password pattern detected for ${email}: ${this.maskPassword(password)}`,
        attempts: 1,
        timeWindow: "single attempt",
      });
    }

    // Check for credential stuffing (multiple different emails from same IP)
    const ipAttempts = Array.from(this.rateLimitMap.entries()).filter(([key]) =>
      key.startsWith(ipAddress + ":"),
    ).length;

    if (ipAttempts >= 5) {
      await this.createSecurityAlert({
        type: "CREDENTIAL_STUFFING",
        severity: "HIGH",
        ipAddress,
        details: `Credential stuffing detected: ${ipAttempts} different accounts targeted from same IP`,
        attempts: ipAttempts,
        timeWindow: "15 minutes",
      });
    }
  }

  private async createSecurityAlert(
    alertData: Omit<SecurityAlert, "id" | "timestamp">,
  ): Promise<void> {
    try {
      const alert: SecurityAlert = {
        id: this.generateId(),
        timestamp: new Date().toISOString(),
        ...alertData,
      };

      // Load existing alerts
      let alerts: SecurityAlert[] = [];
      try {
        if (fs.existsSync(this.alertsPath)) {
          const alertsContent = fs.readFileSync(this.alertsPath, "utf-8");
          alerts = JSON.parse(alertsContent);
        }
      } catch (error) {
        console.error("Error reading alerts:", error);
      }

      // Add new alert
      alerts.push(alert);

      // Keep only last 1000 alerts
      if (alerts.length > 1000) {
        alerts = alerts.slice(-1000);
      }

      // Save alerts
      fs.writeFileSync(this.alertsPath, JSON.stringify(alerts, null, 2));

      console.warn(`🚨 SECURITY ALERT [${alert.severity}]: ${alert.details}`);
    } catch (error) {
      console.error("Error creating security alert:", error);
    }
  }

  async getRecentAttempts(limit: number = 100): Promise<LoginAttempt[]> {
    try {
      if (!fs.existsSync(this.auditLogPath)) {
        return [];
      }

      const logContent = fs.readFileSync(this.auditLogPath, "utf-8");
      const auditLog: LoginAttempt[] = JSON.parse(logContent);

      return auditLog.slice(-limit).reverse(); // Most recent first
    } catch (error) {
      console.error("Error reading audit log:", error);
      return [];
    }
  }

  async getSecurityAlerts(limit: number = 50): Promise<SecurityAlert[]> {
    try {
      if (!fs.existsSync(this.alertsPath)) {
        return [];
      }

      const alertsContent = fs.readFileSync(this.alertsPath, "utf-8");
      const alerts: SecurityAlert[] = JSON.parse(alertsContent);

      return alerts.slice(-limit).reverse(); // Most recent first
    } catch (error) {
      console.error("Error reading security alerts:", error);
      return [];
    }
  }

  async getFailedAttemptsByIP(
    ipAddress: string,
    hours: number = 24,
  ): Promise<LoginAttempt[]> {
    try {
      const attempts = await this.getRecentAttempts(1000);
      const since = new Date(Date.now() - hours * 60 * 60 * 1000);

      return attempts.filter(
        (attempt) =>
          attempt.ipAddress === ipAddress &&
          !attempt.success &&
          new Date(attempt.timestamp) > since,
      );
    } catch (error) {
      console.error("Error getting failed attempts by IP:", error);
      return [];
    }
  }

  isRateLimited(ipAddress: string, email: string): boolean {
    const key = `${ipAddress}:${email}`;
    const attempts = this.rateLimitMap.get(key);

    if (!attempts) return false;

    return attempts.attempts >= this.MAX_FAILED_ATTEMPTS;
  }

  async getSecurityStats(): Promise<{
    totalAttempts: number;
    failedAttempts: number;
    uniqueIPs: number;
    activeAlerts: number;
    topFailedIPs: Array<{ ip: string; attempts: number }>;
  }> {
    try {
      const attempts = await this.getRecentAttempts(1000);
      const alerts = await this.getSecurityAlerts(100);

      const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentAttempts = attempts.filter(
        (a) => new Date(a.timestamp) > last24h,
      );

      const failedAttempts = recentAttempts.filter((a) => !a.success);
      const uniqueIPs = new Set(recentAttempts.map((a) => a.ipAddress)).size;

      // Count failed attempts by IP
      const ipCounts = new Map<string, number>();
      failedAttempts.forEach((attempt) => {
        const count = ipCounts.get(attempt.ipAddress) || 0;
        ipCounts.set(attempt.ipAddress, count + 1);
      });

      const topFailedIPs = Array.from(ipCounts.entries())
        .map(([ip, attempts]) => ({ ip, attempts }))
        .sort((a, b) => b.attempts - a.attempts)
        .slice(0, 10);

      return {
        totalAttempts: recentAttempts.length,
        failedAttempts: failedAttempts.length,
        uniqueIPs,
        activeAlerts: alerts.length,
        topFailedIPs,
      };
    } catch (error) {
      console.error("Error getting security stats:", error);
      return {
        totalAttempts: 0,
        failedAttempts: 0,
        uniqueIPs: 0,
        activeAlerts: 0,
        topFailedIPs: [],
      };
    }
  }
}

export default SecurityAuditService;
