const { getPassport } = require('./passportConfig');

const passport = getPassport();

module.exports = {
  authenticateUser: passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
  })
  ,
  handleCallback: passport.authenticate('google', {
    failureRedirect: '/login'
  })
  ,
  giveUserSessionToken: (req, res) => {
    res.redirect('/after-auth.html');
  },
  passport: passport
}