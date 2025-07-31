import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Truck,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Fuel,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Plus,
  FileX,
  Activity,
  FileText,
} from "lucide-react";

interface MissingInspection {
  technicianId: string;
  technicianName: string;
  lastInspection: string | null;
}

interface Inspection {
  id: string;
  type: string;
  submittedBy: string;
  submittedAt: string;
  items: Array<{
    name: string;
    status: string;
    notes: string;
  }>;
}

export default function EnhancedFleetManagerDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [missingInspections, setMissingInspections] = useState<
    MissingInspection[]
  >([]);
  const [inspections, setInspections] = useState<Inspection[]>([]);

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

  // Fetch missing inspections and inspection data
  useEffect(() => {
    const fetchInspectionData = async () => {
      try {
        const [missingResponse, inspectionsResponse] = await Promise.all([
          fetch("/api/inspections/missing"),
          fetch("/api/inspections"),
        ]);

        if (missingResponse.ok) {
          const missingData = await missingResponse.json();
          setMissingInspections(missingData.missingInspections || []);
        }

        if (inspectionsResponse.ok) {
          const inspectionsData = await inspectionsResponse.json();
          setInspections(inspectionsData.inspections || []);
        }
      } catch (error) {
        console.error("Failed to fetch inspection data:", error);
        // Set mock data for demo
        setMissingInspections([
          {
            technicianId: "E001",
            technicianName: "John Smith",
            lastInspection: "2024-01-19",
          },
          {
            technicianId: "E003",
            technicianName: "Mike Chen",
            lastInspection: null,
          },
        ]);
        setInspections([
          {
            id: "INS001",
            type: "vehicle",
            submittedBy: "E002",
            submittedAt: "2024-01-21T07:30:00Z",
            items: [
              { name: "Tires", status: "good", notes: "" },
              { name: "Brakes", status: "attention", notes: "Minor squeaking" },
            ],
          },
        ]);
      }
    };

    fetchInspectionData();
  }, []);

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
      color: missingInspections.length > 0 ? "bg-red-500" : "bg-green-500",
      description:
        missingInspections.length > 0
          ? `${missingInspections.length} missing inspections`
          : "All inspections up to date",
      action: () => handleCardAction("inspections"),
      alert: missingInspections.length > 0,
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
  ];

  const handleCardAction = (cardId: string) => {
    switch (cardId) {
      case "fleet-overview":
        alert("Opening Fleet Overview...");
        break;
      case "inspections":
        alert("Opening Fleet Inspections...");
        break;
      case "maintenance":
        alert("Opening Maintenance Management...");
        break;
      default:
        alert(`Opening ${cardId}...`);
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

      {/* Missing Inspections Alert */}
      {missingInspections.length > 0 && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Missing Inspections Alert:</strong>{" "}
            {missingInspections.length} technician(s) have not submitted their
            daily inspections.
            <div className="mt-2 space-y-1">
              {missingInspections.slice(0, 3).map((missing) => (
                <div key={missing.technicianId} className="text-sm">
                  • {missing.technicianName} -{" "}
                  {missing.lastInspection
                    ? `Last: ${new Date(missing.lastInspection).toLocaleDateString()}`
                    : "Never submitted"}
                </div>
              ))}
              {missingInspections.length > 3 && (
                <div className="text-sm">
                  ... and {missingInspections.length - 3} more
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>
      )}

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
              <p className="text-sm text-gray-600">Missing Inspections</p>
              <p
                className={`text-2xl font-bold ${missingInspections.length > 0 ? "text-red-600" : "text-green-600"}`}
              >
                {missingInspections.length}
              </p>
            </div>
            <FileX
              className={`h-8 w-8 ${missingInspections.length > 0 ? "text-red-500" : "text-green-500"}`}
            />
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
      </div>

      {/* Recent Inspections */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileX className="h-5 w-5" />
            Recent Inspections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {inspections.slice(0, 5).map((inspection) => (
              <div
                key={inspection.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <div className="font-medium">
                    {inspection.type === "vehicle" ? "Vehicle" : "Tool"}{" "}
                    Inspection
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: {inspection.id} •{" "}
                    {new Date(inspection.submittedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {inspection.items?.some(
                    (item) => item.status === "attention",
                  ) ? (
                    <Badge className="bg-orange-100 text-orange-800">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Needs Attention
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      All Good
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {inspections.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No recent inspections
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {dashboardCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card
              key={card.id}
              className={`bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md ${
                card.alert ? "ring-2 ring-red-200 ring-opacity-50" : ""
              }`}
              onClick={card.action}
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4 relative">
                  <div className={`${card.color} p-4 rounded-2xl`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  {card.alert && (
                    <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></div>
                  )}
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
