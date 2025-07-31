import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

// Get the database file path
const getDatabasePath = () => path.join(process.cwd(), "public", "data", "database.json");

// Read database
const readDatabase = () => {
  try {
    const data = fs.readFileSync(getDatabasePath(), "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return { jobs: [], employees: [], overtime: [], inspections: [] };
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

// Get all jobs
export const getJobs: RequestHandler = (req, res) => {
  const db = readDatabase();
  const jobs = db.jobs || [];
  res.json({ jobs });
};

// Get jobs by technician
export const getJobsByTechnician: RequestHandler = (req, res) => {
  const { technicianId } = req.params;
  const db = readDatabase();
  const jobs = (db.jobs || []).filter((job: any) => job.assignedTo === technicianId);
  res.json({ jobs });
};

// Create new job
export const createJob: RequestHandler = (req, res) => {
  const jobData = req.body;
  const db = readDatabase();
  
  const newJob = {
    id: `J${String((db.jobs?.length || 0) + 1).padStart(3, "0")}`,
    ...jobData,
    createdAt: new Date().toISOString(),
    status: "assigned"
  };
  
  db.jobs = db.jobs || [];
  db.jobs.push(newJob);
  
  if (writeDatabase(db)) {
    res.json({ success: true, job: newJob });
  } else {
    res.status(500).json({ error: "Failed to save job" });
  }
};

// Update job status and details
export const updateJob: RequestHandler = (req, res) => {
  const { jobId } = req.params;
  const updates = req.body;
  const db = readDatabase();
  
  const jobIndex = (db.jobs || []).findIndex((job: any) => job.id === jobId);
  
  if (jobIndex === -1) {
    return res.status(404).json({ error: "Job not found" });
  }
  
  db.jobs[jobIndex] = { ...db.jobs[jobIndex], ...updates, updatedAt: new Date().toISOString() };
  
  if (writeDatabase(db)) {
    res.json({ success: true, job: db.jobs[jobIndex] });
  } else {
    res.status(500).json({ error: "Failed to update job" });
  }
};

// Close job with time tracking and maintenance class
export const closeJob: RequestHandler = (req, res) => {
  const { jobId } = req.params;
  const { timeSpent, maintenanceIssueClass, images, udfData, location } = req.body;
  const db = readDatabase();
  
  const jobIndex = (db.jobs || []).findIndex((job: any) => job.id === jobId);
  
  if (jobIndex === -1) {
    return res.status(404).json({ error: "Job not found" });
  }
  
  const updatedJob = {
    ...db.jobs[jobIndex],
    status: "completed",
    completedAt: new Date().toISOString(),
    timeSpent,
    maintenanceIssueClass,
    images: images || [],
    udfData: udfData || {},
    completionLocation: location,
    updatedAt: new Date().toISOString()
  };
  
  db.jobs[jobIndex] = updatedJob;
  
  if (writeDatabase(db)) {
    res.json({ success: true, job: updatedJob });
  } else {
    res.status(500).json({ error: "Failed to close job" });
  }
};

// Start job tracking (when near client location)
export const startJobTracking: RequestHandler = (req, res) => {
  const { jobId } = req.params;
  const { location, startTime } = req.body;
  const db = readDatabase();
  
  const jobIndex = (db.jobs || []).findIndex((job: any) => job.id === jobId);
  
  if (jobIndex === -1) {
    return res.status(404).json({ error: "Job not found" });
  }
  
  db.jobs[jobIndex] = {
    ...db.jobs[jobIndex],
    status: "in-progress",
    startTime: startTime || new Date().toISOString(),
    startLocation: location,
    tracking: {
      started: true,
      startTime: startTime || new Date().toISOString(),
      paused: false,
      totalPausedTime: 0
    },
    updatedAt: new Date().toISOString()
  };
  
  if (writeDatabase(db)) {
    res.json({ success: true, job: db.jobs[jobIndex] });
  } else {
    res.status(500).json({ error: "Failed to start job tracking" });
  }
};

// Pause/resume job tracking
export const toggleJobTracking: RequestHandler = (req, res) => {
  const { jobId } = req.params;
  const { action } = req.body; // 'pause' or 'resume'
  const db = readDatabase();
  
  const jobIndex = (db.jobs || []).findIndex((job: any) => job.id === jobId);
  
  if (jobIndex === -1) {
    return res.status(404).json({ error: "Job not found" });
  }
  
  const job = db.jobs[jobIndex];
  const now = new Date().toISOString();
  
  if (action === "pause") {
    job.tracking = {
      ...job.tracking,
      paused: true,
      pauseStartTime: now
    };
  } else if (action === "resume") {
    const pauseStartTime = job.tracking?.pauseStartTime;
    if (pauseStartTime) {
      const pauseDuration = new Date(now).getTime() - new Date(pauseStartTime).getTime();
      job.tracking = {
        ...job.tracking,
        paused: false,
        totalPausedTime: (job.tracking?.totalPausedTime || 0) + pauseDuration,
        pauseStartTime: undefined
      };
    }
  }
  
  job.updatedAt = now;
  
  if (writeDatabase(db)) {
    res.json({ success: true, job: db.jobs[jobIndex] });
  } else {
    res.status(500).json({ error: "Failed to update job tracking" });
  }
};

// Get overtime records
export const getOvertime: RequestHandler = (req, res) => {
  const db = readDatabase();
  const overtime = db.overtime || [];
  res.json({ overtime });
};

// Submit overtime claim
export const submitOvertime: RequestHandler = (req, res) => {
  const overtimeData = req.body;
  const db = readDatabase();
  
  const newOvertime = {
    id: `OT${String((db.overtime?.length || 0) + 1).padStart(3, "0")}`,
    ...overtimeData,
    submittedAt: new Date().toISOString(),
    status: "pending"
  };
  
  db.overtime = db.overtime || [];
  db.overtime.push(newOvertime);
  
  if (writeDatabase(db)) {
    res.json({ success: true, overtime: newOvertime });
  } else {
    res.status(500).json({ error: "Failed to submit overtime" });
  }
};

// Get vehicle/tool inspections
export const getInspections: RequestHandler = (req, res) => {
  const db = readDatabase();
  const inspections = db.inspections || [];
  res.json({ inspections });
};

// Submit inspection
export const submitInspection: RequestHandler = (req, res) => {
  const inspectionData = req.body;
  const db = readDatabase();
  
  const newInspection = {
    id: `INS${String((db.inspections?.length || 0) + 1).padStart(3, "0")}`,
    ...inspectionData,
    submittedAt: new Date().toISOString(),
    submittedBy: inspectionData.technicianId
  };
  
  db.inspections = db.inspections || [];
  db.inspections.push(newInspection);
  
  if (writeDatabase(db)) {
    res.json({ success: true, inspection: newInspection });
  } else {
    res.status(500).json({ error: "Failed to submit inspection" });
  }
};

// Get missing inspections (for fleet manager alerts)
export const getMissingInspections: RequestHandler = (req, res) => {
  const db = readDatabase();
  const inspections = db.inspections || [];
  const employees = db.employees || [];
  
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Find technicians who should have submitted inspections but didn't
  const missingInspections = employees
    .filter((emp: any) => emp.employment?.role?.includes("Technician"))
    .filter((emp: any) => {
      const hasRecentInspection = inspections.some((ins: any) => 
        ins.submittedBy === emp.id && 
        new Date(ins.submittedAt) >= yesterday
      );
      return !hasRecentInspection;
    })
    .map((emp: any) => ({
      technicianId: emp.id,
      technicianName: emp.personalInfo?.fullName,
      lastInspection: inspections
        .filter((ins: any) => ins.submittedBy === emp.id)
        .sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())[0]?.submittedAt || null
    }));
  
  res.json({ missingInspections });
};
