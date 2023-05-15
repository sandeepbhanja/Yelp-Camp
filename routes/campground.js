const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const expressError = require("../utils/expressError");
const Campground = require("../models/campground");
const { isLoggedIn,isAuthor } = require("../middleware");

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campground/index", { campgrounds });
  })
);
router.get(
  "/new",
  isLoggedIn,
  catchAsync(async (req, res) => {
    res.render("campground/new");
  })
);
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id)
      .populate({path:"reviews",populate:{path:'author'}})
      .populate("author");
    if (!camp) {
      req.flash("error", "Campground not found!!");
      return res.redirect("/campgrounds");
    }
    res.render("campground/show", { camp });
  })
);
router.get(
  "/:id/edit",
  isLoggedIn,isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if (!camp) {
      req.flash("error", "Campground not found!!");
      return res.redirect("/campgrounds");
    }
    res.render("campground/edit", { camp });
  })
);

//post route
router.post(
  "/",
  isLoggedIn,
  catchAsync(async (req, res, next) => {
    if (!req.body.campground)
      throw new expressError("Invalid CampGround data", 400);
    const camp = new Campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    req.flash("success", "Successfully created a campground");
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

//put route
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated the campground");
    res.redirect(`/campgrounds/${id}`);
  })
);

//delete route
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground");
    res.redirect(`/campgrounds`);
  })
);

module.exports = router;
