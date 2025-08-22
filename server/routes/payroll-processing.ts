import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

// Get the database file path
const getDatabasePath = () =>
  path.join(process.cwd(), "public", "data", "database.json");

// Read database
const readDatabase = () => {
  try {
    const data = fs.readFileSync(getDatabasePath(), "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading database:", error);
    return { 
      employees: [], 
      overtimeSessions: [], 
      payrollRates: [],
      payrollPeriods: [],
      payrollCalculations: []
    };
  }
};

// Write database
const writeDatabase = (data: any) => {
  try {
    fs.writeFileSync(getDatabasePath(), JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error("Error writing database:", error);
    return false;
  }
};

// Interface definitions
interface PayrollPeriod {
  id: string;
  startDate: string;
  endDate: string;
  status: "draft" | "processing" | "completed" | "finalized";
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface EmployeePayrollCalculation {
  id: string;
  periodId: string;
  employeeId: string;
  employeeNumber: string;
  fullName: string;
  department: string;
  basicSalary: number;
  allowances: {
    housing: number;
    transport: number;
    bonus: number;
    other: number;
  };
  overtime: {
    hours: number;
    rate: number;
    amount: number;
  };
  deductions: {
    tax: number;
    uif: number;
    medical: number;
    pension: number;
    loans: number;
    other: number;
  };
  grossPay: number;
  totalDeductions: number;
  netPay: number;
  status: "pending" | "processed" | "error" | "approved";
  errors: string[];
  warnings: string[];
  calculatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

// Get all payroll periods
export const getPayrollPeriods: RequestHandler = (req, res) => {
  try {
    const db = readDatabase();
    const periods = db.payrollPeriods || [];
    
    res.json({
      success: true,
      data: periods.sort((a: PayrollPeriod, b: PayrollPeriod) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    });
  } catch (error) {
    console.error("Error getting payroll periods:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get payroll periods",
    });
  }
};

// Create new payroll period
export const createPayrollPeriod: RequestHandler = (req, res) => {
  try {
    const { startDate, endDate, description } = req.body;
    
    if (!startDate || !endDate || !description) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: startDate, endDate, description",
      });
    }

    const db = readDatabase();
    
    // Check for overlapping periods
    const existingPeriods = db.payrollPeriods || [];
    const hasOverlap = existingPeriods.some((period: PayrollPeriod) => {
      return (
        (new Date(startDate) >= new Date(period.startDate) && new Date(startDate) <= new Date(period.endDate)) ||
        (new Date(endDate) >= new Date(period.startDate) && new Date(endDate) <= new Date(period.endDate)) ||
        (new Date(startDate) <= new Date(period.startDate) && new Date(endDate) >= new Date(period.endDate))
      );
    });

    if (hasOverlap) {
      return res.status(400).json({
        success: false,
        error: "Payroll period overlaps with existing period",
      });
    }

    const newPeriod: PayrollPeriod = {
      id: `PAY-${Date.now()}`,
      startDate,
      endDate,
      description,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (!db.payrollPeriods) {
      db.payrollPeriods = [];
    }
    
    db.payrollPeriods.push(newPeriod);
    
    if (writeDatabase(db)) {
      res.json({
        success: true,
        data: newPeriod,
        message: "Payroll period created successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to save payroll period",
      });
    }
  } catch (error) {
    console.error("Error creating payroll period:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Calculate payroll for a specific period
export const calculatePayroll: RequestHandler = async (req, res) => {
  try {
    const { periodId } = req.params;
    const db = readDatabase();
    
    const period = (db.payrollPeriods || []).find((p: PayrollPeriod) => p.id === periodId);
    if (!period) {
      return res.status(404).json({
        success: false,
        error: "Payroll period not found",
      });
    }

    const employees = db.employees || [];
    const calculations: EmployeePayrollCalculation[] = [];

    for (const employee of employees) {
      try {
        // Get overtime hours for the period
        const overtimeHours = await getEmployeeOvertimeForPeriod(employee.id, period.startDate, period.endDate, db);
        
        // Calculate basic components
        const basicSalary = employee.employment?.salary || 0;
        const allowances = {
          housing: basicSalary * 0.1, // 10% housing allowance
          transport: 2000, // Fixed transport allowance
          bonus: 0, // No bonus for this period
          other: 0,
        };
        
        // Get overtime rate
        const overtimeRate = getOvertimeRateForEmployee(employee.id, db);
        const overtimeAmount = overtimeHours * overtimeRate;
        
        const grossPay = basicSalary + Object.values(allowances).reduce((a, b) => a + b, 0) + overtimeAmount;
        
        // Calculate deductions
        const deductions = {
          tax: calculateTax(grossPay),
          uif: Math.min(grossPay * 0.01, 177.12), // UIF 1% max R177.12
          medical: 1200, // Fixed medical aid
          pension: grossPay * 0.075, // 7.5% pension
          loans: 0, // No loans for this period
          other: 0,
        };
        
        const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
        const netPay = grossPay - totalDeductions;
        
        // Check for errors and warnings
        const errors: string[] = [];
        const warnings: string[] = [];
        
        if (!employee.personalInfo?.email) {
          errors.push("Missing email address");
        }
        
        if (overtimeHours > 45) {
          warnings.push(`High overtime hours: ${overtimeHours.toFixed(1)}h`);
        }
        
        if (grossPay > 100000) {
          warnings.push("High gross pay - verify tax calculations");
        }
        
        const calculation: EmployeePayrollCalculation = {
          id: `CALC-${periodId}-${employee.id}`,
          periodId,
          employeeId: employee.id,
          employeeNumber: employee.employeeNumber,
          fullName: employee.personalInfo?.fullName || `${employee.personalInfo?.firstName} ${employee.personalInfo?.lastName}`,
          department: employee.employment?.department || "Unknown",
          basicSalary,
          allowances,
          overtime: {
            hours: overtimeHours,
            rate: overtimeRate,
            amount: overtimeAmount,
          },
          deductions,
          grossPay,
          totalDeductions,
          netPay,
          status: errors.length > 0 ? "error" : "pending",
          errors,
          warnings,
          calculatedAt: new Date().toISOString(),
        };
        
        calculations.push(calculation);
      } catch (error) {
        console.error(`Error calculating payroll for employee ${employee.id}:`, error);
        calculations.push({
          id: `CALC-${periodId}-${employee.id}`,
          periodId,
          employeeId: employee.id,
          employeeNumber: employee.employeeNumber || "Unknown",
          fullName: employee.personalInfo?.fullName || "Unknown",
          department: employee.employment?.department || "Unknown",
          basicSalary: 0,
          allowances: { housing: 0, transport: 0, bonus: 0, other: 0 },
          overtime: { hours: 0, rate: 0, amount: 0 },
          deductions: { tax: 0, uif: 0, medical: 0, pension: 0, loans: 0, other: 0 },
          grossPay: 0,
          totalDeductions: 0,
          netPay: 0,
          status: "error",
          errors: ["Failed to calculate payroll"],
          warnings: [],
          calculatedAt: new Date().toISOString(),
        });
      }
    }

    // Save calculations to database
    if (!db.payrollCalculations) {
      db.payrollCalculations = [];
    }
    
    // Remove existing calculations for this period
    db.payrollCalculations = db.payrollCalculations.filter((calc: EmployeePayrollCalculation) => calc.periodId !== periodId);
    
    // Add new calculations
    db.payrollCalculations.push(...calculations);
    
    // Update period status
    const periodIndex = db.payrollPeriods.findIndex((p: PayrollPeriod) => p.id === periodId);
    if (periodIndex >= 0) {
      db.payrollPeriods[periodIndex].status = "processing";
      db.payrollPeriods[periodIndex].updatedAt = new Date().toISOString();
    }
    
    if (writeDatabase(db)) {
      res.json({
        success: true,
        data: {
          period,
          calculations,
          summary: {
            totalEmployees: calculations.length,
            totalGrossPay: calculations.reduce((sum, calc) => sum + calc.grossPay, 0),
            totalDeductions: calculations.reduce((sum, calc) => sum + calc.totalDeductions, 0),
            totalNetPay: calculations.reduce((sum, calc) => sum + calc.netPay, 0),
            errors: calculations.filter(calc => calc.status === "error").length,
            warnings: calculations.reduce((sum, calc) => sum + calc.warnings.length, 0),
          }
        },
        message: "Payroll calculated successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to save payroll calculations",
      });
    }
  } catch (error) {
    console.error("Error calculating payroll:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while calculating payroll",
    });
  }
};

// Get payroll calculations for a period
export const getPayrollCalculations: RequestHandler = (req, res) => {
  try {
    const { periodId } = req.params;
    const db = readDatabase();
    
    const calculations = (db.payrollCalculations || []).filter((calc: EmployeePayrollCalculation) => calc.periodId === periodId);
    const period = (db.payrollPeriods || []).find((p: PayrollPeriod) => p.id === periodId);
    
    if (!period) {
      return res.status(404).json({
        success: false,
        error: "Payroll period not found",
      });
    }

    const summary = {
      totalEmployees: calculations.length,
      processedEmployees: calculations.filter((calc: EmployeePayrollCalculation) => calc.status === "processed").length,
      totalGrossPay: calculations.reduce((sum: number, calc: EmployeePayrollCalculation) => sum + calc.grossPay, 0),
      totalDeductions: calculations.reduce((sum: number, calc: EmployeePayrollCalculation) => sum + calc.totalDeductions, 0),
      totalNetPay: calculations.reduce((sum: number, calc: EmployeePayrollCalculation) => sum + calc.netPay, 0),
      totalOvertimeHours: calculations.reduce((sum: number, calc: EmployeePayrollCalculation) => sum + calc.overtime.hours, 0),
      totalOvertimePay: calculations.reduce((sum: number, calc: EmployeePayrollCalculation) => sum + calc.overtime.amount, 0),
      errors: calculations.filter((calc: EmployeePayrollCalculation) => calc.status === "error").length,
      warnings: calculations.reduce((sum: number, calc: EmployeePayrollCalculation) => sum + calc.warnings.length, 0),
    };

    res.json({
      success: true,
      data: {
        period,
        calculations,
        summary,
      },
    });
  } catch (error) {
    console.error("Error getting payroll calculations:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get payroll calculations",
    });
  }
};

// Finalize payroll period
export const finalizePayroll: RequestHandler = (req, res) => {
  try {
    const { periodId } = req.params;
    const db = readDatabase();
    
    const periodIndex = db.payrollPeriods.findIndex((p: PayrollPeriod) => p.id === periodId);
    if (periodIndex === -1) {
      return res.status(404).json({
        success: false,
        error: "Payroll period not found",
      });
    }

    // Check if all calculations are processed
    const calculations = (db.payrollCalculations || []).filter((calc: EmployeePayrollCalculation) => calc.periodId === periodId);
    const hasErrors = calculations.some((calc: EmployeePayrollCalculation) => calc.status === "error");
    
    if (hasErrors) {
      return res.status(400).json({
        success: false,
        error: "Cannot finalize payroll with errors. Please resolve all errors first.",
      });
    }

    // Update period status
    db.payrollPeriods[periodIndex].status = "finalized";
    db.payrollPeriods[periodIndex].updatedAt = new Date().toISOString();
    
    // Mark all calculations as approved
    calculations.forEach((calc: EmployeePayrollCalculation) => {
      const calcIndex = db.payrollCalculations.findIndex((c: EmployeePayrollCalculation) => c.id === calc.id);
      if (calcIndex >= 0) {
        db.payrollCalculations[calcIndex].status = "approved";
        db.payrollCalculations[calcIndex].approvedAt = new Date().toISOString();
        db.payrollCalculations[calcIndex].approvedBy = "System"; // Would be current user
      }
    });
    
    if (writeDatabase(db)) {
      res.json({
        success: true,
        data: db.payrollPeriods[periodIndex],
        message: "Payroll finalized successfully",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to finalize payroll",
      });
    }
  } catch (error) {
    console.error("Error finalizing payroll:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error while finalizing payroll",
    });
  }
};

// Helper functions
async function getEmployeeOvertimeForPeriod(employeeId: string, startDate: string, endDate: string, db: any): Promise<number> {
  try {
    const overtimeSessions = db.overtimeSessions || [];
    
    return overtimeSessions
      .filter((session: any) => 
        session.technicianId === employeeId &&
        session.status === "approved" && 
        session.createdAt >= startDate && 
        session.createdAt <= endDate
      )
      .reduce((total: number, session: any) => total + (session.approvedHours || 0), 0);
  } catch (error) {
    console.error("Error getting overtime hours:", error);
    return 0;
  }
}

function getOvertimeRateForEmployee(employeeId: string, db: any): number {
  try {
    const payrollRates = db.payrollRates || [];
    const employeeRate = payrollRates.find((rate: any) => rate.technicianId === employeeId);
    
    if (employeeRate) {
      return employeeRate.overtimeRate;
    }
    
    // Default overtime rate
    return 225; // R225/hour
  } catch (error) {
    console.error("Error getting overtime rate:", error);
    return 225;
  }
}

function calculateTax(grossPay: number): number {
  // Simplified tax calculation - would use proper tax tables in production
  if (grossPay <= 8350) return 0;
  if (grossPay <= 30000) return grossPay * 0.18;
  if (grossPay <= 50000) return grossPay * 0.26;
  if (grossPay <= 80000) return grossPay * 0.31;
  return grossPay * 0.36;
}
