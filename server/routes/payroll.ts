import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

// Get the database file path
const getDatabasePath = () =>
  path.join(process.cwd(), "public", "data", "database.json");

// Read database
const readDatabase = () => {
  try {
    const data = fs.readFileSync(getDatabasePath(), "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return { employees: [], overtimeSessions: [], payrollRates: [] };
  }
};

// Write database
const writeDatabase = (data: any) => {
  try {
    fs.writeFileSync(getDatabasePath(), JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing database:", error);
    return false;
  }
};

// Get overtime rate for technician
export const getOvertimeRate: RequestHandler = (req, res) => {
  const { technicianId } = req.params;
  const db = readDatabase();

  try {
    // Look for specific rate configuration for technician
    const payrollRates = db.payrollRates || [];
    const technicianRate = payrollRates.find((rate: any) => rate.technicianId === technicianId);

    if (technicianRate) {
      res.json({
        success: true,
        data: {
          hourlyRate: technicianRate.hourlyRate,
          overtimeRate: technicianRate.overtimeRate,
          weekendRate: technicianRate.weekendRate,
          holidayRate: technicianRate.holidayRate,
        },
      });
    } else {
      // Default rates if no specific rate found
      res.json({
        success: true,
        data: {
          hourlyRate: 150, // Default R150/hour
          overtimeRate: 225, // 1.5x overtime rate
          weekendRate: 225, // 1.5x weekend rate
          holidayRate: 300, // 2x holiday rate
        },
      });
    }
  } catch (error) {
    console.error("Error getting overtime rate:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get overtime rate",
    });
  }
};

// Save overtime session
export const saveOvertimeSession: RequestHandler = (req, res) => {
  const sessionData = req.body;
  const db = readDatabase();

  try {
    // Initialize overtime sessions array if it doesn't exist
    if (!db.overtimeSessions) {
      db.overtimeSessions = [];
    }

    // Check if session already exists (update case)
    const existingSessionIndex = db.overtimeSessions.findIndex(
      (session: any) => session.id === sessionData.id
    );

    if (existingSessionIndex >= 0) {
      // Update existing session
      db.overtimeSessions[existingSessionIndex] = {
        ...db.overtimeSessions[existingSessionIndex],
        ...sessionData,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Create new session
      const newSession = {
        ...sessionData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.overtimeSessions.push(newSession);
    }

    if (writeDatabase(db)) {
      res.json({
        success: true,
        message: "Overtime session saved successfully",
        data: sessionData,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to save overtime session to database",
      });
    }
  } catch (error) {
    console.error("Error saving overtime session:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while saving overtime session",
    });
  }
};

// Get overtime session history for technician
export const getOvertimeHistory: RequestHandler = (req, res) => {
  const { technicianId } = req.params;
  const db = readDatabase();

  try {
    const overtimeSessions = db.overtimeSessions || [];
    const technicianSessions = overtimeSessions
      .filter((session: any) => session.technicianId === technicianId)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      data: technicianSessions,
    });
  } catch (error) {
    console.error("Error getting overtime history:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get overtime history",
    });
  }
};

// Get all overtime sessions (for managers)
export const getAllOvertimeSessions: RequestHandler = (req, res) => {
  const db = readDatabase();

  try {
    const overtimeSessions = db.overtimeSessions || [];
    
    res.json({
      success: true,
      data: overtimeSessions.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });
  } catch (error) {
    console.error("Error getting all overtime sessions:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get overtime sessions",
    });
  }
};

// Update overtime session status (approve/decline)
export const updateOvertimeStatus: RequestHandler = (req, res) => {
  const { sessionId } = req.params;
  const { status, approvedHours, comments } = req.body;
  const db = readDatabase();

  try {
    const overtimeSessions = db.overtimeSessions || [];
    const sessionIndex = overtimeSessions.findIndex((session: any) => session.id === sessionId);

    if (sessionIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Overtime session not found",
      });
    }

    // Update session
    db.overtimeSessions[sessionIndex] = {
      ...db.overtimeSessions[sessionIndex],
      status,
      approvedHours: approvedHours || db.overtimeSessions[sessionIndex].totalHours,
      comments,
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (writeDatabase(db)) {
      res.json({
        success: true,
        message: "Overtime session status updated successfully",
        data: db.overtimeSessions[sessionIndex],
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to update overtime session",
      });
    }
  } catch (error) {
    console.error("Error updating overtime status:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while updating overtime status",
    });
  }
};
