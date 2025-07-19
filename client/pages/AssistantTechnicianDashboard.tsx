import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  ClipboardList,
  User,
  MapPin,
  Timer,
  CheckCircle,
  Camera,
  FileText,
  AlertCircle,
  Info,
  Package,
  Truck,
  Shield,
} from "lucide-react";

export default function AssistantTechnicianDashboard() {
  const [clockedIn, setClockedIn] = useState(true);
  const [workingHours, setWorkingHours] = useState("6h 45m");

  const assistingJobs = [
    {
      id: "J061",
      title: "Complex HVAC Installation",
      leadTechnician: "John Smith",
      status: "in-progress",
      location: "Downtown Office Complex",
      priority: "high",
      myRole: "Tool assistance & documentation",
      progress: 65,
      nextStep: "Prepare electrical connections",
      canComplete: false,
    },
    {
      id: "J062",
      title: "Industrial Equipment Maintenance",
      leadTechnician: "Sarah Johnson",
      status: "pending",
      location: "Manufacturing Plant",
      priority: "medium",
      myRole: "Safety monitoring & checklist",
      progress: 0,
      nextStep: "Wait for lead technician",
      canComplete: false,
    },
    {
      id: "J063",
      title: "Emergency Electrical Repair",
      leadTechnician: "Mike Chen",
      status: "completed",
      location: "Hospital Emergency Wing",
      priority: "urgent",
      myRole: "Equipment support",
      progress: 100,
      nextStep: "Job completed",
      canComplete: false,
    },
  ];

  const availableTools = [
    { name: "Digital Multimeter", available: true, location: "Van #247" },
    { name: "Pipe Wrench Set", available: true, location: "Toolbox A" },
    { name: "Safety Harness", available: false, location: "In use by Team 3" },
    { name: "Thermal Camera", available: true, location: "Equipment Room" },
  ];

  const todaySchedule = [
    {
      time: "09:00",
      activity: "Assist with HVAC Installation",
      lead: "John Smith",
      status: "in-progress",
    },
    {
      time: "13:30",
      activity: "Equipment Maintenance Support",
      lead: "Sarah Johnson",
      status: "upcoming",
    },
    {
      time: "15:45",
      activity: "Safety Documentation Review",
      lead: "Emma Wilson",
      status: "upcoming",
    },
  ];

  const recentPhotos = [
    {
      id: 1,
      job: "J061",
      description: "Pre-installation setup",
      timestamp: "10:30 AM",
    },
    {
      id: 2,
      job: "J061",
      description: "Electrical connections",
      timestamp: "11:45 AM",
    },
    {
      id: 3,
      job: "J063",
      description: "Completed repair",
      timestamp: "Yesterday 3:20 PM",
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
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Assistant Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Time Tracking</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${clockedIn ? "bg-success" : "bg-muted"} mb-4`}
              >
                <Clock
                  className={`h-8 w-8 ${clockedIn ? "text-success-foreground" : "text-muted-foreground"}`}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {clockedIn ? "Supporting Team" : "Available"}
              </p>
            </div>
            {clockedIn && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Working Hours Today
                </p>
                <p className="text-lg font-semibold">{workingHours}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ClipboardList className="h-5 w-5" />
              <span>Assignment Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">2</p>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">5</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-info">8</p>
                <p className="text-sm text-muted-foreground">Photos Taken</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">3</p>
                <p className="text-sm text-muted-foreground">Checklists</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="assignments" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assignments">My Assignments</TabsTrigger>
          <TabsTrigger value="tools">Tools & Resources</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-4">
          <div className="space-y-4">
            {assistingJobs.map((job) => (
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
                      </div>
                      <h4 className="font-semibold text-foreground">
                        {job.title}
                      </h4>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          Lead: {job.leadTechnician}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.location}
                        </div>
                      </div>
                      <div className="mt-2 p-2 bg-info/10 border border-info/20 rounded-lg">
                        <p className="text-sm text-info-foreground">
                          <strong>My Role:</strong> {job.myRole}
                        </p>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-muted-foreground">
                          <strong>Next Step:</strong> {job.nextStep}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="font-semibold text-lg">{job.progress}%</p>
                    </div>
                  </div>

                  {job.progress > 0 && (
                    <div className="mb-3">
                      <Progress value={job.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {job.status === "in-progress" && (
                      <>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Camera className="h-4 w-4 mr-2" />
                          Take Photo
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <FileText className="h-4 w-4 mr-2" />
                          Update Progress
                        </Button>
                      </>
                    )}
                    {job.status === "pending" && (
                      <Button size="sm" variant="outline" className="w-full">
                        <Info className="h-4 w-4 mr-2" />
                        View Assignment Details
                      </Button>
                    )}
                    {job.status === "completed" && (
                      <Button size="sm" variant="outline" className="w-full">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        View Completion Report
                      </Button>
                    )}
                  </div>

                  {!job.canComplete && (
                    <div className="mt-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      <AlertCircle className="h-3 w-3 inline mr-1" />
                      Note: Only lead technician can complete this job
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableTools.map((tool, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div>
                        <h5 className="font-medium">{tool.name}</h5>
                        <p className="text-sm text-muted-foreground">
                          {tool.location}
                        </p>
                      </div>
                      <Badge
                        className={
                          tool.available
                            ? "bg-success text-success-foreground"
                            : "bg-warning text-warning-foreground"
                        }
                      >
                        {tool.available ? "Available" : "In Use"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  View Available Stock
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Truck className="h-4 w-4 mr-2" />
                  Fleet Status
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Safety Guidelines
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Training Materials
                </Button>
              </CardContent>
            </Card>
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
                          Lead: {item.lead}
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

        <TabsContent value="documentation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div>
                        <h5 className="font-medium">{photo.description}</h5>
                        <p className="text-sm text-muted-foreground">
                          Job {photo.job} • {photo.timestamp}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documentation Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-info/10 border border-info/20 rounded-lg">
                  <h5 className="font-medium text-info-foreground">
                    Photo Requirements
                  </h5>
                  <ul className="text-sm text-info-foreground mt-2 space-y-1">
                    <li>• Before and after shots</li>
                    <li>• Clear view of equipment/area</li>
                    <li>• Include safety measures</li>
                  </ul>
                </div>
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <h5 className="font-medium text-warning-foreground">
                    Documentation Notes
                  </h5>
                  <ul className="text-sm text-warning-foreground mt-2 space-y-1">
                    <li>• Record observations accurately</li>
                    <li>• Note any safety concerns</li>
                    <li>• Document tool usage</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
