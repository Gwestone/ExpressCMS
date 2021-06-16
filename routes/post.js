var express = require("express");
const { ObjectId } = require("mongodb");
var router = express.Router();

/* GET home page. */
router.get("/:postId", async function (req, res) {
    var postId = req.params.postId;
  
    var post = await req.app.get("db").collection("posts").findOne({_id:ObjectId(postId)})
    res.render("post", {title:"ExpressCMS", post: post})
});

module.exports = router;
