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

// Shared notifications array (in real app this would be database)
export let notifications: Notification[] = [
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

export const createNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
  const newNotification: Notification = {
    id: (Date.now() + Math.random()).toString(),
    timestamp: new Date().toISOString(),
    read: false,
    deleted: false,
    ...notification
  };
  
  notifications.push(newNotification);
  console.log('Notification created:', newNotification);
  return newNotification;
};

export const getNotifications = (technicianId: string) => {
  return notifications.filter(n => n.technicianId === technicianId && !n.deleted);
};

export const deleteNotification = (notificationId: string, technicianId: string) => {
  const notificationIndex = notifications.findIndex(
    n => n.id === notificationId && n.technicianId === technicianId
  );
  
  if (notificationIndex !== -1) {
    notifications[notificationIndex].deleted = true;
    return true;
  }
  return false;
};
