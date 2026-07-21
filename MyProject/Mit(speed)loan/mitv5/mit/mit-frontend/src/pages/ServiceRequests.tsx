import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { api } from "@/db/api";
import { Plus, Trash2, Save, Loader2, Wrench, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function ServiceRequests() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("all");

    const [newItem, setNewItem] = useState({
        customer_name: '',
        customer_phone: '',
        product_name: '',
        product_details: '',
        purchase_date: new Date().toISOString().split('T')[0],
        invoice_no: '',
        problem_statement: '',
        status: 'Open'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const data = await api.serviceRequests.getAll();
            setRequests(data);
        } catch (error) {
            console.error("Error loading service requests:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            await api.serviceRequests.create(newItem);
            setIsDialogOpen(false);
            setNewItem({
                customer_name: '',
                customer_phone: '',
                product_name: '',
                product_details: '',
                purchase_date: new Date().toISOString().split('T')[0],
                invoice_no: '',
                problem_statement: '',
                status: 'Open'
            });
            loadData();
        } catch (error) {
            console.error("Error creating request:", error);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await api.serviceRequests.update(id, { status: newStatus });
            loadData();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this request?")) {
            try {
                await api.serviceRequests.delete(id);
                loadData();
            } catch (error) {
                console.error("Error deleting request:", error);
            }
        }
    };

    const filteredRequests = requests.filter(req => {
        if (activeTab === "all") return true;
        return req.status === activeTab;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Reported': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Solved': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Service Requests</h1>
                    <p className="text-muted-foreground">Manage customer service and support tickets</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-primary to-accent">
                            <Plus className="mr-2 h-4 w-4" />
                            New Request
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Create Service Request</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Customer Name</label>
                                    <Input
                                        value={newItem.customer_name}
                                        onChange={e => setNewItem({ ...newItem, customer_name: e.target.value })}
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Phone Number</label>
                                    <Input
                                        value={newItem.customer_phone}
                                        onChange={e => setNewItem({ ...newItem, customer_phone: e.target.value })}
                                        placeholder="Customer Contact"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Product Name</label>
                                    <Input
                                        value={newItem.product_name}
                                        onChange={e => setNewItem({ ...newItem, product_name: e.target.value })}
                                        placeholder="e.g. Washing Machine"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Invoice No</label>
                                    <Input
                                        value={newItem.invoice_no}
                                        onChange={e => setNewItem({ ...newItem, invoice_no: e.target.value })}
                                        placeholder="INV-12345"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Product Details</label>
                                    <Input
                                        value={newItem.product_details}
                                        onChange={e => setNewItem({ ...newItem, product_details: e.target.value })}
                                        placeholder="Model, Serial No, etc."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Purchase Date</label>
                                    <Input
                                        type="date"
                                        value={newItem.purchase_date}
                                        onChange={e => setNewItem({ ...newItem, purchase_date: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Problem Statement</label>
                                <Textarea
                                    value={newItem.problem_statement}
                                    onChange={e => setNewItem({ ...newItem, problem_statement: e.target.value })}
                                    placeholder="Describe the issue in detail..."
                                    className="min-h-[100px]"
                                />
                            </div>

                            <Button onClick={handleCreate} className="w-full">Create Request</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList>
                    <TabsTrigger value="all">All Requests</TabsTrigger>
                    <TabsTrigger value="Open" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
                        <AlertCircle className="w-4 h-4 mr-2" /> Open
                    </TabsTrigger>
                    <TabsTrigger value="Reported" className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-800">
                        <Clock className="w-4 h-4 mr-2" /> Reported
                    </TabsTrigger>
                    <TabsTrigger value="Solved" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Solved
                    </TabsTrigger>
                </TabsList>

                <Card className="mt-4 flex-1 border-0 shadow-lg bg-background/50 backdrop-blur-sm overflow-hidden">
                    <CardContent className="p-0 h-full overflow-auto">
                        <Table className="min-w-[1000px]">
                            <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Issue</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Loading requests...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredRequests.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                            No requests found in this category.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRequests.map((req) => (
                                        <TableRow key={req._id || req.id} className="group">
                                            <TableCell className="font-medium">
                                                {new Date(req.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold">{req.customer_name}</span>
                                                    <span className="text-xs text-muted-foreground">{req.customer_phone}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-medium">{req.product_name}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {req.product_details} • {req.invoice_no}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-[300px]">
                                                <p className="line-clamp-2 text-sm">{req.problem_statement}</p>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(req.status)}`}>
                                                    {req.status}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    {req.status === 'Open' && (
                                                        <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(req._id || req.id, 'Reported')}>
                                                            Mark Reported
                                                        </Button>
                                                    )}
                                                    {req.status === 'Reported' && (
                                                        <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50" onClick={() => handleStatusUpdate(req._id || req.id, 'Solved')}>
                                                            Mark Solved
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100"
                                                        onClick={() => handleDelete(req._id || req.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Tabs>
        </div>
    );
}
