import React, { useState, useEffect } from "react";
import { Search, Star, StarOff, Package, Sparkles } from "lucide-react";
import toastUtil from "@/shared/utils/toast";
import { Button } from "@/admin/components/ui/Button";
import { Input } from "@/admin/components/ui/Input";
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
import { productService } from "@/services/admin/api/productService";
import { featuredProductService } from "@/services/admin/api/featuredProductService";
import { featuredProductUrl, productUrl } from "@/config/adminApi";
import axios from "axios";
import ConfirmationModal from "@/admin/components/ui/ConfirmationModal";

const FeaturedProducts = () => {
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [debouncedAddSearchQuery, setDebouncedAddSearchQuery] = useState("");

  // Confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteFeatured, setDeleteFeatured] = useState(null);

  // Add modal search
  const [addSearchQuery, setAddSearchQuery] = useState("");

  // Debounce featured products search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); 

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Debounce add modal search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAddSearchQuery(addSearchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [addSearchQuery]);

  const fetchFeaturedProducts = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(featuredProductUrl.getFeaturedProducts);
      let featured = Array.isArray(res?.data?.data) ? res.data.data : [];

      if (debouncedSearchQuery) {
        const lower = debouncedSearchQuery.toLowerCase();
        featured = featured.filter((f) =>
          f.productId?.name?.toLowerCase().includes(lower)
        );
      }

      setProducts(featured);
    } catch (error) {
      setProducts([]);
      toastUtil.error("Failed to fetch featured products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProducts();
  }, [debouncedSearchQuery, isAddModalOpen]);

  const handleAdd = async (product) => {
    try {
      await featuredProductService.addFeaturedProduct(product._id);
      setIsAddModalOpen(false);
      toastUtil.success("Added to Highlighted Products");
    } catch (error) {
      console.error(error);
      toastUtil.error("Failed to add featured product");
    }
  };

  const handleRemove = (featured) => {
    setDeleteFeatured(featured);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteFeatured) return;
    setDeleteLoading(true);
    try {
      await featuredProductService.removeFeaturedProduct(deleteFeatured._id);
      toastUtil.success("Removed from Highlighted Products");
      setProducts((prev) => prev.filter((f) => f._id !== deleteFeatured._id));
      setConfirmOpen(false);
      setDeleteFeatured(null);
    } catch (error) {
      console.error(error);
      toastUtil.error("Failed to remove featured product");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      if (!isAddModalOpen) return;

      try {
        const url = productUrl.withoutPagination + 
          (debouncedAddSearchQuery ? `?search=${encodeURIComponent(debouncedAddSearchQuery)}` : "");

        const res = await fetch(url);
        const data = await res.json();

        const featuredIds = products.map((f) => f.productId?._id);
        const list = Array.isArray(data?.data) ? data.data : [];

        const nonFeatured = list.filter((p) => !featuredIds.includes(p._id));
        setAllProducts(nonFeatured);
      } catch {
        setAllProducts([]);
      }
    };

    fetchAllProducts();
  }, [isAddModalOpen, debouncedAddSearchQuery, products]);

  const paginatedProducts = Array.isArray(products) 
    ? products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    : [];

    // console.log("paginatedProducts", paginatedProducts);

   function formatYYYYMMDDtoDDMMYYYY(value) {
  if (!value || value.length !== 8) return "";

  const day = value.slice(6, 8);
  const month = value.slice(4, 6);
  const year = value.slice(0, 4);

  return `${day}/${month}/${year}`;
}


  return (
    <div
      className="h-full flex flex-col space-y-4 p-2 sm:p-4"
      style={{
        background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)",
        padding: "10px 10px 0px 10px",
      }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 shrink-0">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-4xl font-bold bg-linear-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent flex items-center gap-2">
            Featured Products
            <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-emerald-500" />
          </h2>
          <p className="text-gray-500 text-[10px] sm:text-[8px] sm:text-xs md:text-sm mt-0.5">
            Manage products featured on the home page
          </p>
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="gap-1"
        >
          <Package className="h-4 w-4" /> 
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      <Card className="flex-1 flex flex-col min-h-0 shadow-sm border-gray-200/60 bg-white/50 backdrop-blur-xl">
        <CardContent className="flex-1 flex flex-col p-2 sm:p-3 md:p-4 min-h-0">
          <div className="flex items-center gap-4 mb-2 sm:mb-3 md:mb-4 shrink-0">
            <div className="relative w-full lg:w-72">
              <Search className="absolute right-2.5 top-2 h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
              <Input
                placeholder="Search featured products..."
                className="pl-8 sm:pl-9 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto rounded-md border border-gray-200">
            <Table>
              <TableHeader>
                <TableRow style={{ background: "linear-gradient(to right, #f0fdf4, #f0fdfa)" }}>
                  <TableHead className="font-semibold text-gray-700 text-sm">Product Name</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-sm hidden sm:table-cell">Category</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-sm">MRP</TableHead>
                  <TableHead className="font-semibold text-gray-700 text-sm text-center">Expiry Date</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700 text-sm">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-emerald-600"></div>
                        <span className="text-sm">Loading...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedProducts.length > 0 ? (
                  paginatedProducts.map((featured) => {
                    const product = featured.productId;
                    // console.log("product", featured);
                    return (
                      <TableRow key={featured._id} className="hover:bg-emerald-50/50 transition-all duration-200 border-b border-gray-100">
                        <TableCell className="font-medium text-gray-900 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg text-gray-600">
                              {featured?.images && featured.images.length > 0 ? (
                                <img src={featured.images[0].url} alt="" className="w-8 h-8 object-cover rounded" />
                              ) : (
                                <Package className="h-4 w-4" />
                              )}
                            </div>
                            {featured?.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-500 text-sm hidden sm:table-cell">{featured?.categoryDetails?.name}</TableCell>
                        <TableCell className="text-gray-900 font-bold text-sm">₹{Number(featured?.MRP || 0).toFixed(2)}</TableCell>
                        <TableCell className="text-center">
                          <span className="capitalize text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            {formatYYYYMMDDtoDDMMYYYY(featured?.exp)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleRemove(featured)} className="text-red-500 hover:text-red-700">
                            <StarOff className="h-4 w-4 mr-1" />
                            <span className="hidden sm:inline">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">No highlighted products found.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {!isLoading && products.length > 0 && (
            <div className="shrink-0 mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(products.length / itemsPerPage)}
                onPageChange={(page) => setCurrentPage(page)}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(val) => {
                  setItemsPerPage(val);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => {
          if (!deleteLoading) {
            setConfirmOpen(false);
            setDeleteFeatured(null);
          }
        }}
        onConfirm={handleDelete}
        title="Remove Featured Product"
        message="Are you sure you want to remove this product from the featured list?"
        confirmText="Remove"
        variant="danger"
        isLoading={deleteLoading}
      />

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Select Product to Highlight</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>Close</Button>
            </div>
            <Input
              placeholder="Search products..."
              className="mb-4"
              value={addSearchQuery}
              onChange={(e) => setAddSearchQuery(e.target.value)}
            />
            <div className="flex-1 overflow-auto rounded-md">
              <Table>
                <TableBody>
                  {allProducts.map((p) => (
                    <TableRow key={p._id} className="hover:bg-gray-50">
                      <TableCell className="text-sm font-medium">{p.name}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => handleAdd(p)}>Select</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {allProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center py-8 text-gray-500">No products found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedProducts;
