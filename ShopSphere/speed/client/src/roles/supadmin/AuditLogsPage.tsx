import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, Download, Filter } from "lucide-react";
import { SupAdminSidebar } from "./SupAdminSidebar";
import { useState } from "react";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  status: string;
}

const initialLogs: AuditLog[] = [
  { id: "1", timestamp: "2025-03-16 14:30:22", user: "john@supadmin.com", action: "LOGIN", resource: "Authentication", ip: "192.168.1.100", status: "SUCCESS" },
  { id: "2", timestamp: "2025-03-16 14:35:10", user: "john@supadmin.com", action: "CREATE", resource: "Product #123", ip: "192.168.1.100", status: "SUCCESS" },
  { id: "3", timestamp: "2025-03-16 14:40:33", user: "sarah@admin.com", action: "UPDATE", resource: "Order #1001", ip: "192.168.1.101", status: "SUCCESS" },
  { id: "4", timestamp: "2025-03-16 14:45:18", user: "mike@staff.com", action: "DELETE", resource: "Review #876", ip: "192.168.1.102", status: "SUCCESS" },
  { id: "5", timestamp: "2025-03-16 14:50:45", user: "emma@delivery.com", action: "UPDATE", resource: "Delivery #D1001", ip: "192.168.1.103", status: "SUCCESS" },
  { id: "6", timestamp: "2025-03-16 14:55:22", user: "robert@customer.com", action: "VIEW", resource: "Product #123", ip: "192.168.1.104", status: "SUCCESS" },
  { id: "7", timestamp: "2025-03-16 15:00:10", user: "john@supadmin.com", action: "UPDATE", resource: "System Settings", ip: "192.168.1.100", status: "SUCCESS" },
  { id: "8", timestamp: "2025-03-16 15:05:33", user: "sarah@admin.com", action: "CREATE", resource: "User #1251", ip: "192.168.1.101", status: "SUCCESS" },
];

const actions = ["All", "LOGIN", "CREATE", "UPDATE", "DELETE", "VIEW"];
const statuses = ["All", "SUCCESS", "FAILED"];
const timeFilters = ["Today", "Yesterday", "This Week", "Last Week", "This Month"];

export default function AuditLogsPage() {
  const [logs] = useState<AuditLog[]>(initialLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterTime, setFilterTime] = useState("Today");

  // Filter logs based on search and filters
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = filterAction === "All" || log.action === filterAction;
    const matchesStatus = filterStatus === "All" || log.status === filterStatus;
    // In a real app, you would implement proper time filtering
    return matchesSearch && matchesAction && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SUCCESS": return "bg-green-100 text-green-800";
      case "FAILED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE": return "bg-blue-100 text-blue-800";
      case "UPDATE": return "bg-yellow-100 text-yellow-800";
      case "DELETE": return "bg-red-100 text-red-800";
      case "LOGIN": return "bg-purple-100 text-purple-800";
      case "VIEW": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={0} isLoggedIn={true} userName="SupAdmin" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <SupAdminSidebar activeSection="audit" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Audit Logs</h1>
                <p className="text-muted-foreground">View system activity and security events</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-4 w-40"
                  />
                </div>
                <Select value={filterTime} onValueChange={setFilterTime}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeFilters.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Activity Overview
                  </CardTitle>
                  <CardDescription>System activity statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Events</p>
                      <p className="text-2xl font-bold">{logs.length}</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Successful</p>
                      <p className="text-2xl font-bold">
                        {logs.filter(log => log.status === "SUCCESS").length}
                      </p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Failed</p>
                      <p className="text-2xl font-bold">
                        {logs.filter(log => log.status === "FAILED").length}
                      </p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Unique Users</p>
                      <p className="text-2xl font-bold">
                        {new Set(logs.map(log => log.user)).size}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Activity Filters</CardTitle>
                  <CardDescription>Filter audit logs by various criteria</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="action-filter">Action Type</Label>
                      <Select value={filterAction} onValueChange={setFilterAction}>
                        <SelectTrigger id="action-filter" className="mt-1">
                          <SelectValue placeholder="Select action" />
                        </SelectTrigger>
                        <SelectContent>
                          {actions.map(action => (
                            <SelectItem key={action} value={action}>{action}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status-filter">Status</Label>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger id="status-filter" className="mt-1">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="time-filter">Time Period</Label>
                      <Select value={filterTime} onValueChange={setFilterTime}>
                        <SelectTrigger id="time-filter" className="mt-1">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeFilters.map(time => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Audit Log Events</CardTitle>
                <CardDescription>Detailed record of system activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Resource</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map(log => (
                      <TableRow key={log.id}>
                        <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getActionColor(log.action)}`}>
                            {log.action}
                          </span>
                        </TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(log.status)}`}>
                            {log.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredLogs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No audit logs found matching the current filters
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  );
}