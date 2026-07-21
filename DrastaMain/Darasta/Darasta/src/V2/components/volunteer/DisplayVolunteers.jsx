import api from "@/V2/service";
import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const VolunteerCard = ({ img, name }) => (
  <motion.div
    className="space-y-2 sm:space-y-4 flex flex-col items-center justify-between"
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
  >
    <img
      src={img}
      alt={name}
      className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-[120px] lg:w-[120px] rounded-full object-cover border-2 border-white shadow-lg hover:scale-105 transition-transform duration-200"
    />
    <h1 className="text-center text-xs sm:text-sm md:text-base font-medium text-gray-800 line-clamp-2">
      {name}
    </h1>
  </motion.div>
);

export function DisplayVolunteers() {
  const [allVolunteers, setAllVolunteers] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Responsive preview counts
  const getPreviewCount = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 2;
      if (window.innerWidth < 768) return 3;
      if (window.innerWidth < 1024) return 4;
      return 5;
    }
    return 5;
  };
  const [previewCount, setPreviewCount] = useState(getPreviewCount());
  useEffect(() => {
    const handleResize = () => setPreviewCount(getPreviewCount());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchVolunteers = async () => {
      setLoading(true);
      try {
        const { data: { data } } = await api.get("/volunteer/active-list?active=true");
        // simulate delay
        await new Promise(r => setTimeout(r, 1000));
        setAllVolunteers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteers();
  }, []);

  const remainingCount = Math.max(0, allVolunteers.length - previewCount);

  // Animation variants
  const listVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Skeleton loader
  if (loading) {
    const skeletonItems = Array(previewCount + 1).fill(0);
    return (
      <section className="w-full py-6 px-4 sm:px-6 lg:px-10 xl:px-24">
        <div className="mx-auto space-y-6 sm:space-y-8">
          <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse" />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
            {skeletonItems.map((_, idx) => (
              <div key={idx} className="flex flex-col items-center space-y-2">
                <div className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-[120px] lg:w-[120px] bg-gray-200 rounded-full animate-pulse" />
                <div className="h-3 w-12 sm:w-16 md:w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-6 sm:py-8 lg:py-10 px-4 sm:px-6 lg:px-10 xl:px-24">
      {allVolunteers.length > 0 && (
        <div className="mx-auto space-y-6 sm:space-y-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Active Volunteers {expanded && `(${allVolunteers.length})`}
          </h1>

          <AnimatePresence initial={false}>
            {/* Preview */}
            {!expanded && (
              <motion.div
                key="preview"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={listVariants}
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6"
              >
                {allVolunteers.slice(0, previewCount).map((vol) => (
                  <motion.div key={vol.id} variants={itemVariants}>
                    <VolunteerCard img={vol.profileImage} name={vol.fullName} />
                  </motion.div>
                ))}

                {remainingCount > 0 && (
                  <motion.div
                    key="more"
                    variants={itemVariants}
                    className="flex justify-center"
                    onClick={() => setExpanded(true)}
                  >
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 lg:h-[120px] lg:w-[120px] cursor-pointer group">
                      <div className="absolute inset-0 rounded-full bg-black/50 z-10 flex items-center justify-center group-hover:bg-black/60 transition-colors duration-200">
                        <p className="text-sm sm:text-base lg:text-xl font-medium text-white group-hover:underline transition">
                          {remainingCount}+
                        </p>
                      </div>
                      {allVolunteers.slice(previewCount, previewCount + 3).map((peek, i) => (
                        <img
                          key={`${peek.id}-peek-${i}`}
                          src={peek.profileImage}
                          alt={peek.fullName}
                          className="absolute w-full h-full rounded-full object-cover shadow-md"
                          style={{
                            left: `-${i * (window.innerWidth < 640 ? 6 : window.innerWidth < 1024 ? 8 : 10)}px`,
                            zIndex: 5 - i,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Expanded */}
            {expanded && (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 sm:space-y-6"
              >
                <button
                  onClick={() => setExpanded(false)}
                  className="inline-flex items-center gap-2 text-gray-700 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-medium transition"
                >
                  <ChevronUp />
                  Show Less
                </button>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={listVariants}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6"
                >
                  {allVolunteers.map((vol) => (
                    <motion.div key={vol.id} variants={itemVariants}>
                      <div className="flex flex-col items-center space-y-2 group">
                        <div className="relative">
                          <img
                            src={vol.profileImage}
                            alt={vol.fullName}
                            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-3 border-white object-cover shadow-lg group-hover:scale-105 transition-transform duration-200"
                          />
                          {/* <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition" /> */}
                        </div>
                        <p className="text-xs sm:text-sm md:text-base font-medium text-gray-800 text-center line-clamp-2">
                          {vol.fullName}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
