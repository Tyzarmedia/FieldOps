import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import CustomizableKPIDashboard from "@/components/CustomizableKPIDashboard";
import {
  Users,
  ClipboardList,
  BarChart3,
  Calendar,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Timer,
  User,
  Settings,
  Filter,
  Search,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Plus,
  RotateCcw,
  Play,
  Pause,
  Square,
  ChevronRight,
  Kanban,
  Map,
  Timeline,
  FileText,
  TrendingUp,
  Package,
  Zap,
  Target,
  Activity,
  Navigation,
  Phone,
  MessageSquare,
  ArrowRight,
  DragHandleDots2Icon
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  type: 'installation' | 'maintenance' | 'emergency' | 'audit';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'unassigned' | 'assigned' | 'not_started' | 'in_progress' | 'completed' | 'delayed';
  location: string;
  zone: string;
  estimatedDuration: number;
  skillRequired: string;
  createdAt: string;
  dueDate: string;
  assignedTo?: string;
  description: string;
  slaStatus: 'on_track' | 'approaching' | 'breached';
}

interface Technician {
  id: string;
  name: string;
  role: string;
  team: string;
  skills: string[];
  availability: 'available' | 'busy' | 'on_break' | 'off_duty';
  currentLocation: string;
  shiftStart: string;
  shiftEnd: string;
  currentJob?: string;
  timeSlots: Array<{
    time: string;
    status: 'free' | 'busy' | 'break';
    jobId?: string;
  }>;
}

interface TimeSlot {
  hour: number;
  status: 'free' | 'busy' | 'break';
  jobId?: string;
  jobTitle?: string;
}

