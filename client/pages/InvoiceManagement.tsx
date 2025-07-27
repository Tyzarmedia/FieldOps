import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Upload,
  FileText,
  Mail,
  Package,
  AlertCircle,
  CheckCircle,
  Calendar,
  DollarSign,
  Plus,
  Download,
  Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InvoiceItem {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  supplierName: string;
  supplierEmail: string;
  orderDate: string;
  orderNumber: string;
  totalAmount: number;
  status: "pending" | "delivered" | "follow_up_sent";
  items: InvoiceItem[];
  pdfUrl?: string;
  uploadedDate: string;
  followUpSentDate?: string;
  notes: string;
}

const followUpEmailTemplate = (
  supplierName: string,
  orderDate: string,
  orderNumber: string,
) => `
Dear ${supplierName},

I hope this message finds you well.

I am writing to follow up on the attached invoice regarding the stock order placed on ${orderDate} under Order Reference #: ${orderNumber}.

These materials are urgently required for our ongoing field operations. A delay in delivery is beginning to affect job timelines and SLA commitments.

Kindly provide us with the following:
• An updated delivery status or tracking number
• The estimated delivery date
• Any known reasons for the delay, if applicable

Please let us know if you require any additional information from our side to expedite the process.

Thank you for your immediate attention to this matter.

Best regards,
Stock Manager
FieldOps Management System
`;

