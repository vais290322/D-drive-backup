import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../common/api.js";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  DollarSign,
  Search,
  X,
  FileText
} from "lucide-react";

const DashboardPage = () => {
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDays, setExpandedDays] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    type: "outward", // 'inward' or 'outward'
    amount: ""
  });

  const [activeSubItem, setActiveSubItem] = useState({
    dayId: "",
    subItemId: "",
    originalDate: ""
  });

  const user = useSelector((state) => state.auth.user);

  const fetchLedger = async () => {
    try {
      setLoading(true);
      const response = await api.get("/ledger");
      if (response.data.success) {
        setLedger(response.data.data);
        // By default, expand all days to make it easy to see details
        const expands = {};
        response.data.data.forEach(day => {
          expands[day._id] = true;
        });
        setExpandedDays(expands);
      }
    } catch (error) {
      toast.error("Failed to load ledger data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const toggleDayExpansion = (dayId) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      return toast.error("Please fill all required fields");
    }

    const payload = {
      date: formData.date,
      description: formData.description,
      inward: formData.type === "inward" ? parseFloat(formData.amount) : 0,
      outward: formData.type === "outward" ? parseFloat(formData.amount) : 0
    };

    try {
      const response = await api.post("/ledger", payload);
      if (response.data.success) {
        toast.success("Transaction added successfully");
        setIsAddModalOpen(false);
        resetForm();
        fetchLedger();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add transaction");
    }
  };

  const handleEditClick = (day, item) => {
    setFormData({
      date: new Date(day.date).toISOString().split("T")[0],
      description: item.description,
      type: item.inward > 0 ? "inward" : "outward",
      amount: item.inward > 0 ? item.inward : item.outward
    });
    setActiveSubItem({
      dayId: day._id,
      subItemId: item._id,
      originalDate: day.date
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) {
      return toast.error("Please fill all required fields");
    }

    const payload = {
      date: formData.date,
      description: formData.description,
      inward: formData.type === "inward" ? parseFloat(formData.amount) : 0,
      outward: formData.type === "outward" ? parseFloat(formData.amount) : 0
    };

    try {
      const response = await api.put(
        `/ledger/day/${activeSubItem.dayId}/transaction/${activeSubItem.subItemId}`,
        payload
      );
      if (response.data.success) {
        toast.success("Transaction updated successfully");
        setIsEditModalOpen(false);
        resetForm();
        fetchLedger();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update transaction");
    }
  };

  const handleDeleteClick = (dayId, subItemId) => {
    setActiveSubItem({
      dayId,
      subItemId
    });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      const response = await api.delete(
        `/ledger/day/${activeSubItem.dayId}/transaction/${activeSubItem.subItemId}`
      );
      if (response.data.success) {
        toast.success("Transaction deleted successfully");
        setIsDeleteModalOpen(false);
        fetchLedger();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete transaction");
    }
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      description: "",
      type: "outward",
      amount: ""
    });
    setActiveSubItem({
      dayId: "",
      subItemId: "",
      originalDate: ""
    });
  };

  // Helper formatting functions
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getUTCDate()).padStart(2, "0");
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const year = d.getUTCFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Calculate totals for card summaries
  const totalInward = ledger.reduce((sum, d) => sum + d.receipts, 0);
  const totalOutward = ledger.reduce((sum, d) => sum + d.issues, 0);
  const closingBalance = ledger.length > 0 ? ledger[ledger.length - 1].closing : (user?.initialOpeningBalance || 0);

  // Search filter
  const filteredLedger = ledger.filter((day) => {
    const dateMatch = formatDate(day.date).includes(searchTerm);
    const itemMatch = day.subItems.some((item) =>
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return dateMatch || itemMatch;
  });

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400">
            Expense Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track daily ledger cashflows, income entries, and outward expenditures.
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="cursor-pointer flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-4 py-2.5 rounded-lg font-medium shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" />
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 bg-white dark:bg-card border dark:border-border/30 rounded-2xl shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Current Closing Balance</p>
            <p className="text-2xl font-bold mt-1 text-slate-800 dark:text-slate-100">
              {formatCurrency(closingBalance)}
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 bg-white dark:bg-card border dark:border-border/30 rounded-2xl shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-950/40 flex items-center justify-center text-green-600 dark:text-green-400">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Inwards (Receipts)</p>
            <p className="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">
              {formatCurrency(totalInward)}
            </p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="p-6 bg-white dark:bg-card border dark:border-border/30 rounded-2xl shadow-sm flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Outwards (Issues)</p>
            <p className="text-2xl font-bold mt-1 text-rose-600 dark:text-rose-400">
              {formatCurrency(totalOutward)}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50 dark:bg-card/30 p-4 rounded-xl border dark:border-border/30">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by description or date (DD-MM-YYYY)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-card border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
          />
        </div>
        <div className="text-xs text-muted-foreground self-end md:self-center">
          Showing {filteredLedger.length} ledger days
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="hidden md:block bg-white dark:bg-card rounded-2xl border dark:border-border/30 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <div className="w-10 h-10 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
            <span>Fetching ledger entries...</span>
          </div>
        ) : filteredLedger.length === 0 ? (
          <div className="p-16 text-center text-muted-foreground flex flex-col items-center gap-4">
            <FileText className="w-16 h-16 text-slate-300 dark:text-slate-700" />
            <div>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">No Ledger Entries Found</p>
              <p className="text-sm mt-1">Try adding a new transaction or clearing your search filter.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-border/30 text-xs font-semibold text-muted-foreground uppercase">
                  <th className="py-4 px-4 w-[60px] text-center">SI</th>
                  <th className="py-4 px-4 w-[120px]">Date</th>
                  <th className="py-4 px-4 w-[110px] text-right">Opening</th>
                  <th className="py-4 px-4 w-[130px] text-right text-green-700 dark:text-green-500">Receipts/Inward</th>
                  <th className="py-4 px-4 w-[130px] text-right text-rose-700 dark:text-rose-500">Issues/Outward</th>
                  <th className="py-4 px-4 w-[110px] text-right">Total</th>
                  <th className="py-4 px-4 w-[110px] text-right">Closing</th>
                  <th className="py-4 px-4 w-[80px] text-center">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredLedger.map((day) => {
                  const isExpanded = !expandedDays[day._id];
                  return (
                    <React.Fragment key={day._id}>
                      {/* Day Header Row */}
                      <tr className="border-b dark:border-border/20 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors duration-150 font-semibold text-sm bg-purple-50/20 dark:bg-purple-950/5 text-slate-800 dark:text-slate-100">
                        <td className="py-3.5 px-4 text-center text-slate-500 dark:text-slate-400">
                          {day.serialNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {formatDate(day.date)}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {formatCurrency(day.opening)}
                        </td>
                        <td className="py-3.5 px-4 text-right text-green-600 dark:text-green-400">
                          {formatCurrency(day.receipts)}
                        </td>
                        <td className="py-3.5 px-4 text-right text-rose-600 dark:text-rose-400">
                          {formatCurrency(day.issues)}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {formatCurrency(day.total)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-purple-700 dark:text-purple-400">
                          {formatCurrency(day.closing)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => toggleDayExpansion(day._id)}
                            className="cursor-pointer p-1 rounded-md text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="w-4.5 h-4.5" /> : <ChevronDown className="w-4.5 h-4.5" />}
                          </button>
                        </td>
                      </tr>

                      {/* Day SubItems Accordion */}
                      {isExpanded && day.subItems && day.subItems.length > 0 && (
                        <tr>
                          <td colSpan={8} className="p-0 bg-slate-50/40 dark:bg-slate-900/10">
                            <div className="px-4 py-3 border-b border-slate-200 dark:border-border/20">
                              <table className="w-full text-xs text-left">
                                <thead>
                                  <tr className="text-muted-foreground uppercase border-b dark:border-border/10">
                                    <th className="py-2 px-3 w-[70px] text-center">Sub SI</th>
                                    <th className="py-2 px-3">Description</th>
                                    <th className="py-2 px-3 w-[110px] text-right">Opening</th>
                                    <th className="py-2 px-3 w-[130px] text-right">Receipts</th>
                                    <th className="py-2 px-3 w-[130px] text-right">Issues</th>
                                    <th className="py-2 px-3 w-[120px] text-right">Closing</th>
                                    <th className="py-2 px-3 w-[100px] text-center">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {day.subItems.map((item) => (
                                    <tr
                                      key={item._id}
                                      className="border-b border-slate-200/50 dark:border-border/10 hover:bg-slate-100/30 dark:hover:bg-slate-800/10 text-slate-700 dark:text-slate-300 transition-colors"
                                    >
                                      <td className="py-2.5 px-3 text-center text-slate-400">
                                        {item.serial}
                                      </td>
                                      <td className="py-2.5 px-3 font-medium">
                                        {item.description}
                                      </td>
                                      <td className="py-2.5 px-3 text-right text-slate-400">
                                        0
                                      </td>
                                      <td className="py-2.5 px-3 text-right text-green-600 dark:text-green-500 font-medium">
                                        {item.inward > 0 ? formatCurrency(item.inward) : "-"}
                                      </td>
                                      <td className="py-2.5 px-3 text-right text-rose-600 dark:text-rose-500 font-medium">
                                        {item.outward > 0 ? formatCurrency(item.outward) : "-"}
                                      </td>
                                      <td className="py-2.5 px-3 text-right font-medium">
                                        {formatCurrency(item.closing)}
                                      </td>
                                      <td className="py-2.5 px-3 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                          <button
                                            onClick={() => handleEditClick(day, item)}
                                            className="cursor-pointer p-1 rounded hover:bg-purple-100 dark:hover:bg-purple-950/30 text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
                                          >
                                            <Edit2 className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            onClick={() => handleDeleteClick(day._id, item._id)}
                                            className="cursor-pointer p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950/30 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* for mobile screen main ledger card view  */}
      <div className="flex md:hidden flex-col gap-3">
        {filteredLedger.map((day) => {
          const isExpanded = !expandedDays[day._id];
          return (
            <div key={day._id} className="bg-white dark:bg-card rounded-2xl border border-slate-200 dark:border-border/30 shadow-sm overflow-hidden">

              {/* Card header — tappable */}
              <button
                onClick={() => toggleDayExpansion(day._id)}
                className="w-full text-left px-4 pt-4 pb-3 focus:outline-none"
              >
                {/* Top row: date + serial + chevron */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-100">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    {formatDate(day.date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                      #{day.serialNumber}
                    </span>
                    {isExpanded
                      ? <ChevronUp className="w-4 h-4 text-slate-400" />
                      : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* 2×2 stat grid */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Opening</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(day.opening)}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-950/20 rounded-xl px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-green-600 dark:text-green-500 mb-0.5">Receipts</p>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">+ {formatCurrency(day.receipts)}</p>
                  </div>
                  <div className="bg-rose-50 dark:bg-rose-950/20 rounded-xl px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-rose-500 dark:text-rose-400 mb-0.5">Issues</p>
                    <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">− {formatCurrency(day.issues)}</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900 rounded-xl px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-slate-400 mb-0.5">Total</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{formatCurrency(day.total)}</p>
                  </div>
                </div>
              </button>

              {/* Closing balance strip */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-purple-50/60 dark:bg-purple-950/10 border-t border-purple-100 dark:border-purple-900/30">
                <span className="text-xs text-slate-500 dark:text-slate-400">Closing balance</span>
                <span className="text-sm font-bold text-purple-700 dark:text-purple-400">{formatCurrency(day.closing)}</span>
              </div>

              {/* Expanded sub-items */}
              {isExpanded && day.subItems && day.subItems.length > 0 && (
                <div className="border-t border-slate-100 dark:border-border/20 bg-slate-50/40 dark:bg-slate-900/10">
                  <p className="px-4 pt-2.5 pb-1 text-[10px] uppercase tracking-widest text-slate-400">
                    Transactions
                  </p>
                  {day.subItems.map((item) => (
                    <div key={item._id} className="px-4 py-3 border-t border-slate-100 dark:border-border/10">
                      {/* Description + Actions */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs text-slate-400 shrink-0">{item.serial}</span>
                          <span className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                            {item.description}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleEditClick(day, item)}
                            className="p-1.5 rounded-md hover:bg-purple-100 dark:hover:bg-purple-950/30 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
                            aria-label="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(day._id, item._id)}
                            className="p-1.5 rounded-md hover:bg-rose-100 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-all"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      {/* Amount chips */}
                      <div className="flex flex-wrap gap-2">
                        {item.inward > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400">
                            ↓ {formatCurrency(item.inward)}
                          </span>
                        )}
                        {item.outward > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400">
                            ↑ {formatCurrency(item.outward)}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          Closing {formatCurrency(item.closing)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-card border dark:border-border/30 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b dark:border-border/20 bg-slate-50 dark:bg-slate-900/50">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-purple-500" />
                  Add Transaction
                </h2>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border dark:border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Office Supplies, Client Invoice"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border dark:border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Transaction Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: "inward" })}
                      className={`cursor-pointer py-2.5 rounded-lg border font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${formData.type === "inward"
                        ? "bg-green-50 border-green-500 text-green-700 dark:bg-green-950/20 dark:border-green-400 dark:text-green-400 shadow-sm"
                        : "border-slate-200 dark:border-border/30 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      Inward (Receipt)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: "outward" })}
                      className={`cursor-pointer py-2.5 rounded-lg border font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${formData.type === "outward"
                        ? "bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/20 dark:border-rose-400 dark:text-rose-400 shadow-sm"
                        : "border-slate-200 dark:border-border/30 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                    >
                      <ArrowDownLeft className="w-4 h-4" />
                      Outward (Issue)
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Amount (INR)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                    <input
                      type="number"
                      required
                      placeholder="0"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border dark:border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t dark:border-border/20">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="cursor-pointer px-4 py-2 border dark:border-border/30 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-lg text-sm font-semibold shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Add Transaction
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Transaction Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-card border dark:border-border/30 rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b dark:border-border/20 bg-slate-50 dark:bg-slate-900/50">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-purple-500" />
                  Edit Transaction
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="cursor-pointer p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border dark:border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                  <input
                    type="text"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-slate-900 border dark:border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Transaction Type</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: "inward" })}
                      className={`cursor-pointer py-2.5 rounded-lg border font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${formData.type === "inward"
                        ? "bg-green-50 border-green-500 text-green-700 dark:bg-green-950/20 dark:border-green-400 dark:text-green-400 shadow-sm"
                        : "border-slate-200 dark:border-border/30 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      Inward (Receipt)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: "outward" })}
                      className={`cursor-pointer py-2.5 rounded-lg border font-medium text-sm transition-all flex items-center justify-center gap-1.5 ${formData.type === "outward"
                        ? "bg-rose-50 border-rose-500 text-rose-700 dark:bg-rose-950/20 dark:border-rose-400 dark:text-rose-400 shadow-sm"
                        : "border-slate-200 dark:border-border/30 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
                        }`}
                    >
                      <ArrowDownLeft className="w-4 h-4" />
                      Outward (Issue)
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Amount (INR)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
                    <input
                      type="number"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border dark:border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t dark:border-border/20">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="cursor-pointer px-4 py-2 border dark:border-border/30 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="cursor-pointer px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-lg text-sm font-semibold shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Transaction Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-white dark:bg-card border dark:border-border/30 rounded-2xl shadow-xl p-6 space-y-4"
            >
              <div className="flex items-center gap-3 text-rose-500">
                <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center">
                  <Trash2 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Delete Transaction</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Are you sure you want to delete this transaction? This action will recalculate all daily ledger opening and closing carryforwards.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="cursor-pointer px-4 py-2 border dark:border-border/30 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm text-slate-600 dark:text-slate-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSubmit}
                  className="cursor-pointer px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold shadow transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;