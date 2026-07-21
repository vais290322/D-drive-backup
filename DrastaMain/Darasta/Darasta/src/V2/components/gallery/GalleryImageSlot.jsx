import { GalleryImgFrame } from "@/V2/assets";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const itemVariants = {
  hidden: { opacity: 0, scale: 0.85, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 15 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: -10,
    transition: { duration: 0.15 },
  },
};

const imageHoverVariants = {
  rest: {
    scale: 1,
    filter: "brightness(1)",
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
  hover: {
    scale: 1.03,
    filter: "brightness(1.1)",
    transition: { type: "spring", stiffness: 400, damping: 25 },
  },
  tap: {
    scale: 0.98,
    filter: "brightness(1.05)",
    transition: { duration: 0.1 },
  },
};

export function GalleryImageSlot({
  image,
  index,
  containerClass,
  onClick,
  isMobile,
  isAdmin = false,
  isSelected = false,
  toggleSelect = () => {},
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const location = useLocation();

  const isUserMode = location.pathname === "/gallery";

  const handleClick = () => {
    if (!image) return;
    if (isAdmin) toggleSelect(image.id); // Select instead of zoom if admin
    else {
      setIsZoomed(true);
      if (onClick) onClick(image);
    }
  };

  const handleCloseZoom = (e) => {
    e.stopPropagation();
    setIsZoomed(false);
  };

  return (
    <>
      {/* Main Image Thumbnail */}
      <motion.div
        variants={itemVariants}
        className={`${containerClass} relative overflow-hidden group cursor-pointer`}
        onClick={handleClick}
        whileTap={isMobile ? "tap" : {}}
      >
        <motion.div
          className="w-full h-full shadow-md overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300"
          initial="rest"
          whileHover={!isMobile ? "hover" : {}}
          whileTap={isMobile ? "tap" : {}}
          variants={imageHoverVariants}
        >
          {image ? (
            <>
              <img
                src={image.imageUrl}
                alt={image.alt || `Gallery image ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Frame */}
              {isUserMode ? (
                <img src={GalleryImgFrame} alt="Frame" className="absolute inset-0 h-full w-full bg-cover" />
              ) : null}

              {/* Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent ${
                  isMobile ? "opacity-70" : "opacity-0 group-hover:opacity-100"
                } transition-all duration-300`}
              />

              {/* Caption */}
              <div
                className={`absolute bottom-0 left-0 right-0 p-2 md:p-4 text-white ${
                  isMobile
                    ? "translate-y-0"
                    : "translate-y-full group-hover:translate-y-0"
                } transition-transform duration-300`}
              >
                {image.category && (
                  <div className="text-xs opacity-90 mb-1 truncate">
                    {image.category}
                  </div>
                )}
                {image.title && isMobile && (
                  <div className="text-xs font-medium line-clamp-1">
                    {image.title}
                  </div>
                )}
              </div>

              {/* Admin Selection Checkbox */}
              {isAdmin && (
                <div className="absolute top-2 right-2 z-10">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(image.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-5 h-5 accent-blue-600 rounded-md cursor-pointer"
                    />
                  </label>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-[200px] md:h-full flex items-center justify-center text-slate-400">
              <div className="text-center">
                <div className="text-2xl md:text-3xl mb-1">📷</div>
                <div className="text-xs">Slot {index + 1}</div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Zoom Modal (only in user mode) */}
      {isZoomed && !isAdmin && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 "
          onClick={handleCloseZoom}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={image.imageUrl}
              alt={image.alt || `Zoomed image ${index + 1}`}
              className="object-contain max-w-[90vw] max-h-[90vh]"
            />
            <button
              className="absolute -top-10 right-0 bg-black/50 text-white p-2 hover:bg-black/70"
              onClick={handleCloseZoom}
            >
              <X className="w-6 h-6" />
            </button>
            {(image.title || image.category) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
                {image.title && (
                  <h3 className="text-lg font-semibold">{image.title}</h3>
                )}
                {image.category && (
                  <p className="text-sm opacity-90">{image.category}</p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
