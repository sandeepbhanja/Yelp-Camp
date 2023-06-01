const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const {
  registerForm,
  register,
  signInForm,
  signIn,
  signOut,
} = require("../controllers/user");

router.route("/register").get(registerForm).post(catchAsync(register));
router
  .route("/sign-in")
  .get(signInForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/sign-in",
    }),
    signIn
  );
router.get("/sign-out", signOut);

module.exports = router;
