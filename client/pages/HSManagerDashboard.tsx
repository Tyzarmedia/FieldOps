import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Camera,
  FileText,
  Users,
  Clock,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Eye,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Bell,
  BarChart3,
  Settings,
  RefreshCw,
  XCircle,
  Wrench,
  HardHat,
  UserCheck,
  ClipboardList,
  TrendingUp,
  Award,
  Archive,
  BookOpen,
  Star,
  Target,
} from "lucide-react";

export default function HSManagerDashboard() {
  const [activeSection, setActiveSection] = useState("main");
  const [selectedIncidentType, setSelectedIncidentType] = useState("");

  const safetyStats = {
    activeIncidents: 2,
    complianceScore: 95.2,
    completedChecks: 58,
    ppeCompliance: 98,
    photosUploaded: 134,
    riskAssessments: 42,
    trainingExpiries: 7,
    auditsCompleted: 12,
    safetyAlerts: 3,
    totalEmployees: 74,
    certificationsValid: 89,
  };

  const incidents = [
    {
      id: "INC001",
      type: "Minor Injury",
      location: "Downtown Office Building",
      technician: "John Smith",
      reportedBy: "Mike Wilson",
      date: "2024-01-20",
      time: "14:30",
      severity: "Low",
      status: "Open",
      description: "Cut on hand while handling cable, first aid applied",
      witness: "Sarah Johnson",
      bodyPart: "Hand",
      immediateAction: "First aid applied, wound cleaned and bandaged",
      followUpRequired: true,
    },
    {
      id: "INC002",
      type: "Near Miss",
      location: "Industrial Warehouse",
      technician: "Emma Wilson",
      reportedBy: "Emma Wilson",
      date: "2024-01-19",
      time: "10:15",
      severity: "Medium",
      status: "In Progress",
      description:
        "Ladder slipped while working at height, no injury sustained",
      witness: "David Brown",
      bodyPart: "None",
      immediateAction: "Stopped work, checked ladder condition",
      followUpRequired: true,
    },
    {
      id: "INC003",
      type: "Hazard",
      location: "Retail Store",
      technician: "Mike Chen",
      reportedBy: "Store Manager",
      date: "2024-01-18",
      time: "16:45",
      severity: "High",
      status: "Closed",
      description: "Exposed electrical wiring discovered during installation",
      witness: "Store Staff",
      bodyPart: "None",
      immediateAction: "Area cordoned off, power isolated",
      followUpRequired: false,
    },
  ];

  const riskAssessments = [
    {
      id: "JRA001",
      jobId: "J087",
      technician: "John Smith",
      jobType: "Fiber Installation",
      location: "High-rise Office Building",
      submittedDate: "2024-01-20",
      status: "Approved",
      riskLevel: "Medium",
      hazards: ["Working at Height", "Electrical", "Manual Handling"],
      controlMeasures: ["Safety harness", "Electrical isolation", "Team lift"],
      approvedBy: "Safety Manager",
      validUntil: "2024-01-27",
    },
    {
      id: "JRA002",
      jobId: "J089",
      technician: "Sarah Johnson",
      jobType: "Network Repair",
      location: "Underground Facility",
      submittedDate: "2024-01-19",
      status: "Pending",
      riskLevel: "High",
      hazards: ["Confined Space", "Chemical Exposure", "Electrical"],
      controlMeasures: ["Gas monitor", "PPE", "Permit required"],
      approvedBy: null,
      validUntil: null,
    },
    {
      id: "JRA003",
      jobId: "J091",
      technician: "Mike Chen",
      jobType: "Equipment Maintenance",
      location: "Factory Floor",
      submittedDate: "2024-01-18",
      status: "Revision Required",
      riskLevel: "Low",
      hazards: ["Noise", "Moving Machinery"],
      controlMeasures: ["Hearing protection", "Lockout/tagout"],
      approvedBy: null,
      validUntil: null,
    },
  ];

  const ppeCompliance = [
    {
      id: 1,
      technician: "John Smith",
      jobId: "J087",
      date: "2024-01-20",
      hardHat: true,
      safetyVest: true,
      gloves: true,
      safetyBoots: true,
      eyeProtection: true,
      complianceScore: 100,
      photoUploaded: true,
      notes: "All PPE in good condition",
    },
    {
      id: 2,
      technician: "Sarah Johnson",
      jobId: "J089",
      date: "2024-01-19",
      hardHat: true,
      safetyVest: true,
      gloves: false,
      safetyBoots: true,
      eyeProtection: true,
      complianceScore: 80,
      photoUploaded: true,
      notes: "Gloves missing - issued replacement",
    },
    {
      id: 3,
      technician: "Mike Chen",
      jobId: "J091",
      date: "2024-01-18",
      hardHat: true,
      safetyVest: false,
      gloves: true,
      safetyBoots: true,
      eyeProtection: false,
      complianceScore: 60,
      photoUploaded: false,
      notes: "Multiple PPE items missing",
    },
  ];

  const safetyAudits = [
    {
      id: "AUD001",
      site: "Downtown Office",
      auditor: "Safety Manager",
      date: "2024-01-15",
      score: 87,
      status: "Completed",
      findings: 3,
      criticalIssues: 0,
      recommendations: [
        "Improve cable management",
        "Update emergency exits signage",
      ],
      nextAudit: "2024-04-15",
    },
    {
      id: "AUD002",
      site: "Industrial Warehouse",
      auditor: "External Auditor",
      date: "2024-01-10",
      score: 72,
      status: "Action Required",
      findings: 7,
      criticalIssues: 2,
      recommendations: [
        "Repair damaged flooring",
        "Install additional lighting",
      ],
      nextAudit: "2024-02-10",
    },
    {
      id: "AUD003",
      site: "Retail Complex",
      auditor: "Safety Manager",
      date: "2024-01-08",
      score: 94,
      status: "Passed",
      findings: 1,
      criticalIssues: 0,
      recommendations: ["Minor housekeeping improvements"],
      nextAudit: "2024-07-08",
    },
  ];

  const trainingRecords = [
    {
      id: 1,
      technician: "John Smith",
      course: "Working at Heights",
      completedDate: "2023-06-15",
      expiryDate: "2024-06-15",
      certificateNumber: "WAH-2023-001",
      status: "Valid",
      provider: "SafetyFirst Training",
      daysToExpiry: 146,
    },
    {
      id: 2,
      technician: "Sarah Johnson",
      course: "First Aid",
      completedDate: "2023-03-20",
      expiryDate: "2024-03-20",
      certificateNumber: "FA-2023-045",
      status: "Expiring Soon",
      provider: "MedTrain Institute",
      daysToExpiry: 59,
    },
    {
      id: 3,
      technician: "Mike Chen",
      course: "Confined Space Entry",
      completedDate: "2022-11-10",
      expiryDate: "2023-11-10",
      certificateNumber: "CSE-2022-089",
      status: "Expired",
      provider: "Industrial Safety Corp",
      daysToExpiry: -72,
    },
    {
      id: 4,
      technician: "Emma Wilson",
      course: "Fire Safety",
      completedDate: "2023-09-05",
      expiryDate: "2024-09-05",
      certificateNumber: "FS-2023-156",
      status: "Valid",
      provider: "Fire Safety Academy",
      daysToExpiry: 228,
    },
  ];

  const safetyAlerts = [
    {
      id: "SA001",
      title: "Extreme Heat Warning",
      message:
        "Temperature expected to exceed 35°C. Increase water breaks and monitor for heat stress.",
      type: "Weather",
      priority: "High",
      issuedDate: "2024-01-20",
      targetDepartments: ["All"],
      readBy: 45,
      totalRecipients: 74,
      status: "Active",
    },
    {
      id: "SA002",
      title: "PPE Equipment Recall",
      message:
        "Batch #2024-A safety harnesses recalled due to defective buckles. Return immediately.",
      type: "Equipment",
      priority: "Critical",
      issuedDate: "2024-01-18",
      targetDepartments: ["Installation", "Maintenance"],
      readBy: 28,
      totalRecipients: 32,
      status: "Active",
    },
    {
      id: "SA003",
      title: "COVID-19 Protocol Update",
      message: "Updated health screening procedures effective immediately.",
      type: "Health",
      priority: "Medium",
      issuedDate: "2024-01-15",
      targetDepartments: ["All"],
      readBy: 74,
      totalRecipients: 74,
      status: "Acknowledged",
    },
  ];

  const checklistTemplates = [
    {
      id: "CHK001",
      name: "PPE Checklist",
      category: "Personal Protective Equipment",
      items: [
        "Hard Hat",
        "Safety Vest",
        "Gloves",
        "Safety Boots",
        "Eye Protection",
      ],
      applicableJobs: ["Installation", "Maintenance", "Repair"],
      lastUpdated: "2024-01-15",
      version: "v2.1",
    },
    {
      id: "CHK002",
      name: "Site Inspection",
      category: "Workplace Safety",
      items: [
        "Emergency Exits",
        "Fire Equipment",
        "First Aid Kit",
        "Hazard Signs",
        "Lighting",
      ],
      applicableJobs: ["All"],
      lastUpdated: "2024-01-10",
      version: "v1.8",
    },
    {
      id: "CHK003",
      name: "Post-Incident Review",
      category: "Incident Management",
      items: [
        "Immediate Cause",
        "Root Cause",
        "Corrective Actions",
        "Prevention Measures",
      ],
      applicableJobs: ["Incident Response"],
      lastUpdated: "2024-01-05",
      version: "v1.3",
    },
  ];

  useEffect(() => {
    // Load safety data
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
      case "pending":
      case "active":
        return "bg-warning text-warning-foreground";
      case "in progress":
      case "action required":
        return "bg-info text-info-foreground";
      case "closed":
      case "completed":
      case "passed":
      case "acknowledged":
        return "bg-success text-success-foreground";
      case "approved":
      case "valid":
        return "bg-success text-success-foreground";
      case "revision required":
        return "bg-warning text-warning-foreground";
      case "expired":
        return "bg-destructive text-destructive-foreground";
      case "expiring soon":
        return "bg-orange-500 text-white";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-info text-info-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const renderMainDashboard = () => (
    <div className="space-y-6">
      {/* Quick Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Active Incidents
                </p>
                <p className="text-2xl font-bold text-warning">
                  {safetyStats.activeIncidents}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Compliance Score
                </p>
                <p className="text-2xl font-bold text-success">
                  {safetyStats.complianceScore}%
                </p>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Safety Checks</p>
                <p className="text-2xl font-bold text-primary">
                  {safetyStats.completedChecks}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">PPE Compliance</p>
                <p className="text-2xl font-bold text-success">
                  {safetyStats.ppeCompliance}%
                </p>
              </div>
              <HardHat className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Safety Photos</p>
                <p className="text-2xl font-bold text-info">
                  {safetyStats.photosUploaded}
                </p>
              </div>
              <Camera className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Risk Assessments
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {safetyStats.riskAssessments}
                </p>
              </div>
              <ClipboardList className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("incidents")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-500 p-4 rounded-2xl">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Incident Reporting
            </h3>
            <p className="text-sm text-gray-600">
              {safetyStats.activeIncidents} active incidents
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("jra")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-500 p-4 rounded-2xl">
                <ClipboardList className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Job Risk Assessment
            </h3>
            <p className="text-sm text-gray-600">
              {safetyStats.riskAssessments} assessments this month
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("ppe")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-500 p-4 rounded-2xl">
                <HardHat className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">PPE Compliance</h3>
            <p className="text-sm text-gray-600">
              {safetyStats.ppeCompliance}% compliance rate
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("audits")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-500 p-4 rounded-2xl">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Safety Audits</h3>
            <p className="text-sm text-gray-600">
              {safetyStats.auditsCompleted} audits completed
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("training")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-500 p-4 rounded-2xl">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Training Records
            </h3>
            <p className="text-sm text-gray-600">
              {safetyStats.trainingExpiries} expiring soon
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("alerts")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-500 p-4 rounded-2xl">
                <Bell className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Safety Alerts</h3>
            <p className="text-sm text-gray-600">
              {safetyStats.safetyAlerts} active alerts
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("checklists")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-cyan-500 p-4 rounded-2xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Safety Checklists
            </h3>
            <p className="text-sm text-gray-600">Manage safety templates</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("compliance")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-500 p-4 rounded-2xl">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Compliance Stats
            </h3>
            <p className="text-sm text-gray-600">
              {safetyStats.complianceScore}% overall score
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("reports")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-500 p-4 rounded-2xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Reports & Export
            </h3>
            <p className="text-sm text-gray-600">Generate safety reports</p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("settings")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-slate-500 p-4 rounded-2xl">
                <Settings className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">
              Settings & Notifications
            </h3>
            <p className="text-sm text-gray-600">Configure safety alerts</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderIncidentReporting = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Incident Reporting & Tracking</h2>
        <div className="flex space-x-2">
          <Select
            value={selectedIncidentType}
            onValueChange={setSelectedIncidentType}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              <SelectItem value="Minor Injury">Minor Injury</SelectItem>
              <SelectItem value="Major Injury">Major Injury</SelectItem>
              <SelectItem value="Near Miss">Near Miss</SelectItem>
              <SelectItem value="Hazard">Hazard</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Report Incident
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {incidents.map((incident) => (
          <Card key={incident.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{incident.id}</Badge>
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity}
                    </Badge>
                    <Badge variant="secondary">{incident.type}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {incident.description}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Location:</p>
                      <p>{incident.location}</p>
                    </div>
                    <div>
                      <p className="font-medium">Technician:</p>
                      <p>{incident.technician}</p>
                    </div>
                    <div>
                      <p className="font-medium">Date & Time:</p>
                      <p>
                        {incident.date} at {incident.time}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Reported By:</p>
                      <p>{incident.reportedBy}</p>
                    </div>
                    <div>
                      <p className="font-medium">Witness:</p>
                      <p>{incident.witness}</p>
                    </div>
                    <div>
                      <p className="font-medium">Body Part:</p>
                      <p>{incident.bodyPart}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">Immediate Action:</p>
                      <p>{incident.immediateAction}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Update Status
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photos
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                {incident.followUpRequired && (
                  <Button size="sm">
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule Follow-up
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderRiskAssessments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Job Risk Assessment</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {riskAssessments.map((jra) => (
          <Card key={jra.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{jra.id}</Badge>
                    <Badge className={getStatusColor(jra.status)}>
                      {jra.status}
                    </Badge>
                    <Badge className={getSeverityColor(jra.riskLevel)}>
                      {jra.riskLevel} Risk
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{jra.jobType}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Job ID:</p>
                      <p>{jra.jobId}</p>
                    </div>
                    <div>
                      <p className="font-medium">Technician:</p>
                      <p>{jra.technician}</p>
                    </div>
                    <div>
                      <p className="font-medium">Location:</p>
                      <p>{jra.location}</p>
                    </div>
                    <div>
                      <p className="font-medium">Submitted:</p>
                      <p>{jra.submittedDate}</p>
                    </div>
                    <div>
                      <p className="font-medium">Approved By:</p>
                      <p>{jra.approvedBy || "Pending"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Valid Until:</p>
                      <p>{jra.validUntil || "N/A"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">Hazards:</p>
                      <p>{jra.hazards.join(", ")}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">Control Measures:</p>
                      <p>{jra.controlMeasures.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Review Assessment
                </Button>
                {jra.status === "Pending" && (
                  <>
                    <Button size="sm" className="bg-success">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-warning"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Request Revision
                    </Button>
                  </>
                )}
                {jra.status === "Revision Required" && (
                  <Button size="sm" className="bg-warning">
                    <Edit className="h-4 w-4 mr-2" />
                    Review Revision
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  View Evidence
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPPECompliance = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">PPE Compliance Tracking</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Log PPE Check
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {ppeCompliance.map((record) => (
          <Card key={record.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-lg">
                      {record.technician}
                    </h3>
                    <Badge variant="outline">{record.jobId}</Badge>
                    <Badge
                      className={
                        record.complianceScore >= 80
                          ? "bg-success text-success-foreground"
                          : "bg-warning text-warning-foreground"
                      }
                    >
                      {record.complianceScore}% Compliance
                    </Badge>
                    {record.photoUploaded && (
                      <Badge variant="secondary">
                        <Camera className="h-3 w-3 mr-1" />
                        Photo
                      </Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3">
                    <div className="flex items-center space-x-2">
                      <HardHat
                        className={`h-5 w-5 ${record.hardHat ? "text-success" : "text-destructive"}`}
                      />
                      <span
                        className={`text-sm ${record.hardHat ? "text-success" : "text-destructive"}`}
                      >
                        Hard Hat: {record.hardHat ? "✓" : "✗"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield
                        className={`h-5 w-5 ${record.safetyVest ? "text-success" : "text-destructive"}`}
                      />
                      <span
                        className={`text-sm ${record.safetyVest ? "text-success" : "text-destructive"}`}
                      >
                        Safety Vest: {record.safetyVest ? "✓" : "✗"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm ${record.gloves ? "text-success" : "text-destructive"}`}
                      >
                        👥 Gloves: {record.gloves ? "✓" : "✗"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm ${record.safetyBoots ? "text-success" : "text-destructive"}`}
                      >
                        👢 Safety Boots: {record.safetyBoots ? "✓" : "✗"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-sm ${record.eyeProtection ? "text-success" : "text-destructive"}`}
                      >
                        👓 Eye Protection: {record.eyeProtection ? "✓" : "✗"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 text-sm text-muted-foreground">
                    <p>
                      <strong>Date:</strong> {record.date}
                    </p>
                    <p>
                      <strong>Notes:</strong> {record.notes}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Photo
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Update Record
                </Button>
                {record.complianceScore < 100 && (
                  <Button size="sm" className="bg-warning">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Issue PPE
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTrainingRecords = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Training Records</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Records
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Training
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {trainingRecords.map((record) => (
          <Card key={record.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-lg">
                      {record.technician}
                    </h3>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                    {record.daysToExpiry <= 30 && record.daysToExpiry > 0 && (
                      <Badge className="bg-warning text-warning-foreground">
                        Expires in {record.daysToExpiry} days
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-medium text-md mb-3">{record.course}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Completed:</p>
                      <p>{record.completedDate}</p>
                    </div>
                    <div>
                      <p className="font-medium">Expires:</p>
                      <p>{record.expiryDate}</p>
                    </div>
                    <div>
                      <p className="font-medium">Certificate #:</p>
                      <p>{record.certificateNumber}</p>
                    </div>
                    <div>
                      <p className="font-medium">Provider:</p>
                      <p>{record.provider}</p>
                    </div>
                    <div>
                      <p className="font-medium">Days to Expiry:</p>
                      <p
                        className={
                          record.daysToExpiry < 0
                            ? "text-destructive font-bold"
                            : record.daysToExpiry <= 30
                              ? "text-warning font-bold"
                              : ""
                        }
                      >
                        {record.daysToExpiry < 0
                          ? `Expired ${Math.abs(record.daysToExpiry)} days ago`
                          : `${record.daysToExpiry} days`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Certificate
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Certificate
                </Button>
                {(record.status === "Expired" ||
                  record.status === "Expiring Soon") && (
                  <Button size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Renewal
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSafetyAlerts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Safety Alerts & Notices</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Bell className="h-4 w-4 mr-2" />
            New Alert
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {safetyAlerts.map((alert) => (
          <Card key={alert.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{alert.id}</Badge>
                    <Badge className={getSeverityColor(alert.priority)}>
                      {alert.priority}
                    </Badge>
                    <Badge className={getStatusColor(alert.status)}>
                      {alert.status}
                    </Badge>
                    <Badge variant="secondary">{alert.type}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{alert.title}</h3>
                  <p className="text-muted-foreground mb-3">{alert.message}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Issued Date:</p>
                      <p>{alert.issuedDate}</p>
                    </div>
                    <div>
                      <p className="font-medium">Target Departments:</p>
                      <p>{alert.targetDepartments.join(", ")}</p>
                    </div>
                    <div>
                      <p className="font-medium">Read Status:</p>
                      <p>
                        {alert.readBy}/{alert.totalRecipients} (
                        {Math.round(
                          (alert.readBy / alert.totalRecipients) * 100,
                        )}
                        %)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Recipients
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Alert
                </Button>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Resend
                </Button>
                {alert.status === "Active" && (
                  <Button size="sm">
                    <XCircle className="h-4 w-4 mr-2" />
                    Archive Alert
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "incidents":
        return renderIncidentReporting();
      case "jra":
        return renderRiskAssessments();
      case "ppe":
        return renderPPECompliance();
      case "audits":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Safety Audits</h2>
            <div className="space-y-4">
              {safetyAudits.map((audit) => (
                <Card
                  key={audit.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{audit.id}</Badge>
                          <Badge className={getStatusColor(audit.status)}>
                            {audit.status}
                          </Badge>
                          <Badge
                            className={
                              audit.score >= 80
                                ? "bg-success text-success-foreground"
                                : audit.score >= 60
                                  ? "bg-warning text-warning-foreground"
                                  : "bg-destructive text-destructive-foreground"
                            }
                          >
                            Score: {audit.score}%
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg">{audit.site}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-sm text-muted-foreground">
                          <div>
                            <p className="font-medium">Auditor:</p>
                            <p>{audit.auditor}</p>
                          </div>
                          <div>
                            <p className="font-medium">Date:</p>
                            <p>{audit.date}</p>
                          </div>
                          <div>
                            <p className="font-medium">Findings:</p>
                            <p>
                              {audit.findings} ({audit.criticalIssues} critical)
                            </p>
                          </div>
                          <div>
                            <p className="font-medium">Next Audit:</p>
                            <p>{audit.nextAudit}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="font-medium">Recommendations:</p>
                            <p>{audit.recommendations.join(", ")}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "training":
        return renderTrainingRecords();
      case "alerts":
        return renderSafetyAlerts();
      case "checklists":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Safety Checklist Templates</h2>
            <div className="space-y-4">
              {checklistTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline">{template.id}</Badge>
                          <Badge variant="secondary">{template.version}</Badge>
                          <Badge className="bg-primary text-primary-foreground">
                            {template.category}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg">
                          {template.name}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-sm text-muted-foreground">
                          <div>
                            <p className="font-medium">Items:</p>
                            <p>{template.items.join(", ")}</p>
                          </div>
                          <div>
                            <p className="font-medium">Applicable Jobs:</p>
                            <p>{template.applicableJobs.join(", ")}</p>
                          </div>
                          <div>
                            <p className="font-medium">Last Updated:</p>
                            <p>{template.lastUpdated}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "compliance":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Compliance & Statistics</h2>
            <p className="text-muted-foreground">
              Compliance tracking and analytics coming soon...
            </p>
          </div>
        );
      case "reports":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Reports & Exports</h2>
            <p className="text-muted-foreground">
              Safety report generation coming soon...
            </p>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings & Notifications</h2>
            <p className="text-muted-foreground">
              Safety configuration settings coming soon...
            </p>
          </div>
        );
      default:
        return renderMainDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Health & Safety Manager Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive safety management, compliance tracking, and incident
              reporting
            </p>
          </div>
          {activeSection !== "main" && (
            <Button variant="outline" onClick={() => setActiveSection("main")}>
              ← Back to Dashboard
            </Button>
          )}
        </div>
      </div>

      {renderSection()}
    </div>
  );
}
