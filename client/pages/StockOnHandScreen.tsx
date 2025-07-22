import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Search,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter,
  Plus,
  Minus,
} from "lucide-react";

interface StockItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  location: string;
  lastUpdated: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
  allocated?: number;
}

export default function StockOnHandScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const stockItems: StockItem[] = [
    {
      id: "STK001",
      name: "Fiber Optic Cable (Single Mode)",
      sku: "FOC-SM-001",
      category: "Cables",
      currentStock: 250,
      minStock: 50,
      maxStock: 500,
      unit: "meters",
      location: "Warehouse A-1",
      lastUpdated: "2025-01-21",
      status: "in-stock",
      allocated: 25,
    },
    {
      id: "STK002",
      name: "Splice Protectors",
      sku: "SP-001",
      category: "Accessories",
      currentStock: 15,
      minStock: 20,
      maxStock: 100,
      unit: "pieces",
      location: "Warehouse A-2",
      lastUpdated: "2025-01-21",
      status: "low-stock",
      allocated: 5,
    },
    {
      id: "STK003",
      name: "ONT Device (Huawei)",
      sku: "ONT-HW-001",
      category: "Equipment",
      currentStock: 0,
      minStock: 10,
      maxStock: 50,
      unit: "pieces",
      location: "Warehouse B-1",
      lastUpdated: "2025-01-20",
      status: "out-of-stock",
    },
    {
      id: "STK004",
      name: "Cable Ties (Black)",
      sku: "CT-BL-001",
      category: "Accessories",
      currentStock: 500,
      minStock: 100,
      maxStock: 1000,
      unit: "pieces",
      location: "Warehouse A-3",
      lastUpdated: "2025-01-21",
      status: "in-stock",
      allocated: 50,
    },
    {
      id: "STK005",
      name: "Network Switch (24-port)",
      sku: "NS-24P-001",
      category: "Equipment",
      currentStock: 8,
      minStock: 5,
      maxStock: 20,
      unit: "pieces",
      location: "Warehouse B-2",
      lastUpdated: "2025-01-19",
      status: "in-stock",
      allocated: 2,
    },
  ];

  const categories = ["all", "Cables", "Accessories", "Equipment"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800";
      case "out-of-stock":
        return "bg-red-100 text-red-800";
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
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredItems = stockItems.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const stockSummary = {
    total: stockItems.length,
    inStock: stockItems.filter((item) => item.status === "in-stock").length,
    lowStock: stockItems.filter((item) => item.status === "low-stock").length,
    outOfStock: stockItems.filter((item) => item.status === "out-of-stock")
      .length,
  };

  const calculateStockLevel = (current: number, min: number, max: number) => {
    return Math.round((current / max) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate(-1)}
            >
              <X className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Stock on Hand</h1>
              <p className="text-sm opacity-90">Current inventory levels</p>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mt-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-white text-green-600"
                    : "text-white hover:bg-white/20"
                }`}
              >
                {category === "all" ? "All Items" : category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        {/* Stock Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Stock Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stockSummary.total}
                </div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stockSummary.inStock}
                </div>
                <div className="text-sm text-gray-600">In Stock</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {stockSummary.lowStock}
                </div>
                <div className="text-sm text-gray-600">Low Stock</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stockSummary.outOfStock}
                </div>
                <div className="text-sm text-gray-600">Out of Stock</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Items */}
        <div className="space-y-4">
          {filteredItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{item.name}</h3>
                      <Badge className={getStatusColor(item.status)}>
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(item.status)}
                          <span>
                            {item.status === "in-stock"
                              ? "In Stock"
                              : item.status === "low-stock"
                                ? "Low Stock"
                                : "Out of Stock"}
                          </span>
                        </div>
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">SKU:</span> {item.sku}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span>{" "}
                        {item.category}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span>{" "}
                        {item.location}
                      </div>
                      <div>
                        <span className="font-medium">Last Updated:</span>{" "}
                        {item.lastUpdated}
                      </div>
                    </div>

                    {/* Stock Level */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>
                          Current Stock:{" "}
                          <span className="font-semibold">
                            {item.currentStock} {item.unit}
                          </span>
                        </span>
                        {item.allocated && (
                          <span className="text-orange-600">
                            Allocated: {item.allocated} {item.unit}
                          </span>
                        )}
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.status === "in-stock"
                              ? "bg-green-500"
                              : item.status === "low-stock"
                                ? "bg-yellow-500"
                                : "bg-red-500"
                          }`}
                          style={{
                            width: `${Math.min(100, calculateStockLevel(item.currentStock, item.minStock, item.maxStock))}%`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Min: {item.minStock}</span>
                        <span>
                          Available: {item.currentStock - (item.allocated || 0)}
                        </span>
                        <span>Max: {item.maxStock}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Request
                    </Button>
                    <Button size="sm" variant="outline">
                      <Package className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No items found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
