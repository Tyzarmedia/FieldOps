import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  Users,
  ClipboardList,
  TrendingUp,
  Activity,
  DollarSign,
  Shield,
  Truck,
  Package,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Timer,
  Eye,
  UserPlus,
  FileText,
  Settings,
  Clock,
  MapPin,
  Calendar,
  Download,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  Mail,
  Phone,
  MessageSquare,
  Gauge,
  PieChart,
  LineChart,
  Target,
  Zap,
  Globe,
  Database,
  Lock,
  Unlock,
  AlertCircle,
  CheckSquare,
  XCircle,
  Archive,
  Share,
} from "lucide-react";

export default function CeoDashboard() {
  const [activeSection, setActiveSection] = useState("main");
  const [systemData, setSystemData] = useState<any>(null);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState("month");

  const systemStats = {
    totalJobs: 1247,
    completedJobs: 1089,
    failedJobs: 23,
    activeJobs: 135,
    totalTechnicians: 45,
    activeTechnicians: 38,
    departments: 8,
    productivity: 87.3,
    revenue: 245000,
    targetRevenue: 280000,
    stockValue: 89500,
    fleetUtilization: 92.4,
    complianceScore: 95.2,
    criticalAlerts: 7,
    overdueMaintenace: 12,
    pendingReports: 5,
    activeUsers: 156,
  };

  const jobsData = [
    {
      id: "J001",
      title: "HVAC System Maintenance",
      department: "HVAC",
      technician: "John Smith",
      status: "Completed",
      priority: "Medium",
      startDate: "2024-01-20",
      completedDate: "2024-01-20",
      estimatedHours: 4,
      actualHours: 3.5,
      location: "Downtown Office",
    },
    {
      id: "J002",
      title: "Electrical Panel Upgrade",
      department: "Electrical",
      technician: "Sarah Johnson",
      status: "In Progress",
      priority: "High",
      startDate: "2024-01-21",
      completedDate: null,
      estimatedHours: 6,
      actualHours: 4,
      location: "Industrial Complex",
    },
    {
      id: "J003",
      title: "Plumbing Inspection",
      department: "Plumbing",
      technician: "Mike Chen",
      status: "Pending",
      priority: "Low",
      startDate: "2024-01-22",
      completedDate: null,
      estimatedHours: 2,
      actualHours: 0,
      location: "Residential Building",
    },
    {
      id: "J004",
      title: "Emergency Generator Check",
      department: "Emergency",
      technician: "Emma Wilson",
      status: "Failed",
      priority: "High",
      startDate: "2024-01-19",
      completedDate: "2024-01-19",
      estimatedHours: 3,
      actualHours: 2,
      location: "Hospital",
    },
  ];

  const revenueData = [
    { month: "Jan", revenue: 245000, target: 280000, profit: 73500 },
    { month: "Feb", revenue: 267000, target: 280000, profit: 80100 },
    { month: "Mar", revenue: 289000, target: 290000, profit: 86700 },
    { month: "Apr", revenue: 254000, target: 280000, profit: 76200 },
    { month: "May", revenue: 298000, target: 300000, profit: 89400 },
    { month: "Jun", revenue: 312000, target: 310000, profit: 93600 },
  ];

  const staffData = [
    {
      id: 1,
      name: "John Smith",
      role: "Technician",
      department: "HVAC",
      status: "Online",
      tasksCompleted: 15,
      efficiency: 94.2,
      workingToday: true,
      lastLogin: "2024-01-21 08:30",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Technician",
      department: "Electrical",
      status: "On Site",
      tasksCompleted: 12,
      efficiency: 96.8,
      workingToday: true,
      lastLogin: "2024-01-21 07:45",
    },
    {
      id: 3,
      name: "Mike Chen",
      role: "Technician",
      department: "Plumbing",
      status: "Offline",
      tasksCompleted: 8,
      efficiency: 88.5,
      workingToday: false,
      lastLogin: "2024-01-20 17:30",
    },
    {
      id: 4,
      name: "Emma Wilson",
      role: "Manager",
      department: "Emergency",
      status: "Online",
      tasksCompleted: 6,
      efficiency: 92.1,
      workingToday: true,
      lastLogin: "2024-01-21 09:00",
    },
  ];

  const departments = [
    {
      id: 1,
      name: "HVAC",
      head: "Robert Taylor",
      staff: 12,
      tasksCompleted: 156,
      revenue: 89000,
      budgetSpent: 67000,
      efficiency: 94.2,
      projects: 8,
      incidents: 2,
    },
    {
      id: 2,
      name: "Electrical",
      head: "Lisa Anderson",
      staff: 10,
      tasksCompleted: 134,
      revenue: 76000,
      budgetSpent: 54000,
      efficiency: 91.5,
      projects: 6,
      incidents: 1,
    },
    {
      id: 3,
      name: "Plumbing",
      head: "David Wilson",
      staff: 8,
      tasksCompleted: 98,
      revenue: 45000,
      budgetSpent: 32000,
      efficiency: 88.7,
      projects: 4,
      incidents: 0,
    },
    {
      id: 4,
      name: "General Maintenance",
      head: "Maria Garcia",
      staff: 15,
      tasksCompleted: 189,
      revenue: 123000,
      budgetSpent: 89000,
      efficiency: 92.8,
      projects: 12,
      incidents: 3,
    },
  ];

  const complianceData = [
    {
      type: "SHEQ",
      score: 97.2,
      status: "Compliant",
      lastAudit: "2024-01-15",
      nextAudit: "2024-04-15",
      issues: 1,
    },
    {
      type: "Labor Law",
      score: 94.8,
      status: "Compliant",
      lastAudit: "2024-01-10",
      nextAudit: "2024-07-10",
      issues: 3,
    },
    {
      type: "ISO Standards",
      score: 89.5,
      status: "Review Required",
      lastAudit: "2023-12-20",
      nextAudit: "2024-03-20",
      issues: 7,
    },
    {
      type: "Operational",
      score: 96.1,
      status: "Compliant",
      lastAudit: "2024-01-18",
      nextAudit: "2024-04-18",
      issues: 2,
    },
  ];

  const inventoryData = [
    {
      id: 1,
      item: "HVAC Filters",
      category: "HVAC",
      currentStock: 245,
      minStock: 50,
      value: 4900,
      lastOrdered: "2024-01-15",
      usage: "High",
    },
    {
      id: 2,
      item: "Electrical Wire (100m)",
      category: "Electrical",
      currentStock: 23,
      minStock: 30,
      value: 2300,
      lastOrdered: "2024-01-10",
      usage: "Medium",
    },
    {
      id: 3,
      item: "Pipe Fittings",
      category: "Plumbing",
      currentStock: 456,
      minStock: 100,
      value: 6840,
      lastOrdered: "2024-01-20",
      usage: "High",
    },
    {
      id: 4,
      item: "Safety Helmets",
      category: "Safety",
      currentStock: 67,
      minStock: 25,
      value: 1340,
      lastOrdered: "2024-01-12",
      usage: "Low",
    },
  ];

  const criticalAlerts = [
    {
      id: 1,
      type: "System",
      title: "Database Backup Failed",
      severity: "High",
      time: "2024-01-21 03:30",
      status: "Open",
      assignedTo: "IT Team",
    },
    {
      id: 2,
      type: "Job",
      title: "Emergency Job Overdue",
      severity: "Critical",
      time: "2024-01-21 14:45",
      status: "In Progress",
      assignedTo: "John Smith",
    },
    {
      id: 3,
      type: "Fleet",
      title: "Vehicle FL003 Service Overdue",
      severity: "Medium",
      time: "2024-01-21 10:00",
      status: "Open",
      assignedTo: "Fleet Manager",
    },
    {
      id: 4,
      type: "Compliance",
      title: "Safety Audit Due",
      severity: "High",
      time: "2024-01-21 09:00",
      status: "Open",
      assignedTo: "Safety Manager",
    },
  ];

  const users = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@company.com",
      role: "Technician",
      department: "HVAC",
      status: "Active",
      lastLogin: "2024-01-21 08:30",
      permissions: ["View Jobs", "Update Jobs"],
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      role: "Manager",
      department: "Electrical",
      status: "Active",
      lastLogin: "2024-01-21 07:45",
      permissions: ["All Permissions"],
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike.chen@company.com",
      role: "Technician",
      department: "Plumbing",
      status: "Suspended",
      lastLogin: "2024-01-20 17:30",
      permissions: ["View Jobs"],
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
      case "completed":
        return "bg-success text-success-foreground";
      case "in progress":
        return "bg-primary text-primary-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "failed":
        return "bg-destructive text-destructive-foreground";
      case "online":
      case "active":
      case "compliant":
        return "bg-success text-success-foreground";
      case "offline":
      case "suspended":
        return "bg-destructive text-destructive-foreground";
      case "on site":
        return "bg-info text-info-foreground";
      case "review required":
        return "bg-warning text-warning-foreground";
      case "open":
        return "bg-warning text-warning-foreground";
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-blue-500 text-white";
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
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalJobs.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>{systemStats.completedJobs} completed</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${systemStats.revenue.toLocaleString()}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-success" />
              <span>87% of target</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activeTechnicians}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-primary" />
              <span>of {systemStats.totalTechnicians} total</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.productivity}%</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-success" />
              <span>Above target</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("jobs")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-500 p-4 rounded-2xl">
                <ClipboardList className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Jobs Overview</h3>
            <p className="text-sm text-gray-600">{systemStats.totalJobs} total jobs</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("revenue")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-500 p-4 rounded-2xl">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Financial Performance</h3>
            <p className="text-sm text-gray-600">${systemStats.revenue.toLocaleString()} this month</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("staff")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-500 p-4 rounded-2xl">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Human Resource Snapshot</h3>
            <p className="text-sm text-gray-600">{systemStats.activeTechnicians} active staff</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("productivity")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-500 p-4 rounded-2xl">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Productivity Metrics</h3>
            <p className="text-sm text-gray-600">{systemStats.productivity}% efficiency</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("departments")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-cyan-500 p-4 rounded-2xl">
                <Building className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Departmental Performance</h3>
            <p className="text-sm text-gray-600">{systemStats.departments} departments</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("compliance")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-500 p-4 rounded-2xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Compliance Center</h3>
            <p className="text-sm text-gray-600">{systemStats.complianceScore}% compliance</p>
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
            <h3 className="font-semibold text-gray-800 mb-2">Fleet Operations</h3>
            <p className="text-sm text-gray-600">{systemStats.fleetUtilization}% utilization</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("inventory")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-pink-500 p-4 rounded-2xl">
                <Package className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Stock & Assets</h3>
            <p className="text-sm text-gray-600">${systemStats.stockValue.toLocaleString()} value</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("settings")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-slate-500 p-4 rounded-2xl">
                <Settings className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">System Settings</h3>
            <p className="text-sm text-gray-600">Configuration & access</p>
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
            <h3 className="font-semibold text-gray-800 mb-2">Critical Alerts</h3>
            <p className="text-sm text-gray-600">{systemStats.criticalAlerts} active alerts</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("reports")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-500 p-4 rounded-2xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Reports Hub</h3>
            <p className="text-sm text-gray-600">{systemStats.pendingReports} pending reports</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("users")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-teal-500 p-4 rounded-2xl">
                <UserPlus className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">User Directory</h3>
            <p className="text-sm text-gray-600">{systemStats.activeUsers} active users</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("analytics")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-violet-500 p-4 rounded-2xl">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">CEO Analytics Center</h3>
            <p className="text-sm text-gray-600">All KPIs in one place</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderJobsOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Jobs Overview</h2>
        <div className="flex space-x-2">
          <Select value={selectedTimeFilter} onValueChange={setSelectedTimeFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="ytd">YTD</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Job Status Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-success">{systemStats.completedJobs}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-primary">{systemStats.activeJobs}</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">23</p>
              </div>
              <Clock className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-destructive">{systemStats.failedJobs}</p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {jobsData.map((job) => (
              <div key={job.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">{job.id}</Badge>
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      <Badge className={getStatusColor(job.priority)}>
                        {job.priority}
                      </Badge>
                    </div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-muted-foreground">
                      <div>
                        <p>Department: {job.department}</p>
                      </div>
                      <div>
                        <p>Technician: {job.technician}</p>
                      </div>
                      <div>
                        <p>Location: {job.location}</p>
                      </div>
                      <div>
                        <p>Hours: {job.actualHours}/{job.estimatedHours}</p>
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
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFinancialPerformance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Financial Performance</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export to QuickBooks
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share Report
          </Button>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">${systemStats.revenue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground mt-2">
              Target: ${systemStats.targetRevenue.toLocaleString()}
            </div>
            <div className="mt-4">
              <div className="bg-secondary rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${(systemStats.revenue / systemStats.targetRevenue) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round((systemStats.revenue / systemStats.targetRevenue) * 100)}% of target
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profit Margin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">30%</div>
            <div className="text-sm text-muted-foreground mt-2">
              Up from 28% last month
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="h-4 w-4 text-success mr-2" />
              <span className="text-sm text-success">+2% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outstanding Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">$45,200</div>
            <div className="text-sm text-muted-foreground mt-2">
              12 overdue invoices
            </div>
            <Button size="sm" className="mt-4">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Review Overdue
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Department */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Department</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departments.map((dept) => (
              <div key={dept.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold">{dept.name}</h4>
                  <p className="text-sm text-muted-foreground">Head: {dept.head}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${dept.revenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{dept.tasksCompleted} jobs</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHRSnapshot = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Human Resource Snapshot</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Staff
          </Button>
        </div>
      </div>

      {/* Staff Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Technicians</p>
                <p className="text-2xl font-bold">32</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Managers</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Building className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fleet Staff</p>
                <p className="text-2xl font-bold">4</p>
              </div>
              <Truck className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Admins</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Settings className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <Card>
        <CardHeader>
          <CardTitle>Staff Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {staffData.map((staff) => (
              <div key={staff.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold">{staff.name}</h4>
                      <Badge className={getStatusColor(staff.status)}>
                        {staff.status}
                      </Badge>
                      {staff.workingToday && (
                        <Badge variant="secondary">Working Today</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <p>Role: {staff.role}</p>
                      </div>
                      <div>
                        <p>Department: {staff.department}</p>
                      </div>
                      <div>
                        <p>Tasks: {staff.tasksCompleted}</p>
                      </div>
                      <div>
                        <p>Efficiency: {staff.efficiency}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Last Login</p>
                    <p className="text-sm">{staff.lastLogin}</p>
                  </div>
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
      case "jobs":
        return renderJobsOverview();
      case "revenue":
        return renderFinancialPerformance();
      case "staff":
        return renderHRSnapshot();
      case "productivity":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Productivity Metrics</h2>
            <p className="text-muted-foreground">Detailed productivity analytics coming soon...</p>
          </div>
        );
      case "departments":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Departmental Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map((dept) => (
                <Card key={dept.id}>
                  <CardHeader>
                    <CardTitle>{dept.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Head:</span>
                        <span className="font-semibold">{dept.head}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Staff:</span>
                        <span>{dept.staff}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tasks Completed:</span>
                        <span>{dept.tasksCompleted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Revenue:</span>
                        <span>${dept.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Efficiency:</span>
                        <span>{dept.efficiency}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "compliance":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Compliance Center</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complianceData.map((compliance, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{compliance.type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Score:</span>
                        <Badge className={getStatusColor(compliance.status)}>
                          {compliance.score}%
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span>{compliance.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Audit:</span>
                        <span>{compliance.lastAudit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next Audit:</span>
                        <span>{compliance.nextAudit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Issues:</span>
                        <span>{compliance.issues}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "fleet":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Fleet Operations</h2>
            <p className="text-muted-foreground">Fleet operations dashboard coming soon...</p>
          </div>
        );
      case "inventory":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Stock & Assets</h2>
            <Card>
              <CardHeader>
                <CardTitle>Inventory Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryData.map((item) => (
                    <div key={item.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.item}</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-muted-foreground">
                            <div>
                              <p>Category: {item.category}</p>
                            </div>
                            <div>
                              <p>Stock: {item.currentStock}</p>
                            </div>
                            <div>
                              <p>Value: ${item.value}</p>
                            </div>
                            <div>
                              <p>Usage: {item.usage}</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {item.currentStock < item.minStock && (
                            <Badge className="bg-destructive text-destructive-foreground">
                              Low Stock
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
      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">System Settings</h2>
            <p className="text-muted-foreground">System configuration coming soon...</p>
          </div>
        );
      case "alerts":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Critical Alerts</h2>
            <Card>
              <CardHeader>
                <CardTitle>Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {criticalAlerts.map((alert) => (
                    <div key={alert.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge className={getStatusColor(alert.severity)}>
                              {alert.severity}
                            </Badge>
                            <Badge variant="outline">{alert.type}</Badge>
                          </div>
                          <h4 className="font-semibold">{alert.title}</h4>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <p>Time: {alert.time}</p>
                            <p>Assigned to: {alert.assignedTo}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(alert.status)}>
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "reports":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Reports Hub</h2>
            <p className="text-muted-foreground">Reports generation coming soon...</p>
          </div>
        );
      case "users":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">User Directory</h2>
            <Card>
              <CardHeader>
                <CardTitle>System Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div key={user.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold">{user.name}</h4>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p>Email: {user.email}</p>
                            <p>Role: {user.role}</p>
                            <p>Department: {user.department}</p>
                            <p>Last Login: {user.lastLogin}</p>
                          </div>
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Lock className="h-4 w-4" />
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
      case "analytics":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">CEO Analytics Center</h2>
            <p className="text-muted-foreground">Advanced analytics dashboard coming soon...</p>
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
              CEO Dashboard
            </h1>
            <p className="text-muted-foreground">
              Complete system overview and executive management
            </p>
          </div>
          {activeSection !== "main" && (
            <Button 
              variant="outline" 
              onClick={() => setActiveSection("main")}
            >
              ← Back to Dashboard
            </Button>
          )}
        </div>
      </div>

      {renderSection()}
    </div>
  );
}
