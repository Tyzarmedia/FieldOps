import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

// Helper to load Sage300 employee data
const loadSage300Data = (): any[] => {
  try {
    const filePath = path.join(
      process.cwd(),
      "public/data/sage-300-database.json"
    );
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    return data.employees || [];
  } catch (error) {
    console.error("Error loading Sage300 data:", error);
    return [];
  }
};

// Helper to check if assistant is currently available
const checkAssistantAvailability = async (employeeId: string): Promise<boolean> => {
  try {
    // Check if assistant is currently clocked in somewhere else
    // This could be expanded to check current job assignments, location, etc.
    
    // For now, check localStorage-style availability (would be replaced with proper DB queries)
    // Assume assistant is available if not currently assigned to active work
    
    // Check current technician-assistant assignments
    const assignmentsPath = path.join(process.cwd(), "public/data/technician-assistant-assignments.json");
    
    if (fs.existsSync(assignmentsPath)) {
      const assignments = JSON.parse(fs.readFileSync(assignmentsPath, "utf-8"));
      const activeAssignment = assignments.find((a: any) => 
        a.assistantId === employeeId && 
        a.status === "active" &&
        new Date(a.endTime || Date.now()) > new Date()
      );
      
      return !activeAssignment; // Available if no active assignment
    }
    
    return true; // Default to available
  } catch (error) {
    console.error("Error checking assistant availability:", error);
    return true; // Default to available on error
  }
};

// Get available assistants
export const getAvailableAssistants: RequestHandler = async (req, res) => {
  try {
    const employees = loadSage300Data();
    
    // Filter for assistant technicians
    const assistantTechnicians = employees.filter(
      (emp) => 
        emp.Role === "Assistant Technician" && 
        emp.EmploymentStatus === "Active"
    );

    // Check availability for each assistant
    const assistantsWithAvailability = await Promise.all(
      assistantTechnicians.map(async (assistant) => {
        const isAvailable = await checkAssistantAvailability(assistant.EmployeeID);
        
        return {
          employeeId: assistant.EmployeeID,
          fullName: assistant.FullName,
          email: assistant.Email,
          phone: assistant.Phone,
          department: assistant.Department,
          isAvailable,
          lastActive: assistant.LastLogin || null,
          skills: ["Fiber Installation", "Network Testing"], // Default skills
          certifications: ["Safety Training"], // Default certifications
        };
      })
    );

    // Sort by availability (available first) and then by name
    assistantsWithAvailability.sort((a, b) => {
      if (a.isAvailable && !b.isAvailable) return -1;
      if (!a.isAvailable && b.isAvailable) return 1;
      return a.fullName.localeCompare(b.fullName);
    });

    res.json({
      success: true,
      assistants: assistantsWithAvailability,
      total: assistantsWithAvailability.length,
      available: assistantsWithAvailability.filter(a => a.isAvailable).length,
    });
  } catch (error) {
    console.error("Error fetching available assistants:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch available assistants",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Create technician-assistant assignment
export const createTechnicianAssistantAssignment: RequestHandler = async (req, res) => {
  try {
    const { technicianId, assistantId, startTime, expectedEndTime } = req.body;

    if (!technicianId) {
      return res.status(400).json({
        success: false,
        message: "Technician ID is required",
      });
    }

    // Create assignment record
    const assignment = {
      id: `assignment-${Date.now()}`,
      technicianId,
      assistantId: assistantId || null,
      workingAlone: !assistantId,
      startTime: startTime || new Date().toISOString(),
      expectedEndTime: expectedEndTime || null,
      endTime: null,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    // Save assignment to file (in production, this would be a database)
    const assignmentsPath = path.join(process.cwd(), "public/data/technician-assistant-assignments.json");
    let assignments = [];
    
    if (fs.existsSync(assignmentsPath)) {
      assignments = JSON.parse(fs.readFileSync(assignmentsPath, "utf-8"));
    }

    // End any existing active assignments for this technician
    assignments = assignments.map((a: any) => {
      if (a.technicianId === technicianId && a.status === "active") {
        return { ...a, status: "ended", endTime: new Date().toISOString() };
      }
      return a;
    });

    // Add new assignment
    assignments.push(assignment);

    // Ensure directory exists
    const dir = path.dirname(assignmentsPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(assignmentsPath, JSON.stringify(assignments, null, 2));

    res.json({
      success: true,
      assignment,
      message: assistantId 
        ? "Technician-assistant assignment created successfully"
        : "Technician marked as working alone",
    });
  } catch (error) {
    console.error("Error creating technician-assistant assignment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create assignment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get current technician assignment
export const getCurrentAssignment: RequestHandler = async (req, res) => {
  try {
    const { technicianId } = req.params;

    if (!technicianId) {
      return res.status(400).json({
        success: false,
        message: "Technician ID is required",
      });
    }

    const assignmentsPath = path.join(process.cwd(), "public/data/technician-assistant-assignments.json");
    
    if (!fs.existsSync(assignmentsPath)) {
      return res.json({
        success: true,
        assignment: null,
        message: "No assignments found",
      });
    }

    const assignments = JSON.parse(fs.readFileSync(assignmentsPath, "utf-8"));
    const currentAssignment = assignments.find((a: any) => 
      a.technicianId === technicianId && 
      a.status === "active"
    );

    if (currentAssignment && currentAssignment.assistantId) {
      // Get assistant details from Sage300
      const employees = loadSage300Data();
      const assistant = employees.find(emp => emp.EmployeeID === currentAssignment.assistantId);
      
      if (assistant) {
        currentAssignment.assistantDetails = {
          employeeId: assistant.EmployeeID,
          fullName: assistant.FullName,
          email: assistant.Email,
          phone: assistant.Phone,
        };
      }
    }

    res.json({
      success: true,
      assignment: currentAssignment || null,
    });
  } catch (error) {
    console.error("Error fetching current assignment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch current assignment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// End technician-assistant assignment
export const endAssignment: RequestHandler = async (req, res) => {
  try {
    const { technicianId } = req.params;

    if (!technicianId) {
      return res.status(400).json({
        success: false,
        message: "Technician ID is required",
      });
    }

    const assignmentsPath = path.join(process.cwd(), "public/data/technician-assistant-assignments.json");
    
    if (!fs.existsSync(assignmentsPath)) {
      return res.json({
        success: true,
        message: "No assignments to end",
      });
    }

    let assignments = JSON.parse(fs.readFileSync(assignmentsPath, "utf-8"));
    
    // End active assignments for this technician
    let assignmentEnded = false;
    assignments = assignments.map((a: any) => {
      if (a.technicianId === technicianId && a.status === "active") {
        assignmentEnded = true;
        return { ...a, status: "ended", endTime: new Date().toISOString() };
      }
      return a;
    });

    if (assignmentEnded) {
      fs.writeFileSync(assignmentsPath, JSON.stringify(assignments, null, 2));
    }

    res.json({
      success: true,
      message: assignmentEnded ? "Assignment ended successfully" : "No active assignment found",
    });
  } catch (error) {
    console.error("Error ending assignment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to end assignment",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
