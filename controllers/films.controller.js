const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const Film = require('../models/Film');

exports.get = function (req, res, next) {
  const userId = req.auth_user ? req.auth_user._id : null;
  return Film.get(req.params.filmId)
    .then(film => {
      res.json(film.getAllDataByUserId(userId));
    })
    .catch(err => next(err));
};

/**
 * Create a new film
 * @returns {Film}
 */

exports.create = function (req, res, next) {
  const userId = req.auth_user ? req.auth_user._id : null;
  return Film.findOne({ imdb_id: req.body.imdb_id })
    .then(user => {
      if (user) {
        throw new APIError('Film already exists', httpStatus.CONFLICT, true);
      } else {
        return new Film(req.body).save();
      }
    })
    .then(savedFilm => res.json(savedFilm.getAllDataByUserId(userId)))
    .catch(err => next(err));
};

/**
 * Get film list.
 * @property {number} req.query.skip - Number of films to be skipped.
 * @property {number} req.query.limit - Limit number of films to be returned.
 * @returns {Product[]}
 */
exports.list = function (req, res, next) {
  // console.log(req.query);
  const { sort = 'release_year', sorder = -1, limit = 500, skip = 0 } = req.query;
  const userId = req.auth_user ? req.auth_user._id : null;

  Film.list({ sort, sorder, limit, skip })
    .then(films => {
      return res.json(films.map(film => film.getAllDataByUserId(userId)));
    })
    .catch(e => next(e));
};

exports.updatePersonalNoteWatchStatus = (req, res, next) => {
  const dataToUpdate = {
    user_id: req.auth_user._id,
    personal_note: ''
  };
  if (req.body.personal_note) {
    dataToUpdate.personal_note = req.body.personal_note;
  }
  Film.findById(req.body.film_id)
    .then(film => {
      if (film) {
        if (film.watch_list && film.watch_list.length) {
          const foundIndex = film.watch_list.findIndex(w => w.user_id.equals(req.auth_user._id));
          if (foundIndex !== -1 && dataToUpdate.personal_note) {
            film.watch_list[foundIndex].personal_note = dataToUpdate.personal_note;
          } else if (foundIndex === -1) {
            film.watch_list.push(dataToUpdate);
          }
        } else {
          film.watch_list = [dataToUpdate];
        }
        return film.save();
      } else {
        throw new APIError('Film does not exist', httpStatus.NOT_FOUND, true);
      }
    })
    .then(film => {
      res.json(film.getAllDataByUserId(req.auth_user._id));
    })
    .catch(e => next(e));
};

/**
 * Delete a film.
 */
exports._delete = (req, res, next) => {
  Film.get(req.params.filmId)
    .then(film => film.remove())
    .then(film => res.sendStatus(httpStatus.OK))
    .catch(err => next(err));
};
