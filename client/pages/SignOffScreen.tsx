import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
  Check,
} from "lucide-react";

interface ValidationStatus {
  udfCompleted: boolean;
  imagesUploaded: boolean;
  stockUsed: boolean;
  noStockUsed: boolean;
  digitalSignature: boolean;
}

export default function SignOffScreen() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [currentTab, setCurrentTab] = useState("signoff");
  const [validation, setValidation] = useState<ValidationStatus>({
    udfCompleted: false,
    imagesUploaded: false,
    stockUsed: false,
    noStockUsed: false,
    digitalSignature: false,
  });

  // Mock data - in real app this would come from job context
  const jobData = {
    id: "SA-689001",
    udfFields: 3,
    completedUdf: 2,
    requiredImages: 5,
    uploadedImages: 3,
    stockItems: [
      { item: "Fiber Optic Cable", quantity: 10, used: 8, required: true },
      { item: "Splice Protectors", quantity: 4, used: 4, required: true },
      { item: "Warning Tape", quantity: 1, used: 1, required: false },
    ],
  };

  useEffect(() => {
    // Initialize canvas for signature
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000";
      }
    }
  }, []);

  // Update validation status based on job data
  useEffect(() => {
    setValidation(prev => ({
      ...prev,
      udfCompleted: jobData.completedUdf >= jobData.udfFields,
      imagesUploaded: jobData.uploadedImages >= jobData.requiredImages,
      stockUsed: jobData.stockItems.some(item => item.used > 0),
    }));
  }, []);

  const getValidationIcon = (isValid: boolean) => {
    return isValid ? (
      <Check className="h-4 w-4 text-green-500" />
    ) : (
      <AlertTriangle className="h-4 w-4 text-orange-500" />
    );
  };

  const canSignOff = () => {
    const requiredValidations = [
      validation.udfCompleted,
      validation.imagesUploaded,
      (validation.stockUsed || validation.noStockUsed),
      validation.digitalSignature
    ];
    return requiredValidations.every(Boolean);
  };

  // Signature canvas handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    
    setHasSignature(true);
    setValidation(prev => ({ ...prev, digitalSignature: true }));
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setHasSignature(false);
    setValidation(prev => ({ ...prev, digitalSignature: false }));
  };

  const handleSave = () => {
    console.log("Saving sign off...");
    // Save signature and current state
  };

  const handleComplete = () => {
    if (!canSignOff()) {
      alert("Please complete all required fields before signing off.");
      return;
    }
    
    console.log("Completing job...");
    // Mark job as completed and remove clock out button
    localStorage.setItem(`job_${jobData.id}_completed`, 'true');
    localStorage.setItem(`job_${jobData.id}_signoff_time`, new Date().toISOString());
    
    navigate('/');
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    switch (tab) {
      case "details":
        navigate('/technician/jobs');
        break;
      case "udf":
        navigate('/technician/udf');
        break;
      case "gallery":
        navigate('/technician/gallery');
        break;
      case "stocks":
        navigate('/technician/stock');
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
            <p className="text-sm opacity-90">Job #{jobData.id}</p>
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
        {/* Validation Checklist */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-4 text-gray-800">Sign Off Requirements</h3>
            <div className="space-y-3">
              {/* UDF Fields */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getValidationIcon(validation.udfCompleted)}
                  <span className="text-sm">UDF Fields Completed</span>
                </div>
                <Badge variant={validation.udfCompleted ? "default" : "secondary"}>
                  {jobData.completedUdf}/{jobData.udfFields}
                </Badge>
              </div>

              {/* Images Uploaded */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getValidationIcon(validation.imagesUploaded)}
                  <span className="text-sm">Images Uploaded</span>
                </div>
                <Badge variant={validation.imagesUploaded ? "default" : "secondary"}>
                  {jobData.uploadedImages}/{jobData.requiredImages}
                </Badge>
              </div>

              {/* Stock Usage */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getValidationIcon(validation.stockUsed || validation.noStockUsed)}
                  <span className="text-sm">Stock Usage Recorded</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="no-stock"
                    checked={validation.noStockUsed}
                    onCheckedChange={(checked) =>
                      setValidation(prev => ({ ...prev, noStockUsed: !!checked }))
                    }
                  />
                  <label htmlFor="no-stock" className="text-xs">No stock used</label>
                </div>
              </div>

              {/* Digital Signature */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getValidationIcon(validation.digitalSignature)}
                  <span className="text-sm">Digital Signature</span>
                </div>
                <Badge variant={validation.digitalSignature ? "default" : "secondary"}>
                  {validation.digitalSignature ? "Signed" : "Required"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock Summary */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 text-gray-800">Stock Used</h3>
            <div className="space-y-2">
              {jobData.stockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{item.item}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">{item.used}/{item.quantity}</span>
                    {item.used > 0 && <Check className="h-4 w-4 text-green-500" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Signature Area */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Digital Signature</h3>
              {hasSignature && (
                <Button variant="outline" size="sm" onClick={clearSignature}>
                  Clear
                </Button>
              )}
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 relative">
              <canvas
                ref={canvasRef}
                width={320}
                height={160}
                className="w-full cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-gray-500 text-lg">Sign Here</p>
                </div>
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
            className={`flex-1 py-4 text-lg font-semibold ${
              canSignOff() 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleComplete}
            disabled={!canSignOff()}
          >
            Sign Off Job
            <CheckCircle className="h-5 w-5 ml-2" />
          </Button>
        </div>

        {!canSignOff() && (
          <div className="text-center">
            <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
              Complete all requirements above to enable sign off
            </p>
          </div>
        )}
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
