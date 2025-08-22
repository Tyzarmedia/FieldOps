// Service for handling payroll exports and reports
export interface PayslipData {
  employee: {
    fullName: string;
    employeeNumber: string;
    department: string;
    email: string;
  };
  period: {
    startDate: string;
    endDate: string;
    description: string;
  };
  earnings: {
    basicSalary: number;
    allowances: Record<string, number>;
    overtime: {
      hours: number;
      rate: number;
      amount: number;
    };
    grossPay: number;
  };
  deductions: Record<string, number>;
  totalDeductions: number;
  netPay: number;
}

export interface PayrollRegisterEntry {
  employeeNumber: string;
  fullName: string;
  department: string;
  basicSalary: number;
  allowances: number;
  overtimePay: number;
  grossPay: number;
  tax: number;
  uif: number;
  pension: number;
  medical: number;
  otherDeductions: number;
  totalDeductions: number;
  netPay: number;
  bankAccount?: string;
}

export interface ComplianceReport {
  period: {
    startDate: string;
    endDate: string;
  };
  paye: {
    totalTaxDeducted: number;
    employeeCount: number;
    details: Array<{
      employeeNumber: string;
      fullName: string;
      taxableIncome: number;
      taxDeducted: number;
    }>;
  };
  uif: {
    totalContributions: number;
    employeeCount: number;
    details: Array<{
      employeeNumber: string;
      fullName: string;
      contributionIncome: number;
      employeeContribution: number;
      employerContribution: number;
    }>;
  };
  sdl: {
    totalSdl: number;
    payrollTotal: number;
    sdlRate: number;
  };
}

export interface EFTPaymentEntry {
  employeeNumber: string;
  fullName: string;
  bankName: string;
  branchCode: string;
  accountNumber: string;
  accountType: string;
  amount: number;
  reference: string;
}

class PayrollExportService {
  private static instance: PayrollExportService;

  static getInstance(): PayrollExportService {
    if (!PayrollExportService.instance) {
      PayrollExportService.instance = new PayrollExportService();
    }
    return PayrollExportService.instance;
  }

  // Generate individual payslip PDF
  async generatePayslip(payslipData: PayslipData): Promise<Blob> {
    try {
      // Create HTML content for payslip
      const htmlContent = this.generatePayslipHTML(payslipData);
      
      // Convert to PDF (would typically use a library like html2pdf or jsPDF)
      // For now, return as HTML blob for demonstration
      return new Blob([htmlContent], { type: 'text/html' });
    } catch (error) {
      console.error('Error generating payslip:', error);
      throw error;
    }
  }

  // Generate payslips for all employees
  async generateAllPayslips(employees: any[], period: any): Promise<Blob> {
    try {
      const payslips: string[] = [];
      
      for (const employee of employees) {
        const payslipData: PayslipData = {
          employee: {
            fullName: employee.fullName,
            employeeNumber: employee.employeeNumber,
            department: employee.department,
            email: employee.personalInfo?.email || '',
          },
          period: {
            startDate: period.startDate,
            endDate: period.endDate,
            description: period.description,
          },
          earnings: {
            basicSalary: employee.basicSalary,
            allowances: employee.allowances,
            overtime: employee.overtime,
            grossPay: employee.grossPay,
          },
          deductions: employee.deductions,
          totalDeductions: employee.totalDeductions,
          netPay: employee.netPay,
        };
        
        const payslipHTML = this.generatePayslipHTML(payslipData);
        payslips.push(payslipHTML);
      }
      
      const combinedHTML = payslips.join('<div style="page-break-after: always;"></div>');
      return new Blob([combinedHTML], { type: 'text/html' });
    } catch (error) {
      console.error('Error generating all payslips:', error);
      throw error;
    }
  }

