import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  X,
  User,
  Bell,
  Globe,
  Shield,
  Smartphone,
  MapPin,
  Clock,
  Camera,
  Wifi,
  Save,
  RefreshCw,
  LogOut,
  Key,
  Settings as SettingsIcon,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";

export default function TechnicianSettingsScreen() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "app" | "security">("profile");

  // Profile settings
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@britelink.com");
  const [phone, setPhone] = useState("+27 82 555 0123");
  const [employeeId, setEmployeeId] = useState("EMP001");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Password change dialog
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Notification settings
  const [jobNotifications, setJobNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  
  // App settings
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");
  const [autoSync, setAutoSync] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [gpsTracking, setGpsTracking] = useState(true);
  const [autoPhotoBackup, setAutoPhotoBackup] = useState(true);
  
  // Security settings
  const [biometricLogin, setBiometricLogin] = useState(false);
  const [autoLock, setAutoLock] = useState("5");
  const [sessionTimeout, setSessionTimeout] = useState("30");

  const handleSave = () => {
    // Save settings
    alert("Settings saved successfully!");
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isClockedIn");
    localStorage.removeItem("clockInTime");
    localStorage.removeItem("selectedAssistant");
    navigate("/login");
  };

  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
      // Reset to defaults
      setJobNotifications(true);
      setMessageNotifications(true);
      setEmergencyAlerts(true);
      setSoundEnabled(false);
      setVibrationEnabled(true);
      setLanguage("en");
      setTheme("light");
      setAutoSync(true);
      setOfflineMode(false);
      setGpsTracking(true);
      setAutoPhotoBackup(true);
      setBiometricLogin(false);
      setAutoLock("5");
      setSessionTimeout("30");
      alert("Settings reset to defaults");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => navigate(-1)}
            >
              <X className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Settings</h1>
              <p className="text-sm opacity-90">Manage your preferences</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={handleSave}
          >
            <Save className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4 overflow-x-auto">
          <Button
            variant={activeTab === "profile" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("profile")}
            className={`whitespace-nowrap ${activeTab === "profile" ? "bg-white text-gray-800" : "text-white hover:bg-white/20"}`}
          >
            <User className="h-4 w-4 mr-1" />
            Profile
          </Button>
          <Button
            variant={activeTab === "notifications" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("notifications")}
            className={`whitespace-nowrap ${activeTab === "notifications" ? "bg-white text-gray-800" : "text-white hover:bg-white/20"}`}
          >
            <Bell className="h-4 w-4 mr-1" />
            Notifications
          </Button>
          <Button
            variant={activeTab === "app" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("app")}
            className={`whitespace-nowrap ${activeTab === "app" ? "bg-white text-gray-800" : "text-white hover:bg-white/20"}`}
          >
            <Smartphone className="h-4 w-4 mr-1" />
            App
          </Button>
          <Button
            variant={activeTab === "security" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("security")}
            className={`whitespace-nowrap ${activeTab === "security" ? "bg-white text-gray-800" : "text-white hover:bg-white/20"}`}
          >
            <Shield className="h-4 w-4 mr-1" />
            Security
          </Button>
        </div>
      </div>

      <div className="p-4">
        {activeTab === "profile" && (
          <>
            {/* Profile Information */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Employee ID</label>
                  <Input
                    value={employeeId}
                    disabled
                    className="bg-gray-50"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                    <div className="text-sm text-gray-600 mt-1">Account Status</div>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-blue-100 text-blue-800">Technician</Badge>
                    <div className="text-sm text-gray-600 mt-1">Role</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Job Notifications</h3>
                    <p className="text-sm text-gray-600">Get notified about new job assignments</p>
                  </div>
                  <Switch
                    checked={jobNotifications}
                    onCheckedChange={setJobNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Message Notifications</h3>
                    <p className="text-sm text-gray-600">Team messages and updates</p>
                  </div>
                  <Switch
                    checked={messageNotifications}
                    onCheckedChange={setMessageNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Emergency Alerts</h3>
                    <p className="text-sm text-gray-600">Critical system alerts</p>
                  </div>
                  <Switch
                    checked={emergencyAlerts}
                    onCheckedChange={setEmergencyAlerts}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Sound</h3>
                    <p className="text-sm text-gray-600">Play sounds for notifications</p>
                  </div>
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Vibration</h3>
                    <p className="text-sm text-gray-600">Vibrate for notifications</p>
                  </div>
                  <Switch
                    checked={vibrationEnabled}
                    onCheckedChange={setVibrationEnabled}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "app" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Language & Display</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <Select value={language} onValueChange={setLanguage}>
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
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <Select value={theme} onValueChange={setTheme}>
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <SettingsIcon className="h-5 w-5" />
                  <span>App Behavior</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto Sync</h3>
                    <p className="text-sm text-gray-600">Automatically sync data when online</p>
                  </div>
                  <Switch
                    checked={autoSync}
                    onCheckedChange={setAutoSync}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Offline Mode</h3>
                    <p className="text-sm text-gray-600">Work offline when no connection</p>
                  </div>
                  <Switch
                    checked={offlineMode}
                    onCheckedChange={setOfflineMode}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">GPS Tracking</h3>
                    <p className="text-sm text-gray-600">Track location for job assignments</p>
                  </div>
                  <Switch
                    checked={gpsTracking}
                    onCheckedChange={setGpsTracking}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto Photo Backup</h3>
                    <p className="text-sm text-gray-600">Backup job photos automatically</p>
                  </div>
                  <Switch
                    checked={autoPhotoBackup}
                    onCheckedChange={setAutoPhotoBackup}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Biometric Login</h3>
                    <p className="text-sm text-gray-600">Use fingerprint or face ID</p>
                  </div>
                  <Switch
                    checked={biometricLogin}
                    onCheckedChange={setBiometricLogin}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Auto Lock (minutes)</label>
                  <Select value={autoLock} onValueChange={setAutoLock}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 minute</SelectItem>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                  <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="480">8 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => alert("Password change functionality would be implemented here")}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleResetSettings}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset All Settings
                </Button>
                
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
