import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/db/api";
import { Plus, Trash2, Save, X, Loader2, Download, FileText, Filter, Pencil } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { getBrandsByCategory } from "@/constants/brands";

export default function ProfitAndLoss() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Filter State
    const [dateRange, setDateRange] = useState({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // Start of current month
        to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0] // End of current month
    });
    const [brandFilter, setBrandFilter] = useState<string>('all');

    const initialItemState = {
        date: new Date().toISOString().split('T')[0],
        product_type: 'Others',
        brand: '',
        product_details: '',
        lead_given_by: '',
        on_bill_amount: 0,
        booster_amount: 0,
        cn_amount: 0,
        other_amount: 0,
        gift_amount: 0,
        ref_bonus: 0
    };

    const [newItem, setNewItem] = useState(initialItemState);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const records = await api.pnl.getAll();
            setData(records);
        } catch (error) {
            console.error("Error loading P&L data:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotalIncome = (item: any) => {
        return (Number(item.on_bill_amount) || 0) +
            (Number(item.booster_amount) || 0) +
            (Number(item.cn_amount) || 0) +
            (Number(item.other_amount) || 0);
    };

    const calculateNetProfit = (item: any) => {
        const income = calculateTotalIncome(item);
        return income - (Number(item.gift_amount) || 0) - (Number(item.ref_bonus) || 0);
    };

    // Filter Logic
    const filteredData = useMemo(() => {
        return data.filter(item => {
            const itemDate = new Date(item.date).toISOString().split('T')[0];
            const dateMatch = itemDate >= dateRange.from && itemDate <= dateRange.to;
            const brandMatch = brandFilter === 'all' || !item.brand || item.brand === brandFilter;
            return dateMatch && brandMatch;
        });
    }, [data, dateRange, brandFilter]);

    // Summary Calculation
    const totalSummary = useMemo(() => {
        return filteredData.reduce((acc, item) => {
            const income = calculateTotalIncome(item);
            const profit = calculateNetProfit(item);
            return {
                income: acc.income + income,
                profit: acc.profit + profit,
                expenses: acc.expenses + (Number(item.gift_amount) || 0) + (Number(item.ref_bonus) || 0)
            };
        }, { income: 0, profit: 0, expenses: 0 });
    }, [filteredData]);

    const handleSave = async () => {
        try {
            if (editingId) {
                await api.pnl.update(editingId, newItem);
            } else {
                await api.pnl.create(newItem);
            }

            setIsAdding(false);
            setEditingId(null);
            setNewItem(initialItemState);
            loadData();
        } catch (error) {
            console.error("Error saving record:", error);
        }
    };

    const handleEdit = (item: any) => {
        setNewItem({
            ...item,
            date: new Date(item.date).toISOString().split('T')[0]
        });
        setEditingId(item.id || item._id);
        setIsAdding(true);
    };

    const handleCancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setNewItem(initialItemState);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this record?")) {
            try {
                await api.pnl.delete(id);
                loadData();
            } catch (error) {
                console.error("Error deleting record:", error);
            }
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            maximumFractionDigits: 0,
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const handleExportCSV = () => {
        const exportData = filteredData.map((item, index) => ({
            'Sl No': index + 1,
            'Date': new Date(item.date).toLocaleDateString(),
            'Type': item.product_type,
            'Brand': item.brand || '-',
            'Details': item.product_details,
            'Lead Given By': item.lead_given_by,
            'On Bill Amt': item.on_bill_amount,
            'Booster Amt': item.booster_amount,
            'CN Amt': item.cn_amount,
            'Other Amt': item.other_amount,
            'Total Income': calculateTotalIncome(item),
            'Gift Amount': item.gift_amount,
            'Ref Bonus': item.ref_bonus,
            'Net Profit': calculateNetProfit(item)
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "ProfitAndLoss");
        XLSX.writeFile(wb, `Profit_Loss_Report_${new Date().toISOString().split('T')[0]}.csv`);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a4');

        doc.setFontSize(18);
        doc.text("Profit and Loss Report", 14, 22);
        doc.setFontSize(11);
        doc.text(`From: ${new Date(dateRange.from).toLocaleDateString()} To: ${new Date(dateRange.to).toLocaleDateString()}`, 14, 30);

        // Summary in PDF
        doc.text(`Total Income: ${formatCurrency(totalSummary.income)}`, 14, 40);
        doc.text(`Total Expenses: ${formatCurrency(totalSummary.expenses)}`, 80, 40);
        doc.text(`Net Profit: ${formatCurrency(totalSummary.profit)}`, 150, 40);

        const tableColumn = ["Sl", "Date", "Type", "Brand", "Details", "Lead By", "Income", "Expenses", "Profit"];
        const tableRows = filteredData.map((item, index) => [
            index + 1,
            new Date(item.date).toLocaleDateString(),
            item.product_type,
            item.brand || '-',
            item.product_details,
            item.lead_given_by,
            formatCurrency(calculateTotalIncome(item)),
            formatCurrency((Number(item.gift_amount) || 0) + (Number(item.ref_bonus) || 0)),
            formatCurrency(calculateNetProfit(item))
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 50,
        });

        doc.save(`Profit_Loss_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const handleExportSimplifiedPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a4');

        // Modern Header Design
        // Background gradient effect with colored rectangle
        doc.setFillColor(41, 128, 185); // Professional blue
        doc.rect(0, 0, 297, 45, 'F');

        // Company/Report Name
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", 'bold');
        doc.text("Mit Electro World", 14, 20);

        // Report Title
        doc.setFontSize(16);
        doc.setFont("helvetica", 'normal');
        doc.text("Profit & Loss Report (Simplified)", 14, 30);

        // Date Range
        doc.setFontSize(10);
        doc.text(`Period: ${new Date(dateRange.from).toLocaleDateString('en-IN')} - ${new Date(dateRange.to).toLocaleDateString('en-IN')}`, 14, 38);

        // Report Date
        doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN')}`, 220, 38);

        // Calculate totals
        const totalBooster = filteredData.reduce((sum, item) => sum + (Number(item.booster_amount) || 0), 0);
        const totalCN = filteredData.reduce((sum, item) => sum + (Number(item.cn_amount) || 0), 0);

        // Simple currency formatter for PDF (avoids special characters)
        const formatPDFCurrency = (amount: number) => {
            return `₹${amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
        };

        // Table columns
        const tableColumn = ["Sl No", "Date", "Type", "Brand", "Product Details", "Lead By", "Booster Amt", "CN Amt"];
        const tableRows = filteredData.map((item, index) => [
            index + 1,
            new Date(item.date).toLocaleDateString('en-IN'),
            item.product_type,
            item.brand || '-',
            item.product_details,
            item.lead_given_by,
            formatPDFCurrency(item.booster_amount || 0),
            formatPDFCurrency(item.cn_amount || 0)
        ]);

        // Enhanced Table
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 52,
            theme: 'striped',
            styles: {
                fontSize: 9,
                cellPadding: 3,
                lineColor: [200, 200, 200],
                lineWidth: 0.1
            },
            headStyles: {
                fillColor: [52, 73, 94],
                textColor: 255,
                fontSize: 10,
                fontStyle: 'bold',
                halign: 'center'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            columnStyles: {
                0: { halign: 'center', cellWidth: 15 },
                1: { halign: 'center', cellWidth: 25 },
                2: { halign: 'center', cellWidth: 25 },
                3: { halign: 'left', cellWidth: 30 },
                4: { halign: 'left', cellWidth: 70 },
                5: { halign: 'left', cellWidth: 35 },
                6: { halign: 'right', cellWidth: 30, textColor: [0, 100, 0] },
                7: { halign: 'right', cellWidth: 30, textColor: [0, 100, 0] }
            }
        });

        // Professional Footer with Totals
        const finalY = (doc as any).lastAutoTable.finalY || 52;

        // Separator line
        doc.setDrawColor(41, 128, 185);
        doc.setLineWidth(0.5);
        doc.line(14, finalY + 8, 283, finalY + 8);

        // Totals Section
        doc.setTextColor(52, 73, 94);
        doc.setFontSize(11);
        doc.setFont("helvetica", 'bold');
        doc.text("Summary:", 14, finalY + 18);

        // Total boxes
        // Booster Amount Box
        doc.setFillColor(46, 204, 113); // Green
        doc.roundedRect(100, finalY + 12, 80, 12, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text("Total Booster Amount", 105, finalY + 17);
        doc.setFontSize(11);
        doc.setFont("helvetica", 'bold');
        doc.text(formatPDFCurrency(totalBooster), 175, finalY + 17, { align: 'right' });

        // CN Amount Box
        doc.setFillColor(52, 152, 219); // Blue
        doc.roundedRect(185, finalY + 12, 80, 12, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text("Total CN Amount", 190, finalY + 17);
        doc.setFontSize(11);
        doc.setFont("helvetica", 'bold');
        doc.text(formatPDFCurrency(totalCN), 260, finalY + 17, { align: 'right' });

        // Footer note
        doc.setTextColor(150, 150, 150);
        doc.setFontSize(8);
        doc.setFont("helvetica", 'italic');
        const pageHeight = doc.internal.pageSize.height;
        doc.text("This is a computer-generated document. No signature required.", 14, pageHeight - 10);
        doc.text(`Page 1 of 1`, 283, pageHeight - 10, { align: 'right' });

        doc.save(`Simplified_PL_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div className="space-y-4 h-full flex flex-col">

            {/* ── Header ── */}
            <div className="flex flex-col gap-3 shrink-0">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Profit &amp; Loss
                        </h1>
                        <p className="text-xs sm:text-sm text-muted-foreground">Track income, expenses, and net profit</p>
                    </div>

                    {/* Action buttons — 2-col grid on mobile, row on desktop */}
                    <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2">
                        <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={handleExportCSV}>
                            <FileText className="mr-1 h-4 w-4" /> CSV
                        </Button>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={handleExportPDF}>
                            <Download className="mr-1 h-4 w-4" /> Full PDF
                        </Button>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto" onClick={handleExportSimplifiedPDF}>
                            <Download className="mr-1 h-4 w-4" /> Simple PDF
                        </Button>
                        <Button
                            size="sm"
                            className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent col-span-2 sm:col-span-1"
                            onClick={() => { setIsAdding(true); setEditingId(null); setNewItem(initialItemState); }}
                            disabled={isAdding}
                        >
                            <Plus className="mr-1 h-4 w-4" /> Add Record
                        </Button>
                    </div>
                </div>

                {/* ── Filter & Summary Bar ── */}
                <div className="flex flex-col gap-3 bg-muted/40 p-3 sm:p-4 rounded-xl border">

                    {/* Filters row */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                        <span className="text-xs sm:text-sm font-medium shrink-0">Range:</span>

                        <Input
                            type="date"
                            value={dateRange.from}
                            onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                            className="h-8 text-xs sm:text-sm bg-background w-auto min-w-[130px]"
                        />
                        <span className="text-xs text-muted-foreground shrink-0">to</span>
                        <Input
                            type="date"
                            value={dateRange.to}
                            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                            className="h-8 text-xs sm:text-sm bg-background w-auto min-w-[130px]"
                        />

                        <Select value={brandFilter} onValueChange={setBrandFilter}>
                            <SelectTrigger className="h-8 text-xs sm:text-sm bg-background w-[140px] sm:w-[180px]">
                                <SelectValue placeholder="All Brands" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Brands</SelectItem>
                                {Array.from(new Set(data.filter(item => item.brand).map(item => item.brand))).sort().map(brand => (
                                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Summary row — 3 cols on all sizes */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                        <div className="flex flex-col items-center sm:items-end bg-blue-50 dark:bg-blue-950/30 rounded-lg p-2">
                            <span className="text-[10px] sm:text-xs text-muted-foreground">Total Income</span>
                            <span className="text-sm sm:text-lg font-bold text-blue-600">{formatCurrency(totalSummary.income)}</span>
                        </div>
                        <div className="flex flex-col items-center sm:items-end bg-red-50 dark:bg-red-950/30 rounded-lg p-2">
                            <span className="text-[10px] sm:text-xs text-muted-foreground">Total Expenses</span>
                            <span className="text-sm sm:text-lg font-bold text-red-500">{formatCurrency(totalSummary.expenses)}</span>
                        </div>
                        <div className="flex flex-col items-center sm:items-end bg-green-50 dark:bg-green-950/30 rounded-lg p-2">
                            <span className="text-[10px] sm:text-xs text-muted-foreground">Net Profit</span>
                            <span className="text-sm sm:text-xl font-bold text-green-600">{formatCurrency(totalSummary.profit)}</span>
                        </div>
                    </div>
                </div>

                {/* ── Add / Edit Record Card (mobile-friendly form) ── */}
                {isAdding && (
                    <Card className="border border-primary/30 bg-primary/5 shadow-md">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-semibold text-sm">
                                    {editingId ? "Edit Record" : "Add New Record"}
                                </h3>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={handleSave} className="h-8 bg-green-600 hover:bg-green-700">
                                        <Save className="h-3 w-3 mr-1" /> Save
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={handleCancel} className="h-8">
                                        <X className="h-3 w-3 mr-1" /> Cancel
                                    </Button>
                                </div>
                            </div>

                            {/* Row 1: date, type, brand, details, lead */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 mb-2">
                                <div>
                                    <label className="text-[10px] text-muted-foreground mb-0.5 block">Date</label>
                                    <Input
                                        type="date"
                                        value={newItem.date}
                                        onChange={e => setNewItem({ ...newItem, date: e.target.value })}
                                        className="h-8 text-xs"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-muted-foreground mb-0.5 block">Product Type</label>
                                    <Select value={newItem.product_type} onValueChange={v => setNewItem({ ...newItem, product_type: v, brand: '' })}>
                                        <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {['Mobile', 'Laptop', 'TV', 'Vehicle', 'Others'].map(type => (
                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-[10px] text-muted-foreground mb-0.5 block">Brand</label>
                                    {newItem.product_type !== 'Others' && getBrandsByCategory(newItem.product_type).length > 0 ? (
                                        <Select value={newItem.brand} onValueChange={v => setNewItem({ ...newItem, brand: v })}>
                                            <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select brand" /></SelectTrigger>
                                            <SelectContent className="max-h-[300px]">
                                                {getBrandsByCategory(newItem.product_type).map(brand => (
                                                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <Input placeholder="Enter brand" value={newItem.brand} onChange={e => setNewItem({ ...newItem, brand: e.target.value })} className="h-8 text-xs" />
                                    )}
                                </div>
                                <div>
                                    <label className="text-[10px] text-muted-foreground mb-0.5 block">Product Details</label>
                                    <Input placeholder="e.g. Galaxy S24" value={newItem.product_details} onChange={e => setNewItem({ ...newItem, product_details: e.target.value })} className="h-8 text-xs" />
                                </div>
                                <div>
                                    <label className="text-[10px] text-muted-foreground mb-0.5 block">Lead Given By</label>
                                    <Input placeholder="Agent Name" value={newItem.lead_given_by} onChange={e => setNewItem({ ...newItem, lead_given_by: e.target.value })} className="h-8 text-xs" />
                                </div>
                            </div>

                            {/* Row 2: amounts */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
                                {[
                                    { label: 'On Bill Amt', key: 'on_bill_amount', color: 'blue' },
                                    { label: 'Booster Amt', key: 'booster_amount', color: 'blue' },
                                    { label: 'CN Amt', key: 'cn_amount', color: 'blue' },
                                    { label: 'Other Amt', key: 'other_amount', color: 'blue' },
                                    { label: 'Gift Amt', key: 'gift_amount', color: 'red' },
                                    { label: 'Ref Bonus', key: 'ref_bonus', color: 'red' },
                                ].map(({ label, key, color }) => (
                                    <div key={key}>
                                        <label className={`text-[10px] mb-0.5 block font-medium ${color === 'red' ? 'text-red-500' : 'text-blue-600'}`}>{label}</label>
                                        <Input
                                            type="number"
                                            className={`h-8 text-xs text-right ${color === 'red' ? 'border-red-200 focus-visible:ring-red-500' : ''}`}
                                            placeholder="0"
                                            value={(newItem as any)[key] || ''}
                                            onChange={e => setNewItem({ ...newItem, [key]: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                ))}
                                <div>
                                    <label className="text-[10px] text-green-600 font-bold mb-0.5 block">Net Profit</label>
                                    <div className="h-8 text-xs flex items-center justify-end font-bold text-green-600 bg-green-50 rounded-md border px-2">
                                        {formatCurrency(calculateNetProfit(newItem))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* ── Data Table ── */}
            <Card className="flex-1 overflow-hidden border-0 shadow-xl bg-background/50 backdrop-blur-sm">
                <CardContent className="p-0 h-full">
                    <div className="h-full w-[95vw] sm:w-full overflow-auto">
                        <Table className="min-w-[1600px]">
                            <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                <TableRow>
                                    <TableHead className="w-[50px] font-bold">#</TableHead>
                                    <TableHead className="w-[110px] font-bold">Date</TableHead>
                                    <TableHead className="w-[120px] font-bold">Type</TableHead>
                                    <TableHead className="w-[120px] font-bold">Brand</TableHead>
                                    <TableHead className="w-[180px] font-bold">Product Details</TableHead>
                                    <TableHead className="w-[150px] font-bold">Lead Given By</TableHead>
                                    <TableHead className="w-[110px] text-right font-semibold text-blue-600">On Bill</TableHead>
                                    <TableHead className="w-[110px] text-right font-semibold text-blue-600">Booster</TableHead>
                                    <TableHead className="w-[100px] text-right font-semibold text-blue-600">CN Amt</TableHead>
                                    <TableHead className="w-[100px] text-right font-semibold text-blue-600">Other</TableHead>
                                    <TableHead className="w-[120px] text-right font-bold text-white bg-blue-600/90">Total Income</TableHead>
                                    <TableHead className="w-[110px] text-right font-semibold text-red-500">Gift Amt</TableHead>
                                    <TableHead className="w-[100px] text-right font-semibold text-red-500">Ref Bonus</TableHead>
                                    <TableHead className="w-[120px] text-right font-bold text-white bg-green-600/90">Net Profit</TableHead>
                                    <TableHead className="w-[80px] text-center">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={15} className="h-24 text-center">
                                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Loading records...
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredData.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={15} className="h-24 text-center text-muted-foreground">
                                            {data.length > 0 ? "No records found in this date range." : "No records found. Click 'Add Record' to start."}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredData.map((item, index) => (
                                        <TableRow key={item.id || item._id} className="hover:bg-muted/50 group">
                                            <TableCell className="font-medium text-muted-foreground text-xs">
                                                {(index + 1).toString().padStart(2, '0')}
                                            </TableCell>
                                            <TableCell className="text-xs">{new Date(item.date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <span className="px-2 py-0.5 rounded-full bg-secondary text-xs font-medium">
                                                    {item.product_type}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">{item.brand || '-'}</TableCell>
                                            <TableCell className="text-xs font-medium">{item.product_details}</TableCell>
                                            <TableCell className="text-xs">{item.lead_given_by}</TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground">{formatCurrency(item.on_bill_amount)}</TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground">{formatCurrency(item.booster_amount)}</TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground">{formatCurrency(item.cn_amount)}</TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground">{formatCurrency(item.other_amount)}</TableCell>
                                            <TableCell className="text-right font-bold text-sm text-blue-600 bg-blue-50/30">
                                                {formatCurrency(calculateTotalIncome(item))}
                                            </TableCell>
                                            <TableCell className="text-right text-xs text-red-500">{formatCurrency(item.gift_amount)}</TableCell>
                                            <TableCell className="text-right text-xs text-red-500">{formatCurrency(item.ref_bonus)}</TableCell>
                                            <TableCell className="text-right font-bold text-sm text-green-600 bg-green-50/30">
                                                {formatCurrency(calculateNetProfit(item))}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleEdit(item)}
                                                        className="h-7 w-7 text-muted-foreground hover:text-primary"
                                                    >
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => handleDelete(item.id || item._id)}
                                                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
