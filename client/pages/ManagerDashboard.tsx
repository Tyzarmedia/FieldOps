import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList,
  DollarSign,
  Users,
  TrendingUp,
  Building,
  Shield,
  Truck,
  Package,
  Settings,
  AlertTriangle,
  FileText,
  UserPlus,
  BarChart3,
  CheckCircle,
  Timer,
  Activity,
  Target,
  Gauge,
  PieChart,
  AlertCircle,
  Archive,
  Database,
  Globe,
  Zap,
  Wifi,
  Clock,
  Eye,
  Edit,
  XCircle,
  Calendar,
  MapPin,
  Phone,
} from "lucide-react";

export default function ManagerDashboard() {
  const [systemData, setSystemData] = useState<any>(null);
  const [activeSection, setActiveSection] = useState("main");

  const managerStats = {
    totalJobs: 1247,
    completedJobs: 1089,
    failedJobs: 23,
    activeJobs: 135,
    totalTechnicians: 45,
    activeTechnicians: 38,
    departments: 8,
    productivity: 87.3,
    revenue: 245000,
    targetRevenue: 280000,
    stockValue: 89500,
    fleetUtilization: 92.4,
    complianceScore: 95.2,
    criticalAlerts: 7,
    overdueMaintenace: 12,
    pendingReports: 5,
    activeUsers: 156,
    monthlyGrowth: 12.5,
    profitMargin: 30.2,
    customerSatisfaction: 94.8,
    onTimeDelivery: 96.3,
    networkAssessments: 23,
    pendingOvertimeClaims: 8,
    overtimeValue: 12450,
  };

  const networkAssessments = [
    {
      id: "NA001",
      technician: "John Smith",
      location: "Downtown Office Building",
      date: "2024-01-20",
      clientName: "TechCorp Ltd",
      assessmentType: "Network Infrastructure Audit",
      status: "Completed",
      findings: "Network upgrade recommended",
      priority: "Medium",
      estimatedCost: 15000,
      recommendedActions: ["Replace core switches", "Upgrade fiber backbone", "Implement redundancy"],
    },
    {
      id: "NA002",
      technician: "Sarah Johnson",
      location: "Industrial Complex",
      date: "2024-01-19",
      clientName: "Manufacturing Co",
      assessmentType: "Security Assessment",
      status: "In Progress",
      findings: "Critical security vulnerabilities found",
      priority: "High",
      estimatedCost: 25000,
      recommendedActions: ["Install firewall", "Update access controls", "Implement monitoring"],
    },
    {
      id: "NA003",
      technician: "Mike Chen",
      location: "Retail Chain",
      date: "2024-01-18",
      clientName: "ShopMart",
      assessmentType: "Performance Analysis",
      status: "Pending Review",
      findings: "Bandwidth limitations affecting operations",
      priority: "Medium",
      estimatedCost: 8000,
      recommendedActions: ["Increase bandwidth", "Optimize routing", "Add load balancing"],
    },
  ];

  const overtimeClaims = [
    {
      id: "OT001",
      employee: "John Smith",
      department: "Network Maintenance",
      coordinatorApproval: "Approved",
      coordinatorApprovedBy: "Mike Wilson",
      coordinatorApprovalDate: "2024-01-20",
      date: "2024-01-19",
      hours: 4,
      rate: "1.5x",
      amount: 450.00,
      justification: "Emergency fiber repair - client SLA requirement",
      jobReference: "J087",
      status: "Pending Manager Approval",
      submittedDate: "2024-01-20",
    },
    {
      id: "OT002",
      employee: "Sarah Johnson",
      department: "Installation",
      coordinatorApproval: "Approved",
      coordinatorApprovedBy: "Lisa Anderson",
      coordinatorApprovalDate: "2024-01-19",
      date: "2024-01-18",
      hours: 6,
      rate: "2.0x",
      amount: 720.00,
      justification: "Weekend emergency installation - power outage recovery",
      jobReference: "J089",
      status: "Pending Manager Approval",
      submittedDate: "2024-01-19",
    },
    {
      id: "OT003",
      employee: "Mike Chen",
      department: "Repair Services",
      coordinatorApproval: "Approved",
      coordinatorApprovedBy: "David Brown",
      coordinatorApprovalDate: "2024-01-18",
      date: "2024-01-17",
      hours: 3,
      rate: "1.5x",
      amount: 300.00,
      justification: "Equipment repair extended beyond normal hours",
      jobReference: "J091",
      status: "Manager Approved",
      submittedDate: "2024-01-18",
      managerApprovedBy: "Regional Manager",
      managerApprovalDate: "2024-01-19",
    },
    {
      id: "OT004",
      employee: "Emma Wilson",
      department: "Emergency Services",
      coordinatorApproval: "Rejected",
      coordinatorApprovedBy: "Safety Coordinator",
      coordinatorApprovalDate: "2024-01-17",
      date: "2024-01-16",
      hours: 8,
      rate: "2.0x",
      amount: 960.00,
      justification: "Non-emergency work scheduled during overtime",
      jobReference: "J093",
      status: "Coordinator Rejected",
      submittedDate: "2024-01-17",
      rejectionReason: "Work could have been scheduled during regular hours",
    },
  ];

  const dashboardCards = [
    {
      id: "jobs-overview",
      title: "Jobs Overview",
      icon: ClipboardList,
      color: "bg-blue-500",
      mainMetric: managerStats.totalJobs.toLocaleString(),
      subMetric: `${managerStats.completedJobs} completed`,
      description: "Total jobs with status breakdown",
      trend: "+8.2%",
      trendPositive: true,
    },
    {
      id: "financial-performance",
      title: "Financial Performance",
      icon: DollarSign,
      color: "bg-green-500",
      mainMetric: `$${managerStats.revenue.toLocaleString()}`,
      subMetric: `${Math.round((managerStats.revenue / managerStats.targetRevenue) * 100)}% of target`,
      description: "Monthly revenue and profit margins",
      trend: "+12.5%",
      trendPositive: true,
    },
    {
      id: "hr-snapshot",
      title: "Human Resource Snapshot",
      icon: Users,
      color: "bg-purple-500",
      mainMetric: managerStats.activeTechnicians.toString(),
      subMetric: `of ${managerStats.totalTechnicians} total staff`,
      description: "Active staff by role and availability",
      trend: "+3 new",
      trendPositive: true,
    },
    {
      id: "productivity-metrics",
      title: "Productivity Metrics",
      icon: TrendingUp,
      color: "bg-orange-500",
      mainMetric: `${managerStats.productivity}%`,
      subMetric: "Above company average",
      description: "Productivity trends and efficiency",
      trend: "+2.1%",
      trendPositive: true,
    },
    {
      id: "departmental-performance",
      title: "Departmental Performance",
      icon: Building,
      color: "bg-cyan-500",
      mainMetric: managerStats.departments.toString(),
      subMetric: "Active departments",
      description: "KPIs and performance by department",
      trend: "Stable",
      trendPositive: true,
    },
    {
      id: "compliance-center",
      title: "Compliance Center",
      icon: Shield,
      color: "bg-indigo-500",
      mainMetric: `${managerStats.complianceScore}%`,
      subMetric: "Compliance score",
      description: "SHEQ, labor law, and operational compliance",
      trend: "+1.2%",
      trendPositive: true,
    },
    {
      id: "fleet-operations",
      title: "Fleet Operations",
      icon: Truck,
      color: "bg-emerald-500",
      mainMetric: `${managerStats.fleetUtilization}%`,
      subMetric: "Fleet utilization",
      description: "Vehicle status and performance",
      trend: "+3.5%",
      trendPositive: true,
    },
    {
      id: "stock-assets",
      title: "Stock & Assets",
      icon: Package,
      color: "bg-pink-500",
      mainMetric: `$${managerStats.stockValue.toLocaleString()}`,
      subMetric: "Current stock value",
      description: "Inventory levels and asset tracking",
      trend: "-2.1%",
      trendPositive: false,
    },
    {
      id: "system-settings",
      title: "System Settings",
      icon: Settings,
      color: "bg-slate-500",
      mainMetric: managerStats.activeUsers.toString(),
      subMetric: "Active users",
      description: "User permissions and system config",
      trend: "+5 users",
      trendPositive: true,
    },
    {
      id: "critical-alerts",
      title: "Critical Alerts",
      icon: AlertTriangle,
      color: "bg-red-500",
      mainMetric: managerStats.criticalAlerts.toString(),
      subMetric: "Active alerts",
      description: "System incidents and job failures",
      trend: "-2 alerts",
      trendPositive: true,
    },
    {
      id: "reports-hub",
      title: "Reports Hub",
      icon: FileText,
      color: "bg-yellow-500",
      mainMetric: managerStats.pendingReports.toString(),
      subMetric: "Pending reports",
      description: "Generate and schedule reports",
      trend: "3 scheduled",
      trendPositive: true,
    },
    {
      id: "user-directory",
      title: "User Directory",
      icon: UserPlus,
      color: "bg-teal-500",
      mainMetric: managerStats.activeUsers.toString(),
      subMetric: "Total users",
      description: "User management and access control",
      trend: "+8% growth",
      trendPositive: true,
    },
    {
      id: "analytics-center",
      title: "Manager Analytics Center",
      icon: BarChart3,
      color: "bg-violet-500",
      mainMetric: "All KPIs",
      subMetric: "In one dashboard",
      description: "Comprehensive analytics and insights",
      trend: "Updated",
      trendPositive: true,
    },
    {
      id: "network-assessment",
      title: "Network Assessment Reports",
      icon: Wifi,
      color: "bg-blue-600",
      mainMetric: managerStats.networkAssessments.toString(),
      subMetric: "Assessments completed",
      description: "Network infrastructure evaluations",
      trend: "+5 this month",
      trendPositive: true,
    },
    {
      id: "overtime-management",
      title: "Overtime Management",
      icon: Clock,
      color: "bg-amber-500",
      mainMetric: managerStats.pendingOvertimeClaims.toString(),
      subMetric: "Pending approval",
      description: "Review and approve overtime claims",
      trend: `R${managerStats.overtimeValue.toLocaleString()}`,
      trendPositive: true,
    },
  ];

  const quickMetrics = [
    {
      title: "Jobs Completed Today",
      value: "47",
      icon: CheckCircle,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Active Technicians",
      value: managerStats.activeTechnicians.toString(),
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Monthly Revenue",
      value: `$${managerStats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Fleet Utilization",
      value: `${managerStats.fleetUtilization}%`,
      icon: Truck,
      color: "text-info",
      bgColor: "bg-info/10",
    },
    {
      title: "Compliance Score",
      value: `${managerStats.complianceScore}%`,
      icon: Shield,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Productivity",
      value: `${managerStats.productivity}%`,
      icon: TrendingUp,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  const priorityActions = [
    {
      title: "Review Overdue Jobs",
      description: "3 high-priority jobs are overdue",
      action: "Review Now",
      urgency: "High",
      icon: AlertTriangle,
    },
    {
      title: "Approve Overtime Requests",
      description: "8 overtime requests pending approval",
      action: "Review Requests",
      urgency: "Medium",
      icon: Timer,
    },
    {
      title: "Schedule Team Meeting",
      description: "Weekly department sync due",
      action: "Schedule",
      urgency: "Low",
      icon: Users,
    },
    {
      title: "Review Compliance Report",
      description: "Monthly compliance report ready",
      action: "Review",
      urgency: "Medium",
      icon: Shield,
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

  const handleCardAction = (cardId: string) => {
    switch (cardId) {
      case "network-assessment":
        setActiveSection("network-assessment");
        break;
      case "overtime-management":
        setActiveSection("overtime-management");
        break;
      case "jobs-overview":
        alert("Opening Jobs Overview dashboard with detailed job analytics...");
        break;
      case "financial-performance":
        alert(
          "Opening Financial Performance dashboard with revenue analytics...",
        );
        break;
      case "hr-snapshot":
        alert("Opening HR Snapshot with staff management tools...");
        break;
      case "productivity-metrics":
        alert("Opening Productivity Metrics with team efficiency data...");
        break;
      case "departmental-performance":
        alert("Opening Departmental Performance dashboard...");
        break;
      case "compliance-center":
        alert("Opening Compliance Center with audit and risk management...");
        break;
      case "fleet-operations":
        alert("Opening Fleet Operations dashboard...");
        break;
      case "stock-assets":
        alert("Opening Stock & Assets inventory management...");
        break;
      case "system-settings":
        alert("Opening System Settings and configuration...");
        break;
      case "critical-alerts":
        alert("Opening Critical Alerts monitoring dashboard...");
        break;
      case "reports-hub":
        alert("Opening Reports Hub for report generation...");
        break;
      case "user-directory":
        alert("Opening User Directory for user management...");
        break;
      case "analytics-center":
        alert(
          "Opening Manager Analytics Center with comprehensive insights...",
        );
        break;
      default:
        alert(`Opening ${cardId} dashboard...`);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "manager approved":
        return "bg-success text-success-foreground";
      case "in progress":
      case "pending manager approval":
        return "bg-warning text-warning-foreground";
      case "pending review":
        return "bg-info text-info-foreground";
      case "coordinator rejected":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const renderNetworkAssessment = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Network Assessment Reports</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Assessment
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {networkAssessments.map((assessment) => (
          <Card key={assessment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{assessment.id}</Badge>
                    <Badge className={getStatusColor(assessment.status)}>
                      {assessment.status}
                    </Badge>
                    <Badge className={getUrgencyColor(assessment.priority)}>
                      {assessment.priority}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{assessment.assessmentType}</h3>
                  <p className="text-muted-foreground mb-3">{assessment.clientName}</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Technician:</p>
                      <p>{assessment.technician}</p>
                    </div>
                    <div>
                      <p className="font-medium">Location:</p>
                      <p>{assessment.location}</p>
                    </div>
                    <div>
                      <p className="font-medium">Date:</p>
                      <p>{assessment.date}</p>
                    </div>
                    <div>
                      <p className="font-medium">Findings:</p>
                      <p>{assessment.findings}</p>
                    </div>
                    <div>
                      <p className="font-medium">Estimated Cost:</p>
                      <p className="font-bold">R{assessment.estimatedCost.toLocaleString()}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">Recommended Actions:</p>
                      <p>{assessment.recommendedActions.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Report
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Client
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderOvertimeManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Overtime Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Claims
          </Button>
          <Button variant="outline">
            <Timer className="h-4 w-4 mr-2" />
            Bulk Approve
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {overtimeClaims.map((claim) => (
          <Card key={claim.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{claim.id}</Badge>
                    <Badge className={getStatusColor(claim.status)}>
                      {claim.status}
                    </Badge>
                    <Badge variant="secondary">{claim.rate} Rate</Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{claim.employee}</h3>
                  <p className="text-muted-foreground mb-3">{claim.department}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Date:</p>
                      <p>{claim.date}</p>
                    </div>
                    <div>
                      <p className="font-medium">Hours:</p>
                      <p className="font-bold">{claim.hours}h</p>
                    </div>
                    <div>
                      <p className="font-medium">Amount:</p>
                      <p className="font-bold text-success">R{claim.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Job Reference:</p>
                      <p>{claim.jobReference}</p>
                    </div>
                    <div>
                      <p className="font-medium">Coordinator Approval:</p>
                      <p className="font-bold text-success">{claim.coordinatorApproval}</p>
                    </div>
                    <div>
                      <p className="font-medium">Approved By:</p>
                      <p>{claim.coordinatorApprovedBy}</p>
                    </div>
                    <div>
                      <p className="font-medium">Approval Date:</p>
                      <p>{claim.coordinatorApprovalDate}</p>
                    </div>
                    <div>
                      <p className="font-medium">Submitted:</p>
                      <p>{claim.submittedDate}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">Justification:</p>
                      <p>{claim.justification}</p>
                    </div>
                  </div>

                  {claim.status === "Coordinator Rejected" && claim.rejectionReason && (
                    <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="font-medium text-destructive">Rejection Reason:</p>
                      <p className="text-sm text-destructive">{claim.rejectionReason}</p>
                    </div>
                  )}

                  {claim.status === "Manager Approved" && (
                    <div className="mt-3 p-3 bg-success/10 border border-success/20 rounded-lg">
                      <p className="font-medium text-success">Manager Approved:</p>
                      <p className="text-sm text-success">
                        Approved by {claim.managerApprovedBy} on {claim.managerApprovalDate}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {claim.status === "Pending Manager Approval" && (
                  <>
                    <Button size="sm" className="bg-success">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive">
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Job Details
                </Button>
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  View Location
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Employee
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderMainDashboard = () => (
    <>
      {/* Quick Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {quickMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <IconComponent className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-lg font-bold">{metric.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card
              key={card.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden"
              onClick={() => handleCardAction(card.id)}
            >
              <CardContent className="p-0">
                {/* Header with Icon */}
                <div className={`${card.color} p-4 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{card.title}</h3>
                      <p className="text-sm opacity-90">{card.description}</p>
                    </div>
                    <IconComponent className="h-8 w-8 opacity-80" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {card.mainMetric}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {card.subMetric}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          card.trendPositive
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        {card.trend}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardAction(card.id);
                    }}
                  >
                    Open Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "network-assessment":
        return renderNetworkAssessment();
      case "overtime-management":
        return renderOvertimeManagement();
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
              Manager Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive management overview with key performance indicators
            </p>
          </div>
          {activeSection !== "main" && (
            <Button
              variant="outline"
              onClick={() => setActiveSection("main")}
            >
              ← Back to Dashboard
            </Button>
          )}
        </div>
      </div>

      {renderSection()}

      {/* Quick Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {quickMetrics.map((metric, index) => {
          const IconComponent = metric.icon;
          return (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                    <IconComponent className={`h-5 w-5 ${metric.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {metric.title}
                    </p>
                    <p className="text-lg font-bold">{metric.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card
              key={card.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden"
              onClick={() => handleCardAction(card.id)}
            >
              <CardContent className="p-0">
                {/* Header with Icon */}
                <div className={`${card.color} p-4 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{card.title}</h3>
                      <p className="text-sm opacity-90">{card.description}</p>
                    </div>
                    <IconComponent className="h-8 w-8 opacity-80" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {card.mainMetric}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {card.subMetric}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          card.trendPositive
                            ? "text-success"
                            : "text-destructive"
                        }`}
                      >
                        {card.trend}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardAction(card.id);
                    }}
                  >
                    Open Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Priority Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              <span>Priority Actions Required</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priorityActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <div
                    key={index}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{action.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </div>
                      <Badge className={getUrgencyColor(action.urgency)}>
                        {action.urgency}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      {action.action}
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <span>Team Performance Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Customer Satisfaction</span>
                  <span className="text-lg font-bold text-success">
                    {managerStats.customerSatisfaction}%
                  </span>
                </div>
                <div className="bg-secondary rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full"
                    style={{ width: `${managerStats.customerSatisfaction}%` }}
                  ></div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">On-Time Delivery</span>
                  <span className="text-lg font-bold text-primary">
                    {managerStats.onTimeDelivery}%
                  </span>
                </div>
                <div className="bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${managerStats.onTimeDelivery}%` }}
                  ></div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Profit Margin</span>
                  <span className="text-lg font-bold text-success">
                    {managerStats.profitMargin}%
                  </span>
                </div>
                <div className="bg-secondary rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full"
                    style={{ width: `${managerStats.profitMargin}%` }}
                  ></div>
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Monthly Growth</span>
                  <span className="text-lg font-bold text-warning">
                    +{managerStats.monthlyGrowth}%
                  </span>
                </div>
                <div className="bg-secondary rounded-full h-2">
                  <div
                    className="bg-warning h-2 rounded-full"
                    style={{ width: `${managerStats.monthlyGrowth * 4}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-card rounded-2xl p-6 border shadow-sm">
        <h3 className="font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Zap className="h-5 w-5 text-primary" />
          <span>Quick Actions</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Creating new job assignment...")}
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            New Job
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Opening team management...")}
          >
            <Users className="h-4 w-4 mr-2" />
            Manage Team
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Generating weekly report...")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Weekly Report
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Reviewing resource allocation...")}
          >
            <Package className="h-4 w-4 mr-2" />
            Resources
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Opening performance review...")}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Performance
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Opening system settings...")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
