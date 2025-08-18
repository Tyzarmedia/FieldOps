import { Router } from "express";

const router = Router();

// Mock warehouse stock data
const warehouseStock = {
  VAN462: [
    {
      code: "CL000101",
      description: "LMJ SPLICE TRAYS - SOSA",
      quantity: 25,
      reserved: 2,
    },
    {
      code: "FC-50M",
      description: "Fiber Optic Cable - 50m",
      quantity: 15,
      reserved: 0,
    },
    {
      code: "RJ45-100",
      description: "RJ45 Connectors",
      quantity: 100,
      reserved: 10,
    },
    { code: "CT-200", description: "Cable Ties", quantity: 200, reserved: 5 },
    { code: "JB-08", description: "Junction Box", quantity: 8, reserved: 1 },
  ],
  VAN123: [
    {
      code: "CL000101",
      description: "LMJ SPLICE TRAYS - SOSA",
      quantity: 15,
      reserved: 1,
    },
    {
      code: "FC-50M",
      description: "Fiber Optic Cable - 50m",
      quantity: 8,
      reserved: 0,
    },
    {
      code: "RJ45-100",
      description: "RJ45 Connectors",
      quantity: 75,
      reserved: 5,
    },
  ],
  VAN789: [
    {
      code: "CL000101",
      description: "LMJ SPLICE TRAYS - SOSA",
      quantity: 30,
      reserved: 3,
    },
    {
      code: "FC-50M",
      description: "Fiber Optic Cable - 50m",
      quantity: 20,
      reserved: 2,
    },
    { code: "CT-200", description: "Cable Ties", quantity: 150, reserved: 8 },
  ],
};

// Get available stock for a specific warehouse
router.get("/warehouse/:warehouseId/stock", (req, res) => {
  try {
    const { warehouseId } = req.params;
    const stock = warehouseStock[warehouseId] || [];

    res.json({
      success: true,
      data: stock.map((item) => ({
        ...item,
        available: item.quantity - item.reserved,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch warehouse stock",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Search stock in user's warehouse
router.get("/warehouse/:warehouseId/stock/search", (req, res) => {
  try {
    const { warehouseId } = req.params;
    const { query } = req.query;
    const stock = warehouseStock[warehouseId] || [];

    const filteredStock = query
      ? stock.filter(
          (item) =>
            item.code.toLowerCase().includes(query.toString().toLowerCase()) ||
            item.description
              .toLowerCase()
              .includes(query.toString().toLowerCase()),
        )
      : stock;

    res.json({
      success: true,
      data: filteredStock.map((item) => ({
        ...item,
        available: item.quantity - item.reserved,
      })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to search warehouse stock",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Check stock availability for specific item
router.get(
  "/warehouse/:warehouseId/stock/:stockCode/availability",
  (req, res) => {
    try {
      const { warehouseId, stockCode } = req.params;
      const stock = warehouseStock[warehouseId] || [];
      const item = stock.find((s) => s.code === stockCode);

      if (!item) {
        return res.status(404).json({
          success: false,
          error: "Stock item not found in this warehouse",
        });
      }

      const available = item.quantity - item.reserved;
      res.json({
        success: true,
        data: {
          code: item.code,
          description: item.description,
          totalQuantity: item.quantity,
          reserved: item.reserved,
          available,
          warehouseId,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to check stock availability",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
);

// Allocate stock from warehouse
router.post("/warehouse/:warehouseId/stock/:stockCode/allocate", (req, res) => {
  try {
    const { warehouseId, stockCode } = req.params;
    const { quantity, jobId, technicianId } = req.body;

    if (!warehouseStock[warehouseId]) {
      return res.status(404).json({
        success: false,
        error: "Warehouse not found",
      });
    }

    const stock = warehouseStock[warehouseId];
    const itemIndex = stock.findIndex((s) => s.code === stockCode);

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Stock item not found in this warehouse",
      });
    }

    const item = stock[itemIndex];
    const available = item.quantity - item.reserved;

    if (quantity > available) {
      return res.status(400).json({
        success: false,
        error: `Insufficient stock. Available: ${available}, Requested: ${quantity}`,
      });
    }

    // Update reserved quantity (simulate allocation)
    stock[itemIndex].reserved += quantity;

    res.json({
      success: true,
      data: {
        allocationId: `ALLOC-${Date.now()}`,
        stockCode,
        allocatedQuantity: quantity,
        remainingAvailable: available - quantity,
        warehouseId,
        jobId,
        technicianId,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to allocate stock",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get user's warehouse assignments
router.get("/user/:employeeId/warehouses", (req, res) => {
  try {
    const { employeeId } = req.params;

    // Mock user warehouse assignments
    const userWarehouses = {
      tech001: [
        {
          id: "VAN462",
          name: "VAN462",
          description: "East London Service Van",
          isDefault: true,
          warehouseId: "WH-EL-001",
        },
      ],
      tech002: [
        {
          id: "VAN123",
          name: "VAN123",
          description: "Port Elizabeth Service Van",
          isDefault: true,
          warehouseId: "WH-PE-002",
        },
      ],
      tech003: [
        {
          id: "VAN789",
          name: "VAN789",
          description: "Cape Town Service Van",
          isDefault: true,
          warehouseId: "WH-CT-003",
        },
      ],
    };

    const warehouses = userWarehouses[employeeId] || userWarehouses["tech001"];

    res.json({
      success: true,
      data: warehouses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch user warehouses",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
