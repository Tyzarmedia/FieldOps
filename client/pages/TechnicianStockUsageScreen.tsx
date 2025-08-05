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

  // Load assigned stock items
  useEffect(() => {
    const loadAssignedStock = async () => {
      try {
        const response = await fetch("/api/stock-management/assignments/technician/tech001");
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
            }
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
          }
        ]);
      }
    };

    loadAssignedStock();
  }, []);

  const filteredItems = assignedItems.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemSku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const submitUsage = async () => {
    if (!usageForm.code || !usageForm.qtyUsed) {
      error("Error", "Please fill in the required fields (Code and Qty Used)");
      return;
    }

    const selectedItem = assignedItems.find(item => 
      item.itemSku === usageForm.code || item.itemName === usageForm.code
    );

    if (!selectedItem) {
      error("Error", "Selected item not found in your assigned stock");
      return;
    }

    const qtyUsed = parseInt(usageForm.qtyUsed);
    if (qtyUsed > selectedItem.remainingQuantity) {
      error("Error", `You only have ${selectedItem.remainingQuantity} ${selectedItem.unit} remaining`);
      return;
    }

    try {
      // Update local state
      setAssignedItems(items => items.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              usedQuantity: item.usedQuantity + qtyUsed,
              remainingQuantity: item.remainingQuantity - qtyUsed,
              status: item.remainingQuantity - qtyUsed === 0 ? "depleted" : "in-use"
            }
          : item
      ));

      // Reset form
      setUsageForm({
        code: "",
        container: "",
        qtyUsed: "",
        description: "",
        comments: "",
      });

      success("Success", `Stock usage recorded: ${qtyUsed} ${selectedItem.unit} of ${selectedItem.itemName}`);
    } catch (err) {
      error("Error", "Failed to record stock usage");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - matching the image exactly */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Add Stock</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0"
            onClick={() => navigate(-1)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
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
            <div className="border rounded-md bg-white shadow-sm max-h-40 overflow-y-auto mt-2">
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
                    SKU: {item.itemSku} • Available: {item.remainingQuantity} {item.unit}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Container */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-500">Container</Label>
          <Select
            value={usageForm.container}
            onValueChange={(value) => setUsageForm({ ...usageForm, container: value })}
          >
            <SelectTrigger className="h-12 text-gray-500 border-gray-200 bg-gray-50">
              <SelectValue placeholder="Select Container" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="van-001">Van 001</SelectItem>
              <SelectItem value="van-002">Van 002</SelectItem>
              <SelectItem value="warehouse-a">Warehouse A</SelectItem>
              <SelectItem value="warehouse-b">Warehouse B</SelectItem>
              <SelectItem value="field-kit">Field Kit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Qty Used */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-500">Qty Used</Label>
          <Input
            type="number"
            value={usageForm.qtyUsed}
            onChange={(e) => setUsageForm({ ...usageForm, qtyUsed: e.target.value })}
            className="h-12 text-gray-500 border-gray-200 bg-gray-50"
            min="1"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-500">Description</Label>
          <Textarea
            value={usageForm.description}
            onChange={(e) => setUsageForm({ ...usageForm, description: e.target.value })}
            className="min-h-24 text-gray-500 border-gray-200 bg-gray-50 resize-none"
            rows={3}
          />
        </div>

        {/* Comments */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-500">Comments</Label>
          <div className="relative">
            <Textarea
              value={usageForm.comments}
              onChange={(e) => setUsageForm({ ...usageForm, comments: e.target.value })}
              className="min-h-32 text-gray-500 border-gray-200 bg-gray-50 resize-none pr-12"
              rows={4}
            />
            <div className="absolute bottom-3 right-3">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-500">
                🎤
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Add Button at bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white">
        <Button
          onClick={submitUsage}
          className="w-full bg-green-400 hover:bg-green-500 text-white py-4 text-lg font-medium rounded-2xl shadow-lg"
          disabled={!usageForm.code || !usageForm.qtyUsed}
        >
          <Plus className="h-6 w-6 mr-2" />
          Add
        </Button>
      </div>

      {/* Bottom padding to account for fixed button */}
      <div className="h-24"></div>
    </div>
  );
}
