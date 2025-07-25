import { RequestHandler } from 'express';
import { getSyncService, SyncSchedule } from '../services/syncService';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * GET /api/sync/schedules
 * Get all sync schedules
 */
export const getSyncSchedules: RequestHandler = async (req, res) => {
  try {
    const syncService = getSyncService();
    const schedules = syncService.getSyncSchedules();

    const response: ApiResponse<SyncSchedule[]> = {
      success: true,
      data: schedules
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching sync schedules:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to fetch sync schedules'
    };
    res.status(500).json(response);
  }
};

/**
 * POST /api/sync/schedules
 * Create a new sync schedule
 */
export const createSyncSchedule: RequestHandler = async (req, res) => {
  try {
    const syncService = getSyncService();
    const scheduleData = req.body;

    // Validate required fields
    const requiredFields = ['name', 'frequency'];
    for (const field of requiredFields) {
      if (!scheduleData[field]) {
        const response: ApiResponse<null> = {
          success: false,
          error: `Missing required field: ${field}`
        };
        return res.status(400).json(response);
      }
    }

    const schedule = syncService.createSyncSchedule(scheduleData);

    const response: ApiResponse<SyncSchedule> = {
      success: true,
      data: schedule,
      message: 'Sync schedule created successfully'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating sync schedule:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to create sync schedule'
    };
    res.status(500).json(response);
  }
};

/**
 * PUT /api/sync/schedules/:id
 * Update a sync schedule
 */
export const updateSyncSchedule: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const syncService = getSyncService();

    const schedule = syncService.updateSyncSchedule(id, updates);

    const response: ApiResponse<SyncSchedule> = {
      success: true,
      data: schedule,
      message: 'Sync schedule updated successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating sync schedule:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to update sync schedule'
    };
    res.status(500).json(response);
  }
};

/**
 * DELETE /api/sync/schedules/:id
 * Delete a sync schedule
 */
export const deleteSyncSchedule: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const syncService = getSyncService();

    const deleted = syncService.deleteSyncSchedule(id);

    if (!deleted) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Sync schedule not found'
      };
      return res.status(404).json(response);
    }

    const response: ApiResponse<null> = {
      success: true,
      message: 'Sync schedule deleted successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error deleting sync schedule:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to delete sync schedule'
    };
    res.status(500).json(response);
  }
};

/**
 * POST /api/sync/manual
 * Trigger manual sync
 */
export const triggerManualSync: RequestHandler = async (req, res) => {
  try {
    const { warehouse, checkLowStock = true, lowStockThreshold = 5 } = req.body;
    const syncService = getSyncService();

    const result = await syncService.syncInventory(warehouse, {
      checkLowStock,
      lowStockThreshold
    });

    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
      message: 'Manual sync completed successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error performing manual sync:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to perform manual sync'
    };
    res.status(500).json(response);
  }
};

/**
 * GET /api/sync/status
 * Get sync status and active syncs
 */
export const getSyncStatus: RequestHandler = async (req, res) => {
  try {
    const syncService = getSyncService();
    const activeSyncs = syncService.getActiveSyncs();
    const schedules = syncService.getSyncSchedules();

    const status = {
      activeSyncs: activeSyncs.length,
      activeSyncIds: activeSyncs,
      totalSchedules: schedules.length,
      enabledSchedules: schedules.filter(s => s.enabled).length,
      nextScheduledSync: schedules
        .filter(s => s.enabled && s.nextRun)
        .sort((a, b) => new Date(a.nextRun!).getTime() - new Date(b.nextRun!).getTime())[0]?.nextRun || null
    };

    const response: ApiResponse<typeof status> = {
      success: true,
      data: status
    };

    res.json(response);
  } catch (error) {
    console.error('Error getting sync status:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to get sync status'
    };
    res.status(500).json(response);
  }
};

/**
 * POST /api/sync/track-movement
 * Track a stock movement and notify via WebSocket
 */
export const trackStockMovement: RequestHandler = async (req, res) => {
  try {
    const movementData = req.body;
    const syncService = getSyncService();

    // Validate required fields
    const requiredFields = ['itemCode', 'movementType', 'quantity', 'warehouse', 'reference'];
    for (const field of requiredFields) {
      if (!movementData[field]) {
        const response: ApiResponse<null> = {
          success: false,
          error: `Missing required field: ${field}`
        };
        return res.status(400).json(response);
      }
    }

    const movement = await syncService.trackStockMovement(movementData);

    const response: ApiResponse<typeof movement> = {
      success: true,
      data: movement,
      message: 'Stock movement tracked successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error tracking stock movement:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to track stock movement'
    };
    res.status(500).json(response);
  }
};
