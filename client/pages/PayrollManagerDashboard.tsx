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
  Users,
  Clock,
  DollarSign,
  Timer,
  AlertTriangle,
  CheckCircle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Eye,
  Calendar,
  Mail,
  RefreshCw,
  XCircle,
  FileText,
  CreditCard,
  TrendingUp,
  BarChart3,
  Settings,
  Banknote,
  Receipt,
  Calculator,
  ClipboardList,
  UserCheck,
  Bell,
  Archive,
  Target,
  Percent,
} from "lucide-react";

export default function PayrollManagerDashboard() {
  const [activeSection, setActiveSection] = useState("main");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPayPeriod, setSelectedPayPeriod] = useState("current");

  const payrollStats = {
    totalStaff: 74,
    timesheetsSubmitted: 72,
    payrollAmount: 620000,
    overtimeClaims: 32500,
    unapprovedTimesheets: 4,
    payrollIssues: 2,
    pendingLeave: 8,
    completedPayslips: 70,
    bankingErrors: 1,
    taxDeductions: 124000,
    totalDeductions: 89500,
    bonusPayments: 15000,
  };

  const timesheetData = [
    {
      id: 1,
      employee: "John Smith",
      department: "Network Maintenance",
      role: "Technician",
      weekEnding: "2024-01-21",
      regularHours: 40,
      overtimeHours: 8,
      totalHours: 48,
      clockInConsistency: "Good",
      status: "Approved",
      approvedBy: "Mike Wilson",
      submissionDate: "2024-01-22",
      issues: [],
    },
    {
      id: 2,
      employee: "Sarah Johnson",
      department: "Installation",
      role: "Senior Technician",
      weekEnding: "2024-01-21",
      regularHours: 40,
      overtimeHours: 12,
      totalHours: 52,
      clockInConsistency: "Good",
      status: "Pending",
      approvedBy: null,
      submissionDate: "2024-01-22",
      issues: ["Excessive overtime"],
    },
    {
      id: 3,
      employee: "Mike Chen",
      department: "Repair Services",
      role: "Technician",
      weekEnding: "2024-01-21",
      regularHours: 35,
      overtimeHours: 0,
      totalHours: 35,
      clockInConsistency: "Issues",
      status: "Flagged",
      approvedBy: null,
      submissionDate: "2024-01-23",
      issues: ["Missing clock-out Tuesday", "Late submission"],
    },
    {
      id: 4,
      employee: "Emma Wilson",
      department: "Emergency Services",
      role: "Emergency Technician",
      weekEnding: "2024-01-21",
      regularHours: 40,
      overtimeHours: 16,
      totalHours: 56,
      clockInConsistency: "Good",
      status: "Approved",
      approvedBy: "David Brown",
      submissionDate: "2024-01-21",
      issues: [],
    },
  ];

  const overtimeData = [
    {
      id: "OT001",
      employee: "Sarah Johnson",
      department: "Installation",
      date: "2024-01-20",
      hours: 4,
      rate: "1.5x",
      amount: 450.00,
      justification: "Emergency fiber repair - client deadline",
      approvedBy: null,
      status: "Pending",
      jobReference: "J087",
    },
    {
      id: "OT002",
      employee: "Emma Wilson",
      department: "Emergency Services",
      date: "2024-01-19",
      hours: 6,
      rate: "2.0x",
      amount: 720.00,
      justification: "Weekend emergency call-out",
      approvedBy: "Manager",
      status: "Approved",
      jobReference: "J089",
    },
    {
      id: "OT003",
      employee: "Mike Chen",
      department: "Repair Services",
      date: "2024-01-18",
      hours: 2,
      rate: "1.5x",
      amount: 150.00,
      justification: "Equipment repair overran",
      approvedBy: "Supervisor",
      status: "Approved",
      jobReference: "J091",
    },
  ];

  const salaryBreakdown = [
    {
      id: 1,
      employee: "John Smith",
      employeeId: "EMP001",
      department: "Network Maintenance",
      basicSalary: 18500.00,
      overtime: 1200.00,
      allowances: 800.00,
      grossPay: 20500.00,
      taxDeduction: 3485.00,
      uifDeduction: 205.00,
      medicalAid: 1250.00,
      loanDeduction: 500.00,
      totalDeductions: 5440.00,
      netPay: 15060.00,
      payslipGenerated: true,
      bankDetails: "FNB - ****4521",
      paymentStatus: "Paid",
    },
    {
      id: 2,
      employee: "Sarah Johnson",
      employeeId: "EMP002",
      department: "Installation",
      basicSalary: 22000.00,
      overtime: 1800.00,
      allowances: 1200.00,
      grossPay: 25000.00,
      taxDeduction: 4750.00,
      uifDeduction: 250.00,
      medicalAid: 1250.00,
      loanDeduction: 0.00,
      totalDeductions: 6250.00,
      netPay: 18750.00,
      payslipGenerated: true,
      bankDetails: "Standard Bank - ****7892",
      paymentStatus: "Pending",
    },
    {
      id: 3,
      employee: "Mike Chen",
      employeeId: "EMP003",
      department: "Repair Services",
      basicSalary: 16500.00,
      overtime: 300.00,
      allowances: 600.00,
      grossPay: 17400.00,
      taxDeduction: 2610.00,
      uifDeduction: 174.00,
      medicalAid: 850.00,
      loanDeduction: 750.00,
      totalDeductions: 4384.00,
      netPay: 13016.00,
      payslipGenerated: false,
      bankDetails: "Missing",
      paymentStatus: "On Hold",
    },
  ];

  const leaveData = [
    {
      id: "LV001",
      employee: "David Brown",
      department: "General Maintenance",
      leaveType: "Annual Leave",
      startDate: "2024-01-25",
      endDate: "2024-01-26",
      days: 2,
      isPaid: true,
      status: "Approved",
      approvedBy: "HR Manager",
      affectsPayroll: false,
    },
    {
      id: "LV002",
      employee: "Lisa Anderson",
      department: "Quality Control",
      leaveType: "Sick Leave",
      startDate: "2024-01-22",
      endDate: "2024-01-24",
      days: 3,
      isPaid: true,
      status: "Pending",
      approvedBy: null,
      affectsPayroll: true,
    },
    {
      id: "LV003",
      employee: "Mark Thompson",
      department: "Training",
      leaveType: "Unpaid Leave",
      startDate: "2024-01-29",
      endDate: "2024-02-02",
      days: 5,
      isPaid: false,
      status: "Approved",
      approvedBy: "Department Head",
      affectsPayroll: true,
    },
  ];

  const loanDeductions = [
    {
      id: "LD001",
      employee: "John Smith",
      loanType: "Equipment Loan",
      originalAmount: 2500.00,
      remainingBalance: 500.00,
      monthlyDeduction: 250.00,
      monthsRemaining: 2,
      startDate: "2023-11-01",
      nextDeduction: "2024-02-01",
    },
    {
      id: "LD002",
      employee: "Mike Chen",
      loanType: "Uniform Advance",
      originalAmount: 1500.00,
      remainingBalance: 750.00,
      monthlyDeduction: 150.00,
      monthsRemaining: 5,
      startDate: "2023-09-01",
      nextDeduction: "2024-02-01",
    },
    {
      id: "LD003",
      employee: "Emma Wilson",
      loanType: "Training Fee",
      originalAmount: 3000.00,
      remainingBalance: 1200.00,
      monthlyDeduction: 300.00,
      monthsRemaining: 4,
      startDate: "2023-10-01",
      nextDeduction: "2024-02-01",
    },
  ];

  const payrollAlerts = [
    {
      id: "PA001",
      type: "Missing Timesheet",
      employee: "Robert Taylor",
      department: "Maintenance",
      message: "Timesheet not submitted for week ending 2024-01-21",
      priority: "High",
      daysOverdue: 2,
      action: "Follow up required",
    },
    {
      id: "PA002",
      type: "Suspicious Pattern",
      employee: "Lisa Anderson",
      department: "Quality Control",
      message: "Clocking pattern shows consistent early departures",
      priority: "Medium",
      daysOverdue: null,
      action: "Review with manager",
    },
    {
      id: "PA003",
      type: "Duplicate Entry",
      employee: "Mark Thompson",
      department: "Training",
      message: "Duplicate overtime entry for 2024-01-20",
      priority: "Medium",
      daysOverdue: null,
      action: "Verify and remove duplicate",
    },
    {
      id: "PA004",
      type: "Bank Details Missing",
      employee: "Mike Chen",
      department: "Repair Services",
      message: "Bank account details not provided",
      priority: "Critical",
      daysOverdue: 5,
      action: "Cannot process payment",
    },
  ];

  useEffect(() => {
    // Load payroll data
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
      case "paid":
      case "completed":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      case "flagged":
      case "on hold":
      case "overdue":
        return "bg-destructive text-destructive-foreground";
      case "good":
        return "bg-success text-success-foreground";
      case "issues":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-orange-500 text-white";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-info text-info-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const renderMainDashboard = () => (
    <div className="space-y-6">
      {/* Quick Overview Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Staff</p>
                <p className="text-2xl font-bold text-primary">{payrollStats.totalStaff}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Timesheets</p>
                <p className="text-2xl font-bold text-success">{payrollStats.timesheetsSubmitted}/{payrollStats.totalStaff}</p>
              </div>
              <Clock className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Payroll Amount</p>
                <p className="text-2xl font-bold text-success">R{payrollStats.payrollAmount.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overtime</p>
                <p className="text-2xl font-bold text-warning">R{payrollStats.overtimeClaims.toLocaleString()}</p>
              </div>
              <Timer className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unapproved</p>
                <p className="text-2xl font-bold text-warning">{payrollStats.unapprovedTimesheets}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Issues</p>
                <p className="text-2xl font-bold text-destructive">{payrollStats.payrollIssues}</p>
              </div>
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("timesheets")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-500 p-4 rounded-2xl">
                <Clock className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Timesheet Management</h3>
            <p className="text-sm text-gray-600">{payrollStats.timesheetsSubmitted} of {payrollStats.totalStaff} submitted</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("overtime")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-orange-500 p-4 rounded-2xl">
                <Timer className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Overtime & Allowances</h3>
            <p className="text-sm text-gray-600">R{payrollStats.overtimeClaims.toLocaleString()} in claims</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("payslips")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-500 p-4 rounded-2xl">
                <Receipt className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Salary & Payslips</h3>
            <p className="text-sm text-gray-600">{payrollStats.completedPayslips} payslips generated</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("leave")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-500 p-4 rounded-2xl">
                <Calendar className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Leave Management</h3>
            <p className="text-sm text-gray-600">{payrollStats.pendingLeave} pending requests</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("reports")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-cyan-500 p-4 rounded-2xl">
                <FileText className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Payroll Reports</h3>
            <p className="text-sm text-gray-600">Generate detailed reports</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("banking")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-indigo-500 p-4 rounded-2xl">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Banking & Payments</h3>
            <p className="text-sm text-gray-600">{payrollStats.bankingErrors} banking error</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("deductions")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-500 p-4 rounded-2xl">
                <Calculator className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Loans & Deductions</h3>
            <p className="text-sm text-gray-600">R{payrollStats.totalDeductions.toLocaleString()} total deductions</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("alerts")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-500 p-4 rounded-2xl">
                <Bell className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Payroll Alerts</h3>
            <p className="text-sm text-gray-600">{payrollStats.payrollIssues} issues flagged</p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300"
          onClick={() => setActiveSection("configuration")}
        >
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-slate-500 p-4 rounded-2xl">
                <Settings className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Configuration</h3>
            <p className="text-sm text-gray-600">Payroll settings & templates</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTimesheetManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Timesheet Management</h2>
        <div className="flex space-x-2">
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Departments</SelectItem>
              <SelectItem value="Network Maintenance">Network Maintenance</SelectItem>
              <SelectItem value="Installation">Installation</SelectItem>
              <SelectItem value="Repair Services">Repair Services</SelectItem>
              <SelectItem value="Emergency Services">Emergency Services</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {timesheetData.map((timesheet) => (
          <Card key={timesheet.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-lg">{timesheet.employee}</h3>
                    <Badge className={getStatusColor(timesheet.status)}>
                      {timesheet.status}
                    </Badge>
                    <Badge className={getStatusColor(timesheet.clockInConsistency)}>
                      Clock: {timesheet.clockInConsistency}
                    </Badge>
                    {timesheet.issues.length > 0 && (
                      <Badge className="bg-warning text-warning-foreground">
                        {timesheet.issues.length} Issue{timesheet.issues.length > 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-3">{timesheet.department} - {timesheet.role}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Week Ending:</p>
                      <p>{timesheet.weekEnding}</p>
                    </div>
                    <div>
                      <p className="font-medium">Regular Hours:</p>
                      <p>{timesheet.regularHours}h</p>
                    </div>
                    <div>
                      <p className="font-medium">Overtime Hours:</p>
                      <p className={timesheet.overtimeHours > 12 ? 'text-warning font-bold' : ''}>{timesheet.overtimeHours}h</p>
                    </div>
                    <div>
                      <p className="font-medium">Total Hours:</p>
                      <p className="font-bold">{timesheet.totalHours}h</p>
                    </div>
                    <div>
                      <p className="font-medium">Submitted:</p>
                      <p>{timesheet.submissionDate}</p>
                    </div>
                    <div>
                      <p className="font-medium">Approved By:</p>
                      <p>{timesheet.approvedBy || "Pending"}</p>
                    </div>
                  </div>

                  {timesheet.issues.length > 0 && (
                    <div className="mt-3">
                      <p className="font-medium text-warning">Issues:</p>
                      <div className="space-y-1">
                        {timesheet.issues.map((issue, index) => (
                          <p key={index} className="text-sm text-warning">
                            ⚠️ {issue}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                {timesheet.status === "Pending" && (
                  <>
                    <Button size="sm" className="bg-success">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm" className="text-warning">
                      <Edit className="h-4 w-4 mr-2" />
                      Request Changes
                    </Button>
                  </>
                )}
                {timesheet.status === "Flagged" && (
                  <Button size="sm" className="bg-warning">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Resolve Issues
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderOvertimeAllowances = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Overtime & Allowances</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Manual Entry
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {overtimeData.map((overtime) => (
          <Card key={overtime.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{overtime.id}</Badge>
                    <Badge className={getStatusColor(overtime.status)}>
                      {overtime.status}
                    </Badge>
                    <Badge variant="secondary">{overtime.rate} Rate</Badge>
                  </div>
                  <h3 className="font-semibold text-lg">{overtime.employee}</h3>
                  <p className="text-muted-foreground mb-3">{overtime.department}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Date:</p>
                      <p>{overtime.date}</p>
                    </div>
                    <div>
                      <p className="font-medium">Hours:</p>
                      <p className="font-bold">{overtime.hours}h</p>
                    </div>
                    <div>
                      <p className="font-medium">Amount:</p>
                      <p className="font-bold text-success">R{overtime.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Job Reference:</p>
                      <p>{overtime.jobReference}</p>
                    </div>
                    <div>
                      <p className="font-medium">Approved By:</p>
                      <p>{overtime.approvedBy || "Pending"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">Justification:</p>
                      <p>{overtime.justification}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {overtime.status === "Pending" && (
                  <>
                    <Button size="sm" className="bg-success">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive">
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </>
                )}
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Job Details
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Adjust Amount
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSalaryPayslips = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Salary Breakdown & Payslips</h2>
        <div className="flex space-x-2">
          <Select value={selectedPayPeriod} onValueChange={setSelectedPayPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Period</SelectItem>
              <SelectItem value="previous">Previous Period</SelectItem>
              <SelectItem value="january">January 2024</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Email All Payslips
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Bulk Download
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {salaryBreakdown.map((salary) => (
          <Card key={salary.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-lg">{salary.employee}</h3>
                    <Badge variant="outline">{salary.employeeId}</Badge>
                    <Badge className={getStatusColor(salary.paymentStatus)}>
                      {salary.paymentStatus}
                    </Badge>
                    {salary.payslipGenerated && (
                      <Badge className="bg-success text-success-foreground">
                        Payslip Generated
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-3">{salary.department}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="space-y-2">
                      <p className="font-medium text-muted-foreground">Earnings</p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Basic Salary:</span>
                          <span>R{salary.basicSalary.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Overtime:</span>
                          <span>R{salary.overtime.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Allowances:</span>
                          <span>R{salary.allowances.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-1">
                          <span>Gross Pay:</span>
                          <span>R{salary.grossPay.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium text-muted-foreground">Deductions</p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Tax:</span>
                          <span>R{salary.taxDeduction.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>UIF:</span>
                          <span>R{salary.uifDeduction.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Medical Aid:</span>
                          <span>R{salary.medicalAid.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Loan:</span>
                          <span>R{salary.loanDeduction.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-1">
                          <span>Total:</span>
                          <span>R{salary.totalDeductions.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium text-muted-foreground">Net Pay</p>
                      <div className="text-2xl font-bold text-success">
                        R{salary.netPay.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Bank: {salary.bankDetails}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="font-medium text-muted-foreground">Actions</p>
                      <div className="space-y-2">
                        {salary.payslipGenerated ? (
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Download Payslip
                          </Button>
                        ) : (
                          <Button size="sm" className="w-full">
                            <Receipt className="h-4 w-4 mr-2" />
                            Generate Payslip
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="w-full">
                          <Mail className="h-4 w-4 mr-2" />
                          Email Payslip
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderLeaveManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Leave & Absence Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync with HR
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {leaveData.map((leave) => (
          <Card key={leave.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{leave.id}</Badge>
                    <Badge className={getStatusColor(leave.status)}>
                      {leave.status}
                    </Badge>
                    <Badge className={leave.isPaid ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>
                      {leave.isPaid ? "Paid" : "Unpaid"}
                    </Badge>
                    {leave.affectsPayroll && (
                      <Badge className="bg-info text-info-foreground">
                        Affects Payroll
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">{leave.employee}</h3>
                  <p className="text-muted-foreground mb-3">{leave.department}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p className="font-medium">Leave Type:</p>
                      <p>{leave.leaveType}</p>
                    </div>
                    <div>
                      <p className="font-medium">Start Date:</p>
                      <p>{leave.startDate}</p>
                    </div>
                    <div>
                      <p className="font-medium">End Date:</p>
                      <p>{leave.endDate}</p>
                    </div>
                    <div>
                      <p className="font-medium">Total Days:</p>
                      <p className="font-bold">{leave.days} days</p>
                    </div>
                    <div>
                      <p className="font-medium">Approved By:</p>
                      <p>{leave.approvedBy || "Pending"}</p>
                    </div>
                    <div>
                      <p className="font-medium">Payroll Impact:</p>
                      <p className={leave.affectsPayroll ? 'text-warning font-bold' : 'text-success'}>
                        {leave.affectsPayroll ? 'Deduction Required' : 'No Impact'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Request
                </Button>
                {leave.affectsPayroll && (
                  <Button size="sm" className="bg-warning">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculate Deduction
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Adjust Days
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPayrollAlerts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payroll Alerts & Flags</h2>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Reviewed
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {payrollAlerts.map((alert) => (
          <Card key={alert.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{alert.id}</Badge>
                    <Badge className={getPriorityColor(alert.priority)}>
                      {alert.priority}
                    </Badge>
                    <Badge variant="secondary">{alert.type}</Badge>
                    {alert.daysOverdue && (
                      <Badge className="bg-destructive text-destructive-foreground">
                        {alert.daysOverdue} days overdue
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg">{alert.employee}</h3>
                  <p className="text-muted-foreground mb-2">{alert.department}</p>
                  <p className="text-foreground">{alert.message}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Recommended Action:</strong> {alert.action}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Resolve
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Employee
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case "timesheets":
        return renderTimesheetManagement();
      case "overtime":
        return renderOvertimeAllowances();
      case "payslips":
        return renderSalaryPayslips();
      case "leave":
        return renderLeaveManagement();
      case "reports":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Payroll Reports & Exports</h2>
            <p className="text-muted-foreground">Payroll reporting functionality coming soon...</p>
          </div>
        );
      case "banking":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Banking & Payment Information</h2>
            <p className="text-muted-foreground">Banking management functionality coming soon...</p>
          </div>
        );
      case "deductions":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Loan & Deduction Management</h2>
            <div className="space-y-4">
              {loanDeductions.map((loan) => (
                <Card key={loan.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{loan.employee}</h3>
                        <p className="text-muted-foreground mb-3">{loan.loanType}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                          <div>
                            <p className="font-medium">Original Amount:</p>
                            <p>R{loan.originalAmount.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="font-medium">Remaining Balance:</p>
                            <p className="font-bold text-warning">R{loan.remainingBalance.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="font-medium">Monthly Deduction:</p>
                            <p>R{loan.monthlyDeduction.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="font-medium">Months Remaining:</p>
                            <p>{loan.monthsRemaining} months</p>
                          </div>
                          <div>
                            <p className="font-medium">Start Date:</p>
                            <p>{loan.startDate}</p>
                          </div>
                          <div>
                            <p className="font-medium">Next Deduction:</p>
                            <p>{loan.nextDeduction}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      case "alerts":
        return renderPayrollAlerts();
      case "configuration":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Payroll Configuration & Settings</h2>
            <p className="text-muted-foreground">Payroll configuration functionality coming soon...</p>
          </div>
        );
      default:
        return renderMainDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Payroll Manager Dashboard
            </h1>
            <p className="text-muted-foreground">
              Comprehensive payroll management, timesheet processing, and salary administration
            </p>
          </div>
          {activeSection !== "main" && (
            <Button 
              variant="outline" 
              onClick={() => setActiveSection("main")}
            >
              ← Back to Dashboard
            </Button>
          )}
        </div>
      </div>

      {renderSection()}
    </div>
  );
}
