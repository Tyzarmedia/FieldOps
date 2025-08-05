import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import {
  Package,
  Plus,
  Search,
  Filter,
  User,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Archive,
  Edit,
  Trash2,
  ArrowRight,
  Users,
  Warehouse,
  ShoppingCart,
  BarChart3,
  RefreshCw,
  Download,
  Upload,
} from "lucide-react";

interface StockItem {
  id: string;
  name: string;
  description: string;
  category: string;
  sku: string;
  unit: string;
  quantity: number;
  minimumQuantity: number;
  unitPrice: number;
  supplier: string;
  location: string;
  lastUpdated: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
}

interface TechnicianStock {
  id: string;
  technicianId: string;
  technicianName: string;
  itemId: string;
  itemName: string;
  assignedQuantity: number;
  usedQuantity: number;
  remainingQuantity: number;
  assignedDate: string;
  assignedBy: string;
  status: "assigned" | "in-use" | "returned" | "depleted";
  notes?: string;
}

interface Technician {
  id: string;
  name: string;
  email: string;
  location: string;
  status: "active" | "inactive";
}

export default function StockManagementScreen() {
  const [stockItems, setStockItems] = useState<StockItem[]>([
    {
      id: "1",
      name: "Fiber Optic Cable",
      description: "Single-mode fiber optic cable for FTTH installations",
      category: "Cables",
      sku: "FOC-SM-1000",
      unit: "meters",
      quantity: 5000,
      minimumQuantity: 1000,
      unitPrice: 2.5,
      supplier: "Optical Supplies Ltd",
      location: "Warehouse A - Section 1",
      lastUpdated: new Date().toISOString(),
      status: "in-stock",
    },
    {
      id: "2",
      name: "Splice Protectors",
      description: "Heat shrink splice protectors for fiber connections",
      category: "Connectors",
      sku: "SP-HS-100",
      unit: "pieces",
      quantity: 50,
      minimumQuantity: 100,
      unitPrice: 0.75,
      supplier: "Fiber Tech Inc",
      location: "Warehouse A - Section 2",
      lastUpdated: new Date().toISOString(),
      status: "low-stock",
    },
    {
      id: "3",
      name: "ONT Devices",
      description: "Optical Network Terminal for customer premises",
      category: "Equipment",
      sku: "ONT-GP-2024",
      unit: "units",
      quantity: 0,
      minimumQuantity: 25,
      unitPrice: 85.0,
      supplier: "Network Equipment Co",
      location: "Warehouse B - Secure",
      lastUpdated: new Date().toISOString(),
      status: "out-of-stock",
    },
    {
      id: "4",
      name: "Cable Ties",
      description: "UV resistant cable ties for outdoor installations",
      category: "Hardware",
      sku: "CT-UV-200",
      unit: "packs",
      quantity: 150,
      minimumQuantity: 50,
      unitPrice: 12.0,
      supplier: "Hardware Direct",
      location: "Warehouse A - Section 3",
      lastUpdated: new Date().toISOString(),
      status: "in-stock",
    },
    {
      id: "5",
      name: "Wall Sockets",
      description: "Fiber optic wall outlet for indoor termination",
      category: "Installation",
      sku: "WS-FO-WH",
      unit: "units",
      quantity: 200,
      minimumQuantity: 75,
      unitPrice: 15.5,
      supplier: "Installation Supplies",
      location: "Warehouse A - Section 4",
      lastUpdated: new Date().toISOString(),
      status: "in-stock",
    },
  ]);

  const [technicianStock, setTechnicianStock] = useState<TechnicianStock[]>([
    {
      id: "ts1",
      technicianId: "tech001",
      technicianName: "Dyondzani Clement Masinge",
      itemId: "1",
      itemName: "Fiber Optic Cable",
      assignedQuantity: 500,
      usedQuantity: 200,
      remainingQuantity: 300,
      assignedDate: new Date().toISOString(),
      assignedBy: "Stock Manager",
      status: "in-use",
      notes: "For weekly FTTH installations",
    },
    {
      id: "ts2",
      technicianId: "tech001",
      technicianName: "Dyondzani Clement Masinge",
      itemId: "2",
      itemName: "Splice Protectors",
      assignedQuantity: 100,
      usedQuantity: 75,
      remainingQuantity: 25,
      assignedDate: new Date().toISOString(),
      assignedBy: "Stock Manager",
      status: "in-use",
    },
    {
      id: "ts3",
      technicianId: "tech002",
      technicianName: "John Smith",
      itemId: "4",
      itemName: "Cable Ties",
      assignedQuantity: 10,
      usedQuantity: 10,
      remainingQuantity: 0,
      assignedDate: new Date().toISOString(),
      assignedBy: "Stock Manager",
      status: "depleted",
    },
  ]);

  const [technicians, setTechnicians] = useState<Technician[]>([
    {
      id: "tech001",
      name: "Dyondzani Clement Masinge",
      email: "dyondzani.masinge@fieldops.com",
      location: "East London",
      status: "active",
    },
    {
      id: "tech002",
      name: "John Smith",
      email: "john.smith@fieldops.com",
      location: "Downtown",
      status: "active",
    },
    {
      id: "tech003",
      name: "Sarah Johnson",
      email: "sarah.johnson@fieldops.com",
      location: "Midtown",
      status: "active",
    },
    {
      id: "tech004",
      name: "Mike Chen",
      email: "mike.chen@fieldops.com",
      location: "Southside",
      status: "active",
    },
  ]);

  const [selectedTab, setSelectedTab] = useState("inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddItemDialog, setShowAddItemDialog] = useState(false);
  const [showAssignStockDialog, setShowAssignStockDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    category: "",
    sku: "",
    unit: "",
    quantity: 0,
    minimumQuantity: 0,
    unitPrice: 0,
    supplier: "",
    location: "",
  });
  const [assignmentData, setAssignmentData] = useState({
    technicianId: "",
    quantity: 0,
    notes: "",
  });

  const categories = Array.from(
    new Set(stockItems.map((item) => item.category)),
  );

  const filteredStockItems = stockItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800";
      case "out-of-stock":
        return "bg-red-100 text-red-800";
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "in-use":
        return "bg-purple-100 text-purple-800";
      case "returned":
        return "bg-gray-100 text-gray-800";
      case "depleted":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-stock":
        return <CheckCircle className="h-4 w-4" />;
      case "low-stock":
        return <AlertTriangle className="h-4 w-4" />;
      case "out-of-stock":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const addNewItem = () => {
    const newStockItem: StockItem = {
      id: Date.now().toString(),
      ...newItem,
      lastUpdated: new Date().toISOString(),
      status:
        newItem.quantity > newItem.minimumQuantity
          ? "in-stock"
          : newItem.quantity > 0
            ? "low-stock"
            : "out-of-stock",
    };

    setStockItems((prev) => [...prev, newStockItem]);
    setShowAddItemDialog(false);
    setNewItem({
      name: "",
      description: "",
      category: "",
      sku: "",
      unit: "",
      quantity: 0,
      minimumQuantity: 0,
      unitPrice: 0,
      supplier: "",
      location: "",
    });
  };

  const assignStockToTechnician = () => {
    if (
      !selectedItem ||
      !assignmentData.technicianId ||
      assignmentData.quantity <= 0
    )
      return;

    const technician = technicians.find(
      (t) => t.id === assignmentData.technicianId,
    );
    if (!technician) return;

    const newAssignment: TechnicianStock = {
      id: Date.now().toString(),
      technicianId: assignmentData.technicianId,
      technicianName: technician.name,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      assignedQuantity: assignmentData.quantity,
      usedQuantity: 0,
      remainingQuantity: assignmentData.quantity,
      assignedDate: new Date().toISOString(),
      assignedBy: "Stock Manager",
      status: "assigned",
      notes: assignmentData.notes,
    };

    setTechnicianStock((prev) => [...prev, newAssignment]);

    // Update main inventory
    setStockItems((prev) =>
      prev.map((item) =>
        item.id === selectedItem.id
          ? {
              ...item,
              quantity: item.quantity - assignmentData.quantity,
              status:
                item.quantity - assignmentData.quantity > item.minimumQuantity
                  ? "in-stock"
                  : item.quantity - assignmentData.quantity > 0
                    ? "low-stock"
                    : "out-of-stock",
            }
          : item,
      ),
    );

    setShowAssignStockDialog(false);
    setSelectedItem(null);
    setAssignmentData({ technicianId: "", quantity: 0, notes: "" });
  };

  const stats = {
    totalItems: stockItems.length,
    inStock: stockItems.filter((item) => item.status === "in-stock").length,
    lowStock: stockItems.filter((item) => item.status === "low-stock").length,
    outOfStock: stockItems.filter((item) => item.status === "out-of-stock")
      .length,
    totalValue: stockItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    ),
    assignedStock: technicianStock.filter(
      (stock) => stock.status === "assigned" || stock.status === "in-use",
    ).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Warehouse className="h-8 w-8 text-blue-600" />
              Stock Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage inventory and track technician stock assignments
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Dialog
              open={showAddItemDialog}
              onOpenChange={setShowAddItemDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Stock Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Item Name</Label>
                      <Input
                        value={newItem.name}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter item name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SKU</Label>
                      <Input
                        value={newItem.sku}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            sku: e.target.value,
                          }))
                        }
                        placeholder="Enter SKU"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={newItem.description}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Enter description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Input
                        value={newItem.category}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        placeholder="Enter category"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit</Label>
                      <Input
                        value={newItem.unit}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            unit: e.target.value,
                          }))
                        }
                        placeholder="meters, pieces, units..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={newItem.quantity}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            quantity: parseInt(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Minimum Quantity</Label>
                      <Input
                        type="number"
                        value={newItem.minimumQuantity}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            minimumQuantity: parseInt(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit Price (R)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={newItem.unitPrice}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            unitPrice: parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Supplier</Label>
                      <Input
                        value={newItem.supplier}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            supplier: e.target.value,
                          }))
                        }
                        placeholder="Enter supplier name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <Input
                        value={newItem.location}
                        onChange={(e) =>
                          setNewItem((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder="Warehouse location"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button onClick={addNewItem} className="flex-1">
                      Add Item
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddItemDialog(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalItems}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Stock</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.inStock}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.lowStock}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Out of Stock
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.outOfStock}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                R{stats.totalValue.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Assigned Stock
              </CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.assignedStock}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory">Main Inventory</TabsTrigger>
            <TabsTrigger value="assignments">
              Technician Assignments
            </TabsTrigger>
            <TabsTrigger value="reports">Reports & Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-64"
                    />
                  </div>
                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="low-stock">Low Stock</SelectItem>
                      <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Inventory Items */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(item.status)}
                            <h3 className="font-semibold">{item.name}</h3>
                          </div>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace("-", " ")}
                          </Badge>
                          <Badge variant="outline">{item.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span>
                            <strong>SKU:</strong> {item.sku}
                          </span>
                          <span>
                            <strong>Quantity:</strong> {item.quantity}{" "}
                            {item.unit}
                          </span>
                          <span>
                            <strong>Min:</strong> {item.minimumQuantity}{" "}
                            {item.unit}
                          </span>
                          <span>
                            <strong>Price:</strong> R{item.unitPrice.toFixed(2)}
                          </span>
                          <span>
                            <strong>Supplier:</strong> {item.supplier}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog
                          open={
                            showAssignStockDialog &&
                            selectedItem?.id === item.id
                          }
                          onOpenChange={(open) => {
                            setShowAssignStockDialog(open);
                            if (!open) setSelectedItem(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              onClick={() => setSelectedItem(item)}
                              disabled={item.quantity === 0}
                            >
                              <Users className="h-4 w-4 mr-1" />
                              Assign
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Assign Stock to Technician
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium">{item.name}</h4>
                                <p className="text-sm text-gray-600">
                                  Available: {item.quantity} {item.unit}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <Label>Technician</Label>
                                <Select
                                  value={assignmentData.technicianId}
                                  onValueChange={(value) =>
                                    setAssignmentData((prev) => ({
                                      ...prev,
                                      technicianId: value,
                                    }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select technician" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {technicians
                                      .filter((t) => t.status === "active")
                                      .map((tech) => (
                                        <SelectItem
                                          key={tech.id}
                                          value={tech.id}
                                        >
                                          {tech.name}
                                        </SelectItem>
                                      ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label>Quantity</Label>
                                <Input
                                  type="number"
                                  max={item.quantity}
                                  value={assignmentData.quantity}
                                  onChange={(e) =>
                                    setAssignmentData((prev) => ({
                                      ...prev,
                                      quantity: Math.min(
                                        parseInt(e.target.value) || 0,
                                        item.quantity,
                                      ),
                                    }))
                                  }
                                />
                              </div>

                              <div className="space-y-2">
                                <Label>Notes (Optional)</Label>
                                <Input
                                  value={assignmentData.notes}
                                  onChange={(e) =>
                                    setAssignmentData((prev) => ({
                                      ...prev,
                                      notes: e.target.value,
                                    }))
                                  }
                                  placeholder="Assignment notes..."
                                />
                              </div>

                              <div className="flex gap-4 pt-4">
                                <Button
                                  onClick={assignStockToTechnician}
                                  className="flex-1"
                                >
                                  Assign Stock
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    setShowAssignStockDialog(false)
                                  }
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Technician Stock Assignments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {technicianStock.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-4">
                          <h3 className="font-semibold">
                            {assignment.technicianName}
                          </h3>
                          <Badge className={getStatusColor(assignment.status)}>
                            {assignment.status.replace("-", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium">
                          {assignment.itemName}
                        </p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span>
                            <strong>Assigned:</strong>{" "}
                            {assignment.assignedQuantity}
                          </span>
                          <span>
                            <strong>Used:</strong> {assignment.usedQuantity}
                          </span>
                          <span>
                            <strong>Remaining:</strong>{" "}
                            {assignment.remainingQuantity}
                          </span>
                          <span>
                            <strong>Date:</strong>{" "}
                            {new Date(
                              assignment.assignedDate,
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        {assignment.notes && (
                          <p className="text-sm text-gray-600">
                            <strong>Notes:</strong> {assignment.notes}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          Return Stock
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Stock Movement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                    <p>Stock movement analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technician Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4" />
                    <p>Technician usage reports coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
