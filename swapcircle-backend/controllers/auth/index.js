const passport = require("passport");
const logger = require("../../utils/logger");
const User = require("../../models/datavalidation/user");
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
const jwt = require("jsonwebtoken");
const Role = require("../../models/datavalidation/role");
require("dotenv").config();

// Login API
const login = (req, res, next) => {
  try {
    passport.authenticate("local", async (err, user, info) => {
      if (err) return next(err);
      if (!user)
        return res.status(401).json({
          status: false,
          message: info.message || "Authentication failed",
        });

      const role = await Role.findOne({
        role: "Admin",
      });
      let isAdmin = false;
      if (role._id.toString() === user.role_id.toString()) {
        isAdmin = true;
      }
      // Generate JWT
      const token = jwt.sign(
        {
          id: user._id,
          isAdmin: isAdmin,
          username: user.username,
          email: user.email,
          profile: user.profile,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(200).json({
        status: true,
        message: "Login successful",
        data: { token: token },
      });
    })(req, res, next);
  } catch (error) {
    logger.error(error);
    console.error("Error :", error);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
};

//transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

//send notification
const sendNotification = async (userId, availableItems) => {
  try {
    // Fetch the user's email address
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Extract item names
    const itemNames = availableItems.map((item) => item.name).join(", ");

    // Define the email options
    const mailOptions = {
      from: `"Swap Circle" <riddhimegh.msquaretechnologies@gmail.com>`,
      to: user.email,
      subject: "Items in Your Wishlist Are Now Available!",
      html: `<div style="font-family: Arial, sans-serif; color: #333;">
        <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
          <h3 style="color: #4CAF50;">Good news!</h3>
          <p style="font-size: 16px; line-height: 1.6;">
            The following items in your wishlist:  <strong style="color: #333;">${itemNames}</strong> are now available. 
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Hurry up and check it out.
          </p>
          <p style="font-size: 14px; color: #888;">Thank you,<br> SwapCircle Team</p>
        </div>
      </div>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log("Notification email sent to:", user.email);
  } catch (error) {
    logger.error(error);
    console.error("Error sending notification:", error);
  }
};

//send otp
const sendOtpEmail = async (email, otp) => {
  const body = `Your OTP for successfull registration is: ${otp}. Use this OTP to verify your account.

 Thank you,
 SwapCircle Team`;

  const mailOptions = {
    from: `"Swap Circle" <riddhimegh.msquaretechnologies@gmail.com>`,
    to: email,
    subject: "Complete Your Registration with - One Time Passcode",
    text: body,
  };
  return transporter.sendMail(mailOptions);
};

//send available item mail
const sendAvailabilityEmail = async (email, itemNames) => {
  const formattedItemNames = itemNames.join(", ");

  const mailOptions = {
    from: `"Swap Circle" <riddhimegh.msquaretechnologies@gmail.com>`,
    to: email,
    subject: "Items in Your Preferred Location Are Now Available!",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
          <h3 style="color: #4CAF50;">Hey there..!</h3>
          <p style="font-size: 16px; line-height: 1.6;">
            The following item(s): <strong style="color: #333;">${formattedItemNames}</strong> is now available in your preferred location!
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Hurry up and check it out.
          </p>
          <p style="font-size: 14px; color: #888;">Thank you,<br> SwapCircle Team</p>
        </div>
      </div>
    `,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${email}:`, result);
  } catch (error) {
    logger.error(error);
    console.error(`Error sending email to ${email}:`, error);
  }
};

//send mail for swapped items
const sendEmail = async (userId, swappedItems) => {
  try {
    // Fetch the user's email address
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Extract item names
    const itemNames = swappedItems.map((item) => item.name).join(", ");

    // Define the email options
    const mailOptions = {
      from: `"Swap Circle" <riddhimegh.msquaretechnologies@gmail.com>`,
      to: user.email,
      subject: "Items in Your Wishlist Has Been Swapped!",
      html: `<div style="font-family: Arial, sans-serif; color: #333;">
        <div style="background-color: #f7f7f7; padding: 20px; border-radius: 8px; max-width: 600px; margin: 0 auto;">
          <h3 style="color: #4CAF50;">Oh No!</h3>
          <p style="font-size: 16px; line-height: 1.6;">
            The following item in your wishlist:  <strong style="color: #333;">${itemNames}</strong> has been swapped. 
          </p>
          <p style="font-size: 16px; line-height: 1.6;">
            Check out other similar products.
          </p>
          <p style="font-size: 14px; color: #888;">Thank you,<br> SwapCircle Team</p>
        </div>
      </div>`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log("Notification email sent to:", user.email);
  } catch (error) {
    logger.error(error);
    console.error("Error sending notification:", error);
  }
};

module.exports = {
  login,
  sendNotification,
  sendOtpEmail,
  sendAvailabilityEmail,
  sendEmail,
};
