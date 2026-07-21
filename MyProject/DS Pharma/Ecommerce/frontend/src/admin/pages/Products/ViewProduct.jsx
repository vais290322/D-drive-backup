import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  X,
  Package,
  Tag,
  CreditCard,
  Hash,
  Building2,
  Truck,
  Archive,
  Calendar,
  Layers,
  Database,
  FlaskConical,
  Percent,
  CircleDollarSign,
  Barcode
} from "lucide-react";
import { productUrl } from "@/config/adminApi";
import { Button } from "@/admin/components/ui/Button";
import { Badge } from "@/admin/components/ui/Badge";
import { Card, CardContent } from "@/admin/components/ui/Card";
import toastUtil from "@/shared/utils/toast";
import { cn } from "@/admin/utils/cn";

const ViewProductModal = ({ open, onClose, productId }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_URL}/category`);
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  const categoryMap = React.useMemo(() => {
    const map = {};
    categories.forEach((cat) => {
      map[cat._id || cat.id] = cat.name;
    });
    return map;
  }, [categories]);

  useEffect(() => {
    if (!open || !productId) return;

    if (categories.length === 0) {
      fetchCategories();
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${productUrl.getAllProducts}/details/${productId}`);
        setProduct(res.data.data || res.data);
      } catch {
        toastUtil.error("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [open, productId, categories.length]);

  const getCategoryName = (category) => {
    if (!category) return "Uncategorized";
    if (typeof category === 'object' && category.name) return category.name;
    return categoryMap[category] || category;
  };

  const formatDate = (dateStr) => {
    if (!dateStr || dateStr === "0") return "-";
    // Format YYYYMMDD to DD/MM/YYYY
    if (dateStr.length === 8) {
      return `${dateStr.slice(6, 8)}/${dateStr.slice(4, 6)}/${dateStr.slice(0, 4)}`;
    }
    return dateStr;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[90vh] animate-in slide-in-from-bottom-8 duration-500 border border-white/20">

        {/* Header Section */}
        <div className="relative border-b shrink-0 bg-gradient-to-r from-emerald-50/50 to-teal-50/50 p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div className=" " style={{ marginLeft: "18px" }}>
              <div className="flex items-center gap-3 ">
                <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold border-0 px-10   py-1 uppercase tracking-wider text-[10px] ">
                  PRODUCT #{product?.rid || "---"}
                </Badge>
                {product?.categoryDetails?.name && (
                  <Badge variant="outline" className="border-emerald-200 text-emerald-700 font-bold bg-emerald-50 text-red-500">
                    {product.categoryDetails.name}
                  </Badge>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <Package className="w-8 h-8 text-emerald-600" />
                {loading ? "Loading..." : product?.name || "Product Name"}
              </h2>
              <div className="flex items-center gap-2 text-slate-500 font-medium">
                <Building2 className="w-4 h-4 text-slate-400" />
                <span className="text-sm truncate max-w-md">{product?.company || "Manufacturer Unknown"}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 border border-transparent hover:border-slate-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50/20">
          <div className="max-w-6xl mx-auto p-8 sm:p-10 space-y-10">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Synchronizing Product Data...</p>
              </div>
            ) : product ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                {/* LH Column - Media & Key Metrics */}
                <div className="lg:col-span-4 space-y-8">
                  <section className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Layers className="w-4 h-4" /> Media Assets
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {product.images?.length > 0 ? (
                        product.images.map((img, i) => (
                          <div key={i} className={cn(
                            "group relative aspect-square rounded-3xl border-2 overflow-hidden bg-white transition-all hover:border-emerald-500/50 shadow-sm",
                            i === 0 ? "col-span-2 border-emerald-100 shadow-xl shadow-emerald-50" : "border-slate-100"
                          )}>
                            <img src={img.url} alt="product" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            {i === 0 && (
                              <div className="absolute top-3 left-3">
                                <Badge className="bg-emerald-500 text-white border-0 font-bold px-3 py-1 text-[9px] shadow-lg">PRIMARY</Badge>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 aspect-video rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3">
                          <ImageIcon className="w-10 h-10 text-slate-300" />
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-tight">No imagery available</span>
                        </div>
                      )}
                    </div>
                  </section>

                  <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-6 space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Truck className="w-4 h-4" /> Quick Inventory
                    </h4>
                    <div className="space-y-4">
                      <ProgressMetric label="Current Stock" value={product.stock} unit="Units" icon={Archive} color="emerald" />
                      <ProgressMetric label="Batch Number" value={product.curbatch} icon={Barcode} color="blue" />
                      <ProgressMetric label="Expiry Date" value={formatDate(product.exp)} icon={Calendar} color="amber" />
                    </div>
                  </section>
                </div>

                {/* RH Column - Detailed Specs */}
                <div className="lg:col-span-8 space-y-10">

                  {/* General Info */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Tag className="w-4 h-4" /> Product Classification
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <SpecCard icon={Tag} label="Category" value={product.categoryDetails.name} />
                      <SpecCard icon={Building2} label="Manufacturer" value={product.company} />
                      <SpecCard icon={FlaskConical} label="Salt/Composition" value={product.Salt} />
                      <SpecCard icon={Hash} label="Shop Code" value={product.shopcode} />
                      <SpecCard icon={Layers} label="Conversion" value={product.Conversion} />
                      <SpecCard icon={Database} label="Marg Code" value={product.MargCode} />
                    </div>
                  </div>

                  {/* Financial Details */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 text-emerald-600">
                      <CircleDollarSign className="w-4 h-4" /> Pricing & Financials
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <PriceCard label="MRP" value={product.MRP} type="mrp" />
                      <PriceCard label="Sale Rate" value={product.Rate} type="rate" />
                      <PriceCard label="Purchase Rate" value={product.PRate} type="prate" />
                    </div>
                  </div>

                  {/* Offers & Identifiers */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <Percent className="w-4 h-4" /> Offers & Secondary IDs
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <SmallSpec icon={Percent} label="Deal Offer" value={product.Deal} />
                      <SmallSpec icon={Archive} label="Free Item" value={product.Free} />
                      <SmallSpec icon={Barcode} label="GCode-6" value={product.Gcode6} />
                      <SmallSpec icon={CreditCard} label="Marg GCode" value={product.gcode} />
                    </div>
                  </div>

                  {/* Remarks Section */}
                  {product.remarks && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                        <Archive className="w-4 h-4" /> Professional Remarks
                      </h4>
                      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 font-mono text-[11px] text-slate-600 leading-relaxed overflow-x-auto whitespace-pre">
                        {product.remarks}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="p-8 bg-slate-50 rounded-full">
                  <Package className="w-12 h-12 text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Resource Not Found</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="shrink-0 p-8 border-t flex justify-between items-center bg-white">
          <div className="flex items-center gap-3 text-slate-400">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-black uppercase tracking-tight">Active Product Record</span>
          </div>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-2xl px-10 h-12 font-black text-slate-500 border-slate-200 hover:bg-slate-50 shadow-sm"
          >
            Close Viewer
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Child Components for Premium UI ---

const SpecCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white border border-slate-100 rounded-3xl p-5 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
    <div className="flex items-start gap-4">
      <div className="p-2.5 bg-slate-50 rounded-2xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</label>
        <p className="font-bold text-slate-800 text-sm break-words">{value || "---"}</p>
      </div>
    </div>
  </div>
);

const SmallSpec = ({ icon: Icon, label, value }) => (
  <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3 flex items-center justify-between group">
    <div className="flex items-center gap-2">
      <Icon className="w-3 h-3 text-slate-300" />
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">{label}</span>
    </div>
    <span className="text-xs font-bold text-slate-800">{value || "0"}</span>
  </div>
);

const PriceCard = ({ label, value, type }) => (
  <div className={cn(
    "rounded-[2rem] p-6 border-2 flex flex-col gap-2 relative overflow-hidden",
    type === "mrp" ? "bg-slate-50 border-slate-100" :
      type === "rate" ? "bg-emerald-50 border-emerald-100" : "bg-blue-50 border-blue-100"
  )}>
    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 relative z-10 text-center">{label}</label>
    <p className={cn(
      "text-2xl font-black tracking-tight relative z-10 text-center",
      type === "mrp" ? "text-slate-900" :
        type === "rate" ? "text-emerald-700" : "text-blue-700"
    )}>
      ₹{Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
    </p>
    <div className="absolute right-[-10px] bottom-[-10px] opacity-10 text-slate-300">
      <CircleDollarSign className="w-20 h-20" />
    </div>
  </div>
);

const ProgressMetric = ({ label, value, icon: Icon, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end">
      <div className="flex items-center gap-2">
        <Icon className={cn("w-4 h-4", `text-${color}-500`)} />
        <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight">{label}</span>
      </div>
      <span className="text-sm font-black text-slate-900">{value || "---"}</span>
    </div>
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={cn("h-full rounded-full w-full", `bg-${color}-500`)} />
    </div>
  </div>
);

const ImageIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

export default ViewProductModal;
