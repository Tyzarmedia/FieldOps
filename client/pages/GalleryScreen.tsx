import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  X,
  Camera,
  Upload,
  Image as ImageIcon,
  FileText,
  Settings,
  Package,
  PenTool,
  Plus,
  Play,
  Trash2,
} from "lucide-react";

interface Photo {
  id: string;
  category:
    | "before-light-readings"
    | "image-fault"
    | "image-after-work"
    | "light-readings-after-work";
  url: string;
  timestamp: Date;
}

export default function GalleryScreen() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState("gallery");
  const [selectedCategory, setSelectedCategory] = useState<
    | "before-light-readings"
    | "image-fault"
    | "image-after-work"
    | "light-readings-after-work"
  >("before-light-readings");
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: "1",
      category: "before-light-readings",
      url: "/placeholder.svg",
      timestamp: new Date("2024-01-15T10:30:00"),
    },
    {
      id: "2",
      category: "image-fault",
      url: "/placeholder.svg",
      timestamp: new Date("2024-01-15T11:15:00"),
    },
  ]);

  const categories = [
    {
      id: "before-light-readings",
      label: "Before Light Readings",
      color: "bg-blue-500",
    },
    { id: "image-fault", label: "Image Fault", color: "bg-red-500" },
    {
      id: "image-after-work",
      label: "Image After Work",
      color: "bg-green-500",
    },
    {
      id: "light-readings-after-work",
      label: "Light Readings After Work",
      color: "bg-purple-500",
    },
  ];

  // Camera functionality
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    switch (tab) {
      case "details":
        navigate("/technician/jobs");
        break;
      case "udf":
        // Navigate to UDF screen when routes are set up
        break;
      case "gallery":
        // Already on gallery screen
        break;
      case "stocks":
        // Navigate to Stocks screen when routes are set up
        break;
      case "signoff":
        // Navigate to Sign Off screen when routes are set up
        break;
    }
  };

  // Camera access functions
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }, // Use back camera on mobile
        audio: false
      });
      setCurrentStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setShowCamera(true);
    } catch (error) {
      console.error("Error accessing camera:", error);
      // Fallback to file input if camera access fails
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const stopCamera = () => {
    if (currentStream) {
      currentStream.getTracks().forEach(track => track.stop());
      setCurrentStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = (category: "before-light-readings" | "image-fault" | "image-after-work" | "light-readings-after-work") => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);

        const newPhoto: Photo = {
          id: Date.now().toString(),
          category,
          url: imageDataUrl,
          timestamp: new Date(),
        };

        setPhotos((prev) => [...prev, newPhoto]);
        stopCamera();
      }
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, category: "before-light-readings" | "image-fault" | "image-after-work" | "light-readings-after-work") => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newPhoto: Photo = {
          id: Date.now().toString(),
          category,
          url: e.target?.result as string,
          timestamp: new Date(),
        };
        setPhotos((prev) => [...prev, newPhoto]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = (category: "before-light-readings" | "image-fault" | "image-after-work" | "light-readings-after-work") => {
    // Show options for camera or file selection
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      startCamera();
      setSelectedCategory(category);
    } else {
      // Fallback to file input for older browsers
      if (fileInputRef.current) {
        fileInputRef.current.onchange = (e) => handleFileSelect(e as any, category);
        fileInputRef.current.click();
      }
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
  };

  const filteredPhotos = photos.filter(
    (photo) => photo.category === selectedCategory,
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Gallery</h1>
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

      {/* Content */}
      <div className="p-4 pb-20">
        {/* Category Tabs - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className={`py-3 text-sm ${
                selectedCategory === category.id
                  ? `${category.color} hover:${category.color}/90 text-white`
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedCategory(category.id as any)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Upload Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            variant="outline"
            className="flex flex-col items-center py-4 h-auto border-2 border-dashed border-blue-500 text-blue-600 hover:bg-blue-50"
            onClick={() => handleUpload("before-light-readings")}
          >
            <Camera className="h-6 w-6 mb-2" />
            <span className="text-xs font-medium text-center">
              Before Light Readings
            </span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center py-4 h-auto border-2 border-dashed border-red-500 text-red-600 hover:bg-red-50"
            onClick={() => handleUpload("image-fault")}
          >
            <Camera className="h-6 w-6 mb-2" />
            <span className="text-xs font-medium text-center">Image Fault</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center py-4 h-auto border-2 border-dashed border-green-500 text-green-600 hover:bg-green-50"
            onClick={() => handleUpload("image-after-work")}
          >
            <Camera className="h-6 w-6 mb-2" />
            <span className="text-xs font-medium text-center">
              Image After Work
            </span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center py-4 h-auto border-2 border-dashed border-purple-500 text-purple-600 hover:bg-purple-50"
            onClick={() => handleUpload("light-readings-after-work")}
          >
            <Camera className="h-6 w-6 mb-2" />
            <span className="text-xs font-medium text-center">
              Light Readings After Work
            </span>
          </Button>
        </div>

        {/* Photos Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">
              {categories.find((c) => c.id === selectedCategory)?.label} Photos
              ({filteredPhotos.length})
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:bg-blue-50"
              onClick={() => handleUpload(selectedCategory)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {filteredPhotos.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No photos in this category yet</p>
                <Button
                  variant="outline"
                  className="mt-3"
                  onClick={() => handleUpload(selectedCategory)}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredPhotos.map((photo) => (
                <Card key={photo.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative aspect-square bg-gray-200">
                      <img
                        src={photo.url}
                        alt={`${photo.category} photo`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full p-0"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 bg-black/50 hover:bg-black/70 text-white rounded-full p-0"
                          onClick={() => handleDeletePhoto(photo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
                        <p className="text-xs">
                          {photo.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
