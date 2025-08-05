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
      const response = await fetch(`${this.sage300BaseUrl}/employees`, {
        headers: {
          Authorization: `Bearer ${process.env.SAGE_300_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Sage 300 API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.employees || [];
    } catch (error) {
      console.error("Error fetching employees from Sage 300:", error);
      throw error;
    }
  }

  async getEmployee(employeeId: string): Promise<ExternalEmployee | null> {
    try {
      const response = await fetch(
        `${this.sage300BaseUrl}/employees/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.SAGE_300_TOKEN}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`Sage 300 API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching employee from Sage 300:", error);
      throw error;
    }
  }

  // sp.vumatel.co.za Ticket Integration
  async getJobs(): Promise<ExternalJob[]> {
    try {
      const response = await fetch(`${this.vumatelBaseUrl}/tickets`, {
        headers: {
          Authorization: `Bearer ${process.env.VUMATEL_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Vumatel API error: ${response.statusText}`);
      }

      const data = await response.json();
      return this.transformVumatelTicketsToJobs(data.tickets || []);
    } catch (error) {
      console.error("Error fetching jobs from Vumatel:", error);
      throw error;
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
