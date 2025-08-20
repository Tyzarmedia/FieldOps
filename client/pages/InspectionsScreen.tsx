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
} from "lucide-react";

interface InspectionItem {
  id: string;
  name: string;
  category: string;
  status: "pass" | "fail" | "attention" | "not_checked";
  notes: string;
  photos: string[];
  required: boolean;
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

  // Mock data
  const vehicles = [
    { id: "FL-001", registration: "EL-123-ABC" },
    { id: "FL-002", registration: "EL-124-DEF" },
    { id: "FL-003", registration: "EL-125-GHI" },
    { id: "FL-004", registration: "EL-126-JKL" },
  ];

  const inspectionTypes = [
    "Pre-Trip Inspection",
    "Safety Inspection",
    "Maintenance Inspection",
    "Post-Repair Inspection",
    "Monthly Inspection",
    "Annual Inspection",
  ];

  const defaultChecklist: InspectionItem[] = [
    {
      id: "tires",
      name: "Tire Condition",
      category: "External",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
    },
    {
      id: "tire_pressure",
      name: "Tire Pressure",
      category: "External",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
    },
    {
      id: "brakes",
      name: "Brake System",
      category: "Mechanical",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
    },
    {
      id: "lights",
      name: "Lights & Indicators",
      category: "Electrical",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
    },
    {
      id: "mirrors",
      name: "Mirrors",
      category: "External",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
    },
    {
      id: "windshield",
      name: "Windshield & Wipers",
      category: "External",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
    },
    {
      id: "engine",
      name: "Engine Condition",
      category: "Mechanical",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
    },
    {
      id: "fluids",
      name: "Fluid Levels",
      category: "Mechanical",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
    },
    {
      id: "battery",
      name: "Battery",
      category: "Electrical",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
    },
    {
      id: "safety_equipment",
      name: "Safety Equipment",
      category: "Safety",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
    },
    {
      id: "first_aid",
      name: "First Aid Kit",
      category: "Safety",
      status: "not_checked",
      notes: "",
      photos: [],
      required: false,
    },
    {
      id: "fire_extinguisher",
      name: "Fire Extinguisher",
      category: "Safety",
      status: "not_checked",
      notes: "",
      photos: [],
      required: true,
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
      items: defaultChecklist.map((item) => ({
        ...item,
        status: "pass" as const,
        notes: item.name === "Tire Pressure" ? "All tires at optimal pressure" : "",
      })),
      overallScore: 98,
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
    },
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
      })),
      overallScore: 95,
    },
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
    }
  ];

  const [inspections, setInspections] = useState(mockInspections);

  const startNewInspection = () => {
    if (!selectedVehicle) return;

    const vehicle = vehicles.find((v) => v.id === selectedVehicle);
    const newInspection: Inspection = {
      id: `INS-${Date.now()}`,
      vehicleId: selectedVehicle,
      vehicleRegistration: vehicle?.registration || "",
      type: "Pre-Trip Inspection",
      status: "in_progress",
      inspector: "Current User",
      dateScheduled: new Date().toISOString().split("T")[0],
      items: defaultChecklist.map((item) => ({ ...item })),
      overallScore: 0,
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
          <h1 className="text-3xl font-bold text-foreground">
            Inspection
          </h1>
          <p className="text-muted-foreground">
            Digital inspection checklists with AI-powered analysis for vehicles and tools
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
                  Select a vehicle to begin a new inspection
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
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
                <div>
                  <Label htmlFor="inspection-type">Inspection Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select inspection type" />
                    </SelectTrigger>
                    <SelectContent>
                      {inspectionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowNewInspection(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={startNewInspection}
                    disabled={!selectedVehicle}
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
                          <h4 className="font-medium mb-2">Detected Issues:</h4>
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
                          <h4 className="font-medium mb-2">Recommendations:</h4>
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
                          {currentInspection.aiAnalysis?.confidence}% confidence
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
                    {["External", "Mechanical", "Electrical", "Safety"].map(
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
                  Start a new inspection to begin the digital checklist process
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
                  <CardTitle>Vehicle Inspection History</CardTitle>
                  <p className="text-muted-foreground">
                    All vehicle inspections from previous month to 3 years back
                  </p>
                </CardHeader>
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
          </Card>

          {/* Inspection History List */}
          <div className="space-y-4">
            {inspections.map((inspection) => (
              <Card key={inspection.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold">{inspection.type}</h3>
                        <Badge className={getStatusColor(inspection.status)}>
                          {inspection.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Vehicle:</span>{" "}
                          {inspection.vehicleRegistration}
                        </div>
                        <div>
                          <span className="font-medium">Inspector:</span>{" "}
                          {inspection.inspector}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span>{" "}
                          {inspection.dateCompleted || inspection.dateScheduled}
                        </div>
                        <div>
                          <span className="font-medium">Score:</span>{" "}
                          {inspection.overallScore}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right mr-4">
                        <div className="text-2xl font-bold">
                          {inspection.overallScore}%
                        </div>
                        <Progress
                          value={inspection.overallScore}
                          className="w-20"
                        />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => setSelectedInspection(inspection)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
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
                        <strong>Warning:</strong> 4 vehicle inspections are overdue and require immediate attention
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
                          <SelectItem value="2weeks">2 Weeks Overdue</SelectItem>
                          <SelectItem value="1month">1 Month Overdue</SelectItem>
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
                          status: "Overdue"
                        },
                        {
                          id: "VI-M002",
                          inspector: "Lisa Davis",
                          vehicleRegistration: "EL-128-PQR",
                          type: "Monthly Inspection",
                          dueDate: "2024-12-28",
                          daysPastDue: 18,
                          status: "Critical"
                        },
                        {
                          id: "VI-M003",
                          inspector: "Robert Lee",
                          vehicleRegistration: "EL-129-STU",
                          type: "Pre-Trip Inspection",
                          dueDate: "2024-12-20",
                          daysPastDue: 26,
                          status: "Critical"
                        },
                        {
                          id: "VI-M004",
                          inspector: "Emily Johnson",
                          vehicleRegistration: "EL-130-VWX",
                          type: "Maintenance Inspection",
                          dueDate: "2024-12-15",
                          daysPastDue: 31,
                          status: "Critical"
                        }
                      ].map((inspection) => (
                        <Card key={inspection.id} className="border-red-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-4">
                                  <div>
                                    <h4 className="font-medium">{inspection.type}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {inspection.vehicleRegistration}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">Assigned: {inspection.inspector}</p>
                                    <p className="text-sm text-red-600">
                                      Due: {new Date(inspection.dueDate).toLocaleDateString()} ({inspection.daysPastDue} days overdue)
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
                    <CardTitle>Current Tool Inspections</CardTitle>
                    <p className="text-muted-foreground">
                      Tool inspections for this month only
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">12</div>
                              <p className="text-sm text-muted-foreground">This Month</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-yellow-600">4</div>
                              <p className="text-sm text-muted-foreground">Pending</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">8</div>
                              <p className="text-sm text-muted-foreground">Completed</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Enhanced Filter and Search */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
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
                            <SelectValue placeholder="Assigned To" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Technicians</SelectItem>
                            <SelectItem value="john-smith">John Smith</SelectItem>
                            <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
                            <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
                            <SelectItem value="david-brown">David Brown</SelectItem>
                            <SelectItem value="lisa-davis">Lisa Davis</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Tool Condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Conditions</SelectItem>
                            <SelectItem value="good">Good Condition</SelectItem>
                            <SelectItem value="damaged">Damaged</SelectItem>
                            <SelectItem value="stolen">Stolen/Missing</SelectItem>
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
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>

                      {/* Current Tool Inspection List */}
                      <div className="space-y-4">
                        {[
                          {
                            id: "TI-001",
                            inspector: "John Smith",
                            assignedTo: "John Smith",
                            warehouseNumber: "WH-001",
                            toolType: "Power Drill",
                            toolId: "PD-2025-001",
                            dateCompleted: "2025-01-15",
                            status: "Completed",
                            overallScore: 95,
                            toolCondition: "Good Condition",
                            assignmentStatus: "Assigned"
                          },
                          {
                            id: "TI-002",
                            inspector: "Sarah Johnson",
                            assignedTo: "Sarah Johnson",
                            warehouseNumber: "WH-002",
                            toolType: "Multimeter",
                            toolId: "MM-2025-005",
                            dateCompleted: "2025-01-14",
                            status: "Completed",
                            overallScore: 88,
                            toolCondition: "Good Condition",
                            assignmentStatus: "Assigned"
                          },
                          {
                            id: "TI-003",
                            inspector: "Mike Wilson",
                            assignedTo: "Mike Wilson",
                            warehouseNumber: "WH-001",
                            toolType: "Cable Tester",
                            toolId: "CT-2025-012",
                            dateCompleted: "2025-01-13",
                            status: "Attention Required",
                            overallScore: 72,
                            toolCondition: "Damaged",
                            assignmentStatus: "Assigned"
                          },
                          {
                            id: "TI-004",
                            inspector: "David Brown",
                            assignedTo: "David Brown",
                            warehouseNumber: "WH-003",
                            toolType: "Voltage Tester",
                            toolId: "VT-2025-008",
                            dateCompleted: "2025-01-12",
                            status: "Completed",
                            overallScore: 93,
                            toolCondition: "Good Condition",
                            assignmentStatus: "Loaned"
                          }
                        ].map((inspection) => (
                          <Card key={inspection.id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-4">
                                    <div>
                                      <h4 className="font-medium">{inspection.toolType}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {inspection.toolId} • {inspection.warehouseNumber}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Inspector: {inspection.inspector}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {new Date(inspection.dateCompleted).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="text-lg font-bold">{inspection.overallScore}%</div>
                                    <p className="text-xs text-muted-foreground">Score</p>
                                  </div>
                                  <Badge
                                    variant={inspection.status === 'Completed' ? 'default' : 'destructive'}
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
                                        View Details
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
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tool Inspection History</CardTitle>
                    <p className="text-muted-foreground">
                      All tool inspections from previous month to 3 years back
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Enhanced Filter and Search for History */}
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
                          Export
                        </Button>
                      </div>

                      {/* Historical Tool Inspection List */}
                      <div className="space-y-4">
                        {[
                          {
                            id: "TI-H001",
                            inspector: "John Smith",
                            warehouseNumber: "WH-001",
                            toolType: "Power Drill",
                            toolId: "PD-2024-001",
                            dateCompleted: "2024-12-15",
                            status: "Completed",
                            overallScore: 92
                          },
                          {
                            id: "TI-H002",
                            inspector: "Sarah Johnson",
                            warehouseNumber: "WH-002",
                            toolType: "Oscilloscope",
                            toolId: "OS-2024-003",
                            dateCompleted: "2024-11-28",
                            status: "Completed",
                            overallScore: 89
                          },
                          {
                            id: "TI-H003",
                            inspector: "Mike Wilson",
                            warehouseNumber: "WH-001",
                            toolType: "Cable Tester",
                            toolId: "CT-2024-008",
                            dateCompleted: "2024-10-22",
                            status: "Completed",
                            overallScore: 85
                          }
                        ].map((inspection) => (
                          <Card key={inspection.id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-4">
                                    <div>
                                      <h4 className="font-medium">{inspection.toolType}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {inspection.toolId} • {inspection.warehouseNumber}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Inspector: {inspection.inspector}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {new Date(inspection.dateCompleted).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="text-right">
                                    <div className="text-lg font-bold">{inspection.overallScore}%</div>
                                    <p className="text-xs text-muted-foreground">Score</p>
                                  </div>
                                  <Badge variant="default">
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
                                        View Details
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
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="missed" className="space-y-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Missed Tool Inspections</CardTitle>
                    <p className="text-muted-foreground">
                      Tool inspections that are overdue or missed
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Warning:</strong> 3 tool inspections are overdue and require immediate attention
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
                            <SelectValue placeholder="Warehouse" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WH-001">WH-001</SelectItem>
                            <SelectItem value="WH-002">WH-002</SelectItem>
                            <SelectItem value="WH-003">WH-003</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Overdue Period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1week">1 Week Overdue</SelectItem>
                            <SelectItem value="2weeks">2 Weeks Overdue</SelectItem>
                            <SelectItem value="1month">1 Month Overdue</SelectItem>
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

                      {/* Missed Tool Inspection List */}
                      <div className="space-y-4">
                        {[
                          {
                            id: "TI-M001",
                            inspector: "David Brown",
                            warehouseNumber: "WH-003",
                            toolType: "Impact Driver",
                            toolId: "ID-2024-008",
                            dueDate: "2025-01-01",
                            daysPastDue: 15,
                            status: "Overdue"
                          },
                          {
                            id: "TI-M002",
                            inspector: "Lisa Davis",
                            warehouseNumber: "WH-001",
                            toolType: "Torque Wrench",
                            toolId: "TW-2024-015",
                            dueDate: "2024-12-28",
                            daysPastDue: 18,
                            status: "Critical"
                          },
                          {
                            id: "TI-M003",
                            inspector: "Robert Lee",
                            warehouseNumber: "WH-002",
                            toolType: "Digital Caliper",
                            toolId: "DC-2024-022",
                            dueDate: "2024-12-20",
                            daysPastDue: 26,
                            status: "Critical"
                          }
                        ].map((inspection) => (
                          <Card key={inspection.id} className="border-red-200">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-4">
                                    <div>
                                      <h4 className="font-medium">{inspection.toolType}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {inspection.toolId} • {inspection.warehouseNumber}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Assigned: {inspection.inspector}</p>
                                      <p className="text-sm text-red-600">
                                        Due: {new Date(inspection.dueDate).toLocaleDateString()} ({inspection.daysPastDue} days overdue)
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
                <h4 className="font-medium mb-2">Inspection Items ({selectedInspection.items.length} items)</h4>
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
                            <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={item.status === 'Pass' ? 'default' :
                                 item.status === 'Fail' ? 'destructive' : 'secondary'}
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
