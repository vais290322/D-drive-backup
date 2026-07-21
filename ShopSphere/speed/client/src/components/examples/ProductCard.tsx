import { ProductCard } from "../ProductCard";
import drillImage from "@assets/generated_images/Power_drill_product_image_e34c8df1.png";

export default function ProductCardExample() {
  return (
    <div className="p-6 max-w-sm">
      <ProductCard
        id="1"
        name="Professional Power Drill 18V"
        price={4999}
        originalPrice={6999}
        image={drillImage}
        rating={4.5}
        reviewCount={128}
        inStock={true}
        description="High-performance cordless drill with 18V battery"
      />
    </div>
  );
}
