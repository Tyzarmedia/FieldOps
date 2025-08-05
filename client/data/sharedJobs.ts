export interface Job {
  id: string;
  title: string;
  status: 'assigned' | 'accepted' | 'in-progress' | 'completed' | 'paused';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedBy: string;
  assignedTo: string;
  assistant?: string;
  client: {
    name: string;
    contact: string;
    mobile: string;
    address: string;
  };
  appointment: {
    number: string;
    startDate: string;
    endDate: string;
    scheduledDate: string;
    facility: string;
  };
  workType: string;
  serviceTerritory: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  description: string;
  estimatedDuration: number;
  actualDuration?: number;
  createdDate: string;
  acceptedDate?: string;
  startedDate?: string;
  completedDate?: string;
  photos: string[];
  notes: string[];
  materials: Array<{
    item: string;
    quantity: number;
    used: number;
  }>;
}

export const teamJobs: Job[] = [
  {
    id: "SA-688808",
    title: "FTTH - Maintenance",
    status: "assigned",
    priority: "medium",
    assignedBy: "Admin User",
    assignedTo: "Dyondzani Clement Masinge",
    client: {
      name: "Vumatel (Pty) Ltd - Central",
      contact: "-",
      mobile: "-",
      address: "27 Emerson Crescent, Haven Hills, East London"
    },
    appointment: {
      number: "SA-688808",
      startDate: "1/1/00 12:00 AM",
      endDate: "1/1/00 12:00 AM",
      scheduledDate: "Jul 4, 2025 7:45 PM",
      facility: "FTTH - Maintenance"
    },
    workType: "1. Maintenance Job (SF)",
    serviceTerritory: "215 - BrL EC EL",
    location: {
      lat: -33.0153,
      lng: 27.9116,
      address: "The Crescent 31 Georgian Crescent EAST Braynston Gauteng South Africa 2191"
    },
    description: "Routine FTTH maintenance and inspection required",
    estimatedDuration: 4,
    createdDate: "Jul 3, 2025",
    photos: [],
    notes: [],
    materials: [
      { item: "Fiber Optic Cable", quantity: 50, used: 0 },
      { item: "Splice Protectors", quantity: 10, used: 0 },
      { item: "Cable Ties", quantity: 20, used: 0 }
    ]
  },
  {
    id: "SA-689001",
    title: "Emergency Fiber Repair",
    status: "in-progress",
    priority: "urgent",
    assignedBy: "Admin User",
    assignedTo: "Dyondzani Clement Masinge",
    assistant: "Mike Chen",
    client: {
      name: "Business Connect Ltd",
      contact: "John Williams",
      mobile: "+27 82 555 0123",
      address: "45 Industrial Road, Port Elizabeth"
    },
    appointment: {
      number: "SA-689001",
      startDate: "Today 8:00 AM",
      endDate: "Today 12:00 PM",
      scheduledDate: "Today 8:00 AM",
      facility: "Emergency Repair"
    },
    workType: "2. Emergency Repair (ER)",
    serviceTerritory: "220 - PE Central",
    location: {
      lat: -33.9608,
      lng: 25.6022,
      address: "45 Industrial Road, Port Elizabeth, 6001"
    },
    description: "Urgent fiber cut repair affecting 200+ customers",
    estimatedDuration: 4,
    actualDuration: 2.5,
    createdDate: "Today",
    acceptedDate: "Today 7:30 AM",
    startedDate: "Today 8:15 AM",
    photos: ["photo1.jpg", "photo2.jpg"],
    notes: ["Cut found at junction box", "Temporary bypass installed"],
    materials: [
      { item: "Fiber Optic Cable", quantity: 10, used: 8 },
      { item: "Splice Protectors", quantity: 4, used: 4 },
      { item: "Warning Tape", quantity: 1, used: 1 }
    ]
  },
  {
    id: "SA-689102",
    title: "New Installation - Residential",
    status: "accepted",
    priority: "medium",
    assignedBy: "Sarah Johnson",
    assignedTo: "Dyondzani Clement Masinge",
    client: {
      name: "Henderson Family",
      contact: "Mary Henderson",
      mobile: "+27 83 444 5566",
      address: "12 Oak Street, Summerstrand, Port Elizabeth"
    },
    appointment: {
      number: "SA-689102",
      startDate: "Tomorrow 9:00 AM",
      endDate: "Tomorrow 2:00 PM",
      scheduledDate: "Tomorrow 9:00 AM",
      facility: "Residential Installation"
    },
    workType: "3. New Installation (NI)",
    serviceTerritory: "225 - PE Residential",
    location: {
      lat: -33.9681,
      lng: 25.6447,
      address: "12 Oak Street, Summerstrand, Port Elizabeth, 6001"
    },
    description: "Install FTTH connection for new residential customer",
    estimatedDuration: 5,
    createdDate: "Yesterday",
    acceptedDate: "Today 6:00 AM",
    photos: [],
    notes: ["Customer available all day", "House has existing conduit"],
    materials: [
      { item: "ONT Device", quantity: 1, used: 0 },
      { item: "Fiber Optic Cable", quantity: 100, used: 0 },
      { item: "Wall Socket", quantity: 1, used: 0 },
      { item: "Cable Clips", quantity: 20, used: 0 }
    ]
  },
  {
    id: "SA-689203",
    title: "Network Upgrade",
    status: "assigned",
    priority: "high",
    assignedBy: "Admin User",
    assignedTo: "Dyondzani Clement Masinge",
    client: {
      name: "East London Hospital",
      contact: "IT Department",
      mobile: "+27 43 709 2000",
      address: "Frere Road, East London"
    },
    appointment: {
      number: "SA-689203",
      startDate: "Next Week Monday 6:00 AM",
      endDate: "Next Week Monday 4:00 PM",
      scheduledDate: "Next Week Monday 6:00 AM",
      facility: "Hospital Network Upgrade"
    },
    workType: "4. Network Upgrade (NU)",
    serviceTerritory: "215 - EL Central",
    location: {
      lat: -32.9733,
      lng: 27.8746,
      address: "Frere Road, East London, 5201"
    },
    description: "Upgrade hospital network infrastructure for better reliability",
    estimatedDuration: 10,
    createdDate: "2 days ago",
    photos: [],
    notes: ["Critical infrastructure - no downtime allowed", "After hours work required"],
    materials: [
      { item: "Network Switches", quantity: 4, used: 0 },
      { item: "Fiber Patch Cables", quantity: 50, used: 0 },
      { item: "Rack Mounting Kit", quantity: 2, used: 0 }
    ]
  }
];

export const assistants = [
  { id: "1", name: "Mike Chen", available: true },
  { id: "2", name: "Sarah Wilson", available: true },
  { id: "3", name: "Alex Kim", available: false },
  { id: "4", name: "Emma Johnson", available: true }
];

export const getJobsByStatus = (status: string) => {
  return teamJobs.filter(job => job.status === status);
};

export const getJobById = (id: string) => {
  return teamJobs.find(job => job.id === id);
};

export const updateJobStatus = (id: string, status: Job['status']) => {
  const job = teamJobs.find(job => job.id === id);
  if (job) {
    job.status = status;
    if (status === 'accepted' && !job.acceptedDate) {
      job.acceptedDate = new Date().toLocaleString();
    }
    if (status === 'in-progress' && !job.startedDate) {
      job.startedDate = new Date().toLocaleString();
    }
    if (status === 'completed' && !job.completedDate) {
      job.completedDate = new Date().toLocaleString();
    }
  }
};
