const mongoose = require('mongoose');
const actions = require('./actions');

const status = {
  "disconnected": 0,
  "connected": 1,
  "connecting": 2,
  "disconnecting": 3
}

Object.freeze(status);

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', function() {
  console.error("MongoDB connection error");
});

function connect() {
  return mongoose.connect(process.env.mongoURI, {useNewUrlParser: true, useUnifiedTopology: true});
}

module.exports = { db, connect, status, actions };