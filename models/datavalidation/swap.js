const mongoose = require('mongoose');

const swapSchema = new mongoose.Schema(
    {
    barters: [{ type: mongoose.Schema.Types.ObjectId, ref: "usermaster" }],
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "itemmaster" }],
    },
{timestamps: true,}
);

module.exports = mongoose.model('swapmaster', swapSchema);