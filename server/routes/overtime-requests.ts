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
    return { 
      employees: [], 
      overtimeRequests: []
    };
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

// Interface definitions
interface OvertimeRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  department: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  reason: string;
  supervisor: string;
  workOrderNumber?: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  comments?: string;
  priority: "low" | "medium" | "high" | "urgent";
  costEstimate: number;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    uploadDate: string;
  }>;
}

// Submit overtime request
export const submitOvertimeRequest: RequestHandler = (req, res) => {
  try {
    const {
      employeeId,
      employeeName,
      employeeNumber,
      department,
      date,
      startTime,
      endTime,
      totalHours,
      reason,
      supervisor,
      workOrderNumber,
      description,
    } = req.body;

    // Validation
    if (!employeeId || !date || !startTime || !endTime || !reason || !supervisor || !description) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    if (totalHours <= 0 || totalHours > 12) {
      return res.status(400).json({
        success: false,
        error: "Invalid hours. Must be between 0 and 12 hours.",
      });
    }

    const db = readDatabase();
    
    // Calculate priority based on reason and hours
    let priority: "low" | "medium" | "high" | "urgent" = "medium";
    if (reason === "Emergency repair") priority = "urgent";
    else if (reason === "Project deadline" && totalHours > 6) priority = "high";
    else if (totalHours > 8) priority = "high";
    else if (reason === "Training") priority = "low";

    // Calculate cost estimate (hours * rate + overhead)
    const overtimeRate = getOvertimeRateForEmployee(employeeId, db);
    const costEstimate = totalHours * overtimeRate;

    const newRequest: OvertimeRequest = {
      id: `OTR-${Date.now()}`,
      employeeId,
      employeeName,
      employeeNumber,
      department,
      date,
      startTime,
      endTime,
      totalHours,
      reason,
      supervisor,
      workOrderNumber,
      description,
      status: "pending",
      submittedAt: new Date().toISOString(),
      priority,
      costEstimate,
    };

    if (!db.overtimeRequests) {
      db.overtimeRequests = [];
    }

    db.overtimeRequests.push(newRequest);

    if (writeDatabase(db)) {
      // Create notification for supervisor
      createOvertimeRequestNotification(newRequest, db);

      res.json({
        success: true,
        data: newRequest,
        message: "Overtime request submitted successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to save overtime request",
      });
    }
  } catch (error) {
    console.error("Error submitting overtime request:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Get overtime requests for employee
export const getEmployeeOvertimeRequests: RequestHandler = (req, res) => {
  try {
    const { employeeId } = req.params;
    const db = readDatabase();
    
    const requests = (db.overtimeRequests || [])
      .filter((request: OvertimeRequest) => request.employeeId === employeeId)
      .sort((a: OvertimeRequest, b: OvertimeRequest) => 
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );

    res.json({
      success: true,
      data: { requests },
    });
  } catch (error) {
    console.error("Error getting employee overtime requests:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get overtime requests",
    });
  }
};

// Get overtime requests for team/supervisor
export const getTeamOvertimeRequests: RequestHandler = (req, res) => {
  try {
    const { supervisorId } = req.params;
    const { status, department } = req.query;
    
    const db = readDatabase();
    
    // In a real system, you'd map supervisorId to supervisor name
    // For now, using hardcoded mapping
    const supervisorName = getSupervisorName(supervisorId);
    
    let requests = (db.overtimeRequests || [])
      .filter((request: OvertimeRequest) => request.supervisor === supervisorName);

    // Apply filters
    if (status && status !== "all") {
      requests = requests.filter((request: OvertimeRequest) => request.status === status);
    }

    if (department && department !== "all") {
      requests = requests.filter((request: OvertimeRequest) => request.department === department);
    }

    // Sort by priority and date
    requests = requests.sort((a: OvertimeRequest, b: OvertimeRequest) => {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority] || 0;
      const bPriority = priorityOrder[b.priority] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority; // Higher priority first
      }
      
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });

    res.json({
      success: true,
      data: { requests },
    });
  } catch (error) {
    console.error("Error getting team overtime requests:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get team overtime requests",
    });
  }
};

