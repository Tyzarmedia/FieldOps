import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Edit3 } from "lucide-react";

interface ClockInScreenProps {
  userRole?: string;
  userName?: string;
}

export default function ClockInScreen({ userRole: propUserRole, userName: propUserName }: ClockInScreenProps = {}) {
  // Get user info from localStorage if not provided as props
  const userRole = propUserRole || localStorage.getItem("userRole") || "Technician";
  const userName = propUserName || localStorage.getItem("userName") || "John Doe";
  const [isClockingIn, setIsClockingIn] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [workingHours, setWorkingHours] = useState("0:00");
  const [distanceTraveled, setDistanceTraveled] = useState("0.0");
  const [sliderPosition, setSliderPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  // Get user initials
  const getInitials = (name: string) => {
    if (!name) return "JD";
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
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
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
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
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const position = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    
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

  const handleClockIn = async () => {
    setIsClockingIn(true);
    setSliderPosition(100);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Navigate to dashboard
    const dashboardRoute = userRole === 'Technician' ? '/technician' : '/assistant-technician';
    navigate(dashboardRoute);
  };

  const handleClose = () => {
    navigate('/login');
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
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-red-500 flex items-center justify-center text-4xl font-bold">
            {getInitials(userName)}
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
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

        {/* Clock In Slider */}
        <div className="w-full max-w-sm mb-8">
          <div
            className="relative h-16 bg-white/20 rounded-2xl cursor-pointer overflow-hidden"
            onMouseMove={handleSliderMove}
            onMouseUp={handleSliderEnd}
            onMouseLeave={handleSliderEnd}
            onTouchMove={handleSliderMove}
            onTouchEnd={handleSliderEnd}
          >
            {/* Slider Track */}
            <div 
              className={`absolute left-0 top-0 h-full transition-all duration-300 rounded-2xl ${
                isClockingIn ? 'bg-green-500' : 'bg-white/30'
              }`}
              style={{ width: `${sliderPosition}%` }}
            />
            
            {/* Slider Handle */}
            <div
              className={`absolute top-2 left-2 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isClockingIn ? 'bg-white text-green-500' : 'bg-white text-orange-500'
              }`}
              style={{ 
                transform: `translateX(${Math.max(0, (sliderPosition / 100) * (100 - 20))}%)`,
                cursor: isDragging ? 'grabbing' : 'grab'
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
              <span className={`font-medium transition-opacity ${sliderPosition > 20 ? 'opacity-0' : 'opacity-100'}`}>
                {isClockingIn ? 'Clocking In...' : 'Clock In'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between w-full max-w-sm">
          <div className="text-sm opacity-75">
            Britelink MCT Time • Overtime 1.5
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => {/* Handle edit */}}
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
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
