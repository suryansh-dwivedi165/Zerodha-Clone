const { Schema } = require("mongoose");

const HoldingSchema = new Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 0 },
    avg: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    net: { type: String, default: "0.00%" },
    day: { type: String, default: "0.00%" },
  },
  { _id: false }
);

const PositionSchema = new Schema(
  {
    product: { type: String, enum: ["MIS"], default: "MIS" },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 0 },
    avg: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    net: { type: String, default: "0.00%" },
    day: { type: String, default: "0.00%" },
    isLoss: { type: Boolean, default: false },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0.01 },
    mode: { type: String, enum: ["BUY", "SELL"], required: true },
    product: { type: String, enum: ["CNC", "MIS"], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const FundsTransactionSchema = new Schema(
  {
    type: { type: String, enum: ["PAYIN", "WITHDRAWAL"], required: true },
    amount: { type: Number, required: true, min: 0.01 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: { type: String, required: true, select: false },
    cashBalance: { type: Number, min: 0, default: 10000 },
    holdings: { type: [HoldingSchema], default: [] },
    positions: { type: [PositionSchema], default: [] },
    orders: { type: [OrderSchema], default: [] },
    fundsTransactions: { type: [FundsTransactionSchema], default: [] },
  },
  { timestamps: true, optimisticConcurrency: true }
);

module.exports = { UserSchema };
