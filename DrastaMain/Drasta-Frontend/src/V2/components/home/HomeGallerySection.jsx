import { fetchGallery } from "@/V2/app/features/gallery/galleryAsyncThunk";
import { Rectangle20, Rectangle21, Rectangle22, Rectangle23 } from "@/V2/assets";
import { STATUS } from "@/V2/config";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const ImageSkeleton = ({ className = "" }) => (
  <div className={`bg-gray-200 animate-pulse ${className}`} />
);

export function HomeGallerySection() {
  const { images, status } = useSelector((s) => s.gallery);
  const dispatch = useDispatch();

  const isLoading = status === STATUS.LOADING;
  const getImgUrl = (idx) => images?.[idx]?.imageUrl;

  useEffect(() => {
    dispatch(fetchGallery());
  }, [dispatch]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-18">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-[40px] font-bold">Gallery</h2>
        <Link to="/gallery" className="font-semibold hover:underline text-[24px]">
          See all
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4">
        {/* Large Left Image */}
        {isLoading ? (
          <ImageSkeleton className="w-full h-60 sm:h-72 md:row-span-2 md:col-span-2 md:h-[400px]" />
        ) : (
          <motion.img
            src={getImgUrl(0) || Rectangle20}
            alt="Gallery 1"
            className="w-full h-60 sm:h-72 md:row-span-2 md:col-span-2 md:h-[400px] object-cover"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          />
        )}

        {/* Top Right Images */}
        {[1, 2].map((idx, i) =>
          isLoading ? (
            <ImageSkeleton
              key={idx}
              className="w-full h-40 sm:h-48 md:col-span-2"
            />
          ) : (
            <motion.img
              key={idx}
              src={getImgUrl(idx) || Rectangle21}
              alt={`Gallery ${idx + 1}`}
              className="w-full h-40 sm:h-48 md:col-span-2 object-cover"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 * (i + 1) }}
              viewport={{ once: true }}
            />
          )
        )}

        {/* Bottom Right Images */}
        {[3, 4].map((idx, i) =>
          isLoading ? (
            <ImageSkeleton
              key={idx}
              className={`w-full h-40 sm:h-48 ${
                idx === 3 ? "md:col-span-1" : "md:col-span-2"
              }`}
            />
          ) : (
            <motion.img
              key={idx}
              src={getImgUrl(idx) || Rectangle23}
              alt={`Gallery ${idx + 1}`}
              className={`w-full h-40 sm:h-48 ${
                idx === 3 ? "md:col-span-1" : "md:col-span-2"
              } object-cover`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
              viewport={{ once: true }}
            />
          )
        )}

        {/* Last Image with CTA */}
        {isLoading ? (
          <ImageSkeleton className="w-full h-40 sm:h-48 md:col-span-1" />
        ) : (
          <motion.div
            className="w-full h-40 sm:h-48 md:col-span-1 relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <img
              src={getImgUrl(5) || Rectangle22}
              alt="See All"
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Link
                to="/gallery"
                className="text-white text-xl font-bold hover:underline"
              >
                See All
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
