console.log('before requiring mongoose');

const mongoose = require('mongoose');

console.log('before requiring dotenv');

require('dotenv').config();

const connectDB = async () => {
  mongoose.set('debug', true);
  const db = mongoose.connection;
  const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@cluster0.vhg7m.mongodb.net/${process.env.DB_NAME}`;
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  db.on('error', (e) => {
    console.error(new Error(`${e}`));
  });
  db.once('open', () => {
    console.log(`Connected to DB : liveChat`);
  });
  db.on('reconnectFailed', () => {
    console.error(new Error('Reconnect Failed'));
  });
  db.on('disconnected', () => {
    console.error(new Error('Unable to connect to DB'));
  });
};

module.exports = connectDB;
