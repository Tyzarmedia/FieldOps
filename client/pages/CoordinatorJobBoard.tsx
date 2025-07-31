import { useState, useRef, useCallback } from "react";
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
      status: "unassigned",
      estimatedDuration: "1.5h",
      location: "Shopping Mall - Section B",
      requiredSkills: ["Electrical", "Emergency"],
      customer: "Mall Management",
    },
    {
      id: "JA-7764",
      title: "Plumbing Installation",
      description: "Install new water filtration system",
      priority: "low",
      status: "in-progress",
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
      status: "assigned",
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
      status: "unassigned",
      estimatedDuration: "6h",
      location: "New Office Building",
      requiredSkills: ["Network", "Installation"],
      customer: "Tech Startup Inc",
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
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const dragOverRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((job: Job) => {
    setDraggedJob(job);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedJob(null);
  }, []);

  const handleDrop = useCallback((technicianId: string, timeSlot?: string) => {
    if (draggedJob) {
      setJobs(prev => prev.map(job => 
        job.id === draggedJob.id 
          ? { 
              ...job, 
              assignedTechnician: technicians.find(t => t.id === technicianId)?.name,
              status: "assigned" as const,
              scheduledDate: selectedDate,
              scheduledTime: timeSlot || "09:00"
            }
          : job
      ));
      setDraggedJob(null);
    }
  }, [draggedJob, technicians, selectedDate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "assigned": return "bg-purple-100 text-purple-800";
      case "unassigned": return "bg-gray-100 text-gray-800";
      case "overdue": return "bg-red-100 text-red-800";
      case "available": return "bg-green-100 text-green-800";
      case "busy": return "bg-yellow-100 text-yellow-800";
      case "offline": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500 text-white";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || job.status === filterStatus;
    const matchesPriority = filterPriority === "all" || job.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const unassignedJobs = filteredJobs.filter(job => job.status === "unassigned");
  const assignedJobs = filteredJobs.filter(job => job.status !== "unassigned");

  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const stats = {
    totalJobs: jobs.length,
    unassigned: jobs.filter(j => j.status === "unassigned").length,
    inProgress: jobs.filter(j => j.status === "in-progress").length,
    completed: jobs.filter(j => j.status === "completed").length,
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
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Job</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input placeholder="Enter job title..." />
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
                  <Button className="w-full">Create Job</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalJobs}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.unassigned}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
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
              <CardContent className="p-0">
                <ScrollArea className="h-[520px] px-4">
                  <div className="space-y-3">
                    {unassignedJobs.map((job) => (
                      <div
                        key={job.id}
                        draggable
                        onDragStart={() => handleDragStart(job)}
                        onDragEnd={handleDragEnd}
                        className={`p-3 border rounded-lg cursor-move hover:shadow-md transition-all ${
                          draggedJob?.id === job.id ? 'opacity-50 scale-95' : ''
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
                        <h4 className="font-semibold text-sm mb-1">{job.title}</h4>
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
                            <Badge key={skill} variant="outline" className="text-xs">
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
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Schedule - {new Date(selectedDate).toLocaleDateString()}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-5 h-[520px]">
                  {/* Time slots header */}
                  <div className="border-r bg-gray-50 p-2">
                    <div className="font-semibold text-sm mb-3 text-center">Time</div>
                    <div className="space-y-2">
                      {timeSlots.map((time) => (
                        <div key={time} className="h-16 flex items-center justify-center text-sm text-muted-foreground border-b">
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Technician columns */}
                  {technicians.slice(0, 4).map((technician) => (
                    <div key={technician.id} className="border-r">
                      {/* Technician header */}
                      <div className="p-2 border-b bg-gray-50">
                        <div className="text-center">
                          <div className="font-semibold text-sm">{technician.name}</div>
                          <div className="flex items-center justify-center gap-2 mt-1">
                            <Badge className={getStatusColor(technician.status)}>
                              {technician.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {technician.workload}%
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1 justify-center">
                            {technician.skills.slice(0, 2).map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Time slots */}
                      <div className="space-y-0">
                        {timeSlots.map((time) => {
                          const jobAtTime = assignedJobs.find(
                            job => job.assignedTechnician === technician.name && 
                                   job.scheduledTime === time &&
                                   job.scheduledDate === selectedDate
                          );

                          return (
                            <div
                              key={time}
                              className={`h-16 border-b p-1 transition-colors ${
                                draggedJob ? 'border-dashed border-blue-300 bg-blue-50/50' : ''
                              }`}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={() => handleDrop(technician.id, time)}
                            >
                              {jobAtTime ? (
                                <div className={`h-full rounded p-2 text-xs ${
                                  jobAtTime.status === 'completed' ? 'bg-green-100 border-green-300' :
                                  jobAtTime.status === 'in-progress' ? 'bg-blue-100 border-blue-300' :
                                  'bg-purple-100 border-purple-300'
                                } border-l-4`}>
                                  <div className="font-semibold">{jobAtTime.id}</div>
                                  <div className="truncate">{jobAtTime.title}</div>
                                  <Badge className={getStatusColor(jobAtTime.status)} variant="outline">
                                    {jobAtTime.status}
                                  </Badge>
                                </div>
                              ) : (
                                <div className="h-full flex items-center justify-center text-gray-300 hover:bg-gray-50 rounded">
                                  {draggedJob && (
                                    <div className="text-xs text-blue-600">Drop here</div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4" />
                <span>Drag jobs from the left panel</span>
              </div>
              <ArrowRight className="h-4 w-4" />
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Drop on technician time slots to assign</span>
              </div>
              <ArrowRight className="h-4 w-4" />
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Jobs automatically update status</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
