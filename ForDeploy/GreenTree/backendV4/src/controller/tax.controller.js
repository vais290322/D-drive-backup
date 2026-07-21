const Tax = require('../models/tax.models');

// Create Tax
exports.createTax = async (req, res) => {
    try {
        const { shippingCharge, taxPercentage } = req.body;
        const taxExists = await Tax.find({ taxPercentage });
        if (taxExists.length > 0) {
            return res.status(400).json({ message: "Tax already exists" }); 
        }
        if (!shippingCharge || taxPercentage === undefined) {
            return res.status(400).json({ message: "Name and percentage are required" });
        }
        const tax = new Tax({ shippingCharge, taxPercentage });
        await tax.save();
        res.status(201).json({ message: "Tax created", data: tax });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all taxes
exports.getTaxes = async (req, res) => {
    try {
        const taxes = await Tax.findOne({}).sort({ createdAt: -1 });
        res.status(200).json({ data: taxes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single tax
exports.getTaxById = async (req, res) => {
    try {
        const tax = await Tax.findById(req.params.id);
        if (!tax) return res.status(404).json({ message: "Tax not found" });
        res.status(200).json({ data: tax });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update tax
exports.updateTax = async (req, res) => {
    try {
        const { shippingCharge, taxPercentage } = req.body;
        const tax = await Tax.findByIdAndUpdate(
            req.params.id,
            { taxPercentage, shippingCharge },
            { new: true }
        );
        if (!tax) return res.status(404).json({ message: "Tax not found" });
        res.status(200).json({ message: "Tax updated", data: tax });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete tax
exports.deleteTax = async (req, res) => {
    try {
        const tax = await Tax.findByIdAndDelete(req.params.id);
        if (!tax) return res.status(404).json({ message: "Tax not found" });
        res.status(200).json({ message: "Tax deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};