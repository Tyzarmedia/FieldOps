// Job Management API Routes for Coordinators and Technicians
import { Router } from "express";
import { createNotification } from "../services/notificationService";
import fs from "fs";
import path from "path";

const router = Router();

// Helper function to check if assistant is working with technician
const isAssistantWorkingWithTechnician = (assistantId: string, technicianId: string): boolean => {
  try {
    const assignmentsPath = path.join(process.cwd(), "public/data/technician-assistant-assignments.json");

    if (!fs.existsSync(assignmentsPath)) {
      return false;
    }

    const assignments = JSON.parse(fs.readFileSync(assignmentsPath, "utf-8"));
    const activeAssignment = assignments.find((a: any) =>
      a.technicianId === technicianId &&
      a.assistantId === assistantId &&
      a.status === "active"
    );

    return !!activeAssignment;
  } catch (error) {
    console.error("Error checking assistant assignment:", error);
    return false;
  }
};

// Helper function to get technician for assistant
const getTechnicianForAssistant = (assistantId: string): string | null => {
  try {
    const assignmentsPath = path.join(process.cwd(), "public/data/technician-assistant-assignments.json");

    if (!fs.existsSync(assignmentsPath)) {
      return null;
    }

    const assignments = JSON.parse(fs.readFileSync(assignmentsPath, "utf-8"));
    const activeAssignment = assignments.find((a: any) =>
      a.assistantId === assistantId &&
      a.status === "active"
    );

    return activeAssignment ? activeAssignment.technicianId : null;
  } catch (error) {
    console.error("Error getting technician for assistant:", error);
    return null;
  }
};

// Mock data for demonstration - in real app this would connect to database
let jobs: any[] = [
  {
    id: "1",
    workOrderNumber: "WO-2024-001",
    title: "FTTH Installation",
    description: "Install fiber to the home for new customer",
    type: "Installation",
    priority: "High",
    status: "Assigned",
    assignedTechnician: "tech001",
    assistantTechnician: "",
    client: {
      name: "Vumatel (Pty) Ltd",
      address: "123 Main Street, Central",
      coordinates: { lat: -26.2041, lng: 28.0473 },
      contactPerson: "John Smith",
      phone: "+27123456789",
    },
    estimatedHours: 4,
    scheduledDate: new Date().toISOString(),
    createdDate: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    syncStatus: "synced",
  },
  {
    id: "2",
    workOrderNumber: "WO-2024-002",
    title: "Network Maintenance",
    description: "Routine maintenance on fiber network",
    type: "Maintenance",
    priority: "Medium",
    status: "In Progress",
    assignedTechnician: "tech001",
    assistantTechnician: "",
    client: {
      name: "TelkomSA Ltd",
      address: "456 Oak Avenue, Sandton",
      coordinates: { lat: -26.1076, lng: 28.0567 },
      contactPerson: "Jane Doe",
      phone: "+27987654321",
    },
    estimatedHours: 2,
    scheduledDate: new Date().toISOString(),
    createdDate: new Date().toISOString(),
    lastModified: new Date().toISOString(),
    syncStatus: "synced",
  },
];

