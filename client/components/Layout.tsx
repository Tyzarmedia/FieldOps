import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  LayoutDashboard,
  Clock,
  ClipboardList,
  Truck,
  Shield,
  Package,
  Users,
  Settings,
  LogOut,
  UserCheck,
  AlertCircle,
  Activity,
  Calendar,
  Package2,
  Network,
  Timer,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
  userRole?:
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
    | "IT"
    | "SystemAdministrator";
}

export function Layout({ children, userRole = "Technician" }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = getNavigationForRole(userRole);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo and close button */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold text-sidebar-foreground">
                FieldOps
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-sidebar-border">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-sidebar-foreground">
                  John Doe
                </p>
                <p className="text-xs text-sidebar-foreground/60">{userRole}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Page content */}
        <main className="p-4 sm:p-6 sm:pt-px">{children}</main>
      </div>
    </div>
  );
}

function getNavigationForRole(role: string) {
  const baseNavigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
  ];

  switch (role) {
    case "CEO":
      return [
        ...baseNavigation,
        { name: "Analytics", href: "/analytics", icon: Activity },
        { name: "Team Management", href: "/team-management", icon: Users },
        { name: "System Settings", href: "/settings", icon: Settings },
      ];

    case "Manager":
      return [
        ...baseNavigation,
        { name: "Team Tracking", href: "/team-tracking", icon: Users },
        {
          name: "Job Analytics",
          href: "/job-analytics",
          icon: LayoutDashboard,
        },
        { name: "Job Board", href: "/job-board", icon: ClipboardList },
      ];

    case "Coordinator":
      return [
        ...baseNavigation,
        { name: "Assign Jobs", href: "/assign-jobs", icon: ClipboardList },
        {
          name: "Monitor Progress",
          href: "/monitor-progress",
          icon: UserCheck,
        },
        { name: "Reports", href: "/reports", icon: LayoutDashboard },
      ];

    case "Technician":
    case "AssistantTechnician":
      return [
        { name: "Apply Leave", href: "/apply-leave", icon: Calendar },
        { name: "Stock on Hand", href: "/stock-on-hand", icon: Package2 },
        {
          name: "Network Assessment",
          href: "/network-assessment",
          icon: Network,
        },
        { name: "Overtime List", href: "/overtime-list", icon: Timer },
        { name: "Settings", href: "/technician-settings", icon: Settings },
      ];

    case "FleetManager":
      return [
        ...baseNavigation,
        { name: "Fleet Overview", href: "/fleet-overview", icon: Truck },
        {
          name: "Vehicle Inspections",
          href: "/vehicle-inspections",
          icon: ClipboardList,
        },
        {
          name: "Assign Fleet Jobs",
          href: "/assign-fleet-jobs",
          icon: ClipboardList,
        },
      ];

    case "StockManager":
      return [
        ...baseNavigation,
        { name: "Stock Overview", href: "/stock-overview", icon: Package },
        { name: "Allocate Stock", href: "/allocate-stock", icon: Package },
        {
          name: "Usage Reports",
          href: "/usage-reports",
          icon: LayoutDashboard,
        },
      ];

    case "HSManager":
      return [
        ...baseNavigation,
        { name: "Safety Overview", href: "/safety-overview", icon: Shield },
        {
          name: "Assign Checklists",
          href: "/assign-checklists",
          icon: ClipboardList,
        },
        { name: "Incident Logs", href: "/incident-logs", icon: Shield },
      ];

    case "HR":
      return [
        ...baseNavigation,
        { name: "Employees", href: "/employees", icon: Users },
        { name: "Leave Requests", href: "/leave-requests", icon: Clock },
        { name: "Onboarding", href: "/onboarding", icon: UserCheck },
        { name: "Disciplinary", href: "/disciplinary", icon: AlertCircle },
        { name: "HR Reports", href: "/hr-reports", icon: ClipboardList },
      ];

    case "Payroll":
      return [
        ...baseNavigation,
        { name: "Payroll", href: "/payroll", icon: Users },
        { name: "Overtime", href: "/overtime", icon: Clock },
        { name: "Bonuses", href: "/bonuses", icon: Users },
        { name: "Payslips", href: "/payslips", icon: ClipboardList },
        { name: "Reports", href: "/payroll-reports", icon: ClipboardList },
      ];

    case "IT":
      return [
        ...baseNavigation,
        { name: "Assets", href: "/assets", icon: Settings },
        {
          name: "Support Tickets",
          href: "/support-tickets",
          icon: ClipboardList,
        },
        { name: "System Access", href: "/system-access", icon: Shield },
        { name: "Audit Logs", href: "/audit-logs", icon: Activity },
        { name: "IT Reports", href: "/it-reports", icon: ClipboardList },
      ];

    case "SystemAdministrator":
      return [
        ...baseNavigation,
        { name: "User Management", href: "/admin/users", icon: Users },
        { name: "System Settings", href: "/admin/settings", icon: Settings },
        { name: "Integrations", href: "/admin/integrations", icon: Truck },
        { name: "Monitoring", href: "/admin/monitoring", icon: Activity },
        { name: "Security", href: "/admin/security", icon: Shield },
        { name: "Data Management", href: "/admin/data", icon: Package },
      ];

    default:
      return baseNavigation;
  }
}

function getPageTitle(pathname: string, role: string) {
  const pathMap: Record<string, string> = {
    "/": "Dashboard",
    "/apply-leave": "Apply Leave",
    "/stock-on-hand": "Stock on Hand",
    "/network-assessment": "Network Assessment",
    "/overtime-list": "Overtime List",
    "/technician-settings": "Settings",
    "/clock": "Clock In/Out",
    "/jobs": "My Jobs",
    "/fleet": "Fleet Tasks",
    "/safety": "Safety Tasks",
    "/stock": "Stock Management",
    "/analytics": "Analytics",
    "/team-management": "Team Management",
    "/team-tracking": "Team Tracking",
    "/job-analytics": "Job Analytics",
    "/job-board": "Job Board",
    "/assign-jobs": "Assign Jobs",
    "/monitor-progress": "Monitor Progress",
    "/reports": "Reports",
    "/fleet-overview": "Fleet Overview",
    "/vehicle-inspections": "Vehicle Inspections",
    "/stock-overview": "Stock Overview",
    "/safety-overview": "Safety Overview",
    "/admin": "System Administration",
    "/admin/users": "User Management",
    "/admin/settings": "System Settings",
    "/admin/integrations": "Integration Management",
    "/admin/monitoring": "System Monitoring",
    "/admin/security": "Security & Compliance",
    "/admin/data": "Data Management",
  };

  return pathMap[pathname] || "FieldOps";
}
