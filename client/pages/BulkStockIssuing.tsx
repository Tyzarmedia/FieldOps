import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  X,
  Plus,
  Trash2,
  Package,
  User,
  Send,
  History,
  Search,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StockItem {
  id: string;
  itemCode: string;
  description: string;
  category: string;
  availableQuantity: number;
  unitCost: number;
  warehouse: string;
}

interface BulkIssueItem {
  stockItemId: string;
  itemCode: string;
  description: string;
  quantityToIssue: number;
  unitCost: number;
  totalCost: number;
}

interface Technician {
  id: string;
  name: string;
  department: string;
  subWarehouse: string;
  status: "active" | "inactive";
}

interface IssuedStock {
  id: string;
  technicianId: string;
  technicianName: string;
  items: BulkIssueItem[];
  totalValue: number;
  issuedDate: string;
  issuedBy: string;
  notes: string;
  status: "issued" | "revoked";
}

export default function BulkStockIssuing() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedTechnician, setSelectedTechnician] = useState<string>("");
  const [bulkIssueItems, setBulkIssueItems] = useState<BulkIssueItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [issueNotes, setIssueNotes] = useState("");
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showIssuedHistory, setShowIssuedHistory] = useState(false);
  const [issuedStockHistory, setIssuedStockHistory] = useState<IssuedStock[]>(
    [],
  );

  // Mock data
  useEffect(() => {
    const mockStockItems: StockItem[] = [
      {
        id: "si-001",
        itemCode: "FOC-SM-50M",
        description: "Single Mode Fiber Optic Cable 50m",
        category: "Fiber Optic Cables",
        availableQuantity: 150,
        unitCost: 125.5,
        warehouse: "East London Central",
      },
      {
        id: "si-002",
        itemCode: "SPL-PROT-12",
        description: "Splice Protectors 12-pack",
        category: "Splice Equipment",
        availableQuantity: 85,
        unitCost: 45.0,
        warehouse: "East London Central",
      },
      {
        id: "si-003",
        itemCode: "ONT-GPON-V2",
        description: "GPON ONT Device V2",
        category: "Network Equipment",
        availableQuantity: 42,
        unitCost: 850.0,
        warehouse: "Port Elizabeth Hub",
      },
      {
        id: "si-004",
        itemCode: "CT-TIES-100",
        description: "Cable Ties 100-pack",
        category: "Tools & Accessories",
        availableQuantity: 200,
        unitCost: 15.0,
        warehouse: "East London Central",
      },
    ];

    const mockTechnicians: Technician[] = [
      {
        id: "tech-001",
        name: "John Doe",
        department: "Field Operations",
        subWarehouse: "Technician-JohnDoe",
        status: "active",
      },
      {
        id: "tech-002",
        name: "Jane Smith",
        department: "Field Operations",
        subWarehouse: "Technician-JaneSmith",
        status: "active",
      },
      {
        id: "tech-003",
        name: "Mike Johnson",
        department: "Field Operations",
        subWarehouse: "Technician-MikeJohnson",
        status: "active",
      },
      {
        id: "tech-004",
        name: "Sarah Wilson",
        department: "Assistant Technician",
        subWarehouse: "Technician-SarahWilson",
        status: "active",
      },
    ];

    const mockIssuedHistory: IssuedStock[] = [
      {
        id: "is-001",
        technicianId: "tech-001",
        technicianName: "John Doe",
        items: [
          {
            stockItemId: "si-001",
            itemCode: "FOC-SM-50M",
            description: "Single Mode Fiber Optic Cable 50m",
            quantityToIssue: 10,
            unitCost: 125.5,
            totalCost: 1255.0,
          },
        ],
        totalValue: 1255.0,
        issuedDate: new Date().toISOString(),
        issuedBy: "Stock Manager",
        notes: "Emergency job allocation",
        status: "issued",
      },
    ];

    setStockItems(mockStockItems);
    setTechnicians(mockTechnicians);
    setIssuedStockHistory(mockIssuedHistory);
  }, []);

  const filteredStockItems = stockItems.filter(
    (item) =>
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedTechnicianData = technicians.find(
    (t) => t.id === selectedTechnician,
  );

  const totalIssueValue = bulkIssueItems.reduce(
    (sum, item) => sum + item.totalCost,
    0,
  );

  const addItemToBulkIssue = (stockItem: StockItem, quantity: number) => {
    const existingItem = bulkIssueItems.find(
      (item) => item.stockItemId === stockItem.id,
    );

    if (existingItem) {
      setBulkIssueItems((prev) =>
        prev.map((item) =>
          item.stockItemId === stockItem.id
            ? {
                ...item,
                quantityToIssue: item.quantityToIssue + quantity,
                totalCost: (item.quantityToIssue + quantity) * item.unitCost,
              }
            : item,
        ),
      );
    } else {
      const newItem: BulkIssueItem = {
        stockItemId: stockItem.id,
        itemCode: stockItem.itemCode,
        description: stockItem.description,
        quantityToIssue: quantity,
        unitCost: stockItem.unitCost,
        totalCost: quantity * stockItem.unitCost,
      };
      setBulkIssueItems((prev) => [...prev, newItem]);
    }
    setShowAddItemModal(false);
  };

  const removeItemFromBulkIssue = (stockItemId: string) => {
    setBulkIssueItems((prev) =>
      prev.filter((item) => item.stockItemId !== stockItemId),
    );
  };

  const updateItemQuantity = (stockItemId: string, newQuantity: number) => {
    setBulkIssueItems((prev) =>
      prev.map((item) =>
        item.stockItemId === stockItemId
          ? {
              ...item,
              quantityToIssue: newQuantity,
              totalCost: newQuantity * item.unitCost,
            }
          : item,
      ),
    );
  };

  const handleBulkIssue = () => {
    if (!selectedTechnician || bulkIssueItems.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select a technician and add items to issue",
        variant: "destructive",
      });
      return;
    }

    const newIssuedStock: IssuedStock = {
      id: `is-${Date.now()}`,
      technicianId: selectedTechnician,
      technicianName: selectedTechnicianData!.name,
      items: bulkIssueItems,
      totalValue: totalIssueValue,
      issuedDate: new Date().toISOString(),
      issuedBy: "Stock Manager",
      notes: issueNotes,
      status: "issued",
    };

    setIssuedStockHistory((prev) => [newIssuedStock, ...prev]);

    // Update stock quantities
    setBulkIssueItems([]);
    setSelectedTechnician("");
    setIssueNotes("");

    toast({
      title: "Stock Issued Successfully",
      description: `${bulkIssueItems.length} items issued to ${selectedTechnicianData!.name}`,
    });
  };

  const revokeStockIssue = (issueId: string) => {
    setIssuedStockHistory((prev) =>
      prev.map((issue) =>
        issue.id === issueId ? { ...issue, status: "revoked" as const } : issue,
      ),
    );

    toast({
      title: "Stock Issue Revoked",
      description:
        "Stock allocation has been revoked and returned to main warehouse",
    });
  };

  const AddItemModal = () => {
    const [selectedStock, setSelectedStock] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);

    const stockItem = stockItems.find((s) => s.id === selectedStock);

    return (
      <Dialog open={showAddItemModal} onOpenChange={setShowAddItemModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Stock Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Stock Item</Label>
              <Select value={selectedStock} onValueChange={setSelectedStock}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stock item" />
                </SelectTrigger>
                <SelectContent>
                  {filteredStockItems.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.itemCode} - {item.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {stockItem && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">
                  Available: {stockItem.availableQuantity}
                </p>
                <p className="text-sm text-gray-600">
                  Unit Cost: R{stockItem.unitCost}
                </p>
              </div>
            )}

            <div>
              <Label>Quantity to Issue</Label>
              <Input
                type="number"
                min="1"
                max={stockItem?.availableQuantity || 1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddItemModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  stockItem && addItemToBulkIssue(stockItem, quantity)
                }
                className="flex-1"
                disabled={!selectedStock}
              >
                Add Item
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Bulk Stock Issuing</h1>
            <p className="text-sm opacity-90">Issue stock to technicians</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setShowIssuedHistory(true)}
            >
              <History className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-full h-10 w-10"
              onClick={() => navigate("/inventory")}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Technician Selection */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Select Technician</h3>
            <Select
              value={selectedTechnician}
              onValueChange={setSelectedTechnician}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose technician to issue stock to" />
              </SelectTrigger>
              <SelectContent>
                {technicians
                  .filter((t) => t.status === "active")
                  .map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>
                          {tech.name} - {tech.department}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {selectedTechnicianData && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Sub-warehouse: {selectedTechnicianData.subWarehouse}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Issue Items */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Items to Issue</h3>
              <Button
                onClick={() => setShowAddItemModal(true)}
                size="sm"
                className="bg-green-500 hover:bg-green-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {bulkIssueItems.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No items added yet</p>
                <Button
                  onClick={() => setShowAddItemModal(true)}
                  variant="outline"
                  className="mt-2"
                >
                  Add First Item
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {bulkIssueItems.map((item) => (
                  <div key={item.stockItemId} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">{item.itemCode}</p>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() =>
                          removeItemFromBulkIssue(item.stockItemId)
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm">Qty:</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantityToIssue}
                          onChange={(e) =>
                            updateItemQuantity(
                              item.stockItemId,
                              parseInt(e.target.value) || 1,
                            )
                          }
                          className="w-20 h-8"
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        Unit: R{item.unitCost.toFixed(2)}
                      </p>
                      <p className="text-sm font-medium">
                        Total: R{item.totalCost.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">Total Value:</p>
                    <p className="text-lg font-bold text-blue-600">
                      R{totalIssueValue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Issue Notes</h3>
            <Textarea
              placeholder="Add notes about this stock issue (optional)"
              value={issueNotes}
              onChange={(e) => setIssueNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </CardContent>
        </Card>

        {/* Issue Button */}
        <Button
          onClick={handleBulkIssue}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 text-lg"
          disabled={!selectedTechnician || bulkIssueItems.length === 0}
        >
          <Send className="h-5 w-5 mr-2" />
          Issue Stock to Technician
        </Button>
      </div>

      {/* Add Item Modal */}
      <AddItemModal />

      {/* Issued History Modal */}
      <Dialog open={showIssuedHistory} onOpenChange={setShowIssuedHistory}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Stock Issue History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {issuedStockHistory.map((issue) => (
              <Card
                key={issue.id}
                className={issue.status === "revoked" ? "opacity-60" : ""}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold">{issue.technicianName}</p>
                      <p className="text-sm text-gray-600">
                        Issued:{" "}
                        {new Date(issue.issuedDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        By: {issue.issuedBy}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        R{issue.totalValue.toFixed(2)}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            issue.status === "issued"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {issue.status.toUpperCase()}
                        </span>
                        {issue.status === "issued" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => revokeStockIssue(issue.id)}
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {issue.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.itemCode} - {item.description}
                        </span>
                        <span>
                          Qty: {item.quantityToIssue} × R{item.unitCost} = R
                          {item.totalCost.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {issue.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-600">
                        Notes: {issue.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
