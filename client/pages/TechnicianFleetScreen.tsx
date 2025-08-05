import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  X,
  Truck,
  Wrench,
  Camera,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Fuel,
  Settings,
  Shield,
  Calendar,
  Hash,
  Upload,
  Play,
  Square,
  Heart,
} from "lucide-react";

interface InspectionItem {
  id: string;
  item: string;
  checked: boolean;
  status: "ok" | "needs-attention" | "not-checked";
  condition?: string;
  conditionOptions?: string[];
  notes?: string;
  requiresImage?: boolean;
  images?: string[];
  maxImages?: number;
  requiresVideo?: boolean;
  video?: string;
  requiresExpiry?: boolean;
  expiryDate?: string;
}

interface Inspection {
  id: string;
  title: string;
  icon: any;
  color: string;
  description: string;
  items: InspectionItem[];
  lastCompleted?: string;
  status: "pending" | "in-progress" | "completed";
}

export default function TechnicianFleetScreen() {
  const navigate = useNavigate();
  const [selectedInspection, setSelectedInspection] =
    useState<Inspection | null>(null);
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [currentItemForImage, setCurrentItemForImage] = useState<{
    inspectionId: string;
    itemId: string;
    type: "image" | "video";
  } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);

  const [inspections, setInspections] = useState<Inspection[]>([
    {
      id: "vehicle-inspection",
      title: "Vehicle Inspection",
      icon: Truck,
      color: "bg-blue-500",
      description: "Daily vehicle safety and condition check",
      status: "pending",
      items: [
        {
          id: "vi1",
          item: "Driver's License",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          requiresExpiry: true,
          conditionOptions: ["Valid", "Expiring", "Expired"],
          images: [],
          maxImages: 1,
        },
        {
          id: "vi2",
          item: "License Disk for the car",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          requiresExpiry: true,
          conditionOptions: ["Valid", "Expiring", "Expired"],
          images: [],
          maxImages: 1,
        },
        {
          id: "vi3",
          item: "Check tire pressure and condition",
          checked: false,
          status: "not-checked",
          conditionOptions: ["In Spec", "Needs Attention"],
          requiresImage: false,
        },
        {
          id: "vi4",
          item: "Front and rear lights",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          conditionOptions: ["Good", "Damaged", "Stolen", "Don't Have"],
          images: [],
          maxImages: 2,
        },
        {
          id: "vi5",
          item: "Canopy condition",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          conditionOptions: ["Good", "Damaged", "Stolen", "Don't Have"],
          images: [],
          maxImages: 1,
        },
        {
          id: "vi6",
          item: "Canopy lock",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          conditionOptions: ["Good", "Damaged", "Stolen", "Don't Have"],
          images: [],
          maxImages: 1,
        },
        {
          id: "vi7",
          item: "Spare wheel lock",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          conditionOptions: ["Good", "Damaged", "Stolen", "Don't Have"],
          images: [],
          maxImages: 1,
        },
        {
          id: "vi8",
          item: "Left side of the car",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          conditionOptions: ["Good", "Damaged", "Stolen", "Don't Have"],
          images: [],
          maxImages: 1,
        },
        {
          id: "vi9",
          item: "Right side of the car",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          conditionOptions: ["Good", "Damaged", "Stolen", "Don't Have"],
          images: [],
          maxImages: 1,
        },
        {
          id: "vi10",
          item: "Front image of the car",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          conditionOptions: ["Good", "Damaged", "Stolen", "Don't Have"],
          images: [],
          maxImages: 1,
        },
        {
          id: "vi11",
          item: "Rear image of the car",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          conditionOptions: ["Good", "Damaged", "Stolen", "Don't Have"],
          images: [],
          maxImages: 1,
        },
        {
          id: "vi12",
          item: "Hazard lights video (front and rear)",
          checked: false,
          status: "not-checked",
          requiresVideo: true,
          conditionOptions: [
            "All Working",
            "All Faulty",
            "Front Faulty",
            "Rear Faulty",
          ],
        },
        {
          id: "vi13",
          item: "Images of damaged items (if any)",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          conditionOptions: ["None", "Minor Damage", "Major Damage"],
          images: [],
          maxImages: 5,
        },
        {
          id: "vi14",
          item: "Odometer reading",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          conditionOptions: ["Due for Service", "Faulty", "Good"],
          images: [],
          maxImages: 1,
        },
        {
          id: "vi15",
          item: "Driver tag with tag number",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          conditionOptions: ["Good", "Damaged", "Stolen", "Don't Have"],
          images: [],
          maxImages: 1,
        },
        {
          id: "vi16",
          item: "Windscreen condition",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          conditionOptions: ["Good", "Damaged", "Stolen", "Don't Have"],
          images: [],
          maxImages: 1,
        },
        {
          id: "vi17",
          item: "Passenger and driver windows",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          conditionOptions: ["Good", "Damaged", "Stolen", "Don't Have"],
          images: [],
          maxImages: 2,
        },
        {
          id: "vi18",
          item: "Side mirrors condition",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          conditionOptions: ["Good", "Damaged", "Stolen"],
          images: [],
          maxImages: 2,
        },
        {
          id: "vi19",
          item: "Service book last dated stamp",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          conditionOptions: ["Current", "Overdue", "Missing"],
          images: [],
          maxImages: 1,
        },
        {
          id: "vi20",
          item: "Opened canopy with packed tools",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          conditionOptions: ["Cleaned", "Dirty"],
          images: [],
          maxImages: 1,
        },
        {
          id: "vi21",
          item: "Test brakes functionality",
          checked: false,
          status: "not-checked",
          conditionOptions: ["Good", "Needs Attention", "Faulty"],
          requiresImage: false,
        },
        {
          id: "vi22",
          item: "Check fluid levels (oil, coolant, brake fluid)",
          checked: false,
          status: "not-checked",
          conditionOptions: ["All Good", "Low Levels", "Critical"],
          requiresImage: false,
        },
        {
          id: "vi23",
          item: "Interior cleanliness and condition",
          checked: false,
          status: "not-checked",
          conditionOptions: ["Clean", "Needs Cleaning", "Damaged"],
          requiresImage: false,
        },
        {
          id: "vi24",
          item: "Exterior condition and cleanliness",
          checked: false,
          status: "not-checked",
          requiresImage: true,
          conditionOptions: ["Good", "Damaged", "Stolen", "Don't Have"],
          images: [],
          maxImages: 4,
        },
      ],
    },
    {
      id: "tool-inspection",
      title: "Tool Inspection",
      icon: Wrench,
      color: "bg-green-500",
      description: "Tool and equipment condition check",
      status: "pending",
      items: [
        {
          id: "ti1",
          item: "Ladder condition and stability",
          checked: false,
          status: "not-checked",
          requiresImage: true,
        },
        {
          id: "ti2",
          item: "Power drill and bits",
          checked: false,
          status: "not-checked",
          requiresImage: true,
        },
        {
          id: "ti3",
          item: "Screwdrivers set",
          checked: false,
          status: "not-checked",
          requiresImage: true,
        },
        {
          id: "ti4",
          item: "Wrenches and spanners",
          checked: false,
          status: "not-checked",
          requiresImage: true,
        },
        {
          id: "ti5",
          item: "Wire strippers and cutters",
          checked: false,
          status: "not-checked",
          requiresImage: true,
        },
        {
          id: "ti6",
          item: "Measuring tape",
          checked: false,
          status: "not-checked",
          requiresImage: true,
        },
        {
          id: "ti7",
          item: "Cable tester/multimeter",
          checked: false,
          status: "not-checked",
          requiresImage: true,
        },
        {
          id: "ti8",
          item: "Safety helmet",
          checked: false,
          status: "not-checked",
          requiresImage: true,
        },
        {
          id: "ti9",
          item: "Safety gloves",
          checked: false,
          status: "not-checked",
          requiresImage: true,
        },
        {
          id: "ti10",
          item: "High-vis vest",
          checked: false,
          status: "not-checked",
          requiresImage: true,
        },
        {
          id: "ti11",
          item: "Tool box organization",
          checked: false,
          status: "not-checked",
          requiresImage: true,
        },
        {
          id: "ti12",
          item: "Communication radio",
          checked: false,
          status: "not-checked",
          requiresImage: true,
        },
        {
          id: "ti13",
          item: "Fiber optic equipment",
          checked: false,
          status: "not-checked",
          requiresImage: true,
        },
        {
          id: "ti14",
          item: "Network cables",
          checked: false,
          status: "not-checked",
          requiresImage: true,
        },
        {
          id: "ti15",
          item: "Crimping tools",
          checked: false,
          status: "not-checked",
          requiresImage: true,
        },
      ],
    },
  ]);

  // Camera functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      setCurrentStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setShowCamera(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const stopCamera = () => {
    if (currentStream) {
      currentStream.getTracks().forEach((track) => track.stop());
      setCurrentStream(null);
    }
    setShowCamera(false);
    setCurrentItemForImage(null);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && currentItemForImage) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);

        handleImageAdd(
          currentItemForImage.inspectionId,
          currentItemForImage.itemId,
          imageDataUrl,
        );
        stopCamera();
      }
    }
  };

  const startVideoRecording = async () => {
    if (currentStream && currentItemForImage) {
      const recorder = new MediaRecorder(currentStream, {
        mimeType: "video/webm",
      });
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const videoDataUrl = URL.createObjectURL(blob);
        handleVideoAdd(
          currentItemForImage.inspectionId,
          currentItemForImage.itemId,
          videoDataUrl,
        );
        stopCamera();
      };

      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
          setIsRecording(false);
        }
      }, 10000);
    }
  };

  const stopVideoRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleImageCapture = (inspectionId: string, itemId: string) => {
    setCurrentItemForImage({ inspectionId, itemId, type: "image" });
    startCamera();
  };

  const handleVideoCapture = (inspectionId: string, itemId: string) => {
    setCurrentItemForImage({ inspectionId, itemId, type: "video" });
    startCamera();
  };

  const handleConditionUpdate = (
    inspectionId: string,
    itemId: string,
    condition: string,
  ) => {
    setInspections((prev) =>
      prev.map((inspection) => {
        if (inspection.id === inspectionId) {
          const updatedItems = inspection.items.map((item) =>
            item.id === itemId ? { ...item, condition } : item,
          );
          return { ...inspection, items: updatedItems };
        }
        return inspection;
      }),
    );
  };

  const handleExpiryDateUpdate = (
    inspectionId: string,
    itemId: string,
    expiryDate: string,
  ) => {
    setInspections((prev) =>
      prev.map((inspection) => {
        if (inspection.id === inspectionId) {
          const updatedItems = inspection.items.map((item) =>
            item.id === itemId ? { ...item, expiryDate } : item,
          );
          return { ...inspection, items: updatedItems };
        }
        return inspection;
      }),
    );
  };

  const handleImageAdd = (
    inspectionId: string,
    itemId: string,
    imageDataUrl: string,
  ) => {
    setInspections((prev) =>
      prev.map((inspection) => {
        if (inspection.id === inspectionId) {
          const updatedItems = inspection.items.map((item) => {
            if (item.id === itemId) {
              const currentImages = item.images || [];
              const maxImages = item.maxImages || 1;
              if (currentImages.length < maxImages) {
                return { ...item, images: [...currentImages, imageDataUrl] };
              }
            }
            return item;
          });
          return { ...inspection, items: updatedItems };
        }
        return inspection;
      }),
    );
  };

  const handleVideoAdd = (
    inspectionId: string,
    itemId: string,
    videoDataUrl: string,
  ) => {
    setInspections((prev) =>
      prev.map((inspection) => {
        if (inspection.id === inspectionId) {
          const updatedItems = inspection.items.map((item) =>
            item.id === itemId ? { ...item, video: videoDataUrl } : item,
          );
          return { ...inspection, items: updatedItems };
        }
        return inspection;
      }),
    );
  };

  const handleInspectionItemUpdate = (
    inspectionId: string,
    itemId: string,
    status: "ok" | "needs-attention",
  ) => {
    setInspections((prev) =>
      prev.map((inspection) => {
        if (inspection.id === inspectionId) {
          const updatedItems = inspection.items.map((item) =>
            item.id === itemId ? { ...item, checked: true, status } : item,
          );
          const completedItems = updatedItems.filter(
            (item) => item.checked,
          ).length;
          const totalItems = updatedItems.length;
          const inspectionStatus =
            completedItems === 0
              ? "pending"
              : completedItems === totalItems
                ? "completed"
                : "in-progress";

          return {
            ...inspection,
            items: updatedItems,
            status: inspectionStatus,
          };
        }
        return inspection;
      }),
    );
  };

  const canCompleteInspection = (inspection: Inspection) => {
    return inspection.items.every((item) => {
      if (!item.checked) return false;
      if (!item.condition) return false;

      // Check expiry date requirement
      if (item.requiresExpiry && !item.expiryDate) return false;

      // Check image requirements based on condition and item type
      if (item.requiresImage) {
        const requiredImages = item.maxImages || 1;
        const currentImages = item.images?.length || 0;

        // Special cases where images are always required
        if (["vi1", "vi2", "vi20"].includes(item.id)) {
          // Driver's License, License Disk, Opened canopy
          if (currentImages < requiredImages) return false;
        }
        // For other items, check if condition requires images
        else if (
          !["Stolen", "Don't Have"].includes(item.condition) &&
          currentImages < requiredImages
        ) {
          return false;
        }
      }

      // Check video requirement
      if (item.requiresVideo && !item.video) return false;

      return true;
    });
  };

  const handleCompleteInspection = (inspectionId: string) => {
    const inspection = inspections.find((i) => i.id === inspectionId);
    if (!inspection || !canCompleteInspection(inspection)) {
      alert(
        "Please complete all required fields, serial numbers, expiry dates, and images before submitting.",
      );
      return;
    }

    setInspections((prev) =>
      prev.map((inspection) => {
        if (inspection.id === inspectionId) {
          return {
            ...inspection,
            status: "completed",
            lastCompleted: new Date().toLocaleString(),
          };
        }
        return inspection;
      }),
    );
    setSelectedInspection(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-orange-500";
      default:
        return "bg-gray-500";
    }
  };

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case "ok":
        return "bg-green-50 border-green-200";
      case "needs-attention":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "in-progress":
        return Clock;
      default:
        return FileText;
    }
  };

  // Incident Report Form (reuse from safety screen)
  if (showIncidentForm) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setShowIncidentForm(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold">Fleet Incident Report</h1>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <FileText className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <Card>
            <CardContent className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Incident Type
                  </label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>Vehicle Accident</option>
                    <option>Tool Malfunction</option>
                    <option>Equipment Damage</option>
                    <option>Vehicle Breakdown</option>
                    <option>Theft/Loss</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Vehicle/Equipment ID
                  </label>
                  <input
                    type="text"
                    placeholder="Vehicle or equipment identifier"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date and Time
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Incident location"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe what happened..."
                    rows={4}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Damage Assessment
                  </label>
                  <textarea
                    placeholder="Describe any damage to vehicle/equipment..."
                    rows={3}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estimated Cost
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Photos
                  </label>
                  <Button type="button" variant="outline" className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photos
                  </Button>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    Submit Report
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowIncidentForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Inspection Detail View
  if (selectedInspection) {
    const completedItems = selectedInspection.items.filter(
      (item) => item.checked,
    ).length;
    const totalItems = selectedInspection.items.length;
    const progress = (completedItems / totalItems) * 100;

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setSelectedInspection(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">
              {selectedInspection.title}
            </h1>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Camera className="h-6 w-6" />
            </Button>
          </div>

          <div className="text-center mb-4">
            <div className="text-2xl font-bold">
              {completedItems}/{totalItems}
            </div>
            <div className="text-sm opacity-90">Items Checked</div>
            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Hidden Camera Elements */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file && currentItemForImage) {
              const reader = new FileReader();
              reader.onload = (event) => {
                handleInspectionItemUpdate(
                  currentItemForImage.inspectionId,
                  currentItemForImage.itemId,
                  "ok",
                  event.target?.result as string,
                );
                setCurrentItemForImage(null);
              };
              reader.readAsDataURL(file);
            }
          }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col">
            <div className="flex justify-between items-center p-4 text-white">
              <h2 className="text-lg font-semibold">Take Photo</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={stopCamera}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            <div className="flex-1 flex items-center justify-center p-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover rounded-lg max-w-md max-h-96"
              />
            </div>

            <div className="p-4 flex justify-center space-x-4">
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white/20"
                onClick={stopCamera}
              >
                Cancel
              </Button>
              {currentItemForImage?.type === "video" ? (
                <>
                  {!isRecording ? (
                    <Button
                      className="bg-red-600 text-white hover:bg-red-700"
                      onClick={startVideoRecording}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Start Recording (10s)
                    </Button>
                  ) : (
                    <Button
                      className="bg-red-600 text-white hover:bg-red-700"
                      onClick={stopVideoRecording}
                    >
                      <Square className="h-5 w-5 mr-2" />
                      Stop Recording
                    </Button>
                  )}
                </>
              ) : (
                <Button
                  className="bg-white text-black hover:bg-gray-200"
                  onClick={capturePhoto}
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Capture
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="p-4 pb-20">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                {selectedInspection.items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border ${getItemStatusColor(item.status)}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-gray-800 flex-1 font-medium">
                        {item.item}
                      </p>
                      {item.checked && (
                        <Badge
                          className={
                            item.status === "ok"
                              ? "bg-green-500"
                              : "bg-orange-500"
                          }
                        >
                          {item.status === "ok" ? "OK" : "Needs Attention"}
                        </Badge>
                      )}
                    </div>

                    {/* Expiry Date Input */}
                    {item.requiresExpiry && (
                      <div className="mb-3">
                        <Label className="text-sm font-medium mb-1 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Expiry Date
                        </Label>
                        <Input
                          type="date"
                          value={item.expiryDate || ""}
                          onChange={(e) =>
                            handleExpiryDateUpdate(
                              selectedInspection.id,
                              item.id,
                              e.target.value,
                            )
                          }
                          className="text-sm"
                        />
                      </div>
                    )}

                    {/* Condition Selection */}
                    <div className="mb-3">
                      <Label className="text-sm font-medium mb-1">
                        Condition
                      </Label>
                      <div
                        className={`grid gap-2 ${item.conditionOptions?.length === 2 ? "grid-cols-2" : "grid-cols-2"}`}
                      >
                        {item.conditionOptions?.map((option) => (
                          <Button
                            key={option}
                            variant={
                              item.condition === option ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              handleConditionUpdate(
                                selectedInspection.id,
                                item.id,
                                option,
                              )
                            }
                            className="text-xs"
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Video Capture */}
                    {item.requiresVideo && (
                      <div className="mb-3">
                        <Label className="text-sm font-medium mb-1 flex items-center">
                          <Play className="h-4 w-4 mr-1" />
                          Required 10sec Video
                        </Label>
                        {item.video ? (
                          <div className="relative">
                            <video
                              src={item.video}
                              controls
                              className="w-full h-32 object-cover rounded border"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="absolute top-2 right-2 bg-white/80"
                              onClick={() =>
                                handleVideoCapture(
                                  selectedInspection.id,
                                  item.id,
                                )
                              }
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleVideoCapture(selectedInspection.id, item.id)
                            }
                            className="w-full border-dashed border-2"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Record Video
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Image Capture - Multiple Images Support */}
                    {item.requiresImage && (
                      <div className="mb-3">
                        <Label className="text-sm font-medium mb-1 flex items-center">
                          <Camera className="h-4 w-4 mr-1" />
                          Required Images ({item.images?.length || 0}/
                          {item.maxImages || 1})
                        </Label>

                        {/* Display existing images */}
                        {item.images && item.images.length > 0 && (
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            {item.images.map((image, index) => (
                              <div key={index} className="relative">
                                <img
                                  src={image}
                                  alt={`Captured ${index + 1}`}
                                  className="w-full h-24 object-cover rounded border"
                                />
                                <div className="absolute top-1 right-1 bg-black/50 text-white rounded px-1 text-xs">
                                  {index + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add more images button */}
                        {(!item.images ||
                          item.images.length < (item.maxImages || 1)) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleImageCapture(selectedInspection.id, item.id)
                            }
                            className="w-full border-dashed border-2"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            {item.images?.length
                              ? "Add Another Image"
                              : "Take Photo"}
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Status Buttons */}
                    {!item.checked && item.condition && (
                      <div className="flex space-x-2 mt-3">
                        <Button
                          size="sm"
                          onClick={() =>
                            handleInspectionItemUpdate(
                              selectedInspection.id,
                              item.id,
                              "ok",
                            )
                          }
                          className="bg-green-600 hover:bg-green-700 text-white flex-1"
                          disabled={
                            // Check expiry date requirement
                            (item.requiresExpiry && !item.expiryDate) ||
                            // Check video requirement
                            (item.requiresVideo && !item.video) ||
                            // Check image requirements
                            (item.requiresImage &&
                              // Always required for certain items
                              ((["vi1", "vi2", "vi20"].includes(item.id) &&
                                (!item.images ||
                                  item.images.length <
                                    (item.maxImages || 1))) ||
                                // Required for non-stolen/don't have conditions
                                (!["Stolen", "Don't Have"].includes(
                                  item.condition,
                                ) &&
                                  (!item.images ||
                                    item.images.length <
                                      (item.maxImages || 1)))))
                          }
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          OK
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleInspectionItemUpdate(
                              selectedInspection.id,
                              item.id,
                              "needs-attention",
                            )
                          }
                          className="bg-orange-600 hover:bg-orange-700 text-white flex-1"
                          disabled={
                            // Same validation as OK button
                            (item.requiresExpiry && !item.expiryDate) ||
                            (item.requiresVideo && !item.video) ||
                            (item.requiresImage &&
                              ((["vi1", "vi2", "vi20"].includes(item.id) &&
                                (!item.images ||
                                  item.images.length <
                                    (item.maxImages || 1))) ||
                                (!["Stolen", "Don't Have"].includes(
                                  item.condition,
                                ) &&
                                  (!item.images ||
                                    item.images.length <
                                      (item.maxImages || 1)))))
                          }
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Needs Attention
                        </Button>
                      </div>
                    )}

                    {/* Required Fields Warning */}
                    {!item.checked && (
                      <>
                        {!item.condition && (
                          <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                            Please select item condition first
                          </div>
                        )}
                        {item.condition &&
                          item.requiresExpiry &&
                          !item.expiryDate && (
                            <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                              Expiry date is required
                            </div>
                          )}
                        {item.condition &&
                          item.requiresVideo &&
                          !item.video && (
                            <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                              Video recording is required
                            </div>
                          )}
                        {item.condition &&
                          item.requiresImage &&
                          (!item.images ||
                            item.images.length < (item.maxImages || 1)) &&
                          (!["Stolen", "Don't Have"].includes(item.condition) ||
                            ["vi1", "vi2", "vi20"].includes(item.id)) && (
                            <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                              {(item.maxImages || 1) > 1
                                ? `${item.maxImages || 1} images required`
                                : "Image is required"}
                            </div>
                          )}
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex space-x-4">
                <Button
                  onClick={() =>
                    handleCompleteInspection(selectedInspection.id)
                  }
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!canCompleteInspection(selectedInspection)}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Inspection
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedInspection(null)}
                >
                  Cancel
                </Button>
              </div>

              {!canCompleteInspection(selectedInspection) &&
                completedItems === totalItems && (
                  <div className="mt-3 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                    Please complete all required fields, serial numbers, expiry
                    dates, and images before submitting.
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main Fleet Screen
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => navigate("/")}
          >
            <X className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Fleet</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <Truck className="h-6 w-6" />
          </Button>
        </div>
        <p className="text-center text-white/90">
          Vehicle and tool inspections
        </p>
      </div>

      {/* Inspections */}
      <div className="p-4 space-y-4">
        {inspections.map((inspection) => {
          const IconComponent = inspection.icon;
          const StatusIcon = getStatusIcon(inspection.status);
          const completedItems = inspection.items.filter(
            (item) => item.checked,
          ).length;
          const totalItems = inspection.items.length;

          return (
            <Card
              key={inspection.id}
              className="bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedInspection(inspection)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`${inspection.color} p-3 rounded-xl`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {inspection.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {inspection.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge
                      className={`${getStatusColor(inspection.status)} text-white mb-2`}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {inspection.status}
                    </Badge>
                    <div className="text-sm text-gray-600">
                      {completedItems}/{totalItems}
                    </div>
                  </div>
                </div>

                {inspection.lastCompleted && (
                  <div className="text-xs text-gray-500">
                    Last completed: {inspection.lastCompleted}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Incident Report Button */}
        <Card
          className="bg-red-50 border-red-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => setShowIncidentForm(true)}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500 p-3 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800">
                  Fleet Incident Report
                </h3>
                <p className="text-sm text-red-600">
                  Report vehicle or equipment incidents
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
