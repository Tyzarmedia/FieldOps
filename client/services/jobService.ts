export interface LightweightJob {
  id: string;
  title: string;
  status: 'assigned' | 'accepted' | 'in-progress' | 'completed' | 'paused';
  date: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  clientName: string;
  workType: string;
  estimatedDuration: number;
  assignedTo: string;
}

export interface FullJob {
  id: string;
  title: string;
  status: 'assigned' | 'accepted' | 'in-progress' | 'completed' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedBy: string;
  assignedTo: string;
  assistant?: string;
  client: {
    name: string;
    contact: string;
    mobile: string;
    address: string;
  };
  appointment: {
    number: string;
    startDate: string;
    endDate: string;
    scheduledDate: string;
    facility: string;
  };
  workType: string;
  serviceTerritory: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  description: string;
  estimatedDuration: number;
  actualDuration?: number;
  createdDate: string;
  acceptedDate?: string;
  startedDate?: string;
  completedDate?: string;
  photos: string[];
  notes: string[];
  materials: Array<{
    item: string;
    quantity: number;
    used: number;
  }>;
}

export interface JobsResponse {
  jobs: LightweightJob[];
  total: number;
  hasMore: boolean;
  nextOffset?: number;
}

export interface JobsFilter {
  technician_id?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  priority?: string;
  limit?: number;
  offset?: number;
}

// Cache configuration
const CACHE_KEYS = {
  JOBS_LIST: 'jobs_list',
  JOB_DETAILS: 'job_details',
  LAST_SYNC: 'last_sync',
  SYNC_QUEUE: 'sync_queue'
};

const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const BACKGROUND_SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
const REQUEST_TIMEOUT = 8000; // 8 seconds

class JobCacheManager {
  private static instance: JobCacheManager;
  
  static getInstance(): JobCacheManager {
    if (!JobCacheManager.instance) {
      JobCacheManager.instance = new JobCacheManager();
    }
    return JobCacheManager.instance;
  }

