import { EventEmitter } from 'events';
import { getSageX3Service, InventoryItem, StockMovement } from './sageX3Service';

export interface SyncEvent {
  type: 'inventory_updated' | 'stock_movement' | 'low_stock_alert' | 'sync_complete' | 'sync_error';
  data: any;
  timestamp: string;
  warehouse?: string;
}

export interface SyncSchedule {
  id: string;
  name: string;
  warehouse?: string;
  frequency: 'manual' | 'hourly' | 'daily' | 'weekly';
  lastRun?: string;
  nextRun?: string;
  enabled: boolean;
  notifyOnLowStock: boolean;
  lowStockThreshold: number;
}

export class InventorySyncService extends EventEmitter {
  private syncIntervals: Map<string, NodeJS.Timeout> = new Map();
  private activeSyncs: Set<string> = new Set();
  private syncSchedules: Map<string, SyncSchedule> = new Map();
  private lastSyncData: Map<string, InventoryItem[]> = new Map();

  constructor() {
    super();
    this.initializeDefaultSchedules();
  }

  private initializeDefaultSchedules() {
    // Default sync schedules
    const defaultSchedules: SyncSchedule[] = [
      {
        id: 'main-hourly',
        name: 'Main Warehouse Hourly Sync',
        warehouse: 'MAIN',
        frequency: 'hourly',
        enabled: true,
        notifyOnLowStock: true,
        lowStockThreshold: 10
      },
      {
        id: 'all-daily',
        name: 'All Warehouses Daily Sync',
        frequency: 'daily',
        enabled: true,
        notifyOnLowStock: true,
        lowStockThreshold: 5
      }
    ];

    defaultSchedules.forEach(schedule => {
      this.syncSchedules.set(schedule.id, schedule);
      if (schedule.enabled) {
        this.scheduleSync(schedule);
      }
    });
  }

  /**
   * Schedule automatic sync based on frequency
   */
  private scheduleSync(schedule: SyncSchedule) {
    if (this.syncIntervals.has(schedule.id)) {
      clearInterval(this.syncIntervals.get(schedule.id)!);
    }

    let intervalMs: number;
    switch (schedule.frequency) {
      case 'hourly':
        intervalMs = 60 * 60 * 1000; // 1 hour
        break;
      case 'daily':
        intervalMs = 24 * 60 * 60 * 1000; // 24 hours
        break;
      case 'weekly':
        intervalMs = 7 * 24 * 60 * 60 * 1000; // 7 days
        break;
      default:
        return; // Manual sync only
    }

    const interval = setInterval(() => {
      this.performScheduledSync(schedule);
    }, intervalMs);

    this.syncIntervals.set(schedule.id, interval);

    // Update next run time
    schedule.nextRun = new Date(Date.now() + intervalMs).toISOString();
  }

  /**
   * Perform a scheduled sync
   */
  private async performScheduledSync(schedule: SyncSchedule) {
    try {
      console.log(`Starting scheduled sync: ${schedule.name}`);
      
      const result = await this.syncInventory(schedule.warehouse, {
        checkLowStock: schedule.notifyOnLowStock,
        lowStockThreshold: schedule.lowStockThreshold,
        scheduleId: schedule.id
      });

      schedule.lastRun = new Date().toISOString();
      
      // Schedule next run
      this.scheduleSync(schedule);

      this.emit('sync_complete', {
        type: 'sync_complete',
        data: { ...result, scheduleName: schedule.name },
        timestamp: new Date().toISOString(),
        warehouse: schedule.warehouse
      } as SyncEvent);

    } catch (error) {
      console.error(`Scheduled sync failed for ${schedule.name}:`, error);
      
      this.emit('sync_error', {
        type: 'sync_error',
        data: { 
          error: error.message, 
          scheduleName: schedule.name 
        },
        timestamp: new Date().toISOString(),
        warehouse: schedule.warehouse
      } as SyncEvent);
    }
  }

  /**
   * Manual sync with real-time updates
   */
  async syncInventory(warehouse?: string, options: {
    checkLowStock?: boolean;
    lowStockThreshold?: number;
    scheduleId?: string;
  } = {}) {
    const syncId = `sync-${warehouse || 'all'}-${Date.now()}`;
    
    if (this.activeSyncs.has(syncId)) {
      throw new Error('Sync already in progress for this warehouse');
    }

    this.activeSyncs.add(syncId);

    try {
      const sageX3Service = getSageX3Service();
      
      // Get current inventory
      const currentItems = await sageX3Service.getInventoryItems(warehouse);
      
      // Compare with last sync data to detect changes
      const lastSyncKey = warehouse || 'all';
      const lastItems = this.lastSyncData.get(lastSyncKey) || [];
      
      const changes = this.detectInventoryChanges(lastItems, currentItems);
      
      // Store current data for next comparison
      this.lastSyncData.set(lastSyncKey, currentItems);

      // Emit inventory updates for each changed item
      for (const change of changes) {
        this.emit('inventory_updated', {
          type: 'inventory_updated',
          data: change,
          timestamp: new Date().toISOString(),
          warehouse: change.item.warehouse
        } as SyncEvent);
      }

      // Check for low stock items if requested
      let lowStockItems: InventoryItem[] = [];
      if (options.checkLowStock) {
        const threshold = options.lowStockThreshold || 5;
        lowStockItems = currentItems.filter(item => 
          item.quantity <= Math.max(item.reorderLevel, threshold)
        );

        if (lowStockItems.length > 0) {
          this.emit('low_stock_alert', {
            type: 'low_stock_alert',
            data: {
              items: lowStockItems,
              threshold: threshold,
              warehouse: warehouse
            },
            timestamp: new Date().toISOString(),
            warehouse: warehouse
          } as SyncEvent);
        }
      }

      const result = {
        syncId,
        totalItems: currentItems.length,
        updatedItems: changes.length,
        lowStockItems: lowStockItems.length,
        lastSync: new Date().toISOString(),
        changes: changes.slice(0, 10) // Return first 10 changes for preview
      };

      return result;

    } finally {
      this.activeSyncs.delete(syncId);
    }
  }

