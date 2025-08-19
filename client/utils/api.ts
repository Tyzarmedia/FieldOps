interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

interface RequestConfig extends RequestInit {
  timeout?: number;
}

class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Safe API utility that prevents "body stream already read" errors
 * and provides consistent error handling across the application
 */
export class ApiClient {
  private static instance: ApiClient;
  private baseURL: string;
  private defaultTimeout: number;

  constructor(baseURL = '', defaultTimeout = 30000) {
    this.baseURL = baseURL;
    this.defaultTimeout = defaultTimeout;
  }

  static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private async makeRequest<T = any>(
    url: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      timeout = this.defaultTimeout,
      headers = {},
      ...requestConfig
    } = config;

    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      console.log('API Request:', {
        url: `${this.baseURL}${url}`,
        method: requestConfig.method || 'GET',
        headers,
        body: requestConfig.body
      });

      const response = await fetch(`${this.baseURL}${url}`, {
        ...requestConfig,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('API Response:', {
        url: `${this.baseURL}${url}`,
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      // Check if response is ok
      if (!response.ok) {
        console.error('Response not ok:', response.status, response.statusText);
        throw new ApiError(
          `HTTP error! status: ${response.status}`,
          response.status,
          response
        );
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // If it's not JSON, return the text
        const text = await response.text();
        return text as unknown as T;
      }

      // Parse JSON response
      try {
        const data = await response.json();
        console.log('API Response Data:', data);
        return data;
      } catch (parseError) {
        console.error('JSON parsing failed:', parseError);
        const text = await response.text();
        console.error('Response text:', text);
        throw new ApiError(`Invalid JSON response: ${text}`);
      }
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError('Request timeout');
      }

      if (error instanceof TypeError && error.message.includes('body stream already read')) {
        throw new ApiError('Request body was already consumed. Please try again.');
      }

      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      );
    }
  }

  async get<T = any>(url: string, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<T> {
    return this.makeRequest<T>(url, { ...config, method: 'GET' });
  }

  async post<T = any>(url: string, data?: any, config: Omit<RequestConfig, 'method'> = {}): Promise<T> {
    return this.makeRequest<T>(url, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(url: string, data?: any, config: Omit<RequestConfig, 'method'> = {}): Promise<T> {
    return this.makeRequest<T>(url, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = any>(url: string, data?: any, config: Omit<RequestConfig, 'method'> = {}): Promise<T> {
    return this.makeRequest<T>(url, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(url: string, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<T> {
    return this.makeRequest<T>(url, { ...config, method: 'DELETE' });
  }

  // Authenticated request methods
  async getAuthenticated<T = any>(url: string, token: string, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<T> {
    return this.makeRequest<T>(url, {
      ...config,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...config.headers,
      },
    });
  }

  async postAuthenticated<T = any>(url: string, data: any, token: string, config: Omit<RequestConfig, 'method'> = {}): Promise<T> {
    return this.makeRequest<T>(url, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`,
        ...config.headers,
      },
    });
  }

  async putAuthenticated<T = any>(url: string, data: any, token: string, config: Omit<RequestConfig, 'method'> = {}): Promise<T> {
    return this.makeRequest<T>(url, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Authorization': `Bearer ${token}`,
        ...config.headers,
      },
    });
  }

  async deleteAuthenticated<T = any>(url: string, token: string, config: Omit<RequestConfig, 'method' | 'body'> = {}): Promise<T> {
    return this.makeRequest<T>(url, {
      ...config,
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...config.headers,
      },
    });
  }
}

// Create default instance
export const apiClient = ApiClient.getInstance();

// Convenience functions
export const api = {
  get: <T = any>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>) => 
    apiClient.get<T>(url, config),
  
  post: <T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'method'>) => 
    apiClient.post<T>(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'method'>) => 
    apiClient.put<T>(url, data, config),
  
  patch: <T = any>(url: string, data?: any, config?: Omit<RequestConfig, 'method'>) => 
    apiClient.patch<T>(url, data, config),
  
  delete: <T = any>(url: string, config?: Omit<RequestConfig, 'method' | 'body'>) => 
    apiClient.delete<T>(url, config),
};

export { ApiError };

// Legacy support - keep makeSafeRequest for backward compatibility
export const makeSafeRequest = async (url: string, options: RequestInit = {}) => {
  const method = (options.method || 'GET').toLowerCase();
  const body = options.body ? JSON.parse(options.body as string) : undefined;
  
  switch (method) {
    case 'get':
      return api.get(url, options);
    case 'post':
      return api.post(url, body, options);
    case 'put':
      return api.put(url, body, options);
    case 'patch':
      return api.patch(url, body, options);
    case 'delete':
      return api.delete(url, options);
    default:
      return apiClient.get(url, options);
  }
};
