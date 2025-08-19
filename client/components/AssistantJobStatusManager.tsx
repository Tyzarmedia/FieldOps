import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  Play, 
  Pause, 
  AlertCircle, 
  Clock,
  User
} from "lucide-react";
import { authManager } from "@/utils/auth";

interface Job {
  id: string;
  workOrderNumber: string;
  title: string;
  status: string;
  assignedTechnician: string;
  canModifyStatus?: boolean;
}

interface AssistantJobStatusManagerProps {
  job: Job;
  onStatusUpdate: (newStatus: string, notes?: string) => void;
  workingWithTechnician?: string;
}

export default function AssistantJobStatusManager({
  job,
  onStatusUpdate,
  workingWithTechnician,
}: AssistantJobStatusManagerProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [notes, setNotes] = useState("");
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);

  const handleStatusUpdate = async (newStatus: string, requiresNotes = false) => {
    if (requiresNotes && !notes.trim()) {
      setShowNotesInput(true);
      setPendingAction(newStatus);
      return;
    }

    try {
      setIsUpdating(true);
      const authUser = authManager.getUser();
      
      if (!authUser?.employeeId) {
        throw new Error("No employee ID found");
      }

      const response = await authManager.makeAuthenticatedRequest(
        `/api/job-mgmt/jobs/${job.id}/status`,
        {
          method: "PUT",
          body: JSON.stringify({
            status: newStatus,
            notes: notes.trim() || undefined,
            isAssistant: true,
            assistantId: authUser.employeeId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          onStatusUpdate(newStatus, notes.trim());
          setNotes("");
          setShowNotesInput(false);
          setPendingAction(null);
        } else {
          throw new Error(data.error || "Failed to update job status");
        }
      } else {
        throw new Error("Failed to update job status");
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      alert(error instanceof Error ? error.message : "Failed to update job status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmWithNotes = () => {
    if (pendingAction && notes.trim()) {
      handleStatusUpdate(pendingAction, false);
    }
  };

  const getAvailableActions = () => {
    const actions = [];

    switch (job.status) {
      case "Assigned":
        actions.push({
          label: "Accept Job",
          status: "Accepted",
          icon: CheckCircle,
          color: "bg-blue-600 hover:bg-blue-700",
          requiresNotes: false,
        });
        break;

      case "Accepted":
        actions.push({
          label: "Start Job",
          status: "In Progress",
          icon: Play,
          color: "bg-green-600 hover:bg-green-700",
          requiresNotes: false,
        });
        break;

      case "In Progress":
        actions.push({
          label: "Pause Job",
          status: "Accepted", // Return to accepted status
          icon: Pause,
          color: "bg-yellow-600 hover:bg-yellow-700",
          requiresNotes: true,
        });
        actions.push({
          label: "Complete Job",
          status: "Completed",
          icon: CheckCircle,
          color: "bg-purple-600 hover:bg-purple-700",
          requiresNotes: true,
        });
        break;

      default:
        break;
    }

    return actions;
  };

  const availableActions = getAvailableActions();

  if (!job.canModifyStatus) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You can view this job but cannot modify its status.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5 text-orange-500" />
          <span>Assistant Actions</span>
        </CardTitle>
        {workingWithTechnician && (
          <p className="text-sm text-gray-600">
            Working with Technician {workingWithTechnician}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Current Status:</span>
          <Badge variant="outline" className="ml-2">
            {job.status}
          </Badge>
        </div>

        {/* Status Update Actions */}
        {availableActions.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Available Actions:</h4>
            
            {availableActions.map((action) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={action.status}
                  onClick={() => handleStatusUpdate(action.status, action.requiresNotes)}
                  disabled={isUpdating}
                  className={`w-full flex items-center justify-center space-x-2 ${action.color}`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{action.label}</span>
                  {action.requiresNotes && (
                    <span className="text-xs opacity-75">(requires notes)</span>
                  )}
                </Button>
              );
            })}
          </div>
        )}

        {/* Notes Input */}
        {showNotesInput && (
          <div className="space-y-3 border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700">Add Notes:</h4>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes about this action..."
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
            <div className="flex space-x-2">
              <Button
                onClick={handleConfirmWithNotes}
                disabled={!notes.trim() || isUpdating}
                className="flex-1 bg-orange-600 hover:bg-orange-700"
              >
                Confirm Action
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowNotesInput(false);
                  setPendingAction(null);
                  setNotes("");
                }}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Completion Warning */}
        {job.status === "In Progress" && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Note:</strong> When you complete this job, it will be sent to the technician for review. 
              The technician must approve your completion before the job is marked as finished.
            </AlertDescription>
          </Alert>
        )}

        {/* Pending Review Status */}
        {job.status === "Pending Technician Review" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Awaiting Review:</strong> You've completed this job and it's now waiting for 
              technician approval. The technician will review your work and either approve or 
              request changes.
            </AlertDescription>
          </Alert>
        )}

        {/* No Actions Available */}
        {availableActions.length === 0 && job.status !== "Pending Technician Review" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No actions available for jobs with status "{job.status}".
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
