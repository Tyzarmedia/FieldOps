import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/hooks/useNotification";
import { makeAuthenticatedRequest } from "@/utils/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Repeat,
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
  const { show: showNotification } = useNotification();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [addVehicleDialogOpen, setAddVehicleDialogOpen] = useState(false);
  const [newVehicleData, setNewVehicleData] = useState({
    registration: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    vin: "",
    licensePlate: "",
    location: "",
    mileage: 0,
    fuelEfficiency: 0,
    insuranceExpiry: "",
    registrationExpiry: "",
    notes: "",
  });

  // Load AVIS database
  useEffect(() => {
    const loadAvisData = async () => {
      try {
        const response = await fetch("/data/avis-database.json");
        const data = await response.json();
        setVehicles(data.vehicles);
        setDrivers(data.drivers);
        setFilteredVehicles(data.vehicles);
      } catch (error) {
        console.error("Failed to load AVIS database:", error);
      }
    };

    loadAvisData();
  }, []);

  // Filter vehicles based on search and status
  useEffect(() => {
    let filtered = vehicles;

    if (searchTerm) {
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.plate_number
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          vehicle.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vehicle.assigned_driver
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((vehicle) => vehicle.status === statusFilter);
    }

    setFilteredVehicles(filtered);
  }, [vehicles, searchTerm, statusFilter]);

  const handleAssignDriver = async () => {
    if (!selectedVehicle || !selectedDriver) {
      showNotification.error(
        "Assignment Failed",
        "Please select both a vehicle and driver",
      );
      return;
    }

    try {
      const selectedDriverObj = drivers.find(
        (d) => d.driver_id.toString() === selectedDriver,
      );
      if (!selectedDriverObj) {
        showNotification.error(
          "Driver Not Found",
          "Selected driver could not be found",
        );
        return;
      }

      const driverName = selectedDriverObj.name;

      // Update on server first - convert vehicle_id to server format
      const serverVehicleId = `FL-${String(selectedVehicle.vehicle_id).padStart(3, "0")}`;
      console.log("Assigning vehicle:", { serverVehicleId, selectedVehicle, driverName });

      const response = await makeAuthenticatedRequest(`/api/vehicles/${serverVehicleId}/assign`, {
        method: "POST",
        body: JSON.stringify({
          assignedTo: driverName,
          assignedDate: new Date().toISOString(),
          notes: `Assigned via Fleet Management Dashboard`,
        }),
      });

      console.log("Server response:", response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server error:", errorData);
        throw new Error(`Server assignment failed: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Assignment failed");
      }

      // Update local state only after successful server update
      const updatedVehicles = vehicles.map((vehicle) =>
        vehicle.vehicle_id === selectedVehicle.vehicle_id
          ? { ...vehicle, assigned_driver: driverName }
          : vehicle,
      );

      setVehicles(updatedVehicles);

      // Clear dialog state immediately
      setAssignDialogOpen(false);
      setSelectedDriver("");
      setSelectedVehicle(null);

      // Show success notification
      showNotification.success(
        "Driver Assigned",
        `${driverName} has been assigned to ${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.plate_number})`,
      );
    } catch (error) {
      console.error("Error assigning driver:", error);
      showNotification.error(
        "Assignment Failed",
        error instanceof Error ? error.message : "Failed to assign driver"
      );
    }
  };

  const handleSetService = async (status: string) => {
    if (!selectedVehicle) {
      showNotification.error("Service Update Failed", "No vehicle selected");
      return;
    }

    try {
      // Handle loan vehicle differently
      if (status === "Loan Vehicle") {
        const serverVehicleId = `FL-${String(selectedVehicle.vehicle_id).padStart(3, "0")}`;
        const response = await makeAuthenticatedRequest(`/api/vehicles/${serverVehicleId}/loan`, {
          method: "POST",
          body: JSON.stringify({
            loanedTo: "Fleet Pool",
            loanDate: new Date().toISOString(),
            returnDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            notes: "Loaned via Fleet Management Dashboard",
          }),
        });

        if (!response.ok) {
          throw new Error("Server loan operation failed");
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Loan operation failed");
        }
      } else {
        // Regular status update
        const serverVehicleId = `FL-${String(selectedVehicle.vehicle_id).padStart(3, "0")}`;
        const response = await makeAuthenticatedRequest(`/api/vehicles/${serverVehicleId}/status`, {
          method: "PATCH",
          body: JSON.stringify({
            status: status,
            notes: `Status updated via Fleet Management Dashboard`,
          }),
        });

        if (!response.ok) {
          throw new Error("Server status update failed");
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Status update failed");
        }
      }

      // Update local state only after successful server update
      const updatedVehicles = vehicles.map((vehicle) =>
        vehicle.vehicle_id === selectedVehicle.vehicle_id
          ? { ...vehicle, status: status }
          : vehicle,
      );

      setVehicles(updatedVehicles);

      // Clear dialog state immediately
      setServiceDialogOpen(false);
      setSelectedVehicle(null);

      // Show success notification
      showNotification.success(
        "Status Updated",
        `${selectedVehicle.make} ${selectedVehicle.model} (${selectedVehicle.plate_number}) status changed to ${status}`,
      );
    } catch (error) {
      console.error("Error updating vehicle status:", error);
      showNotification.error(
        "Update Failed",
        error instanceof Error ? error.message : "Failed to update vehicle status",
      );
    }
  };

  const handleAddVehicle = async () => {
    try {
      if (!newVehicleData.registration || !newVehicleData.make || !newVehicleData.model) {
        showNotification.error("Validation Error", "Please fill in all required fields");
        return;
      }

      const response = await makeAuthenticatedRequest("/api/vehicles", {
        method: "POST",
        body: JSON.stringify(newVehicleData),
      });

      if (!response.ok) {
        throw new Error("Server error while adding vehicle");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to add vehicle");
      }

      // Add to local state
      const newVehicle = {
        vehicle_id: Math.max(...vehicles.map(v => v.vehicle_id), 0) + 1,
        plate_number: newVehicleData.licensePlate || newVehicleData.registration,
        make: newVehicleData.make,
        model: newVehicleData.model,
        year: newVehicleData.year,
        status: "Active",
        mileage: newVehicleData.mileage,
        fuel_efficiency: newVehicleData.fuelEfficiency,
        assigned_driver: "Not Assigned",
        compliance: {
          license_expiry: "",
          insurance_expiry: newVehicleData.insuranceExpiry || "",
          roadworthy_expiry: "",
          registration_expiry: newVehicleData.registrationExpiry || "",
        },
        last_service: "",
        next_service_due: "",
      };

      setVehicles([...vehicles, newVehicle]);
      setAddVehicleDialogOpen(false);
      setNewVehicleData({
        registration: "",
        make: "",
        model: "",
        year: new Date().getFullYear(),
        vin: "",
        licensePlate: "",
        location: "",
        mileage: 0,
        fuelEfficiency: 0,
        insuranceExpiry: "",
        registrationExpiry: "",
        notes: "",
      });

      showNotification.success(
        "Vehicle Added",
        `${newVehicleData.make} ${newVehicleData.model} has been added to the fleet`,
      );
    } catch (error) {
      console.error("Error adding vehicle:", error);
      showNotification.error(
        "Add Failed",
        error instanceof Error ? error.message : "Failed to add vehicle",
      );
    }
  };

  const handleRemoveVehicle = async (vehicle: Vehicle) => {
    try {
      const confirmed = window.confirm(
        `Are you sure you want to remove ${vehicle.make} ${vehicle.model} (${vehicle.plate_number}) from the fleet?`
      );

      if (!confirmed) return;

      const serverVehicleId = `FL-${String(vehicle.vehicle_id).padStart(3, "0")}`;
      const response = await makeAuthenticatedRequest(`/api/vehicles/${serverVehicleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Server error while removing vehicle");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to remove vehicle");
      }

      // Remove from local state
      setVehicles(vehicles.filter(v => v.vehicle_id !== vehicle.vehicle_id));

      showNotification.success(
        "Vehicle Removed",
        `${vehicle.make} ${vehicle.model} (${vehicle.plate_number}) has been removed from the fleet`,
      );
    } catch (error) {
      console.error("Error removing vehicle:", error);
      showNotification.error(
        "Remove Failed",
        error instanceof Error ? error.message : "Failed to remove vehicle",
      );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "in maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "in service":
        return "bg-blue-100 text-blue-800";
      case "loan vehicle":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "in maintenance":
        return <Wrench className="h-4 w-4" />;
      case "in service":
        return <Wrench className="h-4 w-4" />;
      case "inactive":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const availableDrivers = drivers.filter(
    (driver) => driver.status === "Available",
  );

  // Calculate fleet statistics
  const fleetStats = {
    totalVehicles: vehicles.length,
    activeVehicles: vehicles.filter((v) => v.status === "Active").length,
    inMaintenance: vehicles.filter((v) => v.status === "In Maintenance").length,
    assignedVehicles: vehicles.filter(
      (v) => v.assigned_driver !== "Not Assigned",
    ).length,
    avgFuelEfficiency:
      vehicles.reduce((sum, v) => sum + v.fuel_efficiency, 0) / vehicles.length,
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            AVIS Fleet Management
          </h1>
          <p className="text-muted-foreground">
            Manage vehicle assignments and maintenance status
          </p>
        </div>
        <Button onClick={() => setAddVehicleDialogOpen(true)}>
          <Truck className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {/* Fleet Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Fleet
                </p>
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
                <p className="text-sm font-medium text-muted-foreground">
                  Active
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {fleetStats.activeVehicles}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  In Service
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  {fleetStats.inMaintenance}
                </p>
              </div>
              <Wrench className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Assigned
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {fleetStats.assignedVehicles}
                </p>
              </div>
              <User className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Efficiency
                </p>
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
                      <span
                        className={
                          vehicle.assigned_driver === "Not Assigned"
                            ? "text-muted-foreground italic"
                            : ""
                        }
                      >
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
                        <DropdownMenuItem
                          onClick={() => handleRemoveVehicle(vehicle)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Remove Vehicle
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
                    <SelectItem
                      key={driver.driver_id}
                      value={driver.driver_id.toString()}
                    >
                      {driver.name} ({driver.employee_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setAssignDialogOpen(false)}
              >
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
            <div className="grid grid-cols-3 gap-4">
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
              <Button
                variant="outline"
                onClick={() => handleSetService("Loan Vehicle")}
                className="h-20 flex-col"
              >
                <Repeat className="h-6 w-6 mb-2 text-blue-600" />
                Loan Vehicle
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

      {/* Add Vehicle Dialog */}
      <Dialog open={addVehicleDialogOpen} onOpenChange={setAddVehicleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Vehicle</DialogTitle>
            <DialogDescription>
              Add a new vehicle to the fleet management system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="registration">Registration *</Label>
                <Input
                  id="registration"
                  value={newVehicleData.registration}
                  onChange={(e) =>
                    setNewVehicleData({
                      ...newVehicleData,
                      registration: e.target.value,
                    })
                  }
                  placeholder="EL-123-ABC"
                />
              </div>
              <div>
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input
                  id="licensePlate"
                  value={newVehicleData.licensePlate}
                  onChange={(e) =>
                    setNewVehicleData({
                      ...newVehicleData,
                      licensePlate: e.target.value,
                    })
                  }
                  placeholder="EL-123-ABC"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="make">Make *</Label>
                <Input
                  id="make"
                  value={newVehicleData.make}
                  onChange={(e) =>
                    setNewVehicleData({
                      ...newVehicleData,
                      make: e.target.value,
                    })
                  }
                  placeholder="Ford"
                />
              </div>
              <div>
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  value={newVehicleData.model}
                  onChange={(e) =>
                    setNewVehicleData({
                      ...newVehicleData,
                      model: e.target.value,
                    })
                  }
                  placeholder="Transit"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={newVehicleData.year}
                  onChange={(e) =>
                    setNewVehicleData({
                      ...newVehicleData,
                      year: parseInt(e.target.value) || new Date().getFullYear(),
                    })
                  }
                  min="1990"
                  max={new Date().getFullYear() + 1}
                />
              </div>
              <div>
                <Label htmlFor="vin">VIN</Label>
                <Input
                  id="vin"
                  value={newVehicleData.vin}
                  onChange={(e) =>
                    setNewVehicleData({
                      ...newVehicleData,
                      vin: e.target.value,
                    })
                  }
                  placeholder="1FTBR1C89PKA12345"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newVehicleData.location}
                  onChange={(e) =>
                    setNewVehicleData({
                      ...newVehicleData,
                      location: e.target.value,
                    })
                  }
                  placeholder="Johannesburg Depot"
                />
              </div>
              <div>
                <Label htmlFor="mileage">Mileage (km)</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={newVehicleData.mileage}
                  onChange={(e) =>
                    setNewVehicleData({
                      ...newVehicleData,
                      mileage: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fuelEfficiency">Fuel Efficiency (L/100km)</Label>
                <Input
                  id="fuelEfficiency"
                  type="number"
                  step="0.1"
                  value={newVehicleData.fuelEfficiency}
                  onChange={(e) =>
                    setNewVehicleData({
                      ...newVehicleData,
                      fuelEfficiency: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                />
              </div>
              <div>
                <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
                <Input
                  id="insuranceExpiry"
                  type="date"
                  value={newVehicleData.insuranceExpiry}
                  onChange={(e) =>
                    setNewVehicleData({
                      ...newVehicleData,
                      insuranceExpiry: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="registrationExpiry">Registration Expiry</Label>
                <Input
                  id="registrationExpiry"
                  type="date"
                  value={newVehicleData.registrationExpiry}
                  onChange={(e) =>
                    setNewVehicleData({
                      ...newVehicleData,
                      registrationExpiry: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newVehicleData.notes}
                onChange={(e) =>
                  setNewVehicleData({
                    ...newVehicleData,
                    notes: e.target.value,
                  })
                }
                placeholder="Additional notes about the vehicle..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setAddVehicleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAddVehicle}>
              <Truck className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
