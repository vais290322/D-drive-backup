import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge, type LoanStatus } from "./StatusBadge";
import { Eye, Edit, FileText, Search } from "lucide-react";

interface Loan {
  id: string;
  customerId: string;
  customerName: string;
  loanType: string;
  amount: number;
  interestRate: number;
  duration: number;
  emiAmount: number;
  status: LoanStatus;
  disbursedDate?: string;
  nextEmiDate?: string;
}

export function LoansTable() {
  // TODO: remove mock data - replace with real data from API
  const [loans] = useState<Loan[]>([
    {
      id: "LN001",
      customerId: "1",
      customerName: "Rajesh Kumar",
      loanType: "Personal",
      amount: 500000,
      interestRate: 12.5,
      duration: 24,
      emiAmount: 23603,
      status: "disbursed",
      disbursedDate: "2024-01-15",
      nextEmiDate: "2024-11-15",
    },
    {
      id: "LN002",
      customerId: "2",
      customerName: "Priya Sharma",
      loanType: "Business",
      amount: 1000000,
      interestRate: 10.5,
      duration: 36,
      emiAmount: 32268,
      status: "approved",
    },
    {
      id: "LN003",
      customerId: "3",
      customerName: "Amit Patel",
      loanType: "Gold",
      amount: 250000,
      interestRate: 9.0,
      duration: 12,
      emiAmount: 21869,
      status: "verification",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.loanType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || loan.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search loans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            data-testid="input-search-loans"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="verification">Verification</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="disbursed">Disbursed</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Loan ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">EMI</TableHead>
              <TableHead className="text-center">Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLoans.map((loan) => (
              <TableRow key={loan.id} data-testid={`row-loan-${loan.id}`}>
                <TableCell className="font-mono font-medium">{loan.id}</TableCell>
                <TableCell>{loan.customerName}</TableCell>
                <TableCell>{loan.loanType}</TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(loan.amount)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatCurrency(loan.emiAmount)}
                </TableCell>
                <TableCell className="text-center">{loan.duration} months</TableCell>
                <TableCell>
                  <StatusBadge status={loan.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log("View loan:", loan.id)}
                      data-testid={`button-view-${loan.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log("Edit loan:", loan.id)}
                      data-testid={`button-edit-${loan.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log("View schedule:", loan.id)}
                      data-testid={`button-schedule-${loan.id}`}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
