import axios, { AxiosInstance } from 'axios';

export interface SageX3Config {
  baseUrl: string;
  username: string;
  password: string;
  database: string;
  poolAlias?: string;
  requestConfig?: string;
}

export interface InventoryItem {
  itemCode: string;
  description: string;
  category: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  warehouse: string;
  location: string;
  lastUpdate: string;
  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;
  supplier: string;
  supplierCode: string;
  unitOfMeasure: string;
  status: 'Active' | 'Inactive' | 'Discontinued';
  averageCost: number;
  lastMovementDate: string;
}

export interface StockMovement {
  movementId: string;
  itemCode: string;
  movementType: 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT';
  quantity: number;
  warehouse: string;
  location: string;
  reference: string;
  date: string;
  technician?: string;
  notes?: string;
}

export interface PurchaseOrder {
  orderNumber: string;
  supplier: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: 'Pending' | 'Approved' | 'Shipped' | 'Received' | 'Cancelled';
  items: Array<{
    itemCode: string;
    description: string;
    quantity: number;
    unitPrice: number;
    receivedQuantity: number;
  }>;
  totalAmount: number;
}

export class SageX3Service {
  private api: AxiosInstance;
  private sessionToken: string | null = null;
  private config: SageX3Config;

  constructor(config: SageX3Config) {
    this.config = config;
    this.api = axios.create({
      baseURL: config.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    // Add request interceptor for authentication
    this.api.interceptors.request.use(async (config) => {
      if (!this.sessionToken) {
        await this.authenticate();
      }
      if (this.sessionToken) {
        config.headers.Authorization = `Bearer ${this.sessionToken}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, re-authenticate
          this.sessionToken = null;
          await this.authenticate();
          // Retry the original request
          return this.api.request(error.config);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Authenticate with Sage X3 and get session token
   */
  private async authenticate(): Promise<void> {
    try {
      const response = await axios.post(`${this.config.baseUrl}/api/1/authentication/login`, {
        username: this.config.username,
        password: this.config.password,
        database: this.config.database,
        poolAlias: this.config.poolAlias || '',
        requestConfig: this.config.requestConfig || ''
      });

      this.sessionToken = response.data.sessionToken;
      console.log('Sage X3 authentication successful');
    } catch (error) {
      console.error('Sage X3 authentication failed:', error);
      throw new Error(`Failed to authenticate with Sage X3: ${error.message}`);
    }
  }

  /**
   * Get all inventory items from Sage X3
   */
  async getInventoryItems(warehouse?: string): Promise<InventoryItem[]> {
    try {
      const params: any = {
        representation: 'STK$ITM'
      };

      if (warehouse) {
        params.where = `STOFCY_0="${warehouse}"`;
      }

      const response = await this.api.get('/api/1/collaboration/search/STK', {
        params
      });

      return response.data.map(this.mapSageItemToInventoryItem);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      throw new Error(`Failed to fetch inventory items: ${error.message}`);
    }
  }

  /**
   * Get specific inventory item by item code
   */
  async getInventoryItem(itemCode: string, warehouse?: string): Promise<InventoryItem | null> {
    try {
      const response = await this.api.get(`/api/1/collaboration/search/STK`, {
        params: {
          representation: 'STK$ITM',
          where: warehouse ? 
            `ITMREF_0="${itemCode}" AND STOFCY_0="${warehouse}"` : 
            `ITMREF_0="${itemCode}"`
        }
      });

      if (response.data.length === 0) {
        return null;
      }

      return this.mapSageItemToInventoryItem(response.data[0]);
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      throw new Error(`Failed to fetch inventory item ${itemCode}: ${error.message}`);
    }
  }

  /**
   * Get stock movements for an item or warehouse
   */
  async getStockMovements(itemCode?: string, warehouse?: string, startDate?: string, endDate?: string): Promise<StockMovement[]> {
    try {
      let whereClause = '';
      const conditions = [];

      if (itemCode) conditions.push(`ITMREF_0="${itemCode}"`);
      if (warehouse) conditions.push(`STOFCY_0="${warehouse}"`);
      if (startDate) conditions.push(`MOVDAT_0>="${startDate}"`);
      if (endDate) conditions.push(`MOVDAT_0<="${endDate}"`);

      if (conditions.length > 0) {
        whereClause = conditions.join(' AND ');
      }

      const response = await this.api.get('/api/1/collaboration/search/STMV', {
        params: {
          representation: 'STMV$MVT',
          where: whereClause || undefined,
          orderBy: 'MOVDAT_0 DESC'
        }
      });

      return response.data.map(this.mapSageMovementToStockMovement);
    } catch (error) {
      console.error('Error fetching stock movements:', error);
      throw new Error(`Failed to fetch stock movements: ${error.message}`);
    }
  }

  /**
   * Create stock movement (issue/receipt)
   */
  async createStockMovement(movement: Omit<StockMovement, 'movementId' | 'date'>): Promise<StockMovement> {
    try {
      const sageMovement = {
        ITMREF_0: movement.itemCode,
        STOFCY_0: movement.warehouse,
        LOC_0: movement.location,
        QTYSTU_0: movement.movementType === 'OUT' ? -movement.quantity : movement.quantity,
        MVTTYP_0: this.getSageMovementType(movement.movementType),
        REFNUM_0: movement.reference,
        TEXTE_0: movement.notes || '',
        USR_0: movement.technician || 'SYSTEM'
      };

      const response = await this.api.post('/api/1/collaboration/search/STMV', sageMovement);
      
      return {
        ...movement,
        movementId: response.data.ROWID,
        date: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating stock movement:', error);
      throw new Error(`Failed to create stock movement: ${error.message}`);
    }
  }

  /**
   * Get purchase orders
   */
  async getPurchaseOrders(status?: string): Promise<PurchaseOrder[]> {
    try {
      const params: any = {
        representation: 'POH$PUR'
      };

      if (status) {
        params.where = `POHSTA_0="${status}"`;
      }

      const response = await this.api.get('/api/1/collaboration/search/POH', {
        params
      });

      return response.data.map(this.mapSagePOToPurchaseOrder);
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      throw new Error(`Failed to fetch purchase orders: ${error.message}`);
    }
  }

  /**
   * Get low stock items based on reorder levels
   */
  async getLowStockItems(warehouse?: string): Promise<InventoryItem[]> {
    try {
      const params: any = {
        representation: 'STK$ITM',
        where: 'QTYSTU_0 <= REOLEV_0'
      };

      if (warehouse) {
        params.where += ` AND STOFCY_0="${warehouse}"`;
      }

      const response = await this.api.get('/api/1/collaboration/search/STK', {
        params
      });

      return response.data.map(this.mapSageItemToInventoryItem);
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      throw new Error(`Failed to fetch low stock items: ${error.message}`);
    }
  }

  /**
   * Sync inventory data (get latest from Sage X3)
   */
  async syncInventory(warehouse?: string): Promise<{
    totalItems: number;
    updatedItems: number;
    lowStockItems: number;
    lastSync: string;
  }> {
    try {
      const [allItems, lowStockItems] = await Promise.all([
        this.getInventoryItems(warehouse),
        this.getLowStockItems(warehouse)
      ]);

      // Here you would typically save to your local database
      // For now, we'll return the sync statistics
      return {
        totalItems: allItems.length,
        updatedItems: allItems.length,
        lowStockItems: lowStockItems.length,
        lastSync: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error syncing inventory:', error);
      throw new Error(`Failed to sync inventory: ${error.message}`);
    }
  }

  // Helper methods for mapping Sage X3 data to our format
  private mapSageItemToInventoryItem(sageItem: any): InventoryItem {
    return {
      itemCode: sageItem.ITMREF_0 || '',
      description: sageItem.ITMDES1_0 || '',
      category: sageItem.TCLCOD_0 || '',
      quantity: parseFloat(sageItem.QTYSTU_0) || 0,
      unitPrice: parseFloat(sageItem.PRI_0) || 0,
      currency: sageItem.CUR_0 || 'USD',
      warehouse: sageItem.STOFCY_0 || '',
      location: sageItem.LOC_0 || '',
      lastUpdate: sageItem.UPDDATTIM_0 || new Date().toISOString(),
      minimumStock: parseFloat(sageItem.MINSTO_0) || 0,
      maximumStock: parseFloat(sageItem.MAXSTO_0) || 0,
      reorderLevel: parseFloat(sageItem.REOLEV_0) || 0,
      supplier: sageItem.BPSNUM_0 || '',
      supplierCode: sageItem.BPSSHO_0 || '',
      unitOfMeasure: sageItem.STU_0 || '',
      status: sageItem.ITMSTA_0 === 'A' ? 'Active' : 'Inactive',
      averageCost: parseFloat(sageItem.CUMWACPRI_0) || 0,
      lastMovementDate: sageItem.LASTMOVDAT_0 || ''
    };
  }

  private mapSageMovementToStockMovement(sageMovement: any): StockMovement {
    return {
      movementId: sageMovement.ROWID || '',
      itemCode: sageMovement.ITMREF_0 || '',
      movementType: this.getMovementTypeFromSage(sageMovement.MVTTYP_0),
      quantity: Math.abs(parseFloat(sageMovement.QTYSTU_0) || 0),
      warehouse: sageMovement.STOFCY_0 || '',
      location: sageMovement.LOC_0 || '',
      reference: sageMovement.REFNUM_0 || '',
      date: sageMovement.MOVDAT_0 || '',
      technician: sageMovement.USR_0 || '',
      notes: sageMovement.TEXTE_0 || ''
    };
  }

  private mapSagePOToPurchaseOrder(sagePO: any): PurchaseOrder {
    return {
      orderNumber: sagePO.POHNUM_0 || '',
      supplier: sagePO.BPSNUM_0 || '',
      orderDate: sagePO.ORDDAT_0 || '',
      expectedDeliveryDate: sagePO.EXTRCPDAT_0 || '',
      status: this.getPOStatusFromSage(sagePO.POHSTA_0),
      items: [], // Would need separate call to get line items
      totalAmount: parseFloat(sagePO.TOTATI_0) || 0
    };
  }

  private getSageMovementType(movementType: string): string {
    const mapping = {
      'IN': 'R',    // Receipt
      'OUT': 'I',   // Issue
      'TRANSFER': 'T', // Transfer
      'ADJUSTMENT': 'A' // Adjustment
    };
    return mapping[movementType] || 'I';
  }

  private getMovementTypeFromSage(sageType: string): 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT' {
    const mapping = {
      'R': 'IN',
      'I': 'OUT',
      'T': 'TRANSFER',
      'A': 'ADJUSTMENT'
    };
    return mapping[sageType] || 'OUT';
  }

  private getPOStatusFromSage(sageStatus: string): 'Pending' | 'Approved' | 'Shipped' | 'Received' | 'Cancelled' {
    const mapping = {
      'O': 'Pending',
      'A': 'Approved',
      'S': 'Shipped',
      'R': 'Received',
      'C': 'Cancelled'
    };
    return mapping[sageStatus] || 'Pending';
  }
}

// Singleton instance
let sageX3ServiceInstance: SageX3Service | null = null;

export function getSageX3Service(config?: SageX3Config): SageX3Service {
  if (!sageX3ServiceInstance && config) {
    sageX3ServiceInstance = new SageX3Service(config);
  }
  return sageX3ServiceInstance!;
}
