import { Router, RequestHandler } from "express";
import fs from "fs";
import path from "path";

const router = Router();

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
    return { networkAssessments: [] };
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

// Create new network assessment
router.post("/", (req, res) => {
  try {
    const assessmentData = req.body;
    const db = readDatabase();

    // Initialize networkAssessments if not exists
    if (!db.networkAssessments) {
      db.networkAssessments = [];
    }

    // Add assessment with auto-generated ID if not provided
    const newAssessment = {
      id: assessmentData.id || `NA-${Date.now()}`,
      ...assessmentData,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
    };

    db.networkAssessments.push(newAssessment);

    if (writeDatabase(db)) {
      res.json({
        success: true,
        data: newAssessment,
        message: "Network assessment saved successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to save network assessment",
      });
    }
  } catch (error) {
    console.error("Error creating network assessment:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get all network assessments (for managers)
router.get("/", (req, res) => {
  try {
    const db = readDatabase();
    const assessments = db.networkAssessments || [];

    res.json({
      success: true,
      data: assessments,
    });
  } catch (error) {
    console.error("Error fetching network assessments:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch network assessments",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get network assessments by technician
router.get("/technician/:technicianId", (req, res) => {
  try {
    const { technicianId } = req.params;
    const db = readDatabase();
    const assessments = (db.networkAssessments || []).filter(
      (assessment: any) => assessment.technicianId === technicianId,
    );

    res.json({
      success: true,
      data: assessments,
    });
  } catch (error) {
    console.error("Error fetching technician assessments:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch technician assessments",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get single network assessment
router.get("/:assessmentId", (req, res) => {
  try {
    const { assessmentId } = req.params;
    const db = readDatabase();
    const assessment = (db.networkAssessments || []).find(
      (a: any) => a.id === assessmentId,
    );

    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: "Network assessment not found",
      });
    }

    res.json({
      success: true,
      data: assessment,
    });
  } catch (error) {
    console.error("Error fetching network assessment:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch network assessment",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update network assessment
router.put("/:assessmentId", (req, res) => {
  try {
    const { assessmentId } = req.params;
    const updates = req.body;
    const db = readDatabase();

    if (!db.networkAssessments) {
      db.networkAssessments = [];
    }

    const assessmentIndex = db.networkAssessments.findIndex(
      (a: any) => a.id === assessmentId,
    );

    if (assessmentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Network assessment not found",
      });
    }

    // Update assessment
    db.networkAssessments[assessmentIndex] = {
      ...db.networkAssessments[assessmentIndex],
      ...updates,
      lastModified: new Date().toISOString(),
    };

    if (writeDatabase(db)) {
      res.json({
        success: true,
        data: db.networkAssessments[assessmentIndex],
        message: "Network assessment updated successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to update network assessment",
      });
    }
  } catch (error) {
    console.error("Error updating network assessment:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Delete network assessment
router.delete("/:assessmentId", (req, res) => {
  try {
    const { assessmentId } = req.params;
    const db = readDatabase();

    if (!db.networkAssessments) {
      return res.status(404).json({
        success: false,
        error: "Network assessment not found",
      });
    }

    const assessmentIndex = db.networkAssessments.findIndex(
      (a: any) => a.id === assessmentId,
    );

    if (assessmentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Network assessment not found",
      });
    }

    // Remove assessment
    db.networkAssessments.splice(assessmentIndex, 1);

    if (writeDatabase(db)) {
      res.json({
        success: true,
        message: "Network assessment deleted successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to delete network assessment",
      });
    }
  } catch (error) {
    console.error("Error deleting network assessment:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
