import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationSystem } from "@/components/NotificationSystem";
import {
  locationService,
  LocationPermissionState,
} from "@/services/locationService";
import { LocationPermissionHandler } from "@/components/LocationPermissionHandler";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  X,
  Menu,
  MoreVertical,
  Calendar,
  Search,
  QrCode,
  RefreshCw,
  Building2,
  Briefcase,
  Phone,
  MapPin,
  Clock,
  User,
  CheckCircle,
  Pause,
  Play,
  Square,
  Edit3,
  Camera,
  FileText,
  Navigation,
  Network,
  Wifi,
  Package,
  PenTool,
  Settings,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  status: "assigned" | "accepted" | "in-progress" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  assignedBy: string;
  assignedTo: string;
  client: {
    name: string;
    address: string;
    contact?: string;
    mobile?: string;
  };
  appointment: {
    number: string;
    startDate: string;
    endDate: string;
    scheduledDate: string;
    facility: string;
  };
  workType: string;
  serviceTerritory: string;
  description: string;
  estimatedDuration: number;
  actualDuration?: number;
  createdDate: string;
  acceptedDate?: string;
  startedDate?: string;
  completedDate?: string;
}

export default function TechnicianJobsScreen() {
  const [selectedTab, setSelectedTab] = useState("assigned");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [isJobPaused, setIsJobPaused] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobStats, setJobStats] = useState({
    assigned: 0,
    accepted: 0,
    inProgress: 0,
    completed: 0,
    total: 0,
  });
  const [showStockUsageDialog, setShowStockUsageDialog] = useState(false);
  const [stockUsage, setStockUsage] = useState([]);
  const [availableStock, setAvailableStock] = useState([]);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationState, setLocationState] = useState<LocationPermissionState>({
    status: "unknown",
    isTracking: false,
    lastKnownLocation: null,
    clockedIn: false,
  });
  const [showLocationPermission, setShowLocationPermission] = useState(false);
  const navigate = useNavigate();

  const currentTechnicianId = "tech001"; // In real app, this would come from auth

  // Calculate job statistics
  const calculateJobStats = (jobList: Job[]) => {
    const stats = {
      assigned: jobList.filter((job) => job.status === "assigned").length,
      accepted: jobList.filter((job) => job.status === "accepted").length,
      inProgress: jobList.filter((job) => job.status === "in-progress").length,
      completed: jobList.filter((job) => job.status === "completed").length,
      total: jobList.length,
    };
    setJobStats(stats);
  };

  // Handle location permission on component mount
  useEffect(() => {
    // Check if user is clocked in and location service is available
    const isClockedIn = localStorage.getItem("isClockedIn") === "true";
    if (isClockedIn && locationState.status === "unknown") {
      // Location service will handle permission if user is clocked in
      // Only show location permission modal if not clocked in and no location
      if (!isClockedIn && !currentLocation) {
        setShowLocationPermission(true);
      }
    }
  }, [locationState.status, currentLocation]);

  // Handle location received from permission handler
  const handleLocationReceived = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setCurrentLocation({
      latitude: location.latitude,
      longitude: location.longitude,
    });
    setShowLocationPermission(false);
  };

  // Handle location permission error
  const handleLocationError = (error: string) => {
    console.error("Location error:", error);
    // Use default location as fallback
    setCurrentLocation({
      latitude: -33.0197, // East London coordinates
      longitude: 27.9117,
    });
    setShowLocationPermission(false);
  };

  // Load jobs from backend API
  useEffect(() => {
    const loadJobs = async (showLoader = true) => {
      try {
        if (showLoader) setLoading(true);
        const response = await fetch(
          `/api/job-mgmt/jobs/technician/${currentTechnicianId}`,
        );
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Convert backend jobs to frontend format
            const formattedJobs: Job[] = result.data.map((job: any) => ({
              id: job.id,
              title: job.title,
              status: job.status
                .toLowerCase()
                .replace(" ", "-") as Job["status"],
              priority: job.priority?.toLowerCase() || "medium",
              assignedBy: "Admin User",
              assignedTo: "Dyondzani Clement Masinge",
              client: {
                name: job.client?.name || "Unknown Client",
                address: job.client?.address || "No address provided",
                contact: job.client?.contactPerson || "-",
                mobile: job.client?.phone || "-",
              },
              appointment: {
                number: job.workOrderNumber || job.id,
                startDate: new Date(
                  job.scheduledDate || Date.now(),
                ).toLocaleDateString(),
                endDate: new Date(
                  job.scheduledDate || Date.now(),
                ).toLocaleDateString(),
                scheduledDate: new Date(
                  job.scheduledDate || Date.now(),
                ).toLocaleString(),
                facility: job.type || "General Work",
              },
              workType: job.type || "General",
              serviceTerritory: "215 - BrL EC EL",
              description: job.description || "No description provided",
              estimatedDuration: job.estimatedHours || 2,
              actualDuration: job.actualHours,
              createdDate: new Date(
                job.createdDate || Date.now(),
              ).toLocaleDateString(),
              acceptedDate: job.acceptedDate
                ? new Date(job.acceptedDate).toLocaleString()
                : undefined,
              startedDate: job.startedDate
                ? new Date(job.startedDate).toLocaleString()
                : undefined,
              completedDate: job.completedDate
                ? new Date(job.completedDate).toLocaleString()
                : undefined,
            }));
            setJobs(formattedJobs);
            calculateJobStats(formattedJobs);
          }
        } else {
          console.error("Failed to fetch jobs");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        if (showLoader) setLoading(false);
      }
    };

    // Initial load with loading indicator
    loadJobs(true);

    // Background polling without loading indicator every 8 seconds
    const interval = setInterval(() => loadJobs(false), 8000);

    return () => clearInterval(interval);
  }, []);

  const tabs = [
    {
      id: "assigned",
      label: "Assigned",
      count: jobs.filter((j) => j.status === "assigned").length,
      color: "bg-blue-500",
    },
    {
      id: "accepted",
      label: "Accepted",
      count: jobs.filter((j) => j.status === "accepted").length,
      color: "bg-orange-500",
    },
    {
      id: "in-progress",
      label: "In Progress",
      count: jobs.filter((j) => j.status === "in-progress").length,
      color: "bg-green-500",
    },
    {
      id: "completed",
      label: "Tech Finished",
      count: jobs.filter((j) => j.status === "completed").length,
      color: "bg-purple-500",
    },
  ];

  const filteredJobs = jobs.filter((job) => {
    const matchesTab =
      job.status === selectedTab ||
      (selectedTab === "completed" && job.status === "completed");
    const matchesSearch =
      searchQuery === "" ||
      job.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const updateJobStatus = async (
    jobId: string,
    status: Job["status"],
    notes?: string,
  ) => {
    try {
      let endpoint = "";
      let payload: any = { technicianId: currentTechnicianId };

      switch (status) {
        case "accepted":
          endpoint = `/api/job-mgmt/jobs/${jobId}/accept`;
          break;
        case "in-progress":
          endpoint = `/api/job-mgmt/jobs/${jobId}/start`;
          payload.location = { lat: 0, lng: 0 }; // In real app, get current location
          break;
        case "completed":
          endpoint = `/api/job-mgmt/jobs/${jobId}/complete`;
          payload.timeSpent = selectedJob?.estimatedDuration || 2;
          payload.notes = notes || "Job completed by technician";
          break;
        default:
          endpoint = `/api/job-mgmt/jobs/${jobId}/status`;
          payload.status = status;
          if (notes) payload.notes = notes;
      }

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Update local state
        setJobs((prev) =>
          prev.map((job) =>
            job.id === jobId
              ? {
                  ...job,
                  status,
                  ...(status === "accepted" && {
                    acceptedDate: new Date().toLocaleString(),
                  }),
                  ...(status === "in-progress" && {
                    startedDate: new Date().toLocaleString(),
                  }),
                  ...(status === "completed" && {
                    completedDate: new Date().toLocaleString(),
                  }),
                }
              : job,
          ),
        );

        // Show success message
        alert(`Job ${status.replace("-", " ")} successfully!`);
      } else {
        alert("Failed to update job status");
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      alert("Error updating job status");
    }
  };

  const handleJobAction = (job: Job, action: string) => {
    switch (action) {
      case "accept":
        updateJobStatus(job.id, "accepted");
        break;
      case "start":
        if (!currentLocation) {
          setShowLocationPermission(true);
          return;
        }
        updateJobStatus(job.id, "in-progress");
        break;
      case "pause":
        updateJobStatus(job.id, "accepted", "Job paused by technician");
        break;
      case "complete":
        updateJobStatus(job.id, "completed");
        break;
      case "view":
        // Navigate to dedicated job details route
        navigate(`/technician/job/${job.id}`);
        break;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-blue-500";
      case "accepted":
        return "bg-orange-500";
      case "in-progress":
        return "bg-green-500";
      case "completed":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (showJobDetail && selectedJob) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Job Detail Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setShowJobDetail(false)}
              >
                <X className="h-6 w-6" />
              </Button>
              <h1 className="text-lg font-semibold">Job Details</h1>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Clock className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setShowJobDetail(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Job Status Bar */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex space-x-4">
              {selectedJob.status === "in-progress" && (
                <>
                  <Button
                    size="sm"
                    className="bg-white/20 text-white hover:bg-white/30"
                    onClick={() => setIsJobPaused(!isJobPaused)}
                  >
                    {isJobPaused ? (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    className="bg-orange-500 text-white hover:bg-orange-600"
                    onClick={() => handleJobAction(selectedJob, "pause")}
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause Job
                  </Button>
                </>
              )}
              {selectedJob.status === "accepted" && (
                <Button
                  size="sm"
                  className="bg-green-600 text-white hover:bg-green-700"
                  onClick={() => handleJobAction(selectedJob, "start")}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Job
                </Button>
              )}
              {selectedJob.status === "assigned" && (
                <Button
                  size="sm"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => handleJobAction(selectedJob, "accept")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept Job
                </Button>
              )}
            </div>
          </div>

          {/* Job Header Info */}
          <div className="text-center">
            <h2 className="text-xl font-bold">{selectedJob.client.name}</h2>
            <p className="text-white/80">#{selectedJob.id}</p>
            <Badge className="bg-green-500 text-white mt-2">
              {selectedJob.status.replace("-", " ").toUpperCase()}
            </Badge>
          </div>

          {/* Date Info */}
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-sm text-white/80">Created On</p>
              <p className="font-medium">{selectedJob.createdDate}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Status</p>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="font-medium">
                  {selectedJob.status.replace("-", " ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details Content */}
        <div className="p-4 pb-20 space-y-6">
          {/* Client Address with Map */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Client Address</h3>
              <div className="bg-gray-200 h-32 rounded-lg mb-2 flex items-center justify-center sm:mt-0.5">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">
                {selectedJob.client.address}
              </p>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium">
                      {selectedJob.appointment.startDate}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Scheduled</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-medium">
                      {selectedJob.appointment.endDate}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Estimated</Badge>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Scheduled Date</p>
                  <p className="font-medium">
                    {selectedJob.appointment.scheduledDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Facility</p>
                  <p className="font-medium">
                    {selectedJob.appointment.facility}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Estimated Duration</p>
                  <p className="font-medium">
                    {selectedJob.estimatedDuration} hours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Status Timeline */}
          {(selectedJob.acceptedDate ||
            selectedJob.startedDate ||
            selectedJob.completedDate) && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Job Timeline</h3>
                <div className="space-y-3">
                  {selectedJob.acceptedDate && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Accepted</p>
                        <p className="font-medium">
                          {selectedJob.acceptedDate}
                        </p>
                      </div>
                    </div>
                  )}
                  {selectedJob.startedDate && (
                    <div className="flex items-center space-x-3">
                      <Play className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">Started</p>
                        <p className="font-medium">{selectedJob.startedDate}</p>
                      </div>
                    </div>
                  )}
                  {selectedJob.completedDate && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-600">Completed</p>
                        <p className="font-medium">
                          {selectedJob.completedDate}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Additional Details */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Contact Person</p>
                  <p className="font-medium">{selectedJob.client.contact}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Mobile</p>
                  <p className="font-medium">{selectedJob.client.mobile}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Work Type</p>
                  <p className="font-medium">{selectedJob.workType}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Work Order</p>
                  <p className="font-medium">
                    {selectedJob.appointment.number}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Service Territory</p>
                  <p className="font-medium">{selectedJob.serviceTerritory}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-medium">{selectedJob.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="flex justify-around py-2">
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 p-3 text-blue-600"
              onClick={() => navigate("/technician/jobs")}
            >
              <FileText className="h-6 w-6" />
              <span className="text-xs font-medium">Details</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 p-3 text-gray-600"
              onClick={() => navigate("/technician/udf")}
            >
              <Settings className="h-6 w-6" />
              <span className="text-xs font-medium">Udf</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 p-3 text-gray-600"
              onClick={() => navigate("/technician/gallery")}
            >
              <Camera className="h-6 w-6" />
              <span className="text-xs font-medium">Gallery</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 p-3 text-gray-600"
              onClick={() => navigate("/technician/stock")}
            >
              <Package className="h-6 w-6" />
              <span className="text-xs font-medium">Stocks</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 p-3 text-orange-600"
              onClick={() => navigate("/technician/signoff")}
            >
              <PenTool className="h-6 w-6" />
              <span className="text-xs font-medium">Sign Off</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Location Permission Handler */}
      {showLocationPermission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Location Access Required
              </h3>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Location access is required for job tracking and proximity
                detection.
              </p>
              <LocationPermissionHandler
                onLocationReceived={handleLocationReceived}
                onError={handleLocationError}
                required={false}
                className="mb-4"
              />
              <Button
                onClick={() => setShowLocationPermission(false)}
                variant="outline"
                className="w-full mt-4"
              >
                Skip for Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/")}
            >
              <X className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold">Jobs</h1>
          </div>
          <div className="flex space-x-2 items-center">
            {/* Location Status Indicator */}
            {currentLocation ? (
              <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-lg">
                <Navigation className="h-4 w-4 text-green-200" />
                <span className="text-xs text-green-200">GPS</span>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 px-2 py-1"
                onClick={() => setShowLocationPermission(true)}
                title="Enable Location Access"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            )}

            <NotificationSystem technicianId="tech001" />
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <MoreVertical className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/")}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>


        {/* Date Filters */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <div>
              <p className="text-sm">From</p>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="text-sm bg-white/20 border-white/30 text-white rounded px-2 py-1"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <div>
              <p className="text-sm">To</p>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="text-sm bg-white/20 border-white/30 text-white rounded px-2 py-1"
              />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <Input
              placeholder="Search by customer, technician, job id..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <QrCode className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-6 w-6" />
          </Button>
        </div>

        {/* Status Tabs */}
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`${tab.color} text-white rounded-full px-4 py-2 text-sm whitespace-nowrap ${
                selectedTab === tab.id ? "opacity-100" : "opacity-70"
              }`}
            >
              {tab.label} {tab.count > 0 && tab.count}
            </Button>
          ))}
        </div>
      </div>

      {/* Job List */}
      <div className="p-4 space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No jobs found for the selected status.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleJobAction(job, "view")}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {getInitials(job.assignedTo)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{job.assignedTo}</h3>
                      <p className="text-sm text-gray-600">
                        By: {job.assignedBy}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(job.status)} text-white`}>
                    {job.status.replace("-", " ")}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Client Name</p>
                      <p className="font-medium">{job.client.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Client Contacts</p>
                      <p className="font-medium">{job.client.contact || "-"}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Work Order</p>
                        <p className="font-medium">{job.appointment.number}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Start Date</p>
                        <p className="font-medium">
                          {job.appointment.startDate}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Mobile No.</p>
                        <p className="font-medium">
                          {job.client.mobile || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Facility</p>
                        <p className="font-medium">
                          {job.appointment.facility}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Client Address</p>
                      <p className="font-medium">{job.client.address}</p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4 text-center">
                  {job.status === "assigned" && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobAction(job, "accept");
                      }}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-full"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept Job
                    </Button>
                  )}
                  {job.status === "accepted" && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobAction(job, "start");
                      }}
                      className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Job
                    </Button>
                  )}
                  {job.status === "in-progress" && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobAction(job, "pause");
                      }}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Job
                    </Button>
                  )}
                  {job.status === "completed" && (
                    <Button
                      className="w-full bg-green-500 text-white rounded-full cursor-default"
                      disabled
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Job Completed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
