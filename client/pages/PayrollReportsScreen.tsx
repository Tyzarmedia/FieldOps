import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  PieChart as PieIcon,
  BarChart3,
  Filter,
  RefreshCw,
} from "lucide-react";

interface ReportData {
  period: string;
  departmentCosts: Array<{
    department: string;
    totalCost: number;
    employeeCount: number;
    averageSalary: number;
    overtime: number;
  }>;
  deductionBreakdown: Array<{
    type: string;
    amount: number;
    percentage: number;
  }>;
  overtimeAnalysis: Array<{
    month: string;
    hours: number;
    cost: number;
    employees: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    grossPay: number;
    netPay: number;
    deductions: number;
    overtime: number;
  }>;
  summary: {
    totalPayroll: number;
    totalEmployees: number;
    averageSalary: number;
    totalOvertimeHours: number;
    totalOvertimeCost: number;
    totalDeductions: number;
    payrollGrowth: number;
    overtimeGrowth: number;
  };
}

export default function PayrollReportsScreen() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("2025-01");
  const [dateRange, setDateRange] = useState({
    startDate: "2025-01-01",
    endDate: "2025-01-31",
  });
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadReportData();
  }, [selectedPeriod, dateRange]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      
      // Mock data - would come from API
      const mockData: ReportData = {
        period: selectedPeriod,
        departmentCosts: [
          {
            department: "Field Operations",
            totalCost: 350000,
            employeeCount: 15,
            averageSalary: 23333,
            overtime: 45000,
          },
          {
            department: "HR",
            totalCost: 120000,
            employeeCount: 4,
            averageSalary: 30000,
            overtime: 2000,
          },
          {
            department: "IT",
            totalCost: 180000,
            employeeCount: 5,
            averageSalary: 36000,
            overtime: 8000,
          },
          {
            department: "Management",
            totalCost: 200000,
            employeeCount: 3,
            averageSalary: 66667,
            overtime: 1000,
          },
          {
            department: "Fleet",
            totalCost: 80000,
            employeeCount: 2,
            averageSalary: 40000,
            overtime: 3000,
          },
        ],
        deductionBreakdown: [
          { type: "Income Tax", amount: 180000, percentage: 35 },
          { type: "UIF", amount: 15000, percentage: 3 },
          { type: "Medical Aid", amount: 120000, percentage: 23 },
          { type: "Pension Fund", amount: 100000, percentage: 19 },
          { type: "Loans", amount: 50000, percentage: 10 },
          { type: "Other", amount: 50000, percentage: 10 },
        ],
        overtimeAnalysis: [
          { month: "Oct 2024", hours: 120, cost: 35000, employees: 8 },
          { month: "Nov 2024", hours: 145, cost: 42000, employees: 12 },
          { month: "Dec 2024", hours: 180, cost: 52000, employees: 15 },
          { month: "Jan 2025", hours: 160, cost: 47000, employees: 13 },
        ],
        monthlyTrends: [
          { month: "Oct", grossPay: 920000, netPay: 650000, deductions: 270000, overtime: 35000 },
          { month: "Nov", grossPay: 950000, netPay: 675000, deductions: 275000, overtime: 42000 },
          { month: "Dec", grossPay: 980000, netPay: 690000, deductions: 290000, overtime: 52000 },
          { month: "Jan", grossPay: 960000, netPay: 680000, deductions: 280000, overtime: 47000 },
        ],
        summary: {
          totalPayroll: 960000,
          totalEmployees: 29,
          averageSalary: 33103,
          totalOvertimeHours: 160,
          totalOvertimeCost: 47000,
          totalDeductions: 280000,
          payrollGrowth: 4.3,
          overtimeGrowth: -9.6,
        },
      };

      setReportData(mockData);
    } catch (error) {
      console.error("Error loading report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = (format: string) => {
    if (!reportData) return;

    let content = "";
    let filename = "";
    let mimeType = "";

    switch (format) {
      case "csv":
        content = generateCSVReport();
        filename = `payroll-report-${selectedPeriod}.csv`;
        mimeType = "text/csv";
        break;
      case "pdf":
        alert("PDF export functionality would be implemented here");
        return;
      case "excel":
        alert("Excel export functionality would be implemented here");
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateCSVReport = () => {
    if (!reportData) return "";

    const sections = [
      "Payroll Report Summary",
      `Period: ${reportData.period}`,
      `Generated: ${new Date().toLocaleString()}`,
      "",
      "Department Costs",
      "Department,Total Cost,Employee Count,Average Salary,Overtime",
      ...reportData.departmentCosts.map(dept => 
        `${dept.department},${dept.totalCost},${dept.employeeCount},${dept.averageSalary},${dept.overtime}`
      ),
      "",
      "Deduction Breakdown",
      "Type,Amount,Percentage",
      ...reportData.deductionBreakdown.map(ded => 
        `${ded.type},${ded.amount},${ded.percentage}%`
      ),
      "",
      "Summary Totals",
      `Total Payroll,${reportData.summary.totalPayroll}`,
      `Total Employees,${reportData.summary.totalEmployees}`,
      `Average Salary,${reportData.summary.averageSalary}`,
      `Total Overtime Hours,${reportData.summary.totalOvertimeHours}`,
      `Total Overtime Cost,${reportData.summary.totalOvertimeCost}`,
      `Total Deductions,${reportData.summary.totalDeductions}`,
    ];

    return sections.join("\n");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(amount);
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading report data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payroll Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Comprehensive payroll insights and data analysis</p>
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
            <Button onClick={() => exportReport("csv")} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={() => exportReport("pdf")} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {reportData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Payroll</p>
                  <p className="text-2xl font-bold">{formatCurrency(reportData.summary.totalPayroll)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600">+{reportData.summary.payrollGrowth}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Employees</p>
                  <p className="text-2xl font-bold">{reportData.summary.totalEmployees}</p>
                  <p className="text-xs text-gray-600">Avg: {formatCurrency(reportData.summary.averageSalary)}</p>
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
                  <p className="text-2xl font-bold">{reportData.summary.totalOvertimeHours}h</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="w-3 h-3 text-red-600" />
                    <span className="text-xs text-red-600">{reportData.summary.overtimeGrowth}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <TrendingDown className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Deductions</p>
                  <p className="text-2xl font-bold">{formatCurrency(reportData.summary.totalDeductions)}</p>
                  <p className="text-xs text-gray-600">
                    {((reportData.summary.totalDeductions / reportData.summary.totalPayroll) * 100).toFixed(1)}% of gross
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="deductions">Deductions</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Costs Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Payroll Cost by Department
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData?.departmentCosts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="totalCost" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Deduction Breakdown Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieIcon className="w-5 h-5" />
                  Deduction Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData?.deductionBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ type, percentage }) => `${type}: ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {reportData?.deductionBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Monthly Payroll Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={reportData?.monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="grossPay" stroke="#10B981" name="Gross Pay" strokeWidth={2} />
                  <Line type="monotone" dataKey="netPay" stroke="#3B82F6" name="Net Pay" strokeWidth={2} />
                  <Line type="monotone" dataKey="deductions" stroke="#EF4444" name="Deductions" strokeWidth={2} />
                  <Line type="monotone" dataKey="overtime" stroke="#F59E0B" name="Overtime" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Cost Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Department</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Total Cost</TableHead>
                    <TableHead>Average Salary</TableHead>
                    <TableHead>Overtime Cost</TableHead>
                    <TableHead>Cost per Employee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData?.departmentCosts.map((dept) => (
                    <TableRow key={dept.department}>
                      <TableCell className="font-medium">{dept.department}</TableCell>
                      <TableCell>{dept.employeeCount}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(dept.totalCost)}</TableCell>
                      <TableCell>{formatCurrency(dept.averageSalary)}</TableCell>
                      <TableCell className="text-orange-600">{formatCurrency(dept.overtime)}</TableCell>
                      <TableCell>{formatCurrency(dept.totalCost / dept.employeeCount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Employee Distribution by Department</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData?.departmentCosts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="employeeCount" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deductions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Deduction Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Deduction Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData?.deductionBreakdown.map((deduction) => (
                      <TableRow key={deduction.type}>
                        <TableCell className="font-medium">{deduction.type}</TableCell>
                        <TableCell>{formatCurrency(deduction.amount)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{deduction.percentage}%</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deduction Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reportData?.deductionBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="amount" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overtime Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Avg Hours/Employee</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData?.overtimeAnalysis.map((overtime) => (
                    <TableRow key={overtime.month}>
                      <TableCell className="font-medium">{overtime.month}</TableCell>
                      <TableCell>{overtime.hours}h</TableCell>
                      <TableCell className="font-medium">{formatCurrency(overtime.cost)}</TableCell>
                      <TableCell>{overtime.employees}</TableCell>
                      <TableCell>{(overtime.hours / overtime.employees).toFixed(1)}h</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Overtime Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportData?.overtimeAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hours" stroke="#F59E0B" name="Hours" strokeWidth={2} />
                  <Line type="monotone" dataKey="cost" stroke="#EF4444" name="Cost" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payroll Growth Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <Label>Payroll Growth</Label>
                  <p className="text-3xl font-bold text-green-600">+{reportData?.summary.payrollGrowth}%</p>
                  <p className="text-sm text-gray-600">vs previous period</p>
                </div>
                <div className="text-center">
                  <Label>Overtime Growth</Label>
                  <p className="text-3xl font-bold text-red-600">{reportData?.summary.overtimeGrowth}%</p>
                  <p className="text-sm text-gray-600">vs previous period</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