  // Local storage cache operations
  getCachedJobs(key: string): LightweightJob[] | null {
    try {
      const cached = localStorage.getItem(`${CACHE_KEYS.JOBS_LIST}_${key}`);
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      const isExpired = Date.now() - data.timestamp > CACHE_EXPIRY;
      
      if (isExpired) {
        localStorage.removeItem(`${CACHE_KEYS.JOBS_LIST}_${key}`);
        return null;
      }
      
      return data.jobs;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }

  setCachedJobs(key: string, jobs: LightweightJob[]): void {
    try {
      const data = {
        jobs,
        timestamp: Date.now()
      };
      localStorage.setItem(`${CACHE_KEYS.JOBS_LIST}_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  }

  getCachedJobDetails(jobId: string): FullJob | null {
    try {
      const cached = localStorage.getItem(`${CACHE_KEYS.JOB_DETAILS}_${jobId}`);
      if (!cached) return null;
      
      const data = JSON.parse(cached);
      const isExpired = Date.now() - data.timestamp > CACHE_EXPIRY;
      
      if (isExpired) {
        localStorage.removeItem(`${CACHE_KEYS.JOB_DETAILS}_${jobId}`);
        return null;
      }
      
      return data.job;
    } catch (error) {
      console.error('Error reading job details from cache:', error);
      return null;
    }
  }

  setCachedJobDetails(jobId: string, job: FullJob): void {
    try {
      const data = {
        job,
        timestamp: Date.now()
      };
      localStorage.setItem(`${CACHE_KEYS.JOB_DETAILS}_${jobId}`, JSON.stringify(data));
    } catch (error) {
      console.error('Error writing job details to cache:', error);
    }
  }

  getLastSyncTime(): number {
    const lastSync = localStorage.getItem(CACHE_KEYS.LAST_SYNC);
    return lastSync ? parseInt(lastSync) : 0;
  }

  setLastSyncTime(timestamp: number): void {
    localStorage.setItem(CACHE_KEYS.LAST_SYNC, timestamp.toString());
  }

  addToSyncQueue(action: string, jobId: string, data: any): void {
    try {
      const queue = this.getSyncQueue();
      queue.push({
        id: Date.now().toString(),
        action,
        jobId,
        data,
        timestamp: Date.now()
      });
      localStorage.setItem(CACHE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
    } catch (error) {
      console.error('Error adding to sync queue:', error);
    }
  }

  getSyncQueue(): any[] {
    try {
      const queue = localStorage.getItem(CACHE_KEYS.SYNC_QUEUE);
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Error reading sync queue:', error);
      return [];
    }
  }

  clearSyncQueue(): void {
    localStorage.removeItem(CACHE_KEYS.SYNC_QUEUE);
  }

  clearAllCache(): void {
    Object.values(CACHE_KEYS).forEach(key => {
      // Remove all keys that start with our cache keys
      Object.keys(localStorage).forEach(storageKey => {
        if (storageKey.startsWith(key)) {
          localStorage.removeItem(storageKey);
        }
      });
    });
  }
}

class JobService {
  private cache = JobCacheManager.getInstance();
  private backgroundSyncInterval: NodeJS.Timeout | null = null;
  private readonly baseUrl = '/api/jobs';

  constructor() {
    this.startBackgroundSync();
  }

  // Create cache key from filters
  private createCacheKey(filters: JobsFilter): string {
    return `${filters.technician_id || 'all'}_${filters.status || 'all'}_${filters.offset || 0}_${filters.limit || 20}`;
  }

  // Timeout wrapper for fetch requests
  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  // Get jobs with pagination and caching
  async getJobs(filters: JobsFilter = {}): Promise<JobsResponse> {
    const cacheKey = this.createCacheKey(filters);
    
    // Return cached data immediately if available
    const cachedJobs = this.cache.getCachedJobs(cacheKey);
    if (cachedJobs && filters.offset === 0) {
      // For first page, return cached data and refresh in background
      this.refreshJobsInBackground(filters);
      return {
        jobs: cachedJobs,
        total: cachedJobs.length,
        hasMore: cachedJobs.length >= (filters.limit || 20),
        nextOffset: (filters.offset || 0) + (filters.limit || 20)
      };
    }

    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (filters.technician_id) params.append('technician_id', filters.technician_id);
      if (filters.status) params.append('status', filters.status);
      if (filters.date_from) params.append('date_from', filters.date_from);
      if (filters.date_to) params.append('date_to', filters.date_to);
      if (filters.priority) params.append('priority', filters.priority);
      params.append('limit', (filters.limit || 20).toString());
      params.append('offset', (filters.offset || 0).toString());

      const response = await this.fetchWithTimeout(`${this.baseUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Cache the results
      if (data.jobs) {
        this.cache.setCachedJobs(cacheKey, data.jobs);
      }

      return {
        jobs: data.jobs || [],
        total: data.total || 0,
        hasMore: data.hasMore || false,
        nextOffset: data.nextOffset
      };

    } catch (error) {
      console.error('Error fetching jobs:', error);
      
      // Return cached data on error
      if (cachedJobs) {
        return {
          jobs: cachedJobs,
          total: cachedJobs.length,
          hasMore: false,
          nextOffset: undefined
        };
      }

      // Return mock data as fallback
      return this.getMockJobs(filters);
    }
  }

  // Get full job details
  async getJobDetails(jobId: string): Promise<FullJob | null> {
    // Check cache first
    const cachedJob = this.cache.getCachedJobDetails(jobId);
    if (cachedJob) {
      return cachedJob;
    }

    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/${jobId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const job = await response.json();
      
      // Cache the job details
      if (job) {
        this.cache.setCachedJobDetails(jobId, job);
      }

      return job;

    } catch (error) {
      console.error('Error fetching job details:', error);
      return this.getMockJobDetails(jobId);
    }
  }

  // Update job status (with offline support)
  async updateJobStatus(jobId: string, status: string, data: any = {}): Promise<boolean> {
    try {
      const response = await this.fetchWithTimeout(`${this.baseUrl}/${jobId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, ...data })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Clear relevant caches
      this.clearJobCaches(jobId);
      
      return true;

    } catch (error) {
      console.error('Error updating job status:', error);
      
      // Add to sync queue for offline support
      this.cache.addToSyncQueue('updateStatus', jobId, { status, ...data });
      
      return false;
    }
  }

  // Background sync for offline changes
  private async processOfflineChanges(): Promise<void> {
    const queue = this.cache.getSyncQueue();
    if (queue.length === 0) return;

    const processedItems: string[] = [];

    for (const item of queue) {
      try {
        switch (item.action) {
          case 'updateStatus':
            await this.updateJobStatus(item.jobId, item.data.status, item.data);
            processedItems.push(item.id);
            break;
          // Add more actions as needed
        }
      } catch (error) {
        console.error('Error processing offline change:', error);
        // Keep item in queue for retry
      }
    }

    // Remove processed items from queue
    if (processedItems.length > 0) {
      const updatedQueue = queue.filter(item => !processedItems.includes(item.id));
      if (updatedQueue.length === 0) {
        this.cache.clearSyncQueue();
      } else {
        localStorage.setItem(CACHE_KEYS.SYNC_QUEUE, JSON.stringify(updatedQueue));
      }
    }
  }

  // Background refresh without affecting UI
  private async refreshJobsInBackground(filters: JobsFilter): Promise<void> {
    try {
      const params = new URLSearchParams();
      if (filters.technician_id) params.append('technician_id', filters.technician_id);
      if (filters.status) params.append('status', filters.status);
      params.append('limit', (filters.limit || 20).toString());
      params.append('offset', '0');

      const response = await this.fetchWithTimeout(`${this.baseUrl}?${params}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.jobs) {
          const cacheKey = this.createCacheKey({ ...filters, offset: 0 });
          this.cache.setCachedJobs(cacheKey, data.jobs);
        }
      }
    } catch (error) {
      console.error('Background refresh failed:', error);
    }
  }

  // Start background sync process
  private startBackgroundSync(): void {
    if (this.backgroundSyncInterval) {
      clearInterval(this.backgroundSyncInterval);
    }

    this.backgroundSyncInterval = setInterval(async () => {
      await this.processOfflineChanges();
      this.cache.setLastSyncTime(Date.now());
    }, BACKGROUND_SYNC_INTERVAL);
  }

  // Stop background sync
  stopBackgroundSync(): void {
    if (this.backgroundSyncInterval) {
      clearInterval(this.backgroundSyncInterval);
      this.backgroundSyncInterval = null;
    }
  }

  // Clear caches for a specific job
  private clearJobCaches(jobId: string): void {
    // Clear job details cache
    localStorage.removeItem(`${CACHE_KEYS.JOB_DETAILS}_${jobId}`);
    
    // Clear related job lists cache (this is a simple approach, could be optimized)
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_KEYS.JOBS_LIST)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Mock data fallbacks
  private getMockJobs(filters: JobsFilter): JobsResponse {
    const mockJobs: LightweightJob[] = [
      {
        id: "SA-688808",
        title: "FTTH - Maintenance",
        status: "assigned",
        date: "2025-01-25",
        priority: "medium",
        clientName: "Vumatel (Pty) Ltd - Central",
        workType: "Maintenance Job",
        estimatedDuration: 4,
        assignedTo: "Dyondzani Clement Masinge"
      },
      {
        id: "SA-689001",
        title: "Emergency Fiber Repair",
        status: "in-progress",
        date: "2025-01-25",
        priority: "urgent",
        clientName: "Business Connect Ltd",
        workType: "Emergency Repair",
        estimatedDuration: 4,
        assignedTo: "Dyondzani Clement Masinge"
      },
      {
        id: "SA-689102",
        title: "New Installation - Residential",
        status: "accepted",
        date: "2025-01-26",
        priority: "medium",
        clientName: "Henderson Family",
        workType: "New Installation",
        estimatedDuration: 5,
        assignedTo: "Dyondzani Clement Masinge"
      }
    ];

    // Apply filters to mock data
    let filtered = mockJobs;
    if (filters.status) {
      filtered = filtered.filter(job => job.status === filters.status);
    }
    if (filters.technician_id) {
      filtered = filtered.filter(job => job.assignedTo.includes(filters.technician_id!));
    }

    const offset = filters.offset || 0;
    const limit = filters.limit || 20;
    const paginatedJobs = filtered.slice(offset, offset + limit);

    return {
      jobs: paginatedJobs,
      total: filtered.length,
      hasMore: offset + limit < filtered.length,
      nextOffset: offset + limit < filtered.length ? offset + limit : undefined
    };
  }

  private getMockJobDetails(jobId: string): FullJob | null {
    // Return mock detailed job data
    const mockJob: FullJob = {
      id: jobId,
      title: "FTTH - Maintenance",
      status: "assigned",
      priority: "medium",
      assignedBy: "Admin User",
      assignedTo: "Dyondzani Clement Masinge",
      client: {
        name: "Vumatel (Pty) Ltd - Central",
        contact: "-",
        mobile: "-",
        address: "27 Emerson Crescent, Haven Hills, East London"
      },
      appointment: {
        number: jobId,
        startDate: "1/1/00 12:00 AM",
        endDate: "1/1/00 12:00 AM",
        scheduledDate: "Jul 4, 2025 7:45 PM",
        facility: "FTTH - Maintenance"
      },
      workType: "1. Maintenance Job (SF)",
      serviceTerritory: "215 - BrL EC EL",
      location: {
        lat: -33.0153,
        lng: 27.9116,
        address: "The Crescent 31 Georgian Crescent EAST Braynston Gauteng South Africa 2191"
      },
      description: "Routine FTTH maintenance and inspection required",
      estimatedDuration: 4,
      createdDate: "Jul 3, 2025",
      photos: [],
      notes: [],
      materials: [
        { item: "Fiber Optic Cable", quantity: 50, used: 0 },
        { item: "Splice Protectors", quantity: 10, used: 0 },
        { item: "Cable Ties", quantity: 20, used: 0 }
      ]
    };

    return mockJob;
  }

  // Force refresh (clear cache and refetch)
  async forceRefresh(filters: JobsFilter = {}): Promise<JobsResponse> {
    const cacheKey = this.createCacheKey(filters);
    
    // Clear cache
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_KEYS.JOBS_LIST)) {
        localStorage.removeItem(key);
      }
    });

    // Fetch fresh data
    return this.getJobs(filters);
  }
}

// Export singleton instance
export const jobService = new JobService();
export default jobService;
