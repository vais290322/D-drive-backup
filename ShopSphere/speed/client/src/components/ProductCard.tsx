import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Phone, ShoppingCart, Eye, Heart } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { navigate } from "wouter/use-browser-location";
import { useContext, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import summaryApi from "@/common/api";
import { toast } from "sonner";
import Context from "@/context";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string;
  rating?: number;
  reviewCount?: number;
  inStock?: boolean;
  description?: string;
}

export function ProductCard({
  id,
  name,
  price,
  discountPrice,
  images,
  rating = 4.5,
  reviewCount = 0,
  inStock = true,
  description,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const discount = discountPrice
    ? Math.round(((price - discountPrice) / discountPrice) * 100)
    : 0;

  const user = useSelector((state: any) => state.user);
  //  const { fetchUserAddToCart } = useContext(Context)
  // console.log("user from product card : ", user);

  // console.log("ProductCard data:", price, discountPrice,discount);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      if (!user || !user.user) {
        navigate("/auth");
        return;
      } else {
        const response = await axios.post(
          `${summaryApi.addCart}/${user.user.id}/${id}`
        );
        if (response?.data?.success) {
          toast.success("Product added to cart");
          
          // fetchUserAddToCart();
        } else {
          toast.error("Failed to add product to cart");
        }
      }
    } catch (error) {
      toast.error("Failed to add product to cart");
    }

    // console.log("Add to cart clicked for product:", id);
    // Add your cart logic here
  };

  const handleOrderOnline = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Order online clicked for product:", id);
    // Add your order online logic here
  };

  const handleOrderByCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = "tel:+1234567890";
  };

  const handleOrderOnWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = encodeURIComponent(`Hi, I'm interested in ${name}`);
    window.open(`https://wa.me/1234567890?text=${message}`, "_blank");
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/product-details/${id}`);
  };

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const savings = Math.max(0, price - (discountPrice ?? price));
  const formattedSavings = `₹${savings.toLocaleString("en-IN")}`;

  return (
    <Card
      className="group overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 shadow-md bg-white"
      onClick={handleQuickView}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Image */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-3 border-gray-200 border-t-gray-600 rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={images[0]}
          alt={name}
          className={`h-full w-full object-cover transition-all duration-500 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          } group-hover:scale-110`}
          onLoad={() => setImageLoaded(true)}
          data-testid={`img-product-${id}`}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <Badge
              className="bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg px-2.5 py-1"
              data-testid={`badge-discount-${id}`}
            >
              {discount}% OFF
            </Badge>
          )}
          {!inStock && (
            <Badge
              className="bg-gray-800 hover:bg-gray-900 text-white font-bold shadow-lg px-2.5 py-1"
              data-testid={`badge-stock-${id}`}
            >
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Wishlist and Cart buttons - Top Right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {/* Wishlist button */}
          <button
            onClick={toggleWishlist}
            className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
            title="Add to Wishlist"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"
              }`}
            />
          </button>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            className={`bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white transition-all hover:scale-110 ${
              !inStock ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title="Add to Cart"
          >
            <ShoppingCart className="h-4 w-4 text-gray-700" />
          </button>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Product name */}
        <h3
          className="font-semibold text-base line-clamp-2 min-h-[3rem] text-gray-900 group-hover:text-green-600 transition-colors"
          data-testid={`text-product-name-${id}`}
        >
          {name}
        </h3>

        {/* Description */}
        {description && (
          <p
            className="text-sm text-gray-600 line-clamp-2"
            data-testid={`text-description-${id}`}
          >
            {description}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {/* {rating ? rating : "0.0"} */}
          </span>
          <span
            className="text-xs text-gray-500"
            data-testid={`text-reviews-${id}`}
          >
            ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 pt-2">
          <span
            className="text-2xl font-bold text-gray-900"
            data-testid={`text-price-${id}`}
          >
            ₹{discountPrice?.toLocaleString()}
          </span>
          {discountPrice && (
            <div className="flex flex-col">
              <span
                className="text-sm text-gray-500 line-through"
                data-testid={`text-original-price-${id}`}
              >
                ₹{price.toLocaleString()}
              </span>
              <p
                className="text-sm font-semibold text-green-600 "
                title={`Save ${formattedSavings}`}
              >
                Save ₹{(price - discountPrice).toLocaleString()}
              </p>
              {/* <span
                className="text-sm font-semibold text-green-600 truncate max-w-[10rem] sm:max-w-[12rem] text-wrap"
                title={`Save ${formattedSavings}`}
              >
                Save {formattedSavings}
              </span> */}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        {/* Order Online Button - Primary */}
        <Button
          className="w-full h-11 font-semibold shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02]"
          disabled={!inStock}
          onClick={handleOrderOnline}
          data-testid={`button-order-online-${id}`}
        >
          {inStock ? "Order Online" : "Out of Stock"}
        </Button>

        {/* Secondary actions in grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-10 border-2 hover:bg-gray-50 font-medium"
            onClick={handleOrderByCall}
            data-testid={`button-order-call-${id}`}
          >
            <Phone className="mr-1.5 h-3.5 w-3.5" />
            <span className="hidden sm:inline">Call</span>
            <span className="sm:hidden">Call</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-10 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border-[#25D366]/30 border-2 font-medium"
            onClick={handleOrderOnWhatsApp}
            data-testid={`button-order-whatsapp-${id}`}
          >
            <SiWhatsapp className="mr-1 h-3.5 w-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
            <span className="sm:hidden">Chat</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
