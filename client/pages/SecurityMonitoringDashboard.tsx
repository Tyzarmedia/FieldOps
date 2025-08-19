import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  AlertTriangle,
  Eye,
  Users,
  Activity,
  MapPin,
  Clock,
  RefreshCw,
  Ban,
} from "lucide-react";
import { makeAuthenticatedRequest } from "@/utils/auth";

interface LoginAttempt {
  id: string;
  timestamp: string;
  email: string;
  password?: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  failureReason?: string;
}

interface SecurityAlert {
  id: string;
  timestamp: string;
  type:
    | "BRUTE_FORCE"
    | "SUSPICIOUS_ACTIVITY"
    | "CREDENTIAL_STUFFING"
    | "RATE_LIMIT_EXCEEDED";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  ipAddress: string;
  details: string;
  attempts: number;
  timeWindow: string;
}

interface SecurityStats {
  totalAttempts: number;
  failedAttempts: number;
  uniqueIPs: number;
  activeAlerts: number;
  topFailedIPs: Array<{ ip: string; attempts: number }>;
}

export default function SecurityMonitoringDashboard() {
  const [stats, setStats] = useState<SecurityStats | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<LoginAttempt[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [selectedIP, setSelectedIP] = useState<string | null>(null);
  const [ipDetails, setIPDetails] = useState<LoginAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await makeAuthenticatedRequest(
        "/api/security/dashboard",
      );
      const data = await response.json();

      if (data.success) {
        setStats(data.data.stats);
        setRecentAttempts(data.data.recentAttempts);
        setAlerts(data.data.alerts);
        setLastRefresh(new Date());
        setError("");
      } else {
        setError(data.message || "Failed to load security data");
      }
    } catch (error) {
      console.error("Error loading security dashboard:", error);
      setError("Failed to load security dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const loadIPDetails = async (ip: string) => {
    try {
      const response = await makeAuthenticatedRequest(
        `/api/security/failed-attempts/${ip}?hours=24`,
      );
      const data = await response.json();

      if (data.success) {
        setIPDetails(data.data);
        setSelectedIP(ip);
      }
    } catch (error) {
      console.error("Error loading IP details:", error);
    }
  };

  useEffect(() => {
    loadDashboardData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-600";
      case "HIGH":
        return "bg-red-500";
      case "MEDIUM":
        return "bg-yellow-500";
      case "LOW":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "BRUTE_FORCE":
        return <Ban className="h-4 w-4" />;
      case "SUSPICIOUS_ACTIVITY":
        return <Eye className="h-4 w-4" />;
      case "CREDENTIAL_STUFFING":
        return <Users className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  if (isLoading && !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading security dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Security Monitoring</h1>
              <p className="text-muted-foreground">
                Monitor login attempts and security threats
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </div>
            <Button onClick={loadDashboardData} disabled={isLoading}>
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Attempts (24h)
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAttempts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Failed Attempts
                </CardTitle>
                <Ban className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {stats.failedAttempts}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.totalAttempts > 0
                    ? Math.round(
                        (stats.failedAttempts / stats.totalAttempts) * 100,
                      )
                    : 0}
                  % failure rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Unique IPs
                </CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.uniqueIPs}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Alerts
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  {stats.activeAlerts}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Security Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Recent Security Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alerts.length > 0 ? (
                  alerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getAlertIcon(alert.type)}
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <span className="font-medium">
                            {alert.type.replace("_", " ")}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatTimestamp(alert.timestamp)}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.details}
                      </p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>IP: {alert.ipAddress}</span>
                        <span>Attempts: {alert.attempts}</span>
                        <span>Window: {alert.timeWindow}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No recent alerts
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Failed IPs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Top Failed IPs (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats?.topFailedIPs.length ? (
                  stats.topFailedIPs.map((item, index) => (
                    <div
                      key={item.ip}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-mono">{index + 1}</div>
                        <div>
                          <div className="font-medium">{item.ip}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.attempts} failed attempts
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadIPDetails(item.ip)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    No failed attempts
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Login Attempts */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Login Attempts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Timestamp</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">IP Address</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Password</th>
                    <th className="text-left p-2">Failure Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAttempts.map((attempt) => (
                    <tr key={attempt.id} className="border-b hover:bg-muted/50">
                      <td className="p-2 font-mono text-xs">
                        {formatTimestamp(attempt.timestamp)}
                      </td>
                      <td className="p-2">{attempt.email}</td>
                      <td className="p-2 font-mono">{attempt.ipAddress}</td>
                      <td className="p-2">
                        <Badge
                          variant={attempt.success ? "default" : "destructive"}
                        >
                          {attempt.success ? "SUCCESS" : "FAILED"}
                        </Badge>
                      </td>
                      <td className="p-2 font-mono text-xs">
                        {attempt.password || "N/A"}
                      </td>
                      <td className="p-2 text-xs text-muted-foreground">
                        {attempt.failureReason || "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* IP Details Modal/Panel */}
        {selectedIP && (
          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Failed Attempts from {selectedIP}</CardTitle>
                <Button variant="outline" onClick={() => setSelectedIP(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {ipDetails.map((attempt) => (
                  <div key={attempt.id} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{attempt.email}</div>
                        <div className="text-sm text-muted-foreground">
                          Password: {attempt.password}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimestamp(attempt.timestamp)}
                        </div>
                      </div>
                      <Badge variant="destructive">FAILED</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
