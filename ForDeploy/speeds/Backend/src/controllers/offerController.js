import Offer from "../models/offer.js";

// ----------------------------------
// CREATE OFFER
// ----------------------------------
export async function createOffer(req, res) {
  try {
    const offer = await Offer.create(req.body);

    res.status(201).json({
      success: true,
      message: "Offer created successfully",
      data: offer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ----------------------------------
// UPDATE OFFER
// ----------------------------------
export async function updateOffer(req, res) {
  try {
    const { id } = req.params;

    const updated = await Offer.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });
    }

    res.json({
      success: true,
      message: "Offer updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ----------------------------------
// GET OFFER BY ID
// ----------------------------------
export async function getOfferById(req, res) {
  try {
    const { id } = req.params;

    const offer = await Offer.findById(id);
    if (!offer) {
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });
    }

    res.json({
      success: true,
      message: "Offer fetched successfully",
      data: offer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ----------------------------------
// GET ALL OFFERS
// ----------------------------------
export async function getAllOffers(req, res) {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Offers fetched successfully",
      data: offers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// ----------------------------------
// DELETE OFFER
// ----------------------------------
export async function deleteOffer(req, res) {
  try {
    const { id } = req.params;

    const deleted = await Offer.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Offer not found" });
    }

    res.json({
      success: true,
      message: "Offer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
