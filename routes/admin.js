var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
const app = require("../app");
const passport = require("passport");
var { checkIsAdmin, checkAuthenticated } = require("../services/checkRightsService");
const { ObjectId } = require("mongodb");

//Read
router.get("/", checkIsAdmin, async function (req, res, next) {

    var posts = []
    var postCursor = await req.app.get("db").collection("posts").find({}).limit(10);
    while (await postCursor.hasNext()) {
        posts.push(await postCursor.next());
    }

    res.render("admin", { title: "ExpressCMS", posts: posts });
});
//Create
router.post("/addpost", checkIsAdmin, async function (req, res, next) {
    var title = req.body.title
    var text = req.body.text
    var author = await req.user
    req.app.get("db").collection("posts").insertOne({
        title: title,
        text: text,
        author_id: author._id,
        author_name: author.username
    });
    res.redirect("/admin");
});
//Update
router.get("/update/:postId", checkIsAdmin, async function (req, res, next) {

    var postId = req.params.postId

    var postToUpdate = await req.app.get("db").collection("posts").findOne({_id:ObjectId(postId)})

    res.render("adminUpdate", { title: "ExpressCMS", postToUpdate: postToUpdate });
});

router.post("/update/", checkIsAdmin, async function (req, res, next) {

    //update post that we get from request
    var postId = req.body._id
    req.app.get("db").collection("posts").updateOne(
        { _id : ObjectId(postId) },
        {
          $set: { "title": req.body.title, "text": req.body.text }
        }
     )

    var postToUpdate = await req.app.get("db").collection("posts").findOne({_id:ObjectId(postId)})

    res.redirect("/")
});

router.get("/delete/:postId", checkIsAdmin, async function (req, res, next) {

    var postId = req.params.postId

    await req.app.get("db").collection("posts").deleteOne({_id:ObjectId(postId)})

    res.redirect("/admin/");
});


module.exports = router;
