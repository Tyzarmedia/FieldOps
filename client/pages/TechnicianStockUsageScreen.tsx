import { useState, useEffect } from "react";
import { useNotification } from "@/components/ui/notification";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  ArrowLeft,
  Search,
  Plus,
  QrCode,
  X,
  FileText,
  Settings,
  Camera,
  Package,
  PenTool,
  Clock,
} from "lucide-react";

interface TechnicianStock {
  id: string;
  itemId: string;
  itemName: string;
  itemSku: string;
  category: string;
  unit: string;
  assignedQuantity: number;
  usedQuantity: number;
  remainingQuantity: number;
  status: string;
}

export default function TechnicianStockUsageScreen() {
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const [assignedItems, setAssignedItems] = useState<TechnicianStock[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContainer, setSelectedContainer] = useState("");
  const [usageForm, setUsageForm] = useState({
    code: "",
    container: "",
    qtyUsed: "",
    description: "",
    comments: "",
  });
  const [usageList, setUsageList] = useState<
    {
      id: string;
      itemName: string;
      quantity: number;
      unit: string;
      container: string;
      description: string;
      timestamp: string;
    }[]
  >([]);

  // Load assigned stock items and usage list
  useEffect(() => {
    // Load previous usage list from localStorage
    const savedUsageList = localStorage.getItem("stock-usage-list");
    if (savedUsageList) {
      try {
        setUsageList(JSON.parse(savedUsageList));
      } catch (error) {
        console.error("Error loading usage list:", error);
      }
    }

    const loadAssignedStock = async () => {
      try {
        const response = await fetch(
          "/api/stock-management/assignments/technician/tech001",
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setAssignedItems(data.data);
          }
        } else {
          // Fallback data
          setAssignedItems([
            {
              id: "ts1",
              itemId: "CAB00092",
              itemName: "MICRO MINI 24F FIBRE BLACK",
              itemSku: "CAB00092",
              category: "Cables",
              unit: "meters",
              assignedQuantity: 500,
              usedQuantity: 200,
              remainingQuantity: 300,
              status: "in-use",
            },
            {
              id: "ts2",
              itemId: "CAB00175",
              itemName: "UNJACKED PIGTAILS LC/APC - 1M",
              itemSku: "CAB00175",
              category: "Connectors",
              unit: "pieces",
              assignedQuantity: 100,
              usedQuantity: 75,
              remainingQuantity: 25,
              status: "in-use",
            },
          ]);
        }
      } catch (err) {
        console.log("Using fallback data");
        setAssignedItems([
          {
            id: "ts1",
            itemId: "CAB00092",
            itemName: "MICRO MINI 24F FIBRE BLACK",
            itemSku: "CAB00092",
            category: "Cables",
            unit: "meters",
            assignedQuantity: 500,
            usedQuantity: 200,
            remainingQuantity: 300,
            status: "in-use",
          },
        ]);
      }
    };

    loadAssignedStock();
  }, []);

  const filteredItems = assignedItems.filter(
    (item) =>
      (item.itemName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (item.itemSku?.toLowerCase() || "").includes(searchTerm.toLowerCase()),
  );

  const submitUsage = async () => {
    if (!usageForm.code || !usageForm.qtyUsed) {
      error("Error", "Please fill in the required fields (Code and Qty Used)");
      return;
    }

    const selectedItem = assignedItems.find(
      (item) =>
        item.itemSku === usageForm.code || item.itemName === usageForm.code,
    );

    if (!selectedItem) {
      error("Error", "Selected item not found in your assigned stock");
      return;
    }

    const qtyUsed = parseInt(usageForm.qtyUsed);
    if (qtyUsed > selectedItem.remainingQuantity) {
      error(
        "Error",
        `You only have ${selectedItem.remainingQuantity} ${selectedItem.unit} remaining`,
      );
      return;
    }

    try {
      // Add to usage list
      const usageEntry = {
        id: `usage-${Date.now()}`,
        itemName: selectedItem.itemName,
        quantity: qtyUsed,
        unit: selectedItem.unit,
        container: usageForm.container || "Unknown",
        description: usageForm.description || "No description",
        timestamp: new Date().toISOString(),
      };

      setUsageList((prev) => {
        const newList = [usageEntry, ...prev];
        // Save to localStorage for validation
        localStorage.setItem("stock-usage-list", JSON.stringify(newList));
        return newList;
      });

      // Update local state
      setAssignedItems((items) =>
        items.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                usedQuantity: item.usedQuantity + qtyUsed,
                remainingQuantity: item.remainingQuantity - qtyUsed,
                status:
                  item.remainingQuantity - qtyUsed === 0
                    ? "depleted"
                    : "in-use",
              }
            : item,
        ),
      );

      // Reset form
      setUsageForm({
        code: "",
        container: "",
        qtyUsed: "",
        description: "",
        comments: "",
      });

      success(
        "Success",
        `Stock usage recorded: ${qtyUsed} ${selectedItem.unit} of ${selectedItem.itemName}`,
      );
    } catch (err) {
      error("Error", "Failed to record stock usage");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header - matching the image exactly */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Add Stock</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0"
            onClick={() => navigate("/stock-on-hand")}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Form Section */}
          <div className="p-4 space-y-4 bg-white border-b">
            {/* Code */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Code</Label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  placeholder="Search..."
                  value={usageForm.code}
                  onChange={(e) => {
                    setUsageForm({ ...usageForm, code: e.target.value });
                    setSearchTerm(e.target.value);
                  }}
                  className="pl-12 pr-12 h-12 text-gray-500 border-gray-200 bg-gray-50"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <QrCode className="h-6 w-6 text-gray-400" />
                </div>
              </div>

              {/* Search Results */}
              {searchTerm && filteredItems.length > 0 && (
                <div className="border rounded-md bg-white shadow-sm max-h-32 overflow-y-auto mt-2">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      onClick={() => {
                        setUsageForm({ ...usageForm, code: item.itemSku });
                        setSearchTerm("");
                      }}
                    >
                      <div className="font-medium text-sm">{item.itemName}</div>
                      <div className="text-xs text-gray-500">
                        SKU: {item.itemSku} • Available:{" "}
                        {item.remainingQuantity} {item.unit}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Container */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">
                  Container
                </Label>
                <Select
                  value={usageForm.container}
                  onValueChange={(value) =>
                    setUsageForm({ ...usageForm, container: value })
                  }
                >
                  <SelectTrigger className="h-10 text-gray-500 border-gray-200 bg-gray-50">
                    <SelectValue placeholder="Container" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="van-001">Van 001</SelectItem>
                    <SelectItem value="van-002">Van 002</SelectItem>
                    <SelectItem value="warehouse-a">Warehouse A</SelectItem>
                    <SelectItem value="field-kit">Field Kit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Qty Used */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">
                  Qty Used
                </Label>
                <Input
                  type="number"
                  value={usageForm.qtyUsed}
                  onChange={(e) =>
                    setUsageForm({ ...usageForm, qtyUsed: e.target.value })
                  }
                  className="h-10 text-gray-500 border-gray-200 bg-gray-50"
                  min="1"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">
                Description
              </Label>
              <Textarea
                value={usageForm.description}
                onChange={(e) =>
                  setUsageForm({ ...usageForm, description: e.target.value })
                }
                className="h-16 text-gray-500 border-gray-200 bg-gray-50 resize-none"
                rows={2}
              />
            </div>
          </div>

          {/* Add Button - Above bottom nav */}
          <div className="p-4 bg-white border-b">
            <Button
              onClick={submitUsage}
              className="w-full bg-green-400 hover:bg-green-500 text-white py-3 text-lg font-medium rounded-2xl"
              disabled={!usageForm.code || !usageForm.qtyUsed}
            >
              <Plus className="h-5 w-5 mr-2" />
              Add
            </Button>
          </div>

          {/* Usage List */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3">Stock Usage List</h3>
              {usageList.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No stock usage recorded yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {usageList.map((usage) => (
                    <div
                      key={usage.id}
                      className="bg-white rounded-lg p-4 shadow-sm border"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {usage.itemName}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(usage.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          Quantity: {usage.quantity} {usage.unit}
                        </div>
                        <div>Container: {usage.container}</div>
                      </div>
                      {usage.description && (
                        <p className="text-sm text-gray-600 mt-2">
                          {usage.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Bottom padding for navigation */}
            <div className="h-20"></div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 p-3 text-gray-600"
            onClick={() => navigate("/technician/jobs")}
          >
            <FileText className="h-6 w-6" />
            <span className="text-xs font-medium">Details</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 p-3 text-gray-600"
            onClick={() => navigate("/technician/udf")}
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs font-medium">Udf</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 p-3 text-gray-600"
            onClick={() => navigate("/technician/gallery")}
          >
            <Camera className="h-6 w-6" />
            <span className="text-xs font-medium">Gallery</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 p-3 text-blue-600"
            onClick={() => navigate("/stock-on-hand")}
          >
            <Package className="h-6 w-6" />
            <span className="text-xs font-medium">Stocks</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 p-3 text-orange-600"
            onClick={() => navigate("/technician/signoff")}
          >
            <PenTool className="h-6 w-6" />
            <span className="text-xs font-medium">Sign Off</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
