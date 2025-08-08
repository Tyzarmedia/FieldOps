import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Package,
  Plus,
  Minus,
  Eye,
  Check,
  X,
  AlertTriangle,
  Search,
  Download,
  Upload,
  RefreshCw,
  User,
  Calendar,
  Clock,
  MapPin,
  FileText,
  ShoppingCart,
  Truck,
  CheckCircle,
  XCircle,
  Filter,
  BarChart3,
} from "lucide-react";

interface StockItem {
  id: string;
  code: string;
  name: string;
  category: string;
  totalQuantity: number;
  availableQuantity: number;
  allocatedQuantity: number;
  minimumLevel: number;
  unitPrice: number;
  supplier: string;
  lastRestocked: string;
  warehouse: string;
}

interface StockAllocation {
  id: string;
  technicianId: string;
  technicianName: string;
  stockItems: AllocationItem[];
  allocatedDate: string;
  status: "active" | "returned" | "partial";
  location: string;
}

interface AllocationItem {
  stockId: string;
  stockCode: string;
  stockName: string;
  quantityAllocated: number;
  quantityUsed: number;
  quantityReturned: number;
}

interface StockReturn {
  id: string;
  technicianId: string;
  technicianName: string;
  returnDate: string;
  status: "pending" | "approved" | "rejected";
  items: ReturnItem[];
  comments?: string;
  reviewedBy?: string;
  reviewDate?: string;
  reviewComments?: string;
}

interface ReturnItem {
  stockId: string;
  stockCode: string;
  stockName: string;
  quantityReturned: number;
  condition: "good" | "damaged" | "expired";
  comments?: string;
}

