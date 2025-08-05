import { useState, useEffect } from "react";
import { useNotification } from "@/components/ui/notification";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { X, Search, QrCode, Plus, Mic } from "lucide-react";

interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
}

export default function MobileAddStockScreen() {
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContainer, setSelectedContainer] = useState("");
  const [qtyUsed, setQtyUsed] = useState("");
  const [description, setDescription] = useState("");
  const [comments, setComments] = useState("");
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<StockItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);

  // Container options
  const containers = ["VAN462", "VAN463", "VAN464", "VAN465"];

  useEffect(() => {
    // Load stock items from API
    const loadStockItems = async () => {
      try {
        const response = await fetch("/api/stock-management/items");
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const items = data.data.map((item: any) => ({
              id: item.id,
              name: item.name,
              sku: item.sku,
              category: item.category,
            }));
            setStockItems(items);
            setFilteredItems(items);
          }
        }
      } catch (error) {
        console.error("Error loading stock items:", error);
      }
    };

    loadStockItems();
  }, []);

  useEffect(() => {
    // Filter items based on search term
    if (searchTerm.trim() === "") {
      setFilteredItems(stockItems);
    } else {
      const filtered = stockItems.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.sku.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, stockItems]);

  const handleSelectItem = (item: StockItem) => {
    setSelectedItem(item);
    setSearchTerm(item.sku + " - " + item.name);
    setFilteredItems([]);
  };

  const handleAddStock = async () => {
    if (!selectedItem || !selectedContainer || !qtyUsed) {
      error("Validation Error", "Please fill in all required fields");
      return;
    }

    try {
      // Here you would typically call an API to add/use stock
      console.log("Adding stock usage:", {
        itemId: selectedItem.id,
        container: selectedContainer,
        quantity: parseInt(qtyUsed),
        description,
        comments,
      });

      success("Success", "Stock added successfully!");
      setTimeout(() => navigate(-1), 1500); // Go back after showing notification
    } catch (error) {
      console.error("Error adding stock:", error);
      error("Error", "Failed to add stock");
    }
  };

  const handleQRScan = () => {
    // QR code scanner functionality would go here
    error("Feature Unavailable", "QR Scanner not implemented yet");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Orange Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Add Stock</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => navigate(-1)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Search Section */}
        <div className="relative">
          <Label htmlFor="search" className="text-sm text-gray-600 mb-2 block">
            Code
          </Label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="search"
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-12 py-3 text-lg"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={handleQRScan}
            >
              <QrCode className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Results Dropdown */}
          {filteredItems.length > 0 && searchTerm && (
            <Card className="absolute top-full left-0 right-0 mt-1 max-h-80 overflow-y-auto z-50 border shadow-lg">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSelectItem(item)}
                >
                  <div className="font-medium text-gray-900">
                    {item.sku} - {item.name}
                  </div>
                  <div className="text-sm text-gray-500">({item.category})</div>
                </div>
              ))}
            </Card>
          )}
        </div>

        {/* Container Selection */}
        <div>
          <Label
            htmlFor="container"
            className="text-sm text-gray-600 mb-2 block"
          >
            Container
          </Label>
          <Select
            value={selectedContainer}
            onValueChange={setSelectedContainer}
          >
            <SelectTrigger className="w-full py-3 text-lg">
              <SelectValue placeholder="Select Container" />
            </SelectTrigger>
            <SelectContent>
              {containers.map((container) => (
                <SelectItem key={container} value={container}>
                  {container}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quantity Used */}
        <div>
          <Label htmlFor="qtyUsed" className="text-sm text-gray-600 mb-2 block">
            Qty Used
          </Label>
          <Input
            id="qtyUsed"
            type="number"
            placeholder="Enter quantity"
            value={qtyUsed}
            onChange={(e) => setQtyUsed(e.target.value)}
            className="py-3 text-lg"
          />
        </div>

        {/* Description */}
        <div>
          <Label
            htmlFor="description"
            className="text-sm text-gray-600 mb-2 block"
          >
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Enter description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px] text-lg"
          />
        </div>

        {/* Comments */}
        <div>
          <Label
            htmlFor="comments"
            className="text-sm text-gray-600 mb-2 block"
          >
            Comments
          </Label>
          <div className="relative">
            <Textarea
              id="comments"
              placeholder="Enter comments..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="min-h-[120px] text-lg pr-12"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-2 right-2 text-green-500 hover:bg-green-50"
            >
              <Mic className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Add Button */}
        <div className="pt-6">
          <Button
            onClick={handleAddStock}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-medium rounded-lg"
            disabled={!selectedItem || !selectedContainer || !qtyUsed}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
