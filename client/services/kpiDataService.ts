export interface KPIDataSource {
  id: string;
  name: string;
  category:
    | "performance"
    | "operational"
    | "financial"
    | "quality"
    | "team"
    | "customer";
  description: string;
  unit: string;
  dataType: "number" | "percentage" | "currency" | "time" | "count";
  refreshInterval: number; // seconds
  getValue: () => Promise<{
    value: number | string;
    trend?: string;
    target?: number;
    timestamp: string;
    chartData?: Array<{ name: string; value: number; timestamp?: string }>;
  }>;
}

// Mock real-time data generators
const generateTrendData = (
  baseValue: number,
  points: number = 7,
): Array<{ name: string; value: number }> => {
  const data = [];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (let i = 0; i < points; i++) {
    const variance = (Math.random() - 0.5) * 0.3;
    data.push({
      name: days[i] || `Day ${i + 1}`,
      value: Math.round(baseValue * (1 + variance)),
    });
  }
  return data;
};

const calculateTrend = (current: number, previous: number): string => {
  const change = ((current - previous) / previous) * 100;
  const symbol = change >= 0 ? "↗" : "↘";
  return `${symbol} ${Math.abs(change).toFixed(1)}%`;
};

// Available KPI Data Sources
export const KPI_DATA_SOURCES: KPIDataSource[] = [
  {
    id: "open_tickets",
    name: "Open Tickets",
    category: "operational",
    description: "Number of currently open support tickets",
    unit: "tickets",
    dataType: "count",
    refreshInterval: 30,
    getValue: async () => {
      const current = Math.floor(Math.random() * 15) + 5;
      const previous = Math.floor(Math.random() * 15) + 5;
      return {
        value: current,
        trend: calculateTrend(current, previous),
        target: 10,
        timestamp: new Date().toISOString(),
        chartData: generateTrendData(current),
      };
    },
  },
  {
    id: "completed_jobs",
    name: "Completed Jobs Today",
    category: "performance",
    description: "Jobs completed in the current day",
    unit: "jobs",
    dataType: "count",
    refreshInterval: 60,
    getValue: async () => {
      const current = Math.floor(Math.random() * 25) + 10;
      const previous = Math.floor(Math.random() * 25) + 10;
      return {
        value: current,
        trend: calculateTrend(current, previous),
        target: 20,
        timestamp: new Date().toISOString(),
        chartData: generateTrendData(current),
      };
    },
  },
  {
    id: "team_efficiency",
    name: "Team Efficiency",
    category: "performance",
    description: "Overall team productivity percentage",
    unit: "%",
    dataType: "percentage",
    refreshInterval: 120,
    getValue: async () => {
      const current = Math.floor(Math.random() * 20) + 75;
      const previous = Math.floor(Math.random() * 20) + 75;
      return {
        value: current,
        trend: calculateTrend(current, previous),
        target: 85,
        timestamp: new Date().toISOString(),
        chartData: generateTrendData(current),
      };
    },
  },
  {
    id: "response_time",
    name: "Avg Response Time",
    category: "quality",
    description: "Average response time to incidents",
    unit: "minutes",
    dataType: "time",
    refreshInterval: 60,
    getValue: async () => {
      const current = Math.floor(Math.random() * 60) + 30;
      const previous = Math.floor(Math.random() * 60) + 30;
      return {
        value: `${current}m`,
        trend: calculateTrend(previous, current), // Inverted for time (lower is better)
        target: 45,
        timestamp: new Date().toISOString(),
        chartData: generateTrendData(current),
      };
    },
  },
  {
    id: "customer_satisfaction",
    name: "Customer Satisfaction",
    category: "customer",
    description: "Customer satisfaction rating",
    unit: "/5",
    dataType: "number",
    refreshInterval: 300,
    getValue: async () => {
      const current = Math.random() * 1.5 + 3.5;
      const previous = Math.random() * 1.5 + 3.5;
      return {
        value: current.toFixed(1),
        trend: calculateTrend(current, previous),
        target: 4.5,
        timestamp: new Date().toISOString(),
        chartData: generateTrendData(current, 5),
      };
    },
  },
  {
    id: "revenue_today",
    name: "Revenue Today",
    category: "financial",
    description: "Revenue generated today",
    unit: "R",
    dataType: "currency",
    refreshInterval: 180,
    getValue: async () => {
      const current = Math.floor(Math.random() * 50000) + 25000;
      const previous = Math.floor(Math.random() * 50000) + 25000;
      return {
        value: `R${(current / 1000).toFixed(1)}k`,
        trend: calculateTrend(current, previous),
        target: 40000,
        timestamp: new Date().toISOString(),
        chartData: generateTrendData(current / 1000, 7),
      };
    },
  },
  {
    id: "active_technicians",
    name: "Active Technicians",
    category: "team",
    description: "Number of technicians currently active",
    unit: "people",
    dataType: "count",
    refreshInterval: 60,
    getValue: async () => {
      const current = Math.floor(Math.random() * 5) + 8;
      const previous = Math.floor(Math.random() * 5) + 8;
      return {
        value: current,
        trend: calculateTrend(current, previous),
        target: 12,
        timestamp: new Date().toISOString(),
        chartData: generateTrendData(current),
      };
    },
  },
  {
    id: "sla_compliance",
    name: "SLA Compliance",
    category: "quality",
    description: "Service Level Agreement compliance rate",
    unit: "%",
    dataType: "percentage",
    refreshInterval: 180,
    getValue: async () => {
      const current = Math.floor(Math.random() * 15) + 85;
      const previous = Math.floor(Math.random() * 15) + 85;
      return {
        value: current,
        trend: calculateTrend(current, previous),
        target: 95,
        timestamp: new Date().toISOString(),
        chartData: generateTrendData(current),
      };
    },
  },
  {
    id: "equipment_utilization",
    name: "Equipment Utilization",
    category: "operational",
    description: "Percentage of equipment currently in use",
    unit: "%",
    dataType: "percentage",
    refreshInterval: 120,
    getValue: async () => {
      const current = Math.floor(Math.random() * 25) + 65;
      const previous = Math.floor(Math.random() * 25) + 65;
      return {
        value: current,
        trend: calculateTrend(current, previous),
        target: 80,
        timestamp: new Date().toISOString(),
        chartData: generateTrendData(current),
      };
    },
  },
  {
    id: "pending_approvals",
    name: "Pending Approvals",
    category: "operational",
    description: "Number of items awaiting approval",
    unit: "items",
    dataType: "count",
    refreshInterval: 60,
    getValue: async () => {
      const current = Math.floor(Math.random() * 8) + 2;
      const previous = Math.floor(Math.random() * 8) + 2;
      return {
        value: current,
        trend: calculateTrend(previous, current), // Inverted (lower is better)
        target: 5,
        timestamp: new Date().toISOString(),
        chartData: generateTrendData(current),
      };
    },
  },
];

