import { useState, useEffect } from "react";
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
  BarChart3,
  Download,
  Calendar,
  Users,
  Package,
  TrendingUp,
  Filter,
  Search,
  FileText,
  Activity,
  Clock,
} from "lucide-react";

export default function UsageReportsScreen() {
  const [usageHistory, setUsageHistory] = useState([]);
  const [filteredUsage, setFilteredUsage] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [filterTechnician, setFilterTechnician] = useState("all");
  const [analytics, setAnalytics] = useState({
    totalUsage: 0,
    totalValue: 0,
    topUsedItem: "",
    mostActiveUser: "",
    averageDaily: 0,
  });

  const technicians = [
    "Dyondzani Clement Masinge",
    "Sarah Johnson",
    "Mike Chen",
    "John Smith",
    "Lisa Anderson",
  ];

  useEffect(() => {
    loadUsageData();
  }, []);

  useEffect(() => {
    filterUsageData();
  }, [usageHistory, searchTerm, filterPeriod, filterTechnician]);

  const loadUsageData = async () => {
    try {
      const response = await fetch("/api/stock-management/usage");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsageHistory(data.data);
          calculateAnalytics(data.data);
        }
      } else {
        // Fallback data
        const fallbackData = [
          {
            id: "su1",
            technicianId: "tech001",
            itemName: "MICRO MINI 24F FIBRE BLACK",
            quantityUsed: 50,
            usageDate: new Date(Date.now() - 86400000).toISOString(),
            jobId: "SA-688808",
            jobTitle: "FTTH Installation",
            notes: "Customer installation",
          },
          {
            id: "su2",
            technicianId: "tech001",
            itemName: "UNJACKED PIGTAILS LC/APC - 1M",
            quantityUsed: 10,
            usageDate: new Date(Date.now() - 172800000).toISOString(),
            jobId: "SA-689901",
            jobTitle: "Maintenance Work",
            notes: "Repair work",
          },
          {
            id: "su3",
            technicianId: "tech002",
            itemName: "Cable Ties T50I BLACK",
            quantityUsed: 25,
            usageDate: new Date().toISOString(),
            jobId: "SA-690123",
            jobTitle: "New Installation",
            notes: "Cable management",
          },
        ];
        setUsageHistory(fallbackData);
        calculateAnalytics(fallbackData);
      }
    } catch (error) {
      console.error("Error loading usage data:", error);
    }
  };

  const calculateAnalytics = (data) => {
    const totalUsage = data.reduce((sum, item) => sum + item.quantityUsed, 0);

    // Group by item to find most used
    const itemUsage = {};
    data.forEach((usage) => {
      itemUsage[usage.itemName] =
        (itemUsage[usage.itemName] || 0) + usage.quantityUsed;
    });
    const topUsedItem = Object.keys(itemUsage).reduce(
      (a, b) => (itemUsage[a] > itemUsage[b] ? a : b),
      "",
    );

    // Group by technician to find most active
    const techUsage = {};
    data.forEach((usage) => {
      techUsage[usage.technicianId] =
        (techUsage[usage.technicianId] || 0) + usage.quantityUsed;
    });
    const mostActiveUser = Object.keys(techUsage).reduce(
      (a, b) => (techUsage[a] > techUsage[b] ? a : b),
      "",
    );

    setAnalytics({
      totalUsage,
      totalValue: totalUsage * 5.5, // Average value estimation
      topUsedItem,
      mostActiveUser,
      averageDaily: Math.round(totalUsage / 30),
    });
  };

  const filterUsageData = () => {
    let filtered = usageHistory;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (usage) =>
          usage.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usage.jobId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          usage.technicianId.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by period
    if (filterPeriod !== "all") {
      const now = new Date();
      const filterDate = new Date();

      switch (filterPeriod) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }

      filtered = filtered.filter(
        (usage) => new Date(usage.usageDate) >= filterDate,
      );
    }

    // Filter by technician
    if (filterTechnician !== "all") {
      filtered = filtered.filter(
        (usage) => usage.technicianId === filterTechnician,
      );
    }

    setFilteredUsage(filtered);
  };

  const exportReport = () => {
    const csvData = [
      ["Date", "Technician", "Item", "Quantity", "Job ID", "Notes"],
      ...filteredUsage.map((usage) => [
        new Date(usage.usageDate).toLocaleDateString(),
        usage.technicianId,
        usage.itemName,
        usage.quantityUsed,
        usage.jobId,
        usage.notes || "",
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `usage-report-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Usage Reports</h1>
            <p className="text-gray-600 mt-1">
              Analyze stock usage patterns and trends
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={exportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {analytics.totalUsage}
              </div>
              <p className="text-xs text-muted-foreground">Items used</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usage Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                R{analytics.totalValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Estimated value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Top Used Item
              </CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold text-purple-600">
                {analytics.topUsedItem}
              </div>
              <p className="text-xs text-muted-foreground">Most consumed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Daily Average
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {analytics.averageDaily}
              </div>
              <p className="text-xs text-muted-foreground">Items per day</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search usage..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Time Period</Label>
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">Last 7 Days</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Technician</Label>
                <Select
                  value={filterTechnician}
                  onValueChange={setFilterTechnician}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Technicians</SelectItem>
                    {technicians.map((tech, index) => (
                      <SelectItem key={index} value={`tech00${index + 1}`}>
                        {tech}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage History */}
        <Card>
          <CardHeader>
            <CardTitle>
              Usage History ({filteredUsage.length} records)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredUsage.map((usage) => (
                <div
                  key={usage.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {usage.itemName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Job: {usage.jobId} - {usage.jobTitle}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">
                          {new Date(usage.usageDate).toLocaleDateString()}
                        </span>
                        <span className="text-xs text-gray-500">
                          Technician: {usage.technicianId}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">
                        -{usage.quantityUsed}
                      </div>
                      <div className="text-xs text-gray-500">Used</div>
                    </div>

                    {usage.notes && (
                      <div className="max-w-xs">
                        <Badge variant="outline" className="text-xs">
                          {usage.notes}
                        </Badge>
                      </div>
                    )}
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
