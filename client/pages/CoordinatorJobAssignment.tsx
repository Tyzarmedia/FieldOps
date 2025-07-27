import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  X,
  Search,
  Filter,
  MapPin,
  Clock,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Users,
  Briefcase,
  BarChart3,
  Map,
  FileText,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  client: string;
  location: string;
  urgency: "low" | "medium" | "high" | "urgent";
  estimatedTime: number; // hours
  jobType: string;
  description: string;
  latitude: number;
  longitude: number;
  status: "unassigned" | "assigned" | "in-progress" | "completed";
  createdDate: string;
  scheduledDate?: string;
  assignedTo?: string;
}

interface Technician {
  id: string;
  name: string;
  department: string;
  skills: string[];
  availability: "available" | "busy" | "offline";
  currentLocation: { lat: number; lng: number };
  workload: number; // hours for today
  maxCapacity: number; // max hours per day
  timeline: TimelineSlot[];
}

interface TimelineSlot {
  id: string;
  startTime: string;
  endTime: string;
  jobId?: string;
  jobTitle?: string;
  type: "available" | "job" | "break" | "travel";
  color: string;
}

export default function CoordinatorJobAssignment() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [unassignedJobs, setUnassignedJobs] = useState<Job[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedTechnician, setSelectedTechnician] =
    useState<Technician | null>(null);
  const [draggedJob, setDraggedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState({
    location: "all",
    jobType: "all",
    urgency: "all",
    skills: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentView, setCurrentView] = useState<
    "assignment" | "monitor" | "reports"
  >("assignment");
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  // Mock data
  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: "job-001",
        title: "FTTH Installation - Residential",
        client: "Henderson Family",
        location: "Summerstrand, PE",
        urgency: "medium",
        estimatedTime: 4,
        jobType: "Installation",
        description: "New fiber installation for residential customer",
        latitude: -33.9681,
        longitude: 25.6447,
        status: "unassigned",
        createdDate: new Date().toISOString(),
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "job-002",
        title: "Emergency Fiber Repair",
        client: "Business Connect Ltd",
        location: "Industrial Road, PE",
        urgency: "urgent",
        estimatedTime: 6,
        jobType: "Emergency Repair",
        description: "Urgent fiber cut affecting 200+ customers",
        latitude: -33.9608,
        longitude: 25.6022,
        status: "unassigned",
        createdDate: new Date().toISOString(),
      },
      {
        id: "job-003",
        title: "Network Maintenance",
        client: "East London Hospital",
        location: "East London Central",
        urgency: "high",
        estimatedTime: 8,
        jobType: "Maintenance",
        description: "Scheduled network maintenance and upgrades",
        latitude: -32.9733,
        longitude: 27.8746,
        status: "unassigned",
        createdDate: new Date().toISOString(),
        scheduledDate: new Date(
          Date.now() + 2 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
    ];

    const mockTechnicians: Technician[] = [
      {
        id: "tech-001",
        name: "John Doe",
        department: "Field Operations",
        skills: ["FTTH", "Fiber Repair", "Installation"],
        availability: "available",
        currentLocation: { lat: -33.9608, lng: 25.6022 },
        workload: 2,
        maxCapacity: 8,
        timeline: [
          {
            id: "slot-001",
            startTime: "08:00",
            endTime: "10:00",
            jobId: "existing-job-1",
            jobTitle: "Morning Installation",
            type: "job",
            color: "bg-blue-500",
          },
          {
            id: "slot-002",
            startTime: "10:00",
            endTime: "18:00",
            type: "available",
            color: "bg-green-200",
          },
        ],
      },
      {
        id: "tech-002",
        name: "Jane Smith",
        department: "Field Operations",
        skills: ["Network Maintenance", "Emergency Repair", "GPON"],
        availability: "available",
        currentLocation: { lat: -32.9733, lng: 27.8746 },
        workload: 4,
        maxCapacity: 8,
        timeline: [
          {
            id: "slot-003",
            startTime: "08:00",
            endTime: "12:00",
            jobId: "existing-job-2",
            jobTitle: "Network Assessment",
            type: "job",
            color: "bg-blue-500",
          },
          {
            id: "slot-004",
            startTime: "12:00",
            endTime: "13:00",
            type: "break",
            color: "bg-gray-300",
          },
          {
            id: "slot-005",
            startTime: "13:00",
            endTime: "18:00",
            type: "available",
            color: "bg-green-200",
          },
        ],
      },
      {
        id: "tech-003",
        name: "Mike Johnson",
        department: "Field Operations",
        skills: ["Installation", "Maintenance", "Splice Work"],
        availability: "busy",
        currentLocation: { lat: -33.0153, lng: 27.9116 },
        workload: 7,
        maxCapacity: 8,
        timeline: [
          {
            id: "slot-006",
            startTime: "08:00",
            endTime: "15:00",
            jobId: "existing-job-3",
            jobTitle: "Complex Installation",
            type: "job",
            color: "bg-blue-500",
          },
          {
            id: "slot-007",
            startTime: "15:00",
            endTime: "16:00",
            type: "available",
            color: "bg-green-200",
          },
          {
            id: "slot-008",
            startTime: "16:00",
            endTime: "18:00",
            type: "travel",
            color: "bg-orange-300",
          },
        ],
      },
    ];

    setUnassignedJobs(mockJobs);
    setTechnicians(mockTechnicians);
  }, []);

  const filteredJobs = unassignedJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters =
      (filters.urgency === "all" || job.urgency === filters.urgency) &&
      (filters.jobType === "all" || job.jobType === filters.jobType) &&
      (filters.location === "all" || job.location.includes(filters.location));

    return matchesSearch && matchesFilters;
  });

  const filteredTechnicians = technicians.filter((tech) => {
    if (filters.skills === "all") return true;
    return tech.skills.includes(filters.skills);
  });

  const getUrgencyColor = (urgency: Job["urgency"]) => {
    switch (urgency) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
    }
  };

  const getAvailabilityColor = (availability: Technician["availability"]) => {
    switch (availability) {
      case "available":
        return "bg-green-100 text-green-800";
      case "busy":
        return "bg-orange-100 text-orange-800";
      case "offline":
        return "bg-red-100 text-red-800";
    }
  };

  const handleDragStart = (job: Job) => {
    setDraggedJob(job);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (technicianId: string, timeSlot?: string) => {
    if (!draggedJob) return;

    const technician = technicians.find((t) => t.id === technicianId);
    if (!technician) return;

    // Check if technician has capacity
    if (
      technician.workload + draggedJob.estimatedTime >
      technician.maxCapacity
    ) {
      toast({
        title: "Assignment Failed",
        description: "Technician doesn't have enough capacity for this job",
        variant: "destructive",
      });
      return;
    }

    // Check if technician has required skills
    const hasRequiredSkills =
      draggedJob.jobType === "Emergency Repair"
        ? technician.skills.includes("Emergency Repair")
        : technician.skills.some(
            (skill) =>
              draggedJob.jobType.includes(skill) ||
              draggedJob.title.includes(skill),
          );

    if (!hasRequiredSkills) {
      toast({
        title: "Skill Mismatch",
        description: "Technician may not have required skills. Proceed anyway?",
        variant: "destructive",
      });
    }

    // Assign job
    setUnassignedJobs((prev) => prev.filter((j) => j.id !== draggedJob.id));
    setTechnicians((prev) =>
      prev.map((tech) =>
        tech.id === technicianId
          ? {
              ...tech,
              workload: tech.workload + draggedJob.estimatedTime,
              timeline: [
                ...tech.timeline.filter(
                  (slot) =>
                    slot.type !== "available" || slot.startTime < "14:00",
                ),
                {
                  id: `slot-${Date.now()}`,
                  startTime: timeSlot || "14:00",
                  endTime: `${parseInt(timeSlot || "14:00") + draggedJob.estimatedTime}:00`,
                  jobId: draggedJob.id,
                  jobTitle: draggedJob.title,
                  type: "job",
                  color: "bg-blue-500",
                },
                ...tech.timeline.filter(
                  (slot) =>
                    slot.type === "available" &&
                    slot.startTime >=
                      `${parseInt(timeSlot || "14:00") + draggedJob.estimatedTime}:00`,
                ),
              ],
            }
          : tech,
      ),
    );

    toast({
      title: "Job Assigned",
      description: `${draggedJob.title} assigned to ${technician.name}`,
    });

    setDraggedJob(null);
  };

  const assignJobManually = () => {
    if (!selectedJob || !selectedTechnician) return;

    handleDrop(selectedTechnician.id);
    setShowAssignDialog(false);
    setSelectedJob(null);
    setSelectedTechnician(null);
  };

  const calculateDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ) => {
    // Simplified distance calculation for demo
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const JobCard = ({ job }: { job: Job }) => (
    <Card
      className="cursor-move hover:shadow-lg transition-shadow mb-3"
      draggable
      onDragStart={() => handleDragStart(job)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-sm">{job.title}</h4>
          <Badge className={getUrgencyColor(job.urgency)}>{job.urgency}</Badge>
        </div>
        <p className="text-xs text-gray-600 mb-2">{job.client}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <MapPin className="h-3 w-3" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="h-3 w-3" />
          <span>{job.estimatedTime}h</span>
          <Badge variant="outline" className="text-xs">
            {job.jobType}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  const TechnicianCard = ({ technician }: { technician: Technician }) => (
    <Card
      className="mb-4"
      onDragOver={handleDragOver}
      onDrop={() => handleDrop(technician.id)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h4 className="font-semibold">{technician.name}</h4>
            <p className="text-xs text-gray-600">{technician.department}</p>
          </div>
          <Badge className={getAvailabilityColor(technician.availability)}>
            {technician.availability}
          </Badge>
        </div>

        {/* Workload Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Workload</span>
            <span>
              {technician.workload}/{technician.maxCapacity}h
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                technician.workload / technician.maxCapacity > 0.8
                  ? "bg-red-500"
                  : technician.workload / technician.maxCapacity > 0.6
                    ? "bg-orange-500"
                    : "bg-green-500"
              }`}
              style={{
                width: `${(technician.workload / technician.maxCapacity) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Skills */}
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1">Skills:</p>
          <div className="flex flex-wrap gap-1">
            {technician.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <p className="text-xs text-gray-600 mb-2">Today's Schedule:</p>
          <div className="space-y-1">
            {technician.timeline.map((slot) => (
              <div
                key={slot.id}
                className={`text-xs p-2 rounded ${slot.color} ${
                  slot.type === "available"
                    ? "border-2 border-dashed border-green-400"
                    : ""
                }`}
                onDragOver={handleDragOver}
                onDrop={() =>
                  slot.type === "available" &&
                  handleDrop(technician.id, slot.startTime)
                }
              >
                {slot.startTime} - {slot.endTime}
                {slot.jobTitle && (
                  <div className="font-medium">{slot.jobTitle}</div>
                )}
                {slot.type === "available" && (
                  <div className="text-green-700">Available</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Job Assignment Center</h1>
            <p className="text-sm opacity-90">Assign jobs to technicians</p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setCurrentView("monitor")}
            >
              <BarChart3 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setCurrentView("reports")}
            >
              <FileText className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-full h-10 w-10"
              onClick={() => navigate("/")}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{unassignedJobs.length}</div>
            <div className="text-xs opacity-90">Unassigned</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {technicians.filter((t) => t.availability === "available").length}
            </div>
            <div className="text-xs opacity-90">Available</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {unassignedJobs.filter((j) => j.urgency === "urgent").length}
            </div>
            <div className="text-xs opacity-90">Urgent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {Math.round(
                (technicians.reduce(
                  (sum, t) => sum + t.workload / t.maxCapacity,
                  0,
                ) /
                  technicians.length) *
                  100,
              )}
              %
            </div>
            <div className="text-xs opacity-90">Avg Load</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white border-b">
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs or technicians..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAssignDialog(true)}
            disabled={!selectedJob}
          >
            Manual Assign
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Select
            value={filters.location}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, location: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="PE">Port Elizabeth</SelectItem>
              <SelectItem value="East London">East London</SelectItem>
              <SelectItem value="Summerstrand">Summerstrand</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.jobType}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, jobType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Job Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Installation">Installation</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Emergency Repair">Emergency Repair</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.urgency}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, urgency: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Urgencies</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.skills}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, skills: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Skills" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              <SelectItem value="FTTH">FTTH</SelectItem>
              <SelectItem value="Emergency Repair">Emergency Repair</SelectItem>
              <SelectItem value="Installation">Installation</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dual Pane Layout */}
      <div className="flex h-[calc(100vh-200px)]">
        {/* Left Panel - Unassigned Jobs */}
        <div className="w-1/3 p-4 border-r bg-white overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              Unassigned Jobs ({filteredJobs.length})
            </h3>
            <Briefcase className="h-5 w-5 text-gray-400" />
          </div>

          <div className="space-y-3">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                onClick={() => setSelectedJob(job)}
                className={
                  selectedJob?.id === job.id
                    ? "ring-2 ring-blue-500 rounded"
                    : ""
                }
              >
                <JobCard job={job} />
              </div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h4 className="font-medium text-gray-900 mb-2">
                All jobs assigned!
              </h4>
              <p className="text-gray-500 text-sm">
                No unassigned jobs matching your filters
              </p>
            </div>
          )}
        </div>

        {/* Right Panel - Technicians */}
        <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">
              Technicians ({filteredTechnicians.length})
            </h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredTechnicians.map((technician) => (
              <div
                key={technician.id}
                onClick={() => setSelectedTechnician(technician)}
                className={
                  selectedTechnician?.id === technician.id
                    ? "ring-2 ring-blue-500 rounded"
                    : ""
                }
              >
                <TechnicianCard technician={technician} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Manual Assignment Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Job Assignment</DialogTitle>
          </DialogHeader>

          {selectedJob && selectedTechnician && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Selected Job</Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{selectedJob.title}</p>
                    <p className="text-sm text-gray-600">
                      {selectedJob.client}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedJob.estimatedTime}h • {selectedJob.urgency}
                    </p>
                  </div>
                </div>

                <div>
                  <Label>Selected Technician</Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">{selectedTechnician.name}</p>
                    <p className="text-sm text-gray-600">
                      {selectedTechnician.workload}/
                      {selectedTechnician.maxCapacity}h capacity
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedTechnician.availability}
                    </p>
                  </div>
                </div>
              </div>

              {/* Distance calculation */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm">
                  Distance: ~
                  {calculateDistance(
                    selectedJob.latitude,
                    selectedJob.longitude,
                    selectedTechnician.currentLocation.lat,
                    selectedTechnician.currentLocation.lng,
                  ).toFixed(1)}
                  km from current location
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAssignDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={assignJobManually} className="flex-1">
                  Assign Job
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
