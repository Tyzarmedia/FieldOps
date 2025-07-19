import { useEffect } from "react";
import PayrollDashboard from "./PayrollDashboard";

interface PayrollDashboardWithTabProps {
  defaultTab: string;
}

export default function PayrollDashboardWithTab({
  defaultTab,
}: PayrollDashboardWithTabProps) {
  useEffect(() => {
    // This component will be enhanced to handle tab selection
    // For now, it just renders the main Payroll Dashboard
  }, [defaultTab]);

  return <PayrollDashboard />;
}
