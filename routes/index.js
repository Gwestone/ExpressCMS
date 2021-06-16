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
  var posts = []
  var postsCursor = await req.app.get("db").collection("posts").find({}).limit(10);
  while (await postsCursor.hasNext()) {
      posts.push(await postsCursor.next());
  }
  res.render("index", { title: "ExpressCMS", name: name, loggedIn: loggedIn, posts: posts });
});

module.exports = router;
