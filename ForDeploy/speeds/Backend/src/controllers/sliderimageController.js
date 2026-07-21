import SliderImage from "../models/sliderImage.js";
import { cloudinary } from "../service/cloudinary.js";

export async function createSliderImage(req, res) {
  try {
    if (!req.file) {
      return res.json({ success: false, message: "No image uploaded" });
    }
    const result = await cloudinary.uploader.upload(req.file.path);

    const slide = new SliderImage({
      image: result.secure_url,
      imagePublicId: result.public_id,
      caption: req.body.caption,
      link: req.body.link,
      order: req.body.order,
      active: req.body.active,
    });
    await slide.save();
    res
      .status(201)
      .json({ success: true, message: "Slide created", data: slide });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function updateSliderImage(req, res) {
  try {
    const { id } = req.params;

    const slide = await SliderImage.findById(id);
    if (!slide) {
      return res
        .status(404)
        .json({ success: false, message: "Slide not found" });
    }

    let newImageUrl = slide.image;
    let newImagePublicId = slide.imagePublicId;

    // If a new image is uploaded, replace Cloudinary image
    if (req.file) {
      // Delete old image from Cloudinary (if exists)
      if (slide.imagePublicId) {
        await cloudinary.uploader.destroy(slide.imagePublicId);
      }

      // Upload new image
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      newImageUrl = uploadResult.secure_url;
      newImagePublicId = uploadResult.public_id;
    }

    // Update slide fields
    slide.image = newImageUrl;
    slide.imagePublicId = newImagePublicId;
    slide.caption = req.body.caption ?? slide.caption;
    slide.link = req.body.link ?? slide.link;
    slide.order = req.body.order ?? slide.order;
    slide.active = req.body.active ?? slide.active;

    await slide.save();

    res.json({
      success: true,
      message: "Slide updated successfully",
      data: slide,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function getSliderImageById(req, res) {
  try {
    const item = await SliderImage.findById(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Slider image not found" });
    res.json({ success: true, message: "Slider image fetched", data: item });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function getAllSliderImages(req, res) {
  try {
    const items = await SliderImage.find().sort({ order: 1 });
    res.json({ success: true, message: "Slider images fetched", data: items });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function deleteSliderImage(req, res) {
  try {
    const { id } = req.params;

    const slide = await SliderImage.findById(id);
    if (!slide) {
      return res
        .status(404)
        .json({ success: false, message: "Slide not found" });
    }

    // Delete Cloudinary image if exists
    if (slide.imagePublicId) {
      await cloudinary.uploader.destroy(slide.imagePublicId);
    }

    // Delete document from DB
    await slide.deleteOne();

    res.json({
      success: true,
      message: "Slide deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
