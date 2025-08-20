import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertTriangle,
  X,
  Upload,
  Image as ImageIcon,
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

export interface Tool {
  id: string;
  name: string;
  condition: "Good" | "Damaged";
  status: "Present" | "Missing";
  imageUploaded: boolean;
  imageUrl?: string;
  inspectionDate?: string;
  notes?: string;
}

export interface ToolBoxProps {
  tool: Tool;
  isExpanded: boolean;
  onToggle: () => void;
  onImageClick?: () => void;
  showImageUploadStatus?: boolean;
  isClickable?: boolean;
}

export const ToolInspectionBox: React.FC<ToolBoxProps> = ({
  tool,
  isExpanded,
  onToggle,
  onImageClick,
  showImageUploadStatus = true,
  isClickable = true,
}) => {
  const [showImageOverlay, setShowImageOverlay] = useState(false);

  const getStatusColor = () => {
    if (tool.status === "Missing") return "border-yellow-300 bg-yellow-50";
    if (tool.condition === "Damaged") return "border-red-300 bg-red-50";
    return "border-green-300 bg-green-50";
  };

  const getUploadStatusColor = () => {
    if (!showImageUploadStatus) return "";
    return tool.imageUploaded ? "border-l-green-500" : "border-l-orange-500";
  };

  const handleImageClick = () => {
    if (tool.imageUploaded && tool.imageUrl) {
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
          {/* Tool Header - Always Visible */}
          <div
            className="flex items-center justify-between"
            onClick={isClickable ? onToggle : undefined}
          >
            <div className="flex items-center gap-2">
              <h5 className="font-medium text-sm">{tool.name}</h5>
              <div className="flex items-center gap-1">
                {tool.status === "Present" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                )}
                {showImageUploadStatus && tool.imageUploaded && (
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {showImageUploadStatus && (
                <Badge
                  variant={tool.imageUploaded ? "default" : "secondary"}
                  className="text-xs"
                >
                  {tool.imageUploaded ? "Uploaded" : "No Image"}
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
                Tool ID: {tool.id}
              </p>

              <div className="flex flex-wrap gap-1">
                <Badge
                  variant={
                    tool.status === "Present" ? "default" : "destructive"
                  }
                  className="text-xs"
                >
                  {tool.status}
                </Badge>
                <Badge
                  variant={
                    tool.condition === "Good" ? "default" : "destructive"
                  }
                  className="text-xs"
                >
                  {tool.condition}
                </Badge>
              </div>

              {tool.inspectionDate && (
                <p className="text-xs text-muted-foreground">
                  Last inspected:{" "}
                  {new Date(tool.inspectionDate).toLocaleDateString()}
                </p>
              )}

              {tool.notes && (
                <p className="text-xs text-muted-foreground">
                  Notes: {tool.notes}
                </p>
              )}

              {/* Image Section */}
              {showImageUploadStatus && (
                <div className="flex items-center gap-2">
                  {tool.imageUploaded ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleImageClick}
                      className="text-xs"
                    >
                      <ImageIcon className="h-3 w-3 mr-1" />
                      View Image
                    </Button>
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
            <div className="flex items-center justify-between">
              <DialogTitle>{tool.name} - Inspection Image</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowImageOverlay(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="p-6 pt-2">
            {tool.imageUrl ? (
              <div className="flex flex-col items-center">
                <img
                  src={tool.imageUrl}
                  alt={`${tool.name} inspection`}
                  className="max-w-full max-h-[60vh] object-contain rounded-lg"
                />
                <div className="mt-4 text-sm text-muted-foreground text-center">
                  <p>Tool: {tool.name}</p>
                  <p>ID: {tool.id}</p>
                  {tool.inspectionDate && (
                    <p>
                      Inspected:{" "}
                      {new Date(tool.inspectionDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No image available</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ToolInspectionBox;
