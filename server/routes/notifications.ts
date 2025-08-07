import express from "express";

const router = express.Router();

interface Notification {
  id: string;
  technicianId: string;
  type: "job_assigned" | "stock_assigned" | "alert";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high";
  deleted?: boolean;
}

// In-memory storage for notifications (in real app this would be database)
let notifications: Notification[] = [
  {
    id: "1",
    technicianId: "tech001",
    type: "job_assigned",
    title: "New Job Assigned",
    message: "FTTH Installation - SA-688808 has been assigned to you",
    timestamp: new Date().toISOString(),
    read: false,
    priority: "high",
  },
  {
    id: "2",
    technicianId: "tech001",
    type: "stock_assigned",
    title: "Stock Assigned",
    message:
      "Fiber Optic Cable (500 meters) has been assigned to your inventory",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    read: false,
    priority: "medium",
  },
  {
    id: "3",
    technicianId: "coordinator001",
    type: "alert",
    title: "Job Status Update",
    message: "Technician has completed FTTH Installation job",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    read: false,
    priority: "low",
  },
];

// Get notifications for a technician
router.get("/technician/:technicianId", (req, res) => {
  try {
    const { technicianId } = req.params;

    // Filter notifications for this technician and exclude deleted ones
    const technicianNotifications = notifications.filter(
      (n) => n.technicianId === technicianId && !n.deleted,
    );

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

    // Find and mark notification as deleted
    const notificationIndex = notifications.findIndex(
      (n) => n.id === notificationId && n.technicianId === technicianId,
    );

    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Mark as deleted instead of removing (for audit trail)
    notifications[notificationIndex].deleted = true;

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
    const notification: Notification = {
      id: Date.now().toString(),
      ...req.body,
      timestamp: new Date().toISOString(),
      read: false,
      deleted: false,
    };

    notifications.push(notification);

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

export default router;
