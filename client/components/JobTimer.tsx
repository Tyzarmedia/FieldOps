import { useState, useEffect } from "react";
import { Clock, Play, Pause, Square } from "lucide-react";
import { Button } from "@/components/ui/button";

interface JobTimerProps {
  jobId: string;
  jobStatus: string;
  onTimeUpdate?: (timeSpent: number) => void;
}

export function JobTimer({ jobId, jobStatus, onTimeUpdate }: JobTimerProps) {
  const [timeSpent, setTimeSpent] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  // Check if job should auto-start timer
  useEffect(() => {
    const inProgressStatuses = ["in-progress", "In Progress", "accepted"];
    const completedStatuses = ["completed", "Completed", "Closed"];

    if (inProgressStatuses.includes(jobStatus) && !isRunning && !startTime) {
      startTimer();
    } else if (completedStatuses.includes(jobStatus) && isRunning) {
      stopTimer();
    }
  }, [jobStatus]);

  // Load saved time from localStorage
  useEffect(() => {
    const savedTime = localStorage.getItem(`job-timer-${jobId}`);
    const savedStartTime = localStorage.getItem(`job-start-${jobId}`);
    
    if (savedTime) {
      setTimeSpent(parseInt(savedTime));
    }
    
    if (savedStartTime && jobStatus === "In Progress") {
      const start = parseInt(savedStartTime);
      const now = Date.now();
      const elapsed = Math.floor((now - start) / 1000);
      setTimeSpent(prev => prev + elapsed);
      setStartTime(start);
      setIsRunning(true);
    }
  }, [jobId]);

  // Timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const currentElapsed = Math.floor((now - startTime) / 1000);
        const savedTime = parseInt(localStorage.getItem(`job-timer-${jobId}`) || "0");
        const totalTime = savedTime + currentElapsed;
        
        setTimeSpent(totalTime);
        onTimeUpdate?.(totalTime);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime, jobId, onTimeUpdate]);

  const startTimer = () => {
    const now = Date.now();
    setStartTime(now);
    setIsRunning(true);
    localStorage.setItem(`job-start-${jobId}`, now.toString());
  };

  const pauseTimer = () => {
    if (startTime) {
      const now = Date.now();
      const sessionTime = Math.floor((now - startTime) / 1000);
      const newTotalTime = timeSpent + sessionTime;
      
      localStorage.setItem(`job-timer-${jobId}`, newTotalTime.toString());
      localStorage.removeItem(`job-start-${jobId}`);
      
      setTimeSpent(newTotalTime);
      setIsRunning(false);
      setStartTime(null);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      pauseTimer();
    }
    // Final save when job is completed
    localStorage.setItem(`job-timer-final-${jobId}`, timeSpent.toString());
  };

  const resetTimer = () => {
    setTimeSpent(0);
    setIsRunning(false);
    setStartTime(null);
    localStorage.removeItem(`job-timer-${jobId}`);
    localStorage.removeItem(`job-start-${jobId}`);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (jobStatus === "Completed") return "text-green-600";
    if (isRunning) return "text-blue-600";
    return "text-gray-600";
  };

  return (
    <div className="flex items-center gap-2">
      <Clock className={`h-4 w-4 ${getTimerColor()}`} />
      <span className={`font-mono text-sm ${getTimerColor()}`}>
        {formatTime(timeSpent)}
      </span>
      
      {jobStatus !== "Completed" && (
        <div className="flex gap-1 ml-2">
          {!isRunning ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={startTimer}
              className="h-6 w-6 p-0"
              disabled={jobStatus === "Completed"}
            >
              <Play className="h-3 w-3" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={pauseTimer}
              className="h-6 w-6 p-0"
            >
              <Pause className="h-3 w-3" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={resetTimer}
            className="h-6 w-6 p-0"
          >
            <Square className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
