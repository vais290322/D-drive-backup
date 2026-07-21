import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, type PaymentStatus } from "./StatusBadge";

interface EMIInstallment {
  emiNumber: number;
  dueDate: string;
  emiAmount: number;
  principal: number;
  interest: number;
  balance: number;
  status: PaymentStatus;
  paidDate?: string;
}

export function EMISchedule() {
  // TODO: remove mock data - replace with real data from API
  const schedule: EMIInstallment[] = [
    {
      emiNumber: 1,
      dueDate: "2024-02-15",
      emiAmount: 23603,
      principal: 18395,
      interest: 5208,
      balance: 481605,
      status: "paid",
      paidDate: "2024-02-14",
    },
    {
      emiNumber: 2,
      dueDate: "2024-03-15",
      emiAmount: 23603,
      principal: 18587,
      interest: 5016,
      balance: 463018,
      status: "paid",
      paidDate: "2024-03-15",
    },
    {
      emiNumber: 3,
      dueDate: "2024-04-15",
      emiAmount: 23603,
      principal: 18781,
      interest: 4822,
      balance: 444237,
      status: "paid",
      paidDate: "2024-04-12",
    },
    {
      emiNumber: 4,
      dueDate: "2024-05-15",
      emiAmount: 23603,
      principal: 18977,
      interest: 4626,
      balance: 425260,
      status: "pending",
    },
    {
      emiNumber: 5,
      dueDate: "2024-06-15",
      emiAmount: 23603,
      principal: 19175,
      interest: 4428,
      balance: 406085,
      status: "pending",
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
    <Card>
      <CardHeader>
        <CardTitle>EMI Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">EMI #</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">EMI Amount</TableHead>
                <TableHead className="text-right">Principal</TableHead>
                <TableHead className="text-right">Interest</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((emi) => (
                <TableRow key={emi.emiNumber} data-testid={`row-emi-${emi.emiNumber}`}>
                  <TableCell className="text-center font-medium">
                    {emi.emiNumber}
                  </TableCell>
                  <TableCell>{formatDate(emi.dueDate)}</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(emi.emiAmount)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(emi.principal)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(emi.interest)}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(emi.balance)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={emi.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {emi.paidDate ? formatDate(emi.paidDate) : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
