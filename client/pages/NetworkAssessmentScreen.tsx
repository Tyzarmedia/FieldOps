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
            <Button
              onClick={runAssessment}
              disabled={
                isAssessing ||
                !assessmentData.location ||
                !assessmentData.testType
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
