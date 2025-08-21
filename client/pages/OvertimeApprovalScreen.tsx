import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from "@/components/ui/dialog";
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Download,
  AlertTriangle,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Send,
  MessageSquare,
} from "lucide-react";

interface OvertimeRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  department: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  reason: string;
  supervisor: string;
  workOrderNumber?: string;
  description: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  comments?: string;
  priority: "low" | "medium" | "high" | "urgent";
  costEstimate: number;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    uploadDate: string;
  }>;
}

interface ApprovalAction {
  requestId: string;
  action: "approve" | "reject";
  comments: string;
  approvedHours?: number;
}

export default function OvertimeApprovalScreen() {
  const [requests, setRequests] = useState<OvertimeRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<OvertimeRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("pending");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    request: OvertimeRequest | null;
    action: "approve" | "reject" | null;
  }>({ open: false, request: null, action: null });
  const [actionComments, setActionComments] = useState("");
  const [approvedHours, setApprovedHours] = useState<number>(0);

  // Mock current manager data - would come from auth context
  const currentManager = {
    id: "M001",
    name: "Sarah Wilson",
    department: "Field Operations",
    role: "Manager",
  };

  useEffect(() => {
    loadOvertimeRequests();
  }, []);

  const loadOvertimeRequests = async () => {
    try {
      setLoading(true);
      // Load overtime requests for current manager's team
      const response = await fetch(`/api/overtime/requests/team/${currentManager.id}`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      } else {
        // Mock data for demonstration
        setRequests([
          {
            id: "OTR001",
            employeeId: "E001",
            employeeName: "John Smith",
            employeeNumber: "FO-001",
            department: "Field Operations",
            date: "2025-01-25",
            startTime: "17:00",
            endTime: "21:00",
            totalHours: 4,
            reason: "Emergency repair",
            supervisor: "Sarah Wilson",
            workOrderNumber: "WO-2025-001",
            description: "Urgent fiber cable repair on Main Street due to excavation damage. Customer is a major business client requiring immediate restoration.",
            status: "pending",
            submittedAt: "2025-01-24T14:30:00Z",
            priority: "urgent",
            costEstimate: 900,
          },
          {
            id: "OTR002",
            employeeId: "E002",
            employeeName: "Mike Johnson",
            employeeNumber: "FO-002",
            department: "Field Operations",
            date: "2025-01-26",
            startTime: "18:00",
            endTime: "22:00",
            totalHours: 4,
            reason: "Project deadline",
            supervisor: "Sarah Wilson",
            workOrderNumber: "WO-2025-015",
            description: "Complete installation before client deadline to avoid penalty fees.",
            status: "pending",
            submittedAt: "2025-01-24T16:00:00Z",
            priority: "high",
            costEstimate: 600,
          },
          {
            id: "OTR003",
            employeeId: "E003",
            employeeName: "Lisa Davis",
            employeeNumber: "FO-003",
            department: "Field Operations",
            date: "2025-01-20",
            startTime: "16:00",
            endTime: "20:00",
            totalHours: 4,
            reason: "Equipment maintenance",
            supervisor: "Sarah Wilson",
            description: "Preventive maintenance on critical network equipment.",
            status: "approved",
            submittedAt: "2025-01-19T10:00:00Z",
            reviewedAt: "2025-01-19T14:30:00Z",
            reviewedBy: "Sarah Wilson",
            comments: "Approved - essential maintenance work",
            priority: "medium",
            costEstimate: 600,
          },
          {
            id: "OTR004",
            employeeId: "E004",
            employeeName: "David Wilson",
            employeeNumber: "FO-004",
            department: "Field Operations",
            date: "2025-01-18",
            startTime: "19:00",
            endTime: "23:00",
            totalHours: 4,
            reason: "Training",
            supervisor: "Sarah Wilson",
            description: "Attend vendor training session for new equipment.",
            status: "rejected",
            submittedAt: "2025-01-17T12:00:00Z",
            reviewedAt: "2025-01-17T16:00:00Z",
            reviewedBy: "Sarah Wilson",
            comments: "Training can be scheduled during regular hours",
            priority: "low",
            costEstimate: 600,
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading overtime requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === "all" || request.status === filterStatus;
    const matchesDepartment = filterDepartment === "all" || request.department === filterDepartment;
    const matchesSearch = searchTerm === "" || 
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.workOrderNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesDepartment && matchesSearch;
  });

  const processAction = async () => {
    if (!actionDialog.request || !actionDialog.action) return;

    try {
      setActionLoading(actionDialog.request.id);
      
      const actionData: ApprovalAction = {
        requestId: actionDialog.request.id,
        action: actionDialog.action,
        comments: actionComments,
        approvedHours: actionDialog.action === "approve" ? approvedHours : undefined,
      };

      const response = await fetch(`/api/overtime/requests/${actionDialog.request.id}/review`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(actionData),
      });

      if (response.ok) {
        const updatedRequest = {
          ...actionDialog.request,
          status: actionDialog.action === "approve" ? "approved" as const : "rejected" as const,
          reviewedAt: new Date().toISOString(),
          reviewedBy: currentManager.name,
          comments: actionComments,
        };

        setRequests(prev => 
          prev.map(req => 
            req.id === actionDialog.request!.id ? updatedRequest : req
          )
        );

        setActionDialog({ open: false, request: null, action: null });
        setActionComments("");
        setApprovedHours(0);
        
        alert(`Overtime request ${actionDialog.action}d successfully!`);
      } else {
        throw new Error(`Failed to ${actionDialog.action} request`);
      }
    } catch (error) {
      console.error(`Error ${actionDialog.action}ing request:`, error);
      alert(`Error ${actionDialog.action}ing request. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  const bulkApprove = async () => {
    const pendingRequests = filteredRequests.filter(req => req.status === "pending");
    if (pendingRequests.length === 0) {
      alert("No pending requests to approve");
      return;
    }

    if (!confirm(`Are you sure you want to approve ${pendingRequests.length} pending requests?`)) {
      return;
    }

    try {
      setLoading(true);
      
      for (const request of pendingRequests) {
        const response = await fetch(`/api/overtime/requests/${request.id}/review`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requestId: request.id,
            action: "approve",
            comments: "Bulk approved",
            approvedHours: request.totalHours,
          }),
        });

        if (response.ok) {
          setRequests(prev => 
            prev.map(req => 
              req.id === request.id 
                ? { 
                    ...req, 
                    status: "approved" as const,
                    reviewedAt: new Date().toISOString(),
                    reviewedBy: currentManager.name,
                    comments: "Bulk approved",
                  }
                : req
            )
          );
        }
      }

      alert("Bulk approval completed successfully!");
    } catch (error) {
      console.error("Error in bulk approval:", error);
      alert("Error during bulk approval. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const exportRequests = async () => {
    try {
      const csvContent = [
        "Employee Name,Employee Number,Date,Hours,Reason,Work Order,Status,Cost Estimate,Submitted Date",
        ...filteredRequests.map(req => [
          req.employeeName,
          req.employeeNumber,
          req.date,
          req.totalHours.toFixed(1),
          req.reason,
          req.workOrderNumber || "",
          req.status,
          req.costEstimate.toFixed(2),
          new Date(req.submittedAt).toLocaleDateString(),
        ].join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `overtime-requests-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting requests:", error);
      alert("Error exporting data. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}:00`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(amount);
  };

  // Calculate summary statistics
  const pendingRequests = requests.filter(r => r.status === "pending");
  const approvedThisMonth = requests.filter(r => 
    r.status === "approved" && 
    new Date(r.date).getMonth() === new Date().getMonth()
  );
  const totalCostThisMonth = approvedThisMonth.reduce((sum, r) => sum + r.costEstimate, 0);
  const totalHoursThisMonth = approvedThisMonth.reduce((sum, r) => sum + r.totalHours, 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Overtime Approval</h1>
            <p className="text-gray-600 mt-1">Review and approve overtime requests from your team</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={bulkApprove} variant="outline" disabled={loading}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Bulk Approve
            </Button>
            <Button onClick={exportRequests} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Pending Requests</p>
                    <p className="text-2xl font-bold">{pendingRequests.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Urgent Requests</p>
                    <p className="text-2xl font-bold">
                      {pendingRequests.filter(r => r.priority === "urgent").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Est. Cost</p>
                    <p className="text-xl font-bold">
                      {formatCurrency(pendingRequests.reduce((sum, r) => sum + r.costEstimate, 0))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Hours</p>
                    <p className="text-xl font-bold">
                      {pendingRequests.reduce((sum, r) => sum + r.totalHours, 0).toFixed(1)}h
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Input
                    placeholder="Search by employee name, number, or work order..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Field Operations">Field Operations</SelectItem>
                    <SelectItem value="Installation">Installation</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Requests Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Pending Overtime Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">No pending overtime requests</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Hours</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{request.employeeName}</div>
                            <div className="text-sm text-gray-600">{request.employeeNumber}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(request.date).toLocaleDateString()}</div>
                            <div className="text-gray-600">
                              {formatTime(request.startTime)} - {formatTime(request.endTime)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {request.totalHours.toFixed(1)}h
                        </TableCell>
                        <TableCell>
                          <div className="max-w-32">
                            <div className="font-medium">{request.reason}</div>
                            {request.workOrderNumber && (
                              <Badge variant="outline" className="mt-1">
                                {request.workOrderNumber}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(request.costEstimate)}
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(request.submittedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setActionDialog({ 
                                  open: true, 
                                  request, 
                                  action: "approve" 
                                });
                                setApprovedHours(request.totalHours);
                              }}
                              disabled={actionLoading === request.id}
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setActionDialog({ 
                                  open: true, 
                                  request, 
                                  action: "reject" 
                                });
                              }}
                              disabled={actionLoading === request.id}
                            >
                              <XCircle className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Approved Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Approved Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.filter(r => r.status === "approved").map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.employeeName}</div>
                          <div className="text-sm text-gray-600">{request.employeeNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                      <TableCell>{request.totalHours.toFixed(1)}h</TableCell>
                      <TableCell>{request.reason}</TableCell>
                      <TableCell>{formatCurrency(request.costEstimate)}</TableCell>
                      <TableCell>
                        {request.reviewedAt && new Date(request.reviewedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Rejected Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.filter(r => r.status === "rejected").map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{request.employeeName}</div>
                          <div className="text-sm text-gray-600">{request.employeeNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(request.date).toLocaleDateString()}</TableCell>
                      <TableCell>{request.totalHours.toFixed(1)}h</TableCell>
                      <TableCell>{request.reason}</TableCell>
                      <TableCell>{request.comments}</TableCell>
                      <TableCell>
                        {request.reviewedAt && new Date(request.reviewedAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  This Month Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Hours Approved:</span>
                  <span className="font-bold">{totalHoursThisMonth.toFixed(1)}h</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cost:</span>
                  <span className="font-bold">{formatCurrency(totalCostThisMonth)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Requests Approved:</span>
                  <span className="font-bold">{approvedThisMonth.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Average Hours/Request:</span>
                  <span className="font-bold">
                    {approvedThisMonth.length > 0 
                      ? (totalHoursThisMonth / approvedThisMonth.length).toFixed(1) 
                      : 0}h
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Top Requesters
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Implementation for top requesters analytics */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>John Smith</span>
                    <span className="font-bold">12h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mike Johnson</span>
                    <span className="font-bold">8h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lisa Davis</span>
                    <span className="font-bold">6h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Cost Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Emergency Repairs:</span>
                  <span className="font-bold">{formatCurrency(900)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Project Deadlines:</span>
                  <span className="font-bold">{formatCurrency(1200)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Maintenance:</span>
                  <span className="font-bold">{formatCurrency(600)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Request Details Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Overtime Request Details</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              {/* Employee Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Employee</Label>
                  <p className="text-sm font-medium">{selectedRequest.employeeName}</p>
                  <p className="text-sm text-gray-600">{selectedRequest.employeeNumber}</p>
                </div>
                <div>
                  <Label>Department</Label>
                  <p className="text-sm font-medium">{selectedRequest.department}</p>
                </div>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Date</Label>
                  <p className="text-sm font-medium">{new Date(selectedRequest.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label>Time</Label>
                  <p className="text-sm font-medium">
                    {formatTime(selectedRequest.startTime)} - {formatTime(selectedRequest.endTime)}
                  </p>
                </div>
                <div>
                  <Label>Total Hours</Label>
                  <p className="text-sm font-medium">{selectedRequest.totalHours.toFixed(1)}h</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Reason</Label>
                  <p className="text-sm font-medium">{selectedRequest.reason}</p>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Badge className={getPriorityColor(selectedRequest.priority)}>
                    {selectedRequest.priority}
                  </Badge>
                </div>
              </div>

              {selectedRequest.workOrderNumber && (
                <div>
                  <Label>Work Order Number</Label>
                  <Badge variant="outline">{selectedRequest.workOrderNumber}</Badge>
                </div>
              )}

              <div>
                <Label>Description</Label>
                <p className="text-sm bg-gray-50 p-3 rounded border">{selectedRequest.description}</p>
              </div>

              <div>
                <Label>Estimated Cost</Label>
                <p className="text-lg font-bold text-green-600">{formatCurrency(selectedRequest.costEstimate)}</p>
              </div>

              {selectedRequest.status === "pending" && (
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => {
                      setActionDialog({ 
                        open: true, 
                        request: selectedRequest, 
                        action: "approve" 
                      });
                      setApprovedHours(selectedRequest.totalHours);
                      setSelectedRequest(null);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    onClick={() => {
                      setActionDialog({ 
                        open: true, 
                        request: selectedRequest, 
                        action: "reject" 
                      });
                      setSelectedRequest(null);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Dialog (Approve/Reject) */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => {
        if (!open) {
          setActionDialog({ open: false, request: null, action: null });
          setActionComments("");
          setApprovedHours(0);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === "approve" ? "Approve" : "Reject"} Overtime Request
            </DialogTitle>
          </DialogHeader>
          
          {actionDialog.request && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded">
                <p className="font-medium">{actionDialog.request.employeeName}</p>
                <p className="text-sm text-gray-600">
                  {new Date(actionDialog.request.date).toLocaleDateString()} • 
                  {actionDialog.request.totalHours.toFixed(1)} hours
                </p>
              </div>

              {actionDialog.action === "approve" && (
                <div>
                  <Label htmlFor="approvedHours">Approved Hours</Label>
                  <Input
                    id="approvedHours"
                    type="number"
                    step="0.5"
                    max={actionDialog.request.totalHours}
                    value={approvedHours}
                    onChange={(e) => setApprovedHours(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Maximum: {actionDialog.request.totalHours.toFixed(1)} hours
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="comments">Comments</Label>
                <Textarea
                  id="comments"
                  value={actionComments}
                  onChange={(e) => setActionComments(e.target.value)}
                  placeholder={
                    actionDialog.action === "approve" 
                      ? "Add approval comments (optional)..."
                      : "Please provide reason for rejection..."
                  }
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={processAction}
                  disabled={actionDialog.action === "reject" && !actionComments.trim()}
                  className={`flex-1 ${
                    actionDialog.action === "approve" 
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {actionDialog.action === "approve" ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setActionDialog({ open: false, request: null, action: null })}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
