import { useState, useEffect } from "react";
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
  Calendar,
  Database,
  Clock,
  MapPin,
  Phone,
  Camera,
  FileText,
  BookOpen,
  MessageSquare,
  Target,
  Award,
  Wrench,
  Package,
} from "lucide-react";

export default function AssistantTechnicianDashboard() {
  const [clockedIn, setClockedIn] = useState(true);
  const [workingHours, setWorkingHours] = useState("6:45");
  const [distanceTraveled, setDistanceTraveled] = useState("28.3");
  const [systemData, setSystemData] = useState<any>(null);

  const assistantStats = {
    activeAssignments: 2,
    completedTasks: 5,
    photosTaken: 8,
    checklistsCompleted: 3,
    trainingProgress: 65,
    supervisorRating: 4.1,
    hoursWorked: "6h 45m",
    supportingTeam: "Field Team Alpha",
  };

  const dashboardCards = [
    {
      id: "assignments",
      title: "My Assignments",
      icon: Briefcase,
      color: "bg-orange-500",
      description: `${assistantStats.activeAssignments} active assignments`,
      action: () => handleCardAction("assignments"),
    },
    {
      id: "safety",
      title: "Health & Safety",
      icon: Shield,
      color: "bg-orange-500",
      description: "Safety guidelines and checklists",
      action: () => handleCardAction("safety"),
    },
    {
      id: "overtime",
      title: "Capture Overtime",
      icon: Calendar,
      color: "bg-orange-500",
      description: "Log overtime hours",
      action: () => handleCardAction("overtime"),
    },
    {
      id: "overtime-list",
      title: "Overtime List",
      icon: Database,
      color: "bg-orange-500",
      description: "View overtime records",
      action: () => handleCardAction("overtime-list"),
    },
    {
      id: "tools",
      title: "Tools & Resources",
      icon: Wrench,
      color: "bg-orange-500",
      description: "Available tools and equipment",
      action: () => handleCardAction("tools"),
    },
    {
      id: "documentation",
      title: "Documentation",
      icon: Camera,
      color: "bg-orange-500",
      description: `${assistantStats.photosTaken} photos taken today`,
      action: () => handleCardAction("documentation"),
    },
    {
      id: "training",
      title: "Training",
      icon: BookOpen,
      color: "bg-orange-500",
      description: `${assistantStats.trainingProgress}% completed`,
      action: () => handleCardAction("training"),
    },
    {
      id: "schedule",
      title: "Schedule",
      icon: Calendar,
      color: "bg-orange-500",
      description: "Today's schedule and tasks",
      action: () => handleCardAction("schedule"),
    },
  ];

  useEffect(() => {
    loadSystemData();
    // Update working hours every minute
    const interval = setInterval(() => {
      if (clockedIn) {
        updateWorkingHours();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [clockedIn]);

  const loadSystemData = async () => {
    try {
      const response = await fetch("/data/database.json");
      const data = await response.json();
      setSystemData(data);
    } catch (error) {
      console.error("Failed to load system data:", error);
    }
  };

  const updateWorkingHours = () => {
    // This would typically calculate actual working hours
    // For demo purposes, we'll just increment
    const [hours, minutes] = workingHours.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + 1;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    setWorkingHours(`${newHours}:${newMinutes.toString().padStart(2, "0")}`);
  };

  const handleClockInOut = () => {
    setClockedIn(!clockedIn);
    if (!clockedIn) {
      setWorkingHours("0:00");
      setDistanceTraveled("0.0");
    }
  };

  const handleCardAction = (cardId: string) => {
    switch (cardId) {
      case "assignments":
        alert("Opening My Assignments...");
        break;
      case "safety":
        alert("Opening Health & Safety protocols...");
        break;
      case "overtime":
        alert("Opening Overtime capture form...");
        break;
      case "overtime-list":
        alert("Opening Overtime records...");
        break;
      case "tools":
        alert("Opening Tools & Resources...");
        break;
      case "documentation":
        alert("Opening Documentation & Photos...");
        break;
      case "training":
        alert("Opening Training modules...");
        break;
      case "schedule":
        alert("Opening Today's Schedule...");
        break;
      default:
        alert(`Opening ${cardId}...`);
    }
  };

  const handleMenuAction = (action: string) => {
    switch (action) {
      case "menu":
        alert("Opening navigation menu...");
        break;
      case "analytics":
        alert("Opening analytics dashboard...");
        break;
      case "sync":
        alert("Syncing data with server...");
        break;
      case "close":
        alert("Closing application...");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => handleMenuAction("analytics")}
            >
              <PieChart className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => handleMenuAction("sync")}
            >
              <Cloud className="h-6 w-6" />
            </Button>
          </div>
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
                Supporting Team
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

        {/* Clock In/Out Button */}
        <div className="mt-6 text-center">
          <Button
            onClick={handleClockInOut}
            className={`w-full max-w-xs ${
              clockedIn
                ? "bg-white/20 text-white border-white/30"
                : "bg-white text-orange-600"
            } hover:bg-white/30 transition-all duration-300`}
            variant="outline"
          >
            <Clock className="h-4 w-4 mr-2" />
            {clockedIn ? "Clock Out" : "Clock In"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Dashboard Cards Grid */}
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
                  <p className="text-sm text-gray-600">{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-semibold text-gray-800 mb-4">Today's Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {assistantStats.completedTasks}
              </div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {assistantStats.photosTaken}
              </div>
              <div className="text-sm text-gray-600">Photos Taken</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {assistantStats.supervisorRating}
              </div>
              <div className="text-sm text-gray-600">Supervisor Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {assistantStats.trainingProgress}%
              </div>
              <div className="text-sm text-gray-600">Training Progress</div>
            </div>
          </div>
        </div>

        {/* Current Assignment */}
        <div className="mt-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-800">
                    Current Assignment
                  </h4>
                  <p className="text-sm text-blue-600">
                    Assisting with HVAC Installation
                  </p>
                  <p className="text-xs text-blue-500 mt-1">
                    Lead: John Smith • Downtown Office Complex
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => alert("Opening current assignment details...")}
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Contact */}
        <div className="mt-4">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-red-800">
                    Emergency Contact
                  </h4>
                  <p className="text-sm text-red-600">24/7 Support Available</p>
                </div>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => alert("Calling emergency support...")}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
