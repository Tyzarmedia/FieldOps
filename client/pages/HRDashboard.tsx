import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
} from "lucide-react";

export default function HRDashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const hrStats = {
    totalEmployees: 87,
    activeEmployees: 82,
    newHires: 3,
    onLeave: 8,
    pendingLeaveRequests: 12,
    disciplinaryActions: 2,
    onboardingInProgress: 2,
    contractRenewals: 5,
  };

  const employees = [
    {
      id: "E001",
      name: "John Smith",
      role: "Senior Technician",
      department: "Field Operations",
      email: "john.smith@fiberco.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      contractType: "permanent",
      startDate: "2021-03-15",
      leaveBalance: 18,
      lastReview: "2023-12-01",
      salary: 65000,
    },
    {
      id: "E002",
      name: "Sarah Johnson",
      role: "Fleet Coordinator",
      department: "Fleet Management",
      email: "sarah.johnson@fiberco.com",
      phone: "+1 (555) 234-5678",
      status: "on-leave",
      contractType: "permanent",
      startDate: "2020-08-22",
      leaveBalance: 12,
      lastReview: "2024-01-05",
      salary: 58000,
    },
    {
      id: "E003",
      name: "Mike Chen",
      role: "Network Technician",
      department: "Field Operations",
      email: "mike.chen@fiberco.com",
      phone: "+1 (555) 345-6789",
      status: "active",
      contractType: "contract",
      startDate: "2023-05-10",
      leaveBalance: 8,
      lastReview: "2023-11-15",
      salary: 48000,
    },
  ];

  const leaveRequests = [
    {
      id: "LR001",
      employee: "Emma Wilson",
      type: "Annual Leave",
      startDate: "2024-02-15",
      endDate: "2024-02-19",
      days: 5,
      reason: "Family vacation",
      status: "pending",
      submittedDate: "2024-01-20",
      approver: "Manager",
    },
    {
      id: "LR002",
      employee: "David Brown",
      type: "Sick Leave",
      startDate: "2024-01-22",
      endDate: "2024-01-24",
      days: 3,
      reason: "Medical appointment and recovery",
      status: "approved",
      submittedDate: "2024-01-21",
      approver: "HR Manager",
    },
    {
      id: "LR003",
      employee: "Lisa Garcia",
      type: "Maternity Leave",
      startDate: "2024-03-01",
      endDate: "2024-05-30",
      days: 90,
      reason: "Maternity leave",
      status: "pending",
      submittedDate: "2024-01-18",
      approver: "HR Manager",
    },
  ];

  const disciplinaryActions = [
    {
      id: "DA001",
      employee: "Robert Taylor",
      type: "Verbal Warning",
      issue: "Repeated tardiness",
      date: "2024-01-15",
      description: "Employee has been consistently 15-20 minutes late",
      action: "Formal verbal warning issued",
      followUp: "2024-02-15",
      status: "active",
    },
    {
      id: "DA002",
      employee: "Jennifer Adams",
      type: "Written Warning",
      issue: "Safety protocol violation",
      date: "2024-01-10",
      description: "Failed to follow proper PPE requirements on site",
      action: "Written warning and mandatory safety training",
      followUp: "2024-02-10",
      status: "resolved",
    },
  ];

  const onboardingTasks = [
    {
      employee: "Alex Kim",
      position: "Junior Technician",
      startDate: "2024-01-22",
      progress: 75,
      tasksCompleted: 6,
      totalTasks: 8,
      nextTask: "Equipment assignment",
    },
    {
      employee: "Maria Rodriguez",
      position: "Customer Service Rep",
      startDate: "2024-01-25",
      progress: 45,
      tasksCompleted: 4,
      totalTasks: 9,
      nextTask: "System access setup",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "on-leave":
        return "bg-warning text-warning-foreground";
      case "inactive":
        return "bg-muted text-muted-foreground";
      case "pending":
        return "bg-info text-info-foreground";
      case "approved":
        return "bg-success text-success-foreground";
      case "rejected":
        return "bg-destructive text-destructive-foreground";
      case "resolved":
        return "bg-success text-success-foreground";
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
            <CardTitle className="text-sm font-medium">Onboarding</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hrStats.onboardingInProgress}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 text-info" />
              <span>In progress</span>
            </div>
          </CardContent>
        </Card>
      </div>

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
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
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
                          className={getContractColor(employee.contractType)}
                        >
                          {employee.contractType}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">
                        {employee.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {employee.role} • {employee.department}
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {employee.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {employee.phone}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Started: {employee.startDate}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          Leave: {employee.leaveBalance} days
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Salary</p>
                      <p className="font-semibold">
                        ${employee.salary.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
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

                  {request.status === "pending" && (
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
                        <UserX className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  )}

                  {request.status !== "pending" && (
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

        <TabsContent value="onboarding" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Onboarding Progress</h3>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              New Hire Checklist
            </Button>
          </div>

          <div className="space-y-4">
            {onboardingTasks.map((task, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold">{task.employee}</h4>
                      <p className="text-sm text-muted-foreground">
                        {task.position} • Started: {task.startDate}
                      </p>
                      <p className="text-sm text-info-foreground mt-2">
                        <strong>Next Task:</strong> {task.nextTask}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <p className="text-2xl font-bold">{task.progress}%</p>
                      <p className="text-xs text-muted-foreground">
                        {task.tasksCompleted}/{task.totalTasks} completed
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <Progress value={task.progress} className="h-3" />
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-2" />
                      View Checklist
                    </Button>
                    <Button size="sm" className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Update Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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

          <div className="space-y-4">
            {disciplinaryActions.map((action) => (
              <Card key={action.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline">{action.id}</Badge>
                        <Badge className={getStatusColor(action.status)}>
                          {action.status}
                        </Badge>
                        <Badge
                          className={
                            action.type === "Verbal Warning"
                              ? "bg-warning text-warning-foreground"
                              : "bg-destructive text-destructive-foreground"
                          }
                        >
                          {action.type}
                        </Badge>
                      </div>
                      <h4 className="font-semibold">{action.employee}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        <strong>Issue:</strong> {action.issue}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        {action.description}
                      </p>
                      <p className="text-sm text-info-foreground">
                        <strong>Action Taken:</strong> {action.action}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Date</p>
                      <p className="font-medium">{action.date}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Follow-up: {action.followUp}
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
                      Update Status
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
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
    </div>
  );
}
