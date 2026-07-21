import { useToast } from "@/context/ToastContext";
import { deleteGalleryImages, fetchGallery } from "@/V2/app/features/gallery/galleryAsyncThunk";
import { GalleryHeaderInfo, ReusableGallery } from "@/V2/components/gallery";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GalleryPagination } from "../../gallery/GalleryPagination";

export function DisplayAllImage() {
  const dispatch = useDispatch();
  const { images, status, totalPages, totalElements } = useSelector(
    (s) => s.gallery
  );
  const [currentPage, setCurrentPage] = useState(1);
  const {showToast} = useToast();

  useEffect(() => {
    dispatch(fetchGallery({ page: currentPage }));
  }, [currentPage, dispatch]);

  const handleImageDelete = async (imageIds) => {
    console.log("images", imageIds)
    if (!imageIds.length) return;

    try {
      await dispatch(deleteGalleryImages(imageIds)).unwrap()
      showToast(`Image${imageIds.length > 1 && "s"} deleted successfully!`, "success")
      dispatch(fetchGallery()); // Refresh gallery after deletion
    } catch {
      showToast(`Failed to delete image${imageIds.length > 1 && "s"}.`, "error")
    }
  };

  return (
    <>
      <h1 className="text-center text-2xl font-bold">All Images</h1>

      {/* Gallery info header */}
      <GalleryHeaderInfo
        imagesPerPage={images.length}
        totalElements={totalElements}
        currentPage={currentPage}
        totalPages={totalPages}
      />  
      
      {/* Gallery images */}
      <ReusableGallery
        mode="admin"
        images={images}
        status={status}
        onImageDelete={handleImageDelete}
        onImageClick={(img) => console.log("Preview image", img)} // optional
      />

      {/* Pagination  */}
      <GalleryPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  );
}
