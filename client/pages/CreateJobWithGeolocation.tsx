import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { geolocationUtils } from "@/utils/geolocationUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  MapPin,
  Target,
  Clock,
  User,
  Phone,
  Building,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Navigation,
  Save,
  Send,
} from "lucide-react";

interface JobLocation {
  latitude: number;
  longitude: number;
  address: string;
  accuracy?: number;
}

interface Technician {
  id: string;
  name: string;
  status: "available" | "busy" | "on-leave";
  currentLocation?: string;
  skills: string[];
  warehouse: string;
}

export default function CreateJobWithGeolocation() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [jobLocation, setJobLocation] = useState<JobLocation | null>(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);

  // Job form data
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    priority: "medium",
    estimatedDuration: "",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    serviceAddress: "",
    jobType: "",
    workOrderNumber: "",
    appointmentDate: "",
    appointmentTime: "",
    specialInstructions: "",
    requiredSkills: [] as string[],
    assignedTechnician: "",
  });

  // Available technicians
  const [technicians, setTechnicians] = useState<Technician[]>([
    {
      id: "tech001",
      name: "Dyondzani Clement Masinge",
      status: "available",
      currentLocation: "East London",
      skills: ["FTTH", "Network Installation", "Fiber Splicing"],
      warehouse: "WH-EL-001",
    },
    {
      id: "tech002",
      name: "Sarah Johnson",
      status: "available",
      currentLocation: "Port Elizabeth",
      skills: ["FTTH", "Equipment Repair", "Customer Service"],
      warehouse: "WH-PE-002",
    },
    {
      id: "tech003",
      name: "Mike Wilson",
      status: "on-leave",
      currentLocation: "Cape Town",
      skills: ["Network Maintenance", "Technical Support"],
      warehouse: "WH-CT-003",
    },
  ]);

  // Job types
  const jobTypes = [
    "FTTH Installation",
    "FTTH Maintenance",
    "FTTH Repair",
    "Network Upgrade",
    "Equipment Replacement",
    "Site Survey",
    "Customer Support",
  ];

  // Skills options
  const skillsOptions = [
    "FTTH",
    "Network Installation",
    "Fiber Splicing",
    "Equipment Repair",
    "Customer Service",
    "Network Maintenance",
    "Technical Support",
  ];

  // Get current location
  const getCurrentLocation = async () => {
    setLocationLoading(true);

    if (!navigator.geolocation) {
      alert(
        "Geolocation is not supported by this browser. Please enter the address manually.",
      );
      setLocationLoading(false);
      return;
    }

    // Check permission first
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setLocationLoading(false);
      return;
    }

    const handleLocationSuccess = async (position: GeolocationPosition) => {
      const location: JobLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address: "Getting address...",
        accuracy: position.coords.accuracy,
      };

      try {
        // Mock reverse geocoding since we don't have a real API key
        // In production, you would use a proper geocoding service
        location.address = `Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}`;

        // You can replace this with actual reverse geocoding service
        /*
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${location.latitude}+${location.longitude}&key=YOUR_API_KEY`
        );
        const data = await response.json();

        if (data.results && data.results[0]) {
          location.address = data.results[0].formatted;
        }
        */
      } catch (error) {
        console.error("Failed to get address:", error);
        location.address = `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
      }

      setJobLocation(location);
      setJobData((prev) => ({ ...prev, serviceAddress: location.address }));
      setLocationLoading(false);
    };

    const handleLocationError = (error: GeolocationPositionError) => {
      let userMessage = "";

      switch (error.code) {
        case error.PERMISSION_DENIED:
          userMessage =
            "Location access denied. Please enable location permissions and try again, or enter the address manually.";
          break;
        case error.POSITION_UNAVAILABLE:
          userMessage =
            "Location unavailable. Please check your GPS/network connection or enter the address manually.";
          break;
        case error.TIMEOUT:
          userMessage =
            "Location request timed out. Please try again or enter the address manually.";
          break;
        default:
          userMessage =
            "Unable to get location. Please enter the address manually.";
          break;
      }

      // Log detailed error information for debugging
      geolocationUtils.logGeolocationError(error, "CreateJobWithGeolocation");

      alert(userMessage);
      setLocationLoading(false);
    };

    const getErrorName = (code: number): string => {
      switch (code) {
        case 1:
          return "PERMISSION_DENIED";
        case 2:
          return "POSITION_UNAVAILABLE";
        case 3:
          return "TIMEOUT";
        default:
          return "UNKNOWN_ERROR";
      }
    };

    // First try with high accuracy
    navigator.geolocation.getCurrentPosition(
      handleLocationSuccess,
      (error) => {
        // If high accuracy fails, try with lower accuracy
        navigator.geolocation.getCurrentPosition(
          handleLocationSuccess,
          handleLocationError,
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 60000,
          },
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000,
      },
    );
  };

  // Request geolocation permission
  const requestLocationPermission = async () => {
    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permission.state === "denied") {
        alert(
          "Location access is denied. Please enable location permissions in your browser settings to use this feature.",
        );
        return false;
      }

      return true;
    } catch (error) {
      console.warn(
        "Permission API not supported, proceeding with geolocation request",
      );
      return true;
    }
  };

  // Geocode address (mock implementation)
  const geocodeAddress = async (address: string) => {
    if (!address.trim()) return;

    setLocationLoading(true);
    try {
      // Mock geocoding - in production, use a real geocoding service
      // This creates a mock location based on the address text
      const mockLocation: JobLocation = {
        latitude: -33.0197 + (Math.random() - 0.5) * 0.01, // Small random offset
        longitude: 27.9117 + (Math.random() - 0.5) * 0.01,
        address: address.trim(),
      };

      setJobLocation(mockLocation);

      /*
      // Real implementation would look like this:
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=YOUR_GEOCODING_API_KEY`
      );
      const data = await response.json();

      if (data.results && data.results[0]) {
        const result = data.results[0];
        const location: JobLocation = {
          latitude: result.geometry.lat,
          longitude: result.geometry.lng,
          address: result.formatted,
        };
        setJobLocation(location);
      } else {
        alert("Address not found. Please check and try again.");
      }
      */
    } catch (error) {
      console.error("Geocoding error:", error);
      alert(
        "Failed to process address. Please check the address and try again.",
      );
    }
    setLocationLoading(false);
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: any) => {
    setJobData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle skills selection
  const toggleSkill = (skill: string) => {
    setJobData((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter((s) => s !== skill)
        : [...prev.requiredSkills, skill],
    }));
  };

  // Create job
  const createJob = async () => {
    if (!jobLocation) {
      alert("Please set the job location first");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/jobs/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...jobData,
          location: jobLocation,
          coordinatorId: localStorage.getItem("userId"),
          createdAt: new Date().toISOString(),
          status: "assigned",
        }),
      });

      if (response.ok) {
        const newJob = await response.json();

        // Send notification to assigned technician
        if (jobData.assignedTechnician) {
          await fetch("/api/notifications/job-assigned", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              technicianId: jobData.assignedTechnician,
              jobId: newJob.id,
              jobTitle: jobData.title,
              location: jobLocation,
            }),
          });
        }

        navigate("/coordinator/jobs", {
          state: { message: "Job created successfully!" },
        });
      } else {
        throw new Error("Failed to create job");
      }
    } catch (error) {
      console.error("Failed to create job:", error);
      alert("Failed to create job. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Job
              </h1>
              <p className="text-gray-600">
                Create job with precise geolocation for auto-start
              </p>
            </div>
            <Button
              onClick={() => navigate("/coordinator/jobs")}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Location Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Job Location (Essential for Auto-Start)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="flex items-center"
              >
                {locationLoading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Navigation className="h-4 w-4 mr-2" />
                )}
                Use Current Location
              </Button>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="use-current"
                  checked={useCurrentLocation}
                  onCheckedChange={setUseCurrentLocation}
                />
                <label htmlFor="use-current" className="text-sm">
                  Use my current location as job site
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Address *
              </label>
              <div className="flex space-x-2">
                <Input
                  value={jobData.serviceAddress}
                  onChange={(e) =>
                    handleInputChange("serviceAddress", e.target.value)
                  }
                  placeholder="Enter complete service address"
                  className="flex-1"
                />
                <Button
                  onClick={() => geocodeAddress(jobData.serviceAddress)}
                  disabled={!jobData.serviceAddress || locationLoading}
                  variant="outline"
                >
                  <Target className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {jobLocation && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-green-800">
                    Location Set
                  </span>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <div>Address: {jobLocation.address}</div>
                  <div>
                    Coordinates: {jobLocation.latitude.toFixed(6)},{" "}
                    {jobLocation.longitude.toFixed(6)}
                  </div>
                  {jobLocation.accuracy && (
                    <div>Accuracy: ±{Math.round(jobLocation.accuracy)}m</div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Details */}
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <Input
                  value={jobData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter job title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Work Order Number *
                </label>
                <Input
                  value={jobData.workOrderNumber}
                  onChange={(e) =>
                    handleInputChange("workOrderNumber", e.target.value)
                  }
                  placeholder="WO-2025-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type *
                </label>
                <Select
                  value={jobData.jobType}
                  onValueChange={(value) => handleInputChange("jobType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <Select
                  value={jobData.priority}
                  onValueChange={(value) =>
                    handleInputChange("priority", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Duration
                </label>
                <Input
                  value={jobData.estimatedDuration}
                  onChange={(e) =>
                    handleInputChange("estimatedDuration", e.target.value)
                  }
                  placeholder="e.g., 2 hours"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date
                </label>
                <Input
                  type="date"
                  value={jobData.appointmentDate}
                  onChange={(e) =>
                    handleInputChange("appointmentDate", e.target.value)
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <Textarea
                value={jobData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Detailed description of the work to be performed"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <Textarea
                value={jobData.specialInstructions}
                onChange={(e) =>
                  handleInputChange("specialInstructions", e.target.value)
                }
                placeholder="Any special instructions for the technician"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Client Information */}
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <Input
                  value={jobData.clientName}
                  onChange={(e) =>
                    handleInputChange("clientName", e.target.value)
                  }
                  placeholder="Client full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Phone *
                </label>
                <Input
                  value={jobData.clientPhone}
                  onChange={(e) =>
                    handleInputChange("clientPhone", e.target.value)
                  }
                  placeholder="+27 123 456 789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Email
                </label>
                <Input
                  type="email"
                  value={jobData.clientEmail}
                  onChange={(e) =>
                    handleInputChange("clientEmail", e.target.value)
                  }
                  placeholder="client@example.com"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technician Assignment */}
        <Card>
          <CardHeader>
            <CardTitle>Technician Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {skillsOptions.map((skill) => (
                  <Button
                    key={skill}
                    variant={
                      jobData.requiredSkills.includes(skill)
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign Technician
              </label>
              <Select
                value={jobData.assignedTechnician}
                onValueChange={(value) =>
                  handleInputChange("assignedTechnician", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  {technicians
                    .filter((tech) => tech.status === "available")
                    .map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{tech.name}</span>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {tech.warehouse}
                            </Badge>
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Available
                            </Badge>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Show technician skills match */}
            {jobData.assignedTechnician && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-sm">
                  <strong>Selected Technician Skills:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {technicians
                      .find((t) => t.id === jobData.assignedTechnician)
                      ?.skills.map((skill) => (
                        <Badge
                          key={skill}
                          className={`text-xs ${
                            jobData.requiredSkills.includes(skill)
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {skill}
                          {jobData.requiredSkills.includes(skill) && " ✓"}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            onClick={createJob}
            disabled={
              loading ||
              !jobLocation ||
              !jobData.title ||
              !jobData.workOrderNumber
            }
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Create Job
          </Button>
        </div>

        {/* Validation Warning */}
        {(!jobLocation || !jobData.title || !jobData.workOrderNumber) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">
                Please complete all required fields and set job location before
                creating the job.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
