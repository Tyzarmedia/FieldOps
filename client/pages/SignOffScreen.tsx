import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  // Digital signature functions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
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
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    const ctx = canvas.getContext('2d');
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
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasSigned(false);
      }
    }
  };

  // Validation functions
  const checkValidation = async () => {
    setIsValidating(true);
    const errors: string[] = [];

    // Check UDF completion
    if (!udfCompleted) {
      errors.push("UDF fields must be filled and updated");
    }

    // Check stock status
    if (!stockUpdated && !noStockUsed) {
      errors.push("Stock must be updated or marked as 'No stock used'");
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

      navigate('/', { state: { message: "Job completed successfully!" } });
    }
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
