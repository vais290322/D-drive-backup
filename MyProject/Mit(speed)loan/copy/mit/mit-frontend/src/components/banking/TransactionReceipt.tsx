import { useRef, useEffect, useState } from 'react';
import { X, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/currency';
import { getBusinessSettings } from '@/db/settingsApi';
import type { BankAccountWithCustomer, BusinessSettings } from '@/types/types';

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
  const [settings, setSettings] = useState<BusinessSettings | null>(null);

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const loadSettings = async () => {
    try {
      const data = await getBusinessSettings();
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handlePrint = () => {
    const printContent = receiptRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    const companyName = settings?.company_name || 'Mit Electro World Banking';
    const companyAddress = [
      settings?.address_line1,
      settings?.city,
      settings?.state,
      settings?.pincode
    ].filter(Boolean).join(', ');

    printWindow.document.write(`
      <html>
        <head>
          <title>${transactionType === 'deposit' ? 'Deposit' : 'Withdrawal'} Receipt - ${transactionId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Arial', sans-serif; 
              font-size: 14px; 
              color: #000; 
              margin: 0;
              padding: 20mm;
              line-height: 1.5;
            }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
            .header h1 { font-size: 24px; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; }
            .header p { font-size: 14px; color: #333; margin: 2px 0; }
            .grid { display: flex; justify-content: space-between; margin-bottom: 15px; }
            .label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
            .value { font-weight: 600; font-size: 14px; }
            
            .section-box { margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; border-radius: 4px; }
            
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th { text-align: left; font-size: 12px; border-bottom: 2px solid #000; padding: 10px 5px; text-transform: uppercase; }
            td { font-size: 14px; padding: 10px 5px; border-bottom: 1px solid #eee; }
            .text-right { text-align: right; }
            .total-row td { border-top: 2px solid #000; font-weight: bold; font-size: 16px; padding-top: 15px; }
            
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ccc; padding-top: 15px; }
            .note { background: #f9f9f9; padding: 10px; font-style: italic; font-size: 13px; margin-top: 15px; border-left: 4px solid #ccc; }
            
            @media print {
              body { 
                margin: 0;
                padding: 15mm;
                -webkit-print-color-adjust: exact; 
              }
              @page {
                size: auto;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${companyName}</h1>
            <p>${companyAddress}</p>
            <p style="margin-top: 10px; font-weight: bold; font-size: 16px;">TRANSACTION RECEIPT</p>
          </div>
          
          <div class="section-box">
            <div class="grid">
              <div><div class="label">Transaction Date</div><div class="value">${new Date(transactionDate).toLocaleString()}</div></div>
              <div style="text-align:right"><div class="label">Transaction ID</div><div class="value">${transactionId || 'N/A'}</div></div>
            </div>
            <div class="grid">
               <div><div class="label">Customer Name</div><div class="value">${account.customer?.full_name}</div></div>
               <div style="text-align:right"><div class="label">Account Number</div><div class="value">${account.account_number}</div></div>
            </div>
          </div>

          <table>
            <thead><tr><th>Description</th><th class="text-right">Amount</th></tr></thead>
            <tbody>
              <tr><td>Opening Balance</td><td class="text-right">${formatCurrency(newBalance - (transactionType === 'deposit' ? amount : -amount))}</td></tr>
              <tr>
                <td>
                    <b>${transactionType === 'deposit' ? 'DEPOSIT' : 'WITHDRAWAL'}</b>
                    <div style="font-size:11px; color:#666; margin-top:2px;">Cash / Transfer</div>
                </td>
                <td class="text-right"><b>${transactionType === 'deposit' ? '+' : '-'}${formatCurrency(amount)}</b></td>
              </tr>
              <tr class="total-row"><td>Closing Balance</td><td class="text-right">${formatCurrency(newBalance)}</td></tr>
            </tbody>
          </table>

            ${referenceNote ? `<div class="note">Note: ${referenceNote}</div>` : ''}

          <div class="footer">
            <p>This is a computer generated receipt and does not require a physical signature.</p>
            <p style="margin-top: 5px;">${settings?.website || ''}</p>
            <p style="margin-top: 2px;">${settings?.email || ''} | ${settings?.phone || ''}</p>
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
      <DialogContent className="max-w-md sm:max-w-[400px]">
        <DialogHeader className="pb-2 border-b">
          <DialogTitle className="flex items-center justify-between text-base">
            <span>Transaction Success</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div ref={receiptRef} className="p-4 bg-white text-sm">
          <div className="text-center mb-4">
            <div className="bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Printer className="h-6 w-6" />
            </div>
            <h2 className="font-bold text-lg">{formatCurrency(amount)}</h2>
            <p className="text-muted-foreground text-xs uppercase tracking-wider">{transactionType} Successful</p>
            {settings && <p className="text-xs font-semibold mt-1">{settings.company_name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm border p-3 rounded-lg bg-slate-50">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Date</p>
              <p className="font-medium">{new Date(transactionDate).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase">Time</p>
              <p className="font-medium">{new Date(transactionDate).toLocaleTimeString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Customer</p>
              <p className="font-medium truncate">{account.customer?.full_name}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase">Account</p>
              <p className="font-medium">{account.account_number}</p>
            </div>
            <div className="col-span-2 border-t pt-2 mt-1 flex justify-between items-center">
              <p className="text-xs text-muted-foreground uppercase">Updated Balance</p>
              <p className="font-bold text-primary">{formatCurrency(newBalance)}</p>
            </div>
          </div>

          {referenceNote && (
            <div className="mt-3 text-xs bg-yellow-50 p-2 rounded border border-yellow-100 text-yellow-800">
              <span className="font-semibold">Note:</span> {referenceNote}
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-[10px] text-muted-foreground">
              {settings?.address_line1} {settings?.city}
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-center p-4 pt-0">
          <Button variant="outline" size="sm" className="flex-1" onClick={handlePrint}>
            <Printer className="mr-2 h-3 w-3" /> Print
          </Button>
          <Button size="sm" className="flex-1" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
