import { useEffect, useState } from "react";
import { api, getPendingUsers, approveUser, rejectUser, createUserByAdmin } from "@/db/api";
import type { Profile } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users as UsersIcon, Edit, UserPlus, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [pendingUsers, setPendingUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [updating, setUpdating] = useState(false);

  // Create user dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [newUserRole, setNewUserRole] = useState("data_entry");
  const [creating, setCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);
  const [deleting, setDeleting] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  useEffect(() => {
    loadUsers();
    loadPendingUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await api.profiles.getAll();
      // Filter out pending and rejected users
      const approvedUsers = data.filter((u: Profile) => u.status === 'approved');
      setUsers(approvedUsers);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const loadPendingUsers = async () => {
    try {
      const data = await getPendingUsers();
      setPendingUsers(data);
    } catch (error) {
      console.error("Error loading pending users:", error);
    }
  };

  const handleApproveUser = async (userId: string) => {
    if (!user?.id) return;

    try {
      const result = await approveUser(userId, user.id);
      if (result.success) {
        toast.success(result.message);
        loadUsers();
        loadPendingUsers();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error approving user:", error);
      toast.error("Failed to approve user");
    }
  };

  const handleRejectUser = async (userId: string) => {
    if (!user?.id) return;

    try {
      const result = await rejectUser(userId, user.id);
      if (result.success) {
        toast.success(result.message);
        loadPendingUsers();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error rejecting user:", error);
      toast.error("Failed to reject user");
    }
  };

  const handleCreateUser = async () => {
    if (!user?.id) return;

    if (!newUserEmail || !newUserPassword || !newUserName || !newUserRole) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newUserPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setCreating(true);
      const result = await createUserByAdmin(
        newUserEmail,
        newUserPassword,
        newUserName,
        newUserRole,
        user.id
      );

      if (result.success) {
        toast.success(result.message);
        setCreateDialogOpen(false);
        setNewUserEmail("");
        setNewUserPassword("");
        setNewUserName("");
        setNewUserRole("data_entry");
        loadUsers();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Failed to create user");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      setUpdating(true);
      await api.profiles.updateRole(selectedUser.id, newRole);
      toast.success("User role updated successfully");
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update user role");
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setDeleting(true);
      await api.profiles.delete(userToDelete.id);
      toast.success("User deleted successfully");
      setDeleteDialogOpen(false);
      setUserToDelete(null);
      loadUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast.error(error.message || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      super_admin: "bg-primary text-primary-foreground",
      admin: "bg-accent text-accent-foreground",
      loan_manager: "bg-chart-3 text-white",
      collection_agent: "bg-chart-4 text-white",
      data_entry: "bg-secondary text-secondary-foreground",
      kyc_verifier: "bg-chart-5 text-white",
    };
    return (
      <Badge className={colors[role] || ""}>
        {role.replace("_", " ").toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>
        {isAdmin && (
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="create-name">Full Name</Label>
                  <Input
                    id="create-name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <Label htmlFor="create-email">Email</Label>
                  <Input
                    id="create-email"
                    type="email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                <div>
                  <Label htmlFor="create-password">Password</Label>
                  <Input
                    id="create-password"
                    type="password"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="Enter password (min 6 characters)"
                  />
                </div>
                <div>
                  <Label htmlFor="create-role">Role</Label>
                  <Select value={newUserRole} onValueChange={setNewUserRole}>
                    <SelectTrigger id="create-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="loan_manager">Loan Manager</SelectItem>
                      <SelectItem value="collection_agent">Collection Agent</SelectItem>
                      <SelectItem value="data_entry">Data Entry</SelectItem>
                      <SelectItem value="kyc_verifier">KYC Verifier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateUser} disabled={creating}>
                  {creating ? "Creating..." : "Create User"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Pending Users Section */}
      {isAdmin && pendingUsers.length > 0 && (
        <Card className="border-accent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Pending Approvals ({pendingUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Requested Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingUsers.map((pendingUser) => (
                    <TableRow key={pendingUser.id}>
                      <TableCell className="font-medium">{pendingUser.full_name}</TableCell>
                      <TableCell>{pendingUser.email}</TableCell>
                      <TableCell>
                        {new Date(pendingUser.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApproveUser(pendingUser.id)}
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectUser(pendingUser.id)}
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Users Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            All Users ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={`skeleton-${i}`} className="h-16 w-full bg-muted" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{user.full_name || "-"}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setNewRole(user.role);
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update User Role</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <p className="text-sm font-medium">User Email</p>
                                <p className="text-sm text-muted-foreground">
                                  {selectedUser?.email}
                                </p>
                              </div>
                              <div>
                                <p className="mb-2 text-sm font-medium">Select New Role</p>
                                <Select value={newRole} onValueChange={setNewRole}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="super_admin">Super Admin</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="loan_manager">Loan Manager</SelectItem>
                                    <SelectItem value="collection_agent">Collection Agent</SelectItem>
                                    <SelectItem value="data_entry">Data Entry</SelectItem>
                                    <SelectItem value="kyc_verifier">KYC Verifier</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex justify-end gap-2">
                                <DialogClose asChild>
                                  <Button
                                    variant="outline"
                                    onClick={() => setSelectedUser(null)}
                                  >
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <Button
                                  onClick={handleUpdateRole}
                                  disabled={updating}
                                >
                                  {updating ? "Updating..." : "Update Role"}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        {isAdmin && user.role !== 'super_admin' && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              setUserToDelete(user);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{userToDelete?.full_name || userToDelete?.email}</strong>?
            <br />
            <span className="text-destructive">This action cannot be undone.</span>
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

