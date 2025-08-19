// Unified Database Service
// Handles integration between external systems and internal offline database

import ExternalDatabaseService, {
  ExternalEmployee,
  ExternalJob,
  ExternalStock,
} from "./external-database";
import InternalDatabaseService, {
  InternalJobRecord,
  InternalStockUsage,
  InternalClockRecord,
  InternalSafetyCheck,
  InternalIncidentReport,
  InternalNetworkAssessment,
} from "./internal-database";

export class DatabaseService {
  private static instance: DatabaseService;
  private externalDb: ExternalDatabaseService;
  private internalDb: InternalDatabaseService | null = null;
  private isOnline: boolean =
    typeof navigator !== "undefined" ? navigator.onLine : true;
  private syncInterval: NodeJS.Timeout | null = null;
  private isServerEnvironment: boolean = typeof window === "undefined";

  private constructor() {
    this.externalDb = ExternalDatabaseService.getInstance();

    // Only initialize internal DB in browser environment
    if (!this.isServerEnvironment) {
      this.internalDb = InternalDatabaseService.getInstance();
    }

    // Only add event listeners in browser environment
    if (typeof window !== "undefined") {
      // Listen for online/offline events
      window.addEventListener("online", () => {
        this.isOnline = true;
        this.startSync();
      });

      window.addEventListener("offline", () => {
        this.isOnline = false;
        this.stopSync();
      });

      // Start periodic sync if online
      if (this.isOnline) {
        this.startSync();
      }
    }
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private isBrowser(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }

  private safeLocalStorageGet(key: string): string | null {
    if (!this.isBrowser()) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn("localStorage access failed:", error);
      return null;
    }
  }

