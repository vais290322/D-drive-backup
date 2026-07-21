import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    CheckSquare,
    Plus,
    Trash2,
    Calendar,
    Filter,
    CheckCircle2,
    Circle,
    MoreVertical,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getTasks, createTask, deleteTask, completeTask } from "@/db/crmApi";
import type { TaskWithRelations } from "@/types/types";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    due_date: z.string().optional(),
    priority: z.enum(["low", "medium", "high"]),
    status: z.enum(["pending", "completed"]),
    company_id: z.string().optional(),
    contact_id: z.string().optional(),
    deal_id: z.string().optional(),
});

export default function Tasks() {
    const { toast } = useToast();
    const [tasks, setTasks] = useState<TaskWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("pending");

    const form = useForm<z.infer<typeof taskSchema>>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: "",
            description: "",
            priority: "medium",
            status: "pending",
            due_date: "",
        },
    });

    useEffect(() => {
        loadTasks();
    }, [activeTab]);

    const loadTasks = async () => {
        try {
            setLoading(true);
            const data = await getTasks({ status: activeTab });
            setTasks(data);
        } catch (error) {
            console.error("Error loading tasks:", error);
            toast({
                title: "Error",
                description: "Failed to load tasks",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (values: z.infer<typeof taskSchema>) => {
        try {
            await createTask({
                ...values,
                company_id: values.company_id || null,
                contact_id: values.contact_id || null,
                deal_id: values.deal_id || null,
                description: values.description || null,
                due_date: values.due_date || null,
            });
            toast({
                title: "Success",
                description: "Task created successfully",
            });
            setCreateDialogOpen(false);
            form.reset();
            loadTasks();
        } catch (error) {
            console.error("Error creating task:", error);
            toast({
                title: "Error",
                description: "Failed to create task",
                variant: "destructive",
            });
        }
    };

    const handleComplete = async (id: string) => {
        try {
            await completeTask(id);
            toast({
                title: "Success",
                description: "Task marked as completed",
            });
            loadTasks();
        } catch (error) {
            console.error("Error completing task:", error);
            toast({
                title: "Error",
                description: "Failed to complete task",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTask(id);
            toast({
                title: "Success",
                description: "Task deleted successfully",
            });
            loadTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
            toast({
                title: "Error",
                description: "Failed to delete task",
                variant: "destructive",
            });
        }
    };

    const getPriorityColor = (priority: string) => {
        const colors: Record<string, string> = {
            high: "text-red-500 bg-red-500/10",
            medium: "text-orange-500 bg-orange-500/10",
            low: "text-blue-500 bg-blue-500/10",
        };
        return colors[priority] || "text-muted-foreground bg-muted";
    };

    return (
        <div className="p-6 xl:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl xl:text-3xl font-bold">Tasks</h1>
                    <p className="text-muted-foreground mt-1">Manage your to-do list and follow-ups</p>
                </div>
                <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Task
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Task</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter task title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter task details" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="due_date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Due Date</FormLabel>
                                                <FormControl>
                                                    <Input type="date" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="priority"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Priority</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select priority" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="low">Low</SelectItem>
                                                        <SelectItem value="medium">Medium</SelectItem>
                                                        <SelectItem value="high">High</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit">Create Task</Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center justify-between">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <p className="text-center py-8 text-muted-foreground">Loading tasks...</p>
                ) : tasks.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <CheckSquare className="h-12 w-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">No tasks found</p>
                            <p className="text-sm">Create a new task to get started</p>
                        </CardContent>
                    </Card>
                ) : (
                    tasks.map((task) => (
                        <Card key={task.id} className="group hover:shadow-md transition-shadow">
                            <CardContent className="p-4 flex items-start gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`mt-1 shrink-0 ${task.status === "completed" ? "text-success" : "text-muted-foreground hover:text-success"
                                        }`}
                                    onClick={() => handleComplete(task.id)}
                                    disabled={task.status === "completed"}
                                >
                                    {task.status === "completed" ? (
                                        <CheckCircle2 className="h-6 w-6" />
                                    ) : (
                                        <Circle className="h-6 w-6" />
                                    )}
                                </Button>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className={`font-semibold text-lg ${task.status === "completed" ? "line-through text-muted-foreground" : ""
                                                }`}>
                                                {task.title}
                                            </h3>
                                            {task.description && (
                                                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                    {task.description}
                                                </p>
                                            )}
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(task.id)}>
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 mt-3">
                                        <Badge variant="secondary" className={getPriorityColor(task.priority)}>
                                            {task.priority.toUpperCase()}
                                        </Badge>

                                        {task.due_date && (
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <Calendar className="mr-1 h-3 w-3" />
                                                Due: {new Date(task.due_date).toLocaleDateString()}
                                            </div>
                                        )}

                                        {(task.company || task.contact || task.deal) && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground border-l pl-3 ml-1">
                                                {task.company && <span>{task.company.name}</span>}
                                                {task.contact && <span>• {task.contact.first_name} {task.contact.last_name}</span>}
                                                {task.deal && <span>• {task.deal.title}</span>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
