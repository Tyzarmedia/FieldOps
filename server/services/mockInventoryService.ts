import { InventoryItem, StockMovement, PurchaseOrder } from './sageX3Service';

// Mock inventory data for fallback when Sage X3 is not available
const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    itemCode: 'FBR-001',
    description: 'Fiber Optic Cable 24-strand',
    category: 'Fiber Cables',
    quantity: 150,
    unitPrice: 45.50,
    currency: 'ZAR',
    warehouse: 'MAIN',
    location: 'A-01-01',
    lastUpdate: '2025-01-25T10:30:00Z',
    minimumStock: 20,
    maximumStock: 500,
    reorderLevel: 50,
    supplier: 'FiberTech Solutions',
    supplierCode: 'FTS001',
    unitOfMeasure: 'MTR',
    status: 'Active',
    averageCost: 42.30,
    lastMovementDate: '2025-01-24T14:20:00Z'
  },
  {
    itemCode: 'ONT-002',
    description: 'Optical Network Terminal GPON',
    category: 'Network Equipment',
    quantity: 25,
    unitPrice: 320.00,
    currency: 'ZAR',
    warehouse: 'MAIN',
    location: 'B-02-03',
    lastUpdate: '2025-01-25T09:15:00Z',
    minimumStock: 10,
    maximumStock: 100,
    reorderLevel: 15,
    supplier: 'NetEquip Ltd',
    supplierCode: 'NEL002',
    unitOfMeasure: 'EA',
    status: 'Active',
    averageCost: 315.75,
    lastMovementDate: '2025-01-23T11:45:00Z'
  },
  {
    itemCode: 'SPL-003',
    description: 'Fiber Splice Closure 24-port',
    category: 'Splice Equipment',
    quantity: 8,
    unitPrice: 125.00,
    currency: 'ZAR',
    warehouse: 'MAIN',
    location: 'C-01-02',
    lastUpdate: '2025-01-25T08:45:00Z',
    minimumStock: 5,
    maximumStock: 50,
    reorderLevel: 10,
    supplier: 'SpliceMax Corp',
    supplierCode: 'SMC003',
    unitOfMeasure: 'EA',
    status: 'Active',
    averageCost: 122.50,
    lastMovementDate: '2025-01-22T16:30:00Z'
  },
  {
    itemCode: 'RTR-004',
    description: 'WIFI Router AC1200',
    category: 'Customer Equipment',
    quantity: 45,
    unitPrice: 280.00,
    currency: 'ZAR',
    warehouse: 'BRANCH',
    location: 'A-03-01',
    lastUpdate: '2025-01-25T12:00:00Z',
    minimumStock: 15,
    maximumStock: 200,
    reorderLevel: 25,
    supplier: 'RouterTech Inc',
    supplierCode: 'RTI004',
    unitOfMeasure: 'EA',
    status: 'Active',
    averageCost: 275.00,
    lastMovementDate: '2025-01-24T09:15:00Z'
  },
  {
    itemCode: 'CBL-005',
    description: 'Drop Cable 2-core FTTH',
    category: 'Drop Cables',
    quantity: 3,
    unitPrice: 18.50,
    currency: 'ZAR',
    warehouse: 'MAIN',
    location: 'A-02-01',
    lastUpdate: '2025-01-25T13:30:00Z',
    minimumStock: 100,
    maximumStock: 1000,
    reorderLevel: 200,
    supplier: 'CableCorp SA',
    supplierCode: 'CCS005',
    unitOfMeasure: 'MTR',
    status: 'Active',
    averageCost: 17.80,
    lastMovementDate: '2025-01-25T10:00:00Z'
  }
];

const MOCK_STOCK_MOVEMENTS: StockMovement[] = [
  {
    movementId: 'MOV-001',
    itemCode: 'FBR-001',
    movementType: 'OUT',
    quantity: 50,
    warehouse: 'MAIN',
    location: 'FIELD',
    reference: 'JOB-001',
    date: '2025-01-25T08:30:00Z',
    technician: 'Sipho Masinga',
    notes: 'Issued for fiber installation project'
  },
  {
    movementId: 'MOV-002',
    itemCode: 'ONT-002',
    movementType: 'OUT',
    quantity: 2,
    warehouse: 'MAIN',
    location: 'FIELD',
    reference: 'JOB-002',
    date: '2025-01-24T14:15:00Z',
    technician: 'Thabo Sithole',
    notes: 'Customer installation'
  },
  {
    movementId: 'MOV-003',
    itemCode: 'CBL-005',
    movementType: 'OUT',
    quantity: 120,
    warehouse: 'MAIN',
    location: 'FIELD',
    reference: 'JOB-003',
    date: '2025-01-25T10:00:00Z',
    technician: 'Naledi Modise',
    notes: 'Drop cable for multiple installations'
  }
];

