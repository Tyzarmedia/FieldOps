import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Camera,
  Video,
  Upload,
  CheckCircle,
  AlertTriangle,
  X,
  Eye,
  Calendar,
  Clock,
  User,
  FileText,
  Brain,
  Image,
  Plus,
  Search,
  Filter,
  Download,
  MoreVertical,
  Scan,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import ToolboxInspection from "@/components/ToolboxInspection";
import type { Toolbox } from "@/components/ToolboxInspection";
import VehicleInspection from "@/components/VehicleInspection";
import type { VehicleInspectionData } from "@/components/VehicleInspection";

interface InspectionItem {
  id: string;
  name: string;
  category: string;
  status: "pass" | "fail" | "attention" | "not_checked";
  notes: string;
  photos: string[];
  required: boolean;
  imageUploaded: boolean;
  inspectionDate?: string;
}

interface Inspection {
  id: string;
  vehicleId: string;
  vehicleRegistration: string;
  type: string;
  status: "in_progress" | "completed" | "failed" | "scheduled";
  inspector: string;
  dateScheduled: string;
  dateCompleted?: string;
  items: InspectionItem[];
  overallScore: number;
  imagesUploaded: number;
  imagesRequired: number;
  aiAnalysis?: {
    detected: string[];
    confidence: number;
    recommendations: string[];
  };
}