  /**
   * Detect changes between old and new inventory data
   */
  private detectInventoryChanges(oldItems: InventoryItem[], newItems: InventoryItem[]): Array<{
    type: 'added' | 'updated' | 'removed';
    item: InventoryItem;
    changes?: { field: string; oldValue: any; newValue: any }[];
  }> {
    const changes: Array<{
      type: 'added' | 'updated' | 'removed';
      item: InventoryItem;
      changes?: { field: string; oldValue: any; newValue: any }[];
    }> = [];

    // Create maps for efficient lookup
    const oldItemsMap = new Map(oldItems.map(item => [`${item.itemCode}-${item.warehouse}`, item]));
    const newItemsMap = new Map(newItems.map(item => [`${item.itemCode}-${item.warehouse}`, item]));

    // Check for new and updated items
    for (const newItem of newItems) {
      const key = `${newItem.itemCode}-${newItem.warehouse}`;
      const oldItem = oldItemsMap.get(key);

      if (!oldItem) {
        // New item
        changes.push({
          type: 'added',
          item: newItem
        });
      } else {
        // Check for updates
        const itemChanges = this.getItemChanges(oldItem, newItem);
        if (itemChanges.length > 0) {
          changes.push({
            type: 'updated',
            item: newItem,
            changes: itemChanges
          });
        }
      }
    }

    // Check for removed items
    for (const oldItem of oldItems) {
      const key = `${oldItem.itemCode}-${oldItem.warehouse}`;
      if (!newItemsMap.has(key)) {
        changes.push({
          type: 'removed',
          item: oldItem
        });
      }
    }

    return changes;
  }

  /**
   * Get specific field changes between two items
   */
  private getItemChanges(oldItem: InventoryItem, newItem: InventoryItem): Array<{
    field: string;
    oldValue: any;
    newValue: any;
  }> {
    const changes: Array<{ field: string; oldValue: any; newValue: any }> = [];
    const fieldsToCheck: (keyof InventoryItem)[] = [
      'quantity', 'unitPrice', 'status', 'location', 'minimumStock', 'maximumStock', 'reorderLevel'
    ];

    for (const field of fieldsToCheck) {
      if (oldItem[field] !== newItem[field]) {
        changes.push({
          field,
          oldValue: oldItem[field],
          newValue: newItem[field]
        });
      }
    }

    return changes;
  }

  /**
   * Track stock movements in real-time
   */
  async trackStockMovement(movement: Omit<StockMovement, 'movementId' | 'date'>) {
    try {
      const sageX3Service = getSageX3Service();
      const createdMovement = await sageX3Service.createStockMovement(movement);

      this.emit('stock_movement', {
        type: 'stock_movement',
        data: createdMovement,
        timestamp: new Date().toISOString(),
        warehouse: movement.warehouse
      } as SyncEvent);

      return createdMovement;
    } catch (error) {
      console.error('Error tracking stock movement:', error);
      throw error;
    }
  }

  /**
   * Get sync schedules
   */
  getSyncSchedules(): SyncSchedule[] {
    return Array.from(this.syncSchedules.values());
  }

  /**
   * Update sync schedule
   */
  updateSyncSchedule(scheduleId: string, updates: Partial<SyncSchedule>): SyncSchedule {
    const schedule = this.syncSchedules.get(scheduleId);
    if (!schedule) {
      throw new Error(`Sync schedule ${scheduleId} not found`);
    }

    const updatedSchedule = { ...schedule, ...updates };
    this.syncSchedules.set(scheduleId, updatedSchedule);

    // Reschedule if enabled
    if (updatedSchedule.enabled) {
      this.scheduleSync(updatedSchedule);
    } else {
      // Clear existing interval
      const interval = this.syncIntervals.get(scheduleId);
      if (interval) {
        clearInterval(interval);
        this.syncIntervals.delete(scheduleId);
      }
    }

    return updatedSchedule;
  }

  /**
   * Create new sync schedule
   */
  createSyncSchedule(schedule: Omit<SyncSchedule, 'id'>): SyncSchedule {
    const id = `sync-${Date.now()}`;
    const newSchedule: SyncSchedule = { ...schedule, id };
    
    this.syncSchedules.set(id, newSchedule);
    
    if (newSchedule.enabled) {
      this.scheduleSync(newSchedule);
    }

    return newSchedule;
  }

  /**
   * Delete sync schedule
   */
  deleteSyncSchedule(scheduleId: string): boolean {
    const interval = this.syncIntervals.get(scheduleId);
    if (interval) {
      clearInterval(interval);
      this.syncIntervals.delete(scheduleId);
    }

    return this.syncSchedules.delete(scheduleId);
  }

  /**
   * Get active syncs
   */
  getActiveSyncs(): string[] {
    return Array.from(this.activeSyncs);
  }

  /**
   * Stop all scheduled syncs
   */
  stopAllSyncs() {
    for (const interval of this.syncIntervals.values()) {
      clearInterval(interval);
    }
    this.syncIntervals.clear();
  }
}

// Singleton instance
let syncServiceInstance: InventorySyncService | null = null;

export function getSyncService(): InventorySyncService {
  if (!syncServiceInstance) {
    syncServiceInstance = new InventorySyncService();
  }
  return syncServiceInstance;
}
