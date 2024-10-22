const Messages = require("../../models/datavalidation/message");
const logger = require("../../utils/logger");
const mongoose = require("mongoose");
const { chatUpload } = require("../../models/upload");
const Chatroom = require("../../models/datavalidation/chatroom");
const { ErrorHandler, emitEvent } = require("../../utils/utility");
const User = require("../../models/datavalidation/user");
const {
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  OPEN_RATING_MODAL,
} = require("../../constants/events");
const { v4: uuid } = require("uuid");
const Items = require("../../models/datavalidation/item");

//create messages
const createmessages = async (req, res, next) => {
  chatUpload(req, res, async function (err) {
    if (err) {
      console.log("Multer Error: ", err);
      return res.status(500).json({ status: false, message: err.message });
    }
    try {
      const chatattachments = req.files.map((file) => file.filename);
      const message = new Messages({
        attachments: chatattachments,
        sender_id: req.body.sender_id,
        chatroom_id: req.body.chatroom_id,
      });

      await message.save();

      res.status(200).json({
        status: true,
        message: "message inserted successfully",
        message,
      });
    } catch (error) {
      console.log("Error: ", error);
      logger.error(error)
      res.status(500).json({ status: false, message: error.message });
    }
  });
};

//view messages
const viewmessages = async (req, res) => {
  try {
    const message = await Messages.find();
    res
      .status(200)
      .json({ status: true, message: "Data fetched successfully!", message });
    return message;
  } catch (error) {
    console.log(error);
    logger.error(error)
    res.status(500).json({ status: false, message: error.message });
  }
};

