// Offline Data Management Service
// Provides functionality to work with previously pulled data when network is unavailable

interface OfflineData {
  jobs: any[];
  stockItems: any[];
  technicianAssignments: any[];
  notifications: any[];
  technicianStatus: any[];
  lastSync: string;
  version: string;
}

class OfflineDataService {
  private readonly STORAGE_KEY = 'fieldops_offline_data';
  private readonly SYNC_QUEUE_KEY = 'fieldops_sync_queue';
  private readonly VERSION = '1.0.0';

  // Check if we're online
  public isOnline(): boolean {
    return navigator.onLine;
  }

  // Save data for offline use
  public async saveDataForOffline(data: Partial<OfflineData>): Promise<void> {
    try {
      const existingData = this.getOfflineData();
      const updatedData: OfflineData = {
        ...existingData,
        ...data,
        lastSync: new Date().toISOString(),
        version: this.VERSION
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedData));
      console.log('Data saved for offline use:', Object.keys(updatedData));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }

  // Get offline data
  public getOfflineData(): OfflineData {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Failed to retrieve offline data:', error);
    }
    
    // Return default structure if no data found
    return {
      jobs: [],
      stockItems: [],
      technicianAssignments: [],
      notifications: [],
      technicianStatus: [],
      lastSync: '',
      version: this.VERSION
    };
  }

  // Queue operations for when we come back online
  public queueOperation(operation: {
    type: 'CREATE' | 'UPDATE' | 'DELETE';
    endpoint: string;
    data: any;
    id: string;
    timestamp: string;
  }): void {
    try {
      const queue = this.getSyncQueue();
      queue.push({
        ...operation,
        id: operation.id || Date.now().toString(),
        timestamp: operation.timestamp || new Date().toISOString()
      });
      localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(queue));
      console.log('Operation queued for sync:', operation.type, operation.endpoint);
    } catch (error) {
      console.error('Failed to queue operation:', error);
    }
  }

  // Get sync queue
  public getSyncQueue(): any[] {
    try {
      const queue = localStorage.getItem(this.SYNC_QUEUE_KEY);
      return queue ? JSON.parse(queue) : [];
    } catch (error) {
      console.error('Failed to get sync queue:', error);
      return [];
    }
  }

  // Process sync queue when back online
  public async processSyncQueue(): Promise<void> {
    if (!this.isOnline()) {
      console.log('Still offline, cannot process sync queue');
      return;
    }

    const queue = this.getSyncQueue();
    if (queue.length === 0) {
      console.log('No operations to sync');
      return;
    }

    console.log(`Processing ${queue.length} queued operations`);
    const failedOperations = [];

    for (const operation of queue) {
      try {
        await this.executeQueuedOperation(operation);
        console.log('Synced operation:', operation.type, operation.endpoint);
      } catch (error) {
        console.error('Failed to sync operation:', operation, error);
        failedOperations.push(operation);
      }
    }

    // Keep failed operations in queue for retry
    localStorage.setItem(this.SYNC_QUEUE_KEY, JSON.stringify(failedOperations));
    
    if (failedOperations.length === 0) {
      console.log('All operations synced successfully');
    } else {
      console.log(`${failedOperations.length} operations failed to sync and will be retried`);
    }
  }

  // Execute a queued operation
  private async executeQueuedOperation(operation: any): Promise<void> {
    const { type, endpoint, data } = operation;
    
    let method = 'GET';
    switch (type) {
      case 'CREATE':
        method = 'POST';
        break;
      case 'UPDATE':
        method = 'PUT';
        break;
      case 'DELETE':
        method = 'DELETE';
        break;
    }

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`Failed to sync: ${response.status} ${response.statusText}`);
    }
  }

  // Fetch and cache data with offline fallback
  public async fetchWithOfflineFallback<T>(
    endpoint: string,
    dataKey: keyof OfflineData,
    options?: RequestInit
  ): Promise<{ data: T; fromCache: boolean }> {
    if (this.isOnline()) {
      try {
        const response = await fetch(endpoint, options);
        if (response.ok) {
          const result = await response.json();
          const data = result.success ? result.data : result;
          
          // Cache the fresh data
          this.saveDataForOffline({ [dataKey]: data });
          
          return { data, fromCache: false };
        }
      } catch (error) {
        console.warn('Network request failed, falling back to cache:', error);
      }
    }

    // Fallback to cached data
    const offlineData = this.getOfflineData();
    const cachedData = offlineData[dataKey] as T;
    
    if (Array.isArray(cachedData) && cachedData.length === 0) {
      console.warn(`No cached data available for ${dataKey}`);
    }
    
    return { data: cachedData, fromCache: true };
  }

  // Create/Update with offline queue
  public async createOrUpdateWithQueue(
    endpoint: string,
    data: any,
    operationType: 'CREATE' | 'UPDATE',
    localUpdateFn?: (data: any) => void
  ): Promise<{ success: boolean; fromCache: boolean }> {
    if (this.isOnline()) {
      try {
        const method = operationType === 'CREATE' ? 'POST' : 'PUT';
        const response = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const result = await response.json();
          
          // Apply local update if provided
          if (localUpdateFn) {
            localUpdateFn(result.data || data);
          }
          
          return { success: true, fromCache: false };
        }
      } catch (error) {
        console.warn('Network request failed, queueing for later sync:', error);
      }
    }

    // Queue for later sync
    this.queueOperation({
      type: operationType,
      endpoint,
      data,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    });

    // Apply local update optimistically
    if (localUpdateFn) {
      localUpdateFn(data);
    }

    return { success: true, fromCache: true };
  }

  // Get data age for display
  public getDataAge(): string {
    const offlineData = this.getOfflineData();
    if (!offlineData.lastSync) {
      return 'No cached data';
    }

    const lastSync = new Date(offlineData.lastSync);
    const now = new Date();
    const diffMs = now.getTime() - lastSync.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m ago`;
    } else {
      return `${diffMinutes}m ago`;
    }
  }

  // Clear all offline data
  public clearOfflineData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.SYNC_QUEUE_KEY);
    console.log('Offline data cleared');
  }

  // Initialize offline capabilities
  public initialize(): void {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('Back online, processing sync queue...');
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      console.log('Gone offline, switching to cached data mode');
    });

    // Process any queued operations if we're already online
    if (this.isOnline()) {
      setTimeout(() => this.processSyncQueue(), 1000);
    }

    console.log('Offline data service initialized');
  }
}

// Export singleton instance
export const offlineDataService = new OfflineDataService();

// Auto-initialize
offlineDataService.initialize();
