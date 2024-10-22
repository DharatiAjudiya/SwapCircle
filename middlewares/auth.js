const jwt = require("jsonwebtoken");
const User = require("../models/datavalidation/user");
const { ErrorHandler } = require("../utils/utility");
const Role = require("../models/datavalidation/role");

var dotenv = require("dotenv");
dotenv.config({ path: ".env" });

//token verify
const verifyToken = async (req, res, next) => {
  let token = await req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ status: false, message: "No token or invalid format" });
  }
  token = token.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, { clockTolerance: 30 }, (err, decoded) => {
    if (err) {
      console.error("Token verification error:", err);
      return res.status(401).json({ status: false, message: "Invalid token" });
    }
    req.user = decoded;
next();
  });
};

const socketAuthenticator = async (err, socket, next) => {
  try {
    if (err) return next(err);

    const authToken = socket.request.cookies["token"];

    if (!authToken)
      return next(new ErrorHandler("Please login to access this route", 401));

    const decodedData = jwt.verify(authToken, process.env.JWT_SECRET);

    const user = await User.findById(decodedData.id);

    if (!user)
      return next(new ErrorHandler("Please login to access this route", 401));

    socket.user = user;

    return next();
  } catch (error) {
    console.log(error);
    return next(new ErrorHandler("Please login to access this route", 401));
  }
};

//role verify
const verifyRole = async (req, res, next) => {
  const role = await Role.findOne({ role: "Admin" });

  if (!role || String(req.user.role) !== String(role._id))
    return next(new ErrorHandler("Access denied!", 403));
  else return next();
};

module.exports = { verifyToken, verifyRole, socketAuthenticator };
