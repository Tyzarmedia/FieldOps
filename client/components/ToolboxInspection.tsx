import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Eye,
  AlertTriangle,
  User,
  Download,
  CheckCircle,
} from "lucide-react";
import ToolInspectionBox, { Tool } from "./ToolInspectionBox";

export interface Toolbox {
  technicianId: string;
  technicianName: string;
  department: string;
  inspectionDate: string;
  totalTools: number;
  goodCondition: number;
  damaged: number;
  missing: number;
  overallScore: number;
  tools: Tool[];
  imagesUploaded: number;
  imagesRequired: number;
}

export interface ToolboxInspectionProps {
  toolbox: Toolbox;
  showImageUploadStatus?: boolean;
  onViewDetails?: (toolbox: Toolbox) => void;
  onReportIssues?: (toolbox: Toolbox) => void;
  onReassignTools?: (toolbox: Toolbox) => void;
  onExportReport?: (toolbox: Toolbox) => void;
}

export const ToolboxInspection: React.FC<ToolboxInspectionProps> = ({
  toolbox,
  showImageUploadStatus = true,
  onViewDetails,
  onReportIssues,
  onReassignTools,
  onExportReport,
}) => {
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());

  const toggleTool = (toolId: string) => {
    const newExpanded = new Set(expandedTools);
    if (newExpanded.has(toolId)) {
      newExpanded.delete(toolId);
    } else {
      newExpanded.add(toolId);
    }
    setExpandedTools(newExpanded);
  };

  const handleToolImageClick = (tool: Tool) => {
    // Additional logic for when tool image is clicked can be added here
    console.log("Tool image clicked:", tool);
  };

  // Calculate image upload stats
  const imageUploadProgress =
    toolbox.imagesRequired > 0
      ? Math.round((toolbox.imagesUploaded / toolbox.imagesRequired) * 100)
      : 100;

  const getImageUploadBadgeVariant = () => {
    if (toolbox.imagesUploaded === toolbox.imagesRequired) return "default";
    if (toolbox.imagesUploaded === 0) return "destructive";
    return "secondary";
  };

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {toolbox.technicianName}'s Toolbox
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {toolbox.department} • Inspected:{" "}
              {new Date(toolbox.inspectionDate).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{toolbox.overallScore}%</div>
            <p className="text-xs text-muted-foreground">Overall Score</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">
              {toolbox.totalTools}
            </div>
            <p className="text-xs text-muted-foreground">Total Tools</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {toolbox.goodCondition}
            </div>
            <p className="text-xs text-muted-foreground">Good Condition</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600">
              {toolbox.damaged}
            </div>
            <p className="text-xs text-muted-foreground">Damaged</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-yellow-600">
              {toolbox.missing}
            </div>
            <p className="text-xs text-muted-foreground">Missing</p>
          </div>
        </div>

        {/* Image Upload Progress (if enabled) */}
        {showImageUploadStatus && (
          <div className="flex items-center justify-between mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                Image Upload Progress:
              </span>
              <Badge variant={getImageUploadBadgeVariant()}>
                {toolbox.imagesUploaded}/{toolbox.imagesRequired} uploaded (
                {imageUploadProgress}%)
              </Badge>
            </div>
            {toolbox.imagesUploaded === toolbox.imagesRequired && (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {/* Tools Grid - Now with dropdown functionality */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
          {toolbox.tools.map((tool) => (
            <ToolInspectionBox
              key={tool.id}
              tool={tool}
              isExpanded={expandedTools.has(tool.id)}
              onToggle={() => toggleTool(tool.id)}
              onImageClick={() => handleToolImageClick(tool)}
              showImageUploadStatus={showImageUploadStatus}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="flex gap-2 flex-wrap">
            {toolbox.missing > 0 && (
              <Badge variant="destructive">{toolbox.missing} Missing</Badge>
            )}
            {toolbox.damaged > 0 && (
              <Badge variant="destructive">{toolbox.damaged} Damaged</Badge>
            )}
            {showImageUploadStatus &&
              toolbox.imagesUploaded < toolbox.imagesRequired && (
                <Badge variant="secondary">
                  {toolbox.imagesRequired - toolbox.imagesUploaded} Images
                  Pending
                </Badge>
              )}
            {toolbox.missing === 0 && toolbox.damaged === 0 && (
              <>
                <Badge variant="default">Complete Toolbox</Badge>
                {showImageUploadStatus &&
                  toolbox.imagesUploaded === toolbox.imagesRequired && (
                    <Badge variant="default">All Images Uploaded</Badge>
                  )}
              </>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => onViewDetails?.(toolbox)}>
                <Eye className="h-4 w-4 mr-2" />
                View Full Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onReportIssues?.(toolbox)}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Issues
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onReassignTools?.(toolbox)}>
                <User className="h-4 w-4 mr-2" />
                Reassign Tools
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExportReport?.(toolbox)}>
                <Download className="h-4 w-4 mr-2" />
                Export Toolbox Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToolboxInspection;
