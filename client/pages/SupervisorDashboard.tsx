import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  ClipboardList,
  Clock,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertTriangle,
  Timer,
  Eye,
  UserCheck,
  Settings,
  FileText,
  Calendar,
  MapPin,
  User,
  Phone,
  Plus,
  Edit,
  Trash2,
  Send,
} from "lucide-react";

export default function SupervisorDashboard() {
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [systemData, setSystemData] = useState<any>(null);

  const supervisorStats = {
    teamSize: 8,
    activeTeam: 7,
    onBreak: 1,
    jobsToday: 18,
    completedJobs: 14,
    overdueJobs: 2,
    teamEfficiency: 92.5,
    avgResponseTime: "15min",
    customerRating: 4.3,
    emergencyCallouts: 3,
  };

  const myTeam = [
    {
      id: 1,
      name: "John Smith",
      role: "Senior Technician",
      status: "active",
      currentJob: "HVAC Installation - Office Complex",
      location: "Downtown",
      efficiency: 94.2,
      hoursWorked: 6.5,
      todayJobs: 3,
      skills: ["HVAC", "Electrical", "Plumbing"],
      phone: "+1 (555) 123-4567",
      emergencyContact: "+1 (555) 987-6543",
      certifications: ["Safety Level 3", "HVAC Advanced"],
      nextBreak: "14:00",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Technician",
      status: "active",
      currentJob: "Network Setup - Business Center",
      location: "Midtown",
      efficiency: 89.7,
      hoursWorked: 5.8,
      todayJobs: 2,
      skills: ["Network", "General Maintenance"],
      phone: "+1 (555) 234-5678",
      emergencyContact: "+1 (555) 876-5432",
      certifications: ["Network Basic", "Safety Level 2"],
      nextBreak: "15:30",
    },
    {
      id: 3,
      name: "Mike Chen",
      role: "Assistant Technician",
      status: "on-break",
      currentJob: null,
      location: "Workshop",
      efficiency: 85.3,
      hoursWorked: 4.2,
      todayJobs: 1,
      skills: ["General", "Documentation"],
      phone: "+1 (555) 345-6789",
      emergencyContact: "+1 (555) 765-4321",
      certifications: ["Safety Level 1"],
      nextBreak: "Break until 14:30",
    },
  ];

  const activeJobs = [
    {
      id: "J051",
      title: "Emergency Power Restoration",
      technician: "John Smith",
      priority: "urgent",
      status: "in-progress",
      location: "Hospital District",
      startTime: "11:30",
      estimatedCompletion: "14:00",
      progress: 65,
      customerContact: "Dr. Wilson",
      customerPhone: "+1 (555) 111-2222",
      notes: "Priority customer - critical infrastructure",
    },
    {
      id: "J052",
      title: "Fiber Optic Cable Installation",
      technician: "Sarah Johnson",
      priority: "high",
      status: "in-progress",
      location: "Business District",
      startTime: "09:00",
      estimatedCompletion: "16:00",
      progress: 40,
      customerContact: "Tech Corp",
      customerPhone: "+1 (555) 333-4444",
      notes: "Large installation - needs careful planning",
    },
    {
      id: "J053",
      title: "Routine Maintenance Check",
      technician: "Mike Chen",
      priority: "medium",
      status: "scheduled",
      location: "Residential Complex",
      startTime: "14:30",
      estimatedCompletion: "16:30",
      progress: 0,
      customerContact: "Property Manager",
      customerPhone: "+1 (555) 555-6666",
      notes: "Standard maintenance - no rush",
    },
  ];

  const todaySchedule = [
    {
      time: "08:00",
      activity: "Team Brief & Safety Check",
      type: "meeting",
      status: "completed",
      attendees: 8,
    },
    {
      time: "09:00",
      activity: "Job Assignments",
      type: "coordination",
      status: "completed",
      attendees: 8,
    },
    {
      time: "12:00",
      activity: "Team Check-in",
      type: "coordination",
      status: "upcoming",
      attendees: 8,
    },
    {
      time: "16:00",
      activity: "End of Day Review",
      type: "meeting",
      status: "scheduled",
      attendees: 8,
    },
  ];

  const teamPerformance = [
    {
      period: "This Week",
      jobsCompleted: 67,
      efficiency: 92.5,
      customerRating: 4.3,
      targetMet: true,
    },
    {
      period: "Last Week",
      jobsCompleted: 72,
      efficiency: 89.8,
      customerRating: 4.1,
      targetMet: true,
    },
    {
      period: "This Month",
      jobsCompleted: 245,
      efficiency: 91.2,
      customerRating: 4.2,
      targetMet: true,
    },
  ];

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    try {
      const response = await fetch("/data/database.json");
      const data = await response.json();
      setSystemData(data);
    } catch (error) {
      console.error("Failed to load system data:", error);
    }
  };

  const handleAssignJob = (technicianId: number) => {
    alert(`Assigning new job to technician ${technicianId}`);
  };

  const handleCallTechnician = (phone: string, name: string) => {
    alert(`Calling ${name} at ${phone}`);
  };

  const handleEmergencyContact = (phone: string, name: string) => {
    alert(`Calling emergency contact for ${name} at ${phone}`);
  };

  const handleJobStatusUpdate = (jobId: string) => {
    alert(`Updating status for job ${jobId}`);
  };

  const handleViewJobDetails = (job: any) => {
    alert(`Viewing details for ${job.title}`);
  };

  const handleTeamMeeting = () => {
    alert("Starting team meeting...");
  };

  const handleGenerateReport = (type: string) => {
    alert(`Generating ${type} report...`);
  };

  const handleManageTechnician = (technician: any, action: string) => {
    alert(`${action} for ${technician.name}`);
  };

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
      case "in-progress":
        return "bg-primary text-primary-foreground";
      case "scheduled":
        return "bg-info text-info-foreground";
      case "overdue":
        return "bg-destructive text-destructive-foreground";
      case "upcoming":
        return "bg-info text-info-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-warning text-warning-foreground";
      case "medium":
        return "bg-info text-info-foreground";
      case "low":
        return "bg-success text-success-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Supervisor Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Status</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supervisorStats.activeTeam}/{supervisorStats.teamSize}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-success" />
              <span>
                {Math.round(
                  (supervisorStats.activeTeam / supervisorStats.teamSize) * 100,
                )}
                % active
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Jobs</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supervisorStats.jobsToday}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>{supervisorStats.completedJobs} completed</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Team Efficiency
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supervisorStats.teamEfficiency}%
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-success" />
              <span>Above target (90%)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {supervisorStats.avgResponseTime}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 text-success" />
              <span>Avg response time</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="team" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="team">My Team</TabsTrigger>
          <TabsTrigger value="jobs">Active Jobs</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Team Management</h3>
            <Button size="sm" onClick={handleTeamMeeting}>
              <Users className="h-4 w-4 mr-2" />
              Team Meeting
            </Button>
          </div>

          <div className="space-y-4">
            {myTeam.map((technician) => (
              <Card
                key={technician.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getStatusColor(technician.status)}>
                          {technician.status}
                        </Badge>
                        <Badge variant="outline">{technician.role}</Badge>
                        <Badge
                          className={
                            technician.efficiency >= 90
                              ? "bg-success text-success-foreground"
                              : technician.efficiency >= 80
                                ? "bg-info text-info-foreground"
                                : "bg-warning text-warning-foreground"
                          }
                        >
                          {technician.efficiency}% efficiency
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">
                        {technician.name}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {technician.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {technician.hoursWorked}h worked
                        </div>
                        <div className="flex items-center">
                          <ClipboardList className="h-3 w-3 mr-1" />
                          {technician.todayJobs} jobs today
                        </div>
                      </div>
                      {technician.currentJob && (
                        <div className="p-2 bg-primary/10 border border-primary/20 rounded-lg mb-3">
                          <p className="text-sm font-medium text-primary-foreground">
                            Current: {technician.currentJob}
                          </p>
                        </div>
                      )}
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Skills:</span>{" "}
                        {technician.skills.join(", ")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Certifications:</span>{" "}
                        {technician.certifications.join(", ")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Next Break:</span>{" "}
                        {technician.nextBreak}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        handleCallTechnician(technician.phone, technician.name)
                      }
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAssignJob(technician.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Assign Job
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        handleManageTechnician(technician, "View Details")
                      }
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        handleEmergencyContact(
                          technician.emergencyContact,
                          technician.name,
                        )
                      }
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Emergency
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Active Jobs</h3>
            <Button
              size="sm"
              onClick={() => handleGenerateReport("Job Status")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Job Report
            </Button>
          </div>

          <div className="space-y-4">
            {activeJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{job.id}</Badge>
                        <Badge className={getPriorityColor(job.priority)}>
                          {job.priority}
                        </Badge>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">
                        {job.title}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {job.technician}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {job.startTime} - {job.estimatedCompletion}
                        </div>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">
                            Progress
                          </span>
                          <span className="text-sm font-medium">
                            {job.progress}%
                          </span>
                        </div>
                        <Progress value={job.progress} className="h-2" />
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium">Customer:</span>{" "}
                        {job.customerContact} ({job.customerPhone})
                      </div>
                      {job.notes && (
                        <div className="p-2 bg-warning/10 border border-warning/20 rounded-lg">
                          <p className="text-sm text-warning-foreground">
                            <strong>Notes:</strong> {job.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleViewJobDetails(job)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleJobStatusUpdate(job.id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Update
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() =>
                        handleCallTechnician(
                          job.customerPhone,
                          job.customerContact,
                        )
                      }
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call Customer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {todaySchedule.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="font-semibold">{item.time}</div>
                      </div>
                      <div>
                        <h5 className="font-medium">{item.activity}</h5>
                        <p className="text-sm text-muted-foreground">
                          {item.type} • {item.attendees} people
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamPerformance.map((period, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold">{period.period}</h4>
                      <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Jobs:</span>
                          <p className="font-medium">{period.jobsCompleted}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Efficiency:
                          </span>
                          <p className="font-medium">{period.efficiency}%</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Rating:</span>
                          <p className="font-medium">
                            {period.customerRating}/5.0
                          </p>
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={
                        period.targetMet
                          ? "bg-success text-success-foreground"
                          : "bg-warning text-warning-foreground"
                      }
                    >
                      {period.targetMet ? "Target Met" : "Below Target"}
                    </Badge>
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
                <CardTitle>Team Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleGenerateReport("Team Performance")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Team Performance Report
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleGenerateReport("Job Completion")}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Job Completion Report
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleGenerateReport("Efficiency Analysis")}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Efficiency Analysis
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleGenerateReport("Customer Satisfaction")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Customer Satisfaction
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  onClick={() => handleGenerateReport("Daily Brief")}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Daily Brief
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={handleTeamMeeting}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Schedule Team Meeting
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleGenerateReport("Safety Check")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Safety Check Report
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  onClick={() => handleGenerateReport("Time Sheet")}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Review Time Sheets
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
