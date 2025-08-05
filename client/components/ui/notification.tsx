import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, X, AlertTriangle, Info, XCircle } from "lucide-react";

type NotificationType = "success" | "error" | "warning" | "info";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      const id = Math.random().toString(36).substr(2, 9);
      const newNotification = { ...notification, id };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto remove after duration
      const duration = notification.duration || 3000;
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    },
    [],
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  }, []);

  const success = useCallback(
    (title: string, message?: string) => {
      addNotification({ type: "success", title, message });
    },
    [addNotification],
  );

  const error = useCallback(
    (title: string, message?: string) => {
      addNotification({ type: "error", title, message });
    },
    [addNotification],
  );

  const warning = useCallback(
    (title: string, message?: string) => {
      addNotification({ type: "warning", title, message });
    },
    [addNotification],
  );

  const info = useCallback(
    (title: string, message?: string) => {
      addNotification({ type: "info", title, message });
    },
    [addNotification],
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
      <NotificationContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />
    </NotificationContext.Provider>
  );
};

interface NotificationContainerProps {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({
  notifications,
  removeNotification,
}) => {
  return (
    <div className="fixed inset-0 flex items-start justify-center pointer-events-none z-[9999] p-4">
      <div className="flex flex-col items-center space-y-2">
        {notifications.map((notification, index) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
  index: number;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRemove,
  index,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  React.useEffect(() => {
    // Trigger slide in animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(notification.id), 300);
  };

  const getIcon = () => {
    switch (notification.type) {
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-600" />;
      case "error":
        return <XCircle className="h-8 w-8 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-8 w-8 text-yellow-600" />;
      case "info":
        return <Info className="h-8 w-8 text-blue-600" />;
      default:
        return <CheckCircle className="h-8 w-8 text-green-600" />;
    }
  };

  const getBgColor = () => {
    switch (notification.type) {
      case "success":
        return "bg-white border-green-200 shadow-green-100";
      case "error":
        return "bg-white border-red-200 shadow-red-100";
      case "warning":
        return "bg-white border-yellow-200 shadow-yellow-100";
      case "info":
        return "bg-white border-blue-200 shadow-blue-100";
      default:
        return "bg-white border-green-200 shadow-green-100";
    }
  };

  return (
    <div
      className={`
        pointer-events-auto
        transform transition-all duration-500 ease-out
        ${
          isVisible && !isLeaving
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-8 opacity-0 scale-95"
        }
      `}
      style={{
        transitionDelay: `${index * 100}ms`,
      }}
    >
      <div
        className={`
        relative
        min-w-[300px] max-w-[400px]
        p-6
        rounded-2xl
        border-2
        ${getBgColor()}
        shadow-2xl
        backdrop-blur-sm
      `}
      >
        {/* Close button */}
        <button
          onClick={handleRemove}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Icon */}
          <div className="animate-pulse">{getIcon()}</div>

          {/* Title */}
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-900">
              {notification.title}
            </h3>
            {notification.message && (
              <p className="text-sm text-gray-600">{notification.message}</p>
            )}
          </div>
        </div>

        {/* Animated border for success */}
        {notification.type === "success" && (
          <div className="absolute inset-0 rounded-2xl border-2 border-green-400 animate-ping opacity-20"></div>
        )}
      </div>
    </div>
  );
};

export default NotificationProvider;
