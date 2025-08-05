import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Calendar, Send, Clock, FileText } from "lucide-react";

export default function ApplyLeaveScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
    emergencyContact: "",
    workCoverage: "",
  });

  const handleSubmit = () => {
    console.log("Submitting leave application:", formData);
    // Here you would submit to your API
    navigate(-1);
  };

  const leaveTypes = [
    "Annual Leave",
    "Sick Leave",
    "Emergency Leave",
    "Family Responsibility Leave",
    "Maternity/Paternity Leave",
    "Study Leave",
    "Unpaid Leave",
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Apply for Leave</h1>
            <p className="text-sm opacity-90">Submit your leave application</p>
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
        {/* Leave Request Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Leave Application</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Leave Type */}
            <div className="space-y-2">
              <Label>Type of Leave</Label>
              <Select
                value={formData.leaveType}
                onValueChange={(value) =>
                  setFormData({ ...formData, leaveType: value })
                }
              >
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

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label>Reason for Leave</Label>
              <Textarea
                placeholder="Please provide details about your leave request..."
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                className="min-h-[100px]"
              />
            </div>

            {/* Emergency Contact */}
            <div className="space-y-2">
              <Label>Emergency Contact</Label>
              <Input
                placeholder="Name and phone number"
                value={formData.emergencyContact}
                onChange={(e) =>
                  setFormData({ ...formData, emergencyContact: e.target.value })
                }
              />
            </div>

            {/* Work Coverage */}
            <div className="space-y-2">
              <Label>Work Coverage Arrangements</Label>
              <Textarea
                placeholder="Describe how your work will be covered during your absence..."
                value={formData.workCoverage}
                onChange={(e) =>
                  setFormData({ ...formData, workCoverage: e.target.value })
                }
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Leave Balance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Leave Balance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">15</div>
                <div className="text-sm text-gray-600">Annual Leave Days</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">8</div>
                <div className="text-sm text-gray-600">Sick Leave Days</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Recent Applications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Annual Leave</div>
                  <div className="text-sm text-gray-600">Dec 20-30, 2024</div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Approved
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">Sick Leave</div>
                  <div className="text-sm text-gray-600">Nov 15, 2024</div>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  Pending
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold"
          disabled={
            !formData.leaveType ||
            !formData.startDate ||
            !formData.endDate ||
            !formData.reason
          }
        >
          <Send className="h-5 w-5 mr-2" />
          Submit Leave Application
        </Button>
      </div>
    </div>
  );
}
