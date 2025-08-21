// Stock Management API Routes
import { Router } from "express";
import { createNotification } from "../services/notificationService";

const router = Router();

// Debug endpoint to test if stock management routes are working
router.get("/debug", (req, res) => {
  res.json({
    success: true,
    message: "Stock management router is working!",
    timestamp: new Date().toISOString(),
    itemCount: stockItems.length,
  });
});

// Tool assignments for technicians (separate from general stock)
let technicianToolAssignments: any[] = [
  {
    id: "TA-001",
    technicianId: "T001",
    technicianName: "John Smith",
    assignedDate: "2025-01-01",
    tools: [
      {
        id: "TOOL-001",
        name: "Power Drill",
        category: "Power Tools",
        serialNumber: "PD-2025-001",
        condition: "Good",
        lastInspectionDate: "2025-01-10",
        nextInspectionDue: "2025-01-24",
        assignedDate: "2025-01-01",
        status: "assigned",
        imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=500"
      },
      {
        id: "TOOL-002",
        name: "Fiber Optic Splice Machine",
        category: "Fiber Equipment",
        serialNumber: "FOSM-2024-156",
        condition: "Excellent",
        lastInspectionDate: "2025-01-08",
        nextInspectionDue: "2025-01-22",
        assignedDate: "2025-01-01",
        status: "assigned",
        imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500"
      },
      {
        id: "TOOL-003",
        name: "OTDR Tester",
        category: "Testing Equipment",
        serialNumber: "OTDR-2024-089",
        condition: "Good",
        lastInspectionDate: "2025-01-05",
        nextInspectionDue: "2025-01-19",
        assignedDate: "2025-01-01",
        status: "assigned",
        imageUrl: "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=500"
      },
      {
        id: "TOOL-004",
        name: "Digital Multimeter",
        category: "Testing Equipment",
        serialNumber: "DMM-2024-203",
        condition: "Fair",
        lastInspectionDate: "2025-01-03",
        nextInspectionDue: "2025-01-17",
        assignedDate: "2025-01-01",
        status: "assigned",
        imageUrl: "https://images.unsplash.com/photo-1609094627627-8b9ca5b2a7b4?w=500"
      }
    ]
  },
  {
    id: "TA-002",
    technicianId: "T002",
    technicianName: "Sarah Johnson",
    assignedDate: "2025-01-01",
    tools: [
      {
        id: "TOOL-005",
        name: "Cable Puller",
        category: "Installation Tools",
        serialNumber: "CP-2024-178",
        condition: "Good",
        lastInspectionDate: "2025-01-12",
        nextInspectionDue: "2025-01-26",
        assignedDate: "2025-01-01",
        status: "assigned",
        imageUrl: "https://images.unsplash.com/photo-1609098725950-d0e4ca0b617d?w=500"
      },
      {
        id: "TOOL-006",
        name: "Impact Driver",
        category: "Power Tools",
        serialNumber: "ID-2024-299",
        condition: "Excellent",
        lastInspectionDate: "2025-01-11",
        nextInspectionDue: "2025-01-25",
        assignedDate: "2025-01-01",
        status: "assigned",
        imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=500"
      },
      {
        id: "TOOL-007",
        name: "Fiber Cleaver",
        category: "Fiber Equipment",
        serialNumber: "FC-2024-334",
        condition: "Good",
        lastInspectionDate: "2025-01-09",
        nextInspectionDue: "2025-01-23",
        assignedDate: "2025-01-01",
        status: "assigned",
        imageUrl: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500"
      }
    ]
  },
  {
    id: "TA-003",
    technicianId: "T003",
    technicianName: "Mike Wilson",
    assignedDate: "2025-01-01",
    tools: [
      {
        id: "TOOL-008",
        name: "Angle Grinder",
        category: "Power Tools",
        serialNumber: "AG-2024-401",
        condition: "Fair",
        lastInspectionDate: "2025-01-07",
        nextInspectionDue: "2025-01-21",
        assignedDate: "2025-01-01",
        status: "assigned",
        imageUrl: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500"
      },
      {
        id: "TOOL-009",
        name: "Crimping Tool",
        category: "Hand Tools",
        serialNumber: "CT-2024-512",
        condition: "Good",
        lastInspectionDate: "2025-01-06",
        nextInspectionDue: "2025-01-20",
        assignedDate: "2025-01-01",
        status: "assigned",
        imageUrl: "https://images.unsplash.com/photo-1609093153864-a71a52e9b8c4?w=500"
      }
    ]
  }
];

