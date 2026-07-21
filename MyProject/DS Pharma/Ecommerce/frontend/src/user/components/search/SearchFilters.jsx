import React, { useState } from "react";
import {
  ChevronDown,
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  Banknote,
  Percent,
  ShoppingBag,
  Check,
} from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

export const SortDropdown = ({ currentSort, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { value: "relevance", label: "Relevance" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "name_asc", label: "Name: A to Z" },
    { value: "name_desc", label: "Name: Z to A" },
  ];

  const currentLabel =
    options.find((o) => o.value === currentSort)?.label || "Sort by";

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2.5 bg-white border border-gray-200 rounded-full text-[9px] sm:text-[12px] font-medium text-gray-700 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm"
        style={{ padding: "5px 10px" }}
      >
        <ArrowUpDown className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
        <span style={{ marginTop: "3px" }}>{currentLabel}</span>
        <ChevronDown
          className={`w-2.5 h-2.5 sm:w-4 sm:h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            className="absolute right-0 mt-2 w-34 sm:w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden"
            style={{ padding: "5px 10px" }}
          >
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-[9px] sm:text-[12px] transition-colors ${
                    currentSort === option.value
                      ? "bg-emerald-50 text-emerald-600 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  style={{ padding: "0 5px" }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </Motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

const FilterSection = ({ title, icon: Icon, isOpen, onToggle, children }) => {
  return (
    <div
      className="border-b border-gray-100 last:border-0"
      style={{ padding: "5px 10px" }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 px-1 group"
      >
        <div className="flex items-center gap-2.5 text-gray-700 font-semibold text-[8px] sm:text-[12px] group-hover:text-emerald-600 transition-colors">
          {Icon && (
            <Icon className="w-2.5 h-2.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-emerald-500" />
          )}
          <span style={{ marginTop: "5px" }}>{title}</span>
        </div>
        <ChevronDown
          className={`w-2.5 h-2.5 sm:w-4 sm:h-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <Motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-5 px-1 space-y-3">{children}</div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SearchFilters = ({
  filters = {},
  selectedFilters = {},
  onFilterChange = () => {},
  onViewAll,
  className = "",
}) => {
  const [openSections, setOpenSections] = useState({
    categories: true,
    price: true,
    availability: true,
    type: true,
  });

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Sync local inputs with selectedFilters
  React.useEffect(() => {
    if (
      selectedFilters.priceRange &&
      Array.isArray(selectedFilters.priceRange)
    ) {
      setMinPrice(selectedFilters.priceRange[0] || "");
      setMaxPrice(selectedFilters.priceRange[1] || "");
    } else {
      setMinPrice("");
      setMaxPrice("");
    }
  }, [selectedFilters.priceRange]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Ensure categories is always an array
  const categories = Array.isArray(filters?.categories)
    ? filters.categories
    : filters?.categories && typeof filters.categories === "object"
      ? Object.values(filters.categories)
      : ["Antibiotics", "Fever & Pain", "Supplements", "First Aid"];
  const priceRanges = [
    { label: "All Prices", value: "all" },
    { label: "Under ₹100", value: "0-100" },
    { label: "₹100 - ₹500", value: "100-500" },
    { label: "₹500 - ₹1000", value: "500-1000" },
  ];

  // Helper change handlers...
  const handleCategoryChange = (category) => {
    const current = selectedFilters.categories || [];
    const updated = current.includes(category)
      ? current.filter((c) => c !== category)
      : [...current, category];
    onFilterChange({ ...selectedFilters, categories: updated });
  };

  const handlePriceChange = (range) => {
    if (range.value === "all") {
      const {
        priceRangeStr: _p,
        priceRange: _r,
        customPrice: _c,
        ...rest
      } = selectedFilters;
      onFilterChange({ ...rest, priceRangeStr: "all" });
    } else if (selectedFilters.priceRangeStr === range.value) {
      const {
        priceRangeStr: _p,
        priceRange: _r,
        customPrice: _c,
        ...rest
      } = selectedFilters;
      onFilterChange({ ...rest, priceRangeStr: "all" });
    } else {
      const [min, max] = range.value.split("-").map(Number);
      onFilterChange({
        ...selectedFilters,
        priceRangeStr: range.value,
        priceRange: [min, max],
        customPrice: null,
      });
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100/50 p-5 ${className}`}
    >
      <div
        className="flex items-center gap-2 mb-2 pb-4 border-b border-gray-100"
        style={{ padding: "5px 10px" }}
      >
        <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
        <h3 className="font-bold text-gray-900" style={{ marginTop: "5px" }}>
          Filters
        </h3>
      </div>

      {/* <FilterSection
        title="Categories"
        icon={Tag}
        isOpen={openSections.categories}
        onToggle={() => toggleSection("categories")}
      >
        {categories.map((category) => (
          <label
            key={category}
            className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1.5 rounded-lg -mx-1.5 transition-colors"
          >
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={(selectedFilters.categories || []).includes(category)}
                onChange={() => handleCategoryChange(category)}
                className="peer h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer"
              />
            </div>
            <span
              className="text-[12px] text-gray-600 group-hover:text-gray-900 transition-colors"
              style={{ marginTop: "5px" }}
            >
              {category}
            </span>
          </label>
        ))}
      </FilterSection> */}

      <FilterSection
        title="Price Range"
        icon={Banknote}
        isOpen={openSections.price}
        onToggle={() => toggleSection("price")}
      >
        <div className="space-y-3">
          {priceRanges.map((range) => (
            <label
              key={range.value}
              className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1.5 rounded-lg -mx-1.5 transition-colors"
            >
              <div className="relative flex items-center">
                <input
                  type="radio"
                  name="price_range"
                  checked={selectedFilters.priceRangeStr === range.value}
                  onChange={() => handlePriceChange(range)}
                  className="peer h-4 w-4 border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>
              <span
                className="text-[12px] text-gray-600 group-hover:text-gray-900 transition-colors"
                style={{ marginTop: "5px" }}
              >
                {range.label}
              </span>
            </label>
          ))}

          {/* Custom Price Range Inputs */}
          <div
            className="pt-2 border-t border-gray-50"
            style={{ padding: "5px" }}
          >
            <p className="text-[10px] text-gray-400 uppercase font-bold mb-2 tracking-wider">
              Custom Range
            </p>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[13px]">
                  ₹
                </span>
                <input
                  style={{ padding: "3px 0px 3px 20px" }}
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full pl-5 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[10px] sm:text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>
              <span className="text-gray-400 text-xs">-</span>
              <div className="flex-1 relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-[13px]">
                  ₹
                </span>
                <input
                  style={{ padding: "3px 0px 3px 20px" }}
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full pl-5 pr-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[10px] sm:text-xs focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-hidden"
                />
              </div>
              <button
                style={{ padding: "3px 5px" }}
                onClick={() => {
                  const min = Number(minPrice) || 0;
                  const max = Number(maxPrice) || 1000;
                  if (min > max) {
                    alert("Min price cannot be greater than Max price");
                    return;
                  }
                  onFilterChange({
                    ...selectedFilters,
                    priceRangeStr: null,
                    priceRange: [min, max],
                  });
                }}
                className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
              >
                <Check className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* <FilterSection
        title="Availability"
        icon={ShoppingBag}
        isOpen={openSections.availability}
        onToggle={() => toggleSection("availability")}
      >
        <label className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1.5 rounded-lg -mx-1.5 transition-colors">
          <input
            type="checkbox"
            checked={!!selectedFilters.inStock}
            onChange={() =>
              onFilterChange({
                ...selectedFilters,
                inStock: !selectedFilters.inStock,
              })
            }
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
          <span
            className="text-[12px] text-gray-600 group-hover:text-gray-900"
            style={{ marginTop: "5px" }}
          >
            Exclude Out of Stock
          </span>
        </label>
      </FilterSection> */}

      {/* <FilterSection
        title="Prescription"
        icon={Percent} // used percent merely as visual placeholder, maybe "FileText" is better but using Lucide icons available
        isOpen={openSections.type}
        onToggle={() => toggleSection("type")}
      >
        <label className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1.5 rounded-lg -mx-1.5 transition-colors">
          <input
            type="checkbox"
            checked={selectedFilters.prescriptionRequired === false}
            onChange={() => {
              if (selectedFilters.prescriptionRequired === false) {
                const { prescriptionRequired: _p, ...rest } = selectedFilters;
                onFilterChange(rest);
              } else {
                onFilterChange({
                  ...selectedFilters,
                  prescriptionRequired: false,
                });
              }
            }}
            className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
          />
          <span
            className="text-[12px] text-gray-600 group-hover:text-gray-900"
            style={{ marginTop: "5px" }}
          >
            OTC Products Only
          </span>
        </label>
      </FilterSection> */}

      {/* View All Products Button */}
      {onViewAll && (
        <div
          className="mt-4 pt-4 border-t border-gray-100"
          style={{ padding: "10px" }}
        >
          <button
            onClick={onViewAll}
            className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-semibold rounded-xl transition-all shadow-md shadow-emerald-200 active:scale-95 flex items-center justify-center gap-1"
          >
            <ShoppingBag className="w-4 h-4 " />
            <p style={{ marginTop: "5px" }}>View All Products</p>
          </button>
        </div>
      )}
    </div>
  );
};