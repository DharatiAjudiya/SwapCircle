const mongoose = require('mongoose');

const chatroomschema = new  mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    creator_id: {
      type: mongoose.Schema.Types.ObjectId, ref: "usermaster" 
    },
    members_id: [
      {
        type: mongoose.Schema.Types.ObjectId, ref: "usermaster" 
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Chatroom = new mongoose.model('chatroommaster', chatroomschema)

module.exports = Chatroom;
