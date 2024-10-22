const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: "roleMaster" },
    username: { type: String, required: true },
    email: { type: String, lowercase: true },
    password: { type: String },
    phone_number: { type: String },
    address: { type: String },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    points: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    badges: { type: Number, default: 0 },
    average_rating: { type: Number, default: 0 },
    social_platform: { type: String },
    social_id: { type: Number },
    profile: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("usermaster", userSchema);
