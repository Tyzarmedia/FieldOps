import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Calendar, 
  UserCheck, 
  CheckCircle, 
  PlayCircle, 
  CheckCircle2, 
  ArrowLeftCircle, 
  CheckSquare, 
  StopCircle, 
  RefreshCw, 
  AlertTriangle 
} from 'lucide-react';
import {
  JobStatus,
  JOB_STATUS_CONFIG,
  canTransitionTo,
  getAvailableTransitions,
  getStatusConfig,
  normalizeStatus
} from '@/types/jobStatus';

interface JobStatusManagerProps {
  currentStatus: JobStatus;
  jobData: any;
  userRole: string;
  onStatusChange: (newStatus: JobStatus) => Promise<void>;
  showButtons?: boolean;
  compact?: boolean;
}

const getStatusIcon = (status: JobStatus) => {
  const iconMap = {
    "scheduled": Calendar,
    "assigned": UserCheck,
    "accepted": CheckCircle,
    "in-progress": PlayCircle,
    "tech-finished": CheckCircle2,
    "sent-back-to-tech": ArrowLeftCircle,
    "job-completed": CheckSquare,
    "stopped": StopCircle,
    "convert-to-installation": RefreshCw,
    "sage-error-resubmit": AlertTriangle
  };
  
  const IconComponent = iconMap[status] || CheckCircle;
  return <IconComponent className="h-4 w-4" />;
};

export const JobStatusManager = ({
  currentStatus,
  jobData,
  userRole,
  onStatusChange,
  showButtons = true,
  compact = false
}: JobStatusManagerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const statusConfig = getStatusConfig(currentStatus);
  const availableTransitions = getAvailableTransitions(currentStatus, jobData, userRole);

  const handleStatusChange = async (newStatus: JobStatus) => {
    setIsLoading(true);
    try {
      await onStatusChange(newStatus);
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <Badge 
        className={`${statusConfig.bgColor} ${statusConfig.textColor} flex items-center space-x-1`}
      >
        {getStatusIcon(currentStatus)}
        <span>{statusConfig.label}</span>
      </Badge>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <span>Current Status</span>
          </CardTitle>
          <Badge 
            className={`${statusConfig.bgColor} ${statusConfig.textColor} flex items-center space-x-1`}
          >
            {getStatusIcon(currentStatus)}
            <span>{statusConfig.label}</span>
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{statusConfig.description}</p>
      </CardHeader>
      
      {showButtons && availableTransitions.length > 0 && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Available Actions:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {availableTransitions.map((status) => {
                const config = getStatusConfig(status);
                return (
                  <Button
                    key={status}
                    variant="outline"
                    size="sm"
                    className={`flex items-center space-x-2 justify-start hover:${config.bgColor} hover:text-white`}
                    onClick={() => handleStatusChange(status)}
                    disabled={isLoading}
                  >
                    {getStatusIcon(status)}
                    <span>{config.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

// Status display component for job lists
export const JobStatusBadge = ({
  status,
  size = "default"
}: {
  status: JobStatus | string;
  size?: "sm" | "default" | "lg"
}) => {
  const normalizedStatus = normalizeStatus(status as string);
  const config = getStatusConfig(normalizedStatus);
  
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    default: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2"
  };

  return (
    <Badge 
      className={`${config.bgColor} ${config.textColor} flex items-center space-x-1 ${sizeClasses[size]}`}
    >
      {getStatusIcon(status)}
      <span>{config.label}</span>
    </Badge>
  );
};

// Status workflow display component
export const JobStatusWorkflow = ({ 
  currentStatus, 
  completedStatuses = [] 
}: { 
  currentStatus: JobStatus;
  completedStatuses?: JobStatus[] 
}) => {
  const workflowOrder: JobStatus[] = [
    "scheduled",
    "assigned", 
    "accepted",
    "in-progress",
    "tech-finished",
    "job-completed"
  ];

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {workflowOrder.map((status, index) => {
        const config = getStatusConfig(status);
        const isCurrent = status === currentStatus;
        const isCompleted = completedStatuses.includes(status);
        const isPast = workflowOrder.indexOf(status) < workflowOrder.indexOf(currentStatus);
        
        return (
          <div key={status} className="flex items-center">
            <div
              className={`
                flex items-center space-x-1 px-2 py-1 rounded-full text-xs
                ${isCurrent ? `${config.bgColor} text-white` : 
                  isCompleted || isPast ? 'bg-gray-200 text-gray-700' : 
                  'bg-gray-100 text-gray-500'}
              `}
            >
              {getStatusIcon(status)}
              <span>{config.label}</span>
            </div>
            {index < workflowOrder.length - 1 && (
              <div className="mx-1 text-gray-400">→</div>
            )}
          </div>
        );
      })}
    </div>
  );
};
