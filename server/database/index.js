const mongoose = require('mongoose');

module.exports.initializeDB = async () => {
  await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    dbName: process.env.MONGO_DB_NAME,
    user: process.env.MONGO_INITDB_ROOT_USERNAME,
    pass: process.env.MONGO_INITDB_ROOT_PASSWORD
  });
  console.log('connected to mongo');
};

module.exports.mongoose = mongoose;