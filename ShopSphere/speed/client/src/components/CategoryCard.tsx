import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface CategoryCardProps {
  id: string;
  name: string;
  imageUrl: string;

}



export function CategoryCard({
  id,
  name,
  imageUrl: image,

}: CategoryCardProps) {
  // Convert category name to slug for URL
  
  
  return (
    <Link href={`/sub-categories/${id}`}>
      <Card className="group overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all" data-testid={`card-category-${id}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white flex  justify-between items-center">
            <h3 className="text-lg font-semibold font-heading mb-1" data-testid={`text-category-name-${id}`}>
              {name}
            </h3>
             <span><ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </div>
        </div>
      </Card>
    </Link>
  );
}