// Shared interfaces for inventory management with Sage X3 integration

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

export interface InventoryStats {
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

export interface SageX3SyncResult {
  totalItems: number;
  updatedItems: number;
  lowStockItems: number;
  lastSync: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Issue/Return form interfaces
export interface IssueItemRequest {
  itemCode: string;
  quantity: number;
  technicianId: string;
  jobReference?: string;
  warehouse: string;
  notes?: string;
}

export interface ReturnItemRequest {
  itemCode: string;
  quantity: number;
  technicianId: string;
  warehouse: string;
  condition: 'Good' | 'Damaged' | 'Defective';
  notes?: string;
}

// Sage X3 Configuration
export interface SageX3Config {
  baseUrl: string;
  username: string;
  password: string;
  database: string;
  poolAlias?: string;
  requestConfig?: string;
}
