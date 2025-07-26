import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  MapPin,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  Timer,
  Navigation,
  Phone,
  MessageSquare,
  Eye,
  Filter,
  Search,
  RefreshCw,
  Download,
  Map,
  Zap,
  Target,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Package,
  Settings,
  Bell,
  Smartphone,
  Wifi,
} from "lucide-react";

interface Team {
  id: string;
  name: string;
  totalMembers: number;
  jobsAssigned: number;
  jobsCompletedToday: number;
  productivityScore: number;
  region: string;
  leader: string;
}

interface Technician {
  id: string;
  name: string;
  team: string;
  role: "technician" | "assistant" | "supervisor";
  status: "on_site" | "in_transit" | "idle" | "clocked_out" | "late";
  location: { lat: number; lng: number; address: string };
  currentJob?: {
    id: string;
    name: string;
    timeOnJob: number;
    stockAssigned: number;
    stockUsed: number;
  };
  clockInTime?: string;
  scheduledClockIn: string;
  lastActivity: string;
  phone: string;
}

interface TeamAlert {
  id: string;
  type: "sla_breach" | "no_activity" | "location_anomaly" | "late_clockin";
  technician: string;
  team: string;
  message: string;
  severity: "low" | "medium" | "high" | "critical";
  timestamp: string;
}

