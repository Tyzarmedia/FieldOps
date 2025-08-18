// Job Status Types based on the workflow shown in the UI
export type JobStatus = 
  | "assigned"
  | "accepted" 
  | "in-progress"
  | "tech-finished"
  | "sent-back-to-tech"
  | "job-completed"
  | "stopped"
  | "convert-to-installation"
  | "sage-error-resubmit"
  | "scheduled";

// Job Status Display Configuration
export interface JobStatusConfig {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  description: string;
  allowedTransitions: JobStatus[];
  icon?: string;
}

// Job Status Configurations
export const JOB_STATUS_CONFIG: Record<JobStatus, JobStatusConfig> = {
  "scheduled": {
    label: "Scheduled",
    color: "#8B5CF6", // Purple
    bgColor: "bg-purple-500",
    textColor: "text-purple-800",
    description: "Job is scheduled for a future date",
    allowedTransitions: ["assigned"],
    icon: "calendar"
  },
  "assigned": {
    label: "Assigned",
    color: "#3B82F6", // Blue
    bgColor: "bg-blue-500",
    textColor: "text-blue-800",
    description: "Job assigned to technician, awaiting acceptance",
    allowedTransitions: ["accepted", "sent-back-to-tech"],
    icon: "user-check"
  },
  "accepted": {
    label: "Accepted",
    color: "#F97316", // Orange
    bgColor: "bg-orange-500",
    textColor: "text-orange-800",
    description: "Technician has accepted the job",
    allowedTransitions: ["in-progress", "sent-back-to-tech"],
    icon: "check-circle"
  },
  "in-progress": {
    label: "In Progress",
    color: "#10B981", // Green
    bgColor: "bg-green-500",
    textColor: "text-green-800",
    description: "Work is actively being performed",
    allowedTransitions: ["tech-finished", "stopped", "sent-back-to-tech"],
    icon: "play-circle"
  },
  "tech-finished": {
    label: "Tech Finished",
    color: "#00FF00", // Bright Green
    bgColor: "bg-lime-500",
    textColor: "text-lime-800",
    description: "Technician has completed the work",
    allowedTransitions: ["job-completed", "sent-back-to-tech", "convert-to-installation"],
    icon: "check-circle-2"
  },
  "sent-back-to-tech": {
    label: "Sent Back To Tech",
    color: "#EC4899", // Pink
    bgColor: "bg-pink-500",
    textColor: "text-pink-800",
    description: "Job returned to technician for additional work",
    allowedTransitions: ["accepted", "in-progress"],
    icon: "arrow-left-circle"
  },
  "job-completed": {
    label: "Job Completed",
    color: "#22C55E", // Green
    bgColor: "bg-green-600",
    textColor: "text-green-800",
    description: "Job fully completed and verified",
    allowedTransitions: ["sage-error-resubmit"],
    icon: "check-square"
  },
  "stopped": {
    label: "Stopped",
    color: "#EF4444", // Red
    bgColor: "bg-red-500",
    textColor: "text-red-800",
    description: "Job has been stopped or cancelled",
    allowedTransitions: ["assigned", "accepted"],
    icon: "stop-circle"
  },
  "convert-to-installation": {
    label: "Convert To Installation",
    color: "#F59E0B", // Amber
    bgColor: "bg-amber-500",
    textColor: "text-amber-800",
    description: "Converting job type to installation",
    allowedTransitions: ["assigned"],
    icon: "refresh-cw"
  },
  "sage-error-resubmit": {
    label: "Sage Error - Resubmit",
    color: "#7F1D1D", // Dark Red
    bgColor: "bg-red-800",
    textColor: "text-red-100",
    description: "Integration error, requires resubmission",
    allowedTransitions: ["job-completed"],
    icon: "alert-triangle"
  }
};

// Status transition rules and conditions
export interface StatusTransitionCondition {
  from: JobStatus;
  to: JobStatus;
  condition: (jobData: any, userRole: string) => boolean;
  description: string;
}

