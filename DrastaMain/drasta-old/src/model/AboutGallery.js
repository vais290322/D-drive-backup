const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AboutGallerySchema = new Schema({
    images: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model("AboutGallery", AboutGallerySchema);
