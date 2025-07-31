import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  User,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  GripVertical,
  ArrowRight,
  Users,
  ClipboardList,
  Activity,
  Timer,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  UserCheck,
  X,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "unassigned" | "assigned" | "in-progress" | "completed" | "overdue";
  estimatedDuration: string;
  location: string;
  requiredSkills: string[];
  scheduledDate?: string;
  scheduledTime?: string;
  assignedTechnician?: string;
  customer: string;
  notes?: string;
}

interface Technician {
  id: string;
  name: string;
  email: string;
  status: "available" | "busy" | "offline";
  skills: string[];
  currentLocation: string;
  workload: number; // 0-100
  schedule: ScheduleSlot[];
  avatar?: string;
}

interface ScheduleSlot {
  id: string;
  date: string;
  time: string;
  jobId?: string;
  duration: number; // in minutes
  isAvailable: boolean;
}

export default function CoordinatorJobBoard() {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "JA-7762",
      title: "HVAC Maintenance Check",
      description: "Routine maintenance and inspection of HVAC system",
      priority: "medium",
      status: "assigned",
      estimatedDuration: "2h",
      location: "Downtown Office Building",
      requiredSkills: ["HVAC", "Maintenance"],
      scheduledDate: "2024-01-16",
      scheduledTime: "09:00",
      assignedTechnician: "John Smith",
      customer: "Acme Corp",
    },
    {
      id: "JA-7763",
      title: "Emergency Electrical Repair",
      description: "Power outage in building section B",
      priority: "urgent",
      status: "escalated",
      estimatedDuration: "1.5h",
      location: "Shopping Mall - Section B",
      requiredSkills: ["Electrical", "Emergency"],
      scheduledDate: "2024-01-16",
      scheduledTime: "10:30",
      assignedTechnician: "Sarah Johnson",
      customer: "Mall Management",
    },
    {
      id: "JA-7764",
      title: "Plumbing Installation",
      description: "Install new water filtration system",
      priority: "low",
      status: "completed",
      estimatedDuration: "4h",
      location: "Residential Complex",
      requiredSkills: ["Plumbing", "Installation"],
      scheduledDate: "2024-01-16",
      scheduledTime: "13:00",
      assignedTechnician: "Mike Chen",
      customer: "Green Valley Homes",
    },
    {
      id: "JA-7765",
      title: "Safety Equipment Inspection",
      description: "Monthly safety equipment check and certification",
      priority: "high",
      status: "accepted",
      estimatedDuration: "3h",
      location: "Industrial Warehouse",
      requiredSkills: ["Safety", "Inspection"],
      scheduledDate: "2024-01-17",
      scheduledTime: "08:00",
      assignedTechnician: "Emma Wilson",
      customer: "Industrial Solutions Ltd",
    },
    {
      id: "JA-7766",
      title: "Network Infrastructure Setup",
      description: "Install and configure network equipment",
      priority: "medium",
      status: "in-progress",
      estimatedDuration: "6h",
      location: "New Office Building",
      requiredSkills: ["Network", "Installation"],
      scheduledDate: "2024-01-16",
      scheduledTime: "14:00",
      assignedTechnician: "David Rodriguez",
      customer: "Tech Startup Inc",
    },
    {
      id: "JA-7767",
      title: "Preventive Maintenance",
      description: "Quarterly equipment maintenance",
      priority: "medium",
      status: "followup",
      estimatedDuration: "2h",
      location: "Manufacturing Plant",
      requiredSkills: ["Maintenance", "General"],
      scheduledDate: "2024-01-16",
      scheduledTime: "11:00",
      assignedTechnician: "John Smith",
      customer: "Manufacturing Corp",
    },
    {
      id: "JA-7768",
      title: "Completed Job Review",
      description: "Review completed installation work",
      priority: "low",
      status: "roc-closed",
      estimatedDuration: "1h",
      location: "Office Complex",
      requiredSkills: ["General"],
      scheduledDate: "2024-01-15",
      scheduledTime: "16:00",
      assignedTechnician: "Emma Wilson",
      customer: "Corporate Services",
    },
    {
      id: "JA-7769",
      title: "Unassigned Urgent Repair",
      description: "Critical system failure needs immediate attention",
      priority: "urgent",
      status: "unassigned",
      estimatedDuration: "3h",
      location: "Data Center",
      requiredSkills: ["Network", "Emergency"],
      customer: "Tech Solutions",
    },
  ]);

  const [technicians, setTechnicians] = useState<Technician[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@fieldops.com",
      status: "available",
      skills: ["HVAC", "Maintenance", "General"],
      currentLocation: "Downtown",
      workload: 65,
      schedule: [],
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.johnson@fieldops.com",
      status: "busy",
      skills: ["Electrical", "Emergency", "Safety"],
      currentLocation: "Midtown",
      workload: 85,
      schedule: [],
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike.chen@fieldops.com",
      status: "available",
      skills: ["Plumbing", "Installation", "HVAC"],
      currentLocation: "Southside",
      workload: 45,
      schedule: [],
    },
    {
      id: "4",
      name: "Emma Wilson",
      email: "emma.wilson@fieldops.com",
      status: "available",
      skills: ["Safety", "Inspection", "General"],
      currentLocation: "Industrial Area",
      workload: 70,
      schedule: [],
    },
    {
      id: "5",
      name: "David Rodriguez",
      email: "david.rodriguez@fieldops.com",
      status: "available",
      skills: ["Network", "IT", "Installation"],
      currentLocation: "Tech District",
      workload: 30,
      schedule: [],
    },
  ]);

  const [draggedJob, setDraggedJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("");

  const dragOverRef = useRef<HTMLDivElement>(null);

  // Load jobs from backend
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        if (response.ok) {
          const data = await response.json();
          if (data.jobs && data.jobs.length > 0) {
            // Convert backend jobs to frontend format
            const formattedJobs = data.jobs.map((job: any) => ({
              ...job,
              status: job.status || "unassigned",
              assignedTechnician: job.assignedTo || job.assignedTechnician,
              scheduledDate: job.scheduledDate || new Date().toISOString().split('T')[0],
              scheduledTime: job.scheduledTime || "09:00",
              requiredSkills: job.requiredSkills || ["General"],
              customer: job.customer || "Unknown Client",
              location: job.location || "TBD",
              estimatedDuration: job.estimatedDuration || "2h",
              priority: job.priority || "medium"
            }));
            setJobs(formattedJobs);
          }
        }
      } catch (error) {
        console.error('Failed to load jobs:', error);
        // Keep the demo data if API fails
      }
    };

    loadJobs();
  }, []);

  // Save job changes to backend
  const updateJobInBackend = async (jobId: string, updates: Partial<Job>) => {
    try {
      await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (error) {
      console.error('Failed to update job:', error);
    }
  };

  const handleDragStart = useCallback((job: Job) => {
    setDraggedJob(job);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedJob(null);
  }, []);

  const handleDrop = useCallback(
    (technicianId: string, timeSlot?: string) => {
      if (draggedJob) {
        const targetTechnician = technicians.find((t) => t.id === technicianId);
        const updates = {
          assignedTechnician: targetTechnician?.name,
          status: "assigned" as const,
          scheduledDate: selectedDate,
          scheduledTime: timeSlot || "09:00",
        };

        setJobs((prev) =>
          prev.map((job) =>
            job.id === draggedJob.id
              ? { ...job, ...updates }
              : job,
          ),
        );

        // Save to backend
        updateJobInBackend(draggedJob.id, updates);
        setDraggedJob(null);
      }
    },
    [draggedJob, technicians, selectedDate],
  );

  const handleJobReschedule = useCallback(
    (jobId: string, newTechnicianId: string, newTimeSlot: string) => {
      const targetTechnician = technicians.find(
        (t) => t.id === newTechnicianId,
      );
      const updates = {
        assignedTechnician: targetTechnician?.name,
        scheduledDate: selectedDate,
        scheduledTime: newTimeSlot,
      };

      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId ? { ...job, ...updates } : job,
        ),
      );

      // Save to backend
      updateJobInBackend(jobId, updates);
    },
    [technicians, selectedDate],
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "assigned":
        return "bg-purple-100 text-purple-800";
      case "unassigned":
        return "bg-gray-100 text-gray-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-yellow-100 text-yellow-800";
      case "offline":
        return "bg-gray-100 text-gray-800";
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

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || job.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || job.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const unassignedJobs = filteredJobs.filter(
    (job) => job.status === "unassigned",
  );
  const assignedJobs = filteredJobs.filter(
    (job) => job.status !== "unassigned",
  );

  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    return `${i.toString().padStart(2, "0")}:00`;
  });

  const stats = {
    totalJobs: jobs.length,
    assigned: jobs.filter((j) => j.status === "assigned").length,
    accepted: jobs.filter((j) => j.status === "accepted").length,
    unassigned: jobs.filter((j) => j.status === "unassigned").length,
    inProgress: jobs.filter((j) => j.status === "in-progress").length,
    finished: jobs.filter((j) => j.status === "completed").length,
    followup: jobs.filter((j) => j.status === "followup").length,
    escalated: jobs.filter((j) => j.status === "escalated").length,
    rocClosed: jobs.filter((j) => j.status === "roc-closed").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="h-8 w-8 text-blue-600" />
              Job Coordination Board
            </h1>
            <p className="text-gray-600 mt-1">
              Drag and drop jobs to assign and schedule technicians
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Job</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {/* Basic Information Section */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Work Order Number</Label>
                        <Input placeholder="WO-2024-0001" />
                      </div>
                      <div className="space-y-2">
                        <Label>Appointment Number</Label>
                        <Input placeholder="APP-2024-0001" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label>Service Request/Change Number/INC</Label>
                        <Input placeholder="00766624" />
                      </div>
                      <div className="space-y-2">
                        <Label>Priority</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label>Job Title</Label>
                      <Input placeholder="Enter job title..." />
                    </div>
                  </div>

                  {/* Client Information Section */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">Client Information</h3>
                    <div className="space-y-2">
                      <Label>Client Name</Label>
                      <Input placeholder="Enter client name..." />
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label>Client Address</Label>
                      <Input placeholder="Enter full client address..." />
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label>Client Contact</Label>
                      <Input placeholder="+1 (555) 123-4567" type="tel" />
                    </div>
                  </div>

                  {/* Date and Scheduling Section */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">Scheduling</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input type="date" />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <Input type="date" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label>Estimated Duration</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1h">1 hour</SelectItem>
                            <SelectItem value="2h">2 hours</SelectItem>
                            <SelectItem value="3h">3 hours</SelectItem>
                            <SelectItem value="4h">4 hours</SelectItem>
                            <SelectItem value="6h">6 hours</SelectItem>
                            <SelectItem value="8h">8 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Date Created</Label>
                        <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                      </div>
                    </div>
                  </div>

                  {/* Location and Facility Section */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">Location & Facility</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Facility</Label>
                        <Input placeholder="Building/facility name..." />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input placeholder="120 - East London" />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label>Geo Location (Latitude, Longitude)</Label>
                      <div className="flex gap-2">
                        <Input placeholder="Latitude" className="flex-1" />
                        <Input placeholder="Longitude" className="flex-1" />
                        <Button variant="outline" type="button">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Work Details Section */}
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-semibold mb-3">Work Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Work Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select work type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="installation">Installation</SelectItem>
                            <SelectItem value="maintenance">Maintenance</SelectItem>
                            <SelectItem value="repair">Repair</SelectItem>
                            <SelectItem value="inspection">Inspection</SelectItem>
                            <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>ROC</Label>
                        <Input placeholder="ROC number or reference..." />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label>Required Skills</Label>
                      <div className="flex flex-wrap gap-2">
                        {["HVAC", "Electrical", "Plumbing", "Network", "Safety", "General"].map((skill) => (
                          <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm">{skill}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label>Job Comments</Label>
                      <textarea
                        className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                        placeholder="Enter detailed job description, special instructions, or notes..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button className="flex-1">Create Job</Button>
                    <Button variant="outline" className="flex-1">Save as Draft</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview - Clickable */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => {
              setSelectedStatusFilter("assigned");
              setShowStatusModal(true);
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.assigned}</div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => {
              setSelectedStatusFilter("accepted");
              setShowStatusModal(true);
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.accepted}</div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => {
              setSelectedStatusFilter("in-progress");
              setShowStatusModal(true);
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Activity className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => {
              setSelectedStatusFilter("finished");
              setShowStatusModal(true);
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finished</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.finished}</div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => {
              setSelectedStatusFilter("followup");
              setShowStatusModal(true);
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Follow-up</CardTitle>
              <Timer className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.followup}</div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => {
              setSelectedStatusFilter("escalated");
              setShowStatusModal(true);
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escalated</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.escalated}</div>
            </CardContent>
          </Card>
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={() => {
              setSelectedStatusFilter("roc-closed");
              setShowStatusModal(true);
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROC Closed</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.rocClosed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filters & Controls</CardTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor="date-select">Schedule Date:</Label>
                <Input
                  id="date-select"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-40"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Main Board */}
        <div className="grid grid-cols-12 gap-6">
          {/* Unassigned Jobs Panel */}
          <div className="col-span-3">
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Unassigned Jobs
                  <Badge variant="secondary">{unassignedJobs.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent
                className={`p-0 transition-colors ${draggedJob && draggedJob.status !== "unassigned" ? "bg-orange-50 border-orange-200" : ""}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedJob && draggedJob.status !== "unassigned") {
                    setJobs((prev) =>
                      prev.map((job) =>
                        job.id === draggedJob.id
                          ? {
                              ...job,
                              status: "unassigned" as const,
                              assignedTechnician: undefined,
                              scheduledDate: undefined,
                              scheduledTime: undefined,
                            }
                          : job,
                      ),
                    );
                    setDraggedJob(null);
                  }
                }}
              >
                <ScrollArea className="h-[520px] px-4">
                  {draggedJob && draggedJob.status !== "unassigned" && (
                    <div className="sticky top-0 bg-orange-100 border border-orange-300 rounded-lg p-3 mb-3 text-center">
                      <div className="text-sm font-medium text-orange-800">
                        Drop here to unassign "{draggedJob.title}"
                      </div>
                    </div>
                  )}
                  <div className="space-y-3">
                    {unassignedJobs.map((job) => (
                      <div
                        key={job.id}
                        draggable
                        onDragStart={() => handleDragStart(job)}
                        onDragEnd={handleDragEnd}
                        className={`p-3 border rounded-lg cursor-move hover:shadow-md transition-all ${
                          draggedJob?.id === job.id ? "opacity-50 scale-95" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-gray-400" />
                            <Badge variant="outline" className="text-xs">
                              {job.id}
                            </Badge>
                          </div>
                          <Badge className={getPriorityColor(job.priority)}>
                            {job.priority}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-sm mb-1">
                          {job.title}
                        </h4>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {job.estimatedDuration}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {job.customer}
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {job.requiredSkills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Grid */}
        <div className="col-span-9">
          <Card className="h-[800px]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Schedule - {new Date(selectedDate).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[720px] flex flex-col">
                {/* Header row with technician names */}
                <div className="grid grid-cols-5 border-b bg-gray-50 sticky top-0 z-10">
                  <div className="border-r p-2">
                    <div className="font-semibold text-sm text-center">Time</div>
                  </div>
                  {technicians.slice(0, 4).map((technician) => (
                    <div key={technician.id} className="border-r p-2">
                      <div className="text-center">
                        <div className="font-semibold text-sm">
                          {technician.name}
                        </div>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <Badge
                            className={getStatusColor(technician.status)}
                          >
                            {technician.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {technician.workload}%
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1 justify-center">
                          {technician.skills.slice(0, 2).map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="text-xs"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Scrollable content area */}
                <ScrollArea className="flex-1">
                  <div className="grid grid-cols-5">
                    {/* Time column */}
                    <div className="border-r bg-gray-50">
                      {timeSlots.map((time, index) => (
                        <div
                          key={time}
                          className={`h-12 flex items-center justify-center text-sm text-muted-foreground border-b ${
                            index % 2 === 0 ? 'bg-gray-50' : 'bg-gray-100'
                          }`}
                        >
                          {time}
                        </div>
                      ))}
                    </div>

                    {/* Technician columns */}
                    {technicians.slice(0, 4).map((technician) => (
                      <div key={technician.id} className="border-r">
                        {timeSlots.map((time, timeIndex) => {
                          const jobAtTime = assignedJobs.find(
                            (job) =>
                              job.assignedTechnician === technician.name &&
                              job.scheduledTime === time &&
                              job.scheduledDate === selectedDate,
                          );

                          return (
                            <div
                              key={time}
                              className={`h-12 border-b p-1 transition-colors ${
                                timeIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                              } ${
                                draggedJob
                                  ? "border-dashed border-blue-300 bg-blue-50/50"
                                  : ""
                              }`}
                              onDragOver={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.add(
                                  "bg-blue-100/80",
                                  "border-blue-400",
                                );
                              }}
                              onDragLeave={(e) => {
                                e.currentTarget.classList.remove(
                                  "bg-blue-100/80",
                                  "border-blue-400",
                                );
                              }}
                              onDrop={(e) => {
                                e.preventDefault();
                                e.currentTarget.classList.remove(
                                  "bg-blue-100/80",
                                  "border-blue-400",
                                );
                                if (draggedJob) {
                                  // If there's already a job in this slot, we need to handle the swap
                                  if (
                                    jobAtTime &&
                                    jobAtTime.id !== draggedJob.id
                                  ) {
                                    // Swap jobs - move the existing job to unassigned
                                    setJobs((prev) =>
                                      prev.map((job) => {
                                        if (job.id === jobAtTime.id) {
                                          return {
                                            ...job,
                                            status: "unassigned" as const,
                                            assignedTechnician: undefined,
                                            scheduledDate: undefined,
                                            scheduledTime: undefined,
                                          };
                                        }
                                        return job;
                                      }),
                                    );
                                  }
                                  handleDrop(technician.id, time);
                                }
                              }}
                            >
                              {jobAtTime ? (
                                <div
                                  draggable={jobAtTime.status !== "completed"}
                                  onDragStart={() =>
                                    handleDragStart(jobAtTime)
                                  }
                                  onDragEnd={handleDragEnd}
                                  className={`h-full rounded p-2 text-xs cursor-move transition-all hover:shadow-md ${
                                    draggedJob?.id === jobAtTime.id
                                      ? "opacity-50 scale-95"
                                      : ""
                                  } ${
                                    jobAtTime.status === "completed"
                                      ? "bg-green-100 border-green-300 cursor-not-allowed"
                                      : jobAtTime.status === "in-progress"
                                        ? "bg-blue-100 border-blue-300"
                                        : "bg-purple-100 border-purple-300"
                                  } border-l-4 relative group`}
                                >
                                  {jobAtTime.status !== "completed" && (
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <GripVertical className="h-3 w-3 text-gray-400" />
                                    </div>
                                  )}
                                  <div className="font-semibold">
                                    {jobAtTime.id}
                                  </div>
                                  <div className="truncate">
                                    {jobAtTime.title}
                                  </div>
                                  <Badge
                                    className={getStatusColor(
                                      jobAtTime.status,
                                    )}
                                    variant="outline"
                                  >
                                    {jobAtTime.status}
                                  </Badge>
                                </div>
                              ) : (
                                <div className="h-full flex items-center justify-center text-gray-300 hover:bg-gray-50 rounded transition-colors">
                                  {draggedJob && (
                                    <div className="text-xs text-blue-600 font-medium">
                                      Drop here to reschedule
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>
        </div>

        {/* Enhanced Instructions */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">
                  How to Use the Job Board
                </h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setJobs((prev) =>
                      prev.map((job) => ({
                        ...job,
                        status:
                          job.status === "completed"
                            ? job.status
                            : ("unassigned" as const),
                        assignedTechnician:
                          job.status === "completed"
                            ? job.assignedTechnician
                            : undefined,
                        scheduledDate:
                          job.status === "completed"
                            ? job.scheduledDate
                            : undefined,
                        scheduledTime:
                          job.status === "completed"
                            ? job.scheduledTime
                            : undefined,
                      })),
                    );
                  }}
                >
                  Clear All Schedules
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="p-1 bg-blue-100 rounded">
                    <GripVertical className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-blue-900">
                      1. Assign New Jobs
                    </div>
                    <div className="text-blue-700">
                      Drag unassigned jobs from the left panel and drop them on
                      any technician's time slot
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                  <div className="p-1 bg-purple-100 rounded">
                    <RefreshCw className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-purple-900">
                      2. Reschedule Jobs
                    </div>
                    <div className="text-purple-700">
                      Drag assigned jobs between technicians or time slots to
                      reschedule (except completed jobs)
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="p-1 bg-green-100 rounded">
                    <ArrowRight className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-green-900">
                      3. Swap & Unassign
                    </div>
                    <div className="text-green-700">
                      Drop on occupied slots to swap jobs, or drag back to
                      unassigned panel
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs text-muted-foreground border-t pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-100 border-l-4 border-purple-300 rounded"></div>
                  <span>Assigned Jobs (Draggable)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-100 border-l-4 border-blue-300 rounded"></div>
                  <span>In Progress (Draggable)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-100 border-l-4 border-green-300 rounded"></div>
                  <span>Completed (Fixed)</span>
                </div>
                <div className="flex items-center gap-2">
                  <GripVertical className="h-3 w-3 text-gray-400" />
                  <span>Hover to see drag handle</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Modal Overlay */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold capitalize">
                  {selectedStatusFilter.replace('-', ' ')} Jobs
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStatusModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="space-y-4">
                  {jobs
                    .filter((job) => {
                      if (selectedStatusFilter === "finished") return job.status === "completed";
                      if (selectedStatusFilter === "roc-closed") return job.status === "completed";
                      return job.status === selectedStatusFilter;
                    })
                    .map((job) => (
                      <Card key={job.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{job.id}</Badge>
                              <Badge className={getPriorityColor(job.priority)}>
                                {job.priority}
                              </Badge>
                              <Badge className={getStatusColor(job.status)}>
                                {job.status}
                              </Badge>
                            </div>
                            <h3 className="font-semibold">{job.title}</h3>
                            <p className="text-sm text-gray-600">{job.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {job.assignedTechnician || "Unassigned"}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {job.estimatedDuration}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              Customer: {job.customer}
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}

                  {jobs.filter((job) => {
                    if (selectedStatusFilter === "finished") return job.status === "completed";
                    if (selectedStatusFilter === "roc-closed") return job.status === "completed";
                    return job.status === selectedStatusFilter;
                  }).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No jobs found with status: {selectedStatusFilter.replace('-', ' ')}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Total: {jobs.filter((job) => {
                      if (selectedStatusFilter === "finished") return job.status === "completed";
                      if (selectedStatusFilter === "roc-closed") return job.status === "completed";
                      return job.status === selectedStatusFilter;
                    }).length} jobs
                  </span>
                  <Button onClick={() => setShowStatusModal(false)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
