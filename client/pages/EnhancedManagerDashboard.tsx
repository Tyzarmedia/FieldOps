import { useState, useEffect } from "react";
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
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Calendar,
  MapPin,
  Eye,
  Download,
  RefreshCw,
  Filter,
  Search,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Timer,
  Package,
  FileText,
  User,
} from "lucide-react";

interface ManagerStats {
  totalJobs: number;
  completedJobs: number;
  inProgressJobs: number;
  overdueJobs: number;
  totalTechnicians: number;
  activeTechnicians: number;
  totalRevenue: number;
  averageJobTime: number;
  customerSatisfaction: number;
  totalOvertimeHours: number;
  totalOvertimeCost: number;
  productivityScore: number;
}

interface TechnicianPerformance {
  id: string;
  name: string;
  jobsCompleted: number;
  averageTime: number;
  customerRating: number;
  overtimeHours: number;
  efficiency: number;
  revenue: number;
}

interface JobTrend {
  date: string;
  completed: number;
  assigned: number;
  overtime: number;
}

interface DepartmentData {
  name: string;
  jobs: number;
  revenue: number;
  technicians: number;
}

export default function EnhancedManagerDashboard() {
  const [stats, setStats] = useState<ManagerStats>({
    totalJobs: 0,
    completedJobs: 0,
    inProgressJobs: 0,
    overdueJobs: 0,
    totalTechnicians: 0,
    activeTechnicians: 0,
    totalRevenue: 0,
    averageJobTime: 0,
    customerSatisfaction: 0,
    totalOvertimeHours: 0,
    totalOvertimeCost: 0,
    productivityScore: 0,
  });

  const [technicianPerformance, setTechnicianPerformance] = useState<TechnicianPerformance[]>([]);
  const [jobTrends, setJobTrends] = useState<JobTrend[]>([]);
  const [departmentData, setDepartmentData] = useState<DepartmentData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("7days");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  // Load dashboard data
  useEffect(() => {
    const loadManagerData = async () => {
      try {
        setLoading(true);

        // Load manager statistics
        const statsResponse = await fetch(`/api/manager/stats?period=${selectedPeriod}`);
        if (statsResponse.ok) {
          const statsResult = await statsResponse.json();
          if (statsResult.success) {
            setStats(statsResult.data);
          }
        }

        // Load technician performance data
        const performanceResponse = await fetch(`/api/manager/technician-performance?period=${selectedPeriod}`);
        if (performanceResponse.ok) {
          const performanceResult = await performanceResponse.json();
          if (performanceResult.success) {
            setTechnicianPerformance(performanceResult.data);
          }
        }

        // Load job trends
        const trendsResponse = await fetch(`/api/manager/job-trends?period=${selectedPeriod}`);
        if (trendsResponse.ok) {
          const trendsResult = await trendsResponse.json();
          if (trendsResult.success) {
            setJobTrends(trendsResult.data);
          }
        }

        // Load department data
        const deptResponse = await fetch(`/api/manager/department-stats?period=${selectedPeriod}`);
        if (deptResponse.ok) {
          const deptResult = await deptResponse.json();
          if (deptResult.success) {
            setDepartmentData(deptResult.data);
          }
        }

      } catch (error) {
        console.error("Error loading manager data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadManagerData();

    // Set up auto-refresh
    const interval = setInterval(loadManagerData, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const pieChartColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1'];

  const jobStatusData = [
    { name: 'Completed', value: stats.completedJobs, color: '#22c55e' },
    { name: 'In Progress', value: stats.inProgressJobs, color: '#3b82f6' },
    { name: 'Overdue', value: stats.overdueJobs, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Manager Dashboard</h1>
            <p className="text-purple-100">Comprehensive business intelligence and technician oversight</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1day">Last 24 Hours</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <BarChart3 className="h-10 w-10" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">R{stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-green-600">+12% from last period</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Jobs Completed</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.completedJobs}</p>
                  <p className="text-xs text-blue-600">{((stats.completedJobs / stats.totalJobs) * 100).toFixed(1)}% completion rate</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Technicians</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.activeTechnicians}/{stats.totalTechnicians}</p>
                  <p className="text-xs text-purple-600">{((stats.activeTechnicians / stats.totalTechnicians) * 100).toFixed(1)}% utilization</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Job Time</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.averageJobTime.toFixed(1)}h</p>
                  <p className="text-xs text-orange-600">Productivity: {stats.productivityScore}%</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Customer Satisfaction</p>
                  <p className="text-xl font-bold text-green-600">{stats.customerSatisfaction.toFixed(1)}/5.0</p>
                </div>
                <TrendingUp className="h-6 w-6 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overtime Hours</p>
                  <p className="text-xl font-bold text-red-600">{stats.totalOvertimeHours.toFixed(1)}h</p>
                  <p className="text-xs text-red-600">Cost: R{stats.totalOvertimeCost.toLocaleString()}</p>
                </div>
                <Timer className="h-6 w-6 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Overdue Jobs</p>
                  <p className="text-xl font-bold text-red-600">{stats.overdueJobs}</p>
                  <p className="text-xs text-red-600">{((stats.overdueJobs / stats.totalJobs) * 100).toFixed(1)}% of total</p>
                </div>
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">📊 Overview</TabsTrigger>
            <TabsTrigger value="performance">👥 Technician Performance</TabsTrigger>
            <TabsTrigger value="trends">📈 Trends & Analytics</TabsTrigger>
            <TabsTrigger value="departments">🏢 Departments</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Job Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5" />
                    Job Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={jobStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {jobStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recent Performance Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={jobTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} />
                      <Line type="monotone" dataKey="assigned" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="overtime" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-16 flex flex-col items-center justify-center">
                    <FileText className="h-6 w-6 mb-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                    <Users className="h-6 w-6 mb-2" />
                    Manage Team
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    View Analytics
                  </Button>
                  <Button variant="outline" className="h-16 flex flex-col items-center justify-center">
                    <Download className="h-6 w-6 mb-2" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Technician Performance Rankings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {technicianPerformance.map((tech, index) => (
                    <div key={tech.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{tech.name}</h3>
                          <p className="text-sm text-gray-600">ID: {tech.id}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Jobs</p>
                          <p className="font-bold">{tech.jobsCompleted}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Avg Time</p>
                          <p className="font-bold">{tech.averageTime.toFixed(1)}h</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Rating</p>
                          <p className="font-bold">{tech.customerRating.toFixed(1)}/5</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Efficiency</p>
                          <p className="font-bold">{tech.efficiency}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Revenue</p>
                          <p className="font-bold">R{tech.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Completion Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={jobTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#22c55e" />
                    <Bar dataKey="assigned" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departmentData.map((dept) => (
                <Card key={dept.name}>
                  <CardHeader>
                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Jobs Completed:</span>
                        <span className="font-bold">{dept.jobs}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue:</span>
                        <span className="font-bold">R{dept.revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Technicians:</span>
                        <span className="font-bold">{dept.technicians}</span>
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
