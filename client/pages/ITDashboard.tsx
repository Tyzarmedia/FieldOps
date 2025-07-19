import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Laptop,
  Smartphone,
  Monitor,
  Router,
  HardDrive,
  Headphones,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  FileText,
  Shield,
  Activity,
  Wrench,
  Search,
  Filter,
} from "lucide-react";

export default function ITDashboard() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");

  const itStats = {
    totalAssets: 234,
    assignedAssets: 187,
    availableAssets: 32,
    maintenanceAssets: 15,
    openTickets: 23,
    resolvedTickets: 156,
    pendingRequests: 8,
    systemAccessUsers: 87,
    securityAlerts: 2,
  };

  const assets = [
    {
      id: "IT001",
      name: "Dell Latitude 7420",
      category: "Laptop",
      assignedTo: "John Smith",
      department: "Field Operations",
      status: "assigned",
      purchaseDate: "2023-03-15",
      warrantyExpiry: "2026-03-15",
      condition: "excellent",
      location: "Remote - Downtown",
      serialNumber: "DL7420-2023-001",
      value: 1299,
    },
    {
      id: "IT002",
      name: "iPhone 14 Pro",
      category: "Mobile Device",
      assignedTo: "Sarah Johnson",
      department: "Fleet Management",
      status: "assigned",
      purchaseDate: "2023-09-20",
      warrantyExpiry: "2024-09-20",
      condition: "good",
      location: "Office - Fleet Dept",
      serialNumber: "IP14P-2023-002",
      value: 999,
    },
    {
      id: "IT003",
      name: "Cisco Router ISR4431",
      category: "Network Equipment",
      assignedTo: null,
      department: "IT Department",
      status: "maintenance",
      purchaseDate: "2022-11-10",
      warrantyExpiry: "2025-11-10",
      condition: "needs-repair",
      location: "Server Room",
      serialNumber: "CSC-ISR4431-003",
      value: 2499,
    },
    {
      id: "IT004",
      name: 'Samsung 32" Monitor',
      category: "Monitor",
      assignedTo: null,
      department: null,
      status: "available",
      purchaseDate: "2023-06-05",
      warrantyExpiry: "2026-06-05",
      condition: "excellent",
      location: "IT Storage",
      serialNumber: "SAM32-2023-004",
      value: 299,
    },
  ];

  const supportTickets = [
    {
      id: "TK001",
      title: "Email access issues",
      description: "Cannot access email on mobile device",
      submittedBy: "Emma Wilson",
      department: "Customer Service",
      priority: "medium",
      status: "open",
      category: "Email/Communication",
      submittedDate: "2024-01-20",
      assignedTo: "IT Team",
      estimatedResolution: "2024-01-22",
    },
    {
      id: "TK002",
      title: "Laptop running slow",
      description: "Laptop performance degraded, taking long to boot",
      submittedBy: "Mike Chen",
      department: "Field Operations",
      priority: "low",
      status: "in-progress",
      category: "Hardware",
      submittedDate: "2024-01-18",
      assignedTo: "John IT",
      estimatedResolution: "2024-01-21",
    },
    {
      id: "TK003",
      title: "VPN connection failure",
      description: "Unable to connect to company VPN from home",
      submittedBy: "David Brown",
      department: "Management",
      priority: "high",
      status: "open",
      category: "Network/Connectivity",
      submittedDate: "2024-01-21",
      assignedTo: "Unassigned",
      estimatedResolution: "2024-01-22",
    },
  ];

  const systemAccess = [
    {
      user: "John Smith",
      role: "Senior Technician",
      systems: ["FieldOps App", "Customer Portal", "Fleet Management"],
      lastLogin: "2024-01-21 09:15",
      status: "active",
      permissions: "standard",
    },
    {
      user: "Sarah Johnson",
      role: "Fleet Coordinator",
      systems: ["FieldOps App", "Fleet Management", "Vehicle Tracking"],
      lastLogin: "2024-01-21 08:30",
      status: "active",
      permissions: "elevated",
    },
    {
      user: "Mike Chen",
      role: "Network Technician",
      systems: ["FieldOps App", "Network Monitoring"],
      lastLogin: "2024-01-20 16:45",
      status: "inactive",
      permissions: "standard",
    },
  ];

  const auditLogs = [
    {
      id: "AL001",
      action: "User Login",
      user: "john.smith@fiberco.com",
      system: "FieldOps Portal",
      timestamp: "2024-01-21 09:15:23",
      ipAddress: "192.168.1.45",
      status: "success",
      details: "Successful login from mobile app",
    },
    {
      id: "AL002",
      action: "Password Change",
      user: "sarah.johnson@fiberco.com",
      system: "Company Directory",
      timestamp: "2024-01-21 08:22:11",
      ipAddress: "192.168.1.23",
      status: "success",
      details: "Password successfully updated",
    },
    {
      id: "AL003",
      action: "Failed Login Attempt",
      user: "mike.chen@fiberco.com",
      system: "Network Monitoring",
      timestamp: "2024-01-20 22:31:45",
      ipAddress: "203.145.67.89",
      status: "failed",
      details: "Multiple failed login attempts detected",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
      case "active":
      case "resolved":
      case "success":
        return "bg-success text-success-foreground";
      case "available":
      case "open":
      case "in-progress":
        return "bg-info text-info-foreground";
      case "maintenance":
      case "needs-repair":
      case "inactive":
        return "bg-warning text-warning-foreground";
      case "failed":
      case "critical":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-info text-info-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "excellent":
        return "bg-success text-success-foreground";
      case "good":
        return "bg-info text-info-foreground";
      case "fair":
        return "bg-warning text-warning-foreground";
      case "needs-repair":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Laptop":
        return <Laptop className="h-4 w-4" />;
      case "Mobile Device":
        return <Smartphone className="h-4 w-4" />;
      case "Monitor":
        return <Monitor className="h-4 w-4" />;
      case "Network Equipment":
        return <Router className="h-4 w-4" />;
      case "Storage":
        return <HardDrive className="h-4 w-4" />;
      case "Audio":
        return <Headphones className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* IT Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Laptop className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itStats.totalAssets}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>{itStats.assignedAssets} assigned</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itStats.openTickets}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 text-warning" />
              <span>{itStats.pendingRequests} pending</span>
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
              {itStats.maintenanceAssets}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Wrench className="h-3 w-3 text-warning" />
              <span>Items in maintenance</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itStats.securityAlerts}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Shield className="h-3 w-3 text-destructive" />
              <span>Active alerts</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="assets">Assets</TabsTrigger>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="access">System Access</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">IT Asset Tracking</h3>
            <div className="flex space-x-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Laptop">Laptops</SelectItem>
                  <SelectItem value="Mobile Device">Mobile Devices</SelectItem>
                  <SelectItem value="Monitor">Monitors</SelectItem>
                  <SelectItem value="Network Equipment">
                    Network Equipment
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {assets.map((asset) => (
              <Card
                key={asset.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{asset.id}</Badge>
                        <Badge className={getStatusColor(asset.status)}>
                          {asset.status}
                        </Badge>
                        <Badge className={getConditionColor(asset.condition)}>
                          {asset.condition}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          {getCategoryIcon(asset.category)}
                          <span className="text-xs text-muted-foreground">
                            {asset.category}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {asset.name}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {asset.assignedTo || "Unassigned"}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Purchased: {asset.purchaseDate}
                        </div>
                        <div className="flex items-center">
                          <Shield className="h-3 w-3 mr-1" />
                          Warranty: {asset.warrantyExpiry}
                        </div>
                        <div className="flex items-center">
                          <Settings className="h-3 w-3 mr-1" />
                          SN: {asset.serialNumber}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Location:</strong> {asset.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Value</p>
                      <p className="font-semibold text-lg">
                        ${asset.value.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Asset
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <User className="h-4 w-4 mr-2" />
                      {asset.assignedTo ? "Reassign" : "Assign"}
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Wrench className="h-4 w-4 mr-2" />
                      Maintenance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Support Tickets</h3>
            <div className="flex space-x-2">
              <Select
                value={selectedPriority}
                onValueChange={setSelectedPriority}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Priorities</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {supportTickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{ticket.id}</Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                        <Badge variant="outline">{ticket.category}</Badge>
                      </div>
                      <h4 className="font-semibold">{ticket.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {ticket.description}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Submitted by:</span>{" "}
                          {ticket.submittedBy}
                        </div>
                        <div>
                          <span className="font-medium">Department:</span>{" "}
                          {ticket.department}
                        </div>
                        <div>
                          <span className="font-medium">Assigned to:</span>{" "}
                          {ticket.assignedTo}
                        </div>
                        <div>
                          <span className="font-medium">Due:</span>{" "}
                          {ticket.estimatedResolution}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <User className="h-4 w-4 mr-2" />
                      Assign Technician
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Update Status
                    </Button>
                    {ticket.status === "open" && (
                      <Button size="sm" className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Start Working
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="access" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">System Access Management</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Grant Access
            </Button>
          </div>

          <div className="space-y-4">
            {systemAccess.map((access, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getStatusColor(access.status)}>
                          {access.status}
                        </Badge>
                        <Badge
                          className={
                            access.permissions === "elevated"
                              ? "bg-warning text-warning-foreground"
                              : "bg-info text-info-foreground"
                          }
                        >
                          {access.permissions}
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{access.user}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {access.role}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Systems:</span>{" "}
                        {access.systems.join(", ")}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        <span className="font-medium">Last Login:</span>{" "}
                        {access.lastLogin}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Access Log
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Modify Permissions
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Shield className="h-4 w-4 mr-2" />
                      Reset Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">System Audit Logs</h3>
            <div className="flex space-x-2">
              <Input placeholder="Search logs..." className="w-64" />
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {auditLogs.map((log) => (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{log.id}</Badge>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status}
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{log.action}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-muted-foreground mt-2">
                        <div>
                          <span className="font-medium">User:</span> {log.user}
                        </div>
                        <div>
                          <span className="font-medium">System:</span>{" "}
                          {log.system}
                        </div>
                        <div>
                          <span className="font-medium">IP:</span>{" "}
                          {log.ipAddress}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {log.details}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {log.timestamp}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>IT Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Asset Inventory Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Ticket Resolution Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Audit Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  System Usage Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Wrench className="h-4 w-4 mr-2" />
                  Maintenance Schedule
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Register New Asset
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Asset Data
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Import Assets
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Scan
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  System Maintenance
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
