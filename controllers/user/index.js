const User = require("../../models/datavalidation/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const speakeasy = require("speakeasy");
const { sendOtpEmail } = require("../auth/index");
const Role = require("../../models/datavalidation/role");
const logger = require("../../utils/logger");

//create user
const createuser = async (req, res, next) => {
  try {
    const { password, email, ...userData } = req.body;

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const { otp, secret, timestamp } = generateOtp();

    // Send OTP to user's email
    await sendOtpEmail(email, otp);

      // Check if email already exists in the databse
      const existingemail = await User.findOne({email: req.body.email});

    if (existingemail) {
        return res.status(500).json({ status: false, message: 'Email already exists!' });
    }

    // Check if email already exists in the databse
    const existingnumber = await User.findOne({phone_number: req.body.phone_number});

    if (existingnumber) {
        return res.status(500).json({ status: false, message: 'Phone number already exists!' });
    }

    const role = await Role.findOne({ role: "User" });

    // Create a new user with the hashed password
    const result = new User({
      ...userData,
      email,
      role_id: role._id,
      password: hashedPassword,
      points: 0,
      level: 0,
      badges: 0,
      average_rating: 0,
      address: null,
      location: null,
      email: req.body.email,
    });

    await result.save();

    res.status(200).json({
      status: true,
      // message: "User registered successfully. OTP has been sent to your email.",
      message: "User registered successfully.",
      result,
      otpDetails: { secret, timestamp },
    });
  } catch (error) {
    console.log("Error: ", error);
    logger.error(error)
    res.status(500).json({ status: false, message: error.message });
  }
};
// function to generate OTP
const generateOtp = () => {
  const secret = speakeasy.generateSecret({ length: 10 });
  const otp = speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
    digits: 6,
    step: 120,
  });

  return { secret: secret.base32, otp, timestamp: Date.now() };
};

//view users
const viewusers = async (req, res) => {
  try {
    const result = await User.find();
    res
      .status(200)
      .json({ status: true, message: "Data fetched successfully!", result });
  } catch (error) {
    console.log(error);
    logger.error(error)
    res.status(500).json({ status: false, message: error.message });
  }
};

//view specific user
const viewspeceficuser = async (req, res) => {
  const userId = req.params.id;

  // Validate userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid user ID format" });
  }

  try {
    const result = await User.findById(userId);
    if (!result) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ status: true, message: "Data fetched successfully", result });
  } catch (error) {
    console.error("Error:", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//update user
const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { password, ...updateData } = req.body;

  // Validate userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid user ID format" });
  }

  try {
    // Remove fields that should not be updated
    const { points, average_rating, badges, level, ...filteredData } =
      updateData;

    if (req.file) {
      // Get the path to the uploaded file
      filteredData.profile = `${req.file.filename}`;
    }

    // Hash the password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      filteredData.password = hashedPassword;
    }

    // Update user data
    const updateuser = await User.findByIdAndUpdate(userId, filteredData, {
      new: true,
      runValidators: true,
    });

    if (!updateuser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res
      .status(200)
      .json({ status: true, message: "Data updated successfully", updateuser });
  } catch (error) {
    console.log("Error: ", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//delete user
const deleteuser = async (req, res) => {
  let userId = req.params.id;

  // Validate userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid user ID format" });
  }
  try {
    const deleteuser = await User.findByIdAndDelete(userId);
    if (!deleteuser) {
      return null;
    }
    res
      .status(200)
      .json({ status: true, message: "User deleted successfully" });
    return deleteuser;
  } catch (error) {
    console.log("Error; ", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//edit profile
const updateprofile = async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  // Validate userId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res
      .status(400)
      .json({ status: false, message: "Invalid user ID format" });
  }
  try {
    const updateuser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updateuser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }
    res
      .status(200)
      .json({ status: true, message: "Data updated successfully", updateuser });
  } catch (error) {
    console.log("Error: ", error);
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal sever error" });
  }
};

//leader board
const leaderboard = async (req, res) => {
  try {
    const user = await User.aggregate([
      { $sort: { level: -1 } }, //sort in desc order
      { $limit: 3 }, //limit to top 1
      {
        $project: {
          username: 1,
          email: 1,
          phone_number: 1,
          points: 1,
          level: 1,
          average_rating: 1,
          badges: 1,
        },
      },
    ]);
    res
      .status(200)
      .json({ status: true, message: "Top 3 users on leaderboard", user });
  } catch (error) {
    logger.error(error)
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

const verifyOtp = async (req, res, next) => {
  const { otp, secret, timestamp } = req.body;
  const otpValidWindow = 4 * 30 * 1000; // OTP valid for 2 steps (4 minutes)

  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: "base32",
    token: otp,
    window: 4,
    step: 120,
  });

  if (verified) {
    res.status(200).json({ status: true, message: "OTP verified" });
  } else if (Date.now() - timestamp > otpValidWindow) {
    res.status(200).json({ status: false, message: "OTP expired" });
  } else {
    res.status(200).json({ status: false, message: "Invalid OTP" });
  }
};

module.exports = {
  createuser,
  viewusers,
  viewspeceficuser,
  updateUser,
  deleteuser,
  updateprofile,
  leaderboard,
  verifyOtp,
};
