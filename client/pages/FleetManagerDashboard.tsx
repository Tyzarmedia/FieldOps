import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Users,
  Clock,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Navigation,
  Shield,
  Gauge,
  Clipboard,
  Package,
  Route,
  Car,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Camera,
  Phone,
} from "lucide-react";

export default function FleetManagerDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [systemData, setSystemData] = useState<any>(null);

  const fleetStats = {
    totalVehicles: 24,
    inUse: 18,
    idle: 4,
    underRepair: 2,
    complianceRate: 94.2,
    totalMileage: 15420,
    fuelEfficiency: 28.5,
    pendingMaintenance: 5,
    overdueMainternance: 2,
    openIncidents: 3,
    resolvedIncidents: 47,
    validDocuments: 22,
    expiringSoon: 3,
    totalFuelCost: 8450,
    utilizationRate: 87.5,
    toolsAssigned: 156,
    toolsMissing: 3,
  };

  const vehicles = [
    {
      id: "FL001",
      type: "Van",
      make: "Ford Transit",
      year: "2022",
      status: "In Use",
      assignedTo: "John Smith",
      location: "Downtown Office",
      mileage: 45230,
      fuelType: "Diesel",
      capacity: "3 Technicians",
      department: "HVAC",
      lastService: "2024-01-10",
      nextService: "2024-02-10",
      compliance: "Valid",
    },
    {
      id: "FL002",
      type: "Truck",
      make: "Toyota Hilux",
      year: "2021",
      status: "Idle",
      assignedTo: null,
      location: "Main Depot",
      mileage: 67890,
      fuelType: "Petrol",
      capacity: "2 Technicians",
      department: "Electrical",
      lastService: "2024-01-05",
      nextService: "2024-02-05",
      compliance: "Expiring Soon",
    },
    {
      id: "FL003",
      type: "Van",
      make: "Mercedes Sprinter",
      year: "2023",
      status: "Under Repair",
      assignedTo: null,
      location: "Service Center",
      mileage: 23450,
      fuelType: "Diesel",
      capacity: "4 Technicians",
      department: "Plumbing",
      lastService: "2023-12-20",
      nextService: "2024-01-20",
      compliance: "Valid",
    },
  ];

  const maintenanceSchedule = [
    {
      id: "M001",
      vehicleId: "FL001",
      vehicleName: "Ford Transit",
      type: "Regular Service",
      dueDate: "2024-02-10",
      status: "Upcoming",
      priority: "Medium",
      estimatedCost: 450,
      description: "Standard 6-month service and inspection",
    },
    {
      id: "M002",
      vehicleId: "FL003",
      vehicleName: "Mercedes Sprinter",
      type: "Brake Repair",
      dueDate: "2024-01-25",
      status: "Overdue",
      priority: "High",
      estimatedCost: 850,
      description: "Front brake pads replacement needed",
    },
    {
      id: "M003",
      vehicleId: "FL002",
      vehicleName: "Toyota Hilux",
      type: "Tire Replacement",
      dueDate: "2024-02-15",
      status: "Upcoming",
      priority: "Low",
      estimatedCost: 320,
      description: "Replace rear tires due to wear",
    },
  ];

  const incidents = [
    {
      id: "INC001",
      vehicleId: "FL001",
      vehicleName: "Ford Transit",
      type: "Minor Accident",
      reportedBy: "John Smith",
      date: "2024-01-20",
      status: "Open",
      priority: "High",
      description: "Minor collision while reversing at job site",
      location: "Downtown Office Building",
      estimatedCost: 1200,
    },
    {
      id: "INC002",
      vehicleId: "FL002",
      vehicleName: "Toyota Hilux",
      type: "Breakdown",
      reportedBy: "Mike Chen",
      date: "2024-01-18",
      status: "Under Review",
      priority: "Medium",
      description: "Engine overheating during highway travel",
      location: "Highway A1",
      estimatedCost: 800,
    },
  ];

  const fuelLogs = [
    {
      id: "F001",
      vehicleId: "FL001",
      vehicleName: "Ford Transit",
      date: "2024-01-20",
      litres: 65.5,
      cost: 98.25,
      mileage: 45230,
      efficiency: 12.5,
      technician: "John Smith",
      station: "Shell Downtown",
    },
    {
      id: "F002",
      vehicleId: "FL002",
      vehicleName: "Toyota Hilux",
      date: "2024-01-19",
      litres: 55.0,
      cost: 82.5,
      mileage: 67890,
      efficiency: 14.2,
      technician: "Mike Chen",
      station: "BP Main Street",
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in use":
        return "bg-success text-success-foreground";
      case "idle":
        return "bg-warning text-warning-foreground";
      case "under repair":
        return "bg-destructive text-destructive-foreground";
      case "upcoming":
        return "bg-info text-info-foreground";
      case "overdue":
        return "bg-destructive text-destructive-foreground";
      case "open":
        return "bg-warning text-warning-foreground";
      case "under review":
        return "bg-info text-info-foreground";
      case "resolved":
        return "bg-success text-success-foreground";
      case "valid":
        return "bg-success text-success-foreground";
      case "expiring soon":
        return "bg-warning text-warning-foreground";
      case "expired":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-info text-info-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const renderMainDashboard = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fleet</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetStats.totalVehicles}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-success" />
              <span>{fleetStats.inUse} in use</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fleetStats.utilizationRate}%
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-success" />
              <span>Above target</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fleetStats.pendingMaintenance}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3 text-warning" />
              <span>{fleetStats.overdueMainternance} overdue</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fleetStats.complianceRate}%
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>{fleetStats.expiringSoon} expiring soon</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Action Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("overview")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-500 p-4 rounded-2xl">
                <Truck className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Fleet Overview</h3>
            <p className="text-sm text-gray-600">
              {fleetStats.inUse} In Use | {fleetStats.idle} Idle
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("assignment")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-500 p-4 rounded-2xl">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Vehicle Assignment
            </h3>
            <p className="text-sm text-gray-600">
              {fleetStats.inUse} Assigned Today
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("maintenance")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-500 p-4 rounded-2xl">
                <Wrench className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Maintenance</h3>
            <p className="text-sm text-gray-600">
              {fleetStats.pendingMaintenance} Upcoming |{" "}
              {fleetStats.overdueMainternance} Overdue
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("incidents")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-500 p-4 rounded-2xl">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Incident Reports
            </h3>
            <p className="text-sm text-gray-600">
              {fleetStats.openIncidents} Open | {fleetStats.resolvedIncidents}{" "}
              Resolved
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("tracking")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-500 p-4 rounded-2xl">
                <MapPin className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Vehicle Tracking
            </h3>
            <p className="text-sm text-gray-600">Live GPS Feed</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("fuel")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-cyan-500 p-4 rounded-2xl">
                <Fuel className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Fuel Logs</h3>
            <p className="text-sm text-gray-600">
              $${fleetStats.totalFuelCost.toLocaleString()} This Month
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("utilization")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-500 p-4 rounded-2xl">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Fleet Utilization
            </h3>
            <p className="text-sm text-gray-600">
              {fleetStats.utilizationRate}% Usage Rate
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("compliance")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-500 p-4 rounded-2xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Vehicle Compliance
            </h3>
            <p className="text-sm text-gray-600">
              {fleetStats.validDocuments} Valid | {fleetStats.expiringSoon}{" "}
              Expiring
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("tools")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-500 p-4 rounded-2xl">
                <Package className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Tools Inventory
            </h3>
            <p className="text-sm text-gray-600">
              {fleetStats.toolsAssigned} Assigned | {fleetStats.toolsMissing}{" "}
              Missing
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("reports")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-teal-500 p-4 rounded-2xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Reports & Insights
            </h3>
            <p className="text-sm text-gray-600">Fleet Performance Reports</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderFleetOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Fleet Inventory</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{vehicle.id}</Badge>
                    <Badge className={getStatusColor(vehicle.status)}>
                      {vehicle.status}
                    </Badge>
                    <Badge className={getStatusColor(vehicle.compliance)}>
                      {vehicle.compliance}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{vehicle.make}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Type:</p>
                      <p>{vehicle.type}</p>
                    </div>
                    <div>
                      <p className="font-medium">Year:</p>
                      <p>{vehicle.year}</p>
                    </div>
                    <div>
                      <p className="font-medium">Mileage:</p>
                      <p>{vehicle.mileage.toLocaleString()} km</p>
                    </div>
                    <div>
                      <p className="font-medium">Fuel Type:</p>
                      <p>{vehicle.fuelType}</p>
                    </div>
                    <div>
                      <p className="font-medium">Capacity:</p>
                      <p>{vehicle.capacity}</p>
                    </div>
                    <div>
                      <p className="font-medium">Department:</p>
                      <p>{vehicle.department}</p>
                    </div>
                    <div>
                      <p className="font-medium">Assigned To:</p>
                      <p>{vehicle.assignedTo || "Unassigned"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Location:</p>
                      <p>{vehicle.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  Track
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Service
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMaintenance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Maintenance Tracker</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Schedule
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Maintenance
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {maintenanceSchedule.map((maintenance) => (
          <Card
            key={maintenance.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{maintenance.id}</Badge>
                    <Badge className={getStatusColor(maintenance.status)}>
                      {maintenance.status}
                    </Badge>
                    <Badge className={getPriorityColor(maintenance.priority)}>
                      {maintenance.priority}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg">
                    {maintenance.vehicleName}
                  </h3>
                  <p className="text-muted-foreground">{maintenance.type}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Due Date:</p>
                      <p>{maintenance.dueDate}</p>
                    </div>
                    <div>
                      <p className="font-medium">Estimated Cost:</p>
                      <p>${maintenance.estimatedCost}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">Description:</p>
                      <p>{maintenance.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
                <Button variant="outline" size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
                {maintenance.status === "Overdue" && (
                  <Button size="sm">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Urgent Action
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderIncidents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Incident Log</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Log Incident
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {incidents.map((incident) => (
          <Card key={incident.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{incident.id}</Badge>
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                    <Badge className={getPriorityColor(incident.priority)}>
                      {incident.priority}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg">
                    {incident.vehicleName}
                  </h3>
                  <p className="text-muted-foreground">{incident.type}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Reported By:</p>
                      <p>{incident.reportedBy}</p>
                    </div>
                    <div>
                      <p className="font-medium">Date:</p>
                      <p>{incident.date}</p>
                    </div>
                    <div>
                      <p className="font-medium">Location:</p>
                      <p>{incident.location}</p>
                    </div>
                    <div>
                      <p className="font-medium">Estimated Cost:</p>
                      <p>${incident.estimatedCost}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">Description:</p>
                      <p>{incident.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Attach Photos
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Insurance
                </Button>
                <Button size="sm">
                  <Wrench className="h-4 w-4 mr-2" />
                  Assign Mechanic
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderFuelLogs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Fuel & Expense Logs</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Fuel Entry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Fuel Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Cost:</span>
                <span className="font-bold">
                  ${fleetStats.totalFuelCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Average Efficiency:</span>
                <span className="font-bold">
                  {fleetStats.fuelEfficiency} L/100km
                </span>
              </div>
              <div className="flex justify-between">
                <span>Total Litres:</span>
                <span className="font-bold">5,640L</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Fuel Consumers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Ford Transit (FL001):</span>
                <span className="font-bold">$1,450</span>
              </div>
              <div className="flex justify-between">
                <span>Mercedes Sprinter (FL003):</span>
                <span className="font-bold">$1,280</span>
              </div>
              <div className="flex justify-between">
                <span>Toyota Hilux (FL002):</span>
                <span className="font-bold">$890</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {fuelLogs.map((log) => (
          <Card key={log.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{log.id}</Badge>
                    <Badge variant="secondary">{log.vehicleName}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Date:</p>
                      <p>{log.date}</p>
                    </div>
                    <div>
                      <p className="font-medium">Litres:</p>
                      <p>{log.litres}L</p>
                    </div>
                    <div>
                      <p className="font-medium">Cost:</p>
                      <p>${log.cost}</p>
                    </div>
                    <div>
                      <p className="font-medium">Efficiency:</p>
                      <p>{log.efficiency} L/100km</p>
                    </div>
                    <div>
                      <p className="font-medium">Technician:</p>
                      <p>{log.technician}</p>
                    </div>
                    <div>
                      <p className="font-medium">Station:</p>
                      <p>{log.station}</p>
                    </div>
                    <div>
                      <p className="font-medium">Mileage:</p>
                      <p>{log.mileage.toLocaleString()} km</p>
                    </div>
                    <div>
                      <p className="font-medium">Receipt:</p>
                      <Button variant="link" className="p-0 h-auto">
                        <Camera className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Entry
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Update Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return renderFleetOverview();
      case "maintenance":
        return renderMaintenance();
      case "incidents":
        return renderIncidents();
      case "fuel":
        return renderFuelLogs();
      case "assignment":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Vehicle Assignment Manager</h2>
            <p className="text-muted-foreground">
              Vehicle assignment functionality coming soon...
            </p>
          </div>
        );
      case "tracking":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Fleet Location Map</h2>
            <p className="text-muted-foreground">
              Live GPS tracking functionality coming soon...
            </p>
          </div>
        );
      case "utilization":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Utilization Analysis</h2>
            <p className="text-muted-foreground">
              Fleet utilization analytics coming soon...
            </p>
          </div>
        );
      case "compliance":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Fleet Compliance</h2>
            <p className="text-muted-foreground">
              Compliance management functionality coming soon...
            </p>
          </div>
        );
      case "tools":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Fleet Tool Manager</h2>
            <p className="text-muted-foreground">
              Tool inventory management coming soon...
            </p>
          </div>
        );
      case "reports":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Reports Center</h2>
            <p className="text-muted-foreground">
              Fleet reporting functionality coming soon...
            </p>
          </div>
        );
      default:
        return renderMainDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Fleet Manager Dashboard
            </h1>
            <p className="text-muted-foreground">
              Complete fleet management and vehicle operations
            </p>
          </div>
          {activeSection !== "main" && (
            <Button variant="outline" onClick={() => setActiveSection("main")}>
              ← Back to Dashboard
            </Button>
          )}
        </div>
      </div>

      {renderSection()}
    </div>
  );
}
