import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  Edit,
  Eye,
  Search,
  CheckCircle,
  AlertTriangle,
  Download,
  Upload,
  Shield,
  Users,
  Building,
} from "lucide-react";

interface BankDetails {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  department: string;
  bankName: string;
  branchCode: string;
  branchName: string;
  accountNumber: string;
  accountType: string;
  accountHolderName: string;
  isVerified: boolean;
  verificationDate?: string;
  lastUpdated: string;
  status: "active" | "pending" | "suspended" | "incomplete";
}

export default function BankDetailsScreen() {
  const [bankDetails, setBankDetails] = useState<BankDetails[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<BankDetails | null>(
    null,
  );
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editForm, setEditForm] = useState({
    bankName: "",
    branchCode: "",
    branchName: "",
    accountNumber: "",
    accountType: "",
    accountHolderName: "",
  });

  useEffect(() => {
    loadBankDetails();
  }, []);

  const loadBankDetails = async () => {
    try {
      // Mock data - would come from API
      const mockData: BankDetails[] = [
        {
          id: "BD001",
          employeeId: "E001",
          employeeName: "John Smith",
          employeeNumber: "FO-001",
          department: "Field Operations",
          bankName: "Standard Bank",
          branchCode: "051001",
          branchName: "East London",
          accountNumber: "1234567890",
          accountType: "Current",
          accountHolderName: "John Smith",
          isVerified: true,
          verificationDate: "2025-01-15T10:00:00Z",
          lastUpdated: "2025-01-15T10:00:00Z",
          status: "active",
        },
        {
          id: "BD002",
          employeeId: "E002",
          employeeName: "Mike Johnson",
          employeeNumber: "FO-002",
          department: "Field Operations",
          bankName: "ABSA Bank",
          branchCode: "632005",
          branchName: "Cambridge",
          accountNumber: "9876543210",
          accountType: "Current",
          accountHolderName: "Michael Johnson",
          isVerified: false,
          lastUpdated: "2025-01-20T14:30:00Z",
          status: "pending",
        },
        {
          id: "BD003",
          employeeId: "E003",
          employeeName: "Sarah Wilson",
          employeeNumber: "HR-001",
          department: "HR",
          bankName: "FNB",
          branchCode: "250655",
          branchName: "Vincent Park",
          accountNumber: "5555666677",
          accountType: "Savings",
          accountHolderName: "Sarah Wilson",
          isVerified: true,
          verificationDate: "2025-01-10T09:00:00Z",
          lastUpdated: "2025-01-10T09:00:00Z",
          status: "active",
        },
        {
          id: "BD004",
          employeeId: "E004",
          employeeName: "David Brown",
          employeeNumber: "IT-001",
          department: "IT",
          bankName: "",
          branchCode: "",
          branchName: "",
          accountNumber: "",
          accountType: "",
          accountHolderName: "",
          isVerified: false,
          lastUpdated: "2025-01-01T00:00:00Z",
          status: "incomplete",
        },
      ];

      setBankDetails(mockData);
    } catch (error) {
      console.error("Error loading bank details:", error);
    }
  };

  const filteredDetails = bankDetails.filter((detail) => {
    const matchesSearch =
      searchTerm === "" ||
      detail.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detail.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detail.accountNumber.includes(searchTerm);

    const matchesDepartment =
      filterDepartment === "all" || detail.department === filterDepartment;
    const matchesStatus =
      filterStatus === "all" || detail.status === filterStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleEdit = (detail: BankDetails) => {
    setSelectedEmployee(detail);
    setEditForm({
      bankName: detail.bankName,
      branchCode: detail.branchCode,
      branchName: detail.branchName,
      accountNumber: detail.accountNumber,
      accountType: detail.accountType,
      accountHolderName: detail.accountHolderName,
    });
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedEmployee) return;

    try {
      // Update bank details
      setBankDetails((prev) =>
        prev.map((detail) =>
          detail.id === selectedEmployee.id
            ? {
                ...detail,
                ...editForm,
                lastUpdated: new Date().toISOString(),
                status: "pending" as const,
                isVerified: false,
              }
            : detail,
        ),
      );

      setShowEditDialog(false);
      setSelectedEmployee(null);
      alert("Bank details updated successfully!");
    } catch (error) {
      console.error("Error updating bank details:", error);
      alert("Error updating bank details. Please try again.");
    }
  };

  const handleVerify = async (id: string) => {
    try {
      setBankDetails((prev) =>
        prev.map((detail) =>
          detail.id === id
            ? {
                ...detail,
                isVerified: true,
                verificationDate: new Date().toISOString(),
                status: "active" as const,
              }
            : detail,
        ),
      );

      alert("Bank details verified successfully!");
    } catch (error) {
      console.error("Error verifying bank details:", error);
      alert("Error verifying bank details. Please try again.");
    }
  };

  const validateBankAccount = (accountNumber: string, branchCode: string) => {
    // Mock validation - would integrate with bank API
    if (accountNumber.length < 8 || branchCode.length !== 6) {
      return false;
    }
    return true;
  };

  const exportBankDetails = () => {
    const csvContent = [
      "Employee Name,Employee Number,Bank Name,Branch Code,Account Number,Account Type,Status",
      ...filteredDetails.map((detail) =>
        [
          detail.employeeName,
          detail.employeeNumber,
          detail.bankName,
          detail.branchCode,
          detail.accountNumber,
          detail.accountType,
          detail.status,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bank-details-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "incomplete":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVerificationIcon = (isVerified: boolean) => {
    return isVerified ? (
      <CheckCircle className="w-4 h-4 text-green-600" />
    ) : (
      <AlertTriangle className="w-4 h-4 text-yellow-600" />
    );
  };

  const stats = {
    total: bankDetails.length,
    verified: bankDetails.filter((d) => d.isVerified).length,
    pending: bankDetails.filter((d) => d.status === "pending").length,
    incomplete: bankDetails.filter((d) => d.status === "incomplete").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bank Details Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage employee banking information and verification
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={exportBankDetails} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.verified}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Incomplete</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.incomplete}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees or account numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={filterDepartment}
              onValueChange={setFilterDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Field Operations">
                  Field Operations
                </SelectItem>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredDetails.length} of {bankDetails.length} employees
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Employee Banking Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Bank Details</TableHead>
                <TableHead>Account Info</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDetails.map((detail) => (
                <TableRow key={detail.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{detail.employeeName}</div>
                      <div className="text-sm text-gray-600">
                        {detail.employeeNumber}
                      </div>
                      <div className="text-sm text-gray-600">
                        {detail.department}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {detail.bankName || "Not provided"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {detail.branchCode && detail.branchName
                          ? `${detail.branchCode} - ${detail.branchName}`
                          : "Branch not specified"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-mono text-sm">
                        {detail.accountNumber
                          ? `****${detail.accountNumber.slice(-4)}`
                          : "Not provided"}
                      </div>
                      <div className="text-sm text-gray-600">
                        {detail.accountType}
                      </div>
                      <div className="text-sm text-gray-600">
                        {detail.accountHolderName}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getVerificationIcon(detail.isVerified)}
                      <span className="text-sm">
                        {detail.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                    {detail.verificationDate && (
                      <div className="text-xs text-gray-600">
                        {new Date(detail.verificationDate).toLocaleDateString()}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(detail.status)}>
                      {detail.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {new Date(detail.lastUpdated).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedEmployee(detail)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(detail)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {!detail.isVerified && detail.accountNumber && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerify(detail.id)}
                        >
                          <Shield className="w-4 h-4 text-green-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Edit Bank Details - {selectedEmployee?.employeeName}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Bank Name</Label>
              <Select
                value={editForm.bankName}
                onValueChange={(value) =>
                  setEditForm((prev) => ({ ...prev, bankName: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard Bank">Standard Bank</SelectItem>
                  <SelectItem value="ABSA Bank">ABSA Bank</SelectItem>
                  <SelectItem value="FNB">FNB</SelectItem>
                  <SelectItem value="Nedbank">Nedbank</SelectItem>
                  <SelectItem value="Capitec Bank">Capitec Bank</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Branch Code</Label>
                <Input
                  value={editForm.branchCode}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      branchCode: e.target.value,
                    }))
                  }
                  placeholder="e.g., 051001"
                  maxLength={6}
                />
              </div>
              <div>
                <Label>Branch Name</Label>
                <Input
                  value={editForm.branchName}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      branchName: e.target.value,
                    }))
                  }
                  placeholder="e.g., East London"
                />
              </div>
            </div>

            <div>
              <Label>Account Number</Label>
              <Input
                value={editForm.accountNumber}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    accountNumber: e.target.value,
                  }))
                }
                placeholder="Account number"
              />
            </div>

            <div>
              <Label>Account Type</Label>
              <Select
                value={editForm.accountType}
                onValueChange={(value) =>
                  setEditForm((prev) => ({ ...prev, accountType: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Current">Current Account</SelectItem>
                  <SelectItem value="Savings">Savings Account</SelectItem>
                  <SelectItem value="Transmission">
                    Transmission Account
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Account Holder Name</Label>
              <Input
                value={editForm.accountHolderName}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    accountHolderName: e.target.value,
                  }))
                }
                placeholder="Full name as per bank records"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button onClick={handleSaveEdit} className="flex-1">
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={!!selectedEmployee && !showEditDialog}
        onOpenChange={() => setSelectedEmployee(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Bank Details - {selectedEmployee?.employeeName}
            </DialogTitle>
          </DialogHeader>

          {selectedEmployee && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Employee</Label>
                  <p className="text-sm font-medium">
                    {selectedEmployee.employeeName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedEmployee.employeeNumber}
                  </p>
                </div>
                <div>
                  <Label>Department</Label>
                  <p className="text-sm font-medium">
                    {selectedEmployee.department}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Bank Name</Label>
                  <p className="text-sm font-medium">
                    {selectedEmployee.bankName || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label>Branch</Label>
                  <p className="text-sm font-medium">
                    {selectedEmployee.branchCode && selectedEmployee.branchName
                      ? `${selectedEmployee.branchCode} - ${selectedEmployee.branchName}`
                      : "Not provided"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Account Number</Label>
                  <p className="text-sm font-mono">
                    {selectedEmployee.accountNumber || "Not provided"}
                  </p>
                </div>
                <div>
                  <Label>Account Type</Label>
                  <p className="text-sm font-medium">
                    {selectedEmployee.accountType || "Not provided"}
                  </p>
                </div>
              </div>

              <div>
                <Label>Account Holder Name</Label>
                <p className="text-sm font-medium">
                  {selectedEmployee.accountHolderName || "Not provided"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Verification Status</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getVerificationIcon(selectedEmployee.isVerified)}
                    <span
                      className={`text-sm ${selectedEmployee.isVerified ? "text-green-600" : "text-yellow-600"}`}
                    >
                      {selectedEmployee.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedEmployee.status)}>
                      {selectedEmployee.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Last Updated</Label>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedEmployee.lastUpdated).toLocaleString()}
                  </p>
                </div>
                {selectedEmployee.verificationDate && (
                  <div>
                    <Label>Verification Date</Label>
                    <p className="text-sm text-gray-600">
                      {new Date(
                        selectedEmployee.verificationDate,
                      ).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleEdit(selectedEmployee)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Details
                </Button>
                {!selectedEmployee.isVerified &&
                  selectedEmployee.accountNumber && (
                    <Button
                      onClick={() => {
                        handleVerify(selectedEmployee.id);
                        setSelectedEmployee(null);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Verify
                    </Button>
                  )}
                <Button
                  variant="outline"
                  onClick={() => setSelectedEmployee(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
