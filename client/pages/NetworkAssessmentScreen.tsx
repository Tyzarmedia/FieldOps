import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Network,
  Wifi,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Camera,
  MapPin,
  Upload,
  Filter,
} from "lucide-react";

export default function NetworkAssessmentScreen() {
  const navigate = useNavigate();
  const [isAssessing, setIsAssessing] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);

  const [assessmentData, setAssessmentData] = useState({
    networkAreaType: "",
    networkTechnologyType: "",
    location: "",
    testType: "",
    signalStrength: -65,
    downloadSpeed: 45.2,
    uploadSpeed: 12.8,
    latency: 28,
    packetLoss: 0.1,
    issuesFound: "",
    recommendedActions: "",
    priority: "medium",
    coordinates: "",
    equipmentLabel: "",
    coreOptions: "",
    reachOptions: "",
    networkType: "fiber",
    connectedDevices: 5,
    notes: "",
  });

  const networkAreaTypes = [
    "Reach",
    "Feeder",
    "Distribution",
    "Access",
    "Backbone",
    "Metro",
    "Edge",
    "Core",
  ];

  const networkTechnologyTypes = {
    Reach: ["GPON", "EPON", "XGS-PON", "NG-PON2"],
    Feeder: ["Fiber Optic", "Copper", "Coax", "Wireless"],
    Distribution: ["GPON", "Ethernet", "DSL", "Cable"],
    Access: ["FTTH", "FTTC", "DSL", "Cable", "Wireless"],
    Backbone: ["Dark Fiber", "DWDM", "MPLS", "Ethernet"],
    Metro: ["Metro Ethernet", "SONET/SDH", "MPLS"],
    Edge: ["Ethernet", "MPLS", "SD-WAN"],
    Core: ["DWDM", "SONET/SDH", "IP/MPLS"],
  };

  const reachOptionsData = [
    "GPON - Gigabit Passive Optical Network",
    "EPON - Ethernet Passive Optical Network",
    "XGS-PON - 10G Symmetrical PON",
    "NG-PON2 - Next Generation PON 2",
    "Point-to-Point Fiber",
    "Active Ethernet",
  ];

  const coreOptionsData = [
    "DWDM - Dense Wavelength Division Multiplexing",
    "SONET/SDH - Synchronous Digital Hierarchy",
    "IP/MPLS - Internet Protocol/Multiprotocol Label Switching",
    "OTN - Optical Transport Network",
    "Carrier Ethernet",
    "Metro Ethernet",
  ];

  const runAssessment = async () => {
    setIsAssessing(true);
    // Simulate network test
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Generate random realistic values
    setAssessmentData({
      ...assessmentData,
      signalStrength: -Math.floor(Math.random() * 30 + 50),
      downloadSpeed: Math.round((Math.random() * 50 + 20) * 10) / 10,
      uploadSpeed: Math.round((Math.random() * 20 + 5) * 10) / 10,
      latency: Math.floor(Math.random() * 40 + 15),
      packetLoss: Math.round(Math.random() * 2 * 10) / 10,
    });

    setIsAssessing(false);
  };

  const getSignalStatus = (strength: number) => {
    if (strength > -50)
      return { status: "Excellent", color: "bg-green-500", icon: CheckCircle };
    if (strength > -60)
      return { status: "Good", color: "bg-blue-500", icon: TrendingUp };
    if (strength > -70)
      return { status: "Fair", color: "bg-yellow-500", icon: TrendingDown };
    return { status: "Poor", color: "bg-red-500", icon: AlertTriangle };
  };

  const getSpeedStatus = (speed: number, type: "download" | "upload") => {
    const threshold = type === "download" ? 25 : 10;
    return speed >= threshold ? "Good" : "Needs Improvement";
  };

  // Save assessment report with images
  const saveAssessmentReport = async () => {
    try {
      const technicianId = localStorage.getItem("employeeId") || "tech001";
      const technicianName = localStorage.getItem("userName") || "Technician";

      // Get current location
      const location = await getCurrentLocation();

      const assessmentReport = {
        id: `NA-${Date.now()}`,
        technicianId,
        technicianName,
        assessmentDate: new Date().toISOString(),
        location: {
          latitude: location?.latitude || 0,
          longitude: location?.longitude || 0,
          address: location?.address || "Unknown location",
        },
        coreOptions: assessmentData.coreOptions,
        reachOptions: assessmentData.reachOptions,
        signalStrength: assessmentData.signalStrength,
        downloadSpeed: assessmentData.downloadSpeed,
        uploadSpeed: assessmentData.uploadSpeed,
        networkType: assessmentData.networkType,
        connectedDevices: assessmentData.connectedDevices,
        issuesFound: assessmentData.issuesFound,
        notes: assessmentData.notes,
        images: capturedImages, // Include all captured images
        status: "completed",
      };

      // Submit to database
      const response = await fetch("/api/network-assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assessmentReport),
      });

      if (response.ok) {
        alert("Network assessment saved successfully!");
        // Reset form
        setAssessmentData({
          coreOptions: "",
          reachOptions: "",
          signalStrength: -50,
          downloadSpeed: 100,
          uploadSpeed: 50,
          networkType: "fiber",
          connectedDevices: 5,
          issuesFound: false,
          notes: "",
        });
        setCapturedImages([]);
        navigate("/technician");
      } else {
        throw new Error("Failed to save assessment");
      }
    } catch (error) {
      console.error("Error saving assessment:", error);
      alert("Failed to save assessment. Please try again.");
    }
  };

  // Get current location
  const getCurrentLocation = (): Promise<{
    latitude: number;
    longitude: number;
    address: string;
  } | null> => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              address: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
            });
          },
          (error) => {
            console.warn("Geolocation error:", error);
            resolve(null);
          },
        );
      } else {
        resolve(null);
      }
    });
  };

  const signalInfo = getSignalStatus(assessmentData.signalStrength);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Network Assessment</h1>
            <p className="text-sm opacity-90">
              Test and analyze network performance
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full h-10 w-10"
            onClick={() => navigate(-1)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Test Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Network className="h-5 w-5" />
              <span>Test Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="Enter test location"
                value={assessmentData.location}
                onChange={(e) =>
                  setAssessmentData({
                    ...assessmentData,
                    location: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Network Area Type</Label>
              <Select
                value={assessmentData.networkAreaType}
                onValueChange={(value) =>
                  setAssessmentData({
                    ...assessmentData,
                    networkAreaType: value,
                    networkTechnologyType: "" // Reset technology when area changes
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select network area type" />
                </SelectTrigger>
                <SelectContent>
                  {networkAreaTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {assessmentData.networkAreaType && (
              <div className="space-y-2">
                <Label>Network Technology Type</Label>
                <Select
                  value={assessmentData.networkTechnologyType}
                  onValueChange={(value) =>
                    setAssessmentData({ ...assessmentData, networkTechnologyType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select technology type" />
                  </SelectTrigger>
                  <SelectContent>
                    {networkTechnologyTypes[assessmentData.networkAreaType as keyof typeof networkTechnologyTypes]?.map((tech) => (
                      <SelectItem key={tech} value={tech}>
                        {tech}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>Reach Options</Label>
              <Select
                value={assessmentData.reachOptions}
                onValueChange={(value) =>
                  setAssessmentData({ ...assessmentData, reachOptions: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reach option" />
                </SelectTrigger>
                <SelectContent>
                  {reachOptionsData.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Core Options</Label>
              <Select
                value={assessmentData.coreOptions}
                onValueChange={(value) =>
                  setAssessmentData({ ...assessmentData, coreOptions: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select core option" />
                </SelectTrigger>
                <SelectContent>
                  {coreOptionsData.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Test Type</Label>
              <Select
                value={assessmentData.testType}
                onValueChange={(value) =>
                  setAssessmentData({ ...assessmentData, testType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full Network Test</SelectItem>
                  <SelectItem value="speed">Speed Test Only</SelectItem>
                  <SelectItem value="signal">Signal Strength Only</SelectItem>
                  <SelectItem value="latency">Latency Test</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Equipment Label</Label>
              <Input
                placeholder="Enter equipment label/ID"
                value={assessmentData.equipmentLabel}
                onChange={(e) =>
                  setAssessmentData({
                    ...assessmentData,
                    equipmentLabel: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Connected Devices</Label>
              <Input
                type="number"
                placeholder="Number of connected devices"
                value={assessmentData.connectedDevices}
                onChange={(e) =>
                  setAssessmentData({
                    ...assessmentData,
                    connectedDevices: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Issues Found</Label>
              <Textarea
                placeholder="Describe any issues found during assessment"
                value={assessmentData.issuesFound}
                onChange={(e) =>
                  setAssessmentData({
                    ...assessmentData,
                    issuesFound: e.target.value,
                  })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes and observations"
                value={assessmentData.notes}
                onChange={(e) =>
                  setAssessmentData({
                    ...assessmentData,
                    notes: e.target.value,
                  })
                }
                rows={3}
              />
            </div>

            <Button
              onClick={runAssessment}
              disabled={
                isAssessing ||
                !assessmentData.location ||
                !assessmentData.testType ||
                !assessmentData.networkAreaType ||
                !assessmentData.reachOptions ||
                !assessmentData.coreOptions
              }
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isAssessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Running Assessment...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4 mr-2" />
                  Start Network Assessment
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wifi className="h-5 w-5" />
              <span>Assessment Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Signal Strength */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <signalInfo.icon className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">Signal Strength</div>
                  <div className="text-sm text-gray-600">
                    {assessmentData.signalStrength} dBm
                  </div>
                </div>
              </div>
              <Badge className={`${signalInfo.color} text-white`}>
                {signalInfo.status}
              </Badge>
            </div>

            {/* Download Speed */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingDown className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">Download Speed</div>
                  <div className="text-sm text-gray-600">
                    {assessmentData.downloadSpeed} Mbps
                  </div>
                </div>
              </div>
              <Badge
                className={
                  getSpeedStatus(assessmentData.downloadSpeed, "download") ===
                  "Good"
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 text-white"
                }
              >
                {getSpeedStatus(assessmentData.downloadSpeed, "download")}
              </Badge>
            </div>

            {/* Upload Speed */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">Upload Speed</div>
                  <div className="text-sm text-gray-600">
                    {assessmentData.uploadSpeed} Mbps
                  </div>
                </div>
              </div>
              <Badge
                className={
                  getSpeedStatus(assessmentData.uploadSpeed, "upload") ===
                  "Good"
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 text-white"
                }
              >
                {getSpeedStatus(assessmentData.uploadSpeed, "upload")}
              </Badge>
            </div>

            {/* Latency */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Activity className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">Latency</div>
                  <div className="text-sm text-gray-600">
                    {assessmentData.latency} ms
                  </div>
                </div>
              </div>
              <Badge
                className={
                  assessmentData.latency < 50
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 text-white"
                }
              >
                {assessmentData.latency < 50 ? "Good" : "High"}
              </Badge>
            </div>

            {/* Packet Loss */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium">Packet Loss</div>
                  <div className="text-sm text-gray-600">
                    {assessmentData.packetLoss}%
                  </div>
                </div>
              </div>
              <Badge
                className={
                  assessmentData.packetLoss < 1
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }
              >
                {assessmentData.packetLoss < 1 ? "Normal" : "High"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assessmentData.signalStrength < -70 && (
                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Signal Strength:</strong> Consider repositioning
                    equipment or checking for obstructions.
                  </p>
                </div>
              )}
              {assessmentData.downloadSpeed < 25 && (
                <div className="p-3 bg-orange-50 border-l-4 border-orange-400 rounded">
                  <p className="text-sm text-orange-800">
                    <strong>Download Speed:</strong> Speed below recommended
                    threshold. Check for network congestion.
                  </p>
                </div>
              )}
              {assessmentData.latency > 50 && (
                <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
                  <p className="text-sm text-red-800">
                    <strong>High Latency:</strong> Network response time is
                    elevated. Check routing and infrastructure.
                  </p>
                </div>
              )}
              {assessmentData.packetLoss > 1 && (
                <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
                  <p className="text-sm text-red-800">
                    <strong>Packet Loss:</strong> Significant packet loss
                    detected. Check connections and hardware.
                  </p>
                </div>
              )}
              {assessmentData.signalStrength > -60 &&
                assessmentData.downloadSpeed > 25 &&
                assessmentData.latency < 50 &&
                assessmentData.packetLoss < 1 && (
                  <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                    <p className="text-sm text-green-800">
                      <strong>Network Status:</strong> All metrics are within
                      acceptable ranges. Network performance is good.
                    </p>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>

        {/* Save Report */}
        <Button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold"
          onClick={saveAssessmentReport}
        >
          Save Assessment Report
        </Button>
      </div>
    </div>
  );
}