export const STATUS_TRANSITION_CONDITIONS: StatusTransitionCondition[] = [
  // Scheduled -> Assigned
  {
    from: "scheduled",
    to: "assigned",
    condition: (jobData, userRole) => 
      ["Coordinator", "Manager", "SystemAdmin"].includes(userRole) && 
      jobData.assignedTechnician,
    description: "Coordinator assigns job to technician"
  },

  // Assigned -> Accepted
  {
    from: "assigned",
    to: "accepted",
    condition: (jobData, userRole) => 
      ["Technician", "AssistantTechnician"].includes(userRole) &&
      (jobData.assignedTechnician === userRole || jobData.assistantTechnician === userRole),
    description: "Technician accepts assigned job"
  },

  // Assigned -> Sent Back
  {
    from: "assigned",
    to: "sent-back-to-tech",
    condition: (jobData, userRole) => 
      ["Coordinator", "Manager"].includes(userRole),
    description: "Coordinator sends job back for clarification"
  },

  // Accepted -> In Progress
  {
    from: "accepted",
    to: "in-progress",
    condition: (jobData, userRole) => 
      ["Technician", "AssistantTechnician"].includes(userRole) &&
      jobData.isNearJobLocation === true,
    description: "Technician starts work (must be at job location)"
  },

  // Accepted -> Sent Back
  {
    from: "accepted",
    to: "sent-back-to-tech",
    condition: (jobData, userRole) => 
      ["Coordinator", "Manager"].includes(userRole),
    description: "Coordinator requests additional information"
  },

  // In Progress -> Tech Finished
  {
    from: "in-progress",
    to: "tech-finished",
    condition: (jobData, userRole) => 
      ["Technician", "AssistantTechnician"].includes(userRole) &&
      jobData.udfCompleted === true &&
      jobData.stockUsageRecorded === true,
    description: "Technician completes work (UDF and stock usage required)"
  },

  // In Progress -> Stopped
  {
    from: "in-progress",
    to: "stopped",
    condition: (jobData, userRole) => 
      ["Technician", "AssistantTechnician", "Coordinator", "Manager"].includes(userRole),
    description: "Job stopped due to issues or cancellation"
  },

  // In Progress -> Sent Back
  {
    from: "in-progress",
    to: "sent-back-to-tech",
    condition: (jobData, userRole) => 
      ["Coordinator", "Manager"].includes(userRole),
    description: "Coordinator requires additional work"
  },

  // Tech Finished -> Job Completed
  {
    from: "tech-finished",
    to: "job-completed",
    condition: (jobData, userRole) => 
      ["Coordinator", "Manager"].includes(userRole) &&
      jobData.customerSignOff === true &&
      jobData.qualityCheckPassed === true,
    description: "Coordinator verifies and approves completion"
  },

  // Tech Finished -> Convert to Installation
  {
    from: "tech-finished",
    to: "convert-to-installation",
    condition: (jobData, userRole) => 
      ["Coordinator", "Manager"].includes(userRole) &&
      jobData.requiresInstallation === true,
    description: "Job requires conversion to installation type"
  },

  // Tech Finished -> Sent Back
  {
    from: "tech-finished",
    to: "sent-back-to-tech",
    condition: (jobData, userRole) => 
      ["Coordinator", "Manager"].includes(userRole) &&
      (jobData.qualityCheckPassed === false || jobData.customerSignOff === false),
    description: "Quality check failed or customer sign-off missing"
  },

  // Sent Back -> Accepted
  {
    from: "sent-back-to-tech",
    to: "accepted",
    condition: (jobData, userRole) => 
      ["Technician", "AssistantTechnician"].includes(userRole) &&
      jobData.issuesResolved === true,
    description: "Technician addresses issues and re-accepts"
  },

  // Job Completed -> Sage Error
  {
    from: "job-completed",
    to: "sage-error-resubmit",
    condition: (jobData, userRole) => 
      jobData.sageIntegrationError === true,
    description: "System error during Sage integration"
  },

  // Sage Error -> Job Completed
  {
    from: "sage-error-resubmit",
    to: "job-completed",
    condition: (jobData, userRole) => 
      ["SystemAdmin", "Manager"].includes(userRole) &&
      jobData.sageIntegrationError === false,
    description: "System admin resolves integration error"
  },

  // Stopped -> Assigned (restart)
  {
    from: "stopped",
    to: "assigned",
    condition: (jobData, userRole) => 
      ["Coordinator", "Manager"].includes(userRole),
    description: "Coordinator restarts stopped job"
  },

  // Convert to Installation -> Assigned
  {
    from: "convert-to-installation",
    to: "assigned",
    condition: (jobData, userRole) => 
      ["Coordinator", "Manager"].includes(userRole) &&
      jobData.installationJobCreated === true,
    description: "New installation job created and assigned"
  }
];

// Helper functions
export const getStatusConfig = (status: JobStatus): JobStatusConfig => {
  return JOB_STATUS_CONFIG[status];
};

export const canTransitionTo = (
  fromStatus: JobStatus, 
  toStatus: JobStatus, 
  jobData: any, 
  userRole: string
): boolean => {
  const config = JOB_STATUS_CONFIG[fromStatus];
  if (!config.allowedTransitions.includes(toStatus)) {
    return false;
  }

  const condition = STATUS_TRANSITION_CONDITIONS.find(
    c => c.from === fromStatus && c.to === toStatus
  );

  return condition ? condition.condition(jobData, userRole) : false;
};

export const getAvailableTransitions = (
  currentStatus: JobStatus, 
  jobData: any, 
  userRole: string
): JobStatus[] => {
  const config = JOB_STATUS_CONFIG[currentStatus];
  return config.allowedTransitions.filter(status => 
    canTransitionTo(currentStatus, status, jobData, userRole)
  );
};

export const getStatusDescription = (status: JobStatus): string => {
  return JOB_STATUS_CONFIG[status].description;
};

export const isStatusActive = (status: JobStatus): boolean => {
  return !["stopped", "job-completed", "sage-error-resubmit"].includes(status);
};

export const getStatusPriority = (status: JobStatus): number => {
  const priorities: Record<JobStatus, number> = {
    "scheduled": 1,
    "assigned": 2,
    "accepted": 3,
    "in-progress": 4,
    "tech-finished": 5,
    "sent-back-to-tech": 3, // Same as accepted
    "job-completed": 6,
    "stopped": 0,
    "convert-to-installation": 5, // Same as tech-finished
    "sage-error-resubmit": 6 // Same as completed
  };
  
  return priorities[status] || 0;
};
