import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import {
  Clock,
  Plus,
  Send,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  X,
  Eye,
  Upload,
} from "lucide-react";

interface OvertimeRequest {
  id: string;
  employeeId: string;
  employeeName: string;
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
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    uploadDate: string;
  }>;
}

interface OvertimeRequestFormData {
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  supervisor: string;
  workOrderNumber: string;
  description: string;
}

export default function OvertimeRequestScreen() {
  const [requests, setRequests] = useState<OvertimeRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<OvertimeRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OvertimeRequestFormData>({
    date: new Date().toISOString().split('T')[0],
    startTime: "",
    endTime: "",
    reason: "",
    supervisor: "",
    workOrderNumber: "",
    description: "",
  });

  // Mock employee data - would come from auth context
  const currentEmployee = {
    id: "E001",
    name: "John Smith",
    department: "Field Operations",
    supervisor: "Sarah Wilson",
  };

  useEffect(() => {
    loadOvertimeRequests();
  }, []);

  const loadOvertimeRequests = async () => {
    try {
      setLoading(true);
      // Load overtime requests for current employee
      const response = await fetch(`/api/overtime/requests/${currentEmployee.id}`);
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      } else {
        // Mock data for demonstration
        setRequests([
          {
            id: "OTR001",
            employeeId: currentEmployee.id,
            employeeName: currentEmployee.name,
            date: "2025-01-15",
            startTime: "17:00",
            endTime: "20:00",
            totalHours: 3,
            reason: "Emergency repair",
            supervisor: "Sarah Wilson",
            workOrderNumber: "WO-2025-001",
            description: "Urgent fiber cable repair on Main Street",
            status: "approved",
            submittedAt: "2025-01-15T16:30:00Z",
            reviewedAt: "2025-01-15T18:00:00Z",
            reviewedBy: "Sarah Wilson",
            comments: "Approved due to emergency nature",
          },
          {
            id: "OTR002",
            employeeId: currentEmployee.id,
            employeeName: currentEmployee.name,
            date: "2025-01-20",
            startTime: "18:00",
            endTime: "22:00",
            totalHours: 4,
            reason: "Project deadline",
            supervisor: "Sarah Wilson",
            workOrderNumber: "WO-2025-015",
            description: "Complete installation before client deadline",
            status: "pending",
            submittedAt: "2025-01-20T14:00:00Z",
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading overtime requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateHours = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    
    if (end < start) {
      // Handle next day scenario
      end.setDate(end.getDate() + 1);
    }
    
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.date) errors.push("Date is required");
    if (!formData.startTime) errors.push("Start time is required");
    if (!formData.endTime) errors.push("End time is required");
    if (!formData.reason) errors.push("Reason is required");
    if (!formData.supervisor) errors.push("Supervisor is required");
    if (!formData.description) errors.push("Description is required");
    
    const hours = calculateHours(formData.startTime, formData.endTime);
    if (hours <= 0) errors.push("End time must be after start time");
    if (hours > 12) errors.push("Overtime cannot exceed 12 hours per day");
    
    const requestDate = new Date(formData.date);
    const today = new Date();
    const daysDiff = Math.ceil((requestDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 30) errors.push("Cannot request overtime more than 30 days in advance");
    if (daysDiff < -7) errors.push("Cannot request overtime for dates more than 7 days ago");
    
    return errors;
  };

  const submitRequest = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      alert("Please fix the following errors:\n" + errors.join("\n"));
      return;
    }

    try {
      setLoading(true);
      
      const newRequest: Omit<OvertimeRequest, "id"> = {
        employeeId: currentEmployee.id,
        employeeName: currentEmployee.name,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        totalHours: calculateHours(formData.startTime, formData.endTime),
        reason: formData.reason,
        supervisor: formData.supervisor,
        workOrderNumber: formData.workOrderNumber || undefined,
        description: formData.description,
        status: "pending",
        submittedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/overtime/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRequest),
      });

      if (response.ok) {
        const data = await response.json();
        setRequests(prev => [{ ...newRequest, id: data.id }, ...prev]);
        setShowForm(false);
        setFormData({
          date: new Date().toISOString().split('T')[0],
          startTime: "",
          endTime: "",
          reason: "",
          supervisor: "",
          workOrderNumber: "",
          description: "",
        });
        alert("Overtime request submitted successfully!");
      } else {
        throw new Error("Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting overtime request:", error);
      alert("Error submitting request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (requestId: string) => {
    if (!confirm("Are you sure you want to cancel this overtime request?")) {
      return;
    }

    try {
      const response = await fetch(`/api/overtime/requests/${requestId}/cancel`, {
        method: "PUT",
      });

      if (response.ok) {
        setRequests(prev => 
          prev.map(req => 
            req.id === requestId 
              ? { ...req, status: "cancelled" as const }
              : req
          )
        );
        alert("Overtime request cancelled successfully!");
      } else {
        throw new Error("Failed to cancel request");
      }
    } catch (error) {
      console.error("Error cancelling request:", error);
      alert("Error cancelling request. Please try again.");
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <X className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "cancelled": return <X className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}:00`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Overtime Requests</h1>
            <p className="text-gray-600 mt-1">Submit and track your overtime requests</p>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold">{requests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{requests.filter(r => r.status === "approved").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{requests.filter(r => r.status === "pending").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold">
                  {requests
                    .filter(r => r.status === "approved" && new Date(r.date).getMonth() === new Date().getMonth())
                    .reduce((sum, r) => sum + r.totalHours, 0)
                    .toFixed(1)}h
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Your Overtime Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No overtime requests found</p>
              <Button 
                onClick={() => setShowForm(true)} 
                variant="outline" 
                className="mt-4"
              >
                Submit Your First Request
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Work Order</TableHead>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      {new Date(request.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatTime(request.startTime)} - {formatTime(request.endTime)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {request.totalHours.toFixed(1)}h
                    </TableCell>
                    <TableCell>{request.reason}</TableCell>
                    <TableCell>
                      {request.workOrderNumber && (
                        <Badge variant="outline">{request.workOrderNumber}</Badge>
                      )}
                    </TableCell>
                    <TableCell>{request.supervisor}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1">{request.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {request.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => cancelRequest(request.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* New Request Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Overtime Request</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="supervisor">Supervisor *</Label>
                <Select 
                  value={formData.supervisor} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, supervisor: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                    <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                    <SelectItem value="Lisa Davis">Lisa Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                />
              </div>
              <div>
                <Label>Total Hours</Label>
                <div className="p-2 bg-gray-50 rounded border text-center font-medium">
                  {calculateHours(formData.startTime, formData.endTime).toFixed(1)}h
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reason">Reason *</Label>
                <Select 
                  value={formData.reason} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Emergency repair">Emergency repair</SelectItem>
                    <SelectItem value="Project deadline">Project deadline</SelectItem>
                    <SelectItem value="Customer request">Customer request</SelectItem>
                    <SelectItem value="Equipment maintenance">Equipment maintenance</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="workOrderNumber">Work Order Number</Label>
                <Input
                  id="workOrderNumber"
                  value={formData.workOrderNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, workOrderNumber: e.target.value }))}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Provide detailed description of the overtime work..."
                rows={3}
              />
            </div>

            {calculateHours(formData.startTime, formData.endTime) > 0 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Overtime requests must be approved by your supervisor before the scheduled date.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-3 pt-4">
              <Button onClick={submitRequest} disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Request
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Overtime Request Details</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <p className="text-sm font-medium">{new Date(selectedRequest.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedRequest.status)}>
                    {getStatusIcon(selectedRequest.status)}
                    <span className="ml-1">{selectedRequest.status}</span>
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Start Time</Label>
                  <p className="text-sm font-medium">{formatTime(selectedRequest.startTime)}</p>
                </div>
                <div>
                  <Label>End Time</Label>
                  <p className="text-sm font-medium">{formatTime(selectedRequest.endTime)}</p>
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
                  <Label>Supervisor</Label>
                  <p className="text-sm font-medium">{selectedRequest.supervisor}</p>
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
                <p className="text-sm">{selectedRequest.description}</p>
              </div>

              <div>
                <Label>Submitted</Label>
                <p className="text-sm text-gray-600">
                  {new Date(selectedRequest.submittedAt).toLocaleString()}
                </p>
              </div>

              {selectedRequest.reviewedAt && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Reviewed By</Label>
                    <p className="text-sm font-medium">{selectedRequest.reviewedBy}</p>
                  </div>
                  <div>
                    <Label>Reviewed Date</Label>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedRequest.reviewedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {selectedRequest.comments && (
                <div>
                  <Label>Comments</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded border">{selectedRequest.comments}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {selectedRequest.status === "pending" && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      cancelRequest(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel Request
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
