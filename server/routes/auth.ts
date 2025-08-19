import { Router, Request, Response } from "express";
import AuthService, { LoginRequest } from "../services/authService";
import SecurityAuditService from "../services/securityAuditService";

const authRouter = Router();
const authService = AuthService.getInstance();

// Middleware to extract token from Authorization header
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }
  return null;
};

// Middleware to verify token
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: any,
) => {
  const token = extractToken(req);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token required" });
  }

  const user = await authService.verifyToken(token);
  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }

  // Add user to request object
  (req as any).user = user;
  next();
};

// POST /api/auth/login
authRouter.post("/login", async (req: Request, res: Response) => {
  try {
    console.log('POST /api/auth/login - Request received');
    console.log('Request body:', req.body);

    // Ensure we have a valid request body
    if (!req.body || typeof req.body !== 'object') {
      console.log('Invalid request body received');
      return res.status(400).json({
        success: false,
        message: "Invalid request body",
      });
    }

    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    console.log('Attempting login for email:', email);
    const result = await authService.login({ email, password });
    console.log('Auth service result:', result);

    // Ensure we set proper headers
    res.setHeader('Content-Type', 'application/json');

    if (result.success) {
      console.log('Login successful, returning 200');
      return res.status(200).json(result);
    } else {
      console.log('Login failed, returning 401');
      return res.status(401).json(result);
    }
  } catch (error) {
    console.error("Login error:", error);

    // Ensure we haven't already sent a response
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
});

// POST /api/auth/logout
authRouter.post(
  "/logout",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      // For JWT, logout is handled client-side by removing the token
      // Here we could implement token blacklisting if needed

      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
);

// GET /api/auth/me - Get current user info
authRouter.get(
  "/me",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;

      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
);

// POST /api/auth/refresh - Refresh JWT token
authRouter.post("/refresh", async (req: Request, res: Response) => {
  try {
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access token required",
      });
    }

    const newToken = await authService.refreshToken(token);

    if (newToken) {
      res.status(200).json({
        success: true,
        token: newToken,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Unable to refresh token",
      });
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// POST /api/auth/change-password
authRouter.post(
  "/change-password",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = (req as any).user;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password and new password are required",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password must be at least 6 characters long",
        });
      }

      const result = await authService.changePassword(
        user.employeeId,
        currentPassword,
        newPassword,
      );

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
);

// GET /api/auth/verify - Verify token validity
authRouter.get(
  "/verify",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      // If we reach here, token is valid (due to authenticateToken middleware)
      const user = (req as any).user;

      res.status(200).json({
        success: true,
        valid: true,
        user,
      });
    } catch (error) {
      console.error("Token verification error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
);

export default authRouter;
export { extractToken };
