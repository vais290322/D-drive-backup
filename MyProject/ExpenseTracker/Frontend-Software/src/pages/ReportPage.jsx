import React, { useEffect, useState } from "react";
import api from "../common/api.js";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  RefreshCw,
  BarChart2,
  LineChart
} from "lucide-react";

const ReportPage = () => {
  const [ledger, setLedger] = useState([]);
  const [filteredLedger, setFilteredLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: ""
  });

  const fetchLedger = async () => {
    try {
      setLoading(true);
      const response = await api.get("/ledger");
      if (response.data.success) {
        setLedger(response.data.data);
        setFilteredLedger(response.data.data);
      }
    } catch (error) {
      toast.error("Failed to load report data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = () => {
    let result = [...ledger];
    if (filters.startDate) {
      const start = new Date(filters.startDate).getTime();
      result = result.filter(day => new Date(day.date).getTime() >= start);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate).getTime();
      result = result.filter(day => new Date(day.date).getTime() <= end);
    }
    setFilteredLedger(result);
    toast.success("Filters applied successfully");
  };

  const clearFilters = () => {
    setFilters({ startDate: "", endDate: "" });
    setFilteredLedger(ledger);
  };

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

  // Metrics calculations
  const totalReceipts = filteredLedger.reduce((sum, d) => sum + d.receipts, 0);
  const totalIssues = filteredLedger.reduce((sum, d) => sum + d.issues, 0);
  const netFlow = totalReceipts - totalIssues;
  const averageReceipt = filteredLedger.length > 0 ? (totalReceipts / filteredLedger.length) : 0;
  const averageIssue = filteredLedger.length > 0 ? (totalIssues / filteredLedger.length) : 0;

  // Custom SVG Charts Rendering Helpers
  const renderLineChart = () => {
    if (filteredLedger.length < 2) {
      return (
        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm border border-dashed dark:border-border/30 rounded-xl">
          At least 2 days of ledger history are required to draw a trendline.
        </div>
      );
    }

    const width = 600;
    const height = 250;
    const padding = 40;

    const balances = filteredLedger.map(d => d.closing);
    const maxVal = Math.max(...balances, 1000);
    const minVal = Math.min(...balances, 0);
    const valRange = maxVal - minVal;

    const getX = (index) => padding + (index * (width - padding * 2)) / (filteredLedger.length - 1);
    const getY = (val) => height - padding - ((val - minVal) * (height - padding * 2)) / (valRange || 1);

    // Build path string
    let pathD = `M ${getX(0)} ${getY(balances[0])}`;
    for (let i = 1; i < balances.length; i++) {
      pathD += ` L ${getX(i)} ${getY(balances[i])}`;
    }

    // Build fill path string (closed to bottom)
    const fillD = `${pathD} L ${getX(balances.length - 1)} ${height - padding} L ${getX(0)} ${height - padding} Z`;

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px] h-64 overflow-visible">
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(147, 51, 234)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="rgb(147, 51, 234)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
            const val = minVal + r * valRange;
            const y = getY(val);
            return (
              <g key={i}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="var(--border)" strokeOpacity="0.3" strokeDasharray="4" />
                <text x={padding - 8} y={y + 4} fill="currentColor" className="text-[9px] fill-muted-foreground text-right" textAnchor="end">
                  {formatCurrency(val)}
                </text>
              </g>
            );
          })}

          {/* Fill Area */}
          <path d={fillD} fill="url(#lineGrad)" />

          {/* Line Path */}
          <path d={pathD} fill="none" stroke="rgb(147, 51, 234)" strokeWidth="3" strokeLinecap="round" />

          {/* Data Points */}
          {filteredLedger.map((day, idx) => {
            const x = getX(idx);
            const y = getY(day.closing);
            return (
              <g key={day._id} className="group cursor-pointer">
                <circle cx={x} cy={y} r="5" fill="rgb(147, 51, 234)" stroke="white" strokeWidth="1.5" />
                <circle cx={x} cy={y} r="10" fill="rgb(147, 51, 234)" fillOpacity="0" className="hover:fill-opacity-20 transition-all" />
                <title>{`${formatDate(day.date)}: ${formatCurrency(day.closing)}`}</title>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  const renderBarChart = () => {
    if (filteredLedger.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm border border-dashed dark:border-border/30 rounded-xl">
          No data available.
        </div>
      );
    }

    const width = 600;
    const height = 250;
    const padding = 40;

    const maxVal = Math.max(...filteredLedger.map(d => Math.max(d.receipts, d.issues)), 1000);
    const minVal = 0;
    const valRange = maxVal - minVal;

    const getY = (val) => height - padding - (val * (height - padding * 2)) / (valRange || 1);
    const getBarWidth = () => Math.min(25, (width - padding * 2) / (filteredLedger.length * 2.5));

    const totalBarSlotsWidth = width - padding * 2;
    const slotWidth = totalBarSlotsWidth / filteredLedger.length;

    return (
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[500px] h-64 overflow-visible">
          {/* Y Axis Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
            const val = r * valRange;
            const y = getY(val);
            return (
              <g key={i}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="var(--border)" strokeOpacity="0.3" strokeDasharray="4" />
                <text x={padding - 8} y={y + 4} fill="currentColor" className="text-[9px] fill-muted-foreground text-right" textAnchor="end">
                  {formatCurrency(val)}
                </text>
              </g>
            );
          })}

          {/* Double Bars */}
          {filteredLedger.map((day, idx) => {
            const barW = getBarWidth();
            const slotCenter = padding + idx * slotWidth + slotWidth / 2;

            // X-coordinates
            const xIn = slotCenter - barW - 2;
            const xOut = slotCenter + 2;

            // Heights
            const yZero = getY(0);
            const yIn = getY(day.receipts);
            const yOut = getY(day.issues);

            const hIn = Math.max(2, yZero - yIn);
            const hOut = Math.max(2, yZero - yOut);

            return (
              <g key={day._id}>
                {/* Receipts Bar (Green) */}
                <rect x={xIn} y={yIn} width={barW} height={hIn} rx="3" fill="#10B981" fillOpacity="0.85" className="hover:fill-opacity-100 transition-all">
                  <title>{`Inward: ${formatCurrency(day.receipts)}`}</title>
                </rect>

                {/* Issues Bar (Rose) */}
                <rect x={xOut} y={yOut} width={barW} height={hOut} rx="3" fill="#F43F5E" fillOpacity="0.85" className="hover:fill-opacity-100 transition-all">
                  <title>{`Outward: ${formatCurrency(day.issues)}`}</title>
                </rect>

                {/* Date labels at bottom */}
                {filteredLedger.length <= 10 && (
                  <text x={slotCenter} y={height - padding + 16} fill="currentColor" className="text-[8px] fill-muted-foreground" textAnchor="middle">
                    {formatDate(day.date).substring(0, 5)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent dark:from-purple-400 dark:to-blue-400">
            Report Summary
          </h1>
          <p className="text-muted-foreground mt-1">
            Perform detailed financial reporting, filter ledger summaries, and view cash trends.
          </p>
        </div>

        <button
          onClick={fetchLedger}
          className="cursor-pointer flex items-center justify-center gap-2 border dark:border-border/30 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm px-4 py-2.5 rounded-lg font-medium shadow-sm transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Reload Data
        </button>
      </div>

      {/* Date Filter Widget */}
      <div className="p-5 bg-white dark:bg-card border dark:border-border/30 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-500" />
          Filter Report by Date
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full p-2 bg-slate-50 dark:bg-slate-900 border dark:border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground font-medium">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full p-2 bg-slate-50 dark:bg-slate-900 border dark:border-border/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-2 w-full">
            <button
              onClick={applyFilters}
              className="cursor-pointer flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold shadow transition-colors"
            >
              Apply Filter
            </button>
            <button
              onClick={clearFilters}
              className="cursor-pointer flex-1 py-2 border dark:border-border/30 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-semibold transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 bg-white dark:bg-card border dark:border-border/30 rounded-2xl shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Net Cashflow</p>
          <p className={`text-xl font-bold mt-1.5 ${netFlow >= 0 ? "text-green-600 dark:text-green-400" : "text-rose-600 dark:text-rose-400"}`}>
            {netFlow >= 0 ? "+" : ""}{formatCurrency(netFlow)}
          </p>
          <span className="text-[10px] text-muted-foreground mt-1 block">Inward minus Outward</span>
        </div>

        <div className="p-5 bg-white dark:bg-card border dark:border-border/30 rounded-2xl shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Flow Direction</p>
          <p className="text-xl font-bold mt-1.5 text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            {netFlow >= 0 ? (
              <>
                <ArrowUpRight className="w-5 h-5 text-green-500" />
                <span className="text-green-500">Surplus</span>
              </>
            ) : (
              <>
                <ArrowDownLeft className="w-5 h-5 text-rose-500" />
                <span className="text-rose-500">Deficit</span>
              </>
            )}
          </p>
          <span className="text-[10px] text-muted-foreground mt-1 block">General ledger status</span>
        </div>

        <div className="p-5 bg-white dark:bg-card border dark:border-border/30 rounded-2xl shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Average Daily Inward</p>
          <p className="text-xl font-bold mt-1.5 text-slate-800 dark:text-slate-100">
            {formatCurrency(averageReceipt)}
          </p>
          <span className="text-[10px] text-muted-foreground mt-1 block">Per active ledger day</span>
        </div>

        <div className="p-5 bg-white dark:bg-card border dark:border-border/30 rounded-2xl shadow-sm">
          <p className="text-xs font-medium text-muted-foreground">Average Daily Outward</p>
          <p className="text-xl font-bold mt-1.5 text-slate-800 dark:text-slate-100">
            {formatCurrency(averageIssue)}
          </p>
          <span className="text-[10px] text-muted-foreground mt-1 block">Per active ledger day</span>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income vs Expenses Bar Chart */}
        <div className="p-6 bg-white dark:bg-card border dark:border-border/30 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-green-500" />
            Receipts vs Issues
          </h3>
          <p className="text-xs text-muted-foreground">
            Comparison of green inward credits vs red outward debits per day.
          </p>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">Loading chart...</div>
          ) : (
            renderBarChart()
          )}
        </div>

        {/* Closing Balance Line Chart */}
        <div className="p-6 bg-white dark:bg-card border dark:border-border/30 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-purple-500" />
            Closing Balance Trend
          </h3>
          <p className="text-xs text-muted-foreground">
            Cascading ledger closing trend line showing growth or reduction over time.
          </p>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-muted-foreground">Loading chart...</div>
          ) : (
            renderLineChart()
          )}
        </div>
      </div>

      {/* Structured Ledger Summary Table */}
      <div className="bg-white dark:bg-card rounded-2xl border dark:border-border/30 shadow-sm overflow-hidden">
        <div className="p-5 border-b dark:border-border/20">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Daily Performance Table</h3>
          <p className="text-xs text-muted-foreground mt-1">Numerical breakdown of daily ledger metrics.</p>
        </div>
        {loading ? (
          <div className="p-10 text-center text-muted-foreground">Fetching records...</div>
        ) : filteredLedger.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">No ledger days within selected range.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-border/30 text-xs font-semibold text-muted-foreground uppercase">
                  <th className="py-3 px-4 w-[80px]">SI</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Opening Balance</th>
                  <th className="py-3 px-4 text-right text-green-700 dark:text-green-500">Inwards (Receipts)</th>
                  <th className="py-3 px-4 text-right text-rose-700 dark:text-rose-500">Outwards (Issues)</th>
                  <th className="py-3 px-4 text-right">Closing Balance</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredLedger.map((day) => (
                  <tr key={day._id} className="border-b dark:border-border/20 text-slate-700 dark:text-slate-300">
                    <td className="py-3 px-4">{day.serialNumber}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {formatDate(day.date)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">{formatCurrency(day.opening)}</td>
                    <td className="py-3 px-4 text-right text-green-600 dark:text-green-400 font-medium">
                      {formatCurrency(day.receipts)}
                    </td>
                    <td className="py-3 px-4 text-right text-rose-600 dark:text-rose-400 font-medium">
                      {formatCurrency(day.issues)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-purple-700 dark:text-purple-400">
                      {formatCurrency(day.closing)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
