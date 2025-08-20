import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Eye, AlertTriangle, Download, CheckCircle, FileText, Clock, User } from 'lucide-react';
import VehicleInspectionBox, { VehicleInspectionItem } from './VehicleInspectionBox';

export interface VehicleInspectionData {
  id: string;
  vehicleId: string;
  vehicleRegistration: string;
  type: string;
  status: 'in_progress' | 'completed' | 'failed' | 'scheduled';
  inspector: string;
  dateScheduled: string;
  dateCompleted?: string;
  items: VehicleInspectionItem[];
  overallScore: number;
  imagesUploaded: number;
  imagesRequired: number;
  aiAnalysis?: {
    detected: string[];
    confidence: number;
    recommendations: string[];
  };
}

export interface VehicleInspectionProps {
  inspection: VehicleInspectionData;
  showImageUploadStatus?: boolean;
  onViewDetails?: (inspection: VehicleInspectionData) => void;
  onReportIssues?: (inspection: VehicleInspectionData) => void;
  onExportReport?: (inspection: VehicleInspectionData) => void;
  onContinueInspection?: (inspection: VehicleInspectionData) => void;
}

export const VehicleInspection: React.FC<VehicleInspectionProps> = ({
  inspection,
  showImageUploadStatus = true,
  onViewDetails,
  onReportIssues,
  onExportReport,
  onContinueInspection
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemImageClick = (item: VehicleInspectionItem) => {
    console.log('Vehicle inspection item image clicked:', item);
  };

  // Calculate stats
  const passedItems = inspection.items.filter(item => item.status === 'pass').length;
  const failedItems = inspection.items.filter(item => item.status === 'fail').length;
  const attentionItems = inspection.items.filter(item => item.status === 'attention').length;
  const notCheckedItems = inspection.items.filter(item => item.status === 'not_checked').length;

  const imageUploadProgress = inspection.imagesRequired > 0 
    ? Math.round((inspection.imagesUploaded / inspection.imagesRequired) * 100)
    : 100;

  const getImageUploadBadgeVariant = () => {
    if (inspection.imagesUploaded === inspection.imagesRequired) return "default";
    if (inspection.imagesUploaded === 0) return "destructive";
    return "secondary";
  };

  const getStatusBadgeVariant = () => {
    switch (inspection.status) {
      case 'completed':
        return "default";
      case 'failed':
        return "destructive";
      case 'in_progress':
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = () => {
    switch (inspection.status) {
      case 'completed':
        return 'border-l-green-500';
      case 'failed':
        return 'border-l-red-500';
      case 'in_progress':
        return 'border-l-blue-500';
      default:
        return 'border-l-gray-500';
    }
  };

  return (
    <Card className={`border-l-4 ${getStatusColor()}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">
              {inspection.type} - {inspection.vehicleRegistration}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {inspection.inspector}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {new Date(inspection.dateScheduled).toLocaleDateString()}
              </div>
              <Badge variant={getStatusBadgeVariant()}>
                {inspection.status.replace('_', ' ').charAt(0).toUpperCase() + inspection.status.slice(1)}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {inspection.overallScore}%
            </div>
            <p className="text-xs text-muted-foreground">Overall Score</p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">
              {passedItems}
            </div>
            <p className="text-xs text-muted-foreground">Passed</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-red-600">
              {failedItems}
            </div>
            <p className="text-xs text-muted-foreground">Failed</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-yellow-600">
              {attentionItems}
            </div>
            <p className="text-xs text-muted-foreground">Attention</p>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-600">
              {notCheckedItems}
            </div>
            <p className="text-xs text-muted-foreground">Not Checked</p>
          </div>
        </div>

        {/* Image Upload Progress (if enabled) */}
        {showImageUploadStatus && (
          <div className="flex items-center justify-between mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Image Upload Progress:</span>
              <Badge variant={getImageUploadBadgeVariant()}>
                {inspection.imagesUploaded}/{inspection.imagesRequired} uploaded ({imageUploadProgress}%)
              </Badge>
            </div>
            {inspection.imagesUploaded === inspection.imagesRequired && (
              <CheckCircle className="h-5 w-5 text-green-600" />
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {/* Inspection Items by Category */}
        <div className="space-y-6">
          {['External', 'Mechanical', 'Electrical', 'Safety'].map((category) => {
            const categoryItems = inspection.items.filter(item => item.category === category);
            if (categoryItems.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                  {category}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryItems.map((item) => (
                    <VehicleInspectionBox
                      key={item.id}
                      item={item}
                      isExpanded={expandedItems.has(item.id)}
                      onToggle={() => toggleItem(item.id)}
                      onImageClick={() => handleItemImageClick(item)}
                      showImageUploadStatus={showImageUploadStatus}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-4 border-t mt-6">
          <div className="flex gap-2 flex-wrap">
            {failedItems > 0 && (
              <Badge variant="destructive">
                {failedItems} Failed Items
              </Badge>
            )}
            {attentionItems > 0 && (
              <Badge variant="secondary">
                {attentionItems} Need Attention
              </Badge>
            )}
            {showImageUploadStatus && inspection.imagesUploaded < inspection.imagesRequired && (
              <Badge variant="secondary">
                {inspection.imagesRequired - inspection.imagesUploaded} Images Pending
              </Badge>
            )}
            {failedItems === 0 && attentionItems === 0 && notCheckedItems === 0 && (
              <>
                <Badge variant="default">All Items Checked</Badge>
                {showImageUploadStatus && inspection.imagesUploaded === inspection.imagesRequired && (
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
              <DropdownMenuItem onClick={() => onViewDetails?.(inspection)}>
                <Eye className="h-4 w-4 mr-2" />
                View Full Details
              </DropdownMenuItem>
              {inspection.status === 'in_progress' && (
                <DropdownMenuItem onClick={() => onContinueInspection?.(inspection)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Continue Inspection
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onReportIssues?.(inspection)}>
                <AlertTriangle className="h-4 w-4 mr-2" />
                Report Issues
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExportReport?.(inspection)}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleInspection;
