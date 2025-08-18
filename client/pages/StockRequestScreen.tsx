import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Package,
  Plus,
  Send,
  Undo2,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MessageSquare,
  Eye,
  RotateCcw,
} from "lucide-react";

interface StockItem {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  warehouseQty: number;
  technicianQty: number;
  minLevel: number;
  maxLevel: number;
}

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
  }[];
  requestDate: string;
  processedDate?: string;
  processedBy?: string;
  managerComments?: string;
  priority: "low" | "medium" | "high" | "urgent";
  workOrderNumber?: string;
  totalValue: number;
}

export default function StockRequestScreen() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("request");
  const [availableStock, setAvailableStock] = useState<StockItem[]>([]);
  const [myRequests, setMyRequests] = useState<StockRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showReturnDialog, setShowReturnDialog] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Request form data
  const [requestForm, setRequestForm] = useState({
    stockId: "",
    quantity: "",
    reason: "",
    priority: "medium",
    workOrderNumber: "",
    notes: "",
  });

  // Return form data
  const [returnForm, setReturnForm] = useState({
    stockId: "",
    quantity: "",
    reason: "",
    condition: "good",
    notes: "",
  });

  const currentTechnician = {
    id: localStorage.getItem("employeeId") || "tech001",
    name: localStorage.getItem("userName") || "John Doe",
    warehouse: "WH-EL-001",
  };

  // Load available stock
  useEffect(() => {
    const loadStockData = async () => {
      try {
        setLoading(true);
        
        // Load available stock
        const stockResponse = await fetch(`/api/stock/available/${currentTechnician.warehouse}`);
        if (stockResponse.ok) {
          const stockResult = await stockResponse.json();
          if (stockResult.success) {
            setAvailableStock(stockResult.data);
          }
        }

        // Load technician's requests
        const requestsResponse = await fetch(`/api/stock/requests/${currentTechnician.id}`);
        if (requestsResponse.ok) {
          const requestsResult = await requestsResponse.json();
          if (requestsResult.success) {
            setMyRequests(requestsResult.data);
          }
        }

      } catch (error) {
        console.error("Error loading stock data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStockData();
  }, [currentTechnician.id, currentTechnician.warehouse]);

  // Filter stock based on search
  const filteredStock = availableStock.filter(stock =>
    stock.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Submit stock request
  const submitStockRequest = async () => {
    if (!requestForm.stockId || !requestForm.quantity || !requestForm.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      const stock = availableStock.find(s => s.id === requestForm.stockId);
      if (!stock) {
        toast({
          title: "Stock Not Found",
          description: "Selected stock item could not be found.",
        });
        return;
      }

      const response = await fetch("/api/stock/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: "request",
          technicianId: currentTechnician.id,
          technicianName: currentTechnician.name,
          warehouse: currentTechnician.warehouse,
          items: [{
            stockId: requestForm.stockId,
            stockCode: stock.code,
            stockName: stock.name,
            requestedQty: parseInt(requestForm.quantity),
            reason: requestForm.reason,
          }],
          priority: requestForm.priority,
          workOrderNumber: requestForm.workOrderNumber,
          notes: requestForm.notes,
          totalValue: stock.technicianQty * parseInt(requestForm.quantity), // Estimated value
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          toast({
            title: "Request Submitted",
            description: `Stock request #${result.requestId} has been sent to the manager for approval.`,
          });

          // Reset form and close dialog
          setRequestForm({
            stockId: "",
            quantity: "",
            reason: "",
            priority: "medium",
            workOrderNumber: "",
            notes: "",
          });
          setShowRequestDialog(false);
          setSelectedStock(null);

          // Refresh requests
          const requestsResponse = await fetch(`/api/stock/requests/${currentTechnician.id}`);
          if (requestsResponse.ok) {
            const requestsResult = await requestsResponse.json();
            if (requestsResult.success) {
              setMyRequests(requestsResult.data);
            }
          }
        }
      } else {
        throw new Error("Failed to submit request");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      toast({
        title: "Request Failed",
        description: "Failed to submit stock request. Please try again.",
      });
    }
  };

  // Submit stock return
  const submitStockReturn = async () => {
    if (!returnForm.stockId || !returnForm.quantity || !returnForm.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      const stock = availableStock.find(s => s.id === returnForm.stockId);
      if (!stock) {
        toast({
          title: "Stock Not Found",
          description: "Selected stock item could not be found.",
        });
        return;
      }

      if (parseInt(returnForm.quantity) > stock.technicianQty) {
        toast({
          title: "Insufficient Stock",
          description: `You only have ${stock.technicianQty} units available to return.`,
        });
        return;
      }

      const response = await fetch("/api/stock/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestType: "return",
          technicianId: currentTechnician.id,
          technicianName: currentTechnician.name,
          warehouse: currentTechnician.warehouse,
          items: [{
            stockId: returnForm.stockId,
            stockCode: stock.code,
            stockName: stock.name,
            requestedQty: parseInt(returnForm.quantity),
            reason: returnForm.reason,
            condition: returnForm.condition,
          }],
          priority: "medium",
          notes: returnForm.notes,
          totalValue: stock.technicianQty * parseInt(returnForm.quantity),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          toast({
            title: "Return Submitted",
            description: `Stock return #${result.requestId} has been sent to the manager for processing.`,
          });

          // Reset form and close dialog
          setReturnForm({
            stockId: "",
            quantity: "",
            reason: "",
            condition: "good",
            notes: "",
          });
          setShowReturnDialog(false);
          setSelectedStock(null);

          // Refresh requests
          const requestsResponse = await fetch(`/api/stock/requests/${currentTechnician.id}`);
          if (requestsResponse.ok) {
            const requestsResult = await requestsResponse.json();
            if (requestsResult.success) {
              setMyRequests(requestsResult.data);
            }
          }
        }
      } else {
        throw new Error("Failed to submit return");
      }
    } catch (error) {
      console.error("Error submitting return:", error);
      toast({
        title: "Return Failed",
        description: "Failed to submit stock return. Please try again.",
      });
    }
  };

  // Resubmit declined request
  const resubmitRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/stock/requests/${requestId}/resubmit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technicianId: currentTechnician.id,
          resubmitDate: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast({
          title: "Request Resubmitted",
          description: "Your request has been resubmitted for review.",
        });

        // Refresh requests
        const requestsResponse = await fetch(`/api/stock/requests/${currentTechnician.id}`);
        if (requestsResponse.ok) {
          const requestsResult = await requestsResponse.json();
          if (requestsResult.success) {
            setMyRequests(requestsResult.data);
          }
        }
      }
    } catch (error) {
      console.error("Error resubmitting request:", error);
      toast({
        title: "Resubmit Failed",
        description: "Failed to resubmit request. Please try again.",
      });
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
        return AlertCircle;
      default:
        return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Stock Management</h1>
              <p className="text-sm opacity-90">Request and return stock items</p>
            </div>
          </div>
          <Package className="h-8 w-8" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="request">📦 Request Stock</TabsTrigger>
            <TabsTrigger value="return">↩️ Return Stock</TabsTrigger>
            <TabsTrigger value="history">📋 My Requests</TabsTrigger>
          </TabsList>

          {/* Request Stock Tab */}
          <TabsContent value="request" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Request New Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Search Stock Items</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search by code, name, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 max-h-60 overflow-y-auto">
                    {filteredStock.map((stock) => (
                      <div
                        key={stock.id}
                        className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setSelectedStock(stock);
                          setRequestForm(prev => ({ ...prev, stockId: stock.id }));
                          setShowRequestDialog(true);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{stock.code}</p>
                            <p className="text-sm text-gray-600">{stock.name}</p>
                            <p className="text-xs text-gray-500">{stock.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              Warehouse: {stock.warehouseQty}
                            </p>
                            <p className="text-sm text-blue-600">
                              On Hand: {stock.technicianQty}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Return Stock Tab */}
          <TabsContent value="return" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Undo2 className="h-5 w-5" />
                  Return Stock Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Search My Stock</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search your stock to return..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 max-h-60 overflow-y-auto">
                    {filteredStock.filter(stock => stock.technicianQty > 0).map((stock) => (
                      <div
                        key={stock.id}
                        className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => {
                          setSelectedStock(stock);
                          setReturnForm(prev => ({ ...prev, stockId: stock.id }));
                          setShowReturnDialog(true);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{stock.code}</p>
                            <p className="text-sm text-gray-600">{stock.name}</p>
                            <p className="text-xs text-gray-500">{stock.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">
                              {stock.technicianQty} {stock.unit}
                            </p>
                            <p className="text-xs text-gray-500">Available to return</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Request History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {myRequests.map((request) => {
                    const StatusIcon = getStatusIcon(request.status);
                    return (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium">#{request.id}</p>
                            <p className="text-sm text-gray-600">
                              {request.requestType === "request" ? "Stock Request" : "Stock Return"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(request.requestDate).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className={getStatusColor(request.status)}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {request.status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          {request.items.map((item, index) => (
                            <div key={index} className="bg-gray-50 p-2 rounded">
                              <div className="flex justify-between">
                                <span className="text-sm font-medium">{item.stockCode}</span>
                                <span className="text-sm">
                                  {item.approvedQty !== undefined 
                                    ? `${item.approvedQty}/${item.requestedQty}` 
                                    : item.requestedQty} units
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">{item.reason}</p>
                            </div>
                          ))}
                        </div>

                        {request.managerComments && (
                          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
                            <div className="flex items-center gap-2 mb-1">
                              <MessageSquare className="h-4 w-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">Manager Comments:</span>
                            </div>
                            <p className="text-sm text-blue-700">{request.managerComments}</p>
                          </div>
                        )}

                        <div className="flex justify-between items-center mt-3">
                          <div className="text-xs text-gray-500">
                            {request.processedBy && (
                              <>Processed by {request.processedBy}</>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {request.status === "declined" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => resubmitRequest(request.id)}
                              >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Resubmit
                              </Button>
                            )}
                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Stock: {selectedStock?.code}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">{selectedStock?.name}</p>
              <p className="text-sm text-gray-600">Available: {selectedStock?.warehouseQty} {selectedStock?.unit}</p>
            </div>

            <div className="space-y-2">
              <Label>Quantity Requested *</Label>
              <Input
                type="number"
                placeholder="Enter quantity"
                value={requestForm.quantity}
                onChange={(e) => setRequestForm(prev => ({ ...prev, quantity: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Reason for Request *</Label>
              <Textarea
                placeholder="Explain why you need this stock..."
                value={requestForm.reason}
                onChange={(e) => setRequestForm(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={requestForm.priority} onValueChange={(value) => setRequestForm(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Work Order Number</Label>
              <Input
                placeholder="Associated work order (optional)"
                value={requestForm.workOrderNumber}
                onChange={(e) => setRequestForm(prev => ({ ...prev, workOrderNumber: e.target.value }))}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={submitStockRequest} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Submit Request
              </Button>
              <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={showReturnDialog} onOpenChange={setShowReturnDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Return Stock: {selectedStock?.code}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium">{selectedStock?.name}</p>
              <p className="text-sm text-gray-600">You have: {selectedStock?.technicianQty} {selectedStock?.unit}</p>
            </div>

            <div className="space-y-2">
              <Label>Quantity to Return *</Label>
              <Input
                type="number"
                placeholder="Enter quantity"
                max={selectedStock?.technicianQty}
                value={returnForm.quantity}
                onChange={(e) => setReturnForm(prev => ({ ...prev, quantity: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Condition</Label>
              <Select value={returnForm.condition} onValueChange={(value) => setReturnForm(prev => ({ ...prev, condition: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="good">Good Condition</SelectItem>
                  <SelectItem value="fair">Fair Condition</SelectItem>
                  <SelectItem value="poor">Poor Condition</SelectItem>
                  <SelectItem value="damaged">Damaged</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Reason for Return *</Label>
              <Textarea
                placeholder="Explain why you're returning this stock..."
                value={returnForm.reason}
                onChange={(e) => setReturnForm(prev => ({ ...prev, reason: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={submitStockReturn} className="flex-1">
                <Undo2 className="h-4 w-4 mr-2" />
                Submit Return
              </Button>
              <Button variant="outline" onClick={() => setShowReturnDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
