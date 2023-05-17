const Campground = require('../models/campground');
const Review = require('../models/review');
const {cloudinary} = require('../cloudinary/index');

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campground/index", { campgrounds });
};

module.exports.newCamp = async (req, res) => {
  res.render("campground/new");
};

module.exports.getInfo = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!camp) {
    req.flash("error", "Campground not found!!");
    return res.redirect("/campgrounds");
  }
  res.render("campground/show", { camp });
};

module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp) {
    req.flash("error", "Campground not found!!");
    return res.redirect("/campgrounds");
  }
  res.render("campground/edit", { camp });
};

module.exports.createCampground = async (req, res, next) => {
  if (!req.body.campground)
    throw new expressError("Invalid CampGround data", 400);
  const camp = new Campground(req.body.campground);
  camp.image = req.files.map(f=>({url:f.path, filename:f.filename}));
  camp.author = req.user._id;
  await camp.save();
  req.flash("success", "Successfully created a campground");
  res.redirect(`/campgrounds/${camp._id}`);
};

module.exports.editCampground = async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imag = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  camp.image.push(...imag);
  await camp.save();
  if (req.body.deleteImg){
    for(let filename of req.body.deleteImg){
      await cloudinary.uploader.destroy(filename);
    }
    await camp.updateOne( { $pull: {image: {filename: {$in: req.body.deleteImg}}}})
  }
  req.flash("success", "Successfully updated the campground");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the campground");
  res.redirect(`/campgrounds`);
};