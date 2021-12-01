const { User } = require("../db/models");
const localStrategy = require("passport-local").Strategy;
const passport = require('passport');

module.exports = function () {
  passport.use(
    new localStrategy(async (username, password, done) => {
        const user = await User.findOne({ username: username }).exec();
        if (!user) {
          return done(null, false);
        } else {
          if (await user.validatePassword(password)) return done(null, user);
          else return done(null, false);
        }
    })
  );
};
