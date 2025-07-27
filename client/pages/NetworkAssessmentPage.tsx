import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Camera,
  Upload,
  Check,
  AlertTriangle,
  FileText,
  MapPin,
  Network,
  Save,
} from "lucide-react";

interface ImageField {
  id: string;
  label: string;
  uploaded: boolean;
  file?: File;
}

interface AssessmentData {
  networkArea: "core" | "reach" | "";
  networkType: "gpon" | "active" | "";
  
  // Reach specific fields
  manholeImages: {
    lockImage: ImageField;
    openedImage: ImageField;
    slackManagement: ImageField;
    insideManhole: ImageField;
    linkjointLabel: ImageField;
    linkjointLock: ImageField;
    linkjointTrayLids: ImageField[];
    manholeLabel: ImageField;
    manholeClosed: ImageField;
  };
  
  firstApAb: {
    opened: ImageField;
    slackManagement: ImageField;
    lightReadings: ImageField;
    closed: ImageField;
  };
  
  lastApAb: {
    opened: ImageField;
    slackManagement: ImageField;
    lightReadings: ImageField;
    closed: ImageField;
  };
  
  mljImages: {
    spliceAndCoiled1: ImageField;
    spliceAndCoiled2: ImageField;
  };
  
  // Core specific fields
  coreFields: {
    sdcCabinetPlan: ImageField;
    sdcLocking: ImageField;
    sdcPatches: ImageField;
    sdcCabinetClosed: ImageField;
    wallboxLightReadings: ImageField;
    wallboxSplice1: ImageField;
    wallboxSplice2: ImageField;
  };
  
  lightReadings: string;
  notes: string;
}

