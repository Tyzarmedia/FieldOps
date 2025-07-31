import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getJobs,
  getJobsByTechnician,
  createJob,
  updateJob,
  closeJob,
  startJobTracking,
  toggleJobTracking,
  getOvertime,
  submitOvertime,
  getInspections,
  submitInspection,
  getMissingInspections,
} from "./routes/jobs";

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

  // Job Management API
  app.get("/api/jobs", getJobs);
  app.get("/api/jobs/technician/:technicianId", getJobsByTechnician);
  app.post("/api/jobs", createJob);
  app.put("/api/jobs/:jobId", updateJob);
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

  return app;
}
