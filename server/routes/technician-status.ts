import express from "express";

const router = express.Router();

// Technician status tracking
interface TechnicianStatus {
  id: string;
  name: string;
  email: string;
  status: "on-duty" | "off-duty" | "on-leave" | "sick-leave" | "emergency-leave";
  clockInTime?: string;
  clockOutTime?: string;
  currentLocation?: string;
  leaveStartDate?: string;
  leaveEndDate?: string;
  leaveReason?: string;
  lastUpdated: string;
}

// Mock technician status data
let technicianStatuses: TechnicianStatus[] = [
  {
    id: "tech001",
    name: "Dyondzani Clement Masinge",
    email: "dyondzani.masinge@fieldops.com",
    status: "on-duty",
    clockInTime: new Date().toISOString(),
    currentLocation: "East London",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "tech002",
    name: "John Smith",
    email: "john.smith@fieldops.com",
    status: "on-leave",
    leaveStartDate: new Date().toISOString(),
    leaveEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week
    leaveReason: "Annual leave",
    lastUpdated: new Date().toISOString()
  },
  {
    id: "tech003",
    name: "Mike Johnson",
    email: "mike.johnson@fieldops.com",
    status: "off-duty",
    clockOutTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    lastUpdated: new Date().toISOString()
  }
];

// Clock in/out tracking
interface ClockRecord {
  id: string;
  technicianId: string;
  clockIn: string;
  clockOut?: string;
  totalHours?: number;
  location?: string;
  date: string;
}

let clockRecords: ClockRecord[] = [
  {
    id: "clock1",
    technicianId: "tech001",
    clockIn: new Date().toISOString(),
    location: "East London",
    date: new Date().toDateString()
  }
];

// Get all technician statuses
router.get("/status", (req, res) => {
  try {
    res.json({
      success: true,
      data: technicianStatuses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch technician statuses"
    });
  }
});

// Update technician status
router.put("/status/:technicianId", (req, res) => {
  try {
    const { technicianId } = req.params;
    const { status, location, leaveStartDate, leaveEndDate, leaveReason } = req.body;

    const techIndex = technicianStatuses.findIndex(t => t.id === technicianId);
    if (techIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Technician not found"
      });
    }

    technicianStatuses[techIndex].status = status;
    technicianStatuses[techIndex].lastUpdated = new Date().toISOString();

    if (status === "on-duty") {
      technicianStatuses[techIndex].clockInTime = new Date().toISOString();
      technicianStatuses[techIndex].currentLocation = location;
      delete technicianStatuses[techIndex].clockOutTime;
    } else if (status === "off-duty") {
      technicianStatuses[techIndex].clockOutTime = new Date().toISOString();
      delete technicianStatuses[techIndex].clockInTime;
    } else if (status.includes("leave")) {
      technicianStatuses[techIndex].leaveStartDate = leaveStartDate;
      technicianStatuses[techIndex].leaveEndDate = leaveEndDate;
      technicianStatuses[techIndex].leaveReason = leaveReason;
    }

    res.json({
      success: true,
      data: technicianStatuses[techIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update technician status"
    });
  }
});

// Check if technician is available for assignment
router.get("/availability/:technicianId", (req, res) => {
  try {
    const { technicianId } = req.params;
    const technician = technicianStatuses.find(t => t.id === technicianId);
    
    if (!technician) {
      return res.status(404).json({
        success: false,
        error: "Technician not found"
      });
    }

    const isAvailable = technician.status === "on-duty";
    const warning = technician.status !== "on-duty" 
      ? `Technician is currently ${technician.status}. ${technician.leaveReason || ''}` 
      : null;

    res.json({
      success: true,
      data: {
        technicianId,
        name: technician.name,
        isAvailable,
        status: technician.status,
        warning,
        leaveEndDate: technician.leaveEndDate
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to check technician availability"
    });
  }
});

// Get clock records for reporting
router.get("/clock-records/:technicianId", (req, res) => {
  try {
    const { technicianId } = req.params;
    const { startDate, endDate } = req.query;
    
    let records = clockRecords.filter(record => record.technicianId === technicianId);
    
    if (startDate) {
      records = records.filter(record => new Date(record.date) >= new Date(startDate as string));
    }
    
    if (endDate) {
      records = records.filter(record => new Date(record.date) <= new Date(endDate as string));
    }

    const totalHours = records.reduce((total, record) => total + (record.totalHours || 0), 0);
    
    res.json({
      success: true,
      data: {
        records,
        totalHours,
        totalDays: records.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch clock records"
    });
  }
});

// Clock in
router.post("/clock-in", (req, res) => {
  try {
    const { technicianId, location } = req.body;
    
    const newRecord: ClockRecord = {
      id: Date.now().toString(),
      technicianId,
      clockIn: new Date().toISOString(),
      location,
      date: new Date().toDateString()
    };
    
    clockRecords.push(newRecord);
    
    // Update technician status
    const techIndex = technicianStatuses.findIndex(t => t.id === technicianId);
    if (techIndex !== -1) {
      technicianStatuses[techIndex].status = "on-duty";
      technicianStatuses[techIndex].clockInTime = newRecord.clockIn;
      technicianStatuses[techIndex].currentLocation = location;
      technicianStatuses[techIndex].lastUpdated = new Date().toISOString();
    }
    
    res.json({
      success: true,
      data: newRecord
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to clock in"
    });
  }
});

// Clock out
router.post("/clock-out", (req, res) => {
  try {
    const { technicianId } = req.body;
    
    // Find the latest clock record for today
    const today = new Date().toDateString();
    const recordIndex = clockRecords.findIndex(record => 
      record.technicianId === technicianId && 
      record.date === today && 
      !record.clockOut
    );
    
    if (recordIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "No active clock-in record found"
      });
    }
    
    const clockOut = new Date().toISOString();
    const clockIn = new Date(clockRecords[recordIndex].clockIn);
    const totalHours = (new Date(clockOut).getTime() - clockIn.getTime()) / (1000 * 60 * 60);
    
    clockRecords[recordIndex].clockOut = clockOut;
    clockRecords[recordIndex].totalHours = totalHours;
    
    // Update technician status
    const techIndex = technicianStatuses.findIndex(t => t.id === technicianId);
    if (techIndex !== -1) {
      technicianStatuses[techIndex].status = "off-duty";
      technicianStatuses[techIndex].clockOutTime = clockOut;
      technicianStatuses[techIndex].lastUpdated = new Date().toISOString();
      delete technicianStatuses[techIndex].clockInTime;
    }
    
    res.json({
      success: true,
      data: clockRecords[recordIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to clock out"
    });
  }
});

export default router;
