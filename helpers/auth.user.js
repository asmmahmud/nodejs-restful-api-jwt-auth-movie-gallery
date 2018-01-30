const expressJwt = require('express-jwt');
const httpStatus = require('http-status');
const jwtDecode = require('jwt-decode');
const APIError = require('./APIError');
const config = require('../config/index');
const User = require('../models/User');

function extractToken (req) {
  // console.log(req.headers.authorization);
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
}
exports.decodeTheToken = (req, res, next) => {
  const token = extractToken(req);
  if (token) {
    req.token_payload = jwtDecode(token);
  }
  next();
};

exports.checkToken = expressJwt({
  secret: config.jwtSecret,
  requestProperty: 'token_payload',
  getToken: extractToken
});

exports.extractAuthUser = function (req, res, next) {
  if (req.token_payload && req.token_payload.sub) {
    // console.log('token_payload: ', req.token_payload);
    const userId = req.token_payload.sub;
    User.get(userId)
      .then(user => {
        req.auth_user = user;
        // console.log('Auth User: ', user.first_name + ' ' + user.last_name);
        next();
      })
      .catch(err => next(err));
  } else {
    next();
  }
};

exports.accessControl = function (req, res, next) {
  if (!(req.auth_user && req.auth_user.role === 'admin')) {
    const error = new APIError(
      'You are not authorized to access this resource',
      httpStatus.UNAUTHORIZED,
      true
    );
    return next(error);
  } else {
    return next();
  }
};
