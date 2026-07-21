import { fetchBlogs } from "@/V2/app/features/blogs/blogsAsyncThunk";
import { Rectangle13 } from "@/V2/assets";
import { STATUS } from "@/V2/config";
import { getHTMLContent } from "@/V2/utils/getHTMLContent";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const dummyBlogs = [
  {
    bannerImageUrl: Rectangle13,
    title:
      "Spreading Smiles: How Our “Feeding Hope” Campaign Touched 100,000 Lives",
    content: `In a world where millions go to bed hungry each night, our
                mission has always been simple yet powerful — to make sure no
                one is forgotten.`,
  },
  { isEmpty: true },
  { isEmpty: true },
];

// Custom Arrows (unchanged)
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="cursor-pointer absolute left-0 top-[48%] -translate-y-1/2 z-10 rounded-full p-2 bg-[var(--primary-color)] text-white opacity-40 hover:opacity-70 transition"
  >
    <ChevronLeft size={20} />
  </button>
);
const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="cursor-pointer absolute right-0 top-[48%] -translate-y-1/2 z-10 rounded-full p-2 bg-[var(--primary-color)] text-white opacity-40 hover:opacity-70 transition"
  >
    <ChevronRight size={20} />
  </button>
);

const settings = {
  // dots: true,
  infinite: true,
  speed: 800,
  cssEase: "ease-in-out",
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  swipeToSlide: true,
  arrows: true,
  prevArrow: <PrevArrow />,
  nextArrow: <NextArrow />,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
    { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
  ],
};

const BlogCardSkeleton = () => (
  <div className="px-2">
    <div className="bg-gray-200 animate-pulse rounded-lg w-full h-[350px] flex flex-col">
      <div className="h-[160px] bg-gray-300 w-full" />
      <div className="p-4 flex-1 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="h-8 bg-gray-300 rounded w-24 mt-4" />
      </div>
    </div>
  </div>
);

export function HomeBlogSection() {
  const { blogs, status } = useSelector((s) => s.blogs);
  const dispatch = useDispatch();
  const isLoading = status.fetch === STATUS.LOADING;

  // Ensure at least 3 slides by appending dummyBlogs if needed
  const real = Array.isArray(blogs) ? blogs : [];
  let displayBlogs =
    real.length >= 3
      ? real
      : [...real, ...dummyBlogs.slice(0, Math.max(3 - real.length, 0))];

  // On mount, fetch
  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
          Blogs
        </h2>
        <Link
          to="/blog"
          className="text-base md:text-lg font-medium tracking-wide text-gray-600 hover:text-black transition-colors duration-200"
        >
          See all →
        </Link>
      </div>

      <div className="relative px-4 py-8">
        {isLoading ? (
          <Slider {...settings}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <BlogCardSkeleton key={idx} />
            ))}
          </Slider>
        ) : (
          <Slider {...settings}>
            {displayBlogs.map((blog, idx) => (
              <div key={blog.id ?? `dummy-${idx}`} className="px-2 py-6">
                {blog.isEmpty ? (
                  <BlogCardSkeleton />
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-lg hover:scale-105 transition-all overflow-hidden shadow-xl w-full h-[380px] flex flex-col text-black p-4"
                  >
                    {blog.bannerImageUrl ? (
                      <img
                        src={blog.bannerImageUrl}
                        alt={blog.title}
                        className="h-[160px] w-full object-cover"
                      />
                    ) : (
                      <div className="h-[160px] bg-gray-300 w-full" />
                    )}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <h3 className="font-semibold text-base leading-snug mb-2 line-clamp-2">
                        {blog.title}
                      </h3>
                      <div
                        className="text-sm text-gray-600 mb-4 line-clamp-3"
                        dangerouslySetInnerHTML={getHTMLContent(
                          blog.content?.slice(0, 150) || ""
                        )}
                      />
                      <Link
                        to={`/blog/${blog.id}`}
                        className="text-sm font-medium border border-black px-4 py-2 rounded hover:bg-black hover:text-white transition w-fit"
                      >
                        Read Now
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
}
