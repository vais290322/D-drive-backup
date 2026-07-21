import React from "react";
import { Trash2, Star } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Update the testimonials array with different ratings
const testimonials = [
  { name: "Priya Sharma", feedback: "Volunteering here has been one of the most fulfilling experiences of my life.", rating: 5 },
  { name: "Rajiv Menon", feedback: "Organized, impactful and truly community driven. Great job!", rating: 4 },
  { name: "Ayesha Khan", feedback: "Such positive vibes and incredible teamwork. I feel proud to be part of this.", rating: 3 },
  { name: "Karthik Iyer", feedback: "Could improve a bit on communication, but overall a great initiative.", rating: 4 },
  { name: "Sneha Verma", feedback: "Loved the energy and dedication of the team. Highly recommended!", rating: 5 },
  { name: "Amit Patel", feedback: "Good experience, but the onboarding process can be smoother.", rating: 3 },
];

export const DashboardTestimonial = () => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 3,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="md:max-w-7xl mx-auto py-10 px-4 sm:px-6 overflow-hidden">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">What People Say</h2>
      <p className="text-center text-gray-600 mb-6 max-w-2xl mx-auto">
        Feedback from our community across India.
      </p>

      <div className="w-full overflow-hidden">
        <Slider {...settings} className="mx-[-8px]">
          {testimonials.map((tst, idx) => (
            <div key={idx} className="px-2 w-[200px] h-[200px]">
              <div className="w-full bg-gray-100 p-5 rounded-md shadow-sm flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                    <span className="font-semibold text-base">{tst.name}</span>
                  </div>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className="w-5 h-5" 
                        fill={i < tst.rating ? "currentColor" : "none"}
                        strokeWidth={1}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-800 flex-grow">{tst.feedback}</p>
                <button className="mt-4 self-end text-black hover:text-red-500">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};
