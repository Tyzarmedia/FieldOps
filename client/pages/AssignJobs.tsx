import { useState } from "react";
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
  Plus,
  Search,
  Filter,
  UserCheck,
  ClipboardList,
  ArrowRight,
  Users,
  Timer,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Job {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "unassigned" | "assigned" | "in-progress" | "completed";
  estimatedDuration: string;
  location: string;
  requiredSkills: string[];
  customer: string;
  notes?: string;
  urgentBy?: string;
}

interface Technician {
  id: string;
  name: string;
  email: string;
  status: "available" | "busy" | "offline";
  skills: string[];
  currentLocation: string;
  workload: number;
  rating: number;
}

export default function AssignJobs() {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: "JA-7769",
      title: "Emergency Electrical Repair",
      description: "Power outage in building section B - Critical",
      priority: "urgent",
      status: "unassigned",
      estimatedDuration: "1.5h",
      location: "Shopping Mall - Section B",
      requiredSkills: ["Electrical", "Emergency"],
      customer: "Mall Management",
      urgentBy: "16:00",
    },
    {
      id: "JA-7770",
      title: "Network Infrastructure Setup",
      description: "Install and configure network equipment",
      priority: "medium",
      status: "unassigned",
      estimatedDuration: "6h",
      location: "New Office Building",
      requiredSkills: ["Network", "Installation"],
      customer: "Tech Startup Inc",
    },
    {
      id: "JA-7771",
      title: "HVAC Filter Replacement",
      description: "Replace filters in all HVAC units",
      priority: "low",
      status: "unassigned",
      estimatedDuration: "2h",
      location: "Office Complex A",
      requiredSkills: ["HVAC", "Maintenance"],
      customer: "Property Management",
    },
    {
      id: "JA-7772",
      title: "Safety Equipment Calibration",
      description: "Calibrate safety sensors and alarms",
      priority: "high",
      status: "unassigned",
      estimatedDuration: "3h",
      location: "Industrial Plant",
      requiredSkills: ["Safety", "Calibration"],
      customer: "Manufacturing Corp",
    },
    {
      id: "JA-7773",
      title: "Plumbing Leak Investigation",
      description: "Investigate and repair water leak reports",
      priority: "medium",
      status: "unassigned",
      estimatedDuration: "2.5h",
      location: "Residential Tower",
      requiredSkills: ["Plumbing", "Diagnostics"],
      customer: "Housing Association",
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
      rating: 4.8,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.johnson@fieldops.com",
      status: "available",
      skills: ["Electrical", "Emergency", "Safety"],
      currentLocation: "Midtown",
      workload: 45,
      rating: 4.9,
    },
    {
      id: "3",
      name: "Mike Chen",
      email: "mike.chen@fieldops.com",
      status: "available",
      skills: ["Plumbing", "Installation", "HVAC"],
      currentLocation: "Southside",
      workload: 30,
      rating: 4.7,
    },
    {
      id: "4",
      name: "Emma Wilson",
      email: "emma.wilson@fieldops.com",
      status: "busy",
      skills: ["Safety", "Inspection", "General"],
      currentLocation: "Industrial Area",
      workload: 85,
      rating: 4.6,
    },
    {
      id: "5",
      name: "David Rodriguez",
      email: "david.rodriguez@fieldops.com",
      status: "available",
      skills: ["Network", "IT", "Installation"],
      currentLocation: "Tech District",
      workload: 20,
      rating: 4.8,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterSkills, setFilterSkills] = useState("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const assignJob = (jobId: string, technicianId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, status: "assigned" as const } : job,
      ),
    );
    // In a real app, this would make an API call
    console.log(`Assigned job ${jobId} to technician ${technicianId}`);
  };

  const getSkillMatch = (jobSkills: string[], techSkills: string[]) => {
    const matches = jobSkills.filter((skill) => techSkills.includes(skill));
    return (matches.length / jobSkills.length) * 100;
  };

  const getRecommendedTechnicians = (job: Job) => {
    return technicians
      .filter((tech) => tech.status === "available")
      .map((tech) => ({
        ...tech,
        skillMatch: getSkillMatch(job.requiredSkills, tech.skills),
      }))
      .sort((a, b) => {
        // Sort by skill match first, then by workload (lower is better), then by rating
        if (b.skillMatch !== a.skillMatch) return b.skillMatch - a.skillMatch;
        if (a.workload !== b.workload) return a.workload - b.workload;
        return b.rating - a.rating;
      })
      .slice(0, 3);
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

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const filteredJobs = jobs.filter((job) => {
    if (job.status !== "unassigned") return false;

    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority =
      filterPriority === "all" || job.priority === filterPriority;
    const matchesSkills =
      filterSkills === "all" || job.requiredSkills.includes(filterSkills);

    return matchesSearch && matchesPriority && matchesSkills;
  });

  const urgentJobs = filteredJobs.filter((job) => job.priority === "urgent");
  const highPriorityJobs = filteredJobs.filter(
    (job) => job.priority === "high",
  );
  const normalJobs = filteredJobs.filter(
    (job) => job.priority === "medium" || job.priority === "low",
  );

  const stats = {
    unassigned: jobs.filter((j) => j.status === "unassigned").length,
    urgent: urgentJobs.length,
    availableTechs: technicians.filter((t) => t.status === "available").length,
    busyTechs: technicians.filter((t) => t.status === "busy").length,
  };

  const allSkills = Array.from(
    new Set(jobs.flatMap((job) => job.requiredSkills)),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="h-8 w-8 text-blue-600" />
              Assign Jobs
            </h1>
            <p className="text-gray-600 mt-1">
              Quick job assignment with intelligent technician recommendations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/job-board">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Full Job Board
              </Button>
            </Link>
            <Link to="/monitor-progress">
              <Button variant="outline">
                <Timer className="h-4 w-4 mr-2" />
                Monitor Progress
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Unassigned Jobs
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.unassigned}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgent Jobs</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.urgent}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Techs
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.availableTechs}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Busy Techs</CardTitle>
              <Timer className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.busyTechs}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
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
              <Select value={filterSkills} onValueChange={setFilterSkills}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Skills" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Skills</SelectItem>
                  {allSkills.map((skill) => (
                    <SelectItem key={skill} value={skill}>
                      {skill}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Job Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Urgent Jobs */}
          {urgentJobs.length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Urgent Jobs ({urgentJobs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {urgentJobs.map((job) => (
                      <Card key={job.id} className="p-3 border-red-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Badge variant="outline" className="text-xs mb-1">
                              {job.id}
                            </Badge>
                            <h4 className="font-semibold text-sm">
                              {job.title}
                            </h4>
                          </div>
                          <Badge className={getPriorityColor(job.priority)}>
                            {job.priority}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {job.estimatedDuration}
                            {job.urgentBy && (
                              <span className="text-red-600 font-medium">
                                - Due by {job.urgentBy}
                              </span>
                            )}
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="w-full bg-red-600 hover:bg-red-700"
                              onClick={() => setSelectedJob(job)}
                            >
                              Assign Now
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign Job - {job.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Recommended Technicians
                                </h4>
                                <div className="space-y-2">
                                  {getRecommendedTechnicians(job).map(
                                    (tech) => (
                                      <div
                                        key={tech.id}
                                        className="flex items-center justify-between p-2 border rounded"
                                      >
                                        <div>
                                          <div className="font-medium">
                                            {tech.name}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            Match: {tech.skillMatch.toFixed(0)}%
                                            • Workload: {tech.workload}% •
                                            Rating: {tech.rating}
                                          </div>
                                        </div>
                                        <Button
                                          size="sm"
                                          onClick={() => {
                                            assignJob(job.id, tech.id);
                                            setSelectedJob(null);
                                          }}
                                        >
                                          Assign
                                        </Button>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* High Priority Jobs */}
          {highPriorityJobs.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  High Priority ({highPriorityJobs.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {highPriorityJobs.map((job) => (
                      <Card key={job.id} className="p-3 border-orange-200">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Badge variant="outline" className="text-xs mb-1">
                              {job.id}
                            </Badge>
                            <h4 className="font-semibold text-sm">
                              {job.title}
                            </h4>
                          </div>
                          <Badge className={getPriorityColor(job.priority)}>
                            {job.priority}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {job.estimatedDuration}
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="w-full"
                              variant="outline"
                              onClick={() => setSelectedJob(job)}
                            >
                              Assign
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign Job - {job.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Recommended Technicians
                                </h4>
                                <div className="space-y-2">
                                  {getRecommendedTechnicians(job).map(
                                    (tech) => (
                                      <div
                                        key={tech.id}
                                        className="flex items-center justify-between p-2 border rounded"
                                      >
                                        <div>
                                          <div className="font-medium">
                                            {tech.name}
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            Match: {tech.skillMatch.toFixed(0)}%
                                            • Workload: {tech.workload}% •
                                            Rating: {tech.rating}
                                          </div>
                                        </div>
                                        <Button
                                          size="sm"
                                          onClick={() => {
                                            assignJob(job.id, tech.id);
                                            setSelectedJob(null);
                                          }}
                                        >
                                          Assign
                                        </Button>
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Normal Jobs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-blue-600" />
                Other Jobs ({normalJobs.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {normalJobs.map((job) => (
                    <Card key={job.id} className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge variant="outline" className="text-xs mb-1">
                            {job.id}
                          </Badge>
                          <h4 className="font-semibold text-sm">{job.title}</h4>
                        </div>
                        <Badge className={getPriorityColor(job.priority)}>
                          {job.priority}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {job.estimatedDuration}
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            className="w-full"
                            variant="outline"
                            onClick={() => setSelectedJob(job)}
                          >
                            Assign
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Job - {job.id}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div>
                              <h4 className="font-semibold mb-2">
                                Recommended Technicians
                              </h4>
                              <div className="space-y-2">
                                {getRecommendedTechnicians(job).map((tech) => (
                                  <div
                                    key={tech.id}
                                    className="flex items-center justify-between p-2 border rounded"
                                  >
                                    <div>
                                      <div className="font-medium">
                                        {tech.name}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        Match: {tech.skillMatch.toFixed(0)}% •
                                        Workload: {tech.workload}% • Rating:{" "}
                                        {tech.rating}
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        assignJob(job.id, tech.id);
                                        setSelectedJob(null);
                                      }}
                                    >
                                      Assign
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Link to="/job-board">
                <Button className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Open Full Job Board
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/monitor-progress">
                <Button variant="outline" className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Monitor All Progress
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
