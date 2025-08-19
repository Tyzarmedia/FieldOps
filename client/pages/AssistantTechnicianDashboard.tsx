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
import { authManager } from "@/utils/auth";

export default function AssistantTechnicianDashboard() {
  const [workingHours, setWorkingHours] = useState("0:00");
  const [distanceTraveled, setDistanceTraveled] = useState("0.0");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assignedJobs, setAssignedJobs] = useState<any[]>([]);
  const [assignedTechnician, setAssignedTechnician] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch assistant's assigned jobs from technician
  useEffect(() => {
    const fetchAssistantJobs = async () => {
      try {
        setLoading(true);
        const authUser = authManager.getUser();

        if (!authUser?.employeeId) {
          console.error("No employee ID found");
          return;
        }

        const response = await authManager.makeAuthenticatedRequest(
          `/api/job-mgmt/jobs/assistant/${authUser.employeeId}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAssignedJobs(data.data || []);
            setAssignedTechnician(data.technicianId);
          }
        } else {
          console.error("Failed to fetch assistant jobs");
          setAssignedJobs([]);
        }
      } catch (error) {
        console.error("Error fetching assistant jobs:", error);
        setAssignedJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssistantJobs();

    // Refresh jobs every 30 seconds
    const interval = setInterval(fetchAssistantJobs, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update time and distance from localStorage
  useEffect(() => {
    const updateTimeAndDistance = () => {
      const clockInTime = localStorage.getItem("clockInTime");
      const isClockedIn = localStorage.getItem("isClockedIn");

      if (clockInTime && isClockedIn === "true") {
        const now = new Date();
        const clockIn = new Date(clockInTime);
        const diffInMinutes = Math.floor(
          (now.getTime() - clockIn.getTime()) / (1000 * 60),
        );
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;
        setWorkingHours(`${hours}:${minutes.toString().padStart(2, "0")}`);

        // Simulate distance based on time (0.5 km per hour)
        const distanceKm = (diffInMinutes / 60) * 0.5;
        setDistanceTraveled(distanceKm.toFixed(1));
      }
    };

    updateTimeAndDistance();
    const interval = setInterval(updateTimeAndDistance, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const stats = {
    assignedJobs: assignedJobs.filter(job => job.status === "Assigned").length,
    acceptedJobs: assignedJobs.filter(job => job.status === "Accepted").length,
    inProgressJobs: assignedJobs.filter(job => job.status === "In Progress").length,
    completedJobs: assignedJobs.filter(job => job.status === "Completed").length,
    pendingReview: assignedJobs.filter(job => job.status === "Pending Technician Review").length,
    totalJobs: assignedJobs.length,
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
      title: "Assigned Jobs",
      icon: Briefcase,
      color: "bg-orange-500",
      description: assignedTechnician
        ? `${stats.totalJobs} jobs from technician (${stats.inProgressJobs} active)`
        : "No technician assigned",
      action: () => navigate("/assistant/jobs"),
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
      title: "View Overtime",
      icon: Timer,
      color: "bg-gray-400",
      description: "View your overtime records",
      action: () => navigate("/technician/overtime"),
      disabled: true,
    },
  ];

  useEffect(() => {
    // Update working hours every minute
    const interval = setInterval(() => {
      updateWorkingHours();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const updateWorkingHours = () => {
    const [hours, minutes] = workingHours.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + 1;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    setWorkingHours(`${newHours}:${newMinutes.toString().padStart(2, "0")}`);
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
        navigate("/clock-in");
        break;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const handleClockOut = () => {
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
                <p className="text-xs text-gray-500">Assistant Technician</p>
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
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-b-3xl">
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
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Job Status Summary - Moved to top */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-6">
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
                className={`bg-white transition-all duration-300 border-0 shadow-md ${
                  card.disabled
                    ? "cursor-not-allowed opacity-60"
                    : "hover:shadow-lg cursor-pointer"
                }`}
                onClick={card.disabled ? undefined : card.action}
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
                  <p className="text-sm text-gray-600">{card.description}</p>
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
