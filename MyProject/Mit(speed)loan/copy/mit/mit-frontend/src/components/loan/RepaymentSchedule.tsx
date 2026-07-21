import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { EmiSchedule } from "@/types/types";
import { format } from "date-fns";
import { Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";

interface RepaymentScheduleProps {
  schedule: EmiSchedule[];
  emiDayOfMonth: number;
}

export function RepaymentSchedule({ schedule, emiDayOfMonth }: RepaymentScheduleProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusBadge = (status: EmiSchedule['status']) => {
    switch (status) {
      case 'paid':
        return (
          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 hover:bg-blue-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case 'overdue':
        return (
          <Badge className="bg-red-500/10 text-red-700 dark:text-red-400 hover:bg-red-500/20">
            <AlertCircle className="h-3 w-3 mr-1" />
            Overdue
          </Badge>
        );
      case 'partial':
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Partial
          </Badge>
        );
      default:
        return null;
    }
  };

  const totalPrincipal = schedule.reduce((sum, emi) => sum + emi.principal_component, 0);
  const totalInterest = schedule.reduce((sum, emi) => sum + emi.interest_component, 0);
  const totalAmount = schedule.reduce((sum, emi) => sum + emi.emi_amount, 0);
  const totalPaid = schedule.reduce((sum, emi) => sum + emi.paid_amount, 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Repayment Schedule
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              EMI due on <span className="font-semibold">{emiDayOfMonth}{emiDayOfMonth === 1 ? 'st' : emiDayOfMonth === 2 ? 'nd' : emiDayOfMonth === 3 ? 'rd' : 'th'}</span> of every month
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total EMIs</p>
            <p className="text-2xl font-bold">{schedule.length}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto w-[95vw] sm:w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">EMI #</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Principal</TableHead>
                <TableHead className="text-right">Interest</TableHead>
                <TableHead className="text-right">EMI Amount</TableHead>
                <TableHead className="text-right">Opening Balance</TableHead>
                <TableHead className="text-right">Closing Balance</TableHead>
                <TableHead className="text-right">Paid Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((emi) => (
                <TableRow key={emi.id}>
                  <TableCell className="font-medium">#{emi.emi_number}</TableCell>
                  <TableCell>{format(new Date(emi.due_date), "dd MMM yyyy")}</TableCell>
                  <TableCell className="text-right">{formatCurrency(emi.principal_component)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(emi.interest_component)}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(emi.emi_amount)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(emi.opening_balance)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{formatCurrency(emi.closing_balance)}</TableCell>
                  <TableCell className="text-right">
                    {emi.paid_amount > 0 ? formatCurrency(emi.paid_amount) : "-"}
                  </TableCell>
                  <TableCell>{getStatusBadge(emi.status)}</TableCell>
                  <TableCell>
                    {emi.paid_date ? format(new Date(emi.paid_date), "dd MMM yyyy") : "-"}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-semibold">
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell className="text-right">{formatCurrency(totalPrincipal)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalInterest)}</TableCell>
                <TableCell className="text-right">{formatCurrency(totalAmount)}</TableCell>
                <TableCell colSpan={2}></TableCell>
                <TableCell className="text-right">{formatCurrency(totalPaid)}</TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Principal</p>
              <p className="text-2xl font-bold">{formatCurrency(totalPrincipal)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Interest</p>
              <p className="text-2xl font-bold">{formatCurrency(totalInterest)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Payable</p>
              <p className="text-2xl font-bold">{formatCurrency(totalAmount)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Total Paid</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(totalPaid)}</p>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}
