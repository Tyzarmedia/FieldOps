import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  ClipboardList,
  Plus,
  User,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Calendar,
  FileText,
  Users,
  Activity,
  Timer,
  MessageSquare,
  Package,
  Truck,
  TrendingUp,
  Bell,
  Route,
  Navigation,
  PhoneCall,
  Send,
  Upload,
  Download,
  Search,
  Filter,
  RefreshCw,
  Zap,
  Target,
  BarChart3,
  Settings,
  AlertTriangle,
  Gauge,
  Car,
  Wrench,
  Fuel,
  Camera,
  Headphones,
  Clock3,
  UserCheck,
  ArrowRight,
  Phone,
} from "lucide-react";

export default function CoordinatorDashboard() {
  const [activeSection, setActiveSection] = useState("main");
  const [selectedTechnician, setSelectedTechnician] = useState("");

  const coordinatorStats = {
    unassignedJobs: 12,
    activeJobs: 28,
    totalTechnicians: 15,
    onlineToday: 12,
    clockedIn: 14,
    overdueJobs: 3,
    pendingRequests: 7,
    availableVehicles: 8,
    completedToday: 23,
    productivity: 87.5,
    alerts: 5,
    teamMessages: 3,
  };

  const unassignedJobs = [
    {
      id: "J101",
      title: "HVAC System Repair",
      location: "Downtown Office Building",
      priority: "High",
      urgency: "Emergency",
      estimatedTime: "3h",
      requiredSkills: ["HVAC", "Electrical"],
      area: "Downtown",
      type: "Repair",
      reportedBy: "Building Manager",
      description:
        "Air conditioning system completely down in main office area",
    },
    {
      id: "J102",
      title: "Plumbing Inspection",
      location: "Residential Complex A",
      priority: "Medium",
      urgency: "Standard",
      estimatedTime: "2h",
      requiredSkills: ["Plumbing"],
      area: "Midtown",
      type: "Inspection",
      reportedBy: "Property Manager",
      description: "Routine plumbing inspection for compliance",
    },
    {
      id: "J103",
      title: "Electrical Panel Upgrade",
      location: "Industrial Warehouse",
      priority: "Low",
      urgency: "Scheduled",
      estimatedTime: "5h",
      requiredSkills: ["Electrical", "Safety"],
      area: "Industrial",
      type: "Upgrade",
      reportedBy: "Facility Manager",
      description: "Scheduled electrical panel upgrade for improved capacity",
    },
  ];

  const activeTechnicians = [
    {
      id: 1,
      name: "John Smith",
      status: "On Site",
      location: "Downtown Office",
      currentJob: "J087",
      skills: ["HVAC", "General"],
      phone: "+1-555-0101",
      eta: "30 min",
      efficiency: 94.2,
      jobsToday: 4,
      clockedIn: true,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      status: "Traveling",
      location: "En route to Midtown",
      currentJob: "J089",
      skills: ["Electrical", "Safety"],
      phone: "+1-555-0102",
      eta: "15 min",
      efficiency: 96.8,
      jobsToday: 3,
      clockedIn: true,
    },
    {
      id: 3,
      name: "Mike Chen",
      status: "Idle",
      location: "Main Depot",
      currentJob: null,
      skills: ["Plumbing", "HVAC"],
      phone: "+1-555-0103",
      eta: "Available",
      efficiency: 88.5,
      jobsToday: 2,
      clockedIn: true,
    },
    {
      id: 4,
      name: "Emma Wilson",
      status: "On Break",
      location: "Industrial Area",
      currentJob: "J091",
      skills: ["Emergency", "General"],
      phone: "+1-555-0104",
      eta: "10 min",
      efficiency: 92.1,
      jobsToday: 5,
      clockedIn: true,
    },
    {
      id: 5,
      name: "David Brown",
      status: "Offline",
      location: "Unknown",
      currentJob: null,
      skills: ["Electrical", "HVAC"],
      phone: "+1-555-0105",
      eta: "N/A",
      efficiency: 85.3,
      jobsToday: 0,
      clockedIn: false,
    },
  ];

  const todaysSchedule = [
    {
      time: "08:00",
      technician: "John Smith",
      job: "HVAC Maintenance",
      location: "Office Complex",
      status: "Completed",
    },
    {
      time: "09:30",
      technician: "Sarah Johnson",
      job: "Electrical Inspection",
      location: "Retail Store",
      status: "Completed",
    },
    {
      time: "11:00",
      technician: "Mike Chen",
      job: "Plumbing Repair",
      location: "Residential",
      status: "In Progress",
    },
    {
      time: "13:00",
      technician: "Emma Wilson",
      job: "Emergency Call",
      location: "Hospital",
      status: "Pending",
    },
    {
      time: "14:30",
      technician: "John Smith",
      job: "HVAC Installation",
      location: "New Building",
      status: "Pending",
    },
    {
      time: "16:00",
      technician: "Sarah Johnson",
      job: "Safety Check",
      location: "Factory",
      status: "Pending",
    },
  ];

  const activeAlerts = [
    {
      id: 1,
      type: "Job Delayed",
      message: "Job J087 is 45 minutes overdue",
      technician: "John Smith",
      priority: "High",
      time: "14:30",
      action: "Escalate",
    },
    {
      id: 2,
      type: "SLA Missed",
      message: "Job J085 exceeded 4-hour SLA",
      technician: "Mike Chen",
      priority: "Critical",
      time: "13:15",
      action: "Manager Review",
    },
    {
      id: 3,
      type: "Support Request",
      message: "Sarah Johnson requesting backup",
      technician: "Sarah Johnson",
      priority: "Medium",
      time: "12:00",
      action: "Assign Backup",
    },
    {
      id: 4,
      type: "Unplanned Leave",
      message: "David Brown called in sick",
      technician: "David Brown",
      priority: "Medium",
      time: "07:30",
      action: "Reassign Jobs",
    },
  ];

  const stockRequests = [
    {
      id: "SR001",
      technician: "John Smith",
      items: ["HVAC Filter", "Thermostat"],
      quantity: "2, 1",
      urgency: "High",
      jobId: "J087",
      requestTime: "13:45",
      status: "Pending",
    },
    {
      id: "SR002",
      technician: "Sarah Johnson",
      items: ["Electrical Wire", "Circuit Breaker"],
      quantity: "50m, 1",
      urgency: "Medium",
      jobId: "J089",
      requestTime: "12:30",
      status: "Approved",
    },
    {
      id: "SR003",
      technician: "Mike Chen",
      items: ["Pipe Fitting", "Sealant"],
      quantity: "5, 2",
      urgency: "Low",
      jobId: "J090",
      requestTime: "11:15",
      status: "Delivered",
    },
  ];

  const fleetStatus = [
    {
      id: "FL001",
      type: "Van",
      assignedTo: "John Smith",
      status: "In Use",
      location: "Downtown",
      fuel: "75%",
      nextService: "2024-02-15",
    },
    {
      id: "FL002",
      type: "Truck",
      assignedTo: "Sarah Johnson",
      status: "In Use",
      location: "Midtown",
      fuel: "60%",
      nextService: "2024-02-20",
    },
    {
      id: "FL003",
      type: "Van",
      assignedTo: null,
      status: "Available",
      location: "Main Depot",
      fuel: "90%",
      nextService: "2024-02-10",
    },
    {
      id: "FL004",
      type: "Truck",
      assignedTo: "Mike Chen",
      status: "In Use",
      location: "Industrial",
      fuel: "45%",
      nextService: "2024-02-25",
    },
  ];

  useEffect(() => {
    // Load coordinator data
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-success text-success-foreground";
      case "in progress":
        return "bg-primary text-primary-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "on site":
        return "bg-info text-info-foreground";
      case "traveling":
        return "bg-primary text-primary-foreground";
      case "idle":
      case "available":
        return "bg-success text-success-foreground";
      case "on break":
        return "bg-warning text-warning-foreground";
      case "offline":
        return "bg-destructive text-destructive-foreground";
      case "high":
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-info text-info-foreground";
      case "emergency":
        return "bg-red-600 text-white";
      case "approved":
      case "delivered":
        return "bg-success text-success-foreground";
      case "in use":
        return "bg-primary text-primary-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const renderMainDashboard = () => (
    <div className="space-y-6">
      {/* Quick Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unassigned Jobs</p>
                <p className="text-2xl font-bold text-warning">
                  {coordinatorStats.unassignedJobs}
                </p>
              </div>
              <ClipboardList className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
                <p className="text-2xl font-bold text-primary">
                  {coordinatorStats.activeJobs}
                </p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Online Today</p>
                <p className="text-2xl font-bold text-success">
                  {coordinatorStats.onlineToday}
                </p>
              </div>
              <Users className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Productivity</p>
                <p className="text-2xl font-bold text-success">
                  {coordinatorStats.productivity}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Operational Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("dispatch")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-500 p-4 rounded-2xl">
                <ClipboardList className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Job Dispatch Center
            </h3>
            <p className="text-sm text-gray-600">
              {coordinatorStats.unassignedJobs} Unassigned |{" "}
              {coordinatorStats.activeJobs} Active
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("map")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-500 p-4 rounded-2xl">
                <MapPin className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Live Technician Map
            </h3>
            <p className="text-sm text-gray-600">Technician Tracker</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("schedule")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-500 p-4 rounded-2xl">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Today's Plan</h3>
            <p className="text-sm text-gray-600">Daily Job Schedule</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("clock")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-500 p-4 rounded-2xl">
                <Clock className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Check-In/Out Monitor
            </h3>
            <p className="text-sm text-gray-600">
              {coordinatorStats.clockedIn} Clocked In
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("alerts")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-500 p-4 rounded-2xl">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Alerts & Issues
            </h3>
            <p className="text-sm text-gray-600">
              {coordinatorStats.alerts} Escalations
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("communication")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-cyan-500 p-4 rounded-2xl">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Team Communication
            </h3>
            <p className="text-sm text-gray-600">
              {coordinatorStats.teamMessages} Internal Chat
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("stock")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-500 p-4 rounded-2xl">
                <Package className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Stock Requests</h3>
            <p className="text-sm text-gray-600">
              {coordinatorStats.pendingRequests} Pending Requests
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("fleet")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-500 p-4 rounded-2xl">
                <Truck className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Fleet Status</h3>
            <p className="text-sm text-gray-600">
              {coordinatorStats.availableVehicles} Available Vehicles
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("metrics")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-pink-500 p-4 rounded-2xl">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              KPIs for the Day
            </h3>
            <p className="text-sm text-gray-600">
              {coordinatorStats.completedToday} Today's Progress
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
                <Zap className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Quick Tools</h3>
            <p className="text-sm text-gray-600">Shortcuts</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderJobDispatch = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Job Assignment & Tracker</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Quick Assign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unassigned Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Unassigned Jobs ({unassignedJobs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {unassignedJobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-border rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{job.id}</Badge>
                        <Badge className={getStatusColor(job.priority)}>
                          {job.priority}
                        </Badge>
                        <Badge className={getStatusColor(job.urgency)}>
                          {job.urgency}
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {job.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>📍 {job.location}</div>
                        <div>⏱️ {job.estimatedTime}</div>
                        <div>🏢 {job.area}</div>
                        <div>🔧 {job.requiredSkills.join(", ")}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Assign to..." />
                      </SelectTrigger>
                      <SelectContent>
                        {activeTechnicians
                          .filter(
                            (t) =>
                              t.status === "Idle" || t.status === "Available",
                          )
                          .map((tech) => (
                            <SelectItem key={tech.id} value={tech.name}>
                              {tech.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Assign
                    </Button>
                    <Button variant="outline" size="sm">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Escalate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Technicians */}
        <Card>
          <CardHeader>
            <CardTitle>Available Technicians</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTechnicians.map((tech) => (
                <div
                  key={tech.id}
                  className="border border-border rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold">{tech.name}</h4>
                        <Badge className={getStatusColor(tech.status)}>
                          {tech.status}
                        </Badge>
                        {tech.clockedIn && (
                          <Badge variant="secondary">Clocked In</Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>📍 {tech.location}</p>
                        <p>🔧 {tech.skills.join(", ")}</p>
                        <p>
                          📊 {tech.efficiency}% efficiency | {tech.jobsToday}{" "}
                          jobs today
                        </p>
                        <p>📞 {tech.phone}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold">{tech.eta}</p>
                      {tech.currentJob && (
                        <p className="text-muted-foreground">
                          Job: {tech.currentJob}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      Locate
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTodaysSchedule = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Day Planner</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Job
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todaysSchedule.map((item, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="font-bold text-lg">{item.time}</p>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.job}</h4>
                      <p className="text-sm text-muted-foreground">
                        👤 {item.technician} | 📍 {item.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAlertsIssues = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Alert Center</h2>
        <div className="flex space-x-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Alerts</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Alerts ({activeAlerts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className="border border-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getStatusColor(alert.priority)}>
                        {alert.priority}
                      </Badge>
                      <Badge variant="outline">{alert.type}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {alert.time}
                      </span>
                    </div>
                    <h4 className="font-semibold">{alert.message}</h4>
                    <p className="text-sm text-muted-foreground">
                      👤 {alert.technician}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button size="sm">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    {alert.action}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Technician
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStockRequests = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Stock Request Manager</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Manual Request
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Stock Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stockRequests.map((request) => (
              <div
                key={request.id}
                className="border border-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">{request.id}</Badge>
                      <Badge className={getStatusColor(request.urgency)}>
                        {request.urgency}
                      </Badge>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                    <h4 className="font-semibold">👤 {request.technician}</h4>
                    <div className="text-sm text-muted-foreground mt-2">
                      <p>📦 Items: {request.items.join(", ")}</p>
                      <p>📊 Quantity: {request.quantity}</p>
                      <p>🔧 Job ID: {request.jobId}</p>
                      <p>⏰ Requested: {request.requestTime}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {request.status === "Pending" && (
                    <>
                      <Button size="sm" className="bg-success">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button variant="outline" size="sm">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Escalate
                      </Button>
                    </>
                  )}
                  {request.status === "Approved" && (
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Track Delivery
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFleetStatus = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Fleet View</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
          <Button>
            <Car className="h-4 w-4 mr-2" />
            Book Vehicle
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vehicle Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fleetStatus.map((vehicle) => (
              <div
                key={vehicle.id}
                className="border border-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">{vehicle.id}</Badge>
                      <Badge className={getStatusColor(vehicle.status)}>
                        {vehicle.status}
                      </Badge>
                      <span className="font-semibold">{vehicle.type}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        👤 Assigned to: {vehicle.assignedTo || "Unassigned"}
                      </p>
                      <p>📍 Location: {vehicle.location}</p>
                      <p>⛽ Fuel: {vehicle.fuel}</p>
                      <p>🔧 Next Service: {vehicle.nextService}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <MapPin className="h-4 w-4 mr-2" />
                    Track Vehicle
                  </Button>
                  {vehicle.status === "Available" && (
                    <Button size="sm">
                      <User className="h-4 w-4 mr-2" />
                      Assign to Tech
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Wrench className="h-4 w-4 mr-2" />
                    Service History
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "dispatch":
        return renderJobDispatch();
      case "map":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Live GPS Map</h2>
            <Card>
              <CardContent className="p-6">
                <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-semibold">Live GPS Tracking</p>
                    <p className="text-muted-foreground">
                      Interactive map showing real-time technician locations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "schedule":
        return renderTodaysSchedule();
      case "clock":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Clock Tracker</h2>
            <Card>
              <CardHeader>
                <CardTitle>Technician Clock Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeTechnicians.map((tech) => (
                    <div
                      key={tech.id}
                      className="border border-border rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{tech.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Status: {tech.status} | Jobs Today: {tech.jobsToday}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {tech.clockedIn ? (
                            <Badge className="bg-success text-success-foreground">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Clocked In
                            </Badge>
                          ) : (
                            <Badge className="bg-destructive text-destructive-foreground">
                              <Clock3 className="h-3 w-3 mr-1" />
                              Not Clocked In
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "alerts":
        return renderAlertsIssues();
      case "communication":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Team Messaging</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Group Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm">
                        <strong>John Smith:</strong> Heading to next site now
                      </p>
                      <p className="text-xs text-muted-foreground">
                        2 minutes ago
                      </p>
                    </div>
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-sm">
                        <strong>You:</strong> Great! ETA 30 minutes?
                      </p>
                      <p className="text-xs text-muted-foreground">
                        1 minute ago
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Input
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Message Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      "Heading to site?"
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      "Job completed?"
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      "Need backup?"
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      "ETA update please"
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "stock":
        return renderStockRequests();
      case "fleet":
        return renderFleetStatus();
      case "metrics":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Live Metrics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-success">
                    {coordinatorStats.completedToday}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Jobs Completed Today
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary">
                    {coordinatorStats.productivity}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Team Productivity
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-warning">
                    {coordinatorStats.overdueJobs}
                  </div>
                  <p className="text-sm text-muted-foreground">Overdue Tasks</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-info">John Smith</div>
                  <p className="text-sm text-muted-foreground">
                    Most Productive Tech
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "tools":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Actions Center</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Button className="h-20 flex-col space-y-2">
                <ClipboardList className="h-6 w-6" />
                <span>Assign a Job</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <Eye className="h-6 w-6" />
                <span>View Job Summary</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <MapPin className="h-6 w-6" />
                <span>Locate Technician</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <UserCheck className="h-6 w-6" />
                <span>Approve Clock-in</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <MessageSquare className="h-6 w-6" />
                <span>Message Team</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <Upload className="h-6 w-6" />
                <span>Upload Handover</span>
              </Button>
            </div>
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
              Coordinator Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time operational control and team coordination
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
