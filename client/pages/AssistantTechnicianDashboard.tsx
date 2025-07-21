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
} from "lucide-react";
import { teamJobs, getJobsByStatus } from "../data/sharedJobs";

export default function AssistantTechnicianDashboard() {
  const [workingHours, setWorkingHours] = useState("6:45");
  const [distanceTraveled, setDistanceTraveled] = useState("28.3");
  const navigate = useNavigate();

  const stats = {
    assignedJobs: getJobsByStatus('assigned').length,
    acceptedJobs: getJobsByStatus('accepted').length,
    inProgressJobs: getJobsByStatus('in-progress').length,
    completedJobs: getJobsByStatus('completed').length,
  };

  const dashboardCards = [
    {
      id: "jobs",
      title: "Jobs",
      icon: Briefcase,
      color: "bg-orange-500",
      description: `${stats.assignedJobs + stats.acceptedJobs + stats.inProgressJobs} active jobs`,
      action: () => navigate('/technician/jobs'),
    },
    {
      id: "safety",
      title: "Health & Safety",
      icon: Shield,
      color: "bg-orange-500",
      description: "Safety checklists and incident reports",
      action: () => navigate('/technician/safety'),
    },
    {
      id: "fleet",
      title: "Fleet",
      icon: Truck,
      color: "bg-orange-500",
      description: "Vehicle and tool inspections",
      action: () => navigate('/technician/fleet'),
    },
    {
      id: "overtime",
      title: "Capture Overtime",
      icon: Timer,
      color: "bg-orange-500",
      description: "Log overtime hours worked",
      action: () => navigate('/technician/overtime'),
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
        // Open navigation menu
        break;
      case "analytics":
        navigate('/technician/analytics');
        break;
      case "sync":
        // Sync data
        break;
      case "close":
        navigate('/login');
        break;
    }
  };

  const handleClockOut = () => {
    navigate('/clock-in');
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

        {/* Clock Out Button */}
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
      </div>

      {/* Main Content */}
      <div className="p-6">
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
                  <p className="text-sm text-gray-600">{card.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Job Status Summary */}
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-md">
          <h3 className="font-semibold text-gray-800 mb-4">Today's Job Status</h3>
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
                    onClick={() => navigate('/technician/jobs')}
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
