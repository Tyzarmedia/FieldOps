import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  MapPin,
  Clock,
  Zap,
  Search,
  Download,
  Plus,
  Edit,
  X,
  Star,
  Flag,
  MessageSquare,
  Lock,
  Unlock,
  RefreshCw,
  Calendar,
  Filter,
  ExternalLink,
  Wrench,
  Tools,
  Gauge,
  ChevronRight,
  Target,
  TrendingDown,
  Fuel,
  Map,
  Wifi,
  WifiOff,
  Archive,
  Send,
  Ban,
  UserCheck
} from "lucide-react";

type ModalType = "overview" | "departments" | "performance" | "compliance" | "revenue" | "fleet" | "inventory" | "controls" | "alerts" | "reports" | "users" | "analytics" | null;

export default function CeoDashboard() {
  const [systemData, setSystemData] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [dateFilter, setDateFilter] = useState("today");
  const [searchTerm, setSearchTerm] = useState("");

  const systemStats = {
    totalJobs: 1247,
    completedJobs: 1089,
    failedJobs: 23,
    activeJobs: 135,
    pendingJobs: 158,
    reworkJobs: 29,
    escalatedJobs: 16,
    onSiteNow: 24,
    totalTechnicians: 45,
    activeTechnicians: 38,
    departments: 8,
    productivity: 87.3,
    revenue: 245000,
    stockValue: 89500,
    fleetUtilization: 92.4,
    complianceScore: 95.2,
    avgJobTime: "1hr 32min",
    longestJob: "6hrs 10min",
    activeVehicles: 23,
    totalVehicles: 25,
    lowStockItems: 12,
    activeAlerts: 7,
    resolvedToday: 12
  };

  const dashboardCards = [
    {
      id: "overview",
      title: "System Overview",
      icon: BarChart3,
      color: "bg-blue-500",
      description: `${systemStats.totalJobs} total jobs, ${systemStats.productivity}% productivity`,
      action: () => setActiveModal("overview"),
    },
    {
      id: "departments",
      title: "Departments",
      icon: Building,
      color: "bg-green-500",
      description: `${systemStats.departments} departments managed`,
      action: () => setActiveModal("departments"),
    },
    {
      id: "performance",
      title: "Performance",
      icon: TrendingUp,
      color: "bg-purple-500",
      description: `${systemStats.activeTechnicians} active technicians`,
      action: () => setActiveModal("performance"),
    },
    {
      id: "compliance",
      title: "Compliance",
      icon: Shield,
      color: "bg-orange-500",
      description: `${systemStats.complianceScore}% compliance score`,
      action: () => setActiveModal("compliance"),
    },
    {
      id: "revenue",
      title: "Revenue",
      icon: DollarSign,
      color: "bg-emerald-500",
      description: `$${systemStats.revenue.toLocaleString()} this month`,
      action: () => setActiveModal("revenue"),
    },
    {
      id: "fleet",
      title: "Fleet Management",
      icon: Truck,
      color: "bg-indigo-500",
      description: `${systemStats.fleetUtilization}% fleet utilization`,
      action: () => setActiveModal("fleet"),
    },
    {
      id: "inventory",
      title: "Inventory",
      icon: Package,
      color: "bg-cyan-500",
      description: `$${systemStats.stockValue.toLocaleString()} stock value`,
      action: () => setActiveModal("inventory"),
    },
    {
      id: "controls",
      title: "System Controls",
      icon: Settings,
      color: "bg-red-500",
      description: "User management and configuration",
      action: () => setActiveModal("controls"),
    },
    {
      id: "alerts",
      title: "System Alerts",
      icon: AlertTriangle,
      color: "bg-yellow-500",
      description: `${systemStats.activeAlerts} active alerts`,
      action: () => setActiveModal("alerts"),
    },
    {
      id: "reports",
      title: "Reports",
      icon: FileText,
      color: "bg-slate-500",
      description: "Generate and view system reports",
      action: () => setActiveModal("reports"),
    },
    {
      id: "users",
      title: "User Management",
      icon: UserPlus,
      color: "bg-pink-500",
      description: "Add and manage system users",
      action: () => setActiveModal("users"),
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: Activity,
      color: "bg-teal-500",
      description: "Detailed system analytics and insights",
      action: () => setActiveModal("analytics"),
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

  // Sample data for modals
  const sampleDepartments = [
    { name: "Fleet", manager: "John Mokoena", staff: 4, tasks: 6, lastUpdate: "Today, 10:32 AM", status: "Active" },
    { name: "Stock", manager: "Brenda Khumalo", staff: 3, tasks: 9, lastUpdate: "Yesterday, 4:12PM", status: "Issues" },
    { name: "Health & Safety", manager: "Thabo Sithole", staff: 2, tasks: 3, lastUpdate: "Today, 9:18 AM", status: "Active" },
    { name: "Technicians", manager: "Sipho Masinga", staff: 22, tasks: 37, lastUpdate: "Live", status: "Active" },
    { name: "Coordination", manager: "Naledi Modise", staff: 3, tasks: 7, lastUpdate: "Today, 8:55 AM", status: "Active" },
    { name: "HR", manager: "Lindiwe Nkosi", staff: 2, tasks: 1, lastUpdate: "Last Week", status: "Idle" },
    { name: "Payroll", manager: "Mpho Molefe", staff: 1, tasks: 2, lastUpdate: "2 Days Ago", status: "Active" },
    { name: "IT", manager: "Kabelo Dlamini", staff: 2, tasks: 5, lastUpdate: "Today, 11:02 AM", status: "Alerts" }
  ];

  const sampleTechnicians = [
    { name: "T. Nkosi", region: "Gauteng", jobs: 5, avgTime: "1hr 20m", productivity: 91.3, incidents: 0, status: "Active" },
    { name: "L. Mkhize", region: "Limpopo", jobs: 3, avgTime: "1hr 05m", productivity: 84.0, incidents: 1, status: "Alert" },
    { name: "P. Moagi", region: "Cape Town", jobs: 4, avgTime: "1hr 10m", productivity: 89.2, incidents: 0, status: "Active" },
    { name: "M. Zondo", region: "Pretoria", jobs: 6, avgTime: "1hr 45m", productivity: 73.8, incidents: 2, status: "Flagged" },
    { name: "B. Sibiya", region: "Durban", jobs: 7, avgTime: "1hr 00m", productivity: 97.6, incidents: 0, status: "Top" }
  ];

  const sampleVehicles = [
    { id: "VH001", type: "Van", driver: "Sipho Masinga", status: "Active", lastService: "2025-07-15", mileage: "45,000", fuel: 75 },
    { id: "VH002", type: "Truck", driver: "Brenda Khumalo", status: "Maintenance", lastService: "2025-07-10", mileage: "80,200", fuel: 0 },
    { id: "VH003", type: "Pickup", driver: "Thabo Sithole", status: "Active", lastService: "2025-07-20", mileage: "39,500", fuel: 60 }
  ];

  const sampleInventory = [
    { name: "Fiber Optic Cable", sku: "FO-001", category: "Cables", quantity: 150, price: 150, location: "Warehouse 1", status: "In Stock" },
    { name: "Splicing Kits", sku: "SK-034", category: "Tools", quantity: 50, price: 120, location: "Warehouse 2", status: "Low Stock" },
    { name: "Splitters", sku: "SP-210", category: "Hardware", quantity: 200, price: 75, location: "Warehouse 1", status: "In Stock" },
    { name: "Fusion Machines", sku: "FM-007", category: "Equipment", quantity: 5, price: 2000, location: "Warehouse 3", status: "In Use" }
  ];

  const sampleUsers = [
    { name: "Dyondzani Masinge", role: "CEO", status: "Active", lastLogin: "2025-07-23 14:12", email: "dyondzani@example.com" },
    { name: "Brenda Khumalo", role: "Stock Manager", status: "Active", lastLogin: "2025-07-24 08:05", email: "brenda@example.com" },
    { name: "Sipho Masinga", role: "Technician", status: "Inactive", lastLogin: "2025-06-30 10:00", email: "sipho@example.com" },
    { name: "Thabo Sithole", role: "Health & Safety", status: "Active", lastLogin: "2025-07-24 11:42", email: "thabo@example.com" }
  ];

  const sampleAlerts = [
    { id: "A-1023", type: "Network", source: "Fiber Node 45", severity: "Critical", time: "2025-07-24 08:45 AM", status: "Active", details: "Fiber cut detected — dispatch team" },
    { id: "A-1024", type: "Server", source: "Database Server", severity: "Warning", time: "2025-07-24 09:15 AM", status: "Acknowledged", details: "High CPU usage, monitoring" },
    { id: "A-1025", type: "Fleet", source: "Vehicle VH002", severity: "Info", time: "2025-07-23 06:30 PM", status: "Resolved", details: "Vehicle maintenance complete" },
    { id: "A-1026", type: "Security", source: "User Login", severity: "Critical", time: "2025-07-23 11:00 PM", status: "Active", details: "Multiple failed login attempts" }
  ];

  const renderSystemOverviewModal = () => (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          System Overview
        </DialogTitle>
        <DialogDescription>
          {systemStats.totalJobs} Total Jobs | {systemStats.productivity}% Productivity Rate
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="flex gap-4 mb-4">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="regions">Regions</TabsTrigger>
            <TabsTrigger value="incidents">Incidents</TabsTrigger>
            <TabsTrigger value="operations">Operations</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Total Jobs</span>
                  </div>
                  <p className="text-2xl font-bold">{systemStats.totalJobs}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-gray-600">Pending Jobs</span>
                  </div>
                  <p className="text-2xl font-bold">{systemStats.pendingJobs}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">Reworks</span>
                  </div>
                  <p className="text-2xl font-bold">{systemStats.reworkJobs}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-600">Failed Jobs</span>
                  </div>
                  <p className="text-2xl font-bold">{systemStats.escalatedJobs}</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Jobs per Day (Last 7 Days)</h3>
                <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-500">Chart Placeholder</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Overall Productivity</span>
                  </div>
                  <p className="text-2xl font-bold">{systemStats.productivity}%</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Avg Completion</span>
                  </div>
                  <p className="text-2xl font-bold">{systemStats.avgJobTime}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-gray-600">Longest Job</span>
                  </div>
                  <p className="text-2xl font-bold">{systemStats.longestJob}</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="regions" className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-4">Regional Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>🔥 Top Performing: Limpopo North</span>
                    <Badge variant="default">95% efficiency</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>🥶 Slowest: Gauteng South</span>
                    <Badge variant="destructive">72% efficiency</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>🏗️ Most Jobs Today: Pretoria CBD</span>
                    <Badge variant="secondary">37 jobs</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-600">SLA Breached</span>
                  </div>
                  <p className="text-2xl font-bold">5</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-gray-600">Incident Reports</span>
                  </div>
                  <p className="text-2xl font-bold">3</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <WifiOff className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-gray-600">Network Outages</span>
                  </div>
                  <p className="text-2xl font-bold">2</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="operations" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-gray-600">Active Fleet</span>
                  </div>
                  <p className="text-2xl font-bold">{systemStats.activeVehicles}/{systemStats.totalVehicles}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Tool className="h-4 w-4 text-orange-500" />
                    <span className="text-sm text-gray-600">Tools Low</span>
                  </div>
                  <p className="text-sm font-bold">Splicing kit</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <p className="text-2xl font-bold">479</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">OT Hours</span>
                  </div>
                  <p className="text-2xl font-bold">92h</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4">
          <Button size="sm"><Eye className="h-4 w-4 mr-2" />View Breakdown</Button>
          <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-2" />Download Report</Button>
          <Button size="sm" variant="outline"><Map className="h-4 w-4 mr-2" />Regional View</Button>
          <Button size="sm" variant="outline"><BarChart3 className="h-4 w-4 mr-2" />Performance Trends</Button>
        </div>
      </div>
    </DialogContent>
  );

  const renderDepartmentsModal = () => (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-green-500" />
          Department Overview
        </DialogTitle>
        <DialogDescription>
          {systemStats.departments} Departments Managed Across Operations
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button size="sm"><Eye className="h-4 w-4 mr-2" />View All</Button>
            <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-2" />Add Department</Button>
            <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-2" />Download Summary</Button>
          </div>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search departments..." className="pl-10 w-64" />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Staff Count</TableHead>
              <TableHead>Active Tasks</TableHead>
              <TableHead>Last Update</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleDepartments.map((dept, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{dept.name}</TableCell>
                <TableCell>{dept.manager}</TableCell>
                <TableCell>{dept.staff}</TableCell>
                <TableCell>{dept.tasks}</TableCell>
                <TableCell>{dept.lastUpdate}</TableCell>
                <TableCell>
                  <Badge variant={dept.status === "Active" ? "default" : dept.status === "Issues" ? "destructive" : dept.status === "Alerts" ? "secondary" : "outline"}>
                    {dept.status === "Active" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {dept.status === "Issues" && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {dept.status === "Alerts" && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {dept.status === "Idle" && <Timer className="h-3 w-3 mr-1" />}
                    {dept.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost"><Edit className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost"><MessageSquare className="h-3 w-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Fleet Department KPIs</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>🚚 Vehicles In Use:</span>
                  <span className="font-medium">18/25</span>
                </div>
                <div className="flex justify-between">
                  <span>🧰 Vehicle Incidents:</span>
                  <span className="font-medium">2 this week</span>
                </div>
                <div className="flex justify-between">
                  <span>🔧 Maintenance Overdue:</span>
                  <span className="font-medium">1 vehicle</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Technician Department</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>👷 Active Technicians:</span>
                  <span className="font-medium">20</span>
                </div>
                <div className="flex justify-between">
                  <span>📍 Clocked In Now:</span>
                  <span className="font-medium">17</span>
                </div>
                <div className="flex justify-between">
                  <span>📈 Completion Rate:</span>
                  <span className="font-medium">92.4%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Quick Filters</h4>
              <div className="space-y-2">
                <Button size="sm" variant="outline" className="w-full">Most Active</Button>
                <Button size="sm" variant="outline" className="w-full">Most Staff</Button>
                <Button size="sm" variant="outline" className="w-full">Needs Attention</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DialogContent>
  );

  const renderPerformanceModal = () => (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-purple-500" />
          Technician Performance Overview
        </DialogTitle>
        <DialogDescription>
          {systemStats.activeTechnicians} Active Technicians | Real-time Performance Tracking
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="flex gap-4">
          <Select defaultValue="today">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              <SelectItem value="gauteng">Gauteng</SelectItem>
              <SelectItem value="limpopo">Limpopo</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Active Techs</p>
                <p className="text-xl font-bold">{systemStats.activeTechnicians}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Jobs Today</p>
                <p className="text-xl font-bold">109</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Avg Productivity</p>
                <p className="text-xl font-bold">86.7%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Avg Time</p>
                <p className="text-xl font-bold">1hr 15min</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">On-Site Now</p>
                <p className="text-xl font-bold">23</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Escalated</p>
                <p className="text-xl font-bold">4</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Technician</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Jobs Today</TableHead>
              <TableHead>Avg Time</TableHead>
              <TableHead>Productivity</TableHead>
              <TableHead>Incidents</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleTechnicians.map((tech, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{tech.name}</TableCell>
                <TableCell>{tech.region}</TableCell>
                <TableCell>{tech.jobs}</TableCell>
                <TableCell>{tech.avgTime}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={tech.productivity} className="w-16" />
                    <span className="text-sm">{tech.productivity}%</span>
                  </div>
                </TableCell>
                <TableCell>{tech.incidents}</TableCell>
                <TableCell>
                  <Badge variant={
                    tech.status === "Active" ? "default" : 
                    tech.status === "Top" ? "secondary" : 
                    tech.status === "Alert" ? "destructive" : 
                    "outline"
                  }>
                    {tech.status === "Top" && <Star className="h-3 w-3 mr-1" />}
                    {tech.status === "Alert" && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {tech.status === "Flagged" && <Flag className="h-3 w-3 mr-1" />}
                    {tech.status === "Active" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {tech.status === "Top" ? "Top Performer" : tech.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost"><MessageSquare className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost"><Flag className="h-3 w-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Performance Heatmap</h4>
              <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-500">Heatmap Visualization</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Productivity Trend</h4>
              <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-500">Trend Chart</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 pt-4">
          <Button size="sm"><Send className="h-4 w-4 mr-2" />Send Review</Button>
          <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-2" />Export Data</Button>
          <Button size="sm" variant="outline"><Flag className="h-4 w-4 mr-2" />Flag for Training</Button>
        </div>
      </div>
    </DialogContent>
  );

  const renderComplianceModal = () => (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-orange-500" />
          Compliance Overview
        </DialogTitle>
        <DialogDescription>
          {systemStats.complianceScore}% Compliance Score across all departments
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Overall Score</p>
                <p className="text-xl font-bold text-green-600">{systemStats.complianceScore}%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Compliant Techs</p>
                <p className="text-xl font-bold">34/38</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Missed Check-ins</p>
                <p className="text-xl font-bold">3</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Safety Incidents</p>
                <p className="text-xl font-bold">2</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Toolbox Talks</p>
                <p className="text-xl font-bold">92%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Equipment</p>
                <p className="text-xl font-bold">96%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Entity</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Compliance %</TableHead>
              <TableHead>Last Violation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">T. Nkosi</TableCell>
              <TableCell>Technician</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={100} className="w-16" />
                  <span>100%</span>
                </div>
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell><Badge variant="default">Compliant</Badge></TableCell>
              <TableCell><Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">M. Zondo</TableCell>
              <TableCell>Technician</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={78} className="w-16" />
                  <span>78%</span>
                </div>
              </TableCell>
              <TableCell>Missed PPE Check (2d)</TableCell>
              <TableCell><Badge variant="destructive">Warning</Badge></TableCell>
              <TableCell><Button size="sm" variant="ghost"><Wrench className="h-3 w-3" /></Button></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Fleet Dept.</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={94} className="w-16" />
                  <span>94%</span>
                </div>
              </TableCell>
              <TableCell>Late Inspection Logs</TableCell>
              <TableCell><Badge variant="secondary">Monitor</Badge></TableCell>
              <TableCell><Button size="sm" variant="ghost"><FileText className="h-3 w-3" /></Button></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Gauteng Region</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={89} className="w-16" />
                  <span>89%</span>
                </div>
              </TableCell>
              <TableCell>3 Unreported Incidents</TableCell>
              <TableCell><Badge variant="destructive">Risk</Badge></TableCell>
              <TableCell><Button size="sm" variant="ghost"><AlertTriangle className="h-3 w-3" /></Button></TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Compliance Over Time</h4>
              <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-500">Line Chart</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Violation Types</h4>
              <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-500">Pie Chart</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Tracked Compliance Checks</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Daily clock-in (with location)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">PPE compliance check</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Tool return compliance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Vehicle daily inspection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Job safety form submitted</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Before & after photos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Daily health checklist</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2 pt-4">
          <Button size="sm"><Download className="h-4 w-4 mr-2" />Download Report</Button>
          <Button size="sm" variant="outline"><Eye className="h-4 w-4 mr-2" />Review Non-Compliant</Button>
          <Button size="sm" variant="outline"><Wrench className="h-4 w-4 mr-2" />Assign Training</Button>
          <Button size="sm" variant="outline"><Send className="h-4 w-4 mr-2" />Send Reminders</Button>
        </div>
      </div>
    </DialogContent>
  );

  const renderRevenueModal = () => (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-500" />
          Monthly Revenue Overview
        </DialogTitle>
        <DialogDescription>
          ${systemStats.revenue.toLocaleString()} generated this month
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-xl font-bold text-green-600">${systemStats.revenue.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Growth MoM</p>
                <p className="text-xl font-bold text-green-600">+12.5%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Invoices Issued</p>
                <p className="text-xl font-bold">310</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Avg Payment</p>
                <p className="text-xl font-bold">18 days</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Outstanding</p>
                <p className="text-xl font-bold text-orange-600">$15,400</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Payment Rate</p>
                <p className="text-xl font-bold">94%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Type</TableHead>
              <TableHead>Amount ($)</TableHead>
              <TableHead>% of Total</TableHead>
              <TableHead>Number of Jobs</TableHead>
              <TableHead>Avg per Job</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Fiber Installations</TableCell>
              <TableCell>$120,000</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={49} className="w-16" />
                  <span>49%</span>
                </div>
              </TableCell>
              <TableCell>140</TableCell>
              <TableCell>$857</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Maintenance & Repairs</TableCell>
              <TableCell>$75,000</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={31} className="w-16" />
                  <span>31%</span>
                </div>
              </TableCell>
              <TableCell>95</TableCell>
              <TableCell>$789</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Upgrades & Expansions</TableCell>
              <TableCell>$30,000</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={12} className="w-16" />
                  <span>12%</span>
                </div>
              </TableCell>
              <TableCell>40</TableCell>
              <TableCell>$750</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">Consulting & Support</TableCell>
              <TableCell>$20,000</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Progress value={8} className="w-16" />
                  <span>8%</span>
                </div>
              </TableCell>
              <TableCell>35</TableCell>
              <TableCell>$571</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Monthly Revenue Trend</h4>
              <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-500">Line Chart - 12 months</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Regional Revenue Distribution</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Gauteng</span>
                  <span className="font-medium">$98,000 (40%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Limpopo</span>
                  <span className="font-medium">$73,500 (30%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cape Town</span>
                  <span className="font-medium">$49,000 (20%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Others</span>
                  <span className="font-medium">$24,500 (10%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 pt-4">
          <Button size="sm"><Download className="h-4 w-4 mr-2" />Download Report</Button>
          <Button size="sm" variant="outline"><Eye className="h-4 w-4 mr-2" />Outstanding Payments</Button>
          <Button size="sm" variant="outline"><Send className="h-4 w-4 mr-2" />Send Reminders</Button>
          <Button size="sm" variant="outline"><ExternalLink className="h-4 w-4 mr-2" />Export to Accounting</Button>
        </div>
      </div>
    </DialogContent>
  );

  const renderFleetModal = () => (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-indigo-500" />
          Fleet Management Overview
        </DialogTitle>
        <DialogDescription>
          {systemStats.fleetUtilization}% fleet utilization — {systemStats.activeVehicles} of {systemStats.totalVehicles} vehicles currently active
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600">Total Vehicles</span>
              </div>
              <p className="text-2xl font-bold">{systemStats.totalVehicles}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Active Vehicles</span>
              </div>
              <p className="text-2xl font-bold">{systemStats.activeVehicles}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-purple-500" />
                <span className="text-sm text-gray-600">Utilization Rate</span>
              </div>
              <p className="text-2xl font-bold">{systemStats.fleetUtilization}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-gray-600">Due Maintenance</span>
              </div>
              <p className="text-2xl font-bold">3</p>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Driver Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Service</TableHead>
              <TableHead>Mileage</TableHead>
              <TableHead>Fuel Level</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleVehicles.map((vehicle, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{vehicle.id}</TableCell>
                <TableCell>{vehicle.type}</TableCell>
                <TableCell>{vehicle.driver}</TableCell>
                <TableCell>
                  <Badge variant={vehicle.status === "Active" ? "default" : "secondary"}>
                    {vehicle.status === "Active" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {vehicle.status === "Maintenance" && <Wrench className="h-3 w-3 mr-1" />}
                    {vehicle.status}
                  </Badge>
                </TableCell>
                <TableCell>{vehicle.lastService}</TableCell>
                <TableCell>{vehicle.mileage} km</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={vehicle.fuel} className="w-16" />
                    <span className="text-sm">{vehicle.fuel}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost"><Calendar className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost"><AlertTriangle className="h-3 w-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Fleet Map</h4>
              <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                <Map className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mt-2">Real-time vehicle locations</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Maintenance Alerts</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span>VH002 - Brake check overdue</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>VH005 - Service due in 2 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>VH001 - Recently serviced</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Fleet Insights</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Avg trip distance:</span>
                  <span className="font-medium">47 km</span>
                </div>
                <div className="flex justify-between">
                  <span>Fuel efficiency:</span>
                  <span className="font-medium">14.2 km/l</span>
                </div>
                <div className="flex justify-between">
                  <span>Incidents this month:</span>
                  <span className="font-medium">1</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 pt-4">
          <Button size="sm"><Calendar className="h-4 w-4 mr-2" />Schedule Maintenance</Button>
          <Button size="sm" variant="outline"><AlertTriangle className="h-4 w-4 mr-2" />Report Incident</Button>
          <Button size="sm" variant="outline"><Users className="h-4 w-4 mr-2" />Assign Vehicle</Button>
          <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-2" />Export Fleet Report</Button>
        </div>
      </div>
    </DialogContent>
  );

  const renderInventoryModal = () => (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-cyan-500" />
          Inventory Overview
        </DialogTitle>
        <DialogDescription>
          Total Stock Value: ${systemStats.stockValue.toLocaleString()}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="flex gap-4">
          <Select defaultValue="current">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Stock</SelectItem>
              <SelectItem value="in">Stock In</SelectItem>
              <SelectItem value="out">Stock Out</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="cables">Cables</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
              <SelectItem value="hardware">Hardware</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Stock Value</p>
                <p className="text-xl font-bold">${systemStats.stockValue.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Stock In</p>
                <p className="text-xl font-bold">$22,000</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Stock Out</p>
                <p className="text-xl font-bold">$18,750</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-xl font-bold text-orange-600">{systemStats.lowStockItems}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total SKUs</p>
                <p className="text-xl font-bold">75</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Locations</p>
                <p className="text-xl font-bold">3</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Total Value</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleInventory.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.sku}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>${(item.quantity * item.price).toLocaleString()}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>
                  <Badge variant={
                    item.status === "In Stock" ? "default" : 
                    item.status === "Low Stock" ? "destructive" : 
                    "secondary"
                  }>
                    {item.status === "In Stock" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {item.status === "Low Stock" && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {item.status === "In Use" && <Clock className="h-3 w-3 mr-1" />}
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost"><Plus className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost"><RefreshCw className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost"><Edit className="h-3 w-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Stock Movement</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Recent Stock In:</strong></div>
                <div>• 50 Splicing Kits added on 2025-07-20</div>
                <div>• 100 Fiber Optic Cables received on 2025-07-15</div>
                <div className="mt-2"><strong>Recent Stock Out:</strong></div>
                <div>• 30 Splitters issued on 2025-07-21</div>
                <div>• 5 Fusion Machines assigned on 2025-07-19</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Alerts & Notifications</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span>Low stock alerts on Splicing Kits</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-orange-500" />
                  <span>Stock discrepancies flagged for audit</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span>Pending requisitions awaiting approval</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 pt-4">
          <Button size="sm"><Download className="h-4 w-4 mr-2" />Download Report</Button>
          <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-2" />Add Stock</Button>
          <Button size="sm" variant="outline"><RefreshCw className="h-4 w-4 mr-2" />Transfer Stock</Button>
          <Button size="sm" variant="outline"><FileText className="h-4 w-4 mr-2" />Purchase Order</Button>
        </div>
      </div>
    </DialogContent>
  );

  const renderSystemControlsModal = () => (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-red-500" />
          System Controls
        </DialogTitle>
        <DialogDescription>
          Manage Users, Roles, Permissions & Settings
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
            <TabsTrigger value="logs">Activity Logs</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Button size="sm"><UserPlus className="h-4 w-4 mr-2" />Add User</Button>
                <Button size="sm" variant="outline"><RefreshCw className="h-4 w-4 mr-2" />Reset Passwords</Button>
              </div>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input placeholder="Search users..." className="pl-10 w-64" />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleUsers.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                        {user.status === "Active" ? <CheckCircle className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost"><Lock className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost"><Edit className="h-3 w-3" /></Button>
                        {user.status === "Inactive" ? 
                          <Button size="sm" variant="ghost"><RefreshCw className="h-3 w-3" /></Button> :
                          <Button size="sm" variant="ghost"><Ban className="h-3 w-3" /></Button>
                        }
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="roles" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Available Roles</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>CEO</span>
                      <Badge variant="default">Full Access</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Manager</span>
                      <Badge variant="secondary">Department Access</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Technician</span>
                      <Badge variant="outline">Field Access</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Stock Manager</span>
                      <Badge variant="outline">Inventory Access</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Permission Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div>✅ Access to modules (Fleet, Stock, HR, etc.)</div>
                    <div>✅ Actions allowed (Create, Read, Update, Delete)</div>
                    <div>✅ Special permissions (override approvals)</div>
                    <div>✅ Create new roles or clone existing ones</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Work Hours & Shifts</h4>
                  <div className="space-y-2 text-sm">
                    <div>Standard Hours: 08:00 - 17:00</div>
                    <div>Overtime Threshold: 8 hours/day</div>
                    <div>Weekend Rate: 1.5x</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Notification Preferences</h4>
                  <div className="space-y-2 text-sm">
                    <div>📧 Email notifications: Enabled</div>
                    <div>📱 SMS alerts: Critical only</div>
                    <div>🔔 Push notifications: Enabled</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Password Policies</h4>
                  <div className="space-y-2 text-sm">
                    <div>Minimum length: 8 characters</div>
                    <div>Complexity: Required</div>
                    <div>Expiration: 90 days</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Audit Log Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div>Track user actions: Enabled</div>
                    <div>Retention period: 1 year</div>
                    <div>Export capability: Available</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Dyondzani Masinge</TableCell>
                  <TableCell>Login</TableCell>
                  <TableCell>Dashboard</TableCell>
                  <TableCell>2025-07-24 14:12</TableCell>
                  <TableCell>192.168.1.100</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Brenda Khumalo</TableCell>
                  <TableCell>Update Stock</TableCell>
                  <TableCell>Inventory</TableCell>
                  <TableCell>2025-07-24 08:05</TableCell>
                  <TableCell>192.168.1.101</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 pt-4">
          <Button size="sm"><UserPlus className="h-4 w-4 mr-2" />Add User</Button>
          <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-2" />Export Logs</Button>
          <Button size="sm" variant="outline"><Shield className="h-4 w-4 mr-2" />Configure 2FA</Button>
          <Button size="sm" variant="outline"><Ban className="h-4 w-4 mr-2" />Auto-disable Accounts</Button>
        </div>
      </div>
    </DialogContent>
  );

  const renderSystemAlertsModal = () => (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          System Alerts & Health Monitor
        </DialogTitle>
        <DialogDescription>
          Active Alerts: {systemStats.activeAlerts} | Resolved Today: {systemStats.resolvedToday}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Alerts</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="info">Info</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="24h">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7d</SelectItem>
              <SelectItem value="30d">Last 30d</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-gray-600">Critical Alerts</span>
              </div>
              <p className="text-2xl font-bold text-red-600">2</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-sm text-gray-600">Warning Alerts</span>
              </div>
              <p className="text-2xl font-bold text-orange-600">3</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-gray-600">Info Alerts</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">2</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-600">Resolved Today</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{systemStats.resolvedToday}</p>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alert ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Time Reported</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleAlerts.map((alert, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{alert.id}</TableCell>
                <TableCell>{alert.type}</TableCell>
                <TableCell>{alert.source}</TableCell>
                <TableCell>
                  <Badge variant={
                    alert.severity === "Critical" ? "destructive" : 
                    alert.severity === "Warning" ? "secondary" : 
                    "outline"
                  }>
                    {alert.severity === "Critical" && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {alert.severity === "Warning" && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {alert.severity === "Info" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {alert.severity}
                  </Badge>
                </TableCell>
                <TableCell>{alert.time}</TableCell>
                <TableCell>
                  <Badge variant={
                    alert.status === "Active" ? "destructive" : 
                    alert.status === "Acknowledged" ? "secondary" : 
                    "default"
                  }>
                    {alert.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost"><CheckCircle className="h-3 w-3" /></Button>
                    <Button size="sm" variant="ghost"><Users className="h-3 w-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">System Health Dashboard</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Uptime (30 days):</span>
                  <span className="font-medium text-green-600">99.7%</span>
                </div>
                <div className="flex justify-between">
                  <span>Network status:</span>
                  <span className="font-medium">Normal</span>
                </div>
                <div className="flex justify-between">
                  <span>Server load:</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="flex justify-between">
                  <span>DB response time:</span>
                  <span className="font-medium">120ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Last backup:</span>
                  <span className="font-medium">12 hours ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Alerts Over Time</h4>
              <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-500">Alert Trend Chart</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 pt-4">
          <Button size="sm"><CheckCircle className="h-4 w-4 mr-2" />Acknowledge All</Button>
          <Button size="sm" variant="outline"><Users className="h-4 w-4 mr-2" />Assign Alerts</Button>
          <Button size="sm" variant="outline"><FileText className="h-4 w-4 mr-2" />Create Ticket</Button>
          <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-2" />Export Logs</Button>
        </div>
      </div>
    </DialogContent>
  );

  const renderReportsModal = () => (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-slate-500" />
          Reports Dashboard
        </DialogTitle>
        <DialogDescription>
          Generate, View, and Export Custom Reports
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">Available Reports</TabsTrigger>
            <TabsTrigger value="recent">Recent Reports</TabsTrigger>
            <TabsTrigger value="generate">Generate New</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Last Generated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Job Performance</TableCell>
                  <TableCell>Summary of jobs completed, pending, etc.</TableCell>
                  <TableCell>Daily / Weekly</TableCell>
                  <TableCell>2025-07-23</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost"><Download className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Technician Productivity</TableCell>
                  <TableCell>Detailed technician output and stats</TableCell>
                  <TableCell>Weekly / Monthly</TableCell>
                  <TableCell>2025-07-20</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost"><Download className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Fleet Utilization</TableCell>
                  <TableCell>Vehicle usage, maintenance, incidents</TableCell>
                  <TableCell>Monthly</TableCell>
                  <TableCell>2025-07-01</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost"><Download className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Compliance & Safety</TableCell>
                  <TableCell>Compliance rates, incidents, trainings</TableCell>
                  <TableCell>Monthly</TableCell>
                  <TableCell>2025-07-15</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost"><Download className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Revenue & Financials</TableCell>
                  <TableCell>Income, invoices, outstanding payments</TableCell>
                  <TableCell>Monthly</TableCell>
                  <TableCell>2025-07-23</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost"><Download className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Generated On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Job Performance</TableCell>
                  <TableCell>2025-07-23</TableCell>
                  <TableCell><Badge variant="default">Ready</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost"><Download className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Fleet Utilization</TableCell>
                  <TableCell>2025-07-01</TableCell>
                  <TableCell><Badge variant="default">Ready</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost"><Download className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Compliance & Safety</TableCell>
                  <TableCell>2025-07-15</TableCell>
                  <TableCell><Badge variant="default">Ready</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost"><Download className="h-3 w-3" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="generate" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Report Generation Panel</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Report Type</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select report type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="performance">Job Performance</SelectItem>
                          <SelectItem value="technician">Technician Productivity</SelectItem>
                          <SelectItem value="fleet">Fleet Utilization</SelectItem>
                          <SelectItem value="compliance">Compliance & Safety</SelectItem>
                          <SelectItem value="revenue">Revenue & Financials</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Date Range</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7d">Last 7 days</SelectItem>
                          <SelectItem value="30d">Last 30 days</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="custom">Custom Range</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Export Format</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pdf">PDF</SelectItem>
                          <SelectItem value="csv">CSV</SelectItem>
                          <SelectItem value="excel">Excel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full"><FileText className="h-4 w-4 mr-2" />Generate Report</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Report Management</h4>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Automated Reports
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Report Templates
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Access Permissions
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Audit Log for Reports
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DialogContent>
  );

  const renderUserManagementModal = () => (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-pink-500" />
          User Management
        </DialogTitle>
        <DialogDescription>
          Add, Edit, Activate, and Manage System Users
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button size="sm"><UserPlus className="h-4 w-4 mr-2" />Add New User</Button>
            <Button size="sm" variant="outline"><RefreshCw className="h-4 w-4 mr-2" />Bulk Actions</Button>
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input placeholder="Search users..." className="pl-10 w-64" />
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleUsers.map((user, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                    {user.status === "Active" ? <CheckCircle className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost"><Edit className="h-3 w-3" /></Button>
                    {user.status === "Inactive" ? 
                      <Button size="sm" variant="ghost"><UserCheck className="h-3 w-3" /></Button> :
                      <Button size="sm" variant="ghost"><Ban className="h-3 w-3" /></Button>
                    }
                    <Button size="sm" variant="ghost"><Lock className="h-3 w-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Add New User</h4>
              <div className="space-y-3">
                <Input placeholder="Full Name" />
                <Input placeholder="Email" type="email" />
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ceo">CEO</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="technician">Technician</SelectItem>
                    <SelectItem value="stock">Stock Manager</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Phone Number" />
                <div className="flex gap-2">
                  <Button className="flex-1">Save User</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">User Activity Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Active Users:</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Inactive Users:</span>
                  <span className="font-medium">1</span>
                </div>
                <div className="flex justify-between">
                  <span>Failed Logins (24h):</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between">
                  <span>Password Resets (7d):</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 pt-4">
          <Button size="sm"><UserPlus className="h-4 w-4 mr-2" />Add User</Button>
          <Button size="sm" variant="outline"><RefreshCw className="h-4 w-4 mr-2" />Activate Users</Button>
          <Button size="sm" variant="outline"><Ban className="h-4 w-4 mr-2" />Deactivate Users</Button>
          <Button size="sm" variant="outline"><Send className="h-4 w-4 mr-2" />Send Password Reset</Button>
        </div>
      </div>
    </DialogContent>
  );

  const renderAnalyticsModal = () => (
    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-teal-500" />
          System Analytics & Insights
        </DialogTitle>
        <DialogDescription>
          Comprehensive overview of system performance and trends
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6">
        <div className="flex gap-4">
          <Select defaultValue="month">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Depts</SelectItem>
              <SelectItem value="tech">Technicians</SelectItem>
              <SelectItem value="fleet">Fleet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Jobs Completed</p>
                <p className="text-xl font-bold">1,247</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+8.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Productivity Rate</p>
                <p className="text-xl font-bold">87.3%</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+2.7%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Fleet Utilization</p>
                <p className="text-xl font-bold">92.4%</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+2.7%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Compliance Score</p>
                <p className="text-xl font-bold">95.2%</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+2.4%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="text-center">
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-xl font-bold">$245k</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-green-600">+11.4%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Jobs Over Time</h4>
              <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-500">Line Chart - Jobs Daily/Weekly/Monthly</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Productivity Heatmap</h4>
              <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-500">Heatmap - Performance by Region/Tech</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Fleet Usage Trends</h4>
              <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-500">Bar Chart - Vehicle Usage & Maintenance</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">Revenue Growth</h4>
              <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                <span className="text-gray-500">Area Chart - Revenue by Service Type</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Key Insights & Recommendations</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">Positive Trend</span>
                </div>
                <p className="text-sm text-green-700">Technician productivity up by 5% in Limpopo region</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Action Required</span>
                </div>
                <p className="text-sm text-orange-700">Fleet maintenance overdue for 3 vehicles</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Recommendation</span>
                </div>
                <p className="text-sm text-blue-700">Schedule refresher training for low compliance departments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2 pt-4">
          <Button size="sm"><BarChart3 className="h-4 w-4 mr-2" />Custom Report Builder</Button>
          <Button size="sm" variant="outline"><Download className="h-4 w-4 mr-2" />Export Analytics</Button>
          <Button size="sm" variant="outline"><Calendar className="h-4 w-4 mr-2" />Schedule Reports</Button>
          <Button size="sm" variant="outline"><RefreshCw className="h-4 w-4 mr-2" />Real-Time Dashboard</Button>
        </div>
      </div>
    </DialogContent>
  );

  const renderModal = () => {
    if (!activeModal) return null;

    switch (activeModal) {
      case "overview":
        return renderSystemOverviewModal();
      case "departments":
        return renderDepartmentsModal();
      case "performance":
        return renderPerformanceModal();
      case "compliance":
        return renderComplianceModal();
      case "revenue":
        return renderRevenueModal();
      case "fleet":
        return renderFleetModal();
      case "inventory":
        return renderInventoryModal();
      case "controls":
        return renderSystemControlsModal();
      case "alerts":
        return renderSystemAlertsModal();
      case "reports":
        return renderReportsModal();
      case "users":
        return renderUserManagementModal();
      case "analytics":
        return renderAnalyticsModal();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          CEO Dashboard
        </h1>
        <p className="text-gray-600">
          Complete system overview and management controls
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-blue-600">
                {systemStats.totalJobs.toLocaleString()}
              </p>
            </div>
            <ClipboardList className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${systemStats.revenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Staff</p>
              <p className="text-2xl font-bold text-purple-600">
                {systemStats.activeTechnicians}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Productivity</p>
              <p className="text-2xl font-bold text-orange-600">
                {systemStats.productivity}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
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
            onClick={() => setActiveModal("users")}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => setActiveModal("reports")}
          >
            <FileText className="h-4 w-4 mr-2" />
            System Report
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Reviewing overtime claims...")}
          >
            <Timer className="h-4 w-4 mr-2" />
            Overtime Review
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => setActiveModal("controls")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Modal Dialog */}
      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        {renderModal()}
      </Dialog>
    </div>
  );
}
