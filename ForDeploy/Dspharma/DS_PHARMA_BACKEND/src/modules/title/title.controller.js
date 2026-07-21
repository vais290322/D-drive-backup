import {
  createTitleService,
  getTitlesService,
  getTitleByIdService,
  updateTitleService,
  deleteTitleService,
} from "./title.service.js";

export const createTitle = async (req, res) => {
  try {
    const { title, color, speed } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    const data = await createTitleService({ title, color, speed });
    res.status(201).json({ message: "Title created", data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getTitles = async (req, res) => {
  try {
    const data = await getTitlesService();
    res.status(200).json({ data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const getTitleById = async (req, res) => {
  try {
    const data = await getTitleByIdService(req.params.id);
    res.status(200).json({ data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const updateTitle = async (req, res) => {
  try {
    const data = await updateTitleService(req.params.id, req.body);
    res.status(200).json({ message: "Title updated", data });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

export const deleteTitle = async (req, res) => {
  try {
    await deleteTitleService(req.params.id);
    res.status(200).json({ message: "Title deleted" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
