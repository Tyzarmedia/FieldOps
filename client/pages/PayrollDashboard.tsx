import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  Download,
  Calendar,
  Plus,
  Edit,
  Eye,
  CheckCircle,
  AlertTriangle,
  Calculator,
  CreditCard,
  Building,
  Send,
} from "lucide-react";

export default function PayrollDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("January 2024");

  const payrollStats = {
    totalPayroll: 487500,
    employeeCount: 87,
    avgSalary: 56034,
    overtimeHours: 142,
    overtimeCost: 8520,
    bonusesPaid: 25000,
    deductionsTotal: 12400,
    netPayroll: 475100,
    pendingApprovals: 5,
    processedPayslips: 82,
  };

  const employees = [
    {
      id: "E001",
      name: "John Smith",
      role: "Senior Technician",
      department: "Field Operations",
      baseSalary: 65000,
      salaryType: "monthly",
      overtimeHours: 12.5,
      overtimeRate: 35.42,
      bonus: 1500,
      deductions: 650,
      grossPay: 6908.33,
      netPay: 6258.33,
      status: "processed",
      payDate: "2024-01-31",
    },
    {
      id: "E002",
      name: "Sarah Johnson",
      role: "Fleet Coordinator",
      department: "Fleet Management",
      baseSalary: 58000,
      salaryType: "monthly",
      overtimeHours: 8.0,
      overtimeRate: 31.25,
      bonus: 800,
      deductions: 580,
      grossPay: 5083.33,
      netPay: 4503.33,
      status: "pending",
      payDate: "2024-01-31",
    },
    {
      id: "E003",
      name: "Mike Chen",
      role: "Network Technician",
      department: "Field Operations",
      baseSalary: 25.5,
      salaryType: "hourly",
      overtimeHours: 4.5,
      overtimeRate: 38.25,
      bonus: 0,
      deductions: 320,
      grossPay: 4252.25,
      netPay: 3932.25,
      status: "processed",
      payDate: "2024-01-31",
    },
  ];

  const overtimeClaims = [
    {
      id: "OT001",
      employee: "John Smith",
      date: "2024-01-28",
      clockIn: "08:00",
      clockOut: "20:30",
      regularHours: 8,
      overtimeHours: 4.5,
      reason: "Emergency fiber repair",
      approvedBy: "Manager",
      status: "approved",
      amount: 159.38,
    },
    {
      id: "OT002",
      employee: "Emma Wilson",
      date: "2024-01-25",
      clockIn: "07:30",
      clockOut: "19:00",
      regularHours: 8,
      overtimeHours: 3.5,
      reason: "Network upgrade project",
      approvedBy: "Pending",
      status: "pending",
      amount: 122.5,
    },
    {
      id: "OT003",
      employee: "David Brown",
      date: "2024-01-24",
      clockIn: "09:00",
      clockOut: "21:15",
      regularHours: 8,
      overtimeHours: 4.25,
      reason: "Customer escalation resolution",
      approvedBy: "Manager",
      status: "approved",
      amount: 148.75,
    },
  ];

  const bonusDeductions = [
    {
      employee: "John Smith",
      type: "bonus",
      description: "Performance bonus Q4 2023",
      amount: 1500,
      status: "approved",
      date: "2024-01-15",
    },
    {
      employee: "Sarah Johnson",
      type: "deduction",
      description: "Uniform replacement",
      amount: -65,
      status: "processed",
      date: "2024-01-20",
    },
    {
      employee: "Mike Chen",
      type: "bonus",
      description: "Project completion bonus",
      amount: 800,
      status: "pending",
      date: "2024-01-22",
    },
    {
      employee: "Lisa Garcia",
      type: "deduction",
      description: "Parking fee",
      amount: -30,
      status: "processed",
      date: "2024-01-18",
    },
  ];

  const payrollReports = [
    {
      period: "January 2024",
      totalPayroll: 487500,
      employees: 87,
      status: "in-progress",
      dueDate: "2024-01-31",
      processed: 82,
      pending: 5,
    },
    {
      period: "December 2023",
      totalPayroll: 492300,
      employees: 89,
      status: "completed",
      dueDate: "2023-12-31",
      processed: 89,
      pending: 0,
    },
    {
      period: "November 2023",
      totalPayroll: 478900,
      employees: 86,
      status: "completed",
      dueDate: "2023-11-30",
      processed: 86,
      pending: 0,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processed":
      case "completed":
      case "approved":
        return "bg-success text-success-foreground";
      case "pending":
      case "in-progress":
        return "bg-warning text-warning-foreground";
      case "rejected":
      case "failed":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getSalaryTypeColor = (type: string) => {
    switch (type) {
      case "monthly":
        return "bg-info text-info-foreground";
      case "hourly":
        return "bg-warning text-warning-foreground";
      case "contract":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Payroll Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Payroll
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(payrollStats.totalPayroll)}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-success" />
              <span>+3.2% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overtime Hours
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payrollStats.overtimeHours}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 text-success" />
              <span>{formatCurrency(payrollStats.overtimeCost)} cost</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Salary</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(payrollStats.avgSalary)}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3 text-info" />
              <span>{payrollStats.employeeCount} employees</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payrollStats.pendingApprovals}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-warning" />
              <span>Require attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="payroll" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="overtime">Overtime</TabsTrigger>
          <TabsTrigger value="bonuses">Bonuses/Deductions</TabsTrigger>
          <TabsTrigger value="payslips">Payslips</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="payroll" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Employee Payroll</h3>
            <div className="flex space-x-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select pay period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="January 2024">January 2024</SelectItem>
                  <SelectItem value="December 2023">December 2023</SelectItem>
                  <SelectItem value="November 2023">November 2023</SelectItem>
                </SelectContent>
              </Select>
              <Button size="sm">
                <Calculator className="h-4 w-4 mr-2" />
                Process Payroll
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {employees.map((employee) => (
              <Card
                key={employee.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{employee.id}</Badge>
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status}
                        </Badge>
                        <Badge
                          className={getSalaryTypeColor(employee.salaryType)}
                        >
                          {employee.salaryType}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {employee.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {employee.role} • {employee.department}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Base:</span>
                          <p className="font-medium">
                            {employee.salaryType === "hourly"
                              ? `$${employee.baseSalary}/hr`
                              : formatCurrency(employee.baseSalary)}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Overtime:
                          </span>
                          <p className="font-medium">
                            {employee.overtimeHours}h
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Bonus:</span>
                          <p className="font-medium">
                            {formatCurrency(employee.bonus)}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Deductions:
                          </span>
                          <p className="font-medium text-destructive">
                            -{formatCurrency(employee.deductions)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Net Pay</p>
                      <p className="text-2xl font-bold text-success">
                        {formatCurrency(employee.netPay)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Gross: {formatCurrency(employee.grossPay)}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Pay
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Generate Payslip
                    </Button>
                    {employee.status === "pending" && (
                      <Button size="sm" className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="overtime" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Overtime Claims</h3>
            <Button size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Bulk Approve
            </Button>
          </div>

          <div className="space-y-4">
            {overtimeClaims.map((claim) => (
              <Card key={claim.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{claim.id}</Badge>
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{claim.employee}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {claim.reason}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Date:</span>{" "}
                          {claim.date}
                        </div>
                        <div>
                          <span className="font-medium">Hours:</span>{" "}
                          {claim.clockIn} - {claim.clockOut}
                        </div>
                        <div>
                          <span className="font-medium">Overtime:</span>{" "}
                          {claim.overtimeHours}h
                        </div>
                        <div>
                          <span className="font-medium">Amount:</span>{" "}
                          {formatCurrency(claim.amount)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {claim.status === "pending" && (
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-destructive"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-2" />
                        Adjust
                      </Button>
                    </div>
                  )}

                  {claim.status !== "pending" && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bonuses" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Bonuses & Deductions</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </div>

          <div className="space-y-4">
            {bonusDeductions.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge
                          className={
                            item.type === "bonus"
                              ? "bg-success text-success-foreground"
                              : "bg-destructive text-destructive-foreground"
                          }
                        >
                          {item.type}
                        </Badge>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{item.employee}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Date: {item.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-2xl font-bold ${
                          item.amount > 0 ? "text-success" : "text-destructive"
                        }`}
                      >
                        {item.amount > 0 ? "+" : ""}
                        {formatCurrency(Math.abs(item.amount))}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payslips" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Payslip Generation</h3>
            <Button size="sm">
              <Send className="h-4 w-4 mr-2" />
              Send All Payslips
            </Button>
          </div>

          <div className="space-y-4">
            {payrollReports.map((report, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{report.period}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground mt-2">
                        <div>
                          <span className="font-medium">Total:</span>{" "}
                          {formatCurrency(report.totalPayroll)}
                        </div>
                        <div>
                          <span className="font-medium">Employees:</span>{" "}
                          {report.employees}
                        </div>
                        <div>
                          <span className="font-medium">Processed:</span>{" "}
                          {report.processed}
                        </div>
                        <div>
                          <span className="font-medium">Pending:</span>{" "}
                          {report.pending}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      {report.status === "in-progress" && (
                        <Button size="sm">
                          <Send className="h-4 w-4 mr-2" />
                          Send Payslips
                        </Button>
                      )}
                    </div>
                  </div>
                  {report.status === "in-progress" && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground">
                          Progress
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {Math.round(
                            (report.processed / report.employees) * 100,
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={(report.processed / report.employees) * 100}
                        className="h-2"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Payroll Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Monthly Payroll Summary
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Overtime Analysis
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Payroll Cost Trends
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Employee Cost Analysis
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Building className="h-4 w-4 mr-2" />
                  Export to Sage 300
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <Calculator className="h-4 w-4 mr-2" />
                  Run Payroll Calculation
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Bonus/Deduction
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Update Bank Details
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Payroll Data
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Send Payslips via Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
