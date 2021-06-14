var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
const app = require("../app");
const passport = require("passport");
var { checkNotAuthenticated, checkAuthenticated } = require("../services/checkAuthenticatedService");

/* GET users listing. */
router.get("/", checkAuthenticated, function (req, res, next) {
    res.render("admin", { title: "ExpressCMS" });
});

module.exports = router;
