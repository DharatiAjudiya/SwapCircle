const mongoose = require("mongoose");

const itemschema = new mongoose.Schema(
  {
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categorymaster",
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "usermaster" },
    name: { type: String, require: true },
    description: { type: String },
    images: { type: [String], require: true },
    tags: { type: [String] },
    eco_friendly: { type: Boolean, require: true },
    recyclable: { type: Boolean, require: true },
    condition: { type: String, require: true },
    status: { type: String, require: true },
    price: { type: [Number], require: true },
    selling_status: { type: String, require: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      postcode: { type: Number },
      city: { type: String },
      state: { type: String },
      country: { type: String },
    },
  },
  { timestamps: true }
);

const Items = new mongoose.model("itemmaster", itemschema);

module.exports = Items;
