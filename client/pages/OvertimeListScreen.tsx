import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Clock,
  Calendar,
  Plus,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";

interface OvertimeEntry {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  rate: number;
  amount: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  submittedDate: string;
  jobId?: string;
}

export default function OvertimeListScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");

  // Form state
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [jobId, setJobId] = useState("");

  const overtimeEntries: OvertimeEntry[] = [
    {
      id: "OT001",
      date: "2025-01-20",
      startTime: "17:00",
      endTime: "20:00",
      hours: 3,
      rate: 1.5,
      amount: 450,
      reason: "Emergency fiber repair - Business customer outage",
      status: "approved",
      submittedDate: "2025-01-21",
      jobId: "SA-689001",
    },
    {
      id: "OT002",
      date: "2025-01-19",
      startTime: "16:30",
      endTime: "19:30",
      hours: 3,
      rate: 1.5,
      amount: 450,
      reason: "Network upgrade completion",
      status: "pending",
      submittedDate: "2025-01-20",
      jobId: "SA-689203",
    },
    {
      id: "OT003",
      date: "2025-01-18",
      startTime: "18:00",
      endTime: "21:00",
      hours: 3,
      rate: 1.5,
      amount: 450,
      reason: "Late customer installation",
      status: "rejected",
      submittedDate: "2025-01-19",
      jobId: "SA-689102",
    },
    {
      id: "OT004",
      date: "2025-01-15",
      startTime: "06:00",
      endTime: "08:00",
      hours: 2,
      rate: 2.0, // Weekend rate
      amount: 400,
      reason: "Weekend emergency call-out",
      status: "approved",
      submittedDate: "2025-01-16",
      jobId: "SA-689301",
    },
  ];

  const calculateHours = () => {
    if (!startTime || !endTime) return 0;

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    if (end <= start) return 0;

    const diffMs = end.getTime() - start.getTime();
    return Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100;
  };

  const getOvertimeRate = () => {
    if (!date) return 1.5;

    const selectedDate = new Date(date);
    const dayOfWeek = selectedDate.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    return isWeekend ? 2.0 : 1.5;
  };

  const calculateAmount = () => {
    const hours = calculateHours();
    const rate = getOvertimeRate();
    const baseRate = 100; // Base hourly rate

    return Math.round(hours * rate * baseRate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4" />;
      case "rejected":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleSubmit = () => {
    if (!date || !startTime || !endTime || !reason) {
      alert("Please fill in all required fields");
      return;
    }

    if (calculateHours() <= 0) {
      alert("End time must be after start time");
      return;
    }

    // Handle overtime submission
    alert("Overtime entry submitted successfully!");

    // Reset form
    setDate("");
    setStartTime("");
    setEndTime("");
    setReason("");
    setJobId("");
    setActiveTab("list");
  };

  const totals = {
    totalHours: overtimeEntries.reduce((sum, entry) => sum + entry.hours, 0),
    totalAmount: overtimeEntries.reduce((sum, entry) => sum + entry.amount, 0),
    approvedAmount: overtimeEntries
      .filter((entry) => entry.status === "approved")
      .reduce((sum, entry) => sum + entry.amount, 0),
    pendingAmount: overtimeEntries
      .filter((entry) => entry.status === "pending")
      .reduce((sum, entry) => sum + entry.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate(-1)}
            >
              <X className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Overtime List</h1>
              <p className="text-sm opacity-90">
                Track and manage your overtime
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4">
          <Button
            variant={activeTab === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("list")}
            className={
              activeTab === "list"
                ? "bg-white text-indigo-600"
                : "text-white hover:bg-white/20"
            }
          >
            Overtime List
          </Button>
          <Button
            variant={activeTab === "add" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("add")}
            className={
              activeTab === "add"
                ? "bg-white text-indigo-600"
                : "text-white hover:bg-white/20"
            }
          >
            Add Overtime
          </Button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === "list" ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600">
                    {totals.totalHours}
                  </div>
                  <div className="text-sm text-gray-600">Total Hours</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    R{totals.approvedAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Approved</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    R{totals.pendingAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    R{totals.totalAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total</div>
                </CardContent>
              </Card>
            </div>

            {/* Overtime Entries */}
            <div className="space-y-4">
              {overtimeEntries.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">
                            {new Date(entry.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                          </h3>
                          <Badge className={getStatusColor(entry.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(entry.status)}
                              <span>
                                {entry.status.charAt(0).toUpperCase() +
                                  entry.status.slice(1)}
                              </span>
                            </div>
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {entry.startTime} - {entry.endTime} ({entry.hours}
                              h)
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4" />
                            <span>
                              R{entry.amount} (x{entry.rate})
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Submitted: {entry.submittedDate}</span>
                          </div>
                          {entry.jobId && (
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">Job:</span>
                              <span>{entry.jobId}</span>
                            </div>
                          )}
                        </div>

                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm">
                            <span className="font-medium">Reason:</span>{" "}
                            {entry.reason}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        {entry.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Add Overtime Entry</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Date *</label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Time *
                  </label>
                  <Input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    End Time *
                  </label>
                  <Input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              {startTime && endTime && (
                <div className="bg-indigo-50 p-3 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Hours:</span>{" "}
                      {calculateHours()}
                    </div>
                    <div>
                      <span className="font-medium">Rate:</span>{" "}
                      {getOvertimeRate()}x
                    </div>
                    <div>
                      <span className="font-medium">Amount:</span> R
                      {calculateAmount()}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Job ID (Optional)
                </label>
                <Input
                  placeholder="Enter related job ID..."
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Reason *
                </label>
                <Textarea
                  placeholder="Provide a detailed reason for overtime..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSubmit}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Submit Overtime Entry
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
