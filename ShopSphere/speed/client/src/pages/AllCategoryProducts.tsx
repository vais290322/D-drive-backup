import summaryApi from "@/common/api";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProductCard } from "@/components/ProductCard";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useParams } from "wouter";

const AllCategoryProducts = () => {
  const categoryId = useParams().categoryID;

  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  // console.log("Category ID in AllCategoryProducts:", categoryId);

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
      toast.error(error.response?.data?.message || "Failed to fetch products");
    }
  };

  useEffect(() => {
    if (categoryId) {
      // console.log("fetch product with : ",categoriId)
      fetchCategoryWiseProducts(categoryId);
    }
  }, [categoryId]);

  return (
    <div>
      <Header cartItemCount={0} isLoggedIn={false} />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Products in this category</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {featuredProducts?.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AllCategoryProducts;