export default function CoordinatorDashboardEnhanced() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [draggedJob, setDraggedJob] = useState<Job | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [progressView, setProgressView] = useState<'kanban' | 'map' | 'timeline'>('kanban');
  const [filters, setFilters] = useState({
    jobType: 'all',
    zone: 'all',
    priority: 'all',
    technician: 'all',
    dateRange: 'today'
  });

  const { toast } = useToast();

  useEffect(() => {
    loadJobsData();
    loadTechniciansData();
  }, []);

  const loadJobsData = () => {
    const mockJobs: Job[] = [
      {
        id: 'J001',
        title: 'Fiber Installation - Residential',
        type: 'installation',
        priority: 'high',
        status: 'unassigned',
        location: '123 Oak Street, Pretoria',
        zone: 'North Zone',
        estimatedDuration: 180,
        skillRequired: 'Fiber Installation',
        createdAt: '2025-01-25 08:00:00',
        dueDate: '2025-01-25 16:00:00',
        description: 'Install fiber connection for new customer',
        slaStatus: 'on_track'
      },
      {
        id: 'J002',
        title: 'Network Fault Repair',
        type: 'emergency',
        priority: 'critical',
        status: 'assigned',
        location: 'Business Park, Sandton',
        zone: 'Central Zone',
        estimatedDuration: 120,
        skillRequired: 'Network Troubleshooting',
        createdAt: '2025-01-25 09:00:00',
        dueDate: '2025-01-25 11:00:00',
        assignedTo: 'tech-1',
        description: 'Critical network outage affecting multiple customers',
        slaStatus: 'approaching'
      },
      {
        id: 'J003',
        title: 'Routine Maintenance Check',
        type: 'maintenance',
        priority: 'medium',
        status: 'in_progress',
        location: 'Office Complex, Johannesburg',
        zone: 'South Zone',
        estimatedDuration: 90,
        skillRequired: 'Maintenance',
        createdAt: '2025-01-25 07:00:00',
        dueDate: '2025-01-25 12:00:00',
        assignedTo: 'tech-2',
        description: 'Scheduled maintenance and inspection',
        slaStatus: 'on_track'
      },
      {
        id: 'J004',
        title: 'Equipment Upgrade',
        type: 'installation',
        priority: 'medium',
        status: 'unassigned',
        location: '456 Pine Avenue, Cape Town',
        zone: 'West Zone',
        estimatedDuration: 240,
        skillRequired: 'Equipment Installation',
        createdAt: '2025-01-25 10:00:00',
        dueDate: '2025-01-25 18:00:00',
        description: 'Upgrade customer equipment to latest specifications',
        slaStatus: 'on_track'
      },
      {
        id: 'J005',
        title: 'Site Survey',
        type: 'audit',
        priority: 'low',
        status: 'completed',
        location: 'Industrial Area, Durban',
        zone: 'East Zone',
        estimatedDuration: 60,
        skillRequired: 'Site Survey',
        createdAt: '2025-01-24 14:00:00',
        dueDate: '2025-01-24 16:00:00',
        assignedTo: 'tech-3',
        description: 'Pre-installation site survey',
        slaStatus: 'on_track'
      }
    ];
    setJobs(mockJobs);
  };

  const loadTechniciansData = () => {
    const mockTechnicians: Technician[] = [
      {
        id: 'tech-1',
        name: 'Sipho Masinga',
        role: 'Senior Technician',
        team: 'Installation Team Alpha',
        skills: ['Fiber Installation', 'Network Troubleshooting'],
        availability: 'busy',
        currentLocation: 'Business Park, Sandton',
        shiftStart: '08:00',
        shiftEnd: '17:00',
        currentJob: 'J002',
        timeSlots: generateTimeSlots('busy', 'J002')
      },
      {
        id: 'tech-2',
        name: 'Thabo Sithole',
        role: 'Technician',
        team: 'Maintenance Team Beta',
        skills: ['Maintenance', 'Equipment Installation'],
        availability: 'busy',
        currentLocation: 'Office Complex, Johannesburg',
        shiftStart: '08:00',
        shiftEnd: '17:00',
        currentJob: 'J003',
        timeSlots: generateTimeSlots('busy', 'J003')
      },
      {
        id: 'tech-3',
        name: 'Naledi Modise',
        role: 'Junior Technician',
        team: 'Support Team Gamma',
        skills: ['Site Survey', 'Basic Maintenance'],
        availability: 'available',
        currentLocation: 'Base Office',
        shiftStart: '08:00',
        shiftEnd: '17:00',
        timeSlots: generateTimeSlots('available')
      },
      {
        id: 'tech-4',
        name: 'Brenda Khumalo',
        role: 'Apprentice',
        team: 'Installation Team Alpha',
        skills: ['Fiber Installation', 'Equipment Installation'],
        availability: 'available',
        currentLocation: 'Base Office',
        shiftStart: '08:00',
        shiftEnd: '17:00',
        timeSlots: generateTimeSlots('available')
      }
    ];
    setTechnicians(mockTechnicians);
  };

  const generateTimeSlots = (status: 'available' | 'busy', jobId?: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    for (let hour = 8; hour <= 17; hour++) {
      if (status === 'busy' && hour >= 9 && hour <= 12 && jobId) {
        slots.push({ hour, status: 'busy', jobId });
      } else if (hour === 12) {
        slots.push({ hour, status: 'break' });
      } else {
        slots.push({ hour, status: 'free' });
      }
    }
    return slots;
  };

  const handleJobDragStart = (job: Job, e: React.DragEvent) => {
    setDraggedJob(job);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTechnicianDrop = (technicianId: string, timeSlot: number, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedJob) return;

    const technician = technicians.find(t => t.id === technicianId);
    if (!technician) return;

    // Check if technician has required skills
    if (!technician.skills.includes(draggedJob.skillRequired)) {
      toast({
        title: "Skill Mismatch",
        description: `${technician.name} doesn't have the required skill: ${draggedJob.skillRequired}`,
        variant: "destructive"
      });
      return;
    }

    // Check if time slot is available
    const slot = technician.timeSlots.find(s => s.hour === timeSlot);
    if (slot && slot.status !== 'free') {
      toast({
        title: "Time Slot Occupied",
        description: `${technician.name} is not available at ${timeSlot}:00`,
        variant: "destructive"
      });
      return;
    }

    // Assign job
    setJobs(prev => prev.map(j => 
      j.id === draggedJob.id 
        ? { ...j, status: 'assigned', assignedTo: technicianId }
        : j
    ));

    setTechnicians(prev => prev.map(t => 
      t.id === technicianId 
        ? {
            ...t,
            availability: 'busy',
            currentJob: draggedJob.id,
            timeSlots: t.timeSlots.map(slot => 
              slot.hour >= timeSlot && slot.hour < timeSlot + Math.ceil(draggedJob.estimatedDuration / 60)
                ? { ...slot, status: 'busy', jobId: draggedJob.id, jobTitle: draggedJob.title }
                : slot
            )
          }
        : t
    ));

    setDraggedJob(null);
    toast({
      title: "Job Assigned",
      description: `${draggedJob.title} assigned to ${technician.name}`,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const updateJobStatus = (jobId: string, newStatus: Job['status']) => {
    setJobs(prev => prev.map(j => 
      j.id === jobId ? { ...j, status: newStatus } : j
    ));

    toast({
      title: "Job Status Updated",
      description: `Job ${jobId} status changed to ${newStatus}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'unassigned':
        return <Badge className="bg-gray-500">Unassigned</Badge>;
      case 'assigned':
        return <Badge className="bg-blue-500">Assigned</Badge>;
      case 'not_started':
        return <Badge className="bg-yellow-500">Not Started</Badge>;
      case 'in_progress':
        return <Badge className="bg-purple-500">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'delayed':
        return <Badge className="bg-red-500">Delayed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-600 animate-pulse">Critical</Badge>;
      case 'high':
        return <Badge className="bg-red-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-500">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getSLABadge = (slaStatus: string) => {
    switch (slaStatus) {
      case 'on_track':
        return <Badge className="bg-green-500">On Track</Badge>;
      case 'approaching':
        return <Badge className="bg-yellow-500">Approaching</Badge>;
      case 'breached':
        return <Badge className="bg-red-500">Breached</Badge>;
      default:
        return <Badge variant="outline">{slaStatus}</Badge>;
    }
  };

  const unassignedJobs = jobs.filter(j => j.status === 'unassigned');
  const kanbanColumns = {
    not_started: jobs.filter(j => j.status === 'not_started'),
    in_progress: jobs.filter(j => j.status === 'in_progress'),
    completed: jobs.filter(j => j.status === 'completed'),
    delayed: jobs.filter(j => j.status === 'delayed')
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-500" />
              Coordinator Dashboard
            </h1>
            <p className="text-gray-600">
              Assign jobs, monitor progress, and coordinate field operations
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unassigned Jobs</p>
                <p className="text-2xl font-bold text-red-600">{unassignedJobs.length}</p>
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
                <p className="text-2xl font-bold text-blue-600">{kanbanColumns.in_progress.length}</p>
              </div>
              <Timer className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{kanbanColumns.completed.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Delayed</p>
                <p className="text-2xl font-bold text-orange-600">{kanbanColumns.delayed.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Techs</p>
                <p className="text-2xl font-bold text-purple-600">{technicians.filter(t => t.availability === 'busy').length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="assign" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assign">Assign Jobs</TabsTrigger>
          <TabsTrigger value="monitor">Monitor Progress</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="kpi">KPI Dashboard</TabsTrigger>
        </TabsList>

        {/* Assign Jobs Tab */}
        <TabsContent value="assign" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Drag-and-Drop Job Assignment</h3>
            <div className="flex gap-2">
              <Select value={viewMode} onValueChange={(value: 'daily' | 'weekly') => setViewMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily View</SelectItem>
                  <SelectItem value="weekly">Weekly View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Unassigned Jobs Panel */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Unassigned Jobs ({unassignedJobs.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {unassignedJobs.map(job => (
                    <div
                      key={job.id}
                      className="p-3 border rounded-lg cursor-move hover:shadow-md transition-shadow bg-white"
                      draggable
                      onDragStart={(e) => handleJobDragStart(job, e)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {getPriorityBadge(job.priority)}
                          {getSLABadge(job.slaStatus)}
                        </div>
                      </div>
                      <div className="font-medium text-sm">{job.title}</div>
                      <div className="text-xs text-gray-600">{job.location}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Duration: {job.estimatedDuration}m | Skill: {job.skillRequired}
                      </div>
                      <div className="text-xs text-gray-500">
                        Due: {new Date(job.dueDate).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Technician Timeline Panel */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Technician Schedules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Time Header */}
                    <div className="grid grid-cols-12 gap-2 text-xs text-center font-medium">
                      <div className="col-span-2">Technician</div>
                      {Array.from({ length: 10 }, (_, i) => i + 8).map(hour => (
                        <div key={hour}>{hour}:00</div>
                      ))}
                    </div>

                    {/* Technician Rows */}
                    {technicians.map(tech => (
                      <div key={tech.id} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-2">
                          <div className="p-2 bg-gray-50 rounded text-xs">
                            <div className="font-medium">{tech.name}</div>
                            <div className="text-gray-600">{tech.role}</div>
                            <div className="text-gray-500">{tech.team}</div>
                            <div className={`text-xs mt-1 ${
                              tech.availability === 'available' ? 'text-green-600' : 
                              tech.availability === 'busy' ? 'text-blue-600' : 'text-gray-600'
                            }`}>
                              {tech.availability}
                            </div>
                          </div>
                        </div>
                        
                        {/* Time Slots */}
                        {tech.timeSlots.map(slot => (
                          <div
                            key={slot.hour}
                            className={`h-12 rounded border-2 border-dashed transition-colors ${
                              slot.status === 'free' ? 'bg-green-100 border-green-300' :
                              slot.status === 'busy' ? 'bg-blue-100 border-blue-300' :
                              'bg-yellow-100 border-yellow-300'
                            }`}
                            onDrop={(e) => handleTechnicianDrop(tech.id, slot.hour, e)}
                            onDragOver={handleDragOver}
                          >
                            {slot.status === 'busy' && slot.jobTitle && (
                              <div className="text-xs p-1 font-medium text-blue-700 truncate">
                                {slot.jobTitle}
                              </div>
                            )}
                            {slot.status === 'break' && (
                              <div className="text-xs p-1 font-medium text-yellow-700 text-center">
                                Break
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Monitor Progress Tab */}
        <TabsContent value="monitor" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Real-Time Job Monitoring</h3>
            <div className="flex gap-2">
              <Select value={progressView} onValueChange={(value: 'kanban' | 'map' | 'timeline') => setProgressView(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kanban">Kanban Board</SelectItem>
                  <SelectItem value="map">Map View</SelectItem>
                  <SelectItem value="timeline">Timeline View</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {progressView === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Not Started */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Circle className="h-4 w-4 text-gray-500" />
                    Not Started ({kanbanColumns.not_started.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {kanbanColumns.not_started.map(job => (
                    <div key={job.id} className="p-3 bg-gray-50 rounded border">
                      <div className="font-medium text-sm">{job.title}</div>
                      <div className="text-xs text-gray-600">{job.location}</div>
                      <div className="flex gap-1 mt-2">
                        {getPriorityBadge(job.priority)}
                        {getSLABadge(job.slaStatus)}
                      </div>
                      <div className="flex gap-1 mt-2">
                        <Button size="sm" onClick={() => updateJobStatus(job.id, 'in_progress')}>
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* In Progress */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Timer className="h-4 w-4 text-blue-500" />
                    In Progress ({kanbanColumns.in_progress.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {kanbanColumns.in_progress.map(job => (
                    <div key={job.id} className="p-3 bg-blue-50 rounded border border-blue-200">
                      <div className="font-medium text-sm">{job.title}</div>
                      <div className="text-xs text-gray-600">{job.location}</div>
                      <div className="text-xs text-blue-600 mt-1">
                        Assigned to: {technicians.find(t => t.id === job.assignedTo)?.name}
                      </div>
                      <div className="flex gap-1 mt-2">
                        {getPriorityBadge(job.priority)}
                        {getSLABadge(job.slaStatus)}
                      </div>
                      <div className="flex gap-1 mt-2">
                        <Button size="sm" variant="outline" onClick={() => updateJobStatus(job.id, 'completed')}>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateJobStatus(job.id, 'delayed')}>
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Delay
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Completed */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    Completed ({kanbanColumns.completed.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {kanbanColumns.completed.map(job => (
                    <div key={job.id} className="p-3 bg-green-50 rounded border border-green-200">
                      <div className="font-medium text-sm">{job.title}</div>
                      <div className="text-xs text-gray-600">{job.location}</div>
                      <div className="text-xs text-green-600 mt-1">
                        Completed by: {technicians.find(t => t.id === job.assignedTo)?.name}
                      </div>
                      <div className="flex gap-1 mt-2">
                        {getPriorityBadge(job.priority)}
                        {getSLABadge(job.slaStatus)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Delayed */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    Delayed ({kanbanColumns.delayed.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {kanbanColumns.delayed.map(job => (
                    <div key={job.id} className="p-3 bg-red-50 rounded border border-red-200">
                      <div className="font-medium text-sm">{job.title}</div>
                      <div className="text-xs text-gray-600">{job.location}</div>
                      <div className="text-xs text-red-600 mt-1">
                        Assigned to: {technicians.find(t => t.id === job.assignedTo)?.name}
                      </div>
                      <div className="flex gap-1 mt-2">
                        {getPriorityBadge(job.priority)}
                        {getSLABadge(job.slaStatus)}
                      </div>
                      <div className="flex gap-1 mt-2">
                        <Button size="sm" variant="outline">
                          <Phone className="h-3 w-3 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <ArrowRight className="h-3 w-3 mr-1" />
                          Reassign
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {progressView === 'map' && (
            <Card>
              <CardHeader>
                <CardTitle>Live Technician Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 rounded border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                  <Map className="h-16 w-16 text-blue-400 mb-4" />
                  <p className="text-lg font-medium text-gray-600 mb-2">Live Technician Locations</p>
                  <p className="text-sm text-gray-500 text-center max-w-sm">
                    Real-time GPS tracking of field technicians with job status indicators
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {progressView === 'timeline' && (
            <Card>
              <CardHeader>
                <CardTitle>Job Timeline View</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs.filter(j => j.status !== 'unassigned').map(job => (
                    <div key={job.id} className="flex items-center gap-4 p-3 border rounded">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="flex-1">
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-gray-600">{job.location}</div>
                      </div>
                      <div className="text-right">
                        <div>{getStatusBadge(job.status)}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {new Date(job.dueDate).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Coordination Reports</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Job Allocation Report */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Job Allocation Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Jobs:</span>
                    <span className="font-bold">{jobs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Assigned:</span>
                    <span className="font-bold text-blue-600">{jobs.filter(j => j.status !== 'unassigned').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unassigned:</span>
                    <span className="font-bold text-red-600">{unassignedJobs.length}</span>
                  </div>
                  <Progress value={(jobs.filter(j => j.status !== 'unassigned').length / jobs.length) * 100} />
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardContent>
            </Card>

            {/* Technician Load Report */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Technician Daily Load</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {technicians.map(tech => (
                    <div key={tech.id} className="flex justify-between items-center">
                      <span className="text-sm">{tech.name}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={tech.availability === 'busy' ? 80 : 20} className="w-16" />
                        <span className="text-xs">
                          {tech.timeSlots.filter(s => s.status === 'busy').length}/10h
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardContent>
            </Card>

            {/* SLA Report */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">SLA Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>On Track:</span>
                    <span className="font-bold text-green-600">
                      {jobs.filter(j => j.slaStatus === 'on_track').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approaching:</span>
                    <span className="font-bold text-yellow-600">
                      {jobs.filter(j => j.slaStatus === 'approaching').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Breached:</span>
                    <span className="font-bold text-red-600">
                      {jobs.filter(j => j.slaStatus === 'breached').length}
                    </span>
                  </div>
                  <Progress value={(jobs.filter(j => j.slaStatus === 'on_track').length / jobs.length) * 100} />
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardContent>
            </Card>

            {/* Completion Time Report */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Avg Completion Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Installation:</span>
                    <span className="font-bold">165 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maintenance:</span>
                    <span className="font-bold">89 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency:</span>
                    <span className="font-bold">120 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Audit:</span>
                    <span className="font-bold">45 min</span>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </CardContent>
            </Card>

            {/* Reassignment Log */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Reassigned Jobs Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-xs p-2 bg-gray-50 rounded">
                    <div className="font-medium">J001 - Fiber Installation</div>
                    <div className="text-gray-600">From: John → To: Sarah</div>
                    <div className="text-gray-500">2 hours ago</div>
                  </div>
                  <div className="text-xs p-2 bg-gray-50 rounded">
                    <div className="font-medium">J003 - Maintenance</div>
                    <div className="text-gray-600">From: Mike → To: Alex</div>
                    <div className="text-gray-500">5 hours ago</div>
                  </div>
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View Full Log
                </Button>
              </CardContent>
            </Card>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Bulk Export Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Excel Report
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV Data
                </Button>
                <Button className="w-full" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate PDF Report
                </Button>
                <Button className="w-full" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Email Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* KPI Dashboard Tab */}
        <TabsContent value="kpi" className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Manager-Customized KPI Dashboard</h3>
            <p className="text-sm text-gray-600">
              View the KPI dashboard configured by your manager. This dashboard is automatically updated with the latest metrics.
            </p>
          </div>
          <CustomizableKPIDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
