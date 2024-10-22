const multer = require("multer");
const path = require("path");

// Storage engine for 'user' uploads
const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/users");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// Storage engine for 'item' uploads
const itemStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/items");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

// Storage engine for 'chats' uploads
const chatStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/chats");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});


// Check file type
function checkFileType(file, cb) {
  try {
    const filetypes = /jpeg|jpg|png|gif|txt|svg|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb("Error: files with this extensions are not allowed!");
    }
  } catch (error) {
    console.error(error);
    logger.error(error);
  }
}

// Init upload for 'user'
const userUpload = multer({
  storage: userStorage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("profile");

// Init upload for 'item' (multiple images)
const itemUpload = multer({
  storage: itemStorage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },    
}).array("images", 10);

// Init upload for 'chats' (multiple images or files)
const chatUpload = multer({
  storage: chatStorage,
}).array("attachments", 10);

module.exports = { userUpload, itemUpload, chatUpload };
