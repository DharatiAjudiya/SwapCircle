const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    category: { type: String, required: true },
    image: { type: String },
    status: { type: Boolean },
  },
  { timestamps: true }
);

const Category = new mongoose.model("categorymaster", categorySchema);

module.exports = Category;
