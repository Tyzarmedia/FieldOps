import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  AlertTriangle,
  TrendingDown,
  RotateCcw,
  Users,
  DollarSign,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Eye,
  Truck,
  ClipboardList,
  UserCheck,
  BarChart3,
  FileText,
  Settings,
  Wrench,
  Calendar,
  MapPin,
  Phone,
  Mail,
  QrCode,
  Scan,
  Archive,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Camera,
  Trash2,
  ArrowRight,
  Building,
} from "lucide-react";

export default function StockManagerDashboard() {
  const [activeSection, setActiveSection] = useState("main");
  const [selectedTechnician, setSelectedTechnician] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const stockStats = {
    totalItems: 4320,
    lowStockAlerts: 5,
    issuedThisWeek: 137,
    returnsLogged: 12,
    technicianAssignments: 18,
    stockValue: 89500,
    totalCategories: 12,
    activeSuppliers: 8,
    pendingOrders: 6,
    warehouseCapacity: 85,
  };

  const inventoryItems = [
    {
      id: "STK001",
      name: "Ethernet Router",
      category: "Network Equipment",
      itemCode: "ETH-001",
      supplier: "TechSupplies Ltd",
      location: "Warehouse A",
      totalAvailable: 45,
      inWarehouse: 30,
      assignedToTechs: 15,
      unitCost: 250.00,
      reorderLevel: 10,
      status: "In Stock",
    },
    {
      id: "STK002",
      name: "ONT Device",
      category: "Network Equipment",
      itemCode: "ONT-002",
      supplier: "FiberTech Corp",
      location: "Warehouse B",
      totalAvailable: 5,
      inWarehouse: 3,
      assignedToTechs: 2,
      unitCost: 180.00,
      reorderLevel: 15,
      status: "Low Stock",
    },
    {
      id: "STK003",
      name: "Fiber Optic Cable",
      category: "Cables",
      itemCode: "FOC-100M",
      supplier: "CableCo",
      location: "Warehouse A",
      totalAvailable: 200,
      inWarehouse: 150,
      assignedToTechs: 50,
      unitCost: 15.00,
      reorderLevel: 50,
      status: "In Stock",
    },
    {
      id: "STK004",
      name: "RJ45 Connectors",
      category: "Connectors",
      itemCode: "RJ45-BOX",
      supplier: "ConnectPro",
      location: "Warehouse C",
      totalAvailable: 2,
      inWarehouse: 0,
      assignedToTechs: 2,
      unitCost: 25.00,
      reorderLevel: 20,
      status: "Critical",
    },
    {
      id: "STK005",
      name: "Network Testing Tool",
      category: "Tools",
      itemCode: "NET-TEST-01",
      supplier: "ToolMaster",
      location: "Tool Storage",
      totalAvailable: 12,
      inWarehouse: 8,
      assignedToTechs: 4,
      unitCost: 450.00,
      reorderLevel: 5,
      status: "In Stock",
    },
  ];

  const technicianStock = [
    {
      id: 1,
      name: "John Smith",
      department: "Network Maintenance",
      totalValue: 2450.00,
      items: [
        { name: "Ethernet Router", quantity: 2, value: 500.00 },
        { name: "Network Cable", quantity: 10, value: 150.00 },
        { name: "Testing Equipment", quantity: 1, value: 450.00 },
      ],
      lastIssued: "2024-01-20",
      requestStatus: "Pending",
      alerts: ["Router overdue return"],
    },
    {
      id: 2,
      name: "Sarah Johnson",
      department: "Installation Team",
      totalValue: 1890.00,
      items: [
        { name: "ONT Device", quantity: 3, value: 540.00 },
        { name: "Fiber Cable", quantity: 20, value: 300.00 },
        { name: "Connectors", quantity: 50, value: 125.00 },
      ],
      lastIssued: "2024-01-19",
      requestStatus: "Approved",
      alerts: [],
    },
    {
      id: 3,
      name: "Mike Chen",
      department: "Repair Services",
      totalValue: 1200.00,
      items: [
        { name: "Testing Tool", quantity: 1, value: 450.00 },
        { name: "Spare Parts Kit", quantity: 1, value: 180.00 },
        { name: "Safety Equipment", quantity: 1, value: 95.00 },
      ],
      lastIssued: "2024-01-18",
      requestStatus: "None",
      alerts: ["Missing safety checklist"],
    },
  ];

  const lowStockItems = [
    {
      id: "STK002",
      name: "ONT Device",
      currentStock: 5,
      reorderLevel: 15,
      suggestedOrder: 25,
      supplier: "FiberTech Corp",
      leadTime: "5-7 days",
      urgency: "High",
    },
    {
      id: "STK004",
      name: "RJ45 Connectors",
      currentStock: 2,
      reorderLevel: 20,
      suggestedOrder: 50,
      supplier: "ConnectPro",
      leadTime: "2-3 days",
      urgency: "Critical",
    },
    {
      id: "STK007",
      name: "Installation Tools",
      currentStock: 8,
      reorderLevel: 12,
      suggestedOrder: 20,
      supplier: "ToolMaster",
      leadTime: "3-5 days",
      urgency: "Medium",
    },
  ];

  const returnItems = [
    {
      id: "RET001",
      item: "Ethernet Router",
      technician: "John Smith",
      returnDate: "2024-01-20",
      reason: "Job completed",
      condition: "Good",
      status: "Reusable",
      quantity: 1,
    },
    {
      id: "RET002",
      item: "Fiber Cable",
      technician: "Sarah Johnson",
      returnDate: "2024-01-19",
      reason: "Damaged during installation",
      condition: "Damaged",
      status: "To Repair",
      quantity: 5,
    },
    {
      id: "RET003",
      item: "Testing Equipment",
      technician: "Mike Chen",
      returnDate: "2024-01-18",
      reason: "Faulty device",
      condition: "Defective",
      status: "Scrapped",
      quantity: 1,
    },
  ];

  const suppliers = [
    {
      id: "SUP001",
      name: "TechSupplies Ltd",
      contactPerson: "David Wilson",
      phone: "+27-11-555-0101",
      email: "orders@techsupplies.co.za",
      leadTime: "3-5 days",
      items: ["Routers", "Switches", "Cables"],
      rating: 4.8,
      activeOrders: 2,
    },
    {
      id: "SUP002", 
      name: "FiberTech Corp",
      contactPerson: "Lisa Anderson",
      phone: "+27-11-555-0102",
      email: "sales@fibertech.co.za",
      leadTime: "5-7 days",
      items: ["ONT Devices", "Fiber Equipment"],
      rating: 4.6,
      activeOrders: 1,
    },
    {
      id: "SUP003",
      name: "ConnectPro",
      contactPerson: "Mark Thompson",
      phone: "+27-11-555-0103",
      email: "info@connectpro.co.za",
      leadTime: "2-3 days",
      items: ["Connectors", "Adapters", "Small Parts"],
      rating: 4.9,
      activeOrders: 0,
    },
  ];

  const stockMovements = [
    {
      id: "MOV001",
      type: "Issue",
      item: "Ethernet Router",
      quantity: 2,
      technician: "John Smith",
      date: "2024-01-20",
      reference: "JOB-456",
    },
    {
      id: "MOV002",
      type: "Return",
      item: "Fiber Cable",
      quantity: 5,
      technician: "Sarah Johnson",
      date: "2024-01-19",
      reference: "RET-002",
    },
    {
      id: "MOV003",
      type: "Receive",
      item: "ONT Device",
      quantity: 20,
      technician: "Stock Manager",
      date: "2024-01-18",
      reference: "PO-789",
    },
  ];

  const incidents = [
    {
      id: "INC001",
      type: "Theft",
      item: "Testing Equipment",
      technician: "Unknown",
      reportedBy: "Mike Chen",
      date: "2024-01-15",
      description: "Testing equipment missing from vehicle",
      status: "Under Investigation",
      value: 450.00,
    },
    {
      id: "INC002",
      type: "Damage",
      item: "Fiber Cable",
      technician: "Sarah Johnson",
      reportedBy: "Sarah Johnson",
      date: "2024-01-14",
      description: "Cable damaged during installation due to unexpected obstacle",
      status: "Resolved",
      value: 75.00,
    },
  ];

  useEffect(() => {
    // Load stock data
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in stock":
        return "bg-success text-success-foreground";
      case "low stock":
        return "bg-warning text-warning-foreground";
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "reusable":
      case "good":
        return "bg-success text-success-foreground";
      case "damaged":
      case "to repair":
        return "bg-warning text-warning-foreground";
      case "defective":
      case "scrapped":
        return "bg-destructive text-destructive-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "approved":
        return "bg-success text-success-foreground";
      case "resolved":
        return "bg-success text-success-foreground";
      case "under investigation":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-info text-info-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const renderMainDashboard = () => (
    <div className="space-y-6">
      {/* Quick Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl font-bold text-primary">{stockStats.totalItems.toLocaleString()}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl font-bold text-warning">{stockStats.lowStockAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Issued This Week</p>
                <p className="text-2xl font-bold text-info">{stockStats.issuedThisWeek}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Returns</p>
                <p className="text-2xl font-bold text-success">{stockStats.returnsLogged}</p>
              </div>
              <RotateCcw className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Techs Assigned</p>
                <p className="text-2xl font-bold text-purple-600">{stockStats.technicianAssignments}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Stock Value</p>
                <p className="text-2xl font-bold text-success">R{stockStats.stockValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("inventory")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-500 p-4 rounded-2xl">
                <Package className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Inventory Management</h3>
            <p className="text-sm text-gray-600">{stockStats.totalItems} total items</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("alerts")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-500 p-4 rounded-2xl">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Low Stock Alerts</h3>
            <p className="text-sm text-gray-600">{stockStats.lowStockAlerts} items need reorder</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("assignment")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-500 p-4 rounded-2xl">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Technician Assignment</h3>
            <p className="text-sm text-gray-600">Issue stock to technicians</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("status")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-500 p-4 rounded-2xl">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Technician Status</h3>
            <p className="text-sm text-gray-600">{stockStats.technicianAssignments} technicians tracked</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("returns")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-cyan-500 p-4 rounded-2xl">
                <RotateCcw className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Returns Management</h3>
            <p className="text-sm text-gray-600">{stockStats.returnsLogged} returns this month</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("usage")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-500 p-4 rounded-2xl">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Usage Logs</h3>
            <p className="text-sm text-gray-600">Track consumption patterns</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("delivery")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-500 p-4 rounded-2xl">
                <Truck className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Delivery & Transfers</h3>
            <p className="text-sm text-gray-600">Monitor stock in transit</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("incidents")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-500 p-4 rounded-2xl">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Incident Reports</h3>
            <p className="text-sm text-gray-600">Log theft, damage, losses</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("reports")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-yellow-500 p-4 rounded-2xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Reports & Export</h3>
            <p className="text-sm text-gray-600">Generate detailed reports</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("suppliers")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-teal-500 p-4 rounded-2xl">
                <Building className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Supplier Management</h3>
            <p className="text-sm text-gray-600">{stockStats.activeSuppliers} active suppliers</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("settings")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-slate-500 p-4 rounded-2xl">
                <Settings className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Settings & Config</h3>
            <p className="text-sm text-gray-600">Stock limits and thresholds</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderInventoryManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <div className="flex space-x-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="Network Equipment">Network Equipment</SelectItem>
              <SelectItem value="Cables">Cables</SelectItem>
              <SelectItem value="Connectors">Connectors</SelectItem>
              <SelectItem value="Tools">Tools</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {inventoryItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{item.itemCode}</Badge>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <Badge variant="secondary">{item.category}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Total Available:</p>
                      <p>{item.totalAvailable}</p>
                    </div>
                    <div>
                      <p className="font-medium">In Warehouse:</p>
                      <p>{item.inWarehouse}</p>
                    </div>
                    <div>
                      <p className="font-medium">Assigned to Techs:</p>
                      <p>{item.assignedToTechs}</p>
                    </div>
                    <div>
                      <p className="font-medium">Unit Cost:</p>
                      <p>R{item.unitCost.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Supplier:</p>
                      <p>{item.supplier}</p>
                    </div>
                    <div>
                      <p className="font-medium">Location:</p>
                      <p>{item.location}</p>
                    </div>
                    <div>
                      <p className="font-medium">Reorder Level:</p>
                      <p>{item.reorderLevel}</p>
                    </div>
                    <div>
                      <p className="font-medium">Total Value:</p>
                      <p>R{(item.totalAvailable * item.unitCost).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Stock
                </Button>
                <Button variant="outline" size="sm">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Assign to Tech
                </Button>
                {item.status === "Low Stock" || item.status === "Critical" ? (
                  <Button size="sm">
                    <Package className="h-4 w-4 mr-2" />
                    Reorder Now
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderLowStockAlerts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Low Stock & Reorder Alerts</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Manual Reorder
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {lowStockItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{item.id}</Badge>
                    <Badge className={getUrgencyColor(item.urgency)}>
                      {item.urgency}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Current Stock:</p>
                      <p className="text-destructive font-bold">{item.currentStock}</p>
                    </div>
                    <div>
                      <p className="font-medium">Reorder Level:</p>
                      <p>{item.reorderLevel}</p>
                    </div>
                    <div>
                      <p className="font-medium">Suggested Order:</p>
                      <p className="text-success font-bold">{item.suggestedOrder}</p>
                    </div>
                    <div>
                      <p className="font-medium">Supplier:</p>
                      <p>{item.supplier}</p>
                    </div>
                    <div>
                      <p className="font-medium">Lead Time:</p>
                      <p>{item.leadTime}</p>
                    </div>
                    <div>
                      <p className="font-medium">Shortage:</p>
                      <p className="text-destructive font-bold">{item.reorderLevel - item.currentStock} units</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button size="sm">
                  <Package className="h-4 w-4 mr-2" />
                  Order {item.suggestedOrder} Units
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Adjust Quantity
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Procurement
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderTechnicianAssignment = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Technician Stock Assignment</h2>
        <div className="flex space-x-2">
          <Select value={selectedTechnician} onValueChange={setSelectedTechnician}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select technician" />
            </SelectTrigger>
            <SelectContent>
              {technicianStock.map(tech => (
                <SelectItem key={tech.id} value={tech.name}>
                  {tech.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>
            <QrCode className="h-4 w-4 mr-2" />
            Scan Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Issue Stock to Technician</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="technician">Select Technician</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose technician" />
                </SelectTrigger>
                <SelectContent>
                  {technicianStock.map(tech => (
                    <SelectItem key={tech.id} value={tech.name}>
                      {tech.name} - {tech.department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item">Select Item</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose item" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryItems.map(item => (
                    <SelectItem key={item.id} value={item.name}>
                      {item.name} - Available: {item.inWarehouse}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input type="number" placeholder="Enter quantity" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job">Job Reference (Optional)</Label>
              <Input placeholder="Job ID or reference" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea placeholder="Additional notes..." />
            </div>

            <div className="flex space-x-2">
              <Button className="flex-1">
                <UserCheck className="h-4 w-4 mr-2" />
                Issue Stock
              </Button>
              <Button variant="outline">
                <Scan className="h-4 w-4 mr-2" />
                Scan QR
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Stock Movements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stockMovements.map((movement) => (
                <div key={movement.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={movement.type === "Issue" ? "destructive" : "default"}>
                          {movement.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{movement.date}</span>
                      </div>
                      <h4 className="font-semibold">{movement.item}</h4>
                      <div className="text-sm text-muted-foreground">
                        <p>Quantity: {movement.quantity}</p>
                        <p>Technician: {movement.technician}</p>
                        <p>Reference: {movement.reference}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTechnicianStatus = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Technician Stock Status</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {technicianStock.map((tech) => (
          <Card key={tech.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-lg">{tech.name}</h3>
                    <Badge className={getStatusColor(tech.requestStatus)}>
                      {tech.requestStatus}
                    </Badge>
                    {tech.alerts.length > 0 && (
                      <Badge className="bg-destructive text-destructive-foreground">
                        {tech.alerts.length} Alert{tech.alerts.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-3">{tech.department}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="font-medium">Total Stock Value:</p>
                      <p className="text-lg font-bold text-success">R{tech.totalValue.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Last Issued:</p>
                      <p>{tech.lastIssued}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium">Current Stock Items:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {tech.items.map((item, index) => (
                        <div key={index} className="bg-muted rounded p-2 text-sm">
                          <p className="font-medium">{item.name}</p>
                          <p>Qty: {item.quantity} | Value: R{item.value.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {tech.alerts.length > 0 && (
                    <div className="mt-3">
                      <p className="font-medium text-destructive">Alerts:</p>
                      <div className="space-y-1">
                        {tech.alerts.map((alert, index) => (
                          <p key={index} className="text-sm text-destructive">
                            ⚠️ {alert}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Full History
                </Button>
                <Button variant="outline" size="sm">
                  <Package className="h-4 w-4 mr-2" />
                  Issue More Stock
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Request Return
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderReturnsManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Returns Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Process Return
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {returnItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{item.id}</Badge>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <Badge className={getStatusColor(item.condition)}>
                      {item.condition}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{item.item}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Technician:</p>
                      <p>{item.technician}</p>
                    </div>
                    <div>
                      <p className="font-medium">Return Date:</p>
                      <p>{item.returnDate}</p>
                    </div>
                    <div>
                      <p className="font-medium">Quantity:</p>
                      <p>{item.quantity}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">Reason:</p>
                      <p>{item.reason}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {item.status === "Reusable" && (
                  <Button size="sm">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Return to Warehouse
                  </Button>
                )}
                {item.status === "To Repair" && (
                  <Button size="sm" className="bg-warning">
                    <Wrench className="h-4 w-4 mr-2" />
                    Send to Repair
                  </Button>
                )}
                {item.status === "Scrapped" && (
                  <Button size="sm" className="bg-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Mark as Scrapped
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photos
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSuppliers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Supplier Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {suppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-lg">{supplier.name}</h3>
                    <Badge variant="secondary">
                      ⭐ {supplier.rating}
                    </Badge>
                    {supplier.activeOrders > 0 && (
                      <Badge className="bg-primary text-primary-foreground">
                        {supplier.activeOrders} Active Orders
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Contact Person:</p>
                      <p>{supplier.contactPerson}</p>
                    </div>
                    <div>
                      <p className="font-medium">Phone:</p>
                      <p>{supplier.phone}</p>
                    </div>
                    <div>
                      <p className="font-medium">Email:</p>
                      <p>{supplier.email}</p>
                    </div>
                    <div>
                      <p className="font-medium">Lead Time:</p>
                      <p>{supplier.leadTime}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">Supplied Items:</p>
                      <p>{supplier.items.join(", ")}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button size="sm">
                  <Package className="h-4 w-4 mr-2" />
                  Create Order
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "inventory":
        return renderInventoryManagement();
      case "alerts":
        return renderLowStockAlerts();
      case "assignment":
        return renderTechnicianAssignment();
      case "status":
        return renderTechnicianStatus();
      case "returns":
        return renderReturnsManagement();
      case "usage":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Stock Usage Logs</h2>
            <p className="text-muted-foreground">Usage tracking and analytics coming soon...</p>
          </div>
        );
      case "delivery":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Delivery & Transfers</h2>
            <p className="text-muted-foreground">Delivery tracking functionality coming soon...</p>
          </div>
        );
      case "incidents":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Stock Incident Reports</h2>
            <Card>
              <CardHeader>
                <CardTitle>Recent Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incidents.map((incident) => (
                    <div key={incident.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{incident.id}</Badge>
                            <Badge className={getStatusColor(incident.status)}>
                              {incident.status}
                            </Badge>
                            <Badge variant="secondary">{incident.type}</Badge>
                          </div>
                          <h4 className="font-semibold">{incident.item}</h4>
                          <div className="text-sm text-muted-foreground mt-2">
                            <p>Technician: {incident.technician}</p>
                            <p>Reported by: {incident.reportedBy}</p>
                            <p>Date: {incident.date}</p>
                            <p>Value: R{incident.value.toFixed(2)}</p>
                            <p>Description: {incident.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "reports":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Reports & Export</h2>
            <p className="text-muted-foreground">Report generation functionality coming soon...</p>
          </div>
        );
      case "suppliers":
        return renderSuppliers();
      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings & Configuration</h2>
            <p className="text-muted-foreground">Settings configuration coming soon...</p>
          </div>
        );
      default:
        return renderMainDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Stock Manager Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive inventory management and technician stock tracking
            </p>
          </div>
          {activeSection !== "main" && (
            <Button 
              variant="outline" 
              onClick={() => setActiveSection("main")}
            >
              ← Back to Dashboard
            </Button>
          )}
        </div>
      </div>

      {renderSection()}
    </div>
  );
}
