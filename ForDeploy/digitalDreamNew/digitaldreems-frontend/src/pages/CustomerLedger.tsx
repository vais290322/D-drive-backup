import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { api } from "@/db/api";
import { ArrowLeft, Printer, Download, Phone, Mail, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import * as XLSX from 'xlsx';

export default function CustomerLedger() {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [ledgerData, setLedgerData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customerId) {
      loadLedger();
    }
  }, [customerId]);

  const loadLedger = async () => {
    try {
      setLoading(true);
      const data = await api.customers.getLedger(customerId!);
      setLedgerData(data);
    } catch (error) {
      console.error("Error loading customer ledger:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadExcel = () => {
    if (!ledgerData) return;

    const workbook = XLSX.utils.book_new();

    // Customer Summary Sheet
    const summaryData = [
      ['Customer Ledger Report'],
      [''],
      ['Customer Code', ledgerData.customer.customer_code],
      ['Customer Name', ledgerData.customer.full_name],
      ['Mobile', ledgerData.customer.mobile_primary],
      ['Email', ledgerData.customer.email || '-'],
      [''],
      ['Financial Summary'],
      ['Total Disbursed', ledgerData.totalDisbursed],
      ['Total Paid', ledgerData.totalPaid],
      ['Total Outstanding', ledgerData.totalOutstanding],
      [''],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Loans Sheet
    const loansData: any[] = [
      ['Loan ID', 'Product', 'Principal', 'Interest', 'Total Amount', 'Paid', 'Outstanding', 'Status'],
    ];

    ledgerData.loans.forEach((loanDetail: any) => {
      loansData.push([
        loanDetail.loan.loan_id,
        loanDetail.product?.model || '-',
        loanDetail.loan.principal_amount,
        loanDetail.loan.total_interest,
        loanDetail.loan.total_payable_amount,
        loanDetail.summary.totalPaid,
        loanDetail.summary.totalOutstanding,
        loanDetail.loan.status,
      ]);
    });

    const loansSheet = XLSX.utils.aoa_to_sheet(loansData);
    XLSX.utils.book_append_sheet(workbook, loansSheet, 'Loans');

    // Payments Sheet
    const paymentsData: any[] = [
      ['Date', 'Loan ID', 'Amount', 'Mode', 'Reference'],
    ];

    ledgerData.loans.forEach((loanDetail: any) => {
      loanDetail.payments.forEach((payment: any) => {
        paymentsData.push([
          payment.payment_date,
          loanDetail.loan.loan_id,
          payment.amount_paid,
          payment.payment_mode,
          payment.transaction_reference || '-',
        ]);
      });
    });

    const paymentsSheet = XLSX.utils.aoa_to_sheet(paymentsData);
    XLSX.utils.book_append_sheet(workbook, paymentsSheet, 'Payments');

    // Download
    XLSX.writeFile(workbook, `Customer_Ledger_${ledgerData.customer.customer_code}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      completed: "secondary",
      defaulted: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-full bg-muted" />
        <Skeleton className="h-64 w-full bg-muted" />
        <Skeleton className="h-96 w-full bg-muted" />
      </div>
    );
  }

  if (!ledgerData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Customer not found</p>
        <Button onClick={() => navigate('/customers')} className="mt-4">
          Back to Customers
        </Button>
      </div>
    );
  }

  const { customer, loans, totalDisbursed, totalPaid, totalOutstanding } = ledgerData;

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 10mm;
          }
          
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:block {
            display: block !important;
          }
          
          .break-inside-avoid {
            break-inside: avoid;
            page-break-inside: avoid;
          }
          
          /* Compact spacing for print */
          .print\\:space-y-2 > * + * {
            margin-top: 0.5rem !important;
          }
          
          .print\\:text-xs {
            font-size: 0.65rem !important;
            line-height: 1rem !important;
          }
          
          .print\\:text-sm {
            font-size: 0.75rem !important;
            line-height: 1.25rem !important;
          }
          
          .print\\:py-1 {
            padding-top: 0.25rem !important;
            padding-bottom: 0.25rem !important;
          }
          
          .print\\:px-2 {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
          }
          
          .print\\:gap-2 {
            gap: 0.5rem !important;
          }
          
          /* Hide shadows and borders for cleaner print */
          * {
            box-shadow: none !important;
          }
          
          table {
            font-size: 0.7rem !important;
          }
          
          th, td {
            padding: 0.25rem 0.5rem !important;
          }
        }
      `}</style>

      <div className="space-y-6 print:space-y-2">
        {/* Header - Hide on print */}
        <div className="flex items-center justify-between print:hidden">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/customers')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Customer Ledger</h1>
              <p className="text-muted-foreground">Complete financial statement</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadExcel}>
              <Download className="mr-2 h-4 w-4" />
              Download Excel
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>

        {/* Print Header - Show only on print */}
        <div className="hidden print:block text-center mb-4">
          <h1 className="text-xl font-bold">Digital Dreams</h1>
          <p className="text-sm text-muted-foreground">Customer Ledger Report</p>
          <p className="text-xs text-muted-foreground">
            Generated on: {new Date().toLocaleString()}
          </p>
        </div>

        {/* Customer Information */}
        <Card className="print:border print:shadow-none">
          <CardHeader className="print:py-1 print:px-2">
            <CardTitle className="print:text-sm">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="print:py-1 print:px-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-3 print:gap-2">
              <div>
                <p className="text-sm text-muted-foreground print:text-xs">Customer Code</p>
                <p className="font-semibold text-lg print:text-sm">{customer.customer_code}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground print:text-xs">Full Name</p>
                <p className="font-semibold text-lg print:text-sm">{customer.full_name}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground print:hidden" />
                <div>
                  <p className="text-sm text-muted-foreground print:text-xs">Mobile</p>
                  <p className="font-medium print:text-sm">{customer.mobile_primary}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card className="print:border print:shadow-none">
          <CardHeader className="print:py-1 print:px-2">
            <CardTitle className="print:text-sm">Financial Summary</CardTitle>
          </CardHeader>
          <CardContent className="print:py-1 print:px-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3 print:gap-2">
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg print:py-1 print:px-2">
                <p className="text-sm text-muted-foreground mb-1 print:text-xs">Total Disbursed</p>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 print:text-sm">
                  {formatCurrency(totalDisbursed)}
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg print:py-1 print:px-2">
                <p className="text-sm text-muted-foreground mb-1 print:text-xs">Total Paid</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 print:text-sm">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg print:py-1 print:px-2">
                <p className="text-sm text-muted-foreground mb-1 print:text-xs">Total Outstanding</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 print:text-sm">
                  {formatCurrency(totalOutstanding)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loans Details */}
        {loans.map((loanDetail: any, index: number) => (
          <Card key={loanDetail.loan.id} className="break-inside-avoid print:border print:shadow-none">
            <CardHeader className="print:py-1 print:px-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg print:text-sm">
                  Loan #{index + 1} - {loanDetail.loan.loan_id}
                </CardTitle>
                {getStatusBadge(loanDetail.loan.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 print:space-y-2 print:py-1 print:px-2">
              {/* Loan Basic Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
                <div>
                  <p className="text-sm text-muted-foreground print:text-xs">Product</p>
                  <p className="font-medium print:text-xs">
                    {loanDetail.product
                      ? `${loanDetail.product.brand} ${loanDetail.product.model}`
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground print:text-xs">Loan Type</p>
                  <p className="font-medium print:text-xs">{loanDetail.loan.loan_type?.toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground print:text-xs">Start Date</p>
                  <p className="font-medium print:text-xs">
                    {new Date(loanDetail.loan.start_date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground print:text-xs">Tenure</p>
                  <p className="font-medium print:text-xs">{loanDetail.loan.tenure_months} months</p>
                </div>
              </div>

              {/* Loan Financial Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg print:grid-cols-4 print:gap-2 print:py-1 print:px-2">
                <div>
                  <p className="text-sm text-muted-foreground print:text-xs">Principal</p>
                  <p className="font-semibold print:text-xs">{formatCurrency(loanDetail.loan.principal_amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground print:text-xs">Interest</p>
                  <p className="font-semibold print:text-xs">{formatCurrency(loanDetail.loan.total_interest)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground print:text-xs">Total Payable</p>
                  <p className="font-bold text-lg print:text-xs">
                    {formatCurrency(loanDetail.loan.total_payable_amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground print:text-xs">Outstanding</p>
                  <p className="font-bold text-lg text-orange-600 print:text-xs">
                    {formatCurrency(loanDetail.summary.totalOutstanding)}
                  </p>
                </div>
              </div>

              {/* Payment History - Compact for print */}
              {loanDetail.payments.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 print:text-xs print:mb-1">Payment History</h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="print:text-xs">Date</TableHead>
                          <TableHead className="print:text-xs">Amount</TableHead>
                          <TableHead className="print:text-xs">Mode</TableHead>
                          <TableHead className="print:hidden">Reference</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loanDetail.payments.map((payment: any) => (
                          <TableRow key={payment.id}>
                            <TableCell className="print:text-xs">
                              {new Date(payment.payment_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="font-medium print:text-xs">
                              {formatCurrency(payment.amount_paid)}
                            </TableCell>
                            <TableCell className="print:text-xs">
                              <Badge variant="outline" className="print:text-xs">{payment.payment_mode}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground print:hidden">
                              {payment.transaction_reference || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {loans.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No loans found for this customer</p>
            </CardContent>
          </Card>
        )}

        {/* Footer - Show only on print */}
        <div className="hidden print:block text-center text-xs text-muted-foreground mt-4 pt-2 border-t">
          <p>This is a computer-generated document. No signature required.</p>
          <p className="mt-1">Digital Dreams - Loan Management System</p>
        </div>
      </div>
    </>
  );
}