export default function NetworkAssessmentPage() {
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    networkArea: "",
    networkType: "",
    manholeImages: {
      lockImage: { id: "manhole_lock", label: "Manhole Lock Image", uploaded: false },
      openedImage: { id: "manhole_opened", label: "Manhole Opened Image", uploaded: false },
      slackManagement: { id: "slack_mgmt", label: "Slack Management Inside Manhole", uploaded: false },
      insideManhole: { id: "inside_manhole", label: "Inside Manhole", uploaded: false },
      linkjointLabel: { id: "linkjoint_label", label: "Linkjoint Label", uploaded: false },
      linkjointLock: { id: "linkjoint_lock", label: "Link Joint Lock and Lid", uploaded: false },
      linkjointTrayLids: [
        { id: "tray_bottom", label: "Link Joint Tray Lids (Bottom)", uploaded: false },
        { id: "tray_front", label: "Link Joint Tray Lids (Front)", uploaded: false },
      ],
      manholeLabel: { id: "manhole_label", label: "Manhole Lid Label", uploaded: false },
      manholeClosed: { id: "manhole_closed", label: "Manhole Closed", uploaded: false },
    },
    firstApAb: {
      opened: { id: "first_ap_opened", label: "First AP/AB Opened", uploaded: false },
      slackManagement: { id: "first_ap_slack", label: "First AP/AB Slack Management", uploaded: false },
      lightReadings: { id: "first_ap_light", label: "First AP/AB Light Readings", uploaded: false },
      closed: { id: "first_ap_closed", label: "First AP/AB Closed", uploaded: false },
    },
    lastApAb: {
      opened: { id: "last_ap_opened", label: "Last AP/AB Opened", uploaded: false },
      slackManagement: { id: "last_ap_slack", label: "Last AP/AB Slack Management", uploaded: false },
      lightReadings: { id: "last_ap_light", label: "Last AP/AB Light Readings", uploaded: false },
      closed: { id: "last_ap_closed", label: "Last AP/AB Closed", uploaded: false },
    },
    mljImages: {
      spliceAndCoiled1: { id: "mlj_splice1", label: "MLJ Splice and Coiled Loop 1", uploaded: false },
      spliceAndCoiled2: { id: "mlj_splice2", label: "MLJ Splice and Coiled Loop 2", uploaded: false },
    },
    coreFields: {
      sdcCabinetPlan: { id: "sdc_plan", label: "SDC/Cabinet Plan", uploaded: false },
      sdcLocking: { id: "sdc_locking", label: "SDC Locking Mechanism", uploaded: false },
      sdcPatches: { id: "sdc_patches", label: "SDC Patches Properly Coiled/Tied", uploaded: false },
      sdcCabinetClosed: { id: "sdc_closed", label: "SDC/Cabinet Image Closed", uploaded: false },
      wallboxLightReadings: { id: "wallbox_light", label: "Wall Box Light Readings All Ports", uploaded: false },
      wallboxSplice1: { id: "wallbox_splice1", label: "Wall Box Splice and Coiled Cables 1", uploaded: false },
      wallboxSplice2: { id: "wallbox_splice2", label: "Wall Box Splice and Coiled Cables 2", uploaded: false },
    },
    lightReadings: "",
    notes: "",
  });

  const handleImageUpload = (fieldPath: string, file: File) => {
    // In a real app, this would upload to a server
    const reader = new FileReader();
    reader.onload = () => {
      setAssessmentData(prev => {
        const updated = { ...prev };
        const pathParts = fieldPath.split('.');
        let current: any = updated;
        
        for (let i = 0; i < pathParts.length - 1; i++) {
          current = current[pathParts[i]];
        }
        
        const finalField = pathParts[pathParts.length - 1];
        if (Array.isArray(current[finalField])) {
          // Handle array fields
          const index = parseInt(fieldPath.split('[')[1]?.split(']')[0] || '0');
          current[finalField][index] = {
            ...current[finalField][index],
            uploaded: true,
            file: file
          };
        } else {
          current[finalField] = {
            ...current[finalField],
            uploaded: true,
            file: file
          };
        }
        
        return updated;
      });
    };
    reader.readAsDataURL(file);
  };

  const ImageUploadField = ({ 
    imageField, 
    fieldPath,
    required = true 
  }: { 
    imageField: ImageField;
    fieldPath: string;
    required?: boolean;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-2">
        {imageField.label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <div className={`border-2 border-dashed rounded-lg p-4 text-center ${
        imageField.uploaded ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
      }`}>
        {imageField.uploaded ? (
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <Check className="h-5 w-5" />
            <span className="text-sm">Image uploaded</span>
          </div>
        ) : (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload(fieldPath, file);
                }
              }}
              className="hidden"
              id={imageField.id}
            />
            <label htmlFor={imageField.id} className="cursor-pointer">
              <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">Tap to upload image</p>
            </label>
          </div>
        )}
      </div>
    </div>
  );

  const handleSave = () => {
    console.log("Saving assessment data:", assessmentData);
    // Save to local storage or send to server
    localStorage.setItem('network_assessment', JSON.stringify(assessmentData));
    navigate('/');
  };

  const getCompletionPercentage = () => {
    let totalFields = 3; // Basic fields (area, type, readings)
    let completedFields = 0;

    if (assessmentData.networkArea) completedFields++;
    if (assessmentData.networkType) completedFields++;
    if (assessmentData.lightReadings) completedFields++;

    if (assessmentData.networkArea === 'reach') {
      // Count reach-specific required images
      const reachImages = [
        assessmentData.manholeImages.lockImage,
        assessmentData.manholeImages.openedImage,
        assessmentData.manholeImages.slackManagement,
        assessmentData.manholeImages.insideManhole,
        assessmentData.manholeImages.linkjointLabel,
        assessmentData.manholeImages.linkjointLock,
        ...assessmentData.manholeImages.linkjointTrayLids,
        assessmentData.manholeImages.manholeLabel,
        assessmentData.manholeImages.manholeClosed,
        assessmentData.firstApAb.opened,
        assessmentData.firstApAb.slackManagement,
        assessmentData.firstApAb.lightReadings,
        assessmentData.firstApAb.closed,
        assessmentData.lastApAb.opened,
        assessmentData.lastApAb.slackManagement,
        assessmentData.lastApAb.lightReadings,
        assessmentData.lastApAb.closed,
        assessmentData.mljImages.spliceAndCoiled1,
        assessmentData.mljImages.spliceAndCoiled2,
      ];
      
      totalFields += reachImages.length;
      completedFields += reachImages.filter(img => img.uploaded).length;
    }

    if (assessmentData.networkArea === 'core') {
      // Count core-specific required images
      const coreImages = Object.values(assessmentData.coreFields);
      totalFields += coreImages.length;
      completedFields += coreImages.filter(img => img.uploaded).length;
    }

    return Math.round((completedFields / totalFields) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Network Assessment</h1>
            <p className="text-sm opacity-90">{getCompletionPercentage()}% Complete</p>
          </div>
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

      {/* Content */}
      <div className="p-4 pb-24 space-y-6">
        {/* Basic Information */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-gray-800 mb-4">Assessment Details</h3>
            
            {/* Network Area */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Network Area <span className="text-red-500">*</span>
              </Label>
              <Select
                value={assessmentData.networkArea}
                onValueChange={(value: "core" | "reach") =>
                  setAssessmentData(prev => ({ ...prev, networkArea: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select network area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="core">Core</SelectItem>
                  <SelectItem value="reach">Reach</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Network Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Network Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={assessmentData.networkType}
                onValueChange={(value: "gpon" | "active") =>
                  setAssessmentData(prev => ({ ...prev, networkType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select network type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpon">GPON</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Light Readings */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Light Readings <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter light readings"
                value={assessmentData.lightReadings}
                onChange={(e) =>
                  setAssessmentData(prev => ({ ...prev, lightReadings: e.target.value }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Reach-specific fields */}
        {assessmentData.networkArea === 'reach' && (
          <>
            {/* Manhole Assessment */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-gray-800 mb-4">Manhole Assessment</h3>
                
                <ImageUploadField 
                  imageField={assessmentData.manholeImages.lockImage}
                  fieldPath="manholeImages.lockImage"
                />
                
                <ImageUploadField 
                  imageField={assessmentData.manholeImages.openedImage}
                  fieldPath="manholeImages.openedImage"
                />
                
                <ImageUploadField 
                  imageField={assessmentData.manholeImages.slackManagement}
                  fieldPath="manholeImages.slackManagement"
                />
                
                <ImageUploadField 
                  imageField={assessmentData.manholeImages.insideManhole}
                  fieldPath="manholeImages.insideManhole"
                />
                
                <ImageUploadField 
                  imageField={assessmentData.manholeImages.linkjointLabel}
                  fieldPath="manholeImages.linkjointLabel"
                />
                
                <ImageUploadField 
                  imageField={assessmentData.manholeImages.linkjointLock}
                  fieldPath="manholeImages.linkjointLock"
                />
                
                {assessmentData.manholeImages.linkjointTrayLids.map((trayLid, index) => (
                  <ImageUploadField 
                    key={trayLid.id}
                    imageField={trayLid}
                    fieldPath={`manholeImages.linkjointTrayLids[${index}]`}
                  />
                ))}
                
                <ImageUploadField 
                  imageField={assessmentData.manholeImages.manholeLabel}
                  fieldPath="manholeImages.manholeLabel"
                />
                
                <ImageUploadField 
                  imageField={assessmentData.manholeImages.manholeClosed}
                  fieldPath="manholeImages.manholeClosed"
                />
              </CardContent>
            </Card>

            {/* First AP/AB */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-gray-800 mb-4">First AP/AB Assessment</h3>
                
                <ImageUploadField 
                  imageField={assessmentData.firstApAb.opened}
                  fieldPath="firstApAb.opened"
                />
                
                <ImageUploadField 
                  imageField={assessmentData.firstApAb.slackManagement}
                  fieldPath="firstApAb.slackManagement"
                />
                
                <ImageUploadField 
                  imageField={assessmentData.firstApAb.lightReadings}
                  fieldPath="firstApAb.lightReadings"
                />
                
                <ImageUploadField 
                  imageField={assessmentData.firstApAb.closed}
                  fieldPath="firstApAb.closed"
                />
              </CardContent>
            </Card>

            {/* MLJ Images */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-gray-800 mb-4">MLJ Assessment</h3>
                
                <ImageUploadField 
                  imageField={assessmentData.mljImages.spliceAndCoiled1}
                  fieldPath="mljImages.spliceAndCoiled1"
                />
                
                <ImageUploadField 
                  imageField={assessmentData.mljImages.spliceAndCoiled2}
                  fieldPath="mljImages.spliceAndCoiled2"
                />
              </CardContent>
            </Card>

            {/* Last AP/AB */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-gray-800 mb-4">Last AP/AB Assessment</h3>
                
                <ImageUploadField 
                  imageField={assessmentData.lastApAb.opened}
                  fieldPath="lastApAb.opened"
                />
                
                <ImageUploadField 
                  imageField={assessmentData.lastApAb.slackManagement}
                  fieldPath="lastApAb.slackManagement"
                />
                
                <ImageUploadField 
                  imageField={assessmentData.lastApAb.lightReadings}
                  fieldPath="lastApAb.lightReadings"
                />
                
                <ImageUploadField 
                  imageField={assessmentData.lastApAb.closed}
                  fieldPath="lastApAb.closed"
                />
              </CardContent>
            </Card>
          </>
        )}

        {/* Core-specific fields */}
        {assessmentData.networkArea === 'core' && (
          <Card>
            <CardContent className="p-4 space-y-4">
              <h3 className="font-semibold text-gray-800 mb-4">Core Network Assessment</h3>
              
              <ImageUploadField 
                imageField={assessmentData.coreFields.sdcCabinetPlan}
                fieldPath="coreFields.sdcCabinetPlan"
              />
              
              <ImageUploadField 
                imageField={assessmentData.coreFields.sdcLocking}
                fieldPath="coreFields.sdcLocking"
              />
              
              <ImageUploadField 
                imageField={assessmentData.coreFields.sdcPatches}
                fieldPath="coreFields.sdcPatches"
              />
              
              <ImageUploadField 
                imageField={assessmentData.coreFields.sdcCabinetClosed}
                fieldPath="coreFields.sdcCabinetClosed"
              />
              
              <ImageUploadField 
                imageField={assessmentData.coreFields.wallboxLightReadings}
                fieldPath="coreFields.wallboxLightReadings"
              />
              
              <ImageUploadField 
                imageField={assessmentData.coreFields.wallboxSplice1}
                fieldPath="coreFields.wallboxSplice1"
              />
              
              <ImageUploadField 
                imageField={assessmentData.coreFields.wallboxSplice2}
                fieldPath="coreFields.wallboxSplice2"
              />
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold text-gray-800 mb-4">Additional Notes</h3>
            <Textarea
              placeholder="Add any additional observations or notes..."
              value={assessmentData.notes}
              onChange={(e) =>
                setAssessmentData(prev => ({ ...prev, notes: e.target.value }))
              }
              className="min-h-[100px]"
            />
          </CardContent>
        </Card>
      </div>

      {/* Fixed Bottom Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <Button
          onClick={handleSave}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-4 text-lg font-semibold"
        >
          <Save className="h-5 w-5 mr-2" />
          Save Assessment
        </Button>
      </div>
    </div>
  );
}
