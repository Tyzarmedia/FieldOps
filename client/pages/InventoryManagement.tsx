import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import InventoryAlerts from "@/components/InventoryAlerts";
import {
  Package,
  Search,
  Download,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Warehouse,
  Box,
  DollarSign,
  Calendar,
  User,
  MapPin,
  Scan,
  Archive,
  Send,
  Eye,
  Filter,
  ChevronDown,
  Zap,
  Clock,
  BarChart3,
  Activity,
} from "lucide-react";

// Types for inventory data
interface InventoryItem {
  itemCode: string;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  warehouse: string;
  location: string;
  lastUpdate: string;
  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;
  supplier: string;
  supplierCode: string;
  unitOfMeasure: string;
  status: "Active" | "Inactive" | "Discontinued";
  averageCost: number;
  lastMovementDate: string;
}

interface StockMovement {
  movementId: string;
  itemCode: string;
  movementType: "IN" | "OUT" | "TRANSFER" | "ADJUSTMENT";
  quantity: number;
  warehouse: string;
  location: string;
  reference: string;
  date: string;
  technician?: string;
  notes?: string;
}

interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  categories: Array<{
    name: string;
    count: number;
    value: number;
  }>;
  warehouses: Array<{
    name: string;
    itemCount: number;
    totalValue: number;
  }>;
}

