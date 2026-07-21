import mongoose, { Schema } from "mongoose";

const shippingCostSchema = new Schema(
    {
        value: {
            type: Number,
            required: [true, "Shipping cost value is required"],
            min: [0, "Shipping cost cannot be negative"],
            validate: {
                validator: Number.isFinite,
                message: "Shipping cost value must be a finite number",
            },
        },
    },
    { timestamps: true }
);

export const shippingCostModel = mongoose.model("ShippingCost", shippingCostSchema);
