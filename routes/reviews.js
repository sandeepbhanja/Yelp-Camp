const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn,isReviewAuthor } = require("../middleware");
const {createReview, deleteReview} = require('../controllers/reviews');

router.post(
  "/",
  isLoggedIn,
  catchAsync(createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,isReviewAuthor,
  catchAsync(deleteReview)
);

module.exports = router;