export default function EnhancedStockManager() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTechnician, setSelectedTechnician] = useState("");

  // Stock data
  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: "1",
      code: "FC-50M",
      name: "Fiber Optic Cable - 50m",
      category: "cables",
      totalQuantity: 100,
      availableQuantity: 75,
      allocatedQuantity: 25,
      minimumLevel: 20,
      unitPrice: 150.0,
      supplier: "TechCorp",
      lastRestocked: "2025-01-10",
      warehouse: "WH-001",
    },
    {
      id: "2",
      code: "RJ45-100",
      name: "RJ45 Connectors",
      category: "connectors",
      totalQuantity: 500,
      availableQuantity: 350,
      allocatedQuantity: 150,
      minimumLevel: 100,
      unitPrice: 2.5,
      supplier: "ConnectTech",
      lastRestocked: "2025-01-08",
      warehouse: "WH-001",
    },
    {
      id: "3",
      code: "ONT-G2",
      name: "ONT Device - G2",
      category: "devices",
      totalQuantity: 50,
      availableQuantity: 12,
      allocatedQuantity: 38,
      minimumLevel: 15,
      unitPrice: 120.0,
      supplier: "NetDevice",
      lastRestocked: "2025-01-05",
      warehouse: "WH-002",
    },
  ]);

  // Stock allocations
  const [allocations, setAllocations] = useState<StockAllocation[]>([
    {
      id: "alloc-001",
      technicianId: "tech001",
      technicianName: "Dyondzani Clement Masinge",
      stockItems: [
        {
          stockId: "1",
          stockCode: "FC-50M",
          stockName: "Fiber Optic Cable - 50m",
          quantityAllocated: 5,
          quantityUsed: 2,
          quantityReturned: 0,
        },
        {
          stockId: "2",
          stockCode: "RJ45-100",
          stockName: "RJ45 Connectors",
          quantityAllocated: 20,
          quantityUsed: 15,
          quantityReturned: 0,
        },
      ],
      allocatedDate: "2025-01-15",
      status: "active",
      location: "East London",
    },
  ]);

  // Stock returns
  const [stockReturns, setStockReturns] = useState<StockReturn[]>([
    {
      id: "return-001",
      technicianId: "tech002",
      technicianName: "Sarah Johnson",
      returnDate: "2025-01-16",
      status: "pending",
      items: [
        {
          stockId: "1",
          stockCode: "FC-50M",
          stockName: "Fiber Optic Cable - 50m",
          quantityReturned: 2,
          condition: "good",
          comments: "Unused cables from completed job",
        },
        {
          stockId: "2",
          stockCode: "RJ45-100",
          stockName: "RJ45 Connectors",
          quantityAllocated: 10,
          condition: "damaged",
          comments: "Some connectors damaged during installation",
        },
      ],
      comments: "Returning unused items from Job JA-7765",
    },
  ]);

  // Technicians list
  const technicians = [
    { id: "tech001", name: "Dyondzani Clement Masinge" },
    { id: "tech002", name: "Sarah Johnson" },
    { id: "tech003", name: "Mike Wilson" },
  ];

  // Categories
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "cables", label: "Cables" },
    { value: "connectors", label: "Connectors" },
    { value: "devices", label: "Devices" },
    { value: "tools", label: "Tools" },
  ];

  // Filter stock items
  const filteredStockItems = stockItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get low stock items
  const lowStockItems = stockItems.filter(
    (item) => item.availableQuantity <= item.minimumLevel,
  );

  // Update minimum level
  const updateMinimumLevel = async (stockId: string, newLevel: number) => {
    try {
      const response = await fetch(`/api/stock/${stockId}/minimum-level`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ minimumLevel: newLevel }),
      });

      if (response.ok) {
        setStockItems((prev) =>
          prev.map((item) =>
            item.id === stockId ? { ...item, minimumLevel: newLevel } : item,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to update minimum level:", error);
    }
  };

  // Approve/Reject stock return
  const reviewStockReturn = async (
    returnId: string,
    action: "approve" | "reject",
    comments?: string,
  ) => {
    try {
      const response = await fetch(`/api/stock/returns/${returnId}/review`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          reviewComments: comments,
          reviewedBy: "Stock Manager",
          reviewDate: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setStockReturns((prev) =>
          prev.map((returnItem) =>
            returnItem.id === returnId
              ? {
                  ...returnItem,
                  status: action === "approve" ? "approved" : "rejected",
                  reviewedBy: "Stock Manager",
                  reviewDate: new Date().toISOString(),
                  reviewComments: comments,
                }
              : returnItem,
          ),
        );

        // If approved, update stock quantities
        if (action === "approve") {
          const stockReturn = stockReturns.find((r) => r.id === returnId);
          if (stockReturn) {
            stockReturn.items.forEach((item) => {
              if (item.condition === "good") {
                setStockItems((prev) =>
                  prev.map((stock) =>
                    stock.id === item.stockId
                      ? {
                          ...stock,
                          availableQuantity:
                            stock.availableQuantity + item.quantityReturned,
                          allocatedQuantity:
                            stock.allocatedQuantity - item.quantityReturned,
                        }
                      : stock,
                  ),
                );
              }
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to review stock return:", error);
    }
  };

  // Bulk return processing
  const processBulkReturns = async (
    returnIds: string[],
    action: "approve" | "reject",
  ) => {
    try {
      const response = await fetch("/api/stock/returns/bulk-review", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          returnIds,
          action,
          reviewedBy: "Stock Manager",
          reviewDate: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Update local state for all processed returns
        setStockReturns((prev) =>
          prev.map((returnItem) =>
            returnIds.includes(returnItem.id)
              ? {
                  ...returnItem,
                  status: action === "approve" ? "approved" : "rejected",
                  reviewedBy: "Stock Manager",
                  reviewDate: new Date().toISOString(),
                }
              : returnItem,
          ),
        );
      }
    } catch (error) {
      console.error("Failed to process bulk returns:", error);
    }
  };

  // Export stock report
  const exportStockReport = async (format: "excel" | "pdf") => {
    try {
      const response = await fetch(`/api/stock/export?format=${format}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `stock-report.${format === "excel" ? "xlsx" : "pdf"}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error("Failed to export report:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "good":
        return "bg-green-100 text-green-800";
      case "damaged":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Stock Management
              </h1>
              <p className="text-gray-600">
                Comprehensive inventory and allocation management
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => exportStockReport("excel")}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
              <Button
                onClick={() => exportStockReport("pdf")}
                variant="outline"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert for low stock */}
      {lowStockItems.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mx-6 mt-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            <div className="ml-3">
              <p className="text-sm text-orange-700">
                <strong>Low Stock Alert:</strong> {lowStockItems.length} items
                below minimum level
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="allocations">Allocations</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by item name or code..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    More Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Stock Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStockItems.map((item) => (
                <Card
                  key={item.id}
                  className={
                    item.availableQuantity <= item.minimumLevel
                      ? "border-orange-300"
                      : ""
                  }
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          Code: {item.code}
                        </p>
                      </div>
                      <Package className="h-8 w-8 text-blue-500" />
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Available:</span>
                        <span
                          className={`font-medium ${item.availableQuantity <= item.minimumLevel ? "text-orange-600" : ""}`}
                        >
                          {item.availableQuantity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Allocated:</span>
                        <span className="font-medium">
                          {item.allocatedQuantity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total:</span>
                        <span className="font-medium">
                          {item.totalQuantity}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">
                          Minimum Level:
                        </label>
                        <Input
                          type="number"
                          value={item.minimumLevel}
                          onChange={(e) =>
                            updateMinimumLevel(
                              item.id,
                              parseInt(e.target.value),
                            )
                          }
                          className="w-20 h-8"
                          min="0"
                        />
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Price: ${item.unitPrice}</span>
                        <span>{item.warehouse}</span>
                      </div>
                    </div>

                    {item.availableQuantity <= item.minimumLevel && (
                      <div className="mt-3 p-2 bg-orange-50 rounded flex items-center">
                        <AlertTriangle className="h-4 w-4 text-orange-500 mr-2" />
                        <span className="text-sm text-orange-700">
                          Below minimum level
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Allocations Tab */}
          <TabsContent value="allocations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Stock Allocations</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Allocation
              </Button>
            </div>

            <div className="space-y-4">
              {allocations.map((allocation) => (
                <Card key={allocation.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">
                          {allocation.technicianName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Allocated: {allocation.allocatedDate} • Location:{" "}
                          {allocation.location}
                        </p>
                      </div>
                      <Badge className={getStatusColor(allocation.status)}>
                        {allocation.status}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {allocation.stockItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded"
                        >
                          <div>
                            <div className="font-medium">{item.stockName}</div>
                            <div className="text-sm text-gray-600">
                              Code: {item.stockCode}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">
                              Allocated: {item.quantityAllocated} | Used:{" "}
                              {item.quantityUsed} | Remaining:{" "}
                              {item.quantityAllocated -
                                item.quantityUsed -
                                item.quantityReturned}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end mt-4 space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        Update Allocation
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Returns Tab */}
          <TabsContent value="returns" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Stock Returns</h2>
              <div className="flex space-x-2">
                <Button
                  onClick={() =>
                    processBulkReturns(
                      stockReturns
                        .filter((r) => r.status === "pending")
                        .map((r) => r.id),
                      "approve",
                    )
                  }
                  variant="outline"
                  size="sm"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve All Pending
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Returns
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {stockReturns.map((stockReturn) => (
                <Card key={stockReturn.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">
                          {stockReturn.technicianName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Return Date: {stockReturn.returnDate} • ID:{" "}
                          {stockReturn.id}
                        </p>
                      </div>
                      <Badge className={getStatusColor(stockReturn.status)}>
                        {stockReturn.status}
                      </Badge>
                    </div>

                    {stockReturn.comments && (
                      <div className="mb-4 p-3 bg-blue-50 rounded">
                        <p className="text-sm text-blue-800">
                          {stockReturn.comments}
                        </p>
                      </div>
                    )}

                    <div className="space-y-3 mb-4">
                      {stockReturn.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded"
                        >
                          <div>
                            <div className="font-medium">{item.stockName}</div>
                            <div className="text-sm text-gray-600">
                              Code: {item.stockCode}
                            </div>
                            {item.comments && (
                              <div className="text-sm text-gray-500 mt-1">
                                {item.comments}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm">
                              Quantity: {item.quantityReturned}
                            </div>
                            <Badge
                              className={getConditionColor(item.condition)}
                            >
                              {item.condition}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    {stockReturn.status === "pending" && (
                      <div className="flex items-center space-x-4 pt-4 border-t">
                        <Textarea
                          placeholder="Review comments..."
                          className="flex-1"
                          rows={2}
                        />
                        <div className="flex space-x-2">
                          <Button
                            onClick={() =>
                              reviewStockReturn(stockReturn.id, "approve")
                            }
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() =>
                              reviewStockReturn(stockReturn.id, "reject")
                            }
                            size="sm"
                            variant="destructive"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    )}

                    {stockReturn.reviewComments && (
                      <div className="mt-4 p-3 bg-gray-50 rounded">
                        <div className="text-sm">
                          <strong>Review:</strong> {stockReturn.reviewComments}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          By {stockReturn.reviewedBy} on{" "}
                          {stockReturn.reviewDate}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Stock Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Manage incoming stock requests from technicians. Approve or
                  reject requests and track stock allocation status.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Items
                      </p>
                      <p className="text-2xl font-bold">{stockItems.length}</p>
                    </div>
                    <Package className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Low Stock Items
                      </p>
                      <p className="text-2xl font-bold text-orange-600">
                        {lowStockItems.length}
                      </p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Pending Returns
                      </p>
                      <p className="text-2xl font-bold">
                        {
                          stockReturns.filter((r) => r.status === "pending")
                            .length
                        }
                      </p>
                    </div>
                    <Truck className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Active Allocations
                      </p>
                      <p className="text-2xl font-bold">
                        {
                          allocations.filter((a) => a.status === "active")
                            .length
                        }
                      </p>
                    </div>
                    <User className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Stock Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Detailed analytics and reporting on stock usage, allocation
                  patterns, and inventory optimization recommendations.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
