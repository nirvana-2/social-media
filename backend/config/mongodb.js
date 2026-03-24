const mongoose = require('mongoose');

const connectMongo = async () => {
  try {
    const uri = process.env.MONGO_URL;
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    setTimeout(connectMongo, 5000);
  }
};

module.exports = connectMongo;