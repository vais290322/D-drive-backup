import React, { useState, useRef, useEffect } from "react";
import { fileApi, folderApi } from "../services/index";
import {
    CloudArrowUpIcon,
    XMarkIcon,
    CheckCircleIcon,
    ExclamationCircleIcon,
    FolderIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";

const UploadPage = () => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({});
    const [uploadResults, setUploadResults] = useState([]);
    const [dragActive, setDragActive] = useState(false);
    const [folders, setFolders] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState("null"); // Default to Root
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchFolders();
    }, []);

    const fetchFolders = async () => {
        try {
            const response = await folderApi.getDirectoryContents(null, true);
            if (response.success) {
                // Sort folders to maintain hierarchy: parent folders first, then children
                const sortedFolders = [...response.data.folders].sort((a, b) => {
                    const pathA = [...a.path.map(p => p.name), a.name].join("/");
                    const pathB = [...b.path.map(p => p.name), b.name].join("/");
                    return pathA.localeCompare(pathB);
                });
                setFolders(sortedFolders);
            }
        } catch (err) {
            console.error("Failed to fetch folders", err);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = Array.from(e.dataTransfer.files);
        addFiles(files);
    };

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        addFiles(files);
    };

    const addFiles = (files) => {
        const newFiles = files.map((file) => ({
            file,
            id: Math.random().toString(36).substr(2, 9),
            preview: file.type.startsWith("image/")
                ? URL.createObjectURL(file)
                : null,
        }));
        setSelectedFiles((prev) => [...prev, ...newFiles]);
    };

    const removeFile = (id) => {
        setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
        setUploadProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[id];
            return newProgress;
        });
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const uploadFiles = async () => {
        if (selectedFiles.length === 0) return;

        setUploading(true);
        const results = [];

        for (const fileObj of selectedFiles) {
            try {
                const formData = new FormData();
                formData.append("file", fileObj.file);
                formData.append("visibility", "public");
                formData.append("folderId", selectedFolderId);

                const response = await fileApi.uploadFile(formData, (progress) => {
                    setUploadProgress((prev) => ({
                        ...prev,
                        [fileObj.id]: progress,
                    }));
                });

                results.push({
                    id: fileObj.id,
                    success: true,
                    data: response.data,
                    fileName: fileObj.file.name,
                });
            } catch (error) {
                results.push({
                    id: fileObj.id,
                    success: false,
                    error: error.response?.data?.message || "Upload failed",
                    fileName: fileObj.file.name,
                });
            }
        }

        setUploadResults(results);
        setUploading(false);
    };

    const resetUpload = () => {
        setSelectedFiles([]);
        setUploadProgress({});
        setUploadResults([]);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("URL copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        Upload Media
                    </h1>
                    <p className="text-gray-500">
                        Select a folder and upload your assets
                    </p>
                </div>

                {/* Folder Selector */}
                {selectedFiles.length > 0 && uploadResults.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 cursor-pointer">
                        <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                            Destination Folder
                        </label>
                        <div className="relative">
                            <FolderIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                            <select
                                value={selectedFolderId}
                                onChange={(e) => setSelectedFolderId(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all"
                            >
                                <option value="null">Root (Home Directory)</option>
                                {folders.map((folder) => {
                                    const depth = folder.path?.length || 0;
                                    const prefix = depth > 0 ? "—".repeat(depth) + " " : "";
                                    return (
                                        <option key={folder._id} value={folder._id}>
                                            {prefix}{folder.name}
                                        </option>
                                    );
                                })}
                            </select>
                            <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                )}

                {/* Upload Area */}
                {uploadResults.length === 0 && (
                    <div
                        className={`relative border-2 border-dashed rounded-3xl cursor-pointer p-16 text-center transition-all duration-300 group ${dragActive
                            ? "border-blue-500 bg-blue-50 scale-[1.01]"
                            : "border-gray-200 bg-white hover:border-blue-400"
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            onChange={handleFileSelect}
                            className="hidden"
                            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.csv"
                        />

                        <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                            <CloudArrowUpIcon className="w-10 h-10 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            {dragActive ? "Release to drop" : "Drop files here"}
                        </h3>
                        <p className="text-gray-500 mb-4 font-medium">
                            or click to browse your storage
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {["PNG", "JPG", "MP4", "PDF", "CSV"].map(type => (
                                <span key={type} className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold">{type}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Selected Files */}
                {selectedFiles.length > 0 && uploadResults.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-xl mt-8 border border-gray-100 p-6 overflow-hidden">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-50">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <span>Pending Uploads</span>
                                <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-sm">{selectedFiles.length}</span>
                            </h2>
                            <button
                                onClick={resetUpload}
                                className="text-red-500 hover:text-red-600 font-bold text-sm cursor-pointer"
                            >
                                Clear All
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {selectedFiles.map((fileObj) => (
                                <div
                                    key={fileObj.id}
                                    className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-100"
                                >
                                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                                        {fileObj.preview ? (
                                            <img
                                                src={fileObj.preview}
                                                alt={fileObj.file.name}
                                                className="w-14 h-14 object-cover rounded-xl shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-14 h-14 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                                                <CloudArrowUpIcon className="w-7 h-7 text-gray-400" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 truncate mb-0.5">
                                                {fileObj.file.name}
                                            </p>
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                {formatFileSize(fileObj.file.size)}
                                            </p>
                                            {uploadProgress[fileObj.id] !== undefined && (
                                                <div className="mt-2">
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className="bg-blue-600 h-full rounded-full transition-all duration-300"
                                                            style={{ width: `${uploadProgress[fileObj.id]}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {!uploading && (
                                        <button
                                            onClick={() => removeFile(fileObj.id)}
                                            className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                                        >
                                            <XMarkIcon className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={uploadFiles}
                            disabled={uploading}
                            className={`mt-8 w-full py-4 px-6 rounded-2xl font-bold text-white transition-all transform active:scale-95 shadow-lg cursor-pointer ${uploading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                                }`}
                        >
                            {uploading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Processing Uploads...</span>
                                </div>
                            ) : `Begin Upload (${selectedFiles.length} Assets)`}
                        </button>
                    </div>
                )}

                {/* Upload Results (Keep existing results UI but style it) */}
                {uploadResults.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span>Upload Report</span>
                            <span className="text-sm font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                                {uploadResults.filter(r => r.success).length} of {uploadResults.length} Successful
                            </span>
                        </h2>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mb-8">
                            {uploadResults.map((result) => (
                                <div
                                    key={result.id}
                                    className={`p-5 rounded-2xl border-2 transition-all ${result.success
                                        ? "bg-green-50/30 border-green-100 shadow-sm shadow-green-50"
                                        : "bg-red-50/30 border-red-100"
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {result.success ? (
                                            <div className="p-2 bg-green-100 rounded-full">
                                                <CheckCircleIcon className="w-6 h-6 text-green-600" />
                                            </div>
                                        ) : (
                                            <div className="p-2 bg-red-100 rounded-full">
                                                <ExclamationCircleIcon className="w-6 h-6 text-red-600" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 truncate">
                                                {result.fileName}
                                            </p>
                                            {result.success ? (
                                                <div className="mt-3 space-y-3">
                                                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                                        <span>{result.data.formattedSize}</span>
                                                        <span>•</span>
                                                        <span>{result.data.fileType}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-white/50 p-1.5 rounded-xl border border-gray-100">
                                                        <input
                                                            type="text"
                                                            value={result.data.fileUrl}
                                                            readOnly
                                                            className="flex-1 px-3 py-2 text-sm bg-transparent outline-none font-medium truncate"
                                                        />
                                                        <button
                                                            onClick={() => copyToClipboard(result.data.fileUrl)}
                                                            className="px-4 py-2 text-xs font-bold bg-white text-blue-600 rounded-lg hover:bg-blue-50 border border-blue-50 transition-all shadow-sm cursor-pointer"
                                                        >
                                                            Copy
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-sm font-medium text-red-600 mt-1">
                                                    {result.error}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={resetUpload}
                            className="w-full py-4 px-6 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold font-semibold transition-all shadow-xl shadow-gray-200 cursor-pointer"
                        >
                            Back to Uploader
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadPage;
