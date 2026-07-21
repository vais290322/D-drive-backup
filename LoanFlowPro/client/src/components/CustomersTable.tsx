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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Edit, Trash2, Search } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  pan: string;
  aadhaar: string;
  activeLoans: number;
}

export function CustomersTable() {
  // TODO: remove mock data - replace with real data from API
  const [customers] = useState<Customer[]>([
    {
      id: "1",
      name: "Rajesh Kumar",
      email: "rajesh.k@email.com",
      phone: "+91 98765 43210",
      pan: "ABCDE1234F",
      aadhaar: "XXXX-XXXX-5678",
      activeLoans: 2,
    },
    {
      id: "2",
      name: "Priya Sharma",
      email: "priya.s@email.com",
      phone: "+91 98765 43211",
      pan: "FGHIJ5678K",
      aadhaar: "XXXX-XXXX-9012",
      activeLoans: 1,
    },
    {
      id: "3",
      name: "Amit Patel",
      email: "amit.p@email.com",
      phone: "+91 98765 43212",
      pan: "KLMNO9012P",
      aadhaar: "XXXX-XXXX-3456",
      activeLoans: 0,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            data-testid="input-search-customers"
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>PAN</TableHead>
              <TableHead>Aadhaar</TableHead>
              <TableHead className="text-center">Active Loans</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id} data-testid={`row-customer-${customer.id}`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(customer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {customer.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell className="font-mono text-sm">{customer.pan}</TableCell>
                <TableCell className="font-mono text-sm">{customer.aadhaar}</TableCell>
                <TableCell className="text-center font-medium">
                  {customer.activeLoans}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log("View customer:", customer.id)}
                      data-testid={`button-view-${customer.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log("Edit customer:", customer.id)}
                      data-testid={`button-edit-${customer.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => console.log("Delete customer:", customer.id)}
                      data-testid={`button-delete-${customer.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
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
