const jwt = require("jsonwebtoken");
const HttpError = require("../helpers/HttpError");
const User = require("../models/User");
const { ACCESS_TOKEN_KEY } = process.env;

async function authenticate(req, res, next) {
  try {
    const token = getTokenFromHeaders(req.headers);
    if (!token) {
      return next(HttpError(401, "Please provide token"));
    }

    const decodedToken = jwt.verify(token, ACCESS_TOKEN_KEY);
    const user = await User.findById(decodedToken.id);

    if (!user || !user.accessToken) {
      return next(HttpError(401, "User not authorized"));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(HttpError(401, "Invalid or expired token"));
  }
}

function getTokenFromHeaders(headers) {
  const authorizationHeader = headers.authorization;
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return null;
  }
  return authorizationHeader.split(" ")[1];
}

module.exports = authenticate;
