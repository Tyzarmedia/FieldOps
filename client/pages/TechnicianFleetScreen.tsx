import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Calendar,
  Hash,
  Upload,
  Play,
  Heart,
} from "lucide-react";

interface InspectionItem {
  id: string;
  item: string;
  checked: boolean;
  status: 'ok' | 'needs-attention' | 'not-checked';
  notes?: string;
  requiresImage?: boolean;
  image?: string;
  serialNumber?: string;
  expiryDate?: string;
  requiresSerial?: boolean;
  requiresExpiry?: boolean;
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
  const [showCamera, setShowCamera] = useState(false);
  const [currentItemForImage, setCurrentItemForImage] = useState<{inspectionId: string, itemId: string} | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);

  const [inspections, setInspections] = useState<Inspection[]>([
    {
      id: "harness-checklist",
      title: "Harness Checklist",
      icon: Shield,
      color: "bg-red-500",
      description: "Safety harness and fall protection equipment check",
      status: "pending",
      items: [
        { id: "h1", item: "Full body harness condition", checked: false, status: 'not-checked', requiresSerial: true, requiresExpiry: true },
        { id: "h2", item: "Webbing straps for cuts, frays or damage", checked: false, status: 'not-checked', requiresSerial: true, requiresExpiry: true },
        { id: "h3", item: "Hardware (buckles, D-rings) for damage", checked: false, status: 'not-checked', requiresSerial: true, requiresExpiry: true },
        { id: "h4", item: "Stitching integrity on all connections", checked: false, status: 'not-checked', requiresSerial: true, requiresExpiry: true },
        { id: "h5", item: "Lanyard condition and connections", checked: false, status: 'not-checked', requiresSerial: true, requiresExpiry: true },
        { id: "h6", item: "Shock absorber pack inspection", checked: false, status: 'not-checked', requiresSerial: true, requiresExpiry: true },
        { id: "h7", item: "Carabiner gate function and locking", checked: false, status: 'not-checked', requiresSerial: true, requiresExpiry: true },
        { id: "h8", item: "Labels and certification tags present", checked: false, status: 'not-checked', requiresSerial: true, requiresExpiry: true },
      ]
    },
    {
      id: "fire-extinguisher-checklist",
      title: "Fire Extinguisher Checklist",
      icon: AlertTriangle,
      color: "bg-red-600",
      description: "Fire extinguisher safety and condition check",
      status: "pending",
      items: [
        { id: "fe1", item: "Pressure gauge reading in green zone", checked: false, status: 'not-checked', requiresSerial: true, requiresExpiry: true },
        { id: "fe2", item: "Safety pin and tamper seal intact", checked: false, status: 'not-checked', requiresSerial: true, requiresExpiry: true },
        { id: "fe3", item: "Cylinder exterior condition (no dents/corrosion)", checked: false, status: 'not-checked', requiresSerial: true, requiresExpiry: true },
        { id: "fe4", item: "Hose and nozzle condition", checked: false, status: 'not-checked', requiresSerial: true, requiresExpiry: true },
        { id: "fe5", item: "Mounting bracket secure", checked: false, status: 'not-checked', requiresSerial: true, requiresExpiry: true },
        { id: "fe6", item: "Inspection tag up to date", checked: false, status: 'not-checked', requiresSerial: true, requiresExpiry: true },
        { id: "fe7", item: "Location accessible and unobstructed", checked: false, status: 'not-checked', requiresSerial: true, requiresExpiry: true },
      ]
    },
    {
      id: "first-aid-checklist",
      title: "First Aid Kit Checklist",
      icon: Heart,
      color: "bg-green-600",
      description: "First aid kit contents and expiry check",
      status: "pending",
      items: [
        { id: "fa1", item: "Adhesive bandages (various sizes)", checked: false, status: 'not-checked', requiresExpiry: true },
        { id: "fa2", item: "Sterile gauze pads and rolls", checked: false, status: 'not-checked', requiresExpiry: true },
        { id: "fa3", item: "Medical tape", checked: false, status: 'not-checked', requiresExpiry: true },
        { id: "fa4", item: "Antiseptic wipes/solution", checked: false, status: 'not-checked', requiresExpiry: true },
        { id: "fa5", item: "Disposable gloves", checked: false, status: 'not-checked', requiresExpiry: true },
        { id: "fa6", item: "Scissors and tweezers", checked: false, status: 'not-checked', requiresExpiry: true },
        { id: "fa7", item: "Instant cold compress", checked: false, status: 'not-checked', requiresExpiry: true },
        { id: "fa8", item: "Emergency contact information", checked: false, status: 'not-checked', requiresExpiry: true },
        { id: "fa9", item: "First aid manual/instructions", checked: false, status: 'not-checked', requiresExpiry: true },
      ]
    },
    {
      id: "vehicle-inspection",
      title: "Vehicle Inspection",
      icon: Truck,
      color: "bg-blue-500",
      description: "Daily vehicle safety and condition check with images",
      status: "pending",
      items: [
        { id: "vi1", item: "Driver's License", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi2", item: "License Disk for the car", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi3", item: "Check tire pressure and condition", checked: false, status: 'not-checked' },
        { id: "vi4", item: "Front and rear lights", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi5", item: "Canopy condition", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi6", item: "Canopy lock", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi7", item: "Spare wheel lock", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi8", item: "Left side of the car", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi9", item: "Right side of the car", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi10", item: "Front view of car", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi11", item: "Rear view of car", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi12", item: "Hazard lights video (front and rear)", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi13", item: "Images of damaged items (if any)", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi14", item: "Odometer reading", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi15", item: "Driver tag with tag number", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi16", item: "Windscreen condition", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi17", item: "Passenger and driver windows", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi18", item: "Side mirrors condition", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi19", item: "Service book last dated stamp", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi20", item: "Opened canopy with packed tools", checked: false, status: 'not-checked', requiresImage: true },
        { id: "vi21", item: "Test brakes functionality", checked: false, status: 'not-checked' },
        { id: "vi22", item: "Check fluid levels (oil, coolant, brake fluid)", checked: false, status: 'not-checked' },
        { id: "vi23", item: "Interior cleanliness and condition", checked: false, status: 'not-checked' },
        { id: "vi24", item: "Exterior condition and cleanliness", checked: false, status: 'not-checked' },
      ]
    },
    {
      id: "tool-inspection",
      title: "Tool Inspection",
      icon: Wrench,
      color: "bg-green-500",
      description: "Tool and equipment safety check with images",
      status: "pending",
      items: [
        { id: "ti1", item: "Ladder condition and stability", checked: false, status: 'not-checked', requiresImage: true },
        { id: "ti2", item: "Power drill and bits", checked: false, status: 'not-checked', requiresImage: true },
        { id: "ti3", item: "Screwdrivers set", checked: false, status: 'not-checked', requiresImage: true },
        { id: "ti4", item: "Wrenches and spanners", checked: false, status: 'not-checked', requiresImage: true },
        { id: "ti5", item: "Wire strippers and cutters", checked: false, status: 'not-checked', requiresImage: true },
        { id: "ti6", item: "Measuring tape", checked: false, status: 'not-checked', requiresImage: true },
        { id: "ti7", item: "Cable tester/multimeter", checked: false, status: 'not-checked', requiresImage: true },
        { id: "ti8", item: "Safety helmet", checked: false, status: 'not-checked', requiresImage: true },
        { id: "ti9", item: "Safety gloves", checked: false, status: 'not-checked', requiresImage: true },
        { id: "ti10", item: "High-vis vest", checked: false, status: 'not-checked', requiresImage: true },
        { id: "ti11", item: "Tool box organization", checked: false, status: 'not-checked', requiresImage: true },
        { id: "ti12", item: "Communication radio", checked: false, status: 'not-checked', requiresImage: true },
        { id: "ti13", item: "Fiber optic equipment", checked: false, status: 'not-checked', requiresImage: true },
        { id: "ti14", item: "Network cables", checked: false, status: 'not-checked', requiresImage: true },
        { id: "ti15", item: "Crimping tools", checked: false, status: 'not-checked', requiresImage: true },
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
            onClick={() => navigate('/')}
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
