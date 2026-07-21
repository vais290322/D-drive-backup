import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Mail,
  Phone,
  ArrowRight,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import toastUtil from "@/shared/utils/toast";
import { Button } from "@/admin/components/ui/Button";
import { Input } from "@/admin/components/ui/Input";
import { Badge } from "@/admin/components/ui/Badge";
import { Card, CardContent } from "@/admin/components/ui/Card";
import { Avatar } from "@/admin/components/ui/Avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/admin/components/ui/Table";
import { customerService } from "@/services/admin/api/customerService";
import { Pagination } from "@/admin/components/ui/Pagination";
import Loading from "@/shared/components/common/Loading";
import axios from "axios";
import { customerUrl } from "@/config/userApi";

const CustomersList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchCustomers = React.useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const data = await customerService.getCustomers({ search: searchQuery });
      const customerArray = Array.isArray(data) ? data : data?.data || [];

      const sanitizedCustomers = customerArray.map((customer) => ({
        id: customer?.id || `temp-${Date.now()}`,
        name: customer?.name || "Unknown Customer",
        email: customer?.email || "N/A",
        phone: customer?.phone || "N/A",
        joined: customer?.joined || "N/A",
        orders: customer?.orders || 0,
        totalSpent: customer?.totalSpent || 0,
        status: customer?.status || "Inactive",
      }));

      setCustomers(sanitizedCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setHasError(true);
      setCustomers([]);
      toastUtil.error("Failed to fetch customers");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchCustomers]);

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (hasError) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Failed to Load Customers</h3>
        <Button onClick={fetchCustomers} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const fetchCustomers1 = async () => {
    try {
      const res = await axios.get(`${customerUrl.getadmincustomer}`);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchCustomers1();
  }, []);
  if (isLoading && customers.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loading size="large" text="Loading customers..." />
      </div>
    );
  }

  return (
    <div
      className="h-full flex flex-col space-y-4 p-4"
      style={{
        background:
          "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)",
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-4xl font-bold bg-linear-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent flex items-center gap-2">
            Customers
            <Sparkles className="h-8 w-8 text-emerald-500" />
          </h2>
          <p className="text-gray-500 text-sm">Manage your customer base</p>
        </div>
      </div>

      <Card className="flex-1 flex flex-col shadow-sm bg-white/50 backdrop-blur-xl">
        <CardContent className="p-4 flex-1 flex flex-col">
          <div className="mb-4">
            <div className="relative w-full lg:w-72">
              <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search customers..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto rounded-md border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow
                  style={{
                    background: "linear-gradient(to right, #f0fdf4, #f0fdfa)",
                  }}
                >
                  <TableHead className="font-semibold text-gray-700">
                    Customer
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 hidden md:table-cell">
                    Contact
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 hidden lg:table-cell">
                    Joined
                  </TableHead>
                  {/* <TableHead className="font-semibold text-gray-700 text-center">
                    Orders
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Total Spent
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700">
                    Status
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">
                    Actions
                  </TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage,
                  )
                  .map((customer) => (
                    <TableRow
                      key={customer.id}
                      onClick={() =>
                        navigate(`/admin/customers/${customer.id}`)
                      }
                      className="
          cursor-pointer
          transition-all
          duration-200
          hover:bg-emerald-50
          hover:shadow-sm
          group
        "
                    >
                      {/* 👤 Name + Avatar */}
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            className="
                h-9 w-9
                bg-gradient-to-br
                from-emerald-100
                to-emerald-200
                text-emerald-800
                font-semibold
                shadow-sm
              "
                            fallback={getInitials(customer.name)}
                          />
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-800 group-hover:text-emerald-700">
                              {customer.name}
                            </span>
                            <span className="text-xs text-gray-500 md:hidden">
                              {customer.email}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* 📧 Email & 📞 Phone */}
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col gap-1 text-sm text-gray-500">
                          <span className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 text-emerald-500" />
                            {customer.email}
                          </span>
                          <span className="flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5 text-emerald-500" />
                            {customer.phone}
                          </span>
                        </div>
                      </TableCell>

                      {/* 📅 Joined Date */}
                      <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                        <span className="inline-flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                          {customer.joined}
                        </span>
                      </TableCell>

                      {/* 👉 Subtle arrow hint */}
                      <TableCell className="text-right pr-4">
                        <span className="text-emerald-600 opacity-0 group-hover:opacity-100 transition">
                          →
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(customers.length / itemsPerPage)}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={(val) => {
                setItemsPerPage(val);
                setCurrentPage(1);
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomersList;