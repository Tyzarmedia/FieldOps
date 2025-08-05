import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Camera,
  Upload,
  File,
  Package,
  Clock,
  User,
  MapPin,
  Phone,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Square,
  Settings,
  FileText,
  Image,
  Eye,
  Download,
  Edit,
  MessageSquare,
  Activity,
  BarChart3,
} from "lucide-react";

interface JobDetail {
  id: string;
  title: string;
  description: string;
  status: "assigned" | "accepted" | "in-progress" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo: string;
  assignedBy: string;
  client: {
    name: string;
    address: string;
    contact: string;
    mobile: string;
  };
  appointment: {
    number: string;
    startDate: string;
    endDate: string;
    scheduledDate: string;
    facility: string;
  };
  workType: string;
  estimatedDuration: number;
  actualDuration?: number;
  createdDate: string;
  acceptedDate?: string;
  startedDate?: string;
  completedDate?: string;
  images: JobImage[];
  udfFields: UDFField[];
  stockUsed: StockUsage[];
  notes: JobNote[];
  followUpComments: FollowUpComment[];
}

interface JobImage {
  id: string;
  filename: string;
  url: string;
  uploadedBy: string;
  uploadedDate: string;
  description?: string;
  category: "before" | "during" | "after" | "documentation";
}

interface UDFField {
  id: string;
  label: string;
  value: string;
  type: "text" | "number" | "date" | "dropdown" | "checkbox";
  category: string;
  updatedBy: string;
  updatedDate: string;
}

interface StockUsage {
  id: string;
  itemName: string;
  quantityUsed: number;
  unit: string;
  usageDate: string;
  notes?: string;
  unitPrice: number;
  totalCost: number;
}

interface JobNote {
  id: string;
  content: string;
  addedBy: string;
  addedDate: string;
  type: "general" | "technical" | "client" | "internal";
}

interface FollowUpComment {
  id: string;
  content: string;
  addedBy: string;
  addedDate: string;
  role: "ROC" | "Manager" | "Coordinator";
  status: "pending" | "addressed";
}

