const express = require('express');
const router = express.Router();
const { checkToken, extractAuthUser, decodeTheToken } = require('../helpers/auth.user');
const validate = require('express-validation');
const paramValidation = require('../config/param-validation');
const FilmsController = require('../controllers/films.controller');

router
  .route('/')
  /** GET /api/films - Get list of films */
  .get(decodeTheToken, extractAuthUser, FilmsController.list)

  /** POST /api/films - Create new film */
  .post(checkToken, extractAuthUser, validate(paramValidation.createFilm), FilmsController.create);

router
  .route('/:filmId')
  /** GET /api/films/:filmId - Get film */
  .get(decodeTheToken, extractAuthUser, validate(paramValidation.filmDetail), FilmsController.get)

  /** DELETE /api/films/:filmId - Delete film */
  .delete(
    checkToken,
    extractAuthUser,
    validate(paramValidation.filmDetail),
    FilmsController._delete
  );

router
  .route('/update-watch-status')
  .post(
    checkToken,
    extractAuthUser,
    validate(paramValidation.addUpdateAnWatchEntry),
    FilmsController.updatePersonalNoteWatchStatus
  );
module.exports = router;
