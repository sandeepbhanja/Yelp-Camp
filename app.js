const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError");
const catchAsync = require("./utils/catchAsync");
mongoose.connect("mongodb://localhost:27017/yelpCamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/campgrounds", catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campground/index", { campgrounds });
}));
app.get("/campgrounds/new", catchAsync(async (req, res) => {
  res.render("campground/new");
}));
app.get("/campgrounds/:id", catchAsync(async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  res.render("campground/show", { camp });
}));
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  res.render("campground/edit", { camp });
}));




app.post("/campgrounds", catchAsync(async (req, res, next) => {
  if(!req.body.campground) throw new expressError('Invalid CampGround data',400);
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}));
app.put("/campgrounds/:id", catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndUpdate(id, { ...req.body.campground });
  res.redirect(`/campgrounds/${id}`);
}));
app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect(`/campgrounds`);
}));


app.all('*',(req,res,next)=>{
  next(new expressError('Page Not Found',404))
});
app.use((err, req, res, next) => {
  const {statusCode=500} = err;
  if(!err.message) err.message = 'Something went wrong';
  res.status(statusCode).render('error',{err});
});
app.listen(3000, () => {
  console.log("Port 3000");
});
