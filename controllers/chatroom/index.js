const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const logger = require("../../utils/logger");
const {
  getOtherMember,
  ErrorHandler,
  emitEvent,
} = require("../../utils/utility");
const Chatroom = require("../../models/datavalidation/chatroom");
const User = require("../../models/datavalidation/user");
const Items = require("../../models/datavalidation/item");
const Messages = require("../../models/datavalidation/message");

//create chatroom
const createchatroom = async (req, res, next) => {
  try {
    const creator_id = req.user.id;
    const { members_id, item_id } = await req.body;

    // Check if a chatroom with the same creator and member already exists
    const existingChatroom = await Chatroom.findOne({
      $or: [
        { creator_id, members_id: { $in: [members_id] } },
        { creator_id: members_id, members_id: { $in: [creator_id] } },
      ],
    });

    if (existingChatroom) {
      let [chat, me] = await Promise.all([
        Chatroom.findById(existingChatroom._id),
        User.findById(req.user.id, "username"),
      ]);

      if (!chat) return next(new ErrorHandler("Chatroom not found", 404));

      let messageForDB = {
        content:
          "I'm really interested in your item and would love to discuss a possible barter if you're open to it!",
        item_id: item_id,
        sender_id: me._id,
        chatroom_id: existingChatroom._id,
      };

      await Messages.create(messageForDB);

      return res.status(200).json({
        status: true,
        message: "Chatroom already exists with the same creator and member.",
        result: existingChatroom,
      });
    }

    // Fetch user names for both creator and member
    let creator = await User.findById(creator_id);
    let member = await User.findById(members_id);
    if (!creator || !member) {
      return res.status(404).json({
        status: false,
        message: "One or both users not found.",
      });
    }

    // Generate chatroom name based on both user names
    let chatroomName = `${creator.username}, ${member.username}`;

    let allMembers = [creator_id, members_id];

    // Create the chatroom
    let chatroom = new Chatroom({
      name: chatroomName,
      creator_id,
      members_id: allMembers,
    });

    await chatroom.save();

    let [chat, me] = await Promise.all([
      Chatroom.findById(chatroom._id),
      User.findById(req.user.id, "username"),
    ]);

    if (!chat) return next(new ErrorHandler("Chatroom not found", 404));

    let messageForDB = {
      content:
        "I'm really interested in your item and would love to discuss a possible barter if you're open to it!",
      item_id: item_id,
      sender_id: me._id,
      chatroom_id: chatroom._id,
    };

    await Messages.create(messageForDB);

    res.status(200).json({
      status: true,
      message: "Chatroom created successfully",
      result: chatroom,
    });
  } catch (error) {
    console.log("Error: ", error);
    logger.error(error)
    res.status(500).json({ status: false, message: error.message });
  }
};

//view chatroom
const viewchatroom = async (req, res) => {
  try {
    const chatroom = await Chatroom.find();
    res
      .status(200)
      .json({ status: true, message: "Data fetched successfully!", chatroom });
    return chatroom;
  } catch (error) {
    console.log(error);
    logger.error(error)
    res.status(500).json({ status: false, message: error.message });
  }
};

//view specific chatroom
const viewspeceficchatroom = async (req, res) => {
  const chatroomId = req.params.id;

  // Validate chatroomId format
  // if (!mongoose.Types.ObjectId.isValid(chatroomId)) {
  //   return res
  //     .status(400)
  //     .json({ status: false, message: "Invalid chatroom ID format" });
  // }

  try {
    if (req.query.populate === "true") {
      const chatroom = await Chatroom.findById(chatroomId)
        .populate("members_id", "username profile")
        .lean();

      if (!chatroom) {
        return res
          .status(404)
          .json({ status: false, message: "chatroom not found" });
      }

      chatroom.members_id = chatroom.members_id.map(
        ({ _id, username, profile }) => ({
          _id,
          username,
          profile: profile,
        })
      );

      res
        .status(200)
        .json({ status: true, message: "Data fetched successfully", chatroom });
    } else {
      const chatroom = await Chatroom.findById(chatroomId);
      if (!chatroom) return next(new ErrorHandler("Chat not found", 404));

      res
        .status(200)
        .json({ status: true, message: "Data fetched successfully", chatroom });
    }
  } catch (error) {
    console.error("Error:", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

const viewMyChatroom = async (req, res, next) => {
  try {
    const chats = await Chatroom.find({ members_id: req.user.id }).populate(
      "members_id",
      "username profile"
    );

    const transformedChats = chats.map(({ _id, name, members_id }) => {
      const otherMember = getOtherMember(members_id, req.user.id);

      return {
        _id,
        profile: otherMember.profile,
        name: otherMember.username,
        members_id: members_id.reduce((prev, curr) => {
          if (curr._id.toString() !== req.user.id.toString()) {
            prev.push(curr._id);
          }
          return prev;
        }, []),
      };
    });

    return res.status(200).json({
      success: true,
      message: "chatroom fetched succesfully",
      result: transformedChats,
    });
  } catch (error) {
    console.log("Error: ", error);
    logger.error(error)
    next(error);
  }
};

//update chatroom
const updatechatroom = async (req, res) => {
  const chatroomId = req.params.id;
  const updateData = req.body;

  // Validate chatroomId format
  if (!mongoose.Types.ObjectId.isValid(chatroomId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid chatroom Id format" });
  }
  try {
    const updatechatroom = await Chatroom.findByIdAndUpdate(
      chatroomId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatechatroom) {
      return res
        .status(404)
        .json({ status: false, message: "chatroom not found" });
    }
    res.status(200).json({
      status: true,
      message: "Data updated successfully",
      updatechatroom,
    });
  } catch (error) {
    console.log("Error: ", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal sever error" });
  }
};

//delete chatroom
const deletechatroom = async (req, res) => {
  let chatroomId = req.params.id;

  // Validate chatroomId format
  if (!mongoose.Types.ObjectId.isValid(chatroomId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid chatroom Id format" });
  }
  try {
    const deletechatroom = await Chatroom.findByIdAndDelete(chatroomId);
    if (!deletechatroom) {
      return null;
    }
    res
      .status(200)
      .json({ status: true, message: "chatroom deleted successfully" });
    return deletechatroom;
  } catch (error) {
    console.log("Error; ", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  createchatroom,
  viewchatroom,
  viewspeceficchatroom,
  updatechatroom,
  deletechatroom,
  viewMyChatroom,
};
