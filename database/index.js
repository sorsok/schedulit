const mongoose = require('mongoose');

module.exports.initializeDB = async () => {
  await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
  console.log('connected to mongo');

};

module.exports.mongoose = mongoose;