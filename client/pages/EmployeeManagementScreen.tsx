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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  CreditCard,
  FileText,
  Shield,
  Building,
  Clock,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

interface Employee {
  id: string;
  employeeNumber: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    nationalId: string;
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  employment: {
    role: string;
    department: string;
    jobTitle: string;
    startDate: string;
    contractType: string;
    status: string;
    manager: string;
    salary: number;
    payrollNumber: string;
    workSchedule: string;
  };
  bankDetails: {
    bankName: string;
    accountNumber: string;
    branchCode: string;
    accountType: string;
  };
  taxInfo: {
    taxNumber: string;
    taxBracket: string;
    medicalAidNumber?: string;
    pensionFundNumber?: string;
  };
  leave: {
    annualBalance: number;
    sickBalance: number;
    familyBalance: number;
    used: number;
    total: number;
  };
  benefits: {
    medicalAid: boolean;
    pensionFund: boolean;
    lifeInsurance: boolean;
    disabilityInsurance: boolean;
  };
  performance: {
    rating: number;
    lastReview: string;
    nextReview: string;
  };
}

export default function EmployeeManagementScreen() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);

      // Load from database.json
      const response = await fetch("/data/database.json");
      const data = await response.json();

      // Transform data to match our interface
      const transformedEmployees: Employee[] = (data.employees || []).map(
        (emp: any) => ({
          id: emp.id,
          employeeNumber: emp.employeeNumber,
          personalInfo: {
            firstName: emp.personalInfo?.firstName || "",
            lastName: emp.personalInfo?.lastName || "",
            fullName:
              emp.personalInfo?.fullName ||
              `${emp.personalInfo?.firstName} ${emp.personalInfo?.lastName}`,
            email: emp.personalInfo?.email || "",
            phone: emp.personalInfo?.phone || "",
            address: emp.personalInfo?.address || "",
            dateOfBirth: emp.personalInfo?.dateOfBirth || "",
            nationalId: emp.personalInfo?.nationalId || "",
            emergencyContact: emp.personalInfo?.emergencyContact || {
              name: "",
              relationship: "",
              phone: "",
            },
          },
          employment: {
            role: emp.employment?.role || "",
            department: emp.employment?.department || "",
            jobTitle: emp.employment?.role || "",
            startDate: emp.employment?.startDate || "",
            contractType: emp.employment?.contractType || "permanent",
            status: emp.employment?.status || "active",
            manager: emp.employment?.manager || "",
            salary: emp.employment?.salary || 0,
            payrollNumber: emp.employeeNumber || "",
            workSchedule: "08:00-17:00",
          },
          bankDetails: {
            bankName: "Standard Bank", // Default
            accountNumber: `ACC${emp.employeeNumber?.replace(/\D/g, "") || "000"}`,
            branchCode: "051001",
            accountType: "Current",
          },
          taxInfo: {
            taxNumber: `TAX${emp.employeeNumber?.replace(/\D/g, "") || "000"}`,
            taxBracket: emp.employment?.salary > 50000 ? "Higher" : "Standard",
            medicalAidNumber: emp.benefits?.medicalAid
              ? `MED${emp.employeeNumber?.replace(/\D/g, "") || "000"}`
              : undefined,
            pensionFundNumber: emp.benefits?.pensionFund
              ? `PEN${emp.employeeNumber?.replace(/\D/g, "") || "000"}`
              : undefined,
          },
          leave: {
            annualBalance: emp.leave?.balance || 15,
            sickBalance: emp.leave?.sick || 10,
            familyBalance: emp.leave?.family || 5,
            used: emp.leave?.used || 0,
            total: emp.leave?.total || 30,
          },
          benefits: {
            medicalAid: true,
            pensionFund: true,
            lifeInsurance: emp.employment?.salary > 30000,
            disabilityInsurance: emp.employment?.salary > 30000,
          },
          performance: {
            rating: emp.performance?.rating || 3.5,
            lastReview: emp.performance?.lastReview || "2024-12-01",
            nextReview: emp.performance?.nextReview || "2025-12-01",
          },
        }),
      );

      setEmployees(transformedEmployees);
    } catch (error) {
      console.error("Error loading employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedEmployees = employees
    .filter((emp) => {
      const matchesSearch =
        searchTerm === "" ||
        emp.personalInfo.fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        emp.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        filterDepartment === "all" ||
        emp.employment.department === filterDepartment;
      const matchesStatus =
        filterStatus === "all" || emp.employment.status === filterStatus;

      return matchesSearch && matchesDepartment && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.personalInfo.fullName.localeCompare(b.personalInfo.fullName);
        case "department":
          return a.employment.department.localeCompare(b.employment.department);
        case "salary":
          return b.employment.salary - a.employment.salary;
        case "startDate":
          return (
            new Date(b.employment.startDate).getTime() -
            new Date(a.employment.startDate).getTime()
          );
        default:
          return 0;
      }
    });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "on leave":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
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

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const getTenure = (startDate: string) => {
    if (!startDate) return "N/A";
    const today = new Date();
    const start = new Date(startDate);
    const diffInMs = today.getTime() - start.getTime();
    const diffInYears = diffInMs / (1000 * 60 * 60 * 24 * 365.25);

    if (diffInYears < 1) {
      const months = Math.floor(diffInYears * 12);
      return `${months} months`;
    }
    return `${Math.floor(diffInYears)} years`;
  };

  const getPerformanceColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const departments = [
    ...new Set(employees.map((emp) => emp.employment.department)),
  ];
  const stats = {
    total: employees.length,
    active: employees.filter((emp) => emp.employment.status === "active")
      .length,
    inactive: employees.filter((emp) => emp.employment.status !== "active")
      .length,
    averageSalary:
      employees.length > 0
        ? employees.reduce((sum, emp) => sum + emp.employment.salary, 0) /
          employees.length
        : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Employee Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage employee profiles and information
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
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
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.inactive}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Salary</p>
                <p className="text-xl font-bold">
                  {formatCurrency(stats.averageSalary)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filterDepartment}
              onValueChange={setFilterDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="on leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="department">Department</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="startDate">Start Date</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredAndSortedEmployees.length} of {employees.length}{" "}
              employees
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Employee Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Job Title</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tenure</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedEmployees.map((employee) => (
                <TableRow
                  key={employee.id}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {employee.personalInfo.firstName.charAt(0)}
                          {employee.personalInfo.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {employee.personalInfo.fullName}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {employee.personalInfo.email}
                        </div>
                        <div className="text-sm text-gray-600">
                          {employee.employeeNumber}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {employee.employment.department}
                      </div>
                      <div className="text-sm text-gray-600">
                        {employee.employment.manager}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.employment.jobTitle}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(employee.employment.salary)}
                    <div className="text-sm text-gray-600">Annual</div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={getStatusColor(employee.employment.status)}
                    >
                      {employee.employment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{getTenure(employee.employment.startDate)}</div>
                      <div className="text-gray-600">
                        Since{" "}
                        {new Date(
                          employee.employment.startDate,
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedEmployee(employee)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Employee Details Dialog */}
      <Dialog
        open={!!selectedEmployee}
        onOpenChange={() => setSelectedEmployee(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="text-lg">
                  {selectedEmployee?.personalInfo.firstName.charAt(0)}
                  {selectedEmployee?.personalInfo.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-xl font-bold">
                  {selectedEmployee?.personalInfo.fullName}
                </div>
                <div className="text-sm text-gray-600">
                  {selectedEmployee?.employeeNumber} •{" "}
                  {selectedEmployee?.employment.jobTitle}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedEmployee && (
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="employment">Employment</TabsTrigger>
                <TabsTrigger value="salary">Salary</TabsTrigger>
                <TabsTrigger value="banking">Banking</TabsTrigger>
                <TabsTrigger value="leave">Leave</TabsTrigger>
                <TabsTrigger value="benefits">Benefits</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <p className="text-sm font-medium">
                        {selectedEmployee.personalInfo.fullName}
                      </p>
                    </div>
                    <div>
                      <Label>Age</Label>
                      <p className="text-sm font-medium">
                        {calculateAge(
                          selectedEmployee.personalInfo.dateOfBirth,
                        )}{" "}
                        years
                      </p>
                    </div>
                    <div>
                      <Label>Date of Birth</Label>
                      <p className="text-sm font-medium">
                        {selectedEmployee.personalInfo.dateOfBirth
                          ? new Date(
                              selectedEmployee.personalInfo.dateOfBirth,
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label>National ID</Label>
                      <p className="text-sm font-medium">
                        {selectedEmployee.personalInfo.nationalId || "N/A"}
                      </p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {selectedEmployee.personalInfo.email}
                      </p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {selectedEmployee.personalInfo.phone}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <Label>Address</Label>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {selectedEmployee.personalInfo.address}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Emergency Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Name</Label>
                      <p className="text-sm font-medium">
                        {selectedEmployee.personalInfo.emergencyContact.name}
                      </p>
                    </div>
                    <div>
                      <Label>Relationship</Label>
                      <p className="text-sm font-medium">
                        {
                          selectedEmployee.personalInfo.emergencyContact
                            .relationship
                        }
                      </p>
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {selectedEmployee.personalInfo.emergencyContact.phone}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="employment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Employment Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Department</Label>
                      <p className="text-sm font-medium">
                        {selectedEmployee.employment.department}
                      </p>
                    </div>
                    <div>
                      <Label>Job Title</Label>
                      <p className="text-sm font-medium">
                        {selectedEmployee.employment.jobTitle}
                      </p>
                    </div>
                    <div>
                      <Label>Manager</Label>
                      <p className="text-sm font-medium">
                        {selectedEmployee.employment.manager}
                      </p>
                    </div>
                    <div>
                      <Label>Employment Status</Label>
                      <Badge
                        className={getStatusColor(
                          selectedEmployee.employment.status,
                        )}
                      >
                        {selectedEmployee.employment.status}
                      </Badge>
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(
                          selectedEmployee.employment.startDate,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label>Tenure</Label>
                      <p className="text-sm font-medium">
                        {getTenure(selectedEmployee.employment.startDate)}
                      </p>
                    </div>
                    <div>
                      <Label>Contract Type</Label>
                      <p className="text-sm font-medium">
                        {selectedEmployee.employment.contractType}
                      </p>
                    </div>
                    <div>
                      <Label>Work Schedule</Label>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {selectedEmployee.employment.workSchedule}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Performance Rating</Label>
                      <p
                        className={`text-lg font-bold ${getPerformanceColor(selectedEmployee.performance.rating)}`}
                      >
                        {selectedEmployee.performance.rating.toFixed(1)}/5.0
                      </p>
                    </div>
                    <div>
                      <Label>Last Review</Label>
                      <p className="text-sm font-medium">
                        {new Date(
                          selectedEmployee.performance.lastReview,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <Label>Next Review</Label>
                      <p className="text-sm font-medium">
                        {new Date(
                          selectedEmployee.performance.nextReview,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="salary" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Salary Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Annual Salary</Label>
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(selectedEmployee.employment.salary)}
                      </p>
                    </div>
                    <div>
                      <Label>Monthly Salary</Label>
                      <p className="text-lg font-medium">
                        {formatCurrency(
                          selectedEmployee.employment.salary / 12,
                        )}
                      </p>
                    </div>
                    <div>
                      <Label>Payroll Number</Label>
                      <p className="text-sm font-medium">
                        {selectedEmployee.employment.payrollNumber}
                      </p>
                    </div>
                    <div>
                      <Label>Tax Bracket</Label>
                      <p className="text-sm font-medium">
                        {selectedEmployee.taxInfo.taxBracket}
                      </p>
                    </div>
                    <div>
                      <Label>Tax Number</Label>
                      <p className="text-sm font-medium">
                        {selectedEmployee.taxInfo.taxNumber}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="banking" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Banking Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Bank Name</Label>
                      <p className="text-sm font-medium">
                        {selectedEmployee.bankDetails.bankName}
                      </p>
                    </div>
                    <div>
                      <Label>Account Type</Label>
                      <p className="text-sm font-medium">
                        {selectedEmployee.bankDetails.accountType}
                      </p>
                    </div>
                    <div>
                      <Label>Account Number</Label>
                      <p className="text-sm font-medium font-mono">
                        {selectedEmployee.bankDetails.accountNumber}
                      </p>
                    </div>
                    <div>
                      <Label>Branch Code</Label>
                      <p className="text-sm font-medium font-mono">
                        {selectedEmployee.bankDetails.branchCode}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="leave" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Leave Balances
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <Label>Annual Leave</Label>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedEmployee.leave.annualBalance}
                      </p>
                      <p className="text-sm text-gray-600">days remaining</p>
                    </div>
                    <div className="text-center">
                      <Label>Sick Leave</Label>
                      <p className="text-2xl font-bold text-orange-600">
                        {selectedEmployee.leave.sickBalance}
                      </p>
                      <p className="text-sm text-gray-600">days remaining</p>
                    </div>
                    <div className="text-center">
                      <Label>Family Leave</Label>
                      <p className="text-2xl font-bold text-purple-600">
                        {selectedEmployee.leave.familyBalance}
                      </p>
                      <p className="text-sm text-gray-600">days remaining</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Leave Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Total Allocation</Label>
                      <p className="text-lg font-medium">
                        {selectedEmployee.leave.total} days
                      </p>
                    </div>
                    <div>
                      <Label>Used This Year</Label>
                      <p className="text-lg font-medium text-red-600">
                        {selectedEmployee.leave.used} days
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="benefits" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Employee Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label>Medical Aid</Label>
                      <Badge
                        className={
                          selectedEmployee.benefits.medicalAid
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {selectedEmployee.benefits.medicalAid
                          ? "Enrolled"
                          : "Not Enrolled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Pension Fund</Label>
                      <Badge
                        className={
                          selectedEmployee.benefits.pensionFund
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {selectedEmployee.benefits.pensionFund
                          ? "Enrolled"
                          : "Not Enrolled"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Life Insurance</Label>
                      <Badge
                        className={
                          selectedEmployee.benefits.lifeInsurance
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {selectedEmployee.benefits.lifeInsurance
                          ? "Covered"
                          : "Not Covered"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Disability Insurance</Label>
                      <Badge
                        className={
                          selectedEmployee.benefits.disabilityInsurance
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      >
                        {selectedEmployee.benefits.disabilityInsurance
                          ? "Covered"
                          : "Not Covered"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {selectedEmployee.taxInfo.medicalAidNumber && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Medical Aid Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <Label>Medical Aid Number</Label>
                        <p className="text-sm font-medium font-mono">
                          {selectedEmployee.taxInfo.medicalAidNumber}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {selectedEmployee.taxInfo.pensionFundNumber && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Pension Fund Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <Label>Pension Fund Number</Label>
                        <p className="text-sm font-medium font-mono">
                          {selectedEmployee.taxInfo.pensionFundNumber}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
