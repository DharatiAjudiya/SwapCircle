const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Wishlist = require("../../models/datavalidation/wishlist");
const Items = require("../../models/datavalidation/item");
const { sendNotification } = require("../auth/index");
const logger = require("../../utils/logger");

//add item to wishlist
const additem = async (req, res, next) => {
  let itemId = req.params.id;
  let userId = req.user.id;
  try {

    const existingItem = await Wishlist.find({$and: [{user_id: userId}, {item_id: itemId}]})
     if(existingItem.length > 0){
      return res.status(200).json({status:true, message: "Item already added to wishlist!"})
     }

    const wishlist = new Wishlist({
      item_id: itemId,
      user_id: userId,
    });

    await wishlist.save();

    res
      .status(200)
      .json({ status: true, message: "Item added to wishlist", wishlist });
  } catch (error) {
    console.log("Error: ", error);
    logger.error(error)
    res.status(500).json({ status: false, message: error.message });
  }
};

//view wishlist item
const viewwishlistitem = async (req, res) => {
  const userId = req.user.id;

  // Validate userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid user ID format" });
  }

  try {
    const wishlistItems = await Wishlist.find({ user_id: userId }).populate({
      path: "item_id",
      populate: {
        path: "user_id",
        model: "usermaster",
        select: "username profile",
      },
    });
    if (!wishlistItems) {
      return res
        .status(404)
        .json({ status: false, message: "Wishlist is empty" });
    }
    // // extract itemid
    // const itemIds = wishlistItems.map((wishlistItem) => wishlistItem.item_id);
    // //fetch items
    // const items = await Items.find({ _id: { $in: itemIds } });
    res.status(200).json({
      status: true,
      message: "Data fetched successfully",
      result: wishlistItems,
    });
  } catch (error) {
    console.error("Error:", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//remove item from wishlist
const removeitem = async (req, res) => {
  const { id: itemId } = req.params;
  const userId = req.user.id;

  try {
    const removedItem = await Wishlist.findOneAndDelete({
      item_id: itemId,
      user_id: userId,
    });

    if (!removedItem) {
      return res
        .status(404)
        .json({ status: false, message: "Item not found in wishlist" });
    }

    res.status(200).json({
      status: true,
      message: "Item removed from wishlist",
      removedItem,
    });
  } catch (error) {
    console.log("Error:", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//available item of wishlist
const checkWishlistItemStatus = async (req, res) => {
  const userId = req.user.id;

  // Validate userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid user ID format" });
  }

  try {
    // Fetch wishlist items for the user
    const wishlistItems = await Wishlist.find({ user_id: userId });

    if (wishlistItems.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Wishlist is empty" });
    }

    // Extract item IDs from the wishlist
    const itemIds = wishlistItems.map((wishlistItem) => wishlistItem.item_id);

    // Fetch details of items using the item IDs
    const itemsDetails = await Items.find({ _id: { $in: itemIds } });

    // Array to hold items that have become available
    const availableItems = [];

    // Check the status of each item
    itemsDetails.forEach((item) => {
      if (item.status === "Available") {
        const wishlistItem = wishlistItems.find(
          (wlItem) => wlItem.item_id.toString() === item._id.toString()
        );
        if (wishlistItem.previous_status !== "Available") {
          availableItems.push(item); // Add item to availableItems array

          // Optionally, update the wishlist item's status
          wishlistItem.previous_status = "Available";
          wishlistItem.save(); // Save the updated status
        }
      }
    });

    // If there are any available items, send notifications
    if (availableItems.length > 0) {
      await sendNotification(userId, availableItems);

      return res.status(200).json({
        status: true,
        message: "Notification sent for available items",
        availableItems,
      });
    }

    // If no items became available, just respond with a success message
    res.status(200).json({
      status: true,
      message: "No new available items in your wishlist",
    });
  } catch (error) {
    console.error("Error:", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  additem,
  viewwishlistitem,
  checkWishlistItemStatus,
  removeitem,
};
