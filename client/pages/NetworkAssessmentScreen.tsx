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
  Router,
  Server,
  Cable,
  Zap,
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
    reachOptions: "",
    coreOptions: "",
    location: "",
    equipmentLabel: "",
    signalStrength: -65,
    downloadSpeed: 45.2,
    uploadSpeed: 12.8,
    latency: 28,
    packetLoss: 0.1,
    issuesFound: "",
    notes: "",
    priority: "medium",
    coordinates: "",
    networkType: "fiber",
    connectedDevices: 5,
    
    // Conditional form fields for Reach + Active Ethernet
    ethernetPortType: "",
    switchConfiguration: "",
    vlanConfig: "",
    bandwidthAllocation: "",
    redundancySetup: "",
    
    // Conditional form fields for Core + DWDM
    wavelengthChannels: "",
    fiberType: "",
    amplifierConfig: "",
    dispersionCompensation: "",
    
    // Conditional form fields for Reach + GPON
    ontCount: "",
    splitterRatio: "",
    olcConfiguration: "",
    powerBudget: "",
  });

  const networkAreaTypes = [
    "Reach",
    "Core",
    "Access",
    "Distribution",
    "Backbone",
  ];

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

  // Determine which conditional form to show
  const getConditionalFormType = () => {
    const isReach = assessmentData.networkAreaType === "Reach";
    const isCore = assessmentData.networkAreaType === "Core";
    const isActiveEthernet = assessmentData.reachOptions.includes("Active Ethernet");
    const isGPON = assessmentData.reachOptions.includes("GPON");
    const isDWDM = assessmentData.coreOptions.includes("DWDM");

    if (isReach && isActiveEthernet) return "reach-active-ethernet";
    if (isReach && isGPON) return "reach-gpon";
    if (isCore && isDWDM) return "core-dwdm";
    return null;
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

  // Start camera for image capture
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setCurrentStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowCamera(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please use file upload instead.");
    }
  };

  // Capture image from camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0);
        const imageDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImages([...capturedImages, imageDataUrl]);
        
        // Stop camera
        if (currentStream) {
          currentStream.getTracks().forEach(track => track.stop());
          setCurrentStream(null);
        }
        setShowCamera(false);
      }
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setCapturedImages([...capturedImages, e.target.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove captured image
  const removeImage = (index: number) => {
    setCapturedImages(capturedImages.filter((_, i) => i !== index));
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
            console.warn("Geolocation error:", {
              code: error.code,
              message: error.message,
              timestamp: new Date().toISOString(),
            });
            resolve(null);
          },
        );
      } else {
        resolve(null);
      }
    });
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
        ...assessmentData,
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
          networkAreaType: "",
          reachOptions: "",
          coreOptions: "",
          location: "",
          equipmentLabel: "",
          signalStrength: -65,
          downloadSpeed: 45.2,
          uploadSpeed: 12.8,
          latency: 28,
          packetLoss: 0.1,
          issuesFound: "",
          notes: "",
          priority: "medium",
          coordinates: "",
          networkType: "fiber",
          connectedDevices: 5,
          ethernetPortType: "",
          switchConfiguration: "",
          vlanConfig: "",
          bandwidthAllocation: "",
          redundancySetup: "",
          wavelengthChannels: "",
          fiberType: "",
          amplifierConfig: "",
          dispersionCompensation: "",
          ontCount: "",
          splitterRatio: "",
          olcConfiguration: "",
          powerBudget: "",
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

  const signalInfo = getSignalStatus(assessmentData.signalStrength);
  const conditionalFormType = getConditionalFormType();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Network Assessment</h1>
            <p className="text-sm opacity-90">
              Advanced network analysis with conditional forms
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
        {/* Basic Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Network className="h-5 w-5" />
              <span>Assessment Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="Enter assessment location"
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
                    reachOptions: "",
                    coreOptions: "",
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

            {assessmentData.networkAreaType === "Reach" && (
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
            )}

            {assessmentData.networkAreaType === "Core" && (
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
            )}

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
          </CardContent>
        </Card>

        {/* Conditional Forms */}
        {conditionalFormType === "reach-active-ethernet" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Router className="h-5 w-5" />
                <span>Active Ethernet Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Ethernet Port Type</Label>
                <Select
                  value={assessmentData.ethernetPortType}
                  onValueChange={(value) =>
                    setAssessmentData({ ...assessmentData, ethernetPortType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select port type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1GbE">1 Gigabit Ethernet</SelectItem>
                    <SelectItem value="10GbE">10 Gigabit Ethernet</SelectItem>
                    <SelectItem value="25GbE">25 Gigabit Ethernet</SelectItem>
                    <SelectItem value="40GbE">40 Gigabit Ethernet</SelectItem>
                    <SelectItem value="100GbE">100 Gigabit Ethernet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Switch Configuration</Label>
                <Input
                  placeholder="Switch model and configuration"
                  value={assessmentData.switchConfiguration}
                  onChange={(e) =>
                    setAssessmentData({
                      ...assessmentData,
                      switchConfiguration: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>VLAN Configuration</Label>
                <Input
                  placeholder="VLAN IDs and configuration"
                  value={assessmentData.vlanConfig}
                  onChange={(e) =>
                    setAssessmentData({
                      ...assessmentData,
                      vlanConfig: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Bandwidth Allocation (Mbps)</Label>
                <Input
                  placeholder="Allocated bandwidth"
                  value={assessmentData.bandwidthAllocation}
                  onChange={(e) =>
                    setAssessmentData({
                      ...assessmentData,
                      bandwidthAllocation: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Redundancy Setup</Label>
                <Select
                  value={assessmentData.redundancySetup}
                  onValueChange={(value) =>
                    setAssessmentData({ ...assessmentData, redundancySetup: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select redundancy type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Redundancy</SelectItem>
                    <SelectItem value="link">Link Redundancy</SelectItem>
                    <SelectItem value="device">Device Redundancy</SelectItem>
                    <SelectItem value="path">Path Redundancy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {conditionalFormType === "reach-gpon" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cable className="h-5 w-5" />
                <span>GPON Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>ONT Count</Label>
                <Input
                  type="number"
                  placeholder="Number of ONTs"
                  value={assessmentData.ontCount}
                  onChange={(e) =>
                    setAssessmentData({
                      ...assessmentData,
                      ontCount: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Splitter Ratio</Label>
                <Select
                  value={assessmentData.splitterRatio}
                  onValueChange={(value) =>
                    setAssessmentData({ ...assessmentData, splitterRatio: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select splitter ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:8">1:8</SelectItem>
                    <SelectItem value="1:16">1:16</SelectItem>
                    <SelectItem value="1:32">1:32</SelectItem>
                    <SelectItem value="1:64">1:64</SelectItem>
                    <SelectItem value="1:128">1:128</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>OLC Configuration</Label>
                <Input
                  placeholder="Optical Line Card configuration"
                  value={assessmentData.olcConfiguration}
                  onChange={(e) =>
                    setAssessmentData({
                      ...assessmentData,
                      olcConfiguration: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Power Budget (dB)</Label>
                <Input
                  placeholder="Power budget measurement"
                  value={assessmentData.powerBudget}
                  onChange={(e) =>
                    setAssessmentData({
                      ...assessmentData,
                      powerBudget: e.target.value,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        )}

        {conditionalFormType === "core-dwdm" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>DWDM Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Wavelength Channels</Label>
                <Input
                  placeholder="Number and configuration of wavelength channels"
                  value={assessmentData.wavelengthChannels}
                  onChange={(e) =>
                    setAssessmentData({
                      ...assessmentData,
                      wavelengthChannels: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Fiber Type</Label>
                <Select
                  value={assessmentData.fiberType}
                  onValueChange={(value) =>
                    setAssessmentData({ ...assessmentData, fiberType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fiber type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SMF-28">SMF-28 (Standard Single Mode)</SelectItem>
                    <SelectItem value="NZDSF">Non-Zero Dispersion Shifted</SelectItem>
                    <SelectItem value="DSF">Dispersion Shifted</SelectItem>
                    <SelectItem value="LEAF">Large Effective Area</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Amplifier Configuration</Label>
                <Input
                  placeholder="EDFA and Raman amplifier setup"
                  value={assessmentData.amplifierConfig}
                  onChange={(e) =>
                    setAssessmentData({
                      ...assessmentData,
                      amplifierConfig: e.target.value,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Dispersion Compensation</Label>
                <Select
                  value={assessmentData.dispersionCompensation}
                  onValueChange={(value) =>
                    setAssessmentData({ ...assessmentData, dispersionCompensation: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select compensation method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DCF">Dispersion Compensating Fiber</SelectItem>
                    <SelectItem value="FBG">Fiber Bragg Grating</SelectItem>
                    <SelectItem value="EDC">Electronic Dispersion Compensation</SelectItem>
                    <SelectItem value="None">No Compensation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Image Capture Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="h-5 w-5" />
              <span>Documentation Images ({capturedImages.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <Button
                onClick={startCamera}
                variant="outline"
                className="flex-1"
              >
                <Camera className="h-4 w-4 mr-2" />
                Take Photo
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            {capturedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {capturedImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Captured ${index + 1}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg max-w-md w-full mx-4">
              <div className="space-y-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded"
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex space-x-2">
                  <Button onClick={captureImage} className="flex-1">
                    Capture
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (currentStream) {
                        currentStream.getTracks().forEach(track => track.stop());
                        setCurrentStream(null);
                      }
                      setShowCamera(false);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assessment Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Assessment Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label>Additional Notes</Label>
              <Textarea
                placeholder="Additional observations and notes"
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
          </CardContent>
        </Card>

        {/* Network Testing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Network Performance Test</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={runAssessment}
              disabled={
                isAssessing ||
                !assessmentData.location ||
                !assessmentData.networkAreaType ||
                (!assessmentData.reachOptions && !assessmentData.coreOptions)
              }
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isAssessing ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Running Performance Test...
                </>
              ) : (
                <>
                  <Activity className="h-4 w-4 mr-2" />
                  Start Performance Test
                </>
              )}
            </Button>

            {/* Test Results */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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
            </div>
          </CardContent>
        </Card>

        {/* Save Assessment */}
        <Button
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold"
          onClick={saveAssessmentReport}
          disabled={!assessmentData.location || !assessmentData.networkAreaType}
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Save Assessment Report
        </Button>
      </div>
    </div>
  );
}
