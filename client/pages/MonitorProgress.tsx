import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Search,
  Filter,
  Activity,
  Timer,
  Eye,
  RotateCcw,
  TrendingUp,
  UserCheck,
  AlertCircle,
  ArrowUpDown,
  Settings,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status:
    | "assigned"
    | "accepted"
    | "in-progress"
    | "finished"
    | "followup"
    | "escalated"
    | "roc-closed";
  estimatedDuration: string;
  location: string;
  requiredSkills: string[];
  scheduledDate: string;
  scheduledTime: string;
  assignedTechnician: string;
  customer: string;
  notes?: string;
  productivity?: number; // 0-100
  actualDuration?: string;
  completedAt?: string;
}

interface Technician {
  id: string;
  name: string;
  email: string;
  status: "available" | "busy" | "offline";
  skills: string[];
  currentLocation: string;
  workload: number;
  productivity: number;
}

export default function MonitorProgress() {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "JA-7762",
      title: "HVAC Maintenance Check",
      description: "Routine maintenance and inspection of HVAC system",
      priority: "medium",
      status: "in-progress",
      estimatedDuration: "2h",
      location: "Downtown Office Building",
      requiredSkills: ["HVAC", "Maintenance"],
      scheduledDate: "2024-01-16",
      scheduledTime: "09:00",
      assignedTechnician: "John Smith",
      customer: "Acme Corp",
      productivity: 85,
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
      productivity: 60,
    },
    {
      id: "JA-7764",
      title: "Plumbing Installation",
      description: "Install new water filtration system",
      priority: "low",
      status: "finished",
      estimatedDuration: "4h",
      location: "Residential Complex",
      requiredSkills: ["Plumbing", "Installation"],
      scheduledDate: "2024-01-16",
      scheduledTime: "13:00",
      assignedTechnician: "Mike Chen",
      customer: "Green Valley Homes",
      productivity: 95,
      actualDuration: "3.5h",
      completedAt: "16:30",
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
      productivity: 78,
    },
    {
      id: "JA-7766",
      title: "Network Infrastructure Setup",
      description: "Install and configure network equipment",
      priority: "medium",
      status: "assigned",
      estimatedDuration: "6h",
      location: "New Office Building",
      requiredSkills: ["Network", "Installation"],
      scheduledDate: "2024-01-16",
      scheduledTime: "14:00",
      assignedTechnician: "David Rodriguez",
      customer: "Tech Startup Inc",
      productivity: 0,
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
      productivity: 88,
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
      productivity: 100,
      actualDuration: "0.5h",
      completedAt: "16:30",
    },
  ]);

  const [technicians] = useState<Technician[]>([
    {
      id: "1",
      name: "John Smith",
      email: "john.smith@fieldops.com",
      status: "busy",
      skills: ["HVAC", "Maintenance", "General"],
      currentLocation: "Downtown",
      workload: 85,
      productivity: 87,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.johnson@fieldops.com",
      status: "busy",
      skills: ["Electrical", "Emergency", "Safety"],
      currentLocation: "Midtown",
      workload: 90,
      productivity: 72,
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike.chen@fieldops.com",
      status: "available",
      skills: ["Plumbing", "Installation", "HVAC"],
      currentLocation: "Southside",
      workload: 45,
      productivity: 95,
    },
    {
      id: "4",
      name: "Emma Wilson",
      email: "emma.wilson@fieldops.com",
      status: "available",
      skills: ["Safety", "Inspection", "General"],
      currentLocation: "Industrial Area",
      workload: 60,
      productivity: 82,
    },
    {
      id: "5",
      name: "David Rodriguez",
      email: "david.rodriguez@fieldops.com",
      status: "available",
      skills: ["Network", "IT", "Installation"],
      currentLocation: "Tech District",
      workload: 30,
      productivity: 76,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterTechnician, setFilterTechnician] = useState("all");
  const [sortBy, setSortBy] = useState("time");

  // Generate 24 hour time slots
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    return `${i.toString().padStart(2, "0")}:00`;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "accepted":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "finished":
        return "bg-green-100 text-green-800 border-green-300";
      case "followup":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "escalated":
        return "bg-red-100 text-red-800 border-red-300";
      case "roc-closed":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
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

  const getProductivityColor = (productivity: number) => {
    if (productivity >= 90) return "text-green-600";
    if (productivity >= 75) return "text-yellow-600";
    if (productivity >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.assignedTechnician.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || job.status === filterStatus;
      const matchesPriority =
        filterPriority === "all" || job.priority === filterPriority;
      const matchesTechnician =
        filterTechnician === "all" ||
        job.assignedTechnician === filterTechnician;
      const matchesDate = job.scheduledDate === selectedDate;
      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesTechnician &&
        matchesDate
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "time":
          return a.scheduledTime.localeCompare(b.scheduledTime);
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "status":
          return a.status.localeCompare(b.status);
        case "technician":
          return a.assignedTechnician.localeCompare(b.assignedTechnician);
        default:
          return 0;
      }
    });

  const stats = {
    assigned: jobs.filter((j) => j.status === "assigned").length,
    accepted: jobs.filter((j) => j.status === "accepted").length,
    inProgress: jobs.filter((j) => j.status === "in-progress").length,
    finished: jobs.filter((j) => j.status === "finished").length,
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
              <Activity className="h-8 w-8 text-blue-600" />
              Monitor Progress
            </h1>
            <p className="text-gray-600 mt-1">
              Track job progress and technician performance across all schedules
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  View Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Progress Monitor Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Auto-refresh interval</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="300">5 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assigned</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {stats.assigned}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accepted</CardTitle>
              <CheckCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.accepted}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Activity className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.inProgress}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finished</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.finished}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Follow-up</CardTitle>
              <Timer className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.followup}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Escalated</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.escalated}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ROC Closed</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">
                {stats.rocClosed}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Controls */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filters & Controls</CardTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor="date-select">Date:</Label>
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
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="finished">Finished</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                  <SelectItem value="roc-closed">ROC Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filterTechnician}
                onValueChange={setFilterTechnician}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Technicians" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technicians</SelectItem>
                  {technicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.name}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time">Time</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 24-Hour Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Technician Performance Panel */}
          <div className="lg:col-span-3">
            <Card className="h-[700px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Technician Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[620px] px-4">
                  <div className="space-y-3">
                    {technicians.map((technician) => (
                      <div
                        key={technician.id}
                        className="p-3 border rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-sm">
                            {technician.name}
                          </h4>
                          <Badge
                            className={`${technician.status === "available" ? "bg-green-100 text-green-800" : technician.status === "busy" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
                          >
                            {technician.status}
                          </Badge>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Workload:
                            </span>
                            <span className="font-medium">
                              {technician.workload}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Productivity:
                            </span>
                            <span
                              className={`font-medium ${getProductivityColor(technician.productivity)}`}
                            >
                              {technician.productivity}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Location:
                            </span>
                            <span className="font-medium">
                              {technician.currentLocation}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {technician.skills.slice(0, 3).map((skill) => (
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
          <div className="lg:col-span-9">
            <Card className="h-[700px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Schedule - {new Date(selectedDate).toLocaleDateString()}
                  <Badge variant="outline" className="ml-2">
                    {filteredJobs.length} jobs
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-6 h-[620px]">
                  {/* Time slots column */}
                  <div className="border-r bg-gray-50 p-2">
                    <div className="font-semibold text-sm mb-3 text-center sticky top-0 bg-gray-50 py-2">
                      Time
                    </div>
                    <ScrollArea className="h-[550px]">
                      <div className="space-y-0">
                        {timeSlots.map((time) => (
                          <div
                            key={time}
                            className="h-16 flex items-center justify-center text-sm text-muted-foreground border-b"
                          >
                            {time}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Technician columns */}
                  {technicians.slice(0, 5).map((technician) => (
                    <div key={technician.id} className="border-r">
                      {/* Technician header */}
                      <div className="p-2 border-b bg-gray-50">
                        <div className="text-center">
                          <div className="font-semibold text-sm">
                            {technician.name}
                          </div>
                          <div className="flex items-center justify-center gap-2 mt-1">
                            <Badge
                              className={`${technician.status === "available" ? "bg-green-100 text-green-800" : technician.status === "busy" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
                            >
                              {technician.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Productivity:{" "}
                            <span
                              className={getProductivityColor(
                                technician.productivity,
                              )}
                            >
                              {technician.productivity}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Time slots */}
                      <ScrollArea className="h-[550px]">
                        <div className="space-y-0">
                          {timeSlots.map((time) => {
                            const jobAtTime = filteredJobs.find(
                              (job) =>
                                job.assignedTechnician === technician.name &&
                                job.scheduledTime === time,
                            );

                            return (
                              <div
                                key={time}
                                className="h-16 border-b p-1 transition-colors"
                              >
                                {jobAtTime ? (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <div
                                        className={`h-full rounded p-2 text-xs cursor-pointer transition-all hover:shadow-md border-l-4 ${getStatusColor(jobAtTime.status)}`}
                                      >
                                        <div className="font-semibold text-xs mb-1">
                                          {jobAtTime.id}
                                        </div>
                                        <div className="truncate text-xs">
                                          {jobAtTime.title}
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                          <Badge
                                            className={getPriorityColor(
                                              jobAtTime.priority,
                                            )}
                                            variant="outline"
                                          >
                                            {jobAtTime.priority}
                                          </Badge>
                                          {jobAtTime.productivity !==
                                            undefined &&
                                            jobAtTime.productivity > 0 && (
                                              <span
                                                className={`text-xs font-medium ${getProductivityColor(jobAtTime.productivity)}`}
                                              >
                                                {jobAtTime.productivity}%
                                              </span>
                                            )}
                                        </div>
                                      </div>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-md">
                                      <DialogHeader>
                                        <DialogTitle>
                                          Job Details - {jobAtTime.id}
                                        </DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4 py-4">
                                        <div>
                                          <h4 className="font-semibold">
                                            {jobAtTime.title}
                                          </h4>
                                          <p className="text-sm text-muted-foreground">
                                            {jobAtTime.description}
                                          </p>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                          <div>
                                            <div className="flex items-center gap-1 mb-1">
                                              <User className="h-3 w-3" />
                                              <span className="font-medium">
                                                Technician:
                                              </span>
                                            </div>
                                            <span className="text-muted-foreground">
                                              {jobAtTime.assignedTechnician}
                                            </span>
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-1 mb-1">
                                              <MapPin className="h-3 w-3" />
                                              <span className="font-medium">
                                                Location:
                                              </span>
                                            </div>
                                            <span className="text-muted-foreground">
                                              {jobAtTime.location}
                                            </span>
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-1 mb-1">
                                              <Clock className="h-3 w-3" />
                                              <span className="font-medium">
                                                Duration:
                                              </span>
                                            </div>
                                            <span className="text-muted-foreground">
                                              {jobAtTime.estimatedDuration}
                                            </span>
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-1 mb-1">
                                              <AlertTriangle className="h-3 w-3" />
                                              <span className="font-medium">
                                                Priority:
                                              </span>
                                            </div>
                                            <Badge
                                              className={getPriorityColor(
                                                jobAtTime.priority,
                                              )}
                                            >
                                              {jobAtTime.priority}
                                            </Badge>
                                          </div>
                                        </div>
                                        <div>
                                          <div className="flex items-center gap-1 mb-1">
                                            <Activity className="h-3 w-3" />
                                            <span className="font-medium">
                                              Status:
                                            </span>
                                          </div>
                                          <Badge
                                            className={getStatusColor(
                                              jobAtTime.status,
                                            )}
                                          >
                                            {jobAtTime.status}
                                          </Badge>
                                        </div>
                                        {jobAtTime.productivity !== undefined &&
                                          jobAtTime.productivity > 0 && (
                                            <div>
                                              <div className="flex items-center gap-1 mb-1">
                                                <TrendingUp className="h-3 w-3" />
                                                <span className="font-medium">
                                                  Productivity:
                                                </span>
                                              </div>
                                              <span
                                                className={`font-medium ${getProductivityColor(jobAtTime.productivity)}`}
                                              >
                                                {jobAtTime.productivity}%
                                              </span>
                                            </div>
                                          )}
                                        <div className="mt-4 pt-4 border-t">
                                          <div className="flex flex-wrap gap-1">
                                            {jobAtTime.requiredSkills.map(
                                              (skill) => (
                                                <Badge
                                                  key={skill}
                                                  variant="outline"
                                                  className="text-xs"
                                                >
                                                  {skill}
                                                </Badge>
                                              ),
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                ) : (
                                  <div className="h-full flex items-center justify-center text-gray-300 hover:bg-gray-50 rounded transition-colors"></div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
