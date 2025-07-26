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
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  ClipboardList,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin,
  DollarSign,
  Package,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Timer,
  Eye,
  Edit,
  Plus,
  Filter,
  Search,
  Download,
  RefreshCw,
  Award,
  Target,
  Activity,
  Gauge,
  Map,
  Navigation,
  Zap,
  ThumbsUp,
  ThumbsDown,
  FileText,
  Camera,
  Smartphone,
  Wifi,
  Star,
  TrendingUpDown,
  MessageSquare
} from "lucide-react";

interface Ticket {
  id: string;
  title: string;
  technician: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  resolvedAt?: string;
  estimatedTime: number;
  actualTime?: number;
}

interface Technician {
  id: string;
  name: string;
  skill: 'needs_training' | 'slow' | 'good' | 'expert';
  productivityScore: number;
  location: { lat: number; lng: number };
  currentJob?: string;
  clockInTime?: string;
  status: 'clocked_in' | 'clocked_out' | 'on_job' | 'absent' | 'late';
  totalTickets: number;
  avgResolutionTime: number;
  stockValue: number;
  overtimeClaims: number;
}

interface ClockInRecord {
  id: string;
  technicianName: string;
  scheduledTime: string;
  actualTime: string;
  status: 'on_time' | 'late' | 'absent';
  date: string;
}

interface OvertimeClaim {
  id: string;
  technician: string;
  hours: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'investigating';
  jobReference?: string;
  images?: string[];
  dateSubmitted: string;
}

interface StockUsage {
  technicianId: string;
  technicianName: string;
  stockCollected: number;
  stockInInventory: number;
  stockUsed: number;
  stockValue: number;
  workOrderType: 'nwi' | 'change_control' | 'work_order';
}

