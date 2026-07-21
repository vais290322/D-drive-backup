const BANNERS = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=1200&q=80",
    alt: "Health & Wellness Banner",
    title: "Health & Wellness",
    bgColor: "bg-emerald-300",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    alt: "Medical Equipment Banner",
    title: "Medical Equipment",
    bgColor: "bg-red-800",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80",
    alt: "Prescription Medicines Banner",
    title: "Prescription Medicines",
    bgColor: "bg-cyan-300",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1596438248809-f2ffe4494953?auto=format&fit=crop&w=1200&q=80",
    alt: "Personal Care Banner",
    title: "Personal Care",
    bgColor: "bg-orange-400",
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockContentService = {
  getBanners: async () => {
    await delay(200);
    return { data: BANNERS };
  },
};
