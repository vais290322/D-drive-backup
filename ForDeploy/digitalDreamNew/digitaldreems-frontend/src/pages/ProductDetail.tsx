import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/db/api";
import type { Product } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            loadProduct();
        }
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            const data = await api.products.get(id!);
            setProduct(data);
        } catch (error) {
            console.error("Error loading product:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, "default" | "secondary" | "destructive"> = {
            available: "default",
            assigned: "secondary",
            sold: "destructive",
        };
        return (
            <Badge variant={variants[status] || "secondary"} className="text-sm">
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
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex h-96 items-center justify-center">
                <p className="text-muted-foreground">Product not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => navigate("/products")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Product Details</h1>
                        <p className="text-muted-foreground">View product information</p>
                    </div>
                </div>
                <Button onClick={() => navigate(`/products/${id}/edit`)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Product
                </Button>
            </div>

            {/* Product Information Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Product Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Product Code */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Product Code</label>
                            <p className="mt-1 text-lg font-semibold">{product.product_code}</p>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Category</label>
                            <p className="mt-1 text-lg capitalize">{product.category}</p>
                        </div>

                        {/* Brand */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Brand</label>
                            <p className="mt-1 text-lg">{product.brand || "-"}</p>
                        </div>

                        {/* Model */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Model</label>
                            <p className="mt-1 text-lg">{product.model || "-"}</p>
                        </div>

                        {/* Serial Number */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Serial Number</label>
                            <p className="mt-1 text-lg">{product.serial_number || "-"}</p>
                        </div>

                        {/* Color */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Color</label>
                            <p className="mt-1 text-lg">{product.color || "-"}</p>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Status</label>
                            <div className="mt-1">{getStatusBadge(product.status)}</div>
                        </div>

                        {/* Purchase Price */}
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Purchase Price</label>
                            <p className="mt-1 text-lg font-semibold text-primary">
                                {formatCurrency(product.purchase_price)}
                            </p>
                        </div>

                        {/* Market Value */}
                        {product.market_value && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Market Value</label>
                                <p className="mt-1 text-lg font-semibold">
                                    {formatCurrency(product.market_value)}
                                </p>
                            </div>
                        )}

                        {/* Description */}
                        {product.description && (
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-muted-foreground">Description</label>
                                <p className="mt-1 text-base whitespace-pre-wrap">{product.description}</p>
                            </div>
                        )}

                        {/* Specifications */}
                        {product.specifications && (
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-muted-foreground">Specifications</label>
                                <p className="mt-1 text-base whitespace-pre-wrap">{product.specifications}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Assignment Information (if assigned) */}
            {product.status === "assigned" && product.assigned_to && (
                <Card>
                    <CardHeader>
                        <CardTitle>Assignment Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                                <p className="mt-1 text-lg">{product.assigned_to}</p>
                            </div>
                            {product.assigned_date && (
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Assigned Date</label>
                                    <p className="mt-1 text-lg">
                                        {new Date(product.assigned_date).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Metadata */}
            <Card>
                <CardHeader>
                    <CardTitle>Record Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Created At</label>
                            <p className="mt-1 text-base">
                                {new Date(product.created_at).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                            <p className="mt-1 text-base">
                                {new Date(product.updated_at).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
