import React, { useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";
import { ActivitySection, ActivitySectionSkeleton } from "@/V2/components/activity";
import api from "@/V2/service";
import { AnimatePresence, motion } from "framer-motion";

const cardColor = [
  "#DAFFE6",
  "#326EC4",
  "#FFFEDA",
  "#D50D07",
  "#23B855",
  "#DAB330",
];

// Container variant to stagger children
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Item variants (no TS types)
const sectionVariants = {
  hidden: (direction) => ({
    opacity: 0,
    x: direction > 0 ? 100 : -100,
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -100 : 100,
    transition: { duration: 0.3 },
  }),
};

export function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const {
          data: { data },
        } = await api.get("/initiatives/grouped");

        const colored = data
          .map((activity, i) => ({
            ...activity,
            color: cardColor[i % cardColor.length],
          }))
          .filter(act => act.events.length > 0);

        setActivities(colored);
      } catch {
        showToast("Failed to fetch activities", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [showToast]);

  return (
    <section className="container mx-auto py-8 px-4 sm:px-6 md:px-8 lg:px-16 max-w-7xl space-y-12 sm:space-y-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center"
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold leading-relaxed px-4">
          At Drastha, we are committed to creating meaningful change through a wide
          range of impactful activities.
        </h2>
      </motion.div>

      {/* Activities Grid with Staggered Animations */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-12 sm:space-y-16"
      >
        <AnimatePresence>
          {(loading ? Array.from({ length: 3 }) : activities).map((item, idx) => {
            const direction = idx % 2 === 0 ? -1 : 1;
            const key = loading ? `skeleton-${idx}` : item.categoryId;

            return (
              <motion.div
                key={key}
                custom={direction}
                variants={sectionVariants}
                exit="exit"
              >
                {loading ? (
                  <ActivitySectionSkeleton isCardOnLeft={direction === -1} />
                ) : (
                  <ActivitySection
                    activity={item}
                    isCardOnLeft={direction === -1}
                  />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Closing Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mx-auto px-4 py-6 space-y-4 text-black text-lg sm:text-xl md:text-2xl"
      >
        <p className="leading-relaxed">
          At the heart of it all, we give our best—because every life, every story,
          every effort counts.
        </p>
        <p className="leading-relaxed">
          We believe that true change doesn't come from grand gestures alone, but
          from consistent, heartfelt action. Whether it's serving a warm meal,
          helping a child read their first book, or standing beside a mother
          fighting for a better future—we're there.
        </p>
        <p className="leading-relaxed">
          With every project, every outreach, and every small step, we're building
          hope, spreading kindness, and creating impact that lasts. Together with
          our dedicated volunteers, generous donors, and supportive communities,
          we're not just doing good—we're rewriting futures.
        </p>
        <p className="leading-relaxed">
          This is more than charity—it's commitment. This is more than
          service—it's love in action. <br />
          And we promise to keep giving it our all, every single day.
        </p>
      </motion.div>
    </section>
  );
}
