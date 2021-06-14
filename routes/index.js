var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", async function (req, res, next) {
  var name = "guest";
  var loggedIn = false;

  if (req.isAuthenticated()) {
    var user = await req.user;
    name = user.username;
    loggedIn = true;
  }

  res.render("index", { title: "ExpressCMS", name: name, loggedIn: loggedIn });
});

module.exports = router;
