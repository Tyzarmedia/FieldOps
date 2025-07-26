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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  Shield,
  Users,
  Settings,
  Activity,
  Database,
  Plug,
  TestTube,
  Bell,
  Lock,
  Code,
  UserPlus,
  UserMinus,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Save,
  X,
  Check,
  AlertTriangle,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  WifiOff,
  Globe,
  Key,
  FileText,
  Calendar,
  Clock,
  MapPin,
  Smartphone,
  Mail,
  MessageSquare,
  Zap,
  Filter,
  Search,
  MoreHorizontal,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Gauge,
  Monitor
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: string[];
  createdAt: string;
}

interface SystemSettings {
  timezone: string;
  language: string;
  theme: string;
  autoOvertimeRules: boolean;
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordExpiry: number;
  backupFrequency: string;
  maintenanceMode: boolean;
}

interface IntegrationStatus {
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  endpoint: string;
  enabled: boolean;
}

interface SystemHealth {
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
  connections: number;
  errors: number;
  responseTime: number;
}

export default function SystemAdministratorDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    timezone: 'Africa/Johannesburg',
    language: 'en',
    theme: 'light',
    autoOvertimeRules: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordExpiry: 90,
    backupFrequency: 'daily',
    maintenanceMode: false
  });
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([
    { name: 'Sage X3', status: 'connected', lastSync: '2025-01-25 10:30:00', endpoint: 'https://sage-server.com:8124', enabled: true },
    { name: 'GPS Tracking', status: 'connected', lastSync: '2025-01-25 10:35:00', endpoint: 'https://gps-api.com/v1', enabled: true },
    { name: 'WhatsApp API', status: 'disconnected', lastSync: '2025-01-24 15:20:00', endpoint: 'https://api.whatsapp.com/v1', enabled: false },
    { name: 'Vuma Portal', status: 'error', lastSync: '2025-01-25 09:15:00', endpoint: 'https://vuma.co.za/api', enabled: true }
  ]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    cpu: 45,
    memory: 68,
    disk: 72,
    uptime: '15 days, 6 hours',
    connections: 247,
    errors: 12,
    responseTime: 156
  });
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    permissions: [] as string[]
  });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
    loadAuditLogs();
    loadSystemHealth();
  }, []);

  const loadUsers = async () => {
    // Mock data - replace with actual API call
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Dyondzani Masinge',
        email: 'dyondzani@tyzarmedia.com',
        role: 'CEO',
        status: 'active',
        lastLogin: '2025-01-25 09:30:00',
        permissions: ['all'],
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'John Mokoena',
        email: 'john@tyzarmedia.com',
        role: 'FleetManager',
        status: 'active',
        lastLogin: '2025-01-25 08:15:00',
        permissions: ['fleet:read', 'fleet:write', 'vehicles:manage'],
        createdAt: '2024-02-01'
      },
      {
        id: '3',
        name: 'Brenda Khumalo',
        email: 'brenda@tyzarmedia.com',
        role: 'StockManager',
        status: 'active',
        lastLogin: '2025-01-24 16:45:00',
        permissions: ['inventory:read', 'inventory:write', 'stock:manage'],
        createdAt: '2024-01-20'
      },
      {
        id: '4',
        name: 'Sipho Masinga',
        email: 'sipho@tyzarmedia.com',
        role: 'Technician',
        status: 'suspended',
        lastLogin: '2025-01-23 14:20:00',
        permissions: ['jobs:read', 'stock:read'],
        createdAt: '2024-03-10'
      }
    ];
    setUsers(mockUsers);
  };

  const loadAuditLogs = async () => {
    // Mock audit log data
    const mockLogs = [
      { id: 1, user: 'Dyondzani Masinge', action: 'Login', resource: 'System', timestamp: '2025-01-25 09:30:00', ip: '192.168.1.100' },
      { id: 2, user: 'Brenda Khumalo', action: 'Create Stock Movement', resource: 'Inventory', timestamp: '2025-01-25 09:15:00', ip: '192.168.1.105' },
      { id: 3, user: 'System', action: 'Automated Sync', resource: 'Sage X3', timestamp: '2025-01-25 09:00:00', ip: 'server' },
      { id: 4, user: 'John Mokoena', action: 'Update Vehicle', resource: 'Fleet', timestamp: '2025-01-25 08:45:00', ip: '192.168.1.102' }
    ];
    setAuditLogs(mockLogs);
  };

  const loadSystemHealth = async () => {
    // Mock system health check
    setSystemHealth({
      cpu: Math.floor(Math.random() * 30) + 40,
      memory: Math.floor(Math.random() * 20) + 60,
      disk: Math.floor(Math.random() * 15) + 70,
      uptime: '15 days, 6 hours',
      connections: Math.floor(Math.random() * 50) + 200,
      errors: Math.floor(Math.random() * 10) + 5,
      responseTime: Math.floor(Math.random() * 50) + 100
    });
  };

  const createUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.role) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active',
      lastLogin: 'Never',
      permissions: newUser.permissions,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, user]);
    setNewUser({ name: '', email: '', role: '', permissions: [] });
    setActiveModal(null);

    toast({
      title: "User Created",
      description: `User ${user.name} has been created successfully`,
    });
  };

  const updateUserStatus = (userId: string, status: 'active' | 'inactive' | 'suspended') => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status } : user
    ));

    toast({
      title: "User Updated",
      description: `User status changed to ${status}`,
    });
  };

  const resetUserPassword = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      toast({
        title: "Password Reset",
        description: `Password reset email sent to ${user.email}`,
      });
    }
  };

  const updateSystemSetting = (key: keyof SystemSettings, value: any) => {
    setSystemSettings(prev => ({ ...prev, [key]: value }));
    
    toast({
      title: "Setting Updated",
      description: `${key} has been updated successfully`,
    });
  };

  const testIntegration = async (integrationName: string) => {
    setLoading(true);
    
    // Simulate API test
    setTimeout(() => {
      setIntegrations(prev => prev.map(int => 
        int.name === integrationName 
          ? { ...int, status: 'connected', lastSync: new Date().toISOString() }
          : int
      ));
      
      setLoading(false);
      toast({
        title: "Integration Test",
        description: `${integrationName} connection test successful`,
      });
    }, 2000);
  };

  const toggleIntegration = (integrationName: string) => {
    setIntegrations(prev => prev.map(int => 
      int.name === integrationName 
        ? { ...int, enabled: !int.enabled }
        : int
    ));
  };

  const exportData = (dataType: string) => {
    toast({
      title: "Export Started",
      description: `${dataType} export has been initiated. You'll receive an email when ready.`,
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspended</Badge>;
      case 'connected':
        return <Badge variant="default" className="bg-green-500">Connected</Badge>;
      case 'disconnected':
        return <Badge variant="secondary">Disconnected</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getHealthColor = (value: number, type: 'cpu' | 'memory' | 'disk') => {
    if (type === 'cpu') return value > 80 ? 'text-red-500' : value > 60 ? 'text-yellow-500' : 'text-green-500';
    if (type === 'memory') return value > 85 ? 'text-red-500' : value > 70 ? 'text-yellow-500' : 'text-green-500';
    if (type === 'disk') return value > 90 ? 'text-red-500' : value > 75 ? 'text-yellow-500' : 'text-green-500';
    return 'text-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-500" />
              System Administrator
            </h1>
            <p className="text-gray-600">
              Complete system management and configuration
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => loadSystemHealth()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Status
            </Button>
            <Button
              onClick={() => setActiveModal('maintenance')}
              variant={systemSettings.maintenanceMode ? "destructive" : "outline"}
            >
              {systemSettings.maintenanceMode ? "Exit Maintenance" : "Maintenance Mode"}
            </Button>
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">CPU Usage</p>
                <p className={`text-2xl font-bold ${getHealthColor(systemHealth.cpu, 'cpu')}`}>
                  {systemHealth.cpu}%
                </p>
              </div>
              <Cpu className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={systemHealth.cpu} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Memory</p>
                <p className={`text-2xl font-bold ${getHealthColor(systemHealth.memory, 'memory')}`}>
                  {systemHealth.memory}%
                </p>
              </div>
              <Server className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={systemHealth.memory} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disk Space</p>
                <p className={`text-2xl font-bold ${getHealthColor(systemHealth.disk, 'disk')}`}>
                  {systemHealth.disk}%
                </p>
              </div>
              <HardDrive className="h-8 w-8 text-purple-500" />
            </div>
            <Progress value={systemHealth.disk} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-orange-600">
                  {systemHealth.connections}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Uptime: {systemHealth.uptime}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="developer">Developer</TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button onClick={() => setActiveModal('createUser')}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedUser(user);
                              setActiveModal('editUser');
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => resetUserPassword(user.id)}
                          >
                            <Key className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active')}
                          >
                            {user.status === 'active' ? <UserMinus className="h-3 w-3" /> : <UserPlus className="h-3 w-3" />}
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

        {/* System Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Global Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Timezone</Label>
                  <Select value={systemSettings.timezone} onValueChange={(value) => updateSystemSetting('timezone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Johannesburg">Africa/Johannesburg</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Language</Label>
                  <Select value={systemSettings.language} onValueChange={(value) => updateSystemSetting('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="af">Afrikaans</SelectItem>
                      <SelectItem value="zu">isiZulu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Theme</Label>
                  <Select value={systemSettings.theme} onValueChange={(value) => updateSystemSetting('theme', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Auto Overtime Rules</Label>
                  <Switch
                    checked={systemSettings.autoOvertimeRules}
                    onCheckedChange={(checked) => updateSystemSetting('autoOvertimeRules', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => updateSystemSetting('sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Max Login Attempts</Label>
                  <Input
                    type="number"
                    value={systemSettings.maxLoginAttempts}
                    onChange={(e) => updateSystemSetting('maxLoginAttempts', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label>Password Expiry (days)</Label>
                  <Input
                    type="number"
                    value={systemSettings.passwordExpiry}
                    onChange={(e) => updateSystemSetting('passwordExpiry', parseInt(e.target.value))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Maintenance Mode</Label>
                  <Switch
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => updateSystemSetting('maintenanceMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Integration Management Tab */}
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plug className="h-5 w-5" />
                Integration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Integration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Enabled</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {integrations.map((integration) => (
                    <TableRow key={integration.name}>
                      <TableCell className="font-medium">{integration.name}</TableCell>
                      <TableCell>{getStatusBadge(integration.status)}</TableCell>
                      <TableCell>{integration.lastSync}</TableCell>
                      <TableCell className="font-mono text-xs">{integration.endpoint}</TableCell>
                      <TableCell>
                        <Switch
                          checked={integration.enabled}
                          onCheckedChange={() => toggleIntegration(integration.name)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => testIntegration(integration.name)}
                            disabled={loading}
                          >
                            <Zap className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-3 w-3" />
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

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  System Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Response Time:</span>
                  <span className="font-mono">{systemHealth.responseTime}ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Error Rate:</span>
                  <span className="font-mono">{systemHealth.errors} errors</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Connections:</span>
                  <span className="font-mono">{systemHealth.connections}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Uptime:</span>
                  <span className="font-mono">{systemHealth.uptime}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Audit Logs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="flex justify-between items-center text-sm py-2 border-b">
                      <div>
                        <div className="font-medium">{log.action}</div>
                        <div className="text-gray-500">{log.user} • {log.resource}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-500">{log.timestamp}</div>
                        <div className="text-xs text-gray-400">{log.ip}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Management Tab */}
        <TabsContent value="data" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  Export Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button onClick={() => exportData('Users')} className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Users
                </Button>
                <Button onClick={() => exportData('Jobs')} className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Jobs
                </Button>
                <Button onClick={() => exportData('Inventory')} className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Inventory
                </Button>
                <Button onClick={() => exportData('Audit Logs')} className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export Audit Logs
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Backup & Restore
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Save className="h-4 w-4 mr-2" />
                  Create Backup
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Restore from Backup
                </Button>
                <div>
                  <Label>Backup Frequency</Label>
                  <Select value={systemSettings.backupFrequency} onValueChange={(value) => updateSystemSetting('backupFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Other tabs would be implemented similarly... */}
        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <TestTube className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Module Access Control</h3>
                <p className="text-gray-600">Configure module access and permissions for different roles.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Security & Compliance</h3>
                <p className="text-gray-600">Manage security policies and compliance settings.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="developer" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Code className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Developer Tools</h3>
                <p className="text-gray-600">Access debugging tools and developer utilities.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create User Modal */}
      <Dialog open={activeModal === 'createUser'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Add a new user to the system</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CEO">CEO</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Coordinator">Coordinator</SelectItem>
                  <SelectItem value="Technician">Technician</SelectItem>
                  <SelectItem value="FleetManager">Fleet Manager</SelectItem>
                  <SelectItem value="StockManager">Stock Manager</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Payroll">Payroll</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={createUser}>
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
