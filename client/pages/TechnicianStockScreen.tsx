import { useState, useEffect } from "react";
import { useNotification } from "@/components/ui/notification";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Package,
  Search,
  User,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingDown,
  ArrowLeft,
  RefreshCw,
  Plus,
  Minus,
  Archive,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Trash2,
} from "lucide-react";

interface TechnicianStock {
  id: string;
  itemId: string;
  itemName: string;
  itemDescription: string;
  itemSku: string;
  category: string;
  unit: string;
  assignedQuantity: number;
  usedQuantity: number;
  remainingQuantity: number;
  assignedDate: string;
  assignedBy: string;
  status: "assigned" | "in-use" | "returned" | "depleted";
  notes?: string;
  unitPrice: number;
}

interface StockUsage {
  id: string;
  itemId: string;
  itemName: string;
  quantityUsed: number;
  usageDate: string;
  jobId?: string;
  jobTitle?: string;
  notes?: string;
}

export default function TechnicianStockScreen() {
  const { success, error } = useNotification();
  const [stockItems, setStockItems] = useState<TechnicianStock[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load assigned stock from API
  useEffect(() => {
    const loadAssignedStock = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          "/api/stock-management/assignments/technician/tech001",
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const mappedItems = data.data.map((assignment) => ({
              id: assignment.id,
              itemId: assignment.itemId,
              itemName: assignment.itemName,
              itemDescription: `Assigned ${assignment.itemName}`,
              itemSku: `SKU-${assignment.itemId}`,
              category: "Equipment",
              unit: "units",
              assignedQuantity: assignment.assignedQuantity,
              usedQuantity: assignment.usedQuantity,
              remainingQuantity: assignment.remainingQuantity,
              assignedDate: assignment.assignedDate,
              assignedBy: assignment.assignedBy,
              status: assignment.status,
              notes: assignment.notes,
              unitPrice: 0,
            }));
            setStockItems(mappedItems);
          } else {
            // Use fallback data if no assignments found
            setStockItems(fallbackStockItems);
          }
        } else {
          setStockItems(fallbackStockItems);
        }
      } catch (error) {
        console.error("Error loading assigned stock:", error);
        // Use fallback data on error
        setStockItems(fallbackStockItems);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssignedStock();
  }, [fallbackStockItems]);

  const [fallbackStockItems] = useState<TechnicianStock[]>([
    {
      id: "ts1",
      itemId: "1",
      itemName: "Fiber Optic Cable",
      itemDescription: "Single-mode fiber optic cable for FTTH installations",
      itemSku: "FOC-SM-1000",
      category: "Cables",
      unit: "meters",
      assignedQuantity: 500,
      usedQuantity: 200,
      remainingQuantity: 300,
      assignedDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      assignedBy: "Stock Manager",
      status: "in-use",
      notes: "For weekly FTTH installations",
      unitPrice: 2.5,
    },
    {
      id: "ts2",
      itemId: "2",
      itemName: "Splice Protectors",
      itemDescription: "Heat shrink splice protectors for fiber connections",
      itemSku: "SP-HS-100",
      category: "Connectors",
      unit: "pieces",
      assignedQuantity: 100,
      usedQuantity: 75,
      remainingQuantity: 25,
      assignedDate: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      assignedBy: "Stock Manager",
      status: "in-use",
      unitPrice: 0.75,
    },
    {
      id: "ts3",
      itemId: "4",
      itemName: "Cable Ties",
      itemDescription: "UV resistant cable ties for outdoor installations",
      itemSku: "CT-UV-200",
      category: "Hardware",
      unit: "packs",
      assignedQuantity: 10,
      usedQuantity: 8,
      remainingQuantity: 2,
      assignedDate: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      assignedBy: "Stock Manager",
      status: "in-use",
      unitPrice: 12.0,
    },
    {
      id: "ts4",
      itemId: "5",
      itemName: "Wall Sockets",
      itemDescription: "Fiber optic wall outlet for indoor termination",
      itemSku: "WS-FO-WH",
      category: "Installation",
      unit: "units",
      assignedQuantity: 20,
      usedQuantity: 5,
      remainingQuantity: 15,
      assignedDate: new Date().toISOString(),
      assignedBy: "Stock Manager",
      status: "assigned",
      unitPrice: 15.5,
    },
  ]);

  const [stockUsageHistory, setStockUsageHistory] = useState<StockUsage[]>([
    {
      id: "su1",
      itemId: "1",
      itemName: "Fiber Optic Cable",
      quantityUsed: 50,
      usageDate: new Date().toISOString(),
      jobId: "SA-688808",
      jobTitle: "FTTH - Maintenance",
      notes: "Used for customer installation",
    },
    {
      id: "su2",
      itemId: "2",
      itemName: "Splice Protectors",
      quantityUsed: 25,
      usageDate: new Date(Date.now() - 86400000).toISOString(),
      jobId: "SA-689001",
      jobTitle: "Emergency Fiber Repair",
      notes: "Emergency repair work",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState<TechnicianStock | null>(
    null,
  );
  const [showUsageDialog, setShowUsageDialog] = useState(false);
  const [showBulkAllocateDialog, setShowBulkAllocateDialog] = useState(false);
  const [usageData, setUsageData] = useState({
    quantity: 0,
    jobId: "",
    notes: "",
  });
  const [bulkAllocations, setBulkAllocations] = useState([]);
  const [selectedJobForBulk, setSelectedJobForBulk] = useState("");
  const navigate = useNavigate();

  const currentTechnicianId = "tech001"; // In real app, this would come from auth
  const currentTechnicianName = "Dyondzani Clement Masinge";

  const filteredStockItems = stockItems.filter(
    (item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemSku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "in-use":
        return "bg-green-100 text-green-800";
      case "returned":
        return "bg-gray-100 text-gray-800";
      case "depleted":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "assigned":
        return <Package className="h-4 w-4" />;
      case "in-use":
        return <CheckCircle className="h-4 w-4" />;
      case "returned":
        return <Archive className="h-4 w-4" />;
      case "depleted":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStockLevelColor = (remaining: number, assigned: number) => {
    const percentage = (remaining / assigned) * 100;
    if (percentage > 50) return "text-green-600";
    if (percentage > 20) return "text-yellow-600";
    return "text-red-600";
  };

  const recordStockUsage = async () => {
    if (
      !selectedItem ||
      usageData.quantity <= 0 ||
      usageData.quantity > selectedItem.remainingQuantity
    ) {
      return;
    }

    try {
      // Record usage via API
      const response = await fetch("/api/stock/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignmentId: selectedItem.id,
          quantityUsed: usageData.quantity,
          jobId: usageData.jobId,
          notes: usageData.notes,
          technicianId: currentTechnicianId,
        }),
      });

      if (response.ok) {
        // Add usage record locally
        const newUsage: StockUsage = {
          id: Date.now().toString(),
          itemId: selectedItem.itemId,
          itemName: selectedItem.itemName,
          quantityUsed: usageData.quantity,
          usageDate: new Date().toISOString(),
          jobId: usageData.jobId || undefined,
          notes: usageData.notes || undefined,
        };

        setStockUsageHistory((prev) => [newUsage, ...prev]);

        // Update stock item locally
        setStockItems((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id
              ? {
                  ...item,
                  usedQuantity: item.usedQuantity + usageData.quantity,
                  remainingQuantity:
                    item.remainingQuantity - usageData.quantity,
                  status:
                    item.remainingQuantity - usageData.quantity === 0
                      ? "depleted"
                      : "in-use",
                }
              : item,
          ),
        );

        success("Success", "Stock usage recorded and updated in warehouse!");
      } else {
        error("Error", "Failed to record stock usage");
      }
    } catch (error) {
      console.error("Error recording stock usage:", error);
      error("Error", "Error recording stock usage");
    }

    // Reset form
    setUsageData({ quantity: 0, jobId: "", notes: "" });
    setShowUsageDialog(false);
    setSelectedItem(null);
  };

  const addToBulkAllocation = (itemId) => {
    const item = stockItems.find((i) => i.id === itemId);
    if (item && !bulkAllocations.find((ba) => ba.itemId === itemId)) {
      setBulkAllocations([
        ...bulkAllocations,
        {
          id: Date.now().toString(),
          itemId: item.id,
          itemName: item.itemName,
          remainingQuantity: item.remainingQuantity,
          allocateQuantity: 1,
          notes: "",
        },
      ]);
    }
  };

  const removeBulkAllocationItem = (bulkItemId) => {
    setBulkAllocations(bulkAllocations.filter((ba) => ba.id !== bulkItemId));
  };

  const updateBulkAllocationQuantity = (bulkItemId, quantity) => {
    setBulkAllocations(
      bulkAllocations.map((ba) =>
        ba.id === bulkItemId
          ? { ...ba, allocateQuantity: parseInt(quantity) || 0 }
          : ba,
      ),
    );
  };

  const updateBulkAllocationNotes = (bulkItemId, notes) => {
    setBulkAllocations(
      bulkAllocations.map((ba) =>
        ba.id === bulkItemId ? { ...ba, notes } : ba,
      ),
    );
  };

  const processBulkAllocation = async () => {
    if (!selectedJobForBulk || bulkAllocations.length === 0) {
      error(
        "Validation Error",
        "Please select a job and add items to allocate",
      );
      return;
    }

    try {
      for (const bulkItem of bulkAllocations) {
        if (bulkItem.allocateQuantity > 0) {
          const response = await fetch("/api/stock-management/usage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              assignmentId: bulkItem.itemId,
              quantityUsed: bulkItem.allocateQuantity,
              jobId: selectedJobForBulk,
              jobTitle: `Bulk allocation for ${selectedJobForBulk}`,
              notes: bulkItem.notes || "Bulk allocation",
              technicianId: currentTechnicianId,
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to allocate ${bulkItem.itemName}`);
          }
        }
      }

      // Reset bulk allocation state
      setBulkAllocations([]);
      setSelectedJobForBulk("");
      setShowBulkAllocateDialog(false);

      success(
        "Success",
        `Successfully allocated ${bulkAllocations.length} items to job ${selectedJobForBulk}!`,
      );

      // Refresh the page to show updated stock
      window.location.reload();
    } catch (error) {
      console.error("Error during bulk allocation:", error);
      error("Error", "Some allocations failed. Please check the logs.");
    }
  };

  const stats = {
    totalItems: stockItems.length,
    activeItems: stockItems.filter(
      (item) => item.status === "assigned" || item.status === "in-use",
    ).length,
    depletedItems: stockItems.filter((item) => item.status === "depleted")
      .length,
    totalValue: stockItems.reduce(
      (sum, item) => sum + item.remainingQuantity * item.unitPrice,
      0,
    ),
    lowStockItems: stockItems.filter((item) => {
      const percentage = (item.remainingQuantity / item.assignedQuantity) * 100;
      return percentage > 0 && percentage <= 20;
    }).length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold">My Stock</h1>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/mobile-add-stock")}
            >
              <Plus className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setShowBulkAllocateDialog(true)}
            >
              <Package className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Technician Info */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold">{currentTechnicianName}</h2>
          <p className="text-white/80">Technician ID: {currentTechnicianId}</p>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <Input
              placeholder="Search stock items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="p-4 grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Package className="h-6 w-6 mx-auto mb-2 text-blue-600" />
            <div className="text-lg font-bold text-blue-600">
              {stats.totalItems}
            </div>
            <div className="text-xs text-gray-600">Total Items</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
            <div className="text-lg font-bold text-green-600">
              {stats.activeItems}
            </div>
            <div className="text-xs text-gray-600">Active Items</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
            <div className="text-lg font-bold text-yellow-600">
              {stats.lowStockItems}
            </div>
            <div className="text-xs text-gray-600">Low Stock</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingDown className="h-6 w-6 mx-auto mb-2 text-red-600" />
            <div className="text-lg font-bold text-red-600">
              {stats.depletedItems}
            </div>
            <div className="text-xs text-gray-600">Depleted</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 mx-auto mb-2 text-purple-600" />
            <div className="text-lg font-bold text-purple-600">
              R{stats.totalValue.toFixed(0)}
            </div>
            <div className="text-xs text-gray-600">Total Value</div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Items */}
      <div className="p-4 space-y-4">
        {filteredStockItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">No stock items found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredStockItems.map((item) => (
            <Card key={item.id} className="bg-white shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      <Package className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.itemName}</h3>
                      <p className="text-sm text-gray-600">
                        {item.itemDescription}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(item.status)}>
                    {getStatusIcon(item.status)}
                    <span className="ml-1">
                      {item.status.replace("-", " ")}
                    </span>
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">SKU</p>
                        <p className="font-medium">{item.itemSku}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Category</p>
                        <p className="font-medium">{item.category}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-600">Assigned</p>
                      <p className="font-bold text-blue-600">
                        {item.assignedQuantity}
                      </p>
                      <p className="text-xs text-gray-500">{item.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Used</p>
                      <p className="font-bold text-orange-600">
                        {item.usedQuantity}
                      </p>
                      <p className="text-xs text-gray-500">{item.unit}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Remaining</p>
                      <p
                        className={`font-bold ${getStockLevelColor(item.remainingQuantity, item.assignedQuantity)}`}
                      >
                        {item.remainingQuantity}
                      </p>
                      <p className="text-xs text-gray-500">{item.unit}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Assigned:{" "}
                        {new Date(item.assignedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>By: {item.assignedBy}</span>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Notes:</strong> {item.notes}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Dialog
                      open={showUsageDialog && selectedItem?.id === item.id}
                      onOpenChange={(open) => {
                        setShowUsageDialog(open);
                        if (!open) setSelectedItem(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => setSelectedItem(item)}
                          disabled={item.remainingQuantity === 0}
                        >
                          <Minus className="h-4 w-4 mr-1" />
                          Use Stock
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Record Stock Usage</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-medium">{item.itemName}</h4>
                            <p className="text-sm text-gray-600">
                              Available: {item.remainingQuantity} {item.unit}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <Label>Quantity Used</Label>
                            <Input
                              type="number"
                              max={item.remainingQuantity}
                              value={usageData.quantity}
                              onChange={(e) =>
                                setUsageData((prev) => ({
                                  ...prev,
                                  quantity: Math.min(
                                    parseInt(e.target.value) || 0,
                                    item.remainingQuantity,
                                  ),
                                }))
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Job ID (Optional)</Label>
                            <Input
                              value={usageData.jobId}
                              onChange={(e) =>
                                setUsageData((prev) => ({
                                  ...prev,
                                  jobId: e.target.value,
                                }))
                              }
                              placeholder="e.g., SA-688808"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Usage Notes (Optional)</Label>
                            <Input
                              value={usageData.notes}
                              onChange={(e) =>
                                setUsageData((prev) => ({
                                  ...prev,
                                  notes: e.target.value,
                                }))
                              }
                              placeholder="Description of usage..."
                            />
                          </div>

                          <div className="flex gap-4 pt-4">
                            <Button
                              onClick={recordStockUsage}
                              className="flex-1"
                            >
                              Record Usage
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setShowUsageDialog(false)}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Recent Usage History */}
      {stockUsageHistory.length > 0 && (
        <div className="p-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {stockUsageHistory.slice(0, 10).map((usage) => (
                    <div
                      key={usage.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{usage.itemName}</p>
                        <p className="text-sm text-gray-600">
                          Used {usage.quantityUsed} units on{" "}
                          {new Date(usage.usageDate).toLocaleDateString()}
                        </p>
                        {usage.jobId && (
                          <p className="text-xs text-blue-600">
                            Job: {usage.jobId}
                          </p>
                        )}
                        {usage.notes && (
                          <p className="text-xs text-gray-500">{usage.notes}</p>
                        )}
                      </div>
                      <Badge variant="outline">-{usage.quantityUsed}</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bulk Allocation Dialog */}
      <Dialog
        open={showBulkAllocateDialog}
        onOpenChange={setShowBulkAllocateDialog}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Bulk Stock Allocation</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {/* Job Selection */}
            <div>
              <Label htmlFor="bulkJob">Select Job</Label>
              <Input
                id="bulkJob"
                placeholder="Enter Job ID (e.g., SA-688808)"
                value={selectedJobForBulk}
                onChange={(e) => setSelectedJobForBulk(e.target.value)}
              />
            </div>

            {/* Stock Items Selection */}
            <div>
              <Label>Add Stock Items</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                {stockItems
                  .filter((item) => item.remainingQuantity > 0)
                  .map((item) => (
                    <Button
                      key={item.id}
                      variant="outline"
                      size="sm"
                      onClick={() => addToBulkAllocation(item.id)}
                      disabled={bulkAllocations.find(
                        (ba) => ba.itemId === item.id,
                      )}
                      className="justify-start text-left"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {item.itemName} ({item.remainingQuantity} remaining)
                    </Button>
                  ))}
              </div>
            </div>

            {/* Selected Items for Allocation */}
            {bulkAllocations.length > 0 && (
              <div>
                <Label>Items to Allocate ({bulkAllocations.length})</Label>
                <div className="space-y-3 max-h-60 overflow-y-auto border rounded p-3">
                  {bulkAllocations.map((bulkItem) => (
                    <div
                      key={bulkItem.id}
                      className="flex items-center gap-3 p-3 border rounded bg-gray-50"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{bulkItem.itemName}</p>
                        <p className="text-sm text-gray-600">
                          Available: {bulkItem.remainingQuantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div>
                          <Label className="text-xs">Quantity</Label>
                          <Input
                            type="number"
                            min="1"
                            max={bulkItem.remainingQuantity}
                            value={bulkItem.allocateQuantity}
                            onChange={(e) =>
                              updateBulkAllocationQuantity(
                                bulkItem.id,
                                e.target.value,
                              )
                            }
                            className="w-20"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Notes</Label>
                          <Input
                            placeholder="Optional notes"
                            value={bulkItem.notes}
                            onChange={(e) =>
                              updateBulkAllocationNotes(
                                bulkItem.id,
                                e.target.value,
                              )
                            }
                            className="w-32"
                          />
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeBulkAllocationItem(bulkItem.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setBulkAllocations([]);
                  setSelectedJobForBulk("");
                  setShowBulkAllocateDialog(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={processBulkAllocation}
                disabled={!selectedJobForBulk || bulkAllocations.length === 0}
              >
                Allocate {bulkAllocations.length} Items
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
