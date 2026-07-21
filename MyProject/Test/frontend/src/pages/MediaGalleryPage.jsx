import React, { useState, useEffect } from "react";
import { authApi, fileApi, folderApi } from "../services/index";
import {
    MagnifyingGlassIcon,
    TrashIcon,
    ArrowDownTrayIcon,
    LinkIcon,
    PhotoIcon,
    VideoCameraIcon,
    DocumentIcon,
    FolderIcon,
    FolderPlusIcon,
    ChevronRightIcon,
    HomeIcon,
    ArrowLeftIcon,
    DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

const MediaGalleryPage = () => {
    const [contents, setContents] = useState({ folders: [], files: [], currentFolder: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [showNewFolderModal, setShowNewFolderModal] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [userDetails, setUserDetails] = useState(null);

    console.log("userDetails : ", userDetails);

    useEffect(() => {
        fetchContents();
    }, [currentFolderId]);

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await authApi.getProfile();
            // console.log("response from media page for user details : ", response);
            if (response.success) {
                setUserDetails(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch user details");
        }
    };

    const fetchContents = async () => {
        try {
            setLoading(true);
            const response = await folderApi.getDirectoryContents(currentFolderId);
            if (response.success) {
                setContents(response.data);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch contents");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        try {
            await folderApi.createFolder({
                name: newFolderName,
                parentFolder: currentFolderId
            });
            setNewFolderName("");
            setShowNewFolderModal(false);
            fetchContents();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to create folder");
        }
    };

    const handleDeleteFile = async (fileId) => {
        if (!confirm("Are you sure you want to delete this file?")) return;
        try {
            await fileApi.deleteFile(fileId);
            fetchContents();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete file");
        }
    };

    const handleDeleteFolder = async (folderId) => {
        if (!confirm("Are you sure you want to delete this folder?")) return;
        try {
            await folderApi.deleteFolder(folderId);
            fetchContents();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete folder. Is it empty?");
        }
    };

    const handleDownload = async (file) => {
        try {
            const response = await fileApi.downloadFile(file._id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", file.originalName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert("Failed to download file");
        }
    };

    const copyUrl = (url) => {
        navigator.clipboard.writeText(url);
        alert("URL copied to clipboard!");
    };

    const getFileIcon = (fileType) => {
        switch (fileType) {
            case "image": return <PhotoIcon className="w-10 h-10 text-blue-500" />;
            case "video": return <VideoCameraIcon className="w-10 h-10 text-purple-500" />;
            case "document": return <DocumentIcon className="w-10 h-10 text-green-500" />;
            default: return <DocumentIcon className="w-10 h-10 text-gray-500" />;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Filtered results
    const filteredFolders = contents.folders.filter(f =>
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFiles = contents.files.filter(f => {
        const matchesSearch = f.originalName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "all" || f.fileType === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Media Explorer</h1>
                        <p className="text-gray-500">Manage your files and folders across the system</p>
                    </div>
                    <div className="flex items-center gap-3">
                        {
                            userDetails?.user?.plan !== "Free" && (
                                <button
                                    onClick={() => setShowNewFolderModal(true)}
                                    className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all shadow-sm cursor-pointer"
                                >
                                    <FolderPlusIcon className="w-5 h-5 text-blue-600" />
                                    <span>New Folder</span>
                                </button>
                            )
                        }
                        <a
                            href="/upload"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md"
                        >
                            Upload File
                        </a>
                    </div>
                </div>

                {/* Breadcrumbs & Search */}
                <div className="flex flex-col lg:flex-row gap-6 mb-8">
                    <div className="flex-1 overflow-x-auto">
                        <nav className="flex items-center text-sm font-medium text-gray-500 whitespace-nowrap bg-white px-4 py-2.5 rounded-xl shadow-sm border border-gray-100">
                            <button
                                onClick={() => setCurrentFolderId(null)}
                                className="hover:text-blue-600 flex items-center gap-1.5 cursor-pointer"
                            >
                                <HomeIcon className="w-4 h-4" />
                                <span>Root</span>
                            </button>

                            {contents.currentFolder?.path?.map((p) => (
                                <React.Fragment key={p._id}>
                                    <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-300" />
                                    <button
                                        onClick={() => setCurrentFolderId(p._id)}
                                        className="hover:text-blue-600 cursor-pointer"
                                    >
                                        {p.name}
                                    </button>
                                </React.Fragment>
                            ))}

                            {contents.currentFolder && (
                                <>
                                    <ChevronRightIcon className="w-4 h-4 mx-2 text-gray-300" />
                                    <span className="text-gray-900 font-bold">{contents.currentFolder.name}</span>
                                </>
                            )}
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative w-full lg:w-72">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none shadow-sm text-sm"
                        >
                            <option value="all">All Files</option>
                            <option value="image">Images</option>
                            <option value="video">Videos</option>
                            <option value="document">Documents</option>
                        </select>
                    </div>
                </div>

                {/* Grid View */}
                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Folders Section */}
                        {filteredFolders.length > 0 && (
                            <div>
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Folders</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                                    {filteredFolders.map((folder) => (
                                        <div
                                            key={folder._id}
                                            className="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer relative"
                                            onClick={() => setCurrentFolderId(folder._id)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <FolderIcon className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-gray-900 truncate text-sm" title={folder.name}>
                                                        {folder.name}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteFolder(folder._id);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                    title="Delete Folder"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        copyUrl(folder._id);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                                                    title="Copy Folder ID"
                                                >
                                                    <DocumentDuplicateIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Files Section */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Files</h3>
                            {filteredFiles.length === 0 && filteredFolders.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                                    <FolderIcon className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                                    <p className="text-gray-500 font-medium">This folder is empty</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredFiles.map((file) => (
                                        <div
                                            key={file._id}
                                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl transition-all"
                                        >
                                            <div className="aspect-video bg-gray-100 flex items-center justify-center relative overflow-hidden">
                                                {file.fileType === "image" ? (
                                                    <img
                                                        src={file.publicUrl}
                                                        alt={file.originalName}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        {getFileIcon(file.fileType)}
                                                    </div>
                                                )}

                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                    <button
                                                        onClick={() => copyUrl(file.publicUrl)}
                                                        className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                                                        title="Copy URL"
                                                    >
                                                        <LinkIcon className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDownload(file)}
                                                        className="p-2 bg-white rounded-full text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                                                        title="Download"
                                                    >
                                                        <ArrowDownTrayIcon className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteFile(file._id)}
                                                        className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                        title="Delete"
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                <p className="font-bold text-gray-900 truncate text-sm mb-1" title={file.originalName}>
                                                    {file.originalName}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {file.formattedSize} • {formatDate(file.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* New Folder Modal */}
                {showNewFolderModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
                            <h3 className="text-xl font-bold mb-4">Create New Folder</h3>
                            <form onSubmit={handleCreateFolder}>
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Folder Name"
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none mb-6"
                                    required
                                />
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowNewFolderModal(false)}
                                        className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 font-bold cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg cursor-pointer"
                                    >
                                        Create
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaGalleryPage;
