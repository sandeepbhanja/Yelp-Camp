const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createReview = async (req, res) => {
  if (!req.body.review) throw new expressError("Invalid Review data", 400);
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Review Added");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  const rev = await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  console.log(rev);
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Successfully deleted the review");
  res.redirect(`/campgrounds/${id}`);
};