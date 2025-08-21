import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/hooks/useNotification";
import { makeAuthenticatedRequest } from "@/utils/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Camera,
  Bell,
  Monitor,
  Shield,
  Download,
  Upload,
  Save,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ArrowLeft,
  Truck,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
} from "lucide-react";

export default function FleetManagerSettings() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { show: showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Real-time update functions for different setting categories
  const updateNotificationSetting = async (key: string, value: boolean) => {
    try {
      const updatedNotifications = { ...notifications, [key]: value };
      setNotifications(updatedNotifications);

      const response = await makeAuthenticatedRequest("/api/fleet-settings/notifications", {
        method: "PATCH",
        body: JSON.stringify(updatedNotifications),
      });

      if (response.ok) {
        showNotification.success(
          "Setting Updated",
          `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} updated successfully`
        );
      } else {
        throw new Error("Failed to update setting");
      }
    } catch (error) {
      console.error("Failed to update notification setting:", error);
      showNotification.error("Update Failed", "Could not update notification setting");
      // Revert the change
      setNotifications(notifications);
    }
  };

  const updateFleetPreference = async (key: string, value: any) => {
    try {
      const updatedPreferences = { ...fleetPreferences, [key]: value };
      setFleetPreferences(updatedPreferences);

      const response = await makeAuthenticatedRequest("/api/fleet-settings/fleetPreferences", {
        method: "PATCH",
        body: JSON.stringify(updatedPreferences),
      });

      if (response.ok) {
        showNotification.success(
          "Preference Updated",
          `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} updated successfully`
        );
      } else {
        throw new Error("Failed to update preference");
      }
    } catch (error) {
      console.error("Failed to update fleet preference:", error);
      showNotification.error("Update Failed", "Could not update fleet preference");
      // Revert the change
      setFleetPreferences(fleetPreferences);
    }
  };

  const updateSystemPreference = async (key: string, value: any) => {
    try {
      const updatedPreferences = { ...systemPreferences, [key]: value };
      setSystemPreferences(updatedPreferences);

      const response = await makeAuthenticatedRequest("/api/fleet-settings/systemPreferences", {
        method: "PATCH",
        body: JSON.stringify(updatedPreferences),
      });

      if (response.ok) {
        showNotification.success(
          "System Setting Updated",
          `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} updated successfully`
        );

        // Apply immediate changes to the app
        if (key === 'theme') {
          document.documentElement.className = value === 'dark' ? 'dark' : '';
        }
      } else {
        throw new Error("Failed to update system preference");
      }
    } catch (error) {
      console.error("Failed to update system preference:", error);
      showNotification.error("Update Failed", "Could not update system preference");
      // Revert the change
      setSystemPreferences(systemPreferences);
    }
  };

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    firstName: "Nancy",
    lastName: "Dube",
    email: "nancy.dube@fieldops.com",
    phone: "+27 11 456 7890",
    department: "Fleet Management",
    position: "Fleet Manager",
    address: "456 Fleet Division, Johannesburg",
    bio: "Experienced fleet manager overseeing vehicle operations, maintenance, and compliance for the entire fleet.",
    dateJoined: "2019-03-15",
    employeeId: "FM-001",
    licenseNumber: "FL-123456",
    certifications: [
      "Fleet Management Certified",
      "Safety Inspector",
      "Logistics Professional",
    ],
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: true,
    vehicleAlerts: true,
    maintenanceReminders: true,
    complianceAlerts: true,
    emergencyAlerts: true,
    dailyReports: true,
    weeklyReports: false,
    inspectionReminders: true,
  });

  const [fleetPreferences, setFleetPreferences] = useState({
    defaultDashboard: "overview",
    autoRefreshInterval: "30",
    mapProvider: "google",
    distanceUnit: "km",
    fuelUnit: "liters",
    temperatureUnit: "celsius",
    showVehiclePhotos: true,
    compactVehicleView: false,
    enableVoiceAlerts: false,
    maintenanceReminderDays: "7",
    inspectionReminderDays: "14",
  });

  const [systemPreferences, setSystemPreferences] = useState({
    theme: "light",
    language: "en",
    timezone: "Africa/Johannesburg",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    currency: "ZAR",
    autoLogout: "60",
    sessionTimeout: "480",
    twoFactorAuth: false,
    biometricLogin: false,
  });

  // Load settings from server on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const response = await makeAuthenticatedRequest("/api/fleet-settings");

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const settings = data.data;
            setProfile(settings.profile);
            setNotifications(settings.notifications);
            setFleetPreferences(settings.fleetPreferences);
            setSystemPreferences(settings.systemPreferences);
          }
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
        showNotification.error("Load Failed", "Could not load your settings");
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [showNotification]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);

      const settingsData = {
        profile,
        notifications,
        fleetPreferences,
        systemPreferences,
        profileImage,
      };

      const response = await makeAuthenticatedRequest("/api/fleet-settings", {
        method: "POST",
        body: JSON.stringify(settingsData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setHasUnsavedChanges(false);
          showNotification.success(
            "Settings Saved",
            "Your fleet manager settings have been updated successfully",
          );

          // Also save profile image locally for immediate use
          localStorage.setItem(
            "fleetManagerSettings",
            JSON.stringify(settingsData),
          );

          navigate("/fleet");
        } else {
          throw new Error(data.error || "Failed to save settings");
        }
      } else {
        throw new Error("Server error while saving settings");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      showNotification.error(
        "Save Failed",
        "Could not save your settings. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportSettings = async () => {
    try {
      setIsLoading(true);

      // Get comprehensive fleet manager data
      const settingsData = {
        profile,
        notifications,
        fleetPreferences,
        systemPreferences,
        profileImage,
        exportDate: new Date().toISOString(),
        exportedBy: profile.employeeId,
      };

      // Get vehicle data from server
      let vehicleData = [];
      try {
        const response = await makeAuthenticatedRequest("/api/vehicles");
        if (response.ok) {
          const result = await response.json();
          vehicleData = result.data || [];
        }
      } catch (error) {
        console.warn("Could not fetch vehicle data for export:", error);
      }

      // Prepare comprehensive export data
      const exportData = {
        exportInfo: {
          type: "Fleet Manager Complete Report",
          exportDate: new Date().toISOString(),
          exportedBy: `${profile.firstName} ${profile.lastName} (${profile.employeeId})`,
          totalVehicles: vehicleData.length,
        },
        fleetManagerSettings: settingsData,
        vehicleFleet: vehicleData,
        fleetStatistics: {
          totalVehicles: vehicleData.length,
          activeVehicles: vehicleData.filter(v => v.status === "Active").length,
          assignedVehicles: vehicleData.filter(v => v.assigned_driver !== "Not Assigned").length,
          maintenanceVehicles: vehicleData.filter(v => v.status === "In Maintenance").length,
          avgFuelEfficiency: vehicleData.length > 0
            ? (vehicleData.reduce((sum, v) => sum + (v.fuel_efficiency || 0), 0) / vehicleData.length).toFixed(2)
            : 0,
        },
      };

      // Create and download JSON export
      const jsonBlob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const jsonUrl = URL.createObjectURL(jsonBlob);
      const jsonLink = document.createElement("a");
      jsonLink.href = jsonUrl;
      jsonLink.download = `fleet-manager-report-${new Date().toISOString().split('T')[0]}.json`;
      jsonLink.click();
      URL.revokeObjectURL(jsonUrl);

      // Create and download CSV export for vehicles
      if (vehicleData.length > 0) {
        const csvHeaders = [
          "Vehicle ID", "Plate Number", "Make", "Model", "Year",
          "Status", "Assigned Driver", "Mileage", "Fuel Efficiency",
          "Last Service", "Next Service Due"
        ];

        const csvData = vehicleData.map(vehicle => [
          vehicle.vehicle_id,
          vehicle.plate_number,
          vehicle.make,
          vehicle.model,
          vehicle.year,
          vehicle.status,
          vehicle.assigned_driver,
          vehicle.mileage,
          vehicle.fuel_efficiency,
          vehicle.last_service,
          vehicle.next_service_due,
        ]);

        const csvContent = [
          csvHeaders.join(","),
          ...csvData.map(row => row.map(cell =>
            typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
          ).join(","))
        ].join("\n");

        const csvBlob = new Blob([csvContent], { type: "text/csv" });
        const csvUrl = URL.createObjectURL(csvBlob);
        const csvLink = document.createElement("a");
        csvLink.href = csvUrl;
        csvLink.download = `fleet-vehicles-${new Date().toISOString().split('T')[0]}.csv`;
        csvLink.click();
        URL.revokeObjectURL(csvUrl);
      }

      showNotification.success(
        "Export Complete",
        "Fleet manager report exported successfully (JSON + CSV files downloaded)"
      );
    } catch (error) {
      console.error("Export failed:", error);
      showNotification.error(
        "Export Failed",
        "Could not export fleet manager data. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetToDefaults = () => {
    if (
      window.confirm("Are you sure you want to reset all settings to defaults?")
    ) {
      // Reset to default values
      setNotifications({
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false,
        vehicleAlerts: true,
        maintenanceReminders: true,
        complianceAlerts: true,
        emergencyAlerts: true,
        dailyReports: true,
        weeklyReports: false,
        inspectionReminders: true,
      });

      setFleetPreferences({
        defaultDashboard: "overview",
        autoRefreshInterval: "30",
        mapProvider: "google",
        distanceUnit: "km",
        fuelUnit: "liters",
        temperatureUnit: "celsius",
        showVehiclePhotos: true,
        compactVehicleView: false,
        enableVoiceAlerts: false,
        maintenanceReminderDays: "7",
        inspectionReminderDays: "14",
      });

      alert("Settings reset to defaults!");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/fleet")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Fleet
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Fleet Manager Settings
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your profile and fleet management preferences
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportSettings}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={handleResetToDefaults}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={handleSaveSettings} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="fleet">
              <Truck className="h-4 w-4 mr-2" />
              Fleet Settings
            </TabsTrigger>
            <TabsTrigger value="display">
              <Monitor className="h-4 w-4 mr-2" />
              Display
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-16 w-16 text-white" />
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-1/2 transform translate-x-1/2 translate-y-2"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-lg">
                      {profile.firstName} {profile.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profile.position}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profile.department}
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      {profile.employeeId}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) =>
                          setProfile({ ...profile, firstName: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) =>
                          setProfile({ ...profile, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) =>
                            setProfile({ ...profile, email: e.target.value })
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) =>
                            setProfile({ ...profile, phone: e.target.value })
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="position"
                          value={profile.position}
                          onChange={(e) =>
                            setProfile({ ...profile, position: e.target.value })
                          }
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="licenseNumber">Driver License</Label>
                      <Input
                        id="licenseNumber"
                        value={profile.licenseNumber}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            licenseNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="address"
                        value={profile.address}
                        onChange={(e) =>
                          setProfile({ ...profile, address: e.target.value })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) =>
                        setProfile({ ...profile, bio: e.target.value })
                      }
                      placeholder="Tell us about your fleet management experience..."
                    />
                  </div>

                  <div>
                    <Label>Certifications</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Communication Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        updateNotificationSetting("emailNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Browser push notifications
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) =>
                        updateNotificationSetting("pushNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Text message alerts for critical issues
                      </p>
                    </div>
                    <Switch
                      checked={notifications.smsNotifications}
                      onCheckedChange={(checked) =>
                        updateNotificationSetting("smsNotifications", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fleet Alert Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Vehicle Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Breakdowns, accidents, GPS issues
                      </p>
                    </div>
                    <Switch
                      checked={notifications.vehicleAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          vehicleAlerts: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Maintenance Reminders</Label>
                      <p className="text-sm text-muted-foreground">
                        Scheduled maintenance due dates
                      </p>
                    </div>
                    <Switch
                      checked={notifications.maintenanceReminders}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          maintenanceReminders: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compliance Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        License, insurance, inspection expiry
                      </p>
                    </div>
                    <Switch
                      checked={notifications.complianceAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          complianceAlerts: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Emergency Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Critical safety and security issues
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emergencyAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          emergencyAlerts: checked,
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fleet Settings */}
          <TabsContent value="fleet">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Default Dashboard View</Label>
                    <Select
                      value={fleetPreferences.defaultDashboard}
                      onValueChange={(value) =>
                        setFleetPreferences({
                          ...fleetPreferences,
                          defaultDashboard: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="overview">Fleet Overview</SelectItem>
                        <SelectItem value="vehicles">
                          Vehicle Management
                        </SelectItem>
                        <SelectItem value="maintenance">
                          Maintenance Dashboard
                        </SelectItem>
                        <SelectItem value="compliance">
                          Compliance Dashboard
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Auto Refresh Interval (seconds)</Label>
                    <Select
                      value={fleetPreferences.autoRefreshInterval}
                      onValueChange={(value) =>
                        setFleetPreferences({
                          ...fleetPreferences,
                          autoRefreshInterval: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 seconds</SelectItem>
                        <SelectItem value="30">30 seconds</SelectItem>
                        <SelectItem value="60">1 minute</SelectItem>
                        <SelectItem value="300">5 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Map Provider</Label>
                    <Select
                      value={fleetPreferences.mapProvider}
                      onValueChange={(value) =>
                        setFleetPreferences({
                          ...fleetPreferences,
                          mapProvider: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google Maps</SelectItem>
                        <SelectItem value="openstreet">
                          OpenStreetMap
                        </SelectItem>
                        <SelectItem value="mapbox">MapBox</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Units & Display</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Distance Unit</Label>
                    <Select
                      value={fleetPreferences.distanceUnit}
                      onValueChange={(value) =>
                        setFleetPreferences({
                          ...fleetPreferences,
                          distanceUnit: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="km">Kilometers</SelectItem>
                        <SelectItem value="miles">Miles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Fuel Unit</Label>
                    <Select
                      value={fleetPreferences.fuelUnit}
                      onValueChange={(value) =>
                        setFleetPreferences({
                          ...fleetPreferences,
                          fuelUnit: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="liters">Liters</SelectItem>
                        <SelectItem value="gallons">Gallons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Vehicle Photos</Label>
                      <p className="text-sm text-muted-foreground">
                        Display vehicle images in lists
                      </p>
                    </div>
                    <Switch
                      checked={fleetPreferences.showVehiclePhotos}
                      onCheckedChange={(checked) =>
                        setFleetPreferences({
                          ...fleetPreferences,
                          showVehiclePhotos: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Compact Vehicle View</Label>
                      <p className="text-sm text-muted-foreground">
                        Show more vehicles per page
                      </p>
                    </div>
                    <Switch
                      checked={fleetPreferences.compactVehicleView}
                      onCheckedChange={(checked) =>
                        setFleetPreferences({
                          ...fleetPreferences,
                          compactVehicleView: checked,
                        })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Display Preferences */}
          <TabsContent value="display">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Theme</Label>
                    <Select
                      value={systemPreferences.theme}
                      onValueChange={(value) =>
                        setSystemPreferences({
                          ...systemPreferences,
                          theme: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Language</Label>
                    <Select
                      value={systemPreferences.language}
                      onValueChange={(value) =>
                        setSystemPreferences({
                          ...systemPreferences,
                          language: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="af">Afrikaans</SelectItem>
                        <SelectItem value="zu">Zulu</SelectItem>
                        <SelectItem value="xh">Xhosa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Currency</Label>
                    <Select
                      value={systemPreferences.currency}
                      onValueChange={(value) =>
                        setSystemPreferences({
                          ...systemPreferences,
                          currency: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ZAR">
                          South African Rand (R)
                        </SelectItem>
                        <SelectItem value="USD">US Dollar ($)</SelectItem>
                        <SelectItem value="EUR">Euro (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Date & Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Timezone</Label>
                    <Select
                      value={systemPreferences.timezone}
                      onValueChange={(value) =>
                        setSystemPreferences({
                          ...systemPreferences,
                          timezone: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Johannesburg">
                          Johannesburg (SAST)
                        </SelectItem>
                        <SelectItem value="Africa/Cape_Town">
                          Cape Town (SAST)
                        </SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Date Format</Label>
                    <Select
                      value={systemPreferences.dateFormat}
                      onValueChange={(value) =>
                        setSystemPreferences({
                          ...systemPreferences,
                          dateFormat: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Time Format</Label>
                    <Select
                      value={systemPreferences.timeFormat}
                      onValueChange={(value) =>
                        setSystemPreferences({
                          ...systemPreferences,
                          timeFormat: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                        <SelectItem value="24h">24 Hour</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add extra security to your account
                      </p>
                    </div>
                    <Switch
                      checked={systemPreferences.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSystemPreferences({
                          ...systemPreferences,
                          twoFactorAuth: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Biometric Login</Label>
                      <p className="text-sm text-muted-foreground">
                        Use fingerprint or face recognition
                      </p>
                    </div>
                    <Switch
                      checked={systemPreferences.biometricLogin}
                      onCheckedChange={(checked) =>
                        setSystemPreferences({
                          ...systemPreferences,
                          biometricLogin: checked,
                        })
                      }
                    />
                  </div>

                  <div className="pt-4">
                    <Button variant="outline" className="w-full">
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Session Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Auto Logout (minutes)</Label>
                    <Input
                      type="number"
                      value={systemPreferences.autoLogout}
                      onChange={(e) =>
                        setSystemPreferences({
                          ...systemPreferences,
                          autoLogout: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label>Session Timeout (minutes)</Label>
                    <Input
                      type="number"
                      value={systemPreferences.sessionTimeout}
                      onChange={(e) =>
                        setSystemPreferences({
                          ...systemPreferences,
                          sessionTimeout: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button variant="outline" className="w-full">
                      <Activity className="h-4 w-4 mr-2" />
                      View Login History
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Device Access
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Your Fleet Management Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <Truck className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">
                  Vehicles Managed
                </p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">92%</p>
                <p className="text-sm text-muted-foreground">Compliance Rate</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <p className="text-2xl font-bold">98.5%</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold">3.2y</p>
                <p className="text-sm text-muted-foreground">Experience</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
