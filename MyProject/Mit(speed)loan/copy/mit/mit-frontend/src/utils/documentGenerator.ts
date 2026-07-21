/**
 * Document Generation Utilities
 * Provides functions to generate loan agreements, NOC certificates, and receipts
 */

import type { Loan, Customer, Product, Profile } from "@/types/types";

/**
 * Generate and print loan agreement
 */
export function generateLoanAgreement(
  loan: Loan,
  customer: Customer,
  product: Product,
  profile: Profile | null
) {
  const agreementHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Loan Agreement - ${loan.loan_id}</title>
      <style>
        @media print {
          @page { margin: 2cm; }
          body { margin: 0; }
        }
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.6;
          color: #000;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #1e3a8a;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #1e3a8a;
          margin: 0;
          font-size: 28px;
        }
        .header p {
          margin: 5px 0;
          font-size: 14px;
        }
        .section {
          margin: 20px 0;
        }
        .section-title {
          font-weight: bold;
          font-size: 18px;
          color: #1e3a8a;
          margin-bottom: 10px;
          border-bottom: 1px solid #ccc;
          padding-bottom: 5px;
        }
        .info-row {
          display: flex;
          margin: 8px 0;
        }
        .info-label {
          font-weight: bold;
          width: 200px;
        }
        .info-value {
          flex: 1;
        }
        .terms {
          margin: 20px 0;
          padding: 15px;
          background: #f8f9fa;
          border-left: 4px solid #1e3a8a;
        }
        .terms ol {
          margin: 10px 0;
          padding-left: 20px;
        }
        .terms li {
          margin: 8px 0;
        }
        .signatures {
          margin-top: 60px;
          display: flex;
          justify-content: space-between;
        }
        .signature-box {
          text-align: center;
          width: 45%;
        }
        .signature-line {
          border-top: 1px solid #000;
          margin-top: 60px;
          padding-top: 10px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #ccc;
          padding-top: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        table th, table td {
          border: 1px solid #ddd;
          padding: 10px;
          text-align: left;
        }
        table th {
          background: #1e3a8a;
          color: white;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>LOAN AGREEMENT</h1>
        <p><strong>Mit Electro World</strong></p>
        <p>Loan Management System</p>
        <p>Agreement No: ${loan.loan_id}</p>
        <p>Date: ${new Date(loan.created_at).toLocaleDateString()}</p>
      </div>

      <div class="section">
        <div class="section-title">BORROWER INFORMATION</div>
        <div class="info-row">
          <div class="info-label">Customer Code:</div>
          <div class="info-value">${customer.customer_code}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Full Name:</div>
          <div class="info-value">${customer.full_name}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Father's Name:</div>
          <div class="info-value">${customer.father_name || 'N/A'}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Mobile Number:</div>
          <div class="info-value">${customer.mobile_primary}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Email:</div>
          <div class="info-value">${customer.email || 'N/A'}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Address:</div>
          <div class="info-value">${customer.current_address}, ${customer.city}, ${customer.state} - ${customer.pin_code}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Aadhaar Number:</div>
          <div class="info-value">${customer.aadhaar_number ? '****' + customer.aadhaar_number.slice(-4) : 'N/A'}</div>
        </div>
        <div class="info-row">
          <div class="info-label">PAN Number:</div>
          <div class="info-value">${customer.pan_number || 'N/A'}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">PRODUCT/ASSET DETAILS</div>
        <div class="info-row">
          <div class="info-label">Product Code:</div>
          <div class="info-value">${product.product_code}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Category:</div>
          <div class="info-value">${product.category}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Brand & Model:</div>
          <div class="info-value">${product.brand} ${product.model}</div>
        </div>
        ${product.serial_number ? `
        <div class="info-row">
          <div class="info-label">Serial Number:</div>
          <div class="info-value">${product.serial_number}</div>
        </div>
        ` : ''}
        ${product.imei_1 ? `
        <div class="info-row">
          <div class="info-label">IMEI:</div>
          <div class="info-value">${product.imei_1}${product.imei_2 ? ' / ' + product.imei_2 : ''}</div>
        </div>
        ` : ''}
        <div class="info-row">
          <div class="info-label">Purchase Price:</div>
          <div class="info-value">₹${product.purchase_price?.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">LOAN DETAILS</div>
        <table>
          <tr>
            <th>Particulars</th>
            <th>Amount (₹)</th>
          </tr>
          <tr>
            <td>Principal Amount</td>
            <td>${loan.principal_amount.toLocaleString('en-IN')}</td>
          </tr>
          <tr>
            <td>Processing Fee</td>
            <td>${loan.processing_fee?.toLocaleString('en-IN') || '0'}</td>
          </tr>
          <tr>
            <td>Insurance Fee</td>
            <td>${loan.insurance_fee?.toLocaleString('en-IN') || '0'}</td>
          </tr>
          <tr>
            <td>Interest Amount (${loan.interest_rate}% ${loan.interest_type})</td>
            <td>${loan.total_interest.toLocaleString('en-IN')}</td>
          </tr>
          <tr style="background: #f0f0f0; font-weight: bold;">
            <td>Total Payable Amount</td>
            <td>${loan.total_payable.toLocaleString('en-IN')}</td>
          </tr>
        </table>

        <div class="info-row">
          <div class="info-label">Loan Type:</div>
          <div class="info-value">${loan.loan_type}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Tenure:</div>
          <div class="info-value">${loan.tenure_months} months</div>
        </div>
        <div class="info-row">
          <div class="info-label">EMI Amount:</div>
          <div class="info-value">₹${loan.installment_amount.toLocaleString('en-IN')}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Start Date:</div>
          <div class="info-value">${new Date(loan.start_date).toLocaleDateString()}</div>
        </div>
        <div class="info-row">
          <div class="info-label">First EMI Date:</div>
          <div class="info-value">${new Date(loan.first_emi_date).toLocaleDateString()}</div>
        </div>
      </div>

      ${loan.guarantor_name ? `
      <div class="section">
        <div class="section-title">GUARANTOR DETAILS</div>
        <div class="info-row">
          <div class="info-label">Name:</div>
          <div class="info-value">${loan.guarantor_name}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Mobile:</div>
          <div class="info-value">${loan.guarantor_mobile || 'N/A'}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Address:</div>
          <div class="info-value">${loan.guarantor_address || 'N/A'}</div>
        </div>
      </div>
      ` : ''}

      <div class="terms">
        <div class="section-title">TERMS AND CONDITIONS</div>
        <ol>
          <li>The borrower agrees to repay the loan amount in ${loan.tenure_months} equal monthly installments of ₹${loan.installment_amount.toLocaleString('en-IN')} each.</li>
          <li>The first EMI is due on ${new Date(loan.first_emi_date).toLocaleDateString()} and subsequent EMIs on the same date of each month.</li>
          <li>Late payment charges will be applicable as per company policy for payments made after the due date.</li>
          <li>The product/asset mentioned above is hypothecated to Mit Electro World until full repayment of the loan.</li>
          <li>The borrower shall not sell, transfer, or dispose of the hypothecated asset without prior written consent.</li>
          <li>In case of default, Mit Electro World reserves the right to repossess the asset and take legal action.</li>
          <li>The borrower has provided accurate information and documents for KYC verification.</li>
          <li>Any change in contact details or address must be intimated to Mit Electro World immediately.</li>
          <li>Prepayment of the loan is allowed with prior notice and may attract prepayment charges.</li>
          <li>This agreement is governed by the laws of India and subject to local jurisdiction.</li>
        </ol>
      </div>

      <div class="signatures">
        <div class="signature-box">
          <div class="signature-line">
            <strong>Borrower's Signature</strong><br>
            ${customer.full_name}<br>
            Date: ${new Date().toLocaleDateString()}
          </div>
        </div>
        <div class="signature-box">
          <div class="signature-line">
            <strong>Authorized Signatory</strong><br>
            ${profile?.full_name || 'Mit Electro World'}<br>
            Date: ${new Date().toLocaleDateString()}
          </div>
        </div>
      </div>

      ${loan.guarantor_name ? `
      <div class="signatures" style="margin-top: 40px;">
        <div class="signature-box">
          <div class="signature-line">
            <strong>Guarantor's Signature</strong><br>
            ${loan.guarantor_name}<br>
            Date: ${new Date().toLocaleDateString()}
          </div>
        </div>
        <div class="signature-box"></div>
      </div>
      ` : ''}

      <div class="footer">
        <p><strong>Mit Electro World - Loan Management System</strong></p>
        <p>Designed & Developed by Vais Engineering Pvt Ltd</p>
        <p>This is a computer-generated document and does not require a physical signature.</p>
        <p>© ${new Date().getFullYear()} Mit Electro World. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(agreementHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

/**
 * Generate and print NOC (No Objection Certificate)
 */
export function generateNOC(
  loan: Loan,
  customer: Customer,
  product: Product,
  profile: Profile | null
) {
  const nocHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>NOC - ${loan.loan_id}</title>
      <style>
        @media print {
          @page { margin: 2cm; }
          body { margin: 0; }
        }
        body {
          font-family: 'Times New Roman', serif;
          line-height: 1.8;
          color: #000;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 3px solid #1e3a8a;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #1e3a8a;
          margin: 0;
          font-size: 32px;
          letter-spacing: 2px;
        }
        .header p {
          margin: 5px 0;
          font-size: 14px;
        }
        .ref-no {
          text-align: right;
          margin: 20px 0;
          font-weight: bold;
        }
        .date {
          text-align: right;
          margin-bottom: 30px;
        }
        .content {
          text-align: justify;
          font-size: 16px;
          line-height: 2;
        }
        .content p {
          margin: 20px 0;
        }
        .highlight {
          background: #fff3cd;
          padding: 2px 5px;
          font-weight: bold;
        }
        .details-box {
          border: 2px solid #1e3a8a;
          padding: 20px;
          margin: 30px 0;
          background: #f8f9fa;
        }
        .details-box .row {
          display: flex;
          margin: 10px 0;
        }
        .details-box .label {
          font-weight: bold;
          width: 200px;
        }
        .details-box .value {
          flex: 1;
        }
        .signature {
          margin-top: 80px;
          text-align: right;
        }
        .signature-line {
          border-top: 1px solid #000;
          width: 300px;
          margin-left: auto;
          padding-top: 10px;
          text-align: center;
        }
        .footer {
          margin-top: 60px;
          text-align: center;
          font-size: 12px;
          color: #666;
          border-top: 1px solid #ccc;
          padding-top: 20px;
        }
        .stamp-box {
          border: 2px solid #1e3a8a;
          width: 150px;
          height: 150px;
          margin: 20px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1e3a8a;
          font-weight: bold;
          transform: rotate(-15deg);
          font-size: 18px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>NO OBJECTION CERTIFICATE</h1>
        <p><strong>Mit Electro World</strong></p>
        <p>Loan Management System</p>
      </div>

      <div class="ref-no">
        Ref No: NOC/${loan.loan_id}/${new Date().getFullYear()}
      </div>

      <div class="date">
        Date: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
      </div>

      <div class="content">
        <p><strong>To Whom It May Concern,</strong></p>

        <p>
          This is to certify that <span class="highlight">${customer.full_name}</span> 
          (Customer Code: ${customer.customer_code}) has successfully completed the repayment of 
          Loan No. <span class="highlight">${loan.loan_id}</span> taken from Mit Electro World.
        </p>

        <div class="details-box">
          <div class="row">
            <div class="label">Customer Name:</div>
            <div class="value">${customer.full_name}</div>
          </div>
          <div class="row">
            <div class="label">Customer Code:</div>
            <div class="value">${customer.customer_code}</div>
          </div>
          <div class="row">
            <div class="label">Loan Code:</div>
            <div class="value">${loan.loan_id}</div>
          </div>
          <div class="row">
            <div class="label">Product:</div>
            <div class="value">${product.brand} ${product.model} (${product.category})</div>
          </div>
          ${product.serial_number ? `
          <div class="row">
            <div class="label">Serial Number:</div>
            <div class="value">${product.serial_number}</div>
          </div>
          ` : ''}
          ${product.imei_1 ? `
          <div class="row">
            <div class="label">IMEI Number:</div>
            <div class="value">${product.imei_1}${product.imei_2 ? ' / ' + product.imei_2 : ''}</div>
          </div>
          ` : ''}
          <div class="row">
            <div class="label">Loan Amount:</div>
            <div class="value">₹${loan.principal_amount.toLocaleString('en-IN')}</div>
          </div>
          <div class="row">
            <div class="label">Total Amount Paid:</div>
            <div class="value">₹${loan.total_payable.toLocaleString('en-IN')}</div>
          </div>
          <div class="row">
            <div class="label">Loan Start Date:</div>
            <div class="value">${new Date(loan.start_date).toLocaleDateString('en-IN')}</div>
          </div>
          <div class="row">
            <div class="label">Loan Closure Date:</div>
            <div class="value">${new Date().toLocaleDateString('en-IN')}</div>
          </div>
        </div>

        <p>
          All dues including principal amount, interest, processing fees, and any applicable charges 
          have been fully paid and settled. There are <span class="highlight">NO PENDING DUES</span> 
          against the above-mentioned loan account.
        </p>

        <p>
          The hypothecation/charge on the above-mentioned asset/product is hereby released, and the 
          customer has full ownership rights over the asset.
        </p>

        <p>
          <strong>We have NO OBJECTION</strong> to the customer using, selling, transferring, or 
          disposing of the asset in any manner as they deem fit.
        </p>

        <p>
          This certificate is issued at the request of the customer for their records and future reference.
        </p>
      </div>

      <div class="stamp-box">
        PAID IN FULL
      </div>

      <div class="signature">
        <p><strong>For Mit Electro World</strong></p>
        <div class="signature-line">
          <strong>Authorized Signatory</strong><br>
          ${profile?.full_name || 'Mit Electro World'}<br>
          ${profile?.role || 'Admin'}
        </div>
      </div>

      <div class="footer">
        <p><strong>Mit Electro World - Loan Management System</strong></p>
        <p>Designed & Developed by Vais Engineering Pvt Ltd</p>
        <p>This is a system-generated certificate and is valid without physical signature.</p>
        <p>© ${new Date().getFullYear()} Mit Electro World. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(nocHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

/**
 * Generate and print EMI receipt
 */
export function generateEMIReceipt(
  payment: {
    id: string;
    amount_paid: number;
    payment_date: string;
    payment_mode: string;
    transaction_reference?: string | null;
    remarks?: string | null;
  },
  loan: Loan,
  customer: Customer,
  product: Product,
  profile: Profile | null
) {
  const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>EMI Receipt - ${payment.id}</title>
      <style>
        @media print {
          @page { margin: 1cm; size: A5; }
          body { margin: 0; }
        }
        body {
          font-family: Arial, sans-serif;
          line-height: 1.4;
          color: #000;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 2px solid #1e3a8a;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
          border-bottom: 2px solid #1e3a8a;
          padding-bottom: 15px;
        }
        .header h1 {
          color: #1e3a8a;
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 3px 0;
          font-size: 12px;
        }
        .receipt-no {
          text-align: center;
          font-size: 14px;
          font-weight: bold;
          margin: 15px 0;
          padding: 10px;
          background: #f0f0f0;
          border: 1px dashed #1e3a8a;
        }
        .section {
          margin: 15px 0;
        }
        .row {
          display: flex;
          margin: 8px 0;
          font-size: 14px;
        }
        .label {
          font-weight: bold;
          width: 180px;
        }
        .value {
          flex: 1;
        }
        .amount-box {
          background: #1e3a8a;
          color: white;
          padding: 15px;
          text-align: center;
          margin: 20px 0;
          border-radius: 5px;
        }
        .amount-box .amount {
          font-size: 28px;
          font-weight: bold;
        }
        .amount-box .words {
          font-size: 12px;
          margin-top: 5px;
        }
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #ccc;
          text-align: center;
          font-size: 11px;
        }
        .signature {
          margin-top: 40px;
          text-align: right;
        }
        .signature-line {
          border-top: 1px solid #000;
          width: 200px;
          margin-left: auto;
          padding-top: 5px;
          text-align: center;
          font-size: 12px;
        }
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 80px;
          color: rgba(16, 185, 129, 0.1);
          font-weight: bold;
          z-index: -1;
        }
      </style>
    </head>
    <body>
      <div class="watermark">PAID</div>
      
      <div class="header">
        <h1>PAYMENT RECEIPT</h1>
        <p><strong>Mit Electro World</strong></p>
        <p>Loan Management System</p>
      </div>

      <div class="receipt-no">
        Receipt No: ${payment.id.slice(0, 8).toUpperCase()}<br>
        Date: ${new Date(payment.payment_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
      </div>

      <div class="section">
        <div class="row">
          <div class="label">Customer Name:</div>
          <div class="value">${customer.full_name}</div>
        </div>
        <div class="row">
          <div class="label">Customer Code:</div>
          <div class="value">${customer.customer_code}</div>
        </div>
        <div class="row">
          <div class="label">Mobile Number:</div>
          <div class="value">${customer.mobile_primary}</div>
        </div>
      </div>

      <div class="section">
        <div class="row">
          <div class="label">Loan Code:</div>
          <div class="value">${loan.loan_id}</div>
        </div>
        <div class="row">
          <div class="label">Product:</div>
          <div class="value">${product.brand} ${product.model}</div>
        </div>
        <div class="row">
          <div class="label">EMI Amount:</div>
          <div class="value">₹${loan.installment_amount.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div class="amount-box">
        <div>Amount Received</div>
        <div class="amount">₹${payment.amount_paid.toLocaleString('en-IN')}</div>
        <div class="words">${numberToWords(payment.amount_paid)} Rupees Only</div>
      </div>

      <div class="section">
        <div class="row">
          <div class="label">Payment Mode:</div>
          <div class="value">${payment.payment_mode}</div>
        </div>
        ${payment.transaction_reference ? `
        <div class="row">
          <div class="label">Transaction Ref:</div>
          <div class="value">${payment.transaction_reference}</div>
        </div>
        ` : ''}
        ${payment.remarks ? `
        <div class="row">
          <div class="label">Remarks:</div>
          <div class="value">${payment.remarks}</div>
        </div>
        ` : ''}
        <div class="row">
          <div class="label">Received By:</div>
          <div class="value">${profile?.full_name || 'Mit Electro World'}</div>
        </div>
      </div>

      <div class="signature">
        <div class="signature-line">
          <strong>Authorized Signature</strong>
        </div>
      </div>

      <div class="footer">
        <p><strong>Thank you for your payment!</strong></p>
        <p>This is a computer-generated receipt and does not require a physical signature.</p>
        <p>For queries, please contact Mit Electro World</p>
        <p>© ${new Date().getFullYear()} Mit Electro World. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  if (num === 0) return 'Zero';

  const crores = Math.floor(num / 10000000);
  const lakhs = Math.floor((num % 10000000) / 100000);
  const thousands = Math.floor((num % 100000) / 1000);
  const hundreds = Math.floor((num % 1000) / 100);
  const remainder = num % 100;

  let words = '';

  if (crores > 0) {
    words += convertTwoDigit(crores) + ' Crore ';
  }
  if (lakhs > 0) {
    words += convertTwoDigit(lakhs) + ' Lakh ';
  }
  if (thousands > 0) {
    words += convertTwoDigit(thousands) + ' Thousand ';
  }
  if (hundreds > 0) {
    words += ones[hundreds] + ' Hundred ';
  }
  if (remainder > 0) {
    if (remainder < 10) {
      words += ones[remainder];
    } else if (remainder < 20) {
      words += teens[remainder - 10];
    } else {
      words += tens[Math.floor(remainder / 10)] + ' ' + ones[remainder % 10];
    }
  }

  return words.trim();
}

function convertTwoDigit(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

  if (num < 10) return ones[num];
  if (num < 20) return teens[num - 10];
  return tens[Math.floor(num / 10)] + ' ' + ones[num % 10];
}

