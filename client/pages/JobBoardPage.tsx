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
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ClipboardList,
  MapPin,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  Timer,
  Calendar,
  Filter,
  Search,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  UserX,
  Users,
  Package,
  FileText,
  Camera,
  Upload,
  MoreHorizontal,
  Map,
  Phone,
  MessageSquare,
  Activity,
  Target,
  Zap,
  PlayCircle,
  PauseCircle,
  StopCircle,
  RotateCcw,
} from "lucide-react";

interface Job {
  id: string;
  workOrderNumber: string;
  type: "installation" | "maintenance" | "emergency" | "audit";
  category: string;
  assignedTechnician?: string;
  assignedTeam?: string;
  status:
    | "not_started"
    | "in_progress"
    | "completed"
    | "on_hold"
    | "delayed"
    | "cancelled";
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
    zone: string;
  };
  scheduledStart: string;
  estimatedDuration: number;
  actualTimeSpent?: number;
  deadline: string;
  priority: "low" | "medium" | "high" | "critical";
  description: string;
  requirements: string[];
  stockUsage?: {
    workOrder: string;
    itemsUsed: number;
    totalValue: number;
  };
  timeline: Array<{
    stage: string;
    timestamp: string;
    notes?: string;
  }>;
  attachments: Array<{
    type: "image" | "document";
    url: string;
    name: string;
  }>;
  slaStatus: "on_track" | "approaching" | "breached";
  customerInfo?: {
    name: string;
    contact: string;
    notes: string;
  };
}

interface JobFilter {
  status: string;
  technician: string;
  team: string;
  priority: string;
  dateRange: { start: string; end: string };
  location: string;
  slaStatus: string;
}

