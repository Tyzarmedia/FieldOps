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
import TechnicianDashboard from "./pages/TechnicianDashboard";
import ClockInScreen from "./pages/ClockInScreen";
import TechnicianJobsScreen from "./pages/TechnicianJobsScreen";
import TechnicianSafetyScreen from "./pages/TechnicianSafetyScreen";
import TechnicianFleetScreen from "./pages/TechnicianFleetScreen";
import TechnicianOvertimeScreen from "./pages/TechnicianOvertimeScreen";
import UDFieldsScreen from "./pages/UDFieldsScreen";
import StockScreen from "./pages/StockScreen";
import SignOffScreen from "./pages/SignOffScreen";
import GalleryScreen from "./pages/GalleryScreen";
import CeoDashboard from "./pages/CeoDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import CoordinatorDashboard from "./pages/CoordinatorDashboard";
import AssistantTechnicianDashboard from "./pages/AssistantTechnicianDashboard";
import FleetManagerDashboard from "./pages/FleetManagerDashboard";
import HRDashboard from "./pages/HRDashboard";
import EnhancedHRDashboard from "./pages/EnhancedHRDashboard";
import HRDashboardWithTab from "./pages/HRDashboardWithTab";
import PayrollDashboard from "./pages/PayrollDashboard";
import PayrollDashboardWithTab from "./pages/PayrollDashboardWithTab";
import ITDashboard from "./pages/ITDashboard";
import ITDashboardWithTab from "./pages/ITDashboardWithTab";
import AutoLogin from "./pages/AutoLogin";
import Login from "./pages/Login";
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
  | "HSManager"
  | "HR"
  | "Payroll"
  | "IT";

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

function DashboardRouter() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole") as UserRole;
    setUserRole(storedRole);
  }, []);

  switch (userRole) {
    case "CEO":
      return <CeoDashboard />;
    case "Manager":
      return <ManagerDashboard />;
    case "Coordinator":
      return <CoordinatorDashboard />;
    case "Technician":
      return <TechnicianDashboard />;
    case "AssistantTechnician":
      return <AssistantTechnicianDashboard />;
    case "FleetManager":
      return <FleetManagerDashboard />;
    case "StockManager":
      return (
        <PlaceholderPage
          title="Stock Manager Dashboard"
          description="Inventory management, stock allocation, and usage tracking."
        />
      );
    case "HSManager":
      return (
        <PlaceholderPage
          title="Health & Safety Manager Dashboard"
          description="Safety compliance, incident management, and H&S task assignment."
        />
      );
    case "HR":
      return <EnhancedHRDashboard />;
    case "Payroll":
      return <PayrollDashboard />;
    case "IT":
      return <ITDashboard />;
    default:
      return <Dashboard />;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/demo-hr" element={<AutoLogin />} />
          <Route path="/clock-in" element={<ClockInScreen />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardRouter />
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
          <Route path="/technician/jobs" element={<TechnicianJobsScreen />} />
          <Route
            path="/technician/safety"
            element={<TechnicianSafetyScreen />}
          />
          <Route path="/technician/fleet" element={<TechnicianFleetScreen />} />
          <Route
            path="/technician/overtime"
            element={<TechnicianOvertimeScreen />}
          />
          <Route path="/technician/udf" element={<UDFieldsScreen />} />
          <Route path="/technician/stock" element={<StockScreen />} />
          <Route path="/technician/gallery" element={<GalleryScreen />} />
          <Route path="/technician/signoff" element={<SignOffScreen />} />
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
          {/* HR Routes */}
          <Route
            path="/employees"
            element={
              <ProtectedRoute>
                <HRDashboardWithTab defaultTab="employees" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave-requests"
            element={
              <ProtectedRoute>
                <HRDashboardWithTab defaultTab="leave" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <HRDashboardWithTab defaultTab="onboarding" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/disciplinary"
            element={
              <ProtectedRoute>
                <HRDashboardWithTab defaultTab="disciplinary" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr-reports"
            element={
              <ProtectedRoute>
                <HRDashboardWithTab defaultTab="reports" />
              </ProtectedRoute>
            }
          />
          {/* Payroll Routes */}
          <Route
            path="/payroll"
            element={
              <ProtectedRoute>
                <PayrollDashboardWithTab defaultTab="payroll" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/overtime"
            element={
              <ProtectedRoute>
                <PayrollDashboardWithTab defaultTab="overtime" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bonuses"
            element={
              <ProtectedRoute>
                <PayrollDashboardWithTab defaultTab="bonuses" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payslips"
            element={
              <ProtectedRoute>
                <PayrollDashboardWithTab defaultTab="payslips" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payroll-reports"
            element={
              <ProtectedRoute>
                <PayrollDashboardWithTab defaultTab="reports" />
              </ProtectedRoute>
            }
          />
          {/* New Technician Navigation Routes */}
          <Route
            path="/apply-leave"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Apply Leave"
                  description="Submit leave requests and view leave balance."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stock-on-hand"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Stock on Hand"
                  description="View current stock levels and available equipment."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/network-assessment"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Network Assessment"
                  description="Perform network diagnostics and assessments."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/overtime-list"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Overtime List"
                  description="View and manage overtime records."
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/technician-settings"
            element={
              <ProtectedRoute>
                <PlaceholderPage
                  title="Technician Settings"
                  description="Configure technician-specific settings and preferences."
                />
              </ProtectedRoute>
            }
          />
          {/* IT Routes */}
          <Route
            path="/assets"
            element={
              <ProtectedRoute>
                <ITDashboardWithTab defaultTab="assets" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support-tickets"
            element={
              <ProtectedRoute>
                <ITDashboardWithTab defaultTab="tickets" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/system-access"
            element={
              <ProtectedRoute>
                <ITDashboardWithTab defaultTab="access" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/audit-logs"
            element={
              <ProtectedRoute>
                <ITDashboardWithTab defaultTab="audit" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/it-reports"
            element={
              <ProtectedRoute>
                <ITDashboardWithTab defaultTab="reports" />
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