export default function TeamTrackingPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [alerts, setAlerts] = useState<TeamAlert[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [selectedTechnician, setSelectedTechnician] =
    useState<Technician | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [mapView, setMapView] = useState<"standard" | "heatmap">("standard");
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    loadTeamData();
    loadTechnicianData();
    loadAlerts();

    const interval = autoRefresh
      ? setInterval(() => {
          loadTechnicianData();
          loadAlerts();
        }, 30000)
      : null;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadTeamData = async () => {
    const mockTeams: Team[] = [
      {
        id: "1",
        name: "Installation Team Alpha",
        totalMembers: 6,
        jobsAssigned: 8,
        jobsCompletedToday: 5,
        productivityScore: 0.87,
        region: "North Region",
        leader: "Sipho Masinga",
      },
      {
        id: "2",
        name: "Maintenance Team Beta",
        totalMembers: 4,
        jobsAssigned: 6,
        jobsCompletedToday: 4,
        productivityScore: 0.92,
        region: "South Region",
        leader: "Thabo Sithole",
      },
      {
        id: "3",
        name: "Emergency Response Team",
        totalMembers: 5,
        jobsAssigned: 3,
        jobsCompletedToday: 2,
        productivityScore: 0.78,
        region: "Central Region",
        leader: "Naledi Modise",
      },
    ];
    setTeams(mockTeams);
  };

  const loadTechnicianData = async () => {
    const mockTechnicians: Technician[] = [
      {
        id: "1",
        name: "Sipho Masinga",
        team: "Installation Team Alpha",
        role: "technician",
        status: "on_site",
        location: {
          lat: -25.7461,
          lng: 28.1881,
          address: "123 Oak Street, Pretoria",
        },
        currentJob: {
          id: "JOB-001",
          name: "Fiber Installation",
          timeOnJob: 120,
          stockAssigned: 15,
          stockUsed: 8,
        },
        clockInTime: "07:45:00",
        scheduledClockIn: "08:00:00",
        lastActivity: "5 min ago",
        phone: "+27 81 234 5678",
      },
      {
        id: "2",
        name: "Thabo Sithole",
        team: "Installation Team Alpha",
        role: "assistant",
        status: "in_transit",
        location: {
          lat: -25.7545,
          lng: 28.1912,
          address: "En route to Business Park",
        },
        currentJob: {
          id: "JOB-002",
          name: "Network Fault Repair",
          timeOnJob: 45,
          stockAssigned: 8,
          stockUsed: 3,
        },
        clockInTime: "08:15:00",
        scheduledClockIn: "08:00:00",
        lastActivity: "2 min ago",
        phone: "+27 82 345 6789",
      },
      {
        id: "3",
        name: "Naledi Modise",
        team: "Maintenance Team Beta",
        role: "technician",
        status: "idle",
        location: {
          lat: -25.7489,
          lng: 28.1956,
          address: "Office - Waiting for assignment",
        },
        clockInTime: "08:00:00",
        scheduledClockIn: "08:00:00",
        lastActivity: "1 min ago",
        phone: "+27 83 456 7890",
      },
      {
        id: "4",
        name: "Brenda Khumalo",
        team: "Emergency Response Team",
        role: "supervisor",
        status: "late",
        location: { lat: -25.7523, lng: 28.1834, address: "Unknown" },
        scheduledClockIn: "08:00:00",
        lastActivity: "45 min ago",
        phone: "+27 84 567 8901",
      },
    ];
    setTechnicians(mockTechnicians);
  };

  const loadAlerts = async () => {
    const mockAlerts: TeamAlert[] = [
      {
        id: "1",
        type: "late_clockin",
        technician: "Brenda Khumalo",
        team: "Emergency Response Team",
        message: "Has not clocked in - 45 minutes late",
        severity: "high",
        timestamp: "08:45:00",
      },
      {
        id: "2",
        type: "sla_breach",
        technician: "Thabo Sithole",
        team: "Installation Team Alpha",
        message: "Job JOB-002 approaching SLA deadline",
        severity: "medium",
        timestamp: "09:15:00",
      },
      {
        id: "3",
        type: "no_activity",
        technician: "Naledi Modise",
        team: "Maintenance Team Beta",
        message: "Idle for 30+ minutes without job assignment",
        severity: "low",
        timestamp: "09:30:00",
      },
    ];
    setAlerts(mockAlerts);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "on_site":
        return <Badge className="bg-green-500">On Site</Badge>;
      case "in_transit":
        return <Badge className="bg-blue-500">In Transit</Badge>;
      case "idle":
        return <Badge className="bg-yellow-500">Idle</Badge>;
      case "late":
        return <Badge className="bg-red-500">Late</Badge>;
      case "clocked_out":
        return <Badge className="bg-gray-500">Clocked Out</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-600 animate-pulse">Critical</Badge>;
      case "high":
        return <Badge className="bg-red-500">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-500">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const filteredTechnicians =
    selectedTeam === "all"
      ? technicians
      : technicians.filter((t) => t.team === selectedTeam);

  const clockedInCount = technicians.filter((t) => t.clockInTime).length;
  const lateCount = technicians.filter((t) => t.status === "late").length;
  const activeJobsCount = technicians.filter((t) => t.currentJob).length;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-500" />
              Team Tracking - FieldOps Manager View
            </h1>
            <p className="text-gray-600">
              Real-time visibility and control over team performance and
              location
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <div className="flex items-center gap-2">
              <Switch checked={autoRefresh} onCheckedChange={setAutoRefresh} />
              <span className="text-sm">Auto Refresh</span>
            </div>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Teams Active</p>
                <p className="text-2xl font-bold text-blue-600">
                  {teams.length}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clocked In</p>
                <p className="text-2xl font-bold text-green-600">
                  {clockedInCount}/{technicians.length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-purple-600">
                  {activeJobsCount}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {alerts.length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Team Overview</TabsTrigger>
          <TabsTrigger value="map">Live Map</TabsTrigger>
          <TabsTrigger value="clockin">Clock-In Monitor</TabsTrigger>
          <TabsTrigger value="status">Team Status</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        {/* Team Overview Dashboard */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team Name</TableHead>
                    <TableHead>Leader</TableHead>
                    <TableHead>Total Members</TableHead>
                    <TableHead>Jobs Assigned</TableHead>
                    <TableHead>Completed Today</TableHead>
                    <TableHead>Productivity Score</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teams.map((team) => (
                    <TableRow
                      key={team.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        setSelectedTeam(team.name);
                        setActiveModal("teamDetails");
                      }}
                    >
                      <TableCell className="font-medium">{team.name}</TableCell>
                      <TableCell>{team.leader}</TableCell>
                      <TableCell>{team.totalMembers}</TableCell>
                      <TableCell>{team.jobsAssigned}</TableCell>
                      <TableCell>{team.jobsCompletedToday}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={team.productivityScore * 100}
                            className="w-16"
                          />
                          <span className="font-bold">
                            {(team.productivityScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{team.region}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Map */}
        <TabsContent value="map" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              Live Team Location & Heatmap
            </h3>
            <div className="flex gap-2">
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.name}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={() =>
                  setMapView(mapView === "standard" ? "heatmap" : "standard")
                }
              >
                <Map className="h-4 w-4 mr-2" />
                {mapView === "standard" ? "Heatmap View" : "Standard View"}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                    <Map className="h-16 w-16 text-blue-400 mb-4" />
                    <p className="text-lg font-medium text-gray-600 mb-2">
                      Live GPS Tracking Map
                    </p>
                    <p className="text-sm text-gray-500 text-center max-w-sm">
                      Real-time technician locations with {mapView} overlay
                      showing team distribution across job sites
                    </p>
                    <div className="mt-4 flex gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">On Site</span>
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">In Transit</span>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Idle</span>
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Alert</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Active Technicians</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredTechnicians.map((tech) => (
                      <div
                        key={tech.id}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          setSelectedTechnician(tech);
                          setActiveModal("technicianDetails");
                        }}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium">{tech.name}</div>
                            <div className="text-xs text-gray-500">
                              {tech.team}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(tech.status)}
                            <div
                              className={`w-2 h-2 rounded-full ${
                                tech.status === "on_site"
                                  ? "bg-green-500"
                                  : tech.status === "in_transit"
                                    ? "bg-blue-500"
                                    : tech.status === "idle"
                                      ? "bg-yellow-500"
                                      : "bg-red-500"
                              }`}
                            ></div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-600">
                          <div className="flex items-center gap-1 mb-1">
                            <MapPin className="h-3 w-3" />
                            {tech.location.address}
                          </div>
                          {tech.currentJob && (
                            <div className="flex items-center gap-1">
                              <Activity className="h-3 w-3" />
                              {tech.currentJob.name} (
                              {tech.currentJob.timeOnJob}m)
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Clock-In Monitoring */}
        <TabsContent value="clockin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Clock-In Status Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Technician</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Scheduled Time</TableHead>
                    <TableHead>Actual Clock-In</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Late By</TableHead>
                    <TableHead>Last Activity</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {technicians.map((tech) => {
                    const scheduled = new Date(
                      `2025-01-25 ${tech.scheduledClockIn}`,
                    );
                    const actual = tech.clockInTime
                      ? new Date(`2025-01-25 ${tech.clockInTime}`)
                      : null;
                    const lateMinutes =
                      actual && actual > scheduled
                        ? Math.round(
                            (actual.getTime() - scheduled.getTime()) /
                              (1000 * 60),
                          )
                        : tech.status === "late"
                          ? 45
                          : 0;

                    return (
                      <TableRow
                        key={tech.id}
                        className={
                          tech.status === "late"
                            ? "bg-red-50"
                            : lateMinutes > 0
                              ? "bg-yellow-50"
                              : ""
                        }
                      >
                        <TableCell className="font-medium">
                          {tech.name}
                        </TableCell>
                        <TableCell>{tech.team}</TableCell>
                        <TableCell>{tech.scheduledClockIn}</TableCell>
                        <TableCell>{tech.clockInTime || "-"}</TableCell>
                        <TableCell>{getStatusBadge(tech.status)}</TableCell>
                        <TableCell>
                          {lateMinutes > 0 ? `${lateMinutes} min` : "-"}
                        </TableCell>
                        <TableCell>{tech.lastActivity}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost">
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <MessageSquare className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Status Panel */}
        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {technicians.map((tech) => (
              <Card key={tech.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{tech.name}</h4>
                        <p className="text-sm text-gray-500">{tech.team}</p>
                        <Badge variant="outline" className="text-xs">
                          {tech.role}
                        </Badge>
                      </div>
                      {getStatusBadge(tech.status)}
                    </div>

                    {tech.currentJob && (
                      <div className="bg-gray-50 p-3 rounded">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">
                            Current Job
                          </span>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-700">
                          {tech.currentJob.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {tech.currentJob.id}
                        </p>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div>
                            <p className="text-xs text-gray-500">Time on Job</p>
                            <p className="text-sm font-medium">
                              {tech.currentJob.timeOnJob}m
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Stock Usage</p>
                            <p className="text-sm font-medium">
                              {tech.currentJob.stockUsed}/
                              {tech.currentJob.stockAssigned}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{tech.location.address}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>Last activity: {tech.lastActivity}</span>
                    </div>

                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Alerts & Notifications */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Team Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 border-l-4 rounded-r ${
                      alert.severity === "critical"
                        ? "border-l-red-600 bg-red-50"
                        : alert.severity === "high"
                          ? "border-l-red-500 bg-red-50"
                          : alert.severity === "medium"
                            ? "border-l-yellow-500 bg-yellow-50"
                            : "border-l-blue-500 bg-blue-50"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle
                            className={`h-4 w-4 ${
                              alert.severity === "critical" ||
                              alert.severity === "high"
                                ? "text-red-500"
                                : alert.severity === "medium"
                                  ? "text-yellow-500"
                                  : "text-blue-500"
                            }`}
                          />
                          <span className="font-medium">
                            {alert.technician}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({alert.team})
                          </span>
                          {getSeverityBadge(alert.severity)}
                        </div>
                        <p className="text-sm text-gray-700">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Alert time: {alert.timestamp}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-4">
                        <Button size="sm" variant="outline">
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Technician Details Modal */}
      <Dialog
        open={activeModal === "technicianDetails"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Technician Details - {selectedTechnician?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedTechnician && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div>{getStatusBadge(selectedTechnician.status)}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Team</label>
                  <div>{selectedTechnician.team}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <div className="capitalize">{selectedTechnician.role}</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <div>{selectedTechnician.phone}</div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Current Location</label>
                <div className="p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{selectedTechnician.location.address}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Coordinates: {selectedTechnician.location.lat},{" "}
                    {selectedTechnician.location.lng}
                  </div>
                </div>
              </div>

              {selectedTechnician.currentJob && (
                <div>
                  <label className="text-sm font-medium">Current Job</label>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">
                      {selectedTechnician.currentJob.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      ID: {selectedTechnician.currentJob.id}
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <span className="text-xs text-gray-500">
                          Time on Job:
                        </span>
                        <div className="font-medium">
                          {selectedTechnician.currentJob.timeOnJob} minutes
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">
                          Stock Usage:
                        </span>
                        <div className="font-medium">
                          {selectedTechnician.currentJob.stockUsed}/
                          {selectedTechnician.currentJob.stockAssigned} items
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
