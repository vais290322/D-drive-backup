import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Trash2,
  Loader2,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Save,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/admin/components/ui/Dialog";
import { Button } from "@/admin/components/ui/Button";
import { Badge } from "@/admin/components/ui/Badge";
import toastUtil from "@/shared/utils/toast";
import { mediaCloudService } from "@/services/mediaCloud.service";
import { productUrl } from "@/config/adminApi";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/admin/utils/cn";

const BUCKET_FOLDER_ID = "697b4c400829419d7080fe7c";
const productBaseUrl = `${import.meta.env.VITE_MEDIA_CLOUD_BASE_URL}/api/v1/products`;




const ProductImageModal = ({ open, onOpenChange, product, allCategory }) => {
  const queryClient = useQueryClient();
  const [imageList, setImageList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const [categoryId, setCategoryId] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);


  console.log("category : ", allCategory)

  // Initialize state from product
  useEffect(() => {
    if (open && product) {
      const initialImages = (Array.isArray(product.images) ? product.images : []).map((img, idx) => ({
        id: img.fileId || `existing-${idx}`,
        fileId: img.fileId,
        fileUrl: img.url || img.fileUrl,
        status: "success",
        progress: 100,
        name: img.name || `Image ${idx + 1}`
      }));
      setImageList(initialImages);
      setCategoryId(product.category || product.categoryId || "");
      setIsFeatured(product.isFeatured || false);
    }
  }, [open, product]);

  const uploadSingleFile = async (item) => {
    if (item.status === "success" || item.status === "uploading") return;

    setImageList(prev => prev.map(img =>
      img.id === item.id ? { ...img, status: "uploading", progress: 0, error: null } : img
    ));

    try {
      const result = await mediaCloudService.uploadFile(
        item.file,
        "public",
        BUCKET_FOLDER_ID,
        (progress) => {
          console.log("progress : ", progress)
          setImageList(prev => prev.map(img =>
            img.id === item.id ? { ...img, progress } : img
          ));
        }
      );

      console.log("result : ", result)

      setImageList(prev => prev.map(img =>
        img.id === item.id ? {
          ...img,
          status: "success",
          fileId: result.fileId,
          fileUrl: result.url,
          progress: 100
        } : img
      ));
    } catch (error) {
      setImageList(prev => prev.map(img =>
        img.id === item.id ? { ...img, status: "error", error: error.message } : img
      ));
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newItems = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      status: "pending",
      progress: 0,
    }));

    setImageList(prev => [...prev, ...newItems]);

    // Automatically trigger upload for each new file
    newItems.forEach(item => uploadSingleFile(item));

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (id) => {
    setImageList(prev => prev.filter(img => img.id !== id));
  };

  const moveImage = (index, direction) => {
    const newList = [...imageList];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newList.length) return;

    [newList[index], newList[newIndex]] = [newList[newIndex], newList[index]];
    setImageList(newList);
  };

  const handleSave = async () => {
    const allSuccessful = imageList.every(img => img.status === "success");
    if (!allSuccessful) {
      return toastUtil.error("Please wait for all uploads to complete or remove failed ones.");
    }

    setIsSaving(true);
    try {
      // STRICT CONTRACT: { "images": [ { "fileId", "fileUrl" } ], "categoryId", "isFeatured" }
      const payload = {
        images: imageList.map(img => ({
          fileId: img.fileId,
          url: img.fileUrl // Standardize on 'url' to match frontend consumers
        })),
        categoryId: categoryId,
        isFeatured: isFeatured
      };
      // console.log("payload : ", payload)
      // return;

      await axios.put(`${productBaseUrl}/update/${product.rid}`, payload);
      toastUtil.success("Product images updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toastUtil.error(error.response?.data?.message || "Failed to sync changes to server");
    } finally {
      setIsSaving(false);
    }
  };

  const isUploading = imageList.some(img => img.status === "uploading" || img.status === "pending");

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden rounded-2xl border-0 shadow-2xl ">
        {/* Fixed Header */}
        <DialogHeader className="p-6 border-b bg-slate-50/50 shrink-0">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-emerald-600" />
                <span>Manage Product Media</span>
              </DialogTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 font-mono border-emerald-100 px-2 py-0.5">
                  {product.code || product.sku || 'NO-CODE'}
                </Badge>
                <span className="text-sm text-slate-500 font-medium truncate max-w-[300px]">
                  {product.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge className="bg-white text-slate-500 font-bold border border-slate-200">
                {imageList.length} Assets
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 bg-white border-b flex flex-wrap items-center gap-6">
          <div className="flex flex-col gap-1.5 min-w-[240px]">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Assigned Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2364748b%22%20stroke-width%3D%221.67%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_12px_center] bg-no-repeat"
            >
              <option value="">Uncategorized</option>
              {allCategory.map((cat) => (
                <option key={cat._id} value={cat._id} >
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 px-5 py-3 rounded-2xl hover:bg-emerald-50/50 hover:border-emerald-100 transition-all cursor-pointer group" onClick={() => setIsFeatured(!isFeatured)}>
            <div className={cn(
              "w-6 h-6 rounded-lg flex items-center justify-center transition-all",
              isFeatured ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "bg-slate-200 text-slate-400"
            )}>
              {isFeatured && <span className="font-bold text-[10px]">★</span>}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-slate-700">Featured Product</span>
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">Show on homepage collections</span>
            </div>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="hidden"
            />
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/20 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Upload Trigger Card */}
            <div
              className={cn(
                "group relative border-4 border-dashed rounded-[2rem] aspect-square flex flex-col items-center justify-center transition-all cursor-pointer",
                "border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50"
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
                disabled={isSaving}
              />
              <div className="p-5 bg-white rounded-3xl shadow-xl shadow-slate-200/50 group-hover:scale-110 transition-transform mb-4">
                <Plus className="w-8 h-8 text-emerald-600" />
              </div>
              <span className="text-sm font-black text-slate-800">Add New Media</span>
              <span className="text-[11px] text-slate-400 mt-1 font-bold">Multiple Select Supported</span>
            </div>

            {/* Individual Image Cards */}
            {imageList.map((img, index) => (
              <div key={img.id} className={cn(
                "relative aspect-square rounded-[2rem] overflow-hidden border-2 bg-white group shadow-sm transition-all",
                img.status === "error" ? "border-red-200 shadow-red-50" :
                  index === 0 ? "border-emerald-500 shadow-xl shadow-emerald-100" : "border-slate-100 hover:border-slate-300"
              )}>
                {/* Preview / Image */}
                <div className="w-full h-full relative group">
                  {img.id.startsWith('existing') || img.status === "success" ? (
                    <img src={img.fileUrl} alt={img.name} className="w-full h-full object-cover" />
                  ) : img.file ? (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-slate-300" />
                    </div>
                  ) : null}

                  {/* Status Overlays */}
                  {img.status === "uploading" && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white">
                      <Loader2 className="w-8 h-8 animate-spin mb-3 text-emerald-400" />
                      <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden mb-2">
                        <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${img.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-bold tracking-widest uppercase">{img.progress}% Uploading</span>
                    </div>
                  )}

                  {img.status === "error" && (
                    <div className="absolute inset-0 bg-red-600/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white">
                      <AlertCircle className="w-8 h-8 mb-3" />
                      <span className="text-[10px] font-black text-center mb-4 uppercase">{img.error || "Upload Failed"}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white border border-white/30 hover:bg-white/20 h-8"
                        onClick={(e) => { e.stopPropagation(); uploadSingleFile(img); }}
                      >
                        <RefreshCw className="w-3 h-3 mr-2" /> Retry
                      </Button>
                    </div>
                  )}

                  {/* Top Badge (Primary) */}
                  {index === 0 && img.status === "success" && (
                    <div className="absolute top-4 left-4 z-10">
                      <Badge className="bg-emerald-500 text-white border-0 py-1 px-3 shadow-lg font-bold">PRIMARY</Badge>
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-white/10 text-white hover:bg-white/30 h-8 w-8 rounded-full"
                          onClick={() => moveImage(index, "up")}
                          disabled={index === 0}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="bg-white/10 text-white hover:bg-white/30 h-8 w-8 rounded-full"
                          onClick={() => moveImage(index, "down")}
                          disabled={index === imageList.length - 1}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-red-500/20 text-white hover:bg-red-500 h-8 w-8 rounded-full border border-white/20"
                        onClick={() => removeImage(img.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!imageList.length && (
            <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-200 mt-6">
              <div className="p-8 bg-slate-50 rounded-full mb-4">
                <ImageIcon className="w-12 h-12 text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold">No images linked to this product.</p>
              <p className="text-xs text-slate-300 mt-1 uppercase tracking-widest">Select files to begin upload</p>
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        <DialogFooter className="p-6 border-t bg-white shrink-0 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <CheckCircle2 className={cn("w-4 h-4", imageList.length > 0 && !isUploading ? "text-emerald-500" : "text-slate-200")} />
            <span className="text-[11px] font-bold uppercase tracking-tight">
              {isUploading ? "Processing Assets..." : "All Assets Ready"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="font-bold text-slate-500 h-11 px-8"
              disabled={isSaving}
            >
              Discard
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || isUploading || imageList.length === 0}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black h-11 px-10 shadow-xl shadow-emerald-200 min-w-[180px]"
            >
              {isSaving ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              {isSaving ? "Saving..." : "Save Product Images"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductImageModal;
