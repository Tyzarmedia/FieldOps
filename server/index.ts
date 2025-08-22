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
import {
  getPayrollPeriods,
  createPayrollPeriod,
  calculatePayroll,
  getPayrollCalculations,
  finalizePayroll,
} from "./routes/payroll-processing";
import {
  submitOvertimeRequest,
  getEmployeeOvertimeRequests,
  getTeamOvertimeRequests,
  reviewOvertimeRequest,
  cancelOvertimeRequest,
  getOvertimeRequestDetails,
  getOvertimeAnalytics,
} from "./routes/overtime-requests";
import warehouseStockRouter from "./routes/warehouse-stock";
import authRouter from "./routes/auth";
import securityRouter from "./routes/security";
import {
  getAvailableAssistants,
  createTechnicianAssistantAssignment,
  getCurrentAssignment,
  endAssignment,
} from "./routes/assistants";
import {
  getAllVehicles,
  getVehicleById,
  addVehicle,
  updateVehicle,
  assignVehicle,
  loanVehicle,
  removeVehicle,
  updateVehicleStatus,
} from "./routes/vehicles";
import {
  getFleetManagerSettings,
  saveFleetManagerSettings,
  updateSettingCategory,
} from "./routes/fleet-settings";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Add error handling middleware for JSON parsing
  app.use((error: any, req: any, res: any, next: any) => {
    if (error instanceof SyntaxError && "body" in error) {
      console.error("JSON parsing error:", error.message);
      return res.status(400).json({
        success: false,
        message: "Invalid JSON in request body",
      });
    }
    next();
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);

  // Authentication API
  app.use("/api/auth", authRouter);

  // Security Monitoring API
  app.use("/api/security", securityRouter);

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

  // Payroll Processing API
  app.get("/api/payroll/periods", getPayrollPeriods);
  app.post("/api/payroll/periods", createPayrollPeriod);
  app.post("/api/payroll/periods/:periodId/calculate", calculatePayroll);
  app.get("/api/payroll/periods/:periodId/calculations", getPayrollCalculations);
  app.post("/api/payroll/periods/:periodId/finalize", finalizePayroll);

  // Overtime Request Management API
  app.post("/api/overtime/requests", submitOvertimeRequest);
  app.get("/api/overtime/requests/:employeeId", getEmployeeOvertimeRequests);
  app.get("/api/overtime/requests/team/:supervisorId", getTeamOvertimeRequests);
  app.put("/api/overtime/requests/:requestId/review", reviewOvertimeRequest);
  app.put("/api/overtime/requests/:requestId/cancel", cancelOvertimeRequest);
  app.get("/api/overtime/requests/details/:requestId", getOvertimeRequestDetails);
  app.get("/api/overtime/analytics", getOvertimeAnalytics);

  // Warehouse Stock API
  app.use("/api/warehouse-stock", warehouseStockRouter);

  // Assistant Management API
  app.get("/api/assistants/available", getAvailableAssistants);
  app.post("/api/assistants/assignments", createTechnicianAssistantAssignment);
  app.get("/api/assistants/assignments/:technicianId", getCurrentAssignment);
  app.post("/api/assistants/assignments/:technicianId/end", endAssignment);

  // Fleet Vehicle Management API
  app.get("/api/vehicles", getAllVehicles);
  app.get("/api/vehicles/:id", getVehicleById);
  app.post("/api/vehicles", addVehicle);
  app.put("/api/vehicles/:id", updateVehicle);
  app.post("/api/vehicles/:id/assign", assignVehicle);
  app.post("/api/vehicles/:id/loan", loanVehicle);
  app.delete("/api/vehicles/:id", removeVehicle);
  app.patch("/api/vehicles/:id/status", updateVehicleStatus);

  // Fleet Manager Settings API
  app.get("/api/fleet-settings", getFleetManagerSettings);
  app.post("/api/fleet-settings", saveFleetManagerSettings);
  app.patch("/api/fleet-settings/:category", updateSettingCategory);

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
