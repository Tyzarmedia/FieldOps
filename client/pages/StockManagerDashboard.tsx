import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Eye,
  Send,
  FileText,
  Calendar,
  Filter,
} from "lucide-react";

interface StockRequest {
  id: string;
  requestType: "request" | "return";
  status: "pending" | "approved" | "declined" | "partially_approved";
  technicianId: string;
  technicianName: string;
  items: {
    stockId: string;
    stockCode: string;
    stockName: string;
    requestedQty: number;
    approvedQty?: number;
    reason: string;
    condition?: string;
  }[];
  requestDate: string;
  processedDate?: string;
  processedBy?: string;
  managerComments?: string;
  priority: "low" | "medium" | "high" | "urgent";
  workOrderNumber?: string;
  totalValue: number;
  warehouse: string;
}

interface StockStats {
  pendingRequests: number;
  pendingReturns: number;
  approvedToday: number;
  declinedToday: number;
  totalValue: number;
}

export default function StockManagerDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("pending");
  const [requests, setRequests] = useState<StockRequest[]>([]);
  const [stats, setStats] = useState<StockStats>({
    pendingRequests: 0,
    pendingReturns: 0,
    approvedToday: 0,
    declinedToday: 0,
    totalValue: 0,
  });
  const [selectedRequest, setSelectedRequest] = useState<StockRequest | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    action: "approve" as "approve" | "decline" | "partial",
    comments: "",
    approvedQuantities: {} as Record<string, number>,
  });
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  const currentManager = {
    id: "mgr001",
    name: localStorage.getItem("userName") || "Stock Manager",
    role: "Stock Manager",
  };

  // Load requests and stats
  useEffect(() => {
    loadRequests();
    loadStats();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stock/requests/all");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setRequests(result.data);
        }
      }
    } catch (error) {
      console.error("Error loading requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch("/api/stock/requests/stats");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
        }
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  // Filter requests based on active tab and filter
  const filteredRequests = requests.filter(request => {
    const statusMatch = activeTab === "pending" 
      ? request.status === "pending"
      : activeTab === "approved"
      ? request.status === "approved" || request.status === "partially_approved"
      : activeTab === "declined"
      ? request.status === "declined"
      : true;

    const filterMatch = filterStatus === "all" || request.requestType === filterStatus;

    return statusMatch && filterMatch;
  });

  // Open review dialog
  const openReviewDialog = (request: StockRequest) => {
    setSelectedRequest(request);
    setReviewForm({
      action: "approve",
      comments: "",
      approvedQuantities: request.items.reduce((acc, item) => ({
        ...acc,
        [item.stockId]: item.requestedQty,
      }), {}),
    });
    setShowReviewDialog(true);
  };

  // Process request (approve/decline)
  const processRequest = async () => {
    if (!selectedRequest || !reviewForm.comments.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide comments for your decision.",
      });
      return;
    }

    try {
      const response = await fetch(`/api/stock/requests/${selectedRequest.id}/process`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: reviewForm.action,
          managerComments: reviewForm.comments,
          processedBy: currentManager.name,
          processedDate: new Date().toISOString(),
          approvedQuantities: reviewForm.action === "partial" ? reviewForm.approvedQuantities : undefined,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          toast({
            title: "Request Processed",
            description: `Request has been ${reviewForm.action}d successfully.`,
          });

          // Send notification to technician
          await sendNotificationToTechnician(selectedRequest, reviewForm.action, reviewForm.comments);

          // Refresh data
          await loadRequests();
          await loadStats();

          // Close dialog
          setShowReviewDialog(false);
          setSelectedRequest(null);
        }
      } else {
        throw new Error("Failed to process request");
      }
    } catch (error) {
      console.error("Error processing request:", error);
      toast({
        title: "Processing Failed",
        description: "Failed to process the request. Please try again.",
      });
    }
  };

  // Send notification to technician
  const sendNotificationToTechnician = async (
    request: StockRequest,
    action: string,
    comments: string
  ) => {
    try {
      await fetch("/api/notifications/stock-request-processed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicianId: request.technicianId,
          requestId: request.id,
          action,
          managerComments: comments,
          processedBy: currentManager.name,
          processedDate: new Date().toISOString(),
          requestType: request.requestType,
          items: request.items,
        }),
      });
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "partially_approved":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return CheckCircle;
      case "declined":
        return XCircle;
      case "pending":
        return Clock;
      case "partially_approved":
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white";
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Stock Manager Dashboard</h1>
            <p className="text-green-100">Review and process stock requests</p>
          </div>
          <Package className="h-10 w-10" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Returns</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.pendingReturns}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved Today</p>
                  <p className="text-2xl font-bold text-green-600">{stats.approvedToday}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Declined Today</p>
                  <p className="text-2xl font-bold text-red-600">{stats.declinedToday}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-purple-600">R{stats.totalValue.toFixed(2)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Requests Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Stock Requests Management</CardTitle>
              <div className="flex items-center gap-2">
                <Label>Filter:</Label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="request">Requests Only</option>
                  <option value="return">Returns Only</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="pending">⏳ Pending ({requests.filter(r => r.status === "pending").length})</TabsTrigger>
                <TabsTrigger value="approved">✅ Approved ({requests.filter(r => r.status === "approved" || r.status === "partially_approved").length})</TabsTrigger>
                <TabsTrigger value="declined">❌ Declined ({requests.filter(r => r.status === "declined").length})</TabsTrigger>
                <TabsTrigger value="all">📋 All Requests</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading requests...</p>
                  </div>
                ) : filteredRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">No requests found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredRequests.map((request) => {
                      const StatusIcon = getStatusIcon(request.status);
                      return (
                        <div key={request.id} className="border rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium">#{request.id}</h3>
                                <Badge className={getPriorityColor(request.priority)}>
                                  {request.priority.toUpperCase()}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span className="flex items-center gap-1">
                                  <UserCheck className="h-4 w-4" />
                                  {request.technicianName}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {new Date(request.requestDate).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Package className="h-4 w-4" />
                                  {request.requestType === "request" ? "Request" : "Return"}
                                </span>
                                {request.workOrderNumber && (
                                  <span className="flex items-center gap-1">
                                    <FileText className="h-4 w-4" />
                                    WO: {request.workOrderNumber}
                                  </span>
                                )}
                              </div>
                            </div>
                            <Badge className={getStatusColor(request.status)}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {request.status.replace("_", " ").toUpperCase()}
                            </Badge>
                          </div>

                          {/* Items */}
                          <div className="space-y-2 mb-3">
                            {request.items.map((item, index) => (
                              <div key={index} className="bg-gray-50 p-3 rounded">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">{item.stockCode}</p>
                                    <p className="text-sm text-gray-600">{item.stockName}</p>
                                    <p className="text-xs text-gray-500">{item.reason}</p>
                                    {item.condition && (
                                      <p className="text-xs text-blue-600">Condition: {item.condition}</p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">
                                      {item.approvedQty !== undefined 
                                        ? `${item.approvedQty}/${item.requestedQty}` 
                                        : item.requestedQty} units
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Manager Comments */}
                          {request.managerComments && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
                              <div className="flex items-center gap-2 mb-1">
                                <MessageSquare className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">Manager Comments:</span>
                              </div>
                              <p className="text-sm text-blue-700">{request.managerComments}</p>
                              {request.processedBy && (
                                <p className="text-xs text-blue-600 mt-1">
                                  By {request.processedBy} on {request.processedDate && new Date(request.processedDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-gray-500">
                              Total Value: R{request.totalValue.toFixed(2)}
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                              {request.status === "pending" && (
                                <Button
                                  size="sm"
                                  onClick={() => openReviewDialog(request)}
                                >
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Review
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Request #{selectedRequest?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedRequest && (
              <>
                {/* Request Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Technician:</span> {selectedRequest.technicianName}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {selectedRequest.requestType}
                    </div>
                    <div>
                      <span className="font-medium">Priority:</span> {selectedRequest.priority}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {new Date(selectedRequest.requestDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Items Review */}
                <div className="space-y-3">
                  <Label>Items Requested:</Label>
                  {selectedRequest.items.map((item, index) => (
                    <div key={index} className="border p-3 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{item.stockCode}</p>
                          <p className="text-sm text-gray-600">{item.stockName}</p>
                          <p className="text-xs text-gray-500">{item.reason}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Requested: {item.requestedQty} units</p>
                        </div>
                      </div>
                      
                      {reviewForm.action === "partial" && (
                        <div className="mt-2">
                          <Label className="text-sm">Approve Quantity:</Label>
                          <Input
                            type="number"
                            max={item.requestedQty}
                            value={reviewForm.approvedQuantities[item.stockId] || 0}
                            onChange={(e) => setReviewForm(prev => ({
                              ...prev,
                              approvedQuantities: {
                                ...prev.approvedQuantities,
                                [item.stockId]: parseInt(e.target.value) || 0,
                              }
                            }))}
                            className="mt-1"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Selection */}
                <div className="space-y-2">
                  <Label>Decision:</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={reviewForm.action === "approve" ? "default" : "outline"}
                      onClick={() => setReviewForm(prev => ({ ...prev, action: "approve" }))}
                      className="flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve All
                    </Button>
                    <Button
                      variant={reviewForm.action === "partial" ? "default" : "outline"}
                      onClick={() => setReviewForm(prev => ({ ...prev, action: "partial" }))}
                      className="flex-1"
                    >
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Partial Approval
                    </Button>
                    <Button
                      variant={reviewForm.action === "decline" ? "destructive" : "outline"}
                      onClick={() => setReviewForm(prev => ({ ...prev, action: "decline" }))}
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                </div>

                {/* Comments */}
                <div className="space-y-2">
                  <Label>Comments (Required) *</Label>
                  <Textarea
                    placeholder="Provide detailed feedback for your decision..."
                    value={reviewForm.comments}
                    onChange={(e) => setReviewForm(prev => ({ ...prev, comments: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={processRequest} className="flex-1">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Decision
                  </Button>
                  <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
