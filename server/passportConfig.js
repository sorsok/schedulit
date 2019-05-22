const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { User } = require('./database/models');

module.exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.cookie('path', req.url);
  res.redirect('/login');
};

module.exports.ensureNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
};

module.exports.getPassport = () => {
  const passport = require('passport');
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((_id, done) => {
    User.findOne({ _id }).then(user => done(null, user));
  });
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.BASE_URL + '/auth/google/callback'
      },
      (token, refreshToken, profile, done) => {
        User.findOneAndUpdate(
          { sub: profile.id },
          profile._json,
          { upsert: true, new: true }
        ).then(userDocument => {
          userDocument.token = token;
          return done(null, userDocument);
        });
      }
    )
  );
  return passport;
};
