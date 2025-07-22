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
    // Check all validation requirements
    const validationErrors = [];

    if (!validationChecks.signatureCompleted) {
      validationErrors.push("Please complete the signature");
    }

    if (validationChecks.imagesUploaded < validationChecks.requiredImages) {
      validationErrors.push(`Please upload at least ${validationChecks.requiredImages} images (currently ${validationChecks.imagesUploaded})`);
    }

    if (!validationChecks.udfFieldsCompleted) {
      validationErrors.push("Please complete all UDF fields");
    }

    if (!validationChecks.stockAllocated && !noStockUsed) {
      validationErrors.push("Please allocate stock or check 'No stock used'");
    }

    if (validationErrors.length > 0) {
      setShowValidationDialog(true);
      return;
    }

    // All validations passed - complete the job
    console.log("Completing job...");
    alert("Job completed successfully and marked as closed!");
    navigate('/');
  };

  const handleNavigation = (section: string, route: string) => {
    setCurrentTab(section);
    if (route.startsWith("/")) {
      navigate(route);
    }
  };

  const handleSignature = () => {
    setIsSigned(true);
    // In real app, this would open signature pad
    alert("Signature captured!");
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
        {/* Validation Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Job Completion Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Images Uploaded</span>
              <Badge className={validationChecks.imagesUploaded >= validationChecks.requiredImages ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {validationChecks.imagesUploaded >= validationChecks.requiredImages ? (
                  <CheckCircle className="h-4 w-4 mr-1" />
                ) : (
                  <XCircle className="h-4 w-4 mr-1" />
                )}
                {validationChecks.imagesUploaded}/{validationChecks.requiredImages}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">UDF Fields Completed</span>
              <Badge className={validationChecks.udfFieldsCompleted ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {validationChecks.udfFieldsCompleted ? (
                  <CheckCircle className="h-4 w-4 mr-1" />
                ) : (
                  <XCircle className="h-4 w-4 mr-1" />
                )}
                {validationChecks.udfFieldsCompleted ? "Complete" : "Incomplete"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Stock Management</span>
              <Badge className={validationChecks.stockAllocated || noStockUsed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {validationChecks.stockAllocated || noStockUsed ? (
                  <CheckCircle className="h-4 w-4 mr-1" />
                ) : (
                  <XCircle className="h-4 w-4 mr-1" />
                )}
                {validationChecks.stockAllocated ? "Allocated" : noStockUsed ? "No Stock Used" : "Pending"}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Signature</span>
              <Badge className={isSigned ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {isSigned ? (
                  <CheckCircle className="h-4 w-4 mr-1" />
                ) : (
                  <XCircle className="h-4 w-4 mr-1" />
                )}
                {isSigned ? "Signed" : "Required"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Stock Option */}
        {!validationChecks.stockAllocated && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Checkbox
                  checked={noStockUsed}
                  onCheckedChange={setNoStockUsed}
                  id="no-stock"
                />
                <label htmlFor="no-stock" className="text-sm font-medium">
                  No stock was used for this job
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Signature Area */}
        <Card>
          <CardContent className="p-6">
            <div
              className={`border-2 border-dashed rounded-lg h-40 flex items-center justify-center cursor-pointer transition-colors ${
                isSigned
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400"
              }`}
              onClick={handleSignature}
            >
              {isSigned ? (
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-green-600 text-lg font-medium">Signature Captured</p>
                </div>
              ) : (
                <p className="text-gray-500 text-lg">TAP TO SIGN</p>
              )}
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

      {/* Validation Dialog */}
      <Dialog open={showValidationDialog} onOpenChange={setShowValidationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
              <span>Job Completion Requirements</span>
            </DialogTitle>
            <DialogDescription>
              Please complete the following requirements before signing off:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {!validationChecks.signatureCompleted && (
              <div className="flex items-center space-x-2 text-red-600">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">Complete the signature</span>
              </div>
            )}
            {validationChecks.imagesUploaded < validationChecks.requiredImages && (
              <div className="flex items-center space-x-2 text-red-600">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">Upload at least {validationChecks.requiredImages} images</span>
              </div>
            )}
            {!validationChecks.udfFieldsCompleted && (
              <div className="flex items-center space-x-2 text-red-600">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">Complete all UDF fields</span>
              </div>
            )}
            {!validationChecks.stockAllocated && !noStockUsed && (
              <div className="flex items-center space-x-2 text-red-600">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">Allocate stock or check 'No stock used'</span>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowValidationDialog(false)}>
              OK
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chat Button */}
      <div className="fixed bottom-32 right-6 z-50">
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-14 w-14 shadow-lg"
          onClick={() => navigate("/team-chat")}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>

      {/* Enhanced Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-orange-200 shadow-xl z-40">
        <div className="flex justify-around py-3 px-2">
          <Button
            variant="ghost"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
              currentTab === "details"
                ? "bg-orange-50 text-orange-600 border border-orange-200"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => handleNavigation("details", "/technician/jobs")}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs font-medium">Details</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
              currentTab === "udf"
                ? "bg-orange-50 text-orange-600 border border-orange-200"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => handleNavigation("udf", "/technician/udf")}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs font-medium">UDF</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
              currentTab === "gallery"
                ? "bg-orange-50 text-orange-600 border border-orange-200"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => handleNavigation("gallery", "/technician/gallery")}
          >
            <Camera className="h-5 w-5" />
            <span className="text-xs font-medium">Gallery</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
              currentTab === "stock"
                ? "bg-orange-50 text-orange-600 border border-orange-200"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => handleNavigation("stock", "/technician/stock")}
          >
            <Package className="h-5 w-5" />
            <span className="text-xs font-medium">Stock</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
              currentTab === "signoff"
                ? "bg-green-50 text-green-600 border border-green-200"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => handleNavigation("signoff", "")}
          >
            <PenTool className="h-5 w-5" />
            <span className="text-xs font-medium">Sign Off</span>
          </Button>
        </div>

        {/* Progress Indicator */}
        <div className="bg-gray-100 h-1">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300"
            style={{
              width: `${
                currentTab === "details" ? "20%" :
                currentTab === "udf" ? "40%" :
                currentTab === "gallery" ? "60%" :
                currentTab === "stock" ? "80%" :
                currentTab === "signoff" ? "100%" : "100%"
              }%`
            }}
          />
        </div>
      </div>
    </div>
  );
}
