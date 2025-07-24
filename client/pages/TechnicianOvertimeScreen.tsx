import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  X,
  Clock,
  Plus,
  Calendar,
  User,
  CheckCircle,
  Timer,
  FileText,
  Users,
} from "lucide-react";
import { assistants } from "../data/sharedJobs";

interface OvertimeClaim {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  reason: string;
  assistantWorkedWith?: string;
  workedAlone: boolean;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  submittedDate?: string;
  approvedBy?: string;
  notes?: string;
}

export default function TechnicianOvertimeScreen() {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<OvertimeClaim | null>(null);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    reason: '',
    assistantWorkedWith: '',
    workedAlone: false,
    notes: ''
  });

  const [overtimeClaims, setOvertimeClaims] = useState<OvertimeClaim[]>([
    {
      id: "OT001",
      date: "2024-01-20",
      startTime: "17:00",
      endTime: "21:30",
      totalHours: 4.5,
      reason: "Emergency fiber repair - customer outage",
      assistantWorkedWith: "Mike Chen",
      workedAlone: false,
      status: "approved",
      submittedDate: "2024-01-21",
      approvedBy: "Sarah Johnson",
      notes: "Critical customer affecting 200+ users"
    },
    {
      id: "OT002",
      date: "2024-01-18",
      startTime: "16:30",
      endTime: "19:00",
      totalHours: 2.5,
      reason: "Complex installation required additional time",
      workedAlone: true,
      status: "submitted",
      submittedDate: "2024-01-19",
      notes: "Customer had additional requirements not in original scope"
    },
    {
      id: "OT003",
      date: "2024-01-15",
      startTime: "18:00",
      endTime: "20:30",
      totalHours: 2.5,
      reason: "Network upgrade project",
      assistantWorkedWith: "Alex Kim",
      workedAlone: false,
      status: "rejected",
      submittedDate: "2024-01-16",
      notes: "Project should have been completed within regular hours"
    }
  ]);

  const calculateHours = (start: string, end: string) => {
    if (!start || !end) return 0;
    const startTime = new Date(`2024-01-01T${start}:00`);
    const endTime = new Date(`2024-01-01T${end}:00`);
    const diffMs = endTime.getTime() - startTime.getTime();
    return Math.max(0, diffMs / (1000 * 60 * 60));
  };

  const handleSubmitClaim = () => {
    const totalHours = calculateHours(formData.startTime, formData.endTime);
    
    if (totalHours <= 0) {
      alert('Please enter valid start and end times');
      return;
    }

    const newClaim: OvertimeClaim = {
      id: `OT${String(overtimeClaims.length + 1).padStart(3, '0')}`,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      totalHours,
      reason: formData.reason,
      assistantWorkedWith: formData.workedAlone ? undefined : formData.assistantWorkedWith,
      workedAlone: formData.workedAlone,
      status: 'submitted',
      submittedDate: new Date().toLocaleDateString(),
      notes: formData.notes
    };

    setOvertimeClaims([newClaim, ...overtimeClaims]);
    setShowCreateForm(false);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      reason: '',
      assistantWorkedWith: '',
      workedAlone: false,
      notes: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'submitted': return 'bg-blue-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle;
      case 'submitted': return Clock;
      case 'rejected': return X;
      default: return FileText;
    }
  };

  // Claim Detail View
  if (selectedClaim) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setSelectedClaim(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">Overtime Claim Details</h1>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <FileText className="h-6 w-6" />
            </Button>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold">{selectedClaim.totalHours} Hours</div>
            <div className="text-sm opacity-90">Overtime Claimed</div>
            <Badge className={`${getStatusColor(selectedClaim.status)} text-white mt-2`}>
              {selectedClaim.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Claim ID</label>
                <p className="font-semibold">{selectedClaim.id}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Date</label>
                <p className="font-semibold">{selectedClaim.date}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Start Time</label>
                  <p className="font-semibold">{selectedClaim.startTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">End Time</label>
                  <p className="font-semibold">{selectedClaim.endTime}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Reason</label>
                <p className="font-semibold">{selectedClaim.reason}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Team</label>
                <p className="font-semibold">
                  {selectedClaim.workedAlone ? 'Worked Alone' : `With ${selectedClaim.assistantWorkedWith}`}
                </p>
              </div>

              {selectedClaim.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Notes</label>
                  <p className="font-semibold">{selectedClaim.notes}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600">Submitted Date</label>
                <p className="font-semibold">{selectedClaim.submittedDate}</p>
              </div>

              {selectedClaim.approvedBy && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Approved By</label>
                  <p className="font-semibold">{selectedClaim.approvedBy}</p>
                </div>
              )}

              <Button 
                onClick={() => setSelectedClaim(null)}
                className="w-full mt-6"
                variant="outline"
              >
                Back to Claims
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Create Claim Form
  if (showCreateForm) {
    const totalHours = calculateHours(formData.startTime, formData.endTime);

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setShowCreateForm(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">Capture Overtime</h1>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>

          {totalHours > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold">{totalHours.toFixed(1)} Hours</div>
              <div className="text-sm opacity-90">Total Overtime</div>
            </div>
          )}
        </div>

        <div className="p-4">
          <Card>
            <CardContent className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Time</label>
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Time</label>
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Reason for Overtime</label>
                  <Textarea
                    placeholder="Explain why overtime was necessary..."
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Team Configuration</label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="worked-with-assistant"
                        name="teamConfig"
                        checked={!formData.workedAlone}
                        onChange={() => setFormData({...formData, workedAlone: false})}
                      />
                      <label htmlFor="worked-with-assistant" className="text-sm">
                        Worked with Assistant
                      </label>
                    </div>
                    
                    {!formData.workedAlone && (
                      <div className="ml-6">
                        <select
                          className="w-full p-2 border rounded-lg"
                          value={formData.assistantWorkedWith}
                          onChange={(e) => setFormData({...formData, assistantWorkedWith: e.target.value})}
                        >
                          <option value="">Select Assistant</option>
                          {assistants.filter(a => a.available).map(assistant => (
                            <option key={assistant.id} value={assistant.name}>
                              {assistant.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="worked-alone"
                        name="teamConfig"
                        checked={formData.workedAlone}
                        onChange={() => setFormData({...formData, workedAlone: true, assistantWorkedWith: ''})}
                      />
                      <label htmlFor="worked-alone" className="text-sm">
                        Worked Alone
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
                  <Textarea
                    placeholder="Any additional information..."
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={2}
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button 
                    type="button"
                    onClick={handleSubmitClaim}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={!formData.reason || !formData.startTime || !formData.endTime || (!formData.workedAlone && !formData.assistantWorkedWith)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Claim
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main Overtime Screen
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => navigate('/')}
          >
            <X className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Capture Overtime</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => setShowCreateForm(true)}
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
        <p className="text-center text-white/90">Log overtime hours worked</p>
      </div>

      {/* Summary Stats */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-blue-600">
              {overtimeClaims.filter(c => c.status === 'submitted').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-green-600">
              {overtimeClaims.filter(c => c.status === 'approved').length}
            </div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-md">
            <div className="text-2xl font-bold text-orange-600">
              {overtimeClaims.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.totalHours, 0).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Total Hours</div>
          </div>
        </div>

        {/* New Claim Button */}
        <Card 
          className="bg-green-50 border-green-200 hover:shadow-lg transition-all duration-300 cursor-pointer mb-4"
          onClick={() => setShowCreateForm(true)}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 p-3 rounded-xl">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">New Overtime Claim</h3>
                <p className="text-sm text-green-600">Capture overtime hours worked</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Claims List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Recent Claims</h3>
          {overtimeClaims.map((claim) => {
            const StatusIcon = getStatusIcon(claim.status);
            
            return (
              <Card 
                key={claim.id} 
                className="bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedClaim(claim)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500 p-3 rounded-xl">
                        <Timer className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{claim.id}</h4>
                        <p className="text-sm text-gray-600">{claim.date}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge className={`${getStatusColor(claim.status)} text-white mb-2`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {claim.status}
                      </Badge>
                      <div className="text-lg font-bold text-blue-600">
                        {claim.totalHours}h
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{claim.startTime} - {claim.endTime}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      {claim.workedAlone ? (
                        <>
                          <User className="h-4 w-4" />
                          <span>Worked alone</span>
                        </>
                      ) : (
                        <>
                          <Users className="h-4 w-4" />
                          <span>With {claim.assistantWorkedWith}</span>
                        </>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-700 mt-2">{claim.reason}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
