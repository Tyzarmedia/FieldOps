import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { JobTimer } from "@/components/JobTimer";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  X,
  ChevronUp,
  ChevronDown,
  Trash2,
  RefreshCw,
  Play,
  Pause,
  Square,
  Camera,
  Package,
  Clock,
  MapPin,
  User,
  FileText,
  CheckCircle,
  HardHat,
} from "lucide-react";

interface JobDetails {
  id: string;
  title: string;
  client: {
    name: string;
    address: string;
    phone: string;
  };
  status: "assigned" | "accepted" | "in-progress" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  estimatedDuration: string;
  description: string;
  tracking?: {
    started: boolean;
    startTime?: string;
    paused: boolean;
    totalPausedTime: number;
  };
}

export default function EnhancedJobDetailsScreen() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [activeTab, setActiveTab] = useState("details");
  const [isNearClient, setIsNearClient] = useState(false);
  const [trackingStarted, setTrackingStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [nearClientTimer, setNearClientTimer] = useState(0);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>('online');
  const [technician] = useState({
    id: 'tech001',
    name: 'Dyondzani Clement Masinge',
    phone: '+27123456789',
    location: 'East London'
  });

  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    faultDetails: true,
    planning: false,
  });

  const [formData, setFormData] = useState({
    resolution: "",
    fixType: "",
    maintenanceIssueClass: "",
    maintenanceClassIssue: "",
    resolutionComments: "",
  });

  const [stockItems, setStockItems] = useState([
    { id: 1, name: "Fiber Optic Cable - 50m", available: 15, used: 0 },
    { id: 2, name: "RJ45 Connectors", available: 100, used: 0 },
    { id: 3, name: "Cable Ties", available: 200, used: 0 },
    { id: 4, name: "Junction Box", available: 8, used: 0 },
  ]);

  const [jobPhotos, setJobPhotos] = useState<string[]>([]);

  // Mock job data
  const jobDetails: JobDetails = {
    id: jobId || "JA-7762",
    title: "HVAC Maintenance Check",
    client: {
      name: "Acme Corp",
      address: "123 Business St, Downtown",
      phone: "+1 (555) 123-4567",
    },
    status: "assigned",
    priority: "medium",
    estimatedDuration: "2h",
    description: "Routine maintenance and inspection of HVAC system",
  };

  // Network status monitoring
  useEffect(() => {
    const updateNetworkStatus = () => {
      setNetworkStatus(navigator.onLine ? 'online' : 'offline');
    };

    // Initial check
    updateNetworkStatus();

    // Listen for network changes
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);

    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
    };
  }, []);

  // Simulate location detection
  useEffect(() => {
    // Simulate being near client after 3 seconds
    const timer = setTimeout(() => {
      setIsNearClient(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-start tracking after 150 seconds near client
  useEffect(() => {
    if (isNearClient && !trackingStarted) {
      const interval = setInterval(() => {
        setNearClientTimer((prev) => {
          if (prev >= 150) {
            setTrackingStarted(true);
            startJobTracking();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isNearClient, trackingStarted]);

  // Time tracking
  useEffect(() => {
    if (trackingStarted && !isPaused) {
      const interval = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [trackingStarted, isPaused]);

  const startJobTracking = async () => {
    setTrackingStarted(true);
    // API call to start tracking
    try {
      await fetch(`/api/jobs/${jobId}/start-tracking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          location: "Near client location",
          startTime: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Failed to start tracking:", error);
    }
  };

  const toggleTracking = async () => {
    setIsPaused(!isPaused);
    try {
      await fetch(`/api/jobs/${jobId}/toggle-tracking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isPaused ? "resume" : "pause",
        }),
      });
    } catch (error) {
      console.error("Failed to toggle tracking:", error);
    }
  };

  const stopJobTracking = () => {
    setTrackingStarted(false);
    setIsPaused(false);
    // Move to sign-off tab
    setActiveTab("signoff");
  };

  const closeJob = async () => {
    try {
      await fetch(`/api/jobs/${jobId}/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timeSpent: Math.round(timeSpent / 60), // Convert to minutes
          maintenanceIssueClass: formData.maintenanceIssueClass,
          images: jobPhotos,
          udfData: formData,
          location: "Job completion location",
        }),
      });

      navigate("/", { state: { message: "Job completed successfully!" } });
    } catch (error) {
      console.error("Failed to close job:", error);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await fetch(`/api/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          udfData: formData,
          updatedAt: new Date().toISOString(),
        }),
      });

      console.log("UDF Fields updated:", formData);
    } catch (error) {
      console.error("Failed to update UDF:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex justify-between items-center mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full h-10 w-10"
            onClick={() => navigate("/")}
          >
            <X className="h-6 w-6" />
          </Button>

          <div className="flex flex-col items-center">
            <h1 className="text-xl font-bold">{jobDetails.title}</h1>
            <div className="bg-white/20 rounded-lg px-3 py-1 mt-1">
              <JobTimer
                jobId={jobDetails.id}
                jobStatus={jobDetails.status}
                onTimeUpdate={(time) =>
                  console.log(`Job ${jobDetails.id} time: ${time}s`)
                }
              />
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full h-10 w-10"
            onClick={() => navigate("/technician/safety")}
            title="HVAC Maintenance Check"
          >
            <HardHat className="h-6 w-6" />
          </Button>
        </div>

        {/* Job Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-white/90">Job ID: {jobDetails.id}</span>
            <Badge className={getPriorityColor(jobDetails.priority)}>
              {jobDetails.priority}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{jobDetails.client.address}</span>
          </div>
          {isNearClient && (
            <div className="bg-white/20 rounded-lg p-2 mt-2">
              <div className="text-center">
                <span className="text-sm">
                  {!trackingStarted
                    ? `Auto-start in ${150 - nearClientTimer}s`
                    : `Time: ${formatTime(timeSpent)}`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Job Tracking Controls */}
      {isNearClient && (
        <div className="bg-white border-b p-4">
          <div className="flex items-center justify-center space-x-4">
            {!trackingStarted ? (
              <Button
                onClick={startJobTracking}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Job
              </Button>
            ) : (
              <>
                <Button
                  onClick={toggleTracking}
                  variant={isPaused ? "default" : "outline"}
                >
                  {isPaused ? (
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
                  onClick={stopJobTracking}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Finish Job
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="p-4 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="udf">UDF</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="signoff">Sign Off</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Job Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Client:</span>
                    <span className="text-sm">{jobDetails.client.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Address:</span>
                    <span className="text-sm">{jobDetails.client.address}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      Estimated Duration:
                    </span>
                    <span className="text-sm">
                      {jobDetails.estimatedDuration}
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm font-medium">Description:</span>
                    <p className="text-sm text-gray-600 mt-1">
                      {jobDetails.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* UDF Tab */}
          <TabsContent value="udf" className="space-y-4">
            {/* FTTH Maintenance - Fault Details */}
            <Card>
              <CardContent className="p-0">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleSection("faultDetails")}
                >
                  <h3 className="font-semibold">
                    FTTH Maintenance - Fault Details
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {expandedSections.faultDetails ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {expandedSections.faultDetails && (
                  <div className="px-4 pb-4 space-y-4 border-t">
                    {/* Resolution */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resolution
                      </label>
                      <Select
                        value={formData.resolution}
                        onValueChange={(value) =>
                          handleInputChange("resolution", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="resolved">Resolved</SelectItem>
                          <SelectItem value="unresolved">Unresolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Fix Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fix Type
                      </label>
                      <Select
                        value={formData.fixType}
                        onValueChange={(value) =>
                          handleInputChange("fixType", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="permanent">Permanent</SelectItem>
                          <SelectItem value="temporary">Temporary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Maintenance Issue Class */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maintenance Issue Class
                      </label>
                      <Select
                        value={formData.maintenanceIssueClass}
                        onValueChange={(value) =>
                          handleInputChange("maintenanceIssueClass", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="isp-exposed-cables">
                            ISP - Exposed Cables
                          </SelectItem>
                          <SelectItem value="isp-drop-cable-broken">
                            ISP - Drop Cable Broken
                          </SelectItem>
                          <SelectItem value="osp-high-losses">
                            OSP - High Losses
                          </SelectItem>
                          <SelectItem value="no-fault-handed-back">
                            No Fault Handed Back
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Resolution Comments */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resolution Comments
                      </label>
                      <Textarea
                        placeholder="Write here..."
                        value={formData.resolutionComments}
                        onChange={(e) =>
                          handleInputChange(
                            "resolutionComments",
                            e.target.value,
                          )
                        }
                        className="min-h-[80px] resize-none"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Job Photos</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {jobPhotos.map((photo, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                    >
                      <span className="text-gray-500">Photo {index + 1}</span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() =>
                    setJobPhotos([...jobPhotos, `photo-${Date.now()}`])
                  }
                  className="w-full"
                  variant="outline"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stocks Tab */}
          <TabsContent value="stocks" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Stock Usage</h3>
                <div className="space-y-4">
                  {stockItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">
                          Available: {item.available}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={item.used}
                          onChange={(e) => {
                            const newItems = stockItems.map((i) =>
                              i.id === item.id
                                ? { ...i, used: parseInt(e.target.value) || 0 }
                                : i,
                            );
                            setStockItems(newItems);
                          }}
                          className="w-20"
                          min="0"
                          max={item.available}
                        />
                        <Package className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sign Off Tab */}
          <TabsContent value="signoff" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Job Completion</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Time Spent</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatTime(timeSpent)}
                    </div>
                  </div>

                  {formData.maintenanceIssueClass && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="h-4 w-4 text-green-600" />
                        <span className="font-medium">
                          Maintenance Issue Class
                        </span>
                      </div>
                      <div className="text-green-800">
                        {formData.maintenanceIssueClass}
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={closeJob}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-4"
                    disabled={!formData.maintenanceIssueClass}
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Close Job
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Bottom Update Button (only for UDF tab) */}
      {activeTab === "udf" && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button
            onClick={handleUpdate}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-semibold"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Update
          </Button>
        </div>
      )}
    </div>
  );
}
