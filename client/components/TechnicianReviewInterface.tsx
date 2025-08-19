import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MessageSquare,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { authManager } from "@/utils/auth";

interface PendingJob {
  id: string;
  workOrderNumber: string;
  title: string;
  description: string;
  status: string;
  reviewRequestedBy: string;
  reviewRequestedAt: string;
  requestedStatus: string;
  client: {
    name: string;
    address: string;
  };
  notes?: Array<{
    timestamp: string;
    technician: string;
    role: string;
    note: string;
  }>;
}

interface TechnicianReviewInterfaceProps {
  onReviewComplete?: () => void;
}

export default function TechnicianReviewInterface({ onReviewComplete }: TechnicianReviewInterfaceProps) {
  const [pendingJobs, setPendingJobs] = useState<PendingJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      const authUser = authManager.getUser();
      
      if (!authUser?.employeeId) {
        console.error("No employee ID found");
        return;
      }

      const response = await authManager.makeAuthenticatedRequest(
        `/api/job-mgmt/jobs/technician/${authUser.employeeId}/pending-review`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPendingJobs(data.data || []);
        }
      } else {
        console.error("Failed to fetch pending reviews");
        setPendingJobs([]);
      }
    } catch (error) {
      console.error("Error fetching pending reviews:", error);
      setPendingJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (jobId: string, action: "approve" | "reject") => {
    if (!reviewNotes.trim() && action === "reject") {
      alert("Please provide notes when rejecting a job completion");
      return;
    }

    try {
      setReviewing(jobId);
      const authUser = authManager.getUser();
      
      if (!authUser?.employeeId) {
        throw new Error("No employee ID found");
      }

      const response = await authManager.makeAuthenticatedRequest(
        `/api/job-mgmt/jobs/${jobId}/review`,
        {
          method: "PUT",
          body: JSON.stringify({
            action,
            notes: reviewNotes.trim() || `Job completion ${action}d by technician`,
            technicianId: authUser.employeeId,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Remove the reviewed job from the list
          setPendingJobs(prev => prev.filter(job => job.id !== jobId));
          setReviewNotes("");
          
          if (onReviewComplete) {
            onReviewComplete();
          }
        } else {
          throw new Error(data.error || "Failed to review job");
        }
      } else {
        throw new Error("Failed to review job");
      }
    } catch (error) {
      console.error("Error reviewing job:", error);
      alert(error instanceof Error ? error.message : "Failed to review job");
    } finally {
      setReviewing(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getAssistantNotes = (job: PendingJob) => {
    return job.notes?.filter(note => note.role === "assistant") || [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-orange-500 mr-2" />
        <span className="text-gray-600">Loading pending reviews...</span>
      </div>
    );
  }

  if (pendingJobs.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            All caught up!
          </h3>
          <p className="text-gray-600">
            No job completions pending your review at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Pending Reviews ({pendingJobs.length})
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchPendingReviews}
          className="flex items-center space-x-1"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>

      {pendingJobs.map((job) => {
        const assistantNotes = getAssistantNotes(job);
        const isCurrentlyReviewing = reviewing === job.id;

        return (
          <Card key={job.id} className="border-yellow-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{job.workOrderNumber}</Badge>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      {job.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-medium">
                    {job.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {job.client.name} • {job.client.address}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    Requested: {formatDate(job.reviewRequestedAt)}
                  </p>
                  <p className="text-xs text-gray-500">
                    By: Assistant {job.reviewRequestedBy}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Job Description */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Description:</h4>
                <p className="text-sm text-gray-600">{job.description}</p>
              </div>

              {/* Assistant Notes */}
              {assistantNotes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Assistant Notes:
                  </h4>
                  <div className="space-y-2">
                    {assistantNotes.map((note, index) => (
                      <div key={index} className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-700">{note.note}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(note.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Requested Action */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Requested Action:</strong> Mark job as "{job.requestedStatus}"
                </AlertDescription>
              </Alert>

              {/* Review Notes Input */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Review Notes: <span className="text-red-500">*</span>
                </h4>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add your review comments (required for rejection, optional for approval)..."
                  rows={3}
                  disabled={isCurrentlyReviewing}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-50"
                />
              </div>

              {/* Review Actions */}
              <div className="flex space-x-3 pt-2">
                <Button
                  onClick={() => handleReview(job.id, "approve")}
                  disabled={isCurrentlyReviewing}
                  className="flex-1 bg-green-600 hover:bg-green-700 flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>{isCurrentlyReviewing ? "Approving..." : "Approve"}</span>
                </Button>
                
                <Button
                  onClick={() => handleReview(job.id, "reject")}
                  disabled={isCurrentlyReviewing || !reviewNotes.trim()}
                  variant="destructive"
                  className="flex-1 flex items-center justify-center space-x-2"
                >
                  <XCircle className="h-4 w-4" />
                  <span>{isCurrentlyReviewing ? "Rejecting..." : "Reject"}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
