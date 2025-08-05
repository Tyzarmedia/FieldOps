import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Users,
  UserPlus,
  Calendar,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Eye,
  Edit,
  Download,
  TrendingUp,
  UserX,
  Building,
  Phone,
  Mail,
  MapPin,
  Shield,
  DollarSign,
  Search,
  ChevronDown,
  ChevronUp,
  Upload,
  X,
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
    emergencyContact: {
      name: string;
      relationship: string;
      phone: string;
    };
  };
  employment: {
    role: string;
    department: string;
    branch: string;
    startDate: string;
    contractType: string;
    status: string;
    manager: string;
    salary: number;
    lastReview: string;
    nextReview: string;
  };
  leave: {
    balance: number;
    used: number;
    total: number;
  };
  performance: {
    rating: number;
    efficiency: number;
    jobsCompleted: number;
    customerSatisfaction: number;
  };
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploadDate: string;
    url: string;
  }>;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employee: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  submittedDate: string;
  approver: string;
  approvedDate?: string;
  documents: Array<{
    name: string;
    url: string;
  }>;
}

interface SystemAlert {
  id: string;
  type: string;
  message: string;
  severity: string;
  date: string;
  department: string;
  status: string;
}

export default function EnhancedHRDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [expandedEmployees, setExpandedEmployees] = useState<Set<string>>(
    new Set(),
  );
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [isLeaveDetailsOpen, setIsLeaveDetailsOpen] = useState(false);

  // New employee form state
  const [newEmployee, setNewEmployee] = useState({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
    },
    employment: {
      role: "",
      department: "",
      branch: "",
      contractType: "",
      manager: "",
      salary: "",
    },
  });

  // Load data from JSON database
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch("/data/database.json");
        const data = await response.json();
        setEmployees(data.employees);
        setLeaveRequests(data.leaveRequests);
        setSystemAlerts(data.systemAlerts);
        setFilteredEmployees(data.employees);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  // Search and filter employees
  useEffect(() => {
    let filtered = employees;

    if (searchTerm) {
      filtered = filtered.filter(
        (emp) =>
          emp.personalInfo.fullName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          emp.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.personalInfo.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          emp.employment.department
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          emp.employment.role
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          emp.employment.branch
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedDepartment !== "All") {
      filtered = filtered.filter(
        (emp) => emp.employment.department === selectedDepartment,
      );
    }

    setFilteredEmployees(filtered);
  }, [searchTerm, selectedDepartment, employees]);

  const toggleEmployeeExpanded = (employeeId: string) => {
    const newExpanded = new Set(expandedEmployees);
    if (newExpanded.has(employeeId)) {
      newExpanded.delete(employeeId);
    } else {
      newExpanded.add(employeeId);
    }
    setExpandedEmployees(newExpanded);
  };

  const handleAddEmployee = () => {
    const newEmp: Employee = {
      id: `E${String(employees.length + 1).padStart(3, "0")}`,
      employeeNumber: `FO-${String(employees.length + 1).padStart(3, "0")}`,
      personalInfo: {
        ...newEmployee.personalInfo,
        fullName: `${newEmployee.personalInfo.firstName} ${newEmployee.personalInfo.lastName}`,
      },
      employment: {
        ...newEmployee.employment,
        salary: parseInt(newEmployee.employment.salary) || 0,
        startDate: new Date().toISOString().split("T")[0],
        status: "active",
        lastReview: "",
        nextReview: "",
      },
      leave: {
        balance: 25,
        used: 0,
        total: 25,
      },
      performance: {
        rating: 0,
        efficiency: 0,
        jobsCompleted: 0,
        customerSatisfaction: 0,
      },
      documents: [],
    };

    setEmployees([...employees, newEmp]);
    setIsAddEmployeeOpen(false);
    setNewEmployee({
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        emergencyContact: { name: "", relationship: "", phone: "" },
      },
      employment: {
        role: "",
        department: "",
        branch: "",
        contractType: "",
        manager: "",
        salary: "",
      },
    });
  };

  const handleLeaveAction = (leaveId: string, action: "approve" | "reject") => {
    setLeaveRequests((prevRequests) =>
      prevRequests.map((request) =>
        request.id === leaveId
          ? {
              ...request,
              status: action === "approve" ? "approved" : "rejected",
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : request,
      ),
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
      case "completed":
        return "bg-success text-success-foreground";
      case "on-leave":
      case "pending":
        return "bg-warning text-warning-foreground";
      case "inactive":
      case "rejected":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const getContractColor = (type: string) => {
    switch (type) {
      case "permanent":
        return "bg-success text-success-foreground";
      case "contract":
        return "bg-info text-info-foreground";
      case "temporary":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  const hrStats = {
    totalEmployees: employees.length,
    activeEmployees: employees.filter((e) => e.employment.status === "active")
      .length,
    newHires: employees.filter((e) => {
      const startDate = new Date(e.employment.startDate);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return startDate > oneMonthAgo;
    }).length,
    onLeave: employees.filter((e) => e.employment.status === "on-leave").length,
    pendingLeaveRequests: leaveRequests.filter((r) => r.status === "pending")
      .length,
    disciplinaryActions: 2,
    onboardingInProgress: 2,
    contractRenewals: 5,
  };

  return (
    <div className="space-y-6">
      {/* HR Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hrStats.totalEmployees}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <CheckCircle className="h-3 w-3 text-success" />
              <span>{hrStats.activeEmployees} active</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Leave Requests
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hrStats.pendingLeaveRequests}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 text-warning" />
              <span>Pending approval</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Hires</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hrStats.newHires}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-success" />
              <span>This month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {systemAlerts.filter((a) => a.status === "active").length}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3 text-destructive" />
              <span>Require attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>System Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemAlerts
              .filter((alert) => alert.status === "active")
              .map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        alert.severity === "high"
                          ? "bg-destructive"
                          : alert.severity === "medium"
                            ? "bg-warning"
                            : alert.severity === "low"
                              ? "bg-info"
                              : "bg-muted"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium">{alert.message}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {alert.department}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {alert.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="leave">Leave Requests</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="disciplinary">Disciplinary</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Employee Database</h3>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Departments</SelectItem>
                  <SelectItem value="Field Operations">
                    Field Operations
                  </SelectItem>
                  <SelectItem value="Fleet Management">
                    Fleet Management
                  </SelectItem>
                  <SelectItem value="Customer Service">
                    Customer Service
                  </SelectItem>
                  <SelectItem value="Network Operations">
                    Network Operations
                  </SelectItem>
                </SelectContent>
              </Select>
              <Dialog
                open={isAddEmployeeOpen}
                onOpenChange={setIsAddEmployeeOpen}
              >
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Employee
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Employee</DialogTitle>
                    <DialogDescription>
                      Enter the employee's personal and employment information.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={newEmployee.personalInfo.firstName}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                firstName: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={newEmployee.personalInfo.lastName}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                lastName: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newEmployee.personalInfo.email}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            personalInfo: {
                              ...newEmployee.personalInfo,
                              email: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={newEmployee.personalInfo.phone}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                phone: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={newEmployee.personalInfo.dateOfBirth}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              personalInfo: {
                                ...newEmployee.personalInfo,
                                dateOfBirth: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={newEmployee.personalInfo.address}
                        onChange={(e) =>
                          setNewEmployee({
                            ...newEmployee,
                            personalInfo: {
                              ...newEmployee.personalInfo,
                              address: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={newEmployee.employment.role}
                          onValueChange={(value) =>
                            setNewEmployee({
                              ...newEmployee,
                              employment: {
                                ...newEmployee.employment,
                                role: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Senior Technician">
                              Senior Technician
                            </SelectItem>
                            <SelectItem value="Network Technician">
                              Network Technician
                            </SelectItem>
                            <SelectItem value="Fleet Coordinator">
                              Fleet Coordinator
                            </SelectItem>
                            <SelectItem value="Customer Service Rep">
                              Customer Service Rep
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Select
                          value={newEmployee.employment.department}
                          onValueChange={(value) =>
                            setNewEmployee({
                              ...newEmployee,
                              employment: {
                                ...newEmployee.employment,
                                department: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Field Operations">
                              Field Operations
                            </SelectItem>
                            <SelectItem value="Fleet Management">
                              Fleet Management
                            </SelectItem>
                            <SelectItem value="Customer Service">
                              Customer Service
                            </SelectItem>
                            <SelectItem value="Network Operations">
                              Network Operations
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="salary">Salary</Label>
                        <Input
                          id="salary"
                          type="number"
                          value={newEmployee.employment.salary}
                          onChange={(e) =>
                            setNewEmployee({
                              ...newEmployee,
                              employment: {
                                ...newEmployee.employment,
                                salary: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="contractType">Contract Type</Label>
                        <Select
                          value={newEmployee.employment.contractType}
                          onValueChange={(value) =>
                            setNewEmployee({
                              ...newEmployee,
                              employment: {
                                ...newEmployee.employment,
                                contractType: value,
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select contract type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="permanent">Permanent</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="temporary">Temporary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddEmployeeOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddEmployee}>Add Employee</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="space-y-2">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="overflow-hidden">
                <Collapsible>
                  <CollapsibleTrigger
                    className="w-full"
                    onClick={() => toggleEmployeeExpanded(employee.id)}
                  >
                    <CardContent className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {employee.employeeNumber}
                            </Badge>
                            <Badge
                              className={getStatusColor(
                                employee.employment.status,
                              )}
                            >
                              {employee.employment.status}
                            </Badge>
                            <Badge
                              className={getContractColor(
                                employee.employment.contractType,
                              )}
                            >
                              {employee.employment.contractType}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="font-semibold text-left">
                              {employee.personalInfo.fullName}
                            </h4>
                            <p className="text-sm text-muted-foreground text-left">
                              {employee.employment.role} •{" "}
                              {employee.employment.department}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">
                            ${employee.employment.salary.toLocaleString()}
                          </span>
                          {expandedEmployees.has(employee.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0 px-4 pb-4 bg-muted/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                            {employee.personalInfo.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                            {employee.personalInfo.phone}
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-2 text-muted-foreground" />
                            {employee.personalInfo.address}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                            Started: {employee.employment.startDate}
                          </div>
                          <div className="flex items-center text-sm">
                            <Building className="h-3 w-3 mr-2 text-muted-foreground" />
                            {employee.employment.branch}
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-3 w-3 mr-2 text-muted-foreground" />
                            Leave: {employee.leave.balance} days remaining
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setIsProfileOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedEmployee(employee);
                            setIsEditOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Details
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <FileText className="h-4 w-4 mr-2" />
                          Documents
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Calendar className="h-4 w-4 mr-2" />
                          Leave History
                        </Button>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leave" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Leave Requests</h3>
            <Button size="sm">
              <CheckCircle className="h-4 w-4 mr-2" />
              Bulk Approve
            </Button>
          </div>

          <div className="space-y-4">
            {leaveRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{request.id}</Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        <Badge variant="outline">{request.type}</Badge>
                      </div>
                      <h4 className="font-semibold">{request.employee}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {request.reason}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">From:</span>{" "}
                          {request.startDate}
                        </div>
                        <div>
                          <span className="font-medium">To:</span>{" "}
                          {request.endDate}
                        </div>
                        <div>
                          <span className="font-medium">Days:</span>{" "}
                          {request.days}
                        </div>
                        <div>
                          <span className="font-medium">Submitted:</span>{" "}
                          {request.submittedDate}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {request.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            handleLeaveAction(request.id, "approve")
                          }
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-destructive"
                          onClick={() =>
                            handleLeaveAction(request.id, "reject")
                          }
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedLeave(request);
                        setIsLeaveDetailsOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Onboarding Progress</h3>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              New Hire Checklist
            </Button>
          </div>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Onboarding functionality will be implemented next.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="disciplinary" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Disciplinary Actions</h3>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              New Action
            </Button>
          </div>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Disciplinary functionality will be implemented next.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>HR Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="h-4 w-4 mr-2" />
                  Employee Directory
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Leave Summary Report
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Turnover Analysis
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Disciplinary Summary
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  Attendance Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New Employee
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Employee Data
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Building className="h-4 w-4 mr-2" />
                  Department Analysis
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Compliance Check
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Salary Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Employee Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Employee Profile</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Name:</strong>{" "}
                      {selectedEmployee.personalInfo.fullName}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {selectedEmployee.personalInfo.email}
                    </p>
                    <p>
                      <strong>Phone:</strong>{" "}
                      {selectedEmployee.personalInfo.phone}
                    </p>
                    <p>
                      <strong>Address:</strong>{" "}
                      {selectedEmployee.personalInfo.address}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong>{" "}
                      {selectedEmployee.personalInfo.dateOfBirth}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Employment Details</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Role:</strong> {selectedEmployee.employment.role}
                    </p>
                    <p>
                      <strong>Department:</strong>{" "}
                      {selectedEmployee.employment.department}
                    </p>
                    <p>
                      <strong>Branch:</strong>{" "}
                      {selectedEmployee.employment.branch}
                    </p>
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {selectedEmployee.employment.startDate}
                    </p>
                    <p>
                      <strong>Contract:</strong>{" "}
                      {selectedEmployee.employment.contractType}
                    </p>
                    <p>
                      <strong>Salary:</strong> $
                      {selectedEmployee.employment.salary.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Performance Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-primary">
                      {selectedEmployee.performance.rating}
                    </p>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-success">
                      {selectedEmployee.performance.efficiency}%
                    </p>
                    <p className="text-xs text-muted-foreground">Efficiency</p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-info">
                      {selectedEmployee.performance.jobsCompleted}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Jobs Completed
                    </p>
                  </div>
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-2xl font-bold text-warning">
                      {selectedEmployee.performance.customerSatisfaction}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Customer Rating
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Leave Details Dialog */}
      <Dialog open={isLeaveDetailsOpen} onOpenChange={setIsLeaveDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
          </DialogHeader>
          {selectedLeave && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Employee</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedLeave.employee}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Leave Type</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedLeave.type}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedLeave.startDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">End Date</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedLeave.endDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Days Requested</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedLeave.days}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={getStatusColor(selectedLeave.status)}>
                    {selectedLeave.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Reason</p>
                <p className="text-sm text-muted-foreground">
                  {selectedLeave.reason}
                </p>
              </div>
              {selectedLeave.documents.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Documents</p>
                  {selectedLeave.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="text-sm">{doc.name}</span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
