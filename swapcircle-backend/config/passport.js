const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/datavalidation/user");
const bcrypt = require("bcrypt");
var dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const role = require("../models/datavalidation/role");
const jwt = require("jsonwebtoken");
const Role = require("../models/datavalidation/role");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      console.log("Email: ", email, "Password: ", password);
      try {
        const user = await User.findOne({
          $or: [{ email: email }, { phone_number: email }],
        });
        if (!user) {
          return done(null, false, { message: "No user found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
      state: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      let role_user = await role.findOne({ role: "User" });
      let role_admin = await Role.findOne({
        role: "Admin",
      });
      let isAdmin = false;
      
      User.findOne({ social_id: profile.id }).then(async (existingUser) => {
        if (existingUser) {

          if (role_admin._id.toString() === existingUser.role_id.toString()) {
            isAdmin = true;
          }

          const token = jwt.sign(
            {
              id: existingUser._id,
              isAdmin: isAdmin,
              username: existingUser.username,
              email: existingUser.email,
              social_platform: existingUser.social_platform,
              profile: existingUser.profile,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
          );
          done(null, { user: existingUser, token });
        } else {
          new User({
            social_platform: profile?.provider,
            social_id: profile?.id,
            role_id: role_user?._id,
            profile: profile?.photos[0]?.value || null,
            username: profile?.displayName,
            points: 0,
            level: 0,
            badges: 0,
            average_rating: 0,
            address: null,
            location: null,
          })
            .save()
            .then((user) => {
              const token = jwt.sign(
                {
                  id: user?._id,
                  isAdmin: isAdmin,
                  username: user?.username,
                  social_platform: existingUser?.social_platform,
                  email: user?.email,
                  profile: user?.profile,
                },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
              );
              return done(null, { user, token });
            })
            .catch((err) => console.log("error", err));
        }
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      let role_user = await role.findOne({ role: "User" });
      let role_admin = await Role.findOne({
        role: "Admin",
      });
      let isAdmin = false;
      User.findOne({ social_id: profile?.id }).then((existingUser) => {
        if (existingUser) {
          
          if (role_admin._id.toString() === existingUser.role_id.toString()) {
            isAdmin = true;
          }

          const token = jwt.sign(
            {
              id: existingUser?._id,
              isAdmin: isAdmin,
              username: existingUser?.username,
              social_platform: existingUser?.social_platform,
              email: existingUser?.email || null,
              profile: existingUser?.profile || null,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
          );
          done(null, { user: existingUser, token });
        } else {
          new User({
            social_platform: profile?.provider,
            social_id: profile?.id,
            role_id: role_user._id,
            profile: profile?.photos[0]?.value,
            username: profile?.displayName,
            email: profile?.emails[0]?.value,
            points: 0,
            level: 0,
            badgses: 0,
            average_rating: 0,
            address: null,
            location: null,
          })
            .save()
            .then((user) => {
              const token = jwt.sign(
                {
                  id: user?._id,
                  isAdmin: isAdmin,
                  username: user?.username,
                  social_platform: existingUser?.social_platform,
                  email: user?.email,
                  profile: user?.profile,
                },
                process.env.JWT_SECRET,
                { expiresIn: "24h" }
              );
              return done(null, { user, token });
            })
            .catch((err) => console.log("error", err));
        }
      });
    }
  )
);

passport.serializeUser((data, done) => {
  done(null, { id: data.user.id, token: data.token });
});

passport.deserializeUser(async (data, done) => {
  try {
    const user = await User.findById(data.id);
    done(null, { user, token: data.token });
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
