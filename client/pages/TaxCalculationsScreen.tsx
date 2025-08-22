import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Calculator,
  DollarSign,
  FileText,
  TrendingUp,
  Users,
  ArrowLeft,
  Plus,
  Edit,
  Download,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TaxBracket {
  id: string;
  minIncome: number;
  maxIncome: number;
  rate: number;
  threshold: number;
}

interface EmployeeTaxSummary {
  employeeId: string;
  name: string;
  grossPay: number;
  paye: number;
  uif: number;
  sdl: number;
  totalDeductions: number;
  netPay: number;
  taxableIncome: number;
}

interface TaxSettings {
  uifRate: number;
  uifCap: number;
  sdlRate: number;
  medicalAidCredit: number;
  taxYear: string;
}

export default function TaxCalculationsScreen() {
  const navigate = useNavigate();
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("current");
  const [isCalculating, setIsCalculating] = useState(false);
  const [showBracketDialog, setShowBracketDialog] = useState(false);

  const [taxSettings, setTaxSettings] = useState<TaxSettings>({
    uifRate: 1.0,
    uifCap: 177.12,
    sdlRate: 1.0,
    medicalAidCredit: 347,
    taxYear: "2024",
  });

  const [taxBrackets, setTaxBrackets] = useState<TaxBracket[]>([
    { id: "1", minIncome: 0, maxIncome: 237100, rate: 18, threshold: 0 },
    { id: "2", minIncome: 237101, maxIncome: 370500, rate: 26, threshold: 42678 },
    { id: "3", minIncome: 370501, maxIncome: 512800, rate: 31, threshold: 77362 },
    { id: "4", minIncome: 512801, maxIncome: 673000, rate: 36, threshold: 121475 },
    { id: "5", minIncome: 673001, maxIncome: 857900, rate: 39, threshold: 179147 },
    { id: "6", minIncome: 857901, maxIncome: 1817000, rate: 41, threshold: 251258 },
    { id: "7", minIncome: 1817001, maxIncome: Infinity, rate: 45, threshold: 644489 },
  ]);

  const [employeeTaxData, setEmployeeTaxData] = useState<EmployeeTaxSummary[]>([
    {
      employeeId: "E001",
      name: "Dyondzani Masinge",
      grossPay: 45000,
      paye: 6750,
      uif: 450,
      sdl: 450,
      totalDeductions: 7650,
      netPay: 37350,
      taxableIncome: 45000,
    },
    {
      employeeId: "E002",
      name: "Siyanda Ngubane",
      grossPay: 55000,
      uif: 550,
      sdl: 550,
      paye: 9625,
      totalDeductions: 10725,
      netPay: 44275,
      taxableIncome: 55000,
    },
    {
      employeeId: "E003",
      name: "Priya Naidoo",
      grossPay: 38000,
      paye: 5130,
      uif: 380,
      sdl: 380,
      totalDeductions: 5890,
      netPay: 32110,
      taxableIncome: 38000,
    },
  ]);

  const totalSummary = {
    totalGross: employeeTaxData.reduce((sum, emp) => sum + emp.grossPay, 0),
    totalPAYE: employeeTaxData.reduce((sum, emp) => sum + emp.paye, 0),
    totalUIF: employeeTaxData.reduce((sum, emp) => sum + emp.uif, 0),
    totalSDL: employeeTaxData.reduce((sum, emp) => sum + emp.sdl, 0),
    totalDeductions: employeeTaxData.reduce((sum, emp) => sum + emp.totalDeductions, 0),
    totalNet: employeeTaxData.reduce((sum, emp) => sum + emp.netPay, 0),
  };

  const calculateTax = async () => {
    setIsCalculating(true);
    // Simulate tax calculation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCalculating(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
    }).format(amount);
  };

  const calculatePAYE = (annualIncome: number): number => {
    let tax = 0;
    
    for (const bracket of taxBrackets) {
      if (annualIncome > bracket.minIncome) {
        const taxableInThisBracket = Math.min(
          annualIncome - bracket.minIncome + 1,
          bracket.maxIncome - bracket.minIncome + 1
        );
        tax = bracket.threshold + (taxableInThisBracket * bracket.rate) / 100;
      }
    }
    
    return Math.max(0, tax / 12); // Monthly PAYE
  };

  const exportTaxReport = () => {
    const csvContent = [
      "Employee ID,Employee Name,Gross Pay,PAYE,UIF,SDL,Total Deductions,Net Pay",
      ...employeeTaxData.map(emp => 
        `${emp.employeeId},${emp.name},${emp.grossPay},${emp.paye},${emp.uif},${emp.sdl},${emp.totalDeductions},${emp.netPay}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tax_calculations_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" onClick={() => navigate("/payroll-dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="h-8 w-8 text-red-600" />
          <h1 className="text-3xl font-bold text-gray-800">Tax Calculations</h1>
        </div>
        <p className="text-gray-600">Manage tax calculations, PAYE, UIF, and SDL deductions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total PAYE</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSummary.totalPAYE)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total UIF</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalSummary.totalUIF)}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total SDL</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalSummary.totalSDL)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tax Deductions</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(totalSummary.totalDeductions)}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="calculations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculations">Tax Calculations</TabsTrigger>
          <TabsTrigger value="brackets">Tax Brackets</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="calculations" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filters & Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Pay Period</Label>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current Period (Jan 2024)</SelectItem>
                      <SelectItem value="previous">Previous Period (Dec 2023)</SelectItem>
                      <SelectItem value="ytd">Year to Date</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Employee</Label>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Employees</SelectItem>
                      {employeeTaxData.map(emp => (
                        <SelectItem key={emp.employeeId} value={emp.employeeId}>
                          {emp.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-end">
                  <Button onClick={calculateTax} disabled={isCalculating}>
                    <Calculator className="h-4 w-4 mr-2" />
                    {isCalculating ? "Calculating..." : "Recalculate"}
                  </Button>
                </div>
                
                <div className="flex items-end">
                  <Button variant="outline" onClick={exportTaxReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employee Tax Details */}
          <Card>
            <CardHeader>
              <CardTitle>Employee Tax Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Gross Pay</TableHead>
                    <TableHead>PAYE</TableHead>
                    <TableHead>UIF</TableHead>
                    <TableHead>SDL</TableHead>
                    <TableHead>Total Deductions</TableHead>
                    <TableHead>Net Pay</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeTaxData
                    .filter(emp => selectedEmployee === "all" || emp.employeeId === selectedEmployee)
                    .map((employee) => (
                    <TableRow key={employee.employeeId}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-gray-500">{employee.employeeId}</p>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(employee.grossPay)}</TableCell>
                      <TableCell className="text-red-600">{formatCurrency(employee.paye)}</TableCell>
                      <TableCell className="text-blue-600">{formatCurrency(employee.uif)}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency(employee.sdl)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(employee.totalDeductions)}</TableCell>
                      <TableCell className="font-medium text-green-600">{formatCurrency(employee.netPay)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brackets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Tax Brackets (2024)
                <Dialog open={showBracketDialog} onOpenChange={setShowBracketDialog}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Bracket
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Tax Bracket</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Minimum Income</Label>
                          <Input placeholder="0" />
                        </div>
                        <div>
                          <Label>Maximum Income</Label>
                          <Input placeholder="237100" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Tax Rate (%)</Label>
                          <Input placeholder="18" />
                        </div>
                        <div>
                          <Label>Threshold</Label>
                          <Input placeholder="0" />
                        </div>
                      </div>
                      <Button onClick={() => setShowBracketDialog(false)}>
                        Add Bracket
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Income Range</TableHead>
                    <TableHead>Tax Rate</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {taxBrackets.map((bracket) => (
                    <TableRow key={bracket.id}>
                      <TableCell>
                        {formatCurrency(bracket.minIncome)} - {bracket.maxIncome === Infinity ? "∞" : formatCurrency(bracket.maxIncome)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{bracket.rate}%</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(bracket.threshold)}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>UIF Rate (%)</Label>
                  <Input 
                    type="number" 
                    value={taxSettings.uifRate}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, uifRate: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label>UIF Monthly Cap</Label>
                  <Input 
                    type="number" 
                    value={taxSettings.uifCap}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, uifCap: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label>SDL Rate (%)</Label>
                  <Input 
                    type="number" 
                    value={taxSettings.sdlRate}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, sdlRate: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label>Medical Aid Credit</Label>
                  <Input 
                    type="number" 
                    value={taxSettings.medicalAidCredit}
                    onChange={(e) => setTaxSettings(prev => ({ ...prev, medicalAidCredit: parseFloat(e.target.value) }))}
                  />
                </div>
                <div>
                  <Label>Tax Year</Label>
                  <Select value={taxSettings.taxYear} onValueChange={(value) => setTaxSettings(prev => ({ ...prev, taxYear: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button>Save Settings</Button>
                <Button variant="outline">Reset to Defaults</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
