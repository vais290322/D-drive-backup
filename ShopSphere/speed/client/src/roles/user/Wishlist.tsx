import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Heart, 
  Search,
  Filter,
  ShoppingCart,
  Share2,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { UserSidebar } from "./UserSidebar";

// Mock product data
const mockProducts = [
  {
    id: "1",
    name: "Professional Power Drill 18V",
    price: 4999,
    originalPrice: 6999,
    image: "drill-image-url",
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
  },
  {
    id: "2",
    name: "Industrial Safety Helmet",
    price: 899,
    originalPrice: 1299,
    image: "helmet-image-url",
    rating: 4.8,
    reviewCount: 95,
    inStock: true,
  },
  {
    id: "3",
    name: "Professional Measuring Tape 10M",
    price: 499,
    originalPrice: 799,
    image: "tape-image-url",
    rating: 4.3,
    reviewCount: 67,
    inStock: true,
  },
  {
    id: "4",
    name: "Heavy Duty Work Gloves",
    price: 349,
    image: "gloves-image-url",
    rating: 4.6,
    reviewCount: 142,
    inStock: true,
  }
];

export default function Wishlist() {
  const [products] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
      default:
        return 0; // Mock products don't have dates, so we keep original order
    }
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header cartItemCount={3} isLoggedIn={true} userName="John Doe" /> */}
      
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="hidden md:block">
          <UserSidebar activeSection="wishlist" />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 bg-muted/30 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold font-heading">My Wishlist</h1>
                <p className="text-muted-foreground">{sortedProducts.length} items in your wishlist</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search wishlist..."
                    className="pl-8 pr-4 py-2 border rounded-md text-sm w-40"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded-md px-3 py-2 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedProducts.map(product => (
                  <Card key={product.id} className="hover-elevate transition-all">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base line-clamp-2 mb-1">
                            {product.name}
                          </CardTitle>
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              ({product.reviewCount})
                            </span>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="p-1 h-auto">
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="bg-muted rounded-lg h-40 mb-4 flex items-center justify-center">
                        <div className="text-muted-foreground">Product Image</div>
                      </div>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-xl font-bold font-heading">
                          ₹{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1" size="sm">
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button variant="outline" size="sm">
                          Buy Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
                  <p className="text-muted-foreground mb-4">
                    Start adding items to your wishlist
                  </p>
                  <Button>Continue Shopping</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>

      {/* <Footer /> */}
    </div>
  );
}