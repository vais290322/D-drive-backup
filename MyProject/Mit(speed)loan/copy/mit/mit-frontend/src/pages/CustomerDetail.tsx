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
import { ArrowLeft, Edit, CheckCircle, XCircle, Eye, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { deleteImageFromBucket } from "@/services/DeleteImage";
import { useAuth } from "@/components/auth/AuthProvider";

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
  const [loading, setLoading] = useState(true);
  const [kycDialogOpen, setKycDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);


  const { profile }: any = useAuth();

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
      loadLoans();
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

  const loadLoans = async () => {
    if (!id) return;
    try {
      const allLoans = await api.loans.getAll();
      const customerLoans = allLoans.filter(loan => {
        // Handle both populated object and ID string
        const customerId = typeof loan.customer_id === 'object' && loan.customer_id !== null
          ? (loan.customer_id as any)._id
          : loan.customer_id;

        return customerId === id;
      });
      setLoans(customerLoans);
    } catch (error) {
      console.error("Error loading loans:", error);
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

  const getAllFileIds = (customer: Customer) => {
    const fields = [
      customer.photo_url,
      customer.aadhaar_front_url,
      customer.aadhaar_back_url,
      customer.pan_card_url,
      customer.voter_id_url,
      customer.driving_license_url,
      customer.other_doc_url,
    ];

    const fileIds: string[] = [];

    fields.forEach((arr: any) => {
      if (Array.isArray(arr)) {
        arr.forEach((item) => {
          if (item?.fileId) {
            fileIds.push(item.fileId);
          }
        });
      }
    });

    return fileIds;
  };

  const handleDeleteCustomer = async () => {
    if (!id || !customer) return;

    try {
      setDeleting(true);

      // 🔥 collect all fileIds
      const fileIds = getAllFileIds(customer);

      // 🔥 delete files from bucket first
      await Promise.all(
        fileIds.map((fileId) => deleteImageFromBucket(fileId))
      );

      // 🔥 then delete customer from DB
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

  const handleDownload = (url: string | null, filename: string) => {
    if (!url) return;

    // Check if it's a full URL or relative path
    const fileUrl = url.startsWith('http') ? url : `${import.meta.env.VITE_API_BASE_URL?.replace('/api', '')}${url}`;

    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = '_blank';
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="space-y-4 p-2 sm:p-0">
        <Skeleton className="h-10 w-48 sm:w-64 bg-muted" />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="shrink-0" onClick={() => navigate("/customers")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-12 w-12 sm:h-16 sm:w-16 shrink-0">
            <AvatarImage src={customer.photo_url?.[0]?.fileUrl || undefined} alt={customer.full_name} />
            <AvatarFallback className="text-lg sm:text-xl">
              {customer.full_name?.charAt(0)?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold truncate">{customer.full_name}</h1>
            <p className="text-muted-foreground text-sm flex flex-wrap items-center gap-1 mt-0.5">
              <span className="truncate">{customer.customer_code}</span>
              <span>•</span>
              {getKycBadge(customer.kyc_status)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 sm:shrink-0">
          {
            (profile.role === "super_admin" || profile.role === "admin" || profile.role === "kyc_verifier") &&
            <Button variant="outline" size="sm" className="sm:size-auto" onClick={() => navigate(`/customers/${id}/edit`)}>
              <Edit className="mr-1 sm:mr-2 h-4 w-4" />
              <span className="hidden xs:inline">Edit</span>
            </Button>
          }
          <Dialog open={kycDialogOpen} onOpenChange={setKycDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="sm:size-auto">
                <CheckCircle className="mr-1 sm:mr-2 h-4 w-4" />
                <span>Verify KYC</span>
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
          {
            (profile.role === "super_admin") &&

            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" className="sm:size-auto">
                  <Trash2 className="mr-1 sm:mr-2 h-4 w-4" />
                  <span>Delete</span>
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
          }
        </div>

      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {loans.length + (customer.manual_loan_details?.loan_id ? 1 : 0)}
            </p>
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
              {loans.filter((l) => l.status === "active").length +
                ((() => {
                  if (!customer.manual_loan_details?.loan_id) return 0;
                  const endDate = customer.manual_loan_details.emi_end_date ? new Date(customer.manual_loan_details.emi_end_date) : null;
                  const isClosed = endDate && new Date() > endDate;
                  return isClosed ? 0 : 1;
                })())}
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
              {formatCurrency(
                loans.reduce((sum, l) => sum + Number(l.principal_amount), 0) +
                (customer.manual_loan_details?.loan_amount || 0)
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <div className="overflow-x-auto pb-0.5">
          <TabsList className="w-full sm:w-auto inline-flex">
            <TabsTrigger value="personal" className="text-xs sm:text-sm px-2 sm:px-4">Personal Info</TabsTrigger>
            <TabsTrigger value="kyc" className="text-xs sm:text-sm px-2 sm:px-4">KYC Details</TabsTrigger>
            <TabsTrigger value="bank" className="text-xs sm:text-sm px-2 sm:px-4">Bank Details</TabsTrigger>
            <TabsTrigger value="loans" className="text-xs sm:text-sm px-2 sm:px-4">Loans</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="sm:col-span-2 flex items-center gap-4 pb-4 border-b">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={customer.photo_url?.[0]?.fileUrl || undefined} alt={customer.full_name} />
                  <AvatarFallback className="text-2xl">
                    {customer.full_name?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Customer Photo</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {customer.photo_url?.[0]?.fileUrl ? "Photo uploaded" : "No photo available"}
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
                <p className="text-sm font-medium text-muted-foreground">WhatsApp Number</p>
                <div className="flex items-center gap-2">
                  <p className="text-base">{customer.whatsapp_number || "-"}</p>
                  {customer.whatsapp_number && (
                    <a
                      href={`https://wa.me/${customer.whatsapp_number.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700"
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="h-5 w-5" />
                    </a>
                  )}
                </div>
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
            <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Permanent Address</p>
                <p className="text-base">{customer.permanent_address || "-"}</p>
              </div>
              <div className="sm:col-span-2">
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
              <CardTitle>KYC Documents & Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {/* Aadhaar Front */}
                <div className="border rounded-lg p-3 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Aadhaar Front</p>
                      <p className="font-mono text-sm mt-1">{customer.aadhaar_number || "-"}</p>
                    </div>
                    {customer.aadhaar_front_url && (
                      <Button variant="outline" size="sm" onClick={() => handleDownload(customer.aadhaar_front_url?.[0]?.fileUrl, 'aadhaar_front.png')}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {customer.aadhaar_front_url ? (
                    <div className="aspect-video relative rounded-md overflow-hidden bg-muted border group cursor-pointer" onClick={() => handleDownload(customer.aadhaar_front_url?.[0]?.fileUrl, 'aadhaar_front.png')}>
                      <img
                        src={customer.aadhaar_front_url?.[0]?.fileUrl}
                        alt="Aadhaar Front"
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/png?text=Image+Load+Error';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-muted/50 rounded-md border border-dashed text-muted-foreground text-xs">
                      No document
                    </div>
                  )}
                </div>

                {/* Aadhaar Back */}
                <div className="border rounded-lg p-3 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Aadhaar Back</p>
                    </div>
                    {customer.aadhaar_back_url && (
                      <Button variant="outline" size="sm" onClick={() => handleDownload(customer.aadhaar_back_url?.[0]?.fileUrl, 'aadhaar_back.png')}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {customer.aadhaar_back_url ? (
                    <div className="aspect-video relative rounded-md overflow-hidden bg-muted border group cursor-pointer" onClick={() => handleDownload(customer.aadhaar_back_url?.[0]?.fileUrl, 'aadhaar_back.png')}>
                      <img
                        src={customer.aadhaar_back_url?.[0]?.fileUrl}
                        alt="Aadhaar Back"
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/png?text=Image+Load+Error';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-muted/50 rounded-md border border-dashed text-muted-foreground text-xs">
                      No document
                    </div>
                  )}
                </div>

                {/* PAN Card */}
                <div className="border rounded-lg p-3 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">PAN Card</p>
                      <p className="font-mono text-sm mt-1">{customer.pan_number || "-"}</p>
                    </div>
                    {customer.pan_card_url && (
                      <Button variant="outline" size="sm" onClick={() => handleDownload(customer.pan_card_url?.[0]?.fileUrl, 'pan_card.png')}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {customer.pan_card_url ? (
                    <div className="aspect-video relative rounded-md overflow-hidden bg-muted border group cursor-pointer" onClick={() => handleDownload(customer.pan_card_url?.[0]?.fileUrl, 'pan_card.png')}>
                      <img
                        src={customer.pan_card_url?.[0]?.fileUrl}
                        alt="PAN Card"
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://placehold.co/600x400/png?text=Image+Load+Error';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-muted/50 rounded-md border border-dashed text-muted-foreground text-xs">
                      No document
                    </div>
                  )}
                </div>

                {/* Voter ID */}
                <div className="border rounded-lg p-3 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Voter ID</p>
                      <p className="font-mono text-sm mt-1">{customer.voter_id || "-"}</p>
                    </div>
                    {customer.voter_id_url && (
                      <Button variant="outline" size="sm" onClick={() => window.open(customer.voter_id_url?.[0]?.fileUrl, '_blank')}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {customer.voter_id_url ? (
                    <div className="aspect-video relative rounded-md overflow-hidden bg-muted border group cursor-pointer" onClick={() => window.open(customer.voter_id_url?.[0]?.fileUrl, '_blank')}>
                      <img src={customer.voter_id_url?.[0]?.fileUrl} alt="Voter ID" className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-muted/50 rounded-md border border-dashed text-muted-foreground text-xs">
                      No document
                    </div>
                  )}
                </div>

                {/* Driving License */}
                <div className="border rounded-lg p-3 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Driving License</p>
                      <p className="font-mono text-sm mt-1">{customer.driving_license || "-"}</p>
                    </div>
                    {customer.driving_license_url && (
                      <Button variant="outline" size="sm" onClick={() => window.open(customer.driving_license_url?.[0]?.fileUrl, '_blank')}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  {customer.driving_license_url ? (
                    <div className="aspect-video relative rounded-md overflow-hidden bg-muted border group cursor-pointer" onClick={() => window.open(customer.driving_license_url?.[0]?.fileUrl, '_blank')}>
                      <img src={customer.driving_license_url?.[0]?.fileUrl} alt="Driving License" className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center bg-muted/50 rounded-md border border-dashed text-muted-foreground text-xs">
                      No document
                    </div>
                  )}
                </div>

                {/* Other Document */}
                {(customer.other_doc_url || customer.other_doc_name) && (
                  <div className="border rounded-lg p-3 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">{customer.other_doc_name || "Other Document"}</p>
                        <p className="font-mono text-sm mt-1">{customer.other_doc_number || "-"}</p>
                      </div>
                      {customer.other_doc_url && (
                        <Button variant="outline" size="sm" onClick={() => window.open(customer.other_doc_url?.[0]?.fileUrl, '_blank')}>
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {customer.other_doc_url ? (
                      <div className="aspect-video relative rounded-md overflow-hidden bg-muted border group cursor-pointer" onClick={() => window.open(customer.other_doc_url?.[0]?.fileUrl, '_blank')}>
                        <img src={customer.other_doc_url?.[0]?.fileUrl} alt="Other Document" className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" />
                      </div>
                    ) : (
                      <div className="aspect-video flex items-center justify-center bg-muted/50 rounded-md border border-dashed text-muted-foreground text-xs">
                        No document
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Status Section */}
              <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Current Status</h4>
                  <div className="flex items-center gap-3">
                    {getKycBadge(customer.kyc_status)}
                    <span className="text-sm text-muted-foreground">
                      Verified on {formatDate(customer.kyc_verified_at)}
                    </span>
                  </div>
                </div>
                {customer.kyc_remarks && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Verification Remarks</h4>
                    <p className="text-sm">{customer.kyc_remarks}</p>
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
            <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2">
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
              <div className="sm:col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Branch Name</p>
                <p className="text-base">{customer.branch_name || "-"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loans" className="space-y-4">
          {customer.manual_loan_details?.loan_id && (
            <Card>
              <CardHeader>
                <CardTitle>Manual Loan Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="font-semibold text-sm text-muted-foreground">Loan Information</h4>
                      {(() => {
                        const endDate = customer.manual_loan_details.emi_end_date ? new Date(customer.manual_loan_details.emi_end_date) : null;
                        const isClosed = endDate && new Date() > endDate;
                        return (
                          <Badge variant={isClosed ? "secondary" : "default"}>
                            {isClosed ? "CLOSED" : "ACTIVE"}
                          </Badge>
                        );
                      })()}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Loan ID</p>
                        <p className="text-base">{customer.manual_loan_details.loan_id}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Agreement No</p>
                        <p className="text-base">{customer.manual_loan_details.agreement_number || "-"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Purpose</p>
                        <p className="text-base">{customer.manual_loan_details.loan_purpose || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Loan Amount</p>
                        <p className="text-base">{formatCurrency(customer.manual_loan_details.loan_amount || 0)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Interest Rate</p>
                        <p className="text-base">{customer.manual_loan_details.interest_rate}%</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">EMI Amount</p>
                        <p className="text-base">{formatCurrency(customer.manual_loan_details.emi_amount || 0)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                        <p className="text-base">{formatDate(customer.manual_loan_details.emi_start_date)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">End Date</p>
                        <p className="text-base">{formatDate(customer.manual_loan_details.emi_end_date)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-muted-foreground border-b pb-2">Item Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Item Name</p>
                        <p className="text-base">{customer.manual_loan_details.item_name || "-"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Serial No</p>
                        <p className="text-base">{customer.manual_loan_details.item_serial_number || "-"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Description</p>
                        <p className="text-base">{customer.manual_loan_details.item_description || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Loan History</CardTitle>
            </CardHeader>
            <CardContent>
              {loans.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No loans found</p>
              ) : (
                <div className="overflow-x-auto w-[95vw] sm:w-full">
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
                        <TableRow key={loan._id}>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
