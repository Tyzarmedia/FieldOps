import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  Upload,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
  FileText,
  Database,
  RefreshCw,
  History,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ExportRecord {
  id: string;
  timestamp: string;
  type: string;
  status: "completed" | "failed" | "pending";
  records: number;
  size: string;
  user: string;
}

interface ConnectionSettings {
  server: string;
  database: string;
  username: string;
  password: string;
  port: number;
  lastConnected?: string;
}

export default function Sage300ExportScreen() {
  const navigate = useNavigate();
  const [exportProgress, setExportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<
    "connected" | "disconnected" | "testing"
  >("disconnected");
  const [lastExport, setLastExport] = useState<string>("2024-01-15 14:30:00");
  const [selectedPeriod, setSelectedPeriod] = useState("current");
  const [exportType, setExportType] = useState("full");

  const [connectionSettings, setConnectionSettings] =
    useState<ConnectionSettings>({
      server: "sage300-server.company.local",
      database: "PAYROLL_DB",
      username: "sage_user",
      password: "",
      port: 1433,
      lastConnected: "2024-01-15 14:30:00",
    });

  const [exportHistory, setExportHistory] = useState<ExportRecord[]>([
    {
      id: "EXP-2024-001",
      timestamp: "2024-01-15 14:30:00",
      type: "Full Payroll Export",
      status: "completed",
      records: 87,
      size: "2.1 MB",
      user: "admin@company.com",
    },
    {
      id: "EXP-2024-002",
      timestamp: "2024-01-14 16:45:00",
      type: "Employee Updates",
      status: "completed",
      records: 23,
      size: "0.8 MB",
      user: "payroll@company.com",
    },
    {
      id: "EXP-2024-003",
      timestamp: "2024-01-13 09:15:00",
      type: "Tax Adjustments",
      status: "failed",
      records: 0,
      size: "0 MB",
      user: "admin@company.com",
    },
  ]);

  useEffect(() => {
    loadExportHistory();
  }, []);

  const loadExportHistory = async () => {
    try {
      // Mock API call - in real app, this would fetch from backend
      console.log("Loading export history...");
    } catch (error) {
      console.error("Failed to load export history:", error);
    }
  };

  const testConnection = async () => {
    setConnectionStatus("testing");

    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (connectionSettings.server && connectionSettings.database) {
      setConnectionStatus("connected");
      setConnectionSettings((prev) => ({
        ...prev,
        lastConnected: new Date().toLocaleString(),
      }));
    } else {
      setConnectionStatus("disconnected");
    }
  };

  const startExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsExporting(false);
          setLastExport(new Date().toLocaleString());

          // Add new export record
          const newRecord: ExportRecord = {
            id: `EXP-${new Date().getFullYear()}-${String(exportHistory.length + 1).padStart(3, "0")}`,
            timestamp: new Date().toLocaleString(),
            type:
              exportType === "full"
                ? "Full Payroll Export"
                : "Incremental Export",
            status: "completed",
            records: 87,
            size: "2.3 MB",
            user: "current_user@company.com",
          };

          setExportHistory((prev) => [newRecord, ...prev]);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const downloadExportFile = (record: ExportRecord) => {
    // Simulate file download
    const blob = new Blob([`Export data for ${record.id}`], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sage300_export_${record.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/payroll-dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <Building className="h-8 w-8 text-emerald-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Sage 300 Integration
          </h1>
        </div>
        <p className="text-gray-600">
          Export payroll data to Sage 300 ERP system
        </p>
      </div>

      <Tabs defaultValue="export" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="export">Export Data</TabsTrigger>
          <TabsTrigger value="history">Export History</TabsTrigger>
          <TabsTrigger value="settings">Connection Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-6">
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Connection Status
                <Badge
                  variant={
                    connectionStatus === "connected" ? "default" : "destructive"
                  }
                  className={
                    connectionStatus === "connected" ? "bg-green-500" : ""
                  }
                >
                  {connectionStatus === "connected"
                    ? "Connected"
                    : connectionStatus === "testing"
                      ? "Testing..."
                      : "Disconnected"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Server: {connectionSettings.server}
                  </p>
                  <p className="text-sm text-gray-600">
                    Database: {connectionSettings.database}
                  </p>
                  {connectionSettings.lastConnected && (
                    <p className="text-sm text-gray-500">
                      Last connected: {connectionSettings.lastConnected}
                    </p>
                  )}
                </div>
                <Button
                  onClick={testConnection}
                  disabled={connectionStatus === "testing"}
                  variant="outline"
                >
                  {connectionStatus === "testing" ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Database className="h-4 w-4 mr-2" />
                  )}
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Export Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Export Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="export-period">Pay Period</Label>
                  <Select
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">
                        Current Period (Jan 2024)
                      </SelectItem>
                      <SelectItem value="previous">
                        Previous Period (Dec 2023)
                      </SelectItem>
                      <SelectItem value="ytd">Year to Date (2024)</SelectItem>
                      <SelectItem value="custom">Custom Date Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="export-type">Export Type</Label>
                  <Select value={exportType} onValueChange={setExportType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Payroll Export</SelectItem>
                      <SelectItem value="incremental">
                        Incremental Changes
                      </SelectItem>
                      <SelectItem value="employees">
                        Employee Data Only
                      </SelectItem>
                      <SelectItem value="payroll">Payroll Data Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {lastExport && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Last successful export: {lastExport}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Export Progress */}
          {isExporting && (
            <Card>
              <CardHeader>
                <CardTitle>Export in Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Exporting payroll data...</span>
                    <span>{Math.round(exportProgress)}%</span>
                  </div>
                  <Progress value={exportProgress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Export Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Button
                  onClick={startExport}
                  disabled={isExporting || connectionStatus !== "connected"}
                  className="flex-1"
                  size="lg"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isExporting ? "Exporting..." : "Start Export"}
                </Button>

                <Button variant="outline" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Export History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exportHistory.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(record.status)}
                      <div>
                        <h4 className="font-medium">{record.type}</h4>
                        <p className="text-sm text-gray-600">
                          {record.timestamp} • {record.records} records •{" "}
                          {record.size}
                        </p>
                        <p className="text-xs text-gray-500">
                          by {record.user}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>

                      {record.status === "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadExportFile(record)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Connection Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="server">Server Address</Label>
                  <Input
                    id="server"
                    value={connectionSettings.server}
                    onChange={(e) =>
                      setConnectionSettings((prev) => ({
                        ...prev,
                        server: e.target.value,
                      }))
                    }
                    placeholder="sage300-server.company.local"
                  />
                </div>

                <div>
                  <Label htmlFor="port">Port</Label>
                  <Input
                    id="port"
                    type="number"
                    value={connectionSettings.port}
                    onChange={(e) =>
                      setConnectionSettings((prev) => ({
                        ...prev,
                        port: parseInt(e.target.value),
                      }))
                    }
                    placeholder="1433"
                  />
                </div>

                <div>
                  <Label htmlFor="database">Database</Label>
                  <Input
                    id="database"
                    value={connectionSettings.database}
                    onChange={(e) =>
                      setConnectionSettings((prev) => ({
                        ...prev,
                        database: e.target.value,
                      }))
                    }
                    placeholder="PAYROLL_DB"
                  />
                </div>

                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={connectionSettings.username}
                    onChange={(e) =>
                      setConnectionSettings((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    placeholder="sage_user"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={connectionSettings.password}
                    onChange={(e) =>
                      setConnectionSettings((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Enter password"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={testConnection}>
                  <Database className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
                <Button variant="outline">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
