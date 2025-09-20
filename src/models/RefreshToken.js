// models/RefreshToken.js
const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tokenHash: { type: String, required: true },  // hashed version store karenge
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date }, // logout ya rotation ke liye
  replacedByTokenHash: { type: String }, // new token ka hash save karne ke liye
  ip: { type: String },
  userAgent: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
