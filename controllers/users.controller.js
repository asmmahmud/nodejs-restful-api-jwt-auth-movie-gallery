const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
var userService = require('../services/user.service');

exports.register = (req, res, next) => {
  const newUser = req.body;
  userService
    .create(newUser)
    .then(createdUser => {
      res.json(createdUser.getUserData());
    })
    .catch(err => {
      return next(err);
    });
};

exports.update = (req, res, next) => {
  console.log('req.auth_user.email: ', req.auth_user.email);
  console.log('update post body: ', req.body);
  userService
    .update(req.auth_user, req.params, req.body)
    .then(updatedUser => {
      res.json(updatedUser.getUserData());
    })
    .catch(err => {
      console.log('update: ', err.message);
      return next(err);
    });
};

exports.authenticate = (req, res, next) => {
  userService
    .createauthenticate(req.body)
    .then(function (user) {
      if (user && user.access_token) {
        // authentication successful
        res.json(user);
      } else if (user) {
        const error = new APIError(
          'Email or Password was not correct.',
          httpStatus.UNAUTHORIZED,
          true
        );
        return next(error);
      } else {
        const error = new APIError('User was not found', httpStatus.NOT_FOUND, true);
        return next(error);
      }
    })
    .catch(function (err) {
      const error = new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true);
      return next(error);
    });
};

exports.getAll = (req, res, next) => {
  userService
    .getAll()
    .then(users => res.json(users))
    .catch(function (err) {
      const error = new APIError(err.message, httpStatus.INTERNAL_SERVER_ERROR, true);
      return next(error);
    });
};

exports._delete = (req, res, next) => {
  userService
    ._delete(req.params)
    .then(user => res.sendStatus(httpStatus.OK))
    .catch(err => next(err));
};
