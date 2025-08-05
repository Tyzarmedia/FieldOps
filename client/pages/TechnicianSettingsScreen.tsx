import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  User,
  Bell,
  Shield,
  Smartphone,
  MapPin,
  Clock,
  Save,
  LogOut,
} from "lucide-react";

export default function TechnicianSettingsScreen() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    // Profile settings
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",

    // Notification settings
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: true,
    jobAlerts: true,
    emergencyAlerts: true,

    // Location settings
    locationSharing: true,
    autoClockIn: false,
    gpsTracking: true,

    // App settings
    theme: "light",
    language: "en",
    autoSync: true,
    offlineMode: false,
  });

  const handleSave = () => {
    console.log("Saving settings:", settings);
    localStorage.setItem("technicianSettings", JSON.stringify(settings));
    navigate(-1);
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("clockInTime");
    localStorage.removeItem("isClockedIn");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Settings</h1>
            <p className="text-sm opacity-90">Manage your preferences</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full h-10 w-10"
            onClick={() => navigate(-1)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={settings.name}
                onChange={(e) =>
                  setSettings({ ...settings, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                type="tel"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-gray-600">
                  Receive app notifications
                </div>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, pushNotifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-gray-600">
                  Receive email updates
                </div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">SMS Notifications</div>
                <div className="text-sm text-gray-600">
                  Receive text messages
                </div>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, smsNotifications: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Job Alerts</div>
                <div className="text-sm text-gray-600">New job assignments</div>
              </div>
              <Switch
                checked={settings.jobAlerts}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, jobAlerts: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Emergency Alerts</div>
                <div className="text-sm text-gray-600">
                  Critical notifications
                </div>
              </div>
              <Switch
                checked={settings.emergencyAlerts}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emergencyAlerts: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Location & Tracking */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Location & Tracking</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Location Sharing</div>
                <div className="text-sm text-gray-600">
                  Share location with dispatch
                </div>
              </div>
              <Switch
                checked={settings.locationSharing}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, locationSharing: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto Clock-In</div>
                <div className="text-sm text-gray-600">
                  Automatically clock in at job sites
                </div>
              </div>
              <Switch
                checked={settings.autoClockIn}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoClockIn: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">GPS Tracking</div>
                <div className="text-sm text-gray-600">
                  Enable GPS for job tracking
                </div>
              </div>
              <Switch
                checked={settings.gpsTracking}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, gpsTracking: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>App Preferences</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select
                value={settings.theme}
                onValueChange={(value) =>
                  setSettings({ ...settings, theme: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="auto">Auto</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={settings.language}
                onValueChange={(value) =>
                  setSettings({ ...settings, language: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Auto Sync</div>
                <div className="text-sm text-gray-600">
                  Sync data automatically
                </div>
              </div>
              <Switch
                checked={settings.autoSync}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoSync: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Offline Mode</div>
                <div className="text-sm text-gray-600">
                  Work without internet
                </div>
              </div>
              <Switch
                checked={settings.offlineMode}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, offlineMode: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Clock className="h-4 w-4 mr-2" />
              Login History
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handleSave}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg font-semibold"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Settings
          </Button>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 py-4 text-lg font-semibold"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
