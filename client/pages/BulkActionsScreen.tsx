import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Send,
  Users,
  DollarSign,
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Upload,
  Download,
  Filter,
  Play,
  Pause,
  Settings,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  salary: number;
  email: string;
  selected: boolean;
}

interface BulkAction {
  id: string;
  type: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  targetCount: number;
  processedCount: number;
  createdBy: string;
  createdAt: string;
  completedAt?: string;
  description: string;
}

interface BulkOperation {
  type: "bonus" | "deduction" | "salary_adjustment" | "department_transfer" | "benefit_enrollment";
  amount?: number;
  percentage?: number;
  description: string;
  effectiveDate: string;
  reason: string;
}

export default function BulkActionsScreen() {
  const navigate = useNavigate();
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([
    { id: "E001", name: "Dyondzani Masinge", department: "Maintenance", position: "Technician", salary: 45000, email: "dyondzani@company.com", selected: false },
    { id: "E002", name: "Siyanda Ngubane", department: "Payroll", position: "Officer", salary: 55000, email: "siyanda@company.com", selected: false },
    { id: "E003", name: "Priya Naidoo", department: "Warehouse", position: "Stock Manager", salary: 38000, email: "priya@company.com", selected: false },
    { id: "E004", name: "James Smith", department: "Finance", position: "Analyst", salary: 42000, email: "james@company.com", selected: false },
    { id: "E005", name: "Sarah Johnson", department: "HR", position: "Coordinator", salary: 40000, email: "sarah@company.com", selected: false },
  ]);
  
  const [bulkOperations, setBulkOperations] = useState<BulkAction[]>([
    {
      id: "BA001",
      type: "Bonus Payment",
      name: "Year-end Bonus 2023",
      status: "completed",
      targetCount: 87,
      processedCount: 87,
      createdBy: "admin@company.com",
      createdAt: "2024-01-10 09:00:00",
      completedAt: "2024-01-10 09:45:00",
      description: "Annual performance bonus distribution",
    },
    {
      id: "BA002",
      type: "Salary Adjustment",
      name: "Cost of Living Increase",
      status: "running",
      targetCount: 45,
      processedCount: 23,
      createdBy: "hr@company.com",
      createdAt: "2024-01-15 14:30:00",
      description: "5% salary increase for eligible employees",
    },
    {
      id: "BA003",
      type: "Deduction",
      name: "Medical Aid Enrollment",
      status: "pending",
      targetCount: 12,
      processedCount: 0,
      createdBy: "payroll@company.com",
      createdAt: "2024-01-16 10:15:00",
      description: "Medical aid deduction setup for new enrollees",
    },
  ]);

  const [currentOperation, setCurrentOperation] = useState<BulkOperation>({
    type: "bonus",
    amount: 0,
    percentage: 0,
    description: "",
    effectiveDate: "",
    reason: "",
  });

  const [showOperationDialog, setShowOperationDialog] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  const departments = ["all", "Maintenance", "Payroll", "Warehouse", "Finance", "HR"];

  useEffect(() => {
    const filtered = employees.map(emp => ({
      ...emp,
      selected: selectedEmployees.includes(emp.id)
    }));
    setEmployees(filtered);
  }, [selectedEmployees]);

  const filteredEmployees = employees.filter(emp => {
    const matchesDepartment = filterDepartment === "all" || emp.department === filterDepartment;
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSelectAll = () => {
    const allFilteredIds = filteredEmployees.map(emp => emp.id);
    const allSelected = allFilteredIds.every(id => selectedEmployees.includes(id));
    
    if (allSelected) {
      setSelectedEmployees(prev => prev.filter(id => !allFilteredIds.includes(id)));
    } else {
      setSelectedEmployees(prev => [...new Set([...prev, ...allFilteredIds])]);
    }
  };

  const executeBulkOperation = async () => {
    if (selectedEmployees.length === 0) return;
    
    setIsProcessing(true);
    setProcessingProgress(0);
    
    // Simulate processing
    const progressInterval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsProcessing(false);
          
          // Add new operation to history
          const newOperation: BulkAction = {
            id: `BA${String(bulkOperations.length + 1).padStart(3, '0')}`,
            type: currentOperation.type.charAt(0).toUpperCase() + currentOperation.type.slice(1),
            name: currentOperation.description || `${currentOperation.type} operation`,
            status: "completed",
            targetCount: selectedEmployees.length,
            processedCount: selectedEmployees.length,
            createdBy: "current_user@company.com",
            createdAt: new Date().toLocaleString(),
            completedAt: new Date().toLocaleString(),
            description: currentOperation.description,
          };
          
          setBulkOperations(prev => [newOperation, ...prev]);
          setShowOperationDialog(false);
          setSelectedEmployees([]);
          
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 300);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "running":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <Pause className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "running":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" onClick={() => navigate("/payroll-dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <Send className="h-8 w-8 text-pink-600" />
          <h1 className="text-3xl font-bold text-gray-800">Bulk Actions</h1>
        </div>
        <p className="text-gray-600">Perform bulk operations on multiple employees</p>
      </div>

      <Tabs defaultValue="operations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="operations">Bulk Operations</TabsTrigger>
          <TabsTrigger value="history">Operation History</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="space-y-6">
          {/* Selection Summary */}
          {selectedEmployees.length > 0 && (
            <Alert>
              <Users className="h-4 w-4" />
              <AlertDescription>
                {selectedEmployees.length} employee(s) selected for bulk operation
              </AlertDescription>
            </Alert>
          )}

          {/* Employee Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Select Employees
                <div className="flex gap-2">
                  <Dialog open={showOperationDialog} onOpenChange={setShowOperationDialog}>
                    <DialogTrigger asChild>
                      <Button disabled={selectedEmployees.length === 0}>
                        <Settings className="h-4 w-4 mr-2" />
                        Configure Operation
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Configure Bulk Operation</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Operation Type</Label>
                            <Select 
                              value={currentOperation.type} 
                              onValueChange={(value) => setCurrentOperation(prev => ({ ...prev, type: value as any }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bonus">Bonus Payment</SelectItem>
                                <SelectItem value="deduction">Deduction</SelectItem>
                                <SelectItem value="salary_adjustment">Salary Adjustment</SelectItem>
                                <SelectItem value="department_transfer">Department Transfer</SelectItem>
                                <SelectItem value="benefit_enrollment">Benefit Enrollment</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label>Effective Date</Label>
                            <Input 
                              type="date"
                              value={currentOperation.effectiveDate}
                              onChange={(e) => setCurrentOperation(prev => ({ ...prev, effectiveDate: e.target.value }))}
                            />
                          </div>
                        </div>

                        {(currentOperation.type === "bonus" || currentOperation.type === "deduction" || currentOperation.type === "salary_adjustment") && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Amount (ZAR)</Label>
                              <Input 
                                type="number"
                                value={currentOperation.amount}
                                onChange={(e) => setCurrentOperation(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                                placeholder="Fixed amount"
                              />
                            </div>
                            <div>
                              <Label>Percentage (%)</Label>
                              <Input 
                                type="number"
                                value={currentOperation.percentage}
                                onChange={(e) => setCurrentOperation(prev => ({ ...prev, percentage: parseFloat(e.target.value) }))}
                                placeholder="Percentage of salary"
                              />
                            </div>
                          </div>
                        )}

                        <div>
                          <Label>Description</Label>
                          <Input 
                            value={currentOperation.description}
                            onChange={(e) => setCurrentOperation(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Operation description"
                          />
                        </div>

                        <div>
                          <Label>Reason/Notes</Label>
                          <Textarea 
                            value={currentOperation.reason}
                            onChange={(e) => setCurrentOperation(prev => ({ ...prev, reason: e.target.value }))}
                            placeholder="Reason for this operation"
                            rows={3}
                          />
                        </div>

                        {isProcessing && (
                          <div>
                            <Label>Processing Progress</Label>
                            <Progress value={processingProgress} className="w-full mt-2" />
                            <p className="text-sm text-gray-600 mt-1">
                              Processing {Math.round(processingProgress)}% complete...
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-4">
                          <Button 
                            onClick={executeBulkOperation} 
                            disabled={isProcessing || !currentOperation.description}
                            className="flex-1"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            {isProcessing ? "Processing..." : "Execute Operation"}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setShowOperationDialog(false)}
                            disabled={isProcessing}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search employees..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>
                        {dept === "all" ? "All Departments" : dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Employee Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={filteredEmployees.length > 0 && filteredEmployees.every(emp => selectedEmployees.includes(emp.id))}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Current Salary</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedEmployees.includes(employee.id)}
                          onCheckedChange={() => handleSelectEmployee(employee.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-gray-500">{employee.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{formatCurrency(employee.salary)}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Operation History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bulkOperations.map((operation) => (
                  <div key={operation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(operation.status)}
                      <div>
                        <h4 className="font-medium">{operation.name}</h4>
                        <p className="text-sm text-gray-600">{operation.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span>Created: {operation.createdAt}</span>
                          <span>By: {operation.createdBy}</span>
                          <span>Targets: {operation.targetCount} employees</span>
                          {operation.status === "running" && (
                            <span>Progress: {operation.processedCount}/{operation.targetCount}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(operation.status)}>
                        {operation.status}
                      </Badge>
                      
                      {operation.status === "completed" && (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Report
                        </Button>
                      )}
                      
                      {operation.status === "running" && (
                        <Button size="sm" variant="outline">
                          <Pause className="h-4 w-4 mr-1" />
                          Pause
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
