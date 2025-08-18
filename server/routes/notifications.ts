import express from "express";
import {
  notifications,
  createNotification,
  getNotifications,
  deleteNotification,
} from "../services/notificationService";

const router = express.Router();

// Get notifications for a technician
router.get("/technician/:technicianId", (req, res) => {
  try {
    const { technicianId } = req.params;
    const technicianNotifications = getNotifications(technicianId);

    res.json({
      success: true,
      data: technicianNotifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
});

// Delete a notification
router.delete("/:notificationId", (req, res) => {
  try {
    const { notificationId } = req.params;
    const { technicianId } = req.body;

    const deleted = deleteNotification(notificationId, technicianId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
});

// Mark notification as read
router.put("/:notificationId/read", (req, res) => {
  try {
    const { notificationId } = req.params;
    const { technicianId } = req.body;

    const notificationIndex = notifications.findIndex(
      (n) => n.id === notificationId && n.technicianId === technicianId,
    );

    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    notifications[notificationIndex].read = true;

    res.json({
      success: true,
      data: notifications[notificationIndex],
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
});

// Create new notification (for system use)
router.post("/", (req, res) => {
  try {
    const notification = createNotification(req.body);

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create notification",
    });
  }
});

// Create UDF completion notification
router.post("/udf-completed", (req, res) => {
  try {
    const { jobId, technicianId, technicianName, timestamp } = req.body;

    const notification = createNotification({
      technicianId: "manager001", // In real app, would notify relevant managers/coordinators
      type: "info",
      title: "UDF Completed",
      message: `User Defined Fields completed by ${technicianName} for job ${jobId}`,
      priority: "medium",
      metadata: {
        jobId,
        technicianId,
        technicianName,
        timestamp,
        action: "udf_completed",
      },
    });

    res.json({
      success: true,
      data: notification,
      message: "UDF completion notification created successfully",
    });
  } catch (error) {
    console.error("Error creating UDF completion notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create UDF completion notification",
    });
  }
});

// Create overtime notification
router.post("/overtime", (req, res) => {
  try {
    const {
      sessionId,
      technicianId,
      action,
      totalHours,
      workOrderNumbers,
      reason,
      timestamp,
    } = req.body;

    let title, message;
    if (action === "started") {
      title = "Overtime Session Started";
      message = `Overtime tracking started. Reason: ${reason}`;
    } else if (action === "ended") {
      title = "Overtime Session Completed";
      message = `Overtime session completed. Total hours: ${totalHours?.toFixed(1) || 0}h`;
    } else {
      title = "Overtime Update";
      message = `Overtime session ${action}`;
    }

    const notification = createNotification({
      technicianId,
      type: "overtime",
      title,
      message,
      priority: "medium",
      metadata: {
        sessionId,
        action,
        totalHours,
        workOrderNumbers,
        reason,
        timestamp,
      },
    });

    res.json({
      success: true,
      data: notification,
      message: "Overtime notification created successfully",
    });
  } catch (error) {
    console.error("Error creating overtime notification:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create overtime notification",
    });
  }
});

export default router;
