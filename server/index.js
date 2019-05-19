const { httpServer, initializeApp } = require('./app');

initializeApp().then(() => {
  httpServer.listen(process.env.API_PORT || 3000, () =>
    console.log('Listening on PORT', process.env.API_PORT || 3000))
}
);
