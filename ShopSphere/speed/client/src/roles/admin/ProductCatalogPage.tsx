import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit, Trash2, Eye, Plus, Box, View } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import summaryApi from "@/common/api";

export default function ProductCatalogPage() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [imageFiles, setImageFiles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state: any) => state?.user.token);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [viewingProduct, setViewingProduct] = useState(null);

  // ---------------- Fetch Functions ----------------
  const fetchProducts = async () => {
    try {
      const response = await axios.get(summaryApi.addProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch {
      toast.error("Failed to fetch products");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(summaryApi.addCategory, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    try {
      const response = await axios.get(
        `${summaryApi.addSubCategory}?categoryId=${categoryId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        setSelectedSubCategories(response.data.data);
      }
    } catch {
      toast.error("Failed to fetch subcategories");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ---------------- Form Handlers ----------------
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    fetchSubCategories(categoryId);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const productData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: parseFloat(formData.get("price")),
      discountPrice: parseFloat(formData.get("discountPrice")),
      stockQuantity: parseInt(formData.get("stockQuantity")),
      openingStock: parseInt(formData.get("openingStock")),
      active: formData.get("active") === "on",
      sku: formData.get("sku"),
      brand: formData.get("brand"),
      categoryId: selectedCategory,
      subCategoryId: formData.get("subCategory"),
      rating: parseFloat(formData.get("rating")),
      reviewCount: parseInt(formData.get("reviewCount")),
      weight: parseFloat(formData.get("weight")),
      dimensions: formData.get("dimensions"),
    };

    const uploadData = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      uploadData.append(key, value ?? "");
    });

    if (imageFiles) {
      Array.from(imageFiles).forEach((file) => {
        uploadData.append("images", file);
      });
    }

    try {
      setIsLoading(true);
      const url = editingProduct
        ? `${summaryApi.addProduct}/${editingProduct.id}`
        : summaryApi.addProduct;
      const method = editingProduct ? "put" : "post";

      const response = await axios[method](url, uploadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success(
          editingProduct
            ? "Product updated successfully!"
            : "Product added successfully!"
        );
        fetchProducts();
        setIsDialogOpen(false);
        setEditingProduct(null);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setSelectedCategory(product.categoryId || "");
    if (product.categoryId) fetchSubCategories(product.categoryId);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await axios.delete(`${summaryApi.addProduct}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted");
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "All" || product.categoryId === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleViewProduct = (product) => {
    setViewingProduct(product);
  };

  // Add pagination utils
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    itemsPerPage,
    onItemsPerPageChange,
  }: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    itemsPerPage: number;
    onItemsPerPageChange: (value: number) => void;
  }) => {
    return (
      <div className="flex items-center justify-between px-2 py-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Items per page:</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent>
              {[1, 5, 10, 20, 50].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    );
  };

  const ProductViewDialog = ({
    product,
    isOpen,
    onClose,
    categories,
    subCategories,
  }) => {
    if (!product) return null;

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {product.name}
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Images Section */}
            <div className="space-y-4">
              <h3 className="font-semibold">Product Images</h3>
              <div className="grid grid-cols-2 gap-2">
                {product.images?.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="col-span-2">
                  <h3 className="font-semibold">Description</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Price</h3>
                  <p className="text-muted-foreground">₹{product.price}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Discount Price</h3>
                  <p className="text-muted-foreground">
                    ₹{product.discountPrice}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Stock</h3>
                  <p className="text-muted-foreground">
                    {product.stockQuantity}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Opening Stock</h3>
                  <p className="text-muted-foreground">
                    {product.openingStock}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">SKU</h3>
                  <p className="text-muted-foreground">{product.sku}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Brand</h3>
                  <p className="text-muted-foreground">{product.brand}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Category</h3>
                  <p className="text-muted-foreground">
                    {categories.find((c) => c.id === product.categoryId)
                      ?.name || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Sub Category</h3>
                  <p className="text-muted-foreground">
                    {subCategories.find((s) => s.id === product.subCategoryId)
                      ?.name || "N/A"}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Rating</h3>
                  <p className="text-muted-foreground">
                    {product.rating} ⭐ ({product.reviewCount} reviews)
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Status</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold">Weight</h3>
                  <p className="text-muted-foreground">{product.weight} kg</p>
                </div>

                <div>
                  <h3 className="font-semibold">Dimensions</h3>
                  <p className="text-muted-foreground">{product.dimensions}</p>
                </div>

                <div>
                  <h3 className="font-semibold">Created At</h3>
                  <p className="text-muted-foreground">
                    {new Date(product.createdAt).toLocaleString()}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold">Updated At</h3>
                  <p className="text-muted-foreground">
                    {new Date(product.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // ---------------- Render ----------------
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="hidden md:block">
          <AdminSidebar activeSection="products" />
        </div>

        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">
                  Product Catalog
                </h1>
                <p className="text-muted-foreground">
                  Manage products and inventory
                </p>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-4 w-40"
                />

                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingProduct(null)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct ? "Edit Product" : "Add New Product"}
                      </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            name="name"
                            defaultValue={editingProduct?.name}
                            required
                          />
                        </div>
                        <div>
                          <Label>SKU</Label>
                          <Input
                            name="sku"
                            defaultValue={editingProduct?.sku}
                            required
                          />
                        </div>
                        <div>
                          <Label>Brand</Label>
                          <Input
                            name="brand"
                            defaultValue={editingProduct?.brand}
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Input
                            name="description"
                            defaultValue={editingProduct?.description}
                          />
                        </div>
                        <div>
                          <Label>Price</Label>
                          <Input
                            name="price"
                            type="number"
                            defaultValue={editingProduct?.price}
                            required
                          />
                        </div>
                        <div>
                          <Label>Discount Price</Label>
                          <Input
                            name="discountPrice"
                            type="number"
                            defaultValue={editingProduct?.discountPrice}
                          />
                        </div>
                        <div>
                          <Label>Stock Quantity</Label>
                          <Input
                            name="stockQuantity"
                            type="number"
                            defaultValue={editingProduct?.stockQuantity}
                          />
                        </div>
                        <div>
                          <Label>Opening Stock</Label>
                          <Input
                            name="openingStock"
                            type="number"
                            defaultValue={editingProduct?.openingStock}
                          />
                        </div>
                        <div>
                          <Label>Weight (kg)</Label>
                          <Input
                            name="weight"
                            type="number"
                            step="0.01"
                            defaultValue={editingProduct?.weight}
                          />
                        </div>
                        <div>
                          <Label>Dimensions (LxWxH)</Label>
                          <Input
                            name="dimensions"
                            defaultValue={editingProduct?.dimensions}
                          />
                        </div>
                        <div>
                          <Label>Rating</Label>
                          <Input
                            name="rating"
                            type="number"
                            step="0.1"
                            defaultValue={editingProduct?.rating}
                          />
                        </div>
                        <div>
                          <Label>Review Count</Label>
                          <Input
                            name="reviewCount"
                            type="number"
                            defaultValue={editingProduct?.reviewCount}
                          />
                        </div>
                        <div>
                          <Label>Category</Label>
                          <Select
                            value={selectedCategory}
                            onValueChange={handleCategoryChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Sub Category</Label>
                          <Select
                            name="subCategory"
                            defaultValue={editingProduct?.subCategoryId}
                            disabled={!selectedCategory}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Sub Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedSubCategories.map((sub) => (
                                <SelectItem key={sub.id} value={sub.id}>
                                  {sub.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <input
                            id="active"
                            name="active"
                            type="checkbox"
                            defaultChecked={editingProduct?.active}
                          />
                          <Label htmlFor="active">Active</Label>
                        </div>
                        <div className="col-span-2">
                          <Label>Product Images</Label>
                          <Input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => setImageFiles(e.target.files)}
                          />
                        </div>

                        {editingProduct && (
                          <>
                            <div>
                              <Label>Created At</Label>
                              <Input
                                readOnly
                                value={
                                  new Date(
                                    editingProduct.createdAt
                                  ).toLocaleString() || ""
                                }
                              />
                            </div>
                            <div>
                              <Label>Updated At</Label>
                              <Input
                                readOnly
                                value={
                                  new Date(
                                    editingProduct.updatedAt
                                  ).toLocaleString() || ""
                                }
                              />
                            </div>
                          </>
                        )}
                      </div>

                      <DialogFooter>
                        <Button type="submit" disabled={isLoading}>
                          {isLoading ? "Saving..." : "Save Product"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Products</CardTitle>
                <CardDescription>View and manage all products</CardDescription>
              </CardHeader>

              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>S.No.</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((product, index) => (
                      <TableRow key={product.id}>
                        <TableCell>{indexOfFirstItem + index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Box className="h-4 w-4 text-primary" />
                            <span>{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {categories.find((c) => c.id === product.categoryId)
                            ?.name || "N/A"}
                        </TableCell>

                        <TableCell>₹{product.discountPrice}</TableCell>
                        <TableCell>{product.stockQuantity}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              product.active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {product.active ? "Active" : "Inactive"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleViewProduct(product)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0"
                              onClick={() => handleDeleteProduct(product?.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={(value) => {
                  setItemsPerPage(value);
                  setCurrentPage(1); // Reset to first page when changing items per page
                }}
              />
            </Card>
          </div>
        </main>
        <ProductViewDialog
          product={viewingProduct}
          isOpen={!!viewingProduct}
          onClose={() => setViewingProduct(null)}
          categories={categories}
          subCategories={selectedSubCategories}
        />
      </div>
    </div>
  );
}