// Review overtime request (approve/reject)
export const reviewOvertimeRequest: RequestHandler = (req, res) => {
  try {
    const { requestId } = req.params;
    const { action, comments, approvedHours } = req.body;

    if (!action || !["approve", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        error: "Invalid action. Must be 'approve' or 'reject'",
      });
    }

    if (action === "reject" && !comments?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Comments are required for rejection",
      });
    }

    const db = readDatabase();
    const requestIndex = (db.overtimeRequests || []).findIndex((req: OvertimeRequest) => req.id === requestId);

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Overtime request not found",
      });
    }

    const request = db.overtimeRequests[requestIndex];
    
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Request has already been reviewed",
      });
    }

    // Update request
    db.overtimeRequests[requestIndex] = {
      ...request,
      status: action === "approve" ? "approved" : "rejected",
      reviewedAt: new Date().toISOString(),
      reviewedBy: "System", // Would be current user in real system
      comments: comments || "",
    };

    // If approved, create overtime session for payroll processing
    if (action === "approve") {
      createOvertimeSession(request, approvedHours || request.totalHours, db);
    }

    if (writeDatabase(db)) {
      // Create notification for employee
      createReviewNotification(db.overtimeRequests[requestIndex], db);

      res.json({
        success: true,
        data: db.overtimeRequests[requestIndex],
        message: `Overtime request ${action}d successfully`,
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to update overtime request",
      });
    }
  } catch (error) {
    console.error("Error reviewing overtime request:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Cancel overtime request
export const cancelOvertimeRequest: RequestHandler = (req, res) => {
  try {
    const { requestId } = req.params;
    const db = readDatabase();
    
    const requestIndex = (db.overtimeRequests || []).findIndex((req: OvertimeRequest) => req.id === requestId);

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Overtime request not found",
      });
    }

    const request = db.overtimeRequests[requestIndex];
    
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Can only cancel pending requests",
      });
    }

    // Update request status
    db.overtimeRequests[requestIndex] = {
      ...request,
      status: "cancelled",
      reviewedAt: new Date().toISOString(),
      reviewedBy: request.employeeName,
      comments: "Cancelled by employee",
    };

    if (writeDatabase(db)) {
      res.json({
        success: true,
        data: db.overtimeRequests[requestIndex],
        message: "Overtime request cancelled successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to cancel overtime request",
      });
    }
  } catch (error) {
    console.error("Error cancelling overtime request:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Get overtime request details
export const getOvertimeRequestDetails: RequestHandler = (req, res) => {
  try {
    const { requestId } = req.params;
    const db = readDatabase();
    
    const request = (db.overtimeRequests || []).find((req: OvertimeRequest) => req.id === requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        error: "Overtime request not found",
      });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Error getting overtime request details:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get overtime request details",
    });
  }
};

// Get overtime analytics
export const getOvertimeAnalytics: RequestHandler = (req, res) => {
  try {
    const { supervisorId, startDate, endDate } = req.query;
    const db = readDatabase();
    
    let requests = db.overtimeRequests || [];

    // Filter by supervisor if specified
    if (supervisorId) {
      const supervisorName = getSupervisorName(supervisorId as string);
      requests = requests.filter((req: OvertimeRequest) => req.supervisor === supervisorName);
    }

    // Filter by date range if specified
    if (startDate && endDate) {
      requests = requests.filter((req: OvertimeRequest) => 
        req.date >= startDate && req.date <= endDate
      );
    }

    const analytics = {
      totalRequests: requests.length,
      pendingRequests: requests.filter((req: OvertimeRequest) => req.status === "pending").length,
      approvedRequests: requests.filter((req: OvertimeRequest) => req.status === "approved").length,
      rejectedRequests: requests.filter((req: OvertimeRequest) => req.status === "rejected").length,
      cancelledRequests: requests.filter((req: OvertimeRequest) => req.status === "cancelled").length,
      totalHours: requests
        .filter((req: OvertimeRequest) => req.status === "approved")
        .reduce((sum: number, req: OvertimeRequest) => sum + req.totalHours, 0),
      totalCost: requests
        .filter((req: OvertimeRequest) => req.status === "approved")
        .reduce((sum: number, req: OvertimeRequest) => sum + req.costEstimate, 0),
      averageHoursPerRequest: requests.length > 0 
        ? requests.reduce((sum: number, req: OvertimeRequest) => sum + req.totalHours, 0) / requests.length
        : 0,
      requestsByReason: getRequestsByReason(requests),
      requestsByDepartment: getRequestsByDepartment(requests),
      requestsByPriority: getRequestsByPriority(requests),
      topRequesters: getTopRequesters(requests),
    };

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    console.error("Error getting overtime analytics:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get overtime analytics",
    });
  }
};

