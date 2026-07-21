import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  ArrowLeft,
  Package,
  Tag,
  Box,
  IndianRupee,
  Loader2,
} from "lucide-react";
import toastUtil from "@/shared/utils/toast";
import { useQueryClient } from "@tanstack/react-query";
import { categoryUrl, productUrl } from "@/config/adminApi";
import axios from "axios";
import { Button } from "@/admin/components/ui/Button";
import { Input } from "@/admin/components/ui/Input";
import { Label } from "@/admin/components/ui/Label";

import { productService } from "@/services/admin/api/productService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/admin/components/ui/Card";
import ConfirmationModal from "@/admin/components/ui/ConfirmationModal";

const ProductForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(id);
  
  let navState = null;
  try {
    navState =
      window.history.state &&
      window.history.state.usr &&
      window.history.state.usr.product
        ? window.history.state.usr.product
        : null;
  } catch {
    navState = null;
  }

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: 0,
    discountedPrice: 0,
    unit: "",
    brand: "",
    discount: 0,
    stock: 0,
    description: "",
    status: "active",
  });

  const fetchCategories = async () => {
    try {
      const res = await axios.get(categoryUrl.getAllCategories); 
      setCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
      toastUtil.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      if (navState) {
        setFormData({
          name: navState.name || "",
          sku: navState.sku || "",
          category: typeof navState.category === 'object' ? (navState.category._id || navState.category.id) : navState.category,
          price: navState.price || 0,
          discountedPrice: navState.discountedPrice || 0,
          unit: navState.unit || "",
          brand: navState.brand || "",
          discount: navState.discount || 0,
          stock: navState.stock || 0,
          description: navState.description || "",
          status: navState.status || "active",
        });
      } else {
        const fetchProduct = async () => {
          try {
            const product = await productService.getProduct(id);
            setFormData({
              name: product.name,
              sku: product.sku || "",
              category: typeof product.category === 'object' ? (product.category._id || product.category.id) : product.category,
              price: product.price,
              discountedPrice: product.discountedPrice || 0,
              unit: product.unit || "",
              brand: product.brand || "",
              discount: product.discount || 0,
              stock: product.stock,
              description: product.description || "",
              status: product.status || "active",
            });
          } catch (error) {
            console.error(error);
            navigate("/admin/products");
          }
        };
        fetchProduct();
      }
    }
  }, [id, isEditMode, navigate, navState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let updated = { ...prev, [name]: value };
      if (name === "price" || name === "discount") {
        const originalPrice = name === "price" ? Number(value) : Number(updated.price);
        const discountPercent = name === "discount" ? Number(value) : Number(updated.discount);
        const discountAmount = (discountPercent / 100) * originalPrice;
        updated.discountedPrice = Math.max(originalPrice - discountAmount, 0);
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return toastUtil.error("Product name is required");
    if (!formData.category) return toastUtil.error("Please select a category");
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    setIsLoading(true);

    try {
      if (isEditMode) {
        await axios.put(`${productUrl.updateProduct}/${id}`, formData);
        toastUtil.success("Product updated successfully");
      } else {
        await axios.post(productUrl.createProduct, formData);
        toastUtil.success("Product created successfully");
      }

      await queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      toastUtil.error(err.response?.data?.message || "Failed to save product");
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 min-h-screen p-6 animate-in fade-in duration-500 bg-[#f8fafc]/50">
      <header className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Button
               variant="ghost"
               size="icon"
               className="rounded-full bg-white shadow-sm border"
               onClick={() => navigate("/admin/products")}
            >
               <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
               {isEditMode ? "Edit Product Details" : "Add New Product"}
            </h1>
         </div>
      </header>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-slate-100 shadow-sm">
              <CardHeader className="border-b bg-slate-50/30">
                <CardTitle className="text-lg font-bold">Product Information</CardTitle>
                <CardDescription>Primary details and categorization.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" name="name" required value={formData.name} onChange={handleChange} icon={Package} placeholder="e.g. Paracetamol 500mg" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="grid gap-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Input id="unit" name="unit" required value={formData.unit} onChange={handleChange} placeholder="e.g. 10 Tablets" />
                   </div>
                   <div className="grid gap-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input id="brand" name="brand" required value={formData.brand} onChange={handleChange} placeholder="e.g. Cipla" />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU Code</Label>
                    <Input id="sku" name="sku" required value={formData.sku} onChange={handleChange} icon={Tag} placeholder="SKU-001" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      name="category"
                      required
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id || cat.id} value={cat._id || cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Product Description</Label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    className="flex min-h-[120px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="Describe the product effects, dosage, etc."
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-slate-100 shadow-sm">
               <CardHeader className="border-b bg-slate-50/30">
                  <CardTitle className="text-lg font-bold">Pricing & Stock</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4 pt-6">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Original Price (₹)</Label>
                    <Input id="price" type="number" name="price" required value={formData.price} onChange={handleChange} icon={IndianRupee} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input id="discount" type="number" name="discount" value={formData.discount} onChange={handleChange} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Discounted Price</Label>
                    <Input value={formData.discountedPrice} disabled className="bg-slate-50 text-slate-500 font-bold" />
                  </div>
                  <div className="grid gap-2 pt-2">
                    <Label htmlFor="stock">Available Stock</Label>
                    <Input id="stock" type="number" name="stock" required value={formData.stock} onChange={handleChange} icon={Box} />
                  </div>
                  <div className="grid gap-2 pt-2">
                    <Label htmlFor="status">Listing Status</Label>
                    <select
                      id="status"
                      name="status"
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="out_of_stock">Out of Stock</option>
                    </select>
                  </div>
               </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black h-12 shadow-xl shadow-emerald-200 transition-all active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-5 w-5" />}
              {isEditMode ? "Save Changes" : "Create Product"}
            </Button>
          </div>
        </div>
      </form>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirm}
        title={isEditMode ? "Update Product" : "Create Product"}
        message={`Save the following changes to this product?`}
        confirmText={isEditMode ? "Update" : "Create"}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProductForm;
