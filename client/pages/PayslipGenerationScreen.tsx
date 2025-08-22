import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  FileText,
  Download,
  Send,
  Eye,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Mail,
  Printer,
  Archive,
  Filter,
} from "lucide-react";

interface PayslipEmployee {
  id: string;
  employeeNumber: string;
  fullName: string;
  department: string;
  email: string;
  basicSalary: number;
  allowances: number;
  overtime: number;
  deductions: number;
  grossPay: number;
  netPay: number;
  payslipStatus: "pending" | "generated" | "sent" | "downloaded" | "error";
  lastGenerated?: string;
  lastSent?: string;
}

interface PayslipBatch {
  id: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  totalEmployees: number;
  generated: number;
  sent: number;
  pending: number;
  errors: number;
  status: "draft" | "generating" | "completed" | "distributing";
  createdAt: string;
  completedAt?: string;
}

export default function PayslipGenerationScreen() {
  const [employees, setEmployees] = useState<PayslipEmployee[]>([]);
  const [batches, setBatches] = useState<PayslipBatch[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDistributing, setIsDistributing] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [previewEmployee, setPreviewEmployee] =
    useState<PayslipEmployee | null>(null);
  const [activeTab, setActiveTab] = useState("generation");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadEmployeesData();
    loadPayslipBatches();
    setSelectedPeriod(getCurrentPeriod());
  }, []);

  const getCurrentPeriod = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    return `${year}-${month.toString().padStart(2, "0")}`;
  };

  const loadEmployeesData = async () => {
    try {
      // Mock data - would come from payroll calculations API
      const mockEmployees: PayslipEmployee[] = [
        {
          id: "E001",
          employeeNumber: "FO-001",
          fullName: "John Smith",
          department: "Field Operations",
          email: "john@company.com",
          basicSalary: 25000,
          allowances: 5000,
          overtime: 3500,
          deductions: 8500,
          grossPay: 33500,
          netPay: 25000,
          payslipStatus: "generated",
          lastGenerated: "2025-01-25T10:30:00Z",
          lastSent: "2025-01-25T11:00:00Z",
        },
        {
          id: "E002",
          employeeNumber: "FO-002",
          fullName: "Mike Johnson",
          department: "Field Operations",
          email: "mike@company.com",
          basicSalary: 22000,
          allowances: 4500,
          overtime: 2800,
          deductions: 7300,
          grossPay: 29300,
          netPay: 22000,
          payslipStatus: "pending",
        },
        {
          id: "E003",
          employeeNumber: "HR-001",
          fullName: "Sarah Wilson",
          department: "HR",
          email: "sarah@company.com",
          basicSalary: 35000,
          allowances: 7000,
          overtime: 0,
          deductions: 12600,
          grossPay: 42000,
          netPay: 29400,
          payslipStatus: "sent",
          lastGenerated: "2025-01-25T09:15:00Z",
          lastSent: "2025-01-25T14:20:00Z",
        },
        {
          id: "E004",
          employeeNumber: "IT-001",
          fullName: "David Brown",
          department: "IT",
          email: "david@company.com",
          basicSalary: 28000,
          allowances: 5600,
          overtime: 1200,
          deductions: 9800,
          grossPay: 34800,
          netPay: 25000,
          payslipStatus: "error",
        },
        {
          id: "E005",
          employeeNumber: "FO-003",
          fullName: "Lisa Davis",
          department: "Field Operations",
          email: "lisa@company.com",
          basicSalary: 24000,
          allowances: 4800,
          overtime: 2400,
          deductions: 7800,
          grossPay: 31200,
          netPay: 23400,
          payslipStatus: "downloaded",
          lastGenerated: "2025-01-25T08:45:00Z",
        },
      ];

      setEmployees(mockEmployees);
    } catch (error) {
      console.error("Error loading employees data:", error);
    }
  };

  const loadPayslipBatches = async () => {
    try {
      // Mock data - would come from API
      const mockBatches: PayslipBatch[] = [
        {
          id: "BATCH-2025-01",
          period: "January 2025",
          periodStart: "2025-01-01",
          periodEnd: "2025-01-31",
          totalEmployees: 87,
          generated: 82,
          sent: 78,
          pending: 5,
          errors: 2,
          status: "completed",
          createdAt: "2025-01-25T08:00:00Z",
          completedAt: "2025-01-25T15:30:00Z",
        },
        {
          id: "BATCH-2024-12",
          period: "December 2024",
          periodStart: "2024-12-01",
          periodEnd: "2024-12-31",
          totalEmployees: 85,
          generated: 85,
          sent: 85,
          pending: 0,
          errors: 0,
          status: "completed",
          createdAt: "2024-12-25T08:00:00Z",
          completedAt: "2024-12-25T12:00:00Z",
        },
      ];

      setBatches(mockBatches);
    } catch (error) {
      console.error("Error loading payslip batches:", error);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesDepartment =
      filterDepartment === "all" || emp.department === filterDepartment;
    const matchesStatus =
      filterStatus === "all" || emp.payslipStatus === filterStatus;
    const matchesSearch =
      searchTerm === "" ||
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesDepartment && matchesStatus && matchesSearch;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmployees(filteredEmployees.map((emp) => emp.id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const handleEmployeeSelect = (employeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedEmployees((prev) => [...prev, employeeId]);
    } else {
      setSelectedEmployees((prev) => prev.filter((id) => id !== employeeId));
    }
  };

  const generatePayslips = async () => {
    if (selectedEmployees.length === 0) {
      alert("Please select employees to generate payslips for");
      return;
    }

    try {
      setIsGenerating(true);
      setGenerationProgress(0);

      // Simulate payslip generation
      for (let i = 0; i < selectedEmployees.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const progress = ((i + 1) / selectedEmployees.length) * 100;
        setGenerationProgress(progress);

        // Update employee status
        setEmployees((prev) =>
          prev.map((emp) =>
            selectedEmployees.includes(emp.id)
              ? {
                  ...emp,
                  payslipStatus: "generated",
                  lastGenerated: new Date().toISOString(),
                }
              : emp,
          ),
        );
      }

      alert("Payslips generated successfully!");
      setSelectedEmployees([]);
    } catch (error) {
      console.error("Error generating payslips:", error);
      alert("Error generating payslips. Please try again.");
    } finally {
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const distributePayslips = async () => {
    const generatedEmployees = selectedEmployees.filter(
      (id) =>
        employees.find((emp) => emp.id === id)?.payslipStatus === "generated",
    );

    if (generatedEmployees.length === 0) {
      alert("Please select employees with generated payslips to distribute");
      return;
    }

    try {
      setIsDistributing(true);

      // Simulate email distribution
      for (let i = 0; i < generatedEmployees.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Update employee status
        setEmployees((prev) =>
          prev.map((emp) =>
            generatedEmployees.includes(emp.id)
              ? {
                  ...emp,
                  payslipStatus: "sent",
                  lastSent: new Date().toISOString(),
                }
              : emp,
          ),
        );
      }

      alert(`Payslips distributed to ${generatedEmployees.length} employees!`);
      setSelectedEmployees([]);
    } catch (error) {
      console.error("Error distributing payslips:", error);
      alert("Error distributing payslips. Please try again.");
    } finally {
      setIsDistributing(false);
    }
  };

  const downloadPayslips = async () => {
    if (selectedEmployees.length === 0) {
      alert("Please select employees to download payslips for");
      return;
    }

    try {
      // Simulate ZIP file generation and download
      alert(
        `Downloading payslips for ${selectedEmployees.length} employees...`,
      );

      // Mark as downloaded
      setEmployees((prev) =>
        prev.map((emp) =>
          selectedEmployees.includes(emp.id)
            ? { ...emp, payslipStatus: "downloaded" }
            : emp,
        ),
      );

      setSelectedEmployees([]);
    } catch (error) {
      console.error("Error downloading payslips:", error);
      alert("Error downloading payslips. Please try again.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "generated":
        return "bg-green-100 text-green-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "downloaded":
        return "bg-purple-100 text-purple-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "generated":
        return <CheckCircle className="w-4 h-4" />;
      case "sent":
        return <Mail className="w-4 h-4" />;
      case "downloaded":
        return <Download className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "error":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(amount);
  };

  const generatePreviewPayslip = (employee: PayslipEmployee) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Payslip - ${employee.fullName}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
    .payslip { max-width: 800px; margin: 0 auto; border: 1px solid #ccc; }
    .header { background-color: #f8f9fa; padding: 20px; border-bottom: 1px solid #ccc; }
    .company-name { font-size: 24px; font-weight: bold; color: #2c3e50; }
    .payslip-title { font-size: 18px; margin-top: 10px; }
    .employee-info { padding: 20px; background-color: #f8f9fa; }
    .earnings-section, .deductions-section { padding: 20px; }
    .section-title { font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
    .line-item { display: flex; justify-content: space-between; margin: 8px 0; padding: 5px 0; }
    .total { font-weight: bold; border-top: 1px solid #ccc; margin-top: 15px; padding-top: 10px; }
    .net-pay { background-color: #e8f5e8; padding: 15px; font-size: 18px; font-weight: bold; color: #27ae60; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px; border-bottom: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="payslip">
    <div class="header">
      <div class="company-name">FieldOps Solutions</div>
      <div class="payslip-title">Employee Payslip</div>
    </div>
    
    <div class="employee-info">
      <table>
        <tr>
          <td><strong>Employee Name:</strong></td>
          <td>${employee.fullName}</td>
        </tr>
        <tr>
          <td><strong>Employee Number:</strong></td>
          <td>${employee.employeeNumber}</td>
        </tr>
        <tr>
          <td><strong>Department:</strong></td>
          <td>${employee.department}</td>
        </tr>
        <tr>
          <td><strong>Pay Period:</strong></td>
          <td>${selectedPeriod}</td>
        </tr>
      </table>
    </div>

    <div class="earnings-section">
      <div class="section-title">Earnings</div>
      <table>
        <tr>
          <td>Basic Salary</td>
          <td>${formatCurrency(employee.basicSalary)}</td>
        </tr>
        <tr>
          <td>Allowances</td>
          <td>${formatCurrency(employee.allowances)}</td>
        </tr>
        <tr>
          <td>Overtime</td>
          <td>${formatCurrency(employee.overtime)}</td>
        </tr>
        <tr class="total">
          <td><strong>Gross Pay</strong></td>
          <td><strong>${formatCurrency(employee.grossPay)}</strong></td>
        </tr>
      </table>
    </div>

    <div class="deductions-section">
      <div class="section-title">Deductions</div>
      <table>
        <tr>
          <td>Total Deductions</td>
          <td>${formatCurrency(employee.deductions)}</td>
        </tr>
      </table>
    </div>

    <div class="net-pay">
      <div class="line-item">
        <span>NET PAY</span>
        <span>${formatCurrency(employee.netPay)}</span>
      </div>
    </div>
  </div>
</body>
</html>`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Payslip Generation
            </h1>
            <p className="text-gray-600 mt-1">
              Generate and distribute employee payslips
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-01">January 2025</SelectItem>
                <SelectItem value="2024-12">December 2024</SelectItem>
                <SelectItem value="2024-11">November 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generation">Generation</TabsTrigger>
          <TabsTrigger value="history">Batch History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="generation" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Employees</p>
                    <p className="text-2xl font-bold">{employees.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Generated</p>
                    <p className="text-2xl font-bold">
                      {
                        employees.filter(
                          (emp) => emp.payslipStatus === "generated",
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Sent</p>
                    <p className="text-2xl font-bold">
                      {
                        employees.filter((emp) => emp.payslipStatus === "sent")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold">
                      {
                        employees.filter(
                          (emp) => emp.payslipStatus === "pending",
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Errors</p>
                    <p className="text-2xl font-bold">
                      {
                        employees.filter((emp) => emp.payslipStatus === "error")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Processing Progress */}
          {(isGenerating || isDistributing) && (
            <Card className="border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">
                        {isGenerating
                          ? "Generating Payslips..."
                          : "Distributing Payslips..."}
                      </span>
                      <span className="text-sm text-gray-600">
                        {isGenerating
                          ? Math.round(generationProgress)
                          : "Processing"}
                        %
                      </span>
                    </div>
                    {isGenerating && (
                      <Progress value={generationProgress} className="h-2" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <Button
                    onClick={generatePayslips}
                    disabled={
                      isGenerating ||
                      isDistributing ||
                      selectedEmployees.length === 0
                    }
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Payslips ({selectedEmployees.length})
                  </Button>
                  <Button
                    onClick={distributePayslips}
                    disabled={
                      isGenerating ||
                      isDistributing ||
                      selectedEmployees.length === 0
                    }
                    variant="outline"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Distribute via Email
                  </Button>
                  <Button
                    onClick={downloadPayslips}
                    disabled={
                      isGenerating ||
                      isDistributing ||
                      selectedEmployees.length === 0
                    }
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download ZIP
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  {selectedEmployees.length} of {filteredEmployees.length}{" "}
                  selected
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Select
                  value={filterDepartment}
                  onValueChange={setFilterDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Field Operations">
                      Field Operations
                    </SelectItem>
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
                    <SelectItem value="generated">Generated</SelectItem>
                    <SelectItem value="sent">Sent</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={
                      selectedEmployees.length === filteredEmployees.length &&
                      filteredEmployees.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="select-all" className="text-sm font-medium">
                    Select All
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employees Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Employee Payslips - {selectedPeriod}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={
                          selectedEmployees.length ===
                            filteredEmployees.length &&
                          filteredEmployees.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Gross Pay</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedEmployees.includes(employee.id)}
                          onCheckedChange={(checked) =>
                            handleEmployeeSelect(
                              employee.id,
                              checked as boolean,
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{employee.fullName}</div>
                          <div className="text-sm text-gray-600">
                            {employee.employeeNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(employee.grossPay)}
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {formatCurrency(employee.netPay)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getStatusColor(employee.payslipStatus)}
                        >
                          {getStatusIcon(employee.payslipStatus)}
                          <span className="ml-1">{employee.payslipStatus}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPreviewEmployee(employee)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {employee.payslipStatus !== "pending" && (
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
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

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="w-5 h-5" />
                Payslip Generation History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Total Employees</TableHead>
                    <TableHead>Generated</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{batch.period}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(batch.periodStart).toLocaleDateString()} -{" "}
                            {new Date(batch.periodEnd).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{batch.totalEmployees}</TableCell>
                      <TableCell>{batch.generated}</TableCell>
                      <TableCell>{batch.sent}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(batch.status)}>
                          {batch.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(batch.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Payslip Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Template management functionality coming soon. Currently
                    using default template.
                  </AlertDescription>
                </Alert>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Standard Template</h4>
                          <p className="text-sm text-gray-600">
                            Default payslip layout
                          </p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          Active
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Dialog */}
      <Dialog
        open={!!previewEmployee}
        onOpenChange={() => setPreviewEmployee(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Payslip Preview - {previewEmployee?.fullName}
            </DialogTitle>
          </DialogHeader>

          {previewEmployee && (
            <div className="space-y-4">
              <div
                className="border rounded p-4 bg-white"
                dangerouslySetInnerHTML={{
                  __html: generatePreviewPayslip(previewEmployee),
                }}
              />

              <div className="flex gap-3 pt-4">
                <Button className="flex-1">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Payslip
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
                <Button variant="outline" className="flex-1">
                  <Send className="w-4 h-4 mr-2" />
                  Send via Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
