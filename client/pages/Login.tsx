import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserCheck, Building, Users, Shield } from "lucide-react";

const userRoles = [
  { value: "CEO", label: "CEO", icon: Building, color: "text-purple-600" },
  {
    value: "Manager",
    label: "Manager",
    icon: Users,
    color: "text-blue-600",
  },
  {
    value: "Coordinator",
    label: "Coordinator",
    icon: UserCheck,
    color: "text-green-600",
  },
  {
    value: "Technician",
    label: "Technician",
    icon: UserCheck,
    color: "text-orange-600",
  },
  {
    value: "AssistantTechnician",
    label: "Assistant Technician",
    icon: UserCheck,
    color: "text-orange-400",
  },
  {
    value: "FleetManager",
    label: "Fleet Manager",
    icon: UserCheck,
    color: "text-cyan-600",
  },
  {
    value: "StockManager",
    label: "Stock Manager",
    icon: UserCheck,
    color: "text-indigo-600",
  },
  {
    value: "HSManager",
    label: "Health & Safety Manager",
    icon: Shield,
    color: "text-red-600",
  },
  {
    value: "HR",
    label: "HR Manager",
    icon: Users,
    color: "text-emerald-600",
  },
  {
    value: "Payroll",
    label: "Payroll Manager",
    icon: Building,
    color: "text-amber-600",
  },
  {
    value: "IT",
    label: "IT Manager",
    icon: UserCheck,
    color: "text-slate-600",
  },
];

export default function Login() {
  const [email, setEmail] = useState("demo@fieldops.com");
  const [password, setPassword] = useState("demo123");
  const [selectedRole, setSelectedRole] = useState("HR");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      // Store user role for the app
      localStorage.setItem("userRole", selectedRole);
      localStorage.setItem("userEmail", email);
      setIsLoading(false);

      // Mobile roles go to clock-in first, others go to dashboard
      const mobileRoles = ["Technician", "AssistantTechnician"];
      if (mobileRoles.includes(selectedRole)) {
        navigate("/clock-in");
      } else {
        navigate("/");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-primary flex items-center justify-center">
            <UserCheck className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">FieldOps</h1>
          <p className="text-muted-foreground">
            Field Service Management Platform
          </p>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {userRoles.map((role) => {
                      const Icon = role.icon;
                      return (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center space-x-2">
                            <Icon className={`h-4 w-4 ${role.color}`} />
                            <span>{role.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !selectedRole}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">Demo Credentials:</p>
                <p>Email: demo@fieldops.com</p>
                <p>Password: demo123</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role descriptions */}
        <Card className="mt-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">Role Descriptions</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-2">
            <div className="grid grid-cols-1 gap-2">
              <div>
                <strong className="text-purple-600">CEO:</strong> Full access +
                dashboard customization
              </div>
              <div>
                <strong className="text-blue-600">Manager:</strong> View/manage
                teams, customize dashboards
              </div>
              <div>
                <strong className="text-green-600">Coordinator:</strong> Assign
                jobs, monitor technician progress
              </div>
              <div>
                <strong className="text-orange-600">Technician:</strong>{" "}
                Complete all types of assigned jobs
              </div>
              <div>
                <strong className="text-red-600">H&S Manager:</strong> Assign
                safety checklists, log incidents
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
