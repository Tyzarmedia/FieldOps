import { RequestHandler } from 'express';
import { getSageX3Service, SageX3Config, InventoryItem, StockMovement, PurchaseOrder } from '../services/sageX3Service';

// Sage X3 configuration - in production, these should come from environment variables
const sageX3Config: SageX3Config = {
  baseUrl: process.env.SAGE_X3_BASE_URL || 'https://your-sage-server.com:8124',
  username: process.env.SAGE_X3_USERNAME || 'admin',
  password: process.env.SAGE_X3_PASSWORD || 'password',
  database: process.env.SAGE_X3_DATABASE || 'X3V12',
  poolAlias: process.env.SAGE_X3_POOL_ALIAS || 'NODEMGR',
  requestConfig: process.env.SAGE_X3_REQUEST_CONFIG || ''
};

// Initialize Sage X3 service
const sageX3Service = getSageX3Service(sageX3Config);

// Response interfaces
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface InventoryStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  categories: Array<{
    name: string;
    count: number;
    value: number;
  }>;
  warehouses: Array<{
    name: string;
    itemCount: number;
    totalValue: number;
  }>;
}

/**
 * GET /api/inventory/items
 * Get all inventory items with optional filtering
 */
export const getInventoryItems: RequestHandler = async (req, res) => {
  try {
    const { warehouse, category, status, lowStock } = req.query;
    
    let items = await sageX3Service.getInventoryItems(warehouse as string);
    
    // Apply filters
    if (category) {
      items = items.filter(item => item.category === category);
    }
    
    if (status) {
      items = items.filter(item => item.status === status);
    }
    
    if (lowStock === 'true') {
      items = items.filter(item => item.quantity <= item.reorderLevel);
    }
    
    const response: ApiResponse<InventoryItem[]> = {
      success: true,
      data: items,
      message: `Retrieved ${items.length} inventory items`
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to fetch inventory items'
    };
    res.status(500).json(response);
  }
};

/**
 * GET /api/inventory/item/:itemCode
 * Get specific inventory item by code
 */
export const getInventoryItem: RequestHandler = async (req, res) => {
  try {
    const { itemCode } = req.params;
    const { warehouse } = req.query;
    
    const item = await sageX3Service.getInventoryItem(itemCode, warehouse as string);
    
    if (!item) {
      const response: ApiResponse<null> = {
        success: false,
        error: `Item ${itemCode} not found`
      };
      return res.status(404).json(response);
    }
    
    const response: ApiResponse<InventoryItem> = {
      success: true,
      data: item
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to fetch inventory item'
    };
    res.status(500).json(response);
  }
};

/**
 * GET /api/inventory/movements
 * Get stock movements with optional filtering
 */
export const getStockMovements: RequestHandler = async (req, res) => {
  try {
    const { itemCode, warehouse, startDate, endDate, limit = '100' } = req.query;
    
    let movements = await sageX3Service.getStockMovements(
      itemCode as string,
      warehouse as string,
      startDate as string,
      endDate as string
    );
    
    // Limit results
    const limitNum = parseInt(limit as string);
    if (limitNum > 0) {
      movements = movements.slice(0, limitNum);
    }
    
    const response: ApiResponse<StockMovement[]> = {
      success: true,
      data: movements,
      message: `Retrieved ${movements.length} stock movements`
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching stock movements:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to fetch stock movements'
    };
    res.status(500).json(response);
  }
};

/**
 * POST /api/inventory/movements
 * Create a new stock movement
 */
export const createStockMovement: RequestHandler = async (req, res) => {
  try {
    const movementData = req.body;
    
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
    
    const movement = await sageX3Service.createStockMovement(movementData);
    
    const response: ApiResponse<StockMovement> = {
      success: true,
      data: movement,
      message: 'Stock movement created successfully'
    };
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating stock movement:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to create stock movement'
    };
    res.status(500).json(response);
  }
};

/**
 * GET /api/inventory/purchase-orders
 * Get purchase orders
 */
export const getPurchaseOrders: RequestHandler = async (req, res) => {
  try {
    const { status } = req.query;
    
    const purchaseOrders = await sageX3Service.getPurchaseOrders(status as string);
    
    const response: ApiResponse<PurchaseOrder[]> = {
      success: true,
      data: purchaseOrders,
      message: `Retrieved ${purchaseOrders.length} purchase orders`
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to fetch purchase orders'
    };
    res.status(500).json(response);
  }
};

/**
 * GET /api/inventory/low-stock
 * Get items with low stock levels
 */
export const getLowStockItems: RequestHandler = async (req, res) => {
  try {
    const { warehouse } = req.query;
    
    const lowStockItems = await sageX3Service.getLowStockItems(warehouse as string);
    
    const response: ApiResponse<InventoryItem[]> = {
      success: true,
      data: lowStockItems,
      message: `Found ${lowStockItems.length} items with low stock`
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to fetch low stock items'
    };
    res.status(500).json(response);
  }
};

