import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Truck,
  Fuel,
  Settings,
  AlertTriangle,
  CheckCircle,
  Calendar,
  MapPin,
  User,
  Clock,
  FileText,
  Plus,
  Eye,
  Wrench,
  Activity,
} from "lucide-react";

export default function FleetManagerDashboard() {
  const fleetStats = {
    totalVehicles: 24,
    activeVehicles: 20,
    inMaintenance: 2,
    availableVehicles: 2,
    complianceRate: 94.2,
    totalMileage: 15420,
    fuelEfficiency: 28.5,
    pendingInspections: 3,
  };

  const vehicles = [
    {
      id: "V001",
      name: "Van #247",
      type: "Service Van",
      assignedTo: "John Smith",
      status: "active",
      location: "Downtown Office",
      mileage: 45230,
      fuelLevel: 85,
      lastInspection: "2024-01-10",
      nextMaintenance: "2024-02-15",
      compliance: "good",
    },
    {
      id: "V002",
      name: "Truck #156",
      type: "Equipment Truck",
      assignedTo: "Sarah Johnson",
      status: "maintenance",
      location: "Workshop",
      mileage: 67890,
      fuelLevel: 60,
      lastInspection: "2024-01-05",
      nextMaintenance: "2024-01-20",
      compliance: "needs-attention",
    },
    {
      id: "V003",
      name: "Van #312",
      type: "Service Van",
      assignedTo: null,
      status: "available",
      location: "Base Yard",
      mileage: 32100,
      fuelLevel: 95,
      lastInspection: "2024-01-12",
      nextMaintenance: "2024-03-01",
      compliance: "excellent",
    },
  ];

  const inspectionJobs = [
    {
      id: "FJ001",
      vehicle: "Van #247",
      type: "Daily Safety Check",
      assignedTo: "John Smith",
      status: "pending",
      dueDate: "2024-01-16",
      priority: "normal",
    },
    {
      id: "FJ002",
      vehicle: "Truck #156",
      type: "Monthly Inspection",
      assignedTo: "Mike Chen",
      status: "overdue",
      dueDate: "2024-01-15",
      priority: "high",
    },
    {
      id: "FJ003",
      vehicle: "Van #312",
      type: "Equipment Check",
      assignedTo: "Emma Wilson",
      status: "completed",
      dueDate: "2024-01-14",
      priority: "normal",
    },
  ];

  const maintenanceAlerts = [
    {
      vehicle: "Truck #156",
      issue: "Oil change due",
      severity: "medium",
      dueDate: "2024-01-20",
    },
    {
      vehicle: "Van #189",
      issue: "Brake inspection required",
      severity: "high",
      dueDate: "2024-01-18",
    },
    {
      vehicle: "Van #247",
      issue: "Tire rotation scheduled",
      severity: "low",
      dueDate: "2024-01-25",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "maintenance":
        return "bg-warning text-warning-foreground";
      case "available":
        return "bg-info text-info-foreground";
      case "completed":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "overdue":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case "excellent":
        return "bg-success text-success-foreground";
      case "good":
        return "bg-info text-info-foreground";
      case "needs-attention":
        return "bg-warning text-warning-foreground";
      case "critical":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-destructive";
      case "medium":
        return "text-warning";
      case "low":
        return "text-info";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Fleet Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Status</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fleetStats.activeVehicles}/{fleetStats.totalVehicles}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-success" />
              <span>
                {Math.round(
                  (fleetStats.activeVehicles / fleetStats.totalVehicles) * 100,
                )}
                % operational
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fleetStats.complianceRate}%
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>Above target (90%)</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Fuel Efficiency
            </CardTitle>
            <Fuel className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fleetStats.fuelEfficiency} MPG
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Activity className="h-3 w-3 text-success" />
              <span>+2.1 from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fleetStats.pendingInspections}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 text-warning" />
              <span>Inspections due</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="fleet" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fleet">Fleet Overview</TabsTrigger>
          <TabsTrigger value="inspections">Inspections</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="fleet" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Vehicle Fleet</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>

          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <Card
                key={vehicle.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{vehicle.id}</Badge>
                        <Badge className={getStatusColor(vehicle.status)}>
                          {vehicle.status}
                        </Badge>
                        <Badge
                          className={getComplianceColor(vehicle.compliance)}
                        >
                          {vehicle.compliance}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">
                        {vehicle.name} ({vehicle.type})
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {vehicle.assignedTo || "Unassigned"}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {vehicle.location}
                        </div>
                        <div className="flex items-center">
                          <Activity className="h-3 w-3 mr-1" />
                          {vehicle.mileage.toLocaleString()} miles
                        </div>
                        <div className="flex items-center">
                          <Fuel className="h-3 w-3 mr-1" />
                          {vehicle.fuelLevel}% fuel
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Fuel Level
                      </p>
                      <Progress value={vehicle.fuelLevel} className="h-2" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        Next Maintenance
                      </p>
                      <p className="font-medium">{vehicle.nextMaintenance}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Inspection
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Wrench className="h-4 w-4 mr-2" />
                      Maintenance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="inspections" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Fleet Inspection Jobs</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Inspection
            </Button>
          </div>

          <div className="space-y-4">
            {inspectionJobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{job.id}</Badge>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                        {job.status === "overdue" && (
                          <Badge className="bg-destructive text-destructive-foreground">
                            OVERDUE
                          </Badge>
                        )}
                      </div>
                      <h4 className="font-semibold">{job.type}</h4>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Truck className="h-3 w-3 mr-1" />
                          {job.vehicle}
                        </div>
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {job.assignedTo}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due: {job.dueDate}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {job.status === "pending" && (
                        <Button size="sm">Assign Technician</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Maintenance Alerts</h3>
            <Button size="sm" variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
          </div>

          <div className="space-y-4">
            {maintenanceAlerts.map((alert, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={getSeverityColor(alert.severity)}>
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{alert.issue}</h4>
                        <p className="text-sm text-muted-foreground">
                          {alert.vehicle} • Due: {alert.dueDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        className={
                          alert.severity === "high"
                            ? "bg-destructive text-destructive-foreground"
                            : alert.severity === "medium"
                              ? "bg-warning text-warning-foreground"
                              : "bg-info text-info-foreground"
                        }
                      >
                        {alert.severity}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Schedule
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fleet Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Fleet Utilization Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Activity className="h-4 w-4 mr-2" />
                  Mileage Summary
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Fuel className="h-4 w-4 mr-2" />
                  Fuel Efficiency Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Compliance Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Fleet Inspection
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Inspection Calendar
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Wrench className="h-4 w-4 mr-2" />
                  Maintenance Schedule
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Fleet Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
