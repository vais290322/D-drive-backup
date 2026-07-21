import Title from "./title.model.js";

export const createTitleService = async ({ title, color, speed }) => {
  const newTitle = new Title({ title, color, speed });
  await newTitle.save();
  return newTitle;
};

export const getTitlesService = async () => {
  return Title.find().sort({ createdAt: -1 });
};

export const getTitleByIdService = async (id) => {
  const title = await Title.findById(id);
  if (!title) {
    const error = new Error("Title not found");
    error.statusCode = 404;
    throw error;
  }
  return title;
};

export const updateTitleService = async (id, { title, color, speed }) => {
  const updated = await Title.findByIdAndUpdate(
    id,
    { title, color, speed },
    { new: true },
  );
  if (!updated) {
    const error = new Error("Title not found");
    error.statusCode = 404;
    throw error;
  }
  return updated;
};

export const deleteTitleService = async (id) => {
  const deleted = await Title.findByIdAndDelete(id);
  if (!deleted) {
    const error = new Error("Title not found");
    error.statusCode = 404;
    throw error;
  }
  return deleted;
};
