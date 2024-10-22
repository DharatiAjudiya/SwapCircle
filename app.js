const createError = require("http-errors");
const cors = require("cors");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const passport = require("./config/passport");
const session = require("express-session");
const indexRouter = require("./routes/index");
var logger = require("morgan");
const cookieParser = require("cookie-parser");
const { corsOptions } = require("./config/config");
require("./models/connection");

app.use(cors(corsOptions));
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//initialize session
app.use(
  session({
    secret: "fejkh25zsd",
    resave: false,
    saveUninitialized: true,
  })
);

//initialize passport
app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", indexRouter);

module.exports = app;
