import { useState, useEffect } from "react";
import { useNotification } from "@/hooks/useNotification";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Truck,
  Fuel,
  Settings,
  AlertTriangle,
  CheckCircle,
  Calendar,
  MapPin,
  Wrench,
  Activity,
  FileText,
  Plus,
  BarChart3,
} from "lucide-react";

export default function FleetManagerDashboard() {
  const [systemData, setSystemData] = useState<any>(null);
  const { showNotification } = useNotification();

  const fleetStats = {
    totalVehicles: 24,
    activeVehicles: 20,
    inMaintenance: 2,
    availableVehicles: 2,
    complianceRate: 94.2,
    totalMileage: 15420,
    fuelEfficiency: 28.5,
    pendingInspections: 3,
  };

  const dashboardCards = [
    {
      id: "fleet-overview",
      title: "Fleet Overview",
      icon: Truck,
      color: "bg-blue-500",
      description: `${fleetStats.activeVehicles}/${fleetStats.totalVehicles} vehicles active`,
      action: () => handleCardAction("fleet-overview"),
    },
    {
      id: "inspections",
      title: "Inspections",
      icon: CheckCircle,
      color: "bg-green-500",
      description: `${fleetStats.pendingInspections} pending inspections`,
      action: () => handleCardAction("inspections"),
    },
    {
      id: "maintenance",
      title: "Maintenance",
      icon: Wrench,
      color: "bg-orange-500",
      description: `${fleetStats.inMaintenance} vehicles in maintenance`,
      action: () => handleCardAction("maintenance"),
    },
    {
      id: "compliance",
      title: "Compliance",
      icon: Settings,
      color: "bg-purple-500",
      description: `${fleetStats.complianceRate}% compliance rate`,
      action: () => handleCardAction("compliance"),
    },
    {
      id: "fuel-efficiency",
      title: "Fuel Efficiency",
      icon: Fuel,
      color: "bg-cyan-500",
      description: `${fleetStats.fuelEfficiency} MPG average`,
      action: () => handleCardAction("fuel-efficiency"),
    },
    {
      id: "mileage",
      title: "Mileage Tracking",
      icon: MapPin,
      color: "bg-indigo-500",
      description: `${fleetStats.totalMileage.toLocaleString()} total miles`,
      action: () => handleCardAction("mileage"),
    },
    {
      id: "alerts",
      title: "Fleet Alerts",
      icon: AlertTriangle,
      color: "bg-red-500",
      description: "Monitor vehicle alerts and issues",
      action: () => handleCardAction("alerts"),
    },
    {
      id: "reports",
      title: "Fleet Reports",
      icon: FileText,
      color: "bg-slate-500",
      description: "Generate fleet performance reports",
      action: () => handleCardAction("reports"),
    },
    {
      id: "schedule",
      title: "Schedule",
      icon: Calendar,
      color: "bg-emerald-500",
      description: "Manage inspection and maintenance schedules",
      action: () => handleCardAction("schedule"),
    },
    {
      id: "add-vehicle",
      title: "Add Vehicle",
      icon: Plus,
      color: "bg-pink-500",
      description: "Register new vehicle to fleet",
      action: () => handleCardAction("add-vehicle"),
    },
    {
      id: "analytics",
      title: "Fleet Analytics",
      icon: BarChart3,
      color: "bg-teal-500",
      description: "Detailed fleet performance analytics",
      action: () => handleCardAction("analytics"),
    },
    {
      id: "activity",
      title: "Fleet Activity",
      icon: Activity,
      color: "bg-yellow-500",
      description: "Real-time fleet activity monitoring",
      action: () => handleCardAction("activity"),
    },
  ];

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    try {
      const response = await fetch("/data/database.json");
      const data = await response.json();
      setSystemData(data);
    } catch (error) {
      console.error("Failed to load system data:", error);
    }
  };

  const handleCardAction = (cardId: string) => {
    switch (cardId) {
      case "fleet-overview":
        showNotification.info("Fleet Overview", "Opening Fleet Overview...");
        break;
      case "inspections":
        showNotification.info("Fleet Inspections", "Opening Fleet Inspections...");
        break;
      case "maintenance":
        showNotification.info("Maintenance", "Opening Maintenance Management...");
        break;
      case "compliance":
        showNotification.info("Compliance", "Opening Compliance Dashboard...");
        break;
      case "fuel-efficiency":
        showNotification.info("Fuel Efficiency", "Opening Fuel Efficiency Reports...");
        break;
      case "mileage":
        showNotification.info("Mileage Tracking", "Opening Mileage Tracking...");
        break;
      case "alerts":
        showNotification.info("Fleet Alerts", "Opening Fleet Alerts...");
        break;
      case "reports":
        showNotification.info("Fleet Reports", "Opening Fleet Reports...");
        break;
      case "schedule":
        showNotification.info("Scheduling", "Opening Scheduling System...");
        break;
      case "add-vehicle":
        showNotification.info("Add Vehicle", "Opening Add Vehicle Form...");
        break;
      case "analytics":
        showNotification.info("Analytics", "Opening Fleet Analytics...");
        break;
      case "activity":
        showNotification.info("Activity Monitor", "Opening Fleet Activity Monitor...");
        break;
      default:
        showNotification.info("Action", `Opening ${cardId}...`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Fleet Manager Dashboard
        </h1>
        <p className="text-gray-600">
          Complete fleet management and vehicle tracking
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Vehicles</p>
              <p className="text-2xl font-bold text-blue-600">
                {fleetStats.activeVehicles}/{fleetStats.totalVehicles}
              </p>
            </div>
            <Truck className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Compliance</p>
              <p className="text-2xl font-bold text-green-600">
                {fleetStats.complianceRate}%
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fuel Efficiency</p>
              <p className="text-2xl font-bold text-cyan-600">
                {fleetStats.fuelEfficiency} MPG
              </p>
            </div>
            <Fuel className="h-8 w-8 text-cyan-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Tasks</p>
              <p className="text-2xl font-bold text-orange-600">
                {fleetStats.pendingInspections}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-md">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Scheduling fleet inspection...")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Schedule Inspection
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Opening inspection calendar...")}
          >
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Opening maintenance schedule...")}
          >
            <Wrench className="h-4 w-4 mr-2" />
            Maintenance
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Generating fleet report...")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>
    </div>
  );
}
