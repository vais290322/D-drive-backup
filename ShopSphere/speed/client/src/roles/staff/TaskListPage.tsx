import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Plus, ClipboardList, Clock, CheckCircle, XCircle } from "lucide-react";
import { StaffSidebar } from "./StaffSidebar";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: string;
  status: string;
  dueDate: string;
  completed: boolean;
}

const initialTasks: Task[] = [
  { id: "1", title: "Restock inventory", description: "Check and restock low inventory items", assignedTo: "John Staff", priority: "High", status: "In Progress", dueDate: "2025-03-20", completed: false },
  { id: "2", title: "Process new orders", description: "Process and package orders from yesterday", assignedTo: "Sarah Worker", priority: "Medium", status: "Pending", dueDate: "2025-03-17", completed: false },
  { id: "3", title: "Update product prices", description: "Review and update prices for seasonal items", assignedTo: "Mike Assistant", priority: "Low", status: "Completed", dueDate: "2025-03-15", completed: true },
  { id: "4", title: "Prepare delivery reports", description: "Generate daily delivery reports for admin", assignedTo: "John Staff", priority: "Medium", status: "Pending", dueDate: "2025-03-18", completed: false },
];

const priorities = ["High", "Medium", "Low"];
const statuses = ["Pending", "In Progress", "Completed", "Cancelled"];

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === "All" || task.priority === filterPriority;
    const matchesStatus = filterStatus === "All" || task.status === filterStatus;
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleSaveTask = (event: React.FormEvent) => {
    event.preventDefault();
    // In a real app, you would save to the backend here
    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed, status: !task.completed ? "Completed" : "In Progress" } : task
    ));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={0} isLoggedIn={true} userName="Staff" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <StaffSidebar activeSection="tasks" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">Task List</h1>
                <p className="text-muted-foreground">Manage and track your daily tasks</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Input
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 pr-4 w-40"
                  />
                </div>
                <Select value={filterPriority} onValueChange={setFilterPriority}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {priorities.map(priority => (
                      <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingTask(null)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingTask ? "Edit Task" : "Add New Task"}</DialogTitle>
                      <DialogDescription>
                        {editingTask 
                          ? "Make changes to task details here." 
                          : "Enter details for the new task here."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveTask}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="title" className="text-right">
                            Title
                          </Label>
                          <Input
                            id="title"
                            defaultValue={editingTask?.title || ""}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="description" className="text-right">
                            Description
                          </Label>
                          <Input
                            id="description"
                            defaultValue={editingTask?.description || ""}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="assignedTo" className="text-right">
                            Assigned To
                          </Label>
                          <Input
                            id="assignedTo"
                            defaultValue={editingTask?.assignedTo || ""}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="priority" className="text-right">
                            Priority
                          </Label>
                          <Select defaultValue={editingTask?.priority || "Medium"}>
                            <SelectTrigger className="col-span-3">
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              {priorities.map(priority => (
                                <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="dueDate" className="text-right">
                            Due Date
                          </Label>
                          <Input
                            id="dueDate"
                            type="date"
                            defaultValue={editingTask?.dueDate || ""}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save changes</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>View and manage all assigned tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTasks.map(task => (
                      <TableRow key={task.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                              <ClipboardList className="h-4 w-4" />
                            </div>
                            <span className="font-medium">{task.title}</span>
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={task.description}>
                          {task.description}
                        </TableCell>
                        <TableCell>{task.assignedTo}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                        </TableCell>
                        <TableCell>{task.dueDate}</TableCell>
                        <TableCell>
                          <Checkbox 
                            checked={task.completed} 
                            onCheckedChange={() => handleToggleComplete(task.id)}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleEditTask(task)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
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

      {/* <Footer /> */}
    </div>
  );
}