const mongoose = require('mongoose');   
const Schema = mongoose.Schema;

const DirectorsDeskSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String,  },
    description: { type: String,  },
    public_id: { type: String,  }
}, {
    timestamps: true
}); 
module.exports = mongoose.model("DirectorsDesk", DirectorsDeskSchema);