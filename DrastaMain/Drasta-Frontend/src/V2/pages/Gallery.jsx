import { fetchGallery } from "@/V2/app/features/gallery/galleryAsyncThunk";
import {
  GalleryCategoryFilter,
  GalleryHeaderInfo,
  ReusableGallery
} from "@/V2/components/gallery";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GalleryPagination } from "../components/gallery/GalleryPagination";

export function Gallery() {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const { images, status, totalPages, totalElements } = useSelector(
    (s) => s.gallery
  );

  useEffect(() => {
    dispatch(fetchGallery({ page: currentPage, category: activeCategory}));
  }, [dispatch, currentPage, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
      <GalleryCategoryFilter
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* header info */}
      <GalleryHeaderInfo
        imagesPerPage={images.length}
        totalElements={totalElements}
        currentPage={currentPage}
      />

      {/* Gallery images */}
      <ReusableGallery images={images} status={status} />

      {/* Pagination  */}
      <GalleryPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
