import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getJobs,
  getJobsByTechnician,
  createJob,
  updateJob,
  allocateStock,
  closeJob,
  startJobTracking,
  toggleJobTracking,
  getOvertime,
  submitOvertime,
  getInspections,
  submitInspection,
  getMissingInspections,
} from "./routes/jobs";
import jobManagementRouter from "./routes/job-management";
import stockManagementRouter from "./routes/stock-management";
import notificationsRouter from "./routes/notifications";
import technicianStatusRouter from "./routes/technician-status";
import networkAssessmentsRouter from "./routes/network-assessments";
import overtimeRouter from "./routes/overtime";
import { getOvertimeRate } from "./routes/payroll";
import warehouseStockRouter from "./routes/warehouse-stock";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // New Job Management API (must come before old routes)
  app.use("/api/job-mgmt", jobManagementRouter);

  // Stock Management API
  app.use("/api/stock-management", stockManagementRouter);

  // Notifications API
  app.use("/api/notifications", notificationsRouter);

  // Technician Status API
  app.use("/api/technician-status", technicianStatusRouter);

  // Network Assessments API
  app.use("/api/network-assessments", networkAssessmentsRouter);

  // Overtime API
  app.use("/api/overtime", overtimeRouter);

  // Payroll API
  app.get("/api/payroll/overtime-rate/:technicianId", getOvertimeRate);

  // Warehouse Stock API
  app.use("/api/warehouse-stock", warehouseStockRouter);

  // Job Management API
  app.get("/api/jobs", getJobs);
  app.get("/api/jobs/technician/:technicianId", getJobsByTechnician);
  app.post("/api/jobs", createJob);
  app.put("/api/jobs/:jobId", updateJob);
  app.post("/api/jobs/:jobId/allocate-stock", allocateStock);
  app.post("/api/jobs/:jobId/close", closeJob);
  app.post("/api/jobs/:jobId/start-tracking", startJobTracking);
  app.post("/api/jobs/:jobId/toggle-tracking", toggleJobTracking);

  // Overtime API
  app.get("/api/overtime", getOvertime);
  app.post("/api/overtime", submitOvertime);

  // Inspections API
  app.get("/api/inspections", getInspections);
  app.post("/api/inspections", submitInspection);
  app.get("/api/inspections/missing", getMissingInspections);

  // Database Integration API (lazy-loaded to avoid build-time issues)
  app.use("/api/db", async (req, res, next) => {
    const { default: databaseRouter } = await import("./routes/database");
    databaseRouter(req, res, next);
  });

  return app;
}
