import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ProductCard";
import { CategoryCard } from "@/components/CategoryCard";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

import { useSelector } from "react-redux";
import axios from "axios";
import summaryApi from "@/common/api";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);


  const [categoriId, setCategoryId] = useState<string | null>(null);
  const user = useSelector((state: any) => state.user.user);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(summaryApi.addCategory!);
      if (response.data.success) {
        setCategories(response.data.data || []);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    try {
      const response = await axios.get(
        `${summaryApi.addSubCategory}/${categoryId}`
      );
      if (response.data.success) {
        // Handle sub-categories as needed
        setSubCategories(response.data.data || []);
        // console.log("Sub-categories:", response.data.data);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch subcategories"
      );
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setCategoryId(categoryId);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
  if (categories.length > 0 && !categoriId) {
    setCategoryId(categories[0].id || categories[0]._id);
  }
}, [categories]);

  useEffect(() => {
    if (categoriId) {
      fetchSubCategories(categoriId);
    }
  }, [categoriId]);
  

  // console.log("categoriId in Home component:", categoriId);


  const fetchCategoryWiseProducts = async (categoryId: string) => {
    try {
      const response = await axios.get(
        `${summaryApi.productsByCategory!}/${categoryId}`
      );
      if (response.data.success) {
        // Handle products as needed
        setFeaturedProducts(response.data.data || []);
        // console.log("Products by category:", response.data.data);
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  };

  useEffect(() => {
    if (categoriId) {
      // console.log("fetch product with : ",categoriId)
      fetchCategoryWiseProducts(categoriId);
    }
  }, [categoriId]);





  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={3} isLoggedIn={false} />

      <div className="border-t z-10 fixed top-16 left-0 right-0 bg-background ">
        <div className="container mx-auto px-4">
          <nav className="flex h-12 items-center gap-6 overflow-x-auto">
            {categories.length === 0 ? (
              <span className="text-sm text-muted-foreground">
                No categories available
              </span>
            ) : (
              categories?.map((category) => (
                // <Link
                //   href={`/categories/${category.name
                //     ?.toLowerCase()
                //     .replace(/\s+/g, "-")}`}
                //   key={category._id || category.id}
                // >
                  <p onClick={() => handleCategoryClick(category.id)} className="whitespace-nowrap text-sm font-medium px-2 py-1 rounded-md hover:bg-muted cursor-pointer ">
                    {category.name}
                  </p>
                // </Link>
              ))
            )}

          </nav>
        </div>
      </div>

      <main className="flex-1  z-0">
        <Hero />

        <section className="container mx-auto px-4 py-12 md:py-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold font-heading mb-2">
                Shop by Sub Category
              </h2>
              <p className="text-muted-foreground">
                Browse our wide range of engineering tools and equipment
              </p>
            </div>
            <Button
              variant="ghost"
              className="hidden sm:flex"
              asChild
              data-testid="button-view-all-categories"
            >
              <Link href={`/categories/${categoriId}`}>
                <a className="flex items-center">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {subCategories?.slice(0, 6).map((category) => (
              <CategoryCard key={category.id} {...category} />
            ))}
          </div>
        </section>

        <section className="bg-muted/30 py-12 md:py-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold font-heading mb-2">
                  Featured Products
                </h2>
                <p className="text-muted-foreground">
                  Hand-picked tools with great discounts
                </p>
              </div>
              <Link href={`/all-category-products/${categoriId}`}>
              <Button
                variant="ghost"
                className="hidden sm:flex"
                data-testid="button-view-all-products"
              >
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
               </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {featuredProducts?.slice(0, 8).map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-12 md:py-20 ">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold font-heading mb-2">
                Cash on Delivery
              </h3>
              <p className="text-sm text-muted-foreground">
                Pay when you receive your order. No online payment required.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold font-heading mb-2">
                Fast Local Delivery
              </h3>
              <p className="text-sm text-muted-foreground">
                Same-day delivery within 5km radius from our store.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                <svg
                  className="h-8 w-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold font-heading mb-2">
                Loyalty Rewards
              </h3>
              <p className="text-sm text-muted-foreground">
                Earn points on every purchase and redeem them for discounts.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
