import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/components/ui/notification";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  RefreshCw,
} from "lucide-react";

export default function SignOffScreen() {
  const navigate = useNavigate();
  const { success, error } = useNotification();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentTab, setCurrentTab] = useState("signoff");

  // Digital signature state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  // Validation state
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [noStockUsed, setNoStockUsed] = useState(false);

  // Mock validation data - in real app this would come from API/state
  const [udfCompleted, setUdfCompleted] = useState(false);
  const [stockUpdated, setStockUpdated] = useState(false);
  const [imagesUploaded, setImagesUploaded] = useState(false);

  // Digital signature functions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x =
      "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y =
      "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x =
      "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y =
      "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
      setHasSigned(true);
    }
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
        setHasSigned(false);
      }
    }
  };

  // Check completion status from localStorage/API
  useEffect(() => {
    const checkCompletionStatus = () => {
      // Check UDF completion - in real app, this would check actual UDF data
      const udfData = localStorage.getItem("udf-completed");
      setUdfCompleted(!!udfData);

      // Check images uploaded - check gallery or image storage
      const imageData = localStorage.getItem("job-images");
      setImagesUploaded(!!imageData);

      // Check stock usage - check if any stock was recorded
      const stockUsage = localStorage.getItem("stock-usage-list");
      setStockUpdated(!!stockUsage);
    };

    checkCompletionStatus();
  }, []);

  // Validation functions
  const checkValidation = async () => {
    setIsValidating(true);
    const errors: string[] = [];

    // Check UDF completion
    if (!udfCompleted) {
      errors.push("UDF fields must be completed and saved");
    }

    // Check images uploaded
    if (!imagesUploaded) {
      errors.push("At least one image must be uploaded to gallery");
    }

    // Check stock status
    if (!stockUpdated && !noStockUsed) {
      errors.push("Stock usage must be recorded or marked as 'No stock used'");
    }

    // Check digital signature
    if (!hasSigned) {
      errors.push("Digital signature is required");
    }

    // Check terms acceptance
    if (!termsAccepted) {
      errors.push("Terms & Conditions must be accepted");
    }

    setValidationErrors(errors);
    setIsValidating(false);

    return errors.length === 0;
  };

  const handleSave = async () => {
    console.log("Saving sign off...");
    // Save current state without full validation
  };

  const handleComplete = async () => {
    const isValid = await checkValidation();

    if (isValid) {
      console.log("Completing job...");
      // Get signature data
      const canvas = canvasRef.current;
      const signatureData = canvas?.toDataURL();

      // In real app, send to API
      console.log("Signature data:", signatureData);

      success("Success", "Job completed successfully!");
      navigate("/", { state: { message: "Job completed successfully!" } });
    } else {
      // Show validation errors as notifications
      validationErrors.forEach((errorMsg) => {
        error("Validation Error", errorMsg);
      });
    }
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    // Get current job ID from localStorage or default to 1
    const currentJobId = localStorage.getItem("currentJobId") || "1";

    switch (tab) {
      case "details":
        navigate("/technician/jobs");
        break;
      case "udf":
        navigate("/technician/udf");
        break;
      case "gallery":
        navigate("/technician/gallery");
        break;
      case "stocks":
        navigate("/technician/stock");
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
              onClick={() => navigate("/")}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-32 space-y-6">
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-800 mb-2">
                    Please complete the following:
                  </h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Signature Area */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">
                  Digital Signature
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSignature}
                  disabled={!hasSigned}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
              <div
                className={`border-2 border-dashed rounded-lg bg-white relative ${hasSigned ? "border-green-500" : "border-gray-300"}`}
              >
                <canvas
                  ref={canvasRef}
                  width={300}
                  height={150}
                  className="w-full h-40 cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                />
                {!hasSigned && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-gray-500 text-lg">Sign here</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Validation Checklist */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-gray-800">
              Pre-completion Checklist
            </h3>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${udfCompleted ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <CheckCircle
                    className={`h-4 w-4 ${udfCompleted ? "text-white" : "text-gray-500"}`}
                  />
                </div>
                <span
                  className={`${udfCompleted ? "text-gray-800" : "text-gray-500"} font-medium`}
                >
                  UDF fields completed and updated
                </span>
                {!udfCompleted && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/technician/udf")}
                  >
                    Go to UDF
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${stockUpdated || noStockUsed ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <CheckCircle
                    className={`h-4 w-4 ${stockUpdated || noStockUsed ? "text-white" : "text-gray-500"}`}
                  />
                </div>
                <span
                  className={`${stockUpdated || noStockUsed ? "text-gray-800" : "text-gray-500"} font-medium`}
                >
                  Stock status confirmed
                </span>
                {!stockUpdated && !noStockUsed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/technician/stock")}
                  >
                    Go to Stock
                  </Button>
                )}
              </div>

              <div className="flex items-center space-x-3 ml-8">
                <Checkbox
                  checked={noStockUsed}
                  onCheckedChange={(checked) => setNoStockUsed(!!checked)}
                  disabled={stockUpdated}
                />
                <span className="text-sm text-gray-600">
                  No stock used for this job
                </span>
              </div>

              <div className="flex items-center space-x-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${hasSigned ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <CheckCircle
                    className={`h-4 w-4 ${hasSigned ? "text-white" : "text-gray-500"}`}
                  />
                </div>
                <span
                  className={`${hasSigned ? "text-gray-800" : "text-gray-500"} font-medium`}
                >
                  Digital signature provided
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <Checkbox
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(!!checked)}
              />
              <div>
                <p className="text-gray-800 font-medium mb-2">
                  I accept the Terms & Conditions
                </p>
                <p className="text-sm text-gray-600">
                  By checking this box, I confirm that I have completed all
                  required tasks for this job and accept responsibility for the
                  work performed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo/Testing Controls - Remove in production */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-800 mb-3">
              Demo Controls (Testing Only)
            </h4>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUdfCompleted(!udfCompleted)}
                className="text-blue-700 border-blue-300"
              >
                Toggle UDF: {udfCompleted ? "Complete" : "Incomplete"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStockUpdated(!stockUpdated)}
                className="text-blue-700 border-blue-300"
              >
                Toggle Stock: {stockUpdated ? "Updated" : "Pending"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button
            variant="outline"
            className="flex-1 py-4 text-lg font-semibold border-2"
            onClick={handleSave}
            disabled={isValidating}
          >
            <Save className="h-5 w-5 mr-2" />
            Save
          </Button>
          <Button
            className="flex-1 py-4 text-lg font-semibold bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400"
            onClick={handleComplete}
            disabled={isValidating || validationErrors.length > 0}
          >
            {isValidating ? (
              <>
                <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                Complete
                <CheckCircle className="h-5 w-5 ml-2" />
              </>
            )}
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
