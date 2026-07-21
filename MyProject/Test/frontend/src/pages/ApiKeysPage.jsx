import React, { useState, useEffect } from "react";
import { apiKeyApi } from "../services/index";
import {
    KeyIcon,
    PlusIcon,
    TrashIcon,
    ClipboardDocumentIcon,
    CheckIcon,
    ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const ApiKeysPage = () => {
    const [apiKeys, setApiKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNewKeyModal, setShowNewKeyModal] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [generatedKey, setGeneratedKey] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchApiKeys();
    }, []);

    const fetchApiKeys = async () => {
        try {
            setLoading(true);
            const response = await apiKeyApi.getApiKeys();
            if (response.success) {
                setApiKeys(response.data.apiKeys);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch API keys");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateKey = async (e) => {
        e.preventDefault();
        try {
            const response = await apiKeyApi.createApiKey({ name: newKeyName });
            if (response.success) {
                setGeneratedKey(response.data);
                setNewKeyName("");
                fetchApiKeys();
            }
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create API key");
        }
    };

    const handleRevokeKey = async (id) => {
        if (!confirm("Are you sure you want to revoke this API key?")) return;
        try {
            await apiKeyApi.revokeApiKey(id);
            fetchApiKeys();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to revoke API key");
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading && apiKeys.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">API Keys</h1>
                        <p className="text-gray-600">Manage developer access to your media storage</p>
                    </div>
                    <button
                        onClick={() => {
                            setShowNewKeyModal(true);
                            setGeneratedKey(null);
                        }}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md cursor-pointer"
                    >
                        <PlusIcon className="w-5 h-5" />
                        <span>Create New Key</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                        <ExclamationTriangleIcon className="w-5 h-5" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prefix</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {apiKeys.length > 0 ? (
                                apiKeys.map((key) => (
                                    <tr key={key._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <KeyIcon className="w-5 h-5 text-gray-400 mr-2" />
                                                <span className="text-sm font-medium text-gray-900">{key.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <code>{key.prefix}</code>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(key.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm text-gray-900">{key.usageCount} / {key.usageLimit === -1 ? "Unlimited" : key.usageLimit}</span>

                                                {key.usageLimit !== -1 && (
                                                    <div className="w-24 bg-gray-200 rounded-full h-1.5 mt-1">
                                                        <div
                                                            className="bg-blue-600 h-1.5 rounded-full"
                                                            style={{ width: `${Math.min((key.usageCount / key.usageLimit) * 100, 100)}%` }}
                                                        ></div>
                                                    </div>
                                                )}

                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${key.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                {key.isActive ? "Active" : "Revoked"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            {key.isActive && (
                                                <button
                                                    onClick={() => handleRevokeKey(key._id)}
                                                    className="text-red-600 hover:text-red-900 transition-colors cursor-pointer"
                                                    title="Revoke Key"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No API keys found. Create one to start using the REST API.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Create New Key Modal */}
                {showNewKeyModal && (
                    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-300">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900">
                                    {generatedKey ? "Key Generated" : "Create API Key"}
                                </h3>
                                <button
                                    onClick={() => {
                                        setShowNewKeyModal(false);
                                        setGeneratedKey(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    <PlusIcon className="w-6 h-6 rotate-45" />
                                </button>
                            </div>

                            {!generatedKey ? (
                                <form onSubmit={handleCreateKey}>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Key Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. My Website App"
                                            value={newKeyName}
                                            onChange={(e) => setNewKeyName(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-lg transition-all active:scale-95 cursor-pointer"
                                    >
                                        Generate Key
                                    </button>
                                </form>
                            ) : (
                                <div>
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                                        <div className="flex items-start space-x-3 text-amber-800">
                                            <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0" />
                                            <p className="text-sm font-medium">
                                                Copy this key now. For security, you won't be able to see it again!
                                            </p>
                                        </div>
                                    </div>

                                    <div className="relative mb-6">
                                        <div className="bg-gray-900 text-gray-100 p-4 rounded-xl font-mono text-sm break-all pr-12">
                                            {generatedKey.apiKey}
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(generatedKey.apiKey)}
                                            className="absolute right-2 top-2 p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                            title="Copy to clipboard"
                                        >
                                            {copied ? <CheckIcon className="w-6 h-6 text-green-500" /> : <ClipboardDocumentIcon className="w-6 h-6" />}
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setShowNewKeyModal(false);
                                            setGeneratedKey(null);
                                        }}
                                        className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold shadow-lg cursor-pointer"
                                    >
                                        I've Saved It
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApiKeysPage;
