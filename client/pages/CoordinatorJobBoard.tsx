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
  Package,
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([
    {
      id: "tech001",
      name: "Dyondzani Clement Masinge",
      email: "dyondzani.masinge@fieldops.com",
      status: "available",
      skills: ["FTTH", "Fiber Optics", "Installation", "Maintenance"],
      currentLocation: "East London",
      workload: 65,
      schedule: [],
    },
    {
      id: "tech002",
      name: "John Smith",
      email: "john.smith@fieldops.com",
      status: "available",
      skills: ["HVAC", "Maintenance", "General"],
      currentLocation: "Downtown",
      workload: 45,
      schedule: [],
    },
    {
      id: "tech003",
      name: "Sarah Johnson",
      email: "sarah.johnson@fieldops.com",
      status: "busy",
      skills: ["Electrical", "Emergency", "Safety"],
      currentLocation: "Midtown",
      workload: 85,
      schedule: [],
    },
    {
      id: "tech004",
      name: "Mike Chen",
      email: "mike.chen@fieldops.com",
      status: "available",
      skills: ["Plumbing", "Installation", "HVAC"],
      currentLocation: "Southside",
      workload: 30,
      schedule: [],
    },
    {
      id: "tech005",
      name: "Emma Wilson",
      email: "emma.wilson@fieldops.com",
      status: "available",
      skills: ["Safety", "Inspection", "General"],
      currentLocation: "Industrial Area",
      workload: 70,
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
  const [showNewJobDialog, setShowNewJobDialog] = useState(false);
  const [newJobData, setNewJobData] = useState({
    title: "",
    description: "",
    priority: "medium",
    customer: "",
    location: "",
    estimatedDuration: "2h",
    requiredSkills: [] as string[],
  });

  const dragOverRef = useRef<HTMLDivElement>(null);

  // Load jobs from backend
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const response = await fetch("/api/job-mgmt/jobs");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data && data.data.length > 0) {
            // Convert backend jobs to frontend format
            const formattedJobs = data.data.map((job: any) => ({
              id: job.id,
              title: job.title,
              description: job.description,
              priority: job.priority?.toLowerCase() || "medium",
              status:
                job.status?.toLowerCase().replace(" ", "-") || "unassigned",
              assignedTechnician: job.assignedTechnician,
              scheduledDate: job.scheduledDate || selectedDate,
              scheduledTime: "09:00",
              requiredSkills: ["General"],
              customer: job.client?.name || job.customer || "Unknown Client",
              location: job.client?.address || job.location || "TBD",
              estimatedDuration: job.estimatedHours
                ? `${job.estimatedHours}h`
                : "2h",
            }));
            // Merge new jobs with existing ones, preserving local changes
            setJobs((prevJobs) => {
              const newJobsMap = new Map(formattedJobs.map((job: any) => [job.id, job]));
              const existingJobsMap = new Map(prevJobs.map(job => [job.id, job]));

              // Start with existing jobs to preserve any local changes
              const mergedJobs = [...prevJobs];

              // Add any new jobs from backend that don't exist locally
              formattedJobs.forEach((backendJob: any) => {
                if (!existingJobsMap.has(backendJob.id)) {
                  mergedJobs.push(backendJob);
                }
              });

              // Remove jobs that no longer exist on backend (unless they were just created)
              const filteredJobs = mergedJobs.filter(job => {
                // Keep job if it exists on backend OR if it's very recently created (within 30 seconds)
                const jobAge = Date.now() - parseInt(job.id);
                return newJobsMap.has(job.id) || jobAge < 30000;
              });

              return filteredJobs;
            });
          }
        }
      } catch (error) {
        console.error("Failed to load jobs:", error);
      }
    };

    loadJobs();

    // Set up background polling every 5 seconds (less frequent to reduce disruption)
    const interval = setInterval(loadJobs, 5000);

    return () => clearInterval(interval);
  }, [selectedDate]);

  // Create new job
  const createJob = async () => {
    try {
      const jobPayload = {
        title: newJobData.title,
        description: newJobData.description,
        type: "General",
        priority:
          newJobData.priority.charAt(0).toUpperCase() +
          newJobData.priority.slice(1),
        client: {
          name: newJobData.customer,
          address: newJobData.location,
          contactPerson: "To be assigned",
          phone: "TBD",
        },
        estimatedHours:
          parseInt(newJobData.estimatedDuration.replace("h", "")) || 2,
      };

      const response = await fetch("/api/job-mgmt/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobPayload),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Add the new job to the list
          const newJob: Job = {
            id: result.data.id,
            title: result.data.title,
            description: result.data.description,
            priority: result.data.priority.toLowerCase() as any,
            status: "unassigned",
            estimatedDuration: `${result.data.estimatedHours}h`,
            location: result.data.client.address,
            requiredSkills: ["General"],
            customer: result.data.client.name,
            scheduledDate: selectedDate,
            scheduledTime: "09:00",
          };

          // Update jobs immediately to prevent polling from overriding
          setJobs((prev) => {
            const exists = prev.find((job) => job.id === newJob.id);
            return exists ? prev : [...prev, newJob];
          });

          setShowNewJobDialog(false);
          setNewJobData({
            title: "",
            description: "",
            priority: "medium",
            customer: "",
            location: "",
            estimatedDuration: "2h",
            requiredSkills: [],
          });

          alert("Job created successfully!");
        }
      } else {
        alert("Failed to create job");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Error creating job");
    }
  };

  // Save job changes to backend
  const updateJobInBackend = async (jobId: string, updates: Partial<Job>) => {
    try {
      if (updates.assignedTechnician && updates.status === "assigned") {
        // Use the assignment endpoint
        const response = await fetch(`/api/job-mgmt/jobs/${jobId}/assign`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            technicianId: updates.assignedTechnician,
          }),
        });

        if (!response.ok) {
          console.error("Failed to assign job on backend");
          // Revert local change if backend fails
          setJobs((prev) =>
            prev.map((job) =>
              job.id === jobId
                ? {
                    ...job,
                    status: "unassigned",
                    assignedTechnician: undefined,
                  }
                : job,
            ),
          );
        }
      }
    } catch (error) {
      console.error("Failed to update job:", error);
      // Revert local change if request fails
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? { ...job, status: "unassigned", assignedTechnician: undefined }
            : job,
        ),
      );
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
          assignedTechnician: targetTechnician?.id,
          status: "assigned" as const,
          scheduledDate: selectedDate,
          scheduledTime: timeSlot || "09:00",
        };

        setJobs((prev) =>
          prev.map((job) =>
            job.id === draggedJob.id ? { ...job, ...updates } : job,
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
        assignedTechnician: targetTechnician?.id,
        scheduledDate: selectedDate,
        scheduledTime: newTimeSlot,
      };

      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, ...updates } : job)),
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
    unassigned: jobs.filter((j) => j.status === "unassigned").length,
    assigned: jobs.filter((j) => j.status === "assigned").length,
    accepted: jobs.filter((j) => j.status === "accepted").length,
    inProgress: jobs.filter((j) => j.status === "in-progress").length,
    completed: jobs.filter((j) => j.status === "completed").length,
  };

  const handleStatusCardClick = (status: string) => {
    setSelectedStatusFilter(status);
    setShowStatusModal(true);
  };

  const getJobsByStatus = (status: string) => {
    return jobs.filter((job) => {
      if (status === "completed") {
        return job.status === "completed";
      }
      return job.status === status;
    });
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
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">
                Real-time updates active
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Dialog open={showNewJobDialog} onOpenChange={setShowNewJobDialog}>
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
                  {/* Basic Information */}
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input
                      placeholder="Enter job title..."
                      value={newJobData.title}
                      onChange={(e) =>
                        setNewJobData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <textarea
                      className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                      placeholder="Enter detailed job description..."
                      value={newJobData.description}
                      onChange={(e) =>
                        setNewJobData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <Select
                        value={newJobData.priority}
                        onValueChange={(value) =>
                          setNewJobData((prev) => ({
                            ...prev,
                            priority: value,
                          }))
                        }
                      >
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

                    <div className="space-y-2">
                      <Label>Estimated Duration</Label>
                      <Select
                        value={newJobData.estimatedDuration}
                        onValueChange={(value) =>
                          setNewJobData((prev) => ({
                            ...prev,
                            estimatedDuration: value,
                          }))
                        }
                      >
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
                  </div>

                  <div className="space-y-2">
                    <Label>Customer</Label>
                    <Input
                      placeholder="Enter customer name..."
                      value={newJobData.customer}
                      onChange={(e) =>
                        setNewJobData((prev) => ({
                          ...prev,
                          customer: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="Enter job location..."
                      value={newJobData.location}
                      onChange={(e) =>
                        setNewJobData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      className="flex-1"
                      onClick={createJob}
                      disabled={!newJobData.title || !newJobData.customer}
                    >
                      Create Job
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowNewJobDialog(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview - Reordered as requested */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => handleStatusCardClick("unassigned")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.unassigned}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Click to view
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => handleStatusCardClick("assigned")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.assigned}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Click to view
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => handleStatusCardClick("accepted")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.accepted}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Click to view
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => handleStatusCardClick("in-progress")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Activity className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.inProgress}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Click to view
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => handleStatusCardClick("completed")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.completed}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Click to view
              </p>
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
                      <div className="font-semibold text-sm text-center">
                        Time
                      </div>
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
                              index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
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
                                job.assignedTechnician === technician.id &&
                                job.scheduledTime === time &&
                                job.scheduledDate === selectedDate,
                            );

                            return (
                              <div
                                key={time}
                                className={`h-12 border-b p-1 transition-colors ${
                                  timeIndex % 2 === 0
                                    ? "bg-white"
                                    : "bg-slate-50"
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
                                          ? "bg-yellow-100 border-yellow-300"
                                          : jobAtTime.status === "accepted"
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
                                        Drop here to assign
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

        {/* Status Modal Overlay */}
        {showStatusModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold capitalize">
                  {selectedStatusFilter.replace("-", " ")} Jobs (
                  {getJobsByStatus(selectedStatusFilter).length})
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
                  {getJobsByStatus(selectedStatusFilter).length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>
                        No jobs found with status:{" "}
                        {selectedStatusFilter.replace("-", " ")}
                      </p>
                    </div>
                  ) : (
                    getJobsByStatus(selectedStatusFilter).map((job) => (
                      <Card key={job.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{job.id}</Badge>
                              <Badge className={getPriorityColor(job.priority)}>
                                {job.priority}
                              </Badge>
                              <Badge className={getStatusColor(job.status)}>
                                {job.status.replace("-", " ")}
                              </Badge>
                            </div>
                            <h3 className="font-semibold">{job.title}</h3>
                            <p className="text-sm text-gray-600">
                              {job.description}
                            </p>
                            <div className="flex items-center gap-6 text-sm text-gray-500">
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
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {job.customer}
                              </div>
                            </div>
                            {job.scheduledDate && (
                              <div className="text-sm text-gray-500">
                                <strong>Scheduled:</strong>{" "}
                                {new Date(
                                  job.scheduledDate,
                                ).toLocaleDateString()}{" "}
                                at {job.scheduledTime}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            {job.status === "unassigned" && (
                              <Button size="sm" variant="outline">
                                <UserCheck className="h-3 w-3 mr-1" />
                                Assign
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Total: {getJobsByStatus(selectedStatusFilter).length} jobs
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
