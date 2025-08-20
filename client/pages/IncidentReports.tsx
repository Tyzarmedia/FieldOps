import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  Search,
  Filter,
  Download,
  Eye,
  MoreVertical,
  Clock,
  User,
  MapPin,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface IncidentReport {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "investigating" | "resolved" | "closed";
  reportedBy: string;
  reportedDate: string;
  assignedTo?: string;
  location: string;
  category: "vehicle" | "equipment" | "safety" | "environmental" | "security";
  vehicleId?: string;
  attachments: string[];
  priority: number;
}

export default function IncidentReports() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // Mock incident reports data
  const incidentReports: IncidentReport[] = [
    {
      id: "INC-2025-001",
      title: "Vehicle Engine Overheating",
      description:
        "Vehicle EL-123-ABC experienced engine overheating during route inspection. Temperature gauge showed critical levels.",
      severity: "high",
      status: "investigating",
      reportedBy: "John Smith",
      reportedDate: "2025-01-15T10:30:00Z",
      assignedTo: "Mike Wilson",
      location: "Route 45, Johannesburg",
      category: "vehicle",
      vehicleId: "EL-123-ABC",
      attachments: ["engine_photo.jpg", "temperature_reading.pdf"],
      priority: 1,
    },
    {
      id: "INC-2025-002",
      title: "Safety Equipment Missing",
      description:
        "First aid kit missing from toolbox during routine inspection. Kit was last seen during previous shift.",
      severity: "medium",
      status: "open",
      reportedBy: "Sarah Johnson",
      reportedDate: "2025-01-14T14:15:00Z",
      location: "Equipment Storage, Site B",
      category: "safety",
      attachments: ["empty_compartment.jpg"],
      priority: 2,
    },
    {
      id: "INC-2025-003",
      title: "Fiber Optic Cable Damage",
      description:
        "Accidental damage to fiber optic cable during excavation work. Service interruption reported in sector 7.",
      severity: "critical",
      status: "resolved",
      reportedBy: "David Brown",
      reportedDate: "2025-01-13T09:45:00Z",
      assignedTo: "Lisa Chen",
      location: "Sector 7, Pretoria",
      category: "equipment",
      attachments: ["cable_damage.jpg", "repair_report.pdf"],
      priority: 1,
    },
    {
      id: "INC-2025-004",
      title: "Minor Vehicle Collision",
      description:
        "Vehicle EL-124-DEF had minor collision with stationary object while reversing. No injuries reported.",
      severity: "low",
      status: "closed",
      reportedBy: "Mike Wilson",
      reportedDate: "2025-01-12T16:20:00Z",
      assignedTo: "Nancy Dube",
      location: "Client Site, Cape Town",
      category: "vehicle",
      vehicleId: "EL-124-DEF",
      attachments: ["collision_photo.jpg", "insurance_form.pdf"],
      priority: 3,
    },
    {
      id: "INC-2025-005",
      title: "Unauthorized Site Access",
      description:
        "Unknown personnel observed near equipment storage area during off-hours. Security footage available.",
      severity: "medium",
      status: "investigating",
      reportedBy: "Security Team",
      reportedDate: "2025-01-11T22:30:00Z",
      assignedTo: "Robert Garcia",
      location: "Main Facility, Durban",
      category: "security",
      attachments: ["security_footage.mp4"],
      priority: 2,
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "destructive";
      case "investigating":
        return "secondary";
      case "resolved":
        return "default";
      case "closed":
        return "outline";
      default:
        return "outline";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "vehicle":
        return "🚗";
      case "equipment":
        return "⚙️";
      case "safety":
        return "🦺";
      case "environmental":
        return "🌍";
      case "security":
        return "🔒";
      default:
        return "📋";
    }
  };

  const filteredReports = incidentReports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity =
      !selectedSeverity ||
      selectedSeverity === "all" ||
      report.severity === selectedSeverity;
    const matchesStatus =
      !selectedStatus ||
      selectedStatus === "all" ||
      report.status === selectedStatus;
    const matchesTab =
      selectedTab === "all" ||
      (selectedTab === "open" &&
        ["open", "investigating"].includes(report.status)) ||
      (selectedTab === "resolved" &&
        ["resolved", "closed"].includes(report.status)) ||
      (selectedTab === "high-priority" &&
        ["critical", "high"].includes(report.severity));

    return matchesSearch && matchesSeverity && matchesStatus && matchesTab;
  });

  const formatDate = (dateString: string) => {
    return (
      new Date(dateString).toLocaleDateString() +
      " " +
      new Date(dateString).toLocaleTimeString()
    );
  };

  const openCount = incidentReports.filter((r) =>
    ["open", "investigating"].includes(r.status),
  ).length;
  const resolvedCount = incidentReports.filter((r) =>
    ["resolved", "closed"].includes(r.status),
  ).length;
  const highPriorityCount = incidentReports.filter((r) =>
    ["critical", "high"].includes(r.severity),
  ).length;

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Incident Reports
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage all incident reports submitted by technicians
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{incidentReports.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Open/Investigating
                </p>
                <p className="text-2xl font-bold text-red-600">{openCount}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolved/Closed</p>
                <p className="text-2xl font-bold text-green-600">
                  {resolvedCount}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">
                  {highPriorityCount}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Tabs */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search incidents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList>
            <TabsTrigger value="all">
              All Reports ({incidentReports.length})
            </TabsTrigger>
            <TabsTrigger value="open">Open ({openCount})</TabsTrigger>
            <TabsTrigger value="resolved">
              Resolved ({resolvedCount})
            </TabsTrigger>
            <TabsTrigger value="high-priority">
              High Priority ({highPriorityCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            {filteredReports.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No incident reports found
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <Card
                    key={report.id}
                    className="border-l-4"
                    style={{
                      borderLeftColor:
                        getSeverityColor(report.severity) === "bg-red-500"
                          ? "#ef4444"
                          : getSeverityColor(report.severity) ===
                              "bg-orange-500"
                            ? "#f97316"
                            : getSeverityColor(report.severity) ===
                                "bg-yellow-500"
                              ? "#eab308"
                              : "#22c55e",
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-lg">
                              {getCategoryIcon(report.category)}
                            </span>
                            <h3 className="text-lg font-semibold">
                              {report.title}
                            </h3>
                            <Badge variant={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                            <Badge
                              className={
                                getSeverityColor(report.severity) +
                                " text-white"
                              }
                            >
                              {report.severity}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-4">
                            {report.description}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>Reported by: {report.reportedBy}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>{formatDate(report.reportedDate)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{report.location}</span>
                            </div>
                            {report.assignedTo && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>Assigned to: {report.assignedTo}</span>
                              </div>
                            )}
                          </div>

                          {report.attachments.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm font-medium mb-2">
                                Attachments:
                              </p>
                              <div className="flex gap-2">
                                {report.attachments.map((attachment, index) => (
                                  <Badge key={index} variant="outline">
                                    📎 {attachment}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <User className="h-4 w-4 mr-2" />
                              Assign Investigator
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="h-4 w-4 mr-2" />
                              Update Status
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Export Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
