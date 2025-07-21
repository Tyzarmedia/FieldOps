import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Truck,
  Wrench,
  Camera,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Fuel,
  Settings,
  Shield,
} from "lucide-react";

interface InspectionItem {
  id: string;
  item: string;
  checked: boolean;
  status: 'ok' | 'needs-attention' | 'not-checked';
  notes?: string;
}

interface Inspection {
  id: string;
  title: string;
  icon: any;
  color: string;
  description: string;
  items: InspectionItem[];
  lastCompleted?: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export default function TechnicianFleetScreen() {
  const navigate = useNavigate();
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [showIncidentForm, setShowIncidentForm] = useState(false);

  const [inspections, setInspections] = useState<Inspection[]>([
    {
      id: "vehicle-inspection",
      title: "Vehicle Inspection",
      icon: Truck,
      color: "bg-blue-500",
      description: "Daily vehicle safety and condition check",
      status: "pending",
      items: [
        { id: "vi1", item: "Check tire pressure and condition", checked: false, status: 'not-checked' },
        { id: "vi2", item: "Inspect lights (headlights, taillights, indicators)", checked: false, status: 'not-checked' },
        { id: "vi3", item: "Check fluid levels (oil, coolant, brake fluid)", checked: false, status: 'not-checked' },
        { id: "vi4", item: "Test brakes functionality", checked: false, status: 'not-checked' },
        { id: "vi5", item: "Inspect windscreen and mirrors", checked: false, status: 'not-checked' },
        { id: "vi6", item: "Check seat belts and safety equipment", checked: false, status: 'not-checked' },
        { id: "vi7", item: "Verify first aid kit is present and stocked", checked: false, status: 'not-checked' },
        { id: "vi8", item: "Check fire extinguisher condition", checked: false, status: 'not-checked' },
        { id: "vi9", item: "Inspect vehicle exterior for damage", checked: false, status: 'not-checked' },
        { id: "vi10", item: "Test warning devices (horn, hazard lights)", checked: false, status: 'not-checked' },
      ]
    },
    {
      id: "tool-inspection",
      title: "Tool Inspection",
      icon: Wrench,
      color: "bg-green-500",
      description: "Daily tool and equipment safety check",
      status: "pending",
      items: [
        { id: "ti1", item: "Ladder condition and stability", checked: false, status: 'not-checked' },
        { id: "ti2", item: "Power tools electrical safety", checked: false, status: 'not-checked' },
        { id: "ti3", item: "Hand tools condition and cleanliness", checked: false, status: 'not-checked' },
        { id: "ti4", item: "Safety harness and fall protection", checked: false, status: 'not-checked' },
        { id: "ti5", item: "Measuring equipment calibration", checked: false, status: 'not-checked' },
        { id: "ti6", item: "Personal protective equipment", checked: false, status: 'not-checked' },
        { id: "ti7", item: "Communication devices functioning", checked: false, status: 'not-checked' },
        { id: "ti8", item: "Tool storage and organization", checked: false, status: 'not-checked' },
        { id: "ti9", item: "Emergency contact information accessible", checked: false, status: 'not-checked' },
        { id: "ti10", item: "Material handling equipment safe", checked: false, status: 'not-checked' },
      ]
    }
  ]);

  const handleInspectionItemUpdate = (inspectionId: string, itemId: string, status: 'ok' | 'needs-attention') => {
    setInspections(prev => prev.map(inspection => {
      if (inspection.id === inspectionId) {
        const updatedItems = inspection.items.map(item => 
          item.id === itemId ? { ...item, checked: true, status } : item
        );
        const completedItems = updatedItems.filter(item => item.checked).length;
        const totalItems = updatedItems.length;
        const inspectionStatus = completedItems === 0 ? 'pending' : 
                               completedItems === totalItems ? 'completed' : 'in-progress';
        
        return { ...inspection, items: updatedItems, status: inspectionStatus };
      }
      return inspection;
    }));
  };

  const handleCompleteInspection = (inspectionId: string) => {
    setInspections(prev => prev.map(inspection => {
      if (inspection.id === inspectionId) {
        return { 
          ...inspection, 
          status: 'completed',
          lastCompleted: new Date().toLocaleString()
        };
      }
      return inspection;
    }));
    setSelectedInspection(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getItemStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return 'bg-green-50 border-green-200';
      case 'needs-attention': return 'bg-orange-50 border-orange-200';
      default: return 'bg-white border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Clock;
      default: return FileText;
    }
  };

  // Incident Report Form (reuse from safety screen)
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
            <h1 className="text-xl font-semibold">Fleet Incident Report</h1>
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
                    <option>Vehicle Accident</option>
                    <option>Tool Malfunction</option>
                    <option>Equipment Damage</option>
                    <option>Vehicle Breakdown</option>
                    <option>Theft/Loss</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Vehicle/Equipment ID</label>
                  <input type="text" placeholder="Vehicle or equipment identifier" className="w-full p-2 border rounded-lg" />
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
                  <label className="block text-sm font-medium mb-2">Damage Assessment</label>
                  <textarea 
                    placeholder="Describe any damage to vehicle/equipment..." 
                    rows={3}
                    className="w-full p-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Estimated Cost</label>
                  <input type="number" placeholder="0.00" className="w-full p-2 border rounded-lg" />
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

  // Inspection Detail View
  if (selectedInspection) {
    const completedItems = selectedInspection.items.filter(item => item.checked).length;
    const totalItems = selectedInspection.items.length;
    const progress = (completedItems / totalItems) * 100;

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setSelectedInspection(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <h1 className="text-lg font-semibold">{selectedInspection.title}</h1>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <Camera className="h-6 w-6" />
            </Button>
          </div>

          <div className="text-center mb-4">
            <div className="text-2xl font-bold">{completedItems}/{totalItems}</div>
            <div className="text-sm opacity-90">Items Checked</div>
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
                {selectedInspection.items.map((item) => (
                  <div 
                    key={item.id}
                    className={`p-3 rounded-lg border ${getItemStatusColor(item.status)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-gray-800 flex-1">{item.item}</p>
                      {item.checked && (
                        <Badge className={item.status === 'ok' ? 'bg-green-500' : 'bg-orange-500'}>
                          {item.status === 'ok' ? 'OK' : 'Needs Attention'}
                        </Badge>
                      )}
                    </div>
                    
                    {!item.checked && (
                      <div className="flex space-x-2 mt-2">
                        <Button
                          size="sm"
                          onClick={() => handleInspectionItemUpdate(selectedInspection.id, item.id, 'ok')}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          OK
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleInspectionItemUpdate(selectedInspection.id, item.id, 'needs-attention')}
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Needs Attention
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 flex space-x-4">
                <Button 
                  onClick={() => handleCompleteInspection(selectedInspection.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={completedItems < totalItems}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Inspection
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setSelectedInspection(null)}
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

  // Main Fleet Screen
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => navigate('/technician')}
          >
            <X className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Fleet</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <Truck className="h-6 w-6" />
          </Button>
        </div>
        <p className="text-center text-white/90">Vehicle and tool inspections</p>
      </div>

      {/* Inspections */}
      <div className="p-4 space-y-4">
        {inspections.map((inspection) => {
          const IconComponent = inspection.icon;
          const StatusIcon = getStatusIcon(inspection.status);
          const completedItems = inspection.items.filter(item => item.checked).length;
          const totalItems = inspection.items.length;

          return (
            <Card 
              key={inspection.id} 
              className="bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedInspection(inspection)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`${inspection.color} p-3 rounded-xl`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{inspection.title}</h3>
                      <p className="text-sm text-gray-600">{inspection.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <Badge className={`${getStatusColor(inspection.status)} text-white mb-2`}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {inspection.status}
                    </Badge>
                    <div className="text-sm text-gray-600">
                      {completedItems}/{totalItems}
                    </div>
                  </div>
                </div>
                
                {inspection.lastCompleted && (
                  <div className="text-xs text-gray-500">
                    Last completed: {inspection.lastCompleted}
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
                <h3 className="font-semibold text-red-800">Fleet Incident Report</h3>
                <p className="text-sm text-red-600">Report vehicle or equipment incidents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
