const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const Items = require("../../models/datavalidation/item");
const Users = require("../../models/datavalidation/user");
const Swap = require("../../models/datavalidation/swap");
const Category = require("../../models/datavalidation/category");
const { itemUpload } = require("../../models/upload");
const { sendAvailabilityEmail } = require("../auth/index");
const FilePath = path.join(__dirname, "unsuccessfulQueries.json");
const logger = require("../../utils/logger");

//create item
const createitem = async (req, res, next) => {
  let userId = req.user.id;
  itemUpload(req, res, async function (err) {
    if (err) {
      logger.error(error)
      console.log("Multer Error: ", err);
      return res
        .status(500)
        .json({ status: false, message: err.split(": ")[1] });
    }

    try {
      const { tags, condition, location, price } = req.body;
      let jsonLocation = JSON.parse(location);
      let jsonTags = JSON.parse(tags);
      let jsonPrice = JSON.parse(price);
      const itemImages = req.files.map((file) => file.filename);

      const item = new Items({
        category_id: req.body.category_id,
        user_id: userId,
        name: req.body.name,
        description: req.body.description,
        images: itemImages,
        tags: jsonTags,
        eco_friendly: req.body.eco_friendly,
        recyclable: req.body.recyclable,
        condition: condition,
        status: true,
        price: jsonPrice,
        selling_status: "sell",
        location: jsonLocation,
      });
      await item.save();

      res
        .status(200)
        .json({ status: true, message: "Items inserted successfully", item });
    } catch (error) {
      console.log("Error: ", error);
      res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  });
};

//view all items
const viewitem = async (req, res, next) => {
  try {
    let userId = req.user.id;

    let result = await Items.find({
      user_id: { $ne: userId },
      selling_status: { $ne: "sold" },
    })
      .populate("category_id", "category")
      .populate("user_id", "username profile average_rating");

    res
      .status(200)
      .json({ status: true, message: "Data fetched successfully!", result });
  } catch (error) {
    logger.error(error)
    console.log("Error fetching items:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

//view specific item
const viewspeceficitem = async (req, res, next) => {
  const itemId = req.params.id;

  // Validate itemId format
  // Uncomment if you need ID validation
  // if (!mongoose.Types.ObjectId.isValid(itemId)) {
  //   return res
  //     .status(400)
  //     .json({ status: false, message: "Invalid item ID format" });
  // }

  try {
    const result = await Items.findById(itemId)
      .populate("category_id", "category")
      .populate("user_id", "username profile average_rating level badges");

    if (!result) {
      return res.status(404).json({ status: false, message: "Item not found" });
    }
    res
      .status(200)
      .json({ status: true, message: "Data fetched successfully", result });
  } catch (error) {
    logger.error(error)
    console.error("Error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

//update item
const updateitem = async (req, res, next) => {
  const itemId = req.params.id;
  const updateData = req.body;

  try {
    // Fetch the current item and its images
    const result = await Items.findById(itemId);

    if (!result) {
      return res.status(404).json({ status: false, message: "Item not found" });
    }

    // Parse location, tags, and price if they are present in the request body
    if (updateData.location) {
      try {
        updateData.location = JSON.parse(updateData.location);
      } catch (error) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid JSON format for location" });
      }
    }

    if (updateData.tags) {
      try {
        updateData.tags = JSON.parse(updateData.tags);
      } catch (error) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid JSON format for tags" });
      }
    }

    if (updateData.price) {
      try {
        updateData.price = JSON.parse(updateData.price);
      } catch (error) {
        return res
          .status(400)
          .json({ status: false, message: "Invalid JSON format for price" });
      }
    }

    // Handle existing images from the database
    let currentImages = result.images || [];

    // Check if there are new files to upload
    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map((file) => file.filename); // Save the uploaded file names
    }

    // Determine which images to retain based on the ones sent in the updateData
    let retainedImages = [];
    if (updateData.images && Array.isArray(updateData.images)) {
      retainedImages = currentImages.filter((image) =>
        updateData.images.includes(image)
      );
    }

    // Ensure that at least one image is retained if there were existing images
    if (currentImages.length === 1 && retainedImages.length === 0) {
      retainedImages = currentImages; // Keep the only existing image if no new images are retained
    }

    // Images to keep: retained from the original images + newly uploaded
    const finalImages = [...retainedImages, ...uploadedImages];

    // Delete images that are no lnger needed
    const imagesToDelete = currentImages.filter(
      (image) => !finalImages.includes(image)
    );
    imagesToDelete.forEach((image) => {
      const imagePath = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        "items",
        image
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Remove old images from the server
      }
    });

    // Update the data object with the final images array
    updateData.images = finalImages;

    // Perform the update operation
    const updatedItem = await Items.findByIdAndUpdate(itemId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ status: false, message: "Item not found" });
    }

    res.status(200).json({
      status: true,
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    logger.error(error)
    console.log("Error: ", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

//delete item
const deleteitem = async (req, res, next) => {
  let itemId = req.params.id;

  // Validate itemId format
  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid item ID format" });
  }

  try {
    const deleteitems = await Items.findByIdAndDelete(itemId);

    if (!deleteitems) {
      return res.status(404).json({ status: false, message: "Item not found" });
    }

    // Check if images exist and delete them
    if (deleteitems.images && Array.isArray(deleteitems.images)) {
      // If images are stored as an array, loop through and delete each one
      for (const image of deleteitems.images) {
        const imagePath = path.resolve(
          __dirname,
          "../../",
          "uploads",
          "items",
          image
        );

        // Asynchronous delete operation for each image
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.log("Error deleting image:", err);
          } else {
            // console.log(`Image ${image} deleted successfully`);
          }
        });
      }
    } else if (deleteitems.images && typeof deleteitems.images === "string") {
      // Handle case where images is a single string
      const imagePath = path.resolve(
        __dirname,
        "../../",
        "uploads",
        "items",
        deleteitems.images
      );

      fs.unlink(imagePath, (err) => {
        if (err) {
          console.log("Error deleting image:", err);
        } else {
          console.log("Image deleted successfully");
        }
      });
    }

    res
      .status(200)
      .json({ status: true, message: "Item deleted successfully" });
  } catch (error) {
    logger.error(error)
    console.log("Error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

//item listing by category
const itembycategory = async (req, res, next) => {
  const categoryId = req.params.id;
  const userId = req.user.id;

  // Validate categoryId format
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid category ID format" });
  }

  try {
    const result = await Items.find({
      category_id: categoryId,
      user_id: { $ne: userId },
      selling_status: { $ne: "sold" },
    })
      .populate("category_id", "category")
      .populate("user_id", "username profile average_rating");
    if (!result) {
      return res
        .status(404)
        .json({ status: false, message: "item not found for this category" });
    }
    res
      .status(200)
      .json({ status: true, message: "Data fetched successfully", result });
  } catch (error) {
    console.error("Error:", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

//item listing by filter
const itemlisting = async (req, res, next) => {
  const { page = 1, search = "" } = req.query;
  const resultPerPage = 12;
  const skip = (page - 1) * resultPerPage;
  const {
    tags = [],
    condition = [],
    env_condition = [],
    rating = undefined,
    filterby = "NONE",
    lat,
    lng,
    radius = 500,
  } = req.body;

  const userId = req.user.id;

  // Validate location input if provided
  if ((lat || lng) && (typeof lat !== "number" || typeof lng !== "number")) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid latitude or longitude" });
  }

  try {
    // Build the query object
    let query = {
      user_id: { $ne: userId },
      selling_status: { $ne: "sold" },
    };

    // If search query is provided, add regex filter for name
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // Fetch items based on the query and populate user rating
    let items = await Items.find(query).populate("user_id", "average_rating");

    // Apply location-based filtering if lat and lng are provided
    if (lat && lng) {
      items = items.filter((item) => {
        const distance = haversineDistance(
          lat,
          lng,
          item.location.lat,
          item.location.lng
        );
        return distance <= radius;
      });

      if (items.length === 0) {
        return res.status(200).json({
          status: true,
          message: "No items found within the specified radius",
          result: [],
        });
      }
    }

    // If no additional filters are provided, return items after location filter
    if (
      (tags.length === 0 || tags === undefined) &&
      (condition.length === 0 || condition === undefined) &&
      (env_condition.length === 0 || env_condition === undefined) &&
      (rating === undefined || rating === null)
    ) {
      // Apply sorting based on filterby variable
      if (filterby === "NEW") {
        items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (filterby === "RATE_HIGH") {
        items.sort(
          (a, b) =>
            (b.user_id ? b.user_id.average_rating : 0) -
            (a.user_id ? a.user_id.average_rating : 0)
        );
      } else if (filterby === "RATE_LOW") {
        items.sort(
          (a, b) =>
            (a.user_id ? a.user_id.average_rating : 0) -
            (b.user_id ? b.user_id.average_rating : 0)
        );
      }

      let paginatedItems = items.slice(skip, skip + resultPerPage);
      let totalPages = Math.ceil(items.length / resultPerPage) || 0;

      return res.status(200).json({
        status: true,
        message: "Search Initiated",
        result: paginatedItems,
        totalPages,
      });
    }

    // Apply additional filtering conditions (tags, condition, etc.)
    let filteredItems = [...items];
    let tagFilteredItems = [];
    let conditionFilteredItems = [];
    let envConditionFilteredItems = [];
    let ratingFilteredItems = [];

    if (Array.isArray(tags) && tags.length > 0) {
      tagFilteredItems = filteredItems.filter((item) => {
        return tags.some((element) => item.tags.includes(element));
      });
    }

    if (Array.isArray(condition) && condition.length > 0) {
      conditionFilteredItems = filteredItems.filter((item) =>
        condition.includes(item.condition)
      );
    }

    if (Array.isArray(env_condition) && env_condition.length > 0) {
      envConditionFilteredItems = filteredItems.filter((item) =>
        env_condition.some((condition) => item[condition] === true)
      );
    }

    if (rating !== undefined || rating !== null) {
      ratingFilteredItems = filteredItems.filter(
        (item) => item.user_id && item.user_id.average_rating >= rating
      );
    }

    // Combine filtered items uniquely by _id
    const uniqueItems = [
      ...tagFilteredItems,
      ...conditionFilteredItems,
      ...envConditionFilteredItems,
      ...ratingFilteredItems,
    ].reduce((acc, item) => {
      if (!acc.some((existingItem) => existingItem._id.equals(item._id))) {
        acc.push(item);
      }
      return acc;
    }, []);

    // Apply sorting based on filterby variable
    if (filterby === "NEW") {
      uniqueItems.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (filterby === "RATE_HIGH") {
      uniqueItems.sort(
        (a, b) =>
          (b.user_id ? b.user_id.average_rating : 0) -
          (a.user_id ? a.user_id.average_rating : 0)
      );
    } else if (filterby === "RATE_LOW") {
      uniqueItems.sort(
        (a, b) =>
          (a.user_id ? a.user_id.average_rating : 0) -
          (b.user_id ? b.user_id.average_rating : 0)
      );
    }

    if (uniqueItems.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No items found matching the criteria",
        result: [],
      });
    }

    let paginatedItems = uniqueItems.slice(skip, skip + resultPerPage);
    let totalPages = Math.ceil(uniqueItems.length / resultPerPage) || 0;

    return res.status(200).json({
      status: true,
      message: "Search Initiated",
      result: paginatedItems,
      totalPages,
    });
  } catch (error) {
    console.error("Error:", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// haversine formula to find distance
const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const toRadians = (angle) => (Math.PI / 180) * angle;

  const earthRadiusInMeters = 6371e3; // Radius of Earth in meters
  const lat1InRadians = toRadians(lat1);
  const lat2InRadians = toRadians(lat2);
  const deltaLatInRadians = toRadians(lat2 - lat1);
  const deltaLngInRadians = toRadians(lng2 - lng1);

  const a =
    Math.sin(deltaLatInRadians / 2) * Math.sin(deltaLatInRadians / 2) +
    Math.cos(lat1InRadians) *
      Math.cos(lat2InRadians) *
      Math.sin(deltaLngInRadians / 2) *
      Math.sin(deltaLngInRadians / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusInMeters * c; // Distance in meters
};

//item listing by location
const itembylocation = async (req, res, next) => {
  const { lat, lng, radius = 500 } = req.body;

  const userId = req.user.id;

  // Validate input
  if (typeof lat !== "number" || typeof lng !== "number") {
    return res
      .status(400)
      .json({ status: false, message: "Invalid latitude or longitude" });
  }

  try {
    // Fetch items excluding those that are sold and items from the current user
    const items = await Items.find({
      user_id: { $ne: userId },
      selling_status: { $ne: "sold" },
    });

    // Filter items based on distance using the haversine formula
    const filteredItems = items.filter((item) => {
      const distance = haversineDistance(
        lat,
        lng,
        item.location.lat,
        item.location.lng
      );
      return distance <= radius;
    });

    if (filteredItems.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No items found within the specified radius",
      });
    }

    res.status(200).json({
      status: true,
      message: "Items found",
      result: filteredItems,
    });
  } catch (error) {
    logger.error(error)
    console.error("Error fetching items:", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

// item listing by filer and location and category sorting
const itemListingWithSortingAndLocation = async (req, res, next) => {
  const categoryId = req.params.id;
  const { page = 1, search = "" } = req.query;
  const userId = req.user.id;

  const resultPerPage = 12;
  const skip = (page - 1) * resultPerPage;
  const {
    tags = [],
    condition = [],
    env_condition = [],
    rating = undefined,
    filterby = "NONE",
    lat,
    lng,
    radius = 500,
  } = req.body;

  // Validate categoryId format
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid category ID format" });
  }

  // Validate location input if provided
  if ((lat || lng) && (typeof lat !== "number" || typeof lng !== "number")) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid latitude or longitude" });
  }

  try {
    // Build the base query object
    let query = {
      category_id: categoryId,
      user_id: { $ne: userId },
      selling_status: { $ne: "sold" },
    };

    // If search query is provided, add it to the query object
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search on the 'name' field
    }

    // Fetch items from the database with the query
    let items = await Items.find(query).populate("user_id", "average_rating");

    // Apply location-based filtering if lat and lng are provided
    if (lat && lng) {
      items = items.filter((item) => {
        const distance = haversineDistance(
          lat,
          lng,
          item.location.lat,
          item.location.lng
        );
        return distance <= radius;
      });

      if (items.length === 0) {
        return res.status(200).json({
          status: true,
          message: "No items found within the specified radius",
          result: [],
        });
      }
    }

    // If no additional filters are provided, return items after location filter
    if (
      (tags.length === 0 || tags === undefined) &&
      (condition.length === 0 || condition === undefined) &&
      (env_condition.length === 0 || env_condition === undefined) &&
      (rating === undefined || rating === null)
    ) {
      // Apply sorting based on filterby variable
      if (filterby === "NEW") {
        items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else if (filterby === "RATE_HIGH") {
        items.sort(
          (a, b) =>
            (b.user_id ? b.user_id.average_rating : 0) -
            (a.user_id ? a.user_id.average_rating : 0)
        );
      } else if (filterby === "RATE_LOW") {
        items.sort(
          (a, b) =>
            (a.user_id ? a.user_id.average_rating : 0) -
            (b.user_id ? b.user_id.average_rating : 0)
        );
      }

      let paginatedItems = items.slice(skip, skip + resultPerPage);
      let totalPages = Math.ceil(items.length / resultPerPage) || 0;

      return res.status(200).json({
        status: true,
        message: "Search Initiated",
        result: paginatedItems,
        totalPages,
      });
    }

    // Apply additional filtering conditions (tags, condition, env_condition, rating)
    let filteredItems = [...items];
    let tagFilteredItems = [];
    let conditionFilteredItems = [];
    let envConditionFilteredItems = [];
    let ratingFilteredItems = [];

    if (Array.isArray(tags) && tags.length > 0) {
      tagFilteredItems = filteredItems.filter((item) => {
        return tags.some((element) => item.tags.includes(element));
      });
    }

    if (Array.isArray(condition) && condition.length > 0) {
      conditionFilteredItems = filteredItems.filter((item) =>
        condition.includes(item.condition)
      );
    }

    if (Array.isArray(env_condition) && env_condition.length > 0) {
      envConditionFilteredItems = filteredItems.filter((item) =>
        env_condition.some((condition) => item[condition] === true)
      );
    }

    if (rating !== undefined || rating !== null) {
      ratingFilteredItems = filteredItems.filter(
        (item) => item.user_id && item.user_id.average_rating >= rating
      );
    }

    // Combine filtered items uniquely by _id
    const uniqueItems = [
      ...tagFilteredItems,
      ...conditionFilteredItems,
      ...envConditionFilteredItems,
      ...ratingFilteredItems,
    ].reduce((acc, item) => {
      if (!acc.some((existingItem) => existingItem._id.equals(item._id))) {
        acc.push(item);
      }
      return acc;
    }, []);

    // Apply sorting based on filterby variable
    if (filterby === "NEW") {
      uniqueItems.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (filterby === "RATE_HIGH") {
      uniqueItems.sort(
        (a, b) =>
          (b.user_id ? b.user_id.average_rating : 0) -
          (a.user_id ? a.user_id.average_rating : 0)
      );
    } else if (filterby === "RATE_LOW") {
      uniqueItems.sort(
        (a, b) =>
          (a.user_id ? a.user_id.average_rating : 0) -
          (b.user_id ? b.user_id.average_rating : 0)
      );
    }

    if (uniqueItems.length === 0) {
      return res.status(200).json({
        status: true,
        message: "No items found matching the criteria",
        result: [],
      });
    }

    let paginatedItems = uniqueItems.slice(skip, skip + resultPerPage);
    let totalPages = Math.ceil(uniqueItems.length / resultPerPage) || 0;

    return res.status(200).json({
      status: true,
      message: "Search Initiated",
      result: paginatedItems,
      totalPages,
    });
  } catch (error) {
    console.error("Error:", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

//refer item points
const Referitempoint = async (req, res, next) => {
  let senderId = req.user.id;
  const { receiverId, itemId } = req.body;

  // Validate IDs
  if (
    !mongoose.Types.ObjectId.isValid(senderId) ||
    !mongoose.Types.ObjectId.isValid(receiverId) ||
    !mongoose.Types.ObjectId.isValid(itemId)
  ) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid ID format" });
  }

  try {
    // Optionally, validate that the item exists
    const item = await Items.findById(itemId);
    if (!item) {
      return res.status(404).json({ status: false, message: "Item not found" });
    }

    // Find and update the referring user’s points
    const referringUser = await Users.findById(senderId);
    if (!referringUser) {
      return res
        .status(404)
        .json({ status: false, message: "Referring user not found" });
    }

    // Increment points (assuming 1 point for each referral)
    referringUser.points += 1;
    await referringUser.save();

    console.log(
      `Item ${itemId} referred by user ${senderId} to user ${receiverId}`
    );

    res.status(200).json({
      status: true,
      message: "Referral processed successfully",
      points: referringUser.points,
    });
  } catch (error) {
    logger.error(error)
    console.error("Error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

//update item status
const updateItemstatus = async (req, res, next) => {
  let itemId = req.params.id;

  if (!itemId) {
    return res
      .status(400)
      .json({ status: false, message: "Item ID is required" });
  }
  try {
    // Find the SwapMaster document and check if itemId exists in the items array
    const swapMaster = await Swap.findOne({ items: itemId });

    if (!swapMaster) {
      return res
        .status(404)
        .json({ status: false, message: "Item not found in swap master" });
    }

    // Update the status of the item to "sold"
    const updatedItem = await Items.findByIdAndUpdate(
      itemId,
      { status: "Unavailable" },
      { selling_status: "sold" },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({
        status: false,
        message: "Item not found or could not update status",
      });
    }

    res.status(200).json({
      status: true,
      message: "Item status updated successfully",
      updatedItem,
    });
  } catch (error) {
    console.error("Error: ", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

//category wise data filtering
const categorysorting = async (req, res, next) => {
  const categoryId = req.params.id;
  const filterby = req.body.filterby;
  const userId = req.user.id;

  // Validate categoryId format
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid category ID format" });
  }

  try {
    let sort = { _id: -1 }; // Default sorting by ID in descending order

    if (filterby === "low to high") {
      sort = { price: 1 }; // Sort price low to high
    } else if (filterby === "high to low") {
      sort = { price: -1 }; // Sort price high to low
    } else if (filterby === "newly added") {
      sort = { created_at: -1 }; // Sort by newly added items
    } else if (filterby === "recycleable") {
      const recycleableitem = await Items.find({
        $and: [
          { category_id: categoryId },
          { recycleable: true },
          { user_id: { $ne: userId } },
          { selling_status: { $ne: "sold" } },
        ],
      });
      if (recycleableitem.lenght === 0) {
        return res
          .status(404)
          .json({ status: false, message: "No recycleable items found" });
      }
      return res.status(200).json({
        status: true,
        message: "data fetched successfully",
        recycleableitem,
      });
    } else if (filterby === "ecofriendly") {
      const ecofriendlyitem = await Items.find({
        $and: [
          { category_id: categoryId },
          { eco_friendly: true },
          { user_id: { $ne: userId } },
          { selling_status: { $ne: "sold" } },
        ],
      });
      if (ecofriendlyitem.lenght === 0) {
        return res
          .status(404)
          .json({ status: false, message: "No ecofriendly items found" });
      }
      return res.status(200).json({
        status: true,
        message: "data fetched successfully",
        ecofriendlyitem,
      });
    }

    // Fetch items by categoryId and apply sorting
    const result = await Items.find({ category_id: categoryId }).sort(sort);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No items found for this category" });
    }

    return res
      .status(200)
      .json({ status: true, message: "Data fetched successfully", result });
  } catch (error) {
    console.error("Error:", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

//view specefic user's item
const viewCurrentUseritem = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const items = await Items.find({
      user_id: userId,
      selling_status: { $ne: "sold" },
    }).populate("user_id", "username profile");

    if (items.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No items found for this user" });
    }

    res.status(200).json({
      status: true,
      message: "Data fetched successfully",
      result: items,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

//view specefic user's item
const viewspeceficUseritem = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const items = await Items.find({
      user_id: userId,
      selling_status: { $ne: "sold" },
    })
      .populate("category_id", "category")
      .populate("user_id", "username profile average_rating");

    if (items.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "No items found for this user" });
    }

    res.status(200).json({
      status: true,
      message: "Data fetched successfully",
      result: items,
    });
  } catch (error) {
    console.error("Error:", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

// Storage object to keep track of unsuccessful search requests
const locationpreferenceitem = async (req, res, next) => {
  let { name, lat, lng, radius = 500 } = req.body;
  let email = req.user.email;

  // Validate input
  if (typeof lat !== "number" || typeof lng !== "number") {
    return res
      .status(400)
      .json({ status: false, message: "Invalid latitude or longitude" });
  }

  try {
    // Use regex to make the item name search case-insensitive if name is provided
    const query = {};
    if (name) {
      query.name = { $regex: name, $options: "i" };
    }

    // Fetch items matching the name
    const items = await Items.find(query);

    // Filter items based on distance using the Haversine formula
    const filteredItems = items.filter((item) => {
      const distance = haversineDistance(
        lat,
        lng,
        item.location.lat,
        item.location.lng
      );
      return distance <= radius;
    });

    if (filteredItems.length === 0) {
      // Create a query object
      const queryData = {
        name,
        lat,
        lng,
        radius,
        email,
        timestamp: new Date(),
      };

      // Save to a file
      const filePath = path.join(__dirname, "unsuccessfulQueries.json");
      let queries = [];
      if (fs.existsSync(filePath)) {
        try {
          const existingData = fs.readFileSync(filePath, "utf8");
          if (existingData.trim()) {
            queries = JSON.parse(existingData);
          }
        } catch (parseError) {
          console.error("Error parsing JSON data:", parseError);
        }
      }
      queries.push(queryData);
      fs.writeFileSync(filePath, JSON.stringify(queries, null, 2));

      return res.status(404).json({
        status: false,
        message: "No items found within the specified radius",
      });
    }
    res
      .status(200)
      .json({ status: true, message: "Items found", result: filteredItems });
  } catch (error) {
    console.log(error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

//unsuccessfull querys notification
const processQueries = async (req, res, next) => {
  const FilePath = path.join(__dirname, "unsuccessfulQueries.json"); // Make sure to define FilePath
  if (!fs.existsSync(FilePath)) {
    return res
      .status(404)
      .json({ status: false, message: "No queries to process" });
  }

  let queries = [];
  try {
    const existingData = fs.readFileSync(FilePath, "utf8");
    if (existingData.trim()) {
      queries = JSON.parse(existingData);
    }
  } catch (parseError) {
    console.error("Error parsing JSON data:", parseError);
    return res
      .status(500)
      .json({ status: false, message: "Internal Server Error" });
  }

  const remainingQueries = [];
  const successfulQueries = [];

  for (const query of queries) {
    const { name, lat, lng, radius, email } = query;

    try {
      const items = await Items.find({
        name: { $regex: name, $options: "i" },
      });

      const filteredItems = items.filter((item) => {
        const distance = haversineDistance(
          lat,
          lng,
          item.location.lat,
          item.location.lng
        );
        return distance <= radius;
      });

      if (filteredItems.length > 0) {
        const itemNames = filteredItems.map((item) => item.name);
        // Send email notification
        await sendAvailabilityEmail(email, itemNames);

        successfulQueries.push({
          ...query,
          filteredItems,
        });
      } else {
        remainingQueries.push(query);
      }
    } catch (error) {
      logger.error(error)
      console.error("Error processing query:", error);
      // remainingQueries.push(query); // Ensure unsuccessful queries are kept for further processing
    }
  }

  // Write remaining unsuccessful queries back to the file
  fs.writeFileSync(FilePath, JSON.stringify(remainingQueries, null, 2));

  return res.status(200).json({
    status: true,
    message: "Queries processed successfully.",
    successfulQueries,
  });
};

//global search api
const globalsearch = async (req, res, next) => {
  const search = req.body.search;
  const userId = req.user.id;

  try {
    // Search for category using regex
    const category = await Category.findOne({
      category: { $regex: search, $options: "i" },
    });

    if (category) {
      // Find items in the category that are not sold and not owned by the user
      const items = await Items.find({
        category_id: category._id, // Match items in the found category
        user_id: { $ne: userId },
        selling_status: { $ne: "sold" },
      });

      if (items.length > 0) {
        return res.status(200).json({
          status: true,
          message: "Items found in the category",
          category: category,
          items: items,
        });
      } else {
        return res.status(404).json({
          status: false,
          message: "No items found in this category",
        });
      }
    }

    // Search for items using regex
    const items = await Items.find({
      name: { $regex: search, $options: "i" }, // Case-insensitive search
      user_id: { $ne: userId },
      selling_status: { $ne: "sold" },
    });

    if (items.length > 0) {
      return res.status(200).json({
        status: true,
        message: "Items found by item name",
        items: items,
      });
    }

    // If no items or category are found
    return res.status(404).json({
      status: false,
      message: "No category or items found",
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

//similar product
const similaritemproduct = async (req, res, next) => {
  const { categoryId, itemName, itemId } = req.query;
  const userId = req.user.id;

  // Input validation
  if (!categoryId || !itemName) {
    return res.status(400).json({
      status: false,
      message: "Category ID and Item name are required.",
    });
  }

  if (!itemId) {
    return res
      .status(400)
      .json({ status: false, message: "ItemId is required" });
  }

  try {
    // Split itemName into words and create a regex pattern
    const searchTerms = itemName
      .trim()
      .split(/\s+/)
      .map((term) => term.trim());
    const regexPattern = searchTerms.map((term) => `(${term})`).join("|");

    const result = await Items.find({
      category_id: categoryId,
      name: { $regex: regexPattern, $options: "i" }, // Use the constructed regex pattern
      user_id: { $ne: userId },
      selling_status: { $ne: "sold" },
      _id: { $ne: itemId },
    })
      .populate("category_id", "category")
      .populate("user_id", "username profile average_rating");

    if (result.length === 0) {
      return res.status(404).json({ status: false, message: "No items found" });
    }

    res
      .status(200)
      .json({ status: true, message: "Data fetched successfully", result });
  } catch (error) {
    logger.error(error)
    console.error("Error:", error);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

//customer also like
const customeralsoliked = async (req, res, next) => {
  const { categoryId, itemId } = req.query;
  const userId = req.user.id;

  // Input validation
  if (!categoryId) {
    return res
      .status(400)
      .json({ status: false, message: "Category ID is required." });
  }

  if (!itemId) {
    return res
      .status(400)
      .json({ status: false, message: "Item ID is required." });
  }

  try {
    const result = await Items.find({
      category_id: categoryId,
      user_id: { $ne: userId },
      selling_status: { $ne: "sold" },
      _id: { $ne: itemId },
    })
      .populate("category_id", "category")
      .populate("user_id", "username profile average_rating")
      .exec();

    if (result.length === 0) {
      return res
        .status(404)
        .json({ status: false, message: "Items not found" });
    }

    // Sort the results based on user average_rating
    const sortedResult = result.sort(
      (a, b) => b.user_id.average_rating - a.user_id.average_rating
    );

    res.status(200).json({
      status: true,
      message: "Data fetched successfully!",
      result: sortedResult,
    });
  } catch (error) {
    console.error("Error:", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
};

module.exports = {
  createitem,
  viewitem,
  viewspeceficitem,
  updateitem,
  deleteitem,
  itembycategory,
  itemlisting,
  itembylocation,
  itemListingWithSortingAndLocation,
  Referitempoint,
  updateItemstatus,
  categorysorting,
  viewspeceficUseritem,
  locationpreferenceitem,
  processQueries,
  globalsearch,
  similaritemproduct,
  customeralsoliked,
  viewCurrentUseritem,
};
