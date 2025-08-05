import { useState, useEffect } from "react";
import { useNotification } from "@/components/ui/notification";
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
  FileText,
  DollarSign,
  Printer,
  Eye,
  Calendar,
  PieChart,
  Activity,
  PackageCheck,
  ShieldAlert,
  CircleDollarSign,
  BarChart4,
  Target,
  UploadCloud,
  CheckCircle2,
  Clock4,
  XCircle,
} from "lucide-react";

export default function EnhancedStockManagementScreen() {
  const { success, error } = useNotification();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [stockItems, setStockItems] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [usageHistory, setUsageHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreatePOPDialog, setShowCreatePOPDialog] = useState(false);
  const [showAssignStockDialog, setShowAssignStockDialog] = useState(false);
  const [showAddStockDialog, setShowAddStockDialog] = useState(false);
  const [showBulkAssignDialog, setShowBulkAssignDialog] = useState(false);
  const [editingMinStock, setEditingMinStock] = useState<string | null>(null);
  const [editMinStockValue, setEditMinStockValue] = useState("");
  const [newPOP, setNewPOP] = useState({
    supplier: "",
    items: "",
    total: "",
    eta: "",
  });

  const [showDocumentUploadDialog, setShowDocumentUploadDialog] = useState(false);
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [newDocumentOrder, setNewDocumentOrder] = useState({
    documentType: "",
    supplier: "",
    orderNumber: "",
    expectedDate: "",
    notes: "",
    items: [
      { name: "", quantity: "", unitPrice: "" }
    ]
  });
  const [newAssignment, setNewAssignment] = useState({
    itemId: "",
    technicianId: "",
    technicianName: "",
    quantity: "",
    notes: "",
  });
  const [bulkAssignments, setBulkAssignments] = useState([]);
  const [selectedTechnicianForBulk, setSelectedTechnicianForBulk] =
    useState("");

  // Available technicians
  const technicians = [
    { id: "tech001", name: "Dyondzani Clement Masinge" },
    { id: "tech002", name: "Sarah Johnson" },
    { id: "tech003", name: "Mike Chen" },
    { id: "tech004", name: "John Smith" },
    { id: "tech005", name: "Lisa Anderson" },
    { id: "tech006", name: "David Wilson" },
    { id: "tech007", name: "Emma Brown" },
  ];
  const [newStockItem, setNewStockItem] = useState({
    name: "",
    description: "",
    category: "",
    sku: "",
    unit: "",
    quantity: "",
    minimumQuantity: "",
    unitPrice: "",
    supplier: "",
    location: "",
  });

  // Enhanced Stats with low stock alerts
  const [stats, setStats] = useState({
    totalItems: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
    assignedStock: 0,
    todayUsage: 0,
    weeklyUsage: 0,
    monthlyUsage: 0,
    topUsedItem: "Loading...",
    criticalAlerts: 0,
  });

  const [lowStockItems, setLowStockItems] = useState([
    {
      id: "2",
      name: "Splice Protectors",
      current: 50,
      minimum: 100,
      status: "critical",
    },
    {
      id: "3",
      name: "ONT Devices",
      current: 0,
      minimum: 25,
      status: "out-of-stock",
    },
    { id: "8", name: "Cable Clips", current: 15, minimum: 50, status: "low" },
  ]);

  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: "T001",
      type: "assignment",
      item: "Fiber Cable",
      quantity: 100,
      technician: "John Smith",
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: "T002",
      type: "usage",
      item: "Splice Protectors",
      quantity: 25,
      technician: "Sarah Johnson",
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: "T003",
      type: "return",
      item: "ONT Devices",
      quantity: 5,
      technician: "Mike Chen",
      date: "2024-01-14",
      status: "completed",
    },
    {
      id: "T004",
      type: "transfer",
      item: "Cable Ties",
      quantity: 50,
      from: "Main Store",
      to: "Technician Warehouse",
      date: "2024-01-14",
      status: "pending",
    },
  ]);

  const [usageAnalytics, setUsageAnalytics] = useState([]);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      // Use fallback data immediately to prevent crashes
      const fallbackItems = [
        {
          id: "CAB00092",
          name: "MICRO MINI 24F FIBRE BLACK",
          description: "24 fiber micro mini cable for FTTH applications",
          category: "Cables",
          sku: "CAB00092",
          unit: "meters",
          quantity: 2000,
          minimumQuantity: 500,
          unitPrice: 4.2,
          supplier: "Fiber Solutions Inc",
          location: "VAN462",
          status: "in-stock",
        },
        {
          id: "CAB00175",
          name: "UNJACKED PIGTAILS LC/APC - 1M",
          description: "Unjacked pigtails LC/APC connector 1 meter",
          category: "Connectors",
          sku: "CAB00175",
          unit: "pieces",
          quantity: 50,
          minimumQuantity: 100,
          unitPrice: 8.5,
          supplier: "Fiber Solutions Inc",
          location: "VAN462",
          status: "low-stock",
        },
        {
          id: "GEN00007",
          name: "Cable Ties (305 x 4.7mm) T50I - BLACK",
          description: "Large black cable ties 305x4.7mm T50I",
          category: "General",
          sku: "GEN00007",
          unit: "pieces",
          quantity: 500,
          minimumQuantity: 100,
          unitPrice: 0.5,
          supplier: "General Supplies",
          location: "VAN462",
          status: "in-stock",
        },
      ];

      // Set fallback data immediately
      setStockItems(fallbackItems);
      setStats({
        totalItems: 28,
        inStock: 26,
        lowStock: 1,
        outOfStock: 0,
        totalValue: 25492,
        assignedStock: 0,
        todayUsage: 0,
        weeklyUsage: 0,
        monthlyUsage: 0,
        topUsedItem: "Fiber Optic Cable",
        criticalAlerts: 2,
      });

      setLowStockItems([
        {
          id: "CAB00175",
          name: "UNJACKED PIGTAILS LC/APC - 1M",
          current: 50,
          minimum: 100,
          status: "low-stock",
        },
      ]);

      try {
        // Try to load from API
        console.log("Attempting to load data from API...");
        const response = await fetch("/api/stock-management/items");
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setStockItems(data.data);
            console.log("Successfully loaded data from API");
            // Calculate stats from API data
            const items = data.data;
            setStats({
              totalItems: items.length,
              inStock: items.filter((item) => item.status === "in-stock").length,
              lowStock: items.filter((item) => item.status === "low-stock").length,
              outOfStock: items.filter((item) => item.status === "out-of-stock").length,
              totalValue: items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
              assignedStock: 0,
              todayUsage: 0,
              weeklyUsage: 0,
              monthlyUsage: 0,
              topUsedItem: "Fiber Optic Cable",
              criticalAlerts: items.filter((item) => item.status === "out-of-stock" || item.status === "low-stock").length,
            });

            // Update low stock items from API data
            setLowStockItems(
              items
                .filter((item) => item.status === "low-stock" || item.status === "out-of-stock")
                .map((item) => ({
                  id: item.id,
                  name: item.name,
                  current: item.quantity,
                  minimum: item.minimumQuantity,
                  status: item.status,
                }))
            );
          }
        }

        // Try to fetch assignments
        try {
          const assignmentsResponse = await fetch("/api/stock-management/assignments");
          if (assignmentsResponse.ok) {
            const assignmentsData = await assignmentsResponse.json();
            if (assignmentsData.success) {
              setAssignments(assignmentsData.data);
            }
          }
        } catch (err) {
          console.log("Could not load assignments:", err.message);
        }

        // Try to fetch usage history
        try {
          const usageResponse = await fetch("/api/stock-management/usage");
          if (usageResponse.ok) {
            const usageData = await usageResponse.json();
            if (usageData.success) {
              setUsageHistory(usageData.data);
            }
          }
        } catch (err) {
          console.log("Could not load usage history:", err.message);
        }
      } catch (error) {
        console.log("API not available, using fallback data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const [purchaseOrders, setPurchaseOrders] = useState([
    {
      id: "PO-2024-001",
      supplier: "Optical Supplies Ltd",
      items: 5,
      total: 12500,
      status: "pending",
      eta: "2024-01-20",
    },
    {
      id: "PO-2024-002",
      supplier: "Fiber Tech Inc",
      items: 3,
      total: 8750,
      status: "approved",
      eta: "2024-01-18",
    },
    {
      id: "PO-2024-003",
      supplier: "Network Equipment Co",
      items: 8,
      total: 23400,
      status: "delivered",
      eta: "2024-01-15",
    },
  ]);

  const [quotes, setQuotes] = useState([
    {
      id: "Q-2024-001",
      client: "City Municipality",
      items: 12,
      total: 45600,
      status: "pending",
      validUntil: "2024-02-15",
    },
    {
      id: "Q-2024-002",
      client: "Residential Complex",
      items: 6,
      total: 18200,
      status: "approved",
      validUntil: "2024-02-10",
    },
  ]);

  const [invoices, setInvoices] = useState([
    {
      id: "INV-2024-001",
      client: "Tech Solutions Ltd",
      items: 8,
      total: 15400,
      status: "paid",
      dueDate: "2024-01-30",
    },
    {
      id: "INV-2024-002",
      client: "Property Management",
      items: 4,
      total: 8900,
      status: "overdue",
      dueDate: "2024-01-10",
    },
  ]);

  const [orderDocuments, setOrderDocuments] = useState([
    {
      id: "DOC-2024-001",
      type: "Invoice",
      supplier: "Fiber Tech Solutions",
      orderNumber: "ORD-001",
      status: "awaiting-delivery",
      uploadDate: "2024-01-15",
      expectedDate: "2024-01-25",
      items: [
        { name: "Fiber Optic Cable 1km", quantity: 5, unitPrice: 120 },
        { name: "Connector Kit", quantity: 10, unitPrice: 35 }
      ],
      total: 950,
      fileName: "invoice-fiber-tech-001.pdf"
    },
    {
      id: "DOC-2024-002",
      type: "Quote",
      supplier: "Cable Solutions Ltd",
      orderNumber: "QUO-002",
      status: "awaiting-order",
      uploadDate: "2024-01-14",
      expectedDate: "2024-01-30",
      items: [
        { name: "Cable Ties 100pack", quantity: 20, unitPrice: 15 }
      ],
      total: 300,
      fileName: "quote-cable-solutions-002.pdf"
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
      case "out-of-stock":
      case "overdue":
        return "bg-red-100 text-red-800";
      case "low":
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
      case "paid":
      case "delivered":
        return "bg-green-100 text-green-800";
      case "approved":
      case "awaiting-delivery":
        return "bg-blue-100 text-blue-800";
      case "awaiting-order":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <ArrowRight className="h-4 w-4 text-gray-600" />;
    }
  };

  const createPOP = async () => {
    try {
      const popData = {
        id: `PO-2024-${String(purchaseOrders.length + 1).padStart(3, "0")}`,
        supplier: newPOP.supplier,
        items: parseInt(newPOP.items),
        total: parseFloat(newPOP.total),
        status: "pending",
        eta: newPOP.eta,
      };

      setPurchaseOrders([...purchaseOrders, popData]);
      setNewPOP({ supplier: "", items: "", total: "", eta: "" });
      setShowCreatePOPDialog(false);
      success("Success", "Purchase Order created successfully!");
    } catch (error) {
      console.error("Error creating POP:", error);
      error("Error", "Failed to create Purchase Order");
    }
  };

  const assignStock = async () => {
    try {
      const response = await fetch("/api/stock-management/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: newAssignment.itemId,
          technicianId: newAssignment.technicianId,
          technicianName: newAssignment.technicianName,
          quantity: parseInt(newAssignment.quantity),
          notes: newAssignment.notes,
          assignedBy: "Stock Manager",
        }),
      });

      const result = await response.json();
      if (result.success) {
        setAssignments([...assignments, result.data]);
        setNewAssignment({
          itemId: "",
          technicianId: "",
          technicianName: "",
          quantity: "",
          notes: "",
        });
        setShowAssignStockDialog(false);

        // Refresh stock items
        const itemsResponse = await fetch("/api/stock-management/items");
        const itemsData = await itemsResponse.json();
        if (itemsData.success) {
          setStockItems(itemsData.data);
        }

        success("Success", "Stock assigned successfully!");
      } else {
        error("Error", result.error || "Failed to assign stock");
      }
    } catch (error) {
      console.error("Error assigning stock:", error);
      error("Error", "Failed to assign stock");
    }
  };

  const printDocument = (type: string, id: string) => {
    window.print();
  };

  const exportData = () => {
    const data = { stockItems, assignments, usageHistory };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const addToBulkAssignment = (itemId) => {
    const item = stockItems.find((i) => i.id === itemId);
    if (item && !bulkAssignments.find((ba) => ba.itemId === itemId)) {
      setBulkAssignments([
        ...bulkAssignments,
        {
          id: `BULK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          itemId: item.id,
          itemName: item.name,
          availableQuantity: item.quantity,
          assignQuantity: 1,
          notes: "",
        },
      ]);
    }
  };

  const removeBulkAssignmentItem = (bulkItemId) => {
    setBulkAssignments(bulkAssignments.filter((ba) => ba.id !== bulkItemId));
  };

  const updateBulkAssignmentQuantity = (bulkItemId, quantity) => {
    setBulkAssignments(
      bulkAssignments.map((ba) =>
        ba.id === bulkItemId
          ? { ...ba, assignQuantity: parseInt(quantity) || 0 }
          : ba,
      ),
    );
  };

  const updateBulkAssignmentNotes = (bulkItemId, notes) => {
    setBulkAssignments(
      bulkAssignments.map((ba) =>
        ba.id === bulkItemId ? { ...ba, notes } : ba,
      ),
    );
  };

  const processBulkAssignment = async () => {
    if (!selectedTechnicianForBulk || bulkAssignments.length === 0) {
      alert("Please select a technician and add items to assign");
      return;
    }

    const selectedTech = technicians.find(
      (t) => t.id === selectedTechnicianForBulk,
    );
    if (!selectedTech) {
      alert("Invalid technician selected");
      return;
    }

    try {
      for (const bulkItem of bulkAssignments) {
        if (bulkItem.assignQuantity > 0) {
          const response = await fetch("/api/stock-management/assignments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              itemId: bulkItem.itemId,
              technicianId: selectedTechnicianForBulk,
              technicianName: selectedTech.name,
              quantity: bulkItem.assignQuantity,
              notes: bulkItem.notes || "Bulk assignment",
              assignedBy: "Stock Manager",
            }),
          });

          if (!response.ok) {
            throw new Error(`Failed to assign ${bulkItem.itemName}`);
          }
        }
      }

      // Refresh stock items after bulk assignment
      const itemsResponse = await fetch("/api/stock-management/items");
      if (itemsResponse.ok) {
        const itemsData = await itemsResponse.json();
        if (itemsData.success) {
          setStockItems(itemsData.data);
        }
      }

      // Reset bulk assignment state
      setBulkAssignments([]);
      setSelectedTechnicianForBulk("");
      setShowBulkAssignDialog(false);

      success(
        "Success",
        `Successfully assigned ${bulkAssignments.length} items to ${selectedTech.name}!`,
      );
    } catch (error) {
      console.error("Error during bulk assignment:", error);
      error("Error", "Some assignments failed. Please check the logs.");
    }
  };

  const createStockItem = async () => {
    try {
      const response = await fetch("/api/stock-management/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newStockItem.name,
          description: newStockItem.description,
          category: newStockItem.category,
          sku: newStockItem.sku,
          unit: newStockItem.unit,
          quantity: parseInt(newStockItem.quantity),
          minimumQuantity: parseInt(newStockItem.minimumQuantity),
          unitPrice: parseFloat(newStockItem.unitPrice),
          supplier: newStockItem.supplier,
          location: newStockItem.location,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setStockItems([...stockItems, result.data]);
        setNewStockItem({
          name: "",
          description: "",
          category: "",
          sku: "",
          unit: "",
          quantity: "",
          minimumQuantity: "",
          unitPrice: "",
          supplier: "",
          location: "",
        });
        setShowAddStockDialog(false);
        success("Success", "Stock item created successfully!");
      } else {
        error("Error", result.error || "Failed to create stock item");
      }
    } catch (error) {
      console.error("Error creating stock item:", error);
      error("Error", "Failed to create stock item");
    }
  };

  const addDocumentItem = () => {
    setNewDocumentOrder({
      ...newDocumentOrder,
      items: [...newDocumentOrder.items, { name: "", quantity: "", unitPrice: "" }]
    });
  };

  const removeDocumentItem = (index) => {
    setNewDocumentOrder({
      ...newDocumentOrder,
      items: newDocumentOrder.items.filter((_, i) => i !== index)
    });
  };

  const updateDocumentItem = (index, field, value) => {
    const updatedItems = newDocumentOrder.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setNewDocumentOrder({
      ...newDocumentOrder,
      items: updatedItems
    });
  };

  const uploadDocument = () => {
    const total = newDocumentOrder.items.reduce((sum, item) =>
      sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0), 0
    );

    const newDoc = {
      id: `DOC-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type: newDocumentOrder.documentType,
      supplier: newDocumentOrder.supplier,
      orderNumber: newDocumentOrder.orderNumber,
      status: newDocumentOrder.documentType === "Delivery Note" ? "delivered" : "awaiting-delivery",
      uploadDate: new Date().toISOString().split('T')[0],
      expectedDate: newDocumentOrder.expectedDate,
      items: newDocumentOrder.items.filter(item => item.name && item.quantity && item.unitPrice),
      total: total,
      fileName: `${newDocumentOrder.documentType.toLowerCase().replace(' ', '-')}-${newDocumentOrder.supplier.replace(/\s+/g, '-').toLowerCase()}.pdf`,
      notes: newDocumentOrder.notes
    };

    setOrderDocuments([...orderDocuments, newDoc]);

    // Auto-process delivery notes
    if (newDocumentOrder.documentType === "Delivery Note") {
      // Add items to inventory immediately
      const updatedStockItems = [...stockItems];
      newDoc.items.forEach((docItem, index) => {
        const existingItem = updatedStockItems.find(item =>
          item.name.toLowerCase().includes(docItem.name.toLowerCase()) ||
          docItem.name.toLowerCase().includes(item.name.toLowerCase())
        );

        if (existingItem) {
          existingItem.quantity += docItem.quantity;
          existingItem.status = existingItem.quantity > existingItem.minimumQuantity ? "in-stock" : "low-stock";
        } else {
          // Create new stock item
          const timestamp = Date.now();
          const newItem = {
            id: `ITM-${timestamp}-${index}`,
            name: docItem.name,
            description: `Auto-added from ${newDoc.type} ${newDoc.orderNumber}`,
            category: "General",
            sku: `AUTO-${timestamp}-${index}`,
            unit: "pieces",
            quantity: docItem.quantity,
            minimumQuantity: Math.max(5, Math.floor(docItem.quantity * 0.2)),
            unitPrice: docItem.unitPrice,
            supplier: newDoc.supplier,
            location: "Main Warehouse",
            status: "in-stock"
          };
          updatedStockItems.push(newItem);
        }
      });

      setStockItems(updatedStockItems);
      success("Success", `Delivery Note processed! ${newDoc.items.length} items added to inventory automatically.`);
    } else {
      success("Success", `${newDocumentOrder.documentType} uploaded and order created successfully!`);
    }

    setNewDocumentOrder({
      documentType: "",
      supplier: "",
      orderNumber: "",
      expectedDate: "",
      notes: "",
      items: [{ name: "", quantity: "", unitPrice: "" }]
    });
    setShowDocumentUploadDialog(false);
  };

  const markAsDelivered = (docId) => {
    const document = orderDocuments.find(doc => doc.id === docId);
    if (!document) return;

    // Add items to inventory
    const updatedStockItems = [...stockItems];
    document.items.forEach((docItem, index) => {
      const existingItem = updatedStockItems.find(item =>
        item.name.toLowerCase().includes(docItem.name.toLowerCase()) ||
        docItem.name.toLowerCase().includes(item.name.toLowerCase())
      );

      if (existingItem) {
        existingItem.quantity += docItem.quantity;
        existingItem.status = existingItem.quantity > existingItem.minimumQuantity ? "in-stock" : "low-stock";
      } else {
        // Create new stock item with unique ID
        const timestamp = Date.now();
        const newItem = {
          id: `ITM-${timestamp}-${index}`,
          name: docItem.name,
          description: `Auto-added from ${document.type} ${document.orderNumber}`,
          category: "General",
          sku: `AUTO-${timestamp}-${index}`,
          unit: "pieces",
          quantity: docItem.quantity,
          minimumQuantity: Math.max(5, Math.floor(docItem.quantity * 0.2)),
          unitPrice: docItem.unitPrice,
          supplier: document.supplier,
          location: "Main Warehouse",
          status: "in-stock"
        };
        updatedStockItems.push(newItem);
      }
    });

    setStockItems(updatedStockItems);

    // Update document status
    setOrderDocuments(orderDocuments.map(doc =>
      doc.id === docId ? { ...doc, status: "delivered" } : doc
    ));

    success("Success", `Order ${document.orderNumber} marked as delivered and stock updated!`);
  };

  const startEditingMinStock = (itemId: string, currentMin: number) => {
    setEditingMinStock(itemId);
    setEditMinStockValue(currentMin.toString());
  };

  const saveMinStockLevel = async (itemId: string) => {
    const newMinQuantity = parseInt(editMinStockValue);
    if (isNaN(newMinQuantity) || newMinQuantity < 0) {
      error("Error", "Please enter a valid minimum quantity");
      return;
    }

    try {
      // Update in local state immediately
      setStockItems(items => items.map(item =>
        item.id === itemId
          ? {
              ...item,
              minimumQuantity: newMinQuantity,
              status: item.quantity > newMinQuantity ? "in-stock" :
                      item.quantity > 0 ? "low-stock" : "out-of-stock"
            }
          : item
      ));

      // Try to update via API (optional)
      try {
        const response = await fetch(`/api/stock-management/items/${itemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ minimumQuantity: newMinQuantity })
        });

        if (response.ok) {
          console.log("Minimum stock level updated in database");
        }
      } catch (apiError) {
        console.log("Could not update in database, but updated locally");
      }

      setEditingMinStock(null);
      setEditMinStockValue("");
      success("Success", `Minimum stock level updated to ${newMinQuantity}`);
    } catch (err) {
      error("Error", "Failed to update minimum stock level");
    }
  };

  const cancelEditingMinStock = () => {
    setEditingMinStock(null);
    setEditMinStockValue("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Warehouse className="h-8 w-8 text-blue-600" />
              Stock Management Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Complete inventory control with real-time tracking and analytics
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Dialog
              open={showAssignStockDialog}
              onOpenChange={setShowAssignStockDialog}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Assign Stock
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign Stock to Technician</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="technician">Technician</Label>
                    <Select
                      value={newAssignment.technicianId}
                      onValueChange={(value) => {
                        const selectedTech = technicians.find(
                          (t) => t.id === value,
                        );
                        setNewAssignment({
                          ...newAssignment,
                          technicianId: value,
                          technicianName: selectedTech?.name || "",
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select technician" />
                      </SelectTrigger>
                      <SelectContent>
                        {technicians.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="item">Stock Item</Label>
                    <Select
                      value={newAssignment.itemId}
                      onValueChange={(value) =>
                        setNewAssignment({ ...newAssignment, itemId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {stockItems.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} (Available: {item.quantity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={newAssignment.quantity}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          quantity: e.target.value,
                        })
                      }
                      placeholder="Enter quantity"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={newAssignment.notes}
                      onChange={(e) =>
                        setNewAssignment({
                          ...newAssignment,
                          notes: e.target.value,
                        })
                      }
                      placeholder="Assignment notes"
                    />
                  </div>
                  <Button
                    onClick={assignStock}
                    className="w-full"
                    disabled={
                      !newAssignment.technicianId ||
                      !newAssignment.itemId ||
                      !newAssignment.quantity
                    }
                  >
                    Assign Stock
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog
              open={showBulkAssignDialog}
              onOpenChange={setShowBulkAssignDialog}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  Bulk Assign
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Bulk Stock Assignment</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Technician Selection */}
                  <div>
                    <Label htmlFor="bulkTechnician">Select Technician</Label>
                    <Select
                      value={selectedTechnicianForBulk}
                      onValueChange={setSelectedTechnicianForBulk}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select technician for bulk assignment" />
                      </SelectTrigger>
                      <SelectContent>
                        {technicians.map((tech) => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Stock Items Selection */}
                  <div>
                    <Label>Add Stock Items</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
                      {stockItems.map((item) => (
                        <Button
                          key={item.id}
                          variant="outline"
                          size="sm"
                          onClick={() => addToBulkAssignment(item.id)}
                          disabled={bulkAssignments.find(
                            (ba) => ba.itemId === item.id,
                          )}
                          className="justify-start text-left"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          {item.name} ({item.quantity} available)
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Items for Assignment */}
                  {bulkAssignments.length > 0 && (
                    <div>
                      <Label>Items to Assign ({bulkAssignments.length})</Label>
                      <div className="space-y-3 max-h-60 overflow-y-auto border rounded p-3">
                        {bulkAssignments.map((bulkItem) => (
                          <div
                            key={bulkItem.id}
                            className="flex items-center gap-3 p-3 border rounded bg-gray-50"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{bulkItem.itemName}</p>
                              <p className="text-sm text-gray-600">
                                Available: {bulkItem.availableQuantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div>
                                <Label className="text-xs">Quantity</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  max={bulkItem.availableQuantity}
                                  value={bulkItem.assignQuantity}
                                  onChange={(e) =>
                                    updateBulkAssignmentQuantity(
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
                                    updateBulkAssignmentNotes(
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
                                onClick={() =>
                                  removeBulkAssignmentItem(bulkItem.id)
                                }
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
                        setBulkAssignments([]);
                        setSelectedTechnicianForBulk("");
                        setShowBulkAssignDialog(false);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={processBulkAssignment}
                      disabled={
                        !selectedTechnicianForBulk ||
                        bulkAssignments.length === 0
                      }
                    >
                      Assign {bulkAssignments.length} Items
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Main Dashboard Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <Package className="h-4 w-4 mr-2" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="assignments">
              <Users className="h-4 w-4 mr-2" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="orders">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="h-4 w-4 mr-2" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTab("inventory")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Items
                  </CardTitle>
                  <PackageCheck className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalItems}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12 from last month
                  </p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTab("inventory")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    In Stock
                  </CardTitle>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.inStock}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    91% availability
                  </p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTab("inventory")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Low Stock Alerts
                  </CardTitle>
                  <ShieldAlert className="h-5 w-5 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">
                    {stats.lowStock}
                  </div>
                  <p className="text-xs text-red-600">
                    {stats.criticalAlerts} critical alerts
                  </p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTab("analytics")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Value
                  </CardTitle>
                  <CircleDollarSign className="h-5 w-5 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    R{stats.totalValue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +8.2% this month
                  </p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTab("assignments")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Monthly Usage
                  </CardTitle>
                  <BarChart4 className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.monthlyUsage}
                  </div>
                  <p className="text-xs text-muted-foreground">Items issued</p>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedTab("analytics")}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Most Used
                  </CardTitle>
                  <Target className="h-5 w-5 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-indigo-600">
                    {stats.topUsedItem}
                  </div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Alerts & Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Low Stock Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Critical Stock Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {lowStockItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 border rounded-lg bg-red-50"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">
                            Current: {item.current} | Minimum: {item.minimum}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace("-", " ")}
                          </Badge>
                          <Button size="sm" variant="outline">
                            Reorder
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-600" />
                    Recent Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentTransactions.slice(0, 4).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{transaction.item}</p>
                          <p className="text-sm text-gray-600">
                            {transaction.type.charAt(0).toUpperCase() +
                              transaction.type.slice(1)}
                            : {transaction.quantity} units
                          </p>
                          <p className="text-xs text-gray-500">
                            {transaction.technician || transaction.from} •{" "}
                            {transaction.date}
                          </p>
                        </div>
                        <Badge className={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Most Used Items This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {usageAnalytics.map((item, index) => (
                    <div key={item.item} className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{item.item}</span>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(item.trend)}
                            <span className="font-bold">{item.used}</span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {item.percentage}% of total usage
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            {/* Document Upload Section */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UploadCloud className="h-5 w-5 text-blue-600" />
                    Document Management
                  </div>
                  <Dialog open={showDocumentUploadDialog} onOpenChange={setShowDocumentUploadDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Document
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Upload Order Document</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="documentType">Document Type</Label>
                            <Select
                              value={newDocumentOrder.documentType}
                              onValueChange={(value) => setNewDocumentOrder({ ...newDocumentOrder, documentType: value })}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select document type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Invoice">Invoice</SelectItem>
                                <SelectItem value="Quote">Quote</SelectItem>
                                <SelectItem value="POP">Proof of Payment</SelectItem>
                                <SelectItem value="Purchase Order">Purchase Order</SelectItem>
                                <SelectItem value="Delivery Note">Delivery Note (Auto-Process)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="orderNumber">Order/Document Number</Label>
                            <Input
                              id="orderNumber"
                              value={newDocumentOrder.orderNumber}
                              onChange={(e) => setNewDocumentOrder({ ...newDocumentOrder, orderNumber: e.target.value })}
                              placeholder="ORD-001"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="supplier">Supplier</Label>
                            <Input
                              id="supplier"
                              value={newDocumentOrder.supplier}
                              onChange={(e) => setNewDocumentOrder({ ...newDocumentOrder, supplier: e.target.value })}
                              placeholder="Supplier name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="expectedDate">Expected Delivery Date</Label>
                            <Input
                              id="expectedDate"
                              type="date"
                              value={newDocumentOrder.expectedDate}
                              onChange={(e) => setNewDocumentOrder({ ...newDocumentOrder, expectedDate: e.target.value })}
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Items</Label>
                          <div className="space-y-3">
                            {newDocumentOrder.items.map((item, index) => (
                              <div key={index} className="grid grid-cols-4 gap-3 p-3 border rounded">
                                <Input
                                  placeholder="Item name"
                                  value={item.name}
                                  onChange={(e) => updateDocumentItem(index, 'name', e.target.value)}
                                />
                                <Input
                                  type="number"
                                  placeholder="Quantity"
                                  value={item.quantity}
                                  onChange={(e) => updateDocumentItem(index, 'quantity', e.target.value)}
                                />
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="Unit price"
                                  value={item.unitPrice}
                                  onChange={(e) => updateDocumentItem(index, 'unitPrice', e.target.value)}
                                />
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeDocumentItem(index)}
                                  disabled={newDocumentOrder.items.length === 1}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <Button variant="outline" onClick={addDocumentItem}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Item
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="notes">Notes</Label>
                          <Input
                            id="notes"
                            value={newDocumentOrder.notes}
                            onChange={(e) => setNewDocumentOrder({ ...newDocumentOrder, notes: e.target.value })}
                            placeholder="Additional notes"
                          />
                        </div>

                        <div className="flex justify-between">
                          <Button variant="outline" onClick={() => setShowDocumentUploadDialog(false)}>
                            Cancel
                          </Button>
                          <Button
                            onClick={uploadDocument}
                            disabled={!newDocumentOrder.documentType || !newDocumentOrder.supplier || !newDocumentOrder.orderNumber}
                          >
                            Upload & Create Order
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderDocuments.map((doc) => (
                    <div key={doc.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{doc.type} - {doc.orderNumber}</h3>
                            <p className="text-sm text-gray-600">{doc.supplier}</p>
                            <p className="text-xs text-gray-500">Uploaded: {doc.uploadDate}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(doc.status)}>
                            {doc.status.replace('-', ' ')}
                          </Badge>
                          {doc.status === 'awaiting-delivery' && (
                            <Button
                              size="sm"
                              onClick={() => markAsDelivered(doc.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Mark Delivered
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Total Value:</strong> R{doc.total.toLocaleString()}</p>
                          <p><strong>Items:</strong> {doc.items.length}</p>
                          {doc.expectedDate && (
                            <p><strong>Expected:</strong> {doc.expectedDate}</p>
                          )}
                        </div>
                        <div>
                          <p><strong>File:</strong> {doc.fileName}</p>
                          {doc.notes && (
                            <p><strong>Notes:</strong> {doc.notes}</p>
                          )}
                        </div>
                      </div>

                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-800">
                          View Items ({doc.items.length})
                        </summary>
                        <div className="mt-2 space-y-1">
                          {doc.items.map((item, idx) => (
                            <div key={idx} className="text-xs p-2 bg-gray-50 rounded">
                              {item.name} - Qty: {item.quantity} @ R{item.unitPrice} each
                            </div>
                          ))}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Purchase Orders */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                    Purchase Orders
                  </CardTitle>
                  <Dialog
                    open={showCreatePOPDialog}
                    onOpenChange={setShowCreatePOPDialog}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        New POP
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Purchase Order</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="supplier">Supplier</Label>
                          <Input
                            id="supplier"
                            value={newPOP.supplier}
                            onChange={(e) =>
                              setNewPOP({ ...newPOP, supplier: e.target.value })
                            }
                            placeholder="Supplier name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="items">Number of Items</Label>
                          <Input
                            id="items"
                            type="number"
                            value={newPOP.items}
                            onChange={(e) =>
                              setNewPOP({ ...newPOP, items: e.target.value })
                            }
                            placeholder="Number of items"
                          />
                        </div>
                        <div>
                          <Label htmlFor="total">Total Amount</Label>
                          <Input
                            id="total"
                            type="number"
                            value={newPOP.total}
                            onChange={(e) =>
                              setNewPOP({ ...newPOP, total: e.target.value })
                            }
                            placeholder="Total amount"
                          />
                        </div>
                        <div>
                          <Label htmlFor="eta">Expected Delivery</Label>
                          <Input
                            id="eta"
                            type="date"
                            value={newPOP.eta}
                            onChange={(e) =>
                              setNewPOP({ ...newPOP, eta: e.target.value })
                            }
                          />
                        </div>
                        <Button onClick={createPOP} className="w-full">
                          Create Purchase Order
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {purchaseOrders.map((po) => (
                      <div key={po.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{po.id}</span>
                          <Badge className={getStatusColor(po.status)}>
                            {po.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{po.supplier}</p>
                        <p className="text-sm">
                          R{po.total.toLocaleString()} • {po.items} items
                        </p>
                        <p className="text-xs text-gray-500">ETA: {po.eta}</p>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              success("Document Opened", `Viewing POP ${po.id}`)
                            }
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => printDocument("POP", po.id)}
                          >
                            <Printer className="h-3 w-3 mr-1" />
                            Print
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quotes */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Quotes
                  </CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    New Quote
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {quotes.map((quote) => (
                      <div key={quote.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{quote.id}</span>
                          <Badge className={getStatusColor(quote.status)}>
                            {quote.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{quote.client}</p>
                        <p className="text-sm">
                          R{quote.total.toLocaleString()} • {quote.items} items
                        </p>
                        <p className="text-xs text-gray-500">
                          Valid until: {quote.validUntil}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              success(
                                "Document Opened",
                                `Viewing Quote ${quote.id}`,
                              )
                            }
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => printDocument("Quote", quote.id)}
                          >
                            <Printer className="h-3 w-3 mr-1" />
                            Print
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Invoices */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    Invoices
                  </CardTitle>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    New Invoice
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {invoices.map((invoice) => (
                      <div key={invoice.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{invoice.id}</span>
                          <Badge className={getStatusColor(invoice.status)}>
                            {invoice.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {invoice.client}
                        </p>
                        <p className="text-sm">
                          R{invoice.total.toLocaleString()} • {invoice.items}{" "}
                          items
                        </p>
                        <p className="text-xs text-gray-500">
                          Due: {invoice.dueDate}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              success(
                                "Document Opened",
                                `Viewing Invoice ${invoice.id}`,
                              )
                            }
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => printDocument("Invoice", invoice.id)}
                          >
                            <Printer className="h-3 w-3 mr-1" />
                            Print
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    Stock Inventory
                  </div>
                  <Dialog
                    open={showAddStockDialog}
                    onOpenChange={setShowAddStockDialog}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Stock
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Stock Item</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        <div>
                          <Label htmlFor="name">Item Name</Label>
                          <Input
                            id="name"
                            value={newStockItem.name}
                            onChange={(e) =>
                              setNewStockItem({
                                ...newStockItem,
                                name: e.target.value,
                              })
                            }
                            placeholder="Enter item name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Input
                            id="description"
                            value={newStockItem.description}
                            onChange={(e) =>
                              setNewStockItem({
                                ...newStockItem,
                                description: e.target.value,
                              })
                            }
                            placeholder="Item description"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="category">Category</Label>
                            <Input
                              id="category"
                              value={newStockItem.category}
                              onChange={(e) =>
                                setNewStockItem({
                                  ...newStockItem,
                                  category: e.target.value,
                                })
                              }
                              placeholder="e.g. Cables"
                            />
                          </div>
                          <div>
                            <Label htmlFor="sku">SKU</Label>
                            <Input
                              id="sku"
                              value={newStockItem.sku}
                              onChange={(e) =>
                                setNewStockItem({
                                  ...newStockItem,
                                  sku: e.target.value,
                                })
                              }
                              placeholder="SKU-001"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                              id="quantity"
                              type="number"
                              value={newStockItem.quantity}
                              onChange={(e) =>
                                setNewStockItem({
                                  ...newStockItem,
                                  quantity: e.target.value,
                                })
                              }
                              placeholder="100"
                            />
                          </div>
                          <div>
                            <Label htmlFor="unit">Unit</Label>
                            <Input
                              id="unit"
                              value={newStockItem.unit}
                              onChange={(e) =>
                                setNewStockItem({
                                  ...newStockItem,
                                  unit: e.target.value,
                                })
                              }
                              placeholder="meters"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor="minQuantity">Min Quantity</Label>
                            <Input
                              id="minQuantity"
                              type="number"
                              value={newStockItem.minimumQuantity}
                              onChange={(e) =>
                                setNewStockItem({
                                  ...newStockItem,
                                  minimumQuantity: e.target.value,
                                })
                              }
                              placeholder="10"
                            />
                          </div>
                          <div>
                            <Label htmlFor="unitPrice">Unit Price</Label>
                            <Input
                              id="unitPrice"
                              type="number"
                              step="0.01"
                              value={newStockItem.unitPrice}
                              onChange={(e) =>
                                setNewStockItem({
                                  ...newStockItem,
                                  unitPrice: e.target.value,
                                })
                              }
                              placeholder="2.50"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="supplier">Supplier</Label>
                          <Input
                            id="supplier"
                            value={newStockItem.supplier}
                            onChange={(e) =>
                              setNewStockItem({
                                ...newStockItem,
                                supplier: e.target.value,
                              })
                            }
                            placeholder="Supplier name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            value={newStockItem.location}
                            onChange={(e) =>
                              setNewStockItem({
                                ...newStockItem,
                                location: e.target.value,
                              })
                            }
                            placeholder="Warehouse A - Section 1"
                          />
                        </div>
                        <Button onClick={createStockItem} className="w-full">
                          Add Stock Item
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stockItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                    >
                      {/* Header with Item Name and Status */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status.replace("-", " ")}
                        </Badge>
                      </div>

                      {/* Information Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {/* Stock Code (SKU) */}
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Stock Code
                          </label>
                          <p className="text-sm font-mono font-semibold text-gray-900">
                            {item.sku}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.category}
                          </p>
                        </div>

                        {/* Quantity */}
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Quantity
                          </label>
                          <p className="text-lg font-bold text-blue-600">
                            {item.quantity.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.unit}
                          </p>
                        </div>

                        {/* Cost Per Item */}
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Cost Per Item
                          </label>
                          <p className="text-lg font-bold text-green-600">
                            R{item.unitPrice.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            per {item.unit}
                          </p>
                        </div>

                        {/* Warehouse */}
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Warehouse
                          </label>
                          <p className="text-sm font-semibold text-gray-900">
                            {item.location}
                          </p>
                          <p className="text-xs text-gray-500">
                            Storage Location
                          </p>
                        </div>
                      </div>

                      {/* Additional Information */}
                      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium text-gray-500">
                            Supplier
                          </label>
                          <p className="text-sm text-gray-700">{item.supplier}</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">
                            Minimum Stock
                          </label>
                          {editingMinStock === item.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={editMinStockValue}
                                onChange={(e) => setEditMinStockValue(e.target.value)}
                                className="h-6 w-16 text-xs"
                                min="0"
                              />
                              <Button
                                size="sm"
                                onClick={() => saveMinStockLevel(item.id)}
                                className="h-6 px-2 text-xs"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEditingMinStock}
                                className="h-6 px-2 text-xs"
                              >
                                <XCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <p
                              className="text-sm text-gray-700 hover:text-blue-600 cursor-pointer hover:underline"
                              onClick={() => startEditingMinStock(item.id, item.minimumQuantity)}
                              title="Click to edit minimum stock level"
                            >
                              {item.minimumQuantity} {item.unit}
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="text-xs font-medium text-gray-500">
                            Total Value
                          </label>
                          <p className="text-sm font-semibold text-gray-700">
                            R{(item.quantity * item.unitPrice).toLocaleString()}
                          </p>
                        </div>
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
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  Stock Assignments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">
                          {assignment.technicianName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {assignment.itemName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Assigned:{" "}
                          {new Date(
                            assignment.assignedDate,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm">
                          Assigned:{" "}
                          <span className="font-bold">
                            {assignment.assignedQuantity}
                          </span>
                        </p>
                        <p className="text-sm">
                          Used:{" "}
                          <span className="font-bold">
                            {assignment.usedQuantity}
                          </span>
                        </p>
                        <p className="text-sm">
                          Remaining:{" "}
                          <span className="font-bold">
                            {assignment.remainingQuantity}
                          </span>
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(assignment.status)}>
                          {assignment.status.replace("-", " ")}
                        </Badge>
                        {assignment.notes && (
                          <p className="text-xs text-gray-500 mt-1">
                            {assignment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stock Usage Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Stock Usage Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {usageHistory.slice(0, 10).map((usage) => (
                      <div
                        key={usage.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{usage.itemName}</p>
                          <p className="text-sm text-gray-600">
                            Used by: {usage.technicianId}
                          </p>
                          <p className="text-xs text-gray-500">
                            Job: {usage.jobId} |{" "}
                            {new Date(usage.usageDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{usage.quantityUsed} used</p>
                          {usage.notes && (
                            <p className="text-xs text-gray-500">
                              {usage.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Predictive Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle>Usage Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {usageAnalytics.map((item, index) => (
                      <div key={item.item} className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{item.item}</span>
                            <div className="flex items-center gap-2">
                              {getTrendIcon(item.trend)}
                              <span className="font-bold">{item.used}</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.percentage}% of total usage
                          </p>
                        </div>
                      </div>
                    ))}
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
