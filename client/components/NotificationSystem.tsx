import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, Package, Briefcase, AlertTriangle } from "lucide-react";

interface Notification {
  id: string;
  type: "job_assigned" | "stock_assigned" | "alert";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: "low" | "medium" | "high";
}

interface NotificationSystemProps {
  technicianId: string;
}

export function NotificationSystem({ technicianId }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load notifications from localStorage and check for deleted ones
    const loadNotifications = async () => {
      try {
        // Get deleted notification IDs from localStorage
        const deletedIds = JSON.parse(
          localStorage.getItem(`deleted-notifications-${technicianId}`) || "[]",
        );

        // Try to fetch from API first
        const response = await fetch(
          `/api/notifications/technician/${technicianId}`,
        );
        let loadedNotifications: Notification[] = [];

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            loadedNotifications = result.data;
          }
        } else {
          // Check if we have cached notifications in localStorage first
          const cachedNotifications = localStorage.getItem(`notifications-${technicianId}`);
          if (cachedNotifications) {
            try {
              loadedNotifications = JSON.parse(cachedNotifications);
            } catch (e) {
              console.warn('Failed to parse cached notifications');
              loadedNotifications = [];
            }
          } else {
            // Only create mock data if no cached data exists
            loadedNotifications = [];
          }
        }

        // Filter out deleted notifications
        const filteredNotifications = loadedNotifications.filter(
          (n) => !deletedIds.includes(n.id),
        );

        setNotifications(filteredNotifications);
        setUnreadCount(filteredNotifications.filter((n) => !n.read).length);
      } catch (error) {
        console.error("Error loading notifications:", error);
      }
    };

    loadNotifications();
  }, [technicianId]);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const removeNotification = async (notificationId: string) => {
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }

    // Remove from local state
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

    // Persist deletion to prevent reappearing on refresh
    try {
      // First try to delete from database
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ technicianId }),
      });

      if (!response.ok) {
        console.warn(
          "Failed to delete notification from database, storing locally",
        );
      }

      // Always store deleted ID locally as backup
      const deletedIds = JSON.parse(
        localStorage.getItem(`deleted-notifications-${technicianId}`) || "[]",
      );
      if (!deletedIds.includes(notificationId)) {
        deletedIds.push(notificationId);
        localStorage.setItem(
          `deleted-notifications-${technicianId}`,
          JSON.stringify(deletedIds),
        );
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      // Store locally as fallback
      const deletedIds = JSON.parse(
        localStorage.getItem(`deleted-notifications-${technicianId}`) || "[]",
      );
      if (!deletedIds.includes(notificationId)) {
        deletedIds.push(notificationId);
        localStorage.setItem(
          `deleted-notifications-${technicianId}`,
          JSON.stringify(deletedIds),
        );
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "job_assigned":
        return <Briefcase className="h-4 w-4" />;
      case "stock_assigned":
        return <Package className="h-4 w-4" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative text-white hover:bg-white/20 border-none"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 py-0 min-w-[1.2rem] h-5">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Panel */}
      {showNotifications && (
        <Card className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-hidden z-50 shadow-lg">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">
                          {notification.title}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async (e) => {
                            e.stopPropagation();
                            await removeNotification(notification.id);
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge
                          className={getPriorityColor(notification.priority)}
                        >
                          {notification.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {new Date(
                            notification.timestamp,
                          ).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
