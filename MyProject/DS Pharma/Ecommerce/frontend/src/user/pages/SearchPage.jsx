import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SlidersHorizontal, X, ArrowLeft } from "lucide-react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import searchService from "@/services/api/searchService";
import useDebounce from "@/shared/hooks/useDebounce";
import SearchResults from "@/user/components/search/SearchResults";
import {
  SearchFilters,
  SortDropdown,
} from "@/user/components/search/SearchFilters";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [facets, setFacets] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Parse URL params
  const query = searchParams.get("query") || "";
  const sort = searchParams.get("sort") || "relevance";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [filters, setFilters] = useState({
    categories: searchParams.getAll("category"),
    priceRangeStr: "all",
    inStock: searchParams.get("instock") === "true",
    isFeatured: searchParams.get("featured") === "true",
    priceRange:
      searchParams.get("minPrice") && searchParams.get("maxPrice")
        ? [
            Number(searchParams.get("minPrice")),
            Number(searchParams.get("maxPrice")),
          ]
        : null,
  });

  // Temporary filters state for mobile drawer
  const [tempFilters, setTempFilters] = useState(filters);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const fetchResults = async () => {
      // Don't set loading to true for rapid typing - keep existing results visible
      if (debouncedQuery !== query) {
        setIsLoading(true);
      }

      try {
        const response = await searchService.searchProducts({
          query: debouncedQuery,
          filters,
          sort,
          page,
          limit: 50,
        });

        // Atomic state update to prevent flickering
        setProducts((prevProducts) => {
          const newProducts = response?.data?.products || [];
          // Only update if the response is for the current query to avoid race conditions
          return newProducts;
        });

        setFacets({
          ...(response?.data?.facets || {}),
          pagination: response?.data?.pagination,
        });
      } catch (error) {
        console.error("Search failed:", error);
        // Don't clear products on cancellation, only on actual errors
        if (
          !(error.code === "ERR_CANCELED" || error.name === "CanceledError")
        ) {
          setProducts([]); // Reset to empty array on error
          setFacets({}); // Reset facets on error
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, JSON.stringify(filters), sort, page]);

  // Sync state with URL params when they change (controls navigation-driven updates)
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categories: searchParams.getAll("category"),
      inStock: searchParams.get("instock") === "true",
      isFeatured: searchParams.get("featured") === "true",
      isHighlighted: searchParams.get("highlighted") === "true",
      priceRange:
        searchParams.get("minPrice") && searchParams.get("maxPrice")
          ? [
              Number(searchParams.get("minPrice")),
              Number(searchParams.get("maxPrice")),
            ]
          : null,
      // We generally preserve other local filters unless explicitly cleared or overwritten,
      // but for "View All" links that replace the URL, this ensures we pick up the new intent.
    }));
  }, [searchParams]);

  const handleSortChange = (newSort) => {
    setSearchParams((prev) => {
      prev.set("sort", newSort);
      return prev;
    });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);

    // Sync to URL
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      // Handle Price
      if (
        newFilters.priceRange &&
        Array.isArray(newFilters.priceRange) &&
        newFilters.priceRange.length === 2
      ) {
        newParams.set("minPrice", newFilters.priceRange[0]);
        newParams.set("maxPrice", newFilters.priceRange[1]);
      } else {
        newParams.delete("minPrice");
        newParams.delete("maxPrice");
      }

      // Handle Categories (optional, but good for consistency if filter component changes them)
      if (newFilters.categories) {
        newParams.delete("category");
        newFilters.categories.forEach((c) => newParams.append("category", c));
      }

      // Handle Flags
      if (newFilters.inStock) newParams.set("instock", "true");
      else newParams.delete("instock");

      if (newFilters.isFeatured) newParams.set("featured", "true");
      else newParams.delete("featured");

      return newParams;
    });
  };

  const handleViewAll = () => {
    // 1. Reset URL params to remove query and filters
    setSearchParams({});
    // 2. Clear local filter state
    setFilters({
      categories: [],
      priceRangeStr: "all",
      inStock: false,
      isFeatured: false,
    });
    // 3. Clear search input (if any)
    const searchInput = document.querySelector('input[type="search"]');
    if (searchInput) searchInput.value = "";
  };

  return (
    <div className="search-page-wrapper min-h-screen bg-gray-50/50">
      <style>{`
        .search-page-wrapper {
          padding-top: 30px;
          padding-bottom: 80px;
        }
        @media (min-width: 768px) {
          .search-page-wrapper {
            padding-top: 80px !important;
          }
        }
      `}</style>
      <div
        className="px-4 sm:px-6 lg:px-8"
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "10px",
        }}
      >
        {/* Header */}
        <div
          style={{
            zIndex: 30,
            backgroundColor: "rgba(249, 250, 251, 0.95)",
            backdropFilter: "blur(8px)",
            paddingTop: "1rem",
            paddingBottom: "1rem",
            marginTop: "-1rem", // Compensate for padding to maintain visual flow
          }}
          className="flex flex-col md:flex-row justify-between items-start md:justify-items-center gap-4 mb-8 sticky top-[50px] sm:top-[60px] md:top-[85px]"
        >
          
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium p-2 rounded-lg hover:bg-gray-100"
              aria-label="Go back to previous page"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {query ? (
                  <>
                    Results for{" "}
                    <span className="text-emerald-600">"{query}"</span>
                  </>
                ) : (
                  "All Products"
                )}
              </h1>
              <p className="text-gray-500 text-sm mt-1.5 font-medium">
                {isLoading ? "Searching..." : `${products.length} items found`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                setTempFilters(filters); // Initialize temp state with current real filters
                setIsMobileFiltersOpen(true);
              }}
              className="lg:hidden flex items-center gap-1 sm:gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700 shadow-sm active:scale-95 transition-all"
              style={{ padding: "5px 10px" }}
            >
              <SlidersHorizontal className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
              <span
                className="text-[9px] sm:text-[12px]"
                style={{ marginTop: "5px" }}
              >
                Filters
              </span>
            </button>
            <div className="ml-auto w-auto">
              <SortDropdown
                currentSort={sort}
                onSortChange={handleSortChange}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-24">
            <SearchFilters
              filters={facets}
              selectedFilters={filters}
              onFilterChange={handleFilterChange}
              onViewAll={handleViewAll}
            />
          </aside>

          {/* Mobile Filters Drawer */}
          <AnimatePresence>
            {isMobileFiltersOpen && (
              <>
                <Motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="fixed inset-0 z-60 bg-black/40 backdrop-blur-sm lg:hidden"
                />
                <Motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed right-0 top-0 bottom-0 z-70 w-[320px] bg-white shadow-2xl lg:hidden"
                >
                  <div
                    className="flex flex-col h-full"
                    style={{ padding: "10px" }}
                  >
                    <div className="flex justify-between items-center p-5 border-b border-gray-100">
                      <h2 className="text-lg font-bold text-gray-900">
                        Filters
                      </h2>
                      <button
                        onClick={() => setIsMobileFiltersOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5">
                      <SearchFilters
                        filters={facets}
                        selectedFilters={tempFilters}
                        onFilterChange={setTempFilters}
                        className="shadow-none border-none p-0"
                      />
                    </div>
                    <div className="p-5 border-t border-gray-100 bg-gray-50">
                      <button
                        onClick={() => {
                          setFilters(tempFilters); // Apply temp filters to real state
                          setIsMobileFiltersOpen(false);
                        }}
                        className="w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </Motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          <main className="flex-1 min-w-0 ">
            <SearchResults
              products={products}
              isLoading={isLoading}
              query={query}
              onReset={handleViewAll}
            />
            {/* Pagination Controls */}
            {!isLoading &&
              products.length > 0 &&
              facets?.pagination?.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2 pb-8">
                  <button
                    onClick={() => {
                      const newPage = (facets.pagination.page || 1) - 1;
                      if (newPage >= 1) {
                        setSearchParams((prev) => {
                          prev.set("page", newPage);
                          return prev;
                        });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    disabled={(facets.pagination.page || 1) === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-700">
                      Page {facets.pagination.page} of{" "}
                      {facets.pagination.totalPages}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const newPage = (facets.pagination.page || 1) + 1;
                      if (newPage <= facets.pagination.totalPages) {
                        setSearchParams((prev) => {
                          prev.set("page", newPage);
                          return prev;
                        });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    disabled={
                      (facets.pagination.page || 1) >=
                      facets.pagination.totalPages
                    }
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;