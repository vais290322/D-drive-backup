import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/db/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const productSchema = z.object({
  category: z.string().min(1, "Category is required"),
  brand: z.string().optional(),
  model: z.string().optional(),
  serial_number: z.string().optional(),
  imei_1: z.string().optional(),
  imei_2: z.string().optional(),
  color: z.string().optional(),
  ram_rom: z.string().optional(),
  purchase_price: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: "",
      brand: "",
      model: "",
      serial_number: "",
      imei_1: "",
      imei_2: "",
      color: "",
      ram_rom: "",
      purchase_price: "",
    },
  });

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    try {
      setInitialLoading(true);
      const product = await api.products.get(id);
      if (product) {
        form.reset({
          category: product.category,
          brand: product.brand || "",
          model: product.model || "",
          serial_number: product.serial_number || "",
          imei_1: product.imei_1 || "",
          imei_2: product.imei_2 || "",
          color: product.color || "",
          ram_rom: product.ram_rom || "",
          purchase_price: product.purchase_price?.toString() || "",
        });
      }
    } catch (error) {
      console.error("Error loading product:", error);
      toast.error("Failed to load product");
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);
      if (id) {
        await api.products.update(id, {
          category: data.category as "mobile" | "laptop" | "tv" | "vehicle" | "others",
          brand: data.brand || null,
          model: data.model || null,
          serial_number: data.serial_number || null,
          imei_1: data.imei_1 || null,
          imei_2: data.imei_2 || null,
          color: data.color || null,
          ram_rom: data.ram_rom || null,
          purchase_price: data.purchase_price ? Number(data.purchase_price) : null,
        });
        toast.success("Product updated successfully");
      } else {
        await api.products.create({
          category: data.category as "mobile" | "laptop" | "tv" | "vehicle" | "others",
          brand: data.brand || null,
          model: data.model || null,
          serial_number: data.serial_number || null,
          imei_1: data.imei_1 || null,
          imei_2: data.imei_2 || null,
          color: data.color || null,
          ram_rom: data.ram_rom || null,
          purchase_price: data.purchase_price ? Number(data.purchase_price) : null,
          invoice_url: null,
          photo_url: null,
          status: "available",
          created_by: null,
        });
        toast.success("Product created successfully");
      }
      navigate("/products");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 bg-muted" />
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 bg-muted" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={`skeleton-${i}`} className="h-10 w-full bg-muted" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/products")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {id ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-muted-foreground">
            {id ? "Update product information" : "Register a new product"}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="laptop">Laptop</SelectItem>
                        <SelectItem value="tv">TV</SelectItem>
                        <SelectItem value="vehicle">Vehicle</SelectItem>
                        <SelectItem value="others">Others</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter brand name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter model" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serial_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter serial number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imei_1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IMEI 1</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter IMEI 1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imei_2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IMEI 2</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter IMEI 2" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter color" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ram_rom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RAM/ROM</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 8GB/128GB" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchase_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Purchase Price</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" placeholder="Enter price" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/products")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Product"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
