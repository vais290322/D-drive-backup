import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { api, deleteCustomer } from "@/db/api";
import type { Customer, LoanWithDetails, KycStatus } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit, CheckCircle, XCircle, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const kycSchema = z.object({
  status: z.string().min(1, "Status is required"),
  remarks: z.string().optional(),
});

type KycFormData = z.infer<typeof kycSchema>;

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loans, setLoans] = useState<LoanWithDetails[]>([]);
  const [stats, setStats] = useState({
    totalOutstanding: 0,
    totalDisbursed: 0,
    totalPaid: 0,
  });
  const [loading, setLoading] = useState(true);
  const [kycDialogOpen, setKycDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const kycForm = useForm<KycFormData>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      status: "",
      remarks: "",
    },
  });

  useEffect(() => {
    if (id) {
      loadCustomer();
      loadLedgerData();
    }
  }, [id]);

  const loadCustomer = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.customers.get(id);
      setCustomer(data);
      if (data) {
        kycForm.setValue("status", data.kyc_status);
        kycForm.setValue("remarks", data.kyc_remarks || "");
      }
    } catch (error) {
      console.error("Error loading customer:", error);
      toast.error("Failed to load customer");
    } finally {
      setLoading(false);
    }
  };

  const loadLedgerData = async () => {
    if (!id) return;
    try {
      const ledger = await api.customers.getLedger(id);

      // Map ledger loans to LoanWithDetails structure
      const mappedLoans = ledger.loans.map(item => ({
        ...item.loan,
        product: item.product,
        // We can add other details if needed
      }));

      setLoans(mappedLoans);
      setStats({
        totalOutstanding: ledger.totalOutstanding,
        totalDisbursed: ledger.totalDisbursed,
        totalPaid: ledger.totalPaid,
      });
    } catch (error) {
      console.error("Error loading ledger:", error);
      toast.error("Failed to load loan history");
    }
  };

  const handleKycVerification = async (data: KycFormData) => {
    if (!id) return;
    try {
      setSubmitting(true);
      await api.customers.update(id, {
        kyc_status: data.status as KycStatus,
        kyc_remarks: data.remarks,
      });
      toast.success("KYC status updated successfully");
      setKycDialogOpen(false);
      loadCustomer();
    } catch (error) {
      console.error("Error updating KYC:", error);
      toast.error("Failed to update KYC status");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!id) return;
    try {
      setDeleting(true);
      const result = await deleteCustomer(id);
      if (result.success) {
        toast.success(result.message);
        navigate("/customers");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Failed to delete customer");
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
    }
  };

  const getKycBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      verified: "default",
      pending: "secondary",
      rejected: "destructive",
    };
    const icons: Record<string, typeof CheckCircle> = {
      verified: CheckCircle,
      pending: Eye,
      rejected: XCircle,
    };
    const Icon = icons[status] || Eye;
    return (
      <Badge variant={variants[status] || "secondary"} className="gap-1">
        <Icon className="h-3 w-3" />
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

  const formatDate = (date: string | null) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 bg-muted" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={`skeleton-${i}`} className="h-32 w-full bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Customer not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate("/customers")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-16 w-16">
            <AvatarImage src={customer.photo_url || undefined} alt={customer.full_name} />
            <AvatarFallback className="text-xl">
              {customer.full_name?.charAt(0)?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{customer.full_name}</h1>
            <p className="text-muted-foreground">
              {customer.customer_code} • {getKycBadge(customer.kyc_status)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/customers/${id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Dialog open={kycDialogOpen} onOpenChange={setKycDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <CheckCircle className="mr-2 h-4 w-4" />
                Verify KYC
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>KYC Verification</DialogTitle>
              </DialogHeader>
              <Form {...kycForm}>
                <form onSubmit={kycForm.handleSubmit(handleKycVerification)} className="space-y-4">
                  <FormField
                    control={kycForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="verified">Verified</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={kycForm.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remarks</FormLabel>
                        <FormControl>
                          <Textarea {...field} placeholder="Enter verification remarks" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setKycDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Updating..." : "Update Status"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Customer</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this customer? This action cannot be undone.
                  {loans.length > 0 && (
                    <span className="block mt-2 text-destructive font-medium">
                      Warning: This customer has {loans.length} active loan(s). Deletion will be prevented if there are active loans.
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteCustomer} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete Customer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{loans.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {loans.filter((l) => l.status === "active").length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Disbursed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(stats.totalDisbursed)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Outstanding
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">
              {formatCurrency(stats.totalOutstanding)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="kyc">KYC Details</TabsTrigger>
          <TabsTrigger value="bank">Bank Details</TabsTrigger>
          <TabsTrigger value="loans">Loans</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2 flex items-center gap-4 pb-4 border-b">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={customer.photo_url || undefined} alt={customer.full_name} />
                  <AvatarFallback className="text-2xl">
                    {customer.full_name?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer Photo</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {customer.photo_url ? "Photo uploaded" : "No photo available"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                <p className="text-base">{customer.full_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Father's Name</p>
                <p className="text-base">{customer.father_name || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mother's Name</p>
                <p className="text-base">{customer.mother_name || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Spouse Name</p>
                <p className="text-base">{customer.spouse_name || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                <p className="text-base">{formatDate(customer.date_of_birth)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Gender</p>
                <p className="text-base capitalize">{customer.gender || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Marital Status</p>
                <p className="text-base capitalize">{customer.marital_status || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nationality</p>
                <p className="text-base">{customer.nationality || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Primary Mobile</p>
                <p className="text-base">{customer.mobile_primary}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Secondary Mobile</p>
                <p className="text-base">{customer.mobile_secondary || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base">{customer.email || "-"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Permanent Address</p>
                <p className="text-base">{customer.permanent_address || "-"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Current Address</p>
                <p className="text-base">{customer.current_address || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">City</p>
                <p className="text-base">{customer.city || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">District</p>
                <p className="text-base">{customer.district || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">State</p>
                <p className="text-base">{customer.state || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">PIN Code</p>
                <p className="text-base">{customer.pin_code || "-"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>KYC Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {customer.kyc_photo_url && (
                <div className="md:col-span-2 flex items-center gap-4 pb-4 border-b">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={customer.kyc_photo_url} alt="KYC Verification Photo" />
                    <AvatarFallback className="text-2xl">
                      {customer.full_name?.charAt(0)?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Live Verification Photo</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Captured during KYC verification
                    </p>
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground">Aadhaar Number</p>
                <p className="text-base">{customer.aadhaar_number || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">PAN Number</p>
                <p className="text-base">{customer.pan_number || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Voter ID</p>
                <p className="text-base">{customer.voter_id || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Driving License</p>
                <p className="text-base">{customer.driving_license || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">KYC Status</p>
                <p className="text-base">{getKycBadge(customer.kyc_status)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Verified At</p>
                <p className="text-base">{formatDate(customer.kyc_verified_at)}</p>
              </div>
              {customer.kyc_remarks && (
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Remarks</p>
                  <p className="text-base">{customer.kyc_remarks}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Uploaded Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {customer.aadhaar_front_url && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Aadhaar Front</p>
                    <img
                      src={customer.aadhaar_front_url}
                      alt="Aadhaar Front"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
                {customer.aadhaar_back_url && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Aadhaar Back</p>
                    <img
                      src={customer.aadhaar_back_url}
                      alt="Aadhaar Back"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
                {customer.pan_card_url && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">PAN Card</p>
                    <img
                      src={customer.pan_card_url}
                      alt="PAN Card"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
                {customer.address_proof_url && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Address Proof</p>
                    <img
                      src={customer.address_proof_url}
                      alt="Address Proof"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
                {customer.signature_url && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Signature</p>
                    <img
                      src={customer.signature_url}
                      alt="Signature"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
                {customer.cancelled_cheque_url && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Cancelled Cheque</p>
                    <img
                      src={customer.cancelled_cheque_url}
                      alt="Cancelled Cheque"
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  </div>
                )}
                {!customer.aadhaar_front_url && !customer.aadhaar_back_url && !customer.pan_card_url &&
                  !customer.address_proof_url && !customer.signature_url && !customer.cancelled_cheque_url && (
                    <div className="md:col-span-2 py-8 text-center text-muted-foreground">
                      No documents uploaded yet
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bank" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bank Name</p>
                <p className="text-base">{customer.bank_name || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Holder Name</p>
                <p className="text-base">{customer.account_holder_name || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Number</p>
                <p className="text-base">{customer.account_number || "-"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">IFSC Code</p>
                <p className="text-base">{customer.ifsc_code || "-"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Branch Name</p>
                <p className="text-base">{customer.branch_name || "-"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans">
          <Card>
            <CardHeader>
              <CardTitle>Loan History</CardTitle>
            </CardHeader>
            <CardContent>
              {loans.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No loans found</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Loan ID</TableHead>
                        <TableHead>Principal</TableHead>
                        <TableHead>Total Payable</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loans.map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell className="font-medium">{loan.loan_id}</TableCell>
                          <TableCell>{formatCurrency(Number(loan.principal_amount))}</TableCell>
                          <TableCell>{formatCurrency(Number(loan.total_payable))}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                loan.status === "active"
                                  ? "default"
                                  : loan.status === "completed"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {loan.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/loans/${loan.id}`)}
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
        </TabsContent>
      </Tabs>
    </div>
  );
}

