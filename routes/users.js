var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
const app = require("../app");
const passport = require("passport");
var { checkAuthenticated, checkNotAuthenticated } = require("../services/checkAuthenticatedService");

/* GET users listing. */
router.get("/login", checkNotAuthenticated, function (req, res, next) {
  res.render("login", { title: "ExpressCMS" });
});

router.get("/register", checkNotAuthenticated, function (req, res, next) {
  res.render("register", { title: "ExpressCMS" });
});

router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

router.post(
  "/register",
  checkNotAuthenticated,
  async function (req, res) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var hashedPassword = await bcrypt.hash(password, 10);
    req.app
      .get("db")
      .collection("users")
      .insertOne({
        username: username,
        email: email,
        passwordHash: hashedPassword,
      });
    res.redirect("/");
  }
);

router.get('/logout', checkAuthenticated, function (req, res) {
  req.logOut()
  res.redirect(req.url);
});

module.exports = router;
