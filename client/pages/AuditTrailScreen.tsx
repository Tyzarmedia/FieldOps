import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Eye,
  Download,
  Filter,
  ArrowLeft,
  User,
  Calendar,
  Edit,
  Trash2,
  Plus,
  DollarSign,
  Clock,
  FileText,
  Shield,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  ipAddress: string;
  userAgent: string;
  severity: "low" | "medium" | "high" | "critical";
  module: string;
  description: string;
}

interface FilterOptions {
  dateFrom: string;
  dateTo: string;
  userId: string;
  action: string;
  entity: string;
  severity: string;
  module: string;
}

export default function AuditTrailScreen() {
  const navigate = useNavigate();
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([
    {
      id: "AUDIT-001",
      timestamp: "2024-01-16 14:30:15",
      userId: "U001",
      userName: "Siyanda Ngubane",
      action: "UPDATE",
      entity: "Employee",
      entityId: "E003",
      oldValue: { salary: 36000 },
      newValue: { salary: 38000 },
      ipAddress: "192.168.1.45",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "medium",
      module: "Payroll",
      description: "Updated employee salary from R36,000 to R38,000",
    },
    {
      id: "AUDIT-002",
      timestamp: "2024-01-16 13:45:22",
      userId: "U002",
      userName: "Admin User",
      action: "CREATE",
      entity: "BulkOperation",
      entityId: "BA003",
      newValue: { type: "bonus", amount: 5000, targets: 12 },
      ipAddress: "192.168.1.100",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      severity: "high",
      module: "Bulk Actions",
      description: "Created bulk bonus operation affecting 12 employees",
    },
    {
      id: "AUDIT-003",
      timestamp: "2024-01-16 12:20:08",
      userId: "U001",
      userName: "Siyanda Ngubane",
      action: "DELETE",
      entity: "Deduction",
      entityId: "D047",
      oldValue: { type: "loan", amount: 2500, employeeId: "E015" },
      ipAddress: "192.168.1.45",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "high",
      module: "Payroll",
      description: "Deleted loan deduction for employee E015",
    },
    {
      id: "AUDIT-004",
      timestamp: "2024-01-16 11:10:33",
      userId: "U003",
      userName: "HR Manager",
      action: "UPDATE",
      entity: "TaxSettings",
      entityId: "TAX-2024",
      oldValue: { uifRate: 1.0 },
      newValue: { uifRate: 1.2 },
      ipAddress: "192.168.1.78",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "critical",
      module: "Tax Management",
      description: "Updated UIF rate from 1.0% to 1.2%",
    },
    {
      id: "AUDIT-005",
      timestamp: "2024-01-16 10:55:41",
      userId: "U001",
      userName: "Siyanda Ngubane",
      action: "EXPORT",
      entity: "PayrollData",
      entityId: "EXPORT-2024-001",
      newValue: { format: "CSV", records: 87, size: "2.1MB" },
      ipAddress: "192.168.1.45",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      severity: "medium",
      module: "Sage Integration",
      description: "Exported payroll data to CSV format (87 records)",
    },
    {
      id: "AUDIT-006",
      timestamp: "2024-01-16 09:30:12",
      userId: "U002",
      userName: "Admin User",
      action: "LOGIN",
      entity: "UserSession",
      entityId: "SESSION-001",
      ipAddress: "192.168.1.100",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      severity: "low",
      module: "Authentication",
      description: "User logged into the system",
    },
  ]);

  const [filters, setFilters] = useState<FilterOptions>({
    dateFrom: "",
    dateTo: "",
    userId: "all",
    action: "all",
    entity: "all",
    severity: "all",
    module: "all",
  });

  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const actions = [
    "all",
    "CREATE",
    "UPDATE",
    "DELETE",
    "LOGIN",
    "LOGOUT",
    "EXPORT",
    "IMPORT",
  ];
  const entities = [
    "all",
    "Employee",
    "BulkOperation",
    "Deduction",
    "TaxSettings",
    "PayrollData",
    "UserSession",
  ];
  const severityLevels = ["all", "low", "medium", "high", "critical"];
  const modules = [
    "all",
    "Payroll",
    "Bulk Actions",
    "Tax Management",
    "Sage Integration",
    "Authentication",
    "HR Management",
  ];
  const users = ["all", "Siyanda Ngubane", "Admin User", "HR Manager"];

  const filteredEntries = auditEntries.filter((entry) => {
    const matchesSearch =
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.entityId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters =
      (filters.userId === "all" || entry.userName === filters.userId) &&
      (filters.action === "all" || entry.action === filters.action) &&
      (filters.entity === "all" || entry.entity === filters.entity) &&
      (filters.severity === "all" || entry.severity === filters.severity) &&
      (filters.module === "all" || entry.module === filters.module);

    return matchesSearch && matchesFilters;
  });

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case "medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE":
        return <Plus className="h-4 w-4 text-green-500" />;
      case "UPDATE":
        return <Edit className="h-4 w-4 text-blue-500" />;
      case "DELETE":
        return <Trash2 className="h-4 w-4 text-red-500" />;
      case "EXPORT":
        return <Download className="h-4 w-4 text-purple-500" />;
      case "LOGIN":
        return <User className="h-4 w-4 text-gray-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const exportAuditLog = () => {
    const csvContent = [
      "Timestamp,User,Action,Entity,Entity ID,Module,Severity,Description,IP Address",
      ...filteredEntries.map(
        (entry) =>
          `${entry.timestamp},${entry.userName},${entry.action},${entry.entity},${entry.entityId},${entry.module},${entry.severity},"${entry.description}",${entry.ipAddress}`,
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_trail_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const showEntryDetails = (entry: AuditEntry) => {
    setSelectedEntry(entry);
    setShowDetailsDialog(true);
  };

  const formatValue = (value: any) => {
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const resetFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      userId: "all",
      action: "all",
      entity: "all",
      severity: "all",
      module: "all",
    });
    setSearchTerm("");
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
          <Shield className="h-8 w-8 text-teal-600" />
          <h1 className="text-3xl font-bold text-gray-800">Audit Trail</h1>
        </div>
        <p className="text-gray-600">
          Track and monitor all payroll system changes and activities
        </p>
      </div>

      <Tabs defaultValue="logs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="logs">Audit Logs</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="logs" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Filters & Search
                <div className="flex gap-2">
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                  <Button onClick={exportAuditLog}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Log
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <Label>Date From</Label>
                  <Input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateFrom: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Date To</Label>
                  <Input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        dateTo: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>User</Label>
                  <Select
                    value={filters.userId}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, userId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user} value={user}>
                          {user === "all" ? "All Users" : user}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Action</Label>
                  <Select
                    value={filters.action}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, action: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {actions.map((action) => (
                        <SelectItem key={action} value={action}>
                          {action === "all" ? "All Actions" : action}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Entity</Label>
                  <Select
                    value={filters.entity}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, entity: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {entities.map((entity) => (
                        <SelectItem key={entity} value={entity}>
                          {entity === "all" ? "All Entities" : entity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Module</Label>
                  <Select
                    value={filters.module}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, module: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map((module) => (
                        <SelectItem key={module} value={module}>
                          {module === "all" ? "All Modules" : module}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Severity</Label>
                  <Select
                    value={filters.severity}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, severity: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {severityLevels.map((severity) => (
                        <SelectItem key={severity} value={severity}>
                          {severity === "all"
                            ? "All Severities"
                            : severity.charAt(0).toUpperCase() +
                              severity.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search descriptions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Audit Entries */}
          <Card>
            <CardHeader>
              <CardTitle>
                Audit Entries ({filteredEntries.length} records)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{entry.timestamp}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>{entry.userName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(entry.action)}
                          <span>{entry.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{entry.entity}</p>
                          <p className="text-sm text-gray-500">
                            {entry.entityId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.module}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(entry.severity)}
                          <Badge className={getSeverityColor(entry.severity)}>
                            {entry.severity}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm max-w-xs truncate">
                          {entry.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => showEntryDetails(entry)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Entries
                    </p>
                    <p className="text-2xl font-bold">{auditEntries.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Critical Events
                    </p>
                    <p className="text-2xl font-bold text-red-600">
                      {
                        auditEntries.filter((e) => e.severity === "critical")
                          .length
                      }
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Active Users
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {new Set(auditEntries.map((e) => e.userId)).size}
                    </p>
                  </div>
                  <User className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Today's Events
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {
                        auditEntries.filter((e) =>
                          e.timestamp.startsWith("2024-01-16"),
                        ).length
                      }
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity by Module */}
          <Card>
            <CardHeader>
              <CardTitle>Activity by Module</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules
                  .filter((m) => m !== "all")
                  .map((module) => {
                    const count = auditEntries.filter(
                      (e) => e.module === module,
                    ).length;
                    const percentage = (count / auditEntries.length) * 100;

                    return (
                      <div
                        key={module}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-32 text-sm font-medium">
                            {module}
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {count} events
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Audit Entry Details</DialogTitle>
          </DialogHeader>
          {selectedEntry && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Entry ID</Label>
                  <p className="text-sm font-mono">{selectedEntry.id}</p>
                </div>
                <div>
                  <Label>Timestamp</Label>
                  <p className="text-sm">{selectedEntry.timestamp}</p>
                </div>
                <div>
                  <Label>User</Label>
                  <p className="text-sm">
                    {selectedEntry.userName} ({selectedEntry.userId})
                  </p>
                </div>
                <div>
                  <Label>IP Address</Label>
                  <p className="text-sm font-mono">{selectedEntry.ipAddress}</p>
                </div>
                <div>
                  <Label>Action</Label>
                  <div className="flex items-center gap-2">
                    {getActionIcon(selectedEntry.action)}
                    <span className="text-sm">{selectedEntry.action}</span>
                  </div>
                </div>
                <div>
                  <Label>Severity</Label>
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(selectedEntry.severity)}
                    <Badge className={getSeverityColor(selectedEntry.severity)}>
                      {selectedEntry.severity}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Entity</Label>
                  <p className="text-sm">
                    {selectedEntry.entity} ({selectedEntry.entityId})
                  </p>
                </div>
                <div>
                  <Label>Module</Label>
                  <Badge variant="outline">{selectedEntry.module}</Badge>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <p className="text-sm">{selectedEntry.description}</p>
              </div>

              {selectedEntry.oldValue && (
                <div>
                  <Label>Old Value</Label>
                  <pre className="text-xs bg-gray-100 p-3 rounded border overflow-auto max-h-32">
                    {formatValue(selectedEntry.oldValue)}
                  </pre>
                </div>
              )}

              {selectedEntry.newValue && (
                <div>
                  <Label>New Value</Label>
                  <pre className="text-xs bg-gray-100 p-3 rounded border overflow-auto max-h-32">
                    {formatValue(selectedEntry.newValue)}
                  </pre>
                </div>
              )}

              <div>
                <Label>User Agent</Label>
                <p className="text-xs text-gray-600 break-all">
                  {selectedEntry.userAgent}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
