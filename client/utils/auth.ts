interface AuthUser {
  employeeId: string;
  email: string;
  fullName: string;
  role: string;
  department: string;
  isActive: boolean;
  accessRoles: string[];
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
}

export class AuthManager {
  private static instance: AuthManager;
  
  static getInstance(): AuthManager {
    if (!AuthManager.instance) {
      AuthManager.instance = new AuthManager();
    }
    return AuthManager.instance;
  }

  getAuthState(): AuthState {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    const userFullName = localStorage.getItem('userFullName');
    const employeeId = localStorage.getItem('employeeId');
    const department = localStorage.getItem('department');
    const demoMode = localStorage.getItem('demoMode');

    if (demoMode === 'true' && userRole && userEmail) {
      // Demo mode
      return {
        isAuthenticated: true,
        user: {
          employeeId: 'DEMO',
          email: userEmail,
          fullName: userFullName || 'Demo User',
          role: userRole,
          department: 'Demo',
          isActive: true,
          accessRoles: [userRole]
        },
        token: null
      };
    }

    if (token && userRole && userEmail && employeeId) {
      // Real authentication
      return {
        isAuthenticated: true,
        user: {
          employeeId,
          email: userEmail,
          fullName: userFullName || '',
          role: userRole,
          department: department || '',
          isActive: true,
          accessRoles: [userRole]
        },
        token
      };
    }

    return {
      isAuthenticated: false,
      user: null,
      token: null
    };
  }

  async verifyToken(): Promise<boolean> {
    const { token } = this.getAuthState();
    
    if (!token) {
      return false;
    }

    try {
      const response = await fetch('/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.success && data.valid;
      }
      
      return false;
    } catch (error) {
      console.error('Token verification failed:', error);
      return false;
    }
  }

  async refreshToken(): Promise<boolean> {
    const { token } = this.getAuthState();
    
    if (!token) {
      return false;
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.token) {
          localStorage.setItem('authToken', data.token);
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  }

  logout(): void {
    // Clear all authentication data
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('employeeId');
    localStorage.removeItem('department');
    localStorage.removeItem('demoMode');
    
    // Also clear other user-specific data
    localStorage.removeItem('clockedIn');
    localStorage.removeItem('clockInTime');
    localStorage.removeItem('currentLocation');
  }

  async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const { token } = this.getAuthState();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    // If token is expired, try to refresh
    if (response.status === 401 && token) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        // Retry request with new token
        const newToken = localStorage.getItem('authToken');
        (headers as any)['Authorization'] = `Bearer ${newToken}`;
        return fetch(url, { ...options, headers });
      } else {
        // Refresh failed, logout user
        this.logout();
        window.location.href = '/login';
      }
    }

    return response;
  }

  isAuthenticated(): boolean {
    return this.getAuthState().isAuthenticated;
  }

  getUser(): AuthUser | null {
    return this.getAuthState().user;
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.role === role || user?.accessRoles.includes(role) || false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getUser();
    if (!user) return false;
    
    return roles.some(role => 
      user.role === role || user.accessRoles.includes(role)
    );
  }
}

export default AuthManager;

// Convenience exports
export const authManager = AuthManager.getInstance();
export const isAuthenticated = () => authManager.isAuthenticated();
export const getUser = () => authManager.getUser();
export const logout = () => authManager.logout();
export const makeAuthenticatedRequest = (url: string, options?: RequestInit) => 
  authManager.makeAuthenticatedRequest(url, options);
