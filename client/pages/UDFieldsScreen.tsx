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
    faultResolved: "",
    faultSolutionType: "",
    maintenanceIssueClass: "",
    techComments: "",
    rocComments: "",
    referenceNumber: "",
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
                {/* Fault Resolved */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fault Resolved
                  </label>
                  <Select 
                    value={formData.faultResolved} 
                    onValueChange={(value) => handleInputChange('faultResolved', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Fault Solution Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fault Solution Type
                  </label>
                  <Select 
                    value={formData.faultSolutionType} 
                    onValueChange={(value) => handleInputChange('faultSolutionType', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="replacement">Replacement</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="configuration">Configuration</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
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
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tech Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tech Comments
                  </label>
                  <Textarea
                    placeholder="Write here..."
                    value={formData.techComments}
                    onChange={(e) => handleInputChange('techComments', e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                {/* ROC Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ROC Comments
                  </label>
                  <Textarea
                    placeholder="Write here..."
                    value={formData.rocComments}
                    onChange={(e) => handleInputChange('rocComments', e.target.value)}
                    className="min-h-[80px] resize-none"
                  />
                </div>

                {/* Reference Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference Number
                  </label>
                  <Input
                    placeholder="Write here..."
                    value={formData.referenceNumber}
                    onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
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
