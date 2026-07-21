const REVIEWS = [
  {
    id: 1,
    user: "Generic User",
    rating: 4.5,
    comment: "Great product, works as expected.",
    date: "2023-11-01",
  },
  {
    id: 2,
    user: "Another User",
    rating: 5,
    comment: "Excellent quality and fast delivery.",
    date: "2023-10-28",
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockReviewService = {
  getReviews: async () => {
    await delay(300);
    return { data: REVIEWS };
  },
};
