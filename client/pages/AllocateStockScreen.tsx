import { useState, useEffect } from "react";
import { useNotification } from "@/components/ui/notification";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Plus,
  Package,
  Users,
  Search,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
} from "lucide-react";

export default function AllocateStockScreen() {
  const { success, error } = useNotification();
  const [assignments, setAssignments] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showBulkAssignDialog, setShowBulkAssignDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const technicians = [
    { id: "tech001", name: "Dyondzani Clement Masinge" },
    { id: "tech002", name: "Sarah Johnson" },
    { id: "tech003", name: "Mike Chen" },
    { id: "tech004", name: "John Smith" },
    { id: "tech005", name: "Lisa Anderson" },
    { id: "tech006", name: "David Wilson" },
    { id: "tech007", name: "Emma Brown" },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load stock items
      const itemsResponse = await fetch("/api/stock-management/items");
      if (itemsResponse.ok) {
        const itemsData = await itemsResponse.json();
        if (itemsData.success) {
          setStockItems(itemsData.data);
        }
      }

      // Load assignments
      const assignmentsResponse = await fetch(
        "/api/stock-management/assignments",
      );
      if (assignmentsResponse.ok) {
        const assignmentsData = await assignmentsResponse.json();
        if (assignmentsData.success) {
          setAssignments(assignmentsData.data);
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      // Fallback data
      setStockItems([
        {
          id: "CAB00092",
          name: "MICRO MINI 24F FIBRE BLACK",
          quantity: 2000,
          unitPrice: 4.2,
        },
        {
          id: "CAB00175",
          name: "UNJACKED PIGTAILS LC/APC - 1M",
          quantity: 50,
          unitPrice: 8.5,
        },
        {
          id: "GEN00007",
          name: "Cable Ties T50I BLACK",
          quantity: 500,
          unitPrice: 0.5,
        },
      ]);
      setAssignments([
        {
          id: "ts1",
          technicianName: "Dyondzani Clement Masinge",
          itemName: "MICRO MINI 24F FIBRE BLACK",
          assignedQuantity: 100,
          usedQuantity: 25,
          remainingQuantity: 75,
          status: "in-use",
          assignedDate: new Date().toISOString(),
        },
      ]);
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

      if (response.ok) {
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
          setShowAssignDialog(false);
          success("Success", "Stock assigned successfully!");
          loadData(); // Refresh data
        }
      }
    } catch (error) {
      console.error("Error assigning stock:", error);
      error("Error", "Failed to assign stock");
    }
  };

  const addToBulkAssignment = (itemId) => {
    const item = stockItems.find((i) => i.id === itemId);
    if (item && !bulkAssignments.find((ba) => ba.itemId === itemId)) {
      setBulkAssignments([
        ...bulkAssignments,
        {
          id: Date.now().toString(),
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

  const getStatusColor = (status) => {
    switch (status) {
      case "assigned":
        return "bg-blue-100 text-blue-800";
      case "in-use":
        return "bg-green-100 text-green-800";
      case "depleted":
        return "bg-red-100 text-red-800";
      case "returned":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "assigned":
        return <Clock className="h-4 w-4" />;
      case "in-use":
        return <CheckCircle className="h-4 w-4" />;
      case "depleted":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredAssignments = assignments.filter(
    (assignment) =>
      (assignment.technicianName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (assignment.itemName || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Allocate Stock</h1>
            <p className="text-gray-600 mt-1">
              Assign inventory to technicians and track usage
            </p>
          </div>
          <div className="flex gap-3">
            <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
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
                    <Label>Technician</Label>
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
                    <Label>Stock Item</Label>
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
                    <Label>Quantity</Label>
                    <Input
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
                    <Label>Notes</Label>
                    <Input
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

            <Button variant="outline">
              <Package className="h-4 w-4 mr-2" />
              Bulk Assign
            </Button>
          </div>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Current Assignments</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {assignment.technicianName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {assignment.itemName}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">
                          Assigned:{" "}
                          {new Date(
                            assignment.assignedDate,
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-500">Assigned</div>
                      <div className="text-lg font-bold">
                        {assignment.assignedQuantity}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-500">Used</div>
                      <div className="text-lg font-bold text-orange-600">
                        {assignment.usedQuantity}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-500">Remaining</div>
                      <div className="text-lg font-bold text-green-600">
                        {assignment.remainingQuantity}
                      </div>
                    </div>

                    <Badge className={getStatusColor(assignment.status)}>
                      {getStatusIcon(assignment.status)}
                      <span className="ml-1">
                        {assignment.status.replace("-", " ")}
                      </span>
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
