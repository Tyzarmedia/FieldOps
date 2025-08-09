import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Network,
  Wifi,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  AlertTriangle,
  Search,
  Calendar,
  MapPin,
  User,
  Download,
  Upload,
  Signal,
  Camera,
} from "lucide-react";
import { format } from "date-fns";

interface NetworkAssessment {
  id: string;
  technicianId: string;
  technicianName: string;
  assessmentDate: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  coreOptions: string;
  reachOptions: string;
  signalStrength: number;
  downloadSpeed: number;
  uploadSpeed: number;
  networkType: string;
  connectedDevices: number;
  issuesFound: boolean;
  notes: string;
  images: string[];
  status: string;
}

export default function ManagerNetworkAssessmentsScreen() {
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState<NetworkAssessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<NetworkAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTechnician, setFilterTechnician] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAssessment, setSelectedAssessment] = useState<NetworkAssessment | null>(null);

  useEffect(() => {
    loadAssessments();
  }, []);

  useEffect(() => {
    filterAssessments();
  }, [assessments, searchTerm, filterTechnician, filterStatus]);

  const loadAssessments = async () => {
    try {
      const response = await fetch("/api/network-assessments");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setAssessments(result.data);
        }
      }
    } catch (error) {
      console.error("Error loading assessments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAssessments = () => {
    let filtered = assessments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (assessment) =>
          assessment.technicianName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assessment.location.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assessment.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Technician filter
    if (filterTechnician !== "all") {
      filtered = filtered.filter((assessment) => assessment.technicianId === filterTechnician);
    }

    // Status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((assessment) => assessment.status === filterStatus);
    }

    setFilteredAssessments(filtered);
  };

  const getSignalStatusInfo = (strength: number) => {
    if (strength > -50) return { status: "Excellent", color: "bg-green-500", icon: CheckCircle };
    if (strength > -60) return { status: "Good", color: "bg-blue-500", icon: TrendingUp };
    if (strength > -70) return { status: "Fair", color: "bg-yellow-500", icon: TrendingDown };
    return { status: "Poor", color: "bg-red-500", icon: AlertTriangle };
  };

  const getSpeedStatus = (speed: number, type: "download" | "upload") => {
    const threshold = type === "download" ? 25 : 10;
    return speed >= threshold ? "Good" : "Needs Improvement";
  };

  const getSpeedColor = (speed: number, type: "download" | "upload") => {
    const status = getSpeedStatus(speed, type);
    return status === "Good" ? "text-green-600" : "text-yellow-600";
  };

  const exportAssessments = () => {
    // Create CSV export
    const headers = [
      "ID",
      "Technician",
      "Date",
      "Location",
      "Core Options",
      "Reach Options",
      "Signal Strength",
      "Download Speed",
      "Upload Speed",
      "Network Type",
      "Connected Devices",
      "Issues Found",
      "Status",
    ];

    const csvData = filteredAssessments.map((assessment) => [
      assessment.id,
      assessment.technicianName,
      format(new Date(assessment.assessmentDate), "yyyy-MM-dd HH:mm"),
      assessment.location.address,
      assessment.coreOptions,
      assessment.reachOptions,
      `${assessment.signalStrength} dBm`,
      `${assessment.downloadSpeed} Mbps`,
      `${assessment.uploadSpeed} Mbps`,
      assessment.networkType,
      assessment.connectedDevices,
      assessment.issuesFound ? "Yes" : "No",
      assessment.status,
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `network_assessments_${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const uniqueTechnicians = Array.from(
    new Set(assessments.map((a) => a.technicianId))
  ).map((id) => {
    const assessment = assessments.find((a) => a.technicianId === id);
    return { id, name: assessment?.technicianName || id };
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading network assessments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Network Assessments</h1>
            <p className="text-sm opacity-90">
              View and manage technician network assessments
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full h-10 w-10"
            onClick={() => navigate(-1)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search assessments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Technician Filter */}
              <Select value={filterTechnician} onValueChange={setFilterTechnician}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by technician" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Technicians</SelectItem>
                  {uniqueTechnicians.map((tech) => (
                    <SelectItem key={tech.id} value={tech.id}>
                      {tech.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>

              {/* Export Button */}
              <Button onClick={exportAssessments} className="bg-green-600 hover:bg-green-700">
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assessment Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{assessments.length}</div>
              <div className="text-sm text-gray-600">Total Assessments</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {assessments.filter((a) => a.status === "completed").length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {assessments.filter((a) => a.issuesFound).length}
              </div>
              <div className="text-sm text-gray-600">Issues Found</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{uniqueTechnicians.length}</div>
              <div className="text-sm text-gray-600">Active Technicians</div>
            </CardContent>
          </Card>
        </div>

        {/* Assessments List */}
        <div className="space-y-4">
          {filteredAssessments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No network assessments found</p>
              </CardContent>
            </Card>
          ) : (
            filteredAssessments.map((assessment) => {
              const signalInfo = getSignalStatusInfo(assessment.signalStrength);
              return (
                <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Basic Info */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg">{assessment.id}</h3>
                          <Badge
                            className={
                              assessment.status === "completed"
                                ? "bg-green-500 text-white"
                                : "bg-yellow-500 text-white"
                            }
                          >
                            {assessment.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600">
                            <User className="h-4 w-4 mr-2" />
                            {assessment.technicianName}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {format(new Date(assessment.assessmentDate), "MMM dd, yyyy HH:mm")}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {assessment.location.address}
                          </div>
                          {assessment.images.length > 0 && (
                            <div className="flex items-center text-gray-600">
                              <Camera className="h-4 w-4 mr-2" />
                              {assessment.images.length} image(s)
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Network Metrics */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Network Performance</h4>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Signal className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-sm">Signal Strength</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium">{assessment.signalStrength} dBm</span>
                              <Badge className={`${signalInfo.color} text-white text-xs`}>
                                {signalInfo.status}
                              </Badge>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Download className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-sm">Download</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-medium ${getSpeedColor(assessment.downloadSpeed, "download")}`}>
                                {assessment.downloadSpeed} Mbps
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Upload className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-sm">Upload</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className={`text-sm font-medium ${getSpeedColor(assessment.uploadSpeed, "upload")}`}>
                                {assessment.uploadSpeed} Mbps
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Assessment Details */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-700">Assessment Details</h4>
                        
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Core Options:</span>
                            <span className="ml-2 text-gray-600">{assessment.coreOptions || "N/A"}</span>
                          </div>
                          <div>
                            <span className="font-medium">Reach Options:</span>
                            <span className="ml-2 text-gray-600">{assessment.reachOptions || "N/A"}</span>
                          </div>
                          <div>
                            <span className="font-medium">Network Type:</span>
                            <span className="ml-2 text-gray-600 capitalize">{assessment.networkType}</span>
                          </div>
                          <div>
                            <span className="font-medium">Connected Devices:</span>
                            <span className="ml-2 text-gray-600">{assessment.connectedDevices}</span>
                          </div>
                          <div>
                            <span className="font-medium">Issues Found:</span>
                            <Badge className={assessment.issuesFound ? "bg-red-500 text-white ml-2" : "bg-green-500 text-white ml-2"}>
                              {assessment.issuesFound ? "Yes" : "No"}
                            </Badge>
                          </div>
                          {assessment.notes && (
                            <div>
                              <span className="font-medium">Notes:</span>
                              <p className="text-gray-600 mt-1">{assessment.notes}</p>
                            </div>
                          )}
                        </div>

                        <Button
                          onClick={() => setSelectedAssessment(assessment)}
                          variant="outline"
                          size="sm"
                          className="w-full mt-3"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Assessment Detail Modal */}
      {selectedAssessment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Assessment Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAssessment(null)}
                  className="rounded-full h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Assessment Images */}
              {selectedAssessment.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Assessment Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedAssessment.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Assessment ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          Image {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Assessment Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>ID:</strong> {selectedAssessment.id}</div>
                    <div><strong>Technician:</strong> {selectedAssessment.technicianName}</div>
                    <div><strong>Date:</strong> {format(new Date(selectedAssessment.assessmentDate), "MMM dd, yyyy HH:mm")}</div>
                    <div><strong>Location:</strong> {selectedAssessment.location.address}</div>
                    <div><strong>Coordinates:</strong> {selectedAssessment.location.latitude.toFixed(6)}, {selectedAssessment.location.longitude.toFixed(6)}</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Technical Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Core Options:</strong> {selectedAssessment.coreOptions || "N/A"}</div>
                    <div><strong>Reach Options:</strong> {selectedAssessment.reachOptions || "N/A"}</div>
                    <div><strong>Network Type:</strong> {selectedAssessment.networkType}</div>
                    <div><strong>Connected Devices:</strong> {selectedAssessment.connectedDevices}</div>
                    <div><strong>Issues Found:</strong> {selectedAssessment.issuesFound ? "Yes" : "No"}</div>
                  </div>
                </div>
              </div>

              {selectedAssessment.notes && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Notes</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{selectedAssessment.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
