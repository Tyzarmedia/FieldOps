import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  Truck,
  Wrench,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Fuel,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Plus,
  Activity,
  Brain,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Gauge,
  Shield,
  Zap,
  Send,
} from "lucide-react";

interface AIInsight {
  id: string;
  type: "predictive" | "optimization" | "alert" | "recommendation";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  confidence: number;
  actionRequired: boolean;
}

export default function FleetOverviewDashboard() {
  const navigate = useNavigate();
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);

  // Load AVIS database with cleanup
  useEffect(() => {
    let cancelled = false;

    const loadAvisData = async () => {
      try {
        const response = await fetch("/data/avis-database.json");
        if (cancelled) return;

        const data = await response.json();
        if (cancelled) return;

        setVehicles(data.vehicles);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load AVIS database:", error);
        }
      }
    };

    loadAvisData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Calculate fleet KPIs from AVIS data with memoization
  const fleetKPIs = useMemo(() => {
    const activeVehicles = vehicles.filter((v) => v.status === "Active");
    const inMaintenanceVehicles = vehicles.filter(
      (v) => v.status === "In Maintenance",
    );

    return {
      totalVehicles: vehicles.length,
      activeVehicles: activeVehicles.length,
      inactiveVehicles: inMaintenanceVehicles.length,
      inspectionsDue: 6,
      maintenanceQueue: inMaintenanceVehicles.length,
      complianceRate: 92,
      avgFuelEfficiency:
        vehicles.length > 0
          ? vehicles.reduce((sum, v) => sum + (v.fuel_efficiency || 0), 0) /
            vehicles.length
          : 0,
      totalMileage: vehicles.reduce((sum, v) => sum + (v.mileage || 0), 0),
      activeAlerts: 8,
      criticalAlerts: 2,
    };
  }, [vehicles]);

  // AI Insights
  const aiInsights: AIInsight[] = [
    {
      id: "1",
      type: "predictive",
      title: "Maintenance Prediction",
      description:
        "Vehicles FL-003 and FL-007 likely need service within 7 days based on usage patterns",
      impact: "high",
      confidence: 87,
      actionRequired: true,
    },
    {
      id: "2",
      type: "optimization",
      title: "Fuel Efficiency",
      description:
        "Route optimization could save 12% fuel costs on Route A-D corridor",
      impact: "medium",
      confidence: 93,
      actionRequired: false,
    },
    {
      id: "3",
      type: "alert",
      title: "Compliance Risk",
      description: "3 vehicle licenses expire within 14 days",
      impact: "high",
      confidence: 100,
      actionRequired: true,
    },
    {
      id: "4",
      type: "recommendation",
      title: "Driver Training",
      description: "Driver efficiency training could improve fleet MPG by 15%",
      impact: "medium",
      confidence: 78,
      actionRequired: false,
    },
  ];

  // Chart data
  const fuelTrendData = [
    { day: "Mon", fuel: 145, efficiency: 28.2 },
    { day: "Tue", fuel: 158, efficiency: 27.8 },
    { day: "Wed", fuel: 142, efficiency: 29.1 },
    { day: "Thu", fuel: 151, efficiency: 28.5 },
    { day: "Fri", fuel: 165, efficiency: 27.2 },
    { day: "Sat", fuel: 134, efficiency: 30.1 },
    { day: "Sun", fuel: 128, efficiency: 30.8 },
  ];

  const complianceData = [
    { month: "Jan", compliance: 88 },
    { month: "Feb", compliance: 91 },
    { month: "Mar", compliance: 89 },
    { month: "Apr", compliance: 94 },
    { month: "May", compliance: 92 },
    { month: "Jun", compliance: 96 },
  ];

  const vehicleStatusData = [
    { name: "Active", value: 20, color: "#22c55e" },
    { name: "Maintenance", value: 3, color: "#f59e0b" },
    { name: "Inactive", value: 1, color: "#ef4444" },
  ];

  const uptimeData = [
    { vehicle: "FL-001", uptime: 98.5 },
    { vehicle: "FL-002", uptime: 96.2 },
    { vehicle: "FL-003", uptime: 87.1 },
    { vehicle: "FL-004", uptime: 99.1 },
    { vehicle: "FL-005", uptime: 94.8 },
  ];

  const handleAIQuestion = useCallback(async () => {
    if (!aiQuestion.trim()) return;

    setIsAskingAI(true);

    // Simulate AI processing with timeout protection
    const timeoutId = setTimeout(() => {
      setIsAskingAI(false);
    }, 10000); // 10 second timeout

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock AI responses based on common fleet questions
      const responses: { [key: string]: string } = {
        "worst mpg":
          "Vehicle FL-003 has the worst fuel efficiency at 24.2 MPG. This is 15% below fleet average. Consider route optimization or maintenance check.",
        "maintenance due":
          "Currently 6 vehicles have maintenance due: FL-003, FL-007, FL-012, FL-015, FL-018, FL-021. FL-003 and FL-007 are highest priority.",
        "fuel cost":
          "Current weekly fuel cost is $1,247. This is 8% higher than last week due to increased mileage on Route C. Consider route optimization.",
        "compliance issues":
          "3 vehicles have compliance issues: FL-005 (license expires in 12 days), FL-009 (inspection overdue), FL-016 (insurance renewal needed).",
        "best driver":
          "Driver Sarah Johnson has the highest efficiency score of 96.2 with lowest fuel consumption and best route adherence.",
      };

      const lowerQuestion = aiQuestion.toLowerCase();
      let response = "I'm analyzing your fleet data...";

      for (const [key, value] of Object.entries(responses)) {
        if (lowerQuestion.includes(key)) {
          response = value;
          break;
        }
      }

      if (response === "I'm analyzing your fleet data...") {
        response = `Based on current fleet data: ${fleetKPIs.totalVehicles} vehicles, ${fleetKPIs.complianceRate}% compliance rate, ${fleetKPIs.avgFuelEfficiency.toFixed(1)} MPG average. ${fleetKPIs.criticalAlerts} critical alerts need immediate attention.`;
      }

      setAiResponse(response);
    } catch (error) {
      console.error("AI processing error:", error);
      setAiResponse(
        "Sorry, I encountered an error processing your question. Please try again.",
      );
    } finally {
      clearTimeout(timeoutId);
      setIsAskingAI(false);
    }
  }, [aiQuestion, fleetKPIs]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "predictive":
        return <Brain className="h-4 w-4" />;
      case "optimization":
        return <TrendingUp className="h-4 w-4" />;
      case "alert":
        return <AlertTriangle className="h-4 w-4" />;
      case "recommendation":
        return <Zap className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fleet Overview</h1>
          <p className="text-muted-foreground">
            AI-powered fleet management dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/fleet/settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Fleet Status
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-2xl font-bold text-green-600">
                    {fleetKPIs.activeVehicles}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    / {fleetKPIs.totalVehicles}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {fleetKPIs.inactiveVehicles} inactive
                </p>
              </div>
              <Truck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Compliance Rate
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-2xl font-bold text-blue-600">
                    {fleetKPIs.complianceRate}%
                  </span>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <Progress value={fleetKPIs.complianceRate} className="mt-2" />
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
                  Fuel Efficiency
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-2xl font-bold text-purple-600">
                    {fleetKPIs.avgFuelEfficiency}
                  </span>
                  <span className="text-sm text-muted-foreground">MPG</span>
                </div>
                <p className="text-xs text-green-600 mt-1">+2.3% this week</p>
              </div>
              <Fuel className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Alerts
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-2xl font-bold text-red-600">
                    {fleetKPIs.activeAlerts}
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    {fleetKPIs.criticalAlerts} Critical
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {fleetKPIs.inspectionsDue} inspections due
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Interactive Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fuel Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Fuel Usage & Efficiency Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={fuelTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar
                  yAxisId="left"
                  dataKey="fuel"
                  fill="#3b82f6"
                  name="Fuel (L)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="MPG"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Compliance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Compliance Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="compliance"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vehicle Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vehicleStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Vehicle Uptime */}
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Uptime Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={uptimeData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="vehicle" type="category" />
                <Tooltip />
                <Bar dataKey="uptime" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => navigate("/fleet/vehicles")}
            >
              <Truck className="h-6 w-6 mb-2" />
              Manage Vehicles
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => navigate("/fleet/inspections")}
            >
              <CheckCircle className="h-6 w-6 mb-2" />
              Run Inspection
            </Button>
            <Button
              variant="outline"
              className="h-20 flex-col"
              onClick={() => navigate("/fleet/compliance")}
            >
              <Shield className="h-6 w-6 mb-2" />
              Check Compliance
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
