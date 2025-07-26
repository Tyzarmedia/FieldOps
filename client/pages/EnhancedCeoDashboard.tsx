import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { mockDB, Department, User } from "@/services/mockDatabase";
import {
  Building,
  Users,
  TrendingUp,
  Activity,
  DollarSign,
  Shield,
  Truck,
  Package,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Timer,
  Eye,
  UserPlus,
  FileText,
  Settings,
  MapPin,
  Clock,
  Zap,
  Search,
  Download,
  Plus,
  Edit,
  X,
  Star,
  Flag,
  MessageSquare,
  Lock,
  Unlock,
  RefreshCw,
  Calendar,
  Filter,
  ExternalLink,
  Wrench,
  Gauge,
  ChevronRight,
  Target,
  TrendingDown,
  Map,
  Wifi,
  WifiOff,
  Archive,
  Send,
  Ban,
  UserCheck,
  PieChart,
  TrendingUpDown
} from "lucide-react";

export default function EnhancedCeoDashboard() {
  const [systemData, setSystemData] = useState<any>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    manager: '',
    budget: 0,
    location: ''
  });

  const { toast } = useToast();

  const systemStats = {
    totalJobs: 1247,
    completedJobs: 1089,
    failedJobs: 23,
    activeJobs: 135,
    pendingJobs: 158,
    reworkJobs: 29,
    escalatedJobs: 16,
    onSiteNow: 24,
    totalTechnicians: 45,
    activeTechnicians: 38,
    departments: 8,
    productivity: 87.3,
    revenue: 245000,
    stockValue: 89500,
    fleetUtilization: 92.4,
    complianceScore: 95.2,
    avgJobTime: "1hr 32min",
    longestJob: "6hrs 10min",
    activeVehicles: 23,
    totalVehicles: 25,
    lowStockItems: 12,
    activeAlerts: 7,
    resolvedToday: 12
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    const depts = mockDB.getDepartments();
    const usersList = mockDB.getUsers();
    setDepartments(depts);
    setUsers(usersList);
  };

  const handleAssignToDepartment = () => {
    if (!selectedUser || !selectedDepartment) {
      toast({
        title: "Error",
        description: "Please select both a user and department",
        variant: "destructive"
      });
      return;
    }

    const success = mockDB.assignUserToDepartment(selectedUser.id, selectedDepartment);
    
    if (success) {
      toast({
        title: "Assignment Successful",
        description: `${selectedUser.name} has been assigned to the selected department`,
      });
      loadDashboardData();
      setActiveModal(null);
      setSelectedUser(null);
      setSelectedDepartment('');
    } else {
      toast({
        title: "Assignment Failed",
        description: "Failed to assign user to department",
        variant: "destructive"
      });
    }
  };

  const handleCreateDepartment = () => {
    if (!newDepartment.name || !newDepartment.manager) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    const department = mockDB.addDepartment({
      ...newDepartment,
      employees: []
    });

    toast({
      title: "Department Created",
      description: `${department.name} has been created successfully`,
    });

    loadDashboardData();
    setActiveModal(null);
    setNewDepartment({
      name: '',
      manager: '',
      budget: 0,
      location: ''
    });
  };

  const getDepartmentStats = () => {
    return departments.map(dept => ({
      ...dept,
      employeeCount: dept.employees.length,
      utilization: (dept.employees.length / 10 * 100) // Mock utilization
    }));
  };

  const dashboardCards = [
    {
      id: "analytics",
      title: "Analytics",
      icon: BarChart3,
      color: "bg-blue-500",
      description: `${systemStats.totalJobs} total jobs, ${systemStats.productivity}% productivity`,
      action: () => setActiveModal("analytics"),
    },
    {
      id: "departments",
      title: "Departments",
      icon: Building,
      color: "bg-green-500",
      description: `${departments.length} departments managed`,
      action: () => setActiveModal("departments"),
    },
    {
      id: "team-management",
      title: "Team Management",
      icon: Users,
      color: "bg-purple-500",
      description: `${users.length} total employees`,
      action: () => setActiveModal("team-management"),
    },
    {
      id: "compliance",
      title: "Compliance",
      icon: Shield,
      color: "bg-orange-500",
      description: `${systemStats.complianceScore}% compliance score`,
      action: () => setActiveModal("compliance"),
    },
    {
      id: "revenue",
      title: "Revenue",
      icon: DollarSign,
      color: "bg-emerald-500",
      description: `$${systemStats.revenue.toLocaleString()} this month`,
      action: () => setActiveModal("revenue"),
    },
    {
      id: "fleet",
      title: "Fleet Management",
      icon: Truck,
      color: "bg-indigo-500",
      description: `${systemStats.fleetUtilization}% fleet utilization`,
      action: () => setActiveModal("fleet"),
    },
    {
      id: "inventory",
      title: "Inventory",
      icon: Package,
      color: "bg-cyan-500",
      description: `$${systemStats.stockValue.toLocaleString()} stock value`,
      action: () => setActiveModal("inventory"),
    },
    {
      id: "system-settings",
      title: "System Settings",
      icon: Settings,
      color: "bg-red-500",
      description: "System configuration and settings",
      action: () => setActiveModal("system-settings"),
    }
  ];

  // Mock analytics data
  const analyticsData = {
    jobTrends: [
      { month: 'Jan', completed: 245, pending: 32 },
      { month: 'Feb', completed: 289, pending: 28 },
      { month: 'Mar', completed: 312, pending: 35 },
      { month: 'Apr', completed: 278, pending: 42 },
      { month: 'May', completed: 334, pending: 29 }
    ],
    departmentPerformance: departments.map(dept => ({
      name: dept.name,
      efficiency: Math.floor(Math.random() * 30) + 70,
      budget: dept.budget,
      utilization: Math.floor(Math.random() * 40) + 60
    })),
    kpis: {
      customerSatisfaction: 94.2,
      employeeEngagement: 87.5,
      operationalEfficiency: 91.8,
      profitMargin: 23.4
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          CEO Dashboard
        </h1>
        <p className="text-gray-600">
          Executive overview and strategic management
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">
                ${systemStats.revenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-blue-600">
                {systemStats.activeJobs}
              </p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Team Size</p>
              <p className="text-2xl font-bold text-purple-600">
                {users.length}
              </p>
            </div>
            <Users className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-orange-600">
                {departments.length}
              </p>
            </div>
            <Building className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
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
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => setActiveModal("assign-department")}
          >
            <Building className="h-4 w-4 mr-2" />
            Assign to Department
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => setActiveModal("analytics")}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => setActiveModal("departments")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Manage Departments
          </Button>
          <Button
            variant="outline"
            className="justify-start"
            onClick={() => setActiveModal("system-settings")}
          >
            <Settings className="h-4 w-4 mr-2" />
            System Settings
          </Button>
        </div>
      </div>

      {/* Modals */}

      {/* Assign to Department Modal */}
      <Dialog open={activeModal === 'assign-department'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Assign Employee to Department</DialogTitle>
            <DialogDescription>
              Select an employee and assign them to a department
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Employee</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Current Department</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} className={selectedUser?.id === user.id ? 'bg-blue-50' : ''}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant={selectedUser?.id === user.id ? 'default' : 'outline'}
                          onClick={() => setSelectedUser(user)}
                        >
                          {selectedUser?.id === user.id ? 'Selected' : 'Select'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {selectedUser && (
              <div>
                <Label>Assign to Department</Label>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name} ({dept.employees.length} employees)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={handleAssignToDepartment} disabled={!selectedUser || !selectedDepartment}>
              Assign to Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Analytics Modal */}
      <Dialog open={activeModal === 'analytics'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Executive Analytics
            </DialogTitle>
            <DialogDescription>
              Comprehensive business performance analytics and insights
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="departments">Departments</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="kpis">KPIs</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">$245K</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600">+12%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Customer Satisfaction</p>
                      <p className="text-2xl font-bold text-blue-600">{analyticsData.kpis.customerSatisfaction}%</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-blue-500" />
                        <span className="text-xs text-blue-600">+2.3%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Employee Engagement</p>
                      <p className="text-2xl font-bold text-purple-600">{analyticsData.kpis.employeeEngagement}%</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-purple-500" />
                        <span className="text-xs text-purple-600">+5.1%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Operational Efficiency</p>
                      <p className="text-2xl font-bold text-orange-600">{analyticsData.kpis.operationalEfficiency}%</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <TrendingUp className="h-3 w-3 text-orange-500" />
                        <span className="text-xs text-orange-600">+1.8%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Business Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-500">Business Performance Chart</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="departments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead>Manager</TableHead>
                        <TableHead>Employees</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Efficiency</TableHead>
                        <TableHead>Utilization</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analyticsData.departmentPerformance.map((dept, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{dept.name}</TableCell>
                          <TableCell>{departments.find(d => d.name === dept.name)?.manager}</TableCell>
                          <TableCell>{departments.find(d => d.name === dept.name)?.employees.length}</TableCell>
                          <TableCell>R{dept.budget.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={dept.efficiency} className="w-16" />
                              <span>{dept.efficiency}%</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={dept.utilization} className="w-16" />
                              <span>{dept.utilization}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Completion Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-500">Job Trends Chart</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-500">Revenue Growth Chart</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="kpis" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(analyticsData.kpis).map(([key, value]) => (
                  <Card key={key}>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <h3 className="font-semibold text-lg mb-2 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          {value}%
                        </div>
                        <Progress value={value} className="w-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Departments Modal */}
      <Dialog open={activeModal === 'departments'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-green-500" />
              Department Management
            </DialogTitle>
            <DialogDescription>
              Manage departments and organizational structure
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Current Departments</h3>
              <Button onClick={() => setActiveModal('create-department')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Department
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium">{dept.name}</TableCell>
                    <TableCell>{dept.manager}</TableCell>
                    <TableCell>{dept.employees.length}</TableCell>
                    <TableCell>R{dept.budget.toLocaleString()}</TableCell>
                    <TableCell>{dept.location}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost"><Edit className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Department Modal */}
      <Dialog open={activeModal === 'create-department'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Department</DialogTitle>
            <DialogDescription>Add a new department to the organization</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Department Name</Label>
              <Input
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                placeholder="Enter department name"
              />
            </div>
            <div>
              <Label>Manager</Label>
              <Input
                value={newDepartment.manager}
                onChange={(e) => setNewDepartment({...newDepartment, manager: e.target.value})}
                placeholder="Enter manager name"
              />
            </div>
            <div>
              <Label>Budget</Label>
              <Input
                type="number"
                value={newDepartment.budget}
                onChange={(e) => setNewDepartment({...newDepartment, budget: parseInt(e.target.value) || 0})}
                placeholder="Enter budget amount"
              />
            </div>
            <div>
              <Label>Location</Label>
              <Input
                value={newDepartment.location}
                onChange={(e) => setNewDepartment({...newDepartment, location: e.target.value})}
                placeholder="Enter location"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDepartment}>
              Create Department
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
