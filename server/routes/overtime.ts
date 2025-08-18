import { Router } from "express";
import {
  saveOvertimeSession,
  getOvertimeHistory,
  getAllOvertimeSessions,
  updateOvertimeStatus,
} from "./payroll";

const router = Router();

// Save overtime session (POST /api/overtime/sessions)
router.post("/sessions", saveOvertimeSession);

// Get overtime history for technician (GET /api/overtime/sessions/:technicianId/history)
router.get("/sessions/:technicianId/history", getOvertimeHistory);

// Get all overtime sessions (GET /api/overtime/sessions)
router.get("/sessions", getAllOvertimeSessions);

// Update overtime session status (PUT /api/overtime/sessions/:sessionId/status)
router.put("/sessions/:sessionId/status", updateOvertimeStatus);

export default router;
