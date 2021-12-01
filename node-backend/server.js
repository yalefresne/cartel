require('dotenv').config({path: '.env.dev'});
const db = require('./src/db');
const app = require('./app');
const port = process.env.PORT;
db.connect().then(() => {
  const server = app.listen(port, () => console.log("Listening on port " + port));
});


