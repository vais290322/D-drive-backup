import { STATUS } from "@/V2/config";
import { useIsMobile } from "@/V2/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { Trash } from "lucide-react";
import { useState } from "react";
import { GalleryImageSlot } from ".";

const UNIVERSAL_GRID_CONTAINERS = {
  desktop: [
    { id: 1, className: "col-span-3 row-span-2" },
    { id: 2, className: "col-span-2 row-span-2 col-start-4" },
    { id: 3, className: "col-span-2 row-span-5 col-start-6" },
    { id: 4, className: "col-span-2 row-span-4 row-start-3" },
    { id: 5, className: "col-span-3 row-span-3 col-start-3 row-start-3" },
    { id: 6, className: "col-span-2 row-span-5 col-start-1 row-start-7" },
    { id: 7, className: "col-span-2 row-span-6 col-start-3 row-start-6" },
    { id: 8, className: "col-span-2 row-span-3 col-start-5 row-start-6" },
    { id: 9, className: "col-span-3 row-span-3 col-start-5 row-start-9" },
    { id: 10, className: "col-start-7 row-start-6 row-span-3" },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
};

export function ReusableGallery({
  mode = "user", // or "admin"
  images = [],
  status = STATUS.IDLE,
  onImageClick = () => {},
  onImageDelete = () => {},
}) {
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState([]);

  const toggleSelect = (imageUrl) => {
    setSelected((prev) =>
      prev.includes(imageUrl)
        ? prev.filter((url) => url !== imageUrl)
        : [...prev, imageUrl]
    );
  };

  const deleteSelectedImages = () => {
    if (selected.length && onImageDelete) {
      onImageDelete(selected);
      setSelected([]);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Admin Bulk Delete */}
      {mode === "admin" && selected.length > 0 && (
        <div className="flex justify-end px-6 py-2 gap-3">
          <button
            onClick={() => setSelected([])}
            className="flex items-center gap-2 bg-slate-200 text-slate-700 px-4 py-2 rounded hover:bg-slate-300 transition cursor-pointer"
          >
            Reset
          </button>

          <button
            onClick={deleteSelectedImages}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
          >
            <Trash size={16} />
            Delete Selected ({selected.length})
          </button>
        </div>
      )}

      {/* Loading State */}
      {status === STATUS.LOADING && (
        <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-12 h-12 md:w-20 md:h-20 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <div className="text-xl text-slate-700 font-semibold mb-2">
              Loading Gallery
            </div>
            <div className="text-sm text-slate-500">
              Preparing your images...
            </div>
          </motion.div>
        </div>
      )}

      {/* No data found */}
      {status === STATUS.SUCCEEDED && images.length === 0 && (
        <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="text-2xl text-slate-700 font-semibold mb-4">
              No Images Found
            </div>
            <div className="text-sm text-slate-500">
              Try changing the filters or check back later.
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Grid */}
      {status === STATUS.SUCCEEDED && images.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`grid ${
                isMobile
                  ? "grid-cols-2 gap-3"
                  : "grid-cols-7 grid-rows-11 gap-4 h-screen"
              } w-full`}
            >
              {isMobile
                ? images.map((img, i) => (
                    <GalleryImageSlot
                      key={`mobile-slot-${i}`}
                      image={img}
                      index={i}
                      containerClass="col-span-1 row-span-1"
                      onClick={onImageClick}
                      isMobile
                      isAdmin={mode === "admin"}
                      isSelected={selected.includes(img.imageUrl)}
                      toggleSelect={() => toggleSelect(img.imageUrl)}
                    />
                  ))
                : UNIVERSAL_GRID_CONTAINERS.desktop.map((container, i) => {
                    if (container.id === 10) {
                      return (
                        <div
                          key={`image-slot-${container.id}`}
                          className={container.className + " flex flex-col gap-2"}
                        >
                          {[images[9], images[10]].map((img, j) =>
                            img ? (
                              <GalleryImageSlot
                                key={`desktop-slot-10-${j}`}
                                image={img}
                                index={9 + j}
                                containerClass="h-1/2 w-full"
                                onClick={onImageClick}
                                isMobile={false}
                                isAdmin={mode === "admin"}
                                isSelected={selected.includes(img.imageUrl)}
                                toggleSelect={() => toggleSelect(img.imageUrl)}
                              />
                            ) : null
                          )}
                        </div>
                      );
                    }

                    return (
                      <GalleryImageSlot
                        key={`desktop-slot-${container.id}`}
                        image={images[i]}
                        index={i}
                        containerClass={container.className}
                        onClick={onImageClick}
                        isMobile={false}
                        isAdmin={mode === "admin"}
                        isSelected={selected.includes(images[i]?.imageUrl)}
                        toggleSelect={() => toggleSelect(images[i]?.imageUrl)}
                      />
                    );
                  })}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
