import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fileApi } from "../services/index";
import { getMyTransactions } from "../services/subscriptionService";
import {
    CloudArrowUpIcon,
    DocumentIcon,
    PhotoIcon,
    VideoCameraIcon,
    ChartBarIcon,
    ChatBubbleLeftEllipsisIcon,
    BellIcon,
    XMarkIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";
import { downloadInvoice } from "../services/subscriptionService";

const DashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDismissed, setIsDismissed] = useState(false);

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchStats();
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await getMyTransactions();
            // response.data contains the list, as per our backend response wrapper? 
            // The backend returns: new ApiResponse(200, transactions, ...)
            // check service implementation: return response.data
            // response.data from axios is the whole body: { statusCode, data, message }
            // So we need response.data.
            if (response.success) {
                setTransactions(response.data);
            }
        } catch (err) {
            console.error("Failed to fetch transactions", err);
        }
    };

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await fileApi.getStats();
            if (response.success) {
                setStats(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch statistics");
        } finally {
            setLoading(false);
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const getFileTypeIcon = (type) => {
        switch (type) {
            case "image":
                return <PhotoIcon className="w-8 h-8" />;
            case "video":
                return <VideoCameraIcon className="w-8 h-8" />;
            case "document":
                return <DocumentIcon className="w-8 h-8" />;
            default:
                return <DocumentIcon className="w-8 h-8" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Welcome back, {user?.name}! 👋
                    </h1>
                    <p className="text-gray-600">
                        Manage your files and monitor your storage usage
                    </p>
                </div>

                {/* Admin Message Banner */}
                {user?.adminMessage && !isDismissed && (
                    <div className="mb-8 bg-blue-600 rounded-3xl p-6 shadow-xl shadow-blue-100 flex items-center justify-between gap-6 text-white animate-in slide-in-from-top duration-500 relative group">
                        <div className="flex items-center gap-6">
                            <div className="bg-white/20 p-4 rounded-2xl">
                                <ChatBubbleLeftEllipsisIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <BellIcon className="w-4 h-4 text-blue-200" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">System Notification</span>
                                </div>
                                <p className="text-lg font-bold leading-relaxed">
                                    {user.adminMessage}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsDismissed(true)}
                            className="p-2 hover:bg-white/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                            title="Dismiss for now"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}



                {/* Subscription & Plan Details */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-indigo-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ChartBarIcon className="w-32 h-32 text-indigo-600" />
                    </div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                                    Current Plan
                                </span>
                                <h2 className="text-3xl font-black text-gray-900">{user?.plan || "Free"}</h2>
                            </div>
                            <p className="text-gray-500 font-medium">
                                {user?.plan === "Free"
                                    ? "Upgrade to unlock more storage and features."
                                    : `Renews on: ${user?.planExpiry ? new Date(user.planExpiry).toLocaleDateString() : 'N/A'}`
                                }
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Storage Limit</p>
                                <p className="text-lg font-bold text-gray-700">{formatBytes(user?.limitStorage || stats?.storageLimit || 0)}</p>
                            </div>
                            <Link to="/pricing">
                                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all transform hover:scale-105 active:scale-95">
                                    {user?.plan === "Free" ? "Upgrade Plan" : "Manage Subscription"}
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Total Files */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Files</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.totalFiles || 0}
                                </p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <DocumentIcon className="w-8 h-8 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    {/* Total Downloads */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Downloads</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.totalDownloads || 0}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-lg">
                                <CloudArrowUpIcon className="w-8 h-8 text-green-600" />
                            </div>
                        </div>
                    </div>

                    {/* Total Views */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Views</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.totalViews || 0}
                                </p>
                            </div>
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <ChartBarIcon className="w-8 h-8 text-purple-600" />
                            </div>
                        </div>
                    </div>

                    {/* Storage Used */}
                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">
                                    {stats?.storagePercentage || 0}%
                                </p>
                            </div>
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <ChartBarIcon className="w-8 h-8 text-orange-600" />
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${Math.min(stats?.storagePercentage || 0, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {formatBytes(stats?.storageUsed || 0)} of{" "}
                                {formatBytes(stats?.storageLimit || 0)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Files by Type */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Files by Type
                        </h2>
                        <div className="space-y-4">
                            {stats?.filesByType && stats.filesByType.length > 0 ? (
                                stats.filesByType.map((item) => (
                                    <div
                                        key={item._id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="text-blue-600">
                                                {getFileTypeIcon(item._id)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900 capitalize">
                                                    {item._id}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {item.count} files • {formatBytes(item.totalSize)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    No files uploaded yet
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Recent Files */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">
                            Recent Files
                        </h2>
                        <div className="space-y-3">
                            {stats?.recentFiles && stats.recentFiles.length > 0 ? (
                                stats.recentFiles.map((file) => (
                                    <div
                                        key={file._id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                                            <div className="text-gray-600">
                                                {getFileTypeIcon(file.fileType)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">
                                                    {file.originalName}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {formatBytes(file.size)} •{" "}
                                                    {new Date(file.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    No recent files
                                </p>
                            )}
                        </div>
                        <Link
                            to="/gallery"
                            className="mt-4 block text-center text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View all files →
                        </Link>
                    </div>
                </div>

                {/* Billing History */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
                    <div className="p-6 border-b border-gray-50">
                        <h2 className="text-xl font-bold text-gray-900">Billing History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Plan</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Billing Details</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {transactions.length > 0 ? (
                                    transactions.map((tx) => (
                                        <tr key={tx._id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                                {new Date(tx.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-bold">
                                                {tx.plan} <span className="text-xs text-gray-400 font-normal">({tx.billingCycle})</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 font-bold">
                                                ₹{tx.amount}
                                            </td>
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
                                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-bold text-xs uppercase tracking-tighter cursor-pointer"
                                                        title="Download Invoice PDF"
                                                    >
                                                        <ArrowDownTrayIcon className="w-4 h-4" />
                                                        Invoice
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">
                                            No billing history
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg p-8 text-white">
                    <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Link
                            to="/upload"
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all duration-300 hover:scale-105"
                        >
                            <CloudArrowUpIcon className="w-8 h-8 mb-2" />
                            <h3 className="font-semibold mb-1">Upload Files</h3>
                            <p className="text-sm text-blue-100">
                                Upload images, videos, and documents
                            </p>
                        </Link>
                        <Link
                            to="/gallery"
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all duration-300 hover:scale-105"
                        >
                            <PhotoIcon className="w-8 h-8 mb-2" />
                            <h3 className="font-semibold mb-1">View Gallery</h3>
                            <p className="text-sm text-blue-100">
                                Browse and manage your files
                            </p>
                        </Link>
                        <Link
                            to="/api-keys"
                            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg p-4 transition-all duration-300 hover:scale-105"
                        >
                            <DocumentIcon className="w-8 h-8 mb-2" />
                            <h3 className="font-semibold mb-1">API Keys</h3>
                            <p className="text-sm text-blue-100">
                                Manage your API keys for developers
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
