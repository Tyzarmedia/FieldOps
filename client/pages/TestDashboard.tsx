import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TestDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate login
    localStorage.setItem("userRole", "Technician");
    localStorage.setItem("userEmail", "demo@fieldops.com");

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      navigate("/");
    }, 100);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
