import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "@/db/api";
import type { Customer } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Eye, Edit, Phone, FileCheck, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import KYCVerificationDialog from "@/components/KYCVerificationDialog";

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kycDialogOpen, setKycDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
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
                    <TableHead>Customer Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>KYC Status</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.customer_code}
                      </TableCell>
                      <TableCell>{customer.full_name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {customer.mobile_primary}
                        </div>
                      </TableCell>
                      <TableCell>{getKycBadge(customer.kyc_status)}</TableCell>
                      <TableCell>{customer.city || "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
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
                            onClick={() => handleKYCVerification(customer)}
                            title="Verify KYC"
                          >
                            <FileCheck className="h-4 w-4" />
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
    </div>
  );
}

