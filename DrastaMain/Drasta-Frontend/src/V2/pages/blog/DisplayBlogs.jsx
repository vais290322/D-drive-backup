import { fetchBlogs } from "@/V2/app/features/blogs/blogsAsyncThunk";
import { BlogCard, BlogCardSkeleton } from "@/V2/components/blog";
import { STATUS } from "@/V2/config";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function DisplayBlogs() {
  const dispatch = useDispatch();
  const { blogs, status, error } = useSelector((state) => state.blogs);
  const [page, setPage] = useState(0);
  const blogSectionRef = useRef(null);

  const PAGE_SIZE = 4;

  const isLoading = status.fetch === STATUS.LOADING;
  const isFailed = status.fetch === STATUS.FAILED;

  useEffect(() => {
    dispatch(fetchBlogs({ page: 0, size: PAGE_SIZE }));
  }, []);

  const handleShowMore = () => {
    const nextPage = page + 1;
    dispatch(fetchBlogs({ page: nextPage, size: PAGE_SIZE, append: true }));
    setPage(nextPage);
  };

  const handleShowLess = () => {
    const nextPage = page - 1;
    const newCount = (nextPage + 1) * PAGE_SIZE;
    dispatch({ type: "blogs/trimBlogs", payload: newCount });
    setPage(nextPage);
    blogSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const canShowMore = blogs.length >= (page + 1) * PAGE_SIZE;
  const canShowLess = page > 0;

  if (isLoading && blogs.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Array.from({ length: PAGE_SIZE }, (_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isFailed) {
    return (
      <div className="w-full text-center py-12 text-red-500">
        {error.fetch || "Failed to load blogs."}
      </div>
    );
  }

  if (!isLoading && !isFailed && blogs.length === 0) {
    return (
      <div className="w-full text-center py-12 text-gray-500">
        No blogs found.
      </div>
    );
  }

  return (
    <div className="w-full" ref={blogSectionRef}>
      <div
        
        className="grid grid-cols-1 sm:grid-cols-2 gap-6"
      >
        {blogs.map((b, idx) => (
          <BlogCard key={b.id + idx} blog={b} variant="grid" />
        ))}
      </div>

      <div className="mt-8 flex justify-center flex-wrap gap-4">
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
