// Database API Routes
// Provides endpoints for external and internal database operations

import { Router } from "express";
import DatabaseService from "../../shared/database-service";

const router = Router();

// Lazy-load database service to avoid instantiation during build
function getDbService() {
  return DatabaseService.getInstance();
}

// Employee endpoints
router.get("/employees", async (req, res) => {
  try {
    const employees = await getDbService().getEmployees();
    res.json({ success: true, data: employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch employees",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/employees/:id", async (req, res) => {
  try {
    const employee = await getDbService().getEmployee(req.params.id);
    if (employee) {
      res.json({ success: true, data: employee });
    } else {
      res.status(404).json({ success: false, error: "Employee not found" });
    }
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch employee",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Job endpoints
router.get("/jobs", async (req, res) => {
  try {
    const jobs = await getDbService().getJobs();
    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch jobs",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/jobs/:id", async (req, res) => {
  try {
    const job = await getDbService().getJob(req.params.id);
    if (job) {
      res.json({ success: true, data: job });
    } else {
      res.status(404).json({ success: false, error: "Job not found" });
    }
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch job",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/jobs/technician/:technicianId", async (req, res) => {
  try {
    const jobs = await getDbService().getJobsByTechnician(
      req.params.technicianId,
    );
    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error("Error fetching technician jobs:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch technician jobs",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.put("/jobs/:id/status", async (req, res) => {
  try {
    const { status, notes } = req.body;
    const success = await getDbService().updateJobStatus(
      req.params.id,
      status,
      notes,
    );

    if (success) {
      res.json({ success: true, message: "Job status updated successfully" });
    } else {
      res
        .status(400)
        .json({ success: false, error: "Failed to update job status" });
    }
  } catch (error) {
    console.error("Error updating job status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update job status",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.post("/jobs", async (req, res) => {
  try {
    const jobData = req.body;
    await getDbService().saveJob(jobData);
    res.json({ success: true, message: "Job saved successfully" });
  } catch (error) {
    console.error("Error saving job:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save job",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Stock endpoints
router.get("/stock", async (req, res) => {
  try {
    const stock = await getDbService().getStockItems();
    res.json({ success: true, data: stock });
  } catch (error) {
    console.error("Error fetching stock:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch stock",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.post("/stock/usage", async (req, res) => {
  try {
    const usageData = req.body;
    const id = await getDbService().recordStockUsage(usageData);
    res.json({
      success: true,
      data: { id },
      message: "Stock usage recorded successfully",
    });
  } catch (error) {
    console.error("Error recording stock usage:", error);
    res.status(500).json({
      success: false,
      error: "Failed to record stock usage",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Clock record endpoints
router.post("/clock-records", async (req, res) => {
  try {
    const clockData = req.body;
    await getDbService().saveClockRecord(clockData);
    res.json({ success: true, message: "Clock record saved successfully" });
  } catch (error) {
    console.error("Error saving clock record:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save clock record",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/clock-records/:technician/:date", async (req, res) => {
  try {
    const { technician, date } = req.params;
    const record = await getDbService().getClockRecord(technician, date);

    if (record) {
      res.json({ success: true, data: record });
    } else {
      res.status(404).json({ success: false, error: "Clock record not found" });
    }
  } catch (error) {
    console.error("Error fetching clock record:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch clock record",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Safety check endpoints
router.post("/safety-checks", async (req, res) => {
  try {
    const safetyData = req.body;
    await getDbService().saveSafetyCheck(safetyData);
    res.json({ success: true, message: "Safety check saved successfully" });
  } catch (error) {
    console.error("Error saving safety check:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save safety check",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Incident report endpoints
router.post("/incident-reports", async (req, res) => {
  try {
    const incidentData = req.body;
    await getDbService().saveIncidentReport(incidentData);
    res.json({ success: true, message: "Incident report saved successfully" });
  } catch (error) {
    console.error("Error saving incident report:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save incident report",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Network assessment endpoints
router.post("/network-assessments", async (req, res) => {
  try {
    const assessmentData = req.body;
    await getDbService().saveNetworkAssessment(assessmentData);
    res.json({
      success: true,
      message: "Network assessment saved successfully",
    });
  } catch (error) {
    console.error("Error saving network assessment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save network assessment",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Sync management endpoints
router.post("/sync/force", async (req, res) => {
  try {
    const result = await getDbService().forceSyncAll();

    if (result.success) {
      res.json({ success: true, message: result.message });
    } else {
      res.status(400).json({ success: false, error: result.message });
    }
  } catch (error) {
    console.error("Error forcing sync:", error);
    res.status(500).json({
      success: false,
      error: "Failed to force sync",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/sync/status", async (req, res) => {
  try {
    const status = await getDbService().getSyncStatus();
    res.json({ success: true, data: status });
  } catch (error) {
    console.error("Error fetching sync status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch sync status",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Cache management endpoints
router.post("/cache/refresh", async (req, res) => {
  try {
    await getDbService().refreshCaches();
    res.json({ success: true, message: "Caches refreshed successfully" });
  } catch (error) {
    console.error("Error refreshing caches:", error);
    res.status(500).json({
      success: false,
      error: "Failed to refresh caches",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.get("/cache/status", async (req, res) => {
  try {
    const cacheAge = getDbService().getCacheAge();
    const needsRefresh = getDbService().needsCacheRefresh();

    res.json({
      success: true,
      data: {
        cacheAge,
        needsRefresh,
        ageInHours: {
          employees:
            Math.round((cacheAge.employees / (1000 * 60 * 60)) * 10) / 10,
          jobs: Math.round((cacheAge.jobs / (1000 * 60 * 60)) * 10) / 10,
          stock: Math.round((cacheAge.stock / (1000 * 60 * 60)) * 10) / 10,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching cache status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch cache status",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Health check endpoint
router.get("/health", async (req, res) => {
  try {
    const syncStatus = await getDbService().getSyncStatus();

    res.json({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        online: syncStatus.isOnline,
        pendingItems: {
          jobs: syncStatus.pendingJobs,
          stockUsage: syncStatus.pendingStockUsage,
          clockRecords: syncStatus.pendingClockRecords,
          safetyChecks: syncStatus.pendingSafetyChecks,
          incidentReports: syncStatus.pendingIncidentReports,
          networkAssessments: syncStatus.pendingNetworkAssessments,
        },
        lastSync: syncStatus.lastSync,
      },
    });
  } catch (error) {
    console.error("Error in health check:", error);
    res.status(500).json({
      success: false,
      error: "Health check failed",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
