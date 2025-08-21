import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  Play,
  RefreshCw,
  Users,
  DollarSign,
  TrendingUp,
  Calculator,
  Send,
  Lock,
  Unlock,
} from "lucide-react";

interface PayrollPeriod {
  id: string;
  startDate: string;
  endDate: string;
  status: "draft" | "processing" | "completed" | "finalized";
  description: string;
}

interface EmployeePayroll {
  employeeId: string;
  employeeNumber: string;
  fullName: string;
  department: string;
  basicSalary: number;
  allowances: {
    housing: number;
    transport: number;
    bonus: number;
    other: number;
  };
  overtime: {
    hours: number;
    rate: number;
    amount: number;
  };
  deductions: {
    tax: number;
    uif: number;
    medical: number;
    pension: number;
    loans: number;
    other: number;
  };
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  status: "pending" | "processed" | "error" | "approved";
  errors: string[];
  warnings: string[];
}

interface PayrollSummary {
  period: PayrollPeriod;
  totalEmployees: number;
  processedEmployees: number;
  totalGrossPay: number;
  totalDeductions: number;
  totalNetPay: number;
  totalOvertimeHours: number;
  totalOvertimePay: number;
  errors: number;
  warnings: number;
}

export default function PayrollProcessingScreen() {
  const [currentPeriod, setCurrentPeriod] = useState<PayrollPeriod>({
    id: "PAY-2025-08",
    startDate: "2025-08-01",
    endDate: "2025-08-31",
    status: "draft",
    description: "August 2025 Payroll",
  });

  const [summary, setSummary] = useState<PayrollSummary | null>(null);
  const [employees, setEmployees] = useState<EmployeePayroll[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeePayroll | null>(null);
  const [activeTab, setActiveTab] = useState("summary");

  useEffect(() => {
    loadPayrollData();
  }, [currentPeriod]);

  const loadPayrollData = async () => {
    try {
      // Load employee data and calculate payroll
      const response = await fetch("/data/database.json");
      const data = await response.json();
      
      const employeePayrolls = await Promise.all(
        data.employees.map(async (emp: any) => calculateEmployeePayroll(emp))
      );
      
      setEmployees(employeePayrolls);
      calculateSummary(employeePayrolls);
    } catch (error) {
      console.error("Error loading payroll data:", error);
    }
  };

  const calculateEmployeePayroll = async (employee: any): Promise<EmployeePayroll> => {
    try {
      // Get overtime data for employee
      const overtimeResponse = await fetch(`/api/payroll/overtime-rate/${employee.id}`);
      const overtimeData = await overtimeResponse.json();
      
      // Calculate basic components
      const basicSalary = employee.employment?.salary || 0;
      const allowances = {
        housing: basicSalary * 0.1, // 10% housing allowance
        transport: 2000, // Fixed transport allowance
        bonus: 0, // No bonus for this period
        other: 0,
      };
      
      // Get overtime hours from recent clock records
      const overtimeHours = await getEmployeeOvertimeHours(employee.id);
      const overtimeRate = overtimeData.data?.overtimeRate || 225;
      const overtimeAmount = overtimeHours * overtimeRate;
      
      const grossPay = basicSalary + Object.values(allowances).reduce((a, b) => a + b, 0) + overtimeAmount;
      
      // Calculate deductions
      const deductions = {
        tax: grossPay * 0.25, // 25% tax rate
        uif: Math.min(grossPay * 0.01, 177.12), // UIF 1% max R177.12
        medical: 1200, // Fixed medical aid
        pension: grossPay * 0.075, // 7.5% pension
        loans: 0, // No loans for this period
        other: 0,
      };
      
      const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
      const netPay = grossPay - totalDeductions;
      
      // Check for errors and warnings
      const errors: string[] = [];
      const warnings: string[] = [];
      
      if (!employee.personalInfo?.email) {
        errors.push("Missing email address");
      }
      
      if (overtimeHours > 45) {
        warnings.push(`High overtime hours: ${overtimeHours.toFixed(1)}h`);
      }
      
      if (grossPay > 100000) {
        warnings.push("High gross pay - verify tax calculations");
      }
      
      return {
        employeeId: employee.id,
        employeeNumber: employee.employeeNumber,
        fullName: employee.personalInfo?.fullName || `${employee.personalInfo?.firstName} ${employee.personalInfo?.lastName}`,
        department: employee.employment?.department || "Unknown",
        basicSalary,
        allowances,
        overtime: {
          hours: overtimeHours,
          rate: overtimeRate,
          amount: overtimeAmount,
        },
        deductions,
        grossPay,
        totalDeductions,
        netPay,
        status: errors.length > 0 ? "error" : "pending",
        errors,
        warnings,
      };
    } catch (error) {
      console.error(`Error calculating payroll for employee ${employee.id}:`, error);
      return {
        employeeId: employee.id,
        employeeNumber: employee.employeeNumber,
        fullName: employee.personalInfo?.fullName || "Unknown",
        department: employee.employment?.department || "Unknown",
        basicSalary: 0,
        allowances: { housing: 0, transport: 0, bonus: 0, other: 0 },
        overtime: { hours: 0, rate: 0, amount: 0 },
        deductions: { tax: 0, uif: 0, medical: 0, pension: 0, loans: 0, other: 0 },
        grossPay: 0,
        totalDeductions: 0,
        netPay: 0,
        status: "error",
        errors: ["Failed to calculate payroll"],
        warnings: [],
      };
    }
  };

  const getEmployeeOvertimeHours = async (employeeId: string): Promise<number> => {
    try {
      const response = await fetch(`/api/overtime/sessions/${employeeId}/history`);
      if (!response.ok) return 0;
      
      const data = await response.json();
      const sessions = data.data || [];
      
      // Sum approved overtime hours for current period
      return sessions
        .filter((session: any) => 
          session.status === "approved" && 
          session.createdAt >= currentPeriod.startDate && 
          session.createdAt <= currentPeriod.endDate
        )
        .reduce((total: number, session: any) => total + (session.approvedHours || 0), 0);
    } catch (error) {
      console.error("Error getting overtime hours:", error);
      return 0;
    }
  };

  const calculateSummary = (employeePayrolls: EmployeePayroll[]) => {
    const summary: PayrollSummary = {
      period: currentPeriod,
      totalEmployees: employeePayrolls.length,
      processedEmployees: employeePayrolls.filter(emp => emp.status === "processed").length,
      totalGrossPay: employeePayrolls.reduce((sum, emp) => sum + emp.grossPay, 0),
      totalDeductions: employeePayrolls.reduce((sum, emp) => sum + emp.totalDeductions, 0),
      totalNetPay: employeePayrolls.reduce((sum, emp) => sum + emp.netPay, 0),
      totalOvertimeHours: employeePayrolls.reduce((sum, emp) => sum + emp.overtime.hours, 0),
      totalOvertimePay: employeePayrolls.reduce((sum, emp) => sum + emp.overtime.amount, 0),
      errors: employeePayrolls.filter(emp => emp.status === "error").length,
      warnings: employeePayrolls.reduce((sum, emp) => sum + emp.warnings.length, 0),
    };
    
    setSummary(summary);
  };

  const processPayroll = async () => {
    setProcessing(true);
    setProcessingProgress(0);
    
    try {
      for (let i = 0; i < employees.length; i++) {
        const employee = employees[i];
        
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 200));
        
        if (employee.status !== "error") {
          employee.status = "processed";
        }
        
        setProcessingProgress(((i + 1) / employees.length) * 100);
        setEmployees([...employees]);
      }
      
      setCurrentPeriod(prev => ({ ...prev, status: "processing" }));
      
      // Update summary
      calculateSummary(employees);
      
    } catch (error) {
      console.error("Error processing payroll:", error);
    } finally {
      setProcessing(false);
    }
  };

  const finalizePayroll = async () => {
    try {
      setCurrentPeriod(prev => ({ ...prev, status: "finalized" }));
      // Here you would typically save to backend and lock the payroll
      alert("Payroll finalized successfully!");
    } catch (error) {
      console.error("Error finalizing payroll:", error);
    }
  };

  const exportPayslips = async () => {
    try {
      // Generate and download payslips
      alert("Payslips exported successfully!");
    } catch (error) {
      console.error("Error exporting payslips:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed": return "bg-green-100 text-green-800";
      case "error": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payroll Processing</h1>
            <p className="text-gray-600 mt-1">{currentPeriod.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">
                {new Date(currentPeriod.startDate).toLocaleDateString()} - {new Date(currentPeriod.endDate).toLocaleDateString()}
              </Badge>
              <Badge className={currentPeriod.status === "finalized" ? "bg-green-600" : "bg-blue-600"}>
                {currentPeriod.status === "finalized" ? <Lock className="w-3 h-3 mr-1" /> : <Unlock className="w-3 h-3 mr-1" />}
                {currentPeriod.status}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={processPayroll} 
              disabled={processing || currentPeriod.status === "finalized"}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {processing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Process Payroll
                </>
              )}
            </Button>
            {currentPeriod.status === "processing" && (
              <Button onClick={finalizePayroll} variant="outline">
                <CheckCircle className="w-4 h-4 mr-2" />
                Finalize
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Processing Progress */}
      {processing && (
        <Card className="mb-6 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Processing Payroll...</span>
                  <span className="text-sm text-gray-600">{Math.round(processingProgress)}%</span>
                </div>
                <Progress value={processingProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="employees">Employee Details</TabsTrigger>
          <TabsTrigger value="actions">Actions & Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6">
          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Employees</p>
                      <p className="text-2xl font-bold">{summary.totalEmployees}</p>
                      <p className="text-xs text-green-600">{summary.processedEmployees} processed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Gross Pay</p>
                      <p className="text-xl font-bold">{formatCurrency(summary.totalGrossPay)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Net Pay</p>
                      <p className="text-xl font-bold">{formatCurrency(summary.totalNetPay)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">Overtime Hours</p>
                      <p className="text-xl font-bold">{summary.totalOvertimeHours.toFixed(1)}h</p>
                      <p className="text-xs text-gray-600">{formatCurrency(summary.totalOvertimePay)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Alerts */}
          {summary && (summary.errors > 0 || summary.warnings > 0) && (
            <div className="space-y-3">
              {summary.errors > 0 && (
                <Alert className="border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {summary.errors} employees have errors that need to be resolved before processing.
                  </AlertDescription>
                </Alert>
              )}
              {summary.warnings > 0 && (
                <Alert className="border-yellow-200">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    {summary.warnings} warnings detected. Review before finalizing payroll.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Employee Payroll Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Gross Pay</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.employeeId}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{employee.fullName}</div>
                          <div className="text-sm text-gray-600">{employee.employeeNumber}</div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{formatCurrency(employee.basicSalary)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{employee.overtime.hours.toFixed(1)}h</div>
                          <div className="text-gray-600">{formatCurrency(employee.overtime.amount)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{formatCurrency(employee.grossPay)}</TableCell>
                      <TableCell>{formatCurrency(employee.totalDeductions)}</TableCell>
                      <TableCell className="font-medium text-green-600">{formatCurrency(employee.netPay)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status}
                        </Badge>
                        {employee.errors.length > 0 && (
                          <div className="text-xs text-red-600 mt-1">{employee.errors.length} errors</div>
                        )}
                        {employee.warnings.length > 0 && (
                          <div className="text-xs text-yellow-600 mt-1">{employee.warnings.length} warnings</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEmployee(employee)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Export & Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" onClick={exportPayslips} className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Payslips (PDF)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Export Payroll Register (CSV)
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calculator className="w-4 h-4 mr-2" />
                  Generate Tax Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Send className="w-4 h-4 mr-2" />
                  Generate EFT File
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payroll Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={finalizePayroll} 
                  disabled={currentPeriod.status === "finalized"}
                  className="w-full justify-start bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve & Finalize Payroll
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Rollback & Reprocess
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Send className="w-4 h-4 mr-2" />
                  Send Notifications
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Employee Detail Modal would go here */}
    </div>
  );
}