  // Generate payroll register CSV
  async generatePayrollRegister(employees: any[], period: any): Promise<Blob> {
    try {
      const headers = [
        'Employee Number',
        'Full Name',
        'Department',
        'Basic Salary',
        'Allowances',
        'Overtime Pay',
        'Gross Pay',
        'PAYE Tax',
        'UIF',
        'Pension',
        'Medical Aid',
        'Other Deductions',
        'Total Deductions',
        'Net Pay'
      ];

      const rows = employees.map(emp => [
        emp.employeeNumber,
        emp.fullName,
        emp.department,
        emp.basicSalary.toFixed(2),
        Object.values(emp.allowances).reduce((a: number, b: number) => a + b, 0).toFixed(2),
        emp.overtime.amount.toFixed(2),
        emp.grossPay.toFixed(2),
        emp.deductions.tax.toFixed(2),
        emp.deductions.uif.toFixed(2),
        emp.deductions.pension.toFixed(2),
        emp.deductions.medical.toFixed(2),
        (emp.deductions.loans + emp.deductions.other).toFixed(2),
        emp.totalDeductions.toFixed(2),
        emp.netPay.toFixed(2)
      ]);

      const csvContent = [
        `Payroll Register - ${period.description}`,
        `Period: ${new Date(period.startDate).toLocaleDateString()} to ${new Date(period.endDate).toLocaleDateString()}`,
        `Generated: ${new Date().toLocaleString()}`,
        '',
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      return new Blob([csvContent], { type: 'text/csv' });
    } catch (error) {
      console.error('Error generating payroll register:', error);
      throw error;
    }
  }

  // Generate compliance reports
  async generateComplianceReport(employees: any[], period: any): Promise<ComplianceReport> {
    try {
      const paye = {
        totalTaxDeducted: employees.reduce((sum, emp) => sum + emp.deductions.tax, 0),
        employeeCount: employees.length,
        details: employees.map(emp => ({
          employeeNumber: emp.employeeNumber,
          fullName: emp.fullName,
          taxableIncome: emp.grossPay,
          taxDeducted: emp.deductions.tax,
        })),
      };

      const uif = {
        totalContributions: employees.reduce((sum, emp) => sum + (emp.deductions.uif * 2), 0), // Employee + Employer
        employeeCount: employees.length,
        details: employees.map(emp => ({
          employeeNumber: emp.employeeNumber,
          fullName: emp.fullName,
          contributionIncome: Math.min(emp.grossPay, 17712), // UIF ceiling
          employeeContribution: emp.deductions.uif,
          employerContribution: emp.deductions.uif, // Employer matches employee contribution
        })),
      };

      const totalPayroll = employees.reduce((sum, emp) => sum + emp.grossPay, 0);
      const sdl = {
        totalSdl: totalPayroll * 0.01, // 1% SDL
        payrollTotal: totalPayroll,
        sdlRate: 0.01,
      };

      return {
        period: {
          startDate: period.startDate,
          endDate: period.endDate,
        },
        paye,
        uif,
        sdl,
      };
    } catch (error) {
      console.error('Error generating compliance report:', error);
      throw error;
    }
  }

  // Generate EFT payment file
  async generateEFTFile(employees: any[], period: any): Promise<Blob> {
    try {
      // Load employee bank details (would normally come from database)
      const eftEntries: EFTPaymentEntry[] = employees
        .filter(emp => emp.netPay > 0)
        .map(emp => ({
          employeeNumber: emp.employeeNumber,
          fullName: emp.fullName,
          bankName: 'Standard Bank', // Default - would come from employee data
          branchCode: '051001', // Default - would come from employee data
          accountNumber: `ACC${emp.employeeNumber}`, // Mock account number
          accountType: 'Current', // Default - would come from employee data
          amount: emp.netPay,
          reference: `SAL-${period.id}-${emp.employeeNumber}`,
        }));

      // Generate Standard Bank EFT format
      const eftLines = eftEntries.map((entry, index) => {
        const sequenceNumber = (index + 1).toString().padStart(6, '0');
        const amount = Math.round(entry.amount * 100).toString().padStart(11, '0'); // Amount in cents
        const accountNumber = entry.accountNumber.padEnd(16, ' ');
        const reference = entry.reference.padEnd(20, ' ');
        const accountHolder = entry.fullName.padEnd(32, ' ');
        
        return `2${sequenceNumber}${entry.branchCode}${accountNumber}${amount}${reference}${accountHolder}`;
      });

      // Header record
      const totalAmount = Math.round(eftEntries.reduce((sum, entry) => sum + entry.amount, 0) * 100);
      const totalRecords = eftEntries.length.toString().padStart(6, '0');
      const batchNumber = new Date().getTime().toString().slice(-6);
      
      const header = `1${batchNumber}${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${totalRecords}${totalAmount.toString().padStart(13, '0')}`;

      const eftContent = [header, ...eftLines].join('\n');
      
      return new Blob([eftContent], { type: 'text/plain' });
    } catch (error) {
      console.error('Error generating EFT file:', error);
      throw error;
    }
  }

  // Generate PAYE report CSV
  async generatePAYEReport(complianceData: ComplianceReport): Promise<Blob> {
    try {
      const headers = ['Employee Number', 'Full Name', 'Taxable Income', 'Tax Deducted'];
      const rows = complianceData.paye.details.map(detail => [
        detail.employeeNumber,
        detail.fullName,
        detail.taxableIncome.toFixed(2),
        detail.taxDeducted.toFixed(2)
      ]);

      const csvContent = [
        `PAYE Report - ${complianceData.period.startDate} to ${complianceData.period.endDate}`,
        `Total Tax Deducted: R${complianceData.paye.totalTaxDeducted.toFixed(2)}`,
        `Number of Employees: ${complianceData.paye.employeeCount}`,
        '',
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      return new Blob([csvContent], { type: 'text/csv' });
    } catch (error) {
      console.error('Error generating PAYE report:', error);
      throw error;
    }
  }

  // Generate UIF report CSV
  async generateUIFReport(complianceData: ComplianceReport): Promise<Blob> {
    try {
      const headers = ['Employee Number', 'Full Name', 'Contribution Income', 'Employee Contribution', 'Employer Contribution'];
      const rows = complianceData.uif.details.map(detail => [
        detail.employeeNumber,
        detail.fullName,
        detail.contributionIncome.toFixed(2),
        detail.employeeContribution.toFixed(2),
        detail.employerContribution.toFixed(2)
      ]);

      const csvContent = [
        `UIF Report - ${complianceData.period.startDate} to ${complianceData.period.endDate}`,
        `Total Contributions: R${complianceData.uif.totalContributions.toFixed(2)}`,
        `Number of Employees: ${complianceData.uif.employeeCount}`,
        '',
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      return new Blob([csvContent], { type: 'text/csv' });
    } catch (error) {
      console.error('Error generating UIF report:', error);
      throw error;
    }
  }

  // Helper method to generate payslip HTML
  private generatePayslipHTML(data: PayslipData): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Payslip - ${data.employee.fullName}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
    .payslip { max-width: 800px; margin: 0 auto; border: 1px solid #ccc; }
    .header { background-color: #f8f9fa; padding: 20px; border-bottom: 1px solid #ccc; }
    .company-name { font-size: 24px; font-weight: bold; color: #2c3e50; }
    .payslip-title { font-size: 18px; margin-top: 10px; }
    .employee-info { padding: 20px; background-color: #f8f9fa; }
    .period-info { padding: 20px; border-bottom: 1px solid #eee; }
    .earnings-section, .deductions-section { padding: 20px; }
    .section-title { font-size: 16px; font-weight: bold; margin-bottom: 15px; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 5px; }
    .line-item { display: flex; justify-content: space-between; margin: 8px 0; padding: 5px 0; }
    .line-item.total { font-weight: bold; border-top: 1px solid #ccc; margin-top: 15px; padding-top: 10px; }
    .amount { font-weight: bold; }
    .net-pay { background-color: #e8f5e8; padding: 15px; font-size: 18px; font-weight: bold; color: #27ae60; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 8px; border-bottom: 1px solid #eee; }
    .label { width: 70%; }
    .amount { width: 30%; text-align: right; }
  </style>
</head>
<body>
  <div class="payslip">
    <div class="header">
      <div class="company-name">FieldOps Solutions</div>
      <div class="payslip-title">Employee Payslip</div>
    </div>
    
    <div class="employee-info">
      <table>
        <tr>
          <td class="label"><strong>Employee Name:</strong></td>
          <td class="amount">${data.employee.fullName}</td>
        </tr>
        <tr>
          <td class="label"><strong>Employee Number:</strong></td>
          <td class="amount">${data.employee.employeeNumber}</td>
        </tr>
        <tr>
          <td class="label"><strong>Department:</strong></td>
          <td class="amount">${data.employee.department}</td>
        </tr>
      </table>
    </div>

    <div class="period-info">
      <table>
        <tr>
          <td class="label"><strong>Pay Period:</strong></td>
          <td class="amount">${new Date(data.period.startDate).toLocaleDateString()} - ${new Date(data.period.endDate).toLocaleDateString()}</td>
        </tr>
        <tr>
          <td class="label"><strong>Pay Date:</strong></td>
          <td class="amount">${new Date().toLocaleDateString()}</td>
        </tr>
      </table>
    </div>

    <div class="earnings-section">
      <div class="section-title">Earnings</div>
      <table>
        <tr>
          <td class="label">Basic Salary</td>
          <td class="amount">R${data.earnings.basicSalary.toFixed(2)}</td>
        </tr>
        ${Object.entries(data.earnings.allowances).map(([key, value]) => 
          value > 0 ? `<tr><td class="label">${key.charAt(0).toUpperCase() + key.slice(1)} Allowance</td><td class="amount">R${value.toFixed(2)}</td></tr>` : ''
        ).join('')}
        ${data.earnings.overtime.amount > 0 ? `
        <tr>
          <td class="label">Overtime (${data.earnings.overtime.hours.toFixed(1)}h @ R${data.earnings.overtime.rate.toFixed(2)})</td>
          <td class="amount">R${data.earnings.overtime.amount.toFixed(2)}</td>
        </tr>` : ''}
        <tr class="total">
          <td class="label"><strong>Gross Pay</strong></td>
          <td class="amount"><strong>R${data.earnings.grossPay.toFixed(2)}</strong></td>
        </tr>
      </table>
    </div>

    <div class="deductions-section">
      <div class="section-title">Deductions</div>
      <table>
        ${Object.entries(data.deductions).map(([key, value]) => 
          value > 0 ? `<tr><td class="label">${key.toUpperCase()}</td><td class="amount">R${value.toFixed(2)}</td></tr>` : ''
        ).join('')}
        <tr class="total">
          <td class="label"><strong>Total Deductions</strong></td>
          <td class="amount"><strong>R${data.totalDeductions.toFixed(2)}</strong></td>
        </tr>
      </table>
    </div>

    <div class="net-pay">
      <div class="line-item">
        <span>NET PAY</span>
        <span>R${data.netPay.toFixed(2)}</span>
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  // Download helper
  downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export default PayrollExportService;