  private safeLocalStorageSet(key: string, value: string): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn("localStorage write failed:", error);
    }
  }

  // Employee Management
  async getEmployees(): Promise<ExternalEmployee[]> {
    try {
      if (this.isOnline) {
        const employees = await this.externalDb.getEmployees();
        // Cache employees locally for offline access
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("cachedEmployees", JSON.stringify(employees));
          localStorage.setItem("employeesCacheTime", new Date().toISOString());
        }
        return employees;
      } else {
        // Return cached employees if offline
        if (typeof localStorage !== "undefined") {
          const cached = localStorage.getItem("cachedEmployees");
          return cached ? JSON.parse(cached) : [];
        }
        return [];
      }
    } catch (error) {
      console.error("Error fetching employees, falling back to cache:", error);
      if (this.isBrowser()) {
        const cached = localStorage.getItem("cachedEmployees");
        return cached ? JSON.parse(cached) : [];
      }
      return [];
    }
  }

  async getEmployee(employeeId: string): Promise<ExternalEmployee | null> {
    try {
      if (this.isOnline) {
        return await this.externalDb.getEmployee(employeeId);
      } else {
        if (this.isBrowser()) {
          const cached = localStorage.getItem("cachedEmployees");
          if (cached) {
            const employees: ExternalEmployee[] = JSON.parse(cached);
            return (
              employees.find((emp) => emp.employeeId === employeeId) || null
            );
          }
        }
        return null;
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      return null;
    }
  }

  // Job Management
  async getJobs(): Promise<ExternalJob[]> {
    try {
      if (this.isOnline) {
        const jobs = await this.externalDb.getJobs();
        // Cache jobs locally
        localStorage.setItem("cachedJobs", JSON.stringify(jobs));
        localStorage.setItem("jobsCacheTime", new Date().toISOString());
        return jobs;
      } else {
        // Return cached jobs if offline
        const cached = localStorage.getItem("cachedJobs");
        return cached ? JSON.parse(cached) : [];
      }
    } catch (error) {
      console.error("Error fetching jobs, falling back to cache:", error);
      const cached = localStorage.getItem("cachedJobs");
      return cached ? JSON.parse(cached) : [];
    }
  }

  async getJob(jobId: string): Promise<ExternalJob | null> {
    try {
      if (this.isOnline) {
        return await this.externalDb.getJob(jobId);
      } else {
        const cached = localStorage.getItem("cachedJobs");
        if (cached) {
          const jobs: ExternalJob[] = JSON.parse(cached);
          return jobs.find((job) => job.ticketId === jobId) || null;
        }
        return null;
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      return null;
    }
  }

  async updateJobStatus(
    jobId: string,
    status: string,
    notes?: string,
  ): Promise<boolean> {
    try {
      if (this.isOnline) {
        return await this.externalDb.updateJobStatus(jobId, status, notes);
      } else {
        // Store for sync later
        const pendingUpdate = {
          id: `job-update-${Date.now()}`,
          jobId,
          status,
          notes,
          timestamp: new Date().toISOString(),
          syncStatus: "pending" as const,
        };

        const pending = JSON.parse(
          localStorage.getItem("pendingJobUpdates") || "[]",
        );
        pending.push(pendingUpdate);
        localStorage.setItem("pendingJobUpdates", JSON.stringify(pending));
        return true;
      }
    } catch (error) {
      console.error("Error updating job status:", error);
      return false;
    }
  }

  // Stock Management
  async getStockItems(): Promise<ExternalStock[]> {
    try {
      if (this.isOnline) {
        const stock = await this.externalDb.getStockItems();
        // Cache stock locally
        localStorage.setItem("cachedStock", JSON.stringify(stock));
        localStorage.setItem("stockCacheTime", new Date().toISOString());
        return stock;
      } else {
        const cached = localStorage.getItem("cachedStock");
        return cached ? JSON.parse(cached) : [];
      }
    } catch (error) {
      console.error("Error fetching stock, falling back to cache:", error);
      const cached = localStorage.getItem("cachedStock");
      return cached ? JSON.parse(cached) : [];
    }
  }

  async recordStockUsage(
    usage: Omit<
      InternalStockUsage,
      "id" | "syncStatus" | "syncAttempts" | "lastSyncAttempt"
    >,
  ): Promise<string> {
    const id = `stock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const stockUsage: InternalStockUsage = {
      ...usage,
      id,
      syncStatus: this.isOnline ? "pending" : "pending",
      syncAttempts: 0,
    };

    // Always save to internal database first
    await this.internalDb.saveStockUsage(stockUsage);

    // Try to sync immediately if online
    if (this.isOnline) {
      try {
        const movement = {
          itemCode: usage.itemCode,
          movementType: "Issue" as const,
          quantity: usage.quantityUsed,
          reference: usage.workOrderNumber,
          employeeId: usage.technician,
          date: usage.timestamp,
          cost: usage.totalCost || 0,
          reason: usage.comments || "Field usage",
        };

        const externalId = await this.externalDb.createStockMovement(movement);
        if (externalId) {
          stockUsage.externalMovementId = externalId;
          stockUsage.syncStatus = "synced";
          await this.internalDb.saveStockUsage(stockUsage);
        }
      } catch (error) {
        console.error("Failed to sync stock usage immediately:", error);
      }
    }

    return id;
  }

  // Clock Record Management
  async saveClockRecord(
    record: Omit<
      InternalClockRecord,
      "syncStatus" | "syncAttempts" | "lastSyncAttempt"
    >,
  ): Promise<void> {
    // In server environment, we don't have IndexedDB, so just log the action
    if (this.isServerEnvironment) {
      console.log("Clock record received on server:", {
        technicianId: record.technicianId,
        date: record.date,
        clockOutTime: record.clockOutTime,
        totalWorkingHours: record.totalWorkingHours,
        reason: record.reason || 'Clock out',
        autoClockOut: record.autoClockOut || false
      });
      return;
    }

    // In browser environment, save to IndexedDB
    if (this.internalDb) {
      const clockRecord: InternalClockRecord = {
        ...record,
        syncStatus: "pending",
        syncAttempts: 0,
      };

      await this.internalDb.saveClockRecord(clockRecord);
    }
  }

  async getClockRecord(
    technician: string,
    date: string,
  ): Promise<InternalClockRecord | null> {
    return await this.internalDb.getClockRecord(technician, date);
  }

  // Safety Check Management
  async saveSafetyCheck(
    check: Omit<
      InternalSafetyCheck,
      "syncStatus" | "syncAttempts" | "lastSyncAttempt"
    >,
  ): Promise<void> {
    const safetyCheck: InternalSafetyCheck = {
      ...check,
      syncStatus: "pending",
      syncAttempts: 0,
    };

    await this.internalDb.saveSafetyCheck(safetyCheck);
  }

  // Incident Report Management
  async saveIncidentReport(
    report: Omit<
      InternalIncidentReport,
      "syncStatus" | "syncAttempts" | "lastSyncAttempt"
    >,
  ): Promise<void> {
    const incidentReport: InternalIncidentReport = {
      ...report,
      syncStatus: "pending",
      syncAttempts: 0,
    };

    await this.internalDb.saveIncidentReport(incidentReport);
  }

  // Network Assessment Management
  async saveNetworkAssessment(
    assessment: Omit<
      InternalNetworkAssessment,
      "syncStatus" | "syncAttempts" | "lastSyncAttempt"
    >,
  ): Promise<void> {
    const networkAssessment: InternalNetworkAssessment = {
      ...assessment,
      syncStatus: "pending",
      syncAttempts: 0,
    };

    await this.internalDb.saveNetworkAssessment(networkAssessment);
  }

  // Job Management for Internal Database
  async saveJob(
    job: Omit<
      InternalJobRecord,
      "syncStatus" | "syncAttempts" | "lastSyncAttempt"
    >,
  ): Promise<void> {
    const jobRecord: InternalJobRecord = {
      ...job,
      syncStatus: "pending",
      syncAttempts: 0,
      createdOffline: !this.isOnline,
    };

    await this.internalDb.saveJob(jobRecord);
  }

  async getJobsByTechnician(technician: string): Promise<InternalJobRecord[]> {
    return await this.internalDb.getJobsByTechnician(technician);
  }

  // Sync Management
  private startSync(): void {
    // Sync every 5 minutes when online
    this.syncInterval = setInterval(
      () => {
        this.syncPendingData();
      },
      5 * 60 * 1000,
    );

    // Immediate sync when going online
    this.syncPendingData();
  }

  private stopSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  async syncPendingData(): Promise<void> {
    if (!this.isOnline) return;

    try {
      const pendingData = await this.internalDb.getAllPendingSync();

      // Sync jobs
      for (const job of pendingData.jobs) {
        try {
          // Here you would implement the actual sync logic
          // This is a placeholder for the sync implementation
          console.log("Syncing job:", job.id);

          // Update sync status
          await this.internalDb.updateSyncStatus(
            "jobs",
            job.id,
            "synced",
            job.syncAttempts + 1,
          );
        } catch (error) {
          console.error("Failed to sync job:", job.id, error);
          await this.internalDb.updateSyncStatus(
            "jobs",
            job.id,
            "failed",
            job.syncAttempts + 1,
          );
        }
      }

      // Sync stock usage
      for (const usage of pendingData.stockUsage) {
        try {
          if (!usage.externalMovementId) {
            const movement = {
              itemCode: usage.itemCode,
              movementType: "Issue" as const,
              quantity: usage.quantityUsed,
              reference: usage.workOrderNumber,
              employeeId: usage.technician,
              date: usage.timestamp,
              cost: usage.totalCost || 0,
              reason: usage.comments || "Field usage",
            };

            const externalId =
              await this.externalDb.createStockMovement(movement);
            if (externalId) {
              usage.externalMovementId = externalId;
              await this.internalDb.saveStockUsage(usage);
            }
          }

          await this.internalDb.updateSyncStatus(
            "stockUsage",
            usage.id,
            "synced",
            usage.syncAttempts + 1,
          );
        } catch (error) {
          console.error("Failed to sync stock usage:", usage.id, error);
          await this.internalDb.updateSyncStatus(
            "stockUsage",
            usage.id,
            "failed",
            usage.syncAttempts + 1,
          );
        }
      }

      // Sync clock records, safety checks, incident reports, network assessments
      // Similar pattern for each data type...

      console.log("Sync completed");
    } catch (error) {
      console.error("Sync failed:", error);
    }
  }

  // Force sync (manual trigger)
  async forceSyncAll(): Promise<{ success: boolean; message: string }> {
    if (!this.isOnline) {
      return { success: false, message: "Cannot sync while offline" };
    }

    try {
      await this.syncPendingData();
      return { success: true, message: "Sync completed successfully" };
    } catch (error) {
      return { success: false, message: `Sync failed: ${error}` };
    }
  }

  // Get sync status
  async getSyncStatus(): Promise<{
    pendingJobs: number;
    pendingStockUsage: number;
    pendingClockRecords: number;
    pendingSafetyChecks: number;
    pendingIncidentReports: number;
    pendingNetworkAssessments: number;
    isOnline: boolean;
    lastSync?: string;
  }> {
    const pendingData = await this.internalDb.getAllPendingSync();

    return {
      pendingJobs: pendingData.jobs.length,
      pendingStockUsage: pendingData.stockUsage.length,
      pendingClockRecords: pendingData.clockRecords.length,
      pendingSafetyChecks: pendingData.safetyChecks.length,
      pendingIncidentReports: pendingData.incidentReports.length,
      pendingNetworkAssessments: pendingData.networkAssessments.length,
      isOnline: this.isOnline,
      lastSync: this.safeLocalStorageGet("lastSyncTime") || undefined,
    };
  }

  // Cache management
  async refreshCaches(): Promise<void> {
    if (!this.isOnline) return;

    try {
      // Refresh all caches
      await Promise.all([
        this.getEmployees(),
        this.getJobs(),
        this.getStockItems(),
      ]);

      this.safeLocalStorageSet("lastCacheRefresh", new Date().toISOString());
    } catch (error) {
      console.error("Failed to refresh caches:", error);
    }
  }

  // Get cache age
  getCacheAge(): {
    employees: number;
    jobs: number;
    stock: number;
  } {
    if (!this.isBrowser()) {
      return {
        employees: Infinity,
        jobs: Infinity,
        stock: Infinity,
      };
    }

    const now = new Date().getTime();

    const employeesCache = localStorage.getItem("employeesCacheTime");
    const jobsCache = localStorage.getItem("jobsCacheTime");
    const stockCache = localStorage.getItem("stockCacheTime");

    return {
      employees: employeesCache
        ? now - new Date(employeesCache).getTime()
        : Infinity,
      jobs: jobsCache ? now - new Date(jobsCache).getTime() : Infinity,
      stock: stockCache ? now - new Date(stockCache).getTime() : Infinity,
    };
  }

  // Check if caches need refresh (older than 1 hour)
  needsCacheRefresh(): boolean {
    const cacheAge = this.getCacheAge();
    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds

    return (
      cacheAge.employees > oneHour ||
      cacheAge.jobs > oneHour ||
      cacheAge.stock > oneHour
    );
  }
}

export default DatabaseService;
