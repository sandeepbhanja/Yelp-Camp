const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { isLoggedIn } = require("../middleware");

router.post(
  "/",
  isLoggedIn,
  catchAsync(async (req, res) => {
    if (!req.body.review) throw new expressError("Invalid Review data", 400);
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Review Added");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const rev = await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    console.log(rev);
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;