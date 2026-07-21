import { galleryCategories } from "@/V2/config";
import { motion } from "framer-motion";

const categories = ["All", ...galleryCategories];

export function GalleryCategoryFilter({ activeCategory, setActiveCategory }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-gray-50 py-4 md:py-6 px-4 md:px-6"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-center">
        <div
          role="tablist"
          aria-label="Gallery categories"
          className="flex items-center overflow-x-auto justify-start md:justify-center md:flex-wrap gap-2 bg-white rounded-lg p-1 md:p-2 shadow-sm hide-scrollbar"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                role="tab"
                aria-selected={isActive}
                className={
                  `cursor-pointer flex-shrink-0 whitespace-nowrap px-3 py-1.5 md:px-4 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors outline-none focus:ring-2 focus:ring-yellow-300 ` +
                  (isActive
                    ? "bg-yellow-400 text-black shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100")
                }
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}