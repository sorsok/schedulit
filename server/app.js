const express = require('express');
const path = require('path');
const parser = require('body-parser');
const morgan = require('morgan');
const http = require('http');
var expressGraphQL = require('express-graphql');

const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');

const { initializeDB } = require('../database/index');
const { initializeSockets } = require('./sockets');
const { mainRouter, passport } = require('./routes');
const { schema } = require('../graphQL/schema');

const app = express();
const httpServer = http.Server(app);

module.exports.initializeApp = async () => {
  await initializeDB();
  app.use(cookieSession({
    name: 'session',
    keys: ['thiccmilcc']
  })
  );
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use(parser.json());
  app.use(parser.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(mainRouter);
  app.use(express.static(path.resolve(__dirname, '../client/dist')));
  initializeSockets(httpServer);
  app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true,
  }));

};

module.exports.httpServer = httpServer;
