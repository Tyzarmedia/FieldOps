import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  DollarSign,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

interface BonusDeduction {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  department: string;
  type: "bonus" | "deduction";
  category: string;
  description: string;
  amount: number;
  effectiveDate: string;
  status: "pending" | "approved" | "processed" | "rejected";
  createdBy: string;
  createdAt: string;
  processedAt?: string;
  notes?: string;
}

interface Summary {
  totalBonuses: number;
  totalDeductions: number;
  pendingBonuses: number;
  pendingDeductions: number;
  employeesAffected: number;
  averageBonus: number;
  averageDeduction: number;
}

export default function BonusesDeductionsScreen() {
  const [bonusesDeductions, setBonusesDeductions] = useState<BonusDeduction[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BonusDeduction | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // New bonus/deduction form state
  const [formData, setFormData] = useState({
    employeeId: "",
    type: "bonus" as "bonus" | "deduction",
    category: "",
    description: "",
    amount: "",
    effectiveDate: new Date().toISOString().split('T')[0],
    notes: "",
  });

  useEffect(() => {
    loadBonusesDeductions();
  }, []);

  const loadBonusesDeductions = async () => {
    try {
      setLoading(true);
      // Mock data - would come from API
      const mockData: BonusDeduction[] = [
        {
          id: "BD001",
          employeeId: "E001",
          employeeName: "John Smith",
          employeeNumber: "FO-001",
          department: "Field Operations",
          type: "bonus",
          category: "Performance Bonus",
          description: "Q4 2024 Performance Bonus",
          amount: 5000,
          effectiveDate: "2025-01-31",
          status: "approved",
          createdBy: "Sarah Wilson",
          createdAt: "2025-01-15T10:00:00Z",
          processedAt: "2025-01-16T14:30:00Z",
          notes: "Excellent performance this quarter",
        },
        {
          id: "BD002",
          employeeId: "E002",
          employeeName: "Mike Johnson",
          employeeNumber: "FO-002",
          department: "Field Operations",
          type: "bonus",
          category: "Overtime Bonus",
          description: "Additional overtime compensation",
          amount: 2500,
          effectiveDate: "2025-01-31",
          status: "pending",
          createdBy: "Sarah Wilson",
          createdAt: "2025-01-20T09:15:00Z",
        },
        {
          id: "BD003",
          employeeId: "E003",
          employeeName: "Lisa Davis",
          employeeNumber: "FO-003",
          department: "Field Operations",
          type: "deduction",
          category: "Equipment Damage",
          description: "Repair costs for damaged equipment",
          amount: 800,
          effectiveDate: "2025-02-28",
          status: "pending",
          createdBy: "Mike Thompson",
          createdAt: "2025-01-22T11:20:00Z",
          notes: "Equipment damaged during installation - employee responsibility",
        },
        {
          id: "BD004",
          employeeId: "E004",
          employeeName: "David Wilson",
          employeeNumber: "FO-004",
          department: "Field Operations",
          type: "bonus",
          category: "Safety Bonus",
          description: "Safety compliance recognition",
          amount: 1000,
          effectiveDate: "2025-01-31",
          status: "approved",
          createdBy: "Sarah Wilson",
          createdAt: "2025-01-18T16:45:00Z",
          processedAt: "2025-01-19T10:15:00Z",
        },
        {
          id: "BD005",
          employeeId: "E005",
          employeeName: "Emma Brown",
          employeeNumber: "HR-001",
          department: "HR",
          type: "deduction",
          category: "Advance Repayment",
          description: "Salary advance repayment",
          amount: 1500,
          effectiveDate: "2025-02-28",
          status: "processed",
          createdBy: "HR System",
          createdAt: "2025-01-10T08:00:00Z",
          processedAt: "2025-01-25T12:00:00Z",
        },
      ];

      setBonusesDeductions(mockData);
      calculateSummary(mockData);
    } catch (error) {
      console.error("Error loading bonuses/deductions:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (data: BonusDeduction[]) => {
    const bonuses = data.filter(item => item.type === "bonus");
    const deductions = data.filter(item => item.type === "deduction");
    
    const summary: Summary = {
      totalBonuses: bonuses.reduce((sum, item) => sum + item.amount, 0),
      totalDeductions: deductions.reduce((sum, item) => sum + item.amount, 0),
      pendingBonuses: bonuses.filter(item => item.status === "pending").reduce((sum, item) => sum + item.amount, 0),
      pendingDeductions: deductions.filter(item => item.status === "pending").reduce((sum, item) => sum + item.amount, 0),
      employeesAffected: new Set(data.map(item => item.employeeId)).size,
      averageBonus: bonuses.length > 0 ? bonuses.reduce((sum, item) => sum + item.amount, 0) / bonuses.length : 0,
      averageDeduction: deductions.length > 0 ? deductions.reduce((sum, item) => sum + item.amount, 0) / deductions.length : 0,
    };
    
    setSummary(summary);
  };

  const filteredItems = bonusesDeductions.filter(item => {
    const matchesType = filterType === "all" || item.type === filterType;
    const matchesDepartment = filterDepartment === "all" || item.department === filterDepartment;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    const matchesSearch = searchTerm === "" || 
      item.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesType && matchesDepartment && matchesStatus && matchesSearch;
  });

  const handleAddBonusDeduction = async () => {
    try {
      if (!formData.employeeId || !formData.amount || !formData.description) {
        alert("Please fill in all required fields");
        return;
      }

      const newItem: BonusDeduction = {
        id: `BD${Date.now()}`,
        employeeId: formData.employeeId,
        employeeName: "Employee Name", // Would come from employee lookup
        employeeNumber: "EMP-XXX", // Would come from employee lookup
        department: "Department", // Would come from employee lookup
        type: formData.type,
        category: formData.category,
        description: formData.description,
        amount: parseFloat(formData.amount),
        effectiveDate: formData.effectiveDate,
        status: "pending",
        createdBy: "Current User", // Would come from auth
        createdAt: new Date().toISOString(),
        notes: formData.notes,
      };

      setBonusesDeductions(prev => [newItem, ...prev]);
      calculateSummary([newItem, ...bonusesDeductions]);
      setShowAddDialog(false);
      setFormData({
        employeeId: "",
        type: "bonus",
        category: "",
        description: "",
        amount: "",
        effectiveDate: new Date().toISOString().split('T')[0],
        notes: "",
      });
      
      alert("Bonus/Deduction added successfully!");
    } catch (error) {
      console.error("Error adding bonus/deduction:", error);
      alert("Error adding bonus/deduction. Please try again.");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      setBonusesDeductions(prev => 
        prev.map(item => 
          item.id === id 
            ? { ...item, status: newStatus as any, processedAt: new Date().toISOString() }
            : item
        )
      );
      alert(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "processed": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    return type === "bonus" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(amount);
  };

  const exportData = () => {
    const csvContent = [
      "Employee,Type,Category,Description,Amount,Status,Effective Date",
      ...filteredItems.map(item => [
        item.employeeName,
        item.type,
        item.category,
        item.description,
        item.amount.toString(),
        item.status,
        item.effectiveDate,
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bonuses-deductions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bonuses & Deductions</h1>
            <p className="text-gray-600 mt-1">Manage employee bonuses and deductions</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New
            </Button>
            <Button onClick={exportData} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bonuses">Bonuses</TabsTrigger>
          <TabsTrigger value="deductions">Deductions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Bonuses</p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(summary.totalBonuses)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="w-8 h-8 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Deductions</p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatCurrency(summary.totalDeductions)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Employees Affected</p>
                      <p className="text-2xl font-bold">{summary.employeesAffected}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Net Impact</p>
                      <p className="text-xl font-bold">
                        {formatCurrency(summary.totalBonuses - summary.totalDeductions)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="bonus">Bonuses Only</SelectItem>
                    <SelectItem value="deduction">Deductions Only</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Field Operations">Field Operations</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* All Items Table */}
          <Card>
            <CardHeader>
              <CardTitle>All Bonuses & Deductions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Effective Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.employeeName}</div>
                          <div className="text-sm text-gray-600">{item.employeeNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(item.type)}>
                          {item.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className={`font-medium ${item.type === 'bonus' ? 'text-green-600' : 'text-red-600'}`}>
                        {item.type === 'bonus' ? '+' : '-'}{formatCurrency(item.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(item.effectiveDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedItem(item)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {item.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateStatus(item.id, "approved")}
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateStatus(item.id, "rejected")}
                              >
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bonuses">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Employee Bonuses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.filter(item => item.type === "bonus").map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.employeeName}</div>
                          <div className="text-sm text-gray-600">{item.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="font-medium text-green-600">
                        {formatCurrency(item.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedItem(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deductions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                Employee Deductions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.filter(item => item.type === "deduction").map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.employeeName}</div>
                          <div className="text-sm text-gray-600">{item.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="font-medium text-red-600">
                        {formatCurrency(item.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedItem(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add New Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Bonus or Deduction</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: "bonus" | "deduction") => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bonus">Bonus</SelectItem>
                  <SelectItem value="deduction">Deduction</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Employee ID</Label>
              <Input
                value={formData.employeeId}
                onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                placeholder="Enter employee ID"
              />
            </div>

            <div>
              <Label>Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {formData.type === "bonus" ? (
                    <>
                      <SelectItem value="Performance Bonus">Performance Bonus</SelectItem>
                      <SelectItem value="Overtime Bonus">Overtime Bonus</SelectItem>
                      <SelectItem value="Safety Bonus">Safety Bonus</SelectItem>
                      <SelectItem value="Commission">Commission</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Equipment Damage">Equipment Damage</SelectItem>
                      <SelectItem value="Advance Repayment">Advance Repayment</SelectItem>
                      <SelectItem value="Loan Repayment">Loan Repayment</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Amount (ZAR)</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter description..."
                rows={3}
              />
            </div>

            <div>
              <Label>Effective Date</Label>
              <Input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData(prev => ({ ...prev, effectiveDate: e.target.value }))}
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddBonusDeduction} className="flex-1">
                Add {formData.type}
              </Button>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Details Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedItem?.type === "bonus" ? "Bonus" : "Deduction"} Details
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Employee</Label>
                  <p className="text-sm font-medium">{selectedItem.employeeName}</p>
                  <p className="text-sm text-gray-600">{selectedItem.employeeNumber}</p>
                </div>
                <div>
                  <Label>Department</Label>
                  <p className="text-sm font-medium">{selectedItem.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Type</Label>
                  <Badge className={getTypeColor(selectedItem.type)}>
                    {selectedItem.type}
                  </Badge>
                </div>
                <div>
                  <Label>Category</Label>
                  <p className="text-sm font-medium">{selectedItem.category}</p>
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <p className="text-sm bg-gray-50 p-3 rounded border">{selectedItem.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Amount</Label>
                  <p className={`text-lg font-bold ${selectedItem.type === 'bonus' ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedItem.type === 'bonus' ? '+' : '-'}{formatCurrency(selectedItem.amount)}
                  </p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedItem.status)}>
                    {selectedItem.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Effective Date</Label>
                  <p className="text-sm font-medium">
                    {new Date(selectedItem.effectiveDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <Label>Created By</Label>
                  <p className="text-sm font-medium">{selectedItem.createdBy}</p>
                </div>
              </div>

              {selectedItem.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="text-sm bg-gray-50 p-3 rounded border">{selectedItem.notes}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                {selectedItem.status === "pending" && (
                  <>
                    <Button 
                      onClick={() => {
                        handleUpdateStatus(selectedItem.id, "approved");
                        setSelectedItem(null);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      onClick={() => {
                        handleUpdateStatus(selectedItem.id, "rejected");
                        setSelectedItem(null);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={() => setSelectedItem(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
