const express = require('express');
const v0 = require('./src/api/v0/routes');

const app = express();

app.use(express.json());

app.use('/api/v0', v0);

module.exports = app;