import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { geolocationUtils } from "@/utils/geolocationUtils";
import { useNotification } from "@/components/ui/notification";
import { JobTimer } from "@/components/JobTimer";
import { LocationPermissionHandler } from "@/components/LocationPermissionHandler";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
  Clock,
  MapPin,
  User,
  FileText,
  CheckCircle,
  HardHat,
  Settings,
  PenTool,
  Camera,
  Package,
  Plus,
  Search,
  Save,
  Calendar,
  AlertTriangle,
  AlertCircle,
  Wifi,
  Activity,
  Phone,
  Building,
  Hash,
  Signal,
  CircleDot,
  Play,
  Pause,
  Square,
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
}

export default function EnhancedJobDetailsScreen() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { toast } = useToast();
  const { success, error: notifyError, warning } = useNotification();
  const [activeTab, setActiveTab] = useState("details");
  const [showTimerOverlay, setShowTimerOverlay] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);
  const [showStockForm, setShowStockForm] = useState(false);
  const [networkStatus, setNetworkStatus] = useState<"online" | "offline">(
    "online",
  );
  const [isLate, setIsLate] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  const [jobStatus, setJobStatus] = useState<
    "assigned" | "in-progress" | "paused" | "completed"
  >("assigned");
  const [jobTimer, setJobTimer] = useState(0); // Timer in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [jobLocation] = useState({ latitude: -33.0197, longitude: 27.9117 }); // East London coordinates
  const [proximityTimer, setProximityTimer] = useState(0);
  const [isNearJobLocation, setIsNearJobLocation] = useState(false);
  const [autoStartCountdown, setAutoStartCountdown] = useState(0);
  const [showLocationPermission, setShowLocationPermission] = useState(false);
  const [locationRequired, setLocationRequired] = useState(false);
  const [showGalleryOptions, setShowGalleryOptions] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showStockOptions, setShowStockOptions] = useState(false);
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [expandedStockId, setExpandedStockId] = useState<string | null>(null);
  const [stockFormData, setStockFormData] = useState({
    code: "",
    container: "",
    qtyUsed: "",
    description: "",
    comments: ""
  });

  // User's available warehouses - in real app this would come from user profile/API
  const [userWarehouses, setUserWarehouses] = useState([
    {
      id: "VAN462",
      name: "VAN462",
      description: "Main Service Van",
      isDefault: true
    },
    // Add more warehouses if user has access to multiple
  ]);

  // Initialize user warehouse data
  useEffect(() => {
    const initializeUserWarehouses = async () => {
      try {
        const employeeId = localStorage.getItem("employeeId") || "tech001";

        // Try to fetch user's warehouse assignments from API
        const response = await fetch(`/api/db/employees/${employeeId}/warehouses`);

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data && result.data.length > 0) {
            setUserWarehouses(result.data);
            // Set the default warehouse in localStorage for quick access
            const defaultWarehouse = result.data.find(wh => wh.isDefault) || result.data[0];
            localStorage.setItem("userWarehouse", defaultWarehouse.id);
            localStorage.setItem("userWarehouseId", defaultWarehouse.warehouseId || defaultWarehouse.id);
          }
        } else {
          // Fallback: determine warehouse based on employee ID or location
          const userWarehouse = determineUserWarehouse(employeeId);
          localStorage.setItem("userWarehouse", userWarehouse.id);
          localStorage.setItem("userWarehouseId", userWarehouse.warehouseId);
          setUserWarehouses([userWarehouse]);
        }
      } catch (error) {
        console.warn("Could not fetch user warehouses, using default:", error);
        // Use default warehouse
        const defaultWarehouse = userWarehouses[0];
        localStorage.setItem("userWarehouse", defaultWarehouse.id);
        localStorage.setItem("userWarehouseId", defaultWarehouse.id);
      }
    };

    initializeUserWarehouses();
  }, []);

  // Determine user warehouse based on their profile (fallback method)
  const determineUserWarehouse = (employeeId: string) => {
    // In a real app, this would be based on employee data
    // For now, assign based on employee ID pattern
    const warehouseMap = {
      "tech001": { id: "VAN462", name: "VAN462", description: "East London Service Van", isDefault: true, warehouseId: "WH-EL-001" },
      "tech002": { id: "VAN123", name: "VAN123", description: "Port Elizabeth Service Van", isDefault: true, warehouseId: "WH-PE-002" },
      "tech003": { id: "VAN789", name: "VAN789", description: "Cape Town Service Van", isDefault: true, warehouseId: "WH-CT-003" },
    };

    return warehouseMap[employeeId] || warehouseMap["tech001"];
  };
  const [technician, setTechnician] = useState({
    id: localStorage.getItem("employeeId") || "tech001",
    name: localStorage.getItem("userName") || "Dyondzani Clement Masinge",
    phone: "+27123456789",
    location: "East London",
    warehouse: localStorage.getItem("userWarehouse") || "VAN462", // Get from logged-in user
    warehouseId: localStorage.getItem("userWarehouseId") || "WH-EL-001",
  });

  // Update technician warehouse when it changes
  useEffect(() => {
    const warehouse = localStorage.getItem("userWarehouse");
    const warehouseId = localStorage.getItem("userWarehouseId");
    if (warehouse && warehouseId) {
      setTechnician(prev => ({
        ...prev,
        warehouse,
        warehouseId
      }));
    }
  }, [userWarehouses]);

  // Job timing details
  const assignedTime = new Date("2025-07-18T16:02:00");
  const dueTime = new Date("2025-07-18T23:59:00");
  const warningTime = new Date(dueTime.getTime() - 10 * 60 * 1000); // 10 minutes before

  // UDF Form Data
  const [udfData, setUdfData] = useState({
    faultResolved: "",
    faultSolutionType: "",
    maintenanceIssueClass: "",
    techComments: "",
    rocComments: "",
    referenceNumber: "",
  });

  // Sign Off Form Data
  const [signOffData, setSignOffData] = useState({
    date: new Date().toISOString().slice(0, 16),
    comments: "",
    completionNotes: "",
    signature: "",
    acceptTerms: false,
    udfCompleted: false,
    imagesUploaded: false,
    stockChecked: false,
  });

  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    faultDetails: true,
    planning: false,
  });

  const [jobPhotos, setJobPhotos] = useState<
    { id: string; name: string; url: string; type: string }[]
  >([]);
  const [allocatedStock, setAllocatedStock] = useState<
    {
      id: string;
      code: string;
      name: string;
      quantity: number;
      allocatedAt: string;
    }[]
  >([]);

  // Image form data
  const [imageFormData, setImageFormData] = useState({
    beforeLightLevels: null as File | null,
    faultFinding: null as File | null,
    faultAfterFixing: null as File | null,
    lightLevelsAfterFix: null as File | null,
  });

  // Legacy stock form data - keeping for compatibility
  const [legacyStockForm, setLegacyStockForm] = useState({
    searchQuery: "",
    selectedStock: null as any,
    warehouseNumber: "",
    quantity: "",
  });

  // Available stocks for search
  const [availableStocks] = useState([
    {
      id: 1,
      code: "FC-50M",
      name: "Fiber Optic Cable - 50m",
      warehouseQty: 15,
    },
    { id: 2, code: "RJ45-100", name: "RJ45 Connectors", warehouseQty: 100 },
    { id: 3, code: "CT-200", name: "Cable Ties", warehouseQty: 200 },
    { id: 4, code: "JB-08", name: "Junction Box", warehouseQty: 8 },
    { id: 5, code: "SF-LX", name: "SFP Module - LX", warehouseQty: 25 },
    { id: 6, code: "ONT-G2", name: "ONT Device - G2", warehouseQty: 12 },
  ]);

  // Job data state
  const [jobDetails, setJobDetails] = useState<JobDetails>({
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
  });

  // Network status monitoring
  useEffect(() => {
    const updateNetworkStatus = () => {
      setNetworkStatus(navigator.onLine ? "online" : "offline");
    };

    updateNetworkStatus();
    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    return () => {
      window.removeEventListener("online", updateNetworkStatus);
      window.removeEventListener("offline", updateNetworkStatus);
    };
  }, []);

  // Deadline monitoring and notifications
  useEffect(() => {
    const checkDeadline = () => {
      const now = new Date();

      // Check if technician is late
      if (now > dueTime) {
        setIsLate(true);
      }

      // Send warning notification 10 minutes before deadline
      if (now >= warningTime && !notificationSent && now < dueTime) {
        setNotificationSent(true);
        sendDeadlineWarning();
      }
    };

    const interval = setInterval(checkDeadline, 60000); // Check every minute
    checkDeadline(); // Initial check

    return () => clearInterval(interval);
  }, [notificationSent]);

  const sendDeadlineWarning = async () => {
    try {
      // Send notification to technician and coordinator
      await fetch("/api/notifications/deadline-warning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: jobDetails.id,
          technicianId: technician.id,
          dueTime: dueTime.toISOString(),
          message: `Job ${jobDetails.id} is due in 10 minutes`,
        }),
      });

      // Browser notification
      if (Notification.permission === "granted") {
        new Notification("Job Deadline Warning", {
          body: `Job ${jobDetails.id} is due in 10 minutes`,
          icon: "/notification-icon.png",
        });
      }
    } catch (error) {
      console.error("Failed to send deadline warning:", error);
    }
  };

  // Check if location is needed for job operations
  useEffect(() => {
    // Check if location permission was already granted this session
    const locationGrantedThisSession = sessionStorage.getItem("locationPermissionGranted");

    // Show location permission handler when job requires location tracking
    // but only if not already granted this session
    if ((jobDetails.status === "accepted" || jobStatus === "in-progress") && !locationGrantedThisSession) {
      setLocationRequired(true);
      setShowLocationPermission(true);
    }
  }, [jobDetails.status, jobStatus]);

  // Real-time job status polling
  useEffect(() => {
    const pollJobStatus = async () => {
      try {
        const response = await fetch(`/api/job-mgmt/jobs/${jobDetails.id}/status`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            const serverStatus = result.data.status;

            // Sync local status with server status
            if (serverStatus !== jobDetails.status) {
              setJobDetails(prev => ({ ...prev, status: serverStatus }));
            }

            // Update job status state
            if (serverStatus === "in-progress") {
              setJobStatus("in-progress");
              setIsTimerRunning(true);
            } else if (serverStatus === "paused") {
              setJobStatus("paused");
              setIsTimerRunning(false);
            } else if (serverStatus === "completed") {
              setJobStatus("completed");
              setIsTimerRunning(false);
            }
          }
        }
      } catch (error) {
        console.error("Error polling job status:", error);
      }
    };

    // Poll every 5 seconds for real-time updates
    const interval = setInterval(pollJobStatus, 5000);

    return () => clearInterval(interval);
  }, [jobDetails.id, jobDetails.status]);

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

    // Remember that location permission was granted this session
    sessionStorage.setItem("locationPermissionGranted", "true");

    setShowLocationPermission(false);
    checkProximity({
      latitude: location.latitude,
      longitude: location.longitude,
    });
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
    warning("Location Required", "Using default location for job tracking. Some features may be limited.");
  };

  // Update job status
  const updateJobStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/job-mgmt/jobs/${jobDetails.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          technicianId: localStorage.getItem("employeeId") || "tech001"
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setJobDetails(prev => ({ ...prev, status: newStatus as any }));
          setShowStatusModal(false);
          success("Status Updated", `Job status updated to ${newStatus}`);
        }
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      error("Update Failed", "Failed to update job status. Please try again.");
    }
  };

  // Check proximity to job location
  const checkProximity = (currentPos: {
    latitude: number;
    longitude: number;
  }) => {
    const distance = calculateDistance(
      currentPos.latitude,
      currentPos.longitude,
      jobLocation.latitude,
      jobLocation.longitude,
    );

    const isWithinRadius = distance <= 0.1; // 100 meters radius
    setIsNearJobLocation(isWithinRadius);
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  // Proximity timer for auto-start
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (
      isNearJobLocation &&
      jobStatus === "assigned" &&
      jobDetails.status === "accepted"
    ) {
      interval = setInterval(() => {
        setProximityTimer((prev) => {
          if (prev >= 120) {
            // 2 minutes = 120 seconds
            autoStartJob();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      // Reset timer if moved away from location
      setProximityTimer(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isNearJobLocation, jobStatus, jobDetails.status]);

  // Job timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerRunning) {
      interval = setInterval(() => {
        setJobTimer((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Format timer display
  const formatTimer = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Accept job
  const acceptJob = async () => {
    try {
      const response = await fetch(
        `/api/job-mgmt/jobs/${jobDetails.id}/accept`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            technicianId: technician.id,
            acceptedTime: new Date().toISOString(),
            location: currentLocation,
          }),
        },
      );

      if (response.ok) {
        setJobDetails((prev) => ({ ...prev, status: "accepted" }));

        // Show success toast
        toast({
          title: "Job Accepted",
          description: "Job has been accepted successfully.",
        });

        // Notify manager and coordinator
        await notifyStatusChange("accepted");
      } else {
        toast({
          title: "Failed to Accept Job",
          description: "Unable to accept the job. Please try again.",
        });
      }
    } catch (error) {
      console.error("Failed to accept job:", error);
      toast({
        title: "Accept Error",
        description: "Failed to accept the job. Please try again.",
      });
    }
  };

  // Auto-start job when in proximity for 2 minutes
  const autoStartJob = async () => {
    try {
      // Include 2.5 minutes (150 seconds) prior to actual start
      const adjustedStartTime = new Date(Date.now() - 150000).toISOString();

      const response = await fetch(`/api/jobs/${jobDetails.id}/auto-start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicianId: technician.id,
          startTime: adjustedStartTime,
          actualStartTime: new Date().toISOString(),
          location: currentLocation,
          proximityDuration: proximityTimer,
          autoStarted: true,
        }),
      });

      if (response.ok) {
        setJobStatus("in-progress");
        setIsTimerRunning(true);
        setJobTimer(150); // Start with 2.5 minutes already counted
        setProximityTimer(0);

        // Show success toast
        toast({
          title: "Job Auto-Started",
          description: "Job automatically started due to proximity detection.",
          variant: "default",
        });

        // Notify manager and coordinator
        await notifyStatusChange("auto-started");
      }
    } catch (error) {
      console.error("Failed to auto-start job:", error);
    }
  };

  // Manual job start
  const startJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobDetails.id}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicianId: technician.id,
          startTime: new Date().toISOString(),
          location: currentLocation,
          manualStart: true,
        }),
      });

      if (response.ok) {
        setJobStatus("in-progress");
        setIsTimerRunning(true);
        setProximityTimer(0);

        // Show success toast
        toast({
          title: "Job Started",
          description: "Job has been successfully started.",
        });

        // Notify manager and coordinator
        await notifyStatusChange("started");
      } else {
        toast({
          title: "Failed to Start Job",
          description: "Unable to start the job. Please try again.",
        });
      }
    } catch (error) {
      console.error("Failed to start job:", error);
    }
  };

  const pauseJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobDetails.id}/pause`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicianId: technician.id,
          pauseTime: new Date().toISOString(),
          timeSpent: jobTimer,
          location: currentLocation,
        }),
      });

      if (response.ok) {
        setJobStatus("paused");
        setIsTimerRunning(false);

        // Show success toast
        toast({
          title: "Job Paused",
          description: "Job has been paused successfully.",
        });

        // Notify manager and coordinator
        await notifyStatusChange("paused");
      } else {
        toast({
          title: "Failed to Pause Job",
          description: "Unable to pause the job. Please try again.",
        });
      }
    } catch (error) {
      console.error("Failed to pause job:", error);
    }
  };

  const stopJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobDetails.id}/stop`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicianId: technician.id,
          endTime: new Date().toISOString(),
          totalTime: jobTimer,
          location: currentLocation,
        }),
      });

      if (response.ok) {
        setJobStatus("completed");
        setIsTimerRunning(false);

        // Show success toast
        toast({
          title: "Job Stopped",
          description: "Job has been stopped successfully.",
        });

        // Notify manager and coordinator
        await notifyStatusChange("completed");
      } else {
        toast({
          title: "Failed to Stop Job",
          description: "Unable to stop the job. Please try again.",
        });
      }
    } catch (error) {
      console.error("Failed to stop job:", error);
    }
  };

  // Resume job from paused state
  const resumeJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobDetails.id}/resume`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicianId: technician.id,
          resumeTime: new Date().toISOString(),
          location: currentLocation,
        }),
      });

      if (response.ok) {
        setJobStatus("in-progress");
        setIsTimerRunning(true);

        // Show success toast
        toast({
          title: "Job Resumed",
          description: "Job has been resumed successfully.",
        });

        // Notify manager and coordinator
        await notifyStatusChange("resumed");
      } else {
        toast({
          title: "Failed to Resume Job",
          description: "Unable to resume the job. Please try again.",
        });
      }
    } catch (error) {
      console.error("Failed to resume job:", error);
    }
  };

  // Notify status change to manager and coordinator
  const notifyStatusChange = async (status: string) => {
    try {
      await fetch("/api/notifications/job-status-change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: jobDetails.id,
          technicianId: technician.id,
          technicianName: technician.name,
          status,
          timestamp: new Date().toISOString(),
          location: currentLocation,
        }),
      });
    } catch (error) {
      console.error("Failed to send status notification:", error);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleUdfChange = (field: string, value: string) => {
    setUdfData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSignOffChange = (field: string, value: string | boolean) => {
    setSignOffData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateUdf = async () => {
    try {
      // Validate required UDF fields
      const requiredFields = ["faultResolved", "faultSolutionType", "maintenanceIssueClass"];
      const missingFields = requiredFields.filter(field => !udfData[field as keyof typeof udfData]);

      if (missingFields.length > 0) {
        toast({
          title: "Missing Required Fields",
          description: `Please complete: ${missingFields.join(", ")}`,
        });
        return;
      }

      const response = await fetch(`/api/job-mgmt/jobs/${jobDetails.id}/udf`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...udfData,
          jobId: jobDetails.id,
          technicianId: technician.id,
          updatedBy: technician.name,
          updatedDate: new Date().toISOString(),
          workOrderNumber: `WO-${jobDetails.id}`,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        if (result.success) {
          // Mark UDF as completed for sign-off
          setSignOffData(prev => ({
            ...prev,
            udfCompleted: true
          }));

          toast({
            title: "UDF Updated Successfully",
            description: "User defined fields have been saved successfully.",
          });

          // Send notification to manager/coordinator
          fetch("/api/notifications/udf-completed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jobId: jobDetails.id,
              technicianId: technician.id,
              technicianName: technician.name,
              timestamp: new Date().toISOString(),
            }),
          }).catch((err) => console.error("Failed to send notification:", err));

        } else {
          throw new Error(result.message || "UDF update failed");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Update failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to update UDF:", error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update UDF. Please try again.",
      });
    }
  };

  const handleSaveJob = async () => {
    try {
      await fetch(`/api/jobs/${jobId}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signOffData,
          photos: jobPhotos,
          status: "saved",
        }),
      });
      console.log("Job saved successfully");
    } catch (error) {
      console.error("Failed to save job:", error);
    }
  };

  const handleCompleteJob = async () => {
    if (!signOffData.acceptTerms) {
      alert("Please accept the Terms & Conditions");
      return;
    }

    try {
      await fetch(`/api/jobs/${jobId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signOffData,
          udfData,
          photos: jobPhotos,
          status: "completed",
        }),
      });

      navigate("/technician/jobs", {
        state: { message: "Job completed successfully!" },
      });
    } catch (error) {
      console.error("Failed to complete job:", error);
    }
  };

  // Image form handlers
  const handleImageUpload = (field: string, file: File) => {
    setImageFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const submitImageForm = async () => {
    const formData = new FormData();
    const uploadedFiles: string[] = [];

    // Add job metadata
    formData.append("jobId", jobDetails.id);
    formData.append("technicianId", technician.id);
    formData.append("uploadDate", new Date().toISOString());

    Object.entries(imageFormData).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
        uploadedFiles.push(key);
      }
    });

    if (uploadedFiles.length === 0) {
      toast({
        title: "No Images Selected",
        description: "Please select at least one image to upload.",
      });
      return;
    }

    try {
      const response = await fetch(`/api/job-mgmt/jobs/${jobDetails.id}/images`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();

        if (result.success) {
          // Use actual uploaded image data from server
          const newPhotos = result.uploadedImages.map((img: any) => ({
            id: img.id,
            name: img.originalName,
            url: img.url,
            type: img.category,
            uploadedBy: technician.name,
            uploadedDate: new Date().toISOString(),
          }));

          setJobPhotos(prev => [...prev, ...newPhotos]);
          setShowImageForm(false);
          setImageFormData({
            beforeLightLevels: null,
            faultFinding: null,
            faultAfterFixing: null,
            lightLevelsAfterFix: null,
          });

          // Mark images as completed for sign-off
          setSignOffData(prev => ({
            ...prev,
            imagesUploaded: true
          }));

          // Show success toast
          toast({
            title: "Images Uploaded Successfully",
            description: `${uploadedFiles.length} images uploaded successfully.`,
          });

          // Send notification to coordinator/manager
          fetch("/api/notifications/images-uploaded", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jobId: jobDetails.id,
              technicianId: technician.id,
              imageCount: uploadedFiles.length,
              timestamp: new Date().toISOString(),
            }),
          }).catch((err) => console.error("Failed to send notification:", err));

        } else {
          throw new Error(result.message || "Upload failed");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to upload images:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload images. Please try again.",
      });
    }
  };

  // Stock form handlers
  const filteredStocks = availableStocks.filter(
    (stock) =>
      stock.code
        .toLowerCase()
        .includes(legacyStockForm.searchQuery.toLowerCase()) ||
      stock.name
        .toLowerCase()
        .includes(legacyStockForm.searchQuery.toLowerCase()),
  );

  const submitStockForm = async () => {
    if (!legacyStockForm.selectedStock || !legacyStockForm.quantity) {
      alert("Please select stock and enter quantity");
      return;
    }

    const quantityRequested = parseInt(legacyStockForm.quantity);

    try {
      // Check warehouse availability first
      const availabilityResponse = await fetch(
        `/api/stock/check-availability/${legacyStockForm.selectedStock.id}/${quantityRequested}`,
      );

      if (!availabilityResponse.ok) {
        toast({
          title: "Stock Check Failed",
          description: "Unable to verify stock availability.",
        });
        return;
      }

      const availability = await availabilityResponse.json();

      if (!availability.available) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${availability.availableQuantity} units available. Requested: ${quantityRequested}`,
        });
        return;
      }

      // Auto-link work order number and recognize technician warehouse
      const response = await fetch(
        `/api/job-mgmt/jobs/${jobDetails.id}/allocate-stock`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stockId: legacyStockForm.selectedStock.id,
            stockCode: legacyStockForm.selectedStock.code,
            stockName: legacyStockForm.selectedStock.name,
            warehouseNumber: technician.warehouse || "WH-EL-001", // Auto-detect from logged-in user
            quantity: quantityRequested,
            technicianId: technician.id,
            workOrderNumber: `WO-${jobDetails.id}`, // Auto-link work order
            jobId: jobDetails.id,
            ticketNumber: jobDetails.id,
            allocatedDate: new Date().toISOString(),
            allocatedBy: technician.name,
            stockLocation: technician.warehouse || "WH-EL-001",
            autoLinked: true, // Flag to indicate automatic linking
            realTimeUpdate: true, // Flag for real-time warehouse deduction
          }),
        },
      );

      if (response.ok) {
        const allocationResult = await response.json();

        // Update local stock tracking with server response
        setAllocatedStock((prev) => [
          ...prev,
          {
            id: allocationResult.allocationId || `stock-${Date.now()}`,
            code: legacyStockForm.selectedStock.code,
            name: legacyStockForm.selectedStock.name,
            quantity: quantityRequested,
            allocatedAt: new Date().toISOString(),
            warehouseBalance: allocationResult.newWarehouseBalance,
            allocationStatus: "allocated",
          },
        ]);

        // Real-time warehouse update notification
        if (allocationResult.warehouseUpdated) {
          // Send real-time notification to stock manager
          fetch("/api/notifications/stock-allocated", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              technicianId: technician.id,
              jobId: jobDetails.id,
              stockCode: legacyStockForm.selectedStock.code,
              quantity: quantityRequested,
              newBalance: allocationResult.newWarehouseBalance,
              timestamp: new Date().toISOString(),
            }),
          }).catch((err) => console.error("Failed to send notification:", err));
        }

        setShowStockForm(false);
        setLegacyStockForm({
          searchQuery: "",
          selectedStock: null,
          warehouseNumber: "",
          quantity: "",
        });

        // Show success toast
        toast({
          title: "Stock Allocated Successfully",
          description: `${legacyStockForm.selectedStock.code} - Quantity: ${quantityRequested} allocated. Warehouse updated in real-time.`,
        });

        // Mark stock as completed for sign-off
        setSignOffData(prev => ({
          ...prev,
          stockChecked: true
        }));

      } else {
        const errorData = await response.json();
        toast({
          title: "Allocation Failed",
          description: errorData.message || "Failed to allocate stock. Please try again.",
        });
      }
    } catch (error) {
      console.error("Failed to allocate stock:", error);
      toast({
        title: "Allocation Error",
        description: "Failed to allocate stock. Please try again.",
      });
    }
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
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3">
        {/* Header Title Row */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-bold">Job Details</h1>
          <div className="flex items-center space-x-2">
            {/* Job Control Buttons */}
            {jobDetails.status === "accepted" && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 px-3 py-1 rounded-lg"
                onClick={startJob}
              >
                <Play className="h-4 w-4 mr-1" />
                Start
              </Button>
            )}

            {jobStatus === "in-progress" && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 px-3 py-1 rounded-lg"
                  onClick={pauseJob}
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 px-3 py-1 rounded-lg"
                  onClick={stopJob}
                >
                  <Square className="h-4 w-4 mr-1" />
                  Stop
                </Button>
              </>
            )}

            {jobStatus === "paused" && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 px-3 py-1 rounded-lg"
                onClick={resumeJob}
              >
                <Play className="h-4 w-4 mr-1" />
                Resume
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-full h-8 w-8"
              onClick={() => setShowTimerOverlay(!showTimerOverlay)}
              title="View Timer"
            >
              <Clock className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-full h-8 w-8"
              onClick={() => setShowStatusModal(true)}
              title="Update Status"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-full h-8 w-8"
              onClick={() => navigate("/technician/jobs")}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Proximity Status */}
        {jobStatus === "assigned" &&
          jobDetails.status === "accepted" &&
          isNearJobLocation && (
            <div className="text-center mb-4">
              <div className="bg-blue-500/20 rounded-lg px-4 py-2 inline-block">
                <div className="text-sm font-medium">
                  Auto-start in {120 - proximityTimer}s
                </div>
                <div className="text-xs text-white/80">
                  You are near the job location
                </div>
              </div>
            </div>
          )}

        {/* Job Actions */}
        <div className="flex justify-center space-x-4 mb-6">
          {jobDetails.status === "accepted" && (
            <Button
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-2"
              onClick={startJob}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Start
            </Button>
          )}

          {jobStatus === "in-progress" && (
            <>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-2"
                onClick={pauseJob}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-2"
                onClick={stopJob}
              >
                <X className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </>
          )}

          {jobStatus === "paused" && (
            <>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-2"
                onClick={resumeJob}
              >
                <Play className="h-4 w-4 mr-2" />
                Resume
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-2"
                onClick={stopJob}
              >
                <X className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </>
          )}
        </div>

        {/* Company and Job Info */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold mb-1">
            Vumatel (Pty) Ltd - Central
          </h2>
          <h3 className="text-md font-semibold mb-2">#{jobDetails.id}215784</h3>
          <Badge
            className={`px-4 py-1 text-sm ${
              jobDetails.status === "assigned"
                ? "bg-orange-500/80 text-white"
                : jobDetails.status === "accepted"
                  ? "bg-blue-500/80 text-white"
                  : jobDetails.status === "in-progress" ||
                      jobDetails.status === "In Progress"
                    ? "bg-green-500/80 text-white"
                    : jobDetails.status === "paused"
                      ? "bg-yellow-500/80 text-white"
                      : jobDetails.status === "completed"
                        ? "bg-purple-500/80 text-white"
                        : "bg-gray-500/80 text-white"
            }`}
          >
            {jobDetails.status === "assigned"
              ? "Assigned"
              : jobDetails.status === "accepted"
                ? "Accepted"
                : jobDetails.status === "in-progress" ||
                    jobDetails.status === "In Progress"
                  ? "In Progress"
                  : jobDetails.status === "paused"
                    ? "Paused"
                    : jobDetails.status === "completed"
                      ? "Completed"
                      : jobDetails.status.charAt(0).toUpperCase() +
                        jobDetails.status.slice(1)}
          </Badge>
        </div>

        {/* Info Cards */}
        <div className="flex justify-between space-x-3">
          <div className="bg-white/20 rounded-xl p-3 flex-1 flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-white" />
            <div>
              <p className="text-xs text-white/80">Created On</p>
              <p className="font-semibold">
                {jobDetails.createdDate
                  ? new Date(jobDetails.createdDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )
                  : new Date().toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
              </p>
            </div>
          </div>
          <div className="bg-white/20 rounded-xl p-3 flex-1 flex items-center space-x-2">
            <CircleDot className="h-6 w-6 text-blue-400" />
            <div>
              <p className="text-xs text-white/80">Status</p>
              <p className="font-semibold">
                {jobDetails.status === "assigned"
                  ? "Assigned"
                  : jobDetails.status === "accepted"
                    ? "Accepted"
                    : jobDetails.status === "in-progress" ||
                        jobDetails.status === "In Progress"
                      ? "In Progress"
                      : jobDetails.status === "paused"
                        ? "Paused"
                        : jobDetails.status === "completed"
                          ? "Completed"
                          : jobDetails.status.charAt(0).toUpperCase() +
                            jobDetails.status.slice(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Location Permission Handler */}
      {showLocationPermission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4 text-center">
                Location Required for Job Tracking
              </h3>
              <LocationPermissionHandler
                onLocationReceived={handleLocationReceived}
                onError={handleLocationError}
                required={locationRequired}
                className="mb-4"
              />
              {!locationRequired && (
                <Button
                  onClick={() => setShowLocationPermission(false)}
                  variant="outline"
                  className="w-full mt-4"
                >
                  Skip Location Access
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Timer Overlay */}
      {showTimerOverlay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 m-4 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Job Timer</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTimerOverlay(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-center mb-6">
              <div className="text-4xl font-mono font-bold text-blue-600 mb-2">
                {formatTimer(jobTimer)}
              </div>
              <div className="text-sm text-gray-600 mb-4">
                Status: {jobStatus.replace("-", " ").toUpperCase()}
              </div>

              {/* Location Status */}
              <div className="space-y-2">
                <div
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    isNearJobLocation
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  {isNearJobLocation
                    ? "At Job Location"
                    : "Away from Job Location"}
                </div>

                {isNearJobLocation &&
                  jobStatus === "assigned" &&
                  jobDetails.status === "accepted" && (
                    <div className="text-sm text-blue-600">
                      Auto-start in: {120 - proximityTimer}s
                    </div>
                  )}
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex justify-center space-x-2">
              {jobDetails.status === "accepted" && (
                <Button
                  onClick={startJob}
                  className="bg-green-500 hover:bg-green-600 text-white"
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </Button>
              )}

              {jobStatus === "in-progress" && (
                <>
                  <Button
                    onClick={pauseJob}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white"
                    size="sm"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                  <Button
                    onClick={stopJob}
                    className="bg-red-500 hover:bg-red-600 text-white"
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </>
              )}

              {jobStatus === "paused" && (
                <>
                  <Button
                    onClick={resumeJob}
                    className="bg-green-500 hover:bg-green-600 text-white"
                    size="sm"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                  <Button
                    onClick={stopJob}
                    className="bg-red-500 hover:bg-red-600 text-white"
                    size="sm"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                </>
              )}
            </div>

            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t text-xs text-gray-500 space-y-1">
              <div>Job ID: {jobDetails.id}</div>
              <div>Technician: {technician.name}</div>
              {currentLocation && (
                <div>
                  Location: {currentLocation.latitude.toFixed(6)},{" "}
                  {currentLocation.longitude.toFixed(6)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Upload Form Overlay */}
      {showImageForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Upload Job Images</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowImageForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Before Light Levels */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Before Light Levels *
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload("beforeLightLevels", file);
                    }}
                    className="w-full"
                  />
                  {imageFormData.beforeLightLevels && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {imageFormData.beforeLightLevels.name}
                    </p>
                  )}
                </div>

                {/* Fault Finding */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fault Finding *
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload("faultFinding", file);
                    }}
                    className="w-full"
                  />
                  {imageFormData.faultFinding && (
                    <p className="text-sm text-green-600 mt-1">
                      �� {imageFormData.faultFinding.name}
                    </p>
                  )}
                </div>

                {/* Fault After Fixing */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fault After Fixing *
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload("faultAfterFixing", file);
                    }}
                    className="w-full"
                  />
                  {imageFormData.faultAfterFixing && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {imageFormData.faultAfterFixing.name}
                    </p>
                  )}
                </div>

                {/* Light Levels After Fix */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Light Levels After Fix *
                  </label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload("lightLevelsAfterFix", file);
                    }}
                    className="w-full"
                  />
                  {imageFormData.lightLevelsAfterFix && (
                    <p className="text-sm text-green-600 mt-1">
                      ✓ {imageFormData.lightLevelsAfterFix.name}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  onClick={submitImageForm}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
                  disabled={
                    !imageFormData.beforeLightLevels ||
                    !imageFormData.faultFinding ||
                    !imageFormData.faultAfterFixing ||
                    !imageFormData.lightLevelsAfterFix
                  }
                >
                  Upload All Images
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Stock Form Modal */}
      {showStockForm && (
        <div className="fixed inset-0 bg-white z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold">Add Stock</h1>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                onClick={() => {
                  setShowStockForm(false);
                  setStockFormData({
                    code: "",
                    container: technician.warehouse, // Reset to user's warehouse
                    qtyUsed: "",
                    description: "",
                    comments: ""
                  });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 p-4 space-y-6">
            {/* User Warehouse Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">Your Assigned Warehouse</p>
                  <p className="text-xs text-blue-700">{technician.warehouse} - {technician.warehouseId}</p>
                </div>
                <div className="text-blue-600">
                  <Package className="h-5 w-5" />
                </div>
              </div>
            </div>
            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={stockFormData.code}
                  onChange={(e) => setStockFormData(prev => ({ ...prev, code: e.target.value }))}
                  className="pl-10"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-0.5">
                      <div className="w-1 h-1 bg-white"></div>
                      <div className="w-1 h-1 bg-white"></div>
                      <div className="w-1 h-1 bg-white"></div>
                      <div className="w-1 h-1 bg-white"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Container */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Container
              </label>
              <Select
                value={stockFormData.container || technician.warehouse}
                onValueChange={(value) => setStockFormData(prev => ({ ...prev, container: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={technician.warehouse} />
                </SelectTrigger>
                <SelectContent>
                  {userWarehouses.map((warehouse) => (
                    <SelectItem key={warehouse.id} value={warehouse.id}>
                      {warehouse.name} - {warehouse.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 mt-1">
                Only warehouses assigned to you are available
              </p>
            </div>

            {/* Qty Used */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qty Used
              </label>
              <Input
                type="number"
                value={stockFormData.qtyUsed}
                onChange={(e) => setStockFormData(prev => ({ ...prev, qtyUsed: e.target.value }))}
                className="w-full"
                min="1"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Input
                value={stockFormData.description}
                onChange={(e) => setStockFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full"
              />
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments
              </label>
              <div className="relative">
                <Textarea
                  value={stockFormData.comments}
                  onChange={(e) => setStockFormData(prev => ({ ...prev, comments: e.target.value }))}
                  className="w-full min-h-[100px] pr-10"
                />
                <div className="absolute right-3 bottom-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Button */}
          <div className="p-4">
            <Button
              onClick={() => {
                // Handle stock addition
                if (stockFormData.code && stockFormData.container && stockFormData.qtyUsed) {
                  // Validate that the selected container belongs to the user
                  const userHasAccess = userWarehouses.some(wh => wh.id === stockFormData.container);
                  if (!userHasAccess) {
                    alert("You don't have access to allocate stock from this warehouse");
                    return;
                  }
                  const newStock = {
                    id: `stock-${Date.now()}`,
                    code: stockFormData.code,
                    name: stockFormData.description || stockFormData.code,
                    quantity: parseInt(stockFormData.qtyUsed),
                    warehouse: stockFormData.container,
                    notes: stockFormData.comments,
                    allocatedAt: new Date().toISOString(),
                    allocatedBy: technician.name
                  };

                  setAllocatedStock(prev => [...prev, newStock]);
                  setShowStockForm(false);
                  setStockFormData({
                    code: "",
                    container: technician.warehouse, // Reset to user's warehouse
                    qtyUsed: "",
                    description: "",
                    comments: ""
                  });
                }
              }}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg flex items-center justify-center space-x-2"
              disabled={!stockFormData.code || !stockFormData.container || !stockFormData.qtyUsed}
            >
              <Plus className="h-5 w-5" />
              <span className="text-lg font-medium">Add</span>
            </Button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 flex flex-col p-4 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            {/* Client Contacts */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-gray-900">
                  Client Contacts
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center text-white font-semibold">
                    JM
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Jody Make</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Address */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-gray-900">
                  Client Address
                </h3>
                <div className="bg-gray-200 rounded-lg h-32 mb-3 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-gray-500" />
                  <span className="text-gray-500 ml-2">Map View</span>
                </div>
                <p className="text-sm text-gray-600">
                  The Crescent, 21 Georgian Crescent EA37 Bramlerton Starting
                  South Quay Canberra
                </p>
              </CardContent>
            </Card>

            {/* Job Tags */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-gray-900">Job Tags</h3>
                <div className="space-y-3">
                  {/* Assignment Time */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Assigned</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">Jul 18, 2025</div>
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        4:02 PM
                      </Badge>
                    </div>
                  </div>

                  {/* Due Time */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock
                        className={`h-4 w-4 ${isLate ? "text-red-500" : "text-orange-500"}`}
                      />
                      <span className="text-sm font-medium">Due</span>
                      {isLate && (
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium ${isLate ? "text-red-600" : "text-gray-900"}`}
                      >
                        Jul 18, 2025
                      </div>
                      <Badge
                        className={`text-xs ${isLate ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"}`}
                      >
                        11:59 PM
                      </Badge>
                    </div>
                  </div>

                  {/* Time Status */}
                  {isLate && (
                    <div className="flex items-center space-x-2 p-2 bg-red-50 rounded">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-700 font-medium">
                        Job is overdue
                      </span>
                    </div>
                  )}

                  {/* Job Type */}
                  <div className="flex items-center space-x-2 mt-4">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Job Type</span>
                  </div>
                  <p className="text-sm text-blue-600 ml-6">
                    FTTH - Maintenance
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Technicians */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-gray-900">
                  Assigned Technician
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    DM
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {technician.name}
                    </p>
                    <p className="text-sm text-gray-600">ID: {technician.id}</p>
                    <p className="text-sm text-gray-600">{technician.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Details */}
            <Card>
              <CardContent className="p-4 space-y-4">
                {/* ROC */}
                <div className="flex items-start space-x-3">
                  <Building className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">ROC</p>
                    <p className="text-sm text-gray-900">
                      Regional Operations Center
                    </p>
                  </div>
                </div>

                {/* Contractor */}
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      Contractor
                    </p>
                    <p className="text-sm text-gray-900">
                      Stefany Sampetha Relay
                    </p>
                  </div>
                </div>

                {/* Work Type */}
                <div className="flex items-start space-x-3">
                  <Settings className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      Work Type
                    </p>
                    <p className="text-sm text-gray-900">
                      1. Maintenance Job (SF)
                    </p>
                  </div>
                </div>

                {/* Case/NWI/Change Number */}
                <div className="flex items-start space-x-3">
                  <Hash className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      Case/NWI/Change Number
                    </p>
                    <p className="text-sm text-gray-900">DV8 08/05</p>
                  </div>
                </div>

                {/* Appointment Number */}
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      Appointment Number
                    </p>
                    <p className="text-sm text-gray-900">0076501</p>
                  </div>
                </div>

                {/* Network Identifier */}
                <div className="flex items-start space-x-3">
                  <Wifi className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      Network Identifier
                    </p>
                    <p className="text-sm text-gray-900">485754d3E2ED5EAB</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      Location
                    </p>
                    <p className="text-sm text-gray-900">
                      {jobDetails.client.address}
                    </p>
                  </div>
                </div>

                {/* Service Territory */}
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      Service Territory
                    </p>
                    <p className="text-sm text-gray-900">120 - East London</p>
                  </div>
                </div>

                {/* Contact Name */}
                <div className="flex items-start space-x-3">
                  <User className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      Contact Name
                    </p>
                    <p className="text-sm text-gray-900">Jody Make</p>
                  </div>
                </div>

                {/* Contact Number */}
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-700">
                      Contact Number
                    </p>
                    <p className="text-sm text-gray-900">
                      {jobDetails.client.phone}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Network Status */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 text-gray-900">
                  Network Status
                </h3>
                <div className="space-y-4">
                  {/* Network Identifier/Serial Number */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Hash className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">
                        Network ID/Serial
                      </span>
                    </div>
                    <span className="text-sm text-gray-900">
                      485754d3E2ED5EAB
                    </span>
                  </div>

                  {/* RX Signal */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Signal className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">RX Signal</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      -12.5 dBm
                    </Badge>
                  </div>

                  {/* SFP */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CircleDot className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">SFP</span>
                    </div>
                    <span className="text-sm text-gray-900">1000Base-LX</span>
                  </div>

                  {/* NMS */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-orange-500" />
                      <span className="text-sm font-medium">NMS</span>
                    </div>
                    <span className="text-sm text-gray-900">Active</span>
                  </div>

                  {/* Link Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Wifi className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Status</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Link is Up
                    </Badge>
                  </div>

                  {/* Last Update */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Last Update</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date().toLocaleTimeString()}
                    </span>
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
                  className="flex items-center justify-between p-4 cursor-pointer border-b"
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
                  <div className="p-4 space-y-4">
                    {/* Fault Resolved */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fault Resolved
                      </label>
                      <Select
                        value={udfData.faultResolved}
                        onValueChange={(value) =>
                          handleUdfChange("faultResolved", value)
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Fault Solution Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fault Solution Type
                      </label>
                      <Select
                        value={udfData.faultSolutionType}
                        onValueChange={(value) =>
                          handleUdfChange("faultSolutionType", value)
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maintenance Issue Class
                      </label>
                      <Select
                        value={udfData.maintenanceIssueClass}
                        onValueChange={(value) =>
                          handleUdfChange("maintenanceIssueClass", value)
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
                          <SelectItem value="isp-drop-cable-connector-broken">
                            ISP - Drop Cable Connector broken
                          </SelectItem>
                          <SelectItem value="isp-drop-cable-high-losses">
                            ISP - Drop Cable High Losses
                          </SelectItem>
                          <SelectItem value="isp-incorrect-not-patched">
                            ISP - Incorrect/Not Patched
                          </SelectItem>
                          <SelectItem value="isp-cpe-ont-faulty">
                            ISP - CPE/ONT Faulty
                          </SelectItem>
                          <SelectItem value="isp-cpe-ont-reboot-off">
                            ISP - CPE/ONT Reboot/Off
                          </SelectItem>
                          <SelectItem value="isp-cpe-sfp-faulty">
                            ISP - CPE SFP Faulty
                          </SelectItem>
                          <SelectItem value="isp-cpe-move">
                            ISP - CPE Move
                          </SelectItem>
                          <SelectItem value="isp-router-faulty">
                            ISP - Router Faulty
                          </SelectItem>
                          <SelectItem value="isp-router-reboot-off">
                            ISP - Router Reboot/Off
                          </SelectItem>
                          <SelectItem value="isp-ups-issue">
                            ISP - UPS Issue
                          </SelectItem>
                          <SelectItem value="osp-pop-faulty-patch-lead">
                            OSP - POP Faulty Patch Lead
                          </SelectItem>
                          <SelectItem value="osp-pop-incorrect-patch">
                            OSP - POP Incorrect Patch
                          </SelectItem>
                          <SelectItem value="osp-pop-faulty-sfp">
                            OSP - POP Faulty SFP
                          </SelectItem>
                          <SelectItem value="osp-pop-switch-offline-faulty">
                            OSP - POP Switch Offline/Faulty
                          </SelectItem>
                          <SelectItem value="osp-pop-not-patched">
                            OSP - POP Not Patched
                          </SelectItem>
                          <SelectItem value="osp-ag-not-patched">
                            OSP - AG Not Patched
                          </SelectItem>
                          <SelectItem value="osp-ag-incorrect-patch">
                            OSP - AG Incorrect Patch
                          </SelectItem>
                          <SelectItem value="osp-ag-faulty-patch-lead">
                            OSP - AG Faulty Patch Lead
                          </SelectItem>
                          <SelectItem value="osp-high-losses">
                            OSP - High Losses
                          </SelectItem>
                          <SelectItem value="osp-faulty-field-splitter">
                            OSP - Faulty field splitter
                          </SelectItem>
                          <SelectItem value="osp-fibre-broken-distribution-run">
                            OSP - Fibre Broken on Distribution run
                          </SelectItem>
                          <SelectItem value="osp-fibre-broken-mdu-dist-box-ndp">
                            OSP - Fibre Broken in MDU Dist Box/NDP
                          </SelectItem>
                          <SelectItem value="osp-fibre-broken-joint">
                            OSP - Fibre Broken in Joint
                          </SelectItem>
                          <SelectItem value="osp-fibre-damaged-ctp">
                            OSP - Fibre Damaged at CTP
                          </SelectItem>
                          <SelectItem value="osp-fibre-broken-wall-box">
                            OSP - Fibre broken in Wall box
                          </SelectItem>
                          <SelectItem value="osp-wallbox-incorrect-patch">
                            OSP - Wallbox Incorrect Patch
                          </SelectItem>
                          <SelectItem value="osp-wallbox-not-patched">
                            OSP - Wallbox Not Patched
                          </SelectItem>
                          <SelectItem value="osp-wallbox-move">
                            OSP - Wallbox Move
                          </SelectItem>
                          <SelectItem value="osp-civil-works-issue">
                            OSP - Civil Works Issue
                          </SelectItem>
                          <SelectItem value="service-activation-network-identifier-confirmation">
                            Service activation - Network Identifier Confirmation
                          </SelectItem>
                          <SelectItem value="internet-service-provider-issue">
                            Internet Service Provider Issue
                          </SelectItem>
                          <SelectItem value="no-fault-handed-back">
                            No Fault Handed Back
                          </SelectItem>
                          <SelectItem value="change-completed">
                            Change Completed
                          </SelectItem>
                          <SelectItem value="nwi-resolved">
                            NWI Resolved
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Tech Comments */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tech Comments
                      </label>
                      <Textarea
                        placeholder="Write here..."
                        value={udfData.techComments}
                        onChange={(e) =>
                          handleUdfChange("techComments", e.target.value)
                        }
                        className="min-h-[80px] resize-none"
                      />
                    </div>

                    {/* ROC Comments */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ROC Comments
                      </label>
                      <Textarea
                        placeholder="Write here..."
                        value={udfData.rocComments}
                        onChange={(e) =>
                          handleUdfChange("rocComments", e.target.value)
                        }
                        className="min-h-[80px] resize-none"
                      />
                    </div>

                    {/* Reference Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reference Number
                      </label>
                      <Input
                        placeholder="Write here..."
                        value={udfData.referenceNumber}
                        onChange={(e) =>
                          handleUdfChange("referenceNumber", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* FTTH Maintenance - Planning */}
            <Card>
              <CardContent className="p-0">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => toggleSection("planning")}
                >
                  <h3 className="font-semibold">FTTH Maintenance - Planning</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {expandedSections.planning ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>

                {expandedSections.planning && (
                  <div className="p-4">
                    <p className="text-gray-500 text-sm">
                      Planning fields will be added here...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Tab */}
          <TabsContent value="gallery" className="flex-1 flex flex-col">
            <div className="relative flex-1 flex flex-col bg-gray-50 rounded-lg border-2 border-dashed border-gray-300" style={{minHeight: 'calc(100vh - 280px)'}}>
              <div className="flex-1 flex flex-col">
                {jobPhotos.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No Images</p>
                  </div>
                ) : (
                  <div className="flex-1 p-4">
                    <div className="grid grid-cols-2 gap-4 h-full">
                      {jobPhotos.map((photo, index) => (
                        <div
                          key={photo.id || index}
                          className="aspect-square bg-white rounded-lg border shadow-sm overflow-hidden"
                        >
                          <div className="h-full flex flex-col">
                            <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                              <Camera className="h-8 w-8 text-blue-400" />
                            </div>
                            <div className="p-2 bg-white">
                              <p className="text-xs font-medium text-gray-800 truncate">
                                {photo.name || `Photo ${index + 1}`}
                              </p>
                              <p className="text-xs text-gray-500">
                                {photo.type || "image"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Gallery Action Buttons */}
              <div className="absolute bottom-4 right-4 flex flex-col-reverse items-end space-y-reverse space-y-3">
                {/* Gallery and Camera buttons - show when expanded */}
                {showGalleryOptions && (
                  <>
                    <Button
                      onClick={() => {
                        // Handle gallery access
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.multiple = true;
                        input.onchange = (e) => {
                          const files = (e.target as HTMLInputElement).files;
                          if (files) {
                            // Handle selected files from gallery
                            console.log('Selected files from gallery:', files);
                            // Add your gallery handling logic here
                          }
                        };
                        input.click();
                        setShowGalleryOptions(false);
                      }}
                      className="h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
                    >
                      <Camera className="h-6 w-6" />
                    </Button>
                    <div className="text-xs text-gray-600 mr-2">Gallery</div>

                    <Button
                      onClick={() => {
                        // Handle camera access
                        navigator.mediaDevices?.getUserMedia({ video: true })
                          .then(stream => {
                            // Create video element or handle camera
                            console.log('Camera stream:', stream);
                            // Add your camera handling logic here
                            stream.getTracks().forEach(track => track.stop()); // Stop for now
                          })
                          .catch(err => {
                            console.error('Camera access denied:', err);
                            alert('Camera access denied. Please allow camera permissions.');
                          });
                        setShowGalleryOptions(false);
                      }}
                      className="h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
                    >
                      <Camera className="h-6 w-6" />
                    </Button>
                    <div className="text-xs text-gray-600 mr-2">Camera</div>
                  </>
                )}

                {/* Main plus/close button */}
                <Button
                  onClick={() => setShowGalleryOptions(!showGalleryOptions)}
                  className="h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
                >
                  {showGalleryOptions ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Plus className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Stocks Tab */}
          <TabsContent value="stocks" className="flex-1 flex flex-col">
            <div className="relative flex-1 flex flex-col bg-gray-50 rounded-lg border-2 border-dashed border-gray-300" style={{minHeight: 'calc(100vh - 280px)'}}>
              <div className="flex-1 flex flex-col">
                {allocatedStock.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center">
                    <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No Stocks</p>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    {/* Search Bar */}
                    <div className="p-4 border-b bg-white">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search anything..."
                          value={stockSearchQuery}
                          onChange={(e) => setStockSearchQuery(e.target.value)}
                          className="pl-10 bg-gray-50 border-0"
                        />
                      </div>
                    </div>

                    {/* Stock List Headers */}
                    <div className="px-4 py-3 bg-gray-100 border-b">
                      <div className="flex items-center space-x-4">
                        <div className="w-8"></div>
                        <div className="flex-1 text-sm font-medium text-gray-600">Code</div>
                        <div className="flex-1 text-sm font-medium text-gray-600">Description</div>
                      </div>
                    </div>

                    {/* Stock Items */}
                    <div className="flex-1 overflow-y-auto">
                      {allocatedStock
                        .filter(stock =>
                          stock.code.toLowerCase().includes(stockSearchQuery.toLowerCase()) ||
                          stock.name.toLowerCase().includes(stockSearchQuery.toLowerCase())
                        )
                        .map((stock, index) => (
                        <div key={stock.id} className="border-b border-gray-200">
                          {/* Stock Row */}
                          <div
                            className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => setExpandedStockId(expandedStockId === stock.id ? null : stock.id)}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="w-8 flex justify-center">
                                {expandedStockId === stock.id ? (
                                  <ChevronDown className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <ChevronUp className="h-4 w-4 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1 text-sm font-medium text-gray-900">
                                {stock.code}
                              </div>
                              <div className="flex-1 text-sm text-gray-600 truncate">
                                {stock.name}
                              </div>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {expandedStockId === stock.id && (
                            <div className="px-4 pb-4 bg-gray-50">
                              <div className="space-y-3 pt-3">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-medium text-gray-900">Code</span>
                                    <p className="text-gray-600">{stock.code}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-900">Container</span>
                                    <p className="text-gray-600">{stock.warehouse || 'VAN462'}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-900">Description</span>
                                    <p className="text-gray-600">{stock.name}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-900">Qty Used</span>
                                    <p className="text-gray-600">{stock.quantity}</p>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="font-medium text-gray-900">Comments</span>
                                    <p className="text-gray-600">{stock.notes || '-'}</p>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex justify-center space-x-8 pt-4">
                                  <Button
                                    variant="ghost"
                                    className="flex flex-col items-center space-y-1 text-blue-500"
                                    onClick={() => {
                                      // Handle edit
                                      setStockFormData({
                                        code: stock.code,
                                        container: stock.warehouse || 'VAN462',
                                        qtyUsed: stock.quantity.toString(),
                                        description: stock.name,
                                        comments: stock.notes || ''
                                      });
                                      setShowStockForm(true);
                                    }}
                                  >
                                    <PenTool className="h-5 w-5" />
                                    <span className="text-xs">Edit</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    className="flex flex-col items-center space-y-1 text-red-500"
                                    onClick={() => {
                                      // Handle delete
                                      const newStock = allocatedStock.filter(s => s.id !== stock.id);
                                      setAllocatedStock(newStock);
                                    }}
                                  >
                                    <Trash2 className="h-5 w-5" />
                                    <span className="text-xs">Delete</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Stock Action Buttons */}
              <div className="absolute bottom-4 right-4 flex flex-col-reverse items-end space-y-reverse space-y-3">
                {/* Add Stock button - show when expanded */}
                {showStockOptions && (
                  <>
                    <Button
                      onClick={() => {
                        setShowStockOptions(false);
                        // Pre-populate with user's warehouse
                        setStockFormData({
                          code: "",
                          container: technician.warehouse,
                          qtyUsed: "",
                          description: "",
                          comments: ""
                        });
                        setShowStockForm(true);
                      }}
                      className="h-14 w-auto px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg flex items-center space-x-2"
                    >
                      <Package className="h-5 w-5" />
                      <span className="text-sm font-medium">Add Stock</span>
                    </Button>
                  </>
                )}

                {/* Main plus/close button */}
                <Button
                  onClick={() => setShowStockOptions(!showStockOptions)}
                  className="h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg"
                >
                  {showStockOptions ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Plus className="h-6 w-6" />
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Sign Off Tab */}
          <TabsContent value="signoff" className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <div className="text-lg font-medium text-gray-900">
                    08/08/2025 06:39 PM
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comments
                  </label>
                  <Textarea
                    value={signOffData.comments}
                    onChange={(e) =>
                      handleSignOffChange("comments", e.target.value)
                    }
                    className="min-h-[80px] resize-none"
                  />
                </div>

                {/* Job Completion Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Completion Notes
                  </label>
                  <Textarea
                    placeholder="Write notes here..."
                    value={signOffData.completionNotes}
                    onChange={(e) =>
                      handleSignOffChange("completionNotes", e.target.value)
                    }
                    className="min-h-[100px] resize-none"
                  />
                </div>

                {/* Completion Checklist */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold mb-4 text-gray-900">
                    Job Completion Checklist
                  </h3>
                  <div className="space-y-3">
                    {/* UDF Completed */}
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="udf-completed"
                        checked={signOffData.udfCompleted}
                        onCheckedChange={(checked) =>
                          handleSignOffChange("udfCompleted", checked)
                        }
                        className="w-5 h-5"
                      />
                      <label
                        htmlFor="udf-completed"
                        className="text-sm font-medium text-gray-700"
                      >
                        UDF (User Defined Fields) completed and uploaded
                      </label>
                    </div>

                    {/* Images Uploaded */}
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="images-uploaded"
                        checked={signOffData.imagesUploaded}
                        onCheckedChange={(checked) =>
                          handleSignOffChange("imagesUploaded", checked)
                        }
                        className="w-5 h-5"
                      />
                      <label
                        htmlFor="images-uploaded"
                        className="text-sm font-medium text-gray-700"
                      >
                        Required images uploaded (Before/After light levels,
                        fault finding, fault after fixing)
                      </label>
                    </div>

                    {/* Stock Usage */}
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="stock-checked"
                        checked={signOffData.stockChecked}
                        onCheckedChange={(checked) =>
                          handleSignOffChange("stockChecked", checked)
                        }
                        className="w-5 h-5"
                      />
                      <label
                        htmlFor="stock-checked"
                        className="text-sm font-medium text-gray-700"
                      >
                        Stock usage documented (Stock used or No stock used
                        confirmed)
                      </label>
                    </div>
                  </div>
                </div>

                {/* Digital Signature Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Digital Signature
                  </label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                      signOffData.signature
                        ? "border-green-300 bg-green-50"
                        : "border-gray-300 bg-gray-50 hover:border-gray-400"
                    }`}
                    onClick={() => {
                      // Simulate signature capture
                      if (!signOffData.signature) {
                        handleSignOffChange(
                          "signature",
                          `${technician.name} - ${new Date().toLocaleString()}`,
                        );
                      }
                    }}
                  >
                    {signOffData.signature ? (
                      <div className="space-y-2">
                        <div className="text-2xl font-script text-gray-800 italic">
                          {technician.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Signed on {new Date().toLocaleDateString()} at{" "}
                          {new Date().toLocaleTimeString()}
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          ✓ Digitally Signed
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-gray-400 text-lg">TAP TO SIGN</div>
                        <div className="text-sm text-gray-500">
                          Tap here to add your digital signature
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="terms"
                    checked={signOffData.acceptTerms}
                    onCheckedChange={(checked) =>
                      handleSignOffChange("acceptTerms", checked)
                    }
                    className="w-6 h-6"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium text-gray-700"
                  >
                    I accept the Terms & Conditions
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button
                    onClick={handleSaveJob}
                    variant="outline"
                    className="flex-1 py-6 text-lg"
                  >
                    <Save className="h-5 w-5 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCompleteJob}
                    className="flex-1 py-6 text-lg bg-green-500 hover:bg-green-600"
                    disabled={
                      !signOffData.acceptTerms ||
                      !signOffData.udfCompleted ||
                      !signOffData.imagesUploaded ||
                      !signOffData.stockChecked ||
                      !signOffData.signature
                    }
                  >
                    Complete
                    <CheckCircle className="h-5 w-5 ml-2" />
                  </Button>
                </div>

                {/* Detailed Completion Status */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2" />
                    Job Completion Status
                  </h4>
                  <div className="space-y-3">
                    {/* UDF Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">UDF Fields Completed</span>
                      <div className="flex items-center">
                        {signOffData.udfCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                        )}
                        <span className={`ml-2 text-sm font-medium ${
                          signOffData.udfCompleted ? "text-green-600" : "text-orange-600"
                        }`}>
                          {signOffData.udfCompleted ? "Complete" : "Pending"}
                        </span>
                      </div>
                    </div>

                    {/* Images Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Images Uploaded</span>
                      <div className="flex items-center">
                        {signOffData.imagesUploaded ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                        )}
                        <span className={`ml-2 text-sm font-medium ${
                          signOffData.imagesUploaded ? "text-green-600" : "text-orange-600"
                        }`}>
                          {signOffData.imagesUploaded ? `${jobPhotos.length} Images` : "No Images"}
                        </span>
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Stock Allocation</span>
                      <div className="flex items-center">
                        {signOffData.stockChecked ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                        )}
                        <span className={`ml-2 text-sm font-medium ${
                          signOffData.stockChecked ? "text-green-600" : "text-orange-600"
                        }`}>
                          {signOffData.stockChecked ? `${allocatedStock.length} Items` : "None Allocated"}
                        </span>
                      </div>
                    </div>

                    {/* Signature Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Digital Signature</span>
                      <div className="flex items-center">
                        {signOffData.signature ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                        )}
                        <span className={`ml-2 text-sm font-medium ${
                          signOffData.signature ? "text-green-600" : "text-orange-600"
                        }`}>
                          {signOffData.signature ? "Signed" : "Not Signed"}
                        </span>
                      </div>
                    </div>

                    {/* Terms Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Terms Accepted</span>
                      <div className="flex items-center">
                        {signOffData.acceptTerms ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                        )}
                        <span className={`ml-2 text-sm font-medium ${
                          signOffData.acceptTerms ? "text-green-600" : "text-orange-600"
                        }`}>
                          {signOffData.acceptTerms ? "Accepted" : "Not Accepted"}
                        </span>
                      </div>
                    </div>

                    {/* Overall Progress */}
                    <div className="border-t pt-3 mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                        <span className="text-sm font-medium text-blue-600">
                          {[
                            signOffData.udfCompleted,
                            signOffData.imagesUploaded,
                            signOffData.stockChecked,
                            signOffData.signature,
                            signOffData.acceptTerms
                          ].filter(Boolean).length}/5 Complete
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${([
                              signOffData.udfCompleted,
                              signOffData.imagesUploaded,
                              signOffData.stockChecked,
                              signOffData.signature,
                              signOffData.acceptTerms
                            ].filter(Boolean).length / 5) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Bottom Update Button (only for UDF tab) */}
      {activeTab === "udf" && (
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t">
          <Button
            onClick={handleUpdateUdf}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-semibold"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Update
          </Button>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          <Button
            variant="ghost"
            className={`flex flex-col items-center space-y-1 p-3 ${
              activeTab === "details" ? "text-blue-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("details")}
          >
            <FileText className="h-6 w-6" />
            <span className="text-xs font-medium">Details</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center space-y-1 p-3 ${
              activeTab === "udf" ? "text-blue-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("udf")}
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs font-medium">UDF</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center space-y-1 p-3 ${
              activeTab === "gallery" ? "text-orange-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("gallery")}
          >
            <Camera className="h-6 w-6" />
            <span className="text-xs font-medium">Gallery</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center space-y-1 p-3 ${
              activeTab === "stocks" ? "text-blue-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("stocks")}
          >
            <Package className="h-6 w-6" />
            <span className="text-xs font-medium">Stocks</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center space-y-1 p-3 ${
              activeTab === "signoff" ? "text-orange-600" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("signoff")}
          >
            <PenTool className="h-6 w-6" />
            <span className="text-xs font-medium">Sign Off</span>
          </Button>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Update Job Status</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStatusModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="text-sm text-gray-600 mb-4">
                  Current Status: <span className="font-medium">{jobDetails.status.toUpperCase()}</span>
                </div>

                {/* Status Options */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => updateJobStatus("assigned")}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg"
                  >
                    Assigned
                  </Button>
                  <Button
                    onClick={() => updateJobStatus("accepted")}
                    className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-lg"
                  >
                    Accepted
                  </Button>
                  <Button
                    onClick={() => updateJobStatus("in-progress")}
                    className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    In Progress
                  </Button>
                  <Button
                    onClick={() => updateJobStatus("tech-finished")}
                    className="bg-lime-500 hover:bg-lime-600 text-white p-3 rounded-lg"
                  >
                    Tech Finished
                  </Button>
                  <Button
                    onClick={() => updateJobStatus("sent-back-to-tech")}
                    className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-lg"
                  >
                    Sent Back To Tech
                  </Button>
                  <Button
                    onClick={() => updateJobStatus("completed")}
                    className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg"
                  >
                    Job Completed
                  </Button>
                  <Button
                    onClick={() => updateJobStatus("stopped")}
                    className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg"
                  >
                    Stopped
                  </Button>
                  <Button
                    onClick={() => updateJobStatus("convert-to-installation")}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-lg"
                  >
                    Convert To Installation
                  </Button>
                  <Button
                    onClick={() => updateJobStatus("sage-error-resubmit")}
                    className="bg-red-700 hover:bg-red-800 text-white p-3 rounded-lg"
                  >
                    Sage Error - Resubmit
                  </Button>
                  <Button
                    onClick={() => updateJobStatus("total-jobs")}
                    className="bg-black hover:bg-gray-800 text-white p-3 rounded-lg"
                  >
                    Total Jobs
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
