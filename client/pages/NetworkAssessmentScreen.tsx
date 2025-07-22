import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Wifi,
  Activity,
  Globe,
  Router,
  Signal,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Play,
  Clock,
  MapPin,
} from "lucide-react";

interface NetworkTest {
  id: string;
  name: string;
  status: "running" | "completed" | "failed" | "pending";
  result?: string;
  duration?: string;
  icon: any;
}

interface Assessment {
  id: string;
  location: string;
  date: string;
  technician: string;
  overallStatus: "excellent" | "good" | "poor" | "critical";
  tests: NetworkTest[];
}

export default function NetworkAssessmentScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"current" | "new" | "history">("current");
  const [isRunningTests, setIsRunningTests] = useState(false);
  
  // Form state for new assessment
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  const [networkTests, setNetworkTests] = useState<NetworkTest[]>([
    {
      id: "ping",
      name: "Ping Test",
      status: "completed",
      result: "12ms avg",
      duration: "30s",
      icon: Activity,
    },
    {
      id: "speed",
      name: "Speed Test",
      status: "completed", 
      result: "95.2 Mbps ↓ / 47.8 Mbps ↑",
      duration: "45s",
      icon: Wifi,
    },
    {
      id: "dns",
      name: "DNS Resolution",
      status: "completed",
      result: "8ms avg",
      duration: "15s",
      icon: Globe,
    },
    {
      id: "traceroute",
      name: "Traceroute",
      status: "running",
      duration: "60s",
      icon: Router,
    },
    {
      id: "signal",
      name: "Signal Strength",
      status: "pending",
      icon: Signal,
    },
  ]);

  const assessmentHistory: Assessment[] = [
    {
      id: "ASS001",
      location: "East London Hospital",
      date: "2025-01-20",
      technician: "John Doe",
      overallStatus: "excellent",
      tests: [
        { id: "ping", name: "Ping Test", status: "completed", result: "8ms avg", icon: Activity },
        { id: "speed", name: "Speed Test", status: "completed", result: "100 Mbps ↓ / 50 Mbps ↑", icon: Wifi },
        { id: "dns", name: "DNS Resolution", status: "completed", result: "5ms avg", icon: Globe },
      ],
    },
    {
      id: "ASS002", 
      location: "Business Park",
      date: "2025-01-19",
      technician: "John Doe",
      overallStatus: "good",
      tests: [
        { id: "ping", name: "Ping Test", status: "completed", result: "15ms avg", icon: Activity },
        { id: "speed", name: "Speed Test", status: "completed", result: "85 Mbps ↓ / 42 Mbps ↑", icon: Wifi },
      ],
    },
  ];

  const runAllTests = async () => {
    setIsRunningTests(true);
    
    // Simulate running tests
    const updatedTests = [...networkTests];
    
    for (let i = 0; i < updatedTests.length; i++) {
      updatedTests[i].status = "running";
      setNetworkTests([...updatedTests]);
      
      // Simulate test duration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updatedTests[i].status = "completed";
      updatedTests[i].result = getTestResult(updatedTests[i].id);
      updatedTests[i].duration = "30s";
      setNetworkTests([...updatedTests]);
    }
    
    setIsRunningTests(false);
  };

  const getTestResult = (testId: string) => {
    const results = {
      ping: "12ms avg",
      speed: "95.2 Mbps ↓ / 47.8 Mbps ↑",
      dns: "8ms avg",
      traceroute: "8 hops, 45ms",
      signal: "-45 dBm (Excellent)",
    };
    return results[testId as keyof typeof results] || "Test completed";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "running":
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case "failed":
        return <AlertCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "poor":
        return "bg-yellow-100 text-yellow-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate(-1)}
            >
              <X className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Network Assessment</h1>
              <p className="text-sm opacity-90">Test and diagnose network performance</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4">
          <Button
            variant={activeTab === "current" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("current")}
            className={activeTab === "current" ? "bg-white text-purple-600" : "text-white hover:bg-white/20"}
          >
            Current Test
          </Button>
          <Button
            variant={activeTab === "new" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("new")}
            className={activeTab === "new" ? "bg-white text-purple-600" : "text-white hover:bg-white/20"}
          >
            New Assessment
          </Button>
          <Button
            variant={activeTab === "history" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("history")}
            className={activeTab === "history" ? "bg-white text-purple-600" : "text-white hover:bg-white/20"}
          >
            History
          </Button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === "current" && (
          <>
            {/* Current Location */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Current Assessment</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">Location:</span> Vumatel (Pty) Ltd - Central</p>
                  <p><span className="font-medium">Address:</span> 27 Emerson Crescent, Haven Hills, East London</p>
                  <p><span className="font-medium">Date:</span> {new Date().toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Test Controls */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Network Diagnostics</h3>
                    <p className="text-sm text-gray-600">Run comprehensive network tests</p>
                  </div>
                  <Button 
                    onClick={runAllTests} 
                    disabled={isRunningTests}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isRunningTests ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Running Tests...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Run All Tests
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            <div className="space-y-4">
              {networkTests.map((test) => {
                const IconComponent = test.icon;
                return (
                  <Card key={test.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <IconComponent className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{test.name}</h3>
                            {test.result && (
                              <p className="text-sm text-gray-600">{test.result}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {test.duration && (
                            <span className="text-xs text-gray-500">{test.duration}</span>
                          )}
                          <Badge className={getStatusColor(test.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(test.status)}
                              <span>{test.status.charAt(0).toUpperCase() + test.status.slice(1)}</span>
                            </div>
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {activeTab === "new" && (
          <Card>
            <CardHeader>
              <CardTitle>Start New Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  placeholder="Enter assessment location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <Textarea
                  placeholder="Additional notes about this assessment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  if (location) {
                    setActiveTab("current");
                    // Reset tests for new assessment
                    setNetworkTests(networkTests.map(test => ({ ...test, status: "pending", result: undefined })));
                  }
                }}
                disabled={!location}
              >
                Start Assessment
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === "history" && (
          <div className="space-y-4">
            {assessmentHistory.map((assessment) => (
              <Card key={assessment.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{assessment.location}</h3>
                      <div className="text-sm text-gray-600">
                        <p>Date: {assessment.date}</p>
                        <p>Technician: {assessment.technician}</p>
                      </div>
                    </div>
                    <Badge className={getOverallStatusColor(assessment.overallStatus)}>
                      {assessment.overallStatus.charAt(0).toUpperCase() + assessment.overallStatus.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {assessment.tests.map((test) => {
                      const IconComponent = test.icon;
                      return (
                        <div key={test.id} className="flex items-center space-x-2 text-sm">
                          <IconComponent className="h-4 w-4 text-gray-400" />
                          <span className="flex-1">{test.name}</span>
                          <span className="text-green-600 font-medium">{test.result}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
