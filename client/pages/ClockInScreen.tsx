import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Edit3, MapPin, Navigation } from "lucide-react";
import {
  locationService,
  LocationPermissionState,
} from "@/services/locationService";
import { showNotification } from "@/hooks/useNotification";
import { authManager } from "@/utils/auth";
import AssistantSelection from "@/components/AssistantSelection";

interface ClockInScreenProps {
  userRole?: string;
  userName?: string;
}

export default function ClockInScreen({
  userRole: propUserRole,
  userName: propUserName,
}: ClockInScreenProps = {}) {
  // Get authenticated user info from auth manager
  const authUser = authManager.getUser();
  const userRole = propUserRole || authUser?.role || "Technician";
  const userName = propUserName || authUser?.fullName || "Unknown User";
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workingHours, setWorkingHours] = useState("0:00");
  const [distanceTraveled, setDistanceTraveled] = useState("0.0");
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [lastLocation, setLastLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [dailyClockIns, setDailyClockIns] = useState<
    Array<{ clockIn: string; clockOut?: string }>
  >([]);
  const [showFeedbackOverlay, setShowFeedbackOverlay] = useState(false);
  const [dailyFeedback, setDailyFeedback] = useState("");
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [showAssistantSelection, setShowAssistantSelection] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<{
    id: string | null;
    name: string | null;
  } | null>(null);
  const [isProcessingClockIn, setIsProcessingClockIn] = useState(false);
  const [locationState, setLocationState] = useState<LocationPermissionState>({
    status: "unknown",
    isTracking: false,
    lastKnownLocation: null,
    clockedIn: false,
  });
  const navigate = useNavigate();

  // Get user initials
  const getInitials = (name: string) => {
    if (!name) return "JD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Initialize clock state from localStorage and subscribe to location service
  useEffect(() => {
    // Verify we have authenticated user data
    if (!authManager.isAuthenticated()) {
      console.warn("User not authenticated, redirecting to login");
      navigate("/login");
      return;
    }

    const clockedIn = localStorage.getItem("isClockedIn") === "true";
    const storedWorkingHours = localStorage.getItem("workingHours") || "0:00";
    const storedDistance = localStorage.getItem("distanceTraveled") || "0.0";
    const storedClockIns = localStorage.getItem("dailyClockIns");

    setIsClockedIn(clockedIn);
    setWorkingHours(storedWorkingHours);
    setDistanceTraveled(storedDistance);

    if (storedClockIns) {
      setDailyClockIns(JSON.parse(storedClockIns));
    }

    // Subscribe to location service updates
    const unsubscribe = locationService.subscribe((state) => {
      setLocationState(state);

      // Update last location when location service provides new location
      if (state.lastKnownLocation) {
        setLastLocation({
          lat: state.lastKnownLocation.latitude,
          lng: state.lastKnownLocation.longitude,
        });
      }
    });

    return unsubscribe;
  }, [navigate]);

  // Update time every second and calculate working hours
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());

      // Update working hours if clocked in
      if (isClockedIn) {
        updateWorkingHours();
      }

      // Track location if clocked in
      if (isClockedIn && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            if (lastLocation) {
              const distance = calculateDistance(lastLocation, newLocation);
              setTotalDistance((prev) => {
                const newTotal = prev + distance;
                setDistanceTraveled(newTotal.toFixed(1));
                localStorage.setItem("distanceTraveled", newTotal.toFixed(1));
                return newTotal;
              });
            }

            setLastLocation(newLocation);
          },
          (error) => {
            console.error("Geolocation error:", {
              code: error.code,
              message: error.message,
              timestamp: new Date().toISOString(),
            });
          },
          { enableHighAccuracy: true },
        );
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isClockedIn, lastLocation]);

  // Format current date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
  };

  // Handle slider drag
  const handleSliderStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleSliderMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;

    const slider = e.currentTarget as HTMLElement;
    const rect = slider.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const position = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100),
    );

    setSliderPosition(position);

    // Auto clock-in when slider reaches 80%
    if (position > 80 && !isClockingIn) {
      handleClockIn();
    }
  };

  const handleSliderEnd = () => {
    setIsDragging(false);
    if (sliderPosition < 80) {
      setSliderPosition(0);
    }
  };

  const updateWorkingHours = () => {
    const clockInTime = localStorage.getItem("clockInTime");
    if (clockInTime) {
      const startTime = new Date(clockInTime);
      const now = new Date();
      const diffMs = now.getTime() - startTime.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const formatted = `${hours}:${minutes.toString().padStart(2, "0")}`;
      setWorkingHours(formatted);
      localStorage.setItem("workingHours", formatted);
    }
  };

  const calculateDistance = (
    pos1: { lat: number; lng: number },
    pos2: { lat: number; lng: number },
  ) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = ((pos2.lat - pos1.lat) * Math.PI) / 180;
    const dLng = ((pos2.lng - pos1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((pos1.lat * Math.PI) / 180) *
        Math.cos((pos2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateOvertimeRate = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const isPublicHoliday = checkIfPublicHoliday(now);

    if (dayOfWeek === 0 || isPublicHoliday) {
      // Sunday or public holiday
      return "2.0";
    } else {
      // Weekdays and Saturday
      return "1.5";
    }
  };

  const checkIfPublicHoliday = (date: Date) => {
    // Add public holiday logic here
    // For now, return false
    return false;
  };

  const handleClockToggle = async () => {
    const wasClockingIn = !isClockedIn; // Track if we're clocking in before state changes

    // For technicians clocking in, show assistant selection first
    if (!isClockedIn && userRole === "Technician") {
      setShowAssistantSelection(true);
      return;
    }

    await processClockToggle(wasClockingIn);
  };

  const processClockToggle = async (wasClockingIn: boolean) => {
    if (isClockedIn) {
      // Clock Out
      setIsClockingIn(true);
      setSliderPosition(100);

      const clockOutTime = new Date().toISOString();
      const currentClockIns = [...dailyClockIns];

      // Update the last clock-in entry with clock-out time
      if (currentClockIns.length > 0) {
        currentClockIns[currentClockIns.length - 1].clockOut = clockOutTime;
      }

      localStorage.setItem("clockOutTime", clockOutTime);
      localStorage.setItem("isClockedIn", "false");
      localStorage.setItem("dailyClockIns", JSON.stringify(currentClockIns));

      setIsClockedIn(false);
      setDailyClockIns(currentClockIns);

      // Stop location tracking
      locationService.handleClockOut();

      // Save clock record to database
      await saveClockRecordToDatabase(currentClockIns);

      // Show feedback overlay after clocking out
      setShowFeedbackOverlay(true);

      // Check for automatic overtime claims
      await checkForOvertimeClaims();

      // End technician-assistant assignment
      const authUser = authManager.getUser();
      if (authUser?.employeeId) {
        try {
          await authManager.makeAuthenticatedRequest(
            `/api/assistants/assignments/${authUser.employeeId}/end`,
            { method: "POST" }
          );
        } catch (error) {
          console.warn("Failed to end assistant assignment:", error);
        }
      }
    } else {
      // Clock In
      setIsClockingIn(true);
      setSliderPosition(100);

      const clockInTime = new Date().toISOString();
      const newClockIn = { clockIn: clockInTime };
      const updatedClockIns = [...dailyClockIns, newClockIn];

      localStorage.setItem("clockInTime", clockInTime);
      localStorage.setItem("isClockedIn", "true");
      localStorage.setItem("dailyClockIns", JSON.stringify(updatedClockIns));

      // Reset distance for new session
      setTotalDistance(0);
      setDistanceTraveled("0.0");
      localStorage.setItem("distanceTraveled", "0.0");

      setIsClockedIn(true);
      setDailyClockIns(updatedClockIns);

      // Request location permission and start tracking
      const locationGranted = await locationService.handleClockIn();

      if (locationGranted) {
        showNotification.locationGranted();
      } else {
        showNotification.locationDenied();
      }

      // Create technician-assistant assignment if assistant selected
      if (selectedAssistant) {
        try {
          await authManager.makeAuthenticatedRequest("/api/assistants/assignments", {
            method: "POST",
            body: JSON.stringify({
              technicianId: authUser?.employeeId,
              assistantId: selectedAssistant.id,
              startTime: clockInTime,
            }),
          });
          console.log("Technician-assistant assignment created successfully");
        } catch (error) {
          console.error("Failed to create technician-assistant assignment:", error);
        }
      }

      // Save clock record to database
      await saveClockRecordToDatabase(updatedClockIns);
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsClockingIn(false);
    setSliderPosition(0);

    // Navigate to appropriate dashboard if we just clocked in
    if (wasClockingIn) {
      if (
        userRole === "Assistant Technician" ||
        userRole === "AssistantTechnician"
      ) {
        navigate("/assistant-technician");
      } else {
        navigate("/technician");
      }
    }
  };

  const checkForOvertimeClaims = async () => {
    // Get current location to check if at client site
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Check if at client location (this would need client location data)
        const isAtClientSite = await checkIfAtClientSite(currentLocation);

        if (isAtClientSite && isAfterWorkingHours()) {
          // Auto-create overtime claim
          await createOvertimeClaim();
        }
      });
    }
  };

  const checkIfAtClientSite = async (location: {
    lat: number;
    lng: number;
  }) => {
    // This would check against a database of client locations
    // For now, return false
    return false;
  };

  const isAfterWorkingHours = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const hour = now.getHours();

    // Standard working hours: Mon-Thu 7:30-17:00, Fri 7:30-16:00
    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      // Monday to Thursday
      return hour >= 17;
    } else if (dayOfWeek === 5) {
      // Friday
      return hour >= 16;
    }
    return true; // Weekend
  };

  const createOvertimeClaim = async () => {
    const authUser = authManager.getUser();
    const workOrderNumber =
      localStorage.getItem("currentWorkOrder") || "Unknown";
    const overtimeClaim = {
      id: Date.now().toString(),
      technician: authUser?.employeeId || "UNKNOWN",
      technicianName: authUser?.fullName || userName,
      date: new Date().toISOString(),
      workOrder: workOrderNumber,
      reason: "Still on site after working hours (System Claim)",
      status: "pending",
    };

    // Save to localStorage for now (would be API call in production)
    const existingClaims = JSON.parse(
      localStorage.getItem("overtimeClaims") || "[]",
    );
    existingClaims.push(overtimeClaim);
    localStorage.setItem("overtimeClaims", JSON.stringify(existingClaims));
  };

  const saveClockRecordToDatabase = async (
    clockIns: Array<{ clockIn: string; clockOut?: string }>,
  ) => {
    try {
      const authUser = authManager.getUser();
      const employeeId = authUser?.employeeId || "UNKNOWN";
      const today = new Date().toISOString().split("T")[0];

      // Calculate total working hours and distance
      let totalWorkingHours = 0;
      let totalDistance = parseFloat(distanceTraveled) || 0;

      clockIns.forEach((session) => {
        if (session.clockOut) {
          const clockInTime = new Date(session.clockIn);
          const clockOutTime = new Date(session.clockOut);
          const hoursWorked =
            (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);
          totalWorkingHours += hoursWorked;
        }
      });

      const clockRecord = {
        id: `${employeeId}-${today}`,
        employeeId: employeeId,
        technicianName: authUser?.fullName || userName,
        department: authUser?.department || "Unknown",
        date: today,
        clockIns: clockIns,
        totalWorkingHours,
        totalDistance,
        dailyFeedback: dailyFeedback
          ? {
              rating: feedbackRating,
              feedback: dailyFeedback,
              timestamp: new Date().toISOString(),
            }
          : undefined,
        overtimeClaims: [],
      };

      const response = await fetch("/api/db/clock-records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clockRecord),
      });

      if (response.ok) {
        console.log("Clock record saved to database");
      } else {
        console.error("Failed to save clock record to database");
      }
    } catch (error) {
      console.error("Error saving clock record:", error);
    }
  };

  const handleClockIn = () => {
    handleClockToggle();
  };

  const submitDailyFeedback = async () => {
    const authUser = authManager.getUser();
    const feedback = {
      id: Date.now().toString(),
      technician: authUser?.employeeId || "UNKNOWN",
      technicianName: authUser?.fullName || userName,
      date: new Date().toISOString(),
      rating: feedbackRating,
      feedback: dailyFeedback,
      workingHours: workingHours,
      distanceTraveled: distanceTraveled,
    };

    // Save to localStorage for HR to pull later (fallback)
    const existingFeedback = JSON.parse(
      localStorage.getItem("dailyFeedback") || "[]",
    );
    existingFeedback.push(feedback);
    localStorage.setItem("dailyFeedback", JSON.stringify(existingFeedback));

    // Also update the clock record in database with feedback
    await saveClockRecordToDatabase(dailyClockIns);

    // Reset states
    setShowFeedbackOverlay(false);
    setDailyFeedback("");
    setFeedbackRating(null);
  };

  const skipFeedback = () => {
    setShowFeedbackOverlay(false);
    setDailyFeedback("");
    setFeedbackRating(null);
  };

  // Make the entire slider clickable
  const handleSliderClick = (e: React.MouseEvent) => {
    if (!isClockingIn && !isDragging) {
      e.preventDefault();
      e.stopPropagation();
      handleClockToggle();
    }
  };

  const handleClose = () => {
    // Navigate to appropriate dashboard based on user role
    console.log("Closing clock-in screen, userRole:", userRole);
    if (
      userRole === "Assistant Technician" ||
      userRole === "AssistantTechnician"
    ) {
      navigate("/assistant-technician");
    } else if (userRole === "Technician") {
      navigate("/technician");
    } else {
      // Fallback to technician dashboard for any technician-like role
      navigate("/technician");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-orange-600 text-white flex flex-col">
      {/* Header */}
      <div className="flex justify-end p-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 rounded-full h-10 w-10"
          onClick={handleClose}
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* User Avatar */}
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-red-500 flex items-center justify-center text-4xl font-bold">
            {getInitials(userName)}
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
        </div>

        {/* User Name */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white text-center">
            {userName}
          </h2>
          <p className="text-white/80 text-center">{userRole}</p>
        </div>

        {/* Date */}
        <div className="mb-12">
          <div className="bg-white/20 px-6 py-2 rounded-full">
            <span className="text-white font-medium">
              {formatDate(currentTime)}
            </span>
          </div>
        </div>

        {/* Time Stats */}
        <div className="flex justify-between w-full max-w-sm mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold">{workingHours}</div>
            <div className="text-sm opacity-90 font-medium">HRS</div>
            <div className="mt-2">
              <div className="bg-white/20 px-4 py-1 rounded-full text-sm">
                Worked today
              </div>
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold">{distanceTraveled}</div>
            <div className="text-sm opacity-90 font-medium">KMS</div>
            <div className="mt-2">
              <div className="bg-white/20 px-4 py-1 rounded-full text-sm">
                Travelled today
              </div>
            </div>
          </div>
        </div>

        {/* Clock Status Indicator */}
        {isClockedIn && (
          <div className="mb-4">
            <div className="bg-green-500/20 px-6 py-2 rounded-full border border-green-300">
              <span className="text-green-100 font-medium flex items-center justify-center">
                <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
                Currently Clocked In
              </span>
            </div>
          </div>
        )}

        {/* Clock In Slider */}
        <div className="w-full max-w-sm mb-8">
          <div
            className="relative h-16 bg-white/20 rounded-2xl cursor-pointer overflow-hidden"
            onClick={handleSliderClick}
            onMouseMove={handleSliderMove}
            onMouseUp={handleSliderEnd}
            onMouseLeave={handleSliderEnd}
            onTouchMove={handleSliderMove}
            onTouchEnd={handleSliderEnd}
          >
            {/* Slider Track */}
            <div
              className={`absolute left-0 top-0 h-full transition-all duration-300 rounded-2xl ${
                isClockingIn ? "bg-green-500" : "bg-white/30"
              }`}
              style={{ width: `${sliderPosition}%` }}
            />

            {/* Slider Handle */}
            <div
              className={`absolute top-2 left-2 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isClockingIn
                  ? "bg-white text-green-500"
                  : "bg-white text-orange-500"
              }`}
              style={{
                transform: `translateX(${Math.max(0, (sliderPosition / 100) * (100 - 20))}%)`,
                cursor: isDragging ? "grabbing" : "grab",
              }}
              onMouseDown={handleSliderStart}
              onTouchStart={handleSliderStart}
            >
              {isClockingIn ? (
                <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <div className="w-6 h-6 rounded bg-orange-500" />
              )}
            </div>

            {/* Slider Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className={`font-medium transition-opacity ${sliderPosition > 20 ? "opacity-0" : "opacity-100"}`}
              >
                {isClockingIn
                  ? isClockedIn
                    ? "Clocking Out..."
                    : "Clocking In..."
                  : isClockedIn
                    ? "Clock Out"
                    : "Clock In"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between w-full max-w-sm">
          <div className="text-sm opacity-75">
            Britelink MCT Time • Overtime {calculateOvertimeRate()}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => {
              /* Handle edit */
            }}
          >
            <Edit3 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Bottom Navigation Indicator */}
      <div className="flex justify-center items-center space-x-4 pb-8">
        <div className="w-8 h-1 bg-white/30 rounded" />
        <div className="w-8 h-8 border-2 border-white/30 rounded" />
        <div className="w-6 h-6 text-white/50">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </div>
      </div>

      {/* Daily Feedback Overlay */}
      {showFeedbackOverlay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                How was your day?
              </h3>
              <p className="text-gray-600 text-sm">
                Your feedback helps us improve working conditions
              </p>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rate your day (1-5)
              </label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFeedbackRating(rating)}
                    className={`w-12 h-12 rounded-full border-2 font-semibold transition-all ${
                      feedbackRating === rating
                        ? rating <= 2
                          ? "bg-red-500 border-red-500 text-white"
                          : rating === 3
                            ? "bg-yellow-500 border-yellow-500 text-white"
                            : "bg-green-500 border-green-500 text-white"
                        : "border-gray-300 text-gray-500 hover:border-gray-400"
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Text */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Optional feedback
              </label>
              <textarea
                value={dailyFeedback}
                onChange={(e) => setDailyFeedback(e.target.value)}
                placeholder="Tell us about your day, any challenges, or suggestions..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={skipFeedback}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Skip
              </button>
              <button
                onClick={submitDailyFeedback}
                className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
