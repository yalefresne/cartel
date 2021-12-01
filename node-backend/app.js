const express = require('express');
const v0 = require('./src/api/v0/routes');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());

app.use(passport.session());

require('./src/config/passport')();

app.use('/api/v0', v0);

module.exports = app;