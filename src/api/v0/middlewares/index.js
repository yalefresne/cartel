const { db, status } = require('../../../db');

function isAuthenticated(req, res, next) {
  const user = req.body.userId;
  if (user !== undefined) {
    next();
  } else {
    res.status(401);
    res.json({
      "error": "unauthorized request"
    });
  }
}

function isDbReady(req, res, next) {
  if (db.readyState === status.connected) {
    next()
  } else if (db.readyState === status.connecting) {
    res.status(503);
    res.json({
      error: "Initializing connection to the database"
    });
  } else if (db.readyState === status.disconnected || connectionStatus === status.disconnecting) {
    res.status(500);
    res.json({
      error: "Internal server error: database not connected"
    });
  }
}

module.exports = {
  isAuthenticated,
  isDbReady
}