const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate')
mongoose.connect("mongodb://localhost:27017/yelpCamp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine('ejs',ejsMate); 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

app.get("/", (req, res) => {
  res.render("home");
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campground/index' , {campgrounds});
})
app.get("/campgrounds/new", async (req, res) => {
  res.render("campground/new");
});
app.get('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    res.render('campground/show',{camp});
})
app.get("/campgrounds/:id/edit", async (req, res) => {
    const {id} = req.params;
    const camp = await Campground.findById(id);
    res.render('campground/edit',{camp});
});
app.post('/campgrounds', async (req, res) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect('/campgrounds');
})
app.put('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndUpdate(id , {...req.body.campground});
    res.redirect(`/campgrounds/${id}`);
});
app.delete('/campgrounds/:id', async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
})
app.listen(3000, () => {
  console.log("Port 3000");
});
