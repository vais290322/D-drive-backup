import { useState } from "react";
import { PaymentForm } from "@/components/PaymentForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Download, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Payments() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // TODO: remove mock data - replace with real data from API
  const payments = [
    {
      id: "PAY001",
      date: "2024-10-05",
      loanId: "LN001",
      customerName: "Rajesh Kumar",
      amount: 23603,
      method: "UPI",
      status: "paid" as const,
    },
    {
      id: "PAY002",
      date: "2024-10-03",
      loanId: "LN002",
      customerName: "Priya Sharma",
      amount: 32268,
      method: "Bank Transfer",
      status: "paid" as const,
    },
    {
      id: "PAY003",
      date: "2024-09-28",
      loanId: "LN003",
      customerName: "Amit Patel",
      amount: 21869,
      method: "Cash",
      status: "paid" as const,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Payment Processing</h1>
          <p className="text-sm text-muted-foreground">
            Record and manage EMI payments
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-record-payment">
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
            </DialogHeader>
            <PaymentForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Loan ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id} data-testid={`row-payment-${payment.id}`}>
                    <TableCell className="font-mono font-medium">
                      {payment.id}
                    </TableCell>
                    <TableCell>{formatDate(payment.date)}</TableCell>
                    <TableCell className="font-mono">{payment.loanId}</TableCell>
                    <TableCell>{payment.customerName}</TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>
                      <StatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log("Download receipt:", payment.id)}
                        data-testid={`button-download-${payment.id}`}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Receipt
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
