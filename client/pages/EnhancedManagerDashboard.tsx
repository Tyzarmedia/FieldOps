import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Users,
  Activity,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  Download,
  RefreshCw,
  Eye,
  Calendar,
  FileText,
  Bell,
  Settings,
  BarChart3,
  Briefcase,
  Package,
  User,
  Search,
  Filter,
  PlusCircle,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Shield,
  Key,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  status: "active" | "on-leave" | "off-duty";
  currentJob?: string;
  completedToday: number;
  efficiency: number;
  location: string;
  lastActivity: string;
}

interface LiveStats {
  teamStatus: {
    total: number;
    active: number;
    percentage: number;
  };
  efficiency: {
    current: number;
    change: number;
    trend: "up" | "down";
  };
  jobsToday: {
    total: number;
    pending: number;
    completed: number;
  };
  revenue: {
    amount: number;
    period: string;
  };
}

interface KPIData {
  period: string;
  revenue: number;
  jobsCompleted: number;
  efficiency: number;
  customerSatisfaction: number;
}

export default function EnhancedManagerDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [showUserManagement, setShowUserManagement] = useState(false);

  // Live statistics state
  const [liveStats, setLiveStats] = useState<LiveStats>({
    teamStatus: { total: 12, active: 10, percentage: 83 },
    efficiency: { current: 91.2, change: 3.2, trend: "up" },
    jobsToday: { total: 234, pending: 18, completed: 216 },
    revenue: { amount: 89400, period: "This month" },
  });

  // Team members data
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "tech001",
      name: "Dyondzani Clement Masinge",
      role: "Senior Technician",
      status: "active",
      currentJob: "JA-7762",
      completedToday: 4,
      efficiency: 95,
      location: "East London",
      lastActivity: "2 min ago",
    },
    {
      id: "tech002",
      name: "Sarah Johnson",
      role: "Technician",
      status: "active",
      currentJob: "JA-7763",
      completedToday: 3,
      efficiency: 88,
      location: "Port Elizabeth",
      lastActivity: "5 min ago",
    },
    {
      id: "tech003",
      name: "Mike Wilson",
      role: "Junior Technician",
      status: "on-leave",
      completedToday: 0,
      efficiency: 0,
      location: "Cape Town",
      lastActivity: "1 day ago",
    },
    {
      id: "coord001",
      name: "Lisa Brown",
      role: "Coordinator",
      status: "active",
      completedToday: 12,
      efficiency: 92,
      location: "Head Office",
      lastActivity: "1 min ago",
    },
  ]);

  // KPI data for charts
  const [kpiData, setKpiData] = useState<KPIData[]>([
    {
      period: "Week 1",
      revenue: 75000,
      jobsCompleted: 180,
      efficiency: 89,
      customerSatisfaction: 87,
    },
    {
      period: "Week 2",
      revenue: 82000,
      jobsCompleted: 195,
      efficiency: 91,
      customerSatisfaction: 89,
    },
    {
      period: "Week 3",
      revenue: 78000,
      jobsCompleted: 172,
      efficiency: 88,
      customerSatisfaction: 85,
    },
    {
      period: "Week 4",
      revenue: 89400,
      jobsCompleted: 234,
      efficiency: 91.2,
      customerSatisfaction: 92,
    },
  ]);

  // Job analytics data
  const jobAnalytics = [
    { name: "Completed", value: 216, color: "#10B981" },
    { name: "In Progress", value: 12, color: "#F59E0B" },
    { name: "Pending", value: 18, color: "#EF4444" },
    { name: "Overdue", value: 6, color: "#DC2626" },
  ];

  // Refresh live data
  const refreshLiveData = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("/api/manager/live-stats");
      if (response.ok) {
        const data = await response.json();
        setLiveStats(data);
      }
    } catch (error) {
      console.error("Failed to refresh live data:", error);
    }
    setRefreshing(false);
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshLiveData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Export KPI report
  const exportKPIReport = async (format: "excel" | "pdf") => {
    try {
      const response = await fetch(
        `/api/manager/export-kpi?format=${format}&period=${selectedPeriod}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `kpi-report-${selectedPeriod}.${format === "excel" ? "xlsx" : "pdf"}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Failed to export report:", error);
    }
  };

  // User management functions
  const createUser = async (userData: any) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Refresh user list
        refreshLiveData();
      }
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };

  const updateUserStatus = async (
    userId: string,
    status: "active" | "suspended",
  ) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        // Update local state
        setTeamMembers((prev) =>
          prev.map((member) =>
            member.id === userId
              ? {
                  ...member,
                  status: status === "active" ? "active" : "off-duty",
                }
              : member,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "on-leave":
        return "bg-yellow-100 text-yellow-800";
      case "off-duty":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Manager Dashboard
              </h1>
              <p className="text-gray-600">Real-time operations overview</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={refreshLiveData}
                disabled={refreshing}
                variant="outline"
                size="sm"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button
                onClick={() => setShowUserManagement(!showUserManagement)}
                variant="outline"
                size="sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Statistics Cards */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Team Status */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Team Status
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-2xl font-bold">
                      {liveStats.teamStatus.active}/{liveStats.teamStatus.total}
                    </span>
                    <Badge className="ml-2 bg-green-100 text-green-800">
                      {liveStats.teamStatus.percentage}% active
                    </Badge>
                  </div>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          {/* Efficiency */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Efficiency
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-2xl font-bold">
                      {liveStats.efficiency.current}%
                    </span>
                    <div className="flex items-center ml-2">
                      {liveStats.efficiency.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm text-green-600 ml-1">
                        +{liveStats.efficiency.change}% from last week
                      </span>
                    </div>
                  </div>
                </div>
                <Activity className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          {/* Jobs Today */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Jobs Today
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="text-2xl font-bold">
                      {liveStats.jobsToday.total}
                    </span>
                    <Badge className="ml-2 bg-orange-100 text-orange-800">
                      {liveStats.jobsToday.pending} pending
                    </Badge>
                  </div>
                </div>
                <Briefcase className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          {/* Revenue */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">
                      ${liveStats.revenue.amount.toLocaleString()}
                    </span>
                    <p className="text-sm text-gray-500">
                      {liveStats.revenue.period}
                    </p>
                  </div>
                </div>
                <DollarSign className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Dashboard</TabsTrigger>
            <TabsTrigger value="team">Team Tracking</TabsTrigger>
            <TabsTrigger value="analytics">Job Analytics</TabsTrigger>
            <TabsTrigger value="reports">Live Team</TabsTrigger>
            <TabsTrigger value="jobs">Job Board</TabsTrigger>
            <TabsTrigger value="kpi">KPI Reports</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Job Status Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Job Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={jobAnalytics}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {jobAnalytics.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {jobAnalytics.map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">
                          {item.name}: {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={kpiData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="efficiency"
                        stroke="#10B981"
                        strokeWidth={2}
                        name="Efficiency %"
                      />
                      <Line
                        type="monotone"
                        dataKey="customerSatisfaction"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        name="Customer Satisfaction %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Team Tracking Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Team Status</CardTitle>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Team Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {member.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-gray-600">
                              {member.role}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge className={getStatusColor(member.status)}>
                            {member.status}
                          </Badge>
                          <div className="text-sm text-gray-600">
                            <div>Completed: {member.completedToday}</div>
                            <div>Efficiency: {member.efficiency}%</div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {member.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {member.lastActivity}
                            </div>
                          </div>
                          {member.currentJob && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                navigate(`/manager/jobs/${member.currentJob}`)
                              }
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Job
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={kpiData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Jobs Completed by Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={kpiData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="period" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="jobsCompleted" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* KPI Reports Tab */}
          <TabsContent value="kpi" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>KPI Report Generator</CardTitle>
                <div className="flex items-center space-x-4">
                  <Select
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => exportKPIReport("excel")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Excel
                  </Button>
                  <Button
                    onClick={() => exportKPIReport("pdf")}
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* KPI Summary Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Period
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Revenue
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Jobs Completed
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Efficiency
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Customer Satisfaction
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {kpiData.map((data, index) => (
                        <tr key={index}>
                          <td className="border border-gray-300 px-4 py-2">
                            {data.period}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            ${data.revenue.toLocaleString()}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {data.jobsCompleted}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {data.efficiency}%
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {data.customerSatisfaction}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Job Board Tab */}
          <TabsContent value="jobs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Management Board</CardTitle>
                <div className="flex space-x-2">
                  <Button onClick={() => navigate("/coordinator/assign-jobs")}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Create Job
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export Jobs
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Access to full job management, creation, assignment, and
                  tracking functionality. Managers can view all jobs across
                  teams and generate comprehensive reports.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Team Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Team Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-sm text-gray-600">
                          Total Team Members
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-green-500" />
                        <div className="text-2xl font-bold">8.5h</div>
                        <div className="text-sm text-gray-600">
                          Avg Work Hours
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <Activity className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                        <div className="text-2xl font-bold">96%</div>
                        <div className="text-sm text-gray-600">
                          Attendance Rate
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Overtime Report</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">
                          This Week's Overtime
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Monday</span>
                            <span>2.5 hours</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Wednesday</span>
                            <span>1.5 hours</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Friday</span>
                            <span>3.0 hours</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">Unassigned Jobs</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>High Priority</span>
                            <Badge className="bg-red-100 text-red-800">3</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Medium Priority</span>
                            <Badge className="bg-yellow-100 text-yellow-800">
                              8
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Low Priority</span>
                            <Badge className="bg-green-100 text-green-800">
                              7
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* User Management Modal */}
        {showUserManagement && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">
                    User Management & Controls
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowUserManagement(false)}
                  >
                    ×
                  </Button>
                </div>

                <Tabs defaultValue="users" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="users">User Management</TabsTrigger>
                    <TabsTrigger value="permissions">Permissions</TabsTrigger>
                    <TabsTrigger value="activity">Activity Log</TabsTrigger>
                  </TabsList>

                  <TabsContent value="users" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Input
                        placeholder="Search users..."
                        className="max-w-sm"
                      />
                      <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create User
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {teamMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 border rounded"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-gray-600">
                                {member.role}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getStatusColor(member.status)}>
                              {member.status}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                updateUserStatus(
                                  member.id,
                                  member.status === "active"
                                    ? "suspended"
                                    : "active",
                                )
                              }
                            >
                              {member.status === "active" ? (
                                <>
                                  <UserX className="h-4 w-4 mr-1" />
                                  Suspend
                                </>
                              ) : (
                                <>
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Activate
                                </>
                              )}
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="permissions" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            Role Permissions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span>Manager</span>
                            <Badge>Full Access</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Coordinator</span>
                            <Badge>Read/Write Jobs</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Technician</span>
                            <Badge>Read Only</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Stock Manager</span>
                            <Badge>Stock Management</Badge>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            System Privileges
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-blue-500" />
                            <span>Read Only Access</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Edit className="h-4 w-4 text-green-500" />
                            <span>Write Access</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Key className="h-4 w-4 text-purple-500" />
                            <span>Admin Access</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Trash2 className="h-4 w-4 text-red-500" />
                            <span>Delete Permissions</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="activity" className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-3 border rounded">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              Job JA-7762 completed
                            </div>
                            <div className="text-sm text-gray-600">
                              by Dyondzani Clement Masinge • 2 minutes ago
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-800">
                            Job Completed
                          </Badge>
                        </div>
                      </div>

                      <div className="p-3 border rounded">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">
                              Stock allocated to technician
                            </div>
                            <div className="text-sm text-gray-600">
                              by Stock Manager • 5 minutes ago
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">
                            Stock Movement
                          </Badge>
                        </div>
                      </div>

                      <div className="p-3 border rounded">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">New job assigned</div>
                            <div className="text-sm text-gray-600">
                              by Lisa Brown • 8 minutes ago
                            </div>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Job Assignment
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
