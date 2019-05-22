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
  authSuccessful: (req, res) => {
    res.redirect(process.env.BASE_URL + '/authSuccessful');
  },
  passport: passport
}