export default function JobBoardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<JobFilter>({
    status: "all",
    technician: "all",
    team: "all",
    priority: "all",
    dateRange: {
      start: new Date().toISOString().split("T")[0],
      end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    },
    location: "all",
    slaStatus: "all",
  });
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    loadJobsData();

    const interval = autoRefresh ? setInterval(loadJobsData, 30000) : null;
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  useEffect(() => {
    applyFilters();
  }, [jobs, filters, searchTerm]);

  const loadJobsData = async () => {
    const mockJobs: Job[] = [
      {
        id: "JOB-001",
        workOrderNumber: "WO-2025-001",
        type: "installation",
        category: "Fiber Installation",
        assignedTechnician: "Sipho Masinga",
        assignedTeam: "Installation Team Alpha",
        status: "in_progress",
        location: {
          address: "123 Oak Street, Pretoria",
          coordinates: { lat: -25.7461, lng: 28.1881 },
          zone: "North Zone",
        },
        scheduledStart: "2025-01-25 08:00:00",
        estimatedDuration: 180,
        actualTimeSpent: 120,
        deadline: "2025-01-25 12:00:00",
        priority: "high",
        description: "Install fiber optic connection for residential customer",
        requirements: [
          "Fiber cable",
          "ONT device",
          "Router",
          "Installation tools",
        ],
        stockUsage: {
          workOrder: "NWI-001",
          itemsUsed: 8,
          totalValue: 2500,
        },
        timeline: [
          { stage: "Created", timestamp: "2025-01-24 16:00:00" },
          { stage: "Assigned", timestamp: "2025-01-24 16:30:00" },
          {
            stage: "Started",
            timestamp: "2025-01-25 08:00:00",
            notes: "Technician arrived on site",
          },
        ],
        attachments: [
          {
            type: "image",
            url: "/images/site-survey.jpg",
            name: "Site Survey Photo",
          },
          {
            type: "document",
            url: "/docs/installation-plan.pdf",
            name: "Installation Plan",
          },
        ],
        slaStatus: "on_track",
        customerInfo: {
          name: "John Smith",
          contact: "+27 11 123 4567",
          notes: "Customer available all day",
        },
      },
      {
        id: "JOB-002",
        workOrderNumber: "WO-2025-002",
        type: "emergency",
        category: "Network Fault",
        assignedTechnician: "Thabo Sithole",
        assignedTeam: "Emergency Response Team",
        status: "delayed",
        location: {
          address: "Business Park, Sandton",
          coordinates: { lat: -25.7545, lng: 28.1912 },
          zone: "Central Zone",
        },
        scheduledStart: "2025-01-25 09:00:00",
        estimatedDuration: 120,
        actualTimeSpent: 90,
        deadline: "2025-01-25 11:00:00",
        priority: "critical",
        description: "Urgent network fault affecting multiple customers",
        requirements: ["Network diagnostic tools", "Replacement equipment"],
        timeline: [
          { stage: "Created", timestamp: "2025-01-25 08:30:00" },
          { stage: "Assigned", timestamp: "2025-01-25 08:35:00" },
          {
            stage: "Started",
            timestamp: "2025-01-25 09:15:00",
            notes: "Delayed due to traffic",
          },
        ],
        attachments: [],
        slaStatus: "approaching",
        customerInfo: {
          name: "ABC Corporation",
          contact: "+27 11 987 6543",
          notes: "Critical business operations affected",
        },
      },
      {
        id: "JOB-003",
        workOrderNumber: "WO-2025-003",
        type: "maintenance",
        category: "Routine Maintenance",
        assignedTechnician: "Naledi Modise",
        assignedTeam: "Maintenance Team Beta",
        status: "completed",
        location: {
          address: "Residential Complex, Johannesburg",
          coordinates: { lat: -25.7489, lng: 28.1956 },
          zone: "South Zone",
        },
        scheduledStart: "2025-01-24 14:00:00",
        estimatedDuration: 90,
        actualTimeSpent: 85,
        deadline: "2025-01-24 16:00:00",
        priority: "medium",
        description: "Scheduled maintenance check and equipment inspection",
        requirements: ["Maintenance checklist", "Testing equipment"],
        timeline: [
          { stage: "Created", timestamp: "2025-01-23 10:00:00" },
          { stage: "Assigned", timestamp: "2025-01-23 11:00:00" },
          { stage: "Started", timestamp: "2025-01-24 14:00:00" },
          {
            stage: "Completed",
            timestamp: "2025-01-24 15:25:00",
            notes: "All systems functioning normally",
          },
        ],
        attachments: [
          {
            type: "document",
            url: "/docs/maintenance-report.pdf",
            name: "Maintenance Report",
          },
        ],
        slaStatus: "on_track",
      },
      {
        id: "JOB-004",
        workOrderNumber: "WO-2025-004",
        type: "installation",
        category: "Equipment Upgrade",
        status: "not_started",
        location: {
          address: "456 Pine Avenue, Cape Town",
          coordinates: { lat: -25.7523, lng: 28.1834 },
          zone: "West Zone",
        },
        scheduledStart: "2025-01-25 13:00:00",
        estimatedDuration: 240,
        deadline: "2025-01-25 17:00:00",
        priority: "medium",
        description: "Upgrade customer equipment to latest specifications",
        requirements: ["New router", "Configuration tools", "Backup equipment"],
        timeline: [
          { stage: "Created", timestamp: "2025-01-24 12:00:00" },
          { stage: "Pending Assignment", timestamp: "2025-01-24 12:30:00" },
        ],
        attachments: [],
        slaStatus: "on_track",
        customerInfo: {
          name: "Sarah Johnson",
          contact: "+27 21 456 7890",
          notes: "Customer requested afternoon appointment",
        },
      },
    ];
    setJobs(mockJobs);
  };

  const applyFilters = () => {
    let filtered = jobs;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.workOrderNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.assignedTechnician
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          job.location.address.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((job) => job.status === filters.status);
    }

    // Technician filter
    if (filters.technician !== "all") {
      filtered = filtered.filter(
        (job) => job.assignedTechnician === filters.technician,
      );
    }

    // Priority filter
    if (filters.priority !== "all") {
      filtered = filtered.filter((job) => job.priority === filters.priority);
    }

    // SLA Status filter
    if (filters.slaStatus !== "all") {
      filtered = filtered.filter((job) => job.slaStatus === filters.slaStatus);
    }

    setFilteredJobs(filtered);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "not_started":
        return <Badge className="bg-gray-500">Not Started</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "on_hold":
        return <Badge className="bg-yellow-500">On Hold</Badge>;
      case "delayed":
        return <Badge className="bg-orange-500">Delayed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge className="bg-red-600 animate-pulse">Critical</Badge>;
      case "high":
        return <Badge className="bg-red-500">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "low":
        return <Badge className="bg-blue-500">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getSLABadge = (slaStatus: string) => {
    switch (slaStatus) {
      case "on_track":
        return <Badge className="bg-green-500">On Track</Badge>;
      case "approaching":
        return <Badge className="bg-yellow-500">Approaching</Badge>;
      case "breached":
        return <Badge className="bg-red-500">Breached</Badge>;
      default:
        return <Badge variant="outline">{slaStatus}</Badge>;
    }
  };

  const handleJobAction = (jobId: string, action: string) => {
    setJobs((prev) =>
      prev.map((job) => {
        if (job.id === jobId) {
          switch (action) {
            case "start":
              return {
                ...job,
                status: "in_progress",
                timeline: [
                  ...job.timeline,
                  {
                    stage: "Started",
                    timestamp: new Date().toISOString(),
                    notes: "Job started by manager",
                  },
                ],
              };
            case "pause":
              return { ...job, status: "on_hold" };
            case "complete":
              return {
                ...job,
                status: "completed",
                actualTimeSpent: job.actualTimeSpent || job.estimatedDuration,
                timeline: [
                  ...job.timeline,
                  {
                    stage: "Completed",
                    timestamp: new Date().toISOString(),
                    notes: "Job completed",
                  },
                ],
              };
            case "cancel":
              return { ...job, status: "cancelled" };
            default:
              return job;
          }
        }
        return job;
      }),
    );

    toast({
      title: "Job Updated",
      description: `Job ${jobId} has been ${action}ed successfully.`,
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedJobs.length === 0) {
      toast({
        title: "No Jobs Selected",
        description: "Please select jobs to perform bulk actions.",
        variant: "destructive",
      });
      return;
    }

    selectedJobs.forEach((jobId) => {
      handleJobAction(jobId, action);
    });

    setSelectedJobs([]);
    toast({
      title: "Bulk Action Complete",
      description: `${action} applied to ${selectedJobs.length} jobs.`,
    });
  };

  const handleReassignJob = (jobId: string, newTechnician: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              assignedTechnician: newTechnician,
              timeline: [
                ...job.timeline,
                {
                  stage: "Reassigned",
                  timestamp: new Date().toISOString(),
                  notes: `Reassigned to ${newTechnician}`,
                },
              ],
            }
          : job,
      ),
    );

    toast({
      title: "Job Reassigned",
      description: `Job ${jobId} has been reassigned to ${newTechnician}.`,
    });
  };

  const jobStats = {
    total: jobs.length,
    notStarted: jobs.filter((j) => j.status === "not_started").length,
    inProgress: jobs.filter((j) => j.status === "in_progress").length,
    completed: jobs.filter((j) => j.status === "completed").length,
    delayed: jobs.filter((j) => j.status === "delayed").length,
    slaBreaches: jobs.filter((j) => j.slaStatus === "breached").length,
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <ClipboardList className="h-8 w-8 text-blue-500" />
              Job Board - Manager View
            </h1>
            <p className="text-gray-600">
              Real-time visibility into all active, scheduled, and historical
              jobs
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === "list" ? "map" : "list")}
            >
              <Map className="h-4 w-4 mr-2" />
              {viewMode === "list" ? "Map View" : "List View"}
            </Button>
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

      {/* Job Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {jobStats.total}
              </div>
              <div className="text-sm text-gray-600">Total Jobs</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {jobStats.notStarted}
              </div>
              <div className="text-sm text-gray-600">Not Started</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {jobStats.inProgress}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {jobStats.completed}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {jobStats.delayed}
              </div>
              <div className="text-sm text-gray-600">Delayed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {jobStats.slaBreaches}
              </div>
              <div className="text-sm text-gray-600">SLA Breaches</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
            <div>
              <Label>Search</Label>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select
                value={filters.priority}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>SLA Status</Label>
              <Select
                value={filters.slaStatus}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, slaStatus: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All SLA</SelectItem>
                  <SelectItem value="on_track">On Track</SelectItem>
                  <SelectItem value="approaching">Approaching</SelectItem>
                  <SelectItem value="breached">Breached</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Technician</Label>
              <Select
                value={filters.technician}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, technician: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technicians</SelectItem>
                  <SelectItem value="Sipho Masinga">Sipho Masinga</SelectItem>
                  <SelectItem value="Thabo Sithole">Thabo Sithole</SelectItem>
                  <SelectItem value="Naledi Modise">Naledi Modise</SelectItem>
                  <SelectItem value="Brenda Khumalo">Brenda Khumalo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  status: "all",
                  technician: "all",
                  team: "all",
                  priority: "all",
                  dateRange: { start: "", end: "" },
                  location: "all",
                  slaStatus: "all",
                });
                setSearchTerm("");
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedJobs.length > 0 && (
        <Card className="mb-6 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedJobs.length} jobs selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleBulkAction("start")}>
                  <PlayCircle className="h-3 w-3 mr-1" />
                  Start
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("pause")}
                >
                  <PauseCircle className="h-3 w-3 mr-1" />
                  Pause
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("complete")}
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Complete
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveModal("bulkReassign")}
                >
                  <UserX className="h-3 w-3 mr-1" />
                  Reassign
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBulkAction("cancel")}
                >
                  <StopCircle className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job List/Map View */}
      {viewMode === "list" ? (
        <Card>
          <CardHeader>
            <CardTitle>Active Jobs ({filteredJobs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedJobs.length === filteredJobs.length &&
                        filteredJobs.length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedJobs(filteredJobs.map((job) => job.id));
                        } else {
                          setSelectedJobs([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Job ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Technician</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow
                    key={job.id}
                    className={`cursor-pointer hover:bg-gray-50 ${
                      job.status === "delayed"
                        ? "bg-red-50"
                        : job.slaStatus === "approaching"
                          ? "bg-yellow-50"
                          : ""
                    }`}
                    onClick={() => {
                      setSelectedJob(job);
                      setActiveModal("jobDetails");
                    }}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedJobs.includes(job.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedJobs((prev) => [...prev, job.id]);
                          } else {
                            setSelectedJobs((prev) =>
                              prev.filter((id) => id !== job.id),
                            );
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{job.id}</TableCell>
                    <TableCell>{job.category}</TableCell>
                    <TableCell>
                      {job.assignedTechnician || "Unassigned"}
                    </TableCell>
                    <TableCell>{getStatusBadge(job.status)}</TableCell>
                    <TableCell>{getPriorityBadge(job.priority)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <span className="truncate max-w-32">
                          {job.location.address}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(job.scheduledStart).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{job.estimatedDuration}m est.</div>
                        {job.actualTimeSpent && (
                          <div className="text-gray-500">
                            {job.actualTimeSpent}m actual
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getSLABadge(job.slaStatus)}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedJob(job);
                            setActiveModal("jobDetails");
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedJob(job);
                            setActiveModal("reassignJob");
                          }}
                        >
                          <UserX className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Job Location Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
              <Map className="h-16 w-16 text-blue-400 mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">
                Live Job Location Map
              </p>
              <p className="text-sm text-gray-500 text-center max-w-sm">
                Interactive map showing all job locations with real-time status
                updates
              </p>
              <div className="mt-4 flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-xs">Not Started</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-xs">In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs">Completed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-xs">Delayed</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Details Modal */}
      <Dialog
        open={activeModal === "jobDetails"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Job Details - {selectedJob?.id}</DialogTitle>
            <DialogDescription>
              {selectedJob?.workOrderNumber} | {selectedJob?.category}
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-6">
              {/* Job Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Status</Label>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedJob.status)}
                    {getPriorityBadge(selectedJob.priority)}
                    {getSLABadge(selectedJob.slaStatus)}
                  </div>
                </div>
                <div>
                  <Label>Assigned Technician</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>
                      {selectedJob.assignedTechnician || "Unassigned"}
                    </span>
                  </div>
                </div>
                <div>
                  <Label>Location</Label>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{selectedJob.location.address}</span>
                  </div>
                </div>
                <div>
                  <Label>Schedule</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>
                      {new Date(selectedJob.scheduledStart).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label>Description</Label>
                <div className="p-3 bg-gray-50 rounded">
                  {selectedJob.description}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <Label>Requirements</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.requirements.map((req, index) => (
                    <Badge key={index} variant="outline">
                      {req}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div>
                <Label>Timeline</Label>
                <div className="space-y-2">
                  {selectedJob.timeline.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-2 border-l-2 border-blue-200"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="font-medium">{event.stage}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(event.timestamp).toLocaleString()}
                        </div>
                        {event.notes && (
                          <div className="text-sm text-gray-500 italic">
                            {event.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              {selectedJob.customerInfo && (
                <div>
                  <Label>Customer Information</Label>
                  <div className="p-3 bg-gray-50 rounded space-y-2">
                    <div>
                      <strong>Name:</strong> {selectedJob.customerInfo.name}
                    </div>
                    <div>
                      <strong>Contact:</strong>{" "}
                      {selectedJob.customerInfo.contact}
                    </div>
                    <div>
                      <strong>Notes:</strong> {selectedJob.customerInfo.notes}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => handleJobAction(selectedJob.id, "start")}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Job
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleJobAction(selectedJob.id, "pause")}
                >
                  <PauseCircle className="h-4 w-4 mr-2" />
                  Pause
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleJobAction(selectedJob.id, "complete")}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setActiveModal("reassignJob");
                  }}
                >
                  <UserX className="h-4 w-4 mr-2" />
                  Reassign
                </Button>
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Technician
                </Button>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reassign Job Modal */}
      <Dialog
        open={activeModal === "reassignJob"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reassign Job - {selectedJob?.id}</DialogTitle>
            <DialogDescription>
              Select a new technician for this job
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Technician</Label>
              <div className="p-2 bg-gray-50 rounded">
                {selectedJob?.assignedTechnician || "Unassigned"}
              </div>
            </div>
            <div>
              <Label>New Technician</Label>
              <Select
                onValueChange={(value) => {
                  if (selectedJob) {
                    handleReassignJob(selectedJob.id, value);
                    setActiveModal(null);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sipho Masinga">Sipho Masinga</SelectItem>
                  <SelectItem value="Thabo Sithole">Thabo Sithole</SelectItem>
                  <SelectItem value="Naledi Modise">Naledi Modise</SelectItem>
                  <SelectItem value="Brenda Khumalo">Brenda Khumalo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Reason for Reassignment</Label>
              <Textarea placeholder="Enter reason..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button>Confirm Reassignment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
