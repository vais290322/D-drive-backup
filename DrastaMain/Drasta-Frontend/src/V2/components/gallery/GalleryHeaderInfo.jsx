import { motion } from "framer-motion";

export function GalleryHeaderInfo({
  imagesPerPage,
  totalElements,
  currentPage,
  totalPages,
  activeCategory,
}) {
  const startIndex = (currentPage - 1) * imagesPerPage;
  const endIndex = Math.min(startIndex + imagesPerPage, totalElements);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mb-4 md:mb-6 flex flex-col md:flex-row justify-between items-start md:items-center mt-4"
    >
      <div className="text-sm text-slate-600">
        Showing{' '}
        <span className="font-semibold text-slate-800">
          {startIndex + 1}
        </span>{' '}
        to{' '}
        <span className="font-semibold text-slate-800">
          {endIndex}
        </span>{' '}
        of{' '}
        <span className="font-semibold text-slate-800">
          {totalElements}
        </span>{' '}
        images
        {activeCategory !== 'All' && (
          <span className="text-blue-600 ml-1">in {activeCategory}</span>
        )}
      </div>
      <div className="text-sm text-slate-500">
        Page {currentPage} of {totalPages}
      </div>
    </motion.div>
  );
}
