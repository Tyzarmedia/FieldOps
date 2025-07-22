import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  X,
  FileText,
  Clock,
  CheckCircle,
  Save,
  Settings,
  Camera,
  Package,
  PenTool,
  AlertTriangle,
  XCircle,
  MessageCircle,
} from "lucide-react";

export default function SignOffScreen() {
  const navigate = useNavigate();
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [currentTab, setCurrentTab] = useState("signoff");
  const [showValidationDialog, setShowValidationDialog] = useState(false);
  const [noStockUsed, setNoStockUsed] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  // Mock validation data (in real app this would come from API/state)
  const validationChecks = {
    imagesUploaded: 3, // Number of images uploaded
    requiredImages: 2, // Minimum required images
    udfFieldsCompleted: true, // Whether all UDF fields are filled
    stockAllocated: false, // Whether stock has been allocated
    signatureCompleted: isSigned, // Whether user has signed
  };

  const handleSave = () => {
    console.log("Saving sign off...");
  };

  const handleComplete = () => {
    console.log("Completing job...");
    navigate('/');
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    switch (tab) {
      case "details":
        navigate('/technician/jobs');
        break;
      case "udf":
        // Navigate to UDF screen when implemented
        break;
      case "gallery":
        // Navigate to Gallery screen when implemented
        break;
      case "stocks":
        // Navigate to Stocks screen when implemented
        break;
      case "signoff":
        // Already on sign off screen
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm opacity-90">Job</p>
            <h1 className="text-xl font-bold">Sign Off</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-full h-10 w-10"
            >
              <FileText className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-full h-10 w-10"
            >
              <Clock className="h-6 w-6" />
            </Button>
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
      </div>

      {/* Content */}
      <div className="p-4 pb-32 space-y-6">
        {/* Signature Area */}
        <Card>
          <CardContent className="p-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-40 flex items-center justify-center bg-gray-50">
              <p className="text-gray-500 text-lg">TAP TO SIGN</p>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="h-4 w-4 text-white" />
          </div>
          <span className="text-gray-800 font-medium">I accept the Terms & Conditions</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button
            variant="outline"
            className="flex-1 py-4 text-lg font-semibold border-2"
            onClick={handleSave}
          >
            <Save className="h-5 w-5 mr-2" />
            Save
          </Button>
          <Button
            className="flex-1 py-4 text-lg font-semibold bg-green-500 hover:bg-green-600 text-white"
            onClick={handleComplete}
          >
            Complete
            <CheckCircle className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          <Button
            variant="ghost"
            className={`flex flex-col items-center space-y-1 p-3 ${
              currentTab === "details" ? "text-blue-600" : "text-gray-600"
            }`}
            onClick={() => handleTabChange("details")}
          >
            <FileText className="h-6 w-6" />
            <span className="text-xs font-medium">Details</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center space-y-1 p-3 ${
              currentTab === "udf" ? "text-blue-600" : "text-gray-600"
            }`}
            onClick={() => handleTabChange("udf")}
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs font-medium">Udf</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center space-y-1 p-3 ${
              currentTab === "gallery" ? "text-blue-600" : "text-gray-600"
            }`}
            onClick={() => handleTabChange("gallery")}
          >
            <Camera className="h-6 w-6" />
            <span className="text-xs font-medium">Gallery</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center space-y-1 p-3 ${
              currentTab === "stocks" ? "text-blue-600" : "text-gray-600"
            }`}
            onClick={() => handleTabChange("stocks")}
          >
            <Package className="h-6 w-6" />
            <span className="text-xs font-medium">Stocks</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center space-y-1 p-3 ${
              currentTab === "signoff" ? "text-orange-600" : "text-gray-600"
            }`}
            onClick={() => handleTabChange("signoff")}
          >
            <PenTool className="h-6 w-6" />
            <span className="text-xs font-medium">Sign Off</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
