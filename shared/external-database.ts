// External Database Integration Schema
// This connects to Sage 300 (employees), sp.vumatel.co.za (tickets), and Sage X3 (stock)

export interface ExternalEmployee {
  // Sage 300 People Integration
  employeeId: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  role:
    | "Technician"
    | "Assistant Technician"
    | "Coordinator"
    | "Manager"
    | "CEO"
    | "SystemAdmin"
    | "FleetManager"
    | "StockManager"
    | "HSManager"
    | "HR"
    | "Payroll"
    | "IT";
  startDate: string;
  isActive: boolean;
  supervisor: string;
  skills: string[];
  certifications: string[];
  wageRate: number;
  overtimeRate: number;
  lastSync: string;
}

export interface ExternalJob {
  // sp.vumatel.co.za Ticket Integration
  ticketId: string;
  workOrderNumber: string;
  title: string;
  description: string;
  type: "Installation" | "Maintenance" | "Repair" | "Inspection" | "Emergency";
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Open" | "In Progress" | "Pending" | "Resolved" | "Closed";
  client: {
    id: string;
    name: string;
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    contactPerson: string;
    phone: string;
    email: string;
  };
  assignedTechnicians: string[];
  estimatedHours: number;
  actualHours?: number;
  scheduledDate: string;
  completedDate?: string;
  equipmentRequired: string[];
  serviceType: string;
  networkType: string;
  createdDate: string;
  lastUpdated: string;
  externalSystemId: string;
  syncStatus: "pending" | "synced" | "error";
}

export interface ExternalStock {
  // Sage X3 Stock Integration
  itemCode: string;
  description: string;
  category: string;
  unitOfMeasure: string;
  warehouseLocation: string;
  quantityOnHand: number;
  quantityAllocated: number;
  quantityAvailable: number;
  reorderLevel: number;
  maximumLevel: number;
  unitCost: number;
  averageCost: number;
  lastCost: number;
  supplier: {
    id: string;
    name: string;
    contactInfo: string;
  };
  serialNumberTracked: boolean;
  batchTracked: boolean;
  expiryDate?: string;
  lastStockTake: string;
  lastMovement: string;
  itemType: "Raw Material" | "Finished Good" | "Service" | "Tool" | "Equipment";
  isActive: boolean;
  barcode: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  lastSync: string;
}

export interface ExternalStockMovement {
  // Sage X3 Stock Movement Integration
  movementId: string;
  itemCode: string;
  movementType: "Issue" | "Receipt" | "Transfer" | "Adjustment" | "Return";
  quantity: number;
  fromWarehouse?: string;
  toWarehouse?: string;
  reference: string; // Job number, PO number, etc.
  employeeId: string;
  date: string;
  cost: number;
  serialNumbers?: string[];
  batchNumbers?: string[];
  reason: string;
  approvedBy?: string;
  lastSync: string;
}

// API Integration Classes
export class ExternalDatabaseService {
  private static instance: ExternalDatabaseService;
  private sage300BaseUrl: string;
  private vumatelBaseUrl: string;
  private sageX3BaseUrl: string;

  constructor() {
    this.sage300BaseUrl =
      process.env.SAGE_300_API_URL || "https://api.sage300.company.com";
    this.vumatelBaseUrl =
      process.env.VUMATEL_API_URL || "https://sp.vumatel.co.za/api";
    this.sageX3BaseUrl =
      process.env.SAGE_X3_API_URL || "https://api.sagex3.company.com";
  }

  static getInstance(): ExternalDatabaseService {
    if (!ExternalDatabaseService.instance) {
      ExternalDatabaseService.instance = new ExternalDatabaseService();
    }
    return ExternalDatabaseService.instance;
  }

  // Sage 300 Employee Integration
  async getEmployees(): Promise<ExternalEmployee[]> {
    try {
      // Load from local database file instead of external API
      const employees = await this.loadSage300Data();
      return employees.map(emp => this.transformSage300Employee(emp));
    } catch (error) {
      console.error("Error fetching employees from Sage 300:", error);
      // Return fallback employees if file loading fails
      return this.getFallbackEmployees();
    }
  }

  // Load Sage 300 data from JSON file
  private async loadSage300Data(): Promise<any[]> {
    try {
      let filePath: string;
      let data: any;

      if (typeof window === "undefined") {
        // Server-side: read from file system
        const fs = await import("fs");
        const path = await import("path");
        filePath = path.join(process.cwd(), "public/data/sage-300-database.json");
        const fileContent = fs.readFileSync(filePath, "utf-8");
        data = JSON.parse(fileContent);
      } else {
        // Client-side: fetch from public directory
        const response = await fetch("/data/sage-300-database.json");
        if (!response.ok) {
          throw new Error(`Failed to fetch Sage 300 data: ${response.statusText}`);
        }
        data = await response.json();
      }

      return data.employees || [];
    } catch (error) {
      console.error("Error loading Sage 300 data:", error);
      return [];
    }
  }

