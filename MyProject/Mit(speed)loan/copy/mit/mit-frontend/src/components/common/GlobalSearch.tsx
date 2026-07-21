import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { api } from "@/db/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, Package, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SearchResult {
  type: "customer" | "product" | "loan";
  id: string;
  title: string;
  subtitle: string;
  code: string;
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const debounce = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const searchResults: SearchResult[] = [];

      const [customers, products, loans] = await Promise.all([
        api.customers.search(query),
        api.products.search(query),
        api.loans.search(query),
      ]);

      customers.forEach((customer) => {
        searchResults.push({
          type: "customer",
          id: customer.id,
          title: customer.full_name,
          subtitle: customer.mobile_primary,
          code: customer.customer_code,
        });
      });

      products.forEach((product) => {
        searchResults.push({
          type: "product",
          id: product.id,
          title: `${product.brand || ""} ${product.model || ""}`.trim() || "Product",
          subtitle: product.category,
          code: product.product_code,
        });
      });

      // Fetch customer data for loans
      for (const loan of loans) {
        let customerName = "Unknown Customer";
        if (loan.customer_id) {
          try {
            const customer = await api.customers.get(loan.customer_id);
            if (customer) {
              customerName = customer.full_name || customerName;
            }
          } catch (error) {
            console.error("Error fetching customer:", error);
          }
        }
        
        searchResults.push({
          type: "loan",
          id: loan.id,
          title: loan.loan_id,
          subtitle: customerName,
          code: loan.loan_id,
        });
      }

      setResults(searchResults);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setOpen(false);
    setQuery("");
    setResults([]);

    switch (result.type) {
      case "customer":
        navigate(`/customers/${result.id}`);
        break;
      case "product":
        navigate(`/products`);
        break;
      case "loan":
        navigate(`/loans/${result.id}`);
        break;
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "customer":
        return <User className="h-4 w-4" />;
      case "product":
        return <Package className="h-4 w-4" />;
      case "loan":
        return <FileText className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      customer: "default",
      product: "secondary",
      loan: "outline",
    };
    return (
      <Badge variant={variants[type] || "default"} className="capitalize">
        {type}
      </Badge>
    );
  };

  return (
    <>
      <Button
        variant="outline"
        className="hidden w-64 justify-start text-muted-foreground md:flex"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search...
        <kbd className="pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers, products, loans..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
                autoFocus
              />
              {loading && (
                <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>

            {query.length > 0 && query.length < 2 && (
              <p className="text-center text-sm text-muted-foreground">
                Type at least 2 characters to search
              </p>
            )}

            {query.length >= 2 && results.length === 0 && !loading && (
              <p className="text-center text-sm text-muted-foreground">
                No results found
              </p>
            )}

            {results.length > 0 && (
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {results.map((result) => (
                  <button
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {getIcon(result.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{result.title}</p>
                        {getTypeBadge(result.type)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {result.subtitle}
                      </p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result.code}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

