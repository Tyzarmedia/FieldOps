import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  ClipboardList,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
  AlertCircle,
  Timer,
  Eye,
  UserCheck,
  Settings,
  FileText,
  Calendar,
  MapPin,
  DollarSign,
} from "lucide-react";

export default function ManagerDashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const teamStats = {
    totalTechnicians: 12,
    activeTechnicians: 10,
    onBreak: 1,
    offline: 1,
    avgEfficiency: 91.2,
    completedJobs: 234,
    pendingJobs: 18,
    overdueJobs: 3,
    departmentRevenue: 89400,
  };

  const technicians = [
    {
      id: 1,
      name: "John Smith",
      status: "active",
      currentJob: "HVAC Maintenance - Downtown Office",
      efficiency: 94.2,
      jobsCompleted: 28,
      hoursWorked: 42.5,
      location: "Downtown",
      overtime: 2.5,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      status: "active",
      currentJob: "Electrical Inspection - Mall Plaza",
      efficiency: 96.8,
      jobsCompleted: 31,
      hoursWorked: 40.0,
      location: "Midtown",
      overtime: 0,
    },
    {
      id: 3,
      name: "Mike Chen",
      status: "on-break",
      currentJob: null,
      efficiency: 88.5,
      jobsCompleted: 24,
      hoursWorked: 38.5,
      location: "Workshop",
      overtime: 1.5,
    },
    {
      id: 4,
      name: "Emma Wilson",
      status: "active",
      currentJob: "Emergency Plumbing - City Center",
      efficiency: 92.1,
      jobsCompleted: 26,
      hoursWorked: 41.0,
      location: "City Center",
      overtime: 3.0,
    },
  ];

  const overtimeClaims = [
    {
      id: 1,
      technician: "Emma Wilson",
      date: "2024-01-15",
      hours: 3.0,
      reason: "Emergency call extension",
      status: "pending",
    },
    {
      id: 2,
      technician: "John Smith",
      date: "2024-01-14",
      hours: 2.5,
      reason: "Complex installation",
      status: "pending",
    },
    {
      id: 3,
      technician: "Mike Chen",
      date: "2024-01-13",
      hours: 1.5,
      reason: "Equipment setup",
      status: "approved",
    },
  ];

  const jobReports = [
    {
      id: "J045",
      title: "HVAC System Overhaul",
      technician: "John Smith",
      status: "completed",
      duration: "4.5h",
      delay: null,
      customerRating: 5,
    },
    {
      id: "J046",
      title: "Electrical Panel Upgrade",
      technician: "Sarah Johnson",
      status: "delayed",
      duration: "6.2h",
      delay: "2h",
      customerRating: null,
    },
    {
      id: "J047",
      title: "Emergency Leak Repair",
      technician: "Emma Wilson",
      status: "completed",
      duration: "2.8h",
      delay: null,
      customerRating: 4,
    },
  ];

  const unassignedJobs = [
    {
      id: "J048",
      title: "Routine Maintenance Check",
      priority: "medium",
      location: "Industrial Park",
      estimatedTime: "2h",
      skills: ["HVAC", "General"],
    },
    {
      id: "J049",
      title: "Electrical Safety Inspection",
      priority: "high",
      location: "Hospital Complex",
      estimatedTime: "3h",
      skills: ["Electrical", "Safety"],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "on-break":
        return "bg-warning text-warning-foreground";
      case "offline":
        return "bg-muted text-muted-foreground";
      case "completed":
        return "bg-success text-success-foreground";
      case "delayed":
        return "bg-destructive text-destructive-foreground";
      case "pending":
        return "bg-info text-info-foreground";
      case "approved":
        return "bg-success text-success-foreground";
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
      {/* Team Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Status</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {teamStats.activeTechnicians}/{teamStats.totalTechnicians}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-success" />
              <span>
                {Math.round(
                  (teamStats.activeTechnicians / teamStats.totalTechnicians) *
                    100,
                )}
                % active
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.avgEfficiency}%</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-success" />
              <span>+3.2% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Today</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.completedJobs}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>{teamStats.pendingJobs} pending</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${teamStats.departmentRevenue.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-success" />
              <span>This month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="team" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="team">Live Team</TabsTrigger>
          <TabsTrigger value="jobs">Job Reports</TabsTrigger>
          <TabsTrigger value="overtime">Overtime</TabsTrigger>
          <TabsTrigger value="unassigned">Unassigned</TabsTrigger>
          <TabsTrigger value="controls">Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Real-Time Team Status</span>
                <Button variant="outline" size="sm">
                  <Activity className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {technicians.map((tech) => (
                  <div
                    key={tech.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{tech.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(tech.status)}>
                            {tech.status}
                          </Badge>
                          {tech.currentJob && (
                            <p className="text-sm text-muted-foreground">
                              {tech.currentJob}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                          Efficiency
                        </p>
                        <p className="font-semibold text-success">
                          {tech.efficiency}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Jobs</p>
                        <p className="font-semibold">{tech.jobsCompleted}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Hours</p>
                        <p className="font-semibold">{tech.hoursWorked}h</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                          Location
                        </p>
                        <p className="font-semibold flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {tech.location}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Completion & Delay Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobReports.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{job.id}</Badge>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                        {job.delay && (
                          <Badge className="bg-destructive text-destructive-foreground">
                            +{job.delay} delay
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        Technician: {job.technician}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                          Duration
                        </p>
                        <p className="font-semibold">{job.duration}</p>
                      </div>
                      {job.customerRating && (
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">
                            Rating
                          </p>
                          <p className="font-semibold text-warning">
                            {"★".repeat(job.customerRating)}
                          </p>
                        </div>
                      )}
                      <Button variant="outline" size="sm">
                        View Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Overtime Claims</span>
                <Button size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overtimeClaims.map((claim) => (
                  <div
                    key={claim.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{claim.technician}</h4>
                      <p className="text-sm text-muted-foreground">
                        {claim.reason}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {claim.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Hours</p>
                        <p className="font-semibold">{claim.hours}h</p>
                      </div>
                      <Badge className={getStatusColor(claim.status)}>
                        {claim.status}
                      </Badge>
                      {claim.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Reject
                          </Button>
                          <Button size="sm">Approve</Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="unassigned" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unassigned Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {unassignedJobs.map((job) => (
                  <div
                    key={job.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{job.id}</Badge>
                        <Badge className={getPriorityColor(job.priority)}>
                          {job.priority}
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.location}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center">
                          <Timer className="h-3 w-3 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {job.estimatedTime}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          {job.skills.map((skill) => (
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
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">Assign</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="controls" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Role Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Assign Coordinator Roles
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Modify Technician Roles
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Set Default Dashboards
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  View All Submitted Jobs
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Moderate H&S Reports
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  Fleet Status Overview
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
