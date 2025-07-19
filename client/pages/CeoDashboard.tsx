import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building,
  Users,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Clock,
  Settings,
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
} from "lucide-react";

export default function CeoDashboard() {
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
    stockValue: 89500,
    fleetUtilization: 92.4,
    complianceScore: 95.2,
  };

  const departmentPerformance = [
    { name: "HVAC", jobs: 342, completed: 98.2, efficiency: 94.1 },
    { name: "Electrical", jobs: 298, completed: 96.8, efficiency: 91.5 },
    { name: "Plumbing", jobs: 245, completed: 97.1, efficiency: 88.9 },
    { name: "Maintenance", jobs: 189, completed: 94.7, efficiency: 85.3 },
    { name: "Emergency", jobs: 173, completed: 99.4, efficiency: 96.8 },
  ];

  const topPerformers = [
    { name: "John Smith", department: "HVAC", jobs: 45, efficiency: 98.1 },
    {
      name: "Sarah Johnson",
      department: "Electrical",
      jobs: 42,
      efficiency: 96.4,
    },
    { name: "Mike Chen", department: "Plumbing", jobs: 38, efficiency: 94.7 },
    {
      name: "Emma Wilson",
      department: "Emergency",
      jobs: 41,
      efficiency: 97.2,
    },
  ];

  const recentAlerts = [
    {
      type: "safety",
      message: "Vehicle inspection overdue - Van #247",
      severity: "high",
    },
    {
      type: "stock",
      message: "Critical stock levels in warehouse B",
      severity: "medium",
    },
    {
      type: "compliance",
      message: "H&S training due for 3 technicians",
      severity: "low",
    },
    {
      type: "system",
      message: "Sage 300 sync completed successfully",
      severity: "info",
    },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "safety":
        return <Shield className="h-4 w-4" />;
      case "stock":
        return <Package className="h-4 w-4" />;
      case "compliance":
        return <FileText className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-destructive";
      case "medium":
        return "text-warning";
      case "low":
        return "text-info";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStats.totalJobs.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-success" />
              <span>+12% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${systemStats.revenue.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-success" />
              <span>+8.2% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Technicians
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStats.activeTechnicians}/{systemStats.totalTechnicians}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-primary" />
              <span>
                {Math.round(
                  (systemStats.activeTechnicians /
                    systemStats.totalTechnicians) *
                    100,
                )}
                % online
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemStats.productivity}%
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>All systems operational</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Job Status Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ClipboardList className="h-5 w-5" />
                  <span>Job Status Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Completed</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {systemStats.completedJobs}
                    </span>
                    <Badge className="bg-success text-success-foreground">
                      {Math.round(
                        (systemStats.completedJobs / systemStats.totalJobs) *
                          100,
                      )}
                      %
                    </Badge>
                  </div>
                </div>
                <Progress
                  value={
                    (systemStats.completedJobs / systemStats.totalJobs) * 100
                  }
                  className="h-2"
                />

                <div className="flex items-center justify-between">
                  <span className="text-sm">Active</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {systemStats.activeJobs}
                    </span>
                    <Badge className="bg-primary text-primary-foreground">
                      {Math.round(
                        (systemStats.activeJobs / systemStats.totalJobs) * 100,
                      )}
                      %
                    </Badge>
                  </div>
                </div>
                <Progress
                  value={(systemStats.activeJobs / systemStats.totalJobs) * 100}
                  className="h-2"
                />

                <div className="flex items-center justify-between">
                  <span className="text-sm">Failed</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      {systemStats.failedJobs}
                    </span>
                    <Badge className="bg-destructive text-destructive-foreground">
                      {Math.round(
                        (systemStats.failedJobs / systemStats.totalJobs) * 100,
                      )}
                      %
                    </Badge>
                  </div>
                </div>
                <Progress
                  value={(systemStats.failedJobs / systemStats.totalJobs) * 100}
                  className="h-2"
                />
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>System Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg border border-border"
                  >
                    <div className={getAlertColor(alert.severity)}>
                      {getAlertIcon(alert.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{alert.message}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {alert.type}
                        </Badge>
                        <Badge
                          className={`text-xs ${
                            alert.severity === "high"
                              ? "bg-destructive text-destructive-foreground"
                              : alert.severity === "medium"
                                ? "bg-warning text-warning-foreground"
                                : alert.severity === "low"
                                  ? "bg-info text-info-foreground"
                                  : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentPerformance.map((dept, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{dept.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {dept.jobs} jobs completed
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Completion
                        </p>
                        <p className="font-semibold text-success">
                          {dept.completed}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Efficiency
                        </p>
                        <p className="font-semibold text-primary">
                          {dept.efficiency}%
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((performer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-semibold text-primary">
                          #{index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{performer.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {performer.department}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Jobs</p>
                        <p className="font-semibold">{performer.jobs}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          Efficiency
                        </p>
                        <p className="font-semibold text-success">
                          {performer.efficiency}%
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>H&S Compliance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">
                  {systemStats.complianceScore}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Overall compliance score
                </p>
                <Button className="w-full mt-4" variant="outline">
                  View H&S Reports
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Truck className="h-5 w-5" />
                  <span>Fleet Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">
                  {systemStats.fleetUtilization}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Fleet utilization
                </p>
                <Button className="w-full mt-4" variant="outline">
                  Fleet Overview
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Stock Value</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-info">
                  ${systemStats.stockValue.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">
                  Total inventory value
                </p>
                <Button className="w-full mt-4" variant="outline">
                  Stock Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>System Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Building className="h-4 w-4 mr-2" />
                  Dashboard Customization
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  User & Role Management
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  Feature Controls
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View System Logs
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserPlus className="h-5 w-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Approve Manager Changes
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate System Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Timer className="h-4 w-4 mr-2" />
                  Review Overtime Claims
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
