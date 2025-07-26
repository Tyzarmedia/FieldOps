// Mock Database Service for Live Testing
// This simulates a local database with persistent storage via localStorage

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  technician: string;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: number;
  actualTime?: number;
  createdAt: string;
  completedAt?: string;
  location: { lat: number; lng: number; address: string };
}

interface Technician {
  id: string;
  name: string;
  email: string;
  skills: string[];
  productivity: number;
  currentLocation: { lat: number; lng: number };
  status: 'available' | 'on_job' | 'clocked_out' | 'absent';
  clockInTime?: string;
  department: string;
}

interface StockItem {
  id: string;
  code: string;
  name: string;
  category: string;
  quantity: number;
  unitPrice: number;
  warehouse: string;
  reorderLevel: number;
  lastUpdated: string;
}

interface StockMovement {
  id: string;
  itemId: string;
  technicianId: string;
  type: 'issue' | 'return' | 'transfer' | 'adjustment';
  quantity: number;
  reason: string;
  timestamp: string;
  jobReference?: string;
}

interface OvertimeClaim {
  id: string;
  technicianId: string;
  hours: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  jobReference?: string;
  dateSubmitted: string;
  approvedBy?: string;
}

interface Department {
  id: string;
  name: string;
  manager: string;
  employees: string[];
  budget: number;
  location: string;
}

export class MockDatabase {
  private readonly STORAGE_KEYS = {
    USERS: 'mockdb_users',
    JOBS: 'mockdb_jobs',
    TECHNICIANS: 'mockdb_technicians',
    STOCK_ITEMS: 'mockdb_stock_items',
    STOCK_MOVEMENTS: 'mockdb_stock_movements',
    OVERTIME_CLAIMS: 'mockdb_overtime_claims',
    DEPARTMENTS: 'mockdb_departments'
  };

  constructor() {
    this.initializeDatabase();
  }

  // Initialize database with sample data if empty
  private initializeDatabase() {
    if (!this.getUsers().length) {
      this.seedDatabase();
    }
  }

  // Seed database with initial data
  private seedDatabase() {
    // Departments
    const departments: Department[] = [
      {
        id: '1',
        name: 'Field Operations',
        manager: 'John Mokoena',
        employees: ['tech1', 'tech2', 'tech3'],
        budget: 150000,
        location: 'Pretoria'
      },
      {
        id: '2',
        name: 'Network Infrastructure',
        manager: 'Sipho Masinga',
        employees: ['tech4', 'tech5'],
        budget: 200000,
        location: 'Johannesburg'
      },
      {
        id: '3',
        name: 'Customer Support',
        manager: 'Naledi Modise',
        employees: ['support1', 'support2'],
        budget: 80000,
        location: 'Cape Town'
      }
    ];

    // Users
    const users: User[] = [
      {
        id: 'ceo1',
        name: 'Dyondzani Masinge',
        email: 'dyondzani@tyzarmedia.com',
        role: 'CEO',
        department: 'Executive',
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: '2024-01-01'
      },
      {
        id: 'admin1',
        name: 'System Administrator',
        email: 'admin@tyzarmedia.com',
        role: 'SystemAdministrator',
        department: 'IT',
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: '2024-01-01'
      },
      {
        id: 'mgr1',
        name: 'John Mokoena',
        email: 'john@tyzarmedia.com',
        role: 'Manager',
        department: 'Field Operations',
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: '2024-01-15'
      },
      {
        id: 'tech1',
        name: 'Sipho Masinga',
        email: 'sipho@tyzarmedia.com',
        role: 'Technician',
        department: 'Field Operations',
        status: 'active',
        lastLogin: new Date().toISOString(),
        createdAt: '2024-02-01'
      }
    ];

    // Technicians
    const technicians: Technician[] = [
      {
        id: 'tech1',
        name: 'Sipho Masinga',
        email: 'sipho@tyzarmedia.com',
        skills: ['Fiber Installation', 'Network Troubleshooting'],
        productivity: 1.2,
        currentLocation: { lat: -25.7461, lng: 28.1881 },
        status: 'on_job',
        clockInTime: '07:45:00',
        department: 'Field Operations'
      },
      {
        id: 'tech2',
        name: 'Thabo Sithole',
        email: 'thabo@tyzarmedia.com',
        skills: ['Network Maintenance', 'Equipment Setup'],
        productivity: 0.9,
        currentLocation: { lat: -25.7545, lng: 28.1912 },
        status: 'available',
        clockInTime: '08:15:00',
        department: 'Field Operations'
      }
    ];

    // Jobs
    const jobs: Job[] = [
      {
        id: 'job1',
        title: 'Fiber Installation - 123 Oak Street',
        description: 'Install fiber optic cable for residential customer',
        technician: 'tech1',
        status: 'in_progress',
        priority: 'high',
        estimatedTime: 180,
        actualTime: 120,
        createdAt: new Date().toISOString(),
        location: { lat: -25.7461, lng: 28.1881, address: '123 Oak Street, Pretoria' }
      },
      {
        id: 'job2',
        title: 'Network Fault Repair',
        description: 'Investigate and repair network connectivity issues',
        technician: 'tech2',
        status: 'open',
        priority: 'critical',
        estimatedTime: 120,
        createdAt: new Date().toISOString(),
        location: { lat: -25.7545, lng: 28.1912, address: 'Business Park, Sandton' }
      }
    ];

    // Stock Items
    const stockItems: StockItem[] = [
      {
        id: 'stock1',
        code: 'FO-001',
        name: 'Fiber Optic Cable 100m',
        category: 'Cables',
        quantity: 50,
        unitPrice: 150,
        warehouse: 'MAIN',
        reorderLevel: 10,
        lastUpdated: new Date().toISOString()
      },
      {
        id: 'stock2',
        code: 'SP-001',
        name: 'Fiber Splitter 1:8',
        category: 'Hardware',
        quantity: 25,
        unitPrice: 75,
        warehouse: 'MAIN',
        reorderLevel: 5,
        lastUpdated: new Date().toISOString()
      }
    ];

    // Save to localStorage
    this.saveData(this.STORAGE_KEYS.DEPARTMENTS, departments);
    this.saveData(this.STORAGE_KEYS.USERS, users);
    this.saveData(this.STORAGE_KEYS.TECHNICIANS, technicians);
    this.saveData(this.STORAGE_KEYS.JOBS, jobs);
    this.saveData(this.STORAGE_KEYS.STOCK_ITEMS, stockItems);
    this.saveData(this.STORAGE_KEYS.STOCK_MOVEMENTS, []);
    this.saveData(this.STORAGE_KEYS.OVERTIME_CLAIMS, []);
  }

