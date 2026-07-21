import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "@/db/api";
import type { Customer } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, Edit, Phone, FileCheck, BookOpen, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import KYCVerificationDialog from "@/components/KYCVerificationDialog";
import CallTrackingDialog from "@/components/CallTrackingDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kycDialogOpen, setKycDialogOpen] = useState(false);
  const [callDialogOpen, setCallDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewPhotoUrl, setViewPhotoUrl] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      let data = await api.customers.getAll();
      if (search) {
        data = await api.customers.search(search);
      }
      setCustomers(data);
    } catch (error) {
      console.error("Error loading customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const getKycBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      verified: "default",
      pending: "secondary",
      rejected: "destructive",
    };
    return (
      <Badge variant={variants[status] || "secondary"}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const handleKYCVerification = (customer: Customer) => {
    setSelectedCustomer(customer);
    setKycDialogOpen(true);
  };

  const handleCallTracking = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCallDialogOpen(true);
  };

  const handleViewLedger = (customerId: string) => {
    navigate(`/customers/${customerId}/ledger`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage customer information and KYC</p>
        </div>
        <Button onClick={() => navigate("/customers/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, mobile, or customer code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
          ) : customers.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No customers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden md:table-cell">Photo</TableHead>
                    <TableHead className="hidden lg:table-cell">Customer Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead className="hidden md:table-cell">City</TableHead>
                    <TableHead className="hidden lg:table-cell">Next Followup</TableHead>
                    <TableHead className="hidden xl:table-cell">Feedback</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="hidden md:table-cell">
                        <Avatar
                          className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setViewPhotoUrl(customer.photo_url || customer.kyc_photo_url || null)}
                        >
                          <AvatarImage src={customer.photo_url || customer.kyc_photo_url || undefined} alt={customer.full_name} />
                          <AvatarFallback>
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium hidden lg:table-cell">
                        {customer.customer_code}
                      </TableCell>
                      <TableCell>{customer.full_name}</TableCell>
                      <TableCell>
                        <div
                          className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
                          onClick={() => {
                            window.location.href = `tel:${customer.mobile_primary}`;
                            handleCallTracking(customer);
                          }}
                          title="Click to call and log"
                        >
                          <Phone className="h-4 w-4" />
                          {customer.mobile_primary}
                        </div>
                      </TableCell>
                      <TableCell>{getKycBadge(customer.kyc_status)}</TableCell>
                      <TableCell className="hidden md:table-cell">{customer.city || "-"}</TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {customer.next_followup_date ? (
                          <div className="text-sm">
                            <div className="font-medium">
                              {new Date(customer.next_followup_date).toLocaleDateString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {customer.feedback ? (
                          <div className="text-sm max-w-xs truncate" title={customer.feedback}>
                            {customer.feedback}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCallTracking(customer)}
                            title="Call Tracking"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewLedger(customer.id)}
                            title="View Ledger"
                          >
                            <BookOpen className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/customers/${customer.id}`)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/customers/${customer.id}/edit`)}
                            title="Edit Customer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* KYC Verification Dialog */}
      {selectedCustomer && (
        <KYCVerificationDialog
          customer={selectedCustomer}
          open={kycDialogOpen}
          onOpenChange={setKycDialogOpen}
          onVerified={loadCustomers}
        />
      )}

      {/* Call Tracking Dialog */}
      {selectedCustomer && (
        <CallTrackingDialog
          customer={selectedCustomer}
          open={callDialogOpen}
          onOpenChange={setCallDialogOpen}
          onSuccess={loadCustomers}
        />
      )}

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