  // Transform Sage 300 employee data to ExternalEmployee format
  private transformSage300Employee(sage300Employee: any): ExternalEmployee {
    // Map Sage 300 roles to system roles
    const roleMapping: Record<string, any> = {
      "Maintenance Technician": "Technician",
      "Installation Technician": "Technician",
      "HR Officer": "HR",
      "Payroll Officer": "Payroll",
      "Manager": "Manager",
      "System Administrator": "IT",
      "Fleet Manager": "FleetManager"
    };

    return {
      employeeId: sage300Employee.EmployeeID,
      employeeNumber: sage300Employee.PayrollNumber || sage300Employee.EmployeeID,
      firstName: sage300Employee.FullName.split(" ")[0],
      lastName: sage300Employee.FullName.split(" ").slice(1).join(" "),
      email: sage300Employee.Email,
      phone: sage300Employee.Phone,
      department: sage300Employee.Department,
      position: sage300Employee.Role,
      role: roleMapping[sage300Employee.Role] || "Technician",
      startDate: sage300Employee.DateOfHire,
      isActive: sage300Employee.EmploymentStatus === "Active",
      supervisor: sage300Employee.Manager,
      skills: ["Fiber Installation", "Network Testing", "Customer Service"], // Default skills
      certifications: ["Safety Training"], // Default certifications
      wageRate: sage300Employee.Salary / 22 / 8, // Convert monthly salary to hourly rate
      overtimeRate: (sage300Employee.Salary / 22 / 8) * 1.5, // 1.5x overtime
      lastSync: new Date().toISOString(),
    };
  }

  async getEmployee(employeeId: string): Promise<ExternalEmployee | null> {
    try {
      const employees = await this.loadSage300Data();
      const employee = employees.find(emp => emp.EmployeeID === employeeId);

      if (!employee) {
        return null;
      }

      return this.transformSage300Employee(employee);
    } catch (error) {
      console.error("Error fetching employee from Sage 300:", error);
      return null;
    }
  }

  // Fallback employees if database loading fails
  private getFallbackEmployees(): ExternalEmployee[] {
    return [
      {
        employeeId: "EMP001",
        employeeNumber: "P001",
        firstName: "Dyondzani Clement",
        lastName: "Masinge",
        email: "clement@company.com",
        phone: "0810000001",
        department: "Technician",
        position: "Maintenance Technician",
        role: "Technician",
        startDate: "2022-01-10",
        isActive: true,
        supervisor: "Glassman Nkosi",
        skills: ["Fiber Installation", "Network Testing", "Customer Service"],
        certifications: ["Fiber Optic Certified", "Safety Training"],
        wageRate: 106.25, // 8500/22/8 * 2
        overtimeRate: 159.38,
        lastSync: new Date().toISOString(),
      }
    ];
  }

  // sp.vumatel.co.za Ticket Integration
  async getJobs(): Promise<ExternalJob[]> {
    try {
      const tickets = await this.loadSpVumatelData();
      return this.transformVumatelTicketsToJobs(tickets);
    } catch (error) {
      console.error("Error fetching jobs from Vumatel:", error);
      return this.getFallbackJobs();
    }
  }

  // Load SP.Vumatel data from JSON file
  private async loadSpVumatelData(): Promise<any[]> {
    try {
      let data: any;

      if (typeof window === "undefined") {
        // Server-side: read from file system
        const fs = await import("fs");
        const path = await import("path");
        const filePath = path.join(process.cwd(), "public/data/sp-vumatel-database.json");
        const fileContent = fs.readFileSync(filePath, "utf-8");
        data = JSON.parse(fileContent);
      } else {
        // Client-side: fetch from public directory
        const response = await fetch("/data/sp-vumatel-database.json");
        if (!response.ok) {
          throw new Error(`Failed to fetch SP.Vumatel data: ${response.statusText}`);
        }
        data = await response.json();
      }

      return data.tickets || [];
    } catch (error) {
      console.error("Error loading SP.Vumatel data:", error);
      return [];
    }
  }

