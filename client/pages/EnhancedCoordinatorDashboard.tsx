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
  ClipboardList,
  User,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Calendar,
  FileText,
  Users,
  Activity,
  Timer,
  ArrowRight,
  Zap,
  Navigation,
  Package,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Filter,
  Search,
} from "lucide-react";

interface TechnicianJob {
  id: string;
  title: string;
  status: "assigned" | "accepted" | "in-progress" | "completed" | "paused";
  priority: "low" | "medium" | "high" | "urgent";
  technicianId: string;
  technicianName: string;
  client: {
    name: string;
    address: string;
  };
  estimatedDuration: number;
  actualDuration?: number;
  startTime?: string;
  completedTime?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  isOvertime?: boolean;
  workOrderNumber?: string;
  lastUpdated: string;
}

interface TechnicianStatus {
  id: string;
  name: string;
  status: "available" | "busy" | "offline" | "on-break";
  currentJob?: string;
  location?: {
    latitude: number;
    longitude: number;
    lastUpdate: string;
  };
  todayStats: {
    jobsCompleted: number;
    hoursWorked: number;
    distanceTraveled: number;
    overtimeHours: number;
  };
}

interface CoordinatorStats {
  totalJobs: number;
  completedToday: number;
  inProgress: number;
  pending: number;
  overdueJobs: number;
  avgCompletionTime: string;
  activeTechnicians: number;
  totalOvertimeHours: number;
}

