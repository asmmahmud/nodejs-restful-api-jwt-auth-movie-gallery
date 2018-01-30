const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');

const Schema = mongoose.Schema;

const FilmSchema = new Schema({
  imdb_id: {
    type: String,
    required: true
  },
  imdb_id_padding: String,
  imdb_url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  release_year: {
    type: Number,
    required: true
  },
  runtime: { type: Number, required: true },
  language: { type: String, required: true },
  top_250: { type: Number, default: 0 },
  imdb_rating: Number,
  votes: { type: Number, default: 0 },
  metacritic_rating: Number,
  rottentomatoes_score: Number,
  director: {
    type: String,
    required: true
  },
  casts: { type: String, required: true },
  genres: { type: String, required: true },
  poster: String,
  storyline: String,
  plot: String,
  watch_list: [
    {
      user_id: Schema.Types.ObjectId,
      personal_note: String
    }
  ],
  created_at: {
    type: Date,
    default: Date.now
  }
});

FilmSchema.methods.getAllDataByUserId = function (userId = null) {
  const allData = {
    id: this._id,
    _id: this._id,
    imdb_id: this.imdb_id,
    imdb_id_padding: this.imdb_id_padding,
    imdb_url: this.imdb_url,
    title: this.title,
    release_year: this.release_year,
    runtime: this.runtime,
    language: this.language,
    top_250: this.top_250,
    imdb_rating: this.imdb_rating,
    votes: this.votes,
    metacritic_rating: this.metacritic_rating,
    rottentomatoes_score: this.rottentomatoes_score,
    director: this.director,
    casts: this.casts,
    genres: this.genres,
    poster: this.poster,
    storyline: this.storyline,
    plot: this.plot,
    authUserWatched: false,
    personalNote: ''
  };

  if (userId && this.watch_list && this.watch_list.length) {
    const watchEntry = this.watch_list.find(w => {
      // console.log(w.user_id, userId, w.user_id.equals(userId));
      return w.user_id.equals(userId);
    });
    // console.log('found watch list: ', watchEntry);
    if (watchEntry) {
      allData.authUserWatched = true;
      allData.personalNote = watchEntry.personal_note;
    }
  }
  return allData;
};
/**
 * Statics
 */
FilmSchema.statics = {
  /**
   * Get a single film by id
   * @param {ObjectId} id - The objectId of the film.
   * @returns {Promise<Film, APIError>}
   */
  get (id) {
    return this.findById(id)
      .exec()
      .then(film => {
        if (film) {
          return film;
        }
        throw new APIError('No such film exists!', httpStatus.NOT_FOUND, true);
      });
  },

  /**
   * List of films in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of films to be skipped.
   * @param {number} limit - Limit number of films to be returned.
   * @returns {Promise<User[]>}
   */
  list ({ sort = 'release_year', sorder = -1, skip = 0, limit = 500 } = {}) {
    return this.find()
      .sort({ [sort]: sorder })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};

module.exports = mongoose.model('Film', FilmSchema);
