import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  X,
  Shield,
  Flame,
  Zap,
  Mountain,
  HardHat,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Camera,
  User,
  Calendar,
  Hash,
  Heart,
} from "lucide-react";

interface ChecklistItem {
  id: string;
  item: string;
  checked: boolean;
  required: boolean;
  notes?: string;
  requiresImage?: boolean;
  image?: string;
  serialNumber?: string;
  expiryDate?: string;
  requiresSerial?: boolean;
  requiresExpiry?: boolean;
}

interface SafetyChecklist {
  id: string;
  title: string;
  icon: any;
  color: string;
  description: string;
  items: ChecklistItem[];
  lastCompleted?: string;
  status: "pending" | "in-progress" | "completed";
  globalExpiryDate?: string;
  globalSerialNumber?: string;
  locationImage?: string;
  requiresLocationImage?: boolean;
}

export default function TechnicianSafetyScreen() {
  const navigate = useNavigate();
  const [selectedChecklist, setSelectedChecklist] =
    useState<SafetyChecklist | null>(null);
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [currentItemForImage, setCurrentItemForImage] = useState<{
    checklistId: string;
    type: "location" | "item";
    itemId?: string;
  } | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);

  const [safetyChecklists, setSafetyChecklists] = useState<SafetyChecklist[]>([
    {
      id: "harness-checklist",
      title: "Harness Checklist",
      icon: Shield,
      color: "bg-red-500",
      description: "Safety harness and fall protection equipment check",
      status: "pending",
      requiresLocationImage: false,
      items: [
        {
          id: "h1",
          item: "Full body harness condition",
          checked: false,
          required: true,
          requiresSerial: true,
          requiresExpiry: true,
        },
        {
          id: "h2",
          item: "Webbing straps for cuts, frays or damage",
          checked: false,
          required: true,
          requiresSerial: true,
          requiresExpiry: true,
        },
        {
          id: "h3",
          item: "Hardware (buckles, D-rings) for damage",
          checked: false,
          required: true,
          requiresSerial: true,
          requiresExpiry: true,
        },
        {
          id: "h4",
          item: "Stitching integrity on all connections",
          checked: false,
          required: true,
          requiresSerial: true,
          requiresExpiry: true,
        },
        {
          id: "h5",
          item: "Lanyard condition and connections",
          checked: false,
          required: true,
          requiresSerial: true,
          requiresExpiry: true,
        },
        {
          id: "h6",
          item: "Shock absorber pack inspection",
          checked: false,
          required: true,
          requiresSerial: true,
          requiresExpiry: true,
        },
        {
          id: "h7",
          item: "Carabiner gate function and locking",
          checked: false,
          required: true,
          requiresSerial: true,
          requiresExpiry: true,
        },
        {
          id: "h8",
          item: "Labels and certification tags present",
          checked: false,
          required: true,
          requiresSerial: true,
          requiresExpiry: true,
        },
      ],
    },
    {
      id: "fire-extinguisher-checklist",
      title: "Fire Extinguisher Checklist",
      icon: Flame,
      color: "bg-red-600",
      description: "Fire extinguisher safety and condition check",
      status: "pending",
      requiresLocationImage: true,
      items: [
        {
          id: "fe1",
          item: "Pressure gauge reading in green zone",
          checked: false,
          required: true,
        },
        {
          id: "fe2",
          item: "Safety pin and tamper seal intact",
          checked: false,
          required: true,
        },
        {
          id: "fe3",
          item: "Cylinder exterior condition (no dents/corrosion)",
          checked: false,
          required: true,
        },
        {
          id: "fe4",
          item: "Hose and nozzle condition",
          checked: false,
          required: true,
        },
        {
          id: "fe5",
          item: "Mounting bracket secure",
          checked: false,
          required: true,
        },
        {
          id: "fe6",
          item: "Inspection tag up to date",
          checked: false,
          required: true,
        },
        {
          id: "fe7",
          item: "Location accessible and unobstructed",
          checked: false,
          required: true,
        },
      ],
    },
    {
      id: "first-aid-checklist",
      title: "First Aid Kit Checklist",
      icon: Heart,
      color: "bg-green-600",
      description: "First aid kit contents and condition check",
      status: "pending",
      requiresLocationImage: true,
      items: [
        {
          id: "fa1",
          item: "Adhesive bandages (various sizes)",
          checked: false,
          required: true,
        },
        {
          id: "fa2",
          item: "Sterile gauze pads and rolls",
          checked: false,
          required: true,
        },
        { id: "fa3", item: "Medical tape", checked: false, required: true },
        {
          id: "fa4",
          item: "Antiseptic wipes/solution",
          checked: false,
          required: true,
        },
        {
          id: "fa5",
          item: "Disposable gloves",
          checked: false,
          required: true,
        },
        {
          id: "fa6",
          item: "Scissors and tweezers",
          checked: false,
          required: true,
        },
        {
          id: "fa7",
          item: "Instant cold compress",
          checked: false,
          required: true,
        },
        {
          id: "fa8",
          item: "Emergency contact information",
          checked: false,
          required: true,
        },
        {
          id: "fa9",
          item: "First aid manual/instructions",
          checked: false,
          required: true,
        },
      ],
    },
    {
      id: "electrical-tools",
      title: "Electrical Tool Checklist",
      icon: Zap,
      color: "bg-yellow-500",
      description: "Daily electrical equipment safety check",
      status: "pending",
      items: [
        {
          id: "et1",
          item: "All tools are properly insulated",
          checked: false,
          required: true,
        },
        {
          id: "et2",
          item: "No damaged cables or plugs",
          checked: false,
          required: true,
        },
        {
          id: "et3",
          item: "Voltage tester is functioning",
          checked: false,
          required: true,
        },
        {
          id: "et4",
          item: "Multimeter calibration is current",
          checked: false,
          required: true,
        },
        {
          id: "et5",
          item: "Personal protective equipment available",
          checked: false,
          required: true,
        },
        {
          id: "et6",
          item: "Lockout/tagout devices present",
          checked: false,
          required: true,
        },
        {
          id: "et7",
          item: "Emergency contact numbers posted",
          checked: false,
          required: false,
        },
        {
          id: "et8",
          item: "First aid kit accessible",
          checked: false,
          required: true,
        },
      ],
    },
    {
      id: "working-heights",
      title: "Working at Heights Checklist",
      icon: Mountain,
      color: "bg-blue-500",
      description: "Safety check for elevated work",
      status: "pending",
      items: [
        {
          id: "wh1",
          item: "Weather conditions are suitable",
          checked: false,
          required: true,
        },
        {
          id: "wh2",
          item: "Work area is secured and marked",
          checked: false,
          required: true,
        },
        {
          id: "wh3",
          item: "Ladder is in good condition",
          checked: false,
          required: true,
        },
        {
          id: "wh4",
          item: "Ladder is positioned at correct angle",
          checked: false,
          required: true,
        },
        {
          id: "wh5",
          item: "Three points of contact maintained",
          checked: false,
          required: true,
        },
        {
          id: "wh6",
          item: "No overhead power lines in vicinity",
          checked: false,
          required: true,
        },
        {
          id: "wh7",
          item: "Spotter/observer assigned if required",
          checked: false,
          required: false,
        },
        {
          id: "wh8",
          item: "Emergency evacuation plan in place",
          checked: false,
          required: true,
        },
      ],
    },
    {
      id: "risk-assessment",
      title: "Risk Assessment Checklist",
      icon: ClipboardList,
      color: "bg-purple-500",
      description: "General workplace risk assessment",
      status: "pending",
      items: [
        {
          id: "ra1",
          item: "Site hazards identified and documented",
          checked: false,
          required: true,
        },
        {
          id: "ra2",
          item: "Control measures implemented",
          checked: false,
          required: true,
        },
        {
          id: "ra3",
          item: "Emergency procedures communicated",
          checked: false,
          required: true,
        },
        {
          id: "ra4",
          item: "Personal protective equipment specified",
          checked: false,
          required: true,
        },
        {
          id: "ra5",
          item: "Work permits obtained if required",
          checked: false,
          required: true,
        },
        {
          id: "ra6",
          item: "Environmental factors considered",
          checked: false,
          required: true,
        },
        {
          id: "ra7",
          item: "Team members briefed on risks",
          checked: false,
          required: true,
        },
        {
          id: "ra8",
          item: "Risk assessment signed off",
          checked: false,
          required: true,
        },
      ],
    },
    {
      id: "fiber-equipment",
      title: "Fiber Equipment Checklist",
      icon: Zap,
      color: "bg-cyan-500",
      description: "Splicing machine, PON meter, VFL and OTDR/iOLM check",
      status: "pending",
      items: [
        {
          id: "fe1",
          item: "Splicing machine calibration current",
          checked: false,
          required: true,
        },
        {
          id: "fe2",
          item: "Fusion splicer electrodes clean",
          checked: false,
          required: true,
        },
        {
          id: "fe3",
          item: "PON meter functioning correctly",
          checked: false,
          required: true,
        },
        {
          id: "fe4",
          item: "VFL (Visual Fault Locator) operational",
          checked: false,
          required: true,
        },
        {
          id: "fe5",
          item: "OTDR/iOLM measurement accuracy verified",
          checked: false,
          required: true,
        },
        {
          id: "fe6",
          item: "Fiber cleaving tool sharp and clean",
          checked: false,
          required: true,
        },
        {
          id: "fe7",
          item: "Connector cleaning supplies available",
          checked: false,
          required: true,
        },
        {
          id: "fe8",
          item: "Safety glasses for laser equipment",
          checked: false,
          required: true,
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

        if (currentItemForImage.type === "location") {
          handleLocationImageUpdate(
            currentItemForImage.checklistId,
            imageDataUrl,
          );
        }
        stopCamera();
      }
    }
  };

  const handleImageCapture = (
    checklistId: string,
    type: "location" | "item",
    itemId?: string,
  ) => {
    setCurrentItemForImage({ checklistId, type, itemId });
    startCamera();
  };

  const handleChecklistItemToggle = (checklistId: string, itemId: string) => {
    setSafetyChecklists((prev) =>
      prev.map((checklist) => {
        if (checklist.id === checklistId) {
          const updatedItems = checklist.items.map((item) =>
            item.id === itemId ? { ...item, checked: !item.checked } : item,
          );
          const completedItems = updatedItems.filter(
            (item) => item.checked,
          ).length;
          const totalItems = updatedItems.length;
          const status =
            completedItems === 0
              ? "pending"
              : completedItems === totalItems
                ? "completed"
                : "in-progress";

          return { ...checklist, items: updatedItems, status };
        }
        return checklist;
      }),
    );
  };

  const handleGlobalSerialNumberUpdate = (
    checklistId: string,
    serialNumber: string,
  ) => {
    setSafetyChecklists((prev) =>
      prev.map((checklist) =>
        checklist.id === checklistId
          ? { ...checklist, globalSerialNumber: serialNumber }
          : checklist,
      ),
    );
  };

  const handleGlobalExpiryDateUpdate = (
    checklistId: string,
    expiryDate: string,
  ) => {
    setSafetyChecklists((prev) =>
      prev.map((checklist) =>
        checklist.id === checklistId
          ? { ...checklist, globalExpiryDate: expiryDate }
          : checklist,
      ),
    );
  };

  const handleLocationImageUpdate = (checklistId: string, image: string) => {
    setSafetyChecklists((prev) =>
      prev.map((checklist) =>
        checklist.id === checklistId
          ? { ...checklist, locationImage: image }
          : checklist,
      ),
    );
  };

  const canCompleteChecklist = (checklist: SafetyChecklist) => {
    const allItemsChecked = checklist.items.every(
      (item) => !item.required || item.checked,
    );
    const hasRequiredGlobalSerial =
      checklist.id === "fire-extinguisher-checklist"
        ? checklist.globalSerialNumber
        : true;
    const hasRequiredGlobalExpiry = [
      "fire-extinguisher-checklist",
      "first-aid-checklist",
    ].includes(checklist.id)
      ? checklist.globalExpiryDate
      : true;
    const hasRequiredLocationImage = checklist.requiresLocationImage
      ? checklist.locationImage
      : true;

    return (
      allItemsChecked &&
      hasRequiredGlobalSerial &&
      hasRequiredGlobalExpiry &&
      hasRequiredLocationImage
    );
  };

  const handleCompleteChecklist = (checklistId: string) => {
    const checklist = safetyChecklists.find((c) => c.id === checklistId);
    if (!checklist || !canCompleteChecklist(checklist)) {
      alert(
        "Please complete all required fields, serial numbers, expiry dates, and images before submitting.",
      );
      return;
    }

    setSafetyChecklists((prev) =>
      prev.map((checklist) => {
        if (checklist.id === checklistId) {
          return {
            ...checklist,
            status: "completed",
            lastCompleted: new Date().toLocaleString(),
          };
        }
        return checklist;
      }),
    );
    setSelectedChecklist(null);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "in-progress":
        return Clock;
      default:
        return ClipboardList;
    }
  };

  // Incident Report Form
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
            <h1 className="text-xl font-semibold">Incident Report</h1>
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
              <form className="space-y-6">
                {/* Basic Incident Information */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Incident Type *
                      </label>
                      <select className="w-full p-2 border rounded-lg">
                        <option value="">Select incident type</option>
                        <option>Vehicle Collision</option>
                        <option>Property Damage</option>
                        <option>Personal Injury</option>
                        <option>Near Miss</option>
                        <option>Equipment Damage</option>
                        <option>Theft/Vandalism</option>
                        <option>Environmental</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Severity Level *
                      </label>
                      <select className="w-full p-2 border rounded-lg">
                        <option value="">Select severity</option>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Date and Time *
                      </label>
                      <input
                        type="datetime-local"
                        className="w-full p-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Weather Conditions
                      </label>
                      <select className="w-full p-2 border rounded-lg">
                        <option value="">Select weather</option>
                        <option>Clear</option>
                        <option>Cloudy</option>
                        <option>Rainy</option>
                        <option>Foggy</option>
                        <option>Windy</option>
                        <option>Stormy</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Exact Location/Address *
                    </label>
                    <input
                      type="text"
                      placeholder="Street address, coordinates, or detailed location"
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Detailed Description *
                    </label>
                    <textarea
                      placeholder="Provide detailed description of what happened, include sequence of events..."
                      rows={4}
                      className="w-full p-2 border rounded-lg"
                      required
                    />
                  </div>
                </div>

                {/* Police and Emergency Services */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Police & Emergency Services
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Police Called?
                      </label>
                      <select className="w-full p-2 border rounded-lg">
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Police Case/Reference Number
                      </label>
                      <input
                        type="text"
                        placeholder="Enter police case number"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Attending Officer Name
                      </label>
                      <input
                        type="text"
                        placeholder="Officer's name"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Police Station/Badge Number
                      </label>
                      <input
                        type="text"
                        placeholder="Station name or badge number"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ambulance Called?
                      </label>
                      <select className="w-full p-2 border rounded-lg">
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Fire Service Called?
                      </label>
                      <select className="w-full p-2 border rounded-lg">
                        <option value="">Select</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Third Party Information */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Third Party Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Third Party Name
                      </label>
                      <input
                        type="text"
                        placeholder="Full name"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        placeholder="Phone number"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Third Party Address
                    </label>
                    <textarea
                      placeholder="Full address"
                      rows={2}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Driver's License Number
                      </label>
                      <input
                        type="text"
                        placeholder="License number"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Vehicle Registration
                      </label>
                      <input
                        type="text"
                        placeholder="Reg number"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Insurance Company
                      </label>
                      <input
                        type="text"
                        placeholder="Insurance provider"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Insurance Policy Number
                      </label>
                      <input
                        type="text"
                        placeholder="Policy number"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Third Party Statement
                    </label>
                    <textarea
                      placeholder="What did the third party say happened?"
                      rows={3}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>

                {/* People Involved */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    People Involved
                  </h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Injured Person(s) Details
                    </label>
                    <textarea
                      placeholder="Names, ages, nature of injuries, medical attention required"
                      rows={3}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Witness Information
                    </label>
                    <textarea
                      placeholder="Names, contact details, and brief statements of witnesses"
                      rows={3}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>

                {/* Damage and Actions */}
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Damage & Actions
                  </h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Vehicle/Equipment Damage
                    </label>
                    <textarea
                      placeholder="Detailed description of damage to company vehicle/equipment"
                      rows={3}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Third Party Damage
                    </label>
                    <textarea
                      placeholder="Description of damage to third party property/vehicle"
                      rows={3}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Immediate Actions Taken
                    </label>
                    <textarea
                      placeholder="What actions were taken immediately after the incident?"
                      rows={3}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    Additional Information
                  </h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Contributing Factors
                    </label>
                    <textarea
                      placeholder="Road conditions, visibility, fatigue, equipment failure, etc."
                      rows={3}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Vehicle Speed (km/h)
                      </label>
                      <input
                        type="number"
                        placeholder="Estimated speed"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Road Speed Limit (km/h)
                      </label>
                      <input
                        type="number"
                        placeholder="Posted speed limit"
                        className="w-full p-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Additional Comments/Investigation Notes
                    </label>
                    <textarea
                      placeholder="Any additional information that may help with investigation"
                      rows={4}
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
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

  // Checklist Detail View
  if (selectedChecklist) {
    const completedItems = selectedChecklist.items.filter(
      (item) => item.checked,
    ).length;
    const totalItems = selectedChecklist.items.length;
    const progress = (completedItems / totalItems) * 100;

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setSelectedChecklist(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">{selectedChecklist.title}</h1>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <FileText className="h-6 w-6" />
            </Button>
          </div>

          <div className="text-center mb-4">
            <div className="text-2xl font-bold">
              {completedItems}/{totalItems}
            </div>
            <div className="text-sm opacity-90">Items Completed</div>
            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
              <div
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {selectedChecklist.items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      item.checked
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-gray-200"
                    }`}
                    onClick={() =>
                      handleChecklistItemToggle(selectedChecklist.id, item.id)
                    }
                  >
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
                        item.checked
                          ? "bg-green-500 border-green-500 scale-105"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleChecklistItemToggle(
                          selectedChecklist.id,
                          item.id,
                        );
                      }}
                    >
                      {item.checked && (
                        <CheckCircle className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`${item.checked ? "text-green-800 line-through" : "text-gray-800"}`}
                      >
                        {item.item}
                      </p>
                      {item.required && (
                        <Badge className="bg-red-100 text-red-800 text-xs mt-1">
                          Required
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex space-x-4">
                <Button
                  onClick={() => handleCompleteChecklist(selectedChecklist.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={
                    completedItems <
                    selectedChecklist.items.filter((i) => i.required).length
                  }
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Checklist
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedChecklist(null)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main Safety Screen
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
          <h1 className="text-xl font-semibold">Health & Safety</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <Shield className="h-6 w-6" />
          </Button>
        </div>
        <p className="text-center text-white/90">
          Safety checklists and incident reporting
        </p>
      </div>

      {/* Safety Checklists */}
      <div className="p-4 space-y-4">
        {safetyChecklists.map((checklist) => {
          const IconComponent = checklist.icon;
          const StatusIcon = getStatusIcon(checklist.status);
          const completedItems = checklist.items.filter(
            (item) => item.checked,
          ).length;
          const totalItems = checklist.items.length;

          return (
            <Card
              key={checklist.id}
              className="bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedChecklist(checklist)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`${checklist.color} p-3 rounded-xl`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {checklist.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {checklist.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge
                      className={`${getStatusColor(checklist.status)} text-white mb-2`}
                    >
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {checklist.status}
                    </Badge>
                    <div className="text-sm text-gray-600">
                      {completedItems}/{totalItems}
                    </div>
                  </div>
                </div>

                {checklist.lastCompleted && (
                  <div className="text-xs text-gray-500">
                    Last completed: {checklist.lastCompleted}
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
                  Incident Report Form
                </h3>
                <p className="text-sm text-red-600">
                  Report injuries or other incidents
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
