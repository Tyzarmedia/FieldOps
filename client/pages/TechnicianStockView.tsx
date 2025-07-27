import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  X,
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  AlertTriangle,
  Check,
  PackageSearch,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TechnicianStockItem {
  id: string;
  itemCode: string;
  description: string;
  category: string;
  allocatedQuantity: number;
  usedQuantity: number;
  availableQuantity: number;
  unitCost: number;
  dateAllocated: string;
  jobReference?: string;
  warehouse: string;
}

interface AddStockForm {
  itemCode: string;
  description: string;
  quantity: number;
  jobReference: string;
  unitCost: number;
}

export default function TechnicianStockView() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stockItems, setStockItems] = useState<TechnicianStockItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<TechnicianStockItem | null>(
    null,
  );
  const [addStockForm, setAddStockForm] = useState<AddStockForm>({
    itemCode: "",
    description: "",
    quantity: 0,
    jobReference: "",
    unitCost: 0,
  });

  // Mock technician allocated stock data
  useEffect(() => {
    const mockStockItems: TechnicianStockItem[] = [
      {
        id: "ts-001",
        itemCode: "FOC-SM-50M",
        description: "Single Mode Fiber Optic Cable 50m",
        category: "Fiber Optic Cables",
        allocatedQuantity: 10,
        usedQuantity: 7,
        availableQuantity: 3,
        unitCost: 125.5,
        dateAllocated: new Date().toISOString(),
        jobReference: "SA-689001",
        warehouse: "Technician-JohnDoe",
      },
      {
        id: "ts-002",
        itemCode: "SPL-PROT-12",
        description: "Splice Protectors 12-pack",
        category: "Splice Equipment",
        allocatedQuantity: 5,
        usedQuantity: 4,
        availableQuantity: 1,
        unitCost: 45.0,
        dateAllocated: new Date().toISOString(),
        jobReference: "SA-689001",
        warehouse: "Technician-JohnDoe",
      },
      {
        id: "ts-003",
        itemCode: "ONT-GPON-V2",
        description: "GPON ONT Device V2",
        category: "Network Equipment",
        allocatedQuantity: 2,
        usedQuantity: 0,
        availableQuantity: 2,
        unitCost: 850.0,
        dateAllocated: new Date().toISOString(),
        warehouse: "Technician-JohnDoe",
      },
      {
        id: "ts-004",
        itemCode: "CT-TIES-100",
        description: "Cable Ties 100-pack",
        category: "Tools & Accessories",
        allocatedQuantity: 3,
        usedQuantity: 3,
        availableQuantity: 0,
        unitCost: 15.0,
        dateAllocated: new Date().toISOString(),
        jobReference: "SA-689102",
        warehouse: "Technician-JohnDoe",
      },
    ];

    setStockItems(mockStockItems);
  }, []);

  const filteredItems = stockItems.filter(
    (item) =>
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalValue = stockItems.reduce(
    (sum, item) => sum + item.availableQuantity * item.unitCost,
    0,
  );

  const lowStockItems = stockItems.filter(
    (item) => item.availableQuantity <= 1,
  );

  const handleAddStock = () => {
    const newItem: TechnicianStockItem = {
      id: `ts-${Date.now()}`,
      itemCode: addStockForm.itemCode,
      description: addStockForm.description,
      category: "General",
      allocatedQuantity: addStockForm.quantity,
      usedQuantity: 0,
      availableQuantity: addStockForm.quantity,
      unitCost: addStockForm.unitCost,
      dateAllocated: new Date().toISOString(),
      jobReference: addStockForm.jobReference,
      warehouse: "Technician-JohnDoe",
    };

    setStockItems((prev) => [...prev, newItem]);
    setAddStockForm({
      itemCode: "",
      description: "",
      quantity: 0,
      jobReference: "",
      unitCost: 0,
    });
    setShowAddForm(false);

    toast({
      title: "Stock Added",
      description: `${newItem.description} added to your allocated stock`,
    });
  };

  const handleEditStock = (item: TechnicianStockItem) => {
    setEditingItem(item);
  };

  const handleUpdateStock = () => {
    if (!editingItem) return;

    setStockItems((prev) =>
      prev.map((item) => (item.id === editingItem.id ? editingItem : item)),
    );
    setEditingItem(null);

    toast({
      title: "Stock Updated",
      description: `${editingItem.description} has been updated`,
    });
  };

  const handleDeleteStock = (itemId: string) => {
    const item = stockItems.find((s) => s.id === itemId);
    setStockItems((prev) => prev.filter((s) => s.id !== itemId));

    toast({
      title: "Stock Removed",
      description: `${item?.description} removed from your allocated stock`,
    });
  };

  const getStockStatus = (item: TechnicianStockItem) => {
    const usagePercentage = (item.usedQuantity / item.allocatedQuantity) * 100;
    if (usagePercentage === 100)
      return { color: "bg-red-500", text: "Depleted" };
    if (usagePercentage >= 80) return { color: "bg-orange-500", text: "Low" };
    if (usagePercentage >= 50)
      return { color: "bg-yellow-500", text: "Medium" };
    return { color: "bg-green-500", text: "Good" };
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">My Stock</h1>
            <p className="text-sm opacity-90">Allocated Inventory</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full h-10 w-10"
            onClick={() => navigate("/")}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Stock Summary */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{stockItems.length}</div>
            <div className="text-xs opacity-90">Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">R{totalValue.toFixed(0)}</div>
            <div className="text-xs opacity-90">Total Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-200">
              {lowStockItems.length}
            </div>
            <div className="text-xs opacity-90">Low Stock</div>
          </div>
        </div>
      </div>

      {/* Add Stock Button */}
      <div className="p-4">
        <Button
          onClick={() => setShowAddForm(true)}
          className="w-full bg-green-500 hover:bg-green-600 text-white mb-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Stock Item
        </Button>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search stock items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-orange-400 mr-2" />
              <p className="text-sm text-orange-700">
                {lowStockItems.length} item(s) running low. Consider requesting
                replenishment.
              </p>
            </div>
          </div>
        )}

        {/* Stock Items List */}
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const status = getStockStatus(item);
            return (
              <Card key={item.id} className="bg-white shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800">
                          {item.itemCode}
                        </h3>
                        <Badge className={`${status.color} text-white text-xs`}>
                          {status.text}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.description}
                      </p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditStock(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleDeleteStock(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Allocated</p>
                      <p className="font-medium">{item.allocatedQuantity}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Used</p>
                      <p className="font-medium">{item.usedQuantity}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Available</p>
                      <p className="font-medium text-green-600">
                        {item.availableQuantity}
                      </p>
                    </div>
                  </div>

                  {item.jobReference && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Job Reference:{" "}
                        <span className="font-medium">{item.jobReference}</span>
                      </p>
                    </div>
                  )}

                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${status.color}`}
                        style={{
                          width: `${(item.usedQuantity / item.allocatedQuantity) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(
                        (item.usedQuantity / item.allocatedQuantity) * 100,
                      )}
                      % used
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <PackageSearch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No stock items found
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Try adjusting your search"
                : "Request stock allocation from your manager"}
            </p>
          </div>
        )}
      </div>

      {/* Add Stock Modal */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Stock Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="itemCode">Item Code</Label>
              <Input
                id="itemCode"
                value={addStockForm.itemCode}
                onChange={(e) =>
                  setAddStockForm((prev) => ({
                    ...prev,
                    itemCode: e.target.value,
                  }))
                }
                placeholder="Enter item code"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={addStockForm.description}
                onChange={(e) =>
                  setAddStockForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter item description"
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={addStockForm.quantity}
                onChange={(e) =>
                  setAddStockForm((prev) => ({
                    ...prev,
                    quantity: parseInt(e.target.value) || 0,
                  }))
                }
                placeholder="Enter quantity"
              />
            </div>
            <div>
              <Label htmlFor="jobReference">Job Reference (Optional)</Label>
              <Input
                id="jobReference"
                value={addStockForm.jobReference}
                onChange={(e) =>
                  setAddStockForm((prev) => ({
                    ...prev,
                    jobReference: e.target.value,
                  }))
                }
                placeholder="Enter job reference"
              />
            </div>
            <div>
              <Label htmlFor="unitCost">Unit Cost</Label>
              <Input
                id="unitCost"
                type="number"
                step="0.01"
                value={addStockForm.unitCost}
                onChange={(e) =>
                  setAddStockForm((prev) => ({
                    ...prev,
                    unitCost: parseFloat(e.target.value) || 0,
                  }))
                }
                placeholder="Enter unit cost"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={handleAddStock} className="flex-1">
                Add Stock
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Stock Modal */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Stock Item</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="editUsedQuantity">Used Quantity</Label>
                <Input
                  id="editUsedQuantity"
                  type="number"
                  value={editingItem.usedQuantity}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      usedQuantity: parseInt(e.target.value) || 0,
                      availableQuantity:
                        editingItem.allocatedQuantity -
                        (parseInt(e.target.value) || 0),
                    })
                  }
                  max={editingItem.allocatedQuantity}
                />
              </div>
              <div>
                <Label htmlFor="editJobReference">Job Reference</Label>
                <Input
                  id="editJobReference"
                  value={editingItem.jobReference || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      jobReference: e.target.value,
                    })
                  }
                  placeholder="Enter job reference"
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateStock} className="flex-1">
                  Update
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
