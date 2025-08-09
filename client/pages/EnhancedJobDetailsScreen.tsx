import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { geolocationUtils } from "@/utils/geolocationUtils";
import { useNotification } from "@/components/ui/notification";
import { JobTimer } from "@/components/JobTimer";
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
  Wifi,
  Activity,
  Phone,
  Building,
  Hash,
  Signal,
  CircleDot,
  Play,
  Pause,
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
  const [technician] = useState({
    id: "tech001",
    name: "Dyondzani Clement Masinge",
    phone: "+27123456789",
    location: "East London",
  });

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

  // Stock form data
  const [stockFormData, setStockFormData] = useState({
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

  // Geolocation tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser");
      return;
    }

    const handleLocationSuccess = (position: GeolocationPosition) => {
      const newLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      setCurrentLocation(newLocation);
      checkProximity(newLocation);
    };

    const handleLocationError = (error: GeolocationPositionError) => {
      let userMessage = "";
      let shouldShowWarning = false;

      switch (error.code) {
        case error.PERMISSION_DENIED:
          userMessage =
            "Location access denied. Using default location for job tracking.";
          shouldShowWarning = true;
          setCurrentLocation({
            latitude: -33.0197, // East London coordinates
            longitude: 27.9117,
          });
          break;
        case error.POSITION_UNAVAILABLE:
          userMessage =
            "Location unavailable. Using default location for job tracking.";
          shouldShowWarning = true;
          setCurrentLocation({
            latitude: -33.0197,
            longitude: 27.9117,
          });
          break;
        case error.TIMEOUT:
          userMessage =
            "Location request timed out. Retrying with lower accuracy...";
          warning("Location Timeout", userMessage);
          // Try fallback for timeout
          setTimeout(() => {
            getCurrentLocationFallback();
          }, 5000);
          break;
        default:
          userMessage =
            "Unable to get location. Using default location for job tracking.";
          shouldShowWarning = true;
          setCurrentLocation({
            latitude: -33.0197,
            longitude: 27.9117,
          });
          break;
      }

      // Log detailed error information for debugging
      geolocationUtils.logGeolocationError(error, "EnhancedJobDetailsScreen");

      // Show user-friendly notification
      if (shouldShowWarning) {
        warning("Location Access", userMessage);
      }
    };


    const getCurrentLocationFallback = () => {
      navigator.geolocation.getCurrentPosition(
        handleLocationSuccess,
        (error) => {
          // Log fallback error using improved utility
          geolocationUtils.logGeolocationError(error, "EnhancedJobDetailsScreen - Fallback");

          // Use default location if all else fails
          setCurrentLocation({
            latitude: -33.0197, // East London coordinates as fallback
            longitude: 27.9117,
          });

          notifyError(
            "Location Failed",
            "Using default location due to location service failure.",
          );
        },
        {
          enableHighAccuracy: false,
          timeout: 15000,
          maximumAge: 60000,
        },
      );
    };

    const watchId = navigator.geolocation.watchPosition(
      handleLocationSuccess,
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      },
    );

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

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
      const response = await fetch(`/api/job-mgmt/jobs/${jobDetails.id}/accept`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicianId: technician.id,
          acceptedTime: new Date().toISOString(),
          location: currentLocation,
        }),
      });

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
      const response = await fetch(`/api/jobs/${jobId}/udf`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(udfData),
      });

      if (response.ok) {
        toast({
          title: "UDF Updated",
          description: "User defined fields have been saved successfully.",
        });
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update UDF. Please try again.",
        });
      }
    } catch (error) {
      console.error("Failed to update UDF:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update UDF. Please try again.",
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
    Object.entries(imageFormData).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });

    try {
      const response = await fetch(`/api/jobs/${jobDetails.id}/images`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Mock response for uploaded images
        const newPhotos = [
          {
            id: "before-light-levels",
            name: "Before Light Levels",
            url: "/placeholder.svg",
            type: "Before Light Levels",
          },
          {
            id: "fault-finding",
            name: "Fault Finding",
            url: "/placeholder.svg",
            type: "Fault Finding",
          },
          {
            id: "fault-after-fixing",
            name: "Fault After Fixing",
            url: "/placeholder.svg",
            type: "Fault After Fixing",
          },
          {
            id: "light-levels-after-fix",
            name: "Light Levels After Fix",
            url: "/placeholder.svg",
            type: "Light Levels After Fix",
          },
        ];
        setJobPhotos(newPhotos);
        setShowImageForm(false);
        setImageFormData({
          beforeLightLevels: null,
          faultFinding: null,
          faultAfterFixing: null,
          lightLevelsAfterFix: null,
        });

        // Show success toast
        toast({
          title: "Images Uploaded",
          description: "All job images have been uploaded successfully.",
        });
      } else {
        toast({
          title: "Upload Failed",
          description: "Failed to upload images. Please try again.",
        });
      }
    } catch (error) {
      console.error("Failed to upload images:", error);
    }
  };

  // Stock form handlers
  const filteredStocks = availableStocks.filter(
    (stock) =>
      stock.code
        .toLowerCase()
        .includes(stockFormData.searchQuery.toLowerCase()) ||
      stock.name
        .toLowerCase()
        .includes(stockFormData.searchQuery.toLowerCase()),
  );

  const submitStockForm = async () => {
    if (!stockFormData.selectedStock || !stockFormData.quantity) {
      alert("Please select stock and enter quantity");
      return;
    }

    try {
      // Auto-link work order number and recognize technician warehouse
      const response = await fetch(
        `/api/jobs/${jobDetails.id}/allocate-stock`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stockId: stockFormData.selectedStock.id,
            warehouseNumber: technician.warehouse || "WH-EL-001", // Auto-detect from logged-in user
            quantity: parseInt(stockFormData.quantity),
            technicianId: technician.id,
            workOrderNumber:
              jobDetails.workOrderNumber || `WO-${jobDetails.id}`, // Auto-link work order
            jobId: jobDetails.id,
            ticketNumber: jobDetails.id,
            allocatedDate: new Date().toISOString(),
            allocatedBy: technician.name,
            stockLocation: technician.warehouse,
            autoLinked: true, // Flag to indicate automatic linking
          }),
        },
      );

      if (response.ok) {
        const allocationResult = await response.json();

        // Update local stock tracking
        setAllocatedStock((prev) => [
          ...prev,
          {
            id: `stock-${Date.now()}`,
            code: stockFormData.selectedStock.code,
            name: stockFormData.selectedStock.name,
            quantity: parseInt(stockFormData.quantity),
            allocatedAt: new Date().toISOString(),
          },
        ]);

        setShowStockForm(false);
        setStockFormData({
          searchQuery: "",
          selectedStock: null,
          warehouseNumber: "",
          quantity: "",
        });

        // Show success toast
        toast({
          title: "Stock Allocated",
          description: `${stockFormData.selectedStock.code} - Quantity: ${stockFormData.quantity} allocated successfully.`,
        });
      } else {
        toast({
          title: "Allocation Failed",
          description: "Failed to allocate stock. Please try again.",
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
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-full h-10 w-10"
              onClick={() => setShowTimerOverlay(!showTimerOverlay)}
              title="View Timer"
            >
              <Clock className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-full h-10 w-10"
              onClick={() => navigate("/technician/jobs")}
            >
              <X className="h-6 w-6" />
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
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Vumatel (Pty) Ltd - Central
          </h2>
          <h3 className="text-xl font-semibold mb-3">#{jobDetails.id}215784</h3>
          <Badge
            className={`px-4 py-1 text-sm ${
              jobDetails.status === "assigned"
                ? "bg-orange-500/80 text-white"
                : jobDetails.status === "accepted"
                  ? "bg-blue-500/80 text-white"
                  : jobDetails.status === "in-progress" || jobDetails.status === "In Progress"
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
                : jobDetails.status === "in-progress" || jobDetails.status === "In Progress"
                  ? "In Progress"
                  : jobDetails.status === "paused"
                    ? "Paused"
                    : jobDetails.status === "completed"
                      ? "Completed"
                      : jobDetails.status.charAt(0).toUpperCase() + jobDetails.status.slice(1)}
          </Badge>
        </div>

        {/* Info Cards */}
        <div className="flex justify-between space-x-4">
          <div className="bg-white/20 rounded-2xl p-4 flex-1 flex items-center space-x-3">
            <Calendar className="h-8 w-8 text-white" />
            <div>
              <p className="text-sm text-white/80">Created On</p>
              <p className="font-semibold">
                {jobDetails.createdDate
                  ? new Date(jobDetails.createdDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : new Date().toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                }
              </p>
            </div>
          </div>
          <div className="bg-white/20 rounded-2xl p-4 flex-1 flex items-center space-x-3">
            <CircleDot className="h-8 w-8 text-blue-400" />
            <div>
              <p className="text-sm text-white/80">Status</p>
              <p className="font-semibold">
                {jobDetails.status === "assigned"
                  ? "Assigned"
                  : jobDetails.status === "accepted"
                    ? "Accepted"
                    : jobDetails.status === "in-progress" || jobDetails.status === "In Progress"
                      ? "In Progress"
                      : jobDetails.status === "paused"
                        ? "Paused"
                        : jobDetails.status === "completed"
                          ? "Completed"
                          : jobDetails.status.charAt(0).toUpperCase() + jobDetails.status.slice(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

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

      {/* Stock Allocation Form Overlay */}
      {showStockForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Allocate Stock</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStockForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {/* Search Bar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Stock (Code or Name)
                  </label>
                  <Input
                    type="text"
                    placeholder="Search by code or name..."
                    value={stockFormData.searchQuery}
                    onChange={(e) =>
                      setStockFormData((prev) => ({
                        ...prev,
                        searchQuery: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>

                {/* Stock Results */}
                {stockFormData.searchQuery && (
                  <div className="max-h-40 overflow-y-auto border rounded-lg">
                    {filteredStocks.map((stock) => (
                      <div
                        key={stock.id}
                        className={`p-3 cursor-pointer hover:bg-gray-50 border-b ${
                          stockFormData.selectedStock?.id === stock.id
                            ? "bg-blue-50"
                            : ""
                        }`}
                        onClick={() =>
                          setStockFormData((prev) => ({
                            ...prev,
                            selectedStock: stock,
                          }))
                        }
                      >
                        <div className="font-medium">{stock.code}</div>
                        <div className="text-sm text-gray-600">
                          {stock.name}
                        </div>
                        <div className="text-sm text-green-600">
                          Available: {stock.warehouseQty}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected Stock */}
                {stockFormData.selectedStock && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium">
                      {stockFormData.selectedStock.code}
                    </div>
                    <div className="text-sm text-gray-600">
                      {stockFormData.selectedStock.name}
                    </div>
                  </div>
                )}

                {/* Auto-Linked Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">
                    Auto-Linked Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">Work Order:</span>
                      <span className="font-medium text-blue-900">
                        {jobDetails.workOrderNumber || `WO-${jobDetails.id}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">
                        Technician Warehouse:
                      </span>
                      <span className="font-medium text-blue-900">
                        {technician.warehouse || "WH-EL-001"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Ticket Number:</span>
                      <span className="font-medium text-blue-900">
                        {jobDetails.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Allocated By:</span>
                      <span className="font-medium text-blue-900">
                        {technician.name}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-blue-600">
                    ℹ️ Work order and warehouse information will be
                    automatically linked to this stock allocation.
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity to Allocate
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    value={stockFormData.quantity}
                    onChange={(e) =>
                      setStockFormData((prev) => ({
                        ...prev,
                        quantity: e.target.value,
                      }))
                    }
                    className="w-full"
                    min="1"
                    max={stockFormData.selectedStock?.warehouseQty || 999}
                  />
                </div>

                {/* Submit Button */}
                <Button
                  onClick={submitStockForm}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
                  disabled={
                    !stockFormData.selectedStock || !stockFormData.quantity
                  }
                >
                  Allocate Stock
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="p-4 pb-24">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
          <TabsContent value="gallery" className="space-y-4">
            <div className="relative min-h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              {jobPhotos.length === 0 ? (
                <div className="text-center">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No Images</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 p-4 w-full">
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
              )}

              <Button
                onClick={() => setShowImageForm(true)}
                className="absolute bottom-4 right-4 h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </div>
          </TabsContent>

          {/* Stocks Tab */}
          <TabsContent value="stocks" className="space-y-4">
            <div className="relative min-h-[400px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              {allocatedStock.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No Stock Allocated</p>
                </div>
              ) : (
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">
                    Allocated Stock
                  </h3>
                  <div className="space-y-3">
                    {allocatedStock.map((stock) => (
                      <div
                        key={stock.id}
                        className="bg-white rounded-lg border p-4 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Package className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {stock.code}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {stock.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Allocated:{" "}
                                  {new Date(
                                    stock.allocatedAt,
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-semibold text-gray-900">
                              {stock.quantity}
                            </span>
                            <p className="text-xs text-gray-500">Units</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={() => setShowStockForm(true)}
                className="absolute bottom-4 right-4 h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="h-6 w-6" />
              </Button>
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

                {/* Completion Status */}
                {(!signOffData.acceptTerms ||
                  !signOffData.udfCompleted ||
                  !signOffData.imagesUploaded ||
                  !signOffData.stockChecked ||
                  !signOffData.signature) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2" />
                      <span className="text-sm text-yellow-800 font-medium">
                        Complete all checklist items and sign to finish the job
                      </span>
                    </div>
                  </div>
                )}
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
    </div>
  );
}