export default function JobDetailsWithTracking() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [jobDetail, setJobDetail] = useState<JobDetail | null>(null);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [showFollowUpDialog, setShowFollowUpDialog] = useState(false);
  const [followUpComment, setFollowUpComment] = useState("");
  const [newUDFValue, setNewUDFValue] = useState("");
  const [selectedUDFField, setSelectedUDFField] = useState<UDFField | null>(
    null,
  );

  // Mock job data - in real app this would come from API
  useEffect(() => {
    const loadJobDetail = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setJobDetail({
          id: jobId || "SA-688808",
          title: "FTTH - Maintenance",
          description: "Routine FTTH maintenance and inspection required",
          status: "completed",
          priority: "medium",
          assignedTo: "Dyondzani Clement Masinge",
          assignedBy: "Admin User",
          client: {
            name: "Vumatel (Pty) Ltd - Central",
            address: "27 Emerson Crescent, Haven Hills, East London",
            contact: "John Williams",
            mobile: "+27 82 555 0123",
          },
          appointment: {
            number: "SA-688808",
            startDate: "Today 8:00 AM",
            endDate: "Today 12:00 PM",
            scheduledDate: "Jul 4, 2025 7:45 PM",
            facility: "FTTH - Maintenance",
          },
          workType: "1. Maintenance Job (SF)",
          estimatedDuration: 4,
          actualDuration: 3.5,
          createdDate: "Jul 3, 2025",
          acceptedDate: "Jul 4, 2025 7:00 AM",
          startedDate: "Jul 4, 2025 8:15 AM",
          completedDate: "Jul 4, 2025 11:45 AM",
          images: [
            {
              id: "img1",
              filename: "before_installation.jpg",
              url: "/api/images/before_installation.jpg",
              uploadedBy: "Dyondzani Clement Masinge",
              uploadedDate: "Jul 4, 2025 8:20 AM",
              description: "Site condition before work",
              category: "before",
            },
            {
              id: "img2",
              filename: "during_work.jpg",
              url: "/api/images/during_work.jpg",
              uploadedBy: "Dyondzani Clement Masinge",
              uploadedDate: "Jul 4, 2025 10:30 AM",
              description: "Fiber splicing in progress",
              category: "during",
            },
            {
              id: "img3",
              filename: "completed_work.jpg",
              url: "/api/images/completed_work.jpg",
              uploadedBy: "Dyondzani Clement Masinge",
              uploadedDate: "Jul 4, 2025 11:40 AM",
              description: "Final installation completed",
              category: "after",
            },
          ],
          udfFields: [
            {
              id: "udf1",
              label: "Signal Strength (dBm)",
              value: "-15.5",
              type: "number",
              category: "Technical",
              updatedBy: "Dyondzani Clement Masinge",
              updatedDate: "Jul 4, 2025 11:30 AM",
            },
            {
              id: "udf2",
              label: "Customer Satisfaction",
              value: "Excellent",
              type: "dropdown",
              category: "Quality",
              updatedBy: "Dyondzani Clement Masinge",
              updatedDate: "Jul 4, 2025 11:45 AM",
            },
            {
              id: "udf3",
              label: "Follow-up Required",
              value: "false",
              type: "checkbox",
              category: "Post-Work",
              updatedBy: "Dyondzani Clement Masinge",
              updatedDate: "Jul 4, 2025 11:45 AM",
            },
          ],
          stockUsed: [
            {
              id: "stock1",
              itemName: "Fiber Optic Cable",
              quantityUsed: 50,
              unit: "meters",
              usageDate: "Jul 4, 2025 9:30 AM",
              notes: "Main cable run",
              unitPrice: 2.5,
              totalCost: 125.0,
            },
            {
              id: "stock2",
              itemName: "Splice Protectors",
              quantityUsed: 8,
              unit: "pieces",
              usageDate: "Jul 4, 2025 10:15 AM",
              notes: "Junction points",
              unitPrice: 0.75,
              totalCost: 6.0,
            },
            {
              id: "stock3",
              itemName: "Cable Ties",
              quantityUsed: 12,
              unit: "pieces",
              usageDate: "Jul 4, 2025 11:00 AM",
              notes: "Cable management",
              unitPrice: 0.25,
              totalCost: 3.0,
            },
          ],
          notes: [
            {
              id: "note1",
              content:
                "Customer premises had existing conduit which made installation easier",
              addedBy: "Dyondzani Clement Masinge",
              addedDate: "Jul 4, 2025 8:30 AM",
              type: "technical",
            },
            {
              id: "note2",
              content:
                "Customer was very satisfied with the work and response time",
              addedBy: "Dyondzani Clement Masinge",
              addedDate: "Jul 4, 2025 11:45 AM",
              type: "client",
            },
          ],
          followUpComments: [
            {
              id: "follow1",
              content:
                "Please verify that all documentation has been submitted and customer satisfaction survey completed.",
              addedBy: "ROC Manager",
              addedDate: "Jul 4, 2025 12:30 PM",
              role: "ROC",
              status: "pending",
            },
          ],
        });
        setLoading(false);
      }, 1000);
    };

    loadJobDetail();
  }, [jobId]);

  const addFollowUpComment = async () => {
    if (!followUpComment.trim()) return;

    const newComment: FollowUpComment = {
      id: Date.now().toString(),
      content: followUpComment,
      addedBy: "ROC Manager", // In real app, get from auth
      addedDate: new Date().toLocaleString(),
      role: "ROC",
      status: "pending",
    };

    setJobDetail((prev) =>
      prev
        ? {
            ...prev,
            followUpComments: [...prev.followUpComments, newComment],
          }
        : null,
    );

    setFollowUpComment("");
    setShowFollowUpDialog(false);

    // In real app, also update job status to "roc-closed"
    alert("Follow-up comment added. Job status updated to ROC Closed.");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "accepted":
        return "bg-orange-100 text-orange-800";
      case "assigned":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500 text-white";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!jobDetail) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-red-500" />
          <p>Job not found</p>
        </div>
      </div>
    );
  }

  const totalStockCost = jobDetail.stockUsed.reduce(
    (sum, item) => sum + item.totalCost,
    0,
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold">Job Details</h1>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            {jobDetail.status === "completed" && (
              <Dialog
                open={showFollowUpDialog}
                onOpenChange={setShowFollowUpDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    ROC Follow-up
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add ROC Follow-up Comment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Follow-up Comment</Label>
                      <textarea
                        className="w-full min-h-[100px] p-3 border rounded-md resize-none"
                        placeholder="Enter follow-up comment or feedback..."
                        value={followUpComment}
                        onChange={(e) => setFollowUpComment(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={addFollowUpComment} className="flex-1">
                        Submit & Close as ROC
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowFollowUpDialog(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Job Header Info */}
        <div className="text-center">
          <h2 className="text-xl font-bold">{jobDetail.client.name}</h2>
          <p className="text-white/80">#{jobDetail.id}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge className={getStatusColor(jobDetail.status)}>
              {jobDetail.status.replace("-", " ").toUpperCase()}
            </Badge>
            <Badge className={getPriorityColor(jobDetail.priority)}>
              {jobDetail.priority.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">📋 Overview</TabsTrigger>
            <TabsTrigger value="images">
              📷 Images ({jobDetail.images.length})
            </TabsTrigger>
            <TabsTrigger value="udf">⚙️ UDF Fields</TabsTrigger>
            <TabsTrigger value="stock">📦 Stock Used</TabsTrigger>
            <TabsTrigger value="followup">💬 Follow-up</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {/* Job Details */}
            <Card>
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Title
                    </Label>
                    <p className="font-medium">{jobDetail.title}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Work Type
                    </Label>
                    <p className="font-medium">{jobDetail.workType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Assigned To
                    </Label>
                    <p className="font-medium">{jobDetail.assignedTo}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Assigned By
                    </Label>
                    <p className="font-medium">{jobDetail.assignedBy}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Description
                  </Label>
                  <p className="font-medium">{jobDetail.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Job Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobDetail.createdDate && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Created</p>
                        <p className="font-medium">{jobDetail.createdDate}</p>
                      </div>
                    </div>
                  )}
                  {jobDetail.acceptedDate && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Accepted</p>
                        <p className="font-medium">{jobDetail.acceptedDate}</p>
                      </div>
                    </div>
                  )}
                  {jobDetail.startedDate && (
                    <div className="flex items-center space-x-3">
                      <Play className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">Started</p>
                        <p className="font-medium">{jobDetail.startedDate}</p>
                      </div>
                    </div>
                  )}
                  {jobDetail.completedDate && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-600">Completed</p>
                        <p className="font-medium">{jobDetail.completedDate}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Contact Person</p>
                    <p className="font-medium">{jobDetail.client.contact}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Mobile</p>
                    <p className="font-medium">{jobDetail.client.mobile}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{jobDetail.client.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Job Images ({jobDetail.images.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {jobDetail.images.map((image) => (
                    <Card key={image.id} className="overflow-hidden">
                      <div className="aspect-video bg-gray-200 flex items-center justify-center">
                        <Image className="h-16 w-16 text-gray-400" />
                      </div>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {image.category}
                          </Badge>
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm font-medium">{image.filename}</p>
                        <p className="text-xs text-gray-600">
                          {image.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {image.uploadedBy} • {image.uploadedDate}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="udf" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  User Defined Fields
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobDetail.udfFields.map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <Label className="text-sm font-medium">
                          {field.label}
                        </Label>
                        <p className="font-medium">{field.value}</p>
                        <p className="text-xs text-gray-500">
                          {field.category} • Updated by {field.updatedBy} on{" "}
                          {field.updatedDate}
                        </p>
                      </div>
                      <Badge variant="outline">{field.type}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stock" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Stock Used on This Job
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {jobDetail.stockUsed.map((stock) => (
                    <div
                      key={stock.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{stock.itemName}</p>
                        <p className="text-sm text-gray-600">
                          Quantity: {stock.quantityUsed} {stock.unit}
                        </p>
                        <p className="text-xs text-gray-500">
                          Used on {stock.usageDate}
                        </p>
                        {stock.notes && (
                          <p className="text-xs text-gray-600 mt-1">
                            Note: {stock.notes}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          R{stock.totalCost.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          R{stock.unitPrice.toFixed(2)} per {stock.unit}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-medium">
                      <span>Total Stock Cost:</span>
                      <span>R{totalStockCost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="followup" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Follow-up Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobDetail.followUpComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-4 border rounded-lg bg-yellow-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{comment.role}</Badge>
                          <Badge
                            className={
                              comment.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }
                          >
                            {comment.status}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">
                          {comment.addedDate}
                        </span>
                      </div>
                      <p className="text-sm">{comment.content}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        - {comment.addedBy}
                      </p>
                    </div>
                  ))}

                  {jobDetail.notes.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Job Notes</h4>
                      {jobDetail.notes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3 border rounded-lg mb-3"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline">{note.type}</Badge>
                            <span className="text-xs text-gray-500">
                              {note.addedDate}
                            </span>
                          </div>
                          <p className="text-sm">{note.content}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            - {note.addedBy}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