// Get all jobs
router.get("/jobs", (req, res) => {
  try {
    res.json({ success: true, data: jobs });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch jobs",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get jobs by technician
router.get("/jobs/technician/:technicianId", (req, res) => {
  try {
    const { technicianId } = req.params;
    const technicianJobs = jobs.filter(
      (job) =>
        job.assignedTechnician === technicianId ||
        job.assistantTechnician === technicianId,
    );
    res.json({ success: true, data: technicianJobs });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch technician jobs",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get jobs for assistant (based on current technician assignment)
router.get("/jobs/assistant/:assistantId", (req, res) => {
  try {
    const { assistantId } = req.params;

    // Find which technician this assistant is currently working with
    const technicianId = getTechnicianForAssistant(assistantId);

    if (!technicianId) {
      return res.json({
        success: true,
        data: [],
        message: "No active technician assignment found"
      });
    }

    // Get jobs assigned to the technician
    const technicianJobs = jobs.filter(
      (job) => job.assignedTechnician === technicianId
    );

    // Add assistant relationship info to jobs
    const jobsWithAssistantInfo = technicianJobs.map(job => ({
      ...job,
      assistantAccess: true,
      workingWithTechnician: technicianId,
      canModifyStatus: true, // Assistant can modify job status
      requiresTechnicianReview: job.status === "Completed" // Completed jobs need technician review
    }));

    res.json({
      success: true,
      data: jobsWithAssistantInfo,
      technicianId,
      message: `Found ${jobsWithAssistantInfo.length} jobs from assigned technician`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch assistant jobs",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get active jobs by technician (in-progress and accepted)
router.get("/jobs/technician/:technicianId/active", (req, res) => {
  try {
    const { technicianId } = req.params;
    const activeJobs = jobs.filter(
      (job) =>
        (job.assignedTechnician === technicianId ||
          job.assistantTechnician === technicianId) &&
        (job.status === "In Progress" || job.status === "Accepted"),
    );
    res.json({ success: true, data: activeJobs });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch active jobs",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get job locations for technician (for location tracking)
router.get("/jobs/technician/:technicianId/locations", (req, res) => {
  try {
    const { technicianId } = req.params;
    const technicianJobs = jobs.filter(
      (job) =>
        (job.assignedTechnician === technicianId ||
          job.assistantTechnician === technicianId) &&
        (job.status === "Assigned" ||
          job.status === "Accepted" ||
          job.status === "In Progress"),
    );

    // Extract location data from jobs
    const jobLocations = technicianJobs.map((job) => ({
      id: `loc-${job.id}`,
      jobId: job.id,
      title: job.title,
      workOrderNumber: job.workOrderNumber,
      latitude: job.client?.coordinates?.lat || -26.2041,
      longitude: job.client?.coordinates?.lng || 28.0473,
      address: job.client?.address || "Unknown address",
      proximityRadius: 100, // Default 100 meters
      coordinates: job.client?.coordinates,
    }));

    res.json({ success: true, data: jobLocations });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch job locations",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get jobs by status
router.get("/jobs/status/:status", (req, res) => {
  try {
    const { status } = req.params;
    const statusJobs = jobs.filter(
      (job) => job.status.toLowerCase() === status.toLowerCase(),
    );
    res.json({ success: true, data: statusJobs });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch jobs by status",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get single job by ID
router.get("/jobs/:jobId", (req, res) => {
  try {
    const { jobId } = req.params;
    const job = jobs.find((j) => j.id === jobId);

    if (!job) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    res.json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch job",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get job status for polling
router.get("/jobs/:jobId/status", (req, res) => {
  try {
    const { jobId } = req.params;
    const job = jobs.find((j) => j.id === jobId);

    if (!job) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    res.json({
      success: true,
      data: {
        status: job.status,
        lastModified: job.lastModified,
        id: job.id,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch job status",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Create new job (Coordinator only)
router.post("/jobs", (req, res) => {
  try {
    const jobData = req.body;
    const newJob = {
      id: Date.now().toString(),
      workOrderNumber: `WO-${new Date().getFullYear()}-${String(jobs.length + 1).padStart(3, "0")}`,
      ...jobData,
      status: "Open",
      assignedTechnician: "",
      assistantTechnician: "",
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      syncStatus: "synced",
    };

    jobs.push(newJob);

    res.json({
      success: true,
      data: newJob,
      message: "Job created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create job",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Assign job to technician (Coordinator only)
router.put("/jobs/:jobId/assign", (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      technicianId,
      assistantId,
      assignedBy = "coordinator001",
    } = req.body;

    const jobIndex = jobs.findIndex((j) => j.id === jobId);
    if (jobIndex === -1) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    jobs[jobIndex].assignedTechnician = technicianId;
    if (assistantId) {
      jobs[jobIndex].assistantTechnician = assistantId;
    }
    jobs[jobIndex].status = "Assigned";
    jobs[jobIndex].assignedDate = new Date().toISOString();
    jobs[jobIndex].assignedBy = assignedBy;
    jobs[jobIndex].lastModified = new Date().toISOString();

    // Add to assignment audit trail
    if (!jobs[jobIndex].assignmentHistory) {
      jobs[jobIndex].assignmentHistory = [];
    }
    jobs[jobIndex].assignmentHistory.push({
      id: Date.now().toString(),
      assignedBy,
      assignedTo: technicianId,
      assistantId: assistantId || null,
      assignedAt: new Date().toISOString(),
      action: "assigned",
    });

    // Create notification for the assigned technician
    const createJobNotification = (techId: string) => {
      try {
        createNotification({
          technicianId: techId,
          type: "job_assigned",
          title: "New Job Assigned",
          message: `${jobs[jobIndex].title} - ${jobs[jobIndex].workOrderNumber || jobId} has been assigned to you`,
          priority: "high",
        });
      } catch (error) {
        console.warn("Error creating job assignment notification:", error);
      }
    };

    // Create notifications for assigned technicians
    createJobNotification(technicianId);
    if (assistantId) {
      createJobNotification(assistantId);
    }

    res.json({
      success: true,
      data: jobs[jobIndex],
      message: "Job assigned successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to assign job",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update job status (Technician and Assistant actions)
router.put("/jobs/:jobId/status", (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, notes, technicianId, isAssistant, assistantId } = req.body;

    const jobIndex = jobs.findIndex((j) => j.id === jobId);
    if (jobIndex === -1) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    const job = jobs[jobIndex];
    let isAuthorized = false;
    let actorId = technicianId;
    let actorRole = "technician";

    // Check authorization - technician or assistant
    if (technicianId && (job.assignedTechnician === technicianId || job.assistantTechnician === technicianId)) {
      isAuthorized = true;
      actorId = technicianId;
      actorRole = "technician";
    } else if (isAssistant && assistantId) {
      // Check if assistant is working with the assigned technician
      const isWorkingWithTechnician = isAssistantWorkingWithTechnician(assistantId, job.assignedTechnician);
      if (isWorkingWithTechnician) {
        isAuthorized = true;
        actorId = assistantId;
        actorRole = "assistant";
      }
    }

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this job",
      });
    }

    // Handle assistant closing job - needs technician review
    if (actorRole === "assistant" && (status === "Completed" || status === "Closed")) {
      jobs[jobIndex].status = "Pending Technician Review";
      jobs[jobIndex].pendingReviewBy = job.assignedTechnician;
      jobs[jobIndex].requestedStatus = status;
      jobs[jobIndex].reviewRequestedBy = assistantId;
      jobs[jobIndex].reviewRequestedAt = new Date().toISOString();
    } else {
      jobs[jobIndex].status = status;
    }

    jobs[jobIndex].lastModified = new Date().toISOString();

    if (notes) {
      if (!jobs[jobIndex].notes) {
        jobs[jobIndex].notes = [];
      }
      jobs[jobIndex].notes.push({
        timestamp: new Date().toISOString(),
        technician: actorId,
        role: actorRole,
        note: notes,
      });
    }

    // Set completed date if job is being closed by technician
    if (actorRole === "technician" && (status === "Completed" || status === "Closed")) {
      jobs[jobIndex].completedDate = new Date().toISOString();
    }

    // Create notification for technician if assistant requested review
    if (actorRole === "assistant" && jobs[jobIndex].status === "Pending Technician Review") {
      createNotification({
        recipientId: job.assignedTechnician,
        type: "job_review_required",
        title: "Job Review Required",
        message: `Assistant has completed job ${job.workOrderNumber} and requires your review`,
        data: { jobId, assistantId },
      });
    }

    const responseMessage = actorRole === "assistant" && jobs[jobIndex].status === "Pending Technician Review"
      ? "Job completion submitted for technician review"
      : "Job status updated successfully";

    res.json({
      success: true,
      data: jobs[jobIndex],
      message: responseMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update job status",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Accept job (Technician action)
router.put("/jobs/:jobId/accept", (req, res) => {
  try {
    const { jobId } = req.params;
    const { technicianId } = req.body;

    const jobIndex = jobs.findIndex((j) => j.id === jobId);
    if (jobIndex === -1) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    const job = jobs[jobIndex];
    if (
      job.assignedTechnician !== technicianId &&
      job.assistantTechnician !== technicianId
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to accept this job",
      });
    }

    jobs[jobIndex].status = "Accepted";
    jobs[jobIndex].acceptedDate = new Date().toISOString();
    jobs[jobIndex].lastModified = new Date().toISOString();

    res.json({
      success: true,
      data: jobs[jobIndex],
      message: "Job accepted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to accept job",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Start job tracking (Technician action)
router.put("/jobs/:jobId/start", (req, res) => {
  try {
    const { jobId } = req.params;
    const { technicianId, location } = req.body;

    const jobIndex = jobs.findIndex((j) => j.id === jobId);
    if (jobIndex === -1) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    const job = jobs[jobIndex];
    if (
      job.assignedTechnician !== technicianId &&
      job.assistantTechnician !== technicianId
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to start this job",
      });
    }

    jobs[jobIndex].status = "In Progress";
    jobs[jobIndex].startedDate = new Date().toISOString();
    jobs[jobIndex].lastModified = new Date().toISOString();

    if (location) {
      jobs[jobIndex].startLocation = location;
    }

    res.json({
      success: true,
      data: jobs[jobIndex],
      message: "Job started successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to start job",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Pause job (Technician action)
router.put("/jobs/:jobId/pause", (req, res) => {
  try {
    const { jobId } = req.params;
    const { technicianId, location, timeSpent } = req.body;

    const jobIndex = jobs.findIndex((j) => j.id === jobId);
    if (jobIndex === -1) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    const job = jobs[jobIndex];
    if (
      job.assignedTechnician !== technicianId &&
      job.assistantTechnician !== technicianId
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to pause this job",
      });
    }

    jobs[jobIndex].status = "Paused";
    jobs[jobIndex].pausedDate = new Date().toISOString();
    jobs[jobIndex].lastModified = new Date().toISOString();

    if (timeSpent) {
      jobs[jobIndex].timeSpent = timeSpent;
    }

    if (location) {
      jobs[jobIndex].pauseLocation = location;
    }

    res.json({
      success: true,
      data: jobs[jobIndex],
      message: "Job paused successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to pause job",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Resume job (Technician action)
router.put("/jobs/:jobId/resume", (req, res) => {
  try {
    const { jobId } = req.params;
    const { technicianId, location } = req.body;

    const jobIndex = jobs.findIndex((j) => j.id === jobId);
    if (jobIndex === -1) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    const job = jobs[jobIndex];
    if (
      job.assignedTechnician !== technicianId &&
      job.assistantTechnician !== technicianId
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to resume this job",
      });
    }

    jobs[jobIndex].status = "In Progress";
    jobs[jobIndex].resumedDate = new Date().toISOString();
    jobs[jobIndex].lastModified = new Date().toISOString();

    if (location) {
      jobs[jobIndex].resumeLocation = location;
    }

    res.json({
      success: true,
      data: jobs[jobIndex],
      message: "Job resumed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to resume job",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update UDF data (Technician action)
router.put("/jobs/:jobId/udf", (req, res) => {
  try {
    const { jobId } = req.params;
    const { technicianId, ...udfData } = req.body;

    const jobIndex = jobs.findIndex((j) => j.id === jobId);
    if (jobIndex === -1) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    const job = jobs[jobIndex];
    if (
      job.assignedTechnician !== technicianId &&
      job.assistantTechnician !== technicianId
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update UDF for this job",
      });
    }

    // Update UDF data
    jobs[jobIndex].udfData = {
      ...jobs[jobIndex].udfData,
      ...udfData,
      lastUpdated: new Date().toISOString(),
      updatedBy: technicianId,
    };
    jobs[jobIndex].lastModified = new Date().toISOString();

    // Create notification for managers/coordinators about UDF completion
    try {
      createNotification({
        technicianId: "manager001", // In real app, would notify all relevant managers
        type: "info",
        title: "UDF Updated",
        message: `User Defined Fields updated for ${job.title} by technician`,
        priority: "low",
      });
    } catch (error) {
      console.warn("Error creating UDF update notification:", error);
    }

    res.json({
      success: true,
      data: {
        jobId: job.id,
        udfData: jobs[jobIndex].udfData,
      },
      message: "UDF data updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update UDF data",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Complete job (Technician action)
router.put("/jobs/:jobId/complete", (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      technicianId,
      timeSpent,
      notes,
      photos,
      stockUsed,
      udfData,
      signOffData,
    } = req.body;

    const jobIndex = jobs.findIndex((j) => j.id === jobId);
    if (jobIndex === -1) {
      return res.status(404).json({ success: false, error: "Job not found" });
    }

    const job = jobs[jobIndex];
    if (
      job.assignedTechnician !== technicianId &&
      job.assistantTechnician !== technicianId
    ) {
      return res.status(403).json({
        success: false,
        error: "Not authorized to complete this job",
      });
    }

    // Calculate actual time spent if start time exists
    const actualTimeSpent = job.startedDate
      ? (new Date().getTime() - new Date(job.startedDate).getTime()) /
        (1000 * 60 * 60) // hours
      : timeSpent;

    jobs[jobIndex].status = "Completed";
    jobs[jobIndex].completedDate = new Date().toISOString();
    jobs[jobIndex].actualHours = actualTimeSpent;
    jobs[jobIndex].lastModified = new Date().toISOString();
    jobs[jobIndex].completedBy = technicianId;

    if (notes) {
      jobs[jobIndex].completionNotes = notes;
    }

    if (photos) {
      jobs[jobIndex].photos = photos;
    }

    // Store stock usage data for tracking
    if (stockUsed && stockUsed.length > 0) {
      jobs[jobIndex].stockUsed = stockUsed;
      jobs[jobIndex].stockUsageValue = stockUsed.reduce(
        (total: number, item: any) =>
          total + (item.quantity * item.unitPrice || 0),
        0,
      );
    }

    // Store UDF (User Defined Fields) data
    if (udfData) {
      jobs[jobIndex].udfData = udfData;
    }

    // Store sign-off data
    if (signOffData) {
      jobs[jobIndex].signOffData = {
        ...signOffData,
        timestamp: new Date().toISOString(),
        technicianId,
      };
    }

    // Create notification for managers/coordinators about job completion
    try {
      createNotification({
        technicianId: "manager001", // In real app, would notify all relevant managers
        type: "alert",
        title: "Job Completed",
        message: `${job.title} completed by technician. Stock used: ${stockUsed?.length || 0} items`,
        priority: "medium",
      });
    } catch (error) {
      console.warn("Error creating job completion notification:", error);
    }

    res.json({
      success: true,
      data: jobs[jobIndex],
      message: "Job completed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to complete job",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get job statistics for dashboard
router.get("/jobs/stats/:technicianId", (req, res) => {
  try {
    const { technicianId } = req.params;
    const technicianJobs = jobs.filter(
      (job) =>
        job.assignedTechnician === technicianId ||
        job.assistantTechnician === technicianId,
    );

    const stats = {
      assigned: technicianJobs.filter(
        (job) => job.status === "Assigned" || job.status === "Open",
      ).length,
      accepted: technicianJobs.filter((job) => job.status === "Accepted")
        .length,
      inProgress: technicianJobs.filter((job) => job.status === "In Progress")
        .length,
      completed: technicianJobs.filter(
        (job) => job.status === "Completed" || job.status === "Closed",
      ).length,
      total: technicianJobs.length,
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch job stats",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get job assignment audit trail (Manager only)
router.get("/audit/assignments", (req, res) => {
  try {
    const auditData = jobs.map((job) => ({
      jobId: job.id,
      title: job.title,
      currentAssignee: job.assignedTechnician,
      assignmentHistory: job.assignmentHistory || [],
      status: job.status,
      createdDate: job.createdDate,
      lastModified: job.lastModified,
    }));

    res.json({
      success: true,
      data: auditData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch audit trail",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get technician time tracking report (Manager only)
router.get("/reports/technician-time/:technicianId", (req, res) => {
  try {
    const { technicianId } = req.params;
    const technicianJobs = jobs.filter(
      (job) =>
        job.assignedTechnician === technicianId ||
        job.assistantTechnician === technicianId,
    );

    const timeReport = {
      technicianId,
      totalJobsCompleted: technicianJobs.filter(
        (job) => job.status === "Completed",
      ).length,
      totalHoursWorked: technicianJobs.reduce(
        (total, job) => total + (job.actualHours || 0),
        0,
      ),
      averageJobTime:
        technicianJobs.length > 0
          ? technicianJobs.reduce(
              (total, job) => total + (job.actualHours || 0),
              0,
            ) / technicianJobs.length
          : 0,
      jobDetails: technicianJobs.map((job) => ({
        jobId: job.id,
        title: job.title,
        status: job.status,
        estimatedHours: job.estimatedHours,
        actualHours: job.actualHours,
        startedDate: job.startedDate,
        completedDate: job.completedDate,
        stockUsed: job.stockUsed || [],
        stockValue: job.stockUsageValue || 0,
      })),
    };

    res.json({
      success: true,
      data: timeReport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch time report",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get all completed jobs with stock usage (Manager/Stock Manager view)
router.get("/completed-jobs-stock", (req, res) => {
  try {
    const completedJobs = jobs
      .filter((job) => job.status === "Completed")
      .map((job) => ({
        jobId: job.id,
        title: job.title,
        completedBy: job.completedBy,
        completedDate: job.completedDate,
        actualHours: job.actualHours,
        stockUsed: job.stockUsed || [],
        stockValue: job.stockUsageValue || 0,
        udfData: job.udfData || {},
        client: job.client,
      }));

    res.json({
      success: true,
      data: completedJobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch completed jobs",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