// Real fiber optic inventory data from client specifications
let stockItems: any[] = [
  // Bolts and Anchors
  {
    id: "BOL00031",
    name: "NAIL-IN ANCHORS 6 x 35",
    description: "Nail-in anchors for securing fiber installations",
    category: "Hardware",
    sku: "BOL00031",
    unit: "pieces",
    quantity: 100,
    minimumQuantity: 20,
    unitPrice: 1.5,
    supplier: "Hardware Supplies Ltd",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  // Fiber Cables
  {
    id: "CAB00092",
    name: "MICRO MINI 24F FIBRE BLACK",
    description: "24 fiber micro mini cable for FTTH applications",
    category: "Cables",
    sku: "CAB00092",
    unit: "meters",
    quantity: 2000,
    minimumQuantity: 500,
    unitPrice: 4.2,
    supplier: "Fiber Solutions Inc",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "CAB00135",
    name: "FTTX DROP CABLE REPAIR KIT 1A",
    description: "Repair kit for FTTX drop cable installations",
    category: "Repair Kits",
    sku: "CAB00135",
    unit: "kits",
    quantity: 25,
    minimumQuantity: 10,
    unitPrice: 45.0,
    supplier: "Fiber Solutions Inc",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "CAB00175",
    name: "UNJACKED PIGTAILS LC/APC - 1M (9/125)",
    description: "Unjacked pigtails LC/APC connector 1 meter",
    category: "Connectors",
    sku: "CAB00175",
    unit: "pieces",
    quantity: 50,
    minimumQuantity: 100,
    unitPrice: 8.5,
    supplier: "Fiber Solutions Inc",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "low-stock",
  },
  {
    id: "CAB00177",
    name: "Patchcord LC/APC - SC/APC 1m",
    description: "Patchcord cable LC/APC to SC/APC 1 meter",
    category: "Connectors",
    sku: "CAB00177",
    unit: "pieces",
    quantity: 75,
    minimumQuantity: 50,
    unitPrice: 12.0,
    supplier: "Fiber Solutions Inc",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "CAB00189",
    name: "Patchcord LC/APC - LC/APC 3m",
    description: "Patchcord cable LC/APC to LC/APC 3 meters",
    category: "Connectors",
    sku: "CAB00189",
    unit: "pieces",
    quantity: 60,
    minimumQuantity: 40,
    unitPrice: 15.0,
    supplier: "Fiber Solutions Inc",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  // Closures and Seals
  {
    id: "CLO00035",
    name: "MECH SEAL-MEDIUM ENTRY GLAND 7-20MM (ENTRY PORTS)",
    description: "Mechanical seal medium entry gland 7-20MM",
    category: "Closures",
    sku: "CLO00035",
    unit: "pieces",
    quantity: 30,
    minimumQuantity: 15,
    unitPrice: 18.5,
    supplier: "Sealing Solutions",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "CLO00046",
    name: "MECH SEAL MEDIUM OVAL KIT 5 -7MM",
    description: "Mechanical seal medium oval kit 5-7MM",
    category: "Closures",
    sku: "CLO00046",
    unit: "kits",
    quantity: 20,
    minimumQuantity: 10,
    unitPrice: 25.0,
    supplier: "Sealing Solutions",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "CLO00057",
    name: "MECH SEAL-MEDIUM ENTRY GLAND 4-7MM (ENTRY PORTS)",
    description: "Mechanical seal medium entry gland 4-7MM",
    category: "Closures",
    sku: "CLO00057",
    unit: "pieces",
    quantity: 25,
    minimumQuantity: 12,
    unitPrice: 16.0,
    supplier: "Sealing Solutions",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "CLO00063",
    name: "TENIO30 JOINT DFA SPEC 288F",
    description: "TENIO30 joint DFA specification 288 fiber",
    category: "Closures",
    sku: "CLO00063",
    unit: "pieces",
    quantity: 8,
    minimumQuantity: 5,
    unitPrice: 120.0,
    supplier: "Sealing Solutions",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "CLO00086",
    name: "FTB - MAXxim INDOOR",
    description: "FTB MAXxim indoor closure solution",
    category: "Closures",
    sku: "CLO00086",
    unit: "units",
    quantity: 15,
    minimumQuantity: 8,
    unitPrice: 85.0,
    supplier: "Sealing Solutions",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "CLO00125",
    name: "TENIO-CTU-S Cable Termination Small (Fiber Accessories)",
    description: "TENIO CTU-S cable termination small for fiber accessories",
    category: "Closures",
    sku: "CLO00125",
    unit: "pieces",
    quantity: 40,
    minimumQuantity: 20,
    unitPrice: 22.5,
    supplier: "Sealing Solutions",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  // General Items
  {
    id: "GEN00007",
    name: "Cable Ties (305 x 4.7mm) T50I - (LARGE) BLACK",
    description: "Large black cable ties 305x4.7mm T50I",
    category: "General",
    sku: "GEN00007",
    unit: "pieces",
    quantity: 500,
    minimumQuantity: 100,
    unitPrice: 0.5,
    supplier: "General Supplies",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "GEN00015",
    name: "DURACELL ALKALINE BATTERY (1 X AA)",
    description: "Duracell alkaline AA battery",
    category: "General",
    sku: "GEN00015",
    unit: "pieces",
    quantity: 100,
    minimumQuantity: 50,
    unitPrice: 2.0,
    supplier: "General Supplies",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "GEN00043",
    name: "REDUCER COUPLER 14MM-12MM",
    description: "Reducer coupler from 14MM to 12MM",
    category: "General",
    sku: "GEN00043",
    unit: "pieces",
    quantity: 80,
    minimumQuantity: 30,
    unitPrice: 3.5,
    supplier: "General Supplies",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "GEN00045",
    name: "14MM COUPLER",
    description: "14MM coupler for cable management",
    category: "General",
    sku: "GEN00045",
    unit: "pieces",
    quantity: 60,
    minimumQuantity: 25,
    unitPrice: 2.8,
    supplier: "General Supplies",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "GEN00109",
    name: "POLY FILLA READY MIX INTERIOR (Paste Form)",
    description: "Poly filla ready mix interior paste form",
    category: "General",
    sku: "GEN00109",
    unit: "containers",
    quantity: 20,
    minimumQuantity: 10,
    unitPrice: 15.0,
    supplier: "General Supplies",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "GEN00116",
    name: "Cable Ties (100 x 2.5mm) T18R - (SMALL) BLACK",
    description: "Small black cable ties 100x2.5mm T18R",
    category: "General",
    sku: "GEN00116",
    unit: "pieces",
    quantity: 1000,
    minimumQuantity: 200,
    unitPrice: 0.2,
    supplier: "General Supplies",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "GEN00128",
    name: "VELCRO - HOOK + LOOP CABLE TIES 20M X 12MM",
    description: "Velcro hook and loop cable ties 20M x 12MM",
    category: "General",
    sku: "GEN00128",
    unit: "rolls",
    quantity: 15,
    minimumQuantity: 8,
    unitPrice: 25.0,
    supplier: "General Supplies",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "GEN00170",
    name: "BRADY CARTRIDGE BLACK ON YELLOW 9.53MM",
    description: "Brady cartridge black on yellow 9.53MM",
    category: "General",
    sku: "GEN00170",
    unit: "cartridges",
    quantity: 12,
    minimumQuantity: 6,
    unitPrice: 35.0,
    supplier: "General Supplies",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "GEN00207",
    name: "GLUE STICKS",
    description: "Standard glue sticks for various applications",
    category: "General",
    sku: "GEN00207",
    unit: "pieces",
    quantity: 50,
    minimumQuantity: 20,
    unitPrice: 1.5,
    supplier: "General Supplies",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  // Trays and Splitters
  {
    id: "TRA00009",
    name: "FTTX MICROLOOP GEN 2-4MM IN/OUT",
    description: "FTTX microloop generation 2 4MM in/out",
    category: "Trays",
    sku: "TRA00009",
    unit: "pieces",
    quantity: 30,
    minimumQuantity: 15,
    unitPrice: 45.0,
    supplier: "Fiber Solutions Inc",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "CLO00101",
    name: "LMJ SPLICE TRAYS - SOSA",
    description: "LMJ splice trays SOSA configuration",
    category: "Trays",
    sku: "CLO00101",
    unit: "pieces",
    quantity: 25,
    minimumQuantity: 12,
    unitPrice: 38.0,
    supplier: "Fiber Solutions Inc",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "CLO00110",
    name: "DOME JOINT LMJ SHORT Cap + 24XSE2.2MM 12F TRAYS",
    description: "Dome joint LMJ short cap with 24XSE2.2MM 12F trays",
    category: "Trays",
    sku: "CLO00110",
    unit: "kits",
    quantity: 18,
    minimumQuantity: 10,
    unitPrice: 65.0,
    supplier: "Fiber Solutions Inc",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "CLO00138",
    name: "LMJ SPLITTER TRAY (GREEN TRAYS)",
    description: "LMJ splitter tray in green color",
    category: "Trays",
    sku: "CLO00138",
    unit: "pieces",
    quantity: 22,
    minimumQuantity: 12,
    unitPrice: 42.0,
    supplier: "Fiber Solutions Inc",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "TRA00115",
    name: "MIDCOUPLER LC/APC GREEN",
    description: "Midcoupler LC/APC green connector",
    category: "Trays",
    sku: "TRA00115",
    unit: "pieces",
    quantity: 0,
    minimumQuantity: 25,
    unitPrice: 18.0,
    supplier: "Fiber Solutions Inc",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "out-of-stock",
  },
  {
    id: "TRA00118",
    name: "SPLITTER BARE FIBRE 32WAY",
    description: "Splitter bare fiber 32 way configuration",
    category: "Trays",
    sku: "TRA00118",
    unit: "pieces",
    quantity: 12,
    minimumQuantity: 8,
    unitPrice: 95.0,
    supplier: "Fiber Solutions Inc",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
  {
    id: "TRA00123",
    name: "PLC 1 X 4 SPLITTER WITH LC/APC (PRE-CONNECTED)",
    description: "PLC 1x4 splitter with LC/APC pre-connected",
    category: "Trays",
    sku: "TRA00123",
    unit: "pieces",
    quantity: 16,
    minimumQuantity: 10,
    unitPrice: 75.0,
    supplier: "Fiber Solutions Inc",
    location: "VAN462",
    lastUpdated: new Date().toISOString(),
    status: "in-stock",
  },
];

let technicianStockAssignments: any[] = [
  {
    id: "ts1",
    technicianId: "tech001",
    technicianName: "Dyondzani Clement Masinge",
    itemId: "1",
    itemName: "Fiber Optic Cable",
    assignedQuantity: 500,
    usedQuantity: 200,
    remainingQuantity: 300,
    assignedDate: new Date().toISOString(),
    assignedBy: "Stock Manager",
    status: "in-use",
    notes: "For weekly FTTH installations",
  },
  {
    id: "ts2",
    technicianId: "tech001",
    technicianName: "Dyondzani Clement Masinge",
    itemId: "2",
    itemName: "Splice Protectors",
    assignedQuantity: 100,
    usedQuantity: 75,
    remainingQuantity: 25,
    assignedDate: new Date().toISOString(),
    assignedBy: "Stock Manager",
    status: "in-use",
  },
];

let stockUsageHistory: any[] = [
  {
    id: "su1",
    technicianId: "tech001",
    itemId: "1",
    itemName: "Fiber Optic Cable",
    quantityUsed: 50,
    usageDate: new Date().toISOString(),
    jobId: "SA-688808",
    jobTitle: "FTTH - Maintenance",
    notes: "Used for customer installation",
  },
];

// Get all stock items (for stock managers)
router.get("/items", (req, res) => {
  try {
    res.json({ success: true, data: stockItems });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch stock items",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get single stock item
router.get("/items/:itemId", (req, res) => {
  try {
    const { itemId } = req.params;
    const item = stockItems.find((i) => i.id === itemId);

    if (!item) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch item",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Create new stock item
router.post("/items", (req, res) => {
  try {
    const itemData = req.body;
    const newItem = {
      id: Date.now().toString(),
      ...itemData,
      lastUpdated: new Date().toISOString(),
      status:
        itemData.quantity > itemData.minimumQuantity
          ? "in-stock"
          : itemData.quantity > 0
            ? "low-stock"
            : "out-of-stock",
    };

    stockItems.push(newItem);

    res.json({
      success: true,
      data: newItem,
      message: "Stock item created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create stock item",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update stock item
router.put("/items/:itemId", (req, res) => {
  try {
    const { itemId } = req.params;
    const updates = req.body;

    const itemIndex = stockItems.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }

    stockItems[itemIndex] = {
      ...stockItems[itemIndex],
      ...updates,
      lastUpdated: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: stockItems[itemIndex],
      message: "Stock item updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update stock item",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get technician stock assignments
router.get("/assignments/technician/:technicianId", (req, res) => {
  try {
    const { technicianId } = req.params;
    const assignments = technicianStockAssignments.filter(
      (assignment) => assignment.technicianId === technicianId,
    );
    res.json({ success: true, data: assignments });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch technician assignments",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get all stock assignments (for stock managers)
router.get("/assignments", (req, res) => {
  try {
    res.json({ success: true, data: technicianStockAssignments });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch assignments",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Assign stock to technician
router.post("/assignments", (req, res) => {
  try {
    const {
      itemId,
      technicianId,
      technicianName,
      quantity,
      notes,
      assignedBy,
    } = req.body;

    // Find the stock item
    const itemIndex = stockItems.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: "Item not found" });
    }

    const item = stockItems[itemIndex];
    if (item.quantity < quantity) {
      return res.status(400).json({
        success: false,
        error: "Insufficient stock quantity",
      });
    }

    // Create assignment
    const newAssignment = {
      id: Date.now().toString(),
      technicianId,
      technicianName,
      itemId,
      itemName: item.name,
      assignedQuantity: quantity,
      usedQuantity: 0,
      remainingQuantity: quantity,
      assignedDate: new Date().toISOString(),
      assignedBy: assignedBy || "Stock Manager",
      status: "assigned",
      notes,
    };

    technicianStockAssignments.push(newAssignment);

    // Update main inventory
    stockItems[itemIndex].quantity -= quantity;

    // Create notification for the technician
    try {
      createNotification({
        technicianId,
        type: 'stock_assigned',
        title: 'Stock Assigned',
        message: `${item.name} (${quantity} ${item.unit}) has been assigned to your inventory`,
        priority: 'medium'
      });
    } catch (error) {
      console.warn('Error creating stock assignment notification:', error);
    }
    stockItems[itemIndex].status =
      stockItems[itemIndex].quantity > stockItems[itemIndex].minimumQuantity
        ? "in-stock"
        : stockItems[itemIndex].quantity > 0
          ? "low-stock"
          : "out-of-stock";
    stockItems[itemIndex].lastUpdated = new Date().toISOString();

    res.json({
      success: true,
      data: newAssignment,
      message: "Stock assigned successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to assign stock",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Record stock usage by technician
router.post("/usage", (req, res) => {
  try {
    const { assignmentId, quantityUsed, jobId, jobTitle, notes, technicianId } =
      req.body;

    // Find the assignment
    const assignmentIndex = technicianStockAssignments.findIndex(
      (a) => a.id === assignmentId && a.technicianId === technicianId,
    );

    if (assignmentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Assignment not found",
      });
    }

    const assignment = technicianStockAssignments[assignmentIndex];

    if (quantityUsed > assignment.remainingQuantity) {
      return res.status(400).json({
        success: false,
        error: "Quantity used exceeds remaining quantity",
      });
    }

    // Update assignment
    technicianStockAssignments[assignmentIndex].usedQuantity += quantityUsed;
    technicianStockAssignments[assignmentIndex].remainingQuantity -=
      quantityUsed;
    technicianStockAssignments[assignmentIndex].status =
      technicianStockAssignments[assignmentIndex].remainingQuantity === 0
        ? "depleted"
        : "in-use";

    // Record usage history
    const usageRecord = {
      id: Date.now().toString(),
      technicianId,
      assignmentId,
      itemId: assignment.itemId,
      itemName: assignment.itemName,
      quantityUsed,
      usageDate: new Date().toISOString(),
      jobId,
      jobTitle,
      notes,
    };

    stockUsageHistory.push(usageRecord);

    res.json({
      success: true,
      data: {
        assignment: technicianStockAssignments[assignmentIndex],
        usage: usageRecord,
      },
      message: "Stock usage recorded successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to record stock usage",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get stock usage history
router.get("/usage/technician/:technicianId", (req, res) => {
  try {
    const { technicianId } = req.params;
    const usage = stockUsageHistory.filter(
      (record) => record.technicianId === technicianId,
    );
    res.json({ success: true, data: usage });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch usage history",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get all usage history (for stock managers)
router.get("/usage", (req, res) => {
  try {
    res.json({ success: true, data: stockUsageHistory });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch usage history",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Return stock to inventory
router.post("/assignments/:assignmentId/return", (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { quantityReturned, notes, technicianId } = req.body;

    // Find the assignment
    const assignmentIndex = technicianStockAssignments.findIndex(
      (a) => a.id === assignmentId && a.technicianId === technicianId,
    );

    if (assignmentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Assignment not found",
      });
    }

    const assignment = technicianStockAssignments[assignmentIndex];

    if (quantityReturned > assignment.remainingQuantity) {
      return res.status(400).json({
        success: false,
        error: "Quantity returned exceeds remaining quantity",
      });
    }

    // Update assignment
    technicianStockAssignments[assignmentIndex].remainingQuantity -=
      quantityReturned;
    if (technicianStockAssignments[assignmentIndex].remainingQuantity === 0) {
      technicianStockAssignments[assignmentIndex].status = "returned";
    }

    // Return to main inventory
    const itemIndex = stockItems.findIndex((i) => i.id === assignment.itemId);
    if (itemIndex !== -1) {
      stockItems[itemIndex].quantity += quantityReturned;
      stockItems[itemIndex].status =
        stockItems[itemIndex].quantity > stockItems[itemIndex].minimumQuantity
          ? "in-stock"
          : stockItems[itemIndex].quantity > 0
            ? "low-stock"
            : "out-of-stock";
      stockItems[itemIndex].lastUpdated = new Date().toISOString();
    }

    res.json({
      success: true,
      data: technicianStockAssignments[assignmentIndex],
      message: "Stock returned successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to return stock",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get stock statistics
router.get("/stats", (req, res) => {
  try {
    const stats = {
      totalItems: stockItems.length,
      inStock: stockItems.filter((item) => item.status === "in-stock").length,
      lowStock: stockItems.filter((item) => item.status === "low-stock").length,
      outOfStock: stockItems.filter((item) => item.status === "out-of-stock")
        .length,
      totalValue: stockItems.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      ),
      assignedStock: technicianStockAssignments.filter(
        (stock) => stock.status === "assigned" || stock.status === "in-use",
      ).length,
      totalUsage: stockUsageHistory.reduce(
        (sum, usage) => sum + usage.quantityUsed,
        0,
      ),
    };

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch stock statistics",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update minimum stock level (Stock Manager only)
router.put("/items/:itemId/minimum-level", (req, res) => {
  try {
    const { itemId } = req.params;
    const { minimumQuantity, updatedBy = 'stock-manager' } = req.body;

    const itemIndex = stockItems.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Item not found"
      });
    }

    const oldMinimum = stockItems[itemIndex].minimumQuantity;
    stockItems[itemIndex].minimumQuantity = minimumQuantity;
    stockItems[itemIndex].lastUpdated = new Date().toISOString();

    // Update status based on new minimum level
    if (stockItems[itemIndex].quantity === 0) {
      stockItems[itemIndex].status = "out-of-stock";
    } else if (stockItems[itemIndex].quantity <= minimumQuantity) {
      stockItems[itemIndex].status = "low-stock";
    } else {
      stockItems[itemIndex].status = "in-stock";
    }

    // Log the change for audit purposes
    console.log(`Minimum stock level updated for ${stockItems[itemIndex].name}:`, {
      itemId,
      oldMinimum,
      newMinimum: minimumQuantity,
      updatedBy,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      data: stockItems[itemIndex],
      message: "Minimum stock level updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update minimum stock level",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Bulk update minimum stock levels
router.put("/items/bulk-minimum-levels", (req, res) => {
  try {
    const { updates, updatedBy = 'stock-manager' } = req.body;
    const results = [];
    const errors = [];

    for (const update of updates) {
      const itemIndex = stockItems.findIndex(item => item.id === update.itemId);
      if (itemIndex === -1) {
        errors.push(`Item ${update.itemId} not found`);
        continue;
      }

      const oldMinimum = stockItems[itemIndex].minimumQuantity;
      stockItems[itemIndex].minimumQuantity = update.minimumQuantity;
      stockItems[itemIndex].lastUpdated = new Date().toISOString();

      // Update status based on new minimum level
      if (stockItems[itemIndex].quantity === 0) {
        stockItems[itemIndex].status = "out-of-stock";
      } else if (stockItems[itemIndex].quantity <= update.minimumQuantity) {
        stockItems[itemIndex].status = "low-stock";
      } else {
        stockItems[itemIndex].status = "in-stock";
      }

      results.push({
        itemId: update.itemId,
        itemName: stockItems[itemIndex].name,
        oldMinimum,
        newMinimum: update.minimumQuantity,
        newStatus: stockItems[itemIndex].status
      });
    }

    res.json({
      success: true,
      data: {
        updated: results,
        errors: errors
      },
      message: `Updated ${results.length} items successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to bulk update minimum stock levels",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get low stock alerts
router.get("/alerts/low-stock", (req, res) => {
  try {
    const lowStockItems = stockItems.filter(item =>
      item.quantity <= item.minimumQuantity && item.quantity > 0
    );

    const outOfStockItems = stockItems.filter(item => item.quantity === 0);

    const alerts = {
      lowStock: lowStockItems.map(item => ({
        itemId: item.id,
        itemName: item.name,
        currentQuantity: item.quantity,
        minimumQuantity: item.minimumQuantity,
        shortage: item.minimumQuantity - item.quantity,
        category: item.category,
        unitPrice: item.unitPrice,
        estimatedRestockCost: (item.minimumQuantity - item.quantity) * item.unitPrice
      })),
      outOfStock: outOfStockItems.map(item => ({
        itemId: item.id,
        itemName: item.name,
        minimumQuantity: item.minimumQuantity,
        category: item.category,
        unitPrice: item.unitPrice,
        estimatedRestockCost: item.minimumQuantity * item.unitPrice
      }))
    };

    res.json({
      success: true,
      data: alerts,
      summary: {
        totalLowStock: lowStockItems.length,
        totalOutOfStock: outOfStockItems.length,
        totalRestockCost: [...lowStockItems, ...outOfStockItems].reduce((sum, item) => {
          const shortage = item.quantity === 0 ? item.minimumQuantity : (item.minimumQuantity - item.quantity);
          return sum + (shortage * item.unitPrice);
        }, 0)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch stock alerts",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get all tools assigned to a specific technician
router.get("/tools/technician/:technicianId", (req, res) => {
  try {
    const { technicianId } = req.params;
    const technicianTools = technicianToolAssignments.find(
      (assignment) => assignment.technicianId === technicianId
    );

    if (!technicianTools) {
      return res.json({
        success: true,
        data: { technicianId, technicianName: 'Unknown', tools: [] },
        message: "No tools assigned to this technician"
      });
    }

    res.json({
      success: true,
      data: technicianTools
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch technician tools",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get all tool assignments (for stock managers)
router.get("/tools/assignments", (req, res) => {
  try {
    res.json({
      success: true,
      data: technicianToolAssignments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch tool assignments",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Update tool inspection status
router.post("/tools/:toolId/inspect", (req, res) => {
  try {
    const { toolId } = req.params;
    const { condition, notes, inspectionDate, nextInspectionDue, technicianId } = req.body;

    // Find the technician and tool
    const technicianAssignment = technicianToolAssignments.find(
      (assignment) => assignment.technicianId === technicianId
    );

    if (!technicianAssignment) {
      return res.status(404).json({
        success: false,
        error: "Technician assignment not found"
      });
    }

    const toolIndex = technicianAssignment.tools.findIndex(
      (tool: any) => tool.id === toolId
    );

    if (toolIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Tool not found in technician's assignment"
      });
    }

    // Update tool inspection data
    technicianAssignment.tools[toolIndex] = {
      ...technicianAssignment.tools[toolIndex],
      condition,
      lastInspectionDate: inspectionDate || new Date().toISOString().split('T')[0],
      nextInspectionDue,
      inspectionNotes: notes
    };

    res.json({
      success: true,
      data: technicianAssignment.tools[toolIndex],
      message: "Tool inspection updated successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update tool inspection",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// Get tools that need inspection (overdue or due soon)
router.get("/tools/inspection-due", (req, res) => {
  try {
    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    const toolsDue: any[] = [];

    technicianToolAssignments.forEach((assignment) => {
      assignment.tools.forEach((tool: any) => {
        const dueDate = new Date(tool.nextInspectionDue);
        if (dueDate <= threeDaysFromNow) {
          toolsDue.push({
            ...tool,
            technicianId: assignment.technicianId,
            technicianName: assignment.technicianName,
            daysUntilDue: Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          });
        }
      });
    });

    // Sort by days until due (overdue first)
    toolsDue.sort((a, b) => a.daysUntilDue - b.daysUntilDue);

    res.json({
      success: true,
      data: toolsDue
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch tools due for inspection",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