export class MockInventoryService {
  private items: InventoryItem[] = [...MOCK_INVENTORY_ITEMS];
  private movements: StockMovement[] = [...MOCK_STOCK_MOVEMENTS];

  async getInventoryItems(warehouse?: string): Promise<InventoryItem[]> {
    await this.simulateDelay(100); // Simulate API delay
    
    if (warehouse && warehouse !== 'all') {
      return this.items.filter(item => item.warehouse === warehouse);
    }
    return this.items;
  }

  async getInventoryItem(itemCode: string, warehouse?: string): Promise<InventoryItem | null> {
    await this.simulateDelay(50);
    
    let item = this.items.find(item => item.itemCode === itemCode);
    
    if (item && warehouse && warehouse !== 'all' && item.warehouse !== warehouse) {
      return null;
    }
    
    return item || null;
  }

  async getLowStockItems(warehouse?: string): Promise<InventoryItem[]> {
    await this.simulateDelay(100);
    
    let items = this.items.filter(item => item.quantity <= item.reorderLevel);
    
    if (warehouse && warehouse !== 'all') {
      items = items.filter(item => item.warehouse === warehouse);
    }
    
    return items;
  }

  async getStockMovements(
    itemCode?: string,
    warehouse?: string,
    startDate?: string,
    endDate?: string
  ): Promise<StockMovement[]> {
    await this.simulateDelay(100);
    
    let movements = [...this.movements];
    
    if (itemCode) {
      movements = movements.filter(movement => movement.itemCode === itemCode);
    }
    
    if (warehouse && warehouse !== 'all') {
      movements = movements.filter(movement => movement.warehouse === warehouse);
    }
    
    // Note: Date filtering would be implemented here if needed
    
    return movements;
  }

  async createStockMovement(movementData: Partial<StockMovement>): Promise<StockMovement> {
    await this.simulateDelay(200);
    
    const movement: StockMovement = {
      movementId: `MOV-${Date.now()}`,
      itemCode: movementData.itemCode || '',
      movementType: movementData.movementType || 'OUT',
      quantity: movementData.quantity || 0,
      warehouse: movementData.warehouse || 'MAIN',
      location: movementData.location || 'FIELD',
      reference: movementData.reference || `REF-${Date.now()}`,
      date: new Date().toISOString(),
      technician: movementData.technician,
      notes: movementData.notes
    };
    
    this.movements.unshift(movement);
    
    // Update inventory quantity
    const item = this.items.find(item => item.itemCode === movement.itemCode);
    if (item) {
      if (movement.movementType === 'OUT') {
        item.quantity = Math.max(0, item.quantity - movement.quantity);
      } else if (movement.movementType === 'IN') {
        item.quantity += movement.quantity;
      }
      item.lastUpdate = new Date().toISOString();
      item.lastMovementDate = movement.date;
    }
    
    return movement;
  }

  async getPurchaseOrders(status?: string): Promise<PurchaseOrder[]> {
    await this.simulateDelay(100);
    
    // Mock purchase orders
    const orders: PurchaseOrder[] = [
      {
        orderNumber: 'PO-001',
        supplier: 'FiberTech Solutions',
        orderDate: '2025-01-20T00:00:00Z',
        expectedDeliveryDate: '2025-01-30T00:00:00Z',
        status: 'Approved',
        totalAmount: 15000,
        currency: 'ZAR',
        items: [
          {
            itemCode: 'FBR-001',
            description: 'Fiber Optic Cable 24-strand',
            quantity: 500,
            unitPrice: 45.50,
            totalPrice: 22750
          }
        ]
      }
    ];
    
    if (status) {
      return orders.filter(order => order.status === status);
    }
    
    return orders;
  }

  async syncInventory(warehouse?: string): Promise<any> {
    await this.simulateDelay(2000); // Simulate longer sync operation
    
    return {
      syncedItems: this.items.length,
      syncedMovements: this.movements.length,
      lastSync: new Date().toISOString(),
      warehouse: warehouse || 'all',
      success: true
    };
  }

  private async simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default MockInventoryService;
