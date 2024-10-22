const express = require("express");
const router = express.Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const { verifyToken } = require("../middlewares/auth");
const { verifyRole } = require("../middlewares/auth");

// controllers
const Role = require("../controllers/role/index");
const User = require("../controllers/user/index");
const Login = require("../controllers/auth/index");
const Category = require("../controllers/category/index");
const Items = require("../controllers/items/index");
const Wishlist = require("../controllers/wishlist/index");
const Swap = require("../controllers/swap/index");
const Chatroom = require("../controllers/chatroom/index");
const Message = require("../controllers/messages/index");
const seeder = require("../controllers/seeders/index");
const home = require("../controllers/home/index");

const { userUpload, itemUpload } = require("../models/upload");

//login route
router.post("/login", Login.login);

// Auth with Google
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google auth callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_APP_URL}/register`,
  }),
  (req, res) => {
    let { token } = req.user;
    res
      .cookie("token", token, {
        sameSite: "None",
        secure: true,
        path: "/",
        httpOnly: false, // If you want to access it via JS
      })
      .redirect(`${process.env.CLIENT_APP_URL}/`); // Replace with your actual success URL
  }
);

// Auth with Facebook
router.get("/auth/facebook", passport.authenticate("facebook"));

// Facebook auth callback
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    scope: ["user_friends", "manage_pages"],
    failureRedirect: `${process.env.CLIENT_APP_URL}/login`,
  }),
  (req, res) => {
    let { token } = req.user;
    res
      .cookie("token", token, {
        sameSite: "None",
        secure: true,
        path: "/",
        httpOnly: false, // If you want to access it via JS
      })
      .redirect(`${process.env.CLIENT_APP_URL}/`); // Replace with your actual success URL
  }
);

// Logout
router.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err); // Handle error
    }
    res.status(200).redirect("/login");
  });
});

//user route
router.route("/users").post(User.createuser).get(verifyToken, User.viewusers);

//token verification
router.use(verifyToken);

router
  .route("/users/:id")
  .get(User.viewspeceficuser)
  .put([userUpload], User.updateUser)
  .delete(User.deleteuser);
//profile edit
router.put("/users/profile/:id", User.updateprofile);
//leaderboard
router.get("/leaderboard", User.leaderboard);
router.post("/verifyotp", User.verifyOtp);

//role routes
router.route("/role").post( Role.createrole).get( Role.viewroles);
router
  .route("/role/:id")
  .get( Role.viewspeceficrole)
  .put( Role.updateRole)
  .delete( Role.deleterole);

//category routes
router
  .route("/category")
  .post( Category.createcategory)
  .get( Category.viewcategory);
router
  .route("/category/:id")
  .get(Category.viewspeceficcategory)
  .put( Category.updatecategory)
  .delete( Category.deletecategory);
router.put("/category/status/:id", Category.updatecategorystatus);
router.get("/similarcategory/product/:id", Category.similarcategoryproduct);

//items routes
router.route("/items").post(Items.createitem).get(Items.viewitem);
router
  .route("/items/:id")
  .get(Items.viewspeceficitem)
  .put(itemUpload, Items.updateitem)
  .delete(Items.deleteitem);

router.get("/by-user/items", Items.viewCurrentUseritem);
router.get("/by-user/items/:id", Items.viewspeceficUseritem);
//item listing
router.get("/itemsby/category/:id?", Items.itembycategory);
router.post("/category/sorting/:id", Items.categorysorting);
router.post("/itemlisting", Items.itemlisting);
router.post("/itemsby/location", Items.itembylocation);
router.post("/items/filtering/:id", Items.itemListingWithSortingAndLocation);
router.post("/referitem", Items.Referitempoint);
router.post("/preferedlocation/item", Items.locationpreferenceitem);
router.get("/availitem/inlocation", Items.processQueries);
//global search
router.post("/globalsearch", Items.globalsearch);
router.get("/similaritem/product", Items.similaritemproduct);
router.get("/customer/alsoliked", Items.customeralsoliked);

//wishlist route
router.route("/wishlist/:id").post(Wishlist.additem);
router.get("/wishlist", Wishlist.viewwishlistitem);
router.get("/wishlist/update", Wishlist.checkWishlistItemStatus);
router.delete("/wishlist/remove/:id", Wishlist.removeitem);

//swap route
router.route("/swap").post(Swap.makeswap).get(Swap.viewswaps);
router.post("/rate/user", Swap.rateuser);
router.get("/recommended/swaps", Swap.getRecommendedSwaps);

//chatroom routes
router.route("/chatroom/my").get(Chatroom.viewMyChatroom);
router
  .route("/chatroom")
  .post(Chatroom.createchatroom)
  .get(Chatroom.viewchatroom);
router
  .route("/chatroom/:id")
  .get(Chatroom.viewspeceficchatroom)
  .put(Chatroom.updatechatroom)
  .delete(Chatroom.deletechatroom);

//message routes
router.route("/message").post(Message.createmessages).get(Message.viewmessages);
router.route("/message/attachment").post(Message.sendAttachments);
router.route("/message/item").post(Message.sendItems);
router
  .route("/message/:id")
  .get(Message.viewMyMessages)
  .put(Message.updatemessage)
  .delete(Message.deletemessage);
router.route("/message/status/deny/:id").put(Message.denyProposal);

//seeders route
router.post("/seeder/category", seeder.seedCategory);
router.post("/seeder/user", seeder.seedUsers);
router.post("/seeder/item", seeder.seedItems);

//homepage route
router.get("/homepage", home.homepage);

module.exports = router;