export default function InvoiceManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showAddInvoice, setShowAddInvoice] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [selectedInvoiceForEmail, setSelectedInvoiceForEmail] =
    useState<Invoice | null>(null);
  const [newInvoice, setNewInvoice] = useState({
    invoiceNumber: "",
    supplierName: "",
    supplierEmail: "",
    orderDate: "",
    orderNumber: "",
    totalAmount: 0,
    notes: "",
  });
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [newItem, setNewItem] = useState({
    itemName: "",
    quantity: 0,
    unitPrice: 0,
    category: "",
  });

  // Mock invoice data
  useEffect(() => {
    const mockInvoices: Invoice[] = [
      {
        id: "inv-001",
        invoiceNumber: "INV-2024-001",
        supplierName: "FiberTech Solutions",
        supplierEmail: "orders@fibertech.com",
        orderDate: "2024-01-15",
        orderNumber: "ORD-2024-015",
        totalAmount: 15420.5,
        status: "pending",
        items: [
          {
            id: "item-001",
            itemName: "Single Mode Fiber Optic Cable 100m",
            quantity: 50,
            unitPrice: 250.5,
            totalPrice: 12525.0,
            category: "Fiber Optic Cables",
          },
          {
            id: "item-002",
            itemName: "Splice Protectors 24-pack",
            quantity: 25,
            unitPrice: 115.82,
            totalPrice: 2895.5,
            category: "Splice Equipment",
          },
        ],
        uploadedDate: new Date().toISOString(),
        notes: "Urgent order for emergency repairs",
      },
      {
        id: "inv-002",
        invoiceNumber: "INV-2024-002",
        supplierName: "Network Equipment Co",
        supplierEmail: "supply@netequip.com",
        orderDate: "2024-01-10",
        orderNumber: "ORD-2024-010",
        totalAmount: 42750.0,
        status: "follow_up_sent",
        items: [
          {
            id: "item-003",
            itemName: "GPON ONT Device V3",
            quantity: 50,
            unitPrice: 855.0,
            totalPrice: 42750.0,
            category: "Network Equipment",
          },
        ],
        uploadedDate: new Date(
          Date.now() - 5 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        followUpSentDate: new Date(
          Date.now() - 2 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        notes: "Critical stock for upcoming installations",
      },
    ];

    setInvoices(mockInvoices);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate PDF reading and invoice data extraction
      toast({
        title: "PDF Processing",
        description: "Reading invoice data from PDF...",
      });

      // Mock extracted data (in real app, this would use PDF parsing)
      setTimeout(() => {
        setNewInvoice({
          invoiceNumber: "INV-2024-" + Math.floor(Math.random() * 1000),
          supplierName: "AutoExtracted Supplier",
          supplierEmail: "supplier@example.com",
          orderDate: new Date().toISOString().split("T")[0],
          orderNumber: "ORD-" + Math.floor(Math.random() * 10000),
          totalAmount: 0,
          notes: "Extracted from PDF upload",
        });

        const extractedItems: InvoiceItem[] = [
          {
            id: "item-" + Date.now(),
            itemName: "Extracted Item 1",
            quantity: 10,
            unitPrice: 150.0,
            totalPrice: 1500.0,
            category: "General",
          },
        ];

        setInvoiceItems(extractedItems);
        setNewInvoice((prev) => ({
          ...prev,
          totalAmount: extractedItems.reduce(
            (sum, item) => sum + item.totalPrice,
            0,
          ),
        }));

        toast({
          title: "PDF Processed",
          description: "Invoice data extracted successfully",
        });
      }, 2000);
    }
  };

  const addItemToInvoice = () => {
    if (!newItem.itemName || newItem.quantity <= 0 || newItem.unitPrice <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill all item fields correctly",
        variant: "destructive",
      });
      return;
    }

    const item: InvoiceItem = {
      id: "item-" + Date.now(),
      itemName: newItem.itemName,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
      totalPrice: newItem.quantity * newItem.unitPrice,
      category: newItem.category || "General",
    };

    setInvoiceItems((prev) => [...prev, item]);
    setNewItem({
      itemName: "",
      quantity: 0,
      unitPrice: 0,
      category: "",
    });

    // Update total amount
    const newTotal = [...invoiceItems, item].reduce(
      (sum, i) => sum + i.totalPrice,
      0,
    );
    setNewInvoice((prev) => ({ ...prev, totalAmount: newTotal }));
  };

  const removeItemFromInvoice = (itemId: string) => {
    setInvoiceItems((prev) => prev.filter((item) => item.id !== itemId));
    const newTotal = invoiceItems
      .filter((item) => item.id !== itemId)
      .reduce((sum, item) => sum + item.totalPrice, 0);
    setNewInvoice((prev) => ({ ...prev, totalAmount: newTotal }));
  };

  const saveInvoice = () => {
    if (
      !newInvoice.invoiceNumber ||
      !newInvoice.supplierName ||
      invoiceItems.length === 0
    ) {
      toast({
        title: "Validation Error",
        description:
          "Please fill all required fields and add at least one item",
        variant: "destructive",
      });
      return;
    }

    const invoice: Invoice = {
      id: "inv-" + Date.now(),
      ...newInvoice,
      items: invoiceItems,
      status: "pending",
      uploadedDate: new Date().toISOString(),
    };

    setInvoices((prev) => [invoice, ...prev]);

    // Reset form
    setNewInvoice({
      invoiceNumber: "",
      supplierName: "",
      supplierEmail: "",
      orderDate: "",
      orderNumber: "",
      totalAmount: 0,
      notes: "",
    });
    setInvoiceItems([]);
    setShowAddInvoice(false);

    toast({
      title: "Invoice Added",
      description: "Invoice has been added to ordered stock",
    });
  };

  const markAsDelivered = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId ? { ...inv, status: "delivered" as const } : inv,
      ),
    );

    const invoice = invoices.find((inv) => inv.id === invoiceId);

    toast({
      title: "Stock Delivered",
      description: `${invoice?.items.length} items moved to inventory`,
    });
  };

  const sendFollowUpEmail = (invoice: Invoice) => {
    setSelectedInvoiceForEmail(invoice);
    setShowEmailPreview(true);
  };

  const confirmSendFollowUp = () => {
    if (!selectedInvoiceForEmail) return;

    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === selectedInvoiceForEmail.id
          ? {
              ...inv,
              status: "follow_up_sent" as const,
              followUpSentDate: new Date().toISOString(),
            }
          : inv,
      ),
    );

    setShowEmailPreview(false);
    setSelectedInvoiceForEmail(null);

    toast({
      title: "Follow-up Sent",
      description: `Follow-up email sent to ${selectedInvoiceForEmail.supplierName}`,
    });
  };

  const getStatusBadge = (status: Invoice["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Pending
          </Badge>
        );
      case "delivered":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Delivered
          </Badge>
        );
      case "follow_up_sent":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            Follow-up Sent
          </Badge>
        );
    }
  };

  const totalPendingValue = invoices
    .filter((inv) => inv.status === "pending")
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Invoice Management</h1>
            <p className="text-sm opacity-90">
              Manage stock invoices and orders
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 rounded-full h-10 w-10"
            onClick={() => navigate("/inventory")}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{invoices.length}</div>
            <div className="text-xs opacity-90">Total Invoices</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              R{totalPendingValue.toFixed(0)}
            </div>
            <div className="text-xs opacity-90">Pending Value</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {invoices.filter((i) => i.status === "delivered").length}
            </div>
            <div className="text-xs opacity-90">Delivered</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Add Invoice Button */}
        <Button
          onClick={() => setShowAddInvoice(true)}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Invoice
        </Button>

        {/* Invoices List */}
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{invoice.invoiceNumber}</h3>
                      {getStatusBadge(invoice.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      {invoice.supplierName}
                    </p>
                    <p className="text-xs text-gray-500">
                      Order: {invoice.orderNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      R{invoice.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(invoice.orderDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="mb-3">
                  <p className="text-sm text-gray-600 mb-2">
                    {invoice.items.length} items:
                  </p>
                  <div className="space-y-1">
                    {invoice.items.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-xs"
                      >
                        <span>{item.itemName}</span>
                        <span>
                          Qty: {item.quantity} × R{item.unitPrice} = R
                          {item.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    ))}
                    {invoice.items.length > 2 && (
                      <p className="text-xs text-gray-500">
                        +{invoice.items.length - 2} more items
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  {invoice.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="flex-1 bg-green-500 hover:bg-green-600"
                        onClick={() => markAsDelivered(invoice.id)}
                      >
                        <Package className="h-4 w-4 mr-2" />
                        Delivered
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() => sendFollowUpEmail(invoice)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Follow Up
                      </Button>
                    </>
                  )}

                  {invoice.status === "follow_up_sent" && (
                    <Button
                      size="sm"
                      className="flex-1 bg-green-500 hover:bg-green-600"
                      onClick={() => markAsDelivered(invoice.id)}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Mark as Delivered
                    </Button>
                  )}

                  {invoice.status === "delivered" && (
                    <div className="flex-1 text-center py-2">
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      <p className="text-xs text-green-600 mt-1">Delivered</p>
                    </div>
                  )}
                </div>

                {invoice.followUpSentDate && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-blue-600">
                      Follow-up sent:{" "}
                      {new Date(invoice.followUpSentDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Invoice Modal */}
      <Dialog open={showAddInvoice} onOpenChange={setShowAddInvoice}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Invoice</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* PDF Upload */}
            <div>
              <Label>Upload Invoice PDF</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to upload PDF invoice
                  </p>
                  <p className="text-xs text-gray-500">
                    System will auto-extract invoice data
                  </p>
                </label>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Invoice Number *</Label>
                <Input
                  value={newInvoice.invoiceNumber}
                  onChange={(e) =>
                    setNewInvoice((prev) => ({
                      ...prev,
                      invoiceNumber: e.target.value,
                    }))
                  }
                  placeholder="Enter invoice number"
                />
              </div>
              <div>
                <Label>Order Number</Label>
                <Input
                  value={newInvoice.orderNumber}
                  onChange={(e) =>
                    setNewInvoice((prev) => ({
                      ...prev,
                      orderNumber: e.target.value,
                    }))
                  }
                  placeholder="Enter order number"
                />
              </div>
              <div>
                <Label>Supplier Name *</Label>
                <Input
                  value={newInvoice.supplierName}
                  onChange={(e) =>
                    setNewInvoice((prev) => ({
                      ...prev,
                      supplierName: e.target.value,
                    }))
                  }
                  placeholder="Enter supplier name"
                />
              </div>
              <div>
                <Label>Supplier Email</Label>
                <Input
                  type="email"
                  value={newInvoice.supplierEmail}
                  onChange={(e) =>
                    setNewInvoice((prev) => ({
                      ...prev,
                      supplierEmail: e.target.value,
                    }))
                  }
                  placeholder="Enter supplier email"
                />
              </div>
              <div>
                <Label>Order Date</Label>
                <Input
                  type="date"
                  value={newInvoice.orderDate}
                  onChange={(e) =>
                    setNewInvoice((prev) => ({
                      ...prev,
                      orderDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label>Total Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={newInvoice.totalAmount}
                  onChange={(e) =>
                    setNewInvoice((prev) => ({
                      ...prev,
                      totalAmount: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="Auto-calculated"
                  readOnly
                />
              </div>
            </div>

            {/* Add Items */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <Label>Invoice Items</Label>
                <Button size="sm" onClick={addItemToInvoice}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {/* New Item Form */}
              <div className="grid grid-cols-5 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <Input
                  placeholder="Item name"
                  value={newItem.itemName}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      itemName: e.target.value,
                    }))
                  }
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      quantity: parseInt(e.target.value) || 0,
                    }))
                  }
                />
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Unit price"
                  value={newItem.unitPrice}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      unitPrice: parseFloat(e.target.value) || 0,
                    }))
                  }
                />
                <Input
                  placeholder="Category"
                  value={newItem.category}
                  onChange={(e) =>
                    setNewItem((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                />
                <div className="text-sm font-medium self-center">
                  R{(newItem.quantity * newItem.unitPrice).toFixed(2)}
                </div>
              </div>

              {/* Items List */}
              {invoiceItems.length > 0 && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.itemName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>R{item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell>R{item.totalPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeItemFromInvoice(item.id)}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Notes */}
            <div>
              <Label>Notes</Label>
              <Textarea
                value={newInvoice.notes}
                onChange={(e) =>
                  setNewInvoice((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Additional notes about this invoice"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddInvoice(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button onClick={saveInvoice} className="flex-1">
                Save Invoice
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Email Preview Modal */}
      <Dialog open={showEmailPreview} onOpenChange={setShowEmailPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Follow-up Email Preview</DialogTitle>
          </DialogHeader>

          {selectedInvoiceForEmail && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>
                  <strong>To:</strong> {selectedInvoiceForEmail.supplierEmail}
                </p>
                <p>
                  <strong>Subject:</strong> Follow-up on Order #
                  {selectedInvoiceForEmail.orderNumber}
                </p>
              </div>

              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm">
                  {followUpEmailTemplate(
                    selectedInvoiceForEmail.supplierName,
                    new Date(
                      selectedInvoiceForEmail.orderDate,
                    ).toLocaleDateString(),
                    selectedInvoiceForEmail.orderNumber,
                  )}
                </pre>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEmailPreview(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button onClick={confirmSendFollowUp} className="flex-1">
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
