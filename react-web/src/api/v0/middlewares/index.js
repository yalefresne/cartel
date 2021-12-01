const { db, status } = require("../../../db");
const expressJwt = require("express-jwt");
const { getTokenFromHeaders } = require("../../../validators");

const auth = {
  required: expressJwt({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
    userProperty: "payload",
    getToken: getTokenFromHeaders,
  }),
  optional: expressJwt({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
    userProperty: "payload",
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  }),
};

function isAuthenticated(req, res, next) {
  if (process.env.ENV === "test") {
    next();
  } else {
    auth.required(req, res, next);
  }
}

function isDbReady(req, res, next) {
  if (db.readyState === status.connected) {
    next();
  } else if (db.readyState === status.connecting) {
    res.status(503);
    res.json({
      error: "Initializing connection to the database",
    });
  } else if (
    db.readyState === status.disconnected ||
    connectionStatus === status.disconnecting
  ) {
    res.status(500);
    res.json({
      error: "Internal server error: database not connected",
    });
  }
}

module.exports = {
  isAuthenticated,
  isDbReady,
  auth,
};
