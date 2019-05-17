const express = require('express');
const path = require('path');
const { ensureAuthenticated, ensureNotAuthenticated } = require('./passportConfig');
const { passport, authenticateUser, handleCallback, sendAfterAuthIndex } = require('./passportControllers');

const sendIndex = (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/dist/index.html'));
};

const logout = (req, res) => {
  req.logout();
  res.redirect('/login');
};


const mainRouter = express.Router();
mainRouter
  .get('/auth/google', authenticateUser)
  .get('/auth/google/callback', handleCallback, sendAfterAuthIndex)

  // nginx should do this
  .get('/', ensureAuthenticated, sendIndex)
  .get('/login', ensureNotAuthenticated, sendIndex)
  .get('/logout', ensureAuthenticated, logout)
  .get('/events/:id', ensureAuthenticated, sendIndex)
  .get('/events/new', ensureAuthenticated, sendIndex);


module.exports.mainRouter = mainRouter;
module.exports.passport = passport;
