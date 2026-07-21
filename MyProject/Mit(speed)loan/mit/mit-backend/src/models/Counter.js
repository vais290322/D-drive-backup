const mongoose = require('mongoose');

const CounterSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', CounterSchema);

// Helper function to get next sequence number
async function getNextSequence(name) {
    const counter = await Counter.findOneAndUpdate(
        { name },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );
    return counter.seq;
}

module.exports = { Counter, getNextSequence };
