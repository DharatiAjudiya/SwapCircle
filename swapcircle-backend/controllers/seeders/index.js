require("dotenv").config();
const { faker } = require("@faker-js/faker");
const Category = require("../../models/datavalidation/category");
const bcrypt = require("bcrypt");
const User = require("../../models/datavalidation/user");
const Role = require("../../models/datavalidation/role");
const mongoose = require("mongoose");
const Item = require("../../models/datavalidation/item");
const connection = require("../../models/connection");
const logger = require("../../utils/logger");

const seedCategory = async (req, res) => {
  try {
    const categories = [
      "Cars",
      "Bikes",
      "Clothes",
      "Electronics",
      "House-holds",
      "Sports",
      "Books",
      "Toys",
      "Cosmetics",
      "Footwares",
      "Furniture",
      "Properties",
      "Grocery",
      "Bags",
      "Jewellery",
      "Eyewares",
      "Garden & Outdoor",
      "Office Products",
    ];

    // Generate and save 10 fake categories
    for (let i = 0; i < 10; i++) {
      const fakeCategory = new Category({
        category: faker.helpers.arrayElement(categories),
        status: faker.datatype.boolean() ? "Enable" : "Disable",
      });
      await fakeCategory.save();
    }

    // Send 200 response after successful seeding
    res
      .status(200)
      .json({ status: true, message: "Category seeded successfully!" });
  } catch (error) {
    console.error("Error seeding categories:", error);
    logger.error(error)

    // Send 500 response in case of an error
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

const seedItems = async (req, res) => {
  try {
    const conditions = ["vintage", "old", "used", "likely_new", "brand_new"];
    // Fetch existing categories
    const categories = await Category.find({}, "_id"); // Only get the category IDs
    if (categories.length === 0) {
      console.log("No categories found in the database.");
      return res.status(404).json({
        status: false,
        message: "No categories found in the database.",
      });
    }

    // Fetch existing users
    const users = await User.find({}, "_id"); // Only get user IDs
    if (users.length === 0) {
      console.log("No users found in the database.");
      return res
        .status(404)
        .json({ status: false, message: "No users found in the database." });
    }

    // Generate and save 20 fake items
    for (let i = 0; i < 20; i++) {
      const randomCategory = faker.helpers.arrayElement(categories); // Pick a random category ID
      const randomUser = faker.helpers.arrayElement(users); // Pick a random user ID
      // Generate multiple images with specific height and width
      const images = Array.from({ length: 2 }, () => {
        const height = faker.number.int({ min: 300, max: 350 });
        const width = faker.number.int({ min: 350, max: 400 });
        return `https://via.placeholder.com/350x400/e6e6e6/000000`; // Generate URL with height and width
      });
      const tags = faker.word.words({ count: 3 }).split(" "); // Generate 5 random tags
      // Generate multiple prices between 1000 and 5000
      const prices = Array.from(
        { length: faker.number.int({ min: 2, max: 2 }) },
        () => {
          return faker.commerce.price(1000, 5000);
        }
      );
      const fakeItem = new Item({
        category_id: randomCategory._id,
        user_id: randomUser._id,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        images: images, // Generate a fake image URL
        tags: tags, // Generate random tags
        eco_friendly: faker.datatype.boolean(),
        recyclable: faker.datatype.boolean(),
        condition: faker.helpers.arrayElement(conditions),
        status: faker.datatype.boolean() ? "Available" : "Unavailable",
        price: prices,
        selling_status: faker.datatype.boolean() ? "sell" : "sold",
        location: {
          lat: faker.location.latitude(),
          lng: faker.location.longitude(),
          postcode: parseFloat(faker.location.zipCode()),
          city: faker.location.city(),
          state: faker.location.state(),
          country: faker.location.country(),
        },
      });

      await fakeItem.save();
      // console.log(`Created item ${fakeItem.name}`);
    }

    console.log("Items seeded successfully!");
    res
      .status(200)
      .json({ status: true, message: "Items seeded successfully!" });
  } catch (error) {
    console.error("Error seeding items:", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

const seedUsers = async (req, res) => {
  try {
    // Check if role exists
    const role = await Role.findOne({ role: "User" });
    if (!role) {
      console.log("Role not found!");
      return res.status(404).json({ status: false, message: "Role not found!" });
    }

    // Generate multiple images with specific height and width
    const images = `https://via.placeholder.com/40x40/e6e6e6/000000`;

    const generateRating = () => {
      const step = 0.5;
      return (Math.round((Math.random() * 10) * 10) / 10) * step;
    };

    const phoneNumbers = new Set(); 

    const password= '12345';
    const hashedpassword = await bcrypt.hash(password, 10);

    // Generate and save 10 fake users
    for (let i = 0; i < 10; i++) {
      let phone_number;
      do {
        phone_number = '4' + faker.number.int({ min: 10000000, max: 99999999 }).toString();
      } while (phoneNumbers.has(phone_number)); // Check for uniqueness

      phoneNumbers.add(phone_number); // Add the new phone number to the set

      const fakeUser = new User({
        email: faker.internet.email(),
        username: faker.internet.userName(),
        password: hashedpassword,
        phone_number: phone_number,
        role_id: role._id,
        points: 0,
        level: 0,
        badges: 0,
        average_rating: generateRating(),
        profile: images,
        address: faker.location.streetAddress(),
        location: {
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
        },
      });
      await fakeUser.save();
      // console.log(`Created user ${fakeUser.email}`);
    }

    console.log("Users seeded successfully!");
    res.status(200).json({ status: true, message: "Users seeded successfully!" });
  } catch (error) {
    logger.error(error)
    console.error("Error seeding users:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};


module.exports = { seedCategory, seedItems, seedUsers };
