import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Package,
  Clock,
  TrendingUp,
  Eye,
  Search,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Download,
  DollarSign,
  Activity,
  UserCheck,
  MapPin
} from "lucide-react";

interface JobAuditData {
  jobId: string;
  title: string;
  currentAssignee: string;
  assignmentHistory: any[];
  status: string;
  createdDate: string;
  lastModified: string;
}

interface TechnicianReport {
  technicianId: string;
  totalJobsCompleted: number;
  totalHoursWorked: number;
  averageJobTime: number;
  jobDetails: any[];
}

interface StockItem {
  id: string;
  name: string;
  quantity: number;
  minimumQuantity: number;
  status: string;
  unitPrice: number;
  category: string;
}

interface TechnicianStatus {
  id: string;
  name: string;
  status: "on-duty" | "off-duty" | "on-leave";
  clockInTime?: string;
  currentLocation?: string;
}

export default function EnhancedManagerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [jobAuditData, setJobAuditData] = useState<JobAuditData[]>([]);
  const [technicianReports, setTechnicianReports] = useState<TechnicianReport[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [technicianStatuses, setTechnicianStatuses] = useState<TechnicianStatus[]>([]);
  const [completedJobs, setCompletedJobs] = useState<any[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load manager dashboard data
  useEffect(() => {
    const loadManagerData = async () => {
      setIsLoading(true);
      try {
        // Load job audit data
        const auditResponse = await fetch("/api/job-mgmt/audit/assignments");
        if (auditResponse.ok) {
          const auditData = await auditResponse.json();
          if (auditData.success) {
            setJobAuditData(auditData.data);
          }
        }

        // Load stock inventory (view-only for managers)
        const stockResponse = await fetch("/api/stock-management/items");
        if (stockResponse.ok) {
          const stockData = await stockResponse.json();
          if (stockData.success) {
            setStockItems(stockData.data);
          }
        }

        // Load technician statuses
        const statusResponse = await fetch("/api/technician-status/status");
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          if (statusData.success) {
            setTechnicianStatuses(statusData.data);
          }
        }

        // Load completed jobs with stock usage
        const jobsResponse = await fetch("/api/job-mgmt/completed-jobs-stock");
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          if (jobsData.success) {
            setCompletedJobs(jobsData.data);
          }
        }

      } catch (error) {
        console.error("Error loading manager data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadManagerData();
  }, []);

  // Load technician report when selected
  useEffect(() => {
    if (selectedTechnician) {
      const loadTechnicianReport = async () => {
        try {
          const reportResponse = await fetch(`/api/job-mgmt/reports/technician-time/${selectedTechnician}`);
          if (reportResponse.ok) {
            const reportData = await reportResponse.json();
            if (reportData.success) {
              setTechnicianReports([reportData.data]);
            }
          }
        } catch (error) {
          console.error("Error loading technician report:", error);
        }
      };
      loadTechnicianReport();
    }
  }, [selectedTechnician]);

  const dashboardStats = {
    totalTechnicians: technicianStatuses.length,
    activeTechnicians: technicianStatuses.filter(t => t.status === "on-duty").length,
    totalStock: stockItems.reduce((sum, item) => sum + item.quantity, 0),
    lowStockItems: stockItems.filter(item => item.quantity <= item.minimumQuantity).length,
    totalStockValue: stockItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
    completedJobsToday: completedJobs.filter(job => 
      new Date(job.completedDate).toDateString() === new Date().toDateString()
    ).length,
    totalStockUsageValue: completedJobs.reduce((sum, job) => sum + (job.stockValue || 0), 0),
  };

  const filteredStockItems = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Monitor operations, track performance, and manage resources
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Technicians</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {dashboardStats.activeTechnicians}/{dashboardStats.totalTechnicians}
              </div>
              <p className="text-xs text-muted-foreground">Currently on duty</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stock Inventory</CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R{(dashboardStats.totalStockValue / 1000).toFixed(0)}k
              </div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.lowStockItems} low stock items
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jobs Completed Today</CardTitle>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {dashboardStats.completedJobsToday}
              </div>
              <p className="text-xs text-muted-foreground">Stock used: R{dashboardStats.totalStockUsageValue.toFixed(0)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stock Used</CardTitle>
              <DollarSign className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                R{(dashboardStats.totalStockUsageValue / 1000).toFixed(1)}k
              </div>
              <p className="text-xs text-muted-foreground">All completed jobs</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="technicians">Technicians</TabsTrigger>
            <TabsTrigger value="stock">Stock Inventory</TabsTrigger>
            <TabsTrigger value="jobs">Job Tracking</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Technician Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Technician Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {technicianStatuses.slice(0, 5).map((tech) => (
                      <div key={tech.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{tech.name}</p>
                          <p className="text-sm text-gray-500">{tech.currentLocation}</p>
                        </div>
                        <Badge variant={tech.status === "on-duty" ? "default" : "secondary"}>
                          {tech.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Completed Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Recent Completions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {completedJobs.slice(0, 5).map((job) => (
                      <div key={job.jobId} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-gray-500">
                            {job.actualHours}h • {job.stockUsed?.length || 0} items used
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">R{job.stockValue || 0}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(job.completedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="technicians">
            <div className="space-y-6">
              {/* Technician Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Technician Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a technician" />
                    </SelectTrigger>
                    <SelectContent>
                      {technicianStatuses.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>
                          {tech.name} - {tech.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Technician Performance Report */}
              {technicianReports.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Report</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {technicianReports.map((report) => (
                      <div key={report.technicianId} className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{report.totalJobsCompleted}</p>
                            <p className="text-sm text-gray-600">Jobs Completed</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{report.totalHoursWorked.toFixed(1)}h</p>
                            <p className="text-sm text-gray-600">Total Hours</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-orange-600">{report.averageJobTime.toFixed(1)}h</p>
                            <p className="text-sm text-gray-600">Avg Job Time</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Recent Jobs</h4>
                          {report.jobDetails.slice(0, 5).map((job) => (
                            <div key={job.jobId} className="flex items-center justify-between p-3 border rounded">
                              <div>
                                <p className="font-medium">{job.title}</p>
                                <p className="text-sm text-gray-500">
                                  {job.status} • {job.actualHours || job.estimatedHours}h
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm">R{job.stockValue || 0}</p>
                                <p className="text-xs text-gray-500">{job.stockUsed?.length || 0} items</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="stock">
            <div className="space-y-6">
              {/* Stock Search */}
              <Card>
                <CardHeader>
                  <CardTitle>Stock Inventory (View Only)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search stock items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Stock Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStockItems.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{item.name}</h3>
                        <Badge variant={item.quantity <= item.minimumQuantity ? "destructive" : "secondary"}>
                          {item.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Quantity: <span className="font-medium">{item.quantity}</span></p>
                        <p>Min Level: <span className="font-medium">{item.minimumQuantity}</span></p>
                        <p>Value: <span className="font-medium">R{(item.quantity * item.unitPrice).toFixed(2)}</span></p>
                        <p>Category: <span className="font-medium">{item.category}</span></p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Job Assignment Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {jobAuditData.map((job) => (
                      <div key={job.jobId} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{job.title}</h3>
                          <Badge>{job.status}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          Currently assigned to: {job.currentAssignee}
                        </p>
                        {job.assignmentHistory && job.assignmentHistory.length > 0 && (
                          <div className="text-xs space-y-1">
                            <p className="font-medium">Assignment History:</p>
                            {job.assignmentHistory.map((assignment, index) => (
                              <p key={index} className="text-gray-500">
                                {new Date(assignment.assignedAt).toLocaleString()} - 
                                Assigned to {assignment.assignedTo} by {assignment.assignedBy}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stock Usage Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {completedJobs.slice(0, 10).map((job) => (
                      <div key={job.jobId} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{job.title}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(job.completedDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R{job.stockValue || 0}</p>
                          <p className="text-sm text-gray-500">{job.stockUsed?.length || 0} items</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded">
                        <p className="text-2xl font-bold text-blue-600">{jobAuditData.length}</p>
                        <p className="text-sm text-gray-600">Total Jobs</p>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded">
                        <p className="text-2xl font-bold text-green-600">{stockItems.length}</p>
                        <p className="text-sm text-gray-600">Stock Items</p>
                      </div>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded">
                      <p className="text-2xl font-bold text-orange-600">
                        R{(dashboardStats.totalStockUsageValue / 1000).toFixed(1)}k
                      </p>
                      <p className="text-sm text-gray-600">Total Stock Value Used</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
