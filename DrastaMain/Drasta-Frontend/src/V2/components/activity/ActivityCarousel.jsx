import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export const Carousel = ({ data = [], autoPlay = true, interval = 3000 }) => {
  const [loaded, setLoaded] = useState(false);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    renderMode: "performance",
    slideChanged() {
      // Optional callback
    },
    created() {
      setLoaded(true);
    },
    slides: {
      perView: 1.5,
      spacing: 16,
    },
    breakpoints: {
      "(max-width: 640px)": {
        slides: {
          perView: 1,
          spacing: 8,
        },
      },
    },
  });

  // Autoplay
  useEffect(() => {
    if (!autoPlay || !loaded || data.length <= 1) return;

    const timer = setInterval(() => {
      instanceRef.current?.next();
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, loaded, data.length, instanceRef]);

  if (!data || data.length === 0) return null;

  return (
    <div ref={sliderRef} className="keen-slider flex w-full sm:w-[80%] h-full">
      {data.map((item, index) => (
        <div
          key={index}
          className="keen-slider__slide w-full flex-shrink-0 pr-0 sm:pr-3"
        >
          <ActivityCard item={item} />
        </div>
      ))}
      {data.length < 3 && (
        <div className="keen-slider__slide w-full flex-shrink-0 pr-0 sm:pr-3">
          <SkeletonCard />
        </div>
      )}
    </div>
  );
};

// Skeleton Card Component
const SkeletonCard = () => (
  <Card className="bg-white h-full">
    <CardContent className="flex flex-col justify-center h-full p-6">
      <div className="space-y-3">
        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        <div className="h-2 bg-gray-300 rounded w-1/4 mt-4"></div>
      </div>
    </CardContent>
  </Card>
);

// Activity Card Component
const ActivityCard = ({ item }) => (
  <Card className="bg-white h-full">
    <CardContent className="flex flex-col sm:flex-row items-center justify-center sm:gap-3 gap-4 h-full px-2">
      <img
        src={item.imageUrl}
        alt={item.title.slice(0, 30)}
        className="w-full sm:w-[100px] md:w-[120px] lg:w-[140px] h-[120px] sm:h-full object-cover rounded-md flex-shrink-0 "
      />
      <div className="w-full sm:h-full flex flex-col justify-between text-center sm:text-left gap-2">
        <h4 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold leading-tight line-clamp-2 sm:line-clamp-3">
          {item.title}
        </h4>
        <span className="text-xs sm:text-xs md:text-sm text-gray-500 mt-1 sm:mt-0">
          Date: {item.date}
        </span>
      </div>
    </CardContent>
  </Card>
);
