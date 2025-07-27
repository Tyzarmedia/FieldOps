import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Shield,
  Truck,
  Timer,
  Calendar,
  Package2,
  Network,
  Settings,
  FileText,
  Camera,
  Package,
  PenTool,
  Clock,
  User,
  RotateCcw,
} from "lucide-react";
import { teamJobs, getJobsByStatus } from "../data/sharedJobs";

export default function TechnicianDashboardSimplified() {
  const [workingHours, setWorkingHours] = useState("0:00");
  const [distanceTraveled, setDistanceTraveled] = useState("0.0");
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [isClocked, setIsClocked] = useState(false);
  const [hasSignedOffJobs, setHasSignedOffJobs] = useState(false);
  const [currentJob, setCurrentJob] = useState<any>(null);
  const navigate = useNavigate();

  const stats = {
    assignedJobs: getJobsByStatus("assigned").length,
    acceptedJobs: getJobsByStatus("accepted").length,
    inProgressJobs: getJobsByStatus("in-progress").length,
    completedJobs: getJobsByStatus("completed").length,
  };

  const dashboardCards = [
    {
      id: "jobs",
      title: "Jobs",
      icon: Briefcase,
      color: "bg-orange-500",
      description: `${stats.assignedJobs + stats.acceptedJobs + stats.inProgressJobs} active jobs`,
      action: () => navigate("/technician/jobs"),
    },
    {
      id: "safety",
      title: "Health & Safety",
      icon: Shield,
      color: "bg-orange-500",
      description: "Safety checklists and incident reports",
      action: () => navigate("/technician/safety"),
    },
    {
      id: "fleet",
      title: "Fleet",
      icon: Truck,
      color: "bg-orange-500",
      description: "Vehicle and tool inspections",
      action: () => navigate("/technician/fleet"),
    },
    {
      id: "overtime",
      title: "Capture Overtime",
      icon: Timer,
      color: "bg-orange-500",
      description: "Log overtime hours worked",
      action: () => navigate("/technician/overtime"),
    },
  ];

  useEffect(() => {
    // Check if user is clocked in
    const clockInData = localStorage.getItem('clockInTime');
    const isClockInStatus = localStorage.getItem('isClocked') === 'true';
    
    if (clockInData && isClockInStatus) {
      setClockInTime(new Date(clockInData));
      setIsClocked(true);
    }
    
    // Check for signed off jobs
    const signedOffJobs = Object.keys(localStorage)
      .filter(key => key.includes('_completed'))
      .some(key => localStorage.getItem(key) === 'true');
    setHasSignedOffJobs(signedOffJobs);
    
    // Get current active job
    const activeJob = teamJobs.find(job => job.status === 'in-progress');
    setCurrentJob(activeJob);
    
    // Update working hours every second when clocked in
    let interval: NodeJS.Timeout;
    if (isClocked && clockInTime) {
      interval = setInterval(() => {
        updateWorkingHours();
        updateDistanceTraveled();
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isClocked, clockInTime]);

  const updateWorkingHours = () => {
    if (!clockInTime) return;
    
    const now = new Date();
    const diffMs = now.getTime() - clockInTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    
    setWorkingHours(`${hours}:${minutes.toString().padStart(2, "0")}`);
  };
  
  const updateDistanceTraveled = () => {
    // Simulate distance tracking - in real app this would use GPS
    const baseDistance = parseFloat(distanceTraveled);
    const increment = Math.random() * 0.1; // Random small increment
    const newDistance = (baseDistance + increment).toFixed(1);
    setDistanceTraveled(newDistance);
  };

  const handleClockIn = () => {
    const now = new Date();
    setClockInTime(now);
    setIsClocked(true);
    localStorage.setItem('clockInTime', now.toISOString());
    localStorage.setItem('isClocked', 'true');
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Simplified Header - No side menu or clock out button */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <User className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs opacity-80">Technician</p>
            </div>
          </div>
          
          {/* Only show timer when clocked in */}
          {isClocked && (
            <div className="text-right">
              <div className="text-2xl font-bold">{workingHours}</div>
              <div className="text-xs opacity-80">Working Time</div>
            </div>
          )}
        </div>

        {/* Stats Display */}
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-3xl font-bold">{distanceTraveled}</div>
            <div className="text-sm opacity-90 font-medium">KMS</div>
            <div className="mt-1">
              <Badge className="bg-white/20 text-white border-none text-xs">
                Traveled Today
              </Badge>
            </div>
          </div>
          
          {/* Current Job Status */}
          {currentJob && (
            <div className="text-center">
              <div className="text-lg font-bold">Active Job</div>
              <div className="text-sm opacity-90">{currentJob.client.name}</div>
              <Badge className="bg-green-500 text-white mt-1">
                In Progress
              </Badge>
            </div>
          )}
          
          {/* Clock In Button - Only show if not clocked in */}
          {!isClocked && (
            <div className="text-center">
              <Button
                onClick={handleClockIn}
                className="bg-green-500 text-white border-green-600 hover:bg-green-600"
                size="sm"
              >
                <Clock className="h-4 w-4 mr-2" />
                Clock In
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Update Button Fixed at Top */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 p-3">
        <Button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => {
            // Sync all job data
            console.log("Syncing job data...");
          }}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Update Jobs
        </Button>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Job Status Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-md mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">
            Today's Job Status
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.assignedJobs}
              </div>
              <div className="text-sm text-gray-600">Assigned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.acceptedJobs}
              </div>
              <div className="text-sm text-gray-600">Accepted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {stats.inProgressJobs}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.completedJobs}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {dashboardCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Card
                key={card.id}
                className="bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
                onClick={card.action}
              >
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <div className={`${card.color} p-3 rounded-2xl`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    {card.title}
                  </h3>
                  <p className="text-xs text-gray-600">{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
            onClick={() => navigate("/stock-on-hand")}
          >
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-blue-500 p-3 rounded-2xl">
                  <Package2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">Stock on Hand</h3>
            </CardContent>
          </Card>
          
          <Card 
            className="bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
            onClick={() => navigate("/network-assessment")}
          >
            <CardContent className="p-4 text-center">
              <div className="flex justify-center mb-3">
                <div className="bg-purple-500 p-3 rounded-2xl">
                  <Network className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">Network Assessment</h3>
            </CardContent>
          </Card>
        </div>

        {/* Latest Job */}
        {teamJobs.length > 0 && (
          <div className="mt-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-800">
                      Latest Job: {teamJobs[0].title}
                    </h4>
                    <p className="text-sm text-blue-600">
                      {teamJobs[0].client.name}
                    </p>
                    <p className="text-xs text-blue-500 mt-1">
                      Status: {teamJobs[0].status.toUpperCase()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => navigate("/technician/jobs")}
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Persistent Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around py-3">
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 p-3 text-blue-600"
            onClick={() => navigate("/technician/jobs")}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs font-medium">Jobs</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 p-3 text-gray-600"
            onClick={() => navigate("/technician/udf")}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs font-medium">UDF</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 p-3 text-gray-600"
            onClick={() => navigate("/technician/gallery")}
          >
            <Camera className="h-5 w-5" />
            <span className="text-xs font-medium">Gallery</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 p-3 text-gray-600"
            onClick={() => navigate("/technician/stock")}
          >
            <Package className="h-5 w-5" />
            <span className="text-xs font-medium">Stock</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 p-3 text-orange-600"
            onClick={() => navigate("/technician/signoff")}
          >
            <PenTool className="h-5 w-5" />
            <span className="text-xs font-medium">Sign Off</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
