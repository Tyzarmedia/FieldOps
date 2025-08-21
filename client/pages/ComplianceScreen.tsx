import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  AlertTriangle,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  X,
} from "lucide-react";

interface Vehicle {
  vehicle_id: number;
  plate_number: string;
  make: string;
  model: string;
  year: number;
  status: string;
  compliance: {
    license_expiry: string;
    insurance_expiry: string;
    roadworthy_expiry: string;
    registration_expiry: string;
  };
}

interface ComplianceAlert {
  vehicleId: number;
  plateNumber: string;
  documentType: string;
  expiryDate: string;
  daysUntilExpiry: number;
  severity: "critical" | "warning" | "normal";
}

export default function ComplianceScreen() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>(
    [],
  );
  const [editingVehicle, setEditingVehicle] = useState<number | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [selectedTab, setSelectedTab] = useState("overview");

  // Load AVIS database
  useEffect(() => {
    const loadAvisData = async () => {
      try {
        const response = await fetch("/data/avis-database.json");
        const data = await response.json();
        setVehicles(data.vehicles);
        generateComplianceAlerts(data.vehicles);
      } catch (error) {
        console.error("Failed to load AVIS database:", error);
      }
    };

    loadAvisData();
  }, []);

  const generateComplianceAlerts = (vehicleData: Vehicle[]) => {
    const alerts: ComplianceAlert[] = [];
    const today = new Date();
    const twoMonthsFromNow = new Date();
    twoMonthsFromNow.setMonth(today.getMonth() + 2);

    vehicleData.forEach((vehicle) => {
      const complianceTypes = [
        { key: "license_expiry", name: "License" },
        { key: "insurance_expiry", name: "Insurance" },
        { key: "roadworthy_expiry", name: "Roadworthy" },
        { key: "registration_expiry", name: "Registration" },
      ];

      complianceTypes.forEach((type) => {
        const expiryDate = new Date(
          vehicle.compliance[type.key as keyof typeof vehicle.compliance],
        );
        const daysUntilExpiry = Math.ceil(
          (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        if (daysUntilExpiry <= 60) {
          // Alert 2 months before expiry
          let severity: "critical" | "warning" | "normal" = "normal";

          if (daysUntilExpiry <= 0) {
            severity = "critical"; // Expired
          } else if (daysUntilExpiry <= 30) {
            severity = "critical"; // Expires within 30 days
          } else if (daysUntilExpiry <= 60) {
            severity = "warning"; // Expires within 60 days
          }

          alerts.push({
            vehicleId: vehicle.vehicle_id,
            plateNumber: vehicle.plate_number,
            documentType: type.name,
            expiryDate:
              vehicle.compliance[type.key as keyof typeof vehicle.compliance],
            daysUntilExpiry,
            severity,
          });
        }
      });
    });

    // Sort alerts by severity and days until expiry
    alerts.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, normal: 2 };
      if (severityOrder[a.severity] !== severityOrder[b.severity]) {
        return severityOrder[a.severity] - severityOrder[b.severity];
      }
      return a.daysUntilExpiry - b.daysUntilExpiry;
    });

    setComplianceAlerts(alerts);
  };

  const updateComplianceDate = (
    vehicleId: number,
    documentType: string,
    newExpiryDate: string,
  ) => {
    const updatedVehicles = vehicles.map((vehicle) => {
      if (vehicle.vehicle_id === vehicleId) {
        const fieldMap: { [key: string]: keyof typeof vehicle.compliance } = {
          License: "license_expiry",
          Insurance: "insurance_expiry",
          Roadworthy: "roadworthy_expiry",
          Registration: "registration_expiry",
        };

        const field = fieldMap[documentType];
        if (field) {
          return {
            ...vehicle,
            compliance: {
              ...vehicle.compliance,
              [field]: newExpiryDate,
            },
          };
        }
      }
      return vehicle;
    });

    setVehicles(updatedVehicles);
    generateComplianceAlerts(updatedVehicles);

    // Reset editing state
    setEditingVehicle(null);
    setEditingField(null);
    setNewDate("");
  };

  const startEditing = (
    vehicleId: number,
    field: string,
    currentDate: string,
  ) => {
    setEditingVehicle(vehicleId);
    setEditingField(field);
    setNewDate(currentDate);
  };

  const cancelEditing = () => {
    setEditingVehicle(null);
    setEditingField(null);
    setNewDate("");
  };

  const saveEdit = () => {
    if (editingVehicle && editingField && newDate) {
      updateComplianceDate(editingVehicle, editingField, newDate);
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getComplianceStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysUntilExpiry <= 0) {
      return {
        status: "Expired",
        color: "bg-red-100 text-red-800",
        icon: <XCircle className="h-4 w-4" />,
      };
    } else if (daysUntilExpiry <= 30) {
      return {
        status: "Critical",
        color: "bg-red-100 text-red-800",
        icon: <AlertTriangle className="h-4 w-4" />,
      };
    } else if (daysUntilExpiry <= 60) {
      return {
        status: "Warning",
        color: "bg-yellow-100 text-yellow-800",
        icon: <AlertTriangle className="h-4 w-4" />,
      };
    } else {
      return {
        status: "Valid",
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle className="h-4 w-4" />,
      };
    }
  };

  const calculateComplianceRate = () => {
    const totalDocuments = vehicles.length * 4; // 4 compliance documents per vehicle
    const validDocuments = vehicles.reduce((count, vehicle) => {
      const docs = [
        vehicle.compliance.license_expiry,
        vehicle.compliance.insurance_expiry,
        vehicle.compliance.roadworthy_expiry,
        vehicle.compliance.registration_expiry,
      ];

      return (
        count +
        docs.filter((date) => {
          const daysUntilExpiry = Math.ceil(
            (new Date(date).getTime() - new Date().getTime()) /
              (1000 * 60 * 60 * 24),
          );
          return daysUntilExpiry > 0;
        }).length
      );
    }, 0);

    return totalDocuments > 0
      ? Math.round((validDocuments / totalDocuments) * 100)
      : 0;
  };

  const complianceRate = calculateComplianceRate();
  const criticalAlerts = complianceAlerts.filter(
    (alert) => alert.severity === "critical",
  ).length;
  const warningAlerts = complianceAlerts.filter(
    (alert) => alert.severity === "warning",
  ).length;

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Fleet Compliance
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage vehicle compliance documents and expiry dates
          </p>
        </div>
      </div>

      {/* Compliance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Compliance Rate
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-2xl font-bold text-blue-600">
                    {complianceRate}%
                  </span>
                </div>
                <Progress value={complianceRate} className="mt-2" />
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Critical Alerts
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-2xl font-bold text-red-600">
                    {criticalAlerts}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Requires immediate attention
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Warning Alerts
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-2xl font-bold text-yellow-600">
                    {warningAlerts}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Expiring within 60 days
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Vehicles
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-2xl font-bold text-green-600">
                    {vehicles.length}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Fleet size</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="vehicles">All Vehicles</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Critical Alerts */}
          {complianceAlerts.filter((alert) => alert.severity === "critical")
            .length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  Critical Compliance Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceAlerts
                    .filter((alert) => alert.severity === "critical")
                    .slice(0, 5)
                    .map((alert, index) => (
                      <Alert key={index} className="border-red-200 bg-red-50">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <AlertDescription>
                          <div className="flex justify-between items-center">
                            <span>
                              <strong>{alert.plateNumber}</strong> -{" "}
                              {alert.documentType}
                              {alert.daysUntilExpiry <= 0
                                ? " has expired"
                                : ` expires in ${alert.daysUntilExpiry} days`}
                            </span>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  Renew Now
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Renew {alert.documentType}</DialogTitle>
                                  <DialogDescription>
                                    Update the expiry date for {alert.plateNumber} - {alert.documentType}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="renewal-date">New Expiry Date</Label>
                                    <Input
                                      id="renewal-date"
                                      type="date"
                                      min={new Date().toISOString().split('T')[0]}
                                      onChange={(e) => setNewDate(e.target.value)}
                                    />
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setNewDate("")}>
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        if (newDate) {
                                          updateComplianceDate(alert.vehicleId, alert.documentType, newDate);
                                        }
                                      }}
                                      disabled={!newDate}
                                    >
                                      Update
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Warning Alerts */}
          {complianceAlerts.filter((alert) => alert.severity === "warning")
            .length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-600">
                  <AlertTriangle className="h-5 w-5" />
                  Upcoming Renewals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceAlerts
                    .filter((alert) => alert.severity === "warning")
                    .slice(0, 5)
                    .map((alert, index) => (
                      <Alert
                        key={index}
                        className="border-yellow-200 bg-yellow-50"
                      >
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <AlertDescription>
                          <div className="flex justify-between items-center">
                            <span>
                              <strong>{alert.plateNumber}</strong> -{" "}
                              {alert.documentType} expires in{" "}
                              {alert.daysUntilExpiry} days
                            </span>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  Schedule Renewal
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Schedule Renewal for {alert.documentType}</DialogTitle>
                                  <DialogDescription>
                                    Schedule a reminder for {alert.plateNumber} - {alert.documentType} renewal
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="reminder-date">Reminder Date</Label>
                                    <Input
                                      id="reminder-date"
                                      type="date"
                                      min={new Date().toISOString().split('T')[0]}
                                      onChange={(e) => setNewDate(e.target.value)}
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="renewal-type">Renewal Type</Label>
                                    <Select>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select renewal type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="maintenance">Maintenance Service</SelectItem>
                                        <SelectItem value="inspection">Inspection Booking</SelectItem>
                                        <SelectItem value="document">Document Renewal</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setNewDate("")}>
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        if (newDate) {
                                          // Create reminder/scheduling logic here
                                          alert("Renewal reminder scheduled successfully!");
                                          setNewDate("");
                                        }
                                      }}
                                      disabled={!newDate}
                                    >
                                      Schedule
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </AlertDescription>
                      </Alert>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Compliance Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {complianceAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${getAlertColor(alert.severity)}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getAlertIcon(alert.severity)}
                        <div>
                          <h4 className="font-medium">{alert.plateNumber}</h4>
                          <p className="text-sm">
                            {alert.documentType} -
                            {alert.daysUntilExpiry <= 0
                              ? " Expired"
                              : ` Expires in ${alert.daysUntilExpiry} days`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {new Date(alert.expiryDate).toLocaleDateString()}
                        </div>
                        <Badge
                          className={
                            alert.severity === "critical"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vehicles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Insurance</TableHead>
                    <TableHead>Roadworthy</TableHead>
                    <TableHead>Registration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.vehicle_id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {vehicle.plate_number}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </div>
                        </div>
                      </TableCell>
                      {[
                        { key: "license_expiry", name: "License" },
                        { key: "insurance_expiry", name: "Insurance" },
                        { key: "roadworthy_expiry", name: "Roadworthy" },
                        { key: "registration_expiry", name: "Registration" },
                      ].map((docType) => {
                        const date =
                          vehicle.compliance[
                            docType.key as keyof typeof vehicle.compliance
                          ];
                        const status = getComplianceStatus(date);
                        const isEditing =
                          editingVehicle === vehicle.vehicle_id &&
                          editingField === docType.name;

                        return (
                          <TableCell key={docType.key}>
                            <div className="space-y-2">
                              {isEditing ? (
                                <div className="flex items-center space-x-2">
                                  <Input
                                    type="date"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    className="w-32"
                                  />
                                  <Button size="sm" onClick={saveEdit}>
                                    <Save className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={cancelEditing}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between">
                                  <div>
                                    <div className="text-sm">
                                      {new Date(date).toLocaleDateString()}
                                    </div>
                                    <Badge className={status.color}>
                                      <div className="flex items-center gap-1">
                                        {status.icon}
                                        {status.status}
                                      </div>
                                    </Badge>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      startEditing(
                                        vehicle.vehicle_id,
                                        docType.name,
                                        date,
                                      )
                                    }
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
