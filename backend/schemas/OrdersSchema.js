const { Schema } = require("mongoose");

const OrderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0.01 },
    mode: { type: String, required: true, enum: ["BUY", "SELL"] },
  },
  { timestamps: true }
);

module.exports = { OrderSchema }; 