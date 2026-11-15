const { Schema } = require("mongoose");

const SessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "user", required: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, expires: 0 },
});

module.exports = { SessionSchema };
