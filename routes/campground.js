const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const {storage} = require('../cloudinary/index');
const { isLoggedIn, isAuthor } = require("../middleware");
const {
  index,
  newCamp,
  getInfo,
  edit,
  createCampground,
  deleteCampground,
  editCampground,
} = require("../controllers/campground");
const multer = require('multer');
const upload = multer({storage});

router.get("/new", isLoggedIn, catchAsync(newCamp));

router
  .route("/")
  .get(catchAsync(index))
  .post(isLoggedIn,upload.array('image'),catchAsync(createCampground));

router
  .route("/:id")
  .get(catchAsync(getInfo))
  .put(isLoggedIn, isAuthor,upload.array('image'), catchAsync(editCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(deleteCampground));

  router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(edit));

module.exports = router;