export default function InventoryManagement() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [inventoryStats, setInventoryStats] = useState<InventoryStats | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [issueForm, setIssueForm] = useState({
    itemCode: "",
    quantity: 0,
    technicianId: "",
    jobReference: "",
    warehouse: "",
    notes: "",
  });
  const [returnForm, setReturnForm] = useState({
    itemCode: "",
    quantity: 0,
    technicianId: "",
    warehouse: "",
    condition: "Good",
    notes: "",
  });
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load data sequentially to avoid potential conflicts
        await loadInventoryData();
        await loadInventoryStats();
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [selectedWarehouse, selectedCategory, showLowStockOnly]);

  const loadInventoryData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedWarehouse !== "all")
        params.append("warehouse", selectedWarehouse);
      if (selectedCategory !== "all")
        params.append("category", selectedCategory);
      if (showLowStockOnly) params.append("lowStock", "true");

      const response = await fetch(`/api/inventory/items?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setInventoryItems(data.data || []);
        // Only show success toast on initial load or when there are items
        if (data.data && data.data.length > 0) {
          console.log(
            `Loaded ${data.data.length} inventory items successfully`,
          );
          // Check if this might be mock data (could be indicated by a flag in the response)
          if (data.message && data.message.includes("mock")) {
            toast({
              title: "Using Mock Data",
              description:
                "External inventory system unavailable, showing sample data",
              variant: "default",
            });
          }
        }
      } else {
        throw new Error(data.error || "Failed to load inventory");
      }
    } catch (error) {
      console.error("Error loading inventory:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to load inventory data",
        variant: "destructive",
      });
      // Set empty array as fallback
      setInventoryItems([]);
    } finally {
      setLoading(false);
    }
  };

  const loadInventoryStats = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedWarehouse !== "all")
        params.append("warehouse", selectedWarehouse);

      const response = await fetch(`/api/inventory/stats?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setInventoryStats(data.data);
      } else {
        console.warn("Failed to load inventory stats:", data.error);
        // Set default stats as fallback
        setInventoryStats({
          totalItems: 0,
          totalValue: 0,
          lowStockItems: 0,
          categories: [],
          warehouses: [],
        });
      }
    } catch (error) {
      console.error("Error loading inventory stats:", error);
      // Set default stats as fallback
      setInventoryStats({
        totalItems: 0,
        totalValue: 0,
        lowStockItems: 0,
        categories: [],
        warehouses: [],
      });
    }
  };

  const loadStockMovements = async (itemCode?: string) => {
    try {
      const params = new URLSearchParams();
      if (itemCode) params.append("itemCode", itemCode);
      if (selectedWarehouse !== "all")
        params.append("warehouse", selectedWarehouse);
      params.append("limit", "50");

      const response = await fetch(`/api/inventory/movements?${params}`);
      const data = await response.json();

      if (data.success) {
        setStockMovements(data.data || []);
      }
    } catch (error) {
      console.error("Error loading stock movements:", error);
    }
  };

  const syncWithSageX3 = async () => {
    setSyncing(true);
    try {
      const response = await fetch("/api/inventory/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          warehouse:
            selectedWarehouse !== "all" ? selectedWarehouse : undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLastSyncTime(data.data.lastSync);
        toast({
          title: "Sync Complete",
          description: `Updated ${data.data.updatedItems} items. ${data.data.lowStockItems} items are low on stock.`,
        });
        loadInventoryData();
        loadInventoryStats();
      } else {
        toast({
          title: "Sync Failed",
          description: data.error || "Failed to sync with Sage X3",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error syncing inventory:", error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync with Sage X3",
        variant: "destructive",
      });
    } finally {
      setSyncing(false);
    }
  };

  const issueInventoryItem = async () => {
    try {
      const response = await fetch("/api/inventory/issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(issueForm),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Item Issued",
          description: `Successfully issued ${issueForm.quantity} of ${issueForm.itemCode}`,
        });
        setActiveModal(null);
        setIssueForm({
          itemCode: "",
          quantity: 0,
          technicianId: "",
          jobReference: "",
          warehouse: "",
          notes: "",
        });
        loadInventoryData();
      } else {
        toast({
          title: "Issue Failed",
          description: data.error || "Failed to issue inventory",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error issuing inventory:", error);
      toast({
        title: "Issue Failed",
        description: "Failed to issue inventory",
        variant: "destructive",
      });
    }
  };

  const returnInventoryItem = async () => {
    try {
      const response = await fetch("/api/inventory/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(returnForm),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Item Returned",
          description: `Successfully returned ${returnForm.quantity} of ${returnForm.itemCode}`,
        });
        setActiveModal(null);
        setReturnForm({
          itemCode: "",
          quantity: 0,
          technicianId: "",
          warehouse: "",
          condition: "Good",
          notes: "",
        });
        loadInventoryData();
      } else {
        toast({
          title: "Return Failed",
          description: data.error || "Failed to return inventory",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error returning inventory:", error);
      toast({
        title: "Return Failed",
        description: "Failed to return inventory",
        variant: "destructive",
      });
    }
  };

  const filteredItems = inventoryItems.filter((item) => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        item.itemCode.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.supplier.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const getStatusBadge = (item: InventoryItem) => {
    if (item.quantity <= 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (item.quantity <= item.reorderLevel) {
      return <Badge variant="secondary">Low Stock</Badge>;
    } else if (item.quantity >= item.maximumStock) {
      return <Badge variant="outline">Overstock</Badge>;
    } else {
      return <Badge variant="default">In Stock</Badge>;
    }
  };

  const getMovementIcon = (type: string) => {
    switch (type) {
      case "IN":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "OUT":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "TRANSFER":
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case "ADJUSTMENT":
        return <Edit className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Inventory Management
            </h1>
            <p className="text-gray-600">
              Real-time inventory tracking with Sage X3 integration
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={syncWithSageX3}
              disabled={syncing}
              className="flex items-center gap-2"
            >
              {syncing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Zap className="h-4 w-4" />
              )}
              {syncing ? "Syncing..." : "Sync with Sage X3"}
            </Button>
            <Button variant="outline" onClick={() => setActiveModal("issue")}>
              <Send className="h-4 w-4 mr-2" />
              Issue Item
            </Button>
            <Button variant="outline" onClick={() => setActiveModal("return")}>
              <Archive className="h-4 w-4 mr-2" />
              Return Item
            </Button>
          </div>
        </div>

        {lastSyncTime && (
          <div className="text-sm text-gray-500">
            Last sync: {new Date(lastSyncTime).toLocaleString()}
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      {inventoryStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {inventoryStats.totalItems.toLocaleString()}
                  </p>
                </div>
                <Box className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-green-600">
                    ${inventoryStats.totalValue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Low Stock Items</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {inventoryStats.lowStockItems}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Categories</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {inventoryStats.categories.length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs defaultValue="inventory" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="movements">Stock Movements</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="inventory" className="space-y-4">
              {/* Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-64"
                      />
                    </div>
                    <Select
                      value={selectedWarehouse}
                      onValueChange={setSelectedWarehouse}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Warehouses</SelectItem>
                        <SelectItem value="MAIN">Main Warehouse</SelectItem>
                        <SelectItem value="FIELD">Field Warehouse</SelectItem>
                        <SelectItem value="REPAIR">Repair Shop</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="CABLE">Cables</SelectItem>
                        <SelectItem value="TOOLS">Tools</SelectItem>
                        <SelectItem value="HARDWARE">Hardware</SelectItem>
                        <SelectItem value="EQUIPMENT">Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="lowStock"
                        checked={showLowStockOnly}
                        onChange={(e) => setShowLowStockOnly(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="lowStock" className="text-sm font-medium">
                        Low Stock Only
                      </label>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Inventory Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Inventory Items ({filteredItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center h-32">
                      <RefreshCw className="h-6 w-6 animate-spin" />
                      <span className="ml-2">Loading inventory...</span>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item Code</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Warehouse</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItems.map((item) => (
                          <TableRow key={`${item.itemCode}-${item.warehouse}`}>
                            <TableCell className="font-medium">
                              {item.itemCode}
                            </TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>{item.warehouse}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>{item.quantity}</span>
                                <span className="text-sm text-gray-500">
                                  {item.unitOfMeasure}
                                </span>
                                {item.quantity <= item.reorderLevel && (
                                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                            <TableCell>{getStatusBadge(item)}</TableCell>
                            <TableCell>
                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setActiveModal("details");
                                    loadStockMovements(item.itemCode);
                                  }}
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setIssueForm({
                                      ...issueForm,
                                      itemCode: item.itemCode,
                                      warehouse: item.warehouse,
                                    });
                                    setActiveModal("issue");
                                  }}
                                >
                                  <Send className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setReturnForm({
                                      ...returnForm,
                                      itemCode: item.itemCode,
                                      warehouse: item.warehouse,
                                    });
                                    setActiveModal("return");
                                  }}
                                >
                                  <Archive className="h-3 w-3" />
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

            <TabsContent value="movements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Stock Movements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Button onClick={() => loadStockMovements()}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh Movements
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Item Code</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Warehouse</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Technician</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockMovements.map((movement) => (
                        <TableRow key={movement.movementId}>
                          <TableCell>
                            {new Date(movement.date).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getMovementIcon(movement.movementType)}
                              <span>{movement.movementType}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {movement.itemCode}
                          </TableCell>
                          <TableCell>{movement.quantity}</TableCell>
                          <TableCell>{movement.warehouse}</TableCell>
                          <TableCell>{movement.reference}</TableCell>
                          <TableCell>{movement.technician || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              {inventoryStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Inventory by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {inventoryStats.categories.map((category) => (
                          <div
                            key={category.name}
                            className="flex justify-between items-center"
                          >
                            <span className="font-medium">{category.name}</span>
                            <div className="text-right">
                              <div className="font-semibold">
                                {category.count} items
                              </div>
                              <div className="text-sm text-gray-500">
                                ${category.value.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Inventory by Warehouse</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {inventoryStats.warehouses.map((warehouse) => (
                          <div
                            key={warehouse.name}
                            className="flex justify-between items-center"
                          >
                            <span className="font-medium">
                              {warehouse.name}
                            </span>
                            <div className="text-right">
                              <div className="font-semibold">
                                {warehouse.itemCount} items
                              </div>
                              <div className="text-sm text-gray-500">
                                ${warehouse.totalValue.toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sage X3 Integration Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Sage X3 Server URL</Label>
                      <Input placeholder="https://your-sage-server.com:8124" />
                    </div>
                    <div>
                      <Label>Database</Label>
                      <Input placeholder="X3V12" />
                    </div>
                    <div>
                      <Label>Username</Label>
                      <Input placeholder="admin" />
                    </div>
                    <div>
                      <Label>Password</Label>
                      <Input type="password" placeholder="password" />
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button>Test Connection</Button>
                    <Button variant="outline" className="ml-2">
                      Save Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Alerts Sidebar */}
        <div className="lg:col-span-1">
          <InventoryAlerts
            onRefreshInventory={loadInventoryData}
            className="sticky top-6"
          />
        </div>
      </div>

      {/* Modals */}

      {/* Item Details Modal */}
      <Dialog
        open={activeModal === "details"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Item Details - {selectedItem?.itemCode}</DialogTitle>
            <DialogDescription>{selectedItem?.description}</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Current Stock</Label>
                  <div className="text-2xl font-bold">
                    {selectedItem.quantity} {selectedItem.unitOfMeasure}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Minimum Stock</Label>
                    <div>{selectedItem.minimumStock}</div>
                  </div>
                  <div>
                    <Label>Reorder Level</Label>
                    <div>{selectedItem.reorderLevel}</div>
                  </div>
                  <div>
                    <Label>Unit Price</Label>
                    <div>${selectedItem.unitPrice}</div>
                  </div>
                  <div>
                    <Label>Average Cost</Label>
                    <div>${selectedItem.averageCost}</div>
                  </div>
                </div>
                <div>
                  <Label>Supplier</Label>
                  <div>
                    {selectedItem.supplier} ({selectedItem.supplierCode})
                  </div>
                </div>
              </div>
              <div>
                <Label>Recent Movements</Label>
                <div className="mt-2 max-h-64 overflow-y-auto">
                  {stockMovements.slice(0, 10).map((movement) => (
                    <div
                      key={movement.movementId}
                      className="flex justify-between items-center py-2 border-b"
                    >
                      <div className="flex items-center gap-2">
                        {getMovementIcon(movement.movementType)}
                        <span className="font-medium">
                          {movement.movementType}
                        </span>
                      </div>
                      <div className="text-right">
                        <div>{movement.quantity}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(movement.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Issue Item Modal */}
      <Dialog
        open={activeModal === "issue"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Inventory Item</DialogTitle>
            <DialogDescription>
              Issue inventory to a technician
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Item Code</Label>
              <Input
                value={issueForm.itemCode}
                onChange={(e) =>
                  setIssueForm({ ...issueForm, itemCode: e.target.value })
                }
                placeholder="Enter item code"
              />
            </div>
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={issueForm.quantity}
                onChange={(e) =>
                  setIssueForm({
                    ...issueForm,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <Label>Technician ID</Label>
              <Input
                value={issueForm.technicianId}
                onChange={(e) =>
                  setIssueForm({ ...issueForm, technicianId: e.target.value })
                }
                placeholder="Enter technician ID"
              />
            </div>
            <div>
              <Label>Job Reference (Optional)</Label>
              <Input
                value={issueForm.jobReference}
                onChange={(e) =>
                  setIssueForm({ ...issueForm, jobReference: e.target.value })
                }
                placeholder="Enter job reference"
              />
            </div>
            <div>
              <Label>Warehouse</Label>
              <Select
                value={issueForm.warehouse}
                onValueChange={(value) =>
                  setIssueForm({ ...issueForm, warehouse: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAIN">Main Warehouse</SelectItem>
                  <SelectItem value="FIELD">Field Warehouse</SelectItem>
                  <SelectItem value="REPAIR">Repair Shop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                value={issueForm.notes}
                onChange={(e) =>
                  setIssueForm({ ...issueForm, notes: e.target.value })
                }
                placeholder="Enter any notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={issueInventoryItem}>Issue Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Item Modal */}
      <Dialog
        open={activeModal === "return"}
        onOpenChange={() => setActiveModal(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Return Inventory Item</DialogTitle>
            <DialogDescription>
              Return inventory from a technician
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Item Code</Label>
              <Input
                value={returnForm.itemCode}
                onChange={(e) =>
                  setReturnForm({ ...returnForm, itemCode: e.target.value })
                }
                placeholder="Enter item code"
              />
            </div>
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={returnForm.quantity}
                onChange={(e) =>
                  setReturnForm({
                    ...returnForm,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <Label>Technician ID</Label>
              <Input
                value={returnForm.technicianId}
                onChange={(e) =>
                  setReturnForm({ ...returnForm, technicianId: e.target.value })
                }
                placeholder="Enter technician ID"
              />
            </div>
            <div>
              <Label>Warehouse</Label>
              <Select
                value={returnForm.warehouse}
                onValueChange={(value) =>
                  setReturnForm({ ...returnForm, warehouse: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAIN">Main Warehouse</SelectItem>
                  <SelectItem value="FIELD">Field Warehouse</SelectItem>
                  <SelectItem value="REPAIR">Repair Shop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Condition</Label>
              <Select
                value={returnForm.condition}
                onValueChange={(value) =>
                  setReturnForm({ ...returnForm, condition: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Damaged">Damaged</SelectItem>
                  <SelectItem value="Defective">Defective</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Notes (Optional)</Label>
              <Textarea
                value={returnForm.notes}
                onChange={(e) =>
                  setReturnForm({ ...returnForm, notes: e.target.value })
                }
                placeholder="Enter any notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={returnInventoryItem}>Return Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
