import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertTriangle,
  XCircle,
  X,
  Upload,
  Image as ImageIcon,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface VehicleInspectionItem {
  id: string;
  name: string;
  category: string;
  status: "pass" | "fail" | "attention" | "not_checked";
  notes: string;
  photos: string[];
  required: boolean;
  imageUploaded: boolean;
  inspectionDate?: string;
}

export interface VehicleInspectionBoxProps {
  item: VehicleInspectionItem;
  isExpanded: boolean;
  onToggle: () => void;
  onImageClick?: () => void;
  showImageUploadStatus?: boolean;
  isClickable?: boolean;
}

export const VehicleInspectionBox: React.FC<VehicleInspectionBoxProps> = ({
  item,
  isExpanded,
  onToggle,
  onImageClick,
  showImageUploadStatus = true,
  isClickable = true,
}) => {
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const getStatusColor = () => {
    switch (item.status) {
      case "pass":
        return "border-green-300 bg-green-50";
      case "fail":
        return "border-red-300 bg-red-50";
      case "attention":
        return "border-yellow-300 bg-yellow-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  const getUploadStatusColor = () => {
    if (!showImageUploadStatus) return "";
    return item.imageUploaded ? "border-l-green-500" : "border-l-orange-500";
  };

  const getStatusIcon = () => {
    switch (item.status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "fail":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "attention":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadgeVariant = () => {
    switch (item.status) {
      case "pass":
        return "default";
      case "fail":
        return "destructive";
      case "attention":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleImageClick = (index: number = 0) => {
    if (item.photos && item.photos.length > 0) {
      setSelectedImageIndex(index);
      setShowImageOverlay(true);
    }
    onImageClick?.();
  };

  return (
    <>
      <Card
        className={cn(
          "transition-all duration-200 border-l-4",
          getStatusColor(),
          getUploadStatusColor(),
          isClickable && "cursor-pointer hover:shadow-md",
        )}
      >
        <CardContent className="p-3">
          {/* Item Header - Always Visible */}
          <div
            className="flex items-center justify-between"
            onClick={isClickable ? onToggle : undefined}
          >
            <div className="flex items-center gap-2">
              <h5 className="font-medium text-sm">{item.name}</h5>
              <div className="flex items-center gap-1">
                {getStatusIcon()}
                {item.required && (
                  <Badge variant="outline" className="text-xs">
                    Required
                  </Badge>
                )}
                {showImageUploadStatus && item.imageUploaded && (
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusBadgeVariant()} className="text-xs">
                {item.status === "not_checked"
                  ? "Not Checked"
                  : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
              {showImageUploadStatus && (
                <Badge
                  variant={item.imageUploaded ? "default" : "secondary"}
                  className="text-xs"
                >
                  {item.imageUploaded ? "Uploaded" : "No Image"}
                </Badge>
              )}
              {isClickable &&
                (isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ))}
            </div>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="mt-3 space-y-3 border-t pt-3">
              <p className="text-xs text-muted-foreground">
                Category: {item.category} • ID: {item.id}
              </p>

              {item.inspectionDate && (
                <p className="text-xs text-muted-foreground">
                  Last inspected:{" "}
                  {new Date(item.inspectionDate).toLocaleDateString()}
                </p>
              )}

              {item.notes && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Notes:
                  </p>
                  <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                    {item.notes}
                  </p>
                </div>
              )}

              {/* Image Section */}
              {showImageUploadStatus && (
                <div className="flex items-center gap-2">
                  {item.imageUploaded &&
                  item.photos &&
                  item.photos.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {item.photos.map((photo, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleImageClick(index)}
                          className="text-xs"
                        >
                          <ImageIcon className="h-3 w-3 mr-1" />
                          Image {index + 1}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-orange-600">
                      <Upload className="h-3 w-3" />
                      Image required
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Overlay Dialog */}
      <Dialog open={showImageOverlay} onOpenChange={setShowImageOverlay}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>{item.name} - Inspection Images</DialogTitle>
          </DialogHeader>
          <div className="p-6 pt-2">
            {item.photos && item.photos.length > 0 ? (
              <div className="flex flex-col items-center">
                <img
                  src={item.photos[selectedImageIndex]}
                  alt={`${item.name} inspection ${selectedImageIndex + 1}`}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg"
                />
                {item.photos.length > 1 && (
                  <div className="flex gap-2 mt-4">
                    {item.photos.map((_, index) => (
                      <Button
                        key={index}
                        variant={
                          index === selectedImageIndex ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedImageIndex(index)}
                        className="text-xs"
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>
                )}
                <div className="mt-4 text-sm text-muted-foreground text-center">
                  <p>Item: {item.name}</p>
                  <p>Category: {item.category}</p>
                  <p>Status: {item.status}</p>
                  {item.inspectionDate && (
                    <p>
                      Inspected:{" "}
                      {new Date(item.inspectionDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No images available</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VehicleInspectionBox;
