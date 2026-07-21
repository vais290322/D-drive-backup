/**
 * Export Utilities
 * Provides functions to export data to CSV and Excel formats
 */

/**
 * Convert array of objects to CSV string
 */
function convertToCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle values that contain commas or quotes
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(data: Record<string, unknown>[], filename: string) {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export customers to CSV
 */
export function exportCustomersToCSV(customers: unknown[]) {
  const data = customers.map((customer: any) => ({
    'Customer Code': customer.customer_code,
    'Full Name': customer.full_name,
    'Father Name': customer.father_name || '',
    'Mobile': customer.mobile_primary,
    'Email': customer.email || '',
    'City': customer.city,
    'State': customer.state,
    'PIN Code': customer.pin_code,
    'KYC Status': customer.kyc_status,
    'Created Date': new Date(customer.created_at).toLocaleDateString(),
  }));

  downloadCSV(data, `customers_${new Date().toISOString().split('T')[0]}`);
}

/**
 * Export products to CSV
 */
export function exportProductsToCSV(products: unknown[]) {
  const data = products.map((product: any) => ({
    'Product Code': product.product_code,
    'Category': product.category,
    'Brand': product.brand,
    'Model': product.model,
    'Serial Number': product.serial_number || '',
    'IMEI 1': product.imei1 || '',
    'IMEI 2': product.imei2 || '',
    'Purchase Price': product.purchase_price || '',
    'Status': product.status,
    'Created Date': new Date(product.created_at).toLocaleDateString(),
  }));

  downloadCSV(data, `products_${new Date().toISOString().split('T')[0]}`);
}

/**
 * Export loans to CSV
 */
export function exportLoansToCSV(loans: unknown[]) {
  const data = loans.map((loan: any) => ({
    'Loan Code': loan.loan_code,
    'Customer': loan.customers?.full_name || '',
    'Product': `${loan.products?.brand || ''} ${loan.products?.model || ''}`,
    'Principal Amount': loan.principal_amount,
    'Interest Rate': loan.interest_rate,
    'Interest Type': loan.interest_type,
    'Total Amount': loan.total_amount,
    'EMI Amount': loan.emi_amount,
    'Tenure (Months)': loan.tenure_months,
    'Amount Paid': loan.amount_paid || 0,
    'Balance': loan.total_amount - (loan.amount_paid || 0),
    'Status': loan.status,
    'Start Date': new Date(loan.start_date).toLocaleDateString(),
    'Created Date': new Date(loan.created_at).toLocaleDateString(),
  }));

  downloadCSV(data, `loans_${new Date().toISOString().split('T')[0]}`);
}

/**
 * Export payments to CSV
 */
export function exportPaymentsToCSV(payments: unknown[]) {
  const data = payments.map((payment: any) => ({
    'Payment Date': new Date(payment.payment_date).toLocaleDateString(),
    'Loan Code': payment.loans?.loan_code || '',
    'Customer': payment.loans?.customers?.full_name || '',
    'Amount': payment.amount,
    'Payment Mode': payment.payment_mode,
    'Transaction Reference': payment.transaction_reference || '',
    'Collected By': payment.profiles?.nickname || '',
    'Remarks': payment.remarks || '',
  }));

  downloadCSV(data, `payments_${new Date().toISOString().split('T')[0]}`);
}

/**
 * Export loan ledger to CSV
 */
export function exportLoanLedgerToCSV(
  loan: any,
  customer: any,
  product: any,
  payments: unknown[],
  penalties: unknown[]
) {
  // Summary section
  const summary = [
    { 'Description': 'Loan Code', 'Value': loan.loan_code },
    { 'Description': 'Customer Name', 'Value': customer.full_name },
    { 'Description': 'Customer Code', 'Value': customer.customer_code },
    { 'Description': 'Product', 'Value': `${product.brand} ${product.model}` },
    { 'Description': 'Principal Amount', 'Value': loan.principal_amount },
    { 'Description': 'Interest Amount', 'Value': loan.interest_amount },
    { 'Description': 'Processing Fee', 'Value': loan.processing_fee || 0 },
    { 'Description': 'Insurance Fee', 'Value': loan.insurance_fee || 0 },
    { 'Description': 'Total Penalties', 'Value': penalties.reduce((sum: number, p: any) => sum + p.amount, 0) },
    { 'Description': 'Total Payable', 'Value': loan.total_amount },
    { 'Description': 'Total Paid', 'Value': loan.amount_paid || 0 },
    { 'Description': 'Balance', 'Value': loan.total_amount - (loan.amount_paid || 0) },
    { 'Description': '', 'Value': '' },
    { 'Description': 'PAYMENT HISTORY', 'Value': '' },
  ];

  // Payment history
  const paymentHistory = payments.map((payment: any) => ({
    'Description': 'Payment',
    'Date': new Date(payment.payment_date).toLocaleDateString(),
    'Mode': payment.payment_mode,
    'Amount': payment.amount,
    'Reference': payment.transaction_reference || '',
    'Remarks': payment.remarks || '',
  }));

  // Penalty history
  const penaltyHistory = penalties.map((penalty: any) => ({
    'Description': 'Penalty',
    'Date': new Date(penalty.created_at).toLocaleDateString(),
    'Type': penalty.penalty_type,
    'Amount': penalty.amount,
    'Reference': '',
    'Remarks': penalty.reason || '',
  }));

  // Combine all data
  const allData = [
    ...summary,
    ...paymentHistory,
    ...penaltyHistory,
  ];

  downloadCSV(allData, `loan_ledger_${loan.loan_code}_${new Date().toISOString().split('T')[0]}`);
}

/**
 * Print table data
 */
export function printTable(title: string, data: Record<string, unknown>[]) {
  if (data.length === 0) {
    alert('No data to print');
    return;
  }

  const headers = Object.keys(data[0]);
  
  const printHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        @media print {
          @page { margin: 1cm; }
          body { margin: 0; }
        }
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
        }
        h1 {
          color: #1e3a8a;
          text-align: center;
          margin-bottom: 20px;
        }
        .meta {
          text-align: center;
          margin-bottom: 30px;
          color: #666;
          font-size: 14px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
          font-size: 12px;
        }
        th {
          background-color: #1e3a8a;
          color: white;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 11px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <div class="meta">
        Generated on: ${new Date().toLocaleString()}<br>
        Total Records: ${data.length}
      </div>
      <table>
        <thead>
          <tr>
            ${headers.map(h => `<th>${h}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${data.map(row => `
            <tr>
              ${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="footer">
        <p><strong>Digital Dreems - Loan Management System</strong></p>
        <p>© ${new Date().getFullYear()} Vais Engineering Pvt Ltd</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}
