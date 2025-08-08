import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Clock,
  User,
  MapPin,
  AlertCircle,
  CheckCircle,
  Users,
  Calendar,
  Timer,
  Building,
  UserPlus,
  Activity,
  BellRing,
} from "lucide-react";

interface Assistant {
  id: string;
  name: string;
  role: "assistant" | "junior_technician";
  status: "available" | "busy" | "on-leave";
  warehouse: string;
  experienceLevel: "beginner" | "intermediate" | "experienced";
  specialties: string[];
}

interface WorkSession {
  id: string;
  technicianId: string;
  assistantId?: string;
  clockInTime: string;
  clockOutTime?: string;
  status: "active" | "completed";
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  workType: "regular" | "overtime";
  jobsAssigned: string[];
}

export default function EnhancedClockInScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [clockingIn, setClockedIn] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{latitude: number, longitude: number, address: string} | null>(null);
  const [selectedAssistant, setSelectedAssistant] = useState("");
  const [workingWithAssistant, setWorkingWithAssistant] = useState(false);
  const [overtimeExpected, setOvertimeExpected] = useState(false);

  // Current user info
  const [currentUser] = useState({
    id: "tech001",
    name: "Dyondzani Clement Masinge",
    role: "Senior Technician",
    warehouse: "WH-EL-001",
    department: "Field Operations",
  });

  // Available assistants
  const [assistants, setAssistants] = useState<Assistant[]>([
    {
      id: "asst001",
      name: "John Smith",
      role: "assistant",
      status: "available",
      warehouse: "WH-EL-001",
      experienceLevel: "intermediate",
      specialties: ["FTTH Installation", "Cable Management"],
    },
    {
      id: "asst002", 
      name: "Emma Davis",
      role: "junior_technician",
      status: "available",
      warehouse: "WH-EL-001",
      experienceLevel: "beginner",
      specialties: ["Equipment Setup", "Documentation"],
    },
    {
      id: "asst003",
      name: "Michael Brown",
      role: "assistant", 
      status: "busy",
      warehouse: "WH-PE-002",
      experienceLevel: "experienced",
      specialties: ["Fiber Splicing", "Network Testing"],
    },
  ]);

  // Current work session
  const [currentSession, setCurrentSession] = useState<WorkSession | null>(null);

  // Check if already clocked in
  useEffect(() => {
    checkCurrentSession();
    getCurrentLocation();
  }, []);

  const checkCurrentSession = async () => {
    try {
      const response = await fetch(`/api/work-sessions/current/${currentUser.id}`);
      if (response.ok) {
        const session = await response.json();
        setCurrentSession(session);
      }
    } catch (error) {
      console.error('Failed to check current session:', error);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      // Set a default location for testing
      setCurrentLocation({
        latitude: -33.0197,
        longitude: 27.9117,
        address: "Default Location (East London)"
      });
      return;
    }

    const handleLocationSuccess = (position: GeolocationPosition) => {
      const location = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        address: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`,
      };

      setCurrentLocation(location);
    };

    const handleLocationError = (error: GeolocationPositionError) => {
      let errorMessage = '';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location permission denied. Using office location for clock-in.';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location unavailable. Using office location for clock-in.';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out. Using office location for clock-in.';
          break;
        default:
          errorMessage = 'Location error. Using office location for clock-in.';
          break;
      }

      console.info(errorMessage);

      // Always set default location as fallback - no need to show as error
      setCurrentLocation({
        latitude: -33.0197,
        longitude: 27.9117,
        address: "Office Location (East London)"
      });
    };

    // Try to get location with retry mechanism
    navigator.geolocation.getCurrentPosition(
      handleLocationSuccess,
      (error) => {
        // Retry with less strict settings
        navigator.geolocation.getCurrentPosition(
          handleLocationSuccess,
          handleLocationError,
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 60000,
          }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
      }
    );
  };

  const clockIn = async () => {
    if (!currentLocation) {
      alert("Location is required for clock-in");
      return;
    }

    setLoading(true);
    setClockedIn(true);

    try {
      const clockInData = {
        technicianId: currentUser.id,
        assistantId: workingWithAssistant ? selectedAssistant : null,
        clockInTime: new Date().toISOString(),
        location: currentLocation,
        warehouse: currentUser.warehouse,
        expectedOvertime: overtimeExpected,
        workType: overtimeExpected ? "overtime" : "regular",
      };

      const response = await fetch('/api/work-sessions/clock-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(clockInData),
      });

      if (response.ok) {
        const session = await response.json();
        setCurrentSession(session);

        // Send notifications
        await sendClockInNotifications(session);

        // Navigate to dashboard after short delay
        setTimeout(() => {
          navigate('/technician/dashboard');
        }, 2000);
      } else {
        throw new Error('Failed to clock in');
      }
    } catch (error) {
      console.error('Clock-in failed:', error);
      alert('Failed to clock in. Please try again.');
      setClockedIn(false);
    }
    setLoading(false);
  };

  const clockOut = async () => {
    if (!currentSession) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/work-sessions/${currentSession.id}/clock-out`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          clockOutTime: new Date().toISOString(),
          location: currentLocation,
        }),
      });

      if (response.ok) {
        const completedSession = await response.json();
        
        // Check for overtime and create claims if necessary
        await checkAndCreateOvertimeClaims(completedSession);
        
        setCurrentSession(null);
        
        // Navigate to login or summary
        navigate('/login');
      } else {
        throw new Error('Failed to clock out');
      }
    } catch (error) {
      console.error('Clock-out failed:', error);
      alert('Failed to clock out. Please try again.');
    }
    setLoading(false);
  };

  const sendClockInNotifications = async (session: WorkSession) => {
    try {
      // Notify manager about clock-in
      await fetch('/api/notifications/clock-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          technicianId: currentUser.id,
          technicianName: currentUser.name,
          assistantId: session.assistantId,
          assistantName: session.assistantId ? assistants.find(a => a.id === session.assistantId)?.name : null,
          clockInTime: session.clockInTime,
          location: session.location,
          expectedOvertime: overtimeExpected,
        }),
      });
    } catch (error) {
      console.error('Failed to send notifications:', error);
    }
  };

  const checkAndCreateOvertimeClaims = async (session: WorkSession) => {
    const clockInTime = new Date(session.clockInTime);
    const clockOutTime = new Date(session.clockOutTime!);
    const workHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
    
    // Check if worked more than 8 hours or after 17:00
    const isOvertime = workHours > 8 || clockOutTime.getHours() >= 17;
    
    if (isOvertime) {
      try {
        // Get jobs completed during overtime hours
        const overtimeJobs = await getOvertimeJobs(session.id, session.clockInTime, session.clockOutTime!);
        
        const overtimeClaimData = {
          sessionId: session.id,
          technicianId: currentUser.id,
          assistantId: session.assistantId,
          overtimeHours: Math.max(0, workHours - 8),
          overtimeJobs: overtimeJobs,
          comments: `Overtime claim for ${workHours.toFixed(2)} hours. Jobs completed after hours: ${overtimeJobs.map(j => j.workOrderNumber).join(', ')}`,
          claimDate: new Date().toISOString(),
        };

        await fetch('/api/overtime-claims/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(overtimeClaimData),
        });
      } catch (error) {
        console.error('Failed to create overtime claim:', error);
      }
    }
  };

  const getOvertimeJobs = async (sessionId: string, clockInTime: string, clockOutTime: string) => {
    try {
      const response = await fetch(`/api/jobs/overtime-jobs?sessionId=${sessionId}&start=${clockInTime}&end=${clockOutTime}`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Failed to get overtime jobs:', error);
    }
    return [];
  };

  const getAvailableAssistants = () => {
    return assistants.filter(assistant => 
      assistant.status === "available" && 
      assistant.warehouse === currentUser.warehouse
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-yellow-100 text-yellow-800";
      case "on-leave":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case "experienced":
        return "bg-blue-100 text-blue-800";
      case "intermediate":
        return "bg-purple-100 text-purple-800";
      case "beginner":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (clockingIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Clocked In Successfully!</h2>
            <p className="text-gray-600 mb-4">
              Welcome back, {currentUser.name}
            </p>
            {workingWithAssistant && selectedAssistant && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800">
                  Working with: {assistants.find(a => a.id === selectedAssistant)?.name}
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500">
              Redirecting to dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clock In/Out</h1>
              <p className="text-gray-600">Manage your work session and team</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString()}
              </div>
              <div className="text-lg font-semibold">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        {/* Current User Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{currentUser.name}</h2>
                <p className="text-gray-600">{currentUser.role}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{currentUser.warehouse}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Session Status */}
        {currentSession ? (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Current Session</h3>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Clocked in: {new Date(currentSession.clockInTime).toLocaleString()}
                </div>
                {currentSession.assistantId && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Working with: {assistants.find(a => a.id === currentSession.assistantId)?.name}
                  </div>
                )}
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location: {currentSession.location.address}
                </div>
              </div>
              <Button
                onClick={clockOut}
                disabled={loading}
                className="w-full mt-4 bg-red-600 hover:bg-red-700"
              >
                <Clock className="h-4 w-4 mr-2" />
                Clock Out
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Clock In</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Location Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Location
                </label>
                {currentLocation ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm text-green-800">
                        Location confirmed: {currentLocation.address}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                      <span className="text-sm text-yellow-800">
                        Getting location...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Assistant Selection */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <Checkbox
                    id="working-with-assistant"
                    checked={workingWithAssistant}
                    onCheckedChange={setWorkingWithAssistant}
                  />
                  <label htmlFor="working-with-assistant" className="text-sm font-medium text-gray-700">
                    Working with an assistant today
                  </label>
                </div>

                {workingWithAssistant && (
                  <div className="space-y-3">
                    <Select value={selectedAssistant} onValueChange={setSelectedAssistant}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assistant" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableAssistants().map((assistant) => (
                          <SelectItem key={assistant.id} value={assistant.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{assistant.name}</span>
                              <div className="flex items-center space-x-2 ml-4">
                                <Badge className={getExperienceColor(assistant.experienceLevel)}>
                                  {assistant.experienceLevel}
                                </Badge>
                                <Badge className={getStatusColor(assistant.status)}>
                                  {assistant.status}
                                </Badge>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedAssistant && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">Assistant Info</h4>
                        {(() => {
                          const assistant = assistants.find(a => a.id === selectedAssistant);
                          return assistant ? (
                            <div className="space-y-2 text-sm text-blue-800">
                              <div>Role: {assistant.role.replace('_', ' ').toUpperCase()}</div>
                              <div>Experience: {assistant.experienceLevel}</div>
                              <div>Specialties: {assistant.specialties.join(', ')}</div>
                              <div className="text-xs text-blue-600 mt-2">
                                ℹ️ Assistant will have read-only access to see how you complete UDF, images, stock, and sign-off processes for learning purposes.
                              </div>
                            </div>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Overtime Expectation */}
              <div>
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="overtime-expected"
                    checked={overtimeExpected}
                    onCheckedChange={setOvertimeExpected}
                  />
                  <label htmlFor="overtime-expected" className="text-sm font-medium text-gray-700">
                    Expecting to work overtime today
                  </label>
                </div>
                {overtimeExpected && (
                  <div className="mt-2 bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <BellRing className="h-5 w-5 text-orange-600 mr-2" />
                      <span className="text-sm text-orange-800">
                        Overtime will be automatically tracked and claims generated for both you and your assistant.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Clock In Button */}
              <Button
                onClick={clockIn}
                disabled={loading || !currentLocation || (workingWithAssistant && !selectedAssistant)}
                className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg"
              >
                {loading ? (
                  <Timer className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Clock className="h-5 w-5 mr-2" />
                )}
                Clock In
              </Button>

              {/* Validation Messages */}
              {(!currentLocation || (workingWithAssistant && !selectedAssistant)) && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm text-yellow-800">
                      {!currentLocation && "Location is required. "}
                      {workingWithAssistant && !selectedAssistant && "Please select an assistant. "}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Available Assistants Summary */}
        {!currentSession && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Available Assistants ({getAvailableAssistants().length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getAvailableAssistants().map((assistant) => (
                  <div key={assistant.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{assistant.name}</div>
                      <div className="text-sm text-gray-600">{assistant.role.replace('_', ' ')}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getExperienceColor(assistant.experienceLevel)}>
                        {assistant.experienceLevel}
                      </Badge>
                      <Badge className={getStatusColor(assistant.status)}>
                        {assistant.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {getAvailableAssistants().length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No assistants available in your warehouse today.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
