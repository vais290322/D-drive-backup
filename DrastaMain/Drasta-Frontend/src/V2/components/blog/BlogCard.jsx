import { getHTMLContent } from "@/V2/utils/getHTMLContent";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
// import { BlogDeleteBtn, BlogEditBtn } from ".";
import { Calendar, Clock, User } from "lucide-react";
import { getFormattedDate } from "@/V2/utils";

const LENGTH_SIDEBAR = 45;
const LENGTH_GRID = 120;

export const BlogCard = ({ blog, variant = "grid" }) => {
  const { id, title, content, bannerImageUrl, publishDate, author, readTime } =
    blog;

  if (!id || !title || !content) return null;

  const isSidebar = variant === "sidebar";
  const excerptLimit = isSidebar ? LENGTH_SIDEBAR : LENGTH_GRID;
  const excerpt =
    content.length > excerptLimit
      ? `${content.slice(0, excerptLimit)}…`
      : content;

  const containerClasses = isSidebar
    ? "flex items-center space-x-3 sm:space-x-4 py-2 sm:py-3 border-l-4 border-gray-200 bg-[#F5F8FD] pl-3 sm:pl-5 hover:bg-[#eaeff7] transition-colors"
    : "relative flex flex-col bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow";

  return (
    <motion.div
      className={`${
        !isSidebar
          ? "h-auto min-h-[280px] sm:min-h-[250px] lg:min-h-[290px] w-full"
          : "w-full"
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isSidebar ? { scale: 1.02, y: -2 } : undefined}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.5,
      }}
    >
      <div
        className={`${containerClasses} ${
          !isSidebar ? "p-3 sm:p-4 md:p-5" : ""
        } h-full`}
      >
        <Link
          to={`/blog/${id}`}
          className={`flex-1 flex flex-col ${
            isSidebar ? "flex-row items-center" : ""
          }`}
        >
          {isSidebar ? (
            <>
              {/* Sidebar image */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                {bannerImageUrl && (
                  <img
                    src={bannerImageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {/* Sidebar text */}
              <div className="flex-1 text-xs sm:text-sm text-gray-800 leading-snug ml-2 sm:ml-4 min-w-0">
                <h3
                  className="font-semibold mb-1 line-clamp-2"
                  dangerouslySetInnerHTML={getHTMLContent(title)}
                />
                <p
                  className="text-xs text-gray-600 mb-1 line-clamp-2"
                  dangerouslySetInnerHTML={getHTMLContent(
                    excerpt.replace(/<br\s*\/>/gi, "")
                  )}
                />
                {(author || publishDate) && (
                  <div className="text-xs text-gray-500 flex flex-wrap gap-1 truncate">
                    {author && <span className="truncate">{author}</span>}
                    {author && publishDate && <span>•</span>}
                    {publishDate && (
                      <span className="truncate">
                        {getFormattedDate(publishDate)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* GRID layout */}
              {/* 1) Image + title/meta row */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5">
                <div className="flex-shrink-0 w-full sm:w-20 md:w-24 lg:w-28 h-32 sm:h-20 md:h-24 lg:h-28 bg-gray-200 rounded overflow-hidden">
                  {bannerImageUrl ? (
                    <img
                      src={bannerImageUrl}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3
                    className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-gray-900 mb-1 sm:mb-2 line-clamp-2 leading-tight"
                    dangerouslySetInnerHTML={getHTMLContent(title)}
                  />
                  {(author || publishDate || readTime) && (
                    <div className="flex flex-wrap items-center text-gray-500 text-xs sm:text-sm gap-2 sm:gap-3 mb-1 sm:mb-2">
                      {author && (
                        <span className="flex items-center gap-1 truncate">
                          <User className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{author}</span>
                        </span>
                      )}
                      {publishDate && (
                        <span className="flex items-center gap-1 truncate">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">
                            {getFormattedDate(publishDate)}
                          </span>
                        </span>
                      )}
                      {readTime && (
                        <span className="flex items-center gap-1 truncate">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{readTime}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 2) Full-width excerpt */}
              <div className="flex-1 overflow-hidden mt-2 sm:mt-3">
                <p
                  className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-3 sm:line-clamp-4"
                  dangerouslySetInnerHTML={getHTMLContent(excerpt)}
                />
              </div>

              {/* 3) Actions */}
              {/* <div className="flex gap-1 sm:gap-2 self-end justify-end mt-2 sm:mt-3">
                <BlogEditBtn id={id} />
                <BlogDeleteBtn />
              </div> */}
            </>
          )}
        </Link>
      </div>
    </motion.div>
  );
};