// Helper functions
function getOvertimeRateForEmployee(employeeId: string, db: any): number {
  try {
    const payrollRates = db.payrollRates || [];
    const employeeRate = payrollRates.find((rate: any) => rate.technicianId === employeeId);
    
    if (employeeRate) {
      return employeeRate.overtimeRate;
    }
    
    // Default overtime rate
    return 225; // R225/hour
  } catch (error) {
    console.error("Error getting overtime rate:", error);
    return 225;
  }
}

function getSupervisorName(supervisorId: string): string {
  // In a real system, this would query the database
  const supervisorMapping: Record<string, string> = {
    "M001": "Sarah Wilson",
    "M002": "Mike Johnson",
    "M003": "Lisa Davis",
  };
  
  return supervisorMapping[supervisorId] || "Sarah Wilson";
}

function createOvertimeSession(request: OvertimeRequest, approvedHours: number, db: any) {
  try {
    if (!db.overtimeSessions) {
      db.overtimeSessions = [];
    }

    const session = {
      id: `OTS-${Date.now()}`,
      technicianId: request.employeeId,
      totalHours: approvedHours,
      status: "approved",
      createdAt: request.date,
      updatedAt: new Date().toISOString(),
      approvedHours,
      comments: `Auto-created from overtime request ${request.id}`,
      reviewedAt: new Date().toISOString(),
      workOrderNumber: request.workOrderNumber,
      reason: request.reason,
    };

    db.overtimeSessions.push(session);
  } catch (error) {
    console.error("Error creating overtime session:", error);
  }
}

function createOvertimeRequestNotification(request: OvertimeRequest, db: any) {
  try {
    if (!db.notifications) {
      db.notifications = [];
    }

    const notification = {
      id: `NOT-${Date.now()}`,
      type: "overtime_request",
      title: "New Overtime Request",
      message: `${request.employeeName} has requested ${request.totalHours} hours of overtime for ${new Date(request.date).toLocaleDateString()}`,
      recipient: request.supervisor,
      status: "unread",
      createdAt: new Date().toISOString(),
      data: {
        requestId: request.id,
        employeeId: request.employeeId,
        priority: request.priority,
      },
    };

    db.notifications.push(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
}

function createReviewNotification(request: OvertimeRequest, db: any) {
  try {
    if (!db.notifications) {
      db.notifications = [];
    }

    const notification = {
      id: `NOT-${Date.now()}`,
      type: "overtime_review",
      title: `Overtime Request ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}`,
      message: `Your overtime request for ${new Date(request.date).toLocaleDateString()} has been ${request.status}`,
      recipient: request.employeeName,
      status: "unread",
      createdAt: new Date().toISOString(),
      data: {
        requestId: request.id,
        status: request.status,
        comments: request.comments,
      },
    };

    db.notifications.push(notification);
  } catch (error) {
    console.error("Error creating review notification:", error);
  }
}

function getRequestsByReason(requests: OvertimeRequest[]) {
  const reasonCounts: Record<string, number> = {};
  requests.forEach(req => {
    reasonCounts[req.reason] = (reasonCounts[req.reason] || 0) + 1;
  });
  return reasonCounts;
}

function getRequestsByDepartment(requests: OvertimeRequest[]) {
  const deptCounts: Record<string, number> = {};
  requests.forEach(req => {
    deptCounts[req.department] = (deptCounts[req.department] || 0) + 1;
  });
  return deptCounts;
}

function getRequestsByPriority(requests: OvertimeRequest[]) {
  const priorityCounts: Record<string, number> = {};
  requests.forEach(req => {
    priorityCounts[req.priority] = (priorityCounts[req.priority] || 0) + 1;
  });
  return priorityCounts;
}

function getTopRequesters(requests: OvertimeRequest[]) {
  const requesterCounts: Record<string, { name: string; hours: number; requests: number }> = {};
  
  requests.forEach(req => {
    if (!requesterCounts[req.employeeId]) {
      requesterCounts[req.employeeId] = {
        name: req.employeeName,
        hours: 0,
        requests: 0,
      };
    }
    
    requesterCounts[req.employeeId].hours += req.totalHours;
    requesterCounts[req.employeeId].requests += 1;
  });

  return Object.values(requesterCounts)
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 5);
}
