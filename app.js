if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}



const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError");
const campgroundRoute = require("./routes/campground");
const reviewRoute = require("./routes/reviews");
const userRoute = require('./routes/users');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalPassport = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const MongoDBStore = require('connect-mongo')(session);
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelpCamp";

mongoose.connect(dbUrl, {
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
app.use(mongoSanitize());

app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

const secret = process.env.SECRET || "maverick";

const store = new MongoDBStore({
  url: dbUrl,
  secret,
  touchAfter: 24*60*60
});

store.on('error', function(e){
  console.log('Session Store Error',e)
})

const sessionConfig = {
  store,
  name:'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalPassport(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use('/campgrounds',campgroundRoute);
app.use("/campgrounds/:id/reviews", reviewRoute);
app.use('/',userRoute);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new expressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
});
app.listen(3000, () => {
  console.log("Port 3000");
});
