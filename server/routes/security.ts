import { Router, Request, Response } from "express";
import SecurityAuditService from "../services/securityAuditService";
import { authenticateToken } from "./auth";

const securityRouter = Router();
const securityAudit = SecurityAuditService.getInstance();

// Middleware to check admin access
const requireAdminAccess = (req: Request, res: Response, next: any) => {
  const user = (req as any).user;

  if (!user || (user.role !== "SystemAdmin" && user.role !== "IT")) {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

// GET /api/security/audit-log - Get recent login attempts
securityRouter.get(
  "/audit-log",
  authenticateToken,
  requireAdminAccess,
  async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const attempts = await securityAudit.getRecentAttempts(limit);

      res.json({
        success: true,
        data: attempts,
        total: attempts.length,
      });
    } catch (error) {
      console.error("Error fetching audit log:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
);

// GET /api/security/alerts - Get security alerts
securityRouter.get(
  "/alerts",
  authenticateToken,
  requireAdminAccess,
  async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const alerts = await securityAudit.getSecurityAlerts(limit);

      res.json({
        success: true,
        data: alerts,
        total: alerts.length,
      });
    } catch (error) {
      console.error("Error fetching security alerts:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
);

// GET /api/security/stats - Get security statistics
securityRouter.get(
  "/stats",
  authenticateToken,
  requireAdminAccess,
  async (req: Request, res: Response) => {
    try {
      const stats = await securityAudit.getSecurityStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error fetching security stats:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
);

// GET /api/security/failed-attempts/:ip - Get failed attempts by IP
securityRouter.get(
  "/failed-attempts/:ip",
  authenticateToken,
  requireAdminAccess,
  async (req: Request, res: Response) => {
    try {
      const ipAddress = req.params.ip;
      const hours = parseInt(req.query.hours as string) || 24;

      const attempts = await securityAudit.getFailedAttemptsByIP(
        ipAddress,
        hours,
      );

      res.json({
        success: true,
        data: attempts,
        total: attempts.length,
        ipAddress,
        timeWindow: `${hours} hours`,
      });
    } catch (error) {
      console.error("Error fetching failed attempts by IP:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
);

// GET /api/security/dashboard - Get dashboard data
securityRouter.get(
  "/dashboard",
  authenticateToken,
  requireAdminAccess,
  async (req: Request, res: Response) => {
    try {
      const [stats, recentAttempts, alerts] = await Promise.all([
        securityAudit.getSecurityStats(),
        securityAudit.getRecentAttempts(20),
        securityAudit.getSecurityAlerts(10),
      ]);

      res.json({
        success: true,
        data: {
          stats,
          recentAttempts,
          alerts,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error fetching security dashboard data:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
);

export default securityRouter;
