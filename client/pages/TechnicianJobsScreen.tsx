import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  X,
  Menu,
  MoreVertical,
  Calendar,
  Search,
  QrCode,
  RefreshCw,
  Building2,
  Briefcase,
  Phone,
  MapPin,
  Clock,
  User,
  CheckCircle,
  Pause,
  Play,
  Square,
  Edit3,
  Camera,
  FileText,
  Navigation,
  Network,
  Wifi,
  Package,
  PenTool,
  Settings,
  ArrowUpDown,
} from "lucide-react";
import { teamJobs, updateJobStatus, type Job } from "../data/sharedJobs";

export default function TechnicianJobsScreen() {
  const [selectedTab, setSelectedTab] = useState("assigned");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobDetail, setShowJobDetail] = useState(false);
  const [isJobPaused, setIsJobPaused] = useState(false);
  const [sortOrder, setSortOrder] = useState<"new-to-old" | "old-to-new">("new-to-old");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const navigate = useNavigate();

  const tabs = [
    {
      id: "assigned",
      label: "Assigned",
      count: teamJobs.filter((j) => j.status === "assigned").length,
      color: "bg-blue-500",
    },
    {
      id: "accepted",
      label: "Accepted",
      count: teamJobs.filter((j) => j.status === "accepted").length,
      color: "bg-orange-500",
    },
    {
      id: "in-progress",
      label: "In Progress",
      count: teamJobs.filter((j) => j.status === "in-progress").length,
      color: "bg-green-500",
    },
    {
      id: "completed",
      label: "Tech Finished",
      count: teamJobs.filter((j) => j.status === "completed").length,
      color: "bg-purple-500",
    },
  ];

  const filteredJobs = teamJobs
    .filter((job) => {
      const matchesTab =
        job.status === selectedTab ||
        (selectedTab === "completed" && job.status === "completed");
      const matchesSearch =
        searchQuery === "" ||
        job.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdDate);
      const dateB = new Date(b.createdDate);

      if (sortOrder === "new-to-old") {
        return dateB.getTime() - dateA.getTime();
      } else {
        return dateA.getTime() - dateB.getTime();
      }
    });

  const handleJobAction = (job: Job, action: string) => {
    switch (action) {
      case "accept":
        updateJobStatus(job.id, "accepted");
        break;
      case "start":
        updateJobStatus(job.id, "in-progress");
        break;
      case "pause":
        updateJobStatus(job.id, "accepted");
        break;
      case "complete":
        updateJobStatus(job.id, "completed");
        break;
      case "view":
        setSelectedJob(job);
        setShowJobDetail(true);
        break;
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "new-to-old" ? "old-to-new" : "new-to-old");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned":
        return "bg-blue-500";
      case "accepted":
        return "bg-orange-500";
      case "in-progress":
        return "bg-green-500";
      case "completed":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  if (showJobDetail && selectedJob) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Job Detail Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setShowJobDetail(false)}
              >
                <X className="h-6 w-6" />
              </Button>
              <h1 className="text-lg font-semibold">Job Details</h1>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Clock className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Job Status Bar */}
          <div className="flex items-center justify-center mb-4">
            <div className="flex space-x-4">
              <Button
                size="sm"
                className="bg-white/20 text-white hover:bg-white/30"
                onClick={() => setIsJobPaused(!isJobPaused)}
              >
                {isJobPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                )}
              </Button>
              <Button
                size="sm"
                className="bg-white/20 text-white hover:bg-white/30"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop
              </Button>
            </div>
          </div>

          {/* Job Header Info */}
          <div className="text-center">
            <h2 className="text-xl font-bold">{selectedJob.client.name}</h2>
            <p className="text-white/80">#{selectedJob.id}</p>
            <Badge className="bg-green-500 text-white mt-2">
              {selectedJob.status.replace("-", " ").toUpperCase()}
            </Badge>
          </div>

          {/* Date Info */}
          <div className="flex items-center justify-between mt-4">
            <div>
              <p className="text-sm text-white/80">Created On</p>
              <p className="font-medium">{selectedJob.createdDate}</p>
            </div>
            <div>
              <p className="text-sm text-white/80">Status</p>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="font-medium">
                  {selectedJob.status.replace("-", " ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Job Details Content */}
        <div className="p-4 pb-20 space-y-6">
          {/* Client Address with Map */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Client Address</h3>
              <div className="bg-gray-200 h-32 rounded-lg mb-2 flex items-center justify-center sm:mt-0.5">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600">
                {selectedJob.client.address}
              </p>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium">
                      {selectedJob.appointment.startDate}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Monday</Badge>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-medium">
                      {selectedJob.appointment.endDate}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">Monday</Badge>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Scheduled Date</p>
                  <p className="font-medium">
                    {selectedJob.appointment.scheduledDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Facility</p>
                  <p className="font-medium">
                    {selectedJob.appointment.facility}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technician Info */}
          <Card className="mb-4">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Technician</h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold">
                  {getInitials(selectedJob.assignedTo)}
                </div>
                <div>
                  <p className="font-medium">{selectedJob.assignedTo}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">SIR</p>
                  <p className="font-medium">Stefany Sumitha Pillay</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Work Type</p>
                  <p className="font-medium">{selectedJob.workType}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">
                    Service Request/Change Number
                  </p>
                  <p className="font-medium">00766624</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Work Order</p>
                  <p className="font-medium">00770729</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Appointment Number</p>
                  <p className="font-medium">
                    {selectedJob.appointment.number}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Service Member</p>
                  <p className="font-medium">4ES754430096BFAD</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="font-medium">120 - East London</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Building2 className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Service Territory</p>
                  <p className="font-medium">{selectedJob.serviceTerritory}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Network Status */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-4">
                <Network className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-gray-800">Network Status</h3>
              </div>

              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-600">Network Identifier</p>
                    <p className="font-medium">4857544371700FAA</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Port Number</p>
                    <p className="font-medium">0-15-11</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-600">Switch Number</p>
                    <p className="font-medium">VT-SOSHANGUVE</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Selected Service</p>
                    <p className="font-medium">10/20</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-600">NMS Service Status</p>
                    <p className="font-medium text-green-600">Active</p>
                  </div>
                  <div>
                    <p className="text-gray-600">CPE_rx</p>
                    <p className="font-medium">-19.79</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-gray-600">CPE_tx</p>
                    <p className="font-medium">2.32</p>
                  </div>
                  <div>
                    <p className="text-gray-600">POP_rx</p>
                    <p className="font-medium">-24.09</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <div className="mb-2">
                    <p className="text-gray-600">Alert Message from NMS</p>
                    <p className="font-medium text-green-600">Link Is Up</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-gray-600">POP Status</p>
                    <p className="font-medium text-gray-500">Unknown</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-gray-600">Device Last seen</p>
                    <p className="font-medium">2025-07-21T17:48:40.000Z</p>
                  </div>
                  <div className="mb-2">
                    <p className="text-gray-600">PPPOE Connection</p>
                    <p className="font-medium">445009</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mac Address</p>
                    <p className="font-medium text-blue-600">
                      14-AB-02-CA-9B-FF
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="flex justify-around py-2">
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 p-3 text-blue-600"
            >
              <FileText className="h-6 w-6" />
              <span className="text-xs font-medium">Details</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 p-3 text-gray-600"
              onClick={() => navigate("/technician/udf")}
            >
              <Settings className="h-6 w-6" />
              <span className="text-xs font-medium">Udf</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 p-3 text-gray-600"
              onClick={() => navigate("/technician/gallery")}
            >
              <Camera className="h-6 w-6" />
              <span className="text-xs font-medium">Gallery</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 p-3 text-gray-600"
              onClick={() => navigate("/technician/stock")}
            >
              <Package className="h-6 w-6" />
              <span className="text-xs font-medium">Stocks</span>
            </Button>
            <Button
              variant="ghost"
              className="flex flex-col items-center space-y-1 p-3 text-orange-600"
              onClick={() => navigate("/technician/signoff")}
            >
              <PenTool className="h-6 w-6" />
              <span className="text-xs font-medium">Sign Off</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/")}
            >
              <X className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold">Jobs</h1>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Menu className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={toggleSortOrder}
              title={`Sort ${sortOrder === "new-to-old" ? "Old to New" : "New to Old"}`}
            >
              <ArrowUpDown className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/")}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Date Filters */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <div>
              <p className="text-sm">From</p>
              <p className="text-sm opacity-80">Select Date</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <div>
              <p className="text-sm">To</p>
              <p className="text-sm opacity-80">Select Date</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
            <Input
              placeholder="Search by customer, technician, job id..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <QrCode className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <RefreshCw className="h-6 w-6" />
          </Button>
        </div>

        {/* Status Tabs */}
        <div className="flex space-x-2 overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`${tab.color} text-white rounded-full px-4 py-2 text-sm whitespace-nowrap ${
                selectedTab === tab.id ? "opacity-100" : "opacity-70"
              }`}
            >
              {tab.label} {tab.count > 0 && tab.count}
            </Button>
          ))}
        </div>
      </div>

      {/* Job List */}
      <div className="p-4 space-y-4">
        {filteredJobs.map((job) => (
          <Card
            key={job.id}
            className="bg-white shadow-md cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleJobAction(job, "view")}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(job.assignedTo)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{job.assignedTo}</h3>
                    <p className="text-sm text-gray-600">By: Admin User</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(job.status)} text-white`}>
                  {job.status.replace("-", " ")}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Client Name</p>
                    <p className="font-medium">{job.client.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Client Contacts</p>
                    <p className="font-medium">{job.client.contact || "-"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Appointment Number
                      </p>
                      <p className="font-medium">{job.appointment.number}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium">{job.appointment.startDate}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Mobile No.</p>
                      <p className="font-medium">{job.client.mobile || "-"}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Facility</p>
                      <p className="font-medium">{job.appointment.facility}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-medium">{job.appointment.endDate}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Client Address</p>
                    <p className="font-medium">{job.client.address}</p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 text-center">
                {job.status === "assigned" && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJobAction(job, "accept");
                    }}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Accept Job
                  </Button>
                )}
                {job.status === "accepted" && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJobAction(job, "start");
                    }}
                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Job
                  </Button>
                )}
                {job.status === "in-progress" && (
                  <div className="flex space-x-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobAction(job, "pause");
                      }}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-full"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobAction(job, "complete");
                      }}
                      className="flex-1 bg-purple-500 hover:bg-purple-600 text-white rounded-full"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Complete
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
