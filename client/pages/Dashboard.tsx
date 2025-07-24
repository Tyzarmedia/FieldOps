import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  ClipboardList,
  Truck,
  Shield,
  Package,
  MapPin,
  Timer,
  CheckCircle,
  AlertCircle,
  Plus,
  Navigation,
} from "lucide-react";

export default function Dashboard() {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState("8:34 AM");
  const [workingHours, setWorkingHours] = useState("7h 23m");

  const jobs = [
    {
      id: "J001",
      title: "HVAC System Maintenance",
      location: "123 Main St, Downtown",
      priority: "high",
      type: "maintenance",
      status: "in-progress",
      estimatedTime: "2h 30m",
      progress: 45,
    },
    {
      id: "J002",
      title: "Electrical Panel Inspection",
      location: "456 Oak Ave, Midtown",
      priority: "medium",
      type: "inspection",
      status: "pending",
      estimatedTime: "1h 15m",
      progress: 0,
    },
    {
      id: "J003",
      title: "Emergency Plumbing Repair",
      location: "789 Pine St, Uptown",
      priority: "urgent",
      type: "emergency",
      status: "assigned",
      estimatedTime: "3h 00m",
      progress: 0,
    },
  ];

  const fleetTasks = [
    {
      id: "F001",
      title: "Vehicle Daily Inspection",
      vehicle: "Van #247",
      status: "pending",
      dueTime: "Start of Shift",
    },
    {
      id: "F002",
      title: "Fuel Level Check",
      vehicle: "Van #247",
      status: "completed",
      dueTime: "Completed",
    },
  ];

  const safetyTasks = [
    {
      id: "S001",
      title: "PPE Compliance Check",
      status: "pending",
      category: "safety",
    },
    {
      id: "S002",
      title: "Incident Report Review",
      status: "completed",
      category: "incident",
    },
  ];

  const handleClockToggle = () => {
    setClockedIn(!clockedIn);
    if (!clockedIn) {
      setClockTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-success text-success-foreground";
      case "in-progress":
        return "bg-primary text-primary-foreground";
      case "assigned":
        return "bg-info text-info-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Clock In/Out */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
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
              <p className="text-2xl font-bold mb-1">{clockTime}</p>
              <p className="text-sm text-muted-foreground">
                {clockedIn ? "Clocked In" : "Clocked Out"}
              </p>
            </div>
            <Button
              onClick={handleClockToggle}
              className={`w-full ${clockedIn ? "bg-destructive hover:bg-destructive/90" : "bg-success hover:bg-success/90"}`}
            >
              {clockedIn ? "Clock Out" : "Clock In"}
            </Button>
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
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <ClipboardList className="h-5 w-5" />
                <span>Today's Overview</span>
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">3</p>
                <p className="text-sm text-muted-foreground">Active Jobs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">2</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">1</p>
                <p className="text-sm text-muted-foreground">Urgent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-info">45km</p>
                <p className="text-sm text-muted-foreground">Distance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="jobs" className="flex items-center space-x-2">
            <ClipboardList className="h-4 w-4" />
            <span className="hidden sm:inline">My Jobs</span>
          </TabsTrigger>
          <TabsTrigger value="fleet" className="flex items-center space-x-2">
            <Truck className="h-4 w-4" />
            <span className="hidden sm:inline">Fleet</span>
          </TabsTrigger>
          <TabsTrigger value="safety" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Safety</span>
          </TabsTrigger>
          <TabsTrigger value="stock" className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Stock</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">My Jobs</h3>
            <Button variant="outline" size="sm">
              <Navigation className="h-4 w-4 mr-2" />
              Optimize Route
            </Button>
          </div>
          <div className="space-y-4">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {job.id}
                        </Badge>
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
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {job.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Timer className="h-3 w-3 mr-1" />
                        {job.estimatedTime}
                      </p>
                    </div>
                  </div>
                  {job.progress > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">
                          Progress
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {job.progress}%
                        </span>
                      </div>
                      <Progress value={job.progress} className="h-2" />
                    </div>
                  )}
                  <div className="flex space-x-2">
                    {job.status === "pending" && (
                      <Button size="sm" className="flex-1">
                        Accept Job
                      </Button>
                    )}
                    {job.status === "assigned" && (
                      <Button size="sm" className="flex-1">
                        Start Job
                      </Button>
                    )}
                    {job.status === "in-progress" && (
                      <>
                        <Button size="sm" variant="outline" className="flex-1">
                          Update Progress
                        </Button>
                        <Button size="sm" className="flex-1">
                          Complete Job
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fleet" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Fleet Tasks</h3>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Inspection
            </Button>
          </div>
          <div className="space-y-4">
            {fleetTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {task.vehicle}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {task.dueTime}
                      </p>
                    </div>
                  </div>
                  {task.status === "pending" && (
                    <Button size="sm" className="mt-3 w-full">
                      Start Inspection
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="safety" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Safety Tasks</h3>
            <Button variant="outline" size="sm">
              <AlertCircle className="h-4 w-4 mr-2" />
              Report Incident
            </Button>
          </div>
          <div className="space-y-4">
            {safetyTasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{task.title}</h4>
                      <p className="text-sm text-muted-foreground capitalize">
                        {task.category}
                      </p>
                    </div>
                    <Badge className={getStatusColor(task.status)}>
                      {task.status}
                    </Badge>
                  </div>
                  {task.status === "pending" && (
                    <Button size="sm" className="mt-3 w-full">
                      Complete Check
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stock" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Stock Management</h3>
            <Button variant="outline" size="sm">
              <Package className="h-4 w-4 mr-2" />
              Request Stock
            </Button>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border border-border rounded-lg">
                  <p className="text-lg font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Filters</p>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <p className="text-lg font-bold">8</p>
                  <p className="text-sm text-muted-foreground">Pipes</p>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <p className="text-lg font-bold">25</p>
                  <p className="text-sm text-muted-foreground">Screws</p>
                </div>
                <div className="text-center p-4 border border-border rounded-lg">
                  <p className="text-lg font-bold">6</p>
                  <p className="text-sm text-muted-foreground">Tools</p>
                </div>
              </div>
              <Button className="w-full mt-4">View Full Inventory</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
