import { useEffect } from "react";
import { fetchBlogById } from "@/V2/app/features/blogs/blogsAsyncThunk";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectBlogById } from "@/V2/app/features/blogs/blogsSelector";
import { getHTMLContent } from "@/V2/utils/getHTMLContent";
import { useToast } from "@/context/ToastContext";
import { STATUS } from "@/V2/config";
import { Calendar, Clock } from "lucide-react";
import { getFormattedDate } from "@/V2/utils";

export function SingleBlog() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const blog = useSelector(selectBlogById(id));
  const { status, error } = useSelector((s) => s.blogs);
  const { showToast } = useToast();

  const isLoading = status.fetch === STATUS.LOADING;
  const isFailed = status.fetch === STATUS.FAILED;

  useEffect(() => {
    if (id) {
      dispatch(fetchBlogById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (isFailed && error.fetch && !blog) {
      showToast(error.fetch, "error");
    }
  }, [isFailed, error.fetch, blog, showToast]);

  if (isLoading && !blog) {
    return (
      <div className="p-8 text-center text-gray-400 animate-pulse">
        Loading blog...
      </div>
    );
  }

  if (!blog) {
    return <div className="p-8 text-center text-gray-500">Blog not found</div>;
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {blog.bannerImageUrl && (
          <img
            src={blog.bannerImageUrl}
            alt="Banner"
            className="w-full h-64 sm:h-80 lg:h-[500px] object-cover rounded-xl bg-gray-200 mb-6"
          />
        )}

        <h1
          className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight"
          dangerouslySetInnerHTML={getHTMLContent(blog.title)}
        />

        <div className="flex w-full justify-between items-center px-2 mb-6">
          <div className="text-sm sm:text-base text-gray-500 flex items-center gap-1">
            <span>
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            </span>
            <p>
              {getFormattedDate(blog.publishDate)}
            </p>
          </div>
          <div className="text-sm sm:text-base text-gray-500 flex items-center gap-1">
            <span>
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            </span>
            <p>
              {blog.readTime}
            </p>
          </div>
        </div>

        <div
          className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-800"
          dangerouslySetInnerHTML={getHTMLContent(blog.content)}
        />
      </div>
    </div>
  );
}
