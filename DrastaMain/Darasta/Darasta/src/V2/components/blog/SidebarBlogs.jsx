import { BlogCard, BlogCardSkeleton, BlogSearch } from ".";
import { STATUS } from "@/V2/config";
import { useSelector } from "react-redux";

export function SidebarBlogs() {
  const { sidebarBlogs, status, error } = useSelector(
    (state) => state.blogs
  );
  
  const isLoading = status.sidebar === STATUS.LOADING;
  const isSuccess = status.sidebar === STATUS.SUCCEEDED;
  const isFailed = status.sidebar === STATUS.FAILED;

  return (
    <aside className="w-full sm:w-auto lg:max-w-sm bg-gray-50  rounded-lg p-4 sm:p-6">
      {/* Search bar */}
      <BlogSearch />

      {/* Blog list */}
      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
        {isLoading &&
          Array.from({ length: 5 }, (_, i) => (
            <BlogCardSkeleton key={i} variant="sidebar" />
          ))}

        {isFailed && (
          <div className="text-center text-red-500 text-sm">
            {error.sidebar || "Unable to load popular blogs."}
          </div>
        )}

        {!isLoading && isSuccess && sidebarBlogs.length === 0 && (
          <div className="text-center text-gray-500 text-sm">
            No popular blogs found.
          </div>
        )}

        {isSuccess &&
          sidebarBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} variant="sidebar" />
          ))}
      </div>
    </aside>
  );
}
