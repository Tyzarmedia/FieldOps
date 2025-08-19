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
  const [selectedTab, setSelectedTab] = useState("current");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [showNewInspection, setShowNewInspection] = useState(false);
  const [currentInspection, setCurrentInspection] = useState<Inspection | null>(null);
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
    { id: "tires", name: "Tire Condition", category: "External", status: "not_checked", notes: "", photos: [], required: true },
    { id: "tire_pressure", name: "Tire Pressure", category: "External", status: "not_checked", notes: "", photos: [], required: true },
    { id: "brakes", name: "Brake System", category: "Mechanical", status: "not_checked", notes: "", photos: [], required: true },
    { id: "lights", name: "Lights & Indicators", category: "Electrical", status: "not_checked", notes: "", photos: [], required: true },
    { id: "mirrors", name: "Mirrors", category: "External", status: "not_checked", notes: "", photos: [], required: true },
    { id: "windshield", name: "Windshield & Wipers", category: "External", status: "not_checked", notes: "", photos: [], required: true },
    { id: "engine", name: "Engine Condition", category: "Mechanical", status: "not_checked", notes: "", photos: [], required: true },
    { id: "fluids", name: "Fluid Levels", category: "Mechanical", status: "not_checked", notes: "", photos: [], required: true },
    { id: "battery", name: "Battery", category: "Electrical", status: "not_checked", notes: "", photos: [], required: true },
    { id: "safety_equipment", name: "Safety Equipment", category: "Safety", status: "not_checked", notes: "", photos: [], required: true },
    { id: "first_aid", name: "First Aid Kit", category: "Safety", status: "not_checked", notes: "", photos: [], required: false },
    { id: "fire_extinguisher", name: "Fire Extinguisher", category: "Safety", status: "not_checked", notes: "", photos: [], required: true },
  ];

  const mockInspections: Inspection[] = [
    {
      id: "INS-001",
      vehicleId: "FL-001",
      vehicleRegistration: "EL-123-ABC",
      type: "Pre-Trip Inspection",
      status: "completed",
      inspector: "Clement Masinge",
      dateScheduled: "2024-01-20",
      dateCompleted: "2024-01-20",
      items: defaultChecklist.map(item => ({ ...item, status: "pass" as const })),
      overallScore: 98,
      aiAnalysis: {
        detected: ["Good tire condition", "All lights functional", "Brake pads in good condition"],
        confidence: 94,
        recommendations: ["Monitor brake pad wear in next 1000km", "Check tire pressure weekly"],
      },
    },
    {
      id: "INS-002",
      vehicleId: "FL-002",
      vehicleRegistration: "EL-124-DEF",
      type: "Safety Inspection",
      status: "failed",
      inspector: "Thabo Matlou",
      dateScheduled: "2024-01-19",
      dateCompleted: "2024-01-19",
      items: defaultChecklist.map((item, index) => ({ 
        ...item, 
        status: index < 2 ? "fail" as const : "pass" as const,
        notes: index < 2 ? "Requires immediate attention" : ""
      })),
      overallScore: 75,
    },
    {
      id: "INS-003",
      vehicleId: "FL-003",
      vehicleRegistration: "EL-125-GHI",
      type: "Monthly Inspection",
      status: "in_progress",
      inspector: "Thabitha Ndlovu",
      dateScheduled: "2024-01-21",
      items: defaultChecklist,
      overallScore: 0,
    },
  ];

  const [inspections, setInspections] = useState(mockInspections);

  const startNewInspection = () => {
    if (!selectedVehicle) return;

    const vehicle = vehicles.find(v => v.id === selectedVehicle);
    const newInspection: Inspection = {
      id: `INS-${Date.now()}`,
      vehicleId: selectedVehicle,
      vehicleRegistration: vehicle?.registration || "",
      type: "Pre-Trip Inspection",
      status: "in_progress",
      inspector: "Current User",
      dateScheduled: new Date().toISOString().split('T')[0],
      items: defaultChecklist.map(item => ({ ...item })),
      overallScore: 0,
    };

    setCurrentInspection(newInspection);
    setShowNewInspection(false);
    setSelectedTab("current");
  };

  const updateInspectionItem = (itemId: string, updates: Partial<InspectionItem>) => {
    if (!currentInspection) return;

    const updatedItems = currentInspection.items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );

    setCurrentInspection({
      ...currentInspection,
      items: updatedItems,
      overallScore: calculateScore(updatedItems),
    });
  };

  const calculateScore = (items: InspectionItem[]): number => {
    const checkedItems = items.filter(item => item.status !== "not_checked");
    if (checkedItems.length === 0) return 0;

    const passedItems = checkedItems.filter(item => item.status === "pass");
    return Math.round((passedItems.length / checkedItems.length) * 100);
  };

  const handlePhotoUpload = async (itemId: string, files: FileList) => {
    setUploadingMedia(true);
    
    // Simulate upload and AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
    updateInspectionItem(itemId, { 
      photos: [...(currentInspection?.items.find(i => i.id === itemId)?.photos || []), ...newPhotos]
    });

    // Simulate AI analysis
    if (itemId === "tires") {
      setAiAnalyzing(true);
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock AI detection
      const aiResults = {
        detected: ["Tire wear detected", "Tread depth: 4mm", "No sidewall damage"],
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
      dateCompleted: new Date().toISOString().split('T')[0],
    };

    setInspections(prev => [...prev, completedInspection]);
    setCurrentInspection(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "failed": return "bg-red-100 text-red-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "scheduled": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case "pass": return "text-green-600";
      case "fail": return "text-red-600";
      case "attention": return "text-yellow-600";
      case "not_checked": return "text-gray-400";
      default: return "text-gray-400";
    }
  };

  const getItemStatusIcon = (status: string) => {
    switch (status) {
      case "pass": return <CheckCircle className="h-5 w-5" />;
      case "fail": return <X className="h-5 w-5" />;
      case "attention": return <AlertTriangle className="h-5 w-5" />;
      default: return <div className="h-5 w-5 border-2 border-gray-300 rounded" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vehicle Inspections</h1>
          <p className="text-muted-foreground">
            Digital inspection checklists with AI-powered analysis
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
                  <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
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
                  <Button variant="outline" onClick={() => setShowNewInspection(false)}>
                    Cancel
                  </Button>
                  <Button onClick={startNewInspection} disabled={!selectedVehicle}>
                    Start Inspection
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Current Inspection</TabsTrigger>
          <TabsTrigger value="history">Inspection History</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
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
                        {currentInspection.type} - {currentInspection.vehicleRegistration}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        Started by {currentInspection.inspector} on {currentInspection.dateScheduled}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{currentInspection.overallScore}%</div>
                      <p className="text-sm text-muted-foreground">Overall Score</p>
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
                      <p className="text-muted-foreground">Analyzing uploaded images...</p>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Detected Issues:</h4>
                          <ul className="space-y-1">
                            {currentInspection.aiAnalysis?.detected.map((item, index) => (
                              <li key={index} className="text-sm flex items-center gap-2">
                                <Scan className="h-4 w-4 text-blue-600" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Recommendations:</h4>
                          <ul className="space-y-1">
                            {currentInspection.aiAnalysis?.recommendations.map((item, index) => (
                              <li key={index} className="text-sm flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                {item}
                              </li>
                            ))}
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
                    {["External", "Mechanical", "Electrical", "Safety"].map((category) => (
                      <div key={category}>
                        <h3 className="font-semibold mb-4">{category}</h3>
                        <div className="space-y-4">
                          {currentInspection.items
                            .filter(item => item.category === category)
                            .map((item) => (
                              <div key={item.id} className="border rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-3">
                                    <div className={getItemStatusColor(item.status)}>
                                      {getItemStatusIcon(item.status)}
                                    </div>
                                    <div>
                                      <h4 className="font-medium">{item.name}</h4>
                                      {item.required && (
                                        <Badge variant="outline" className="text-xs">
                                          Required
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      size="sm"
                                      variant={item.status === "pass" ? "default" : "outline"}
                                      onClick={() => updateInspectionItem(item.id, { status: "pass" })}
                                    >
                                      Pass
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant={item.status === "attention" ? "default" : "outline"}
                                      onClick={() => updateInspectionItem(item.id, { status: "attention" })}
                                    >
                                      Attention
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant={item.status === "fail" ? "destructive" : "outline"}
                                      onClick={() => updateInspectionItem(item.id, { status: "fail" })}
                                    >
                                      Fail
                                    </Button>
                                  </div>
                                </div>

                                {/* Notes */}
                                <Textarea
                                  placeholder="Add notes..."
                                  value={item.notes}
                                  onChange={(e) => updateInspectionItem(item.id, { notes: e.target.value })}
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
                                    onChange={(e) => e.target.files && handlePhotoUpload(item.id, e.target.files)}
                                  />
                                  <input
                                    ref={videoInputRef}
                                    type="file"
                                    accept="video/*"
                                    className="hidden"
                                    onChange={(e) => e.target.files && handlePhotoUpload(item.id, e.target.files)}
                                  />
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingMedia}
                                  >
                                    <Camera className="h-4 w-4 mr-2" />
                                    {uploadingMedia ? "Uploading..." : "Photo"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => videoInputRef.current?.click()}
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
                    ))}
                  </div>

                  <div className="mt-6 flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setCurrentInspection(null)}>
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
                <h3 className="text-lg font-medium mb-2">No Active Inspection</h3>
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
          {/* Filter and Search */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input placeholder="Search inspections..." />
                </div>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by vehicle" />
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
                          <span className="font-medium">Vehicle:</span> {inspection.vehicleRegistration}
                        </div>
                        <div>
                          <span className="font-medium">Inspector:</span> {inspection.inspector}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {inspection.dateCompleted || inspection.dateScheduled}
                        </div>
                        <div>
                          <span className="font-medium">Score:</span> {inspection.overallScore}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right mr-4">
                        <div className="text-2xl font-bold">{inspection.overallScore}%</div>
                        <Progress value={inspection.overallScore} className="w-20" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setSelectedInspection(inspection)}>
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

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Inspections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Calendar className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Upcoming:</strong> 3 vehicles have inspections due within the next 7 days
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  {[
                    { vehicle: "EL-127-MNO", type: "Safety Inspection", due: "2024-01-25", priority: "high" },
                    { vehicle: "EL-128-PQR", type: "Monthly Inspection", due: "2024-01-26", priority: "medium" },
                    { vehicle: "EL-129-STU", type: "Pre-Trip Inspection", due: "2024-01-27", priority: "low" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.type}</h4>
                        <p className="text-sm text-muted-foreground">
                          Vehicle: {item.vehicle} • Due: {item.due}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          item.priority === "high" ? "bg-red-100 text-red-800" :
                          item.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        }>
                          {item.priority} priority
                        </Badge>
                        <Button size="sm">Schedule</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Inspection Detail Modal */}
      {selectedInspection && (
        <Dialog open={!!selectedInspection} onOpenChange={() => setSelectedInspection(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedInspection.type} - {selectedInspection.vehicleRegistration}
              </DialogTitle>
              <DialogDescription>
                Completed by {selectedInspection.inspector} on {selectedInspection.dateCompleted}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Overall Score</h4>
                  <div className="text-2xl font-bold">{selectedInspection.overallScore}%</div>
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
                          <strong>Detected:</strong> {selectedInspection.aiAnalysis.detected.join(", ")}
                        </div>
                        <div>
                          <strong>Recommendations:</strong> {selectedInspection.aiAnalysis.recommendations.join(", ")}
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
                <h4 className="font-medium mb-2">Inspection Items</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedInspection.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        <div className={getItemStatusColor(item.status)}>
                          {getItemStatusIcon(item.status)}
                        </div>
                        <span>{item.name}</span>
                      </div>
                      <Badge variant="outline">{item.status}</Badge>
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
