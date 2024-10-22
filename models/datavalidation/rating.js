const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
    {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "usermaster" },
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "usermaster" },
    rating: {type: Number,},
    description: {type: String}
    },
{timestamps: true,}
);

module.exports = mongoose.model('ratingmaster', ratingSchema);