import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NotificationSystem } from "@/components/NotificationSystem";
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

interface JobStats {
  assigned: number;
  accepted: number;
  inProgress: number;
  completed: number;
}

interface UserData {
  name: string;
  role: string;
  employeeId: string;
}

export default function TechnicianDashboard() {
  const [workingHours, setWorkingHours] = useState("0:00");
  const [distanceTraveled, setDistanceTraveled] = useState("0.0");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobStats, setJobStats] = useState<JobStats>({
    assigned: 0,
    accepted: 0,
    inProgress: 0,
    completed: 0,
  });
  const [userData, setUserData] = useState<UserData>({
    name: "Loading...",
    role: "Technician",
    employeeId: "",
  });
  const [latestJob, setLatestJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data from database
  const fetchUserData = async () => {
    try {
      const employeeId =
        localStorage.getItem("employeeId") ||
        localStorage.getItem("userName") ||
        "tech001";
      const response = await fetch(`/api/db/employees/${employeeId}`);

      // Check if response is ok before trying to read body
      if (!response.ok) {
        console.log(
          "Employee API not available or returned error status:",
          response.status,
        );
        // Fallback to localStorage
        const userName = localStorage.getItem("userName") || "John Doe";
        const userRole = localStorage.getItem("userRole") || "Technician";
        setUserData({ name: userName, role: userRole, employeeId });
        return;
      }

      // Safely parse JSON response
      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.log("Employee API returned invalid JSON:", jsonError);
        // Fallback to localStorage
        const userName = localStorage.getItem("userName") || "John Doe";
        const userRole = localStorage.getItem("userRole") || "Technician";
        setUserData({ name: userName, role: userRole, employeeId });
        return;
      }

      if (result.success && result.data) {
        setUserData({
          name: `${result.data.firstName} ${result.data.lastName}`,
          role: result.data.role,
          employeeId: result.data.employeeId,
        });
      } else {
        // Fallback to localStorage if no database record
        const userName = localStorage.getItem("userName") || "John Doe";
        const userRole = localStorage.getItem("userRole") || "Technician";
        setUserData({ name: userName, role: userRole, employeeId: employeeId });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Fallback to localStorage
      const userName = localStorage.getItem("userName") || "John Doe";
      const userRole = localStorage.getItem("userRole") || "Technician";
      const employeeId = localStorage.getItem("employeeId") || "tech001";
      setUserData({ name: userName, role: userRole, employeeId });
    }
  };

  // Fetch job statistics from job management API
  const fetchJobStats = async () => {
    try {
      const employeeId =
        userData.employeeId || localStorage.getItem("employeeId") || "tech001";

      // Add network timeout and error handling
      const fetchWithTimeout = (url: string, timeout = 5000) => {
        return Promise.race([
          fetch(url),
          new Promise<Response>((_, reject) =>
            setTimeout(() => reject(new Error('Network timeout')), timeout)
          )
        ]);
      };

      // Fetch jobs for technician
      const jobsResponse = await fetchWithTimeout(
        `/api/job-mgmt/jobs/technician/${employeeId}`,
      );

      if (jobsResponse.ok) {
        try {
          const jobsResult = await jobsResponse.json();

          if (jobsResult.success && jobsResult.data) {
            const jobs = jobsResult.data;
            const stats = {
              assigned: jobs.filter(
                (job: any) =>
                  job.status === "Open" || job.status === "Assigned",
              ).length,
              accepted: jobs.filter((job: any) => job.status === "Accepted")
                .length,
              inProgress: jobs.filter(
                (job: any) => job.status === "In Progress",
              ).length,
              completed: jobs.filter(
                (job: any) =>
                  job.status === "Completed" || job.status === "Closed",
              ).length,
            };
            setJobStats(stats);

            // Cache successful job stats for offline use
            localStorage.setItem('technicianJobStats', JSON.stringify(stats));
            localStorage.setItem('technicianJobStatsTimestamp', Date.now().toString());

            // Get latest job
            const sortedJobs = jobs.sort(
              (a: any, b: any) =>
                new Date(b.lastModified || b.createdDate).getTime() -
                new Date(a.lastModified || a.createdDate).getTime(),
            );
            if (sortedJobs.length > 0) {
              setLatestJob(sortedJobs[0]);
            }
          }
        } catch (jsonError) {
          console.log("Jobs API returned invalid JSON:", jsonError);
        }
      }

      // Also try the stats endpoint for more accurate data
      const statsResponse = await fetchWithTimeout(
        `/api/job-mgmt/jobs/stats/${employeeId}`,
      );

      if (statsResponse.ok) {
        try {
          const statsResult = await statsResponse.json();

          if (statsResult.success && statsResult.data) {
            setJobStats(statsResult.data);
          }
        } catch (jsonError) {
          console.log("Stats API returned invalid JSON:", jsonError);
        }
      }
    } catch (error) {
      console.error("Error fetching job stats:", error);
      // Use cached data or default values when network fails
      const cachedStats = localStorage.getItem('technicianJobStats');
      if (cachedStats) {
        try {
          setJobStats(JSON.parse(cachedStats));
          console.log('Using cached job stats due to network error');
        } catch (parseError) {
          console.warn('Failed to parse cached job stats:', parseError);
        }
      }
      // Keep default values if no cache available
    }
  };

  // Fetch real-time clock data from database
  const fetchClockData = async () => {
    try {
      const employeeId =
        userData.employeeId || localStorage.getItem("employeeId") || "tech001";
      const today = new Date().toISOString().split("T")[0];

      // Add network timeout and error handling
      const fetchWithTimeout = (url: string, timeout = 5000) => {
        return Promise.race([
          fetch(url),
          new Promise<Response>((_, reject) =>
            setTimeout(() => reject(new Error('Network timeout')), timeout)
          )
        ]);
      };

      const response = await fetchWithTimeout(
        `/api/db/clock-records/${employeeId}/${today}`,
      );

      // Check if the response is ok and has content
      if (!response.ok) {
        console.log(
          `Clock data API returned ${response.status}: ${response.statusText}`,
        );
        updateTimeAndDistanceFromStorage();
        return;
      }

      // Check if response has content to parse
      const contentLength = response.headers.get("content-length");
      if (contentLength === "0") {
        console.log("Clock data API returned empty response");
        updateTimeAndDistanceFromStorage();
        return;
      }

      // Safely parse JSON response
      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.log("Clock data API returned invalid JSON:", jsonError);
        updateTimeAndDistanceFromStorage();
        return;
      }

      if (result.success && result.data) {
        const clockRecord = result.data;
        setWorkingHours(formatHours(clockRecord.totalWorkingHours || 0));
        setDistanceTraveled(clockRecord.totalDistance?.toFixed(1) || "0.0");
        console.log("Clock data loaded from database");
      } else {
        // API returned valid JSON but no data found - use localStorage fallback
        console.log("No clock data in database, using localStorage fallback");
        updateTimeAndDistanceFromStorage();
      }
    } catch (error) {
      console.error("Error fetching clock data:", error);
      // Always fallback to localStorage when network fails
      console.log('Using localStorage fallback due to network/database error');
      updateTimeAndDistanceFromStorage();
    }
  };

  // Format hours for display
  const formatHours = (totalHours: number) => {
    const hours = Math.floor(totalHours);
    const minutes = Math.floor((totalHours - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  // Fallback function for localStorage
  const updateTimeAndDistanceFromStorage = () => {
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

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);

      // Set default employeeId if not present (for testing)
      if (!localStorage.getItem("employeeId")) {
        localStorage.setItem("employeeId", "tech001");
      }

      await fetchUserData();
      await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
      await fetchJobStats();
      await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
      await fetchClockData();
      setIsLoading(false);
    };

    loadInitialData();

    // Set up real-time updates every minute
    const interval = setInterval(() => {
      fetchJobStats();
      fetchClockData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Update job stats when user data changes
  useEffect(() => {
    if (userData.employeeId) {
      fetchJobStats();
    }
  }, [userData.employeeId]);

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
      description: `${jobStats.assigned + jobStats.accepted + jobStats.inProgress} active jobs`,
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
                <p className="text-sm font-medium text-gray-900">
                  {userData.name}
                </p>
                <p className="text-xs text-gray-500">{userData.role}</p>
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

          <div className="flex items-center space-x-2">
            <NotificationSystem
              technicianId={userData.employeeId || "tech001"}
            />
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => handleMenuAction("close")}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
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
                {isLoading ? "..." : jobStats.assigned}
              </div>
              <div className="text-sm text-gray-600">Assigned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {isLoading ? "..." : jobStats.accepted}
              </div>
              <div className="text-sm text-gray-600">Accepted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {isLoading ? "..." : jobStats.inProgress}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {isLoading ? "..." : jobStats.completed}
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
        {latestJob && (
          <div className="mt-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-800">
                      Latest Job: {latestJob.title}
                    </h4>
                    <p className="text-sm text-blue-600">
                      {latestJob.client?.name || "Client Name"}
                    </p>
                    <p className="text-xs text-blue-500 mt-1">
                      Status: {latestJob.status?.toUpperCase() || "PENDING"}
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
