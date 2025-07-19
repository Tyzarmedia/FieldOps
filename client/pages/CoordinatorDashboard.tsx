import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Plus,
  User,
  MapPin,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  Edit,
  Trash2,
  Calendar,
  FileText,
  Users,
  Activity,
  Timer,
} from "lucide-react";

export default function CoordinatorDashboard() {
  const [selectedTechnician, setSelectedTechnician] = useState("");

  const myStats = {
    totalAssigned: 45,
    completed: 38,
    inProgress: 5,
    pending: 2,
    overdueJobs: 1,
    avgCompletionTime: "3.2h",
    technicianCount: 8,
  };

  const assignedJobs = [
    {
      id: "J051",
      title: "HVAC Maintenance Check",
      technician: "John Smith",
      status: "in-progress",
      assignedDate: "2024-01-15",
      location: "Downtown Office Building",
      priority: "medium",
      estimatedTime: "2h",
      progress: 65,
      issues: null,
    },
    {
      id: "J052",
      title: "Emergency Electrical Repair",
      technician: "Sarah Johnson",
      status: "completed",
      assignedDate: "2024-01-15",
      location: "Shopping Mall - Food Court",
      priority: "high",
      estimatedTime: "1.5h",
      progress: 100,
      issues: null,
    },
    {
      id: "J053",
      title: "Plumbing Inspection",
      technician: "Mike Chen",
      status: "pending",
      assignedDate: "2024-01-16",
      location: "Residential Complex",
      priority: "low",
      estimatedTime: "3h",
      progress: 0,
      issues: "Technician requested additional tools",
    },
    {
      id: "J054",
      title: "Safety Equipment Check",
      technician: "Emma Wilson",
      status: "overdue",
      assignedDate: "2024-01-14",
      location: "Industrial Warehouse",
      priority: "high",
      estimatedTime: "2.5h",
      progress: 30,
      issues: "Delayed due to equipment shortage",
    },
  ];

  const availableTechnicians = [
    {
      id: 1,
      name: "John Smith",
      status: "available",
      skills: ["HVAC", "General Maintenance"],
      currentLocation: "Workshop",
      currentJobs: 2,
      efficiency: 94.2,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      status: "busy",
      skills: ["Electrical", "Safety"],
      currentLocation: "Downtown",
      currentJobs: 3,
      efficiency: 96.8,
    },
    {
      id: 3,
      name: "Mike Chen",
      status: "available",
      skills: ["Plumbing", "HVAC"],
      currentLocation: "Midtown",
      currentJobs: 1,
      efficiency: 88.5,
    },
    {
      id: 4,
      name: "Emma Wilson",
      status: "busy",
      skills: ["Emergency", "General"],
      currentLocation: "Industrial Area",
      currentJobs: 2,
      efficiency: 92.1,
    },
  ];

  const technicianSchedules = [
    {
      technician: "John Smith",
      jobs: [
        { time: "09:00", title: "HVAC Check", status: "completed" },
        {
          time: "11:30",
          title: "Maintenance Inspection",
          status: "in-progress",
        },
        { time: "14:00", title: "Equipment Repair", status: "pending" },
      ],
    },
    {
      technician: "Sarah Johnson",
      jobs: [
        { time: "08:30", title: "Electrical Repair", status: "completed" },
        { time: "10:45", title: "Safety Inspection", status: "completed" },
        { time: "13:30", title: "Panel Upgrade", status: "in-progress" },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground";
      case "in-progress":
        return "bg-primary text-primary-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "overdue":
        return "bg-destructive text-destructive-foreground";
      case "available":
        return "bg-success text-success-foreground";
      case "busy":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-info text-info-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Coordinator Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Assigned</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myStats.totalAssigned}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>{myStats.completed} completed</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myStats.inProgress}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Timer className="h-3 w-3 text-primary" />
              <span>{myStats.pending} pending</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Completion
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myStats.avgCompletionTime}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-success" />
              <span>15% faster than avg</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Coverage</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myStats.technicianCount}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3 text-primary" />
              <span>Technicians managed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="jobs">My Jobs</TabsTrigger>
          <TabsTrigger value="create">Create Job</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Jobs Assigned by Me</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Quick Assign
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {assignedJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{job.id}</Badge>
                        <Badge className={getPriorityColor(job.priority)}>
                          {job.priority}
                        </Badge>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                        {job.status === "overdue" && (
                          <Badge className="bg-destructive text-destructive-foreground">
                            OVERDUE
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-semibold text-foreground">
                        {job.title}
                      </h4>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {job.technician}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {job.assignedDate}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {job.estimatedTime}
                        </div>
                      </div>
                      {job.issues && (
                        <div className="mt-2 p-2 bg-warning/10 border border-warning/20 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="h-4 w-4 text-warning" />
                            <span className="text-sm text-warning-foreground">
                              {job.issues}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="font-semibold text-lg">{job.progress}%</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {job.status === "pending" && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Reassign
                      </Button>
                    )}
                    {job.status === "overdue" && (
                      <Button size="sm" className="flex-1">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Escalate
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Job</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job-title">Job Title</Label>
                  <Input
                    id="job-title"
                    placeholder="Enter job title"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="job-priority">Priority</Label>
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

              <div className="space-y-2">
                <Label htmlFor="job-description">Description</Label>
                <Textarea
                  id="job-description"
                  placeholder="Describe the job requirements..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="job-location">Location</Label>
                  <Input
                    id="job-location"
                    placeholder="Job site location"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated-time">Estimated Time</Label>
                  <Input
                    id="estimated-time"
                    placeholder="e.g., 2h 30m"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assign-technician">Assign Technician</Label>
                <Select
                  value={selectedTechnician}
                  onValueChange={setSelectedTechnician}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select technician" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTechnicians.map((tech) => (
                      <SelectItem key={tech.id} value={tech.name}>
                        <div className="flex items-center space-x-2">
                          <span>{tech.name}</span>
                          <Badge
                            className={getStatusColor(tech.status)}
                            variant="outline"
                          >
                            {tech.status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Required Stock (Optional)</Label>
                <div className="flex space-x-2">
                  <Input placeholder="Stock item" className="flex-1" />
                  <Input placeholder="Quantity" className="w-24" />
                  <Button variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Safety Checklist (Optional)</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="ppe" />
                    <Label htmlFor="ppe">PPE Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="safety-brief" />
                    <Label htmlFor="safety-brief">Safety Briefing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="equipment-check" />
                    <Label htmlFor="equipment-check">
                      Equipment Safety Check
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button className="flex-1">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Job
                </Button>
                <Button variant="outline" className="flex-1">
                  Save as Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technician Schedules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {technicianSchedules.map((schedule, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-lg p-4"
                  >
                    <h4 className="font-semibold mb-3">
                      {schedule.technician}
                    </h4>
                    <div className="space-y-2">
                      {schedule.jobs.map((job, jobIndex) => (
                        <div
                          key={jobIndex}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-sm font-medium">
                              {job.time}
                            </div>
                            <div>{job.title}</div>
                          </div>
                          <Badge className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>My Job Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Completion Rate Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Time Efficiency Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Issues & Delays Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Technician Performance
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Available Technicians</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableTechnicians.map((tech) => (
                    <div
                      key={tech.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div>
                        <h5 className="font-medium">{tech.name}</h5>
                        <p className="text-xs text-muted-foreground">
                          {tech.skills.join(", ")}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span className="text-xs">
                            {tech.currentLocation}
                          </span>
                        </div>
                      </div>
                      <div className="text-center">
                        <Badge className={getStatusColor(tech.status)}>
                          {tech.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {tech.currentJobs} jobs
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
