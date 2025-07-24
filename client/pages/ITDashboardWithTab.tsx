import { useEffect } from "react";
import ITDashboard from "./ITDashboard";

interface ITDashboardWithTabProps {
  defaultTab: string;
}

export default function ITDashboardWithTab({
  defaultTab,
}: ITDashboardWithTabProps) {
  useEffect(() => {
    // This component will be enhanced to handle tab selection
    // For now, it just renders the main IT Dashboard
  }, [defaultTab]);

  return <ITDashboard />;
}
