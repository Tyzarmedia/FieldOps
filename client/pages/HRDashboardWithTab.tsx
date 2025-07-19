import { useEffect } from "react";
import EnhancedHRDashboard from "./EnhancedHRDashboard";

interface HRDashboardWithTabProps {
  defaultTab: string;
}

export default function HRDashboardWithTab({
  defaultTab,
}: HRDashboardWithTabProps) {
  useEffect(() => {
    // This component will be enhanced to handle tab selection
    // For now, it just renders the main HR Dashboard
  }, [defaultTab]);

  return <HRDashboard />;
}
