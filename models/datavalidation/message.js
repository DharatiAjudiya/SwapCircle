const mongoose = require("mongoose");

const messagesschema = new mongoose.Schema(
  {
    content: String,

    proposal_status: String,

    attachments: { type: [String], require: true },

    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "usermaster",
    },

    chatroom_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chatroommaster",
    },

    item_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "itemmaster",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Messages = new mongoose.model("messagemaster", messagesschema);

module.exports = Messages;
