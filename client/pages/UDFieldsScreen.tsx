import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  X,
  ChevronUp,
  ChevronDown,
  Trash2,
  RefreshCw,
} from "lucide-react";

export default function UDFieldsScreen() {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    faultDetails: true,
    planning: false,
  });

  const [formData, setFormData] = useState({
    resolution: "",
    fixType: "",
    maintenanceIssueClass: "",
    maintenanceClassIssue: "",
    resolutionComments: "",
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleUpdate = () => {
    console.log("Updating UD Fields:", formData);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">UD Fields</h1>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full h-10 w-10"
            onClick={() => navigate('/')}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-24 space-y-4">
        {/* FTTH Maintenance - Fault Details */}
        <Card>
          <CardContent className="p-0">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleSection('faultDetails')}
            >
              <h3 className="font-semibold">FTTH Maintenance - Fault Details</h3>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
                {expandedSections.faultDetails ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
            
            {expandedSections.faultDetails && (
              <div className="px-4 pb-4 space-y-4 border-t">
                {/* Resolution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resolution
                  </label>
                  <Select
                    value={formData.resolution}
                    onValueChange={(value) => handleInputChange('resolution', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="unresolved">Unresolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Fix Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fix Type
                  </label>
                  <Select
                    value={formData.fixType}
                    onValueChange={(value) => handleInputChange('fixType', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="permanent">Permanent</SelectItem>
                      <SelectItem value="temporary">Temporary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Maintenance Issue Class */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maintenance Issue Class
                  </label>
                  <Select
                    value={formData.maintenanceIssueClass}
                    onValueChange={(value) => handleInputChange('maintenanceIssueClass', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="isp-exposed-cables">ISP - Exposed Cables</SelectItem>
                      <SelectItem value="isp-drop-cable-broken">ISP - Drop Cable Broken</SelectItem>
                      <SelectItem value="isp-drop-cable-connector-broken">ISP - Drop Cable Connector broken</SelectItem>
                      <SelectItem value="isp-drop-cable-high-losses">ISP - Drop Cable High Losses</SelectItem>
                      <SelectItem value="isp-incorrect-not-patched">ISP - Incorrect/Not Patched</SelectItem>
                      <SelectItem value="isp-cpe-ont-faulty">ISP - CPE/ONT Faulty</SelectItem>
                      <SelectItem value="isp-cpe-ont-reboot-off">ISP - CPE/ONT Reboot/Off</SelectItem>
                      <SelectItem value="isp-cpe-sfp-faulty">ISP - CPE SFP Faulty</SelectItem>
                      <SelectItem value="isp-cpe-move">ISP - CPE Move</SelectItem>
                      <SelectItem value="isp-router-faulty">ISP - Router Faulty</SelectItem>
                      <SelectItem value="isp-router-reboot-off">ISP - Router Reboot/Off</SelectItem>
                      <SelectItem value="isp-ups-issue">ISP - UPS Issue</SelectItem>
                      <SelectItem value="osp-pop-faulty-patch-lead">OSP - POP Faulty Patch Lead</SelectItem>
                      <SelectItem value="osp-pop-incorrect-patch">OSP - POP Incorrect Patch</SelectItem>
                      <SelectItem value="osp-pop-faulty-sfp">OSP - POP Faulty SFP</SelectItem>
                      <SelectItem value="osp-pop-switch-offline-faulty">OSP - POP Switch Offline/Faulty</SelectItem>
                      <SelectItem value="osp-pop-not-patched">OSP - POP Not Patched</SelectItem>
                      <SelectItem value="osp-ag-not-patched">OSP - AG Not Patched</SelectItem>
                      <SelectItem value="osp-ag-incorrect-patch">OSP - AG Incorrect Patch</SelectItem>
                      <SelectItem value="osp-ag-faulty-patch-lead">OSP - AG Faulty Patch Lead</SelectItem>
                      <SelectItem value="osp-high-losses">OSP - High Losses</SelectItem>
                      <SelectItem value="osp-faulty-field-splitter">OSP - Faulty field splitter</SelectItem>
                      <SelectItem value="osp-fibre-broken-distribution-run">OSP - Fibre Broken on Distribution run</SelectItem>
                      <SelectItem value="osp-fibre-broken-mdu-dist-box-ndp">OSP - Fibre Broken in MDU Dist Box/NDP</SelectItem>
                      <SelectItem value="osp-fibre-broken-joint">OSP - Fibre Broken in Joint</SelectItem>
                      <SelectItem value="osp-fibre-damaged-ctp">OSP - Fibre Damaged at CTP</SelectItem>
                      <SelectItem value="osp-fibre-broken-wall-box">OSP - Fibre broken in Wall box</SelectItem>
                      <SelectItem value="osp-wallbox-incorrect-patch">OSP - Wallbox Incorrect Patch</SelectItem>
                      <SelectItem value="osp-wallbox-not-patched">OSP - Wallbox Not Patched</SelectItem>
                      <SelectItem value="osp-wallbox-move">OSP - Wallbox Move</SelectItem>
                      <SelectItem value="osp-civil-works-issue">OSP - Civil Works Issue</SelectItem>
                      <SelectItem value="service-activation-network-identifier-confirmation">Service activation - Network Identifier Confirmation</SelectItem>
                      <SelectItem value="internet-service-provider-issue">Internet Service Provider Issue</SelectItem>
                      <SelectItem value="no-fault-handed-back">No Fault Handed Back</SelectItem>
                      <SelectItem value="change-completed">Change Completed</SelectItem>
                      <SelectItem value="nwi-resolved">NWI Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Maintenance Class Issue */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maintenance Class Issue
                  </label>
                  <Select
                    value={formData.maintenanceClassIssue}
                    onValueChange={(value) => handleInputChange('maintenanceClassIssue', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="poor-installation-quality">Poor Installation Quality</SelectItem>
                      <SelectItem value="self-inflicted-poor-installation">Self Inflicted due to poor Installation</SelectItem>
                      <SelectItem value="self-inflicted-gardening-dogs">Self inflicted (gardening, dogs, etc)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Resolution Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resolution Comments
                  </label>
                  <Textarea
                    placeholder="Write here..."
                    value={formData.resolutionComments}
                    onChange={(e) => handleInputChange('resolutionComments', e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* FTTH Maintenance - Planning */}
        <Card>
          <CardContent className="p-0">
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => toggleSection('planning')}
            >
              <h3 className="font-semibold">FTTH Maintenance - Planning</h3>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
                {expandedSections.planning ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>
            
            {expandedSections.planning && (
              <div className="px-4 pb-4 border-t">
                <p className="text-gray-500 text-center py-8">
                  Expand to view planning details...
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button 
          onClick={handleUpdate}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-semibold"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Update
        </Button>
      </div>
    </div>
  );
}
