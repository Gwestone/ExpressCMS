var localStrategy = require("passport-local").Strategy;
var bcrypt = require("bcrypt");

function initPassport(passport, getuserByEmail, getuserById) {
  passport.use(
    new localStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        var user = await getuserByEmail(email);
        try {
          if (user == null) {
            return done(null, false, { message: "Cant find users" });
          } else {
            if (await bcrypt.compare(password, user.passwordHash)) {
              return done(null, user);
            } else {
              return done(null, false, { message: "Password incorrect" });
            }
          }
        } catch (e) {
          return done(e);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user._id));
  passport.deserializeUser((id, done) => done(null, getuserById(id)));
}

module.exports = initPassport;
