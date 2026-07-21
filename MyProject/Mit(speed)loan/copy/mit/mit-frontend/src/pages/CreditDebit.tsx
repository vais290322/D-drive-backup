import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit, Download, RefreshCw, Wallet, Banknote, CheckCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { request } from "@/lib/apiClient";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CreditDebitRecord {
    _id: string;
    date: string;
    particular: string;
    type: string;
    amountType: "Credit" | "Debit";
    paymentMode: "cash" | "bank" | "cheque";
    transactionId: string;
    amount: number;
}

interface OpeningBalance {
    _id: string;
    balance: number;
    date: string;
    _v: number;
}

interface Summary {
    openingBalance: number;
    cashBalance: number;
    bankBalance: number;
    pendingCheque: number;
    totalDebit: number;
    totalCredit: number;
    closingBalance: number;
}

const creditDebitSchema = z.object({
    date: z.string().min(1, "Date is required"),
    particular: z.string().min(1, "Particular is required"),
    type: z.string().min(1, "Type is required"),
    amountType: z.enum(["Credit", "Debit"]),
    paymentMode: z.enum(["cash", "bank", "cheque"]),
    transactionId: z.string().min(1, "Transaction ID is required"),
    amount: z.string().min(1, "Amount is required"),
    balance: z.string().optional(),
});

type CreditDebitFormData = z.infer<typeof creditDebitSchema>;

const openingBalanceSchema = z.object({
    balance: z.string().min(1, "Balance is required"),
    date: z.string().min(1, "Date is required"),
});

type OpeningBalanceFormData = z.infer<typeof openingBalanceSchema>;

