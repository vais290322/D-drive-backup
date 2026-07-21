import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Package,
  Image as ImageIcon,
} from "lucide-react";
import toastUtil from "@/shared/utils/toast";
import { Button } from "@/admin/components/ui/Button";
import { Card, CardContent } from "@/admin/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/admin/components/ui/Table";
import { Pagination } from "@/admin/components/ui/Pagination";
import ViewProductModal from "./ViewProduct";
import ProductImageModal from "./ProductImageModal";
import { useMargProducts } from "@/shared/hooks/queries/useMargProducts";
import ProductTableSkeleton from "@/admin/components/ui/ProductTableSkeleton";
import { cn } from "@/admin/utils/cn";
import { Badge } from "@/admin/components/ui/Badge";
import axios from "axios";
const categoryBaseUrl = `${import.meta.env.VITE_MEDIA_CLOUD_BASE_URL}/api/v1/categories`;

const ProductRow = React.memo(({ product, onView, onImages }) => {
  // console.log("product from ProductRow: ",product)
  return (
  <TableRow
    className="group border-b border-gray-100/80 hover:bg-emerald-50/30 transition-all duration-150"
  >
    <TableCell className="py-4 px-6">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          {product.images?.[0] ? (
            <img
              src={product.images[0].fileUrl || product.images[0].url || product.images[0]}
              alt={product.name}
              className="w-14 h-14 object-cover rounded-xl shadow-sm border border-gray-200"
            />
          ) : (
            <div className="w-14 h-14 bg-gray-100 flex items-center justify-center rounded-xl border border-dashed border-gray-300">
              <Package className="w-6 h-6 text-gray-300" />
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
            {product.name}
          </span>
          <span className="text-[11px] text-gray-500 font-mono mt-0.5">
            {product.code}
          </span>
        </div>
      </div>
    </TableCell>
    <TableCell className="py-4 px-6 hidden lg:table-cell">
       <div className="max-w-[150px]">
         <p className="text-xs font-medium text-gray-600 truncate">{product.company}</p>
       </div>
    </TableCell>
    <TableCell className="py-4 px-6 text-center">
      <div className="flex flex-col items-center">
        <span className="text-sm font-bold text-gray-900">₹{product.mrp.toFixed(2)}</span>
        <span className="text-[10px] text-gray-400 line-through">₹{(product.mrp * 1.1).toFixed(2)}</span>
      </div>
    </TableCell>
    <TableCell className="py-4 px-6 text-center">
      <Badge variant={product.stock > 0 ? "success" : "destructive"} className="px-3">
        {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
      </Badge>
    </TableCell>
    <TableCell className="py-4 px-6 hidden xl:table-cell text-center">
      <div className="flex justify-center">
        <span className={cn(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-tight border",
          "bg-slate-50 text-slate-600 border-slate-200 shadow-sm uppercase"
        )}>
          {(() => {
            const exp = product.expiry;
            if (!exp || exp === "N/A") return "N/A";
            
            // Handle common pharma format MM/YY or MM/YYYY
            const parts = exp.split(/[-/]/);
            if (parts.length >= 2) {
              const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
              const m = parseInt(parts[0], 10);
              const y = parts[1].length === 2 ? `20${parts[1]}` : parts[1];
              if (m >= 1 && m <= 12) return `${months[m - 1]} ${y}`;
            }
            return exp;
          })()}
        </span>
      </div>
    </TableCell>
    <TableCell className="py-4 px-6 text-right">
      <div className="flex items-center justify-end gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
          onClick={() => onView(product.rid)}
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
          onClick={() => onImages(product)}
          title="Edit Images"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
      </div>
    </TableCell>
  </TableRow>
)
});

ProductRow.displayName = "ProductRow";

const ProductsList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 50,
  });
  
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

    const [allCategory , setAllCategory]=useState([])
    
    // console.log(" allCategory : ",allCategory)
  
    const getAllCategory = async () => {
      try { 
        const response = await axios.get(categoryBaseUrl);
    //  console.log(" getAllCategory response : ",response)
        setAllCategory(response.data.data.categories);
      } catch (error) {
        console.error(error);
      }
    };
  
    useEffect(() => {
      getAllCategory();
    }, []);

  // Fetch Marg Products using React Query
  const { 
    data, 
    isLoading, 
    isFetching,
    isError, 
    error 
  } = useMargProducts({
    page: pagination.currentPage,
    limit: pagination.limit,
    search: search
  });
// console.log("product from list : ",data.products)
  const products = data?.products || [];
  const totalItems = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  // Handle page change with smooth scroll to top of table
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
    const scrollTarget = document.querySelector("#admin-product-table");
    if (scrollTarget) {
      scrollTarget.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (limit) => {
    setPagination((prev) => ({ ...prev, limit, currentPage: 1 }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleViewProduct = (rid) => {
    console.log("rid : ",rid)
    setSelectedProductId(rid);
    setViewOpen(true);
  };

  const handleOpenImages = (product) => {
    // console.log("product from handleOpenImages: ",product)
    setSelectedProduct(product);
    setImageModalOpen(true);
  };

  if (isError) {
    toastUtil.error(error?.message || "Failed to fetch Marg products");
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[#F9FAFB] overflow-hidden">
      {/* Premium Header Section - Fixed */}
      <header className="shrink-0 px-6 py-4 bg-white border-b border-gray-200/80 shadow-sm z-30">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
              Marg ERP Products
            </h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              className="flex-1 sm:flex-none h-10 px-4 font-semibold text-gray-700 hover:bg-gray-50 border-gray-300 transition-all active:scale-95"
              onClick={() => navigate("/admin/dashboard")}
            >
              Dashboard
            </Button>
            <Button
              onClick={() => navigate("/admin/products/new")}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all active:scale-95 h-10 px-5 font-bold"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span>Add Product</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Modern Filter & Search Toolbar - Fixed */}
      <div className="shrink-0 px-6 py-4 bg-gray-50/50 border-b border-gray-200/60 z-20">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="relative w-full max-w-xl group">
            <input
              type="text"
              placeholder="Search products by brand, code, or salt name..."
              value={search}
              onChange={handleSearchChange}
              className="block w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300/80 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm group-hover:border-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 ml-auto shrink-0 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
             <Badge variant="secondary" className="cursor-default bg-white border-gray-200 text-gray-600">
               {totalItems.toLocaleString()} Products Found
             </Badge>
          </div>
        </div>
      </div>

      {/* Main Content Area - Constrained to prevent whole-page scroll */}
      <main className="flex-1 overflow-hidden p-4 sm:p-6 lg:p-8 bg-gray-50/30">
        <div className="max-w-[1600px] mx-auto h-full flex flex-col">
          <Card className="flex-1 flex flex-col min-h-0 border border-gray-200/80 shadow-xl shadow-gray-200/40 bg-white rounded-2xl overflow-hidden">
            <CardContent className="flex flex-col flex-1 p-0 overflow-hidden">
              
              {/* FIXED SCROLLABLE TABLE AREA */}
              <div id="admin-product-table" className="flex-1 overflow-auto no-scrollbar relative">
                <Table className="relative border-collapse min-w-full">
                  <TableHeader className="sticky top-0 z-20">
                    <TableRow className="bg-gray-50 border-b border-gray-200 hover:bg-gray-50">
                      <TableHead className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-20">Product Information</TableHead>
                      <TableHead className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell sticky top-0 bg-gray-50 z-20">Manufacturer</TableHead>
                      <TableHead className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center sticky top-0 bg-gray-50 z-20">Unit Price (MRP)</TableHead>
                      <TableHead className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center sticky top-0 bg-gray-50 z-20">Inventory Status</TableHead>
                      <TableHead className="py-4 px-6 text-[11px] font-bold text-gray-500 uppercase tracking-wider hidden xl:table-cell sticky top-0 bg-gray-50 z-20">Expiry Date</TableHead>
                      <TableHead className="py-4 px-6 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 z-20">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <ProductTableSkeleton rows={pagination.limit} columns={6} />
                    ) : products.length > 0 ? (
                      products.map((product) => (
                        <ProductRow 
                          key={product.id} 
                          product={product} 
                          onView={handleViewProduct} 
                          onImages={handleOpenImages}
                        />
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-96 text-center">
                          <div className="flex flex-col items-center justify-center p-12">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                              <Package className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">No products found</h3>
                            <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                              Try adjusting your search or filters to find what you're looking for.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* FIXED PAGINATION FOOTER */}
              <div className="shrink-0 px-6 py-4 bg-white border-t border-gray-200/80 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  onPageChange={handlePageChange}
                  itemsPerPage={pagination.limit}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  loading={isLoading || isFetching}
                  variant="enterprise"
                  className="shadow-none border-none p-0 bg-transparent"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <ProductImageModal
        open={imageModalOpen}
        onOpenChange={setImageModalOpen}
        product={selectedProduct}
        allCategory={allCategory}
      />

      <ViewProductModal
        open={viewOpen}
        productId={selectedProductId}
        onClose={() => {
          setViewOpen(false);
          setSelectedProductId(null);
        }}
      />
    </div>
  );
};

export default ProductsList;
