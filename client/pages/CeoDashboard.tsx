import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Users,
  ClipboardList,
  TrendingUp,
  Activity,
  DollarSign,
  Shield,
  Truck,
  Package,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Timer,
  Eye,
  UserPlus,
  FileText,
  Settings,
} from "lucide-react";

export default function CeoDashboard() {
  const [systemData, setSystemData] = useState<any>(null);

  const systemStats = {
    totalJobs: 1247,
    completedJobs: 1089,
    failedJobs: 23,
    activeJobs: 135,
    totalTechnicians: 45,
    activeTechnicians: 38,
    departments: 8,
    productivity: 87.3,
    revenue: 245000,
    stockValue: 89500,
    fleetUtilization: 92.4,
    complianceScore: 95.2,
  };

  const dashboardCards = [
    {
      id: "overview",
      title: "System Overview",
      icon: BarChart3,
      color: "bg-blue-500",
      description: `${systemStats.totalJobs} total jobs, ${systemStats.productivity}% productivity`,
      action: () => handleCardAction("overview"),
    },
    {
      id: "departments",
      title: "Departments",
      icon: Building,
      color: "bg-green-500",
      description: `${systemStats.departments} departments managed`,
      action: () => handleCardAction("departments"),
    },
    {
      id: "performance",
      title: "Performance",
      icon: TrendingUp,
      color: "bg-purple-500",
      description: `${systemStats.activeTechnicians} active technicians`,
      action: () => handleCardAction("performance"),
    },
    {
      id: "compliance",
      title: "Compliance",
      icon: Shield,
      color: "bg-orange-500",
      description: `${systemStats.complianceScore}% compliance score`,
      action: () => handleCardAction("compliance"),
    },
    {
      id: "revenue",
      title: "Revenue",
      icon: DollarSign,
      color: "bg-emerald-500",
      description: `$${systemStats.revenue.toLocaleString()} this month`,
      action: () => handleCardAction("revenue"),
    },
    {
      id: "fleet",
      title: "Fleet Management",
      icon: Truck,
      color: "bg-indigo-500",
      description: `${systemStats.fleetUtilization}% fleet utilization`,
      action: () => handleCardAction("fleet"),
    },
    {
      id: "inventory",
      title: "Inventory",
      icon: Package,
      color: "bg-cyan-500",
      description: `$${systemStats.stockValue.toLocaleString()} stock value`,
      action: () => handleCardAction("inventory"),
    },
    {
      id: "controls",
      title: "System Controls",
      icon: Settings,
      color: "bg-red-500",
      description: "User management and configuration",
      action: () => handleCardAction("controls"),
    },
    {
      id: "alerts",
      title: "System Alerts",
      icon: AlertTriangle,
      color: "bg-yellow-500",
      description: "Monitor system health and issues",
      action: () => handleCardAction("alerts"),
    },
    {
      id: "reports",
      title: "Reports",
      icon: FileText,
      color: "bg-slate-500",
      description: "Generate and view system reports",
      action: () => handleCardAction("reports"),
    },
    {
      id: "users",
      title: "User Management",
      icon: UserPlus,
      color: "bg-pink-500",
      description: "Add and manage system users",
      action: () => handleCardAction("users"),
    },
    {
      id: "analytics",
      title: "Analytics",
      icon: Activity,
      color: "bg-teal-500",
      description: "Detailed system analytics and insights",
      action: () => handleCardAction("analytics"),
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
      case "overview":
        alert("Opening System Overview dashboard...");
        break;
      case "departments":
        alert("Opening Department Performance view...");
        break;
      case "performance":
        alert("Opening Performance Analytics...");
        break;
      case "compliance":
        alert("Opening Compliance Dashboard...");
        break;
      case "revenue":
        alert("Opening Revenue Reports...");
        break;
      case "fleet":
        alert("Opening Fleet Management...");
        break;
      case "inventory":
        alert("Opening Inventory Management...");
        break;
      case "controls":
        alert("Opening System Configuration...");
        break;
      case "alerts":
        alert("Opening System Alerts...");
        break;
      case "reports":
        alert("Opening Report Generator...");
        break;
      case "users":
        alert("Opening User Management...");
        break;
      case "analytics":
        alert("Opening Advanced Analytics...");
        break;
      default:
        alert(`Opening ${cardId}...`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          CEO Dashboard
        </h1>
        <p className="text-gray-600">
          Complete system overview and management controls
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-blue-600">
                {systemStats.totalJobs.toLocaleString()}
              </p>
            </div>
            <ClipboardList className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${systemStats.revenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Staff</p>
              <p className="text-2xl font-bold text-purple-600">
                {systemStats.activeTechnicians}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Productivity</p>
              <p className="text-2xl font-bold text-orange-600">
                {systemStats.productivity}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {dashboardCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card
              key={card.id}
              className="bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
              onClick={card.action}
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className={`${card.color} p-4 rounded-2xl`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-md">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Adding new user...")}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Generating system report...")}
          >
            <FileText className="h-4 w-4 mr-2" />
            System Report
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Reviewing overtime claims...")}
          >
            <Timer className="h-4 w-4 mr-2" />
            Overtime Review
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
