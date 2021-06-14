var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var MongoClient = require("mongodb").MongoClient;

var initPassport = require("./services/passportConfigService");
var passport = require("passport");
initPassport(passport, getuserByEmail, getuserById);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var adminRouter = require("./routes/admin");

var expressSession = require("express-session");
const flash = require("express-flash");
const { ObjectId } = require("mongodb");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  expressSession({
    secret: "qwertyuiop+-=_",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use("/", indexRouter);
app.use("/", usersRouter);
app.use("/admin/", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

MongoClient.connect(
  "mongodb://localhost:27017/CMS",
  { useUnifiedTopology: true },
  (err, client) => {
    if (err) console.error(err);

    var db = client.db("CMS");

    app.set("db", db);
  }
);

async function getuserByEmail(email) {
  return await app.get("db").collection("users").findOne({ email: email });
}

async function getuserById(Id) {
  return await app
    .get("db")
    .collection("users")
    .findOne({ _id: ObjectId(Id) });
}

module.exports = app;
