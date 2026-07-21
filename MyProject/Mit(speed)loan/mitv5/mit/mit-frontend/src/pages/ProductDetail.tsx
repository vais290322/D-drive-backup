
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { api, deleteProduct } from "@/db/api";
import type { Product } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Edit, Trash2, ArrowLeft, Calendar, Tag, Smartphone, Laptop, Tv, Bike } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (id) {
            loadProduct(id);
        }
    }, [id]);

    const loadProduct = async (productId: string) => {
        try {
            setLoading(true);
            const data = await api.products.get(productId);
            if (data) {
                setProduct(data);
            } else {
                toast.error("Product not found");
                navigate("/products");
            }
        } catch (error) {
            console.error("Error loading product:", error);
            toast.error("Failed to load product details");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!product) return;
        try {
            setDeleting(true);
            const result = await deleteProduct(product.id);
            if (result.success) {
                toast.success(result.message);
                navigate("/products");
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Failed to delete product");
        } finally {
            setDeleting(false);
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case "mobile": return <Smartphone className="h-6 w-6" />;
            case "laptop": return <Laptop className="h-6 w-6" />;
            case "tv": return <Tv className="h-6 w-6" />;
            case "vehicle": return <Bike className="h-6 w-6" />;
            default: return <Tag className="h-6 w-6" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive"> = {
            available: "default",
            assigned: "secondary",
            sold: "destructive",
        };
        return (
            <Badge variant={variants[status] || "secondary"} className="text-sm px-3 py-1">
                {status.toUpperCase()}
            </Badge>
        );
    };

    const formatCurrency = (amount: number | null) => {
        if (!amount) return "-";
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <Card>
                    <CardContent className="p-8">
                        <div className="space-y-4">
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                            <Skeleton className="h-8 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/products")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-3">
                            {product.brand} {product.model}
                        </h1>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                            <span className="font-mono bg-muted px-2 py-0.5 rounded text-sm">{product.product_code}</span>
                            <span>•</span>
                            <span className="capitalize">{product.category}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => navigate(`/products/${product.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Product Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-full text-primary">
                                    {getCategoryIcon(product.category)}
                                </div>
                                <span className="font-medium">Status</span>
                            </div>
                            {getStatusBadge(product.status)}
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground">Purchase Price</span>
                                <p className="text-xl font-bold">{formatCurrency(product.purchase_price)}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground">Created At</span>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">
                                        {product.created_at ? format(new Date(product.created_at), "PPP") : "-"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground">Color</span>
                                    <p className="font-medium">{product.color || "-"}</p>
                                </div>
                                <div className="space-y-1 col-span-2">
                                    <span className="text-sm text-muted-foreground">Serial Number</span>
                                    <p className="font-mono text-sm">{product.serial_number || "-"}</p>
                                </div>
                            </div>

                            {(product.imei_1 || product.imei_2) && (
                                <div className="grid grid-cols-1 gap-4">
                                    {product.imei_1 && (
                                        <div className="space-y-1">
                                            <span className="text-sm text-muted-foreground">IMEI 1</span>
                                            <p className="font-mono text-sm">{product.imei_1}</p>
                                        </div>
                                    )}
                                    {product.imei_2 && (
                                        <div className="space-y-1">
                                            <span className="text-sm text-muted-foreground">IMEI 2</span>
                                            <p className="font-mono text-sm">{product.imei_2}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {product.ram_rom && (
                                <div className="space-y-1">
                                    <span className="text-sm text-muted-foreground">RAM / Storage</span>
                                    <p className="font-medium">{product.ram_rom}</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>System Information</CardTitle>
                        <CardDescription>Metadata and tracking information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <span className="text-sm text-muted-foreground">Product ID</span>
                            <p className="font-mono text-xs bg-muted p-2 rounded">{product.id}</p>
                        </div>
                        {product.created_by && (
                            <div className="space-y-1">
                                <span className="text-sm text-muted-foreground">Added By</span>
                                <p className="font-medium">{(product.created_by as any).full_name || product.created_by}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Product</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete product "{product.product_code}"? This action cannot be undone.
                            <span className="block mt-2 text-muted-foreground">
                                This product will be removed from the system. Deletion will be prevented if there are active loans using this product.
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? "Deleting..." : "Delete Product"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
