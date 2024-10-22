const Swap = require("../../models/datavalidation/swap");
const Items = require("../../models/datavalidation/item");
const User = require("../../models/datavalidation/user");
const Rating = require("../../models/datavalidation/rating");
const Wishlist = require("../../models/datavalidation/wishlist");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Messages = require("../../models/datavalidation/message");
const { sendEmail } = require("../auth/index");
const { ErrorHandler, emitEvent } = require("../../utils/utility");
const { OPEN_RATING_MODAL } = require("../../constants/events");
const Chatroom = require("../../models/datavalidation/chatroom");
const logger = require("../../utils/logger");

//make swap
const makeswap = async (req, res, next) => {
  try {
    const { items, id, chatId } = req.body;
    // validate the message id
    if (
      !mongoose.Types.ObjectId.isValid(id) &&
      !mongoose.Types.ObjectId.isValid(chatId)
    ) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid Message ID format" });
    }

    const chat = await Chatroom.findById(chatId);
    if (!chat) return next(new ErrorHandler("Chatroom not found", 404));

    // fetch user id and eco-friendly from items
    const itemDocs = await Items.find({ _id: { $in: items } })
      .select("user_id eco_friendly name")
      .lean();

    const userPoints = {};

    // calculate points based on eco-friendly item
    itemDocs.forEach((item) => {
      const userId = item.user_id.toString();
      if (!userPoints[userId]) {
        userPoints[userId] = 0;
      }
      userPoints[userId] += item.eco_friendly ? 5 : 2;
    });

    // create a new swap with the barters and items
    const result = await new Swap({
      barters: Object.keys(userPoints),
      items: items,
    }).save();

    // handle gamification
    for (const userId in userPoints) {
      const pointsToAdd = userPoints[userId];

      // update user's points
      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { points: pointsToAdd } },
        { new: true, lean: true }
      );

      // calculate badges and level
      const totalBadges = Math.floor(user.points / 25);
      const newLevel = Math.floor(totalBadges / 5);

      // update user badges and level
      await User.findByIdAndUpdate(
        userId,
        { badges: totalBadges, level: newLevel },
        { lean: true }
      );
    }

    // update status of items in swap
    const updatedItems = await Promise.all(
      items.map((itemId) =>
        Items.findByIdAndUpdate(
          itemId,
          { status: "Unavailable", selling_status: "sold" },
          { new: true, lean: true }
        )
      )
    );

    // update the message
    const message = await Messages.findByIdAndUpdate(
      id,
      { proposal_status: "sold" },
      { new: true, runValidators: true, lean: true }
    );

    // users with swapped items in their wishlist
    const wishlistedUsers = await Wishlist.find({ item_id: { $in: items } })
      .populate("user_id") // Populate user details
      .lean();

    // send email to users
    if (wishlistedUsers && wishlistedUsers.length > 0) {
      wishlistedUsers.forEach(async (wishlist) => {
        const user = wishlist.user_id;
        const swappedItem = await Items.findById(wishlist.item_id); // specific swapped item
        await sendEmail(user._id, [swappedItem]);
      });
    }

    emitEvent(req, OPEN_RATING_MODAL, chat.members_id, {
      openRatingModal: true,
    });

    res.status(200).json({
      status: true,
      message: "Items swapped successfully!",
      result: result.toObject(),
    });
  } catch (error) {
    logger.error(error)
    console.error("Error: ", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

//view swaps
const viewswaps = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find swaps where the userId is in the barters array
    const swaps = await Swap.find({ barters: userId })
      .populate({
        path: "items",
        populate: {
          path: "user_id",
          select: "username",
        },
      })
      .sort({ createdAt: -1 });

    if (!swaps.length) {
      return res
        .status(404)
        .json({ status: false, message: "No swaps found for this user" });
    }

    res
      .status(200)
      .json({ status: true, message: "Swaps found", result: swaps });
  } catch (error) {
    logger.error(error)
    console.log("Error: ", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

//rate user
const rateuser = async (req, res) => {
  const userId = req.user.id;

  // Validate userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid user ID format" });
  }

  try {
    // Create and save the rating
    const rating = new Rating({
      user_id: req.body.user_id,
      sender_id: userId,
      rating: req.body.rating,
      description: req.body.description,
    });

    await rating.save();

    // Update the average rating for the rated user
    const ratedUserId = req.body.user_id;
    const ratings = await Rating.find({ user_id: ratedUserId });
    const averageRating =
      ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length;

    await User.findByIdAndUpdate(
      ratedUserId,
      { average_rating: averageRating },
      { new: true }
    );

    res
      .status(200)
      .json({ status: true, message: "Thank you for rating", result: rating });
  } catch (error) {
    console.error("Error:", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// recommendation swaps  price validation
const validateNumber = (value) => {
  const number = Number(value);
  return !isNaN(number) && isFinite(number);
};
//function
const recommendSwaps = async (req, res) => {
  try {
    let userId = req.user.id;
    // Fetch previous swaps for the user
    const swaps = await Swap.find({ barters: userId }).populate({
      path: "items",
      select:
        "name description images tags eco_friendly recycleable condition status price selling_status location",
    });

    if (!swaps.length) {
      return []; // No recommendations if no previous swaps
    }

    // Extract attributes from previous swaps
    const items = swaps.map((swap) => swap.items);
    const categories = items.map((item) => item.category_id).filter(Boolean);
    const tags = items.flatMap((item) => item.tags).filter(Boolean);
    const conditions = items.map((item) => item.condition).filter(Boolean);
    const priceRanges = items
      .map((item) => item.price)
      .filter((value) => validateNumber(value));

    // Ensure valid minPrice and maxPrice
    const minPrice = priceRanges.length ? Math.min(...priceRanges) : 0;
    const maxPrice = priceRanges.length
      ? Math.max(...priceRanges)
      : Number.MAX_VALUE;

    // Build the user profile
    const userProfile = {
      categories: [...new Set(categories)],
      tags: [...new Set(tags)],
      minPrice,
      maxPrice,
      conditions: [...new Set(conditions)],
    };
    // Find items similar to user's profile
    const recommendedItems = await Items.find({
      $or: [
        { category_id: { $in: userProfile.categories } },
        { tags: { $in: userProfile.tags } },
        { price: { $gte: userProfile.minPrice, $lte: userProfile.maxPrice } },
        { condition: { $in: userProfile.conditions } },
      ],
      user_id: { $ne: userId }, // Exclude the user's own items
    }).limit(10); // Limit the number of recommendations

    return recommendedItems;
  } catch (error) {
    logger.error(error)
    console.error("Error recommending swaps:", error);
    return [];
  }
};
const getRecommendedSwaps = async (req, res) => {
  try {
    const userId = req.user.id;
    const recommendations = await recommendSwaps(userId);

    res.status(200).json({
      status: true,
      message: "Recommendations found",
      recommendations,
    });
  } catch (error) {
    console.error("Error:", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = {
  makeswap,
  viewswaps,
  rateuser,
  getRecommendedSwaps,
};
