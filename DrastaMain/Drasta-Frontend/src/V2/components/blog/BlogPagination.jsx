import { useState, useMemo } from "react";
import { BlogCard } from "@/V2/components/blog";

const INITIAL_COUNT = 6;
const LOAD_COUNT = 4;

export function BlogPagination({ blogs = [] }) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const canShowMore = visibleCount < blogs.length;
  const canShowLess = visibleCount > INITIAL_COUNT;

  const visibleBlogs = useMemo(
    () => blogs.slice(0, visibleCount),
    [blogs, visibleCount]
  );

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(blogs.length, prev + LOAD_COUNT));
  };

  const handleShowLess = () => {
    setVisibleCount((prev) => Math.max(INITIAL_COUNT, prev - LOAD_COUNT));
  };

  return (
    <div className="w-full">
      <div className="grid md:grid-cols-2 gap-6">
        {visibleBlogs.map((b) => (
          <BlogCard key={b.id} blog={b} variant="grid" />
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-4">
        {canShowLess && (
          <button
            onClick={handleShowLess}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Show Less
          </button>
        )}
        {canShowMore && (
          <button
            onClick={handleShowMore}
            className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary/90"
          >
            Show More
          </button>
        )}
      </div>
    </div>
  );
}