export default function CreditDebit() {
    const [records, setRecords] = useState<CreditDebitRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [creditDebitDialogOpen, setCreditDebitDialogOpen] = useState(false);
    const [openingBalanceDialogOpen, setOpeningBalanceDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [summary, setSummary] = useState<Summary>({
        openingBalance: 0,
        cashBalance: 0,
        bankBalance: 0,
        pendingCheque: 0,
        totalDebit: 0,
        totalCredit: 0,
        closingBalance: 0,
    });
    const [openingBalance, setOpeningBalance] = useState<OpeningBalance | null>(null);
    const printRef = useRef<HTMLDivElement>(null);

    // Filter states
    const [filterType, setFilterType] = useState<string>("all");
    const [filterAmountType, setFilterAmountType] = useState<string>("all");
    const [filterPaymentMode, setFilterPaymentMode] = useState<string>("all");
    const [filterMinAmount, setFilterMinAmount] = useState<string>("");
    const [filterMaxAmount, setFilterMaxAmount] = useState<string>("");
    const [filterFromDate, setFilterFromDate] = useState<string>("");
    const [filterToDate, setFilterToDate] = useState<string>("");

    //   console.log("Opening Balance:", openingBalance?.data?.[0]?.balance);

    const creditDebitForm = useForm<CreditDebitFormData>({
        resolver: zodResolver(creditDebitSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            particular: "",
            type: "",
            amountType: "Credit",
            paymentMode: "cash",
            transactionId: "",
            amount: "",
            balance: "",
        },
    });

    const openingBalanceForm = useForm<OpeningBalanceFormData>({
        resolver: zodResolver(openingBalanceSchema),
        defaultValues: {
            balance: "",
            date: new Date().toISOString().split("T")[0],
        },
    });

    useEffect(() => {
        loadRecords();
        loadOpeningBalance();
    }, []);

    useEffect(() => {
        if (records.length > 0 && openingBalance !== null) {
            calculateSummary(records);
        }
    }, [openingBalance]);

    const loadRecords = async () => {
        try {
            setLoading(true);
            const response = await request("/credit-debit/get");
            const recordsData = response.data || [];
            setRecords(recordsData);
            if (openingBalance !== null) {
                calculateSummary(recordsData);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to load records");
            setRecords([]);
        } finally {
            setLoading(false);
        }
    };

    const loadOpeningBalance = async () => {
        try {
            const response = await request("/opening-balance/get");
            //   console.log("Opening balance response:", response);
            let ob = null;
            if (response && Array.isArray(response) && response.length > 0) {
                ob = response[0];
            } else if (response && !Array.isArray(response)) {
                ob = response;
            }
            setOpeningBalance(ob);
        } catch (error: any) {
            console.error("Failed to load opening balance:", error);
        }
    };

    const calculateSummary = (data: CreditDebitRecord[]) => {
        const totalCredit = data
            .filter(r => r.amountType === "Credit")
            .reduce((sum, r) => sum + r.amount, 0);

        const totalDebit = data
            .filter(r => r.amountType === "Debit")
            .reduce((sum, r) => sum + r.amount, 0);

        const cashBalance = data
            .filter(r => r.paymentMode === "cash" && r.amountType === "Credit")
            .reduce((sum, r) => sum + r.amount, 0) -
            data
                .filter(r => r.paymentMode === "cash" && r.amountType === "Debit")
                .reduce((sum, r) => sum + r.amount, 0);

        const bankBalance = data
            .filter(r => r.paymentMode === "bank" && r.amountType === "Credit")
            .reduce((sum, r) => sum + r.amount, 0) -
            data
                .filter(r => r.paymentMode === "bank" && r.amountType === "Debit")
                .reduce((sum, r) => sum + r.amount, 0);

        const pendingCheque = data
            .filter(r => r.paymentMode === "cheque" && r.amountType === "Credit")
            .reduce((sum, r) => sum + r.amount, 0) -
            data
                .filter(r => r.paymentMode === "cheque" && r.amountType === "Debit")
                .reduce((sum, r) => sum + r.amount, 0);

        const openingBal = openingBalance?.data?.[0]?.balance || 0;
        const closingBalance = openingBal + totalCredit - totalDebit;

        setSummary({
            openingBalance: openingBal,
            cashBalance,
            bankBalance,
            pendingCheque,
            totalDebit,
            totalCredit,
            closingBalance,
        });
    };

    const handleAddCreditDebit = (data: CreditDebitFormData) => {
        handleSubmit(data);
    };

    const handleSubmit = async (data: CreditDebitFormData) => {
        try {
            const payload = {
                date: data.date,
                particular: data.particular,
                type: data.type,
                amountType: data.amountType,
                paymentMode: data.paymentMode,
                transactionId: data.transactionId,
                amount: parseFloat(data.amount),
                balance: data.balance ? parseFloat(data.balance) : undefined,
            };

            if (editMode && editingId) {
                await request(`/credit-debit/update/${editingId}`, {
                    method: "PUT",
                    body: JSON.stringify(payload),
                });
                toast.success("Record updated successfully");
            } else {
                await request("/credit-debit/create", {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
                toast.success("Record created successfully");
            }

            setCreditDebitDialogOpen(false);
            creditDebitForm.reset();
            setEditMode(false);
            setEditingId(null);
            loadRecords();
        } catch (error: any) {
            toast.error(error.message || "Failed to save record");
        }
    };

    const handleEdit = (record: CreditDebitRecord) => {
        setEditMode(true);
        setEditingId(record._id);
        creditDebitForm.setValue("date", new Date(record.date).toISOString().split("T")[0]);
        creditDebitForm.setValue("particular", record.particular);
        creditDebitForm.setValue("type", record.type);
        creditDebitForm.setValue("amountType", record.amountType);
        creditDebitForm.setValue("paymentMode", record.paymentMode);
        creditDebitForm.setValue("transactionId", record.transactionId);
        creditDebitForm.setValue("amount", record.amount.toString());
        setCreditDebitDialogOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setDeletingId(id);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingId) return;

        try {
            await request(`/credit-debit/delete/${deletingId}`, {
                method: "DELETE",
            });
            toast.success("Record deleted successfully");
            setDeleteDialogOpen(false);
            setDeletingId(null);
            loadRecords();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete record");
        }
    };

    const handleOpeningBalanceSubmit = async (data: OpeningBalanceFormData) => {
        try {
            const payload = {
                balance: parseFloat(data.balance),
                date: data.date,
            };

            await request("/opening-balance/create", {
                method: "POST",
                body: JSON.stringify(payload),
            });

            toast.success("Opening balance saved successfully");
            setOpeningBalanceDialogOpen(false);
            openingBalanceForm.reset();
            loadOpeningBalance();
            loadRecords();
        } catch (error: any) {
            toast.error(error.message || "Failed to save opening balance");
        }
    };

    const handleDownloadPDF = () => {
        const printWindow = window.open("", "_blank");
        if (printWindow && printRef.current) {
            printWindow.document.write(`
        <html>
          <head>
            <title>Credit/Debit Report</title>
            <style>
              @media print {
                @page { margin: 1cm; size: A4; }
                body { margin: 0; padding: 20px; }
              }
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f5f5f5; font-weight: bold; }
              .summary { margin-top: 20px; }
              .summary-item { display: flex; justify-content: space-between; margin-bottom: 8px; }
              .header { text-align: center; margin-bottom: 20px; }
              .no-print { display: none !important; }
            </style>
          </head>
          <body>
            ${printRef.current.innerHTML}
            <script>
              window.onload = function() {
                window.print();
                window.onafterprint = function() {
                  window.close();
                };
              };
            </script>
          </body>
        </html>
      `);
            printWindow.document.close();
        } else {
            toast.error("Failed to generate PDF");
        }
    };

    const clearFilters = () => {
        setFilterType("all");
        setFilterAmountType("all");
        setFilterPaymentMode("all");
        setFilterMinAmount("");
        setFilterMaxAmount("");
        setFilterFromDate("");
        setFilterToDate("");
    };

    const getFilteredRecords = () => {
        return records.filter(record => {
            if (filterType !== "all" && record.type !== filterType) return false;
            if (filterAmountType !== "all" && record.amountType !== filterAmountType) return false;
            if (filterPaymentMode !== "all" && record.paymentMode !== filterPaymentMode) return false;
            if (filterMinAmount && record.amount < parseFloat(filterMinAmount)) return false;
            if (filterMaxAmount && record.amount > parseFloat(filterMaxAmount)) return false;
            
            // Date range filtering
            const recordDate = new Date(record.date);
            if (filterFromDate) {
                const fromDate = new Date(filterFromDate);
                if (recordDate < fromDate) return false;
            }
            if (filterToDate) {
                const toDate = new Date(filterToDate);
                toDate.setHours(23, 59, 59, 999); // Include the entire end date
                if (recordDate > toDate) return false;
            }
            
            return true;
        });
    };

    const filteredRecords = getFilteredRecords();

    return (
        <div className=" ">
            {/* Header */}
             <h1 className="text-xl sm:text-3xl font-bold mb-2">Credit/Debit Management </h1>
          
               

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2  mb-2">
                    <Button
                        onClick={() => setOpeningBalanceDialogOpen(true)}
                        variant="outline"
                        className="w-[90%] sm:w-full"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Opening Balance
                    </Button>
                    <Button
                        onClick={() => {
                            setEditMode(false);
                            setEditingId(null);
                            creditDebitForm.reset({
                                date: new Date().toISOString().split("T")[0],
                                particular: "",
                                type: "",
                                amountType: "Credit",
                                paymentMode: "cash",
                                transactionId: "",
                                amount: "",
                                balance: "",
                            });
                            setCreditDebitDialogOpen(true);
                        }}
                        className="w-[90%] sm:w-full"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Credit/Debit
                    </Button>
                    <Button
                        onClick={handleDownloadPDF}
                        variant="outline"
                        className="w-[90%] sm:w-full"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                    <Button
                        onClick={loadRecords}
                        variant="outline"
                        disabled={loading}
                        className="w-[90%] sm:w-full"
                    >
                        <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
          

            {/* Filters Section */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block">Type</label>
                            <Select value={filterType} onValueChange={setFilterType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="Sales">Sales</SelectItem>
                                    <SelectItem value="Loan Received">Loan Received</SelectItem>
                                    <SelectItem value="Rent">Rent</SelectItem>
                                    <SelectItem value="Salary">Salary</SelectItem>
                                    <SelectItem value="Material">Material</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Amount Type</label>
                            <Select value={filterAmountType} onValueChange={setFilterAmountType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select amount type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="Credit">Credit</SelectItem>
                                    <SelectItem value="Debit">Debit</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Payment Mode</label>
                            <Select value={filterPaymentMode} onValueChange={setFilterPaymentMode}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select payment mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                    <SelectItem value="bank">Bank Transfer</SelectItem>
                                    <SelectItem value="cheque">Cheque</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">From Date</label>
                            <Input
                                type="date"
                                value={filterFromDate}
                                onChange={(e) => setFilterFromDate(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">To Date</label>
                            <Input
                                type="date"
                                value={filterToDate}
                                onChange={(e) => setFilterToDate(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-sm font-medium mb-2 block">Min Amount</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={filterMinAmount}
                                    onChange={(e) => setFilterMinAmount(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-2 block">Max Amount</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={filterMaxAmount}
                                    onChange={(e) => setFilterMaxAmount(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-4 gap-2">
                        <Button
                            onClick={clearFilters}
                            variant="outline"
                            size="sm"
                        >
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Clear Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Opening Balance</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{summary.openingBalance.toFixed(2)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{summary.cashBalance.toFixed(2)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bank Balance</CardTitle>
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{summary.bankBalance.toFixed(2)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Cheque</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{summary.pendingCheque.toFixed(2)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Debit</CardTitle>
                        <TrendingDown className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-500">₹{summary.totalDebit.toFixed(2)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Credit</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-500">₹{summary.totalCredit.toFixed(2)}</div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Closing Balance</CardTitle>
                        <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{summary.closingBalance.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Hidden Print Section */}
            <div ref={printRef} className="hidden">
                <div className="header">
                    <h1 className="text-2xl font-bold">Credit/Debit Report</h1>
                    <p className="text-sm text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
                </div>

                <div className="summary">
                    <h2 className="text-lg font-bold mb-2">Summary</h2>
                    <div className="summary-item">
                        <span>Opening Balance:</span>
                        <span>₹{summary.openingBalance.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        <span>Cash Balance:</span>
                        <span>₹{summary.cashBalance.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        <span>Bank Balance:</span>
                        <span>₹{summary.bankBalance.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        <span>Pending Cheque:</span>
                        <span>₹{summary.pendingCheque.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        <span>Total Debit:</span>
                        <span>₹{summary.totalDebit.toFixed(2)}</span>
                    </div>
                    <div className="summary-item">
                        <span>Total Credit:</span>
                        <span>₹{summary.totalCredit.toFixed(2)}</span>
                    </div>
                    <div className="summary-item" style={{ borderTop: "2px solid #000", paddingTop: "8px", marginTop: "8px", fontWeight: "bold" }}>
                        <span>Closing Balance:</span>
                        <span>₹{summary.closingBalance.toFixed(2)}</span>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Particular</th>
                            <th>Type</th>
                            <th>Amount Type</th>
                            <th>Payment Mode</th>
                            <th>Transaction ID</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRecords.map((record) => (
                            <tr key={record._id}>
                                <td>{new Date(record.date).toLocaleDateString()}</td>
                                <td title={record.particular}>{record.particular.substring(0, 30)}{record.particular.length > 30 ? '...' : ''}</td>
                                <td>{record.type}</td>
                                <td>
                                    <Badge variant={record.amountType === "Credit" ? "default" : "destructive"}>
                                        {record.amountType}
                                    </Badge>
                                </td>
                                <td>{record.paymentMode}</td>
                                <td>{record.transactionId}</td>
                                <td>₹{record.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Records Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Records {filteredRecords.length !== records.length && `(${filteredRecords.length} of ${records.length})`}</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center h-48">
                            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : filteredRecords.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                            <p>No records found</p>
                            <p className="text-sm">Try adjusting your filters or add new records</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto w-[95vw] sm:w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>S.No</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Particular</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Amount Type</TableHead>
                                    <TableHead>Payment Mode</TableHead>
                                    <TableHead>Transaction ID</TableHead>
                                    <TableHead className="text-center">Amount</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRecords.map((record) => (
                                    <TableRow key={record._id}>
                                        <TableCell>{filteredRecords.indexOf(record) + 1}</TableCell>
                                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger className="text-left w-full truncate block">
                                                        {record.particular}
                                                    </TooltipTrigger>
                                                    <TooltipContent side="top" className="max-w-md">
                                                        <p>{record.particular}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                        <TableCell>{record.type}</TableCell>
                                        <TableCell>
                                            <Badge variant={record.amountType === "Credit" ? "default" : "destructive"}>
                                                {record.amountType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1">
                                                {record.paymentMode === "cash" && <Banknote className="h-4 w-4" />}
                                                {record.paymentMode === "bank" && <Banknote className="h-4 w-4" />}
                                                {record.paymentMode === "cheque" && <CheckCircle className="h-4 w-4" />}
                                                <span className="capitalize">{record.paymentMode}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{record.transactionId}</TableCell>
                                        <TableCell className={`text-right font-bold ${record.amountType === "Credit" ? "text-green-500" : "text-red-500"} flex gap-2`}>
                                            {
                                                record.amountType === "Credit" ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />
                                            } ₹{record.amount.toFixed(2)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(record)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDeleteClick(record._id)}
                                                    className="text-red-500 hover:text-red-700"
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
                    )}
                </CardContent>
            </Card>

            {/* Credit/Debit Dialog */}
            <Dialog open={creditDebitDialogOpen} onOpenChange={setCreditDebitDialogOpen}>
                <DialogContent className="max-w-[80%] sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editMode ? "Edit Credit/Debit Record" : "Add Credit/Debit Record"}
                        </DialogTitle>
                        <DialogDescription>
                            {editMode ? "Update the record details below." : "Fill in the details to add a new credit/debit record."}
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...creditDebitForm}>
                        <form onSubmit={creditDebitForm.handleSubmit(handleAddCreditDebit)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={creditDebitForm.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Date</FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={creditDebitForm.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Sales">Sales</SelectItem>
                                                    <SelectItem value="Loan Received">Loan Received</SelectItem>
                                                    <SelectItem value="Rent">Rent</SelectItem>
                                                    <SelectItem value="Salary">Salary</SelectItem>
                                                    <SelectItem value="Material">Material</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={creditDebitForm.control}
                                name="particular"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Particular</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Description of the transaction" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={creditDebitForm.control}
                                    name="amountType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="Credit">Credit</SelectItem>
                                                    <SelectItem value="Debit">Debit</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={creditDebitForm.control}
                                    name="paymentMode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Payment Mode</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select payment mode" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="cash">Cash</SelectItem>
                                                    <SelectItem value="bank">Bank Transfer</SelectItem>
                                                    <SelectItem value="cheque">Cheque</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={creditDebitForm.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Amount</FormLabel>
                                            <FormControl>
                                                <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={creditDebitForm.control}
                                    name="transactionId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Transaction ID / Reference</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter transaction ID" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCreditDebitDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    {editMode ? "Update" : "Create"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Opening Balance Dialog */}
            <Dialog open={openingBalanceDialogOpen} onOpenChange={setOpeningBalanceDialogOpen}>
                <DialogContent className="max-w-[80%] sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Opening Balance</DialogTitle>
                        <DialogDescription>
                            Set the opening balance for your accounts. This can only be done once.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...openingBalanceForm}>
                        <form onSubmit={openingBalanceForm.handleSubmit(handleOpeningBalanceSubmit)} className="space-y-4">
                            <FormField
                                control={openingBalanceForm.control}
                                name="balance"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Opening Balance Amount</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={openingBalanceForm.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOpeningBalanceDialogOpen(false)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit">
                                    Save Opening Balance
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the credit/debit record.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}