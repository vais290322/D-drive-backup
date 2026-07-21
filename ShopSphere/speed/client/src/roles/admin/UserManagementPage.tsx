import { useState, useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { UserManagement } from "@/roles/user/UserManagement";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import summaryApi from "@/common/api";

const ROLE_OPTIONS = ["USER", "STAFF", "DELIVERY"];

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  createdAt: string;
}

export default function UserManagementPage() {
  const [currentUserRole] = useState("ADMIN");

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state: any) => state.user.token);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(summaryApi.allUsers!, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      const response = await axios.put(
        `${summaryApi.allUsers}/${userId}?role=${newRole}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("User role updated successfully");
        // Update the local state
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user
          )
        );
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update user role"
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={0} isLoggedIn={true} userName="Admin" /> */}

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <AdminSidebar activeSection="users" />
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">
                  User Management
                </h1>
                <p className="text-muted-foreground">
                  Manage customer accounts and permissions
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm">
                  {currentUserRole}
                </div>
              </div>
            </div>

            {/* <UserManagement /> */}

            <Card>
              <CardContent className="p-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>S.No.</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        {/* <TableHead>Created At</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            Loading users...
                          </TableCell>
                        </TableRow>
                      ) : users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-10">
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((user, index) => (
                          <TableRow key={user.id}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{user.fullName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            {
                              user.role === "ADMIN" ?  <TableCell className="text-red-400">{user.role || "N/A"}</TableCell> : <TableCell>
                              <Select
                                value={user.role}
                                onValueChange={(newRole) =>
                                  handleRoleUpdate(user.id, newRole)
                                }
                              >
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ROLE_OPTIONS.map((role) => (
                                    <SelectItem
                                      key={role}
                                      value={role}
                                      className={
                                        role === user.role
                                          ? "bg-primary/10"
                                          : ""
                                      }
                                    >
                                      {role}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            }
                            
                            {/* <TableCell>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </TableCell> */}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  );
}
