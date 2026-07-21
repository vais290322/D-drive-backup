import { Ellipse2 } from "@/V2/assets";
import api from "@/V2/service";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { ShowAchievementDialog } from "./ShowAchievementDialog";

const dummyAchievements = [
  {
    imageUrl: Ellipse2,
    title: "Feeding Hope Campaign",
    description:
      "In 2024, our NGO successfully launched the “Feeding Hope” initiative, providing over 100,000 nutritious meals to under. In 2024, our NGO successfully launched the “Feeding Hope” initiative, providing over 100,000 nutritious meals to under. In 2024, our NGO successfully launched the “Feeding Hope” initiative, providing over 100,000 nutritious meals to under. In 2024, our NGO successfully launched the “Feeding Hope” initiative, providing over 100,000 nutritious meals to under. In 2024, our NGO successfully launched the “Feeding Hope” initiative, providing over 100,000 nutritious meals to under. In 2024, our NGO successfully launched the “Feeding Hope” initiative, providing over 100,000 nutritious meals to under",
  },
  {
    imageUrl: null,
    title: "Dorem ipsum",
    description: "Dorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    imageUrl: null,
    title: "Dorem ipsum",
    description: "Dorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

export function HomeAchievementsSection() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const {
          data: { data },
        } = await api.get("/achievements");
        setAchievements(data);
      } catch {
        setAchievements(dummyAchievements);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, []);

  // always show exactly 3 slides
  const displayList =
    achievements.length >= 3
      ? achievements
      : [
          ...achievements,
          ...dummyAchievements.slice(0, 3 - achievements.length),
        ];

  const sliderSettings = {
    dots: false,
    infinite: true,
    autoplaySpeed: 2000,
    autoplay: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 1, centerMode: false } },
      { breakpoint: 640, settings: { slidesToShow: 1, centerMode: false } },
    ],
  };

  if (loading) {
    // render three skeleton cards
    return (
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-[40px] font-bold mb-6">Achievements</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="p-4 animate-pulse">
              <div className="h-[120px] w-[120px] bg-gray-300 rounded-full mx-auto mb-4" />
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 mx-auto" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded" />
                <div className="h-4 bg-gray-300 rounded w-5/6" />
                <div className="h-4 bg-gray-300 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (displayList.length === 0) {
    return <div className="text-center py-16">No data found</div>;
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-[40px] font-bold mb-6">Achievements</h2>
      <div className="relative px-4 py-8">
        <Slider {...sliderSettings} className="overflow-hidden">
          {displayList.map(({ id, title, description, imageUrl }, idx) => (
            <div key={id ?? idx} className="p-2">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="p-8 flex flex-col justify-between bg-[#F5F8FD] rounded-md min-h-[350px] shadow-xl hover:scale-[1.01]"
              >
                <div className="flex items-center gap-4 mb-4">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-[120px] h-[120px] object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-[120px] h-[120px] bg-gray-200 rounded-full" />
                  )}
                  <h3 className="text-[20px] md:text-[22px] font-bold">
                    {title}
                  </h3>
                </div>
                <p className="text-[16px] md:text-[18px] text-black mb-4">
                  {description.slice(0, 80)}…
                </p>
                <ShowAchievementDialog achievement={{ id, title, description, imageUrl }} />
              </motion.div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
