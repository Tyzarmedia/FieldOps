import "./global.css";

import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/Layout";
import { PlaceholderPage } from "./components/PlaceholderPage";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import TestDashboard from "./pages/TestDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

type UserRole =
  | "CEO"
  | "Manager"
  | "Coordinator"
  | "Technician"
  | "AssistantTechnician"
  | "FleetManager"
  | "StockManager"
  | "HSManager";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole;
    setUserRole(storedRole);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  return <Layout userRole={userRole}>{children}</Layout>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/test" element={<TestDashboard />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clock"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Clock In/Out"
                  description="Dedicated clock in/out page with GPS tracking and time management features."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Job Management"
                  description="Detailed job management interface with filtering, sorting, and status updates."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fleet"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Fleet Management"
                  description="Vehicle inspections, maintenance tracking, and fleet task management."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/safety"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Safety Management"
                  description="Health & Safety checklists, incident reporting, and compliance tracking."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Stock Management"
                  description="Inventory tracking, stock allocation, and usage reporting."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Analytics Dashboard"
                  description="KPIs, performance metrics, and business intelligence reports."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-management"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Team Management"
                  description="User management, role assignments, and team organization."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/team-tracking"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Team Tracking"
                  description="Real-time technician status, GPS tracking, and performance monitoring."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-analytics"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Job Analytics"
                  description="Job completion rates, efficiency metrics, and trend analysis."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/job-board"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Job Board"
                  description="Create, edit, and manage job assignments across all technicians."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assign-jobs"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Assign Jobs"
                  description="Job assignment interface for coordinators to distribute work."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/monitor-progress"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Progress Monitoring"
                  description="Track job progress, technician status, and completion rates."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Reports"
                  description="Generate and view reports on job completion, efficiency, and performance."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="System Settings"
                  description="Configure system-wide settings, themes, and application preferences."
                />
              </ProtectedRoute>
            }
          />
          {/* Fleet Manager Routes */}
          <Route
            path="/fleet-overview"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Fleet Overview"
                  description="Complete fleet management dashboard with vehicle status and maintenance."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicle-inspections"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Vehicle Inspections"
                  description="Schedule and track vehicle inspections and maintenance tasks."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assign-fleet-jobs"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Assign Fleet Jobs"
                  description="Assign vehicle-related tasks and maintenance jobs to technicians."
                />
              </ProtectedRoute>
            }
          />
          {/* Stock Manager Routes */}
          <Route
            path="/stock-overview"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Stock Overview"
                  description="Comprehensive inventory management and stock level monitoring."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allocate-stock"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Allocate Stock"
                  description="Assign and distribute stock items to technicians for specific jobs."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/usage-reports"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Usage Reports"
                  description="Track stock usage patterns and generate consumption reports."
                />
              </ProtectedRoute>
            }
          />
          {/* H&S Manager Routes */}
          <Route
            path="/safety-overview"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Safety Overview"
                  description="Monitor safety compliance, incidents, and health & safety metrics."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/assign-checklists"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Assign Checklists"
                  description="Create and assign safety checklists and compliance tasks."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/incident-logs"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Incident Logs"
                  description="Review, investigate, and manage safety incidents and reports."
                />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
