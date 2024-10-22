const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
    {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "usermaster" },
    item_id:{ type: mongoose.Schema.Types.ObjectId, ref: "itemmaster"}
    },
{timestamps: true,}
);

module.exports = mongoose.model('wishlistmaster', wishlistSchema);