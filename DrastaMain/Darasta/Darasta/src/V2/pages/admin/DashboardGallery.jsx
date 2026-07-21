import { DisplayAllImage, UploadImag } from "@/V2/components/admin/gallery";

export function DashboardGallery() {
  return (
    <div className="p-12 space-y-12">
      <UploadImag />
      <DisplayAllImage/>
    </div>
  )
}
