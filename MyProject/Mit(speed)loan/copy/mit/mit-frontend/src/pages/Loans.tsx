import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "@/db/api";
import type { LoanWithDetails } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Eye, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; 

export default function Loans() {
  const [loans, setLoans] = useState<LoanWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();
  const [viewPhotoUrl, setViewPhotoUrl] = useState<string | null>(null);

  // console.log("all loans :", loans)

  useEffect(() => {
    loadLoans();
  }, [statusFilter, searchQuery]);

  const loadLoans = async () => {
    try {
      setLoading(true);
      let data = await api.loans.getAll();

      // Filter by status
      if (statusFilter !== "all") {
        data = data.filter(loan => loan.status === statusFilter);
      }

      // Filter by search query (loan ID or customer name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        data = data.filter(loan =>
          loan.loan_id?.toLowerCase().includes(query) ||
          loan.customer?.full_name?.toLowerCase().includes(query)
        );
      }

      setLoans(data);
    } catch (error) {
      console.error("Error loading loans:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      active: "default",
      completed: "secondary",
      defaulted: "destructive",
      closed: "secondary",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Loans</h1>
          <p className="text-muted-foreground">Manage loan applications and disbursements</p>
        </div>
        <Button onClick={() => navigate("/loans/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Loan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Loans</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="defaulted">Defaulted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by Loan ID or Customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={`skeleton-${i}`} className="h-16 w-full bg-muted" />
              ))}
            </div>
          ) : loans.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No loans found</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-[95vw] sm:w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden md:table-cell">Loan ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead className="hidden md:table-cell">Photo</TableHead>
                    <TableHead className="hidden lg:table-cell">Principal</TableHead>
                    <TableHead className="hidden xl:table-cell">Total Payable</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>EMI</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans.map((loan) => (
                    <TableRow key={loan._id}>
                      <TableCell className="font-medium hidden md:table-cell">{loan.loan_id}</TableCell>
                      <TableCell>{loan.customer?.full_name || "-"}</TableCell>
                       <TableCell className="hidden md:table-cell">
                        <Avatar
                          className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setViewPhotoUrl(loan?.customer?.photo_url?.[0]?.fileUrl || loan?.customer?.kyc_photo_url?.[0]?.fileUrl || null)}
                        >
                          <AvatarImage src={loan.customer?.photo_url?.[0]?.fileUrl || loan.customer?.kyc_photo_url?.[0]?.fileUrl || undefined} alt={loan.customer?.full_name || ""} />
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{formatCurrency(Number(loan.principal_amount))}</TableCell>
                      <TableCell className="hidden xl:table-cell">{formatCurrency(Number(loan.total_payable))}</TableCell>
                      <TableCell className="font-bold text-red-600">{formatCurrency(Number(loan.outstanding_amount || 0))}</TableCell>
                      <TableCell>{formatCurrency(Number(loan.installment_amount))}</TableCell>
                      <TableCell>{getStatusBadge(loan.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/loans/${loan._id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

         {/* Image Viewer Dialog */}
      <Dialog open={!!viewPhotoUrl} onOpenChange={(open) => !open && setViewPhotoUrl(null)}>
        <DialogContent className="max-w-3xl border-none bg-transparent shadow-none p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>View Photo</DialogTitle>
          </DialogHeader>
          <div className="relative flex items-center justify-center w-full h-full">
            {viewPhotoUrl && (
              <img
                src={viewPhotoUrl}
                alt="Customer Photo"
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-md"
              />
            )}
            <Button
              className="absolute top-2 right-2 rounded-full h-8 w-8 p-0"
              variant="secondary"
              onClick={() => setViewPhotoUrl(null)}
            >
              <span className="sr-only">Close</span>
              <span aria-hidden="true" className="text-lg">&times;</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

