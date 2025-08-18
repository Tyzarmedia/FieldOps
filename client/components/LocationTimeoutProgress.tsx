import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { MapPin, Satellite, Signal } from "lucide-react";

interface LocationTimeoutProgressProps {
  isActive: boolean;
  onCancel?: () => void;
  maxTimeout?: number; // in milliseconds
  strategy?: string;
}

export function LocationTimeoutProgress({
  isActive,
  onCancel,
  maxTimeout = 30000, // 30 seconds default
  strategy = "Getting location"
}: LocationTimeoutProgressProps) {
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);

  const phases = [
    { name: "Connecting to GPS", icon: Satellite, duration: 8000 },
    { name: "Acquiring signal", icon: Signal, duration: 12000 },
    { name: "Calculating position", icon: MapPin, duration: 10000 }
  ];

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      setElapsedTime(0);
      setCurrentPhase(0);
      return;
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setElapsedTime(elapsed);
      
      const progressPercent = Math.min((elapsed / maxTimeout) * 100, 100);
      setProgress(progressPercent);

      // Update phase based on elapsed time
      let phaseIndex = 0;
      let cumulativeTime = 0;
      for (let i = 0; i < phases.length; i++) {
        cumulativeTime += phases[i].duration;
        if (elapsed < cumulativeTime) {
          phaseIndex = i;
          break;
        }
        phaseIndex = i;
      }
      setCurrentPhase(phaseIndex);

      if (elapsed >= maxTimeout) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, maxTimeout]);

  if (!isActive) return null;

  const CurrentIcon = phases[currentPhase]?.icon || MapPin;
  const timeRemaining = Math.max(0, maxTimeout - elapsedTime);
  const secondsRemaining = Math.ceil(timeRemaining / 1000);

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center space-x-2">
        <CurrentIcon className="h-5 w-5 text-blue-600 animate-pulse" />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-blue-800">
              {phases[currentPhase]?.name || strategy}
            </span>
            <span className="text-xs text-blue-600">
              {secondsRemaining}s remaining
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
      
      <div className="text-xs text-blue-700 space-y-1">
        <p>📍 Getting your precise location...</p>
        {elapsedTime > 10000 && (
          <p>🔄 Trying different location methods for better accuracy</p>
        )}
        {elapsedTime > 20000 && (
          <p>⏱️ This is taking longer than usual. You may be indoors or in an area with poor GPS signal.</p>
        )}
      </div>

      {onCancel && (
        <button
          onClick={onCancel}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          Cancel and use default location
        </button>
      )}
    </div>
  );
}
