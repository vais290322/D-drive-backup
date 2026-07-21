import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Database, Download, Upload, Trash2, Eye, Plus } from "lucide-react";
import { SupAdminSidebar } from "./SupAdminSidebar";
import { useState } from "react";

interface DatabaseTable {
  id: string;
  name: string;
  rows: number;
  size: string;
  lastModified: string;
}

interface Backup {
  id: string;
  name: string;
  date: string;
  size: string;
  status: string;
}

const initialTables: DatabaseTable[] = [
  { id: "1", name: "users", rows: 1250, size: "2.4 MB", lastModified: "2025-03-16 14:30:22" },
  { id: "2", name: "products", rows: 342, size: "1.8 MB", lastModified: "2025-03-16 10:15:45" },
  { id: "3", name: "orders", rows: 12345, size: "15.2 MB", lastModified: "2025-03-16 16:45:10" },
  { id: "4", name: "categories", rows: 24, size: "0.2 MB", lastModified: "2025-03-15 09:20:33" },
  { id: "5", name: "reviews", rows: 876, size: "0.9 MB", lastModified: "2025-03-16 11:30:18" },
];

const initialBackups: Backup[] = [
  { id: "1", name: "backup_2025-03-16.sql", date: "2025-03-16 02:00:00", size: "22.4 MB", status: "Completed" },
  { id: "2", name: "backup_2025-03-15.sql", date: "2025-03-15 02:00:00", size: "21.8 MB", status: "Completed" },
  { id: "3", name: "backup_2025-03-14.sql", date: "2025-03-14 02:00:00", size: "21.2 MB", status: "Completed" },
  { id: "4", name: "backup_2025-03-13.sql", date: "2025-03-13 02:00:00", size: "20.9 MB", status: "Completed" },
];

export default function DatabasePage() {
  const [tables] = useState<DatabaseTable[]>(initialTables);
  const [backups, setBackups] = useState<Backup[]>(initialBackups);
  const [searchTerm, setSearchTerm] = useState("");
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);

  // Filter tables based on search
  const filteredTables = tables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBackup = () => {
    // In a real app, you would trigger a backup creation
    const newBackup: Backup = {
      id: (backups.length + 1).toString(),
      name: `backup_${new Date().toISOString().split('T')[0]}.sql`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      size: "22.5 MB",
      status: "Completed"
    };
    setBackups([newBackup, ...backups]);
    setIsBackupDialogOpen(false);
  };

  const handleDeleteBackup = (id: string) => {
    setBackups(backups.filter(backup => backup.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Running": return "bg-blue-100 text-blue-800";
      case "Failed": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={0} isLoggedIn={true} userName="SupAdmin" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <SupAdminSidebar activeSection="database" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Database</h1>
                <p className="text-muted-foreground">Manage database tables and backups</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Input
                    placeholder="Search tables..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-4 w-40"
                  />
                </div>
                <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsBackupDialogOpen(true)}>
                      <Download className="mr-2 h-4 w-4" />
                      Backup
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Database Backup</DialogTitle>
                      <DialogDescription>
                        Create a new backup of the entire database
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <p>Are you sure you want to create a new database backup?</p>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsBackupDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreateBackup}>
                        Create Backup
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setIsRestoreDialogOpen(true)}>
                      <Upload className="mr-2 h-4 w-4" />
                      Restore
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Restore Database</DialogTitle>
                      <DialogDescription>
                        Restore database from a backup file
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="backup-file">Backup File</Label>
                          <Input
                            id="backup-file"
                            type="file"
                            accept=".sql,.dump"
                            className="mt-1"
                          />
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-md">
                          <span className="text-yellow-600">⚠️</span>
                          <p className="text-sm text-yellow-700">
                            Restoring will overwrite current data. This action cannot be undone.
                          </p>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsRestoreDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive">
                        Restore Database
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Overview
                  </CardTitle>
                  <CardDescription>Current database statistics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Tables</p>
                      <p className="text-2xl font-bold">{tables.length}</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Rows</p>
                      <p className="text-2xl font-bold">
                        {tables.reduce((sum, table) => sum + table.rows, 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Size</p>
                      <p className="text-2xl font-bold">20.3 MB</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <p className="text-sm text-muted-foreground">Last Backup</p>
                      <p className="text-2xl font-bold">Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Backups</CardTitle>
                  <CardDescription>Latest database backup files</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {backups.slice(0, 3).map(backup => (
                      <div key={backup.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{backup.name}</p>
                          <p className="text-xs text-muted-foreground">{backup.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(backup.status)}`}>
                            {backup.status}
                          </span>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {backups.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">No backups found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Database Tables</CardTitle>
                <CardDescription>View and manage database tables</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Table Name</TableHead>
                      <TableHead>Rows</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Last Modified</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTables.map(table => (
                      <TableRow key={table.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                              <Database className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{table.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{table.rows.toLocaleString()}</TableCell>
                        <TableCell>{table.size}</TableCell>
                        <TableCell>{table.lastModified}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
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
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Backup History</CardTitle>
                <CardDescription>All database backup files</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Backup Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backups.map(backup => (
                      <TableRow key={backup.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                              <Download className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{backup.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{backup.date}</TableCell>
                        <TableCell>{backup.size}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(backup.status)}`}>
                            {backup.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleDeleteBackup(backup.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {backups.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No backups found
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