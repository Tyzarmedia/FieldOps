import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Laptop,
  Smartphone,
  Monitor,
  Router,
  HardDrive,
  Shield,
  Plus,
  Download,
  Upload,
  Settings,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Activity,
  FileText,
  Users,
  Database,
  Search,
  Filter,
} from "lucide-react";

export default function ITDashboard() {
  const [systemData, setSystemData] = useState<any>(null);

  const itStats = {
    totalAssets: 234,
    assignedAssets: 187,
    availableAssets: 32,
    maintenanceAssets: 15,
    openTickets: 23,
    resolvedTickets: 156,
    pendingRequests: 8,
    systemAccessUsers: 87,
    securityAlerts: 2,
  };

  const dashboardCards = [
    {
      id: "assets",
      title: "Asset Management",
      icon: Laptop,
      color: "bg-blue-500",
      description: `${itStats.totalAssets} total assets managed`,
      action: () => handleCardAction("assets"),
    },
    {
      id: "tickets",
      title: "Support Tickets",
      icon: AlertTriangle,
      color: "bg-orange-500",
      description: `${itStats.openTickets} open tickets`,
      action: () => handleCardAction("tickets"),
    },
    {
      id: "access",
      title: "System Access",
      icon: Shield,
      color: "bg-green-500",
      description: `${itStats.systemAccessUsers} users managed`,
      action: () => handleCardAction("access"),
    },
    {
      id: "audit",
      title: "Audit Logs",
      icon: FileText,
      color: "bg-purple-500",
      description: "System activity and security logs",
      action: () => handleCardAction("audit"),
    },
    {
      id: "maintenance",
      title: "Maintenance",
      icon: Wrench,
      color: "bg-yellow-500",
      description: `${itStats.maintenanceAssets} items in maintenance`,
      action: () => handleCardAction("maintenance"),
    },
    {
      id: "security",
      title: "Security Center",
      icon: Shield,
      color: "bg-red-500",
      description: `${itStats.securityAlerts} active security alerts`,
      action: () => handleCardAction("security"),
    },
    {
      id: "network",
      title: "Network Management",
      icon: Router,
      color: "bg-indigo-500",
      description: "Monitor and manage network infrastructure",
      action: () => handleCardAction("network"),
    },
    {
      id: "mobile-devices",
      title: "Mobile Devices",
      icon: Smartphone,
      color: "bg-cyan-500",
      description: "Mobile device management and policies",
      action: () => handleCardAction("mobile-devices"),
    },
    {
      id: "storage",
      title: "Storage Management",
      icon: HardDrive,
      color: "bg-emerald-500",
      description: "Storage systems and data management",
      action: () => handleCardAction("storage"),
    },
    {
      id: "monitoring",
      title: "System Monitoring",
      icon: Activity,
      color: "bg-pink-500",
      description: "Real-time system health monitoring",
      action: () => handleCardAction("monitoring"),
    },
    {
      id: "backup",
      title: "Backup & Recovery",
      icon: Database,
      color: "bg-teal-500",
      description: "Data backup and disaster recovery",
      action: () => handleCardAction("backup"),
    },
    {
      id: "reports",
      title: "IT Reports",
      icon: FileText,
      color: "bg-slate-500",
      description: "Generate IT performance reports",
      action: () => handleCardAction("reports"),
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
      case "assets":
        alert("Opening Asset Management...");
        break;
      case "tickets":
        alert("Opening Support Tickets...");
        break;
      case "access":
        alert("Opening System Access Management...");
        break;
      case "audit":
        alert("Opening Audit Logs...");
        break;
      case "maintenance":
        alert("Opening Maintenance Dashboard...");
        break;
      case "security":
        alert("Opening Security Center...");
        break;
      case "network":
        alert("Opening Network Management...");
        break;
      case "mobile-devices":
        alert("Opening Mobile Device Management...");
        break;
      case "storage":
        alert("Opening Storage Management...");
        break;
      case "monitoring":
        alert("Opening System Monitoring...");
        break;
      case "backup":
        alert("Opening Backup & Recovery...");
        break;
      case "reports":
        alert("Opening IT Reports...");
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
          IT Dashboard
        </h1>
        <p className="text-gray-600">
          Complete IT infrastructure and asset management
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Assets</p>
              <p className="text-2xl font-bold text-blue-600">
                {itStats.totalAssets}
              </p>
            </div>
            <Laptop className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-orange-600">
                {itStats.openTickets}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Maintenance Items</p>
              <p className="text-2xl font-bold text-yellow-600">
                {itStats.maintenanceAssets}
              </p>
            </div>
            <Wrench className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Security Alerts</p>
              <p className="text-2xl font-bold text-red-600">
                {itStats.securityAlerts}
              </p>
            </div>
            <Shield className="h-8 w-8 text-red-500" />
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
            onClick={() => alert("Registering new asset...")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Register Asset
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Exporting asset data...")}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Importing asset data...")}
          >
            <Upload className="h-4 w-4 mr-2" />
            Bulk Import
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Running security scan...")}
          >
            <Shield className="h-4 w-4 mr-2" />
            Security Scan
          </Button>
        </div>
      </div>
    </div>
  );
}
