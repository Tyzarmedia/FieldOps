import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  PieChart,
  Cloud,
  X,
  Briefcase,
  Shield,
  Truck,
  Clock,
  Timer,
  Calendar,
  Package2,
  Network,
  Settings,
  LogOut,
  UserCheck,
} from "lucide-react";
import { teamJobs, getJobsByStatus } from "../data/sharedJobs";

export default function TechnicianDashboard() {
  const [workingHours, setWorkingHours] = useState("0:00");
  const [distanceTraveled, setDistanceTraveled] = useState("0.0");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [isClocked, setIsClocked] = useState(false);
  const [hasSignedOffJobs, setHasSignedOffJobs] = useState(false);
  const navigate = useNavigate();

  const stats = {
    assignedJobs: getJobsByStatus("assigned").length,
    acceptedJobs: getJobsByStatus("accepted").length,
    inProgressJobs: getJobsByStatus("in-progress").length,
    completedJobs: getJobsByStatus("completed").length,
  };

  const sideNavItems = [
    { name: "Apply Leave", href: "/apply-leave", icon: Calendar },
    { name: "Stock on Hand", href: "/stock-on-hand", icon: Package2 },
    { name: "Network Assessment", href: "/network-assessment", icon: Network },
    { name: "Overtime List", href: "/overtime-list", icon: Timer },
    { name: "Settings", href: "/technician-settings", icon: Settings },
  ];

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

  // Initialize state from localStorage once on mount
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
  }, []); // Empty dependency array - only run once on mount

  // Separate effect for interval management
  useEffect(() => {
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

  const handleMenuAction = (action: string) => {
    switch (action) {
      case "menu":
        setSidebarOpen(true);
        break;
      case "analytics":
        navigate("/technician/analytics");
        break;
      case "sync":
        // Sync data
        break;
      case "close":
        navigate("/login");
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const handleClockOut = () => {
    // Check if all active jobs are signed off
    if (!hasSignedOffJobs) {
      alert("Please sign off all completed jobs before clocking out.");
      return;
    }

    // Stop time tracking
    setIsClocked(false);
    setClockInTime(null);
    localStorage.removeItem('clockInTime');
    localStorage.setItem('isClocked', 'false');

    // Record clock out time
    localStorage.setItem('clockOutTime', new Date().toISOString());

    navigate("/clock-in");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo and close button */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                FieldOps
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">Technician</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {sideNavItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setSidebarOpen(false);
                  }}
                  className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-b-3xl sm:-my-1">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => handleMenuAction("menu")}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => handleMenuAction("close")}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Stats Display */}
        <div className="flex justify-between items-center">
          <div className="text-center">
            <div className="text-4xl font-bold">{workingHours}</div>
            <div className="text-sm opacity-90 font-medium">HRS</div>
            <div className="mt-2">
              <Badge className="bg-white/20 text-white border-none">
                Worked Today
              </Badge>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">{distanceTraveled}</div>
            <div className="text-sm opacity-90 font-medium">KMS</div>
            <div className="mt-2">
              <Badge className="bg-white/20 text-white border-none">
                Traveled Today
              </Badge>
            </div>
          </div>
        </div>

        {/* Clock Out Button - Only show if clocked in and has signed off jobs */}
        {isClocked && hasSignedOffJobs && (
          <div className="mt-6 text-center">
            <Button
              onClick={handleClockOut}
              className="w-full max-w-xs bg-white/20 text-white border-white/30 hover:bg-white/30 transition-all duration-300"
              variant="outline"
            >
              <Clock className="h-4 w-4 mr-2" />
              Clock Out
            </Button>
          </div>
        )}

        {/* Sign Off Reminder */}
        {isClocked && !hasSignedOffJobs && (
          <div className="mt-4 text-center">
            <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg text-sm">
              Complete and sign off jobs to enable clock out
            </div>
          </div>
        )}

        {/* Clock In Button - Show if not clocked in */}
        {!isClocked && (
          <div className="mt-6 text-center">
            <Button
              onClick={() => {
                const now = new Date();
                setClockInTime(now);
                setIsClocked(true);
                localStorage.setItem('clockInTime', now.toISOString());
                localStorage.setItem('isClocked', 'true');
              }}
              className="w-full max-w-xs bg-green-500 text-white border-green-600 hover:bg-green-600 transition-all duration-300"
              variant="outline"
            >
              <Clock className="h-4 w-4 mr-2" />
              Clock In
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Job Status Summary - Moved to top */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6 sm:pb-12">
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

        {/* Dashboard Cards Grid - Only 4 cards */}
        <div className="grid grid-cols-2 gap-4">
          {dashboardCards.map((card) => {
            const IconComponent = card.icon;
            return (
              <Card
                key={card.id}
                className="bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
                onClick={card.action}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className={`${card.color} p-4 rounded-2xl`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {card.title}
                  </h3>
                </CardContent>
              </Card>
            );
          })}
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
    </div>
  );
}
