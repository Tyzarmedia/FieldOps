import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  BarChart3,
  Activity,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Plus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function StockOverviewScreen() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stockItems, setStockItems] = useState([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    lowStock: 0,
    outOfStock: 0,
    inStock: 0,
    criticalAlerts: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStockData();
  }, []);

  const loadStockData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stock-management/items");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStockItems(data.data);
          calculateStats(data.data);
        }
      } else {
        // Fallback data
        const fallbackData = [
          {
            id: "CAB00092",
            name: "MICRO MINI 24F FIBRE BLACK",
            description: "24 fiber micro mini cable for FTTH applications",
            category: "Cables",
            sku: "CAB00092",
            quantity: 2000,
            minimumQuantity: 500,
            unitPrice: 4.2,
            status: "in-stock",
            location: "VAN462",
          },
          {
            id: "CAB00175",
            name: "UNJACKED PIGTAILS LC/APC - 1M",
            description: "Unjacked pigtails LC/APC connector 1 meter",
            category: "Connectors",
            sku: "CAB00175",
            quantity: 50,
            minimumQuantity: 100,
            unitPrice: 8.5,
            status: "low-stock",
            location: "VAN462",
          },
          {
            id: "TRA00115",
            name: "MIDCOUPLER LC/APC GREEN",
            description: "Midcoupler LC/APC green connector",
            category: "Trays",
            sku: "TRA00115",
            quantity: 0,
            minimumQuantity: 25,
            unitPrice: 18.0,
            status: "out-of-stock",
            location: "VAN462",
          },
        ];
        setStockItems(fallbackData);
        calculateStats(fallbackData);
      }
    } catch (error) {
      console.error("Error loading stock data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (items) => {
    setStats({
      totalItems: items.length,
      totalValue: items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      ),
      lowStock: items.filter((item) => item.status === "low-stock").length,
      outOfStock: items.filter((item) => item.status === "out-of-stock").length,
      inStock: items.filter((item) => item.status === "in-stock").length,
      criticalAlerts: items.filter(
        (item) => item.status === "out-of-stock" || item.status === "low-stock",
      ).length,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "in-stock":
        return "bg-green-100 text-green-800 border-green-200";
      case "low-stock":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "out-of-stock":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredItems = stockItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stock Overview</h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage your inventory levels
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={loadStockData}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => navigate("/")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalItems}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all categories
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R{stats.totalValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Current inventory value
              </p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setFilterStatus("low-stock")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.lowStock}
              </div>
              <p className="text-xs text-red-600">Needs attention</p>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setFilterStatus("out-of-stock")}
          >
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
              <p className="text-xs text-red-600">Critical alerts</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Inventory Items</CardTitle>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">
                          SKU: {item.sku}
                        </span>
                        <span className="text-xs text-gray-500">
                          Category: {item.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          Location: {item.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-bold">{item.quantity}</div>
                      <div className="text-xs text-gray-500">Available</div>
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        R{item.unitPrice}
                      </div>
                      <div className="text-xs text-gray-500">Unit Price</div>
                    </div>

                    <Badge className={getStatusColor(item.status)}>
                      {item.status.replace("-", " ")}
                    </Badge>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
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
}