/**
 * POST /api/inventory/sync
 * Sync inventory data from Sage X3
 */
export const syncInventory: RequestHandler = async (req, res) => {
  try {
    const { warehouse, force = false } = req.body;
    
    console.log(`Starting inventory sync for warehouse: ${warehouse || 'all'}`);
    
    const syncResult = await sageX3Service.syncInventory(warehouse);
    
    const response: ApiResponse<typeof syncResult> = {
      success: true,
      data: syncResult,
      message: 'Inventory sync completed successfully'
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error syncing inventory:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to sync inventory'
    };
    res.status(500).json(response);
  }
};

/**
 * GET /api/inventory/stats
 * Get inventory statistics and analytics
 */
export const getInventoryStats: RequestHandler = async (req, res) => {
  try {
    const { warehouse } = req.query;
    
    const items = await sageX3Service.getInventoryItems(warehouse as string);
    const lowStockItems = await sageX3Service.getLowStockItems(warehouse as string);
    
    // Calculate statistics
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    
    // Group by category
    const categoryMap = new Map<string, { count: number; value: number }>();
    items.forEach(item => {
      const existing = categoryMap.get(item.category) || { count: 0, value: 0 };
      categoryMap.set(item.category, {
        count: existing.count + 1,
        value: existing.value + (item.quantity * item.unitPrice)
      });
    });
    
    // Group by warehouse
    const warehouseMap = new Map<string, { itemCount: number; totalValue: number }>();
    items.forEach(item => {
      const existing = warehouseMap.get(item.warehouse) || { itemCount: 0, totalValue: 0 };
      warehouseMap.set(item.warehouse, {
        itemCount: existing.itemCount + 1,
        totalValue: existing.totalValue + (item.quantity * item.unitPrice)
      });
    });
    
    const stats: InventoryStats = {
      totalItems: items.length,
      totalValue: totalValue,
      lowStockItems: lowStockItems.length,
      categories: Array.from(categoryMap.entries()).map(([name, data]) => ({
        name,
        count: data.count,
        value: data.value
      })),
      warehouses: Array.from(warehouseMap.entries()).map(([name, data]) => ({
        name,
        itemCount: data.itemCount,
        totalValue: data.totalValue
      }))
    };
    
    const response: ApiResponse<InventoryStats> = {
      success: true,
      data: stats
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error getting inventory stats:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to get inventory statistics'
    };
    res.status(500).json(response);
  }
};

/**
 * POST /api/inventory/issue
 * Issue inventory to technician
 */
export const issueInventory: RequestHandler = async (req, res) => {
  try {
    const { itemCode, quantity, technicianId, jobReference, warehouse, notes } = req.body;
    
    // Validate required fields
    if (!itemCode || !quantity || !technicianId || !warehouse) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Missing required fields: itemCode, quantity, technicianId, warehouse'
      };
      return res.status(400).json(response);
    }
    
    // Create stock movement for issue
    const movement = await sageX3Service.createStockMovement({
      itemCode,
      movementType: 'OUT',
      quantity,
      warehouse,
      location: 'FIELD',
      reference: jobReference || `TECH-${technicianId}`,
      technician: technicianId,
      notes: notes || `Issued to technician ${technicianId}`
    });
    
    const response: ApiResponse<StockMovement> = {
      success: true,
      data: movement,
      message: `Successfully issued ${quantity} of ${itemCode} to technician ${technicianId}`
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error issuing inventory:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to issue inventory'
    };
    res.status(500).json(response);
  }
};

/**
 * POST /api/inventory/return
 * Return inventory from technician
 */
export const returnInventory: RequestHandler = async (req, res) => {
  try {
    const { itemCode, quantity, technicianId, warehouse, notes, condition = 'Good' } = req.body;
    
    // Validate required fields
    if (!itemCode || !quantity || !technicianId || !warehouse) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Missing required fields: itemCode, quantity, technicianId, warehouse'
      };
      return res.status(400).json(response);
    }
    
    // Create stock movement for return
    const movement = await sageX3Service.createStockMovement({
      itemCode,
      movementType: 'IN',
      quantity,
      warehouse,
      location: condition === 'Good' ? 'MAIN' : 'DAMAGED',
      reference: `RETURN-${technicianId}`,
      technician: technicianId,
      notes: notes || `Returned by technician ${technicianId} - Condition: ${condition}`
    });
    
    const response: ApiResponse<StockMovement> = {
      success: true,
      data: movement,
      message: `Successfully returned ${quantity} of ${itemCode} from technician ${technicianId}`
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error returning inventory:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: error.message || 'Failed to return inventory'
    };
    res.status(500).json(response);
  }
};
