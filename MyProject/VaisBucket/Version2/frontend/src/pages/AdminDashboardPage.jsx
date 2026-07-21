import React, { useState, useEffect } from "react";
import { adminApi } from "../services/index";
import {
    UsersIcon,
    DocumentDuplicateIcon,
    CircleStackIcon,
    ShieldCheckIcon,
    MagnifyingGlassIcon,
    PencilSquareIcon,
    NoSymbolIcon,
    CheckCircleIcon,
    EyeIcon,
    KeyIcon,
    FolderIcon,
    ChatBubbleLeftEllipsisIcon,
    TrashIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { BoltIcon, Banknote as BanknotesIcon } from "lucide-react";
import { downloadInvoice } from "../services/subscriptionService";

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingUser, setEditingUser] = useState(null);
    const [viewingUser, setViewingUser] = useState(null);
    const [userDetails, setUserDetails] = useState(null);
    const [newLimit, setNewLimit] = useState("");
    const [adminMessage, setAdminMessage] = useState("");

    const [updatingMessage, setUpdatingMessage] = useState(false);
    const [planBasedSignup, setPlanBasedSignup] = useState(false);
    const [updatingSettings, setUpdatingSettings] = useState(false);

    const [revenueStats, setRevenueStats] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [userTransactions, setUserTransactions] = useState([]); // For modal

    useEffect(() => {
        fetchStats();
        fetchUsers();
        fetchStats();
        fetchUsers();
        fetchSettings();
        fetchRevenueAndTransactions();
    }, [page]);

    const fetchRevenueAndTransactions = async () => {
        try {
            const revRes = await adminApi.getRevenueStats();
            if (revRes.success) setRevenueStats(revRes.data);

            const txRes = await adminApi.getTransactionHistory(1, 10); // Initial 10
            if (txRes.success) setTransactions(txRes.data.transactions);
        } catch (err) {
            console.error("Failed to fetch revenue/tx", err);
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await adminApi.getSystemSettings();
            if (response.success) {
                // Find PLAN_BASED_SIGNUP setting
                const setting = response.data.find(s => s.key === "PLAN_BASED_SIGNUP");
                setPlanBasedSignup(setting ? setting.value : false);
            }
        } catch (err) {
            console.error("Failed to fetch settings", err);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await adminApi.getSystemStats();
            if (response.success) setStats(response.data);
        } catch (err) {
            console.error("Failed to fetch system stats", err);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await adminApi.getAllUsers(page, 10, searchTerm);
            if (response.success) {
                setUsers(response.data.users);
                setTotalPages(response.data.totalPages);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch users");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const handleToggleStatus = async (userId) => {
        try {
            const response = await adminApi.toggleUserStatus(userId);
            if (response.success) {
                fetchUsers();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to toggle user status");
        }
    };

    const handleUpdateLimit = async (e) => {
        e.preventDefault();
        try {
            const limitInBytes = parseInt(newLimit) * 1024 * 1024 * 1024; // GB to Bytes
            const response = await adminApi.updateStorageLimit(editingUser._id, limitInBytes);
            if (response.success) {
                setEditingUser(null);
                setNewLimit("");
                fetchUsers();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update storage limit");
        }
    };

    const handleViewUser = async (user) => {
        try {
            setViewingUser(user);
            setAdminMessage(user.adminMessage || "");
            const response = await adminApi.getUserDetails(user._id);
            if (response.success) {
                setUserDetails(response.data);
                // Fetch user transactions
                const txRes = await adminApi.getUserTransactions(user._id);
                if (txRes.success) setUserTransactions(txRes.data);
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to fetch user details");
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            setUpdatingMessage(true);
            const response = await adminApi.updateAdminMessage(viewingUser._id, adminMessage);
            if (response.success) {
                alert("Message sent successfully");
                fetchUsers(); // Refresh to get updated message in user object
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to send message");
        } finally {
            setUpdatingMessage(false);
        }
    };

    const handleDeleteMessage = async () => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            setUpdatingMessage(true);
            const response = await adminApi.updateAdminMessage(viewingUser._id, "");
            if (response.success) {
                setAdminMessage("");
                // Update viewingUser local state as well
                setViewingUser(prev => ({ ...prev, adminMessage: "" }));
                fetchUsers();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete message");
        } finally {
            setUpdatingMessage(false);
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <ShieldCheckIcon className="w-10 h-10 text-blue-600" />
                        Admin Management
                    </h1>
                    <p className="text-gray-500 mt-1">Monitor system usage and manage user accounts</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <UsersIcon className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Users</p>
                            <p className="text-2xl font-black text-gray-900">{stats?.totalUsers || 0}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                        <div className="bg-purple-50 p-4 rounded-xl">
                            <DocumentDuplicateIcon className="w-8 h-8 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Files</p>
                            <p className="text-2xl font-black text-gray-900">{stats?.totalFiles || 0}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                        <div className="bg-amber-50 p-4 rounded-xl">
                            <CircleStackIcon className="w-8 h-8 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Storage Usage</p>
                            <p className="text-2xl font-black text-gray-900">{formatBytes(stats?.totalStorageUsed || 0)}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
                        <div className="bg-green-50 p-4 rounded-xl">
                            <BanknotesIcon className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Revenue</p>
                            <p className="text-2xl font-black text-gray-900">₹{revenueStats?.totalRevenue || 0}</p>
                        </div>
                    </div>
                </div>

                {/* System Configuration */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <BoltIcon className="w-6 h-6 text-indigo-600" />
                            System Configuration
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Manage global improved system settings</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-gray-700">Plan Based Signup</span>
                            <button
                                onClick={async () => {
                                    setUpdatingSettings(true);
                                    try {
                                        const response = await adminApi.toggleSignupMode(!planBasedSignup);
                                        if (response.success) {
                                            setPlanBasedSignup(response.data.value);
                                        }
                                    } catch (err) {
                                        alert("Failed to update setting");
                                    } finally {
                                        setUpdatingSettings(false);
                                    }
                                }}
                                disabled={updatingSettings}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${planBasedSignup ? 'bg-indigo-600' : 'bg-gray-200'}`}
                            >
                                <span
                                    className={`${planBasedSignup ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            {/* Recent Transactions Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-10 mt-10">
                <div className="p-6 border-b border-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Plan</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Billing Info</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {transactions && transactions.length > 0 ? (
                                transactions.map((tx) => (
                                    <tr key={tx._id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">{tx.userId?.name || 'Unknown'}</span>
                                                <span className="text-xs text-gray-500">{tx.userId?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{tx.plan} ({tx.billingCycle})</td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{tx.amount}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${tx.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                tx.status === 'created' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            <div className="font-medium text-gray-900">{tx.billingName}</div>
                                            {tx.gstNumber && <div className="text-[10px]">GST: {tx.gstNumber}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {tx.status === 'paid' && (
                                                <button
                                                    onClick={() => downloadInvoice(tx._id)}
                                                    className="text-blue-600 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-all cursor-pointer"
                                                    title="Download Invoice"
                                                >
                                                    <ArrowDownTrayIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500">No transactions recorded</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Management Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-gray-900">User Directory</h2>

                    <form onSubmit={handleSearch} className="relative w-full md:w-80">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </form>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest">
                            <tr>
                                <th className="px-6 py-4">User Details</th>
                                <th className="px-6 py-4">Subscription</th>
                                <th className="px-6 py-4">Storage Usage</th>
                                <th className="px-6 py-4">Storage Limit</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : users.length > 0 ? (
                                users.map((u) => (
                                    <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">{u.name}</span>
                                                <span className="text-xs text-gray-500">{u.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-gray-900">{u.plan || 'Free'}</span>
                                                <span className="text-xs text-gray-500">Expiry Date: {u.planExpiry ? new Date(u.planExpiry).toLocaleDateString('en-GB') : 'N/A'}</span>
                                                <span className="text-xs text-gray-500">Billing Cycle: {u.billingCycle || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 w-32">
                                                <span className="text-sm font-medium text-gray-700">{formatBytes(u.storageUsed)}</span>
                                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                    <div
                                                        className={`h-1.5 rounded-full ${u.storagePercentage > 90 ? 'bg-red-500' : 'bg-blue-500'}`}
                                                        style={{ width: `${Math.min(u.storagePercentage, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-700 font-bold">{formatBytes(u.limitStorage || u.storageLimit)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {u.isActive ? 'Active' : 'Suspended'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewUser(u)}
                                                    className="p-2 cursor-pointer text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                                                    title="View Details"
                                                >
                                                    <EyeIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingUser(u);
                                                        setNewLimit(u.storageLimit / (1024 * 1024 * 1024));
                                                    }}
                                                    className="p-2 cursor-pointer text-blue-600 hover:bg-blue-50 rounded-lg transition-all "
                                                    title="Edit Limit"
                                                >
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleStatus(u._id)}
                                                    className={`p-2 cursor-pointer rounded-lg transition-all ${u.isActive ? 'text-red-600 hover:bg-red-50' : 'text-green-600 hover:bg-green-50'}`}
                                                    title={u.isActive ? 'Suspend User' : 'Activate User'}
                                                >
                                                    {u.isActive ? <NoSymbolIcon className="w-5 h-5" /> : <CheckCircleIcon className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <span className="text-sm text-gray-500 font-medium">Page {page} of {totalPages}</span>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-all cursor-pointer"
                            >
                                Previous
                            </button>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 disabled:opacity-50 hover:bg-gray-50 transition-all cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Storage Modal */}
            {editingUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl scale-in-center overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-full h-2 bg-blue-600"></div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2">Adjust Storage Limit</h3>
                        <p className="text-gray-500 mb-6 font-medium">Updating limit for <span className="text-blue-600 font-bold">{editingUser.name}</span></p>

                        <form onSubmit={handleUpdateLimit}>
                            <div className="mb-6">
                                <label className="block text-xs font-black text-gray-500 uppercase mb-2 tracking-widest">New Limit (GB)</label>
                                <div className="relative">
                                    <CircleStackIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        autoFocus
                                        type="number"
                                        step="0.1"
                                        value={newLimit}
                                        onChange={(e) => setNewLimit(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none text-xl font-black"
                                        placeholder="e.g. 5.0"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="flex-1 px-6 py-3 border border-gray-200 text-gray-600 rounded-2xl font-bold hover:bg-gray-50 transition-all uppercase tracking-widest text-xs cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all uppercase tracking-widest text-xs cursor-pointer"
                                >
                                    Update Limit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* User Details Modal */}
            {viewingUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] w-full max-w-5xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col relative scale-in-center">
                        {/* Header */}
                        <div className="p-8 bg-gray-50 border-b border-gray-200 flex justify-between items-start">
                            <div className="flex gap-6 items-center">
                                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black">
                                    {viewingUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-gray-900">{viewingUser.name}</h2>
                                    <p className="text-gray-500 font-medium">{viewingUser.email}</p>
                                    <div className="flex gap-2 mt-2">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${viewingUser.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {viewingUser.isActive ? 'Active Member' : 'Account Suspended'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setViewingUser(null);
                                    setUserDetails(null);
                                }}
                                className="p-2 hover:bg-gray-200 rounded-full transition-all cursor-pointer"
                            >
                                <NoSymbolIcon className="w-8 h-8 text-gray-400 rotate-45" />
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 overflow-y-auto p-8">
                            {!userDetails ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading User Data...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    {/* Left Column: Folders & API Keys */}
                                    <div className="lg:col-span-1 space-y-10">
                                        {/* Folders Section */}
                                        <section>
                                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <FolderIcon className="w-4 h-4" />
                                                Directory Structure ({userDetails.folders.length})
                                            </h3>
                                            <div className="space-y-1 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                                {userDetails.folders.length > 0 ? (
                                                    userDetails.folders.map(f => (
                                                        <div key={f._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-all group cursor-default">
                                                            <FolderIcon className="w-5 h-5 text-blue-400 group-hover:text-blue-600" />
                                                            <span className="text-sm font-bold text-gray-700 truncate">{f.name}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-400 italic">No folders created</p>
                                                )}
                                            </div>
                                        </section>

                                        {/* API Keys Section */}
                                        <section>
                                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <KeyIcon className="w-4 h-4" />
                                                API Credentials ({userDetails.apiKeys.length})
                                            </h3>
                                            <div className="space-y-3">
                                                {userDetails.apiKeys.length > 0 ? (
                                                    userDetails.apiKeys.map(k => (
                                                        <div key={k._id} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col gap-2">
                                                            <div className="flex justify-between items-start">
                                                                <span className="text-sm font-black text-gray-900">{k.name}</span>
                                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${k.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                                    {k.isActive ? 'ONLINE' : 'REVOKED'}
                                                                </span>
                                                            </div>
                                                            <code className="text-[10px] bg-white p-2 rounded-lg border border-gray-100 text-blue-600 font-mono">
                                                                {k.maskedKey}
                                                            </code>
                                                            <div className="flex justify-between items-center mt-1">
                                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Usage: {k.usageCount} / {k.usageLimit}</span>
                                                                <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-blue-500"
                                                                        style={{ width: `${(k.usageCount / k.usageLimit) * 100}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-gray-400 italic">No API keys generated</p>
                                                )}
                                            </div>
                                        </section>
                                    </div>

                                    {/* Middle Column: Recent Assets */}
                                    <div className="lg:col-span-1 border-x border-gray-100 px-2">
                                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <DocumentDuplicateIcon className="w-4 h-4" />
                                            Latest Assets
                                        </h3>
                                        <div className="space-y-4">
                                            {userDetails.recentFiles.length > 0 ? (
                                                userDetails.recentFiles.map(file => (
                                                    <div key={file._id} className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md transition-all">
                                                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                                                            <DocumentDuplicateIcon className="w-6 h-6 text-gray-400" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-900 truncate">{file.originalName}</p>
                                                            <p className="text-[10px] font-black text-gray-400 uppercase mt-0.5">
                                                                {file.fileType} • {formatBytes(file.size)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-sm text-gray-400 italic">No assets uploaded</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right Column: Administrative Messaging */}
                                    <div className="lg:col-span-1">
                                        <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-100">
                                            <h3 className="text-lg font-black mb-4 flex items-center gap-3">
                                                <ChatBubbleLeftEllipsisIcon className="w-6 h-6" />
                                                Direct Message
                                            </h3>
                                            <p className="text-blue-100 text-sm mb-6 font-medium leading-relaxed">
                                                Send a system message that will be permanently displayed on this user's personal dashboard.
                                            </p>

                                            <form onSubmit={handleSendMessage}>
                                                <textarea
                                                    value={adminMessage}
                                                    onChange={(e) => setAdminMessage(e.target.value)}
                                                    className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 text-sm placeholder:text-blue-200 outline-none focus:ring-2 focus:ring-white/40 transition-all h-32 resize-none leading-relaxed font-medium"
                                                    placeholder="Enter administrative notification or support message..."
                                                ></textarea>

                                                <button
                                                    disabled={updatingMessage}
                                                    type="submit"
                                                    className="w-full mt-4 bg-white text-blue-600 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all disabled:opacity-50 cursor-pointer"
                                                >
                                                    {updatingMessage ? "Delivering..." : "Broadast to User"}
                                                </button>
                                            </form>

                                            {viewingUser.adminMessage && (
                                                <div className="mt-8 pt-8 border-t border-white/10">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest">Live Message:</p>
                                                        <button
                                                            onClick={handleDeleteMessage}
                                                            className="text-white/60 hover:text-white transition-colors cursor-pointer"
                                                            title="Delete Message"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-xs italic font-medium">
                                                        "{viewingUser.adminMessage}"
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* User Transactions Tab */}
                                    <div className="col-span-full border-t border-gray-100 pt-8 mt-4">
                                        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-4">Payment History ({userTransactions.length})</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {userTransactions.length > 0 ? (
                                                userTransactions.map(tx => (
                                                    <div key={tx._id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <span className="font-bold text-gray-700">{tx.plan}</span>
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${tx.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                                {tx.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between items-end">
                                                            <div>
                                                                <p className="text-xs text-gray-400 font-mono">ID: ...{tx.razorpayOrderId?.slice(-6)}</p>
                                                                <p className="text-xs text-gray-500 mt-1">{new Date(tx.createdAt).toLocaleDateString()}</p>
                                                                {tx.billingName && <p className="text-[10px] text-gray-400 mt-1 truncate max-w-[150px]">To: {tx.billingName}</p>}
                                                            </div>
                                                            <div className="flex flex-col items-end gap-2">
                                                                <p className="text-lg font-black text-gray-900">₹{tx.amount}</p>
                                                                {tx.status === 'paid' && (
                                                                    <button
                                                                        onClick={() => downloadInvoice(tx._id)}
                                                                        className="flex items-center gap-1 text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-tighter cursor-pointer"
                                                                    >
                                                                        <ArrowDownTrayIcon className="w-3 h-3" />
                                                                        Invoice
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-400 italic text-sm">No payment history found for this user.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboardPage;
