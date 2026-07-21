import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Trash2, Plus } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import summaryApi from "@/common/api";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  notes: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  shift: string;
  active: boolean;
  lastLogin?: string;
  password: string;
}

const ROLES = ["DELIVERY", "STAFF", "USER"];
const SHIFTS = ["Morning", "Afternoon", "Evening", "Night"];

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [roleValue, setRoleValue] = useState(ROLES[0]);
  const [shiftValue, setShiftValue] = useState(SHIFTS[0]);

  const token = useSelector((state: any) => state.user.token);

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "All" || member.role === filterRole;
    return matchesSearch && matchesRole;
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(summaryApi.allStaff!, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setStaff(response.data.data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch staff");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveStaff = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    const staffData = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      notes: form.notes.value,
      addressLine1: form.addressLine1.value,
      addressLine2: form.addressLine2.value,
      city: form.city.value,
      state: form.state.value,
      postalCode: form.postalCode.value,
      role: roleValue,
      shift: shiftValue,
      // active: editingStaff?.active || true,
      password: form.password.value,
    };

    try {
      setIsLoading(true);
      let response;

      if (editingStaff) {
        response = await axios.put(
          `${summaryApi.updateStaff}/${editingStaff.id}`,
          staffData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        response = await axios.post(summaryApi.addStaff!, staffData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      if (response.data.success) {
        toast.success(
          editingStaff
            ? "Staff member updated successfully"
            : "Staff member added successfully"
        );
        fetchStaff();
        setIsDialogOpen(false);
        setEditingStaff(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    try {
      setIsLoading(true);
      const response = await axios.delete(`${summaryApi.deleteStaff}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Staff member deleted successfully");
        fetchStaff();
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete staff member"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (member: StaffMember) => {
    setEditingStaff(member);
    setRoleValue(member.role);
    setShiftValue(member.shift);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="hidden md:block">
          <AdminSidebar activeSection="staff" />
        </div>

        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">
                  Staff Management
                </h1>
                <p className="text-muted-foreground">
                  Manage staff accounts and permissions
                </p>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-40"
                />
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Roles</SelectItem>
                    {ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingStaff(null);
                      setRoleValue(ROLES[0]);
                      setShiftValue(SHIFTS[0]);
                    }}>
                      <Plus className="mr-2 h-4 w-4" /> Add Staff
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingStaff ? "Edit Staff Member" : "Add New Staff Member"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingStaff
                          ? "Make changes to staff details here."
                          : "Enter details for the new staff member here."}
                      </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSaveStaff} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" name="name" defaultValue={editingStaff?.name} required />
                        </div>

                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" type="email" defaultValue={editingStaff?.email} required />
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" name="phone" defaultValue={editingStaff?.phone} required />
                        </div>

                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Select value={roleValue} onValueChange={setRoleValue}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {ROLES.map((role) => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="shift">Shift</Label>
                          <Select value={shiftValue} onValueChange={setShiftValue}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select shift" />
                            </SelectTrigger>
                            <SelectContent>
                              {SHIFTS.map((shift) => (
                                <SelectItem key={shift} value={shift}>{shift}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="password">Password</Label>
                          <Input id="password" name="password" type="password" defaultValue={editingStaff?.password} required />
                        </div>

                      

                        <div className="col-span-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Input id="notes" name="notes" defaultValue={editingStaff?.notes} />
                        </div>

                        <div>
                          <Label htmlFor="addressLine1">Address Line 1</Label>
                          <Input id="addressLine1" name="addressLine1" defaultValue={editingStaff?.addressLine1} required />
                        </div>

                        <div>
                          <Label htmlFor="addressLine2">Address Line 2</Label>
                          <Input id="addressLine2" name="addressLine2" defaultValue={editingStaff?.addressLine2} />
                        </div>

                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input id="city" name="city" defaultValue={editingStaff?.city} required />
                        </div>

                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input id="state" name="state" defaultValue={editingStaff?.state} required />
                        </div>

                        <div>
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input id="postalCode" name="postalCode" defaultValue={editingStaff?.postalCode} required />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading
                            ? "Saving..."
                            : editingStaff
                            ? "Update Staff"
                            : "Add Staff"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Staff Members</CardTitle>
                <CardDescription>View and manage all staff members</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Role & Shift</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {member.email}
                              </div>
                              <div className="text-sm text-muted-foreground">
                              Passowrd:  {member.password}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{member.phone}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            member.role === "DELIVERY"
                              ? "bg-yellow-100 text-yellow-800"
                              : member.role === "STAFF"
                              ? "bg-green-100 text-green-800"
                              : "bg-blue-100 text-blue-800"
                          }`}>
                            {member.role}
                          </span>
                          <div className="text-sm text-muted-foreground">
                            {member.shift}
                          </div>
                        </TableCell>
                        <TableCell>
                          {member.city}, {member.state}
                          <div className="text-xs text-muted-foreground">
                            {member.postalCode}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              member.active === true
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {member.active === true ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditClick(member)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleDeleteStaff(member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
