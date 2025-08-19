import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  User, 
  Briefcase,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Eye
} from "lucide-react";
import { authManager } from "@/utils/auth";

interface Job {
  id: string;
  workOrderNumber: string;
  title: string;
  description: string;
  type: string;
  priority: "High" | "Medium" | "Low";
  status: string;
  assignedTechnician: string;
  client: {
    name: string;
    address: string;
    contactPerson: string;
    phone: string;
  };
  estimatedHours: number;
  scheduledDate: string;
  assistantAccess?: boolean;
  workingWithTechnician?: string;
  canModifyStatus?: boolean;
  requiresTechnicianReview?: boolean;
}

export default function AssistantJobsScreen() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignedTechnician, setAssignedTechnician] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const authUser = authManager.getUser();
      if (!authUser?.employeeId) {
        console.error("No employee ID found");
        return;
      }

      setRefreshing(true);
      const response = await authManager.makeAuthenticatedRequest(
        `/api/job-mgmt/jobs/assistant/${authUser.employeeId}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setJobs(data.data || []);
          setAssignedTechnician(data.technicianId);
        }
      } else {
        console.error("Failed to fetch assistant jobs");
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching assistant jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Assigned":
        return "bg-blue-100 text-blue-800";
      case "Accepted":
        return "bg-purple-100 text-purple-800";
      case "In Progress":
        return "bg-green-100 text-green-800";
      case "Completed":
        return "bg-gray-100 text-gray-800";
      case "Pending Technician Review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleJobClick = (job: Job) => {
    // Navigate to job details with assistant context
    navigate(`/assistant/jobs/${job.id}`, { 
      state: { 
        job, 
        isAssistant: true,
        workingWithTechnician: assignedTechnician 
      } 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin text-orange-500" />
          <span className="text-gray-600">Loading jobs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/assistant-technician")}
                className="text-gray-600 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Assigned Jobs
                </h1>
                {assignedTechnician && (
                  <p className="text-sm text-gray-600">
                    Working with Technician {assignedTechnician}
                  </p>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchJobs}
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {!assignedTechnician && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You are not currently assigned to work with a technician. 
              Clock in with a technician to see assigned jobs.
            </AlertDescription>
          </Alert>
        )}

        {assignedTechnician && jobs.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No jobs assigned
              </h3>
              <p className="text-gray-600">
                The technician you're working with has no active jobs at the moment.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Jobs List */}
        {jobs.map((job) => (
          <Card 
            key={job.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleJobClick(job)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {job.workOrderNumber}
                    </Badge>
                    <Badge className={getPriorityColor(job.priority)}>
                      {job.priority}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-medium text-gray-900">
                    {job.title}
                  </CardTitle>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge className={getStatusColor(job.status)}>
                    {job.status}
                  </Badge>
                  {job.status === "Pending Technician Review" && (
                    <Badge variant="outline" className="text-xs bg-yellow-50">
                      Awaiting Review
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {job.description}
              </p>
              
              {/* Job Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <User className="h-4 w-4 mr-2" />
                  <span>{job.client.name}</span>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="truncate">{job.client.address}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{job.estimatedHours}h estimated</span>
                  </div>
                  
                  <div className="flex items-center text-gray-500">
                    <span className="text-xs">
                      {formatDate(job.scheduledDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 flex items-center justify-center space-x-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleJobClick(job);
                  }}
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </Button>
                
                {job.canModifyStatus && job.status === "In Progress" && (
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle quick complete
                      navigate(`/assistant/jobs/${job.id}/complete`);
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Complete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
