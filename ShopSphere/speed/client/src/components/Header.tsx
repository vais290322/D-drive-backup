import { ShoppingCart, User, Menu, Search, Heart, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./ThemeToggle";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import axios from "axios";
import summaryApi from "@/common/api";
import { toast } from "sonner";
import { navigate } from "wouter/use-browser-location";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/store/userSlice";

interface HeaderProps {
  cartItemCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
}

export function Header({
  cartItemCount = 0,
  isLoggedIn = false,
  userName,
}: HeaderProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [location, setLocation] = useLocation();
  const dispatch = useDispatch();

  const [cartItems, setCartItems] = useState<any[]>([]);

  const user = useSelector((state: any) => state.user);
  // console.log("Header user from redux:", user);

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

  useEffect(() => {
    fetchCategories();
    fetchCartItems();
  }, []);

  const logout = async () => {
    const response = await axios.post(
      `${summaryApi?.logout}`,
      {},
      {
        withCredentials: true,
      }
    );

    if (response?.data?.success) {
      toast.success(response?.data?.message || "Logout successful!");
      dispatch(clearUser());
      setLocation("/");
    }
  };

  const fetchCartItems = async () => {
    try {
      if (user?.user) {
        const response = await axios.get(
          `${summaryApi.fetchCart}/${user.user.id}`
        );
        if (response?.data?.success) {
          setCartItems(response.data.data || []);
        }
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to fetch cart items"
      );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left side logo/menu */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/">
              <a className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <span className="text-lg font-bold font-heading">S</span>
                </div>
                <span className="hidden text-xl font-bold font-heading sm:inline-block">
                  Sppeeds
                </span>
              </a>
            </Link>
          </div>

          {/* Search bar */}
          <div className="hidden flex-1 max-w-xl md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products, categories..."
                className="w-full pl-10"
              />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="sm:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>

            {/* Cart Button with badge */}
            {user?.user && (
              <div className="relative" onClick={() => navigate("/cart")}>
                {cartItems?.items?.length > 0 && (
                  <div className="absolute z-10 -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-semibold">
                    {cartItems?.items?.length || 0}
                  </div>
                )}
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-6 w-6" />
                </Button>
              </div>
            )}

            {/* Login/Profile */}
            {user?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="flex items-center cursor-pointer"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="default" size="sm">
                  Login
                </Button>
              </Link>
            )}

            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Category navigation bar */}
      {/* <div className="border-t">
        <div className="container mx-auto px-4">
          <nav className="flex h-12 items-center gap-6 overflow-x-auto">
            {categories.length === 0 ? (
              <span className="text-sm text-muted-foreground">
                No categories available
              </span>
            ) : (
              categories.map((category) => (
                <Link
                  href={`/categories/${category.name
                    ?.toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  key={category._id || category.id}
                >
                  <a className="whitespace-nowrap text-sm font-medium px-2 py-1 rounded-md hover:bg-muted">
                    {category.name}
                  </a>
                </Link>
              ))
            )}

          </nav>
        </div>
      </div> */}
    </header>
  );
}
