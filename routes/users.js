const express = require("express");
const router = express.Router();
const expressError = require("../utils/expressError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const {isLoggedIn} = require('../middleware');

router.get("/register", async (req, res) => {
  res.render("auth/register.ejs");
});

router.post(
  "/register",
  catchAsync(async (req, res,next) => {
    try {
      const { username, password, email } = req.body;
      const user = new User({ email: email, username: username });
      const curUser = await User.register(user, password);
      req.login(curUser,err=>{
        if(err){
          next(err);
        }
        else{
          req.flash("success", "Successfully registered!");
          res.redirect("/campgrounds");
        }
      })
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get('/sign-in',(req,res,next)=>{
  res.render('auth/sign-in.ejs');  
})

router.post('/sign-in',passport.authenticate('local',{failureFlash:true , failureRedirect:'/sign-in'}),async (req,res)=>{
    req.flash('success','Welcome Back');
    const ret = req.session.returnTo || '/campgrounds';
    res.redirect(ret);
})

router.get("/sign-out", async (req, res) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success','Successfully Signed Out')
    res.redirect('/campgrounds')
})});


module.exports = router;
