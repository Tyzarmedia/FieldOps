import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Calendar,
  Clock,
  User,
  FileText,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  approver?: string;
}

export default function ApplyLeaveScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"apply" | "history">("apply");
  
  // Form state
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const leaveTypes = [
    "Annual Leave",
    "Sick Leave",
    "Family Responsibility",
    "Maternity Leave",
    "Study Leave",
    "Emergency Leave",
  ];

  const leaveHistory: LeaveRequest[] = [
    {
      id: "LR001",
      type: "Annual Leave",
      startDate: "2025-01-15",
      endDate: "2025-01-19",
      days: 5,
      reason: "Family vacation",
      status: "approved",
      appliedDate: "2025-01-01",
      approver: "Manager Smith",
    },
    {
      id: "LR002",
      type: "Sick Leave",
      startDate: "2025-01-08",
      endDate: "2025-01-09",
      days: 2,
      reason: "Flu symptoms",
      status: "approved",
      appliedDate: "2025-01-08",
      approver: "Manager Smith",
    },
    {
      id: "LR003",
      type: "Emergency Leave",
      startDate: "2025-01-22",
      endDate: "2025-01-22",
      days: 1,
      reason: "Family emergency",
      status: "pending",
      appliedDate: "2025-01-20",
    },
  ];

  const leaveBalance = {
    annual: { used: 10, total: 21 },
    sick: { used: 3, total: 30 },
    family: { used: 1, total: 5 },
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = () => {
    if (!leaveType || !startDate || !endDate || !reason) {
      alert("Please fill in all fields");
      return;
    }
    
    // Handle leave application submission
    alert("Leave application submitted successfully!");
    
    // Reset form
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setReason("");
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
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
              <h1 className="text-xl font-semibold">Apply Leave</h1>
              <p className="text-sm opacity-90">Manage your leave requests</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4">
          <Button
            variant={activeTab === "apply" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("apply")}
            className={activeTab === "apply" ? "bg-white text-blue-600" : "text-white hover:bg-white/20"}
          >
            Apply Leave
          </Button>
          <Button
            variant={activeTab === "history" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("history")}
            className={activeTab === "history" ? "bg-white text-blue-600" : "text-white hover:bg-white/20"}
          >
            Leave History
          </Button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === "apply" ? (
          <>
            {/* Leave Balance */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Leave Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {leaveBalance.annual.total - leaveBalance.annual.used}
                    </div>
                    <div className="text-sm text-gray-600">Annual Leave</div>
                    <div className="text-xs text-gray-400">
                      Used: {leaveBalance.annual.used}/{leaveBalance.annual.total}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {leaveBalance.sick.total - leaveBalance.sick.used}
                    </div>
                    <div className="text-sm text-gray-600">Sick Leave</div>
                    <div className="text-xs text-gray-400">
                      Used: {leaveBalance.sick.used}/{leaveBalance.sick.total}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {leaveBalance.family.total - leaveBalance.family.used}
                    </div>
                    <div className="text-sm text-gray-600">Family Leave</div>
                    <div className="text-xs text-gray-400">
                      Used: {leaveBalance.family.used}/{leaveBalance.family.total}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Apply Leave Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="h-5 w-5" />
                  <span>Apply for Leave</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Leave Type</label>
                  <Select value={leaveType} onValueChange={setLeaveType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>

                {startDate && endDate && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Total days: <span className="font-semibold">{calculateDays()}</span>
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">Reason</label>
                  <Textarea
                    placeholder="Please provide a reason for your leave..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button onClick={handleSubmit} className="w-full">
                  Submit Leave Application
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Leave History */}
            <div className="space-y-4">
              {leaveHistory.map((leave) => (
                <Card key={leave.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold">{leave.type}</h3>
                          <Badge className={getStatusColor(leave.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(leave.status)}
                              <span>{leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}</span>
                            </div>
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{leave.startDate} to {leave.endDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span>{leave.days} day{leave.days > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                            <span>{leave.reason}</span>
                          </div>
                          {leave.approver && (
                            <div className="flex items-center space-x-2">
                              <User className="h-4 w-4" />
                              <span>Approved by {leave.approver}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
