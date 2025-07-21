import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Shield,
  Flame,
  Zap,
  Mountain,
  HardHat,
  ClipboardList,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Camera,
  User,
} from "lucide-react";

interface ChecklistItem {
  id: string;
  item: string;
  checked: boolean;
  required: boolean;
  notes?: string;
}

interface SafetyChecklist {
  id: string;
  title: string;
  icon: any;
  color: string;
  description: string;
  items: ChecklistItem[];
  lastCompleted?: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export default function TechnicianSafetyScreen() {
  const navigate = useNavigate();
  const [selectedChecklist, setSelectedChecklist] = useState<SafetyChecklist | null>(null);
  const [showIncidentForm, setShowIncidentForm] = useState(false);

  const [safetyChecklists, setSafetyChecklists] = useState<SafetyChecklist[]>([
    {
      id: "fire-extinguisher",
      title: "Fire Extinguisher Checklist",
      icon: Flame,
      color: "bg-red-500",
      description: "Monthly fire extinguisher inspection",
      status: "pending",
      items: [
        { id: "fe1", item: "Fire extinguisher is visible and accessible", checked: false, required: true },
        { id: "fe2", item: "Safety pin is intact and seal is not broken", checked: false, required: true },
        { id: "fe3", item: "Pressure gauge shows normal pressure", checked: false, required: true },
        { id: "fe4", item: "No visible damage or corrosion", checked: false, required: true },
        { id: "fe5", item: "Inspection tag is current and attached", checked: false, required: true },
        { id: "fe6", item: "Extinguisher is properly mounted", checked: false, required: true },
        { id: "fe7", item: "Area around extinguisher is clear", checked: false, required: true },
        { id: "fe8", item: "Instructions are visible and legible", checked: false, required: false },
      ]
    },
    {
      id: "electrical-tools",
      title: "Electrical Tool Checklist",
      icon: Zap,
      color: "bg-yellow-500",
      description: "Daily electrical equipment safety check",
      status: "pending",
      items: [
        { id: "et1", item: "All tools are properly insulated", checked: false, required: true },
        { id: "et2", item: "No damaged cables or plugs", checked: false, required: true },
        { id: "et3", item: "Voltage tester is functioning", checked: false, required: true },
        { id: "et4", item: "Multimeter calibration is current", checked: false, required: true },
        { id: "et5", item: "Personal protective equipment available", checked: false, required: true },
        { id: "et6", item: "Lockout/tagout devices present", checked: false, required: true },
        { id: "et7", item: "Emergency contact numbers posted", checked: false, required: false },
        { id: "et8", item: "First aid kit accessible", checked: false, required: true },
      ]
    },
    {
      id: "working-heights",
      title: "Working at Heights Checklist",
      icon: Mountain,
      color: "bg-blue-500",
      description: "Safety check for elevated work",
      status: "pending",
      items: [
        { id: "wh1", item: "Weather conditions are suitable", checked: false, required: true },
        { id: "wh2", item: "Work area is secured and marked", checked: false, required: true },
        { id: "wh3", item: "Ladder is in good condition", checked: false, required: true },
        { id: "wh4", item: "Ladder is positioned at correct angle", checked: false, required: true },
        { id: "wh5", item: "Three points of contact maintained", checked: false, required: true },
        { id: "wh6", item: "No overhead power lines in vicinity", checked: false, required: true },
        { id: "wh7", item: "Spotter/observer assigned if required", checked: false, required: false },
        { id: "wh8", item: "Emergency evacuation plan in place", checked: false, required: true },
      ]
    },
    {
      id: "harness-check",
      title: "Harness Checklist",
      icon: HardHat,
      color: "bg-green-500",
      description: "Personal fall protection equipment",
      status: "pending",
      items: [
        { id: "hc1", item: "Harness is within certification date", checked: false, required: true },
        { id: "hc2", item: "No cuts, tears, or burns in webbing", checked: false, required: true },
        { id: "hc3", item: "Hardware is free from cracks and corrosion", checked: false, required: true },
        { id: "hc4", item: "Buckles function properly", checked: false, required: true },
        { id: "hc5", item: "D-rings are secure and undamaged", checked: false, required: true },
        { id: "hc6", item: "Lanyard is in good condition", checked: false, required: true },
        { id: "hc7", item: "Shock absorber is not deployed", checked: false, required: true },
        { id: "hc8", item: "Proper fit confirmed", checked: false, required: true },
      ]
    },
    {
      id: "risk-assessment",
      title: "Risk Assessment Checklist",
      icon: ClipboardList,
      color: "bg-purple-500",
      description: "General workplace risk assessment",
      status: "pending",
      items: [
        { id: "ra1", item: "Site hazards identified and documented", checked: false, required: true },
        { id: "ra2", item: "Control measures implemented", checked: false, required: true },
        { id: "ra3", item: "Emergency procedures communicated", checked: false, required: true },
        { id: "ra4", item: "Personal protective equipment specified", checked: false, required: true },
        { id: "ra5", item: "Work permits obtained if required", checked: false, required: true },
        { id: "ra6", item: "Environmental factors considered", checked: false, required: true },
        { id: "ra7", item: "Team members briefed on risks", checked: false, required: true },
        { id: "ra8", item: "Risk assessment signed off", checked: false, required: true },
      ]
    },
    {
      id: "fiber-equipment",
      title: "Fiber Equipment Checklist",
      icon: Zap,
      color: "bg-cyan-500",
      description: "Splicing machine, PON meter, VFL and OTDR/iOLM check",
      status: "pending",
      items: [
        { id: "fe1", item: "Splicing machine calibration current", checked: false, required: true },
        { id: "fe2", item: "Fusion splicer electrodes clean", checked: false, required: true },
        { id: "fe3", item: "PON meter functioning correctly", checked: false, required: true },
        { id: "fe4", item: "VFL (Visual Fault Locator) operational", checked: false, required: true },
        { id: "fe5", item: "OTDR/iOLM measurement accuracy verified", checked: false, required: true },
        { id: "fe6", item: "Fiber cleaving tool sharp and clean", checked: false, required: true },
        { id: "fe7", item: "Connector cleaning supplies available", checked: false, required: true },
        { id: "fe8", item: "Safety glasses for laser equipment", checked: false, required: true },
      ]
    }
  ]);

  const handleChecklistItemToggle = (checklistId: string, itemId: string) => {
    setSafetyChecklists(prev => prev.map(checklist => {
      if (checklist.id === checklistId) {
        const updatedItems = checklist.items.map(item => 
          item.id === itemId ? { ...item, checked: !item.checked } : item
        );
        const completedItems = updatedItems.filter(item => item.checked).length;
        const totalItems = updatedItems.length;
        const status = completedItems === 0 ? 'pending' : 
                     completedItems === totalItems ? 'completed' : 'in-progress';
        
        return { ...checklist, items: updatedItems, status };
      }
      return checklist;
    }));
  };

  const handleCompleteChecklist = (checklistId: string) => {
    setSafetyChecklists(prev => prev.map(checklist => {
      if (checklist.id === checklistId) {
        return { 
          ...checklist, 
          status: 'completed',
          lastCompleted: new Date().toLocaleString()
        };
      }
      return checklist;
    }));
    setSelectedChecklist(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      default: return ClipboardList;
    }
  };

  // Incident Report Form
  if (showIncidentForm) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setShowIncidentForm(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold">Incident Report</h1>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <FileText className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <Card>
            <CardContent className="p-6">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Incident Type</label>
                  <select className="w-full p-2 border rounded-lg">
                    <option>Near Miss</option>
                    <option>Minor Injury</option>
                    <option>Major Injury</option>
                    <option>Property Damage</option>
                    <option>Environmental</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Date and Time</label>
                  <input type="datetime-local" className="w-full p-2 border rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input type="text" placeholder="Incident location" className="w-full p-2 border rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea 
                    placeholder="Describe what happened..." 
                    rows={4}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Injured Person(s)</label>
                  <input type="text" placeholder="Name(s) of injured person(s)" className="w-full p-2 border rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Witnesses</label>
                  <input type="text" placeholder="Name(s) of witnesses" className="w-full p-2 border rounded-lg" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Immediate Actions Taken</label>
                  <textarea 
                    placeholder="What actions were taken immediately after the incident?" 
                    rows={3}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Photos</label>
                  <Button type="button" variant="outline" className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photos
                  </Button>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700">
                    Submit Report
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowIncidentForm(false)}
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

  // Checklist Detail View
  if (selectedChecklist) {
    const completedItems = selectedChecklist.items.filter(item => item.checked).length;
    const totalItems = selectedChecklist.items.length;
    const progress = (completedItems / totalItems) * 100;

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setSelectedChecklist(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">{selectedChecklist.title}</h1>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <FileText className="h-6 w-6" />
            </Button>
          </div>

          <div className="text-center mb-4">
            <div className="text-2xl font-bold">{completedItems}/{totalItems}</div>
            <div className="text-sm opacity-90">Items Completed</div>
            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-3">
                {selectedChecklist.items.map((item) => (
                  <div 
                    key={item.id}
                    className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      item.checked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                    }`}
                    onClick={() => handleChecklistItemToggle(selectedChecklist.id, item.id)}
                  >
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300'
                    }`}>
                      {item.checked && <CheckCircle className="h-4 w-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <p className={`${item.checked ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                        {item.item}
                      </p>
                      {item.required && (
                        <Badge className="bg-red-100 text-red-800 text-xs mt-1">Required</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex space-x-4">
                <Button 
                  onClick={() => handleCompleteChecklist(selectedChecklist.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={completedItems < selectedChecklist.items.filter(i => i.required).length}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Checklist
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedChecklist(null)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main Safety Screen
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
          <h1 className="text-xl font-semibold">Health & Safety</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <Shield className="h-6 w-6" />
          </Button>
        </div>
        <p className="text-center text-white/90">Safety checklists and incident reporting</p>
      </div>

      {/* Safety Checklists */}
      <div className="p-4 space-y-4">
        {safetyChecklists.map((checklist) => {
          const IconComponent = checklist.icon;
          const StatusIcon = getStatusIcon(checklist.status);
          const completedItems = checklist.items.filter(item => item.checked).length;
          const totalItems = checklist.items.length;

          return (
            <Card 
              key={checklist.id} 
              className="bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedChecklist(checklist)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`${checklist.color} p-3 rounded-xl`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{checklist.title}</h3>
                      <p className="text-sm text-gray-600">{checklist.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge className={`${getStatusColor(checklist.status)} text-white mb-2`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {checklist.status}
                    </Badge>
                    <div className="text-sm text-gray-600">
                      {completedItems}/{totalItems}
                    </div>
                  </div>
                </div>
                
                {checklist.lastCompleted && (
                  <div className="text-xs text-gray-500">
                    Last completed: {checklist.lastCompleted}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Incident Report Button */}
        <Card 
          className="bg-red-50 border-red-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
          onClick={() => setShowIncidentForm(true)}
        >
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-red-500 p-3 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800">Incident Report Form</h3>
                <p className="text-sm text-red-600">Report injuries or other incidents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
