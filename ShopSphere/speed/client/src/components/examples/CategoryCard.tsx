import { CategoryCard } from "../CategoryCard";
import toolboxImage from "@assets/generated_images/Toolbox_product_image_73fdb47c.png";

export default function CategoryCardExample() {
  return (
    <div className="p-6 max-w-xs">
      <CategoryCard
        id="1"
        name="Power Tools"
        image={toolboxImage}
        productCount={45}
      />
    </div>
  );
}
