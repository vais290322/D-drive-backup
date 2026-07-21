import React, { useEffect, useRef } from 'react';

const SnigdhaPaymentSlip = ({ 
  paymentData, 
  shouldDownload = false, 
  onDownloadComplete 
}) => {
  const componentRef = useRef();

  // Auto-download functionality
  useEffect(() => {
    if (shouldDownload && paymentData) {
      const timer = setTimeout(() => {
        handleDownload();
      }, 500); // Small delay to ensure component is rendered
      
      return () => clearTimeout(timer);
    }
  }, [shouldDownload, paymentData]);

  const handleDownload = () => {
    if (!componentRef.current) return;

    const element = componentRef.current;
    const originalDisplay = element.style.display;
    
    // Temporarily show the component for printing
    element.style.display = 'block';
    element.style.position = 'fixed';
    element.style.top = '-9999px';
    element.style.left = '-9999px';
    element.style.zIndex = '-1';

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Payment Receipt - ${paymentData?.invoiceNumber || 'N/A'}</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                padding: 20px;
              }
              
              .receipt-container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              
              .receipt-header {
                background: linear-gradient(135deg, #4f46e5, #3b82f6);
                color: white;
                padding: 30px;
                text-align: center;
                position: relative;
              }
              
              .company-name {
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 5px;
              }
              
              .company-details {
                font-size: 14px;
                opacity: 0.9;
                margin-bottom: 20px;
              }
              
              .receipt-title {
                font-size: 18px;
                font-weight: bold;
                text-decoration: underline;
                letter-spacing: 1px;
              }
              
              .receipt-body {
                padding: 0;
              }
              
              .receipt-info {
                display: flex;
                justify-content: space-between;
                padding: 20px 30px;
                background: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
              }
              
              .receipt-number {
                font-weight: bold;
                color: #374151;
              }
              
              .receipt-date {
                color: #6b7280;
              }
              
              .details-table {
                width: 100%;
                border-collapse: collapse;
              }
              
              .details-table th {
                background: #f1f5f9;
                padding: 15px;
                text-align: left;
                font-weight: 600;
                color: #374151;
                border-bottom: 2px solid #e2e8f0;
              }
              
              .details-table td {
                padding: 15px;
                border-bottom: 1px solid #e2e8f0;
                color: #4b5563;
              }
              
              .amount-cell {
                text-align: right;
                font-weight: 600;
                color: #059669;
              }
              
              .total-row {
                background: #ecfdf5;
                font-weight: bold;
              }
              
              .total-row td {
                border-bottom: none;
                font-size: 18px;
                color: #065f46;
              }
              
              .footer-section {
                padding: 30px;
                background: #f8fafc;
                text-align: center;
              }
              
              .payment-method {
                display: inline-block;
                background: #dbeafe;
                color: #1e40af;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 20px;
              }
              
              .transaction-details {
                background: white;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border: 1px solid #e2e8f0;
              }
              
              .transaction-details h4 {
                color: #374151;
                margin-bottom: 10px;
                font-size: 16px;
              }
              
              .transaction-id {
                font-family: 'Courier New', monospace;
                background: #f3f4f6;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
                color: #374151;
                word-break: break-all;
              }
              
              .amount-words {
                font-style: italic;
                color: #6b7280;
                font-size: 14px;
                margin: 15px 0;
              }
              
              .signature-section {
                text-align: right;
                margin-top: 40px;
                color: #4f46e5;
                font-weight: bold;
              }
              
              @media print {
                body {
                  background: white;
                  padding: 0;
                }
                
                .receipt-container {
                  box-shadow: none;
                  max-width: none;
                }
              }
            </style>
          </head>
          <body>
            ${element.innerHTML}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
          
          // Reset original display
          element.style.display = originalDisplay;
          element.style.position = '';
          element.style.top = '';
          element.style.left = '';
          element.style.zIndex = '';
          
          // Callback when download is complete
          if (onDownloadComplete) {
            onDownloadComplete();
          }
        }, 250);
      };
    }
  };

  // Convert number to words (Indian format)
  const numberToWords = (num) => {
    if (!num || num === 0) return 'Zero Only';
    
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
                  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 
                  'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    const convertHundreds = (n) => {
      let result = '';
      if (n >= 100) {
        result += ones[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      }
      if (n > 0) {
        result += ones[n] + ' ';
      }
      return result;
    };
    
    let crores = Math.floor(num / 10000000);
    let lakhs = Math.floor((num % 10000000) / 100000);
    let thousands = Math.floor((num % 100000) / 1000);
    let hundreds = num % 1000;
    
    let result = '';
    if (crores > 0) result += convertHundreds(crores) + 'Crore ';
    if (lakhs > 0) result += convertHundreds(lakhs) + 'Lakh ';
    if (thousands > 0) result += convertHundreds(thousands) + 'Thousand ';
    if (hundreds > 0) result += convertHundreds(hundreds);
    
    return result.trim() + ' Only';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('en-GB');
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (!paymentData) {
    return null;
  }

  const currentDate = new Date().toLocaleDateString('en-GB');
  const receiptNumber = paymentData.invoiceNumber || `RCP-${Date.now()}`;
  const paymentAmount = parseFloat(paymentData.paymentAmount || 0);

  return (
    <div 
      ref={componentRef}
      style={{ display: shouldDownload ? 'none' : 'block' }}
    >
      <div className="receipt-container">
        {/* Header */}
        <div className="receipt-header">
          <div className="company-name">SNIGDHA ENTERPRISE </div>
          <div className="company-details">
          AB-79, SALT LAKE CITY, SECTOR-I, KOLKATA - 700064<br />
          snigdhaenterprise2015@gmail.com<br />
          +91 9073656557
          </div> 

{
  paymentData?.vendor ? ( <div className="receipt-title">Payment Voucher</div>) : (<div className="receipt-title">Receipt Voucher</div>)
}

        </div>

        {/* Receipt Info */}
        <div className="receipt-info">
          <div className="receipt-number">No. {receiptNumber}</div>
          <div className="receipt-date">Dated: {formatDate(paymentData.paymentDate)}</div>
        </div>

        {/* Details Table */}
        <table className="details-table">
          <thead>
            <tr>
              <th>Particulars</th>
              <th style={{ textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {paymentData.vendor ? (
                <td>
                  <strong>Payment Received</strong><br />
                  Invoice No: {paymentData.invoiceNumber}<br />
                  {paymentData.customerName && `Vendor: ${paymentData.customerName}`}
                </td>
              ) : (
                <td>
                  <strong>Payment Received</strong><br />
                  Invoice No: {paymentData.invoiceNumber}<br />
                  {paymentData.customerName && `Customer: ${paymentData.customerName}`}
                </td>
              )}
              <td className="amount-cell">
                {paymentAmount.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR'
                })}
              </td>
            </tr>
            <tr className="total-row">
              <td><strong>Total Amount</strong></td>
              <td className="amount-cell">
                ₹ {paymentAmount.toLocaleString('en-IN', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Footer */}
        <div className="footer-section">
          <div className="payment-method">
            Payment Method: {paymentData.paymentMode || 'Cash'}
          </div>
          
          {paymentData.transactionId && (
            <div className="transaction-details">
              <h4>Transaction Details:</h4>
              <div className="transaction-id">
                Transaction ID: {paymentData.transactionId}
              </div>
            </div>
          )}
          
          <div className="amount-words">
            <strong>Amount in words:</strong> INR {numberToWords(Math.floor(paymentAmount))}
          </div>
          
          <div>
            <strong>Payment received through:</strong> {paymentData.paymentMode || 'Cash'} - Location: {paymentData.location || 'Main Office'}
          </div>
          
          <div style={{ marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
            On Account of: Received payment for Invoice #{paymentData.invoiceNumber}
          </div>
          
          <div className="signature-section">
            <strong>Authorised Signatory</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnigdhaPaymentSlip;