  async getJob(ticketId: string): Promise<ExternalJob | null> {
    try {
      const response = await fetch(
        `${this.vumatelBaseUrl}/tickets/${ticketId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.VUMATEL_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Vumatel API error: ${response.statusText}`);
      }

      const ticket = await response.json();
      return this.transformVumatelTicketToJob(ticket);
    } catch (error) {
      console.error("Error fetching job from Vumatel:", error);
      throw error;
    }
  }

  async updateJobStatus(
    ticketId: string,
    status: string,
    notes?: string,
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.vumatelBaseUrl}/tickets/${ticketId}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${process.env.VUMATEL_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            notes,
            updatedBy: "Field App",
            timestamp: new Date().toISOString(),
          }),
        },
      );

      return response.ok;
    } catch (error) {
      console.error("Error updating job status in Vumatel:", error);
      return false;
    }
  }

  // Sage X3 Stock Integration
  async getStockItems(): Promise<ExternalStock[]> {
    try {
      const response = await fetch(`${this.sageX3BaseUrl}/stock/items`, {
        headers: {
          Authorization: `Bearer ${process.env.SAGE_X3_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Sage X3 API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error("Error fetching stock from Sage X3:", error);
      throw error;
    }
  }

  async getStockItem(itemCode: string): Promise<ExternalStock | null> {
    try {
      const response = await fetch(
        `${this.sageX3BaseUrl}/stock/items/${itemCode}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.SAGE_X3_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Sage X3 API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching stock item from Sage X3:", error);
      throw error;
    }
  }

  async createStockMovement(
    movement: Omit<ExternalStockMovement, "movementId" | "lastSync">,
  ): Promise<string | null> {
    try {
      const response = await fetch(`${this.sageX3BaseUrl}/stock/movements`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SAGE_X3_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...movement,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Sage X3 API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.movementId;
    } catch (error) {
      console.error("Error creating stock movement in Sage X3:", error);
      return null;
    }
  }

  // Transform Vumatel ticket format to internal job format
  private transformVumatelTicketsToJobs(tickets: any[]): ExternalJob[] {
    return tickets.map((ticket) => this.transformVumatelTicketToJob(ticket));
  }

  private transformVumatelTicketToJob(ticket: any): ExternalJob {
    return {
      ticketId: ticket.id,
      workOrderNumber: ticket.workOrderNumber || ticket.reference,
      title: ticket.title || ticket.subject,
      description: ticket.description || ticket.details,
      type: this.mapVumatelTypeToJobType(ticket.type),
      priority: this.mapVumatelPriorityToJobPriority(ticket.priority),
      status: this.mapVumatelStatusToJobStatus(ticket.status),
      client: {
        id: ticket.client?.id || "",
        name: ticket.client?.name || ticket.customerName,
        address: ticket.client?.address || ticket.siteAddress,
        coordinates: {
          lat: ticket.client?.coordinates?.latitude || 0,
          lng: ticket.client?.coordinates?.longitude || 0,
        },
        contactPerson: ticket.client?.contactPerson || "",
        phone: ticket.client?.phone || "",
        email: ticket.client?.email || "",
      },
      assignedTechnicians: ticket.assignedTechnicians || [],
      estimatedHours: ticket.estimatedHours || 0,
      actualHours: ticket.actualHours,
      scheduledDate: ticket.scheduledDate || ticket.createdDate,
      completedDate: ticket.completedDate,
      equipmentRequired: ticket.equipmentRequired || [],
      serviceType: ticket.serviceType || "",
      networkType: ticket.networkType || "",
      createdDate: ticket.createdDate,
      lastUpdated: ticket.lastUpdated || ticket.modifiedDate,
      externalSystemId: ticket.id,
      syncStatus: "synced",
    };
  }

  private mapVumatelTypeToJobType(type: string): ExternalJob["type"] {
    const typeMap: Record<string, ExternalJob["type"]> = {
      install: "Installation",
      maintenance: "Maintenance",
      repair: "Repair",
      inspection: "Inspection",
      emergency: "Emergency",
    };
    return typeMap[type?.toLowerCase()] || "Maintenance";
  }

  private mapVumatelPriorityToJobPriority(
    priority: string,
  ): ExternalJob["priority"] {
    const priorityMap: Record<string, ExternalJob["priority"]> = {
      "1": "Low",
      "2": "Medium",
      "3": "High",
      "4": "Critical",
      low: "Low",
      medium: "Medium",
      high: "High",
      critical: "Critical",
    };
    return priorityMap[priority?.toLowerCase()] || "Medium";
  }

  private mapVumatelStatusToJobStatus(status: string): ExternalJob["status"] {
    const statusMap: Record<string, ExternalJob["status"]> = {
      open: "Open",
      "in-progress": "In Progress",
      pending: "Pending",
      resolved: "Resolved",
      closed: "Closed",
    };
    return statusMap[status?.toLowerCase()] || "Open";
  }
}

export default ExternalDatabaseService;
