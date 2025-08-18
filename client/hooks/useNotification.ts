import { useState, useCallback } from "react";

export interface NotificationData {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number; // in milliseconds, default 4000
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationState {
  notifications: NotificationData[];
}

let notificationCount = 0;
const generateId = () => `notification-${++notificationCount}-${Date.now()}`;

// Global notification state and listeners
let globalState: NotificationState = { notifications: [] };
const listeners = new Set<(state: NotificationState) => void>();

const notifyListeners = () => {
  listeners.forEach((listener) => listener({ ...globalState }));
};

const addNotification = (
  notification: Omit<NotificationData, "id">,
): string => {
  const id = generateId();
  const newNotification: NotificationData = {
    ...notification,
    id,
    duration: notification.duration || 4000,
  };

  globalState.notifications = [newNotification, ...globalState.notifications];
  notifyListeners();

  // Auto-remove after duration
  setTimeout(() => {
    removeNotification(id);
  }, newNotification.duration);

  return id;
};

const removeNotification = (id: string) => {
  globalState.notifications = globalState.notifications.filter(
    (n) => n.id !== id,
  );
  notifyListeners();
};

const clearAllNotifications = () => {
  globalState.notifications = [];
  notifyListeners();
};

// Convenience functions for different notification types
export const showNotification = {
  success: (
    title: string,
    message: string,
    options?: Partial<NotificationData>,
  ) => addNotification({ type: "success", title, message, ...options }),

  error: (
    title: string,
    message: string,
    options?: Partial<NotificationData>,
  ) => addNotification({ type: "error", title, message, ...options }),

  warning: (
    title: string,
    message: string,
    options?: Partial<NotificationData>,
  ) => addNotification({ type: "warning", title, message, ...options }),

  info: (title: string, message: string, options?: Partial<NotificationData>) =>
    addNotification({ type: "info", title, message, ...options }),

  // Special notification for job acceptance
  jobAccepted: (jobTitle: string, workOrderNumber?: string) =>
    addNotification({
      type: "success",
      title: "Job Accepted",
      message: `${jobTitle}${workOrderNumber ? ` (${workOrderNumber})` : ""} has been accepted successfully.`,
      duration: 5000,
    }),

  // Special notification for job completion
  jobCompleted: (jobTitle: string, workOrderNumber?: string) =>
    addNotification({
      type: "success",
      title: "Job Completed",
      message: `${jobTitle}${workOrderNumber ? ` (${workOrderNumber})` : ""} has been completed successfully.`,
      duration: 5000,
    }),

  // Location permission notifications
  locationGranted: () =>
    addNotification({
      type: "success",
      title: "Location Access Granted",
      message: "GPS tracking is now active for job proximity detection.",
      duration: 3000,
    }),

  locationDenied: () =>
    addNotification({
      type: "warning",
      title: "Location Access Denied",
      message: "Some features may be limited without location access.",
      duration: 5000,
    }),
};

export const useNotification = () => {
  const [state, setState] = useState<NotificationState>(globalState);

  const subscribe = useCallback(() => {
    listeners.add(setState);
    setState({ ...globalState });

    return () => {
      listeners.delete(setState);
    };
  }, []);

  const dismiss = useCallback((id: string) => {
    removeNotification(id);
  }, []);

  const clear = useCallback(() => {
    clearAllNotifications();
  }, []);

  return {
    notifications: state.notifications,
    addNotification,
    removeNotification: dismiss,
    clearAll: clear,
    subscribe,
    show: showNotification,
  };
};