  // Generic save/load methods
  private saveData<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  private loadData<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  // User operations
  getUsers(): User[] {
    return this.loadData<User>(this.STORAGE_KEYS.USERS);
  }

  addUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    this.saveData(this.STORAGE_KEYS.USERS, users);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    
    users[index] = { ...users[index], ...updates };
    this.saveData(this.STORAGE_KEYS.USERS, users);
    return users[index];
  }

  deleteUser(id: string): boolean {
    const users = this.getUsers();
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length === users.length) return false;
    
    this.saveData(this.STORAGE_KEYS.USERS, filtered);
    return true;
  }

  // Job operations
  getJobs(): Job[] {
    return this.loadData<Job>(this.STORAGE_KEYS.JOBS);
  }

  addJob(job: Omit<Job, 'id' | 'createdAt'>): Job {
    const jobs = this.getJobs();
    const newJob: Job = {
      ...job,
      id: `job_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    jobs.push(newJob);
    this.saveData(this.STORAGE_KEYS.JOBS, jobs);
    return newJob;
  }

  updateJob(id: string, updates: Partial<Job>): Job | null {
    const jobs = this.getJobs();
    const index = jobs.findIndex(j => j.id === id);
    if (index === -1) return null;
    
    jobs[index] = { ...jobs[index], ...updates };
    this.saveData(this.STORAGE_KEYS.JOBS, jobs);
    return jobs[index];
  }

  // Technician operations
  getTechnicians(): Technician[] {
    return this.loadData<Technician>(this.STORAGE_KEYS.TECHNICIANS);
  }

  updateTechnicianLocation(id: string, location: { lat: number; lng: number }): boolean {
    const technicians = this.getTechnicians();
    const index = technicians.findIndex(t => t.id === id);
    if (index === -1) return false;
    
    technicians[index].currentLocation = location;
    this.saveData(this.STORAGE_KEYS.TECHNICIANS, technicians);
    return true;
  }

  // Stock operations
  getStockItems(): StockItem[] {
    return this.loadData<StockItem>(this.STORAGE_KEYS.STOCK_ITEMS);
  }

  updateStockQuantity(id: string, quantity: number): boolean {
    const items = this.getStockItems();
    const index = items.findIndex(i => i.id === id);
    if (index === -1) return false;
    
    items[index].quantity = quantity;
    items[index].lastUpdated = new Date().toISOString();
    this.saveData(this.STORAGE_KEYS.STOCK_ITEMS, items);
    return true;
  }

  addStockMovement(movement: Omit<StockMovement, 'id' | 'timestamp'>): StockMovement {
    const movements = this.loadData<StockMovement>(this.STORAGE_KEYS.STOCK_MOVEMENTS);
    const newMovement: StockMovement = {
      ...movement,
      id: `movement_${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    movements.push(newMovement);
    this.saveData(this.STORAGE_KEYS.STOCK_MOVEMENTS, movements);
    return newMovement;
  }

  getStockMovements(): StockMovement[] {
    return this.loadData<StockMovement>(this.STORAGE_KEYS.STOCK_MOVEMENTS);
  }

  // Overtime operations
  getOvertimeClaims(): OvertimeClaim[] {
    return this.loadData<OvertimeClaim>(this.STORAGE_KEYS.OVERTIME_CLAIMS);
  }

  addOvertimeClaim(claim: Omit<OvertimeClaim, 'id' | 'dateSubmitted'>): OvertimeClaim {
    const claims = this.getOvertimeClaims();
    const newClaim: OvertimeClaim = {
      ...claim,
      id: `overtime_${Date.now()}`,
      dateSubmitted: new Date().toISOString()
    };
    claims.push(newClaim);
    this.saveData(this.STORAGE_KEYS.OVERTIME_CLAIMS, claims);
    return newClaim;
  }

  updateOvertimeClaim(id: string, updates: Partial<OvertimeClaim>): OvertimeClaim | null {
    const claims = this.getOvertimeClaims();
    const index = claims.findIndex(c => c.id === id);
    if (index === -1) return null;
    
    claims[index] = { ...claims[index], ...updates };
    this.saveData(this.STORAGE_KEYS.OVERTIME_CLAIMS, claims);
    return claims[index];
  }

  // Department operations
  getDepartments(): Department[] {
    return this.loadData<Department>(this.STORAGE_KEYS.DEPARTMENTS);
  }

  addDepartment(department: Omit<Department, 'id'>): Department {
    const departments = this.getDepartments();
    const newDepartment: Department = {
      ...department,
      id: `dept_${Date.now()}`
    };
    departments.push(newDepartment);
    this.saveData(this.STORAGE_KEYS.DEPARTMENTS, departments);
    return newDepartment;
  }

  updateDepartment(id: string, updates: Partial<Department>): Department | null {
    const departments = this.getDepartments();
    const index = departments.findIndex(d => d.id === id);
    if (index === -1) return null;
    
    departments[index] = { ...departments[index], ...updates };
    this.saveData(this.STORAGE_KEYS.DEPARTMENTS, departments);
    return departments[index];
  }

  assignUserToDepartment(userId: string, departmentId: string): boolean {
    const users = this.getUsers();
    const departments = this.getDepartments();
    
    const userIndex = users.findIndex(u => u.id === userId);
    const deptIndex = departments.findIndex(d => d.id === departmentId);
    
    if (userIndex === -1 || deptIndex === -1) return false;
    
    // Remove user from previous department
    departments.forEach(dept => {
      dept.employees = dept.employees.filter(empId => empId !== userId);
    });
    
    // Add user to new department
    departments[deptIndex].employees.push(userId);
    users[userIndex].department = departments[deptIndex].name;
    
    this.saveData(this.STORAGE_KEYS.USERS, users);
    this.saveData(this.STORAGE_KEYS.DEPARTMENTS, departments);
    return true;
  }

  // Analytics and reporting
  getJobStats() {
    const jobs = this.getJobs();
    return {
      total: jobs.length,
      open: jobs.filter(j => j.status === 'open').length,
      inProgress: jobs.filter(j => j.status === 'in_progress').length,
      completed: jobs.filter(j => j.status === 'completed').length,
      avgCompletionTime: jobs
        .filter(j => j.actualTime)
        .reduce((acc, j) => acc + (j.actualTime || 0), 0) / jobs.filter(j => j.actualTime).length || 0
    };
  }

  getTechnicianProductivity() {
    const technicians = this.getTechnicians();
    const jobs = this.getJobs();
    
    return technicians.map(tech => {
      const techJobs = jobs.filter(j => j.technician === tech.id);
      const completedJobs = techJobs.filter(j => j.status === 'completed');
      
      return {
        ...tech,
        totalJobs: techJobs.length,
        completedJobs: completedJobs.length,
        avgCompletionTime: completedJobs.reduce((acc, j) => acc + (j.actualTime || 0), 0) / completedJobs.length || 0
      };
    });
  }

  // Clear all data (for testing)
  clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    this.initializeDatabase();
  }

  // Export/Import functionality
  exportData(): string {
    const data = {
      users: this.getUsers(),
      jobs: this.getJobs(),
      technicians: this.getTechnicians(),
      stockItems: this.getStockItems(),
      stockMovements: this.getStockMovements(),
      overtimeClaims: this.getOvertimeClaims(),
      departments: this.getDepartments(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.users) this.saveData(this.STORAGE_KEYS.USERS, data.users);
      if (data.jobs) this.saveData(this.STORAGE_KEYS.JOBS, data.jobs);
      if (data.technicians) this.saveData(this.STORAGE_KEYS.TECHNICIANS, data.technicians);
      if (data.stockItems) this.saveData(this.STORAGE_KEYS.STOCK_ITEMS, data.stockItems);
      if (data.stockMovements) this.saveData(this.STORAGE_KEYS.STOCK_MOVEMENTS, data.stockMovements);
      if (data.overtimeClaims) this.saveData(this.STORAGE_KEYS.OVERTIME_CLAIMS, data.overtimeClaims);
      if (data.departments) this.saveData(this.STORAGE_KEYS.DEPARTMENTS, data.departments);
      
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }
}

// Singleton instance
export const mockDB = new MockDatabase();

// Export types for use in components
export type {
  User,
  Job,
  Technician,
  StockItem,
  StockMovement,
  OvertimeClaim,
  Department
};