export default function InspectionsScreen() {
  const [mainTab, setMainTab] = useState("vehicle");
  const [selectedTab, setSelectedTab] = useState("current");
  const [selectedToolTab, setSelectedToolTab] = useState("current");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedInspectionType, setSelectedInspectionType] = useState<
    "vehicle" | "tools" | ""
  >("");
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [selectedInspection, setSelectedInspection] =
    useState<Inspection | null>(null);
  const [showNewInspection, setShowNewInspection] = useState(false);
  const [currentInspection, setCurrentInspection] = useState<Inspection | null>(
    null,
  );
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Tool inspection states
  const [technicianTools, setTechnicianTools] = useState<any>(null);
  const [loadingTools, setLoadingTools] = useState(false);
  const [toolInspectionMode, setToolInspectionMode] = useState(false);

  // Collapsible section states
  const [expandedSections, setExpandedSections] = useState({
    weeklyInspections: true,
    vehicleHistory: false,
    missedVehicleInspections: false,
    toolboxInspections: true,
    toolboxHistory: false,
    overdueToolboxes: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Mock data
  const vehicles = [
    { id: "FL-001", registration: "EL-123-ABC" },
    { id: "FL-002", registration: "EL-124-DEF" },
    { id: "FL-003", registration: "EL-125-GHI" },
    { id: "FL-004", registration: "EL-126-JKL" },
  ];

  const technicians = [
    { id: "T001", name: "John Smith", department: "Maintenance" },
    { id: "T002", name: "Sarah Johnson", department: "Installation" },
    { id: "T003", name: "Mike Wilson", department: "Fiber Operations" },
    { id: "T004", name: "David Brown", department: "Maintenance" },
    { id: "T005", name: "Lisa Chen", department: "Installation" },
    { id: "T006", name: "Robert Garcia", department: "Field Operations" },
  ];

  const inspectionTypes = {
    vehicle: [
      "Pre-Trip Inspection",
      "Safety Inspection",
      "Maintenance Inspection",
      "Post-Repair Inspection",
      "Monthly Inspection",
      "Annual Inspection",
    ],
    tools: [
      "Daily Tool Check",
      "Weekly Toolbox Inspection",
      "Monthly Equipment Audit",
      "Tool Condition Assessment",
      "Safety Equipment Check",
    ],
  };

  const defaultChecklist: InspectionItem[] = [
    // External Inspection
    {
      id: "exterior_body",
      name: "Body Condition & Paint",
      category: "External",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "tires",
      name: "Tire Condition & Tread Depth",
      category: "External",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "tire_pressure",
      name: "Tire Pressure (All Wheels)",
      category: "External",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "lights_headlights",
      name: "Headlights & High Beams",
      category: "External",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "lights_indicators",
      name: "Turn Indicators & Hazard Lights",
      category: "External",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "lights_brake",
      name: "Brake Lights & Reverse Lights",
      category: "External",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "mirrors",
      name: "Side Mirrors & Rear View Mirror",
      category: "External",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "windshield_windows",
      name: "Windshield & All Windows",
      category: "External",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "wipers",
      name: "Windshield Wipers & Washers",
      category: "External",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "license_plate",
      name: "License Plate & Registration",
      category: "External",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    // Interior Inspection
    {
      id: "interior_cleanliness",
      name: "Interior Cleanliness & Condition",
      category: "Interior",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "seats_belts",
      name: "Seats & Seat Belts",
      category: "Interior",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "dashboard_instruments",
      name: "Dashboard & Instrument Panel",
      category: "Interior",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "air_conditioning",
      name: "Air Conditioning & Heating",
      category: "Interior",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "radio_electronics",
      name: "Radio & Electronic Systems",
      category: "Interior",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    // Mechanical Inspection
    {
      id: "engine_condition",
      name: "Engine Condition & Performance",
      category: "Mechanical",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "oil_level",
      name: "Engine Oil Level & Condition",
      category: "Mechanical",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "water_coolant",
      name: "Water/Coolant Level",
      category: "Mechanical",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "brake_system",
      name: "Brake System & Brake Fluid",
      category: "Mechanical",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "transmission",
      name: "Transmission & Clutch",
      category: "Mechanical",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "suspension_steering",
      name: "Suspension & Steering",
      category: "Mechanical",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    // Electrical Systems
    {
      id: "battery_terminals",
      name: "Battery & Terminals",
      category: "Electrical",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "alternator_charging",
      name: "Alternator & Charging System",
      category: "Electrical",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    // Safety Equipment
    {
      id: "safety_equipment",
      name: "Safety Equipment & Tools",
      category: "Safety",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "first_aid_kit",
      name: "First Aid Kit",
      category: "Safety",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "fire_extinguisher",
      name: "Fire Extinguisher",
      category: "Safety",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "emergency_triangle",
      name: "Emergency Triangle & Warning Signs",
      category: "Safety",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    // Service History & Documentation
    {
      id: "service_stamp",
      name: "Last Service Stamp & Documentation",
      category: "Documentation",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
    {
      id: "maintenance_schedule",
      name: "Maintenance Schedule Compliance",
      category: "Documentation",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
      imageUploaded: false,
    },
  ];

  const mockInspections: Inspection[] = [
    // Current Month Inspections (January 2025)
    {
      id: "INS-001",
      vehicleId: "FL-001",
      vehicleRegistration: "EL-123-ABC",
      type: "Bi-Weekly Vehicle Inspection",
      status: "completed",
      inspector: "John Smith",
      dateScheduled: "2025-01-15",
      dateCompleted: "2025-01-15",
      items: defaultChecklist.map((item, index) => ({
        ...item,
        status: "pass" as const,
        notes:
          item.name === "Tire Pressure" ? "All tires at optimal pressure" : "",
        imageUploaded: index < 8, // Most items have images uploaded
        photos:
          index < 8
            ? [
                `https://images.unsplash.com/photo-${1500000000 + index * 100}?w=500`,
              ]
            : [],
        inspectionDate: "2025-01-15",
      })),
      overallScore: 98,
      imagesUploaded: 8,
      imagesRequired: 10,
      aiAnalysis: {
        detected: [
          "Good tire condition",
          "All lights functional",
          "Brake pads in good condition",
        ],
        confidence: 94,
        recommendations: [
          "Monitor brake pad wear in next 1000km",
          "Check tire pressure weekly",
        ],
      },
    } as VehicleInspectionData,
    {
      id: "INS-002",
      vehicleId: "FL-002",
      vehicleRegistration: "EL-124-DEF",
      type: "Bi-Weekly Vehicle Inspection",
      status: "completed",
      inspector: "Sarah Johnson",
      dateScheduled: "2025-01-14",
      dateCompleted: "2025-01-14",
      items: defaultChecklist.map((item, index) => ({
        ...item,
        status: "pass" as const,
        notes: item.name === "Brake System" ? "Excellent condition" : "",
        imageUploaded: true, // All images uploaded
        photos: [
          `https://images.unsplash.com/photo-${1500000000 + index * 50}?w=500`,
        ],
        inspectionDate: "2025-01-14",
      })),
      overallScore: 95,
      imagesUploaded: 10,
      imagesRequired: 10,
    } as VehicleInspectionData,
    {
      id: "INS-003",
      vehicleId: "FL-003",
      vehicleRegistration: "EL-125-GHI",
      type: "Bi-Weekly Vehicle Inspection",
      status: "completed",
      inspector: "Mike Wilson",
      dateScheduled: "2025-01-13",
      dateCompleted: "2025-01-13",
      items: defaultChecklist.map((item, index) => ({
        ...item,
        status: index < 1 ? ("attention_required" as const) : ("pass" as const),
        notes: index < 1 ? "Minor issue identified, schedule maintenance" : "",
      })),
      overallScore: 88,
    },
    {
      id: "INS-004",
      vehicleId: "FL-004",
      vehicleRegistration: "EL-126-JKL",
      type: "Bi-Weekly Vehicle Inspection",
      status: "completed",
      inspector: "David Brown",
      dateScheduled: "2025-01-12",
      dateCompleted: "2025-01-12",
      items: defaultChecklist.map((item) => ({
        ...item,
        status: "pass" as const,
      })),
      overallScore: 92,
    },
    // Historical Inspections (December 2024)
    {
      id: "INS-H001",
      vehicleId: "FL-001",
      vehicleRegistration: "EL-123-ABC",
      type: "Bi-Weekly Vehicle Inspection",
      status: "completed",
      inspector: "John Smith",
      dateScheduled: "2024-12-31",
      dateCompleted: "2024-12-31",
      items: defaultChecklist.map((item) => ({
        ...item,
        status: "pass" as const,
      })),
      overallScore: 96,
    },
    {
      id: "INS-H002",
      vehicleId: "FL-002",
      vehicleRegistration: "EL-124-DEF",
      type: "Bi-Weekly Vehicle Inspection",
      status: "completed",
      inspector: "Sarah Johnson",
      dateScheduled: "2024-12-17",
      dateCompleted: "2024-12-17",
      items: defaultChecklist.map((item) => ({
        ...item,
        status: "pass" as const,
      })),
      overallScore: 93,
    },
    {
      id: "INS-H003",
      vehicleId: "FL-003",
      vehicleRegistration: "EL-125-GHI",
      type: "Bi-Weekly Vehicle Inspection",
      status: "completed",
      inspector: "Mike Wilson",
      dateScheduled: "2024-11-30",
      dateCompleted: "2024-11-30",
      items: defaultChecklist.map((item) => ({
        ...item,
        status: "pass" as const,
      })),
      overallScore: 90,
    },
  ];

  const [inspections, setInspections] = useState(mockInspections);

  // Fetch tools assigned to technician
  const fetchTechnicianTools = async (technicianId: string) => {
    setLoadingTools(true);
    try {
      const response = await fetch(`/api/stock-management/tools/technician/${technicianId}`);
      const data = await response.json();
      if (data.success) {
        setTechnicianTools(data.data);
      } else {
        console.error('Failed to fetch technician tools:', data.error);
      }
    } catch (error) {
      console.error('Error fetching technician tools:', error);
    } finally {
      setLoadingTools(false);
    }
  };

  // Handle tool inspection update
  const handleToolInspection = async (toolId: string, inspectionData: any) => {
    try {
      const response = await fetch(`/api/stock-management/tools/${toolId}/inspect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...inspectionData,
          technicianId: selectedTechnician,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Refresh technician tools data
        if (selectedTechnician) {
          await fetchTechnicianTools(selectedTechnician);
        }
        alert('Tool inspection updated successfully!');
      } else {
        alert('Failed to update tool inspection: ' + data.error);
      }
    } catch (error) {
      console.error('Error updating tool inspection:', error);
      alert('Error updating tool inspection');
    }
  };

  // Start tool inspection mode
  const startToolInspection = () => {
    if (!selectedTechnician) {
      alert('Please select a technician first');
      return;
    }

    fetchTechnicianTools(selectedTechnician);
    setToolInspectionMode(true);
    setShowNewInspection(false);
    setSelectedTab("current");
  };

  const startNewInspection = () => {
    if (!selectedVehicle) return;

    const vehicle = vehicles.find((v) => v.id === selectedVehicle);
    const newInspection: Inspection = {
      id: `INS-${Date.now()}`,
      vehicleId: selectedVehicle,
      vehicleRegistration: vehicle?.registration || "",
      type: "Comprehensive Vehicle Inspection",
      status: "in_progress",
      inspector: "Current User",
      dateScheduled: new Date().toISOString().split("T")[0],
      items: defaultChecklist.map((item) => ({ ...item })),
      overallScore: 0,
      imagesUploaded: 0,
      imagesRequired: defaultChecklist.filter(item => item.required).length,
    };

    setCurrentInspection(newInspection);
    setShowNewInspection(false);
    setSelectedTab("current");
  };

  const updateInspectionItem = (
    itemId: string,
    updates: Partial<InspectionItem>,
  ) => {
    if (!currentInspection) return;

    const updatedItems = currentInspection.items.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item,
    );

    setCurrentInspection({
      ...currentInspection,
      items: updatedItems,
      overallScore: calculateScore(updatedItems),
    });
  };

  const calculateScore = (items: InspectionItem[]): number => {
    const checkedItems = items.filter((item) => item.status !== "not_checked");
    if (checkedItems.length === 0) return 0;

    const passedItems = checkedItems.filter((item) => item.status === "pass");
    return Math.round((passedItems.length / checkedItems.length) * 100);
  };

  const handlePhotoUpload = async (itemId: string, files: FileList) => {
    setUploadingMedia(true);

    // Simulate upload and AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newPhotos = Array.from(files).map((file) =>
      URL.createObjectURL(file),
    );
    updateInspectionItem(itemId, {
      photos: [
        ...(currentInspection?.items.find((i) => i.id === itemId)?.photos ||
          []),
        ...newPhotos,
      ],
    });

    // Simulate AI analysis
    if (itemId === "tires") {
      setAiAnalyzing(true);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock AI detection
      const aiResults = {
        detected: [
          "Tire wear detected",
          "Tread depth: 4mm",
          "No sidewall damage",
        ],
        confidence: 87,
        recommendations: ["Monitor tire wear", "Replace within 2000km"],
      };

      if (currentInspection) {
        setCurrentInspection({
          ...currentInspection,
          aiAnalysis: aiResults,
        });
      }
      setAiAnalyzing(false);
    }

    setUploadingMedia(false);
  };

  const completeInspection = () => {
    if (!currentInspection) return;

    const completedInspection = {
      ...currentInspection,
      status: "completed" as const,
      dateCompleted: new Date().toISOString().split("T")[0],
    };

    setInspections((prev) => [...prev, completedInspection]);
    setCurrentInspection(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case "pass":
        return "text-green-600";
      case "fail":
        return "text-red-600";
      case "attention":
        return "text-yellow-600";
      case "not_checked":
        return "text-gray-400";
      default:
        return "text-gray-400";
    }
  };

  const getItemStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5" />;
      case "fail":
        return <X className="h-5 w-5" />;
      case "attention":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <div className="h-5 w-5 border-2 border-gray-300 rounded" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inspection</h1>
          <p className="text-muted-foreground">
            Digital inspection checklists with AI-powered analysis for vehicles
            and tools
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showNewInspection} onOpenChange={setShowNewInspection}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Inspection
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Start New Inspection</DialogTitle>
                <DialogDescription>
                  Select inspection type, technician, and details to begin a new
                  inspection
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="inspection-category">Inspection Type</Label>
                  <Select
                    value={selectedInspectionType}
                    onValueChange={(value: "vehicle" | "tools") =>
                      setSelectedInspectionType(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select inspection type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vehicle">
                        Vehicle Inspection
                      </SelectItem>
                      <SelectItem value="tools">Tools Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="technician">Technician</Label>
                  <Select
                    value={selectedTechnician}
                    onValueChange={setSelectedTechnician}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select technician" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicians.map((technician) => (
                        <SelectItem key={technician.id} value={technician.id}>
                          {technician.name} - {technician.department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedInspectionType === "vehicle" && (
                  <div>
                    <Label htmlFor="vehicle">Vehicle</Label>
                    <Select
                      value={selectedVehicle}
                      onValueChange={setSelectedVehicle}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a vehicle" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.registration} ({vehicle.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}


                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowNewInspection(false);
                      setSelectedInspectionType("");
                      setSelectedTechnician("");
                      setSelectedVehicle("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={startNewInspection}
                    disabled={
                      !selectedInspectionType ||
                      !selectedTechnician ||
                      (selectedInspectionType === "vehicle" && !selectedVehicle)
                    }
                  >
                    Start Inspection
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vehicle">Vehicle Inspections</TabsTrigger>
          <TabsTrigger value="tool">Tool Inspection</TabsTrigger>
        </TabsList>

        <TabsContent value="vehicle" className="space-y-6">
          {/* Vehicle Inspections Sub-tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current">Current Inspections</TabsTrigger>
              <TabsTrigger value="history">History Inspections</TabsTrigger>
              <TabsTrigger value="missed">Missed Inspections</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-6">
              {currentInspection ? (
                <>
                  {/* Current Inspection Header */}
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle>
                            {currentInspection.type} -{" "}
                            {currentInspection.vehicleRegistration}
                          </CardTitle>
                          <p className="text-muted-foreground">
                            Started by {currentInspection.inspector} on{" "}
                            {currentInspection.dateScheduled}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {currentInspection.overallScore}%
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Overall Score
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* AI Analysis */}
                  {(currentInspection.aiAnalysis || aiAnalyzing) && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-blue-600" />
                          AI Analysis
                          {aiAnalyzing && (
                            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {aiAnalyzing ? (
                          <p className="text-muted-foreground">
                            Analyzing uploaded images...
                          </p>
                        ) : (
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">
                                Detected Issues:
                              </h4>
                              <ul className="space-y-1">
                                {currentInspection.aiAnalysis?.detected.map(
                                  (item, index) => (
                                    <li
                                      key={index}
                                      className="text-sm flex items-center gap-2"
                                    >
                                      <Scan className="h-4 w-4 text-blue-600" />
                                      {item}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-medium mb-2">
                                Recommendations:
                              </h4>
                              <ul className="space-y-1">
                                {currentInspection.aiAnalysis?.recommendations.map(
                                  (item, index) => (
                                    <li
                                      key={index}
                                      className="text-sm flex items-center gap-2"
                                    >
                                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                      {item}
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">
                              {currentInspection.aiAnalysis?.confidence}%
                              confidence
                            </Badge>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Inspection Checklist */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Inspection Checklist</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {["External", "Interior", "Mechanical", "Electrical", "Safety", "Documentation"].map(
                          (category) => (
                            <div key={category}>
                              <h3 className="font-semibold mb-4">{category}</h3>
                              <div className="space-y-4">
                                {currentInspection.items
                                  .filter((item) => item.category === category)
                                  .map((item) => (
                                    <div
                                      key={item.id}
                                      className="border rounded-lg p-4"
                                    >
                                      <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                          <div
                                            className={getItemStatusColor(
                                              item.status,
                                            )}
                                          >
                                            {getItemStatusIcon(item.status)}
                                          </div>
                                          <div>
                                            <h4 className="font-medium">
                                              {item.name}
                                            </h4>
                                            {item.required && (
                                              <Badge
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                Required
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                          <Button
                                            size="sm"
                                            variant={
                                              item.status === "pass"
                                                ? "default"
                                                : "outline"
                                            }
                                            onClick={() =>
                                              updateInspectionItem(item.id, {
                                                status: "pass",
                                              })
                                            }
                                          >
                                            Pass
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant={
                                              item.status === "attention"
                                                ? "default"
                                                : "outline"
                                            }
                                            onClick={() =>
                                              updateInspectionItem(item.id, {
                                                status: "attention",
                                              })
                                            }
                                          >
                                            Attention
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant={
                                              item.status === "fail"
                                                ? "destructive"
                                                : "outline"
                                            }
                                            onClick={() =>
                                              updateInspectionItem(item.id, {
                                                status: "fail",
                                              })
                                            }
                                          >
                                            Fail
                                          </Button>
                                        </div>
                                      </div>

                                      {/* Notes */}
                                      <Textarea
                                        placeholder="Add notes..."
                                        value={item.notes}
                                        onChange={(e) =>
                                          updateInspectionItem(item.id, {
                                            notes: e.target.value,
                                          })
                                        }
                                        className="mb-3"
                                      />

                                      {/* Photo/Video Upload */}
                                      <div className="flex items-center space-x-2 mb-3">
                                        <input
                                          ref={fileInputRef}
                                          type="file"
                                          accept="image/*"
                                          multiple
                                          className="hidden"
                                          onChange={(e) =>
                                            e.target.files &&
                                            handlePhotoUpload(
                                              item.id,
                                              e.target.files,
                                            )
                                          }
                                        />
                                        <input
                                          ref={videoInputRef}
                                          type="file"
                                          accept="video/*"
                                          className="hidden"
                                          onChange={(e) =>
                                            e.target.files &&
                                            handlePhotoUpload(
                                              item.id,
                                              e.target.files,
                                            )
                                          }
                                        />
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            fileInputRef.current?.click()
                                          }
                                          disabled={uploadingMedia}
                                        >
                                          <Camera className="h-4 w-4 mr-2" />
                                          {uploadingMedia
                                            ? "Uploading..."
                                            : "Photo"}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() =>
                                            videoInputRef.current?.click()
                                          }
                                          disabled={uploadingMedia}
                                        >
                                          <Video className="h-4 w-4 mr-2" />
                                          Video
                                        </Button>
                                      </div>

                                      {/* Photo Gallery */}
                                      {item.photos.length > 0 && (
                                        <div className="flex space-x-2">
                                          {item.photos.map((photo, index) => (
                                            <img
                                              key={index}
                                              src={photo}
                                              alt={`${item.name} photo ${index + 1}`}
                                              className="h-16 w-16 object-cover rounded border"
                                            />
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ),
                        )}
                      </div>

                      <div className="mt-6 flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentInspection(null)}
                        >
                          Save Draft
                        </Button>
                        <Button onClick={completeInspection}>
                          Complete Inspection
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No Active Inspection
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start a new inspection to begin the digital checklist
                      process
                    </p>
                    <Button onClick={() => setShowNewInspection(true)}>
                      Start New Inspection
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleSection("vehicleHistory")}
                  >
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        Vehicle Inspection History
                        {expandedSections.vehicleHistory ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        All vehicle inspections from previous month to 3 years
                        back
                      </p>
                    </div>
                  </div>
                </CardHeader>
                {expandedSections.vehicleHistory && (
                  <CardContent>
                    <div className="space-y-4">
                      {/* Enhanced Filter and Search */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input
                            placeholder="Search by technician name..."
                            className="pl-10"
                          />
                        </div>
                        <Input type="date" placeholder="Select date" />
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="01">January</SelectItem>
                            <SelectItem value="02">February</SelectItem>
                            <SelectItem value="03">March</SelectItem>
                            <SelectItem value="04">April</SelectItem>
                            <SelectItem value="05">May</SelectItem>
                            <SelectItem value="06">June</SelectItem>
                            <SelectItem value="07">July</SelectItem>
                            <SelectItem value="08">August</SelectItem>
                            <SelectItem value="09">September</SelectItem>
                            <SelectItem value="10">October</SelectItem>
                            <SelectItem value="11">November</SelectItem>
                            <SelectItem value="12">December</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2024">2024</SelectItem>
                            <SelectItem value="2023">2023</SelectItem>
                            <SelectItem value="2022">2022</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Vehicles</SelectItem>
                            {vehicles.map((vehicle) => (
                              <SelectItem key={vehicle.id} value={vehicle.id}>
                                {vehicle.registration}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Inspection History List */}
              <div className="space-y-4">
                {inspections.map((inspection) => (
                  <VehicleInspection
                    key={inspection.id}
                    inspection={inspection as VehicleInspectionData}
                    showImageUploadStatus={true}
                    onViewDetails={(inspection) =>
                      setSelectedInspection(inspection)
                    }
                    onReportIssues={(inspection) =>
                      console.log("Report vehicle issues:", inspection)
                    }
                    onExportReport={(inspection) =>
                      console.log("Export vehicle report:", inspection)
                    }
                    onContinueInspection={(inspection) =>
                      console.log("Continue vehicle inspection:", inspection)
                    }
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="missed" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Missed Vehicle Inspections</CardTitle>
                  <p className="text-muted-foreground">
                    Vehicle inspections that are overdue or missed
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Warning:</strong> 4 vehicle inspections are
                        overdue and require immediate attention
                      </AlertDescription>
                    </Alert>

                    {/* Enhanced Filter and Search for Missed */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Search by technician name..."
                          className="pl-10"
                        />
                      </div>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Vehicle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Vehicles</SelectItem>
                          {vehicles.map((vehicle) => (
                            <SelectItem key={vehicle.id} value={vehicle.id}>
                              {vehicle.registration}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Overdue Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1week">1 Week Overdue</SelectItem>
                          <SelectItem value="2weeks">
                            2 Weeks Overdue
                          </SelectItem>
                          <SelectItem value="1month">
                            1 Month Overdue
                          </SelectItem>
                          <SelectItem value="all">All Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Print Report
                      </Button>
                    </div>

                    {/* Missed Vehicle Inspection List */}
                    <div className="space-y-4">
                      {[
                        {
                          id: "VI-M001",
                          inspector: "David Brown",
                          vehicleRegistration: "EL-127-MNO",
                          type: "Safety Inspection",
                          dueDate: "2025-01-01",
                          daysPastDue: 15,
                          status: "Overdue",
                        },
                        {
                          id: "VI-M002",
                          inspector: "Lisa Davis",
                          vehicleRegistration: "EL-128-PQR",
                          type: "Monthly Inspection",
                          dueDate: "2024-12-28",
                          daysPastDue: 18,
                          status: "Critical",
                        },
                        {
                          id: "VI-M003",
                          inspector: "Robert Lee",
                          vehicleRegistration: "EL-129-STU",
                          type: "Pre-Trip Inspection",
                          dueDate: "2024-12-20",
                          daysPastDue: 26,
                          status: "Critical",
                        },
                        {
                          id: "VI-M004",
                          inspector: "Emily Johnson",
                          vehicleRegistration: "EL-130-VWX",
                          type: "Maintenance Inspection",
                          dueDate: "2024-12-15",
                          daysPastDue: 31,
                          status: "Critical",
                        },
                      ].map((inspection) => (
                        <Card key={inspection.id} className="border-red-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-4">
                                  <div>
                                    <h4 className="font-medium">
                                      {inspection.type}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                      {inspection.vehicleRegistration}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">
                                      Assigned: {inspection.inspector}
                                    </p>
                                    <p className="text-sm text-red-600">
                                      Due:{" "}
                                      {new Date(
                                        inspection.dueDate,
                                      ).toLocaleDateString()}{" "}
                                      ({inspection.daysPastDue} days overdue)
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <Badge variant="destructive">
                                  {inspection.status}
                                </Badge>
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <MoreVertical className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuItem>
                                      <User className="h-4 w-4 mr-2" />
                                      Reassign Inspector
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Calendar className="h-4 w-4 mr-2" />
                                      Reschedule
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Download className="h-4 w-4 mr-2" />
                                      Send Reminder
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="tool" className="space-y-6">
          {/* Tool Inspections Sub-tabs */}
          <Tabs value={selectedToolTab} onValueChange={setSelectedToolTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current">Current Inspections</TabsTrigger>
              <TabsTrigger value="history">History Inspections</TabsTrigger>
              <TabsTrigger value="missed">Missed Inspections</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection("toolboxInspections")}
                    >
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Toolbox Inspections by Technician
                          {expandedSections.toolboxInspections ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </CardTitle>
                        <p className="text-muted-foreground">
                          Each technician's toolbox with all assigned tools -
                          organized for fleet manager visibility
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  {expandedSections.toolboxInspections && (
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                  8
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Toolboxes Inspected
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-600">
                                  3
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Missing Tools
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                  2
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Damaged Tools
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4">
                              <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                  47
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Total Tools
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Enhanced Filter and Search */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              placeholder="Search technician..."
                              className="pl-10"
                            />
                          </div>
                          <Input type="date" placeholder="Select date" />
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                All Departments
                              </SelectItem>
                              <SelectItem value="maintenance">
                                Maintenance
                              </SelectItem>
                              <SelectItem value="installation">
                                Installation
                              </SelectItem>
                              <SelectItem value="fiber-ops">
                                Fiber Operations
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Toolbox Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="complete">
                                Complete Toolbox
                              </SelectItem>
                              <SelectItem value="missing">
                                Missing Tools
                              </SelectItem>
                              <SelectItem value="damaged">
                                Damaged Tools
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Warehouse" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="WH-001">WH-001</SelectItem>
                              <SelectItem value="WH-002">WH-002</SelectItem>
                              <SelectItem value="WH-003">WH-003</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export Report
                          </Button>
                        </div>

                        {/* Toolbox Inspections - Organized by Technician */}
                        <div className="space-y-6">
                          {[
                            {
                              technicianId: "T001",
                              technicianName: "John Smith",
                              department: "Maintenance",
                              inspectionDate: "2025-01-15",
                              totalTools: 8,
                              goodCondition: 7,
                              damaged: 1,
                              missing: 0,
                              overallScore: 88,
                              imagesUploaded: 5,
                              imagesRequired: 8,
                              tools: [
                                {
                                  id: "PD-2025-001",
                                  name: "Power Drill",
                                  condition: "Good",
                                  status: "Present",
                                  imageUploaded: true,
                                  imageUrl:
                                    "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500",
                                  inspectionDate: "2025-01-15",
                                },
                                {
                                  id: "MM-2025-005",
                                  name: "Multimeter",
                                  condition: "Good",
                                  status: "Present",
                                  imageUploaded: true,
                                  imageUrl:
                                    "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=500",
                                  inspectionDate: "2025-01-15",
                                },
                                {
                                  id: "CT-2025-012",
                                  name: "Cable Tester",
                                  condition: "Damaged",
                                  status: "Present",
                                  imageUploaded: true,
                                  imageUrl:
                                    "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=500",
                                  inspectionDate: "2025-01-15",
                                  notes: "Housing cracked, needs replacement",
                                },
                                {
                                  id: "VT-2025-008",
                                  name: "Voltage Tester",
                                  condition: "Good",
                                  status: "Present",
                                  imageUploaded: false,
                                  inspectionDate: "2025-01-15",
                                },
                                {
                                  id: "WS-2025-015",
                                  name: "Wire Stripper",
                                  condition: "Good",
                                  status: "Present",
                                  imageUploaded: false,
                                  inspectionDate: "2025-01-15",
                                },
                                {
                                  id: "SC-2025-022",
                                  name: "Safety Cones (4x)",
                                  condition: "Good",
                                  status: "Present",
                                  imageUploaded: true,
                                  imageUrl:
                                    "https://images.unsplash.com/photo-1585009508209-ade1f555ea39?w=500",
                                  inspectionDate: "2025-01-15",
                                },
                                {
                                  id: "TL-2025-029",
                                  name: "Tool Ladder",
                                  condition: "Good",
                                  status: "Present",
                                  imageUploaded: true,
                                  imageUrl:
                                    "https://images.unsplash.com/photo-1616328009943-4fa93ff1bc31?w=500",
                                  inspectionDate: "2025-01-15",
                                },
                                {
                                  id: "FK-2025-036",
                                  name: "First Aid Kit",
                                  condition: "Good",
                                  status: "Present",
                                  imageUploaded: false,
                                  inspectionDate: "2025-01-15",
                                },
                              ],
                            } as Toolbox,
                            {
                              technicianId: "T002",
                              technicianName: "Sarah Johnson",
                              department: "Installation",
                              inspectionDate: "2025-01-14",
                              totalTools: 6,
                              goodCondition: 5,
                              damaged: 0,
                              missing: 1,
                              overallScore: 83,
                              imagesUploaded: 6,
                              imagesRequired: 6,
                              tools: [
                                {
                                  id: "FS-2025-043",
                                  name: "Fiber Splicer",
                                  condition: "Good",
                                  status: "Present",
                                  imageUploaded: true,
                                  imageUrl:
                                    "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=500",
                                  inspectionDate: "2025-01-14",
                                },
                                {
                                  id: "OT-2025-050",
                                  name: "OTDR",
                                  condition: "Good",
                                  status: "Present",
                                  imageUploaded: true,
                                  imageUrl:
                                    "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=500",
                                  inspectionDate: "2025-01-14",
                                },
                                {
                                  id: "CP-2025-057",
                                  name: "Cleaver & Polish Kit",
                                  condition: "Good",
                                  status: "Present",
                                  imageUploaded: true,
                                  imageUrl:
                                    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=500",
                                  inspectionDate: "2025-01-14",
                                },
                                {
                                  id: "FT-2025-064",
                                  name: "Fusion Tester",
                                  condition: "Good",
                                  status: "Present",
                                  imageUploaded: true,
                                  imageUrl:
                                    "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=500",
                                  inspectionDate: "2025-01-14",
                                },
                                {
                                  id: "SF-2025-071",
                                  name: "Safety Glasses",
                                  condition: "Good",
                                  status: "Present",
                                  imageUploaded: true,
                                  imageUrl:
                                    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500",
                                  inspectionDate: "2025-01-14",
                                },
                                {
                                  id: "TM-2025-078",
                                  name: "Tape Measure",
                                  condition: "Good",
                                  status: "Missing",
                                  imageUploaded: true,
                                  imageUrl:
                                    "https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?w=500",
                                  inspectionDate: "2025-01-14",
                                  notes: "Last seen in truck compartment B",
                                },
                              ],
                            } as Toolbox,
                            {
                              technicianId: "T003",
                              technicianName: "Mike Wilson",
                              department: "Fiber Operations",
                              inspectionDate: "2025-01-13",
                              totalTools: 10,
                              goodCondition: 8,
                              damaged: 1,
                              missing: 1,
                              overallScore: 80,
                              tools: [
                                {
                                  id: "FC-2025-085",
                                  name: "Fiber Cleaver",
                                  condition: "Good",
                                  status: "Present",
                                },
                                {
                                  id: "LS-2025-092",
                                  name: "Light Source",
                                  condition: "Good",
                                  status: "Present",
                                },
                                {
                                  id: "PM-2025-099",
                                  name: "Power Meter",
                                  condition: "Good",
                                  status: "Present",
                                },
                                {
                                  id: "VF-2025-106",
                                  name: "Visual Fault Locator",
                                  condition: "Damaged",
                                  status: "Present",
                                },
                                {
                                  id: "CT-2025-113",
                                  name: "Connector Toolkit",
                                  condition: "Good",
                                  status: "Present",
                                },
                                {
                                  id: "SP-2025-120",
                                  name: "Splice Protectors",
                                  condition: "Good",
                                  status: "Present",
                                },
                                {
                                  id: "FB-2025-127",
                                  name: "Fiber Buffer",
                                  condition: "Good",
                                  status: "Present",
                                },
                                {
                                  id: "AL-2025-134",
                                  name: "Alignment Tool",
                                  condition: "Good",
                                  status: "Present",
                                },
                                {
                                  id: "MC-2025-141",
                                  name: "Mechanical Cleaver",
                                  condition: "Good",
                                  status: "Present",
                                },
                                {
                                  id: "FL-2025-148",
                                  name: "Flashlight",
                                  condition: "Good",
                                  status: "Missing",
                                },
                              ],
                            },
                            {
                              technicianId: "T004",
                              technicianName: "David Brown",
                              department: "Maintenance",
                              inspectionDate: "2025-01-12",
                              totalTools: 7,
                              goodCondition: 7,
                              damaged: 0,
                              missing: 0,
                              overallScore: 100,
                              tools: [
                                {
                                  id: "ID-2025-155",
                                  name: "Impact Driver",
                                  condition: "Good",
                                  status: "Present",
                                },
                                {
                                  id: "TW-2025-162",
                                  name: "Torque Wrench",
                                  condition: "Good",
                                  status: "Present",
                                },
                                {
                                  id: "SB-2025-169",
                                  name: "Socket Set",
                                  condition: "Good",
                                  status: "Present",
                                },
                                {
                                  id: "RL-2025-176",
                                  name: "Ratchet & Extension",
                                  condition: "Good",
                                  status: "Present",
                                },
                                {
                                  id: "PL-2025-183",
                                  name: "Pliers Set",
                                  condition: "Good",
                                  status: "Present",
                                },
                                {
                                  id: "SW-2025-190",
                                  name: "Screwdriver Set",
                                  condition: "Good",
                                  status: "Present",
                                },
                                {
                                  id: "TB-2025-197",
                                  name: "Tool Bag",
                                  condition: "Good",
                                  status: "Present",
                                },
                              ],
                            },
                          ].map((toolbox) => (
                            <ToolboxInspection
                              key={toolbox.technicianId}
                              toolbox={toolbox}
                              showImageUploadStatus={true}
                              onViewDetails={(toolbox) =>
                                console.log("View toolbox details:", toolbox)
                              }
                              onReportIssues={(toolbox) =>
                                console.log("Report toolbox issues:", toolbox)
                              }
                              onReassignTools={(toolbox) =>
                                console.log("Reassign tools:", toolbox)
                              }
                              onExportReport={(toolbox) =>
                                console.log("Export toolbox report:", toolbox)
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection("toolboxHistory")}
                    >
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Toolbox Inspection History
                          {expandedSections.toolboxHistory ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </CardTitle>
                        <p className="text-muted-foreground">
                          Historical toolbox inspections by technician from
                          previous months
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  {expandedSections.toolboxHistory && (
                    <CardContent>
                      <div className="space-y-4">
                        {/* Enhanced Filter and Search for History */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              placeholder="Search technician..."
                              className="pl-10"
                            />
                          </div>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Technician" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                All Technicians
                              </SelectItem>
                              <SelectItem value="john-smith">
                                John Smith
                              </SelectItem>
                              <SelectItem value="sarah-johnson">
                                Sarah Johnson
                              </SelectItem>
                              <SelectItem value="mike-wilson">
                                Mike Wilson
                              </SelectItem>
                              <SelectItem value="david-brown">
                                David Brown
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2024">2024</SelectItem>
                              <SelectItem value="2023">2023</SelectItem>
                              <SelectItem value="2022">2022</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="01">January</SelectItem>
                              <SelectItem value="02">February</SelectItem>
                              <SelectItem value="03">March</SelectItem>
                              <SelectItem value="04">April</SelectItem>
                              <SelectItem value="05">May</SelectItem>
                              <SelectItem value="06">June</SelectItem>
                              <SelectItem value="07">July</SelectItem>
                              <SelectItem value="08">August</SelectItem>
                              <SelectItem value="09">September</SelectItem>
                              <SelectItem value="10">October</SelectItem>
                              <SelectItem value="11">November</SelectItem>
                              <SelectItem value="12">December</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                All Departments
                              </SelectItem>
                              <SelectItem value="maintenance">
                                Maintenance
                              </SelectItem>
                              <SelectItem value="installation">
                                Installation
                              </SelectItem>
                              <SelectItem value="fiber-ops">
                                Fiber Operations
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Export History
                          </Button>
                        </div>

                        {/* Historical Toolbox Inspections */}
                        <div className="space-y-4">
                          {[
                            {
                              id: "TBH-001",
                              technicianName: "John Smith",
                              department: "Maintenance",
                              inspectionDate: "2024-12-15",
                              totalTools: 8,
                              goodCondition: 8,
                              damaged: 0,
                              missing: 0,
                              overallScore: 100,
                              status: "Complete",
                            },
                            {
                              id: "TBH-002",
                              technicianName: "Sarah Johnson",
                              department: "Installation",
                              inspectionDate: "2024-11-28",
                              totalTools: 6,
                              goodCondition: 6,
                              damaged: 0,
                              missing: 0,
                              overallScore: 100,
                              status: "Complete",
                            },
                            {
                              id: "TBH-003",
                              technicianName: "Mike Wilson",
                              department: "Fiber Operations",
                              inspectionDate: "2024-10-22",
                              totalTools: 10,
                              goodCondition: 9,
                              damaged: 1,
                              missing: 0,
                              overallScore: 90,
                              status: "Issues Noted",
                            },
                            {
                              id: "TBH-004",
                              technicianName: "David Brown",
                              department: "Maintenance",
                              inspectionDate: "2024-09-30",
                              totalTools: 7,
                              goodCondition: 6,
                              damaged: 0,
                              missing: 1,
                              overallScore: 86,
                              status: "Missing Tools",
                            },
                          ].map((inspection) => (
                            <Card key={inspection.id}>
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-6">
                                      <div>
                                        <h4 className="font-medium">
                                          {inspection.technicianName}'s Toolbox
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {inspection.department} •{" "}
                                          {new Date(
                                            inspection.inspectionDate,
                                          ).toLocaleDateString()}
                                        </p>
                                      </div>
                                      <div className="grid grid-cols-4 gap-4 text-sm">
                                        <div className="text-center">
                                          <div className="font-semibold text-blue-600">
                                            {inspection.totalTools}
                                          </div>
                                          <p className="text-xs text-muted-foreground">
                                            Total
                                          </p>
                                        </div>
                                        <div className="text-center">
                                          <div className="font-semibold text-green-600">
                                            {inspection.goodCondition}
                                          </div>
                                          <p className="text-xs text-muted-foreground">
                                            Good
                                          </p>
                                        </div>
                                        <div className="text-center">
                                          <div className="font-semibold text-red-600">
                                            {inspection.damaged}
                                          </div>
                                          <p className="text-xs text-muted-foreground">
                                            Damaged
                                          </p>
                                        </div>
                                        <div className="text-center">
                                          <div className="font-semibold text-yellow-600">
                                            {inspection.missing}
                                          </div>
                                          <p className="text-xs text-muted-foreground">
                                            Missing
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <div className="text-right">
                                      <div className="text-lg font-bold">
                                        {inspection.overallScore}%
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        Score
                                      </p>
                                    </div>
                                    <Badge
                                      variant={
                                        inspection.status === "Complete"
                                          ? "default"
                                          : inspection.status === "Issues Noted"
                                            ? "secondary"
                                            : "destructive"
                                      }
                                    >
                                      {inspection.status}
                                    </Badge>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem>
                                          <Eye className="h-4 w-4 mr-2" />
                                          View Full Toolbox
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Download className="h-4 w-4 mr-2" />
                                          Export Report
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="missed" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleSection("overdueToolboxes")}
                    >
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Overdue Toolbox Inspections & Missing Tools
                          {expandedSections.overdueToolboxes ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </CardTitle>
                        <p className="text-muted-foreground">
                          Technician toolboxes with overdue inspections or
                          missing/damaged tools requiring immediate attention
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  {expandedSections.overdueToolboxes && (
                    <CardContent>
                      <div className="space-y-4">
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Critical:</strong> 3 technician toolboxes
                            have missing/damaged tools and 2 have overdue
                            inspections
                          </AlertDescription>
                        </Alert>

                        {/* Enhanced Filter and Search for Missed */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              placeholder="Search technician..."
                              className="pl-10"
                            />
                          </div>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Issue Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Issues</SelectItem>
                              <SelectItem value="overdue">
                                Overdue Inspection
                              </SelectItem>
                              <SelectItem value="missing">
                                Missing Tools
                              </SelectItem>
                              <SelectItem value="damaged">
                                Damaged Tools
                              </SelectItem>
                              <SelectItem value="stolen">
                                Stolen Tools
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Severity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Severity</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">
                                All Departments
                              </SelectItem>
                              <SelectItem value="maintenance">
                                Maintenance
                              </SelectItem>
                              <SelectItem value="installation">
                                Installation
                              </SelectItem>
                              <SelectItem value="fiber-ops">
                                Fiber Operations
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                          </Button>
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Action Report
                          </Button>
                        </div>

                        {/* Critical Toolbox Issues */}
                        <div className="space-y-4">
                          {[
                            {
                              id: "TBM-001",
                              technicianName: "Robert Lee",
                              department: "Fiber Operations",
                              dueDate: "2024-12-20",
                              daysPastDue: 26,
                              issueType: "Missing Tools & Overdue",
                              severity: "Critical",
                              totalTools: 8,
                              missingTools: 2,
                              damagedTools: 0,
                              missingItems: [
                                "Digital Caliper (DC-2024-022)",
                                "Safety Harness (SH-2024-029)",
                              ],
                              lastInspection: "2024-11-15",
                            },
                            {
                              id: "TBM-002",
                              technicianName: "Emily Johnson",
                              department: "Installation",
                              dueDate: "2024-12-10",
                              daysPastDue: 36,
                              issueType: "Stolen Tools & Overdue",
                              severity: "Critical",
                              totalTools: 6,
                              missingTools: 2,
                              damagedTools: 0,
                              missingItems: [
                                "Wire Stripper (WS-2024-035)",
                                "Cable Crimper (CC-2024-042)",
                              ],
                              lastInspection: "2024-10-25",
                            },
                            {
                              id: "TBM-003",
                              technicianName: "Lisa Davis",
                              department: "Maintenance",
                              dueDate: "2024-12-28",
                              daysPastDue: 18,
                              issueType: "Damaged Tools",
                              severity: "High",
                              totalTools: 9,
                              missingTools: 0,
                              damagedTools: 2,
                              missingItems: [
                                "Torque Wrench (TW-2024-015)",
                                "Impact Socket Set (IS-2024-022)",
                              ],
                              lastInspection: "2024-12-01",
                            },
                            {
                              id: "TBM-004",
                              technicianName: "Alex Thompson",
                              department: "Installation",
                              dueDate: "2025-01-01",
                              daysPastDue: 15,
                              issueType: "Overdue Inspection",
                              severity: "Medium",
                              totalTools: 7,
                              missingTools: 0,
                              damagedTools: 0,
                              missingItems: [],
                              lastInspection: "2024-11-01",
                            },
                            {
                              id: "TBM-005",
                              technicianName: "Chris Martinez",
                              department: "Fiber Operations",
                              dueDate: "2024-12-31",
                              daysPastDue: 15,
                              issueType: "Missing & Damaged Tools",
                              severity: "Critical",
                              totalTools: 11,
                              missingTools: 1,
                              damagedTools: 1,
                              missingItems: [
                                "Fiber Scope (FS-2024-088)",
                                "Patch Cord Tester (PCT-2024-095) - Damaged",
                              ],
                              lastInspection: "2024-12-15",
                            },
                          ].map((issue) => (
                            <Card
                              key={issue.id}
                              className={`border-l-4 ${
                                issue.severity === "Critical"
                                  ? "border-l-red-500 bg-red-50"
                                  : issue.severity === "High"
                                    ? "border-l-yellow-500 bg-yellow-50"
                                    : "border-l-orange-500 bg-orange-50"
                              }`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-3">
                                      <div>
                                        <h4 className="font-medium text-lg">
                                          {issue.technicianName}'s Toolbox
                                        </h4>
                                        <p className="text-sm text-muted-foreground">
                                          {issue.department} • Last Inspection:{" "}
                                          {new Date(
                                            issue.lastInspection,
                                          ).toLocaleDateString()}
                                        </p>
                                      </div>
                                      <Badge
                                        variant={
                                          issue.severity === "Critical"
                                            ? "destructive"
                                            : issue.severity === "High"
                                              ? "destructive"
                                              : "secondary"
                                        }
                                      >
                                        {issue.severity}
                                      </Badge>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm font-medium text-red-600 mb-2">
                                          {issue.issueType}
                                          {issue.daysPastDue > 0 && (
                                            <span>
                                              {" "}
                                              - {issue.daysPastDue} days overdue
                                            </span>
                                          )}
                                        </p>
                                        <div className="grid grid-cols-3 gap-2 text-sm">
                                          <div className="text-center p-2 bg-white rounded border">
                                            <div className="font-semibold">
                                              {issue.totalTools}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                              Total
                                            </p>
                                          </div>
                                          <div className="text-center p-2 bg-white rounded border">
                                            <div className="font-semibold text-red-600">
                                              {issue.missingTools}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                              Missing
                                            </p>
                                          </div>
                                          <div className="text-center p-2 bg-white rounded border">
                                            <div className="font-semibold text-yellow-600">
                                              {issue.damagedTools}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                              Damaged
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      {issue.missingItems.length > 0 && (
                                        <div>
                                          <p className="text-sm font-medium mb-2">
                                            Affected Tools:
                                          </p>
                                          <ul className="space-y-1">
                                            {issue.missingItems.map(
                                              (item, index) => (
                                                <li
                                                  key={index}
                                                  className="text-xs bg-white p-2 rounded border flex items-center gap-2"
                                                >
                                                  <AlertTriangle className="h-3 w-3 text-red-500" />
                                                  {item}
                                                </li>
                                              ),
                                            )}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="ml-4">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                        <DropdownMenuItem>
                                          <Eye className="h-4 w-4 mr-2" />
                                          View Full Toolbox
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <User className="h-4 w-4 mr-2" />
                                          Reassign Tools
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Calendar className="h-4 w-4 mr-2" />
                                          Schedule Inspection
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <AlertTriangle className="h-4 w-4 mr-2" />
                                          Report Issue
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                          <Download className="h-4 w-4 mr-2" />
                                          Send Alert to Technician
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      {/* Inspection Detail Modal */}
      {selectedInspection && (
        <Dialog
          open={!!selectedInspection}
          onOpenChange={() => setSelectedInspection(null)}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedInspection.type} -{" "}
                {selectedInspection.vehicleRegistration}
              </DialogTitle>
              <DialogDescription>
                Completed by {selectedInspection.inspector} on{" "}
                {selectedInspection.dateCompleted}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Overall Score</h4>
                  <div className="text-2xl font-bold">
                    {selectedInspection.overallScore}%
                  </div>
                  <Progress value={selectedInspection.overallScore} />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <Badge className={getStatusColor(selectedInspection.status)}>
                    {selectedInspection.status}
                  </Badge>
                </div>
              </div>

              {selectedInspection.aiAnalysis && (
                <div>
                  <h4 className="font-medium mb-2">AI Analysis</h4>
                  <Alert>
                    <Brain className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <div>
                          <strong>Detected:</strong>{" "}
                          {selectedInspection.aiAnalysis.detected.join(", ")}
                        </div>
                        <div>
                          <strong>Recommendations:</strong>{" "}
                          {selectedInspection.aiAnalysis.recommendations.join(
                            ", ",
                          )}
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {selectedInspection.aiAnalysis.confidence}% confidence
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">
                  Inspection Items ({selectedInspection.items.length} items)
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedInspection.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={getItemStatusColor(item.status)}>
                          {getItemStatusIcon(item.status)}
                        </div>
                        <div>
                          <span className="font-medium">{item.name}</span>
                          {item.notes && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            item.status === "Pass"
                              ? "default"
                              : item.status === "Fail"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {item.status}
                        </Badge>
                        {item.photoUrl && (
                          <Badge variant="outline">
                            <Camera className="h-3 w-3 mr-1" />
                            Photo
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
