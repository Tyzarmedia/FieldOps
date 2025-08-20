import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserCheck, AlertCircle, Eye, EyeOff } from "lucide-react";

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    employeeId: string;
    email: string;
    fullName: string;
    role: string;
    department: string;
    isActive: boolean;
    accessRoles: string[];
  };
  message?: string;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Starting login attempt for:", email);
      console.log("Password length:", password.length);
      console.log("Password value (first 5 chars):", password.substring(0, 5));

      const requestBody = { email, password };
      console.log("Request body being sent:", requestBody);

      // Temporarily use direct fetch to debug
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Direct fetch response:", {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      });

      let data: LoginResponse;

      // Check if it's an error response first (before reading body)
      if (!response.ok) {
        // For error responses, try to get the error message
        try {
          const errorData = await response.json();
          console.error("Error response JSON:", errorData);
          throw new Error(
            errorData.message ||
              `HTTP ${response.status}: ${response.statusText}`,
          );
        } catch (parseError) {
          console.warn("Could not parse error response as JSON:", parseError);
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      // For successful responses, parse as JSON
      try {
        data = await response.json();
        console.log("Login response data:", data);
      } catch (parseError) {
        console.error(
          "Failed to parse successful response as JSON:",
          parseError,
        );
        throw new Error("Invalid response format from server");
      }

      if (data.success && data.token && data.user) {
        // Store authentication data
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userEmail", data.user.email);
        localStorage.setItem("userFullName", data.user.fullName);
        localStorage.setItem("employeeId", data.user.employeeId);
        localStorage.setItem("department", data.user.department);

        // Clear any existing demo data
        localStorage.removeItem("demoMode");

        navigate("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);

      if (error instanceof Error) {
        if (error.message.includes("401")) {
          setError(
            "Invalid email or password. Please use the test credentials shown below.",
          );
        } else if (error.message.includes("500")) {
          setError("Server error. Please try again later.");
        } else {
          setError(error.message || "Authentication failed");
        }
      } else {
        setError("Network error. Please check your connection and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    // Demo login for testing purposes
    localStorage.setItem("userRole", "HR");
    localStorage.setItem("userEmail", "demo@fieldops.com");
    localStorage.setItem("userFullName", "Demo User");
    localStorage.setItem("demoMode", "true");
    navigate("/");
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
            <CardTitle className="text-center">
              Sign In to Your Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !email || !password}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="text-center text-sm text-muted-foreground mb-4">
                <p className="mb-2">
                  🔗 <strong>Database Integration Active</strong>
                </p>
                <p>Authentication via Sage 300 Employee Database</p>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                Continue with Demo Mode
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Database information */}
        <Card className="mt-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">🗄��� Connected Databases</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-2">
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center justify-between">
                <span>
                  <strong className="text-green-600">✓ Sage 300:</strong>{" "}
                  Employee Authentication & HR Data
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>
                  <strong className="text-green-600">✓ Sage X3:</strong> Stock &
                  Inventory Management
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>
                  <strong className="text-green-600">✓ SP.Vumatel:</strong>{" "}
                  Network Tickets & Job Management
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test credentials info */}
        <Card className="mt-4 shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm">🔑 Test Credentials</CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span>
                  <strong>HR Manager:</strong> thembi@company.com
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEmail("thembi@company.com")}
                  disabled={isLoading}
                  className="text-xs h-6 px-2 ml-2"
                >
                  Fill
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>
                  <strong>Technician:</strong> clement@company.com
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEmail("clement@company.com")}
                  disabled={isLoading}
                  className="text-xs h-6 px-2 ml-2"
                >
                  Fill
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>
                  <strong>Manager:</strong> glassman@company.com
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEmail("glassman@company.com")}
                  disabled={isLoading}
                  className="text-xs h-6 px-2 ml-2"
                >
                  Fill
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>
                  <strong>IT Admin:</strong> shawn@company.com
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEmail("shawn@company.com")}
                  disabled={isLoading}
                  className="text-xs h-6 px-2 ml-2"
                >
                  Fill
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>
                  <strong>Fleet Manager:</strong> nancy@company.com
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEmail("nancy@company.com")}
                  disabled={isLoading}
                  className="text-xs h-6 px-2 ml-2"
                >
                  Fill
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span>
                  <strong>Stock Manager:</strong> siyanda@company.com
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setEmail("siyanda@company.com")}
                  disabled={isLoading}
                  className="text-xs h-6 px-2 ml-2"
                >
                  Fill
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between text-orange-600 mt-2">
              <span>
                <strong>Password:</strong> password123
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPassword("password123")}
                disabled={isLoading}
                className="text-xs h-6 px-2"
              >
                Auto-fill
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
