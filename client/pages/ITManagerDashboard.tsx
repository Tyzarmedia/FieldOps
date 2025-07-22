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
  Monitor,
  Ticket,
  Clock,
  Shield,
  Wifi,
  Globe,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  HardDrive,
  Settings,
  Bell,
  Archive,
  Laptop,
  Smartphone,
  Server,
  Database,
  Lock,
  Key,
  UserCheck,
  UserX,
  Activity,
  TrendingUp,
  BarChart3,
  FileText,
  Calendar,
  Mail,
  Phone,
  Wrench,
  Zap,
  WifiOff,
  Bug,
  Coffee,
} from "lucide-react";

export default function ITManagerDashboard() {
  const [activeSection, setActiveSection] = useState("main");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const itStats = {
    activeDevices: 154,
    openTickets: 12,
    avgResolutionTime: 1.3,
    securityAlerts: 3,
    networkHealth: "Good",
    internetDowntime: 2.3,
    serversOnline: 8,
    totalUsers: 74,
    softwareLicenses: 45,
    expiringLicenses: 7,
    backupSuccess: 98.5,
    diskUsage: 67,
  };

  const supportTickets = [
    {
      id: "TK001",
      title: "Email Not Working",
      description: "Outlook not connecting to exchange server",
      submittedBy: "John Smith",
      department: "Network Maintenance",
      priority: "Medium",
      status: "Open",
      assignedTo: "IT Support",
      submittedDate: "2024-01-20",
      lastUpdate: "2024-01-20",
      estimatedResolution: "2024-01-22",
      category: "Email",
      urgency: "Normal",
    },
    {
      id: "TK002",
      title: "Laptop Won't Start",
      description: "Black screen on startup, no display output",
      submittedBy: "Sarah Johnson",
      department: "Installation",
      priority: "High",
      status: "In Progress",
      assignedTo: "Hardware Tech",
      submittedDate: "2024-01-19",
      lastUpdate: "2024-01-21",
      estimatedResolution: "2024-01-21",
      category: "Hardware",
      urgency: "Critical",
    },
    {
      id: "TK003",
      title: "Software License Needed",
      description: "Need AutoCAD license for new project",
      submittedBy: "Mike Chen",
      department: "Design",
      priority: "Low",
      status: "Pending Approval",
      assignedTo: "IT Manager",
      submittedDate: "2024-01-18",
      lastUpdate: "2024-01-19",
      estimatedResolution: "2024-01-25",
      category: "Software",
      urgency: "Low",
    },
    {
      id: "TK004",
      title: "Network Connection Issues",
      description: "Intermittent connectivity in meeting room",
      submittedBy: "Emma Wilson",
      department: "Management",
      priority: "Medium",
      status: "Resolved",
      assignedTo: "Network Admin",
      submittedDate: "2024-01-17",
      lastUpdate: "2024-01-20",
      estimatedResolution: "2024-01-20",
      category: "Network",
      urgency: "Normal",
    },
  ];

  const deviceInventory = [
    {
      id: "DEV001",
      assetTag: "LAP-001",
      deviceType: "Laptop",
      brand: "Dell",
      model: "Latitude 5520",
      assignedTo: "John Smith",
      department: "Network Maintenance",
      status: "In Use",
      purchaseDate: "2023-03-15",
      warrantyExpiry: "2026-03-15",
      lastMaintenance: "2024-01-10",
      specifications: "Intel i7, 16GB RAM, 512GB SSD",
      location: "Office Floor 2",
    },
    {
      id: "DEV002",
      assetTag: "LAP-002",
      deviceType: "Laptop",
      brand: "HP",
      model: "ProBook 450",
      assignedTo: "Sarah Johnson",
      department: "Installation",
      status: "In Repair",
      purchaseDate: "2023-06-20",
      warrantyExpiry: "2026-06-20",
      lastMaintenance: "2024-01-19",
      specifications: "Intel i5, 8GB RAM, 256GB SSD",
      location: "IT Workshop",
    },
    {
      id: "DEV003",
      assetTag: "SRV-001",
      deviceType: "Server",
      brand: "HP",
      model: "ProLiant DL380",
      assignedTo: "IT Department",
      department: "IT",
      status: "Online",
      purchaseDate: "2022-01-10",
      warrantyExpiry: "2025-01-10",
      lastMaintenance: "2024-01-15",
      specifications: "Xeon Gold, 64GB RAM, 2TB Storage",
      location: "Server Room",
    },
    {
      id: "DEV004",
      assetTag: "TAB-001",
      deviceType: "Tablet",
      brand: "iPad",
      model: "iPad Pro 11",
      assignedTo: "Mike Chen",
      department: "Design",
      status: "Available",
      purchaseDate: "2023-09-05",
      warrantyExpiry: "2025-09-05",
      lastMaintenance: "N/A",
      specifications: "M2 Chip, 256GB Storage",
      location: "IT Storage",
    },
  ];

  const softwareLicenses = [
    {
      id: "LIC001",
      software: "Microsoft Office 365",
      licenseType: "Subscription",
      totalLicenses: 74,
      usedLicenses: 72,
      expiryDate: "2024-12-31",
      costPerLicense: 15.0,
      totalCost: 1110.0,
      vendor: "Microsoft",
      renewalRequired: false,
      status: "Active",
    },
    {
      id: "LIC002",
      software: "AutoCAD",
      licenseType: "Perpetual",
      totalLicenses: 5,
      usedLicenses: 4,
      expiryDate: "2024-03-15",
      costPerLicense: 200.0,
      totalCost: 1000.0,
      vendor: "Autodesk",
      renewalRequired: true,
      status: "Expiring Soon",
    },
    {
      id: "LIC003",
      software: "Antivirus Enterprise",
      licenseType: "Subscription",
      totalLicenses: 80,
      usedLicenses: 74,
      expiryDate: "2024-06-30",
      costPerLicense: 8.0,
      totalCost: 640.0,
      vendor: "Symantec",
      renewalRequired: false,
      status: "Active",
    },
    {
      id: "LIC004",
      software: "Project Management Suite",
      licenseType: "Subscription",
      totalLicenses: 10,
      usedLicenses: 8,
      expiryDate: "2024-02-28",
      costPerLicense: 25.0,
      totalCost: 250.0,
      vendor: "Atlassian",
      renewalRequired: true,
      status: "Expiring Soon",
    },
  ];

  const networkMonitoring = [
    {
      id: "NET001",
      location: "Main Office",
      device: "Core Router",
      status: "Online",
      uptime: "99.8%",
      lastPing: "2024-01-21 14:45:30",
      responseTime: "12ms",
      bandwidth: "85% utilized",
      issues: [],
    },
    {
      id: "NET002",
      location: "Branch Office",
      device: "Access Point",
      status: "Warning",
      uptime: "97.2%",
      lastPing: "2024-01-21 14:45:25",
      responseTime: "45ms",
      bandwidth: "92% utilized",
      issues: ["High bandwidth usage", "Intermittent drops"],
    },
    {
      id: "NET003",
      location: "Server Room",
      device: "Network Switch",
      status: "Online",
      uptime: "99.9%",
      lastPing: "2024-01-21 14:45:32",
      responseTime: "8ms",
      bandwidth: "67% utilized",
      issues: [],
    },
    {
      id: "NET004",
      location: "Warehouse",
      device: "WiFi Controller",
      status: "Offline",
      uptime: "0%",
      lastPing: "2024-01-21 12:30:15",
      responseTime: "Timeout",
      bandwidth: "N/A",
      issues: ["Device unreachable", "Power failure suspected"],
    },
  ];

  const securityData = [
    {
      id: "SEC001",
      type: "Failed Login Attempt",
      user: "john.smith@company.com",
      source: "192.168.1.105",
      timestamp: "2024-01-21 14:30:25",
      severity: "Medium",
      status: "Monitoring",
      details: "Multiple failed password attempts",
    },
    {
      id: "SEC002",
      type: "Antivirus Alert",
      user: "sarah.johnson@company.com",
      source: "Laptop LAP-002",
      timestamp: "2024-01-21 13:15:40",
      severity: "High",
      status: "Quarantined",
      details: "Suspicious file detected and isolated",
    },
    {
      id: "SEC003",
      type: "Unauthorized Access",
      user: "external.user@unknown.com",
      source: "203.45.67.89",
      timestamp: "2024-01-21 11:45:12",
      severity: "Critical",
      status: "Blocked",
      details: "Attempt to access admin panel from external IP",
    },
  ];

  const userAccounts = [
    {
      id: 1,
      username: "john.smith",
      fullName: "John Smith",
      department: "Network Maintenance",
      role: "Technician",
      email: "john.smith@company.com",
      status: "Active",
      lastLogin: "2024-01-21 08:30:15",
      accountCreated: "2023-01-15",
      permissions: ["Email", "File Server", "CRM"],
      deviceAccess: ["LAP-001", "MOB-001"],
    },
    {
      id: 2,
      username: "sarah.johnson",
      fullName: "Sarah Johnson",
      department: "Installation",
      role: "Senior Technician",
      email: "sarah.johnson@company.com",
      status: "Active",
      lastLogin: "2024-01-21 07:45:22",
      accountCreated: "2022-11-20",
      permissions: ["Email", "File Server", "Project Management"],
      deviceAccess: ["LAP-002"],
    },
    {
      id: 3,
      username: "mike.chen",
      fullName: "Mike Chen",
      department: "Design",
      role: "Designer",
      email: "mike.chen@company.com",
      status: "Suspended",
      lastLogin: "2024-01-19 16:20:08",
      accountCreated: "2023-05-10",
      permissions: ["Email", "Design Tools"],
      deviceAccess: ["TAB-001"],
    },
  ];

  const backupStatus = [
    {
      id: "BKP001",
      system: "File Server",
      type: "Full Backup",
      lastBackup: "2024-01-21 02:00:00",
      status: "Success",
      size: "2.5 TB",
      duration: "3h 45m",
      nextScheduled: "2024-01-28 02:00:00",
      retentionPeriod: "30 days",
    },
    {
      id: "BKP002",
      system: "Email Server",
      type: "Incremental",
      lastBackup: "2024-01-21 01:30:00",
      status: "Success",
      size: "156 GB",
      duration: "25m",
      nextScheduled: "2024-01-22 01:30:00",
      retentionPeriod: "7 days",
    },
    {
      id: "BKP003",
      system: "Database Server",
      type: "Full Backup",
      lastBackup: "2024-01-20 23:00:00",
      status: "Failed",
      size: "N/A",
      duration: "N/A",
      nextScheduled: "2024-01-21 23:00:00",
      retentionPeriod: "90 days",
      error: "Insufficient disk space",
    },
  ];

  const itAlerts = [
    {
      id: "AL001",
      type: "System Failure",
      severity: "Critical",
      message: "Database server offline - urgent attention required",
      timestamp: "2024-01-21 14:20:00",
      affected: "All users",
      status: "Active",
    },
    {
      id: "AL002",
      type: "Low Disk Space",
      severity: "Warning",
      message: "File server disk usage above 85%",
      timestamp: "2024-01-21 12:15:00",
      affected: "File sharing services",
      status: "Acknowledged",
    },
    {
      id: "AL003",
      type: "License Expiry",
      severity: "Info",
      message: "AutoCAD licenses expire in 30 days",
      timestamp: "2024-01-21 09:00:00",
      affected: "Design team",
      status: "Open",
    },
  ];

  useEffect(() => {
    // Load IT data
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
      case "active":
      case "online":
      case "success":
        return "bg-success text-success-foreground";
      case "in progress":
      case "warning":
      case "acknowledged":
        return "bg-warning text-warning-foreground";
      case "pending approval":
      case "pending":
        return "bg-info text-info-foreground";
      case "resolved":
      case "closed":
        return "bg-success text-success-foreground";
      case "in repair":
      case "suspended":
      case "offline":
      case "failed":
        return "bg-destructive text-destructive-foreground";
      case "available":
        return "bg-secondary text-secondary-foreground";
      case "expiring soon":
        return "bg-orange-500 text-white";
      case "blocked":
      case "quarantined":
        return "bg-destructive text-destructive-foreground";
      case "monitoring":
        return "bg-info text-info-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
      case "normal":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-info text-info-foreground";
      case "info":
        return "bg-info text-info-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const renderMainDashboard = () => (
    <div className="space-y-6">
      {/* Quick Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Devices</p>
                <p className="text-2xl font-bold text-primary">
                  {itStats.activeDevices}
                </p>
              </div>
              <Monitor className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
                <p className="text-2xl font-bold text-warning">
                  {itStats.openTickets}
                </p>
              </div>
              <Ticket className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Resolution</p>
                <p className="text-2xl font-bold text-success">
                  {itStats.avgResolutionTime}h
                </p>
              </div>
              <Clock className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Security Alerts</p>
                <p className="text-2xl font-bold text-destructive">
                  {itStats.securityAlerts}
                </p>
              </div>
              <Shield className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Network Health</p>
                <p className="text-2xl font-bold text-success">
                  {itStats.networkHealth}
                </p>
              </div>
              <Wifi className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Backup Success</p>
                <p className="text-2xl font-bold text-success">
                  {itStats.backupSuccess}%
                </p>
              </div>
              <HardDrive className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("tickets")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-500 p-4 rounded-2xl">
                <Ticket className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Support Tickets
            </h3>
            <p className="text-sm text-gray-600">
              {itStats.openTickets} open tickets
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("devices")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-500 p-4 rounded-2xl">
                <Laptop className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Device Inventory
            </h3>
            <p className="text-sm text-gray-600">
              {itStats.activeDevices} devices managed
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("software")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-500 p-4 rounded-2xl">
                <Database className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Software & Licenses
            </h3>
            <p className="text-sm text-gray-600">
              {itStats.softwareLicenses} licenses tracked
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("network")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-cyan-500 p-4 rounded-2xl">
                <Wifi className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Network Monitoring
            </h3>
            <p className="text-sm text-gray-600">
              {itStats.networkHealth} network status
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("security")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-500 p-4 rounded-2xl">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Security Monitoring
            </h3>
            <p className="text-sm text-gray-600">
              {itStats.securityAlerts} active alerts
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("users")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-500 p-4 rounded-2xl">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              User Management
            </h3>
            <p className="text-sm text-gray-600">
              {itStats.totalUsers} user accounts
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("backup")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-500 p-4 rounded-2xl">
                <HardDrive className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Backup & Recovery
            </h3>
            <p className="text-sm text-gray-600">
              {itStats.backupSuccess}% success rate
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("reports")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-500 p-4 rounded-2xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              IT Reports & Logs
            </h3>
            <p className="text-sm text-gray-600">System diagnostics</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("alerts")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-500 p-4 rounded-2xl">
                <Bell className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">IT Alerts</h3>
            <p className="text-sm text-gray-600">
              Critical system notifications
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSupportTickets = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Support Ticket Management</h2>
        <div className="flex space-x-2">
          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {supportTickets.map((ticket) => (
          <Card key={ticket.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{ticket.id}</Badge>
                    <Badge className={getStatusColor(ticket.status)}>
                      {ticket.status}
                    </Badge>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                    <Badge variant="secondary">{ticket.category}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{ticket.title}</h3>
                  <p className="text-muted-foreground mb-3">
                    {ticket.description}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Submitted By:</p>
                      <p>{ticket.submittedBy}</p>
                    </div>
                    <div>
                      <p className="font-medium">Department:</p>
                      <p>{ticket.department}</p>
                    </div>
                    <div>
                      <p className="font-medium">Assigned To:</p>
                      <p>{ticket.assignedTo}</p>
                    </div>
                    <div>
                      <p className="font-medium">Submitted:</p>
                      <p>{ticket.submittedDate}</p>
                    </div>
                    <div>
                      <p className="font-medium">Last Update:</p>
                      <p>{ticket.lastUpdate}</p>
                    </div>
                    <div>
                      <p className="font-medium">Est. Resolution:</p>
                      <p>{ticket.estimatedResolution}</p>
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
                  Update Status
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Reassign
                </Button>
                {ticket.status !== "Resolved" && (
                  <Button size="sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Resolve
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDeviceInventory = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Device Inventory Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Inventory
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {deviceInventory.map((device) => (
          <Card key={device.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{device.assetTag}</Badge>
                    <Badge className={getStatusColor(device.status)}>
                      {device.status}
                    </Badge>
                    <Badge variant="secondary">{device.deviceType}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg">
                    {device.brand} {device.model}
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Assigned To:</p>
                      <p>{device.assignedTo}</p>
                    </div>
                    <div>
                      <p className="font-medium">Department:</p>
                      <p>{device.department}</p>
                    </div>
                    <div>
                      <p className="font-medium">Location:</p>
                      <p>{device.location}</p>
                    </div>
                    <div>
                      <p className="font-medium">Purchase Date:</p>
                      <p>{device.purchaseDate}</p>
                    </div>
                    <div>
                      <p className="font-medium">Warranty Expiry:</p>
                      <p>{device.warrantyExpiry}</p>
                    </div>
                    <div>
                      <p className="font-medium">Last Maintenance:</p>
                      <p>{device.lastMaintenance}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">Specifications:</p>
                      <p>{device.specifications}</p>
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
                  Edit Asset
                </Button>
                <Button variant="outline" size="sm">
                  <Wrench className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
                {device.status === "Available" && (
                  <Button size="sm">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Assign Device
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSoftwareLicenses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Software & License Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add License
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {softwareLicenses.map((license) => (
          <Card key={license.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{license.id}</Badge>
                    <Badge className={getStatusColor(license.status)}>
                      {license.status}
                    </Badge>
                    <Badge variant="secondary">{license.licenseType}</Badge>
                    {license.renewalRequired && (
                      <Badge className="bg-warning text-warning-foreground">
                        Renewal Required
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">{license.software}</h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Licenses Used:</p>
                      <p className="font-bold">
                        {license.usedLicenses}/{license.totalLicenses}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Expiry Date:</p>
                      <p
                        className={
                          license.renewalRequired
                            ? "text-warning font-bold"
                            : ""
                        }
                      >
                        {license.expiryDate}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Vendor:</p>
                      <p>{license.vendor}</p>
                    </div>
                    <div>
                      <p className="font-medium">Total Cost:</p>
                      <p className="font-bold">
                        R{license.totalCost.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Cost Per License:</p>
                      <p>R{license.costPerLicense.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Available:</p>
                      <p className="font-bold text-success">
                        {license.totalLicenses - license.usedLicenses}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Usage
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit License
                </Button>
                {license.renewalRequired && (
                  <Button size="sm" className="bg-warning">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Renewal
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Assign License
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderNetworkMonitoring = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Network Monitoring</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {networkMonitoring.map((network) => (
          <Card key={network.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{network.id}</Badge>
                    <Badge className={getStatusColor(network.status)}>
                      {network.status}
                    </Badge>
                    {network.status === "Online" && (
                      <Wifi className="h-4 w-4 text-success" />
                    )}
                    {network.status === "Warning" && (
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    )}
                    {network.status === "Offline" && (
                      <WifiOff className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">{network.device}</h3>
                  <p className="text-muted-foreground mb-3">
                    {network.location}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Uptime:</p>
                      <p
                        className={
                          network.uptime === "0%"
                            ? "text-destructive font-bold"
                            : "font-bold"
                        }
                      >
                        {network.uptime}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Last Ping:</p>
                      <p>{network.lastPing}</p>
                    </div>
                    <div>
                      <p className="font-medium">Response Time:</p>
                      <p>{network.responseTime}</p>
                    </div>
                    <div>
                      <p className="font-medium">Bandwidth:</p>
                      <p>{network.bandwidth}</p>
                    </div>
                  </div>

                  {network.issues.length > 0 && (
                    <div className="mt-3">
                      <p className="font-medium text-warning">Issues:</p>
                      <div className="space-y-1">
                        {network.issues.map((issue, index) => (
                          <p key={index} className="text-sm text-warning">
                            ⚠️ {issue}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  View Graphs
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
                {network.status === "Offline" && (
                  <Button size="sm" className="bg-destructive">
                    <Zap className="h-4 w-4 mr-2" />
                    Troubleshoot
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSecurityMonitoring = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Security Monitoring & Access Control
        </h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Security Rule
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {securityData.map((security) => (
          <Card key={security.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{security.id}</Badge>
                    <Badge className={getPriorityColor(security.severity)}>
                      {security.severity}
                    </Badge>
                    <Badge className={getStatusColor(security.status)}>
                      {security.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{security.type}</h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">User:</p>
                      <p>{security.user}</p>
                    </div>
                    <div>
                      <p className="font-medium">Source:</p>
                      <p>{security.source}</p>
                    </div>
                    <div>
                      <p className="font-medium">Timestamp:</p>
                      <p>{security.timestamp}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">Details:</p>
                      <p>{security.details}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Logs
                </Button>
                <Button variant="outline" size="sm">
                  <Lock className="h-4 w-4 mr-2" />
                  Block Source
                </Button>
                {security.severity === "Critical" && (
                  <Button size="sm" className="bg-destructive">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Escalate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Onboarding/Offboarding</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Users
          </Button>
          <Button>
            <UserCheck className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {userAccounts.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-lg">{user.fullName}</h3>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                    <Badge variant="secondary">{user.role}</Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    {user.department}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Username:</p>
                      <p>{user.username}</p>
                    </div>
                    <div>
                      <p className="font-medium">Email:</p>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <p className="font-medium">Last Login:</p>
                      <p>{user.lastLogin}</p>
                    </div>
                    <div>
                      <p className="font-medium">Account Created:</p>
                      <p>{user.accountCreated}</p>
                    </div>
                    <div>
                      <p className="font-medium">Permissions:</p>
                      <p>{user.permissions.join(", ")}</p>
                    </div>
                    <div>
                      <p className="font-medium">Device Access:</p>
                      <p>{user.deviceAccess.join(", ")}</p>
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
                  Edit Permissions
                </Button>
                <Button variant="outline" size="sm">
                  <Key className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
                {user.status === "Active" ? (
                  <Button variant="outline" size="sm" className="text-warning">
                    <UserX className="h-4 w-4 mr-2" />
                    Suspend
                  </Button>
                ) : (
                  <Button size="sm">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Activate
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBackupRecovery = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Backup & Recovery</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Backup
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {backupStatus.map((backup) => (
          <Card key={backup.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{backup.id}</Badge>
                    <Badge className={getStatusColor(backup.status)}>
                      {backup.status}
                    </Badge>
                    <Badge variant="secondary">{backup.type}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{backup.system}</h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Last Backup:</p>
                      <p>{backup.lastBackup}</p>
                    </div>
                    <div>
                      <p className="font-medium">Size:</p>
                      <p className="font-bold">{backup.size}</p>
                    </div>
                    <div>
                      <p className="font-medium">Duration:</p>
                      <p>{backup.duration}</p>
                    </div>
                    <div>
                      <p className="font-medium">Next Scheduled:</p>
                      <p>{backup.nextScheduled}</p>
                    </div>
                    <div>
                      <p className="font-medium">Retention:</p>
                      <p>{backup.retentionPeriod}</p>
                    </div>
                  </div>

                  {backup.error && (
                    <div className="mt-3">
                      <p className="font-medium text-destructive">Error:</p>
                      <p className="text-sm text-destructive">{backup.error}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Logs
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Backup
                </Button>
                {backup.status === "Failed" && (
                  <Button size="sm" className="bg-warning">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Retry Backup
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
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
      case "tickets":
        return renderSupportTickets();
      case "devices":
        return renderDeviceInventory();
      case "software":
        return renderSoftwareLicenses();
      case "network":
        return renderNetworkMonitoring();
      case "security":
        return renderSecurityMonitoring();
      case "users":
        return renderUserManagement();
      case "backup":
        return renderBackupRecovery();
      case "reports":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">IT Reports & Logs</h2>
            <p className="text-muted-foreground">
              IT reporting functionality coming soon...
            </p>
          </div>
        );
      case "alerts":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">IT Alerts & Notifications</h2>
            <div className="space-y-4">
              {itAlerts.map((alert) => (
                <Card
                  key={alert.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{alert.id}</Badge>
                          <Badge className={getPriorityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg">{alert.type}</h3>
                        <p className="text-muted-foreground mb-2">
                          {alert.message}
                        </p>
                        <div className="text-sm text-muted-foreground">
                          <p>Time: {alert.timestamp}</p>
                          <p>Affected: {alert.affected}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
              IT Manager Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive IT infrastructure management, support, and system
              monitoring
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
