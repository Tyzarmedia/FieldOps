import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Edit3, ChevronDown } from "lucide-react";
import { assistants } from "../data/sharedJobs";

interface ClockInScreenProps {
  userRole?: string;
  userName?: string;
}

export default function ClockInScreen({
  userRole: propUserRole,
  userName: propUserName,
}: ClockInScreenProps = {}) {
  // Get user info from localStorage if not provided as props
  const userRole =
    propUserRole || localStorage.getItem("userRole") || "Technician";
  const userName =
    propUserName || localStorage.getItem("userName") || "John Doe";
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workingHours, setWorkingHours] = useState("0:00");
  const [distanceTraveled, setDistanceTraveled] = useState("0.0");
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<string>("");
  const [clockInTime, setClockInTime] = useState<Date | null>(null);
  const [trackingInterval, setTrackingInterval] =
    useState<NodeJS.Timeout | null>(null);
  const navigate = useNavigate();

  // Check if user is already clocked in
  useEffect(() => {
    const clockedInStatus = localStorage.getItem("isClockedIn");
    const storedClockInTime = localStorage.getItem("clockInTime");
    const storedAssistant = localStorage.getItem("selectedAssistant");

    if (clockedInStatus === "true" && storedClockInTime) {
      setIsClockedIn(true);
      setClockInTime(new Date(storedClockInTime));
      setSelectedAssistant(storedAssistant || "");
      startTracking(new Date(storedClockInTime));
    }
  }, []);

  // Global drag handling
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      const slider = document.querySelector('.clock-slider') as HTMLElement;
      if (!slider) return;

      const rect = slider.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const position = Math.max(
        0,
        Math.min(100, ((clientX - rect.left) / rect.width) * 100),
      );

      setSliderPosition(position);

      // Auto action when slider reaches 80%
      if (position > 80 && !isClockingIn) {
        if (isClockedIn) {
          handleClockOut();
        } else {
          handleClockIn();
        }
      }
    };

    const handleGlobalEnd = () => {
      setIsDragging(false);
      setSliderPosition(prev => prev < 80 ? 0 : prev);
    };

    document.addEventListener('mousemove', handleGlobalMove);
    document.addEventListener('mouseup', handleGlobalEnd);
    document.addEventListener('touchmove', handleGlobalMove);
    document.addEventListener('touchend', handleGlobalEnd);

    return () => {
      document.removeEventListener('mousemove', handleGlobalMove);
      document.removeEventListener('mouseup', handleGlobalEnd);
      document.removeEventListener('touchmove', handleGlobalMove);
      document.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isDragging, isClockingIn, isClockedIn, handleClockIn, handleClockOut]);

  // Get user initials
  const getInitials = (name: string) => {
    if (!name) return "JD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Start tracking work time and distance
  const startTracking = (startTime: Date) => {
    if (trackingInterval) clearInterval(trackingInterval);

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = now.getTime() - startTime.getTime();
      const hours = Math.floor(elapsed / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));

      setWorkingHours(`${hours}:${minutes.toString().padStart(2, "0")}`);

      // Simulate distance tracking (in real app would use GPS)
      const totalMinutes = Math.floor(elapsed / (1000 * 60));
      setDistanceTraveled((totalMinutes * 0.5).toFixed(1)); // 0.5 km per minute simulation
    }, 60000); // Update every minute

    setTrackingInterval(interval);
  };

  // Stop tracking
  const stopTracking = () => {
    if (trackingInterval) {
      clearInterval(trackingInterval);
      setTrackingInterval(null);
    }
  };

  // Get overtime rate based on day
  const getOvertimeRate = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    // You can add holiday checking logic here
    return isWeekend ? "2.0" : "1.5";
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    // Prevent slider if no assistant selected and not clocked in
    if (!isClockedIn && !selectedAssistant) return;

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

    // Auto action when slider reaches 80%
    if (position > 80 && !isClockingIn) {
      if (isClockedIn) {
        handleClockOut();
      } else {
        handleClockIn();
      }
    }
  };

  const handleSliderEnd = () => {
    setIsDragging(false);
    if (sliderPosition < 80) {
      setSliderPosition(0);
    }
  };

  const handleClockIn = useCallback(async () => {
    if (!selectedAssistant) return;

    setIsClockingIn(true);
    setSliderPosition(100);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const now = new Date();
    setClockInTime(now);
    setIsClockedIn(true);

    // Store in localStorage
    localStorage.setItem("isClockedIn", "true");
    localStorage.setItem("clockInTime", now.toISOString());
    localStorage.setItem("selectedAssistant", selectedAssistant);

    // Start tracking
    startTracking(now);

    setIsClockingIn(false);
    setSliderPosition(0);

    // Navigate to dashboard
    navigate("/");
  }, [selectedAssistant, navigate, startTracking]);

  const handleClockOut = useCallback(async () => {
    setIsClockingIn(true);
    setSliderPosition(100);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Stop tracking
    stopTracking();

    // Clear localStorage
    localStorage.removeItem("isClockedIn");
    localStorage.removeItem("clockInTime");
    localStorage.removeItem("selectedAssistant");

    // Reset state
    setIsClockedIn(false);
    setClockInTime(null);
    setSelectedAssistant("");
    setWorkingHours("0:00");
    setDistanceTraveled("0.0");
    setIsClockingIn(false);
    setSliderPosition(0);
  }, [stopTracking]);

  const handleClose = () => {
    // Always go to dashboard from clock-in screen
    navigate("/");
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

        {/* User Info */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-white">{userName}</h2>
          <p className="text-white/80 text-sm">
            {userRole === "AssistantTechnician" ? "Assistant Technician" : "Technician"}
          </p>
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

        {/* Assistant Selection */}
        {!isClockedIn && (
          <div className="w-full max-w-sm mb-6">
            <Select
              value={selectedAssistant}
              onValueChange={setSelectedAssistant}
            >
              <SelectTrigger className="bg-white/20 border-white/30 text-white">
                <SelectValue placeholder="Choose Assistant or Working Alone" />
                <ChevronDown className="h-4 w-4 text-white" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="working-alone">Working Alone</SelectItem>
                {assistants
                  .filter((assistant) => assistant.available)
                  .map((assistant) => (
                    <SelectItem key={assistant.id} value={assistant.name}>
                      {assistant.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Selected Assistant Display */}
        {isClockedIn && selectedAssistant && (
          <div className="w-full max-w-sm mb-6 text-center">
            <div className="bg-white/20 px-4 py-2 rounded-full">
              <span className="text-white font-medium">
                {selectedAssistant === "working-alone"
                  ? "Working Alone"
                  : `Working with: ${selectedAssistant}`}
              </span>
            </div>
          </div>
        )}

        {/* Clock In/Out Slider */}
        <div className="w-full max-w-sm mb-8">
          <div
            className={`clock-slider relative h-16 bg-white/20 rounded-2xl overflow-hidden ${
              !selectedAssistant && !isClockedIn
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            onMouseMove={handleSliderMove}
            onMouseUp={handleSliderEnd}
            onMouseLeave={handleSliderEnd}
            onTouchMove={handleSliderMove}
            onTouchEnd={handleSliderEnd}
          >
            {/* Slider Track */}
            <div
              className={`absolute left-0 top-0 h-full transition-all duration-300 rounded-2xl ${
                isClockingIn
                  ? isClockedIn
                    ? "bg-red-500"
                    : "bg-green-500"
                  : isClockedIn
                    ? "bg-red-300"
                    : "bg-white/30"
              }`}
              style={{ width: `${sliderPosition}%` }}
            />

            {/* Slider Handle */}
            <div
              className={`absolute top-2 left-2 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isClockingIn
                  ? "bg-white text-green-500"
                  : isClockedIn
                    ? "bg-white text-red-500"
                    : "bg-white text-orange-500"
              }`}
              style={{
                transform: `translateX(${Math.max(0, (sliderPosition / 100) * 200)}px)`,
                cursor:
                  !selectedAssistant && !isClockedIn
                    ? "not-allowed"
                    : isDragging
                      ? "grabbing"
                      : "grab",
              }}
              onMouseDown={handleSliderStart}
              onTouchStart={handleSliderStart}
            >
              {isClockingIn ? (
                <div
                  className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin ${
                    isClockedIn ? "border-red-500" : "border-green-500"
                  }`}
                />
              ) : (
                <div
                  className={`w-6 h-6 rounded ${
                    isClockedIn ? "bg-red-500" : "bg-orange-500"
                  }`}
                />
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
                  : !selectedAssistant && !isClockedIn
                    ? "Choose Assistant First"
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
            Britelink MCT Time • Overtime {getOvertimeRate()}
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
    </div>
  );
}
