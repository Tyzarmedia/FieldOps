import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Truck,
  User,
  Wrench,
  MoreVertical,
  Search,
  Filter,
  CheckCircle,
  AlertTriangle,
  Clock,
  Fuel,
  Gauge,
} from "lucide-react";

interface Vehicle {
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
}

interface Driver {
  driver_id: number;
  name: string;
  employee_id: string;
  license_number: string;
  license_expiry: string;
  status: string;
}

export default function FleetVehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("");

  // Load AVIS database
  useEffect(() => {
    const loadAvisData = async () => {
      try {
        const response = await fetch('/data/avis-database.json');
        const data = await response.json();
        setVehicles(data.vehicles);
        setDrivers(data.drivers);
        setFilteredVehicles(data.vehicles);
      } catch (error) {
        console.error('Failed to load AVIS database:', error);
      }
    };

    loadAvisData();
  }, []);

  // Filter vehicles based on search and status
  useEffect(() => {
    let filtered = vehicles;

    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.assigned_driver.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(vehicle => vehicle.status === statusFilter);
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, statusFilter]);

  const handleAssignDriver = () => {
    if (!selectedVehicle || !selectedDriver) return;

    const driverName = drivers.find(d => d.driver_id.toString() === selectedDriver)?.name || "";
    
    const updatedVehicles = vehicles.map(vehicle =>
      vehicle.vehicle_id === selectedVehicle.vehicle_id
        ? { ...vehicle, assigned_driver: driverName }
        : vehicle
    );

    setVehicles(updatedVehicles);
    setAssignDialogOpen(false);
    setSelectedDriver("");
    setSelectedVehicle(null);
  };

  const handleSetService = (status: string) => {
    if (!selectedVehicle) return;

    const updatedVehicles = vehicles.map(vehicle =>
      vehicle.vehicle_id === selectedVehicle.vehicle_id
        ? { ...vehicle, status: status }
        : vehicle
    );

    setVehicles(updatedVehicles);
    setServiceDialogOpen(false);
    setSelectedVehicle(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return "bg-green-100 text-green-800";
      case "in maintenance": return "bg-yellow-100 text-yellow-800";
      case "inactive": return "bg-red-100 text-red-800";
      case "in service": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active": return <CheckCircle className="h-4 w-4" />;
      case "in maintenance": return <Wrench className="h-4 w-4" />;
      case "in service": return <Wrench className="h-4 w-4" />;
      case "inactive": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const availableDrivers = drivers.filter(driver => driver.status === "Available");

  // Calculate fleet statistics
  const fleetStats = {
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter(v => v.status === "Active").length,
    inMaintenance: vehicles.filter(v => v.status === "In Maintenance").length,
    assignedVehicles: vehicles.filter(v => v.assigned_driver !== "Not Assigned").length,
    avgFuelEfficiency: vehicles.reduce((sum, v) => sum + v.fuel_efficiency, 0) / vehicles.length,
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AVIS Fleet Management</h1>
          <p className="text-muted-foreground">
            Manage vehicle assignments and maintenance status
          </p>
        </div>
      </div>

      {/* Fleet Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Fleet</p>
                <p className="text-2xl font-bold">{fleetStats.totalVehicles}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-green-600">{fleetStats.activeVehicles}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Service</p>
                <p className="text-2xl font-bold text-yellow-600">{fleetStats.inMaintenance}</p>
              </div>
              <Wrench className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Assigned</p>
                <p className="text-2xl font-bold text-purple-600">{fleetStats.assignedVehicles}</p>
              </div>
              <User className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Efficiency</p>
                <p className="text-2xl font-bold text-blue-600">
                  {fleetStats.avgFuelEfficiency.toFixed(1)}L
                </p>
              </div>
              <Fuel className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by plate number, make, model, or driver..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="In Maintenance">In Maintenance</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle List */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Fleet ({filteredVehicles.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Driver</TableHead>
                <TableHead>Mileage</TableHead>
                <TableHead>Fuel Efficiency</TableHead>
                <TableHead>Next Service</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.vehicle_id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{vehicle.plate_number}</div>
                      <div className="text-sm text-muted-foreground">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(vehicle.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(vehicle.status)}
                        {vehicle.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className={vehicle.assigned_driver === "Not Assigned" ? "text-muted-foreground italic" : ""}>
                        {vehicle.assigned_driver}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      {vehicle.mileage.toLocaleString()} km
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      {vehicle.fuel_efficiency}L/100km
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(vehicle.next_service_due).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setAssignDialogOpen(true);
                          }}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Assign Vehicle
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedVehicle(vehicle);
                            setServiceDialogOpen(true);
                          }}
                        >
                          <Wrench className="h-4 w-4 mr-2" />
                          Set Service Status
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Assign Vehicle Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Vehicle</DialogTitle>
            <DialogDescription>
              Assign {selectedVehicle?.plate_number} to a driver
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="driver">Select Driver</Label>
              <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassign">Unassign Driver</SelectItem>
                  {availableDrivers.map((driver) => (
                    <SelectItem key={driver.driver_id} value={driver.driver_id.toString()}>
                      {driver.name} ({driver.employee_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignDriver} disabled={!selectedDriver}>
                Assign
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Status Dialog */}
      <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Service Status</DialogTitle>
            <DialogDescription>
              Update service status for {selectedVehicle?.plate_number}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleSetService("Active")}
                className="h-20 flex-col"
              >
                <CheckCircle className="h-6 w-6 mb-2 text-green-600" />
                Set Active
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSetService("In Maintenance")}
                className="h-20 flex-col"
              >
                <Wrench className="h-6 w-6 mb-2 text-yellow-600" />
                In Service
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setServiceDialogOpen(false)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
