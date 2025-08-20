import { RequestHandler } from "express";

export interface Vehicle {
  id: string;
  registration: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  status: "active" | "maintenance" | "inactive" | "assigned" | "available";
  assignedTo?: string;
  assignedDate?: string;
  location?: string;
  mileage: number;
  lastInspection?: string;
  nextInspection?: string;
  fuelEfficiency?: number;
  licensePlate: string;
  insuranceExpiry?: string;
  registrationExpiry?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  notes?: string;
}

// In-memory storage (in production, this would be a database)
let vehicles: Vehicle[] = [
  {
    id: "FL-001",
    registration: "EL-123-ABC",
    make: "Ford",
    model: "Transit",
    year: 2022,
    vin: "1FTBR1C89PKA12345",
    status: "active",
    assignedTo: "John Smith",
    assignedDate: "2025-01-15",
    location: "Johannesburg Depot",
    mileage: 45230,
    lastInspection: "2025-01-10",
    nextInspection: "2025-02-10",
    fuelEfficiency: 28.5,
    licensePlate: "EL-123-ABC",
    insuranceExpiry: "2025-12-31",
    registrationExpiry: "2025-11-30",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
    createdBy: "fleet-admin"
  },
  {
    id: "FL-002",
    registration: "EL-124-DEF",
    make: "Mercedes",
    model: "Sprinter",
    year: 2023,
    vin: "2FTBR1C89PKA12346",
    status: "available",
    location: "Cape Town Depot",
    mileage: 23100,
    lastInspection: "2025-01-12",
    nextInspection: "2025-02-12",
    fuelEfficiency: 32.1,
    licensePlate: "EL-124-DEF",
    insuranceExpiry: "2025-12-31",
    registrationExpiry: "2025-11-30",
    createdAt: "2024-02-20T08:00:00Z",
    updatedAt: "2025-01-12T14:20:00Z",
    createdBy: "fleet-admin"
  },
  {
    id: "FL-003",
    registration: "EL-125-GHI",
    make: "Iveco",
    model: "Daily",
    year: 2021,
    vin: "3FTBR1C89PKA12347",
    status: "maintenance",
    location: "Pretoria Service Center",
    mileage: 67890,
    lastInspection: "2024-12-20",
    nextInspection: "2025-01-20",
    fuelEfficiency: 26.8,
    licensePlate: "EL-125-GHI",
    insuranceExpiry: "2025-12-31",
    registrationExpiry: "2025-11-30",
    createdAt: "2023-05-10T08:00:00Z",
    updatedAt: "2025-01-08T09:15:00Z",
    createdBy: "fleet-admin"
  }
];

// Get all vehicles
export const getAllVehicles: RequestHandler = (req, res) => {
  try {
    const { status, assignedTo, location } = req.query;
    
    let filteredVehicles = vehicles;
    
    if (status) {
      filteredVehicles = filteredVehicles.filter(v => v.status === status);
    }
    
    if (assignedTo) {
      filteredVehicles = filteredVehicles.filter(v => v.assignedTo?.toLowerCase().includes((assignedTo as string).toLowerCase()));
    }
    
    if (location) {
      filteredVehicles = filteredVehicles.filter(v => v.location?.toLowerCase().includes((location as string).toLowerCase()));
    }
    
    res.json({
      success: true,
      data: filteredVehicles,
      total: filteredVehicles.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch vehicles"
    });
  }
};

// Get vehicle by ID
export const getVehicleById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = vehicles.find(v => v.id === id);
    
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found"
      });
    }
    
    res.json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch vehicle"
    });
  }
};

// Add new vehicle
export const addVehicle: RequestHandler = (req, res) => {
  try {
    const vehicleData = req.body;
    
    // Generate new ID
    const maxId = vehicles.reduce((max, vehicle) => {
      const num = parseInt(vehicle.id.split('-')[1]);
      return num > max ? num : max;
    }, 0);
    
    const newVehicle: Vehicle = {
      id: `FL-${String(maxId + 1).padStart(3, '0')}`,
      registration: vehicleData.registration,
      make: vehicleData.make,
      model: vehicleData.model,
      year: vehicleData.year,
      vin: vehicleData.vin,
      status: vehicleData.status || "available",
      location: vehicleData.location,
      mileage: vehicleData.mileage || 0,
      fuelEfficiency: vehicleData.fuelEfficiency,
      licensePlate: vehicleData.licensePlate,
      insuranceExpiry: vehicleData.insuranceExpiry,
      registrationExpiry: vehicleData.registrationExpiry,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "fleet-manager", // In real app, get from auth
      notes: vehicleData.notes
    };
    
    vehicles.push(newVehicle);
    
    res.status(201).json({
      success: true,
      data: newVehicle,
      message: "Vehicle added successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to add vehicle"
    });
  }
};

// Update vehicle
export const updateVehicle: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const vehicleIndex = vehicles.findIndex(v => v.id === id);
    
    if (vehicleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found"
      });
    }
    
    vehicles[vehicleIndex] = {
      ...vehicles[vehicleIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: vehicles[vehicleIndex],
      message: "Vehicle updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update vehicle"
    });
  }
};

// Assign vehicle
export const assignVehicle: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo, assignedDate, notes } = req.body;
    
    const vehicleIndex = vehicles.findIndex(v => v.id === id);
    
    if (vehicleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found"
      });
    }
    
    vehicles[vehicleIndex] = {
      ...vehicles[vehicleIndex],
      status: "assigned",
      assignedTo,
      assignedDate: assignedDate || new Date().toISOString(),
      notes,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: vehicles[vehicleIndex],
      message: "Vehicle assigned successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to assign vehicle"
    });
  }
};

// Loan vehicle
export const loanVehicle: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { loanedTo, loanDate, returnDate, notes } = req.body;
    
    const vehicleIndex = vehicles.findIndex(v => v.id === id);
    
    if (vehicleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found"
      });
    }
    
    vehicles[vehicleIndex] = {
      ...vehicles[vehicleIndex],
      status: "assigned",
      assignedTo: loanedTo,
      assignedDate: loanDate || new Date().toISOString(),
      notes: notes ? `Loan until ${returnDate}. ${notes}` : `Loan until ${returnDate}`,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: vehicles[vehicleIndex],
      message: "Vehicle loaned successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to loan vehicle"
    });
  }
};

// Remove vehicle
export const removeVehicle: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    
    const vehicleIndex = vehicles.findIndex(v => v.id === id);
    
    if (vehicleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found"
      });
    }
    
    const removedVehicle = vehicles.splice(vehicleIndex, 1)[0];
    
    res.json({
      success: true,
      data: removedVehicle,
      message: "Vehicle removed successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to remove vehicle"
    });
  }
};

// Update vehicle status
export const updateVehicleStatus: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const vehicleIndex = vehicles.findIndex(v => v.id === id);
    
    if (vehicleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found"
      });
    }
    
    // If setting to available, clear assignment
    if (status === "available") {
      vehicles[vehicleIndex] = {
        ...vehicles[vehicleIndex],
        status,
        assignedTo: undefined,
        assignedDate: undefined,
        notes,
        updatedAt: new Date().toISOString()
      };
    } else {
      vehicles[vehicleIndex] = {
        ...vehicles[vehicleIndex],
        status,
        notes,
        updatedAt: new Date().toISOString()
      };
    }
    
    res.json({
      success: true,
      data: vehicles[vehicleIndex],
      message: "Vehicle status updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update vehicle status"
    });
  }
};
