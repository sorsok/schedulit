const express = require('express');
const { ensureAuthenticated } = require('./passportConfig');
const { joinPut, eventPost, eventGet, userGet, participationGet, myUserGet, joinGet, sendIndex } = require('./controllers.js');
const { passport, authenticateUser, authenticateUser2, giveUserSessionToken } = require('./passportControllers');

const apiRouter = express.Router();
apiRouter
  .get('/user', myUserGet)
  .get('/user/:id', userGet)
  .get('/event/:id', eventGet)
  .post('/event', eventPost)
  .get('/participation/:id', participationGet)
  .put('/join/:eventId', joinPut);

const mainRouter = express.Router();
mainRouter.use('/api', ensureAuthenticated, apiRouter);
mainRouter
  .get('/join/:eventId', joinGet)
  .get('/protected', ensureAuthenticated, (req, res) => res.send('access granted. secure stuff happens here'))
  .get('/auth/google', authenticateUser)
  .get('/auth/google/callback', authenticateUser2, giveUserSessionToken)
  .get('/', sendIndex)
  .get('/login', sendIndex)
  .get('/events/:id', sendIndex)
  .get('/events/new', sendIndex);


module.exports.mainRouter = mainRouter;
module.exports.passport = passport;
