const express = require('express');
const path = require('path');
const parser = require('body-parser');
const morgan = require('morgan');
const http = require('http');
const cors = require('cors');
const expressGraphQL = require('express-graphql');

const cookieParser = require('cookie-parser');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


const { initializeDB, mongoose } = require('./database/index');
const { mainRouter, passport } = require('./routes');
const { schema } = require('./graphQL/schema');

const app = express();
const httpServer = http.Server(app);

module.exports.initializeApp = async () => {
  await initializeDB();
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'schedulit-rules',
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  }));
  app.use(cors());
  app.use(cookieParser());
  app.use(morgan('dev'));
  app.use(parser.json());
  app.use(parser.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(mainRouter);
  app.use(express.static(path.resolve(__dirname, '../client/dist')));
  app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true,
  }));

};

module.exports.httpServer = httpServer;
