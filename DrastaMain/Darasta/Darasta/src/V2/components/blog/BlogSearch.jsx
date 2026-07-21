import {
  fetchPopularBlogs,
  searchSidebarBlogs,
} from "@/V2/app/features/blogs/blogsAsyncThunk";
import { STATUS } from "@/V2/config";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function BlogSearch() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const { status } = useSelector((state) => state.blogs);

  const isSearching = status.sidebar === STATUS.LOADING;

  useEffect(() => {
    if (!query) {
      dispatch(fetchPopularBlogs());
    }

    const delayDebounce = setTimeout(() => {
      if (query.trim()) {
        dispatch(searchSidebarBlogs(query.trim()));
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleClear = () => {
    setQuery("");
    dispatch(fetchPopularBlogs());
  };

  return (
    <>
      <div className="mb-4 w-full">
        <div className="relative w-full">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Search"
            className="w-full px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)]"
          />
          {query && (
            <X
              className="absolute right-10 top-2.5 w-4 h-4 text-gray-400 cursor-pointer"
              onClick={handleClear}
            />
          )}
          <Search className="absolute right-4 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        {!query && "Popular Blogs"}
        {query && isSearching && "Searching..."}
        {query && !isSearching && `Search Results for “${query}”`}
      </h3>

      <div className="w-full h-[2px] bg-gray-400 mb-4"/>
    </>
  );
}
