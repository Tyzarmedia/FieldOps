import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AutoLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-login with HR role
    localStorage.setItem("userRole", "HR");
    localStorage.setItem("userEmail", "hr.manager@fiberco.com");

    // Redirect to dashboard
    setTimeout(() => {
      navigate("/");
    }, 100);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-muted-foreground">
          Auto-logging in as HR Manager...
        </p>
      </div>
    </div>
  );
}
