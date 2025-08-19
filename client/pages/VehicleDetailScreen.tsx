import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Truck,
  MapPin,
  Fuel,
  Gauge,
  User,
  Calendar,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Activity,
  FileText,
  Camera,
  Settings,
  TrendingUp,
  TrendingDown,
  Zap,
  Shield,
  ThermometerSun,
  Battery,
  ArrowLeft,
} from "lucide-react";

interface Vehicle {
  id: string;
  registration: string;
  type: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelLevel: number;
  status: "active" | "maintenance" | "inactive";
  assignedDriver: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  lastService: string;
  nextService: string;
  insuranceExpiry: string;
  licenseExpiry: string;
}

interface HealthData {
  overall: number;
  engine: number;
  brakes: number;
  tires: number;
  battery: number;
  transmission: number;
  temperature: number;
}

interface PredictiveMaintenance {
  component: string;
  daysUntilService: number;
  confidence: number;
  priority: "high" | "medium" | "low";
  description: string;
}

export default function VehicleDetailScreen() {
  const { vehicleId } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [reportIssueOpen, setReportIssueOpen] = useState(false);
  const [scheduleMaintenanceOpen, setScheduleMaintenanceOpen] = useState(false);
  const [assignDriverOpen, setAssignDriverOpen] = useState(false);

  // Mock vehicle data
  const vehicle: Vehicle = {
    id: vehicleId || "FL-001",
    registration: "EL-123-ABC",
    type: "Van",
    make: "Ford",
    model: "Transit",
    year: 2021,
    mileage: 45230,
    fuelLevel: 68,
    status: "active",
    assignedDriver: "Clement Masinge",
    location: {
      lat: -33.0153,
      lng: 27.9116,
      address: "123 Main Street, East London",
    },
    lastService: "2024-01-15",
    nextService: "2024-03-15",
    insuranceExpiry: "2024-06-30",
    licenseExpiry: "2024-08-15",
  };

  const healthData: HealthData = {
    overall: 87,
    engine: 92,
    brakes: 78,
    tires: 85,
    battery: 94,
    transmission: 89,
    temperature: 82,
  };

  const predictiveMaintenance: PredictiveMaintenance[] = [
    {
      component: "Brake Pads",
      daysUntilService: 12,
      confidence: 89,
      priority: "high",
      description: "Based on usage patterns and current wear, brake pads will need replacement soon",
    },
    {
      component: "Oil Change",
      daysUntilService: 28,
      confidence: 95,
      priority: "medium",
      description: "Regular oil change due based on mileage and time intervals",
    },
    {
      component: "Tire Rotation",
      daysUntilService: 45,
      confidence: 76,
      priority: "low",
      description: "Tire wear patterns suggest rotation needed for optimal performance",
    },
  ];

  // Mock historical data
  const performanceData = [
    { date: "Jan", fuelEfficiency: 28.5, mileage: 2500, engineHealth: 92 },
    { date: "Feb", fuelEfficiency: 27.8, mileage: 2800, engineHealth: 91 },
    { date: "Mar", fuelEfficiency: 29.2, mileage: 2650, engineHealth: 90 },
    { date: "Apr", fuelEfficiency: 28.9, mileage: 2900, engineHealth: 89 },
    { date: "May", fuelEfficiency: 27.5, mileage: 3100, engineHealth: 88 },
    { date: "Jun", fuelEfficiency: 28.1, mileage: 2750, engineHealth: 87 },
  ];

  const maintenanceHistory = [
    {
      id: "1",
      date: "2024-01-15",
      type: "Scheduled Service",
      description: "Oil change, filter replacement, general inspection",
      cost: 450,
      status: "completed",
      technician: "Mike Johnson",
    },
    {
      id: "2",
      date: "2023-11-20",
      type: "Brake Service",
      description: "Brake pad replacement, brake fluid change",
      cost: 680,
      status: "completed",
      technician: "Sarah Williams",
    },
    {
      id: "3",
      date: "2023-09-10",
      type: "Tire Service",
      description: "Tire rotation and alignment",
      cost: 120,
      status: "completed",
      technician: "David Brown",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "maintenance": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 90) return "text-green-600";
    if (health >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {vehicle.registration}
            </h1>
            <p className="text-muted-foreground">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </p>
          </div>
          <Badge className={getStatusColor(vehicle.status)}>
            {vehicle.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Dialog open={reportIssueOpen} onOpenChange={setReportIssueOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Issue
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Vehicle Issue</DialogTitle>
                <DialogDescription>
                  Report any issues or concerns with this vehicle
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="issue-type">Issue Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mechanical">Mechanical</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="body">Body Damage</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setReportIssueOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setReportIssueOpen(false)}>
                    Submit Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={scheduleMaintenanceOpen} onOpenChange={setScheduleMaintenanceOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Wrench className="h-4 w-4 mr-2" />
                Schedule Maintenance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Maintenance</DialogTitle>
                <DialogDescription>
                  Schedule maintenance for {vehicle.registration}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="maintenance-type">Maintenance Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select maintenance type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled Service</SelectItem>
                      <SelectItem value="oil">Oil Change</SelectItem>
                      <SelectItem value="brakes">Brake Service</SelectItem>
                      <SelectItem value="tires">Tire Service</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scheduled-date">Scheduled Date</Label>
                  <Input type="date" id="scheduled-date" />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Additional notes or special instructions..."
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setScheduleMaintenanceOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setScheduleMaintenanceOpen(false)}>
                    Schedule
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={assignDriverOpen} onOpenChange={setAssignDriverOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <User className="h-4 w-4 mr-2" />
                Assign Driver
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Driver</DialogTitle>
                <DialogDescription>
                  Assign or change the driver for {vehicle.registration}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="driver">Select Driver</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a driver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clement">Clement Masinge</SelectItem>
                      <SelectItem value="thabo">Thabo Matlou</SelectItem>
                      <SelectItem value="thabitha">Thabitha Ndlovu</SelectItem>
                      <SelectItem value="mike">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setAssignDriverOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setAssignDriverOpen(false)}>
                    Assign
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="health">Health & Diagnostics</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Vehicle Profile */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{vehicle.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Activity className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Mileage</p>
                    <p className="font-medium">{vehicle.mileage.toLocaleString()} km</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Assigned Driver</p>
                    <p className="font-medium">{vehicle.assignedDriver}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium text-sm">{vehicle.location.address}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Fuel className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Fuel Level</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={vehicle.fuelLevel} className="flex-1" />
                      <span className="text-sm font-medium">{vehicle.fuelLevel}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Gauge className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Overall Health</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={healthData.overall} className="flex-1" />
                      <span className={`text-sm font-medium ${getHealthColor(healthData.overall)}`}>
                        {healthData.overall}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Insurance</span>
                  <Badge variant="outline" className="text-green-600">
                    Valid until {new Date(vehicle.insuranceExpiry).toLocaleDateString()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">License</span>
                  <Badge variant="outline" className="text-green-600">
                    Valid until {new Date(vehicle.licenseExpiry).toLocaleDateString()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Service</span>
                  <span className="text-sm">
                    {new Date(vehicle.lastService).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Next Service</span>
                  <span className="text-sm font-medium text-yellow-600">
                    {new Date(vehicle.nextService).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Charts */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="fuelEfficiency" stroke="#3b82f6" strokeWidth={2} name="Fuel Efficiency (MPG)" />
                  <Line yAxisId="right" type="monotone" dataKey="engineHealth" stroke="#10b981" strokeWidth={2} name="Engine Health %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="health" className="space-y-6">
          {/* Health Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Engine", value: healthData.engine, icon: Zap },
              { name: "Brakes", value: healthData.brakes, icon: Shield },
              { name: "Tires", value: healthData.tires, icon: Activity },
              { name: "Battery", value: healthData.battery, icon: Battery },
            ].map((component) => (
              <Card key={component.name}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{component.name}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`text-2xl font-bold ${getHealthColor(component.value)}`}>
                          {component.value}%
                        </span>
                      </div>
                      <Progress value={component.value} className="mt-2" />
                    </div>
                    <component.icon className={`h-8 w-8 ${getHealthColor(component.value)}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Predictive Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                AI Predictive Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictiveMaintenance.map((item, index) => (
                  <Alert key={index} className={`border-l-4 ${
                    item.priority === 'high' ? 'border-l-red-500' :
                    item.priority === 'medium' ? 'border-l-yellow-500' : 'border-l-green-500'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{item.component}</h4>
                          <Badge className={getPriorityColor(item.priority)}>
                            {item.priority} priority
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {item.confidence}% confidence
                          </span>
                        </div>
                        <AlertDescription className="text-sm mb-2">
                          {item.description}
                        </AlertDescription>
                        <p className="text-sm font-medium">
                          Estimated service needed in {item.daysUntilService} days
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Schedule Service
                      </Button>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Live Diagnostics */}
          <Card>
            <CardHeader>
              <CardTitle>Live Engine Diagnostics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <ThermometerSun className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-muted-foreground">Engine Temp</p>
                  <p className="text-lg font-bold">82°C</p>
                  <p className="text-xs text-green-600">Normal</p>
                </div>
                <div className="text-center">
                  <Gauge className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-muted-foreground">Oil Pressure</p>
                  <p className="text-lg font-bold">45 PSI</p>
                  <p className="text-xs text-green-600">Good</p>
                </div>
                <div className="text-center">
                  <Activity className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                  <p className="text-sm text-muted-foreground">RPM</p>
                  <p className="text-lg font-bold">1,850</p>
                  <p className="text-xs text-green-600">Normal</p>
                </div>
                <div className="text-center">
                  <Battery className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-muted-foreground">Battery</p>
                  <p className="text-lg font-bold">12.6V</p>
                  <p className="text-xs text-green-600">Excellent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          {/* Maintenance Queue */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <Calendar className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Next Service Due:</strong> {new Date(vehicle.nextService).toLocaleDateString()} - Scheduled maintenance service
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-3">
                  {predictiveMaintenance.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{item.component}</h4>
                        <p className="text-sm text-muted-foreground">
                          Due in {item.daysUntilService} days
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                        <Button size="sm">Schedule</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parts Integration */}
          <Card>
            <CardHeader>
              <CardTitle>Parts Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Brake Pads (Set)</p>
                    <p className="text-sm text-muted-foreground">Part #: BP-FORD-001</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                    <p className="text-sm text-muted-foreground">Qty: 4</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Engine Oil (5L)</p>
                    <p className="text-sm text-muted-foreground">Part #: OIL-5W30-001</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                    <p className="text-sm text-muted-foreground">Qty: 12</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <p className="font-medium">Air Filter</p>
                    <p className="text-sm text-muted-foreground">Part #: AF-FORD-003</p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-yellow-100 text-yellow-800">Low Stock</Badge>
                    <p className="text-sm text-muted-foreground">Qty: 1</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Maintenance History */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceHistory.map((record) => (
                  <div key={record.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Wrench className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{record.type}</h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {record.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm">Technician: {record.technician}</span>
                        <span className="text-sm font-medium">R{record.cost}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Inspection History */}
          <Card>
            <CardHeader>
              <CardTitle>Inspection History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Safety Inspection</h4>
                      <span className="text-sm text-muted-foreground">2024-01-20</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      All safety checks passed. Minor wear on brake pads noted.
                    </p>
                    <Badge className="mt-2 bg-green-100 text-green-800">Passed</Badge>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Pre-Trip Inspection</h4>
                      <span className="text-sm text-muted-foreground">2024-01-18</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Tire pressure low in rear left tire. Corrected before trip.
                    </p>
                    <Badge className="mt-2 bg-yellow-100 text-yellow-800">Attention Required</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
