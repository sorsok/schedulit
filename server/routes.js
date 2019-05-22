const express = require('express');
const path = require('path');
const os = require('os');
const { ensureAuthenticated, ensureNotAuthenticated } = require('./passportConfig');
const { passport, authenticateUser, handleCallback, authSuccessful } = require('./passportControllers');

const logout = (req, res) => {
  req.logout();
  res.redirect('/login');
};


const mainRouter = express.Router();
mainRouter
  .get('/test', (req, res) => {
    console.log(os.hostname());
    res.send('hi');

  })
  .get('/auth/google', authenticateUser)
  .get('/auth/google/callback', handleCallback, authSuccessful)
  .get('/logout', ensureAuthenticated, logout);

module.exports.mainRouter = mainRouter;
module.exports.passport = passport;
