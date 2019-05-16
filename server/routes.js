const express = require('express');
const { ensureAuthenticated, ensureNotAuthenticated } = require('./passportConfig');
const { passport, authenticateUser, handleCallback, giveUserSessionToken } = require('./passportControllers');

const mainRouter = express.Router();
mainRouter
  .get('/auth/google', authenticateUser)
  .get('/auth/google/callback', handleCallback, giveUserSessionToken);
// nginx should do this
// .get('/', ensureAuthenticated, sendIndex)
// .get('/login', ensureNotAuthenticated, sendIndex)
// .get('/events/:id', ensureAuthenticated, sendIndex)
// .get('/events/new', ensureAuthenticated, sendIndex);


module.exports.mainRouter = mainRouter;
module.exports.passport = passport;
