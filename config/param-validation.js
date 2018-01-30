const Joi = require('joi');

module.exports = {
  createFilm: {
    body: {
      imdb_id: Joi.string()
        .trim()
        .required()
        .label('IMDB ID')
        .error(() => 'IMDB ID is required.'),
      imdb_url: Joi.string()
        .trim()
        .uri({
          scheme: [/https?/]
        })
        .required()
        .label('IMDB url')
        .error(() => 'IMDB url is required.'),
      title: Joi.string()
        .trim()
        .required()
        .label('Film Title')
        .error(() => 'Film Title is required.'),
      release_year: Joi.number()
        .integer()
        .min(1915)
        .max(2020)
        .required()
        .label('Release Year')
        .error(() => 'Release Year is required.'),
      runtime: Joi.number()
        .integer()
        .min(60)
        .max(250)
        .required()
        .label('Runtime')
        .error(() => 'Runtime is required.'),
      language: Joi.string()
        .trim()
        .required()
        .label('Language')
        .error(() => 'Language is required.'),
      imdb_rating: Joi.number()
        .precision(2)
        .min(0)
        .max(10)
        .label('IMDB Rating'),
      metacritic_rating: Joi.number()
        .integer()
        .min(0)
        .max(100)
        .label('Metacritic Rating'),
      rottentomatoes_score: Joi.number()
        .integer()
        .min(0)
        .max(100)
        .label('Rottentomatoes Score'),
      director: Joi.string()
        .trim()
        .required()
        .label('Director')
        .error(() => 'Director is required.'),
      casts: Joi.string()
        .trim()
        .required()
        .label('Casts')
        .error(() => 'Casts is required.'),
      genres: Joi.string()
        .trim()
        .required()
        .label('Genres')
        .error(() => 'Genres is required.'),
      poster: Joi.string()
        .trim()
        .uri({
          scheme: [/https?/]
        })
        .label('Film Poster'),
      storyline: Joi.string().label('Film Storyline'),
      plot: Joi.string().label('Film Plot')
    }
  },
  // POST /api/users
  createUser: {
    body: {
      first_name: Joi.string()
        .trim()
        .required()
        .label('First Name')
        .error(() => 'First Name is required.'),
      last_name: Joi.string()
        .trim()
        .required()
        .label('Last Name')
        .error(() => 'Last Name is required.'),
      password: Joi.string()
        .trim()
        .regex(/.{4,15}/)
        .required()
        .label('Password')
        .error(() => 'Password length has to be between 4 to 15 characters.'),
      email: Joi.string()
        .trim()
        .email()
        .required()
        .label('Email')
        .error(() => 'Valid email is required.'),
      thumb_path: Joi.any().label('Thumbnail Image')
    }
  },
  filmDetail: {
    params: {
      filmId: Joi.string()
        .hex()
        .required()
    }
  },
  // UPDATE /api/users/:_id
  updateUser: {
    body: Joi.object().keys({
      first_name: Joi.string()
        .trim()
        .required()
        .label('First Name')
        .error(() => 'First Name is required.'),
      last_name: Joi.string()
        .trim()
        .required()
        .label('Last Name')
        .error(() => 'Last Name is required.'),
      password: Joi.string()
        .trim()
        .regex(/.{4,15}/)
        .allow('', null)
        .label('Password')
        .error(() => 'Password length has to be between 4 to 15 characters.'),
      thumb_path: Joi.any().label('Thumbnail Image')
    }),
    params: {
      _id: Joi.string()
        .hex()
        .required()
    }
  },

  // POST /api/users/authenticate
  login: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required()
    }
  },
  // DELETE /api/users/:_id
  _delete: {
    params: {
      _id: Joi.string()
        .hex()
        .required()
    }
  },
  addUpdateAnWatchEntry: {
    body: {
      film_id: Joi.string()
        .trim()
        .required()
        .label('Film Id'),
      personal_note: Joi.string()
        .trim()
        .allow('', null)
    }
  }
};
