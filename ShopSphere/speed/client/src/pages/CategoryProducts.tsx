import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { useParams } from "wouter";
import { useEffect, useState } from "react";
import axios from "axios";
import summaryApi from "@/common/api";

// Define product type
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  description: string;
}

// Category mapping for display names
const categoryNames: Record<string, string> = {
  "power-tools": "Power Tools",
  "safety-equipment": "Safety Equipment",
  "hand-tools": "Hand Tools",
  "tool-storage": "Tool Storage",
  "protective-gear": "Protective Gear",
  "measuring-tools": "Measuring Tools",
};

export default function CategoryProducts() {
  const params = useParams();
  const categoryId = params.categoryId as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("featured");

  const fetchProductsBySubCategory = async (subCategoryId: string) => {
    try {
      const response = await axios.get(
        `${summaryApi.productsBySubCategory}/${subCategoryId}`
      );
      // console.log("Fetched products by subcategory :", response.data);
      if (response?.data?.success) {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProductsBySubCategory(categoryId);
  }, [categoryId]);


  useEffect(() => {
    // Filter products based on search term
    let result: Product[] = [...products];

    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products based on sort option
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // "featured" - keep original order
        break;
    }

    setFilteredProducts(result);
  }, [searchTerm, sortOption, products]);

  const categoryName = categoryNames[categoryId] || "Category";

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={3} isLoggedIn={false} />

      <main className="flex-1">
        <section className="bg-muted/30 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold font-heading">
                  {categoryName}
                </h1>
                <p className="text-muted-foreground">
                  {filteredProducts.length} products found
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-full sm:w-40">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="sm:hidden">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
