import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Bell,
  BellRing,
  X,
  Clock,
  User,
  Package,
  AlertTriangle,
  CheckCircle,
  Info,
  Settings,
  Eye,
  Check,
} from "lucide-react";

interface Notification {
  id: string;
  type:
    | "job_assigned"
    | "stock_assigned"
    | "job_status_changed"
    | "stock_requested"
    | "stock_returned"
    | "user_action";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "high" | "medium" | "low";
  userId: string;
  userRole: string;
  actionUrl?: string;
  metadata?: any;
}

interface NotificationCenterProps {
  userId: string;
  userRole: "manager" | "coordinator" | "technician" | "stock_manager";
}

export function NotificationCenter({
  userId,
  userRole,
}: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch notifications on component mount
  useEffect(() => {
    fetchNotifications();

    // Set up real-time notification listener
    const eventSource = new EventSource(
      `/api/notifications/stream?userId=${userId}`,
    );

    eventSource.onmessage = (event) => {
      const newNotification = JSON.parse(event.data);
      addNotification(newNotification);
    };

    eventSource.onerror = () => {
      console.error("Notification stream error");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [userId]);

  // Update unread count when notifications change
  useEffect(() => {
    const unread = notifications.filter((n) => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `/api/notifications/user/${userId}?role=${userRole}`,
      );
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [notification, ...prev]);

    // Show browser notification if permission is granted
    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/notification-icon.png",
        tag: notification.id,
      });
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PUT",
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`/api/notifications/user/${userId}/read-all`, {
        method: "PUT",
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });

      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "job_assigned":
      case "job_status_changed":
        return <User className="h-4 w-4 text-blue-500" />;
      case "stock_assigned":
      case "stock_requested":
      case "stock_returned":
        return <Package className="h-4 w-4 text-green-500" />;
      case "user_action":
        return <Settings className="h-4 w-4 text-purple-500" />;
      default:
        return <Info className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  // Role-specific notification filtering
  const getFilteredNotifications = () => {
    return notifications.filter((notification) => {
      switch (userRole) {
        case "technician":
          return ["job_assigned", "stock_assigned"].includes(notification.type);
        case "coordinator":
          return ["job_status_changed", "user_action"].includes(
            notification.type,
          );
        case "stock_manager":
          return ["stock_requested", "stock_returned"].includes(
            notification.type,
          );
        case "manager":
          return true; // Managers see all notifications
        default:
          return true;
      }
    });
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <>
      {/* Notification Bell Button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="relative"
          onClick={() => setShowPanel(!showPanel)}
        >
          {unreadCount > 0 ? (
            <BellRing className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>

        {/* Notification Panel */}
        {showPanel && (
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <Button size="sm" variant="ghost" onClick={markAllAsRead}>
                      Mark all read
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPanel(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-gray-500">
                  Loading notifications...
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                <div className="divide-y">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="text-sm font-medium text-gray-900 truncate">
                                {notification.title}
                              </h4>
                              <Badge
                                className={`text-xs ${getPriorityColor(notification.priority)}`}
                              >
                                {notification.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                              <div className="flex items-center space-x-1">
                                {!notification.read && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => markAsRead(notification.id)}
                                    className="h-6 px-2"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() =>
                                    deleteNotification(notification.id)
                                  }
                                  className="h-6 px-2 text-red-500 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {filteredNotifications.length > 0 && (
              <div className="p-3 border-t bg-gray-50 text-center">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowPanel(false);
                    // Navigate to full notifications page
                    window.location.href = "/notifications";
                  }}
                >
                  View all notifications
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlay to close panel when clicking outside */}
      {showPanel && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowPanel(false)}
        />
      )}
    </>
  );
}

// Hook for sending notifications
export const useNotifications = () => {
  const sendNotification = async (
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notification),
      });

      if (!response.ok) {
        throw new Error("Failed to send notification");
      }

      return await response.json();
    } catch (error) {
      console.error("Failed to send notification:", error);
      throw error;
    }
  };

  // Specific notification senders
  const notifyJobAssigned = (
    technicianId: string,
    jobId: string,
    jobTitle: string,
  ) => {
    return sendNotification({
      type: "job_assigned",
      title: "New Job Assigned",
      message: `You have been assigned job: ${jobTitle}`,
      priority: "high",
      userId: technicianId,
      userRole: "technician",
      actionUrl: `/technician/jobs/${jobId}`,
      metadata: { jobId, jobTitle },
    });
  };

  const notifyStockAssigned = (technicianId: string, stockItems: string[]) => {
    return sendNotification({
      type: "stock_assigned",
      title: "Stock Assigned",
      message: `New stock items have been assigned to you: ${stockItems.join(", ")}`,
      priority: "medium",
      userId: technicianId,
      userRole: "technician",
      actionUrl: "/technician/stock",
      metadata: { stockItems },
    });
  };

  const notifyJobStatusChanged = (
    coordinatorId: string,
    jobId: string,
    status: string,
    technicianName: string,
  ) => {
    return sendNotification({
      type: "job_status_changed",
      title: "Job Status Updated",
      message: `Job ${jobId} status changed to ${status} by ${technicianName}`,
      priority: "medium",
      userId: coordinatorId,
      userRole: "coordinator",
      actionUrl: `/coordinator/jobs/${jobId}`,
      metadata: { jobId, status, technicianName },
    });
  };

  const notifyStockRequested = (
    stockManagerId: string,
    technicianName: string,
    stockItems: string[],
  ) => {
    return sendNotification({
      type: "stock_requested",
      title: "Stock Request",
      message: `${technicianName} has requested: ${stockItems.join(", ")}`,
      priority: "high",
      userId: stockManagerId,
      userRole: "stock_manager",
      actionUrl: "/stock-manager/requests",
      metadata: { technicianName, stockItems },
    });
  };

  const notifyStockReturned = (
    stockManagerId: string,
    technicianName: string,
    stockItems: string[],
  ) => {
    return sendNotification({
      type: "stock_returned",
      title: "Stock Returned",
      message: `${technicianName} has returned: ${stockItems.join(", ")}`,
      priority: "medium",
      userId: stockManagerId,
      userRole: "stock_manager",
      actionUrl: "/stock-manager/returns",
      metadata: { technicianName, stockItems },
    });
  };

  return {
    sendNotification,
    notifyJobAssigned,
    notifyStockAssigned,
    notifyJobStatusChanged,
    notifyStockRequested,
    notifyStockReturned,
  };
};
