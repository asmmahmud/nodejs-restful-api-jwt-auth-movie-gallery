/* eslint-disable */
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
var config = require('../config/index');
const User = require('../models/User');
const APIError = require('../helpers/APIError');
const salt = bcrypt.genSaltSync(10);

exports.create = userParam => {
  return User.findOne({ email: userParam.email }).then(user => {
    if (user) {
      throw new APIError('Email has already been taken', httpStatus.UNAUTHORIZED, true);
    } else {
      userParam.password = bcrypt.hashSync(userParam.password, salt);
      return new User(userParam).save();
    }
  });
};
exports.update = (authUser, { _id }, { first_name, last_name, password }) => {
  return User.findById(_id).then(user => {
    if (user) {
      if (authUser.role === 'admin' || authUser.email === user.email) {
        user.first_name = first_name;
        user.last_name = last_name;
        if (password) {
          user.password = bcrypt.hashSync(password, salt);
        }
        return user.save();
      }
      throw new APIError('not authorized to update!', httpStatus.UNAUTHORIZED, true);
    }
    throw new APIError('No such user exists!', httpStatus.NOT_FOUND, true);
  });
};

exports.createauthenticate = function({ email, password }) {
  return User.findOne({ email: email }).then(user => {
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        // authentication successful
        return {
          auth_user: user.getUserData(),
          access_token: jwt.sign({ sub: user._id }, config.jwtSecret, {
            expiresIn: config.jwtExpiresIn,
          }),
        };
      }
      return {
        token: null,
      };
    }
    return null;
  });
};

exports.getAll = function() {
  return User.find()
    .select({ first_name: 1, last_name: 1, email: 1, role: 1, createdAt: 1 })
    .sort('-createdAt');
};

exports._delete = ({ _id }) => {
  return User.get(_id).then(user => {
    return user.remove();
  });
};
