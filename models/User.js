const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const Schema = mongoose.Schema;

const UserScema = new Schema({
  email: {
    type: String,
    required: true,
    match: [
      /[\w]+?@[\w]+?\.[a-z]{2,4}/,
      'The value of path {PATH} ({VALUE}) is not a valid email address.'
    ]
  },
  password: {
    type: String
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  thumb_path: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
/**
 * Instance Methods
 */
UserScema.methods.getUserData = function () {
  const data = {
    id: this._id,
    first_name: this.first_name,
    last_name: this.last_name,
    email: this.email,
    thumb_path: this.thumb_path,
    role: this.role,
    created_at: this.createdAt
  };
  return data;
};
/**
 * Statics
 */
UserScema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get (id) {
    return this.findById(id)
      .select({ first_name: 1, last_name: 1, email: 1, role: 1, createdAt: 1 })
      .exec()
      .then(user => {
        if (user) {
          return user;
        }
        throw new APIError('No such user exists!', httpStatus.NOT_FOUND, true);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list ({ skip = 0, limit = 500 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};
module.exports = mongoose.model('user', UserScema);
