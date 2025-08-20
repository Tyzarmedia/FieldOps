import { RequestHandler } from "express";

interface FleetManagerSettings {
  id: string;
  employeeId: string;
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    address: string;
    bio: string;
    licenseNumber: string;
    certifications: string[];
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    vehicleAlerts: boolean;
    maintenanceReminders: boolean;
    complianceAlerts: boolean;
    emergencyAlerts: boolean;
    dailyReports: boolean;
    weeklyReports: boolean;
    inspectionReminders: boolean;
  };
  fleetPreferences: {
    defaultDashboard: string;
    autoRefreshInterval: string;
    mapProvider: string;
    distanceUnit: string;
    fuelUnit: string;
    temperatureUnit: string;
    showVehiclePhotos: boolean;
    compactVehicleView: boolean;
    enableVoiceAlerts: boolean;
    maintenanceReminderDays: string;
    inspectionReminderDays: string;
  };
  systemPreferences: {
    theme: string;
    language: string;
    timezone: string;
    dateFormat: string;
    timeFormat: string;
    currency: string;
    autoLogout: string;
    sessionTimeout: string;
    twoFactorAuth: boolean;
    biometricLogin: boolean;
  };
  updatedAt: string;
  updatedBy: string;
}

// In-memory storage (in production, this would be a database)
let fleetManagerSettings: Record<string, FleetManagerSettings> = {};

// Get fleet manager settings
export const getFleetManagerSettings: RequestHandler = (req, res) => {
  try {
    const employeeId = req.headers.employeeid as string || "FM-001"; // Get from auth
    
    const settings = fleetManagerSettings[employeeId];
    
    if (!settings) {
      // Return default settings if none exist
      const defaultSettings: FleetManagerSettings = {
        id: `settings-${employeeId}`,
        employeeId,
        profile: {
          firstName: "Nancy",
          lastName: "Dube",
          email: "nancy.dube@fieldops.com",
          phone: "+27 11 456 7890",
          department: "Fleet Management",
          position: "Fleet Manager",
          address: "456 Fleet Division, Johannesburg",
          bio: "Experienced fleet manager overseeing vehicle operations, maintenance, and compliance for the entire fleet.",
          licenseNumber: "FL-123456",
          certifications: ["Fleet Management Certified", "Safety Inspector", "Logistics Professional"],
        },
        notifications: {
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
        },
        fleetPreferences: {
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
        },
        systemPreferences: {
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
        },
        updatedAt: new Date().toISOString(),
        updatedBy: employeeId,
      };
      
      return res.json({
        success: true,
        data: defaultSettings,
      });
    }

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error("Error fetching fleet manager settings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch settings",
    });
  }
};

// Save fleet manager settings
export const saveFleetManagerSettings: RequestHandler = (req, res) => {
  try {
    const employeeId = req.headers.employeeid as string || "FM-001"; // Get from auth
    const settingsData = req.body;

    const updatedSettings: FleetManagerSettings = {
      ...settingsData,
      id: `settings-${employeeId}`,
      employeeId,
      updatedAt: new Date().toISOString(),
      updatedBy: employeeId,
    };

    fleetManagerSettings[employeeId] = updatedSettings;

    // Simulate notification service call
    console.log(`Fleet Manager Settings Updated for ${employeeId}`);
    
    res.json({
      success: true,
      data: updatedSettings,
      message: "Settings saved successfully",
    });
  } catch (error) {
    console.error("Error saving fleet manager settings:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save settings",
    });
  }
};

// Update specific setting category
export const updateSettingCategory: RequestHandler = (req, res) => {
  try {
    const employeeId = req.headers.employeeid as string || "FM-001";
    const { category } = req.params;
    const updates = req.body;

    const currentSettings = fleetManagerSettings[employeeId];
    
    if (!currentSettings) {
      return res.status(404).json({
        success: false,
        error: "Settings not found",
      });
    }

    // Validate category
    const validCategories = ['profile', 'notifications', 'fleetPreferences', 'systemPreferences'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: "Invalid settings category",
      });
    }

    // Update the specific category
    const updatedSettings = {
      ...currentSettings,
      [category]: {
        ...currentSettings[category as keyof FleetManagerSettings],
        ...updates,
      },
      updatedAt: new Date().toISOString(),
      updatedBy: employeeId,
    };

    fleetManagerSettings[employeeId] = updatedSettings;

    res.json({
      success: true,
      data: updatedSettings,
      message: `${category} settings updated successfully`,
    });
  } catch (error) {
    console.error("Error updating setting category:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update settings",
    });
  }
};
