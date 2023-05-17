const User = require("../models/user");


module.exports.registerForm = async (req, res) => {
  res.render("auth/register.ejs");
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const user = new User({ email: email, username: username });
    const curUser = await User.register(user, password);
    req.login(curUser, (err) => {
      if (err) {
        next(err);
      } else {
        req.flash("success", "Successfully registered!");
        res.redirect("/campgrounds");
      }
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.signInForm = (req, res, next) => {
  res.render("auth/sign-in.ejs");
};

module.exports.signIn = async (req, res) => {
  req.flash("success", "Welcome Back");
  const ret = req.session.returnTo || "/campgrounds";
  res.redirect(ret);
};

module.exports.signOut = async (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Successfully Signed Out");
    res.redirect("/campgrounds");
  });
};
