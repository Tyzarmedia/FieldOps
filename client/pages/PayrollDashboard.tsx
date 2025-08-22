import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Calculator,
  CreditCard,
  Building,
  Send,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  Plus,
  Edit,
} from "lucide-react";

export default function PayrollDashboard() {
  const [systemData, setSystemData] = useState<any>(null);
  const navigate = useNavigate();

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

  const dashboardCards = [
    {
      id: "payroll-processing",
      title: "Payroll Processing",
      icon: Calculator,
      color: "bg-blue-500",
      description: `${payrollStats.processedPayslips}/${payrollStats.employeeCount} processed`,
      action: () => handleCardAction("payroll-processing"),
    },
    {
      id: "overtime",
      title: "Overtime Management",
      icon: Clock,
      color: "bg-orange-500",
      description: `${payrollStats.overtimeHours} hours pending`,
      action: () => handleCardAction("overtime"),
    },
    {
      id: "bonuses",
      title: "Bonuses & Deductions",
      icon: TrendingUp,
      color: "bg-green-500",
      description: `$${payrollStats.bonusesPaid.toLocaleString()} bonuses paid`,
      action: () => handleCardAction("bonuses"),
    },
    {
      id: "payslips",
      title: "Payslip Generation",
      icon: FileText,
      color: "bg-purple-500",
      description: "Generate and distribute payslips",
      action: () => handleCardAction("payslips"),
    },
    {
      id: "approvals",
      title: "Pending Approvals",
      icon: CheckCircle,
      color: "bg-yellow-500",
      description: `${payrollStats.pendingApprovals} items need approval`,
      action: () => handleCardAction("approvals"),
    },
    {
      id: "employees",
      title: "Employee Management",
      icon: Users,
      color: "bg-indigo-500",
      description: `${payrollStats.employeeCount} employees`,
      action: () => handleCardAction("employees"),
    },
    {
      id: "reports",
      title: "Payroll Reports",
      icon: FileText,
      color: "bg-slate-500",
      description: "Generate payroll analytics and reports",
      action: () => handleCardAction("reports"),
    },
    {
      id: "bank-details",
      title: "Bank Details",
      icon: CreditCard,
      color: "bg-cyan-500",
      description: "Manage employee banking information",
      action: () => handleCardAction("bank-details"),
    },
    {
      id: "sage-integration",
      title: "Sage 300 Export",
      icon: Building,
      color: "bg-emerald-500",
      description: "Export payroll to Sage 300",
      action: () => handleCardAction("sage-integration"),
    },
    {
      id: "tax-calculations",
      title: "Tax Calculations",
      icon: Calculator,
      color: "bg-red-500",
      description: "Manage tax calculations and deductions",
      action: () => handleCardAction("tax-calculations"),
    },
    {
      id: "bulk-actions",
      title: "Bulk Actions",
      icon: Send,
      color: "bg-pink-500",
      description: "Bulk payroll operations",
      action: () => handleCardAction("bulk-actions"),
    },
    {
      id: "audit-trail",
      title: "Audit Trail",
      icon: AlertTriangle,
      color: "bg-teal-500",
      description: "Track payroll changes and history",
      action: () => handleCardAction("audit-trail"),
    },
  ];

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    try {
      const response = await fetch("/data/database.json");
      const data = await response.json();
      setSystemData(data);
    } catch (error) {
      console.error("Failed to load system data:", error);
    }
  };

  const handleCardAction = (cardId: string) => {
    switch (cardId) {
      case "payroll-processing":
        navigate("/payroll-processing");
        break;
      case "overtime":
        navigate("/overtime-approval");
        break;
      case "bonuses":
        navigate("/bonuses-deductions");
        break;
      case "payslips":
        navigate("/payslip-generation");
        break;
      case "approvals":
        navigate("/overtime-approval");
        break;
      case "employees":
        navigate("/employee-management");
        break;
      case "reports":
        navigate("/payroll-reports");
        break;
      case "bank-details":
        navigate("/bank-details");
        break;
      case "sage-integration":
        navigate("/sage300-export");
        break;
      case "tax-calculations":
        navigate("/tax-calculations");
        break;
      case "bulk-actions":
        navigate("/bulk-actions");
        break;
      case "audit-trail":
        navigate("/audit-trail");
        break;
      default:
        alert(`Opening ${cardId}...`);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Payroll Dashboard
        </h1>
        <p className="text-gray-600">
          Complete payroll management and processing
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Payroll</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(payrollStats.totalPayroll)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overtime Hours</p>
              <p className="text-2xl font-bold text-orange-600">
                {payrollStats.overtimeHours}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Salary</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(payrollStats.avgSalary)}
              </p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-red-600">
                {payrollStats.pendingApprovals}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {dashboardCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card
              key={card.id}
              className="bg-white hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-md"
              onClick={card.action}
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className={`${card.color} p-4 rounded-2xl`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-md">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Running payroll calculation...")}
          >
            <Calculator className="h-4 w-4 mr-2" />
            Run Payroll
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Adding bonus/deduction...")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Bonus
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Exporting payroll data...")}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => alert("Sending payslips via email...")}
          >
            <Send className="h-4 w-4 mr-2" />
            Send Payslips
          </Button>
        </div>
      </div>
    </div>
  );
}