export default function EnhancedManagerDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [clockInRecords, setClockInRecords] = useState<ClockInRecord[]>([]);
  const [overtimeClaims, setOvertimeClaims] = useState<OvertimeClaim[]>([]);
  const [stockUsage, setStockUsage] = useState<StockUsage[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    loadTicketData();
    loadTechnicianData();
    loadClockInData();
    loadOvertimeData();
    loadStockUsageData();
  }, [selectedPeriod, selectedDate]);

  const loadTicketData = async () => {
    // Mock ticket data
    const mockTickets: Ticket[] = [
      {
        id: '1',
        title: 'Fiber Installation - 123 Oak Street',
        technician: 'Sipho Masinga',
        priority: 'high',
        status: 'in_progress',
        createdAt: '2025-01-25 08:00:00',
        estimatedTime: 180,
        actualTime: 120
      },
      {
        id: '2',
        title: 'Network Fault - Business Park',
        technician: 'Thabo Sithole',
        priority: 'critical',
        status: 'open',
        createdAt: '2025-01-25 09:30:00',
        estimatedTime: 120
      },
      {
        id: '3',
        title: 'Maintenance Check - Residential Complex',
        technician: 'Naledi Modise',
        priority: 'medium',
        status: 'resolved',
        createdAt: '2025-01-24 14:00:00',
        resolvedAt: '2025-01-24 16:30:00',
        estimatedTime: 90,
        actualTime: 150
      }
    ];
    setTickets(mockTickets);
  };

  const loadTechnicianData = async () => {
    // Mock technician data
    const mockTechnicians: Technician[] = [
      {
        id: '1',
        name: 'Sipho Masinga',
        skill: 'expert',
        productivityScore: 1.2,
        location: { lat: -25.7461, lng: 28.1881 },
        currentJob: 'Fiber Installation - 123 Oak Street',
        clockInTime: '07:45:00',
        status: 'on_job',
        totalTickets: 45,
        avgResolutionTime: 135,
        stockValue: 2500,
        overtimeClaims: 2
      },
      {
        id: '2',
        name: 'Thabo Sithole',
        skill: 'good',
        productivityScore: 0.9,
        location: { lat: -25.7545, lng: 28.1912 },
        currentJob: 'Network Fault - Business Park',
        clockInTime: '08:15:00',
        status: 'late',
        totalTickets: 32,
        avgResolutionTime: 165,
        stockValue: 1800,
        overtimeClaims: 1
      },
      {
        id: '3',
        name: 'Naledi Modise',
        skill: 'slow',
        productivityScore: 0.7,
        location: { lat: -25.7489, lng: 28.1956 },
        clockInTime: '08:00:00',
        status: 'clocked_in',
        totalTickets: 28,
        avgResolutionTime: 180,
        stockValue: 1200,
        overtimeClaims: 3
      },
      {
        id: '4',
        name: 'Brenda Khumalo',
        skill: 'needs_training',
        productivityScore: 0.4,
        location: { lat: -25.7523, lng: 28.1834 },
        status: 'absent',
        totalTickets: 15,
        avgResolutionTime: 220,
        stockValue: 800,
        overtimeClaims: 0
      }
    ];
    setTechnicians(mockTechnicians);
  };

  const loadClockInData = async () => {
    // Mock clock-in data
    const mockClockIn: ClockInRecord[] = [
      {
        id: '1',
        technicianName: 'Sipho Masinga',
        scheduledTime: '08:00:00',
        actualTime: '07:45:00',
        status: 'on_time',
        date: selectedDate
      },
      {
        id: '2',
        technicianName: 'Thabo Sithole',
        scheduledTime: '08:00:00',
        actualTime: '08:15:00',
        status: 'late',
        date: selectedDate
      },
      {
        id: '3',
        technicianName: 'Naledi Modise',
        scheduledTime: '08:00:00',
        actualTime: '08:00:00',
        status: 'on_time',
        date: selectedDate
      },
      {
        id: '4',
        technicianName: 'Brenda Khumalo',
        scheduledTime: '08:00:00',
        actualTime: '',
        status: 'absent',
        date: selectedDate
      }
    ];
    setClockInRecords(mockClockIn);
  };

  const loadOvertimeData = async () => {
    // Mock overtime claims
    const mockOvertime: OvertimeClaim[] = [
      {
        id: '1',
        technician: 'Sipho Masinga',
        hours: 4,
        reason: 'Complex fiber installation required additional time',
        status: 'pending',
        jobReference: 'JOB-2025-001',
        images: ['before.jpg', 'after.jpg'],
        dateSubmitted: '2025-01-24'
      },
      {
        id: '2',
        technician: 'Naledi Modise',
        hours: 2.5,
        reason: 'Emergency network repair',
        status: 'approved',
        jobReference: 'JOB-2025-002',
        dateSubmitted: '2025-01-23'
      }
    ];
    setOvertimeClaims(mockOvertime);
  };

  const loadStockUsageData = async () => {
    // Mock stock usage data
    const mockStockUsage: StockUsage[] = [
      {
        technicianId: '1',
        technicianName: 'Sipho Masinga',
        stockCollected: 150,
        stockInInventory: 25,
        stockUsed: 125,
        stockValue: 2500,
        workOrderType: 'nwi'
      },
      {
        technicianId: '2',
        technicianName: 'Thabo Sithole',
        stockCollected: 100,
        stockInInventory: 20,
        stockUsed: 80,
        stockValue: 1800,
        workOrderType: 'change_control'
      },
      {
        technicianId: '3',
        technicianName: 'Naledi Modise',
        stockCollected: 75,
        stockInInventory: 15,
        stockUsed: 60,
        stockValue: 1200,
        workOrderType: 'work_order'
      }
    ];
    setStockUsage(mockStockUsage);
  };

  const handleOvertimeClaim = (claimId: string, action: 'approve' | 'reject' | 'investigate') => {
    setOvertimeClaims(prev => prev.map(claim => 
      claim.id === claimId 
        ? { ...claim, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'investigating' }
        : claim
    ));

    toast({
      title: "Overtime Claim Updated",
      description: `Claim has been ${action}d successfully`,
    });
  };

  const getSkillBadge = (skill: string) => {
    switch (skill) {
      case 'expert':
        return <Badge className="bg-green-500">Expert</Badge>;
      case 'good':
        return <Badge className="bg-blue-500">Good</Badge>;
      case 'slow':
        return <Badge className="bg-yellow-500">Slow</Badge>;
      case 'needs_training':
        return <Badge className="bg-red-500">Needs Training</Badge>;
      default:
        return <Badge variant="outline">{skill}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_time':
        return <Badge className="bg-green-500">On Time</Badge>;
      case 'late':
        return <Badge className="bg-yellow-500">Late</Badge>;
      case 'absent':
        return <Badge className="bg-red-500">Absent</Badge>;
      case 'clocked_in':
        return <Badge className="bg-blue-500">Clocked In</Badge>;
      case 'on_job':
        return <Badge className="bg-purple-500">On Job</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const ticketStats = {
    opened: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    overdue: tickets.filter(t => !t.resolvedAt && new Date(t.createdAt) < new Date(Date.now() - 24*60*60*1000)).length,
    avgResolutionTime: tickets.filter(t => t.actualTime).reduce((acc, t) => acc + (t.actualTime || 0), 0) / tickets.filter(t => t.actualTime).length || 0
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-500" />
              Manager Dashboard
            </h1>
            <p className="text-gray-600">
              Comprehensive team and operation management
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            <Input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40"
            />
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-red-600">{ticketStats.opened}</p>
              </div>
              <ClipboardList className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">{ticketStats.inProgress}</p>
              </div>
              <Timer className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-green-600">{ticketStats.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-orange-600">{ticketStats.overdue}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Resolution</p>
                <p className="text-2xl font-bold text-purple-600">{Math.round(ticketStats.avgResolutionTime)}m</p>
              </div>
              <Gauge className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="kpi" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="kpi">KPI Dashboard</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="overtime">Overtime</TabsTrigger>
          <TabsTrigger value="stock">Stock Usage</TabsTrigger>
        </TabsList>

        {/* KPI Dashboard Tab */}
        <TabsContent value="kpi" className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">KPI DASHBOARD</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Top Row - Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">8</div>
                  <div className="text-sm text-gray-600">Open Cases</div>
                  <div className="text-xs text-gray-500 mt-1">↗ +12% from last week</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">4</div>
                  <div className="text-sm text-gray-600">Late Appointments</div>
                  <div className="text-xs text-gray-500 mt-1">↘ -8% from yesterday</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">1</div>
                  <div className="text-sm text-gray-600">Installation Maintenance</div>
                  <div className="text-xs text-gray-500 mt-1">On schedule</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">7</div>
                  <div className="text-sm text-gray-600">Follow Ups</div>
                  <div className="text-xs text-gray-500 mt-1">↗ +3 today</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Row - Charts and Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Open Cases Chart */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Open Cases</span>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gradient-to-t from-blue-100 to-blue-50 rounded flex flex-col justify-end p-4">
                  <div className="bg-blue-500 h-24 rounded mb-2"></div>
                  <div className="bg-blue-400 h-16 rounded mb-2"></div>
                  <div className="bg-blue-300 h-8 rounded"></div>
                  <div className="text-xs text-center mt-2 text-gray-600">215 - Wo EG Ex</div>
                </div>
                <div className="text-xs text-gray-500 mt-2">Case Status: 3.5 Open - Assigned to Monde...</div>
              </CardContent>
            </Card>

            {/* Cases by Age */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Cases by Age</span>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <div className="w-full h-full rounded-full border-8 border-blue-200"></div>
                    <div className="absolute inset-0 w-full h-full rounded-full border-8 border-blue-500 transform rotate-45"
                         style={{clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%)'}}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-blue-600">7</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-center text-gray-500">Case Age: &lt;30d: ■ 47%</div>
                <div className="text-xs text-center text-gray-500 mt-1">Record Count: 8</div>
              </CardContent>
            </Card>

            {/* NPS Dashboard */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">NPS DASHBOARD</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">8</div>
                    <div className="text-xs text-gray-600">Open Cases</div>
                  </div>
                  <div className="border-t pt-2">
                    <div className="text-center">
                      <div className="text-xl font-bold text-green-600">4</div>
                      <div className="text-xs text-gray-600">0446</div>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-4">
                  View Report (PUB-C Core) | As of 26 Jul 2024, 17:42
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row - Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* NTI EG Durations */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>NTI EG Durations</span>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <div className="w-full h-full rounded-full border-8 border-gray-200"></div>
                    <div className="absolute inset-0 w-full h-full rounded-full border-8 border-blue-500 transform"
                         style={{clipPath: 'polygon(50% 50%, 50% 0%, 85% 15%)'}}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">13.9</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-center text-gray-500">Average New FTTH Case: 215 - Wo EG Ex</div>
              </CardContent>
            </Card>

            {/* ROC Duration by Call */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>ROC Duration by Call</span>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <div className="w-full h-full rounded-full border-8 border-gray-200"></div>
                    <div className="absolute inset-0 w-full h-full rounded-full border-8 border-blue-500 transform"
                         style={{clipPath: 'polygon(50% 50%, 50% 0%, 70% 25%)'}}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">16</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-center text-gray-500">Designated: 215 - ■</div>
                <div className="text-xs text-center text-gray-500">Average ROC Duration</div>
              </CardContent>
            </Card>

            {/* Unnecessary Truck */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Unnecessary Truck Roll</span>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <div className="w-full h-full rounded-full border-8 border-gray-200"></div>
                    <div className="absolute inset-0 w-full h-full rounded-full border-8 border-blue-500 transform"
                         style={{clipPath: 'polygon(50% 50%, 50% 0%, 60% 20%)'}}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">9</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-center text-gray-500">Designated: 215 - ■</div>
                <div className="text-xs text-center text-gray-500">Record Count</div>
              </CardContent>
            </Card>

            {/* Follow ups by Call */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Follow ups by Call</span>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-center justify-center">
                  <div className="relative w-24 h-24">
                    <div className="w-full h-full rounded-full border-8 border-gray-200"></div>
                    <div className="absolute inset-0 w-full h-full rounded-full border-8 border-blue-500 transform"
                         style={{clipPath: 'polygon(50% 50%, 50% 0%, 75% 30%)'}}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold">14</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-center text-gray-500">Designated: 215 - ■</div>
                <div className="text-xs text-center text-gray-500">Record Count</div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Performance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">SLA Compliance:</span>
                    <span className="text-sm font-bold text-green-600">94.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Customer Satisfaction:</span>
                    <span className="text-sm font-bold text-blue-600">8.7/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">First Call Resolution:</span>
                    <span className="text-sm font-bold text-purple-600">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average Response Time:</span>
                    <span className="text-sm font-bold text-orange-600">2.3 hrs</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Operational Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Technicians:</span>
                    <span className="text-sm font-bold text-green-600">{technicians.filter(t => t.status !== 'absent').length}/4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Jobs Completed Today:</span>
                    <span className="text-sm font-bold text-blue-600">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Pending Assignments:</span>
                    <span className="text-sm font-bold text-yellow-600">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Equipment Utilization:</span>
                    <span className="text-sm font-bold text-purple-600">87%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Ticket Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Ticket Trends ({selectedPeriod})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-gray-500">Ticket Trends Chart</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Resolution Times
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Average Resolution:</span>
                    <span className="font-bold">{Math.round(ticketStats.avgResolutionTime)} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fastest Resolution:</span>
                    <span className="font-bold text-green-600">45 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Slowest Resolution:</span>
                    <span className="font-bold text-red-600">240 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SLA Compliance:</span>
                    <span className="font-bold text-blue-600">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Est. Time</TableHead>
                    <TableHead>Actual Time</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.title}</TableCell>
                      <TableCell>{ticket.technician}</TableCell>
                      <TableCell>{getStatusBadge(ticket.priority)}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell>{ticket.estimatedTime}m</TableCell>
                      <TableCell>{ticket.actualTime ? `${ticket.actualTime}m` : '-'}</TableCell>
                      <TableCell>{new Date(ticket.createdAt).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technician Productivity Tab */}
        <TabsContent value="productivity" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Technician Productivity & Skills</h3>
            <Button onClick={() => setActiveModal('addJobTemplate')}>
              <Plus className="h-4 w-4 mr-2" />
              Add Job Template
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Productivity Leaderboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rank</TableHead>
                    <TableHead>Technician</TableHead>
                    <TableHead>Skill Level</TableHead>
                    <TableHead>Productivity Score</TableHead>
                    <TableHead>Total Tickets</TableHead>
                    <TableHead>Avg Resolution</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {technicians
                    .sort((a, b) => b.productivityScore - a.productivityScore)
                    .map((tech, index) => (
                    <TableRow key={tech.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {index === 0 && <Award className="h-4 w-4 text-yellow-500" />}
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{tech.name}</TableCell>
                      <TableCell>{getSkillBadge(tech.skill)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={tech.productivityScore * 100} className="w-16" />
                          <span className="font-bold">{tech.productivityScore.toFixed(2)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{tech.totalTickets}</TableCell>
                      <TableCell>{tech.avgResolutionTime}m</TableCell>
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Live Tracking Tab */}
        <TabsContent value="tracking" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Map className="h-5 w-5" />
                    Live Technician Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 bg-gray-100 rounded flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-500">Live GPS Tracking Map</p>
                      <p className="text-sm text-gray-400">Real-time technician locations</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Active Technicians</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {technicians.filter(t => t.status !== 'absent').map((tech) => (
                      <div key={tech.id} className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                           onClick={() => {
                             setSelectedTechnician(tech);
                             setActiveModal('technicianDetails');
                           }}>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{tech.name}</div>
                            <div className="text-sm text-gray-500">{tech.currentJob || 'No active job'}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              tech.status === 'on_job' ? 'bg-green-500' : 
                              tech.status === 'clocked_in' ? 'bg-blue-500' : 'bg-gray-300'
                            }`}></div>
                            <Navigation className="h-4 w-4 text-blue-500" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Clock-In Overview - {selectedDate}
                </CardTitle>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="supervisor">Supervisor</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Scheduled Time</TableHead>
                    <TableHead>Actual Clock-In</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Late By</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clockInRecords.map((record) => {
                    const scheduledTime = new Date(`${record.date} ${record.scheduledTime}`);
                    const actualTime = record.actualTime ? new Date(`${record.date} ${record.actualTime}`) : null;
                    const lateMinutes = actualTime && actualTime > scheduledTime 
                      ? Math.round((actualTime.getTime() - scheduledTime.getTime()) / (1000 * 60))
                      : 0;

                    return (
                      <TableRow key={record.id} className={record.status === 'absent' ? 'bg-red-50' : record.status === 'late' ? 'bg-yellow-50' : ''}>
                        <TableCell className="font-medium">{record.technicianName}</TableCell>
                        <TableCell>{record.scheduledTime}</TableCell>
                        <TableCell>{record.actualTime || '-'}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          {record.status === 'late' ? `${lateMinutes} min` : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost"><Eye className="h-3 w-3" /></Button>
                            <Button size="sm" variant="ghost"><MessageSquare className="h-3 w-3" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Overtime Tab */}
        <TabsContent value="overtime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5" />
                Overtime Claims Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {overtimeClaims.map((claim) => (
                  <Card key={claim.id} className="border">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{claim.technician}</h4>
                            <p className="text-sm text-gray-500">{claim.hours} hours claimed</p>
                          </div>
                          {getStatusBadge(claim.status)}
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium">Reason:</p>
                          <p className="text-sm text-gray-600">{claim.reason}</p>
                        </div>
                        
                        {claim.jobReference && (
                          <div>
                            <p className="text-sm font-medium">Job Reference:</p>
                            <p className="text-sm text-blue-600">{claim.jobReference}</p>
                          </div>
                        )}
                        
                        {claim.images && claim.images.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Camera className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{claim.images.length} attachments</span>
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500">
                          Submitted: {claim.dateSubmitted}
                        </div>
                        
                        {claim.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleOvertimeClaim(claim.id, 'approve')} className="flex-1">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleOvertimeClaim(claim.id, 'investigate')} className="flex-1">
                              <Eye className="h-3 w-3 mr-1" />
                              Investigate
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleOvertimeClaim(claim.id, 'reject')} className="flex-1">
                              <ThumbsDown className="h-3 w-3 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Usage Tab */}
        <TabsContent value="stock" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Stock Usage & Cost Analytics</h3>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Work Orders</SelectItem>
                  <SelectItem value="nwi">NWI</SelectItem>
                  <SelectItem value="change_control">Change Control</SelectItem>
                  <SelectItem value="work_order">Work Orders</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Technician</TableHead>
                    <TableHead>Stock Collected</TableHead>
                    <TableHead>Stock in Inventory</TableHead>
                    <TableHead>Stock Used</TableHead>
                    <TableHead>Stock Value</TableHead>
                    <TableHead>Work Order Type</TableHead>
                    <TableHead>Efficiency</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockUsage
                    .sort((a, b) => b.stockValue - a.stockValue)
                    .map((usage) => {
                      const efficiency = (usage.stockUsed / usage.stockCollected * 100);
                      return (
                        <TableRow key={usage.technicianId}>
                          <TableCell className="font-medium">{usage.technicianName}</TableCell>
                          <TableCell>{usage.stockCollected}</TableCell>
                          <TableCell>{usage.stockInInventory}</TableCell>
                          <TableCell>{usage.stockUsed}</TableCell>
                          <TableCell className="font-bold">R{usage.stockValue.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={
                              usage.workOrderType === 'nwi' ? 'default' :
                              usage.workOrderType === 'change_control' ? 'secondary' : 'outline'
                            }>
                              {usage.workOrderType.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={efficiency} className="w-16" />
                              <span className={`text-sm font-medium ${
                                efficiency > 80 ? 'text-green-600' : efficiency > 60 ? 'text-yellow-600' : 'text-red-600'
                              }`}>
                                {efficiency.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Technician Details Modal */}
      <Dialog open={activeModal === 'technicianDetails'} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Technician Details - {selectedTechnician?.name}</DialogTitle>
          </DialogHeader>
          {selectedTechnician && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Current Status</Label>
                  <div>{getStatusBadge(selectedTechnician.status)}</div>
                </div>
                <div>
                  <Label>Skill Level</Label>
                  <div>{getSkillBadge(selectedTechnician.skill)}</div>
                </div>
                <div>
                  <Label>Productivity Score</Label>
                  <div className="text-2xl font-bold">{selectedTechnician.productivityScore.toFixed(2)}</div>
                </div>
                <div>
                  <Label>Clock-In Time</Label>
                  <div>{selectedTechnician.clockInTime || 'Not clocked in'}</div>
                </div>
              </div>
              
              {selectedTechnician.currentJob && (
                <div>
                  <Label>Current Job</Label>
                  <div className="p-3 bg-gray-50 rounded">{selectedTechnician.currentJob}</div>
                </div>
              )}
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedTechnician.totalTickets}</div>
                  <div className="text-sm text-gray-500">Total Tickets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedTechnician.avgResolutionTime}m</div>
                  <div className="text-sm text-gray-500">Avg Resolution</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">R{selectedTechnician.stockValue.toLocaleString()}</div>
                  <div className="text-sm text-gray-500">Stock Value</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