export default function EnhancedCoordinatorDashboard() {
  const [selectedTechnician, setSelectedTechnician] = useState("all");
  const [allTechnicianJobs, setAllTechnicianJobs] = useState<TechnicianJob[]>([]);
  const [technicianStatuses, setTechnicianStatuses] = useState<TechnicianStatus[]>([]);
  const [stats, setStats] = useState<CoordinatorStats>({
    totalJobs: 0,
    completedToday: 0,
    inProgress: 0,
    pending: 0,
    overdueJobs: 0,
    avgCompletionTime: "0h",
    activeTechnicians: 0,
    totalOvertimeHours: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  // Load real-time technician jobs and statuses
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load all technician jobs
        const jobsResponse = await fetch("/api/job-mgmt/jobs/all-technicians");
        if (jobsResponse.ok) {
          const jobsResult = await jobsResponse.json();
          if (jobsResult.success) {
            setAllTechnicianJobs(jobsResult.data || []);
          }
        }

        // Load technician statuses
        const statusResponse = await fetch("/api/technicians/status/all");
        if (statusResponse.ok) {
          const statusResult = await statusResponse.json();
          if (statusResult.success) {
            setTechnicianStatuses(statusResult.data || []);
          }
        }

        // Load coordinator stats
        const statsResponse = await fetch("/api/coordinator/stats");
        if (statsResponse.ok) {
          const statsResult = await statsResponse.json();
          if (statsResult.success) {
            setStats(statsResult.data);
          }
        }

      } catch (error) {
        console.error("Error loading coordinator data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Set up real-time polling
    const interval = setInterval(loadData, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // Filter and search jobs
  const filteredJobs = allTechnicianJobs.filter(job => {
    const matchesTechnician = selectedTechnician === "all" || job.technicianId === selectedTechnician;
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesSearch = searchQuery === "" || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.technicianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.workOrderNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTechnician && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-yellow-100 text-yellow-800";
      case "assigned":
        return "bg-purple-100 text-purple-800";
      case "paused":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTechnicianStatusColor = (status: string) => {
    switch (status) {
      case "busy":
        return "bg-red-100 text-red-800";
      case "available":
        return "bg-green-100 text-green-800";
      case "on-break":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "in-progress":
        return Activity;
      case "accepted":
        return Clock;
      case "assigned":
        return User;
      case "paused":
        return Timer;
      default:
        return AlertCircle;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Coordinator Dashboard</h1>
            <p className="text-blue-100">Real-time technician job monitoring and management</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <ClipboardList className="h-10 w-10" />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Jobs Today</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalJobs}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed Today</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completedToday}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Technicians</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.activeTechnicians}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">📊 Overview</TabsTrigger>
            <TabsTrigger value="jobs">🔧 All Jobs ({allTechnicianJobs.length})</TabsTrigger>
            <TabsTrigger value="technicians">👥 Technicians ({technicianStatuses.length})</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Overdue</p>
                    <p className="text-xl font-bold text-red-600">{stats.overdueJobs}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Avg Completion</p>
                    <p className="text-xl font-bold text-blue-600">{stats.avgCompletionTime}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Overtime Hours</p>
                    <p className="text-xl font-bold text-purple-600">{stats.totalOvertimeHours.toFixed(1)}h</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Job Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allTechnicianJobs.slice(0, 5).map((job) => {
                    const StatusIcon = getStatusIcon(job.status);
                    return (
                      <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <StatusIcon className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="font-medium">{job.title}</p>
                            <p className="text-sm text-gray-600">{job.technicianName} • {job.client.name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(job.status)}>
                            {job.status.replace("-", " ").toUpperCase()}
                          </Badge>
                          <Button size="sm" variant="ghost" onClick={() => navigate(`/job/${job.id}`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search jobs, technicians..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Technician</label>
                    <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Technicians</SelectItem>
                        {technicianStatuses.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="accepted">Accepted</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Actions</label>
                    <Button variant="outline" className="w-full">
                      <Filter className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Jobs List */}
            <div className="space-y-4">
              {loading ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p>Loading jobs...</p>
                  </CardContent>
                </Card>
              ) : filteredJobs.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No jobs found matching your criteria</p>
                  </CardContent>
                </Card>
              ) : (
                filteredJobs.map((job) => {
                  const StatusIcon = getStatusIcon(job.status);
                  return (
                    <Card key={job.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <StatusIcon className="h-5 w-5 text-gray-500" />
                            <div>
                              <h3 className="font-medium">{job.title}</h3>
                              <p className="text-sm text-gray-600">#{job.workOrderNumber || job.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={getPriorityColor(job.priority)}>
                              {job.priority.toUpperCase()}
                            </Badge>
                            <Badge className={getStatusColor(job.status)}>
                              {job.status.replace("-", " ").toUpperCase()}
                            </Badge>
                            {job.isOvertime && (
                              <Badge className="bg-purple-100 text-purple-800">
                                <Timer className="h-3 w-3 mr-1" />
                                OVERTIME
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Technician</p>
                            <p className="font-medium">{job.technicianName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Client</p>
                            <p className="font-medium">{job.client.name}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Duration</p>
                            <p className="font-medium">
                              {job.actualDuration 
                                ? `${job.actualDuration.toFixed(1)}h (Actual)` 
                                : `${job.estimatedDuration}h (Est.)`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            Updated: {new Date(job.lastUpdated).toLocaleString()}
                          </div>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => navigate(`/job/${job.id}`)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <MapPin className="h-4 w-4 mr-1" />
                              Location
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          {/* Technicians Tab */}
          <TabsContent value="technicians" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {technicianStatuses.map((technician) => (
                <Card key={technician.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{technician.name}</h3>
                          <p className="text-sm text-gray-600">ID: {technician.id}</p>
                        </div>
                      </div>
                      <Badge className={getTechnicianStatusColor(technician.status)}>
                        {technician.status.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Jobs Completed:</span>
                        <span className="font-medium">{technician.todayStats.jobsCompleted}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Hours Worked:</span>
                        <span className="font-medium">{technician.todayStats.hoursWorked.toFixed(1)}h</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Distance:</span>
                        <span className="font-medium">{technician.todayStats.distanceTraveled.toFixed(1)}km</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Overtime:</span>
                        <span className="font-medium text-purple-600">{technician.todayStats.overtimeHours.toFixed(1)}h</span>
                      </div>
                    </div>

                    {technician.currentJob && (
                      <div className="bg-blue-50 p-2 rounded mb-3">
                        <p className="text-sm font-medium text-blue-800">Current Job:</p>
                        <p className="text-sm text-blue-600">{technician.currentJob}</p>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View Jobs
                      </Button>
                      {technician.location && (
                        <Button size="sm" variant="outline">
                          <Navigation className="h-4 w-4" />
                        </Button>
                      )}
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
