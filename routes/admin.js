var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
const app = require("../app");
const passport = require("passport");
var { checkIsAdmin, checkAuthenticated } = require("../services/checkRightsService");

/* GET users listing. */
router.get("/", checkIsAdmin, function (req, res, next) {
    res.render("admin", { title: "ExpressCMS" });
});

router.post("/addpost", checkIsAdmin,async function (req, res, next) {
    var title = req.body.title
    var text = req.body.text
    var author = await req.user
    req.app.get('db').collection('posts').insertOne({
        title: title, 
        text: text,
        author_id: author._id,
        author_name: author.username
    });
    res.redirect('/admin')
});

module.exports = router;