// KPI Data Service Class
export class KPIDataService {
  private static instance: KPIDataService;
  private dataCache = new Map<string, any>();
  private refreshIntervals = new Map<string, NodeJS.Timeout>();

  static getInstance(): KPIDataService {
    if (!KPIDataService.instance) {
      KPIDataService.instance = new KPIDataService();
    }
    return KPIDataService.instance;
  }

  async getKPIData(dataSourceId: string): Promise<any> {
    const dataSource = KPI_DATA_SOURCES.find((ds) => ds.id === dataSourceId);
    if (!dataSource) {
      throw new Error(`KPI data source '${dataSourceId}' not found`);
    }

    // Return cached data if available
    if (this.dataCache.has(dataSourceId)) {
      return this.dataCache.get(dataSourceId);
    }

    // Fetch fresh data
    const data = await dataSource.getValue();
    this.dataCache.set(dataSourceId, data);

    // Set up refresh interval
    this.setupRefreshInterval(dataSourceId, dataSource.refreshInterval);

    return data;
  }

  private setupRefreshInterval(dataSourceId: string, intervalSeconds: number) {
    // Clear existing interval
    if (this.refreshIntervals.has(dataSourceId)) {
      clearInterval(this.refreshIntervals.get(dataSourceId)!);
    }

    // Set new interval
    const interval = setInterval(async () => {
      const dataSource = KPI_DATA_SOURCES.find((ds) => ds.id === dataSourceId);
      if (dataSource) {
        try {
          const freshData = await dataSource.getValue();
          this.dataCache.set(dataSourceId, freshData);
          // Emit update event for real-time updates
          window.dispatchEvent(
            new CustomEvent("kpiUpdate", {
              detail: { dataSourceId, data: freshData },
            }),
          );
        } catch (error) {
          console.error(
            `Failed to refresh KPI data for ${dataSourceId}:`,
            error,
          );
        }
      }
    }, intervalSeconds * 1000);

    this.refreshIntervals.set(dataSourceId, interval);
  }

  getAllDataSources(): KPIDataSource[] {
    return KPI_DATA_SOURCES;
  }

  getDataSourcesByCategory(category: string): KPIDataSource[] {
    return KPI_DATA_SOURCES.filter((ds) => ds.category === category);
  }

  cleanup() {
    // Clear all intervals
    this.refreshIntervals.forEach((interval) => clearInterval(interval));
    this.refreshIntervals.clear();
    this.dataCache.clear();
  }
}

export default KPIDataService;
