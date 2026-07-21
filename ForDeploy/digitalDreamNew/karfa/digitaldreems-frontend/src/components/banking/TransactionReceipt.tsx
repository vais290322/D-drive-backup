import { useRef } from 'react';
import { X, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/currency';
import type { BankAccountWithCustomer } from '@/types/types';

interface TransactionReceiptProps {
  open: boolean;
  onClose: () => void;
  transactionType: 'deposit' | 'withdrawal';
  account: BankAccountWithCustomer;
  amount: number;
  referenceNote?: string;
  transactionId?: string;
  transactionDate: string;
  newBalance: number;
}

export default function TransactionReceipt({
  open,
  onClose,
  transactionType,
  account,
  amount,
  referenceNote,
  transactionId,
  transactionDate,
  newBalance,
}: TransactionReceiptProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'} Receipt - ${transactionId}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            @page {
              size: A5;
              margin: 10mm;
            }
            
            body {
              font-family: 'Arial', 'Helvetica', sans-serif;
              font-size: 11px;
              line-height: 1.4;
              color: #000;
              background: #fff;
              width: 148mm;
              max-width: 148mm;
              margin: 0 auto;
            }
            
            .receipt-container {
              width: 100%;
              max-width: 148mm;
              padding: 8mm;
            }
            
            .header {
              text-align: center;
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 2px solid #000;
            }
            
            .header h1 {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 4px;
              color: #000;
            }
            
            .header p {
              font-size: 10px;
              color: #333;
              margin: 2px 0;
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              padding-bottom: 8px;
              border-bottom: 1px solid #ddd;
            }
            
            .info-item {
              flex: 1;
            }
            
            .info-label {
              font-size: 9px;
              color: #666;
              text-transform: uppercase;
              margin-bottom: 2px;
            }
            
            .info-value {
              font-size: 11px;
              font-weight: 600;
              color: #000;
            }
            
            .section-title {
              font-size: 10px;
              font-weight: bold;
              color: #666;
              text-transform: uppercase;
              margin: 10px 0 6px 0;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 8px 0;
            }
            
            th {
              text-align: left;
              padding: 6px 4px;
              font-size: 10px;
              font-weight: bold;
              border-bottom: 2px solid #000;
              color: #000;
            }
            
            th.text-right {
              text-align: right;
            }
            
            td {
              padding: 6px 4px;
              font-size: 11px;
              border-bottom: 1px solid #ddd;
            }
            
            td.text-right {
              text-align: right;
            }
            
            .highlight-row {
              background-color: #f5f5f5;
            }
            
            .total-row {
              background-color: #e8e8e8;
              border-bottom: 2px solid #000 !important;
            }
            
            .total-row td {
              font-weight: bold;
              font-size: 12px;
              padding: 8px 4px;
            }
            
            .summary-box {
              background-color: #f0f0f0;
              border: 2px solid #000;
              padding: 10px;
              margin: 10px 0;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            
            .summary-item {
              text-align: center;
            }
            
            .summary-label {
              font-size: 9px;
              color: #666;
              text-transform: uppercase;
              margin-bottom: 3px;
            }
            
            .summary-value {
              font-size: 16px;
              font-weight: bold;
              color: #000;
            }
            
            .text-success {
              color: #16a34a;
            }
            
            .text-danger {
              color: #dc2626;
            }
            
            .footer {
              border-top: 2px solid #000;
              padding-top: 8px;
              margin-top: 12px;
              text-align: center;
            }
            
            .footer p {
              font-size: 9px;
              color: #666;
              margin: 3px 0;
            }
            
            .note-text {
              font-size: 10px;
              color: #333;
              font-style: italic;
              margin-top: 6px;
              padding: 6px;
              background-color: #f9f9f9;
              border-left: 3px solid #666;
            }
            
            @media print {
              body {
                width: 148mm;
                max-width: 148mm;
              }
              
              .receipt-container {
                page-break-after: avoid;
              }
              
              table {
                page-break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            ${printContent.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Transaction Receipt</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div ref={receiptRef} className="p-8 bg-white text-black">
          {/* Header */}
          <div className="header">
            <h1>Digital Dreams</h1>
            <p>Banking Services</p>
            <p>Transaction Receipt</p>
          </div>

          {/* Transaction Info */}
          <div className="info-row">
            <div className="info-item">
              <p className="info-label">Transaction ID</p>
              <p className="info-value">{transactionId || 'N/A'}</p>
            </div>
            <div className="info-item">
              <p className="info-label">Date & Time</p>
              <p className="info-value">{formatDateTime(transactionDate)}</p>
            </div>
          </div>

          <div className="info-row">
            <div className="info-item">
              <p className="info-label">Account Holder</p>
              <p className="info-value">{account.customer?.full_name}</p>
            </div>
            <div className="info-item">
              <p className="info-label">Account Number</p>
              <p className="info-value">{account.account_number}</p>
            </div>
          </div>

          {/* Dr/Cr Ledger Format */}
          <p className="section-title">Transaction Ledger</p>
          
          {/* Ledger Table */}
          <table>
            <thead>
              <tr>
                <th>Particulars</th>
                <th className="text-right">Debit (Dr)</th>
                <th className="text-right">Credit (Cr)</th>
              </tr>
            </thead>
            <tbody>
              {/* Opening Balance */}
              <tr>
                <td>Opening Balance</td>
                <td className="text-right">
                  {formatCurrency(newBalance - (transactionType === 'deposit' ? amount : -amount))}
                </td>
                <td className="text-right"></td>
              </tr>
              
              {/* Transaction Entry */}
              <tr className="highlight-row">
                <td>
                  {transactionType === 'deposit' ? 'Cash/Transfer Received' : 'Cash/Transfer Paid'}
                  {referenceNote && (
                    <div className="note-text">
                      Note: {referenceNote}
                    </div>
                  )}
                </td>
                <td className={`text-right ${transactionType === 'withdrawal' ? 'text-danger' : ''}`}>
                  {transactionType === 'withdrawal' ? formatCurrency(amount) : '-'}
                </td>
                <td className={`text-right ${transactionType === 'deposit' ? 'text-success' : ''}`}>
                  {transactionType === 'deposit' ? formatCurrency(amount) : '-'}
                </td>
              </tr>
              
              {/* Closing Balance */}
              <tr className="total-row">
                <td>Closing Balance</td>
                <td className="text-right">
                  {formatCurrency(newBalance)}
                </td>
                <td className="text-right"></td>
              </tr>
            </tbody>
          </table>

          {/* Summary Box */}
          <div className="summary-box">
            <div className="summary-item">
              <p className="summary-label">Transaction Type</p>
              <p className={`summary-value ${
                transactionType === 'deposit' ? 'text-success' : 'text-danger'
              }`}>
                {transactionType === 'deposit' ? 'CREDIT (Cr)' : 'DEBIT (Dr)'}
              </p>
            </div>
            <div className="summary-item">
              <p className="summary-label">Amount</p>
              <p className={`summary-value ${
                transactionType === 'deposit' ? 'text-success' : 'text-danger'
              }`}>
                {formatCurrency(amount)}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            <p>This is a computer-generated receipt and does not require a signature.</p>
            <p>For any queries, please contact our customer service.</p>
            <p>Printed on: {new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Receipt
          </Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

