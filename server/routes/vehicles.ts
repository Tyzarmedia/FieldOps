import { RequestHandler } from "express";
import * as fs from "fs";
import * as path from "path";

export interface Vehicle {
  vehicle_id: number;
  plate_number: string;
  make: string;
  model: string;
  year: number;
  status: string;
  mileage: number;
  fuel_efficiency: number;
  assigned_driver: string;
  compliance: {
    license_expiry: string;
    insurance_expiry: string;
    roadworthy_expiry: string;
    registration_expiry: string;
  };
  last_service: string;
  next_service_due: string;
  vin?: string;
  location?: string;
  assignedTo?: string;
  assignedDate?: string;
  notes?: string;
}

// Load vehicles from AVIS database file
let vehicles: Vehicle[] = [];

// Initialize vehicles from AVIS database
function loadVehicles() {
  try {
    const avisDataPath = path.join(process.cwd(), "public", "data", "avis-database.json");
    const avisData = JSON.parse(fs.readFileSync(avisDataPath, "utf8"));
    vehicles = avisData.vehicles.map((vehicle: any) => ({
      ...vehicle,
      assignedTo: vehicle.assigned_driver !== "Not Assigned" ? vehicle.assigned_driver : undefined,
      location: "Fleet Depot", // Default location
    }));
    console.log(`Loaded ${vehicles.length} vehicles from AVIS database`);
  } catch (error) {
    console.error("Failed to load AVIS database:", error);
    // Fallback to empty array
    vehicles = [];
  }
}

// Load vehicles on startup
loadVehicles();

// Get all vehicles
export const getAllVehicles: RequestHandler = (req, res) => {
  try {
    const { status, assignedTo, location } = req.query;

    let filteredVehicles = vehicles;

    if (status) {
      filteredVehicles = filteredVehicles.filter((v) =>
        v.status.toLowerCase() === (status as string).toLowerCase()
      );
    }

    if (assignedTo) {
      filteredVehicles = filteredVehicles.filter((v) =>
        v.assigned_driver
          ?.toLowerCase()
          .includes((assignedTo as string).toLowerCase()),
      );
    }

    if (location) {
      filteredVehicles = filteredVehicles.filter((v) =>
        v.location?.toLowerCase().includes((location as string).toLowerCase()),
      );
    }

    res.json({
      success: true,
      data: filteredVehicles,
      total: filteredVehicles.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch vehicles",
    });
  }
};

// Get vehicle by ID
export const getVehicleById: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    // Handle both string IDs like "FL-001" and numeric IDs
    const vehicleId = id.startsWith("FL-") ? parseInt(id.split("-")[1]) : parseInt(id);
    const vehicle = vehicles.find((v) => v.vehicle_id === vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch vehicle",
    });
  }
};

// Add new vehicle
export const addVehicle: RequestHandler = (req, res) => {
  try {
    const vehicleData = req.body;

    // Generate new ID
    const maxId = vehicles.reduce((max, vehicle) => {
      return vehicle.vehicle_id > max ? vehicle.vehicle_id : max;
    }, 0);

    const newVehicle: Vehicle = {
      vehicle_id: maxId + 1,
      plate_number: vehicleData.licensePlate || vehicleData.registration,
      make: vehicleData.make,
      model: vehicleData.model,
      year: vehicleData.year,
      status: vehicleData.status || "Active",
      mileage: vehicleData.mileage || 0,
      fuel_efficiency: vehicleData.fuelEfficiency || 0,
      assigned_driver: "Not Assigned",
      compliance: {
        license_expiry: "",
        insurance_expiry: vehicleData.insuranceExpiry || "",
        roadworthy_expiry: "",
        registration_expiry: vehicleData.registrationExpiry || "",
      },
      last_service: "",
      next_service_due: "",
      vin: vehicleData.vin,
      location: vehicleData.location,
      notes: vehicleData.notes,
    };

    vehicles.push(newVehicle);

    res.status(201).json({
      success: true,
      data: newVehicle,
      message: "Vehicle added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to add vehicle",
    });
  }
};

// Update vehicle
export const updateVehicle: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const vehicleIndex = vehicles.findIndex((v) => v.id === id);

    if (vehicleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found",
      });
    }

    vehicles[vehicleIndex] = {
      ...vehicles[vehicleIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: vehicles[vehicleIndex],
      message: "Vehicle updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update vehicle",
    });
  }
};

// Assign vehicle
export const assignVehicle: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo, assignedDate, notes } = req.body;

    const vehicleIndex = vehicles.findIndex((v) => v.id === id);

    if (vehicleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found",
      });
    }

    vehicles[vehicleIndex] = {
      ...vehicles[vehicleIndex],
      status: "assigned",
      assignedTo,
      assignedDate: assignedDate || new Date().toISOString(),
      notes,
      updatedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: vehicles[vehicleIndex],
      message: "Vehicle assigned successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to assign vehicle",
    });
  }
};

// Loan vehicle
export const loanVehicle: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { loanedTo, loanDate, returnDate, notes } = req.body;

    const vehicleIndex = vehicles.findIndex((v) => v.id === id);

    if (vehicleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found",
      });
    }

    vehicles[vehicleIndex] = {
      ...vehicles[vehicleIndex],
      status: "assigned",
      assignedTo: loanedTo,
      assignedDate: loanDate || new Date().toISOString(),
      notes: notes
        ? `Loan until ${returnDate}. ${notes}`
        : `Loan until ${returnDate}`,
      updatedAt: new Date().toISOString(),
    };

    res.json({
      success: true,
      data: vehicles[vehicleIndex],
      message: "Vehicle loaned successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to loan vehicle",
    });
  }
};

// Remove vehicle
export const removeVehicle: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const vehicleIndex = vehicles.findIndex((v) => v.id === id);

    if (vehicleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found",
      });
    }

    const removedVehicle = vehicles.splice(vehicleIndex, 1)[0];

    res.json({
      success: true,
      data: removedVehicle,
      message: "Vehicle removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to remove vehicle",
    });
  }
};

// Update vehicle status
export const updateVehicleStatus: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const vehicleIndex = vehicles.findIndex((v) => v.id === id);

    if (vehicleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Vehicle not found",
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
        updatedAt: new Date().toISOString(),
      };
    } else {
      vehicles[vehicleIndex] = {
        ...vehicles[vehicleIndex],
        status,
        notes,
        updatedAt: new Date().toISOString(),
      };
    }

    res.json({
      success: true,
      data: vehicles[vehicleIndex],
      message: "Vehicle status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update vehicle status",
    });
  }
};
