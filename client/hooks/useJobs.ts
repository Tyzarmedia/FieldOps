import { useState, useEffect, useCallback, useRef } from 'react';
import { jobService, LightweightJob, FullJob, JobsFilter, JobsResponse } from '../services/jobService';

export interface UseJobsOptions {
  filters?: JobsFilter;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseJobsResult {
  jobs: LightweightJob[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  refreshing: boolean;
  
  // Actions
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  forceRefresh: () => Promise<void>;
  updateFilters: (newFilters: JobsFilter) => void;
  updateJobStatus: (jobId: string, status: string, data?: any) => Promise<boolean>;
  
  // Single job details
  getJobDetails: (jobId: string) => Promise<FullJob | null>;
  
  // Cache info
  lastSyncTime: number;
  isOffline: boolean;
}

export const useJobs = (options: UseJobsOptions = {}): UseJobsResult => {
  const [jobs, setJobs] = useState<LightweightJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<JobsFilter>(options.filters || {});
  const [lastSyncTime, setLastSyncTime] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  const currentOffset = useRef(0);
  const refreshInterval = useRef<NodeJS.Timeout | null>(null);
  
  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load initial jobs
  const loadJobs = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        currentOffset.current = 0;
      } else {
        setLoadingMore(true);
      }
      
      setError(null);
      
      const queryFilters = { 
        ...filters, 
        offset: reset ? 0 : currentOffset.current,
        limit: 20 
      };
      
      const response: JobsResponse = await jobService.getJobs(queryFilters);
      
      if (reset) {
        setJobs(response.jobs);
      } else {
        setJobs(prev => [...prev, ...response.jobs]);
      }
      
      setHasMore(response.hasMore);
      setTotal(response.total);
      setLastSyncTime(Date.now());
      
      if (!reset) {
        currentOffset.current += response.jobs.length;
      } else {
        currentOffset.current = response.jobs.length;
      }
      
    } catch (err) {
      console.error('Error loading jobs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load jobs');
      
      // If this is the first load and we have an error, try to show cached data
      if (reset) {
        // The service should handle cache fallback internally
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters]);

  // Load more jobs (pagination)
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || loading) return;
    await loadJobs(false);
  }, [loadJobs, loadingMore, hasMore, loading]);

  // Refresh current page
  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadJobs(true);
    } finally {
      setRefreshing(false);
    }
  }, [loadJobs]);

  // Force refresh (clear cache)
  const forceRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await jobService.forceRefresh({ ...filters, limit: 20, offset: 0 });
      setJobs(response.jobs);
      setHasMore(response.hasMore);
      setTotal(response.total);
      setLastSyncTime(Date.now());
      currentOffset.current = response.jobs.length;
    } catch (err) {
      console.error('Error force refreshing:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh jobs');
    } finally {
      setRefreshing(false);
    }
  }, [filters]);

  // Update filters
  const updateFilters = useCallback((newFilters: JobsFilter) => {
    setFilters(newFilters);
    currentOffset.current = 0;
  }, []);

  // Update job status
  const updateJobStatus = useCallback(async (jobId: string, status: string, data: any = {}) => {
    try {
      const success = await jobService.updateJobStatus(jobId, status, data);
      
      // Optimistically update local state
      setJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: status as any }
          : job
      ));
      
      // If update failed (offline), we still show the optimistic update
      // The actual sync will happen in background when online
      
      return success;
    } catch (err) {
      console.error('Error updating job status:', err);
      return false;
    }
  }, []);

  // Get job details
  const getJobDetails = useCallback(async (jobId: string): Promise<FullJob | null> => {
    try {
      return await jobService.getJobDetails(jobId);
    } catch (err) {
      console.error('Error getting job details:', err);
      return null;
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadJobs(true);
  }, [filters]); // Reload when filters change

  // Auto refresh setup
  useEffect(() => {
    if (options.autoRefresh && !isOffline) {
      const interval = options.refreshInterval || 30000; // 30 seconds default
      
      refreshInterval.current = setInterval(async () => {
        // Silent refresh in background
        try {
          const response = await jobService.getJobs({ 
            ...filters, 
            limit: 20, 
            offset: 0 
          });
          
          // Only update if we have new data and user hasn't scrolled much
          if (currentOffset.current <= 20) {
            setJobs(response.jobs);
            setHasMore(response.hasMore);
            setTotal(response.total);
            setLastSyncTime(Date.now());
          }
        } catch (err) {
          console.error('Auto refresh failed:', err);
        }
      }, interval);
    }

    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
    };
  }, [options.autoRefresh, options.refreshInterval, filters, isOffline]);

  // Online state change effect
  useEffect(() => {
    if (!isOffline && jobs.length === 0) {
      // When coming back online, refresh if we have no data
      loadJobs(true);
    }
  }, [isOffline, jobs.length, loadJobs]);

  return {
    jobs,
    loading,
    loadingMore,
    error,
    hasMore,
    total,
    refreshing,
    loadMore,
    refresh,
    forceRefresh,
    updateFilters,
    updateJobStatus,
    getJobDetails,
    lastSyncTime,
    isOffline
  };
};

// Specialized hooks for different use cases
export const useTechnicianJobs = (technicianId: string, status?: string) => {
  return useJobs({
    filters: { 
      technician_id: technicianId,
      status: status || undefined
    },
    autoRefresh: true,
    refreshInterval: 30000
  });
};

export const useJobsByStatus = (status: string) => {
  return useJobs({
    filters: { status },
    autoRefresh: true,
    refreshInterval: 60000
  });
};

export const useJobDetails = (jobId: string) => {
  const [job, setJob] = useState<FullJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJobDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const jobDetails = await jobService.getJobDetails(jobId);
        setJob(jobDetails);
      } catch (err) {
        console.error('Error loading job details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      loadJobDetails();
    }
  }, [jobId]);

  const updateJob = useCallback(async (updates: Partial<FullJob>) => {
    if (job) {
      setJob(prev => prev ? { ...prev, ...updates } : null);
    }
  }, [job]);

  return { job, loading, error, updateJob };
};

export default useJobs;
