const mongoose = require('mongoose');

module.exports.initializeDB = async () => {
  await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    dbName: process.env.MONGO_DB_NAME,
  });
  console.log('connected to mongo');
};

module.exports.mongoose = mongoose;