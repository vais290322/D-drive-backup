import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CategoryCard } from "@/components/CategoryCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

// Using existing images from assets
import drillImage from "@assets/generated_images/Power_drill_product_image_e34c8df1.png";
import helmetImage from "@assets/generated_images/Safety_helmet_product_image_ec212843.png";
import tapeImage from "@assets/generated_images/Measuring_tape_product_image_358d68f0.png";
import glovesImage from "@assets/generated_images/Work_gloves_product_image_a755787c.png";
import toolboxImage from "@assets/generated_images/Toolbox_product_image_73fdb47c.png";
import screwdriverImage from "@assets/generated_images/Screwdriver_set_product_image_5ca5cdd1.png";
import { useParams } from "wouter";
import axios from "axios";
import summaryApi from "@/common/api";
import { toast } from "sonner";

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState("");
  const params = useParams();
  // console.log("Category ID from URL:", params.categoryID);

  const [subCategories, setSubCategories] = useState<any[]>([]);
 
  const allCategories = [
    { id: "1", name: "Power Tools", image: drillImage, productCount: 45 },
    { id: "2", name: "Safety Equipment", image: helmetImage, productCount: 38 },
    { id: "3", name: "Hand Tools", image: screwdriverImage, productCount: 67 },
    { id: "4", name: "Tool Storage", image: toolboxImage, productCount: 23 },
    { id: "5", name: "Protective Gear", image: glovesImage, productCount: 34 },
    { id: "6", name: "Measuring Tools", image: tapeImage, productCount: 29 },
    { id: "7", name: "Electrical Tools", image: drillImage, productCount: 31 },
    { id: "8", name: "Plumbing Tools", image: screwdriverImage, productCount: 22 },
    { id: "9", name: "Welding Equipment", image: helmetImage, productCount: 18 },
    { id: "10", name: "Gardening Tools", image: glovesImage, productCount: 27 },
    { id: "11", name: "Automotive Tools", image: toolboxImage, productCount: 41 },
    { id: "12", name: "Painting Supplies", image: tapeImage, productCount: 15 },
  ];

  // Filter categories based on search term
  const filteredCategories = subCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

    useEffect(() => {
      if (params.categoryID) {
        fetchSubCategories(params.categoryID);
      }
    }, [params.categoryID]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartItemCount={0} isLoggedIn={false} />
      
      <main className="flex-1">
        <section className="bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">
                Shop by Category
              </h1>
              <p className="text-xl text-muted-foreground">
                Browse our wide range of engineering tools and equipment
              </p>
            </div>
            
            <div className="max-w-md mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search categories..."
                  className="w-full pl-10 py-6 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCategories.map((category) => (
                  <CategoryCard key={category.id} {...category} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No categories found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search term
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