const mongoose = require("mongoose");
const Items = require("../../models/datavalidation/item");
const User = require("../../models/datavalidation/user");
const Category = require("../../models/datavalidation/category");
const logger = require("../../utils/logger");
const { ObjectId } = require('mongodb');

// home page api
const homepage = async (req, res) => {
  let userId = req.user.id
  try {
    // Top 3 users by level
    const topUsers = await User.aggregate([
      { $sort: { points: -1 } }, // Sort by level in descending order
      { $limit: 3 }, // Limit to top 3 users
      {
        $project: {
          username: 1,
          points: 1,
          level: 1,
          average_rating: 1,
          badges: 1,
          profile: 1,
        },
      },
    ]);

    // Top 16 rated products
    const topRatedProducts = await Items.aggregate([
      {
        $match: {
          $and: [
            { user_id: { $ne: new ObjectId(userId) } }, 
            { selling_status: { $ne: "sold" } }
          ]
        }
      }, 
      { $sort: { average_rating: -1 } }, // Sort by rating in descending order
      { $limit: 16 }, // Limit the result to 16 items
      {
        $lookup: {
          from: "usermasters", // The collection where user data is stored
          localField: "user_id", // The field in Items that references the user
          foreignField: "_id", // The field in the 'users' collection that matches user_id
          as: "user_id", // Output array field containing the matching user document(s)
        },
      },
      {
        $unwind: "$user_id", // To convert the array into a single document
      },
      {
        $project: {
          name: 1,
          description: 1,
          images: 1,
          "user_id.username": 1, // Select only the username from user_id
          "user_id._id": 1, // Include user ID
          "user_id.profile": 1, // Include user profile
          "user_id.average_rating": 1, // Include user average rating
        },
      },
    ]);

    // Newly added categories
    const categories = await Category.aggregate([
      { $sort: { _id: -1 } }, // Sort by newest first
      { $limit: 10 }, // Limit to 16 top-rated products
      {
        $project: {
          category: 1,
          image: 1,
        },
      },
    ]);

    // Return response
    res.status(200).json({
      status: true,
      message: "Data fetched successfully",
      topUsers,
      topRatedProducts,
      categories,
    });
  } catch (error) {
    logger.error(error)
    res.status(500).json({
      status: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = { homepage };