//view messages
const viewMyMessages = async (req, res, next) => {
  try {
    const chatId = req.params.id;
    const { page = 1 } = req.query;

    const resultPerPage = 20;
    const skip = (page - 1) * resultPerPage;

    const chatroom = await Chatroom.findById(chatId);

    if (!chatroom) return next(new ErrorHandler("Chatroom not found", 404));

    if (!chatroom.members_id.includes(req.user.id.toString()))
      return next(
        new ErrorHandler("You are not allowed to access this chat", 403)
      );

    const [messages, totalMessagesCount] = await Promise.all([
      Messages.find({ chatroom_id: chatId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(resultPerPage)
        .populate("sender_id", "username")
        .populate({
          path: "item_id",
          populate: {
            path: "user_id",
            model: "usermaster",
            select: "username profile",
          },
        })
        .lean(),
      Messages.countDocuments({ chatroom_id: chatId }),
    ]);

    const totalPages = Math.ceil(totalMessagesCount / resultPerPage) || 0;

    res.status(200).json({
      status: true,
      message: "Data fetched successfully!",
      messages: messages.reverse(),
      totalPages,
    });
  } catch (error) {
    console.log(error);
    logger.error(error)
    res.status(500).json({ status: false, message: error.message });
  }
};

//view specific message
const viewspeceficmessage = async (req, res) => {
  const messageId = req.params.id;

  // Validate messageId format
  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid message Id format" });
  }

  try {
    const message = await Messages.findById(messageId);
    if (!message) {
      return res
        .status(404)
        .json({ status: false, message: "message not found" });
    }
    res
      .status(200)
      .json({ status: true, message: "Data fetched successfully", message });
  } catch (error) {
    console.error("Error:", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//update message
const updatemessage = async (req, res) => {
  const messageId = req.params.id;
  const updateData = req.body;

  // Validate messageId format
  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid message Id format" });
  }
  try {
    const updatemessage = await Messages.findByIdAndUpdate(
      messageId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatemessage) {
      return res
        .status(404)
        .json({ status: false, message: "message not found" });
    }
    res.status(200).json({
      status: true,
      message: "Data updated successfully",
      updatemessage,
    });
  } catch (error) {
    console.log("Error: ", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal sever error" });
  }
};

//delete chatroom
const deletemessage = async (req, res) => {
  let messageId = req.params.id;

  // Validate messageId format
  if (!mongoose.Types.ObjectId.isValid(messageId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid message Id format" });
  }
  try {
    const deletemessage = await Messages.findByIdAndDelete(messageId);
    if (!deletemessage) {
      return null;
    }
    res
      .status(200)
      .json({ status: true, message: "message deleted successfully" });
    return deletemessage;
  } catch (error) {
    console.log("Error; ", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

const sendAttachments = async (req, res, next) => {
  try {
    chatUpload(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          status: false,
          message: "Image upload failed",
          error: err.message,
        });
      }

      const { chatId } = req.body;

      const files = req.files || [];

      if (files.length < 1)
        return next(new ErrorHandler("Please Upload Attachments", 400));

      if (files.length > 5)
        return next(new ErrorHandler("Files Can't be more than 5", 400));

      const [chat, me] = await Promise.all([
        Chatroom.findById(chatId),
        User.findById(req.user.id, "username"),
      ]);

      if (!chat) return next(new ErrorHandler("Chatroom not found", 404));

      if (files.length < 1)
        return next(new ErrorHandler("Please provide attachments", 400));

      //   Upload files here
      const attachments = req.files.map((file) => file.filename);

      const messageForRealTime = {
        content: "",
        attachments,
        id: uuid(),
        chatroom_id: chatId,
        sender_id: {
          _id: me._id,
          username: me.username,
        },
        createdAt: new Date().toISOString(),
      };

      const messageForDB = {
        content: "",
        attachments,
        sender_id: me._id,
        chatroom_id: chatId,
      };

      const message = await Messages.create(messageForDB);

      emitEvent(req, NEW_MESSAGE, chat.members_id, {
        chatId,
        message: messageForRealTime,
      });

      emitEvent(req, NEW_MESSAGE_ALERT, chat.members_id, { chatId });

      return res.status(200).json({
        success: true,
        message,
      });
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const sendItems = async (req, res, next) => {
  try {
    const { chatId, item_id } = req.body;

    const [chat, me] = await Promise.all([
      Chatroom.findById(chatId),
      User.findById(req.user.id, "username"),
    ]);

    if (!chat) return next(new ErrorHandler("Chatroom not found", 404));

    const item = await Items.find({
      _id: {
        $in: item_id,
      },
    }).populate("user_id", "username profile");

    const messageForDB = {
      content: "",
      item_id: item_id,
      sender_id: me._id,
      chatroom_id: chatId,
    };

    const message = await Messages.create(messageForDB);

    const messageForRealTime = {
      content: "",
      item_id: item,
      _id: message._id.toString(),
      chatroom_id: chatId,
      sender_id: {
        _id: me._id,
        username: me.username,
      },
      createdAt: new Date().toISOString(),
    };

    emitEvent(req, NEW_MESSAGE, chat.members_id, {
      chatId,
      message: messageForRealTime,
    });

    emitEvent(req, NEW_MESSAGE_ALERT, chat.members_id, { chatId });

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (err) {
    logger.error(error)
    console.error(err);
    next(err);
  }
};

//update category status
const denyProposal = async (req, res) => {
  const messageId = req.params.id;
  const { chatId } = req.body;
  let status = "deny";

  // Validate messageId format
  if (
    !mongoose.Types.ObjectId.isValid(messageId) ||
    !mongoose.Types.ObjectId.isValid(chatId)
  ) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid Message ID format" });
  }
  try {
    const chat = await Chatroom.findById(chatId);
    if (!chat) return next(new ErrorHandler("Chatroom not found", 404));

    const message = await Messages.findByIdAndUpdate(
      messageId,
      { proposal_status: status },
      { new: true, runValidators: true }
    );

    if (!message) {
      return res
        .status(404)
        .json({ status: false, message: "Message not found" });
    }

    emitEvent(req, OPEN_RATING_MODAL, chat.members_id, {
      openRatingModal: false,
    });

    res.status(200).json({
      status: false,
      message: "Proposal denied",
    });
  } catch (error) {
    logger.error(error)
    console.log("Error: ", error);
    res.status(500).json({ status: false, message: "Internal sever error" });
  }
};

module.exports = {
  createmessages,
  viewmessages,
  viewMyMessages,
  viewspeceficmessage,
  updatemessage,
  deletemessage,
  sendAttachments,
  sendItems,
  denyProposal,
